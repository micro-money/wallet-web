import Vue from 'vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import { VueAuthenticate } from 'vue-authenticate'
import socketIOClient from 'socket.io-client'
import sailsIOClient from 'sails.io.js'
import { _find } from '../utils/lodash'

Vue.use(VueAxios, axios)

const apiPath = `${process.env.VUE_APP_PATH}${process.env.VUE_APP_API_ROUTE}`

const get = (url, options) => Vue.axios.get(url, options)
const post = (url, data) => Vue.axios.post(url, data)
const put = (url, data) => Vue.axios.put(url, data)

// todo: remove when api ready

const invoicesFixture = {
  'invoicesList': [
    {
      id: 1,
      address: '0x1E1e8fe83B4e60F1DDa2E7C9e6cC4a2f4Bb4a799',
      description: 'Basic course',
      createdAt: 1528714070783,
      amount: 0.442234,
      amountUsd: 900,
      currency: 'ETH',
      status: 'new',
      service: {
        id: 1,
        title: 'UBAI',
        logo: '1.svg',
        url: 'https://ubai.co'
      }
    },
    {
      id: 2,
      address: '0x123',
      description: 'Advanced course',
      createdAt: 1628714070783,
      amount: 0.51,
      amountUsd: 1200,
      currency: 'ETH',
      status: 'paid',
      service: {
        id: 1,
        title: 'UBAI',
        logo: '1.svg',
        url: 'https://ubai.co'
      },
      transactionList: [
        {
          'createdAt': 1529554388830,
          'updatedAt': 1529554388830,
          'id': 55,
          'hash': '0x4bb5cc25a87c6f9e6a9bce43708b5fcbe08e88f2ee4317fa4aa5f67b5817e671',
          'from': {
            'hash': '0x1e1e8fe83b4e60f1dda2e7c9e6cc4a2f4bb4a799',
            'name': 'Me'
          },
          'to': {
            'hash': '0x73fc08fdf34e96372253cfec258112b94062379f',
            'name': 'NotMe'
          },
          'descr': '',
          'amount': 0.009,
          'status': 'success',
          'currency': 'ETH',
          'asset': 1,
          'rate': {
            'USD': 4.82
          },
          'platform': 'Ethereum',
          'network': 'rinkeby',
          'direction': 'in'
        }
      ]
    }
  ]
}

export const Auth = {
  getUser: () => get(`${apiPath}users/me`),
  url: {
    register: `${apiPath}users`,
    login: `${apiPath}users/auth/email`,
    social: network => { return `${apiPath}users/auth/${network}/callback` }
  },
  confirm: (token) => get(`${apiPath}users/email/confirmation/${token}`),
  sendEmail: (email) => post(`${apiPath}users/email/send`, { email }),
  socialAuth: (network, token, id) => post(`${apiPath}users/auth/${network}/token`, { token, id })
}

export const Contact = {
  getAll: () => {},
  get: () => {},
  create: (name, address) => {},
  update: (contact) => {},
  delete: (id) => {},
  address: {
    add: (id, value) => {},
    update: (id, address, sid) => {},
    delete: (id, sid) => {}
  },
  updateDescription: (id, description) => {}
}

export const Wallet = {
  invoicesFixture, // todo: remove when api ready
  get: () => get(`${apiPath}wallets/me`),
  create: password => post(`${apiPath}wallets`, { password }),
  getPassword: () => get(`${apiPath}wallets/password`),
  convertRate: (from, to, amount) => get(`${apiPath}currencies/converter`, { params: { from, to, amount } }),
  transactionCostCrypto: currency => get(`${apiPath}currencies/transaction/cost`, { params: { currency } }),
  transactionCostToken: (token, address, amount, password) => get(`${apiPath}currencies/transaction/cost/token`, {
    params: {
      token,
      address,
      amount,
      password
    }
  }),
  searchToken: (text) => get(`${apiPath}currencies/address`, { params: { text } })
}

