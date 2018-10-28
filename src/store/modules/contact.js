import * as Mutate from '@/store/mutations'
import { Contact } from '@/api/rest'
import { _get, _findIndex, _isNumber, _assign } from '@/utils/lodash'
import Vue from 'vue'

const state = {
  book: []
}

const getters = {
  book: state => state.book
}

const actions = {
  async getAll ({ dispatch, commit }) {
    let response

    try {
      response = await Contact.getAll()

      commit(Mutate.contact.all, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async get ({ dispatch, commit }, id) {
    let response

    try {
      response = await Contact.get(id)

      commit(Mutate.contact.one, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async create ({ dispatch, commit }, { name, address }) {
    let response, id

    try {
      response = await Contact.create(name)
      id = _get(response, 'data.contact.id', null)

      if (_isNumber(id) && address) dispatch('addAddress', { id, address })
      else commit(Mutate.contact.one, response)

      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async update ({ dispatch, commit }, contact) {
    let response

    try {
      response = await Contact.update(contact)

      commit(Mutate.contact.one, response)

      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async deleteContact ({ dispatch, commit }, id) {
    let response

    try {
      dispatch('status/setLoading', true, { root: true })
      response = await Contact.delete(id)

      if (response.data === 'OK') commit(Mutate.contact.delete, id)

      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) {
      dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true })
    } finally { dispatch('status/setLoading', false, { root: true }) }
  },
  async addAddress ({ dispatch, commit }, { id, address }) {
    let response

    try {
      response = await Contact.address.add(id, address)

      commit(Mutate.contact.address, { id, response })
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async deleteAddress ({ dispatch, commit }, { id, idAddress }) {
    let response

    try {
      response = await Contact.address.delete(id, idAddress)

      if (response.data === 'OK') commit(Mutate.contact.address, { id, response, idAddress })

      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  },
  async updateDescription ({ dispatch, commit }, { id, description }) {
    let response

    try {
      response = await Contact.updateDescription(id, description)

      commit(Mutate.contact.one, response)
      dispatch('status/changeMessage', { response, type: 'success' }, { root: true })
    } catch (e) { dispatch('status/changeMessage', { response: e, type: 'error' }, { root: true }) }
  }
}

const mutations = {
  [Mutate.contact.all] (state, response) {
    state.book = _get(response, 'data.contactList', [])
  },
  [Mutate.contact.one] (state, response) {
    const contact = _get(response, 'data.contact', null)
    const index = contact ? _findIndex(state.book, ['id', contact.id]) : null

    if (_isNumber(index) && index !== -1) Vue.set(state.book, index, _assign(state.book[index], contact))
    else if (contact) state.book.push(contact)
  },
  [Mutate.contact.delete] (state, id) {
    const index = _findIndex(state.book, ['id', id])

    if (_isNumber(index) && index !== -1) Vue.delete(state.book, index)
  },
  [Mutate.contact.address] (state, { id, response, idAddress }) {
    let newAddress
    const index = _findIndex(state.book, ['id', id])
    const address = _get(response, 'data.address', null)

    if (address === null && idAddress) Vue.delete(state.book[index].addressList, _findIndex(state.book[index].addressList, ['id', idAddress]))
    else {
      newAddress = { id: address.id, address: address.value, currency: address.symbol || address.currency }

      if (_isNumber(index) && index !== -1) {
        if (!state.book[index].addressList) Vue.set(state.book[index], 'addressList', [newAddress])
        else Vue.set(state.book[index], 'addressList', state.book[index].addressList.concat([newAddress]))
      }
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
