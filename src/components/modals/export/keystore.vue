<template>
  <div class="export-keystore">
    <el-tabs
      v-loading="loading"
      v-if="!multipleKeys"
      v-model="activeName">
      <el-tab-pane
        label="Keystore"
        name="keystore">
        <el-alert
          v-show="!passwordEntered || loading || lastKeystore"
          :closable="false"
          class="important"
          title=""
          type="warning">
          <p><strong>Store Offline.</strong><br>
            Please store the Keystore to a safe offline place like a USB drive. Never put it to Internet.</p>
          <p><strong>Don’t Transfer via Internet Tools.</strong><br>
            Don’t use Email/Cloud Storage/Notepad/IM tools to transfer Keystore. It easily gets hacked and result is
            loss.</p>
          <p><strong>Store to Password Vault.</strong><br>
            If you like to store online please make sure some password vault apps, like 1Password/Keypass.</p>
        </el-alert>

        <template
          v-if="!passwordEntered">
          <el-form
            class="pass-form">
            <el-form-item
              :class="{ 'focused': passwordIsFocused }"
              label="Password"
              prop="password">
              <el-input
                v-model="keystorePassword"
                :type="isPassVisible ? 'text' : 'password'"
                @keyup.enter.native="keystorePassword ? passwordEntered = true : () => {}"
                @focus="passwordIsFocused = true"
                @blur="passwordIsFocused = !!keystorePassword">
                <i
                  slot="suffix"
                  class="material-icons md-24 input-suffix"
                  @click="isPassVisible = !isPassVisible">
                  {{ iconVisiblePassword }}
                </i>
              </el-input>

              <div class="item-caption">Enter a password which will be used to encrypt the Keystore. Please save and
              store this password securely, without it you will not be able to use the Keystore.
              </div>
            </el-form-item>

            <el-form-item>
              <el-button
                :disabled="!keystorePassword"
                type="primary"
                class="dialog-button"
                @click="passwordEntered = true">
                Export keystore
              </el-button>
            </el-form-item>
          </el-form>
        </template>

        <template v-else-if="lastKeystore">
          <el-card
            id="keystore"
            :class="['card', { gray: !isDark }]"
            shadow="never">
            <div
              slot="header"
              class="card-header clearfix">
              Keystore
            </div>
            {{ lastKeystore }}
          </el-card>

          <el-button
            class="dialog-button"
            type="primary"
            @click="copyToClipboard(JSON.stringify(lastKeystore), 'keystore')">
            Copy keystore
          </el-button>
        </template>

        <div
          v-else
          class="not-found">
          There is no Keystore to export
        </div>
      </el-tab-pane>

      <el-tab-pane
        :disabled="!passwordEntered || !lastKeystore"
        label="QR code"
        name="qr-code">
        <el-alert
          :closable="false"
          class="important"
          title=""
          type="warning">
          <p><strong>Only for Transport Wallet.</strong><br>
            Forbidden to save/screenshot/take photos of the QR code. It’s convenience to transport wallet to your other
            devices.</p>
          <p><strong>Using in Safe Environment.</strong><br>
            Please make sure nobody and no camera around when using. It may cause irreversible loss if somebody catch
            it.</p>
        </el-alert>

        <img
          v-if="showQr && keystoreQr"
          :src="keystoreQr"
          class="qr-code">

        <el-button
          v-if="!showQr"
          class="dialog-button"
          type="primary"
          @click="showQr = true">
          Show QR code
        </el-button>

        <el-button
          v-else
          class="dialog-button"
          type="primary"
          @click="handleClose">
          OK
        </el-button>
      </el-tab-pane>
    </el-tabs>

    <template v-else-if="keystore[0] && multipleKeys">
      <el-table
        id="keystoreTable"
        :data="keystore"
        style="width: 100%"
        class="table multi">
        <el-table-column
          prop="address"
          width="150"
          label="Address"
          class-name="address">
          <template slot-scope="scope">
            {{ formatHash(scope.row.keystore.address) }}
          </template>
        </el-table-column>

        <el-table-column
          prop="balance"
          width="200"
          label="Balance"
          class-name="balance">
          <template slot-scope="scope">
            <span>{{ fixCrypto(scope.row.balance) }} {{ asset.symbol }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="Keystore"
          class-name="actions"
          width="150">
          <template slot-scope="scope">
            <img
              :src="getIcon('copy')"
              class="icon-button"
              @click="copyToClipboard(JSON.stringify(scope.row.keystore), 'keystoreTable')">
            <img
              :src="getIcon('qr')"
              class="icon-button"
              @click="$eventHub.$emit('popup:qr-code', JSON.stringify(scope.row.keystore), keystoreQr, 'Scan the QR code or copy the Keystore')">
          </template>
        </el-table-column>
      </el-table>

      <div
        slot="footer"
        class="dialog-footer multi">
        <el-button
          class="multi-dialog-button"
          @click="downloadAsText">
          DOWNLOAD AS TEXT
        </el-button>
      </div>
    </template>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import cryptoMixin from '@/mixins/crypto'
import currencyMixin from '@/mixins/currency'
import copyAddressMixin from '@/mixins/copy-address'
import themeIconsMixin from '@/mixins/theme-icons'
import passwordMixin from '@/mixins/password'
import { _get, _find } from '@/utils/lodash'

export default {
  mixins: [copyAddressMixin, cryptoMixin, currencyMixin, themeIconsMixin, passwordMixin],
  props: {
    id: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      enterPassword: false,
      activeName: 'keystore',
      showQr: false,
      keystorePassword: null,
      passwordIsFocused: false,
      passwordEntered: false,
      loading: false,
      keystoreQr: null
    }
  },
  computed: {
    ...mapGetters({
      password: 'wallet/password',
      keystore: 'wallet/keystore',
      assets: 'wallet/assets',
      isDark: 'auth/isDark'
    }),
    lastKeystore () {
      const index = this.keystore.length - 1

      return _get(this.keystore, `[${index}].keystore`, '')
    },
    multipleKeys () {
      return this.keystore.length > 1
    },
    asset () {
      const id = this.id || this.$route.params.id

      return _find(this.assets, ['id', +id]) || null
    }
  },
  watch: {
    passwordEntered () {
      this.getKeystore()
    },
    lastKeystore () {
      this.generateQrCodeDataUrl(JSON.stringify(this.lastKeystore), 'keystoreQr')
    }
  },
  created () {
    if (this.password) {
      this.keystorePassword = null
    } else {
      this.$eventHub.$emit('popup:password:enter')
      this.enterPassword = true
    }
  },
  methods: {
    ...mapActions({ exportKeys: 'wallet/exportKeys' }),
    async getKeystore () {
      this.loading = true
      await this.exportKeys({ id: this.id, password: this.password, type: 'keystore', pass: this.keystorePassword })
      this.loading = false
    },
    downloadAsText () {
      if (this.keystore) {
        let blob
        let multi = ''
        let link = document.createElement('a')

        if (this.multipleKeys) {
          multi += this.keystore.map(row => row.keystore ? JSON.stringify(row.keystore) : '').join('\r\n')
          blob = new Blob([multi], { type: 'text/plain' })
        } else blob = new Blob([this.lastKeystore], { type: 'text/plain' })

        link.download = 'keystore'
        link.href = window.URL.createObjectURL(blob)
        link.click()
      }
    },
    handleClose () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="scss">
@import "./../../../assets/partials/variables";

.export-keystore {
  .pass-form {
    .item-caption {
      margin-top: 10px;
      line-height: 20px;
    }
  }

  .card {
    margin: 0 0 20px 0;
  }

  .qr-code {
    margin-bottom: 20px;
  }

  .multi {
    .el-table__body-wrapper {
      .cell {
        font-size: 15px;
        font-weight: 500;
        text-align: left;
      }
      .key {
        .cell {
          overflow: hidden;
          text-overflow: ellipsis;
          word-break: unset;
        }
      }

      .icon-button {
        width: 20px;
        opacity: 0.6;
        cursor: pointer;
        margin-right: 10px;
      }

      .icon-button:hover {
        opacity: 1;
      }

      .dialog-button {
        width: 30%;
        text-align: right;
      }
    }

    table {
      width: 100% !important;

      colgroup {
        display: none;
      }

      .address {
        width: 30%;
        padding-left: 10px;
      }
      .balance {
        width: 40%;
      }
      .actions {
        width: 30%;
      }
    }

    .actions .cell, th.actions .cell {
        text-align: right !important;
        padding-right: 20px;
    }

    th.actions .cell {
      padding-right: 30px;
    }

    .multi-dialog-button {
      text-align: right;
      margin-right: 20px;
    }

    &.dialog-footer {
      text-align: right;
    }

    @media (max-width: 600px) {

      table {
        width: 100% !important;
        font-size: 11px;

        .address {
          width: 40%;
        }

        .balance {
          width: 40%;
        }

        .cell {
          font-size: $--font-size-small !important;
        }
      }

     &.dialog-footer {
        text-align: center;
      }
    }

    @media (max-width: 320px) {
      .balance {
        display: none;
      }
    }
  }

  .el-tabs__nav-scroll {
    padding-left: 25%;

    @media (max-width: 320px) {
      padding-left: 18%;
    }

    @media (min-width: 321px) and (max-width: 400px) {
      padding-left: 23%;
    }
  }
}

.dark {
  .multi {
      &.el-table {
        background-color: transparent !important;
      }

      &.el-table th, &.el-table tr, &.el-table td {
        background-color: transparent !important;
        color: $--color-gray-light;
      }
  }
}
</style>
