import { _debounce } from '@/utils/lodash'

const rules = {
  required: (value, { message }) => {
    if (!value || value === '') throw new Error(`${message || 'Please enter value'}`)
  },
  password: (value) => {
    const regexp = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{8,100}$/

    if (!value || value === '') throw new Error('Please enter a password')
    if (value.search(regexp) === -1) throw new Error('The pass must be at least 8 characters long and contain: 1 digit, 1 capital letter')
  },
  password_with_confirm: (value, { message, confirmField, form }) => {
    const fieldName = confirmField || 'confirmPassword'
    let field

    rules.password(value)

    if (form && form.validateField) {
      field = form.fields.filter(field => field.prop === fieldName)[0]

      if (field && field.fieldValue) form.validateField(fieldName)
    }
  },
  password_confirm: (value, { password }) => {
    if (value === '') throw new Error('Please enter your password again')
    else if (value !== password) throw new Error('Passwords don\'t match!')
  },
  email: (value) => {
    const regexp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ // eslint-disable-line no-useless-escape

    if (!value || value === '') throw new Error('Please enter your email')
    if (value.search(regexp) === -1) throw new Error('Please enter a valid email')
  },
  mnemonic: (value) => {
    let words, filtered, unique

    if (!value || value === '') throw new Error('Please enter mnemonic words')

    words = value.split(/(\s+)/).filter((w) => w.trim() !== '')
    filtered = words.filter((w) => w.length > 2)
    unique = [...new Set(words)]

    if (words.length !== 12 || unique.length !== 12 || filtered.length !== 12) throw new Error('Enter 12 unique words of 3 letters each at least')
  },
  privateKey: (value, { currency }) => {
    if (!value || value === '') throw new Error('Please enter your private key')
    if (currency === 'BTC' && value.trim().length !== 64) throw new Error('Please enter a correct private key')
    if (currency !== 'BTC' && value.trim().length !== 64) throw new Error('Please enter a correct private key')
  },
  keystore: (value) => {
    if (!value || value === '') throw new Error('Please enter keystore')
    try {
      JSON.parse(value)
    } catch (e) {
      throw new Error('Please enter a valid Keystore')
    }
  },
  address: (value, { currency, message }) => {
    if (!value || value === '') throw new Error(`${message || 'Please input address'}`)
    // if (currency === 'BTC' && !/^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(value.trim())) throw new Error('Please enter a correct BTC address')
    if (currency === 'BTC' && !/^\S{27,34}$/.test(value.trim())) throw new Error('Please enter a correct BTC address')
    else if (currency !== 'BTC' && !/^(0x)?[0-9a-f]{40}$/i.test(value.trim())) throw new Error(`Please enter a correct ETH address`)
  },
  json: (value, { message }) => {
    try {
      JSON.parse(value)
    } catch (e) {
      throw new Error(`${message || 'Please enter a valid data'}`)
    }
  },
  amount: (value) => {
    const regexp = /^\d+(\.\d+)?$/

    if (!value || value === '') throw new Error('Please input amount')
    if (value.search(regexp) === -1) throw new Error('The amount value must be greater than 0')
  }
}

let debounceInterval = 400

export default {
  methods: {
    validate (rule, value, callback, data) {
      try {
        rules[rule](value, data)
        callback()
      } catch (e) {
        callback(e)
      }
    },

    validateDebounced: _debounce(function (rule, value, callback, data) {
      this.validate(rule, value, callback, data)
    }, debounceInterval),

    /**
     * Form validation when we need to call standard `validateField` method
     * i.e. to change field statuses
     *
     * @param model
     * @param form
     * @param fields
     * @returns {boolean}
     */
    validateFieldsSequence (model, form, fields) {
      let validateFields = true

      if (form) {
        validateFields = fields.every((fieldName) => {
          let result

          if (model[fieldName]) {
            form.validateField(fieldName, (error) => { result = error.length === 0 })
            return result
          } else return false
        })
      }

      return validateFields
    },

    /**
     * Fields are already checked but we need to get the whole Form state
     * @param form
     * @returns {boolean}
     */
    isFieldsValid (form) {
      if (!form || !form.fields) return

      return form.fields.every((field) => field.validateState !== 'error')
    }
  }
}