export const Asset = {
  getAll: () => get(`${apiPath}wallets/assets/me`),
  get: id => id > 0 ? get(`${apiPath}wallets/assets/${id}`) : get(`${apiPath}wallets/assets/me`),
  create: (data, password) => post(`${apiPath}wallets/assets`, { ...data, password }),
  update: (id, name) => put(`${apiPath}wallets/assets/${id}`, { name }),
  remove: (id) => post(`${apiPath}wallets/assets/${id}/delete`, {}),
  import: (data, password) => post(`${apiPath}wallets/assets/import`, { ...data, password }),
  export: (id, password, type, pass) => get(`${apiPath}wallets/assets/${id}/export`, {
    params: {
      password,
      type,
      pass
    }
  }),
  send: (id, data, password) => post(`${apiPath}wallets/assets/${id}/transaction`, { ...data, password })
}

export const Transaction = {
  getAll: () => get(`${apiPath}wallets/transactions/me`),
  getForContact: id => get(`${apiPath}wallets/transactions/contacts/${id}`),
  get: id => get(`${apiPath}wallets/transactions/${id}`),
  update: (id, description) => put(`${apiPath}wallets/transactions/${id}`, { descr: description }),
  export: id => get(`${apiPath}wallets/transactions/export`, { params: { asset: id } })
}

export const Invoice = {
  getAll: () => ({ data: invoicesFixture }),
  get: id => ({ data: { invoice: _find(invoicesFixture.invoicesList, ['id', +id], null) } }),
  create: () => {},
  update: () => {},
  remove: () => {}
}

/* Socials
-------------------------- */
export const VueAuth = new VueAuthenticate(Vue.prototype.$http, {
  baseUrl: process.env.VUE_APP_PATH,
  loginUrl: Auth.url.login,
  registerUrl: Auth.url.register,
  tokenName: 'token',
  tokenPrefix: '',

  providers: {
    facebook: {
      clientId: process.env.VUE_APP_FACEBOOK_CLIENT_ID,
      url: Auth.url.social('facebook'),
      redirectUri: Auth.url.social('facebook')
    },
    google: {
      clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
      url: Auth.url.social('google'),
      redirectUri: Auth.url.social('google')
    },
    kakao: {
      clientId: process.env.VUE_APP_KAKAO_CLIENT_ID,
      url: Auth.url.social('kakao'),
      redirectUri: Auth.url.social('kakao'),
      authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
      popupOptions: { width: 500, height: 560 },
      oauthType: '2.0'
    },
    linkedin: {
      clientId: process.env.VUE_APP_LINKEDIN_CLIENT_ID,
      url: Auth.url.social('linkedin'),
      redirectUri: Auth.url.social('linkedin')
    },
    weibo: {
      clientId: process.env.VUE_APP_WEIBO_CLIENT_ID,
      url: Auth.url.social('weibo'),
      redirectUri: Auth.url.social('weibo'),
      authorizationEndpoint: 'https://api.weibo.com/oauth2/authorize',
      popupOptions: { width: 500, height: 560 },
      oauthType: '2.0'
    }
  }
})

/* Socket
-------------------------- */
let io = sailsIOClient(socketIOClient)
let socket = {}

io.sails.useCORSRouteToGetCookie = false
io.sails.autoConnect = false
io.sails.url = process.env.VUE_APP_PATH

Vue.prototype.$socketio = io.socket
Vue.prototype.$sailsio = io.sails

export const Socket = {
  setToken: token => { io.sails.headers = { Authorization: `Bearer ${token}` } },
  connect: ({ onConnect, onReconnect, onDisconnect }) => {
    socket = io.sails.connect()
    socket.on('connect', onConnect)
    socket.on('disconnect', () => { onDisconnect(socket) })
    socket.on('reconnect', () => { onReconnect(socket) })
  },
  disconnect: () => { socket.disconnect() },
  subscribe: (data, callback) => socket.post(`/${process.env.VUE_APP_API_ROUTE}wallets/subscribe`, data, callback),
  getEvent: (event, callback) => socket.on(event, callback)
}
