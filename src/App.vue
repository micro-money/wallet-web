<template>
  <div
    id="app"
    :class="{ dark: isDark }">
    <el-container
      :class="['app-wrapper', { landing: $route.path === '/', account: parentPath === '/account', dark: isDark }]">
      <el-header
        v-if="$route.path === '/'"
        class="header">
        <landing-header
          :user="user"
          :logout="logout"/>
      </el-header>

      <template v-else-if="parentPath === '/account'">
        <div
          v-if="user"
          class="header-notice-container">
          <confirm-email-notice />
        </div>

        <el-header :class="{ header: true, small: $isTabletView }">
          <account-header/>
        </el-header>
      </template>

      <el-main
        id="main-view"
        class="view-container">
        <router-view/>
      </el-main>

      <el-footer
        v-if="parentPath === '/account' && !$isTabletView"
        class="footer">
        <el-container
          class="footer-content"
          direction="horizontal">
          <el-col :span="12">
            <img
              src="./assets/images/logo-light.svg"
              class="logo">
          </el-col>

          <el-col
            :span="12"
            style="text-align: right; padding: 27px 0;">
            <span class="copy">
              &copy; Platinum 2018
            </span>
          </el-col>
        </el-container>
      </el-footer>

      <auth :fullscreen="$isMobileView"/>
      <send :fullscreen="$isMobileView"/>
      <new-asset :fullscreen="$isMobileView"/>
      <terms/>
      <verify/>

      <show-password
        :fullscreen="$isMobileView"
        :show-password="show.password"
        @close="show.password = false"/>

      <enter-password
        :fullscreen="$isMobileView"
        :show-check-password="show.enterPassword"
        @close="show.enterPassword = false"/>

      <add-description
        :fullscreen="$isMobileView"
        :show-add-description="show.addDescription"
        :id.sync="newDescriptionId"
        @close="show.addDescription = false"/>

      <qr-code
        :fullscreen="$isMobileView"
        :show-qr-code="show.qrCode"
        @open="show.qrCode = true"
        @close="show.qrCode = false"/>

      <export-modal
        :fullscreen="$isMobileView"
        :show-export="show.export"
        @open="show.export = true"
        @close="show.export = false"/>
    </el-container>
  </div>
</template>

<script>
/* Headers */
import landingHeader from '@/components/landing-header'
import accountHeader from '@/components/account-header'

/* Modals */
import auth from '@/components/modals/auth'
import showPassword from '@/components/modals/show-password'
import verify from '@/components/modals/auth/verify'
import newAsset from '@/components/modals/new-asset'
import enterPassword from '@/components/modals/enter-password'
import addDescription from '@/components/modals/add-description'
import send from '@/components/modals/send'
import qrCode from '@/components/modals/qr-code'
import exportModal from '@/components/modals/export'
import terms from '@/components/modals/terms'
import confirmEmailNotice from '@/components/ui/confirm-email-notice'

/* Other */
import { mapGetters, mapActions } from 'vuex'
import { _debounce, _get, _isEmpty } from '@/utils/lodash'
import { VueAuth } from '@/api/rest'
import screenSize from '@/mixins/screen-size'

