import { expect, sinon, shallowMount, shallowMountOptions } from '../../utils/testComponent'
import showPassword from '@/components/modals/show-password.vue'
import { user } from '../../../fixtures'

let spyGetPassword = sinon.spy()
let spySetPassword = sinon.spy()

let storeMock = Object.seal({
  actions: {
    'wallet/getPassword': spyGetPassword,
    'wallet/setPassword': spySetPassword
  },
  getters: {
    'wallet/password': () => 'testPassword123',
    'auth/user': () => user.user
  }
})

const options = (_options) => shallowMountOptions(storeMock, _options)

describe('showPassword.vue', () => {
  it('should render password', () => {
    const password = 'password'
    const wrapper = shallowMount(showPassword, options({
      getters: {
        'auth/user': () => ({ secret: password, ...user.user })
      }
    })
    )

    expect(wrapper.find('.password').text()).to.eq(password)
  })

  it('is call setMnemonic on close', () => {
    const wrapper = shallowMount(showPassword, options())

    wrapper.vm.handleClose()
    expect(spySetPassword.called).to.be.eq(true)
  })
})
