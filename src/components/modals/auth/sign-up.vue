<template>
  <el-form
    ref="form"
    :model="model"
    :rules="rules"
    class="signup">
    <el-form-item
      :class="{ 'focused': loginIsFocused }"
      label="Email"
      prop="email">
      <el-input
        v-model="model.email"
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

    <el-form-item
      :class="['confirm', { 'focused': confirmPassIsFocused }]"
      label="Confirm Password"
      prop="confirmPassword">
      <el-input
        v-model="model.confirmPassword"
        type="password"
        @focus="onFocus('confirmPassIsFocused')"
        @blur="onBlur('confirmPassIsFocused', 'confirmPassword')"/>
    </el-form-item>

    <el-form-item class="dialog-checkbox">
      <el-checkbox
        v-model="model.terms"
        class="agree">
        <span class="with">Agree with</span>
        <el-button
          type="text"
          @click="$eventHub.$emit('popup:terms')">
          Terms of Service and Privacy Policy
        </el-button>
      </el-checkbox>
    </el-form-item>

    <el-form-item>
      <el-button
        :disabled="!valid"
        type="primary"
        class="dialog-button"
        @click="go('signUp', 'email', model)">
        Sign Up
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
      <hr><div class="dialog-or">or</div><hr>
    </div>

    <div class="dialog-socials">
      <el-button
        class="icon"
        type="text"
        @click="go('signUp', 'fb', model)">
        <img src="./../../../assets/images/socials/fb.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signUp', 'google', model)">
        <img src="./../../../assets/images/socials/google.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signUp', 'kakao', model)">
        <img src="./../../../assets/images/socials/kakaotalk.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signUp', 'linkedin', model)">
        <img src="./../../../assets/images/socials/linkedin.svg">
      </el-button>

      <el-button
        type="text"
        class="icon"
        @click="go('signUp', 'weibo', model)">
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
        password: '',
        confirmPassword: '',
        terms: true
      },
      rules: {
        email: [
          { validator: (rule, value, callback) => this.validateDebounced('email', value, callback), trigger: 'change' }
        ],
        password: [
          { validator: this.passwordValidator, trigger: 'change' }
        ],
        confirmPassword: [
          { validator: this.passwordConfirmValidator, trigger: 'change' }
        ]
      },
      recaptcha: false,
      loginIsFocused: false,
      passIsFocused: false,
      confirmPassIsFocused: false,
      showRecaptcha: false
    }
  },
  computed: {
    valid () {
      return (!this.showRecaptcha || this.recaptcha) &&
      this.model.email &&
      this.model.password &&
      this.model.confirmPassword &&
      this.model.password === this.model.confirmPassword &&
      this.model.terms &&
      this.isFieldsValid(this.$refs.form)
    }
  },
  watch: {
    reset (newVal) {
      if (newVal) this.resetForm()
    }
  },
  methods: {
    passwordValidator (rule, value, callback) {
      return this.validate(
        'password_with_confirm',
        value,
        callback,
        { form: this.$refs.form, message: 'Please enter your password' })
    },
    passwordConfirmValidator (rule, value, callback) {
      return this.validateDebounced('password_confirm', value, callback, { password: this.model.password })
    },
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
      this.model.confirmPassword = ''
      this.model.terms = true

      if (this.$refs.form) {
        this.$refs.form.resetFields()
        this.$refs.form.clearValidate()
      }
    }
  }
}
</script>

<style lang="scss">
.signup {

  @media (max-width: 450px) {
    margin-top: -20px;

    .dialog-checkbox {
      margin-bottom: 10px !important;
    }

    .el-checkbox__label {
      display: inline-grid !important;
    }

    .el-input__inner {
    }

    .agree {
      button {
        max-width: 100%;
        white-space: normal;
        text-align: left;
        padding-top: 2px;
      }
    }
  }
}
</style>
