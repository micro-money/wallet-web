import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import sinon from 'sinon'
const { expect } = require('chai').use(require('chai-style'))

Vue.use(ElementUI)

const localVue = createLocalVue()
const EventBus = new Vue()
const GlobalPlugins = {
  install (v) {
    v.prototype.$eventHub = EventBus
  }
}

localVue.use(GlobalPlugins)
localVue.use(Vuex)

/**
 * Utility to manage `options` parameter for `shallowMount` function
 * need almost always in Vue-components unit tests
 * @see https://vue-test-utils.vuejs.org/api/options.html#context
 *
 * @param storeMock
 * @param route
 * @param actions
 * @param getters
 * @param props
 * @returns {{store: Store, localVue: VueConstructor, stubs: string[], mocks: {$route, $router}}}
 */
const shallowMountOptions = (storeMock, { route, actions, getters, props } = {}) => {
  const $router = { push: () => null }
  let $route = { path: '/', query: {} }
  let store
  let storeContent = storeMock

  if (route) $route = { ...$route, ...route }
  if (actions) storeContent.actions = { ...storeContent.actions, ...actions }
  if (getters) storeContent.getters = { ...storeContent.getters, ...getters }

  store = new Vuex.Store(storeContent)
  return {
    store,
    localVue,
    stubs: ['router-link', 'router-view'],
    mocks: { $route, $router },
    propsData: props || {}
  }
}

export {
  expect,
  shallowMount,
  localVue,
  sinon,
  Vue,
  Vuex,
  shallowMountOptions
}
