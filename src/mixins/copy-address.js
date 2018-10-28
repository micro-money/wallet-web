import QRCode from 'qrcode'

export default {
  methods: {
    async generateQrCodeDataUrl (text, name) {
      if (text && name) {
        try {
          this[name] = await QRCode.toDataURL(text)
        } catch (e) {
          console.error(e)
        }
      }
    },
    async copyToClipboard (message, containerId) {
      const container = document.getElementById(containerId)

      if (message && container) {
        try {
          await this.$copyText(message, container)

          this.$message({ message: 'Copied.', type: 'success' })
        } catch (e) {
          this.$message({ message: 'Can not copy.', type: 'error' })
          console.error(e)
        }
      }
    }
  }
}
