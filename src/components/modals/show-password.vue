<template>
  <el-dialog
    :visible.sync="showPassword"
    :before-close="handleClose"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :show-close="false"
    custom-class="dialog show-password"
    title="Before start using the wallet"
    center>
    <p class="important">you must backup your password:</p>

    <div
      id="copy-password"
      class="password">
      <span>{{ password }}
        <img
          title="Copy"
          src="../../assets/images/copy.svg"
          class="icon-button"
          @click="copyToClipboard(password, 'copy-password')"></span>
    </div>

    <span
      class="not-important">
      The password is used to perform any actions, such as sending transactions, etc.
      If you have forgotten your wallet password, you will not be able to access your wallet.
    </span>

    <div class="buttons-wrapper">
      <el-row>
        <el-button
          type="text"
          class="dialog-button text"
          @click="handleClose()">
          I confirm that I copied and saved the wallet password
        </el-button>
      </el-row>
    </div>
  </el-dialog>
</template>

<script>
import copyAddressMixin from '@/mixins/copy-address'
import { mapActions, mapGetters } from 'vuex'
import { _get } from '@/utils/lodash'

export default {
  mixins: [copyAddressMixin],
  props: {
    showPassword: {
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
      show: false
    }
  },
  computed: {
    ...mapGetters({
      password: 'wallet/password',
      user: 'auth/user'
    }),
    password () {
      return _get(this.user, 'secret', null)
    }
  },
  methods: {
    ...mapActions({
      getPassword: 'wallet/getPassword',
      setPassword: 'wallet/setPassword'
    }),
    handleClose () {
      this.setPassword(this.password)

      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "../../assets/partials/variables";

.dialog.show-password {
  text-align: center;

  .important {
    color: $--color-black;
  }

  .not-important {
    color: $--color-gray-light;
    font-size: 14px;
    display: block;
    padding: 0 30px 0 30px;
  }

  .buttons-wrapper {
    padding-bottom: 60px;
    margin: 40px 0 20px 0;

    .dialog-button.text {
      font-size: 16px;
      text-transform: none;
    }
  }

  .password {
    color: $--color-gray;
    padding: 0 0 30px 0;
    font-size: 20px;

    span {
      display: flex;
      align-items:center;
      justify-content: center;

      img {
        margin-left: 10px;
      }
    }
  }

  .icon-button {
    width: 18px;
    height: 18px;
    margin-right: 4px;
    opacity: 0.3;
    cursor: pointer;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
