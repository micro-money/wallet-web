import { expect, apiRestMock, testAction } from '../utils/testStore'

import { user as userModel } from '../../fixtures'
import { auth as mutation } from '../../../src/store/mutations'
import auth from '../../../src/store/modules/auth.js'

describe('Store auth.js', () => {
  let state

  describe('Mutations', () => {
    beforeEach(() => {
      state = {
        user: null,
        isDark: false
      }
    })
    describe('user', () => {
      it('response is ok, should change state to object', () => {
        auth.mutations[mutation.user](state, { data: userModel })
        expect(state.user).to.eql(userModel.user)
      })

      it('bad response, set user object to null', () => {
        auth.mutations[mutation.user](state, { wrong: 'response' })
        expect(state.user).to.eql(null)
      })
    })

    describe('isDark', () => {
      it('theme must become dark', () => {
        auth.mutations[mutation.isDark](state, true)
        expect(state.isDark).to.eql(true)
      })

      it('theme must become light', () => {
        auth.mutations[mutation.isDark](state, false)
        expect(state.isDark).to.eql(false)
      })
    })
  })

  describe('Actions', () => {
    beforeEach(() => {
      apiRestMock.reset()
      state = {
        user: null
      }
    })

    describe('signInByEmail', () => {
      const endpoint = `${process.env.VUE_APP_PATH}api/v2/users/auth/email`

      it('success signin should send user object', done => {
        const payload = {
          email: 'test@email.ru',
          password: 'k6h76Jnm'
        }
        const expectedMutations = [
          {
            type: 'user',
            payload: {
              data: userModel
            }
          }
        ]

        apiRestMock.onPost(endpoint).reply(200, userModel)
        testAction({action: auth.actions['signInByEmail'], payload, state, expectedMutations, done})
      })

      it('wrong user or password drops 403 error and call message', done => {
        const payload = {
          email: 'test@email.r',
          password: 'k6h76Jn'
        }

        const expectedDispatches = [
          {
            type: 'status/setLoading',
            payload: true
          },
          {
            type: 'status/changeMessage',
            payload: {response: {status: 403}, type: 'error'}
          },
          {
            type: 'status/setLoading',
            payload: false
          }
        ]

        apiRestMock.onPost(endpoint).reply(403)
        testAction({action: auth.actions['signInByEmail'], payload, state, expectedDispatches, done})
      })

      it('network error drops error and call message', done => {
        const payload = {
          email: 'test@email.r',
          password: 'k6h76Jn'
        }

        const expectedDispatches = [
          {
            type: 'status/setLoading',
            payload: true
          },
          {
            type: 'status/changeMessage',
            error: 'Error: Network Error'
          },
          {
            type: 'status/setLoading',
            payload: false
          }
        ]

        apiRestMock.onPost(endpoint).networkError()
        testAction({action: auth.actions['signInByEmail'], payload, state, expectedDispatches, done})
      })
    })
  })
})
