<template>
  <el-dialog
    :visible.sync="show"
    :before-close="handleClose"
    :title="title"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    custom-class="dialog send"
    center>
    <img
      :src="assetIcon"
      class="currency-icon"
      @error="(e) => { e.target.src = getRandomSrcToken(asset) }">

    <el-form
      ref="sendForm"
      :model="model"
      :rules="rules">
      <el-form-item
        id="actions"
        :class="{ 'focused': addressIsFocused }"
        label="Wallet Address"
        prop="address">
        <el-input
          ref="address"
          v-model="model.address"
          class="input-address"
          @focus="addressIsFocused = true"
          @blur="addressIsFocused = !!model.address"
          @input="debounceInputAddress">
          <div
            v-if="!isDark"
            slot="suffix"
            class="input-actions">
            <img
              src="../../assets/images/qr.svg"
              class="icon-button qr"
              @click="$eventHub.$emit('popup:qr-code', model.address, qrCodeDataUrl)">

            <img
              src="../../assets/images/copy.svg"
              class="icon-button"
              @click="copyToClipboard(model.address, 'actions')">
          </div>

          <div
            v-else
            slot="suffix"
            class="input-actions dark">
            <img
              src="../../assets/images/qr-white.svg"
              class="icon-button qr"
              @click="$eventHub.$emit('popup:qr-code', model.address, qrCodeDataUrl)">

            <img
              src="../../assets/images/copy-white.svg"
              class="icon-button"
              @click="copyToClipboard(model.address, 'actions')">
          </div>
        </el-input>
      </el-form-item>

      <el-form-item
        v-loading="convertedCurrency === 'USD'"
        :class="{ 'focused': cryptoIsFocused }"
        :label="`${currentCrypto} Amount`"
        prop="crypto">
        <el-input
          v-model="model.crypto"
          @focus="cryptoIsFocused = true"
          @blur="cryptoIsFocused = !!(model.crypto || model.crypto === 0)"
          @input="debounceInputCrypto(crypto, 'USD')"/>
      </el-form-item>

      <el-form-item
        v-loading="convertedCurrency === currentCrypto"
        :class="{ 'focused': fiatIsFocused }"
        label="USD Amount"
        prop="fiat">
        <el-input
          v-model="model.fiat"
          @focus="fiatIsFocused = true"
          @blur="fiatIsFocused = !!(model.fiat || model.fiat === 0)"
          @input="debounceInputFiat('USD', crypto)"/>
      </el-form-item>

      <el-form-item
        v-if="false"
        :class="{ 'focused': messageIsFocused }"
        label="Message to Recipient"
        prop="message">
        <el-input
          v-model="model.message"
          @focus="messageIsFocused = true"
          @blur="messageIsFocused = !!model.message"/>
      </el-form-item>
    </el-form>

    <div class="card-wrapper">
      <el-card
        class="card"
        shadow="never">
        <div
          slot="header"
          class="card-header clearfix">
          Fees
        </div>

        <el-row class="choice">
          <el-col
            v-loading="costsLoading"
            :class="['block', { selected: isSelected.low }]"
            @click.native="selectBlock('low')">
            <i
              v-if="isSelected.low"
              class="material-icons md-dark md-18 ok">
              check_circle_outline
            </i>

            <div class="title">
              LOW
              <i class="material-icons md-dark md-16">warning</i>
            </div>

            <div class="description">
              {{ costs('low') }} {{ crypto }}
              <div class="estimate">
                (estimate 30 min and more)
              </div>
            </div>
          </el-col>

          <el-col
            v-loading="costsLoading"
            :class="['block', { selected: isSelected.medium }]"
            @click.native="selectBlock('medium')">
            <i
              v-if="isSelected.medium"
              class="material-icons md-dark md-18 ok">
              check_circle
            </i>

            <div class="title">MEDIUM</div>

            <div class="description">
              {{ costs('medium') }} {{ crypto }}
              <div class="estimate">
                (estimate ~5 min)
              </div>
            </div>
          </el-col>

          <el-col
            v-loading="costsLoading"
            :class="['block', { selected: isSelected.high }]"
            @click.native="selectBlock('high')">
            <i
              v-if="isSelected.high"
              class="material-icons md-dark md-18 ok">
              check_circle_outline
            </i>

            <div class="title">HIGH</div>

            <div class="description">
              {{ costs('high') }} {{ crypto }}
              <div class="estimate">
                (estimate ~2 min)
              </div>
            </div>
          </el-col>
        </el-row>

        <el-row>
          <el-col>Mining fee {{ costs(currentSpeed, 'USD') }} USD ({{ costs(currentSpeed) }} {{ crypto }})</el-col>
        </el-row>
      </el-card>
    </div>

    <span
      slot="footer"
      class="dialog-footer">
      <el-form>
        <el-form-item>
          <el-button
            :disabled="!canSubmit"
            type="primary"
            class="dialog-button"
            @click="send">
            Send
          </el-button>
        </el-form-item>
      </el-form>
    </span>
  </el-dialog>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { _debounce, _find, _get } from '@/utils/lodash'
