import { expect, shallowMount, shallowMountOptions } from '../../utils/testComponent'
import { user } from '../../../fixtures'
import confirmEmailNotice from '@/components/ui/confirm-email-notice.vue'

const options = (_options) => shallowMountOptions(storeMock, { ..._options })

let storeMock = Object.seal({
  actions: {
    'auth/sendEmail': () => null
  },
  getters: {
    'auth/user': () => user.user
  }
})

describe('confirm-email-notice.vue', () => {
  let _options

  beforeEach(() => {
    _options = (currentOptions) => options({
      route: { path: '/account', query: { verify: null } },
      ...currentOptions
    })
  })

  describe('Email not confirmed', () => {
    it('should show notification after 2.5s', function (done) {
      const wrapper = shallowMount(confirmEmailNotice, _options({
        getters: {
          'auth/user': () => ({...user.user, confirmed: false})
        }
      }))

      this.timeout(2600)
      expect(wrapper.vm.isEmail).to.be.not.equal(null)
      expect(wrapper.vm.isConfirmed).to.be.equal(false)

      wrapper.vm.checkEmail()

      expect(wrapper.vm.currentKey).to.be.eql('confirm')

      setTimeout(() => {
        expect(wrapper.vm.showHeaderNotice).to.be.equal(true)
        expect(wrapper.find('.header-notice').exists()).to.be.equal(true)
        done()
      }, 2501)
    })

    it('should show Email input if Email is empty', () => {
      const wrapper = shallowMount(confirmEmailNotice, _options({
        getters: {
          'auth/user': () => ({...user.user, confirmed: false, email: null})
        }
      }))

      wrapper.setData({showHeaderNotice: true})

      expect(wrapper.vm.isEmail).to.be.equal(null)
      expect(wrapper.find({ref: 'form-email-send'}).html()).to.not.include('display: none')
    })

    it('should not show Email input if Email is set', () => {
      const wrapper = shallowMount(confirmEmailNotice, _options({
        getters: {
          'auth/user': () => ({...user.user, confirmed: false})
        }
      }))

      wrapper.setData({showHeaderNotice: true})

      expect(wrapper.vm.isEmail).to.be.eql(user.user.email)
      expect(wrapper.find({ref: 'form-email-send'}).html()).to.include('display: none')
    })
  })

  describe('Email confirmed', () => {
    it('should not show notification', function (done) {
      const wrapper = shallowMount(confirmEmailNotice, _options({
        getters: {
          'auth/user': () => ({...user.user, confirmed: true})
        }
      }))

      this.timeout(2600)
      expect(wrapper.vm.isEmail).to.be.equal(user.user.email)

      wrapper.vm.checkEmail()

      setTimeout(() => {
        expect(wrapper.vm.showHeaderNotice).to.be.equal(false)
        expect(wrapper.find('.header-notice').exists()).to.be.equal(false)
        done()
      }, 2501)
    })
  })
})
