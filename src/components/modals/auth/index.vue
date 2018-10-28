<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :title="getField(dialogs, currentKey, 'title')"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    custom-class="dialog auth"
    center>
    <transition-group
      name="animation"
      mode="out-in">
      <el-form
        v-loading="loading"
        v-if="currentKey === 'auth'"
        :key="0"
        class="buttons-wrapper animation signin">
        <el-form-item>
          <el-button
            type="primary"
            class="dialog-button fb auth"
            @click="go('signIn', 'fb')">
            Sign In via Facebook
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="dialog-button google auth"
            @click="go('signIn', 'google')">
            Sign In via Google
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="dialog-button linkedin auth"
            @click="go('signIn', 'linkedin')">
            Sign In via Linkedin
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="dialog-button kakao auth"
            @click="go('signIn', 'kakao')">
            Sign In via Kakao
          </el-button>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="dialog-button weibo auth"
            @click="go('signIn', 'weibo')">
            Sign In via Weibo
          </el-button>
        </el-form-item>

        <div class="dialog-border">
          <hr><div class="dialog-or">or</div><hr>
        </div>
      </el-form>

      <expired
        v-loading="loading"
        v-if="currentKey === 'expired'"
        :key="1"
        :email="dialogs.expired.email"
        :go="go"
        :reset="reset"
        class="animation"/>

      <sign-in
        v-loading="loading"
        v-if="currentKey === 'signIn'"
        :key="2"
        :go="go"
        :reset="reset"
        class="animation"/>

      <sign-up
        v-loading="loading"
        v-if="currentKey === 'signUp'"
        :key="3"
        :go="go"
        :reset="reset"
        class="animation"/>
    </transition-group>

    <span
      v-if="currentKey !== 'expired'"
      slot="footer"
      class="dialog-footer">
      {{ getField(dialogs, currentKey, 'text') }}

      <el-button
        type="text"
        class="footer-button text"
        @click="changeCurrentKey">
        {{ getField(dialogs, currentKey, 'textButton') }}
      </el-button>
    </span>

    <span
      v-else
      slot="footer"
      class="dialog-footer"/>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { _get } from '@/utils/lodash'
import expired from './expired'
import signIn from './sign-in'
import signUp from './sign-up'

export default {
  components: { expired, signIn, signUp },
  props: {
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      reset: false,
      currentKey: 'signUp',
      dialogs: {
        auth: {
          title: 'Sign In / Sign Up',
          text: 'Continue via',
          textButton: 'email'
        },
        expired: {
          title: 'Your session has expired due to inactivity',
          email: ''
        },
        signIn: {
          title: 'Sign In',
          text: 'Don’t have an account?',
          textButton: 'Sign Up'
        },
        signUp: {
          title: 'Sign Up',
          text: 'Do you have an account?',
          textButton: 'Sign In'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      loading: 'status/loading'
    })
  },
  created () {
    this.$eventHub.$on('popup:auth', currentKey => {
      this.currentKey = currentKey

      if (currentKey === 'expired') {
        const email = _get(this.user, 'email', null)

        this.dialogs.expired.email = ''

        setTimeout(() => { this.dialogs.expired.email = email }, 100)
      }
      this.show = true
    })
  },
  methods: {
    ...mapActions({
      signUpByEmail: 'auth/signUpByEmail',
      signInByEmail: 'auth/signInByEmail',
      authViaGoogle: 'auth/viaGoogle',
      authViaFacebook: 'auth/viaFacebook',
      authViaKakao: 'auth/viaKakao',
      authViaLinkedin: 'auth/viaLinkedin',
      authViaWeibo: 'auth/viaWeibo'
    }),
    changeCurrentKey () {
      this.reset = true
      this.currentKey = this.currentKey === 'signIn' ? 'signUp' : 'signIn'
      setTimeout(() => { this.reset = false }, 100)
    },
    handleClose () {
      this.reset = true
      this.show = false

      setTimeout(() => {
        this.currentKey = 'auth'
        this.reset = false
      }, 200)
    },
    getField (dialogs, currentKey, key) {
      return dialogs[currentKey][key]
    },
    async go (form, type, model) {
      if (type === 'email') {
        if (form === 'signIn') await this.signInByEmail(model)
        else if (form === 'signUp') await this.signUpByEmail(model)
      } else if (type === 'fb') await this.authViaFacebook()
      else if (type === 'google') await this.authViaGoogle()
      else if (type === 'kakao') await this.authViaKakao()
      else if (type === 'linkedin') await this.authViaLinkedin()
      else if (type === 'weibo') await this.authViaWeibo()

      if (this.user) this.handleClose()
    }
  }
}
</script>

