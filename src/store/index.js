import Vue from 'vue'
import Vuex from 'vuex'
import auth from './modules/auth'
import wallet from './modules/wallet'
import contact from './modules/contact'
import status from './modules/status'
import transaction from './modules/transaction'
import socket from './modules/socket'
import widget from './modules/widget'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    auth,
    wallet,
    status,
    contact,
    transaction,
    socket,
    widget
  },
  strict: debug
})
