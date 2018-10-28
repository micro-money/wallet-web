import copy from '@/assets/images/copy.svg'
import copyWhite from '@/assets/images/copy-white.svg'
import copyOrange from '@/assets/images/copy-orange.svg'
import qr from '@/assets/images/qr.svg'
import qrWhite from '@/assets/images/qr-white.svg'
import send from '@/assets/images/send-up.svg'
import sendWhite from '@/assets/images/send-up-white.svg'

const icons = { copy, copyWhite, copyOrange, qr, qrWhite, send, sendWhite }

export default {
  methods: {
    getIcon (name, color) {
      return color ? icons[name + color] : icons[this.isDark ? name + 'White' : name]
    }
  }
}
