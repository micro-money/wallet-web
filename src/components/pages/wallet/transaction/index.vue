<template>
  <el-container
    direction="horizontal"
    class="content">
    <el-card
      v-loading="transactionIsLoading"
      :class="{ 'transaction-info': true, 'mobile': $isTabletView }"
      shadow="never">
      <div
        slot="header"
        class="header clearfix">
        <el-button
          type="text"
          @click="$router.push('/account/wallet')">
          Wallet
        </el-button>
        <span class="breadcrumb"> / Transaction info</span>

        <div class="title">Transaction info</div>
      </div>

      <el-form
        v-if="transaction"
        label-width="220px">
        <el-form-item
          label="Transaction ID"
          class="hash-link">
          <a
            v-if="externalLink"
            :href="externalLink"
            class="external from-hash"
            target="_blank"
            rel="nofollow noopener">
            {{ transaction.hash }}
            <i
              class="material-icons md-22 md-dark">open_in_new</i>
          </a>
          <template v-else>
            {{ transaction.hash }}
          </template>
        </el-form-item>

        <el-form-item label="Date">
          {{ convertTime(transaction.createdAt) }}
        </el-form-item>

        <template v-if="token">
          <el-form-item
            label="Token contract"
            @click.native="copyToClipboard(token.token.hash, 'contract-to-hash')">
            <span
              id="contract-to-hash"
              class="to-hash">
              {{ token.token.hash }}
              <img
                :src="$isTabletView ? getIcon('copy', 'Orange') : getIcon('copy')"
                class="icon-button"
                @click="copyToClipboard(token.token.hash, 'contract-to-hash')">
            </span>
          </el-form-item>

          <el-form-item
            label="From"
            @click.native="copyToClipboard(transaction.from.hash, 'token-from-hash')">
            <span
              v-if="transaction.from.name"
              class="from-name">
              {{ transaction.from.name }}
            </span>

            <span
              id="token-from-hash"
              class="from-hash">
              {{ transaction.from.hash }}
              <img
                :src="$isTabletView ? getIcon('copy', 'Orange') : getIcon('copy')"
                class="icon-button"
                @click="copyToClipboard(transaction.from.hash, 'token-from-hash')">
            </span>
          </el-form-item>

          <el-form-item
            label="To"
            @click.native="copyToClipboard(transaction.to.hash, 'token-to-hash')">
            <span
              v-if="transaction.to.name"
              class="to-name">
              {{ transaction.to.name }}
            </span>

            <span
              id="token-to-hash"
              class="to-hash">
              {{ transaction.to.hash }}
              <img
                :src="$isTabletView ? getIcon('copy', 'Orange') : getIcon('copy')"
                class="icon-button"
                @click="copyToClipboard(transaction.to.hash, 'token-to-hash')">
            </span>
          </el-form-item>

          <el-form-item label="Token amount">
            <span class="amount">
              {{ fixCrypto(token.tokenAmount) }} {{ transaction.symbol || transaction.currency }}
            </span>

            <span class="usd">
              {{ fixFiat(token.tokenRate.USD) }} USD
            </span>
          </el-form-item>

        </template>

        <template v-else>
          <el-form-item
            label="From"
            @click.native="copyToClipboard(transaction.from.hash, 'from-hash')">
            <span
              v-if="transaction.from.name"
              class="from-name">
              {{ transaction.from.name }}
            </span>

            <span
              id="from-hash"
              class="from-hash">
              {{ transaction.from.hash }}
              <img
                :src="$isTabletView ? getIcon('copy', 'Orange') : getIcon('copy')"
                class="icon-button"
                @click="copyToClipboard(transaction.from.hash, 'from-hash')">
            </span>
          </el-form-item>

          <el-form-item
            label="To"
            @click.native="copyToClipboard(transaction.to.hash, 'to-hash')">
            <span
              v-if="transaction.to.name"
              class="to-name">
              {{ transaction.to.name }}
            </span>

            <span
              id="to-hash"
              class="to-hash">
              {{ transaction.to.hash }}
              <img
                :src="$isTabletView ? getIcon('copy', 'Orange') : getIcon('copy')"
                class="icon-button"
                @click="copyToClipboard(transaction.to.hash, 'to-hash')">
            </span>
          </el-form-item>
        </template>

        <el-form-item label="Category">
          <el-select
            value="Unknown"
            disabled/>
        </el-form-item>

        <el-form-item label="TxReceipt Status">
          <span
            v-if="transaction.status === 'success'"
            class="status green">
            <i class="material-icons md-11 green">brightness_1</i> Success
          </span>

          <span
            v-else-if="transaction.status === 'pending'"
            class="status gray">
            <i class="material-icons md-11 gray">access_time</i> Pending
          </span>

          <span
            v-else-if="transaction.status === 'failure'"
            class="status red">
            <i class="material-icons md-11 red">clear</i> Failure
          </span>
        </el-form-item>

        <el-form-item label="Amount">
          <span class="amount">
            {{ fixCrypto(transaction.amount) }} {{ currentCrypto }}
          </span>

          <span class="usd">
            {{ fixFiat(transaction.rate.USD) }} USD
          </span>
        </el-form-item>

        <el-form-item label="Description">
          <el-input
            v-model="model.descr"
            type="textarea"
            @keyup.enter.native="changeDescription"/>
        </el-form-item>

        <el-collapse
          v-if="currentCrypto === 'ETH'"
          :value="$isMobileView ? '1' : '0'">
          <el-collapse-item
            name="1">
            <template slot="title">
              <div class="collapse-title">
                More info
              </div>
            </template>

            <el-form-item label="Block Hash">
              {{ transaction.blockHash }}
            </el-form-item>

            <el-form-item label="Block Number">
              {{ transaction.blockNumber }}
            </el-form-item>

            <el-form-item label="Gas Used By Txn">
              {{ transaction.gas }}
            </el-form-item>

            <el-form-item label="Gas Price">
              {{ transaction.gasPrice }}
            </el-form-item>

            <el-form-item label="Nonce">
              {{ transaction.nonce }}
            </el-form-item>

            <el-form-item
              v-if="token"
              class="input-data"
              label="Input Data">
              {{ transaction.input.data }}
            </el-form-item>

            <el-form-item
              v-else
              class="input-data"
              label="Input Data">
              {{ transaction.input }}
            </el-form-item>
          </el-collapse-item>
        </el-collapse>

        <el-collapse
          v-else-if="currentCrypto === 'BTC'"
          :value="$isMobileView ? '1' : '0'">
          <el-collapse-item
            name="1">
            <template slot="title">
              <div class="collapse-title">
                More info
              </div>
            </template>

            <el-form-item label="Block Height">
              {{ transaction.block_height }}
            </el-form-item>

            <el-form-item label="Block Index">
              {{ transaction.block_index }}
            </el-form-item>

            <el-form-item label="Double Spend">
              {{ transaction.double_spend ? 'yes' : 'no' }}
            </el-form-item>

            <el-form-item label="Confirmations">
              {{ transaction.confirmations }}
            </el-form-item>
          </el-collapse-item>
        </el-collapse>
      </el-form>
    </el-card>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { _find, _get } from '@/utils/lodash'
