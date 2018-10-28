<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :title="getField(dialogs, currentKey, 'title')"
    :custom-class="customClass"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    center>
    <img
      v-if="currentKey === 'importCrypto'"
      :src="cryptoSrc"
      class="currency-icon">

    <span v-else>{{ getField(dialogs, currentKey, 'header') }}</span>

    <transition-group
      name="animation"
      mode="out-in">
      <new-asset
        v-if="currentKey === 'new'"
        :key="0"
        @change-current-key="key => changeCurrentKey(key)"
        @current-key="key => (currentKey = key)"/>

      <new-token
        v-if="currentKey === 'newToken'"
        :key="3"
        :enter-password.sync="enterPassword"
        @close="handleClose"
        @import="() => startImport()"/>
    </transition-group>

    <span
      v-if="currentKey === 'importCrypto'"
      slot="footer"
      class="dialog-footer">
      <el-form>
        <el-form-item>
          <el-button
            :disabled="!canImport"
            type="primary"
            class="dialog-button"
            @click="startImport(importModel)">
            Start importing
          </el-button>
        </el-form-item>
      </el-form>
    </span>

    <span
      v-else
      slot="footer"
      class="dialog-footer"/>
  </el-dialog>
</template>

<script>
import { mapActions, mapState, mapGetters } from 'vuex'
import cryptoMixin from '@/mixins/crypto'
import newAsset from './new'
import newToken from './new-token'

export default {
  components: { newAsset, newToken },
  mixins: [cryptoMixin],
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
      currentCrypto: 'ETH',
      currentKey: 'new',
      dialogs: {
        new: {
          title: 'Add new asset',
          header: 'What do you want to add?'
        },
        newCrypto: {
          title: 'New cryptocurrency asset',
          header: 'You can create all new asset or import your exists wallet.'
        },
        importCrypto: {
          title: 'Import your wallet'
        },
        newToken: {
          title: 'Add new token'
        }
      },
      importModel: {},
      importAssetName: '',
      canImport: false,
      enterPassword: false
    }
  },
  computed: {
    ...mapState('wallet', ['password', { wallet: 'current' }]),
    ...mapGetters({ user: 'auth/user' }),
    customClass () {
      return `dialog add-asset${this.currentKey === 'importCrypto' ? ' tabs import tabs-modal' : ''}`
    }
  },
  watch: {
    user (newVal) {
      if (!newVal) this.handleClose()
    }
  },
  created () {
    this.$eventHub.$on('popup:asset:create', currentKey => {
      this.currentKey = currentKey
      this.show = true
    })
  },
  methods: {
    ...mapActions({ importAsset: 'wallet/importAsset' }),
    changeCurrentKey (key) {
      this.reset = true
      this.currentKey = key
      setTimeout(() => { this.reset = false }, 100)
    },
    handleClose () {
      this.reset = true
      this.show = false

      setTimeout(() => {
        this.currentKey = 'new'
        this.importAssetName = ''
        this.reset = false
        this.enterPassword = false

        if (this.$refs.addAsset) this.$refs.addAsset.resetFields()
        if (this.$refs.importForm) this.$refs.importForm.resetFields()
      }, 200)
    },
    getField (dialogs, currentKey, key) {
      return dialogs[currentKey][key]
    },
    startImport ({ name, path, privateKey, keystore, password, address }) {
      if (this.password) {
        const data = { name, key: privateKey, address, currency: this.currentCrypto, keystore, pass: password }

        this.$message({ message: 'Importing...', type: 'success' })
        this.importAsset({ data, password: this.password })
        this.enterPassword = false
        this.handleClose()
      } else {
        this.$eventHub.$emit('popup:password:enter')
        this.enterPassword = true
      }
    }
  }
}
</script>

<style lang="scss">
@import "./../../../assets/partials/variables";

.dialog {

  .buttons-wrapper {
    margin: 24px 0 3px 0;
  }

  .dialog-button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 1.3px;

    .button-description {
      margin-top: 6px;
      color: $--color-gray-light;
      font-size: $--font-size-smallest;
      text-transform: none;
    }

    &.el-button--primary {

      .button-description {
        color: inherit;
      }
    }

    &:hover, &.is-disabled {

      .button-description {
        color: inherit;
      }
    }
  }

  .private-key {
    word-wrap: break-word;
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
        font-weight: 500;
      }
    }
  }

  .select {

    .currency-icon.prefix {
      width: 24px;
      height: 24px;
      padding-left: 10px;
      padding-top: 9px;
      height: 100%;
    }
  }

  .dialog-footer {
    font-size: 14px;
    margin-top: 20px;

    .footer-button.text {
      font-size: 14px;
    }
  }

  &.add-asset {
    @media (max-width: 660px) {
      .buttons-wrapper {
        margin-top: 30px;

        .el-form-item__content {
          .el-button {
            font-size: $--font-size-small;
            white-space: unset !important;
          }

          .item-caption {
            margin-top: 10px;
            line-height: 20px;
          }
        }

        .dialog-button {
          height: auto;
        }
      }
    }
  }
}

.option {
  padding: 14px;
  height: 64px;

  .currency-icon {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    margin-right: 10px;
  }

  .name {
    font-size: $--font-size-medium;
    font-weight: 400;
    vertical-align: middle;
  }

  &.is-disabled {

    .currency-icon, .name {
      opacity: .5;
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
    opacity: 0;
  }
}
</style>
