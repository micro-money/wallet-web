<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :title="getField(dialogs, currentKey, 'title')"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    :custom-class="customClass"
    center>

    <template v-if="currentKey === 'warning'">
      <img
        v-if="!isDark"
        src="./../../../assets/images/no-camera.svg"
        class="no-camera">

      <img
        v-else
        src="./../../../assets/images/no-camera-white.svg"
        class="no-camera">
    </template>

    <span>{{ getField(dialogs, currentKey, 'header') }}</span>

    <transition-group
      name="animation"
      mode="out-in"
      class="export-content">

      <template v-if="currentKey === 'warning'">
        <el-form
          :key="0"
          class="warning-buttons">
          <el-form-item>
            <el-button
              type="primary"
              class="dialog-button"
              @click="nextStep('keystore')">
              Export keystore
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              class="dialog-button"
              @click="nextStep('privateKey')">
              Export private keys
            </el-button>
          </el-form-item>
        </el-form>
      </template>

      <private-key
        v-if="currentKey === 'privateKey'"
        :key="1"
        :id="id"
        @close="handleClose" />

      <keystore
        v-if="currentKey === 'keystore'"
        :key="2"
        :id="id"
        @close="handleClose" />
    </transition-group>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import privateKey from './private-key'
import keystore from './keystore'

export default {
  components: { privateKey, keystore },
  props: {
    showExport: {
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
      show: false,
      currentKey: 'warning',
      nextKey: 'warning',
      dialogs: {
        warning: {
          title: 'Warning',
          header: 'Your private keys are the keys at your funds. So DO NOT SHARE them with anyone unless you’d like them to have access to your funds.'
        },
        keystore: {
          title: 'Export Keystore'
        },
        privateKey: {
          title: ''
        }
      },
      enterPassword: false,
      id: null
    }
  },
  computed: {
    ...mapGetters({
      password: 'wallet/password',
      privateKey: 'wallet/privateKey',
      isDark: 'auth/isDark'
    }),
    customClass () {
      const multi = this.currentKey === 'privateKey' ? this.multipleKeys ? 'multi' : 'single' : ''
      const tabs = this.currentKey === 'keystore' ? 'tabs tabs-modal' : ''

      return `dialog dialog-export text ${multi} ${tabs} ${this.currentKey === 'warning' ? ' image' : ''}`
    },
    multipleKeys () {
      return this.privateKey.length > 1
    }
  },
  watch: {
    showExport (newVal) {
      if (newVal) {
        this.currentKey = 'warning'
        this.show = true
      }
    },
    password () {
      if (this.enterPassword) this.currentKey = this.nextKey
    }
  },
  created () {
    this.$eventHub.$on('popup:export', id => {
      this.id = id
      this.show = true

      if (this.id) this.$emit('open')
    })
  },
  methods: {
    ...mapActions({ exportKeys: 'wallet/exportKeys' }),
    handleClose () {
      this.show = false
      this.enterPassword = false
      this.id = null
      this.nextKey = null

      setTimeout(() => {
        this.exportKeys({ id: null })
      }, 500)

      this.$emit('close')
    },
    nextStep (next) {
      if (this.password) {
        this.enterPassword = false
        this.currentKey = next
      } else {
        this.$eventHub.$emit('popup:password:enter')
        this.enterPassword = true
        this.nextKey = next
      }
    },
    getField (dialogs, currentKey, key) {
      if (currentKey === 'privateKey' && key === 'title') return this.multipleKeys ? 'Private keys' : 'Export Private Key'
      else return dialogs[currentKey][key]
    }
  }
}
</script>

<style lang="scss">
@import "./../../../assets/partials/variables";

.dialog-export {

  &.dialog.tabs .el-dialog__header {
    padding-top: 50px;
  }

  .dialog-button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1.4px;
  }

  .buttons-wrapper {
    margin: 24px 0 3px 0;
  }

  .card {
    word-break: break-word;
    text-align: left;
    margin-bottom: 50px;

    .card-header {
      font-size: 12px;
      font-weight: 400;
      line-height: normal;
      letter-spacing: 0.2px;
      text-align: left;
    }
  }

  .card.gray {
    color: $--color-gray-light;

    .card-header {
      color: $--color-gray-light;
    }
  }

  .dialog-footer {
    font-size: 14px;
    margin-top: 20px;

    .footer-button.text {
      font-size: 14px;
    }
  }

  .export-content {
    padding: 0 0 30px 0;
    display: block;
  }

  .warning-buttons {
    padding-top: 30px;
  }

  @media (max-width: 600px) {
    &.dialog.tabs .el-dialog__header, &.dialog .el-dialog__header {
      padding-top: 40px;
    }
  }
}
</style>
