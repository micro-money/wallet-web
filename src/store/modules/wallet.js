import * as Mutate from '@/store/mutations'
import { Wallet, Asset, Invoice } from '@/api/rest'
import { _get, _find, _findIndex, _isNumber } from '@/utils/lodash'
import Vue from 'vue'

const state = {
  password: null,
  current: {},
  assets: [],
  invoices: [],
  transactionList: [],
  invoiceTransactionList: [],
  currentRate: null,
  privateKey: [],
  keystore: [],
  transactionCost: null,
  foundedTokens: []
}

const getters = {
  password: state => state.password,
  assets: state => state.assets,
  invoices: state => state.invoices,
  invoiceTransactionList: state => state.invoiceTransactionList,
  current: state => state.current, // ({ ...state.current, ...({password: state.current.mnemonic}) }), // todo: remove mnemonic
  transactionList: state => {
    return state.transactionList.filter(transaction => { return _get(transaction, 'to.hash') })
  },
  currentRate: state => state.currentRate,
  privateKey: state => state.privateKey,
  keystore: state => state.keystore,
  transactionCost: state => state.transactionCost,
  foundedTokens: state => state.foundedTokens
    .filter(item => item.symbol && item.symbol !== '')
    .map(item => {
      return {
        ...item,
        value: item.symbol !== item.name ? `${item.symbol} ${item.name}` : item.name
      }
    }),
  ethAsset: state => state.assets
    ? state.assets.find(asset => asset.symbol === 'ETH' && asset.type !== 'token' ? asset : null)
    : null,
  defaultAssets: state => state.assets
    ? {
      'ETH': state.assets.find(asset => asset.symbol === 'ETH' && asset.type !== 'token' ? asset : null),
      'BTC': state.assets.find(asset => asset.symbol === 'BTC' ? asset : null)
    }
    : null
}

