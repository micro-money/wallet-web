import * as Mutate from '@/store/mutations'
import { VueAuth, Socket } from '@/api/rest'
import { _get, _find } from '@/utils/lodash'

const state = {
  isConnected: false,
  isSubscribed: false
}

const getters = {
  isConnected: state => state.isConnected,
  isSubscribed: state => state.isSubscribed
}

const actions = {
  subscribe ({ dispatch, commit }, { data, callback }) {
    data = {}

    try {
      Socket.subscribe(data, callback)
      commit(Mutate.socket.isSubscribed, true)
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
      commit(Mutate.socket.isSubscribed, false)
    }
  },
  getEvent ({ dispatch, commit, rootState }, { event, callback }) {
    try {
      event = 'wallet'
      callback = response => {
        const transactionList = _get(response, '[1].data', null) || _get(response, 'data', null)
        let transaction
        let notifyMessages
        let amountField

        if (transactionList && transactionList.length) {
          for (let key in transactionList) {
            transaction = transactionList[key]
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
          }
        }
      }

      Socket.getEvent(event, callback)
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  connect ({ dispatch, commit }) {
    if (VueAuth.isAuthenticated()) {
      try {
        Socket.setToken(window.localStorage['vue-authenticate.token'])
        Socket.connect({
          onConnect: () => { commit(Mutate.socket.isConnected, true) },
          onReconnect: (socket) => { commit(Mutate.socket.isConnected, true) },
          onDisconnect: (socket) => {
            socket._raw.io._reconnection = true
            socket._raw.io._reconnectionAttempts = 10
            commit(Mutate.socket.isConnected, false)
            commit(Mutate.socket.isSubscribed, false)
          }
        })
      } catch (e) {
        dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
        commit(Mutate.socket.isConnected, false)
      }
    }
  },
  disconnect ({ dispatch, commit }) {
    if (!VueAuth.isAuthenticated()) {
      try {
        Socket.disconnect()
      } catch (e) {
        dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
      } finally {
        commit(Mutate.socket.isConnected, false)
        commit(Mutate.socket.isSubscribed, false)
      }
    }
  }
}

const mutations = {
  [Mutate.socket.isConnected] (state, bool) {
    state.isConnected = bool
  },
  [Mutate.socket.isSubscribed] (state, bool) {
    state.isSubscribed = bool
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
