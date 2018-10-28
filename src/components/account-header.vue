<template>
  <el-container
    v-if="!$isTabletView"
    class="header-content"
    direction="horizontal">
    <el-col
      :span="6">
      <img
        v-if="isDark"
        src="./../assets/images/logo-light.svg"
        class="logo"
        @click="$router.push('/')">

      <img
        v-else
        src="./../assets/images/logo-dark.svg"
        class="logo"
        @click="$router.push('/')">
    </el-col>

    <el-col
      v-if="user"
      :span="18"
      class="user-controls">
      <i
        class="material-icons md-dark md-24 sunny"
        @click="changeTheme(!isDark)">
        wb_sunny
      </i>

      <div
        class="balance">
        <span class="title">Total Balance:</span>
        {{ balance }}&nbsp;USD
        <span>&nbsp;&nbsp;&nbsp;</span>
      </div>

      <el-dropdown trigger="click">
        <el-button
          class="menu-button name"
          type="text">
          {{ userName }}&nbsp;&nbsp;<i class="material-icons md-24">arrow_drop_down</i>
        </el-button>

        <el-dropdown-menu
          slot="dropdown"
          :class="{ 'dropdown-menu': true, dark: isDark }">
          <el-dropdown-item
            @click.native="logout">Logout</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>
  </el-container>

  <el-container
    v-else
    class="header-content"
    direction="horizontal">
    <el-col
      :sm="12"
      :md="16"
      :lg="16"
      :xl="16"
      class="balance small">
      <span class="title hidden-xs-and-down">Balance:</span>

      <span class="usd">{{ balance }}&nbsp;USD</span>
    </el-col>

    <el-col
      :sm="12"
      :md="8"
      :lg="8"
      :xl="8"
      class="hidden-md-and-up user-controls">
      <i
        class="material-icons md-dark md-24 sunny"
        @click="changeTheme(!isDark)">
        wb_sunny
      </i>

      <i
        class="material-icons md-dark md-24 menu"
        @click="showMobileMenu = true">
        menu
      </i>
      <el-dialog
        :visible.sync="showMobileMenu"
        :fullscreen="true"
        :modal="false"
        :class="{ dialog: true, dark: isDark, mobileMenu: true }"
        center>
        <div
          slot="title"
          class="logo">
          <img
            v-if="isDark"
            src="../assets/images/logo-light.svg"
            class="logo"
            @click="$router.push('/')">

          <img
            v-else
            src="../assets/images/logo-dark.svg"
            class="logo"
            @click="$router.push('/')">
        </div>

        <div
          v-if="user"
          class="content">
          <div class="balance">
            {{ balance }}&nbsp;USD

            <span class="amm-balance">
              <span class="separator">&middot;</span>&nbsp;

              <img
                v-if="!isDark"
                src="./../assets/images/amm.svg"
                class="amm">
              <img
                v-else
                src="./../assets/images/amm-white.svg"
                class="amm">
              &nbsp;<span>0</span>&nbsp;AMM
            </span>
          </div>

          <span class="email">{{ user.email }}</span>
        </div>

        <span
          slot="footer"
          class="dialog-footer">
          <el-button
            type="text"
            @click.native="logout">Logout</el-button>
        </span>
      </el-dialog>
    </el-col>
  </el-container>
</template>

<script>
import variables from '@/assets/partials/_variables.scss'
import { _get } from '@/utils/lodash'
import { mapGetters, mapActions } from 'vuex'
import screenSize from '@/mixins/screen-size'

