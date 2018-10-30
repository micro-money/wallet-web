<template>
  <div class="new-token">
    <el-form
      ref="addToken"
      :model="model"
      :rules="rules">
      <el-form-item
        :class="{ 'focused': addressIsFocused }"
        label="Enter token name or token contract address"
        prop="address">
        <el-autocomplete
          ref="address"
          v-model="model.symbol"
          :fetch-suggestions="runSearchToken"
          :select-when-unmatched="false"
          :debounce="400"
          :trigger-on-focus="true"
          @focus="addressIsFocused = true"
          @input="handleInput"
          @select="handleSelect"
          @blur="handleBlur">
          <span
            v-if="model.address && model.address !== model.name"
            slot="prefix">
            <img
              :src="getSrcToken(model)"
              class="currency-icon"
              @error="(e) => { e.target.src = getRandomSrcToken(model) }">
          </span>
          <span
            v-if="model.address && model.address !== model.name"
            slot="suffix">
            {{ formatHash(model.address) }}
          </span>
          <template slot-scope="scope">
            <el-row class="suggested-tokens">
              <el-col
                :span="16">
                <span class="image">
                  <img
                    :src="getSrcToken(scope.item)"
                    class="currency-icon"
                    @error="(e) => { e.target.src = getRandomSrcToken(scope.item) }">
                </span>
                {{ scope.item.symbol }}
                <span
                  v-if="scope.item.name!==scope.item.symbol"
                  class="name">{{ scope.item.name }}</span>
              </el-col>
              <el-col
                :span="8">
                {{ formatHash(scope.item.address) }}
              </el-col>
            </el-row>
          </template>
        </el-autocomplete>
      </el-form-item>

      <el-form-item class="dialog-checkbox">
        <el-checkbox
          v-model="model.terms"
          class="agree">
          <span class="with">Agree with</span>
          <el-button
            type="text"
            @click="$eventHub.$emit('popup:terms')">
            Terms of Service and Privacy Policy
          </el-button>
        </el-checkbox>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="!canAdd"
          type="primary"
          class="dialog-button"
          @click="startImport">
          Add token
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from 'vuex'
import cryptoMixin from '@/mixins/crypto'
import validateMixin from '@/mixins/validate'
import { _get } from '@/utils/lodash'

export default {
  mixins: [cryptoMixin, validateMixin],
  props: {
    enterPassword: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      addressIsFocused: false,
      model: {
        value: null,
        name: null,
        address: null,
        terms: true
      },
      rules: {
        address: [
          { validator: (rule, value, callback) =>
            this.validateDebounced('address', this.model.address, callback,
              { currency: 'ETH',
                message: 'Please select a token from the list or enter a valid smart-contract address'
              }
            ),
          trigger: 'change' }
        ],
        name: [
          { validator: (rule, value, callback) => this.validate('required', value, callback, { message: 'Please enter name of the asset' }), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapState('wallet', { password: 'password', wallet: 'current' }),
    ...mapGetters({
      foundedTokens: 'wallet/foundedTokens'
    }),
    canAdd () {
      return this.model.name && this.model.address && this.isFieldsValid(this.$refs.addToken)
    }
  },
  watch: {
    password () {
      if (this.enterPassword && this.wallet.password && this.password) this.startImport()
    }
  },
  methods: {
    ...mapActions({
      importToken: 'wallet/importToken',
      searchToken: 'wallet/searchToken'
    }),
    async startImport () {
      if (this.password) {
        try {
          const query = { name: this.model.name, currency: 'ETH', token: this.model.address }

          this.$message({ message: 'Importing...', type: 'success' })

          await this.importToken({ data: query, password: this.password })

          this.$emit('update:enterPassword', false)
          this.$emit('close')
        } catch (e) { }
      } else {
        this.$eventHub.$emit('popup:password:enter')
        this.$emit('update:enterPassword', true)
      }
    },
    async runSearchToken (text, cb) {
      try {
        if (text && text.length >= 2) {
          await this.searchToken(text)

          cb(Object.values(this.foundedTokens))
        } else {
          cb([]) // eslint-disable-line standard/no-callback-literal
        }
      } catch (e) {
        cb([]) // eslint-disable-line standard/no-callback-literal
      }
    },
    handleSelect (token) {
      this.model = { ...this.model, ...token }
      this.model.name = token.symbol

      this.addressIsFocused = !!this.model.address
    },
    handleInput (address) {
      if (/^(0x)?[0-9a-f]{40}$/i.test(address.trim())) {
        this.model.address = address
        this.model.name = address
      } else this.model.address = null
    },
    handleBlur: function () {
      this.addressIsFocused = !!_get(this.$refs, 'address.value', '')

      if (!this.model.address) {
        this.searchToken()
        this.$refs.addToken.resetFields()
        this.$refs.addToken.clearValidate()
      }
    }
  }
}
</script>

<style lang="scss">
.new-token {
  margin-top: 20px;

  .dialog-checkbox {
    margin-bottom: 10px !important;
    margin-top: 30px !important;
  }

  .el-input__prefix {
    padding: 27px 0 0 15px;

    .currency-icon {
      width: 20px;
      height: 20px;
    }
  }

  .el-input__suffix {
    padding: 22px 20px 0 0;
    font-size: 14px;
  }

  .agree {
    button {
      max-width: 100%;
      white-space: normal;
      text-align: left;
      padding-top: 2px;
    }
  }

  @media (max-width: 505px) {
    .el-checkbox__label {
      display: inline-grid !important;
    }
  }

  @media (max-width: 400px) {
    .el-form-item .el-form-item__label {
      padding-left: 0;
      left: 16px;
      line-height: 22px;
      text-align: left;
    }
  }
  @media (max-width: 350px) {
    .el-form-item.focused .el-form-item__label {
      font-size: 10px;
    }
  }
}

.suggested-tokens {
  .el-col {
    .image {
      display: inline-block;
      vertical-align: middle;
      padding: 6px 6px 0 0;

      .currency-icon {
        width: 20px;
        height: 20px;
      }
    }
  }

  .el-col:first-child {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .el-col:last-child {
    text-align: right;
    font-size: 14px;
  }

}
</style>
