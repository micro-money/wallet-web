import { _get } from '@/utils/lodash'
import _find from 'lodash/find'
import btcPic from '@/assets/images/btc.svg'
import ethPic from '@/assets/images/eth.svg'
import defaultTokenPic1 from '@/assets/images/tokens/1.svg'
import defaultTokenPic2 from '@/assets/images/tokens/2.svg'
import defaultTokenPic3 from '@/assets/images/tokens/3.svg'

const currenciesList = [
  { currency: 'BTC', name: 'Bitcoin', image: btcPic },
  { currency: 'ETH', name: 'Ethereum', image: ethPic }
]

const tokenImages = {
  defaultNames: { 1: defaultTokenPic1, 2: defaultTokenPic2, 3: defaultTokenPic3 },
  errorImages: [],
  getSrc (asset) {
    return `https://raw.githubusercontent.com/TrustWallet/tokens/master/images/${asset.address.toString().toLowerCase()}.png`
  },
  getHash (s) {
    if (!s) s = 'null'

    let hash = btoa(s)
      .substring(0, 3)
      .toLowerCase()
      .split('')
      .reduce(function (result, char) { result += char.charCodeAt(0); return result }, 0)
      .toString()

    if (hash < 281) { return 1 } else if (hash < 332) { return 2 } else return 3
  },
  getRandom (asset) {
    if (this.errorImages[asset.name]) return this.errorImages[asset.name]
    this.errorImages[asset.name] = this.defaultNames[this.getHash(asset.name)]

    return this.errorImages[asset.name]
  }
}

const networks = {
  main: {
    link: 'https://etherscan.io/tx/:hash'
  },
  rinkeby: {
    link: 'https://rinkeby.etherscan.io/tx/:hash'
  },
  ropsten: {
    link: 'https://ropsten.etherscan.io/tx/:hash'
  },
  kovan: {
    link: 'https://kovan.etherscan.io/tx/:hash'
  },
  bcy: {
    link: 'https://live.blockcypher.com/bcy/tx/:hash'
  },
  testnet: {
    link: 'https://live.blockcypher.com/btc-testnet/tx/:hash'
  },
  mainnet: {
    link: 'https://live.blockcypher.com/btc/tx/:hash'
  }
}

export default {
  computed: {
    cryptoSrc () {
      const svgNames = { ETH: ethPic, BTC: btcPic }

      return svgNames[this.currentCrypto]
    },
    currenciesList () {
      return currenciesList
    }
  },
  methods: {
    getSrc (asset) {
      const svgNames = { ETH: ethPic, BTC: btcPic }

      return svgNames[asset.symbol] || svgNames[asset.currency]
    },
    getCurrencyImage (currency) {
      const currencyFound = _find(currenciesList, ['currency', currency])

      if (currencyFound && currencyFound.image) { return currencyFound.image } else { return tokenImages.getRandom({ name: currency }) }
    },
    cryptoColor (currency) {
      const cryptoColors = { ETH: '#6f7cba', BTC: '#ff991c' }

      return cryptoColors[currency] ? cryptoColors[currency] : '#2d4b56'
    },
    getAssetSrc (asset) {
      if (asset.type === 'token') { return this.getSrcToken(asset) } else return this.getSrc(asset)
    },
    getSrcToken (asset) {
      return tokenImages.getSrc(asset)
    },
    getRandomSrcToken (asset) {
      return asset ? tokenImages.getRandom(asset) : null
    },
    formatHash (hash, limit = 4) {
      return `${hash.slice(0, limit)}***${hash.slice(-limit)}`
    },
    getNetworkLink (transaction) {
      const network = _get(transaction, 'network', null)
      const hash = _get(transaction, 'hash', null)

      return networks[network] ? networks[network].link.replace(/:hash/, hash) : null
    }
  }
}
