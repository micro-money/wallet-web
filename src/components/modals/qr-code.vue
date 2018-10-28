<template>
  <el-dialog
    id="qr-code"
    :visible.sync="showQrCode"
    :before-close="handleClose"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    custom-class="dialog qr-code"
    center>
    <img
      v-if="qrCodeDataUrl"
      :src="qrCodeDataUrl"
      class="qr-code">

    <el-card
      v-if="address"
      shadow="never"
      class="card"
      @click.native="copyToClipboard(address, 'qr-code')">
      {{ address }}
      <img
        :src="getIcon('copy')"
        class="icon-button">
    </el-card>

    <div class="item-caption">{{ title }}</div>

    <span
      slot="footer"
      class="dialog-footer"/>
  </el-dialog>
</template>

<script>
import { mapGetters } from 'vuex'
import copyAddressMixin from '@/mixins/copy-address'
import themeIcons from '@/mixins/theme-icons'

export default {
  mixins: [copyAddressMixin, themeIcons],
  props: {
    showQrCode: {
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
      address: null,
      qrCodeDataUrl: null,
      title: null
    }
  },
  computed: {
    ...mapGetters({ isDark: 'auth/isDark' })
  },
  created () {
    this.$eventHub.$on('popup:qr-code', (address, qrCodeDataUrl, title) => {
      this.address = address
      this.title = title || 'Scan the QR code or copy the address'
      this.qrCodeDataUrl = qrCodeDataUrl

      if (this.address && this.qrCodeDataUrl) this.$emit('open')
    })
  },
  methods: {
    handleClose () {
      this.address = this.qrCodeDataUrl = null
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/partials/variables";

.dialog {

  .qr-code {
    width: 250px;
    height: 250px;
    border: 1px solid $--color-gray-light;
  }

  .card {
    background: $--color-gray-super-light;
    margin-top: 28px;
    cursor: pointer;

    .icon-button {
      opacity: 0.5;
      vertical-align: middle;
      height: 18px;
      padding-bottom: 3px;

      &:hover {
        opacity: 1;
      }
    }

    word-break: break-all;
  }

  .item-caption {
    color: $--color-gray-light;
    font-size: $--font-size-small;
    margin-top: 10px;
  }
}
</style>
