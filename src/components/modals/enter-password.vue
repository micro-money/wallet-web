<template>
  <el-dialog
    :visible.sync="showCheckPassword"
    :before-close="handleClose"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    custom-class="dialog password"
    title="Please enter your wallet password"
    center>
    <el-form
      ref="form"
      :model="model"
      status-icon>
      <div class="dialog-text">To perfom actions with your wallet you should enter your password.</div>

      <el-form-item
        :class="{ 'focused': isFocused }"
        label="Password"
        prop="password">
        <el-input
          v-model="model.password"
          :type="isPassVisible ? 'text' : 'password'"
          @focus="isFocused = true"
          @blur="isFocused = !!model.password"
          @keyup.enter.native="submit">
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
          :disabled="!canSubmit"
          type="primary"
          class="dialog-button"
          @click="submit">
          OK
        </el-button>
      </el-form-item>
    </el-form>

    <div
      slot="footer"
      class="dialog-footer"/>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import passwordMixin from '@/mixins/password'

export default {
  mixins: [ passwordMixin ],
  props: {
    showCheckPassword: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      model: {
        password: ''
      },
      isFocused: false
    }
  },
  computed: {
    ...mapGetters({
      password: 'wallet/password',
      wallet: 'wallet/current'
    }),
    canSubmit () {
      return this.model.password
    }
  },
  watch: {
    wallet () {
      if (this.wallet.password && this.password) {
        this.isFocused = true
        this.model.password = this.password
      }
    },
    password () {
      if (this.wallet.password && this.password) {
        this.isFocused = true
        this.model.password = this.password
      }
    }
  },
  methods: {
    ...mapActions({ setPassword: 'wallet/setPassword' }),
    handleClose () {
      this.$refs.form.resetFields()
      this.$emit('close')
    },
    submit () {
      if (!this.canSubmit) return false

      this.setPassword(this.model.password)
      this.handleClose()
    }
  }
}
</script>

<style lang="scss">
.dialog.password {

  .dialog-text {
    margin-bottom: 50px;
  }

  .dialog-button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1.4px;
  }

  .dialog-checkbox {
    text-align: left;
    margin-top: -10px;
    margin-bottom: 50px;

    .agree {
      color: #606266 !important;
    }
  }

  .dialog-border {
    width: 100%;
    margin: 40px 0 0 0;
    color: #3c3c3c;
    font-size: 14px;
    text-align: center;
    opacity: 0.5;

    hr {
      float: left;
      width: 45%;
    }

    .dialog-or {
      float: left;
      width: 9%;
    }
  }

  .dialog-socials {
    padding: 35px 0 0 20px;
    margin: 0 auto;

    .icon {

      img {
        width: 50px;
        height: 50px;
        padding: 0 2px;
        object-fit: contain;
      }

      &:hover {
        opacity: .8;
      }
    }
  }

  .dialog-footer {
    font-size: 14px;

    &.indent {
      padding-top: 40px;
    }

    .footer-button.text {
      font-size: 14px;
    }
  }
}
</style>
