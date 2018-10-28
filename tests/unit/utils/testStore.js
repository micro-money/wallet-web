import chai, { expect } from 'chai'
import sinonChai from 'sinon-chai'
import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import { testAction } from './testUtils'

chai.use(sinonChai)
let apiRestMock = new MockAdapter(axios)

export {
  expect,
  apiRestMock,
  testAction,
  axios
}
