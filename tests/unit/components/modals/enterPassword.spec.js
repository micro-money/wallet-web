import { expect, sinon, shallowMount, shallowMountOptions } from '../../utils/testComponent'
import enterMnemonic from '@/components/modals/enter-password.vue'
import { user, walletCurrent } from '../../../fixtures'

let spyAction = sinon.spy()

let storeMock = Object.seal({
  actions: {
    'wallet/setPassword': spyAction
  },
  getters: {
    'wallet/current': () => walletCurrent.wallet,
    'wallet/password': () => 'testPassword123',
    'auth/user': () => user.user
  }
})

describe('enterMnemonic.vue', () => {
  let options, wrapper

  beforeEach(() => {
    options = shallowMountOptions(storeMock)
    wrapper = shallowMount(enterMnemonic, options)

    sinon.stub(wrapper.vm, 'handleClose')
  })

  afterEach(() =>
    spyAction.resetHistory()
  )

  it('is setPassword called', () => {
    wrapper.setData({ model: { password: 'testPassword123' } })
    wrapper.vm.submit()
    expect(spyAction.called).to.be.equal(true)
  })

  it('is setPassword not called with empty password', () => {
    wrapper.setData({ model: { password: '' } })
    wrapper.vm.submit()
    expect(spyAction.called).to.be.equal(false)
  })
})
