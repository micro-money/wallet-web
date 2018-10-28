let walletApi = (function (window, document) {
  'use strict'
  const walletUrl = process.env.VUE_APP_PATH
  const el = 'amm-wallet'
  const frameId = 'amm-wallet-iframe'
  let receiveMessage = (e) => { }

  let bindEvent = (element, eventName, eventHandler) =>
    element.addEventListener
      ? element.addEventListener(eventName, eventHandler, false)
      : element.attachEvent ? element.attachEvent('on' + eventName, eventHandler) : null

  bindEvent(window, 'message', (e) => walletUrl.includes(e.origin) ? receiveMessage(e) : null)

  return {
    walletUrl,
    frameId,
    el,

    sendMessage: (data) => {
      const frame = document.getElementById(frameId)

      if (frame) { frame.contentWindow.postMessage(data, walletUrl) }
    },

    onReceiveMessage: (callback) => { receiveMessage = callback },

    signin: ({ email, password, network, token, id }) => {
      if (email) {
        walletApi.sendMessage({ event: 'signInByEmail', payload: { email, password } })
      } else if (network) {
        walletApi.sendMessage({ event: 'signInBySocialsToken', payload: { network, token, id } })
      }
    },

    signup: ({ email, password }) => {
      walletApi.sendMessage({ event: 'signUpByEmail', payload: { email, password } })
    }
  }
}(window, document))

document.addEventListener('DOMContentLoaded', function (event) {
  let elem = document.getElementsByClassName(walletApi.el)
  let ifrm = document.createElement('iframe')

  if (elem) {
    const sitekey = elem[0].dataset.sitekey

    ifrm.setAttribute('src', walletApi.walletUrl + 'index.html?sitekey=' + sitekey)
    ifrm.setAttribute('id', walletApi.frameId)
    ifrm.setAttribute('name', walletApi.frameId)
    ifrm.style.width = '100%'
    ifrm.style.height = '100%'
    elem[0].appendChild(ifrm)
  }
})

window.walletApi = walletApi
