<template>
  <el-form
    ref="form"
    :model="model"
    :rules="rules">
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

    <div class="dialog-border expired">
      <hr><div class="dialog-or">or</div><hr>
    </div>

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

    <el-form-item>
      <el-button
        :disabled="!validate"
        type="primary"
        class="dialog-button"
        @click="go('signIn', 'email', model)">
        Sign In
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import passwordMixin from '@/mixins/password'

export default {
  mixins: [ passwordMixin ],
  props: {
    go: {
      type: Function,
      default: () => {}
    },
    email: {
      type: String,
      default: ''
    },
    reset: {
      type: Boolean,
      default: false
    }
  },
  data () {
    const validatePass = (rule, value, callback) => value === ''
      ? callback(new Error('Please input the password'))
      : callback()

    return {
      model: {
        email: '',
        password: ''
      },
      rules: {
        password: [
          { validator: validatePass, trigger: 'change' }
        ]
      },
      passIsFocused: false
    }
  },
  computed: {
    validate () {
      return this.model.email && this.model.password
    }
  },
  watch: {
    reset (newVal) {
      if (newVal) this.resetForm()
    },
    email (newVal) {
      if (newVal) this.model.email = newVal
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