<style lang="scss">
@import "./../../../assets/partials/variables";

.dialog {

  &.auth {
    overflow-y: hidden;

    .el-dialog__header {
      @media (max-width: 320px) {
        padding-top: 40px;
      }
    }

    .el-dialog__footer, .dialog-footer {
      @media (max-width: 320px) {
        padding-top: 0;
        margin-top: 0;
      }
    }

    .buttons-wrapper {
      @media (max-width:376px) {
        margin: 0 0 3px 0 !important;
      }
    }

    .signin {
      .el-button {
        white-space: nowrap;
      }
    }
  }

  .buttons-wrapper {
    margin: 24px 0 3px 0;
  }

  .dialog-button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    font-weight: 500;
    letter-spacing: 1.4px;
    text-transform: uppercase;

    &.google {
      background: url("./../../../assets/images/socials/google-white.svg") no-repeat 114px 14px #db4c32;
      padding-left: 44px;
      border-color: #db4c32;
    }

    &.fb {
      background: url("./../../../assets/images/socials/fb-white.svg") no-repeat 114px 14px #1e599b;
      padding-left: 64px;
      border-color: #1e599b;
    }

    &.linkedin {
      background: url("./../../../assets/images/socials/linkedin-white.svg") no-repeat 114px 14px #CFEDFB;
      padding-left: 44px;
      border-color: #CFEDFB;
      color: #000000
    }

    &.kakao {
      background: url("./../../../assets/images/socials/kakaotalk-white.svg") no-repeat 114px 16px #FFE812;
      padding-left: 44px;
      border-color: #FFE812;
      color: #000000
    }

    &.weibo {
      background: url("./../../../assets/images/socials/weibo-white.svg") no-repeat 114px 17px #F9A825;
      padding-left: 44px;
      border-color: #F9A825;
      color: #ffffff
    }

    &.auth {
      text-transform: none;
      background-size: 28px;

      &:hover {
        opacity: .8;
      }

      @media (min-width:361px) and (max-width:660px) {
        background-position: 12% 14px !important;
        padding-left: 18% !important;
      }

      @media (max-width:360px) {
        background-position: 15px 7px !important;
        padding-left: 45px !important;
        height: 42px;
        background-size: 25px !important;
      }
    }
  }

  .dialog-checkbox {
    text-align: left;
    margin-top: -10px;
    margin-bottom: 50px;

    .el-checkbox.agree, .el-checkbox.agree .with {
      color: $--color-gray;
      font-weight: 400;

      .el-button {
        font-size: $--font-size-medium;
        font-weight: 400;
      }
    }
  }

  .dialog-border {
    width: 100%;
    padding: 20px 0 35px 0;
    color: #3c3c3c;
    font-size: 14px;
    text-align: center;
    opacity: 0.5;
    display: flex;

    hr {
      float: left;
      width: 45%;
    }

    .dialog-or {
      float: left;
      width: 9%;
    }

    &.expired {
      padding-bottom: 55px;
    }

    @media (min-width: 321px) and (max-width: 660px) {
      padding: 20px 0 5px 0;
    }

    @media (max-width: 320px) {
      padding: 0 0 5px 0;
    }
  }

  .recaptcha div {
    transform-origin:0 0;
    -webkit-transform-origin:0 0;

    @media (min-width: 321px) and (max-width: 360px){
      transform:scale(0.95);
      -webkit-transform:scale(0.95);
    }
    @media (max-width: 320px) {
      transform:scale(0.9);
      -webkit-transform:scale(0.9);
    }
  }

  .dialog-socials {
    margin: 0 auto;

    .icon {

      img {
        width: 50px;
        height: 50px;
        padding: 0 2px;
        object-fit: contain;

        @media (max-width: 400px) {
          width: 30px;
          height: 30px;
        }
      }

      &:hover {
        opacity: .8;
      }
    }
  }

  .dialog-footer {
    font-size: 14px;

    .footer-button.text {
      font-size: 14px;
    }
  }

  .animation {
    transition: all .5s ease;
  }

  .animation-enter, .animation-leave-to {
    transform: translateY(150px);
    position: absolute;
    width: 450px;
    opacity: 0;
  }

  .animation-enter-to {
    opacity: 1;
  }
}
</style>
