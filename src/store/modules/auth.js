import * as Mutate from '@/store/mutations'
import { Auth, VueAuth } from '@/api/rest'
import { _get } from '@/utils/lodash'

const state = {
  user: null,
  isDark: !!localStorage.getItem('isDark')
}

const getters = {
  user: state => state.user,
  isDark: state => state.isDark
}

const actions = {
  async signUpByEmail ({ dispatch, commit }, { email, password }) {
    const name = ''
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.register({ name, email, password })

      commit(Mutate.auth.user, response)
      dispatch('wallet/setPassword', password, { root: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async signInByEmail ({ dispatch, commit }, { email, password }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.login({ email, password })

      commit(Mutate.auth.user, response)
      dispatch('wallet/setPassword', password, { root: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async signInOrSignup ({ dispatch, commit }, { email, password }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.register({ name: '', email, password })

      commit(Mutate.auth.user, response)
      dispatch('wallet/setPassword', password, { root: true })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      if (/\s409/.test(e.message)) dispatch('signInByEmail', { email, password })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async signInBySocialsToken ({ dispatch, commit }, { network, token, id }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })
      response = await Auth.socialAuth(network, token, id)

      commit(Mutate.auth.user, response)
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async signInByDisposableToken ({ dispatch, commit }, token) {
    let response
    let newToken

    try {
      dispatch('status/setLoading', true, { root: true })

      VueAuth.setToken({ token })
      response = await Auth.getUser()
      newToken = _get(response, 'data.token', null)

      if (newToken) {
        VueAuth.setToken({ token: newToken })
        commit(Mutate.auth.user, response)
      }
    } catch (e) {
      VueAuth.logout()
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async viaFacebook ({ dispatch, commit }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.authenticate('facebook')

      commit(Mutate.auth.user, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async viaGoogle ({ dispatch, commit }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.authenticate('google')

      commit(Mutate.auth.user, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async viaKakao ({ dispatch, commit }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.authenticate('kakao')

      commit(Mutate.auth.user, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async viaLinkedin ({ dispatch, commit }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.authenticate('linkedin')

      commit(Mutate.auth.user, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async viaWeibo ({ dispatch, commit }) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await VueAuth.authenticate('weibo')

      commit(Mutate.auth.user, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async sendEmail ({ dispatch, commit }, email) {
    let response

    try {
      response = await Auth.sendEmail(email)

      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    }
  },
  async confirmEmail ({ dispatch, commit }, token) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })

      response = await Auth.confirm(token)

      return response
    } catch (e) {
    } finally {
      dispatch('status/setLoading', false, { root: true })
    }
  },
  async getUser ({ dispatch, commit }) {
    if (VueAuth.isAuthenticated()) {
      let response

      try {
        response = await Auth.getUser()

        commit(Mutate.auth.user, response)
        dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
      } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
    }
  },
  logout ({ commit }) {
    VueAuth.logout()

    commit(Mutate.auth.user, null)
    commit('wallet/password', null, { root: true })
    commit('wallet/assets', {}, { root: true })
    commit('wallet/current', null, { root: true })
    commit('wallet/transaction/list', null, { root: true })
    commit('transaction/all', null, { root: true })
    commit('contact/all', null, { root: true })

    localStorage.tabs = 0
  },
  changeTheme ({ commit }, bool) {
    commit(Mutate.auth.isDark, bool)
  }
}

const mutations = {
  [Mutate.auth.user] (state, response) {
    state.user = _get(response, 'data.user', null) || _get(response, 'data', null)
  },
  [Mutate.auth.isDark] (state, bool) {
    state.isDark = bool
    if (bool) { localStorage.setItem('isDark', bool) } else { localStorage.removeItem('isDark') }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
