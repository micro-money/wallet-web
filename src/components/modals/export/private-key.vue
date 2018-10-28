<template>
  <div v-loading="loading">
    <template v-if="privateKey.length > 0">
      <template v-if="!multipleKeys">
        <el-card
          id="key"
          :class="['card', { gray: !isDark }]"
          shadow="never">
          <div
            slot="header"
            class="card-header clearfix">
            Private Key
          </div>
          {{ lastPrivateKey }}
        </el-card>

        <el-form>
          <el-form-item>
            <el-button
              type="primary"
              class="dialog-button"
              @click="copyToClipboard(lastPrivateKey, 'key')">
              COPY PRIVATE KEY
            </el-button>
          </el-form-item>

          <el-form-item>
            <el-button
              class="dialog-button"
              @click="downloadAsText">
              DOWNLOAD AS TEXT
            </el-button>
          </el-form-item>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer" />
      </template>

      <template v-else>
        <el-table
          id="pk"
          :data="privateKey"
          style="width: 100%"
          class="table">
          <el-table-column
            prop="address"
            width="150"
            label="Address"
            class-name="address">
            <template slot-scope="scope">
              {{ formatHash(scope.row.address) }}
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
            prop="privateKey"
            width="330"
            label="Private Key"
            class-name="key"/>

          <el-table-column
            width="50">
            <template slot-scope="scope">
              <img
                :src="getIcon('copy')"
                class="icon-button"
                @click="copyToClipboard(scope.row.privateKey, 'pk')">
            </template>
          </el-table-column>
        </el-table>

        <div
          slot="footer"
          class="dialog-footer">
          <el-button
            class="multi-dialog-button"
            @click="downloadAsText">
            DOWNLOAD AS TEXT
          </el-button>
        </div>
      </template>
    </template>
    <template v-else-if="!loading">
      There is no private keys to export. <br><br>Perhaps you added this asset only for "Watch"
      <div
        slot="footer"
        class="dialog-footer" />
    </template>
  </div>
</template>

<script>
import currencyMixin from '@/mixins/currency'
import cryptoMixin from '@/mixins/crypto'
import copyAddressMixin from '@/mixins/copy-address'
import themeIconsMixin from '@/mixins/theme-icons'
import { mapActions, mapGetters } from 'vuex'
import { _get, _find } from '@/utils/lodash'

export default {
  mixins: [currencyMixin, cryptoMixin, copyAddressMixin, themeIconsMixin],
  props: {
    id: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      enterPassword: false,
      loading: true
    }
  },
  computed: {
    ...mapGetters({
      password: 'wallet/password',
      privateKey: 'wallet/privateKey',
      isDark: 'auth/isDark',
      assets: 'wallet/assets'
    }),
    lastPrivateKey () {
      const index = this.privateKey.length - 1

      return _get(this.privateKey, `[${index}].privateKey`, '')
    },
    multipleKeys () {
      return this.privateKey.length > 1
    },
    asset () {
      const id = this.id || this.$route.params.id

      return _find(this.assets, ['id', +id]) || null
    }
  },
  watch: {
    password () {
      if (this.enterPassword && this.password) this.getPrivateKey()
    }
  },
  created () {
    if (this.password) {
      if (this.privateKey.length === 0) this.getPrivateKey()
    } else {
      this.$eventHub.$emit('popup:password:enter')
      this.enterPassword = true
    }
  },
  methods: {
    ...mapActions({ exportKeys: 'wallet/exportKeys' }),
    async getPrivateKey () {
      this.loading = true
      await this.exportKeys({ id: this.id, password: this.password, type: 'privateKey' })
      this.loading = false
    },
    downloadAsText () {
      if (this.lastPrivateKey) {
        let blob
        let multi
        let link = document.createElement('a')

        if (this.multipleKeys) {
          multi = 'Address\tPrivate key\r\n'
          multi += this.privateKey.map(row => row.address + '\t' + row.privateKey).join('\r\n')
          blob = new Blob([multi], { type: 'text/plain' })
        } else blob = new Blob([this.lastPrivateKey], { type: 'text/plain' })

        link.download = 'private-key'
        link.href = window.URL.createObjectURL(blob)
        link.click()
      }
    }
  }
}
</script>

<style lang="scss">
@import "./../../../assets/partials/variables";

.multi {

  &.dialog {
    width: 730px !important;

    .el-dialog__header {
      padding: 30px 0 30px 0;
    }
    .el-dialog__body {
      padding: 0 !important;
    }

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
    }

    .address {
      padding-left: 10px;
    }

    .icon-button {
      width: 16px;
      opacity: 0.6;
      cursor: pointer;
    }

    .icon-button:hover {
      opacity: 1;
    }

    .dialog-button {
      width: 30%;
      text-align: right;
    }

    .multi-dialog-button {
      margin-right: 20px;
    }

    .dialog-footer {
      text-align: right;
    }

    .el-dialog__footer {
      padding-right: 20px;
    }

    @media (max-width: 600px) {
      width: 100% !important;

      .balance {
        display: none;
      }

      colgroup {
        display: none;
      }

      table {
        width: 100% !important;
        font-size: 11px;

        .address {
          width: 40%;
        }

        .key {
          width: 50%;
        }

        .cell {
          font-size: $--font-size-small !important;
        }
      }

     .dialog-footer {
        text-align: center;
      }
    }
  }
}

.single {
  &.dialog {
    width: 530px;
  }
}

.dark {
  .multi {
    &.dialog {

      .el-table {
        background-color: transparent !important;
      }

      .el-table th, .el-table tr,.el-table td {
        background-color: transparent !important;
        color: $--color-gray-light;
      }
    }
  }
}
</style>