export default {
  components: {
    landingHeader,
    accountHeader,
    auth,
    newAsset,
    enterPassword,
    addDescription,
    send,
    qrCode,
    exportModal,
    terms,
    verify,
    showPassword,
    confirmEmailNotice
  },
  mixins: [screenSize],
  data () {
    return {
      newDescriptionId: null,
      show: {
        password: false,
        enterPassword: false,
        addDescription: false,
        qrCode: false,
        export: false,
        verify: false
      },
      timer: null
    }
  },
  computed: {
    ...mapGetters({
      currentWallet: 'wallet/current',
      message: 'status/message',
      user: 'auth/user',
      assets: 'wallet/assets',
      isDark: 'auth/isDark',
      isConnected: 'socket/isConnected',
      isSubscribed: 'socket/isSubscribed',
      errors: 'status/errors',
      widgetMessage: 'widget/message'
    }),
    parentPath () {
      return `/${this.$route.path.split('/')[1]}`
    },
    path () {
      return '/account/wallet'
    }
  },
  watch: {
    message ({ message, type }) {
      this.$message({ message: message, type: type })
    },
    $route (newVal, oldVal) {
      if (newVal.path !== oldVal.path) this.checkRoute()
    },
    assets () {
      this.checkRoute()
    },
    currentWallet (newVal) {
      if (this.user && this.user.secret) this.show.password = true
    },
    user (newVal) {
      this.checkRoute()

      if (newVal) {
        this.resetTimer()
        this.addEventListeners()

        this.getWalletAndCheck()
        this.socketConnect()
        this.startSession()
      } else {
        this.removeEventListeners()
        this.resetTimer()

        this.socketDisconnect()
        this.closeSession()

        setTimeout(() => { for (const key in this.show) this.show[key] = false }, 0)
      }
    },
    isConnected (newVal) {
      if (newVal) this.socketSubscribe({})
    },
    isSubscribed (newVal) {
      if (newVal) this.socketGetEvent({})
    },
    errors (newVal) {
      if (newVal) {
        for (const index in newVal) {
          if (newVal[index].param === 'password') this.setPassword(null)
        }
      }
    },
    emailIsFocused (newVal) {
      if (!newVal) this.$refs['form-email-send'].clearValidate()
    }
  },
  async created () {
    let activeSession = await this.openTab()

    if (activeSession) {
      this.getUser()

      if (!VueAuth.isAuthenticated()) this.checkRoute()
    }

    this.$eventHub.$on('popup:password:enter', () => { this.show.enterPassword = true })
    this.$eventHub.$on('popup:description:add', id => {
      this.newDescriptionId = id
      this.show.addDescription = true
    })

    window.addEventListener('unload', this.closeTab)
    window.addEventListener('message', this.widgetMessageReceive)
  },
  destroyed () {
    window.removeEventListener('unload', this.closeTab)
    window.removeEventListener('message', this.widgetMessageReceive)
  },
  async mounted () {
    const verify = _get(this.$route, 'query.verify', null)
    const token = _get(this.$route, 'query.token', null)

    if (verify) {
      this.$eventHub.$emit('popup:verify', verify)
      if (VueAuth.isAuthenticated()) VueAuth.logout()
      return false
    }

    if (token) {
      await this.signinByToken(token)
      if (!VueAuth.isAuthenticated()) this.$router.push({ path: '/' })
    }
  },
  methods: {
    ...mapActions({
      getUser: 'auth/getUser',
      logout: 'auth/logout',
      signinByToken: 'auth/signInByDisposableToken',
      changeTheme: 'auth/changeTheme',
      getWallet: 'wallet/get',
      socketConnect: 'socket/connect',
      socketDisconnect: 'socket/disconnect',
      socketSubscribe: 'socket/subscribe',
      socketGetEvent: 'socket/getEvent',
      setPassword: 'wallet/setPassword',
      widgetMessageReceive: 'widget/messageReceive',
      widgetMessageSend: 'widget/messageSend'
    }),
    finishTheSession () {
      this.$eventHub.$emit('popup:auth', 'expired')
      this.logout()
    },
    resetTimer () {
      if (this.timer) clearTimeout(this.timer)

      if (this.user) this.timer = setTimeout(this.finishTheSession, 900000)
    },
    debounceReset: _debounce(function () { this.resetTimer() }, 1000),
    checkToken (e) {
      if (e.key === `${VueAuth.storage.namespace}.${VueAuth.tokenName}` && e.newValue === null) {
        this.logout()
      }
    },
    closeTab (e) {
      localStorage.tabs = !localStorage.tabs || isNaN(localStorage.tabs) || localStorage.tabs < 1 ? 0 : --localStorage.tabs
    },
    openTab () {
      localStorage.tabs = !localStorage.tabs || isNaN(localStorage.tabs) || localStorage.tabs <= 0 ? 1 : ++localStorage.tabs

      if (localStorage.tabs <= 1 && sessionStorage.activeSession !== 'true') {
        if (VueAuth.isAuthenticated()) {
          VueAuth.logout()
          this.$router.push({ path: '/' })
        }
        return false
      }
      return true
    },
    startSession () {
      sessionStorage.activeSession = true
      localStorage.tabs = !localStorage.tabs || isNaN(localStorage.tabs) || localStorage.tabs <= 0 ? 1 : localStorage.tabs
    },
    closeSession () {
      sessionStorage.removeItem('activeSession')
    },
    addEventListeners () {
      window.addEventListener('keypress', this.debounceReset)
      window.addEventListener('mousemove', this.debounceReset)
      window.addEventListener('mousedown', this.debounceReset)
      window.addEventListener('click', this.debounceReset)
      window.addEventListener('scroll', this.debounceReset)
      window.addEventListener('storage', this.checkToken)
    },
    removeEventListeners () {
      window.removeEventListener('keypress', this.debounceReset)
      window.removeEventListener('mousemove', this.debounceReset)
      window.removeEventListener('mousedown', this.debounceReset)
      window.removeEventListener('click', this.debounceReset)
      window.removeEventListener('scroll', this.debounceReset)
      window.removeEventListener('storage', this.checkToken)
    },
    checkRoute () {
      if (!VueAuth.isAuthenticated() && this.$route.path !== '/') this.$router.push({ path: '/' })
      else if (VueAuth.isAuthenticated() && this.$route.fullPath === this.path && this.assets && this.assets[0]) this.$router.push(`${this.path}/asset/${this.assets[0].id}`)
      else if (VueAuth.isAuthenticated() && !this.$route.path.includes('/settings') && this.$route.path !== '/account/wallet' && this.$route.path !== '/account/wallet/transactions' && !this.$route.params.id) this.$router.push({ path: '/account/wallet' })
    },
    async getWalletAndCheck () {
      let assetList
      let balanceErrors = {}

      await this.getWallet()

      assetList = _get(this.currentWallet, 'assetList', null)

      if (assetList) {
        balanceErrors = assetList.reduce(function (errors, asset) {
          if (asset.balance === null && asset.symbol !== 'BTC') errors[asset.symbol] = true

          return errors
        }, {})

        if (!_isEmpty(balanceErrors)) {
          this.$message({ message: Object.keys(balanceErrors).join(', ') + ' network is not available now', type: 'warning' })
        }
      }
    }
  }
}
</script>

