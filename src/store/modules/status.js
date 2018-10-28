import * as Mutate from '@/store/mutations'
import { _get } from '@/utils/lodash'
import Vue from 'vue'

const state = {
  message: null,
  loading: false,
  errors: null,
  loadingInstances: {
    asset: []
  }
}

const getters = {
  message: state => state.message,
  loading: state => state.loading,
  errors: state => state.errors,
  loadingAssets: state => state.loadingInstances.asset.length
}

const actions = {
  async changeMessage ({ commit }, { response, type }) {
    const errors = _get(response, 'response.data.errors', null)
    let message = _get(response, 'message', null)

    if (type === 'error') {
      console.error(response)

      if (errors) {
        message = errors.map(item => { return `${item.param}: ${item.msg}` }).join('\n')

        commit(Mutate.status.errors, errors)
      } else if (message === 'Request failed with status code 403') message = 'Wrong login or password!'
      else message = 'Something went wrong...'
    }

    if (message && message !== 'Request failed with status code 401') commit(Mutate.status.message, { message: message, type: type })
  },
  setLoading ({ commit }, bool) { commit(Mutate.status.loading, bool) },
  setLoadingInstance ({ commit }, { instance, status }) { commit(Mutate.status.loadingInstance, { instance, status }) }
}

const mutations = {
  [Mutate.status.message] (state, params) {
    state.message = params
  },
  [Mutate.status.loading] (state, bool) {
    state.loading = bool
  },
  [Mutate.status.errors] (state, errors) {
    state.errors = errors
  },
  [Mutate.status.loadingInstance] (state, { instance, status }) {
    if (!state.loadingInstances[instance]) { Vue.set(state.loadingInstances, instance, []) }
    if (status) {
      Vue.set(state.loadingInstances[instance], state.loadingInstances[instance].length, status)
    } else Vue.delete(state.loadingInstances[instance], state.loadingInstances[instance].length - 1)
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
