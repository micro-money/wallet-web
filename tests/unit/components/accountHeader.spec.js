import { expect } from 'chai'
import { shallowMount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuex from 'vuex'
import ElementUI from 'element-ui'
import AccountHeader from '@/components/account-header.vue'
import { user, walletCurrent } from '../../fixtures'
import sinon from 'sinon'

Vue.use(ElementUI)

const localVue = createLocalVue()

localVue.use(Vuex)

describe('AccountHeader.vue', () => {
  let store
  let actions

  let isDark = false
  const spyLogout = sinon.spy()

  beforeEach(() => {
    actions = {
      'auth/logout': spyLogout
    }
    store = new Vuex.Store({
      actions,
      getters: {
        'wallet/current': () => walletCurrent,
        'auth/isDark': () => isDark,
        'auth/user': () => user.user
      }
    })
  })

  it('should render mobile view', () => {
    const wrapper = shallowMount(AccountHeader, {
      store,
      localVue,
      computed: { $isTabletView: () => true }
    })

    expect(wrapper.find('.material-icons.menu').text()).to.include('menu')
  })

  it('should render desktop view', () => {
    const wrapper = shallowMount(AccountHeader, {
      store,
      localVue,
      computed: { $isTabletView: () => false }
    })

    expect(wrapper.find('.menu-button.name').text()).to.include('arrow_drop_down')
  })

  it('should set Dark theme', () => {
    isDark = true
    const wrapper = shallowMount(AccountHeader, { store,
      localVue,
      computed: { $isTabletView: () => false }
    })

    expect(wrapper.find('.logo').attributes().src).to.include('logo-light')
  })

  it('should set Light theme', () => {
    isDark = false
    const wrapper = shallowMount(AccountHeader, { store,
      localVue,
      computed: { $isTabletView: () => false }
    })

    expect(wrapper.find('.logo').attributes().src).to.include('logo-dark')
  })

  it('balance should be 2 signs fixed', () => {
    const wrapper = shallowMount(AccountHeader, { store,
      localVue,
      computed: { currentWallet: () => ({ balance: 30.0112132 }) }
    })

    expect(wrapper.find('.balance').text()).to.include('30.01')
  })

  it('balance should be zero', () => {
    const wrapper = shallowMount(AccountHeader, { store,
      localVue,
      computed: { currentWallet: () => ({ balance: null }) }
    })

    expect(wrapper.vm.balance).to.be.eq(0)
  })

  it('test balance is a string', () => {
    const wrapper = shallowMount(AccountHeader, { store,
      localVue,
      computed: { currentWallet: () => ({ balance: 'aaaaa' }) }
    })

    expect(wrapper.vm.balance).to.be.eq(0)
  })

  it('is logout calling', () => {
    const wrapper = shallowMount(AccountHeader, { store,
      localVue
    })

    wrapper.vm.logout()
    expect(spyLogout.called).to.be.eq(true)
  })
})