import copyAddressMixin from '@/mixins/copy-address'
import currencyMixin from '@/mixins/currency'
import cryptoMixin from '@/mixins/crypto'
import validateMixin from '@/mixins/validate'

export default {
  mixins: [copyAddressMixin, currencyMixin, cryptoMixin, validateMixin],
  props: {
    showSend: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      show: false,
      currentCrypto: 'ETH',
      activeName: 'address',
      qrCodeDataUrl: null,
      assetId: null,
      model: {
        address: '',
        crypto: '',
        fiat: '',
        message: ''
      },
      rules: {
        address: [
          { validator: (rule, value, callback) => this.validate('address', value, callback, { currency: this.crypto }), trigger: 'blur' }
        ],
        crypto: [
          { validator: (rule, value, callback) => this.validate('amount', value, callback), trigger: 'blur' }
        ],
        fiat: [
          { validator: (rule, value, callback) => this.validate('amount', value, callback), trigger: 'blur' }
        ]
      },
      isSelected: {
        low: true,
        medium: false,
        high: false
      },
      addressIsFocused: false,
      cryptoIsFocused: false,
      fiatIsFocused: false,
      messageIsFocused: false,
      convertedCurrency: null,
      enterPassword: false,
      defaultCosts: {
        low: {
          'ETH': 0.000021,
          'BTC': 0.000021,
          'USD': 0.02
        },
        medium: {
          'ETH': 0.00042,
          'BTC': 0.00042,
          'USD': 0.02
        },
        high: {
          'ETH': 0.000105,
          'BTC': 0.000105,
          'USD': 0.04
        }
      },
      costsLoading: false,
      form: null
    }
  },
  computed: {
    ...mapGetters({
      assets: 'wallet/assets',
      user: 'auth/user',
      currentRate: 'wallet/currentRate',
      transactionCost: 'wallet/transactionCost',
      password: 'wallet/password',
      isDark: 'auth/isDark'
    }),
    canSubmit () {
      return this.model.address &&
        this.model.crypto &&
        this.model.fiat &&
        this.validateFieldsSequence(this.model, this.form, ['address', 'crypto', 'fiat'])
    },
    title () {
      return `Send ${this.currentCrypto}`
    },
    id () {
      return this.assetId !== null ? this.assetId : this.$route.params.id
    },
    asset () {
      return _find(this.assets, ['id', +this.id]) || null
    },
    assetIcon () {
      if (this.assetType === 'token') return this.getSrcToken(this.asset)
      else return this.cryptoSrc
    },
    assetType () {
      return _get(this.asset, 'type', null)
    },
    crypto () {
      return this.assetType === 'token' ? 'ETH' : this.currentCrypto
    },
    costs () {
      const costs = this.transactionCost && this.transactionCost.low ? this.transactionCost : this.defaultCosts

      return (speed, currency = this.crypto) => costs[speed][currency] ? this.fixCrypto(costs[speed][currency]) : this.defaultCosts[speed][currency]
    },
    currentSpeed () {
      return Object.keys(this.isSelected).find(key => this.isSelected[key] === true)
    }
  },
  watch: {
    currentRate (newVal) {
      if (this.convertedCurrency === 'USD') this.model.crypto = this.fixCrypto(newVal)
      else this.model.fiat = this.fixFiat(newVal)

      this.convertedCurrency = null
    },
    'model.fiat' (newVal) {
      if (newVal || newVal === 0) this.fiatIsFocused = true
    },
    'model.crypto' (newVal) {
      if (newVal || newVal === 0) this.cryptoIsFocused = true
    },
    'model.address' (newVal) {
      if (newVal && newVal.length > 25) this.generateQrCodeDataUrl(newVal, 'qrCodeDataUrl')
    },
    password () {
      if (this.enterPassword) {
        if (!this.show) this.show = true
        else this.send()
      }
    },
    show (newVal) {
      if (newVal) this.getCost()
    },
    user (newVal) {
      if (!newVal) this.handleClose()
    }
  },
  mounted () {
    this.$eventHub.$on('popup:send', async (crypto, address, assetId) => {
      this.model.address = address || ''
      this.currentCrypto = crypto
      this.assetId = assetId || null

      this.addressIsFocused = this.model.address !== ''

      if (!this.password) {
        this.$eventHub.$emit('popup:password:enter')
        this.enterPassword = true
      } else {
        this.show = true
        setTimeout(() => {
          this.form = this.$refs.sendForm
          return this.model.address && this.$refs.address ? this.$refs.address.focus() : null
        }, 100)
      }
    })
  },
  methods: {
    ...mapActions({
      convertRate: 'wallet/convertRate',
      getTransactionCost: 'wallet/getTransactionCost',
      sendCurrency: 'wallet/sendCurrency'
    }),
    handleClose () {
      this.show = false

      if (this.$refs.sendForm) this.$refs.sendForm.resetFields()

      this.addressIsFocused = this.cryptoIsFocused = false
      this.fiatIsFocused = this.messageIsFocused = false
      this.convertedCurrency = null
      this.enterPassword = false
      this.convertRate({ from: null })
      this.model.fiat = ''
      this.assetId = null
    },
    selectBlock (block) {
      for (const key in this.isSelected) {
        if (key !== block) this.isSelected[key] = false
      }

      this.isSelected[block] = true
    },
    debounceInputFiat: _debounce(function (from, to) { this.checkRate(from, to) }, 400),
    debounceInputCrypto: _debounce(function (from, to) { this.checkRate(from, to) }, 400),
    debounceInputAddress: _debounce(function () { if (this.assetType === 'token') this.getCost() }, 400),
    async checkRate (fromSymbol, toSymbol) {
      const amount = fromSymbol === 'USD' ? this.model.fiat : this.model.crypto
      const from = this.assetType === 'token' && toSymbol === 'USD' ? this.asset.address : fromSymbol
      const to = this.assetType === 'token' && fromSymbol === 'USD' ? this.asset.address : toSymbol

      this.convertedCurrency = fromSymbol

      if (from && to && !isNaN(+amount)) await this.convertRate({ from, to, amount })
      else if (amount === this.model.fiat) this.model.fiat = 0
      else this.model.crypto = 0

      if (this.assetType === 'token') this.getCost()
    },
    async getCost () {
      const assetType = this.assetType
      const currency = this.crypto
      const token = _get(this.asset, 'address', null)
      const address = this.model.address && this.model.address !== '' ? this.model.address : null
      const amount = this.model.crypto && Number(this.model.crypto) > 0 ? this.model.crypto : null
      const password = this.password || null

      if (assetType === 'token' && !(currency && token && address && amount && password)) return false
      else if (!currency) return false

      this.costsLoading = true

      if (assetType === 'token') await this.getTransactionCost({ currency, token, address, amount, password })
      else await this.getTransactionCost({ currency })

      this.costsLoading = false
    },
    send () {
      const id = this.id
      const speed = Object.keys(this.isSelected).find(key => this.isSelected[key] === true)
      const password = this.password

      if (password) {
        const data = { to: this.model.address, value: this.model.crypto, speed }

        this.sendCurrency({ id, data, password })
        this.enterPassword = false
        this.handleClose()
      } else {
        this.$eventHub.$emit('popup:password:enter')
        this.enterPassword = true
      }
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/partials/variables";

.dialog.send {

  .el-tabs__nav {
    margin-left: 40px !important;
  }

  #tab-email {
    margin-right: 10px;
  }

  .card-wrapper {
    height: 180px;
    margin-bottom: 20px;

    .card {
      width: 100%;
      position: absolute;
      left: 0;
      text-align: center;
      font-weight: 400;
      font-size: $--font-size-small;
      background-color: #fafbfc;
      border: 0;
      border-top: 1px solid #e8eaeb;
      border-bottom: 1px solid #e8eaeb;

      .card-header {
        font-size: $--font-size-large;
        font-weight: 500;
        line-height: normal;
        letter-spacing: 0.2px;
        text-align: center;
      }

      .choice {
        padding: 0 0 20px 0;

        .block {
          position: relative;
          width: 133px;
          padding: 10px;
          margin-left: 25px;
          text-align: left;
          border: 1px solid $--color-gray-light;
          font-weight: 400;
          cursor: pointer;

          &:hover {
            background-color: rgba(255, 255, 255, .1);
          }

          &.disabled {
            cursor: not-allowed;
            opacity: .4;
          }

          .ok.material-icons {
            position: absolute;
            top: -9px;
            right: -9px;
            width: 18px;
            z-index: 2;
          }

          .title {
            color: $--color-gray;
            font-size: $--font-size-base;

            .material-icons {
              color: $--color-gray-light !important;
              vertical-align: middle;
              margin-left: 6px;
              margin-top: -3px;
            }
          }

          .description {
            color: $--color-gray-light;
            font-size: $--font-size-smallest;
            margin-top: 8px;

            .estimate {
              font-size: $--font-size-xxs;
            }
          }

          &.selected {
            color: $--color-orange !important;
            border-color: $--color-orange;

            &::after {
              content: "";
              position: absolute;
              right: -7px;
              top: -7px;
              border-radius: 50%;
              width: 14px;
              height: 14px;
              background-color: #fafbfc;
              z-index: 1;
            }

            .description, .title, .material-icons {
              color: $--color-orange !important;
            }
          }
        }

        @media (max-width: 660px) {
            display: flex;
            width: 100%;

          .block {
            width: 26%;
            margin-left: 20px;
            flex: 1;

            &:first-child {
              margin-left: 10px;
            }

            .title {
              font-size: 14px;
            }
          }
        }
      }
    }
  }

  .dialog-button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1.4px;
  }

  .input-address {
    font-size: $--font-size-small;

    .input-actions {
      margin-top: 16px;

      .icon-button {
        width: 20px;
        height: 20px;
        margin-right: 4px;
        opacity: 0.5;
        cursor: pointer;

        &:hover {
          opacity: 1;
        }

        .qr {
          margin-right: 4px;
        }
      }
    }
  }

  .dialog-footer {
    font-size: 14px;

    .footer-button.text {
      font-size: 14px;
    }
  }

  .el-dialog__footer {
    @media (max-width: 360px) {
      padding-top: 30px;
    }
  }

  @media (max-width: 660px) {
    .input-address {
      .input-actions {
        margin-top: 5px;
      }
    }
  }
}
</style>