export default {
  mixins: [screenSize],
  data () {
    return {
      variables,
      menu: [
        { path: '/account/wallet', title: 'Wallet', disabled: false },
        { path: '/account/portfolio', title: 'Portfolio', disabled: true },
        { path: '/account/coin-browser', title: 'Coin Browser', disabled: true },
        { path: '/account/exchange', title: 'Exchange', disabled: true },
        { path: '/account/borrow', title: 'Borrow', disabled: true },
        { path: '/account/marketplace', title: 'Marketplace', disabled: true },
        { path: '/account/settings', title: 'Settings', disabled: false }
      ],
      showMobileMenu: false
    }
  },
  computed: {
    ...mapGetters({
      currentWallet: 'wallet/current',
      user: 'auth/user',
      isDark: 'auth/isDark'
    }),
    balance () {
      const balance = parseFloat(_get(this.currentWallet, 'balance', 0.00))

      return isNaN(balance) ? 0.00 : balance.toFixed(2)
    },
    userName () {
      return _get(this.user, 'displayName', null) || _get(this.user, 'email', null) || _get(this.user, 'givenName', null)
    }
  },
  methods: {
    ...mapActions({
      changeTheme: 'auth/changeTheme',
      logout: 'auth/logout'
    })
  }
}
</script>

<style lang="scss">
@import "./../assets/partials/variables";

.app-wrapper {

  &.account {

    .header {
      background: $--color-white;
      border-bottom: solid 1px #e3e3e3;

      &.small {
        .header-content {
          margin-top: 20px;
        }
      }

      .user-controls {
        text-align: right;
        padding-right: 0;

        > i {
          cursor: pointer;
        }

        @media (max-width: 991px) {
          > i {
            cursor: pointer;
            margin-left: 22px;
            margin-right: 0;
          }
          i.menu {
            margin-left: 10px
          }

          .lang {
            margin-left: 22px;

            button {
              padding: 0;

              span {
                vertical-align: middle;
                display: inline-block;
                padding-top: 5px;

                img {
                  float: left
                }

                .material-icons {
                  color: $--color-gray-light;
                }
              }
            }
          }
        }
      }

      .header-content {

        .menu {

          li {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0.3px;
            padding: 0 20px;

            @media (max-width: 1366px) {
              font-size: 16px;
              padding: 0 14px;
            }

            @media (min-width: 990px) and (max-width: 1005px) {
              font-size: 15px;
            }

            &:hover, &.is-active {
              background-color: $--background-color;
            }

            &.is-active {
              font-weight: 500;
            }

            &.is-disabled {
              opacity: .4;
            }
          }
        }

        .balance {
          display: inline-block;
          text-align: right;
          margin: auto 0;
          font-weight: 500;

          .usd {
            margin-left: 5px;
          }

          .amm-balance {
            margin-left: 10px;
          }

          @media (max-width: 600px) {
            font-size: 14px;

            .usd {
              display: block;
              margin-left: 0;
            }
            .amm-balance {
              margin-left: 0;
            }
          }

          @media (min-width: 600px) and (max-width: 1281px) {
            line-height: 20px;
            font-size: 15px;

            .title {
              font-size: 14px;
            }
          }

          &.small {
            text-align: left;
            margin: 0;
          }

          .title {
            color: $--color-gray-light;
          }

          .amm-balance {
            white-space: nowrap;
          }

          .separator {
            font-size: 40px;
            vertical-align: middle;
          }

          .amm {
            width: 14px;
            height: 13px;
          }
        }

        @media (max-width: 600px) {
          margin-top: 0 !important;

          .balance {
            padding-top: 15px;
          }
          .user-controls {
            padding-top: 15px;
          }
        }
      }
    }

    .dialog {
      &.mobileMenu {
        .logo {
          position: absolute;
          top: 0;
          left: 0;
        }

        .content {
          position: relative;
          margin-top: -40px;
        }

        .balance {
          color: $--color-gray;
          text-align: center;
          font-size: 16px;
        }

        .email {
          display: block;
          margin: 24px 0 0 0;
          color: $--color-gray-light
        }

        .menu {
          margin-top: 20px;
          border-right: none;
          padding-bottom: 20px;
          border-bottom: 1px solid $--color-gray-lighter;

          li {
            &.is-active {
              background-color: transparent;
              color: $--color-gray;
            }
            &:hover {
              background-color: transparent;
            }
          }
        }

        .dialog-footer {
          .el-button {
            font-weight: normal;
          }
        }

        &.dark {
          .balance {
            color: $--color-white;
          }

          li {
            &.is-active, &:hover {
              background-color: transparent !important;
            }
          }

          .menu {
            border-bottom: 1px solid $--color-gray-light;
          }
        }
      }
    }
  }
}
</style>