const actions = {
  async get ({ dispatch, commit }) {
    let response

    try {
      dispatch('status/setLoadingInstance', { instance: 'asset', status: true }, { root: true })

      response = await Wallet.get()

      // todo: remove when api ready
      response.data.wallet.invoicesList = Wallet.invoicesFixture.invoicesList

      commit(Mutate.wallet.current, response)
      commit(Mutate.wallet.assets, { response, wallet: true })
      commit(Mutate.wallet.invoices, { response, wallet: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally { dispatch('status/setLoadingInstance', { instance: 'asset', status: false }, { root: true }) }
  },
  async create ({ dispatch, commit }, password) {
    let response

    try {
      response = await Wallet.create(password)

      commit(Mutate.wallet.current, response)
      commit(Mutate.wallet.assets, { response, wallet: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async getPassword ({ dispatch, commit }) {
    let response

    try {
      response = await Wallet.getPassword()

      commit(Mutate.wallet.password, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  setPassword ({ dispatch, commit }, password) {
    commit(Mutate.wallet.password, { data: { password } })
  },
  async getAllAssets ({ dispatch, commit }) {
    let response

    try {
      response = await Asset.getAll()

      commit(Mutate.wallet.assets, { response })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async getAsset ({ dispatch, commit }, id) {
    let response

    try {
      dispatch('status/setLoadingInstance', { instance: 'asset', status: true }, { root: true })

      response = await Asset.get(id)

      commit(Mutate.wallet.assets, { response })
      commit(Mutate.wallet.transactionList, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally { dispatch('status/setLoadingInstance', { instance: 'asset', status: false }, { root: true }) }
  },
  async createAsset ({ dispatch, commit }, { data, password }) {
    let response

    try {
      response = await Asset.create(data, password)

      commit(Mutate.wallet.assets, { response })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    }
  },
  async removeAsset ({ dispatch, commit }, { id }) {
    let response

    try {
      dispatch('status/setLoadingInstance', { instance: 'asset', status: true }, { root: true })
      response = await Asset.remove(id)

      if (response.data === 'OK') commit(Mutate.wallet.assets, { response: { data: { asset: { id } } }, remove: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally { dispatch('status/setLoadingInstance', { instance: 'asset', status: false }, { root: true }) }
  },
  async sendCurrency ({ dispatch, commit }, { id, data, password }) {
    let response, transactions, notifyMessages, amountField

    dispatch('status/changeMessage', { response: { message: 'Sending...' }, type: 'success' }, { root: true })

    try {
      response = await Asset.send(id, data, password)
      transactions = _get(response, 'data.transaction', null)

      if (transactions && transactions[0]) {
        transactions.forEach((transaction) => {
          amountField = transaction && transaction.tokenAmount ? 'tokenAmount' : 'amount'

          notifyMessages = [
            { status: 'pending', data: { message: `Transaction ${transaction[amountField]} ${transaction.symbol || transaction.currency} is pending` }, type: 'message' },
            { status: 'success', data: { message: `Transaction ${transaction[amountField]} ${transaction.symbol || transaction.currency} was successful` }, type: 'success' },
            { status: 'failure', data: { message: `Transaction ${transaction[amountField]} ${transaction.symbol || transaction.currency} failed` }, type: 'warning' }
          ]
          const { data, type } = _find(notifyMessages, ['status', transaction.status])

          dispatch('status/changeMessage', { response: data, type: type }, { root: true })

          commit('wallet/transaction/one', transaction, { root: true })
          commit('transaction/one', { data: { transaction } }, { root: true })

          if (transaction.status === 'success') dispatch('wallet/get', {}, { root: true })
        })
      }
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async getAllInvoices ({ dispatch, commit }) {
    let response

    try {
      response = await Invoice.getAll()

      commit(Mutate.wallet.invoices, { response })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async getInvoice ({ dispatch, commit }, id) {
    let response

    try {
      dispatch('status/setLoadingInstance', { instance: 'invoice', status: true }, { root: true })

      response = await Invoice.get(id)

      commit(Mutate.wallet.invoices, { response })
      commit(Mutate.wallet.invoiceTransactionList, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally { dispatch('status/setLoadingInstance', { instance: 'invoice', status: false }, { root: true }) }
  },
  async convertRate ({ dispatch, commit }, { from, to, amount }) {
    let response

    if (!from || !to || !amount) commit(Mutate.wallet.currentRate, {})
    else {
      try {
        response = await Wallet.convertRate(from, to, amount)

        commit(Mutate.wallet.currentRate, { response, currency: to })
        dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
      } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
    }
  },
  async getTransactionCost ({ dispatch, commit }, { currency, token, address, amount, password }) {
    let response

    if (!currency && !token) commit(Mutate.wallet.transactionCost, null)
    else if (token) {
      try {
        response = await Wallet.transactionCostToken(token, address, amount, password)

        commit(Mutate.wallet.transactionCost, response)
        dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
      } catch (e) {
        commit(Mutate.wallet.transactionCost, null)
      }
    } else {
      try {
        response = await Wallet.transactionCostCrypto(currency)

        commit(Mutate.wallet.transactionCost, response)
        dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
      } catch (e) {
        commit(Mutate.wallet.transactionCost, null)
      }
    }
  },
  async exportKeys ({ dispatch, commit }, { id, password, type, pass }) {
    let response

    try {
      response = id && password ? await Asset.export(id, password, type, pass) : null

      if (type === 'keystore') commit(Mutate.wallet.keystore, response)
      else commit(Mutate.wallet.privateKey, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async importAsset ({ dispatch, commit }, { data, password }) {
    let response

    try {
      response = await Asset.import(data, password)

      commit(Mutate.wallet.assets, { response })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async updateAsset ({ dispatch, commit }, { id, name }) {
    let response

    try {
      response = await Asset.update(id, name)

      commit(Mutate.wallet.assetName, { id, name })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async importToken ({ dispatch, commit }, { data, password }) {
    let response

    try {
      response = await Asset.import(data, password)

      commit(Mutate.wallet.assets, { response })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
      throw new Error(e)
    }
  },
  async searchToken ({ dispatch, commit }, text) {
    let response

    try {
      if (text) { response = await Wallet.searchToken(text) } else response = []

      commit(Mutate.wallet.foundedTokens, response)
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
      throw new Error(e)
    }
  },
  updateDescription ({ dispatch, commit }, { id, description }) {
    commit(Mutate.wallet.transactionDescription, { id, description })
  }
}

const mutations = {
  [Mutate.wallet.password] (state, response) {
    const password = _get(response, 'data.password', null)

    state.password = password || null
  },
  [Mutate.wallet.current] (state, response) {
    state.current = _get(response, 'data.wallet', {})
  },
  [Mutate.wallet.assets] (state, { response, wallet, remove }) {
    const path = wallet ? 'data.wallet.assetList' : 'data.assetList'
    const asset = _get(response, 'data.asset', null)
    const index = asset ? _findIndex(state.assets, ['id', asset.id]) : null
    let assetsArray = _get(response, path, null)

    if (_isNumber(index) && index !== -1) {
      if (remove) Vue.delete(state.assets, index)
      else Vue.set(state.assets, index, asset)
    } else if (assetsArray) state.assets = assetsArray
    else if (asset) state.assets.push(asset)
    else state.assets = []
  },
  [Mutate.wallet.assetName] (state, { id, name }) {
    const index = id ? _findIndex(state.assets, ['id', id]) : null
    let asset

    if (_isNumber(index) && index !== -1 && name) {
      asset = state.assets[index]
      asset.name = name

      Vue.set(state.assets, index, asset)
    }
  },
  [Mutate.wallet.invoices] (state, { response, wallet, remove }) {
    const path = wallet ? 'data.wallet.invoicesList' : 'data.invoicesList'
    const invoice = _get(response, 'data.invoice', null)
    const index = invoice ? _findIndex(state.invoices, ['id', invoice.id]) : null
    let invoicesArray = _get(response, path, null)

    if (_isNumber(index) && index !== -1) {
      if (remove) Vue.delete(state.invoices, index)
      else Vue.set(state.invoices, index, invoice)
    } else if (invoicesArray) state.invoices = invoicesArray
    else if (invoice) state.invoices.push(invoice)
    else state.invoices = []
  },
  [Mutate.wallet.invoiceTransactionList] (state, response) {
    state.invoiceTransactionList = _get(response, 'data.invoice.transactionList', [])
  },
  [Mutate.wallet.transactionList] (state, response) {
    state.transactionList = _get(response, 'data.asset.transactionList', [])
    state.transactionListFiltered = state.transactionList
  },
  [Mutate.wallet.transactionDescription] (state, { id, description }) {
    const index = id ? _findIndex(state.transactionList, ['id', id]) : null
    let transaction

    if (_isNumber(index) && index !== -1) {
      transaction = state.transactionList[index]
      transaction.descr = description

      Vue.set(state.transactionList, index, transaction)
    }
  },
  [Mutate.wallet.transactionOne] (state, transaction) {
    const index = transaction ? _findIndex(state.transactionList, ['id', transaction.id]) : null

    if (_isNumber(index) && index !== -1) Vue.set(state.transactionList, index, transaction)
    else if (transaction) state.transactionList.unshift(transaction)
  },
  [Mutate.wallet.currentRate] (state, { response, currency }) {
    state.currentRate = _get(response, `data[${currency}]`, null)
  },
  [Mutate.wallet.privateKey] (state, response) {
    state.keystore = []
    state.privateKey = _get(response, 'data.addressList', [])
  },
  [Mutate.wallet.keystore] (state, response) {
    state.privateKey = []
    state.keystore = _get(response, 'data.addressList', [])
  },
  [Mutate.wallet.transactionCost] (state, response) {
    state.transactionCost = _get(response, 'data', [])
  },
  [Mutate.wallet.foundedTokens] (state, response) {
    state.foundedTokens = _get(response, 'data.addressList', [])
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
