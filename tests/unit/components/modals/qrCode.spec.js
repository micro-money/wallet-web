import { expect, shallowMount, shallowMountOptions } from '../../utils/testComponent'
import qrCode from '@/components/modals/qr-code.vue'

let storeMock = Object.seal({
  getters: {
    'auth/isDark': () => false
  }
})

describe('qrCode.vue', () => {
  let options, wrapper

  beforeEach(() => {
    options = shallowMountOptions(storeMock, { props: { showQrCode: true } })
    wrapper = shallowMount(qrCode, options)
  })

  it('should render qr code', () => {
    expect(wrapper.find('#qr-code').attributes().visible).to.be.eq('true')
  })

  it('should contain address', () => {
    const address = '0x000'

    wrapper.setData({ address })
    expect(wrapper.find('.card').text()).to.be.eq(address)
  })
})