import copyAddressMixin from '@/mixins/copy-address'
import currencyMixin from '@/mixins/currency'
import themeIcons from '@/mixins/theme-icons'
import screenSizeMixin from '@/mixins/screen-size'

export default {
  mixins: [copyAddressMixin, currencyMixin, themeIcons, screenSizeMixin],
  data () {
    return {
      transactionIsLoading: false,
      model: {
        descr: ''
      },
      networks: {
        main: {
          link: 'https://etherscan.io/tx/:hash'
        },
        rinkeby: {
          link: 'https://rinkeby.etherscan.io/tx/:hash'
        },
        ropsten: {
          link: 'https://ropsten.etherscan.io/tx/:hash'
        },
        kovan: {
          link: 'https://kovan.etherscan.io/tx/:hash'
        },
        bcy: {
          link: 'https://live.blockcypher.com/bcy/tx/:hash'
        }
      }
    }
  },
  computed: {
    ...mapGetters({
      transactionList: 'transaction/list',
      isDark: 'auth/isDark'
    }),
    id () {
      return this.$route.params.id
    },
    transaction () {
      const id = this.id

      return _find(this.transactionList, ['id', +id]) || null
    },
    currentCrypto () {
      return this.token ? 'ETH' : this.transaction.symbol || this.transaction.currency
    },
    externalLink () {
      return this.getNetworkLink(this.transaction)
    },
    token () {
      const input = this.transaction ? _get(this.transaction, 'input', null) : null
      const token = _get(this.transaction, 'input.token', null)

      return token ? input : null
    }
  },
  watch: {
    transaction (newVal) {
      if (newVal) {
        this.model.descr = newVal.descr
        this.transactionIsLoading = false
      }
    }
  },
  mounted () {
    document.getElementById('main-view').scrollTo(0, 0)
  },
  created () {
    this.getTransaction(this.id)
    this.transactionIsLoading = true
  },
  methods: {
    ...mapActions({
      getTransaction: 'transaction/get',
      updateDescription: 'transaction/update'
    }),
    convertTime (time) {
      const date = new Date(time)

      return date.toLocaleString()
    },
    changeDescription () {
      this.updateDescription({ id: this.id, description: this.model.descr })
    },
    getNetworkLink (transaction) {
      const network = _get(transaction, 'network', null)
      const hash = _get(transaction, 'hash', null)

      return this.networks[network] ? this.networks[network].link.replace(/:hash/, hash) : null
    }
  }
}
</script>

