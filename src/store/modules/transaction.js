import * as Mutate from '@/store/mutations'
import { Transaction } from '@/api/rest'
import { _get, _findIndex, _isNumber } from '@/utils/lodash'
import Vue from 'vue'

const state = {
  list: [],
  isExporting: false,
  pdf: null
}

const getters = {
  list: state => {
    return state.list.filter(transaction => { return _get(transaction, 'to.hash') })
  },
  isExporting: state => state.isExporting,
  pdf: state => state.pdf
}

const actions = {
  async getAll ({ dispatch, commit }) {
    let response

    try {
      response = await Transaction.getAll()

      commit(Mutate.transaction.all, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async getForContact ({ dispatch, commit }, contactId) {
    let response

    try {
      response = await Transaction.getForContact(contactId)

      commit(Mutate.transaction.all, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async get ({ dispatch, commit }, id) {
    let response

    try {
      response = await Transaction.get(id)

      commit(Mutate.transaction.one, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async update ({ dispatch, commit }, { id, description }) {
    let response

    try {
      response = await Transaction.update(id, description)

      commit(Mutate.transaction.description, { id, description })
      dispatch('wallet/updateDescription', { id, description }, { root: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async export ({ dispatch, commit }, id) {
    let response

    commit(Mutate.transaction.isExporting, true)

    try {
      response = await Transaction.export(id)

      commit(Mutate.transaction.pdf, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      commit(Mutate.transaction.isExporting, false)
    }
  },
  clearPdf ({ commit }) {
    commit(Mutate.transaction.pdf, null)
  }
}

const mutations = {
  [Mutate.transaction.all] (state, response) {
    state.list = _get(response, 'data.transactionList', [])
    state.listFiltered = state.list
  },
  [Mutate.transaction.one] (state, response) {
    const transaction = _get(response, 'data.transaction', null)
    const index = transaction ? _findIndex(state.list, ['id', transaction.id]) : null

    if (_isNumber(index) && index !== -1) Vue.set(state.list, index, transaction)
    else if (transaction) state.list.unshift(transaction)
  },
  [Mutate.transaction.description] (state, { id, description }) {
    const index = id ? _findIndex(state.list, ['id', id]) : null
    let transaction = _isNumber(index) && index !== -1 ? state.list[index] : null

    if (transaction) {
      transaction.descr = description
      Vue.set(state.list, index, transaction)
    }
  },
  [Mutate.transaction.isExporting] (state, bool) {
    state.isExporting = bool
  },
  [Mutate.transaction.pdf] (state, pdf) {
    state.pdf = _get(pdf, 'data', null)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