<style lang="scss">
@import "./assets/styles";

.header {
  z-index: 2;
  padding: 0 8.3%;
  height: 61px !important;

  &.small {
    padding: 0 20px;
  }

  .header-content {
    height: 60px;

    .menu-button {
      color: #ffffff;
      font-size: 16px;
      font-weight: 500;
      letter-spacing: 0.3px;
      margin: 8px 0 8px 8px;

      &:hover {
        opacity: .6;
      }

      &.name {
        padding-right: 20px;
      }

      &.lang {
        padding-left: 20px;

        .lang-icon {
          border-radius: 50%;
          margin-top: -2px;
          margin-right: 2px;
          vertical-align: middle;
        }
      }

      .material-icons {
        margin-left: -5px;
      }
    }

    .material-icons {
      vertical-align: middle;
    }

    .right-arrow {
      margin-top: -3px;
    }

    .user-controls {
      text-align: right;

      .sunny {
        margin-right: 40px;
        cursor: pointer;
      }
    }
  }
  @media (min-width: 990px) and (max-width: 1381px) {
    padding: 0 2%;
  }
}

.dropdown-menu {
  @media (min-width: 991px) {
    margin-top: -20px !important;
  }

  @media (max-width: 990px) {
    margin-top: 5px !important;
  }
}

.logo {
  margin-left: 20px;
  margin-right: 20px;
  cursor: pointer;
}

.view-container {
  background: transparent;

  .content {

    h2 {
      font-size: 24px;
      font-weight: 500;
    }
  }
}

.footer {
  padding: 0 8.3%;

  .footer-content {
    .logo {
      padding: 23px 0;
    }

    a {
      padding: 25px 0;
      text-decoration: none;
    }

    a, .copy {
      color: $--color-white;
      font-weight: 400;
    }

    .copy {
      color: $--color-gray-light;
      font-weight: 400;
      margin-left: 40px;
    }
  }
}

.header-notice-container {
  display: grid;
}
</style>
