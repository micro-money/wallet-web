import { expect, sinon, shallowMount, shallowMountOptions } from './utils/testComponent'
import { user, walletCurrent } from '../fixtures'
import App from '@/App.vue'
import LandingHeader from '@/components/landing-header.vue'
import AccountHeader from '@/components/account-header.vue'

let storeMock = Object.seal({
  actions: {
    'auth/getUser': () => null
  },
  getters: {
    'status/message': () => null,
    'wallet/assets': () => null,
    'socket/isConnected': () => true,
    'socket/isSubscribed': () => true,
    'status/errors': () => null,
    'wallet/current': () => walletCurrent,
    'auth/isDark': () => false,
    'auth/user': () => user.user
  }
})

const defaultRoute = { path: '/', query: { verify: null } }
const options = (_options) => shallowMountOptions(storeMock, { route: defaultRoute, ..._options })

const optionsNotLogined = () =>
  options({
    route: { path: '/', query: { verify: null } },
    getters: {
      'auth/user': () => null
    }
  })

const optionsLogined = (_options) =>
  options({
    route: { path: '/account', query: { verify: null } },
    ..._options
  })

describe('App.vue', () => {
  let _options

  it('should render', () => {
    const wrapper = shallowMount(App, options({}))

    expect(wrapper.find('#app').exists()).to.be.equal(true)
  })

  /**
   * Cases group: Not authenticated user
   */
  describe('Not logined', () => {
    beforeEach(() => {
      _options = optionsNotLogined()
    })

    it('should be landing-header', () => {
      const wrapper = shallowMount(App, _options)

      expect(wrapper.find(LandingHeader).exists()).to.be.equal(true)
    })
  })

  /**
   * Cases group: Authenticated user
   */
  describe('Logined', () => {
    beforeEach(() => {
      _options = optionsLogined
    })

    it('should be account-header', () => {
      const wrapper = shallowMount(App, _options({}))

      expect(wrapper.find(AccountHeader).exists()).to.be.equal(true)
    })
  })

  /**
   * Cases group: test watchers
   */
  describe('Watchers', () => {
    beforeEach(() => {
      _options = optionsLogined
    })

    it('currentWallet: on value change modal with generated password should open', () => {
      const localThis = {
        user: {
          some: 'data',
          secret: '1234567'
        },
        show: {password: false}
      }

      App.watch.currentWallet.call(localThis)

      expect(localThis.show.password).to.be.equal(true)
    })

    it('message: should show message on status/message change', () => {
      const localThis = { '$message': () => {} }
      const message = { message: 'Sample Message', type: 'message' }

      sinon.spy(localThis, '$message')
      App.watch.message.call(localThis, message)

      expect(localThis['$message'].callCount).to.be.equal(1)
      expect(localThis['$message'].calledWith(message)).to.be.true
    })

    it('$route: should call checkRoute method on route change', () => {
      const localThis = { 'checkRoute': () => {} }

      sinon.spy(localThis, 'checkRoute')
      App.watch['$route'].call(localThis, { path: '/old' }, { path: '/new' })

      expect(localThis.checkRoute.callCount).to.be.equal(1)
    })

    it('assets: should call checkRoute method on assets change', () => {
      const localThis = { 'checkRoute': () => {} }

      sinon.spy(localThis, 'checkRoute')
      App.watch.assets.call(localThis)

      expect(localThis.checkRoute.callCount).to.be.equal(1)
    })
  })
})
