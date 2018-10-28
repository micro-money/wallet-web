import { expect } from 'chai'
import _ from 'lodash'

const Done = function (fn) {
  let self = this
  let called = false

  this.trigger = function (params) {
    if (called) {
      // console.warn('done has already been called')
      return
    }

    fn.apply(self, arguments)
    called = true
  }
}

export const testAction = (
  {
    action,
    payload,
    state,
    expectedMutations,
    expectedDispatches,
    done
  }
) => {
  const doneWrap = new Done(done)
  const actionPayload = payload
  let countMutations = 0
  let countDispatches = 0

  let commit = (type, payload) => {
    let mutation = expectedMutations[countMutations]

    try {
      // check if commit function is invoked with expected args
      expect(mutation.type).to.equal(type)
      if (payload) {
        expect(mutation.payload.data).to.eql(payload.data)
      }

      countMutations++
      // check if all mutations have been dispatched
      if (countMutations >= expectedMutations.length) {
        done()
      }
    } catch (error) {
      doneWrap.trigger(error)
    }
  }

  let dispatch = (type, payload, from) => {
    // if we want to track other actions calls
    if (expectedDispatches) {
      let dispatch = expectedDispatches[countDispatches]

      countDispatches++

      try {
        const status = _.get(payload, 'response.response.status', null)
        const expectedStatus = _.get(dispatch, 'payload.response.status', null)
        const error = _.get(payload, 'response', null)
        const expectedError = _.get(dispatch, 'error', null)

        expect(dispatch.type).to.equal(type)

        if (error instanceof Error && expectedError) {
          expect(expectedError).to.equal(error.toString())
        }

        if (status && expectedStatus) {
          expect(expectedStatus).to.equal(status)
        }

        /*
          todo: compare payloads i.e. message etc.
          if (payload) {
            expect(dispatch.payload).to.eql(payload)
          }
        */

        if (countDispatches >= expectedDispatches.length && !expectedMutations) {
          doneWrap.trigger()
        }
      } catch (error) {
        doneWrap.trigger(error)
      }
    }
  }

  if (!expectedMutations && !expectedDispatches) {
    expect(countMutations).to.equal(0)
    doneWrap.trigger()
  } else {
    action({ dispatch, commit, state }, actionPayload)
  }
}
