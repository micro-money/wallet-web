import { expect } from 'chai'
import { shallowMount } from '@vue/test-utils'
import Vue from 'vue'
import ElementUI from 'element-ui'
import LandingHeader from '@/components/landing-header.vue'
import { user } from '../../fixtures'

Vue.use(ElementUI)

describe('LandingHeader.vue', () => {
  let wrapper

  describe('Unauthorized', () => {
    beforeEach(() => {
      wrapper = shallowMount(LandingHeader, {
        propsData: { user: null }
      })
    })

    it('should contain log-in link', () => {
      expect(wrapper.text()).to.include('Log In Wallet')
    })
  })

  describe('Authorized', () => {
    const userModel = user.user

    beforeEach(() => {
      wrapper = shallowMount(LandingHeader, {
        propsData: { user: userModel }
      })
    })

    it('should not contain log-in link', () => {
      expect(wrapper.text()).not.to.include('Log In Wallet')
    })

    it('should contain user menu', () => {
      expect(wrapper.find('.name').text()).to.include(userModel.displayName || userModel.email || userModel.givenName)
    })
  })
})
