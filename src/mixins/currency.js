import { _get } from '@/utils/lodash'

export default {
  methods: {
    fixFiat (fiat) {
      return (+fiat).toFixed(2)
    },
    fixCrypto (crypto) {
      const figures = crypto ? crypto.toString().split('.')[1] : 0
      let digits = !figures ? 2 : crypto.toString().split('.').pop().length

      digits = digits > 8 ? 8 : digits

      return (+crypto).toFixed(digits)
    },
    fixToken (amount) {
      const figures = amount ? amount.toString().split('.')[0] : 0
      let digits = amount ? amount.toString().split('.').pop() : 0

      if (figures.length > 2) return (+`${figures}.${digits.slice(0, 2)}`).toFixed(2)
      else if (digits.length > 8) return (+amount).toFixed(8)
      else return (+amount).toFixed(digits.length)
    },
    fixAsset (asset, amount) {
      const assetType = _get(asset, 'type', null)

      return assetType === 'token' ? this.fixToken(amount) : this.fixCrypto(amount)
    },
    getTxnAmount (transaction, type) {
      const rateField = transaction.token ? 'tokenRate' : 'rate'
      const amountField = transaction.token ? 'tokenAmount' : 'amount'

      return type === 'fiat'
        ? this.fixFiat(_get(transaction[rateField], 'USD', 0))
        : this.fixCrypto(_get(transaction, amountField, 0))
    },
    getTxnSign (direction) {
      return direction === 'out' ? '-' : '+'
    },
    convertTime (time) {
      const date = new Date(time)

      return date.toLocaleString()
    }
  }
}
