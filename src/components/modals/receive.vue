<template>
  <div class="dialogs">
    <el-dialog
      :visible.sync="isVisible.address"
      :before-close="handleClose"
      :title="title"
      :width="!fullscreen ? '530px' : 'auto'"
      :fullscreen="fullscreen"
      custom-class="dialog tabs tabs-modal receive"
      center>
      <img
        :src="assetIcon"
        class="currency-icon"
        @error="(e) => { e.target.src = getRandomSrcToken(asset) }">

      <el-tabs v-model="activeName">
        <el-tab-pane
          label="By Address"
          name="address">
          <el-form
            ref="receiveForm"
            :model="model"
            :rules="rules">
            <el-form-item
              v-if="assetOwners.length <= 1"
              id="actions"
              :class="{ 'focused': addressIsFocused }"
              label="Wallet Address"
              prop="address">
              <el-input
                v-model="model.address"
                class="input-address"
                @focus="addressIsFocused = true"
                @blur="addressIsFocused = !!model.address">
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
              v-else
              :class="{ 'select': true, 'focused': addressIsFocused }"
              label="Address"
              prop="address">
              <el-select
                v-model="model.address"
                class="select"
                value-key="id"
                placeholder="Choose address"
                no-data-text="-"
                @focus="addressIsFocused = true">
                <el-option
                  v-for="(owner, index) in assetOwners"
                  :key="index"
                  :label="owner[0]"
                  :value="owner[0]"
                  class="currency-option small">
                  <img
                    :src="getAssetSrc(asset)"
                    class="currency-icon small">
                  <span class="name">{{ owner[0] }}</span>
                </el-option>
              </el-select>
              <div
                class="select-input-actions">
                <img
                  :src="getIcon('qr')"
                  class="icon-button qr"
                  @click="$eventHub.$emit('popup:qr-code', model.address, qrCodeDataUrl)">

                <img
                  :src="getIcon('copy')"
                  class="icon-button"
                  @click="copyToClipboard(model.address, 'actions')">
              </div>
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
              label="Description"
              prop="message">
              <el-input
                v-model="model.message"
                @focus="messageIsFocused = true"
                @blur="messageIsFocused = !!model.message"/>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <el-tab-pane
          name="phone"
          disabled>
          <span slot="label">By Phone
            <el-badge
              value="coming soon"
              class="coming-soon"/>
          </span>
        </el-tab-pane>

        <el-tab-pane
          name="email"
          disabled>
          <span slot="label">By Email
            <el-badge
              value="coming soon"
              class="coming-soon"/>
          </span>
        </el-tab-pane>
      </el-tabs>

      <span
        slot="footer"
        class="dialog-footer">
        <el-form>
          <el-form-item>
            <el-button
              :disabled="!canSubmit"
              type="primary"
              class="dialog-button"
              @click="nextStep('result', 'address')">
              Receive
            </el-button>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>

    <el-dialog
      id="receive-qr-code"
      :visible.sync="isVisible.result"
      :before-close="handleClose"
      :title="title"
      :width="!fullscreen ? '530px' : ''"
      :fullscreen="fullscreen"
      custom-class="dialog tabs receive result"
      center>
      <img
        :src="assetIcon"
        class="currency-icon"
        @error="(e) => { e.target.src = getRandomSrcToken(asset) }">

      <el-card
        v-if="model.address"
        shadow="never"
        class="card currencies">
        <div class="crypto">
          {{ fixCrypto(model.crypto) }} {{ currentCrypto }}
        </div>

        <div class="fiat">
          {{ fixFiat(model.fiat) }} USD
        </div>
      </el-card>

      <el-card
        v-if="model.address"
        shadow="never"
        class="card code">
        <img
          v-if="qrCodeDataUrl"
          :src="qrCodeDataUrl"
          class="qr-code">

        <el-card
          shadow="never"
          class="card address"
          @click.native="copyToClipboard(model.address, 'receive-qr-code')">
          {{ model.address }}
          <img
            :src="getIcon('copy')"
            class="icon-button">
        </el-card>
      </el-card>

      <span
        slot="footer"
        class="dialog-footer">
        <el-form>
          <el-form-item>
            <el-button
              type="primary"
              class="dialog-button"
              @click="handleClose">
              Ok
            </el-button>
          </el-form-item>
        </el-form>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import { _debounce, _find, _get } from '@/utils/lodash'
import copyAddressMixin from '@/mixins/copy-address'
import currencyMixin from '@/mixins/currency'
import cryptoMixin from '@/mixins/crypto'
import themeIcons from '@/mixins/theme-icons'
import validateMixin from '@/mixins/validate'

