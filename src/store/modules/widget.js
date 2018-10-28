import * as Mutate from '@/store/mutations'

const state = {
  origin: null,
  data: null
}

const getters = {
  message: state => state.data
}

const actions = {
  messageReceive ({ dispatch, commit }, { origin, data }) {
    try {
      // todo: need to control origin! if (~event.origin.indexOf('...')) {
      const { event, payload } = data

      if (typeof this._actions[`widget/${event}`] === 'object') { dispatch(`widget/${event}`, payload, { root: true }) }
      if (!origin.indexOf(window.location.hostname)) commit(Mutate.widget.message, { origin, data })
    } catch (e) { }
  },

  messageSend ({ dispatch, commit }, { event, payload }) {
    window.parent.postMessage({ event, payload }, '*')
  },

  signUpByEmail ({ dispatch, commit }, { email, password }) {
    try {
      dispatch('auth/signUpByEmail', { email, password }, { root: true })
    } catch (e) { }
  },

  signInByEmail ({ dispatch, commit }, { email, password }) {
    try {
      dispatch('auth/signInOrSignup', { email, password }, { root: true })
    } catch (e) { }
  },

  signInBySocialsToken ({ dispatch, commit }, { network, token, id }) {
    dispatch('auth/signInBySocialsToken', { network, token, id }, { root: true })
  }
}

const mutations = {
  [Mutate.widget.message] (state, { origin, data }) {
    state.origin = origin
    state.data = data
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