<style lang="scss">
@import "../../../../assets/partials/variables";

.view-container {

  .content {

    .transaction-info {
      width: 100%;

      .hash-link {
        @media (min-width: 990px) and (max-width: 1200px) {
          .el-form-item__content {
            font-size: $--font-size-small;
          }
        }
      }

      .input-data {
        word-break: break-all;
      }

      .from-hash, .to-hash, a.from-hash {
        color: $--color-gray-light;
        font-weight: 500;
        cursor: pointer;

        .icon-button {
          margin-left: 5px;
        }
      }

      a.from-hash, a.from-hash:hover, a.from-hash:visited {
        text-decoration: none;
      }

      .el-card__header {
        border-bottom: none !important;
      }

      .header {
        padding: 10px 0 22px 0;
        font-size: $--font-size-small;
        letter-spacing: 0.2px;
        border-bottom: none !important;

        .title {
          padding-top: 28px;
          font-size: 24px;
          font-weight: 500;
        }

        .el-button--text {
          font-size: $--font-size-small;
          color: $--color-orange !important;
        }
      }

      .external i {
        color: $--color-gray;
        margin-left: 5px;
        opacity: 0.8;
        padding-bottom: 5px;

        &:hover {
          opacity: 1;
        }
      }

      .el-form-item__label {
        text-align: left;
        top: 0;
        left: 0;
      }

      .el-form-item {

        .el-input__inner {
          padding: inherit;
          padding-left: 16px;
        }
      }

      .el-form-item__content {
        font-size: $--font-size-base;

        .material-icons {
          margin-left: 0;
        }

        .usd {
          color: $--color-gray-light;
          font-size: $--font-size-smallest;
          margin-left: 5px;
        }

        .status {

          &.green {
            color: $--color-green;
          }

          &.red {
            color: $--color-red;
          }

          &.gray {
            color: $--color-gray-light;
          }
        }
      }

      .el-collapse {
        border: none;
        padding-top: 18px;

        .collapse-title {
          float: left;
        }

        .el-collapse-item__header {
          background: transparent;
          color: $--color-gray-light;
          font-size: $--font-size-medium;
          border: none;
        }

        .el-collapse-item__content {
          font-size: $--font-size-base;
        }

        .el-collapse-item__wrap {
          background: transparent;
          border: none;
        }

        .el-collapse-item__arrow {
          float: none;
          margin: 0 0 0 8px;
        }
      }

      &.mobile {
        .from-hash, .to-hash {
          .icon-button {
            opacity: 1;

            &:hover {
              opacity: 0.8;
            }
          }
        }
      }

      @media (max-width: 990px) {
        .el-form-item__label, .el-form-item__content {
          display: block;
          width: 100% !important;
          position: unset;
          margin-left: 0 !important;
        }

        .el-form-item__content {
          word-wrap: break-word;
          line-height: 24px;
        }

        .external i {
          color: $--color-gray-light;
        }

        .from-hash, .to-hash {
          color: $--color-orange;
        }
      }
    }

    .material-icons {
      margin-left: 16px;
      vertical-align: middle;
      cursor: pointer;
    }
  }
}
</style>
