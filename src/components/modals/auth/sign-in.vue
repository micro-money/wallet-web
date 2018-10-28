<template>
  <el-form
    ref="form"
    :model="model"
    :rules="rules">
    <el-form-item
      :class="{ 'focused': loginIsFocused }"
      label="Email"
      prop="email">
      <el-input
        v-model="model.email"
        data-test="signin-email"
        @focus="onFocus('loginIsFocused')"
        @blur="onBlur('loginIsFocused', 'email')"/>
    </el-form-item>

    <el-form-item
      :class="{ 'focused': passIsFocused }"
      label="Password"
      prop="password">
      <el-input
        v-model="model.password"
        :type="isPassVisible ? 'text' : 'password'"
        data-test="signin-password"
        @focus="onFocus('passIsFocused')"
        @blur="onBlur('passIsFocused', 'password')">
        <i
          slot="suffix"
          class="material-icons md-24 input-suffix"
          @click="isPassVisible = !isPassVisible">
          {{ iconVisiblePassword }}
        </i>
      </el-input>
    </el-form-item>

    <el-form-item>
      <el-button
        :disabled="!valid"
        type="primary"
        class="dialog-button"
        data-test="signin-button"
        @click="go('signIn', 'email', model)">
        Sign In
      </el-button>
    </el-form-item>

    <vue-recaptcha
      v-if="showRecaptcha"
      ref="recaptcha"
      :sitekey="sitekey"
      class="recaptcha"
      @verify="recaptcha = true"
      @expired="recaptcha = false"/>

    <div class="dialog-border">
      <hr>
      <div class="dialog-or">or</div>
      <hr>
    </div>

    <div class="dialog-socials">
      <el-button
        class="icon"
        type="text"
        @click="go('signIn', 'fb', model)">
        <img src="./../../../assets/images/socials/fb.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signIn', 'google', model)">
        <img src="./../../../assets/images/socials/google.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signIn', 'kakao', model)">
        <img src="./../../../assets/images/socials/kakaotalk.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signIn', 'linkedin', model)">
        <img src="./../../../assets/images/socials/linkedin.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signIn', 'weibo', model)">
        <img src="./../../../assets/images/socials/weibo.svg">
      </el-button>
    </div>
  </el-form>
</template>

<script>
import VueRecaptcha from 'vue-recaptcha'
import passwordMixin from '@/mixins/password'
import validateMixin from '@/mixins/validate'

export default {
  components: { VueRecaptcha },
  mixins: [ passwordMixin, validateMixin ],
  props: {
    go: {
      type: Function,
      default: () => {}
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      sitekey: process.env.VUE_APP_RECAPTCHA_SITE_KEY,
      model: {
        email: '',
        password: ''
      },
      rules: {
        email: [
          { validator: (rule, value, callback) => this.validateDebounced('email', value, callback), trigger: 'change' }
        ],
        password: [
          { validator: (rule, value, callback) => this.validate('required', value, callback, { message: 'Please enter your password' }), trigger: 'change' }
        ]
      },
      recaptcha: false,
      loginIsFocused: false,
      passIsFocused: false,
      showRecaptcha: false
    }
  },
  computed: {
    valid () {
      return (!this.showRecaptcha || this.recaptcha) &&
        this.model.email &&
        this.model.password &&
        this.isFieldsValid(this.$refs.form)
    }
  },
  watch: {
    reset (newVal) {
      if (newVal) this.resetForm()
    }
  },
  methods: {
    onFocus (key) {
      this[key] = true
    },
    onBlur (key1, key2) {
      this[key1] = !!this.model[key2]
    },
    resetForm () {
      if (this.recaptcha === true) this.$refs.recaptcha.reset()

      this.loginIsFocused = false
      this.passIsFocused = false
      this.model.email = ''
      this.model.password = ''

      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.$refs.form.clearValidate()
      }
    }
  }
}
</script>

<style lang="scss">
</style>