export default {
  mixins: [copyAddressMixin, currencyMixin, cryptoMixin, themeIcons, validateMixin],
  props: {
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
      isVisible: {
        address: false,
        result: false
      },
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
      addressIsFocused: false,
      cryptoIsFocused: false,
      fiatIsFocused: false,
      messageIsFocused: false,
      convertedCurrency: null,
      form: null
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      assets: 'wallet/assets',
      currentRate: 'wallet/currentRate',
      isDark: 'auth/isDark'
    }),
    title () {
      return `Receive ${this.currentCrypto}`
    },
    canSubmit () {
      return this.model.address && this.model.crypto && this.model.fiat && this.validateFieldsSequence(this.model, this.form, ['address', 'crypto', 'fiat'])
    },
    assetId () {
      return this.$route.params.id || null
    },
    asset () {
      return _find(this.assets, ['id', +this.assetId]) || null
    },
    assetIcon () {
      const assetType = _get(this.asset, 'type', null)

      if (assetType === 'token') return this.getSrcToken(this.asset)
      else return this.cryptoSrc
    },
    assetOwners () {
      const owner = _get(this.asset, 'owner', null)

      if (owner) {
        return Object.keys(owner).map(key => [key.toString(), owner[key]])
      } else return []
    },
    crypto () {
      const assetType = _get(this.asset, 'type', null)

      return (assetType === 'token' ? 'ETH' : this.currentCrypto)
    }
  },
  watch: {
    show (newVal) {
      if (newVal) this.isVisible.address = true
    },
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
    user (newVal) {
      if (!newVal) this.handleClose()
    }
  },
  created () {
    this.$eventHub.$on('popup:receive', (address, crypto) => {
      this.model.address = this.assetOwners.length > 0 ? this.assetOwners[0][0] : address
      this.currentCrypto = crypto
      this.addressIsFocused = true
      this.show = true

      setTimeout(() => { this.form = this.$refs.receiveForm }, 100)
    })
  },
  methods: {
    ...mapActions({
      convertRate: 'wallet/convertRate'
    }),
    nextStep (next, prev) {
      this.isVisible[next] = true
      this.isVisible[prev] = false
    },
    handleClose () {
      this.show = false

      for (const key in this.isVisible) this.isVisible[key] = false

      if (this.$refs.receiveForm) this.$refs.receiveForm.resetFields()

      this.addressIsFocused = this.cryptoIsFocused = false
      this.fiatIsFocused = this.messageIsFocused = false
      this.convertedCurrency = null
      this.convertRate({ from: null })
    },
    debounceInputFiat: _debounce(function (from, to) { this.checkRate(from, to) }, 400),
    debounceInputCrypto: _debounce(function (from, to) { this.checkRate(from, to) }, 400),
    async checkRate (from, to) {
      const amount = from === 'USD' ? this.model.fiat : this.model.crypto

      this.convertedCurrency = from

      if (from && to && !isNaN(+amount)) await this.convertRate({ from, to, amount })
      else if (amount === this.model.fiat) this.model.fiat = 0
      else this.model.crypto = 0

      this.convertedCurrency = null
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/partials/variables";

.dialog.receive {

  .el-tabs__nav-scroll {
    margin-left: 55px;
  }

  .el-tab-pane {
    margin-left: 0 !important;

    .coming-soon {

      &.hide {
        opacity: 0;
      }
    }

    .el-badge {
      margin-right: 0 !important;
    }
  }

  .el-tabs__content {
    .coming-soon {
      margin-top: 0;
      margin-left: 25px !important;
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

  .select {
    .el-input__inner {
      font-size: $--font-size-small;
    }
  }

  .select-input-actions {
    position: absolute;
    right: 25px;
    top: 17px;
    cursor: pointer;

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

  &.result {

    .el-dialog__body {
      margin-top: 0;
      padding-bottom: 30px;
    }

    .qr-code {
      width: 250px;
      height: 250px;
      border: 1px solid $--color-gray-light;
    }

    .card {
      background: $--color-gray-super-light;
      margin-bottom: 0;

      &.currencies {

        .crypto {
          font-size: $--font-size-large;
          margin-bottom: 20px;
          text-align: center;
        }

        .fiat {
          font-size: $--font-size-medium;
          text-align: center;
        }
      }

      &.code {
        text-align: center;

        .address {
          cursor: pointer;
          margin-top: 20px;
          margin-bottom: 0;
        }
      }

      .icon-button {
        opacity: 0.5;
        vertical-align: middle;
        height: 18px;
        padding-bottom: 3px;

        &:hover {
          opacity: 1;
        }
      }

      .el-card__body {
        font-size: 15px;
      }
    }
  }

  .dialog-footer {
    font-size: 14px;

    .footer-button.text {
      font-size: 14px;
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
