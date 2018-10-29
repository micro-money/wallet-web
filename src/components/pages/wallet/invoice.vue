<template>
  <el-container
    v-if="invoice"
    :class="{ 'current-invoice': true, dark: isDark }"
    direction="vertical">
    <el-card
      :class="{ 'invoice-info': true, dark: isDark }"
      shadow="never">

      <el-card
        id="actions"
        class="actions"
        shadow="never">
        <el-row>
          <el-col :span="12">
            <el-row>
              <el-col
                :span="24"
                class="invoice-id">
                <span class="title">Invoice: {{ invoice.id }}</span>
                <span class="date"> {{ convertTime(invoice.createdAt) }}</span>
              </el-col>
            </el-row>
            <el-row>
              <el-col
                :span="24"
                class="invoice-descr">
                <img
                  :src="invoiceIcon(invoice)"
                  class="currency-icon">

                <span class="title">{{ invoice.service.title }}</span>
                <span class="descr">{{ invoice.description }}</span>
              </el-col>
            </el-row>
          </el-col>

          <el-col
            :span="12"
            class="main-balance">
            <span
              :class="['status', {
                green: invoice.status === 'paid',
                gray: invoice.status === 'pending',
                orange: invoice.status === 'new' }]">{{ invoice.status }}</span>

            <div>{{ fixCrypto(invoice.amount) }} &nbsp;{{ invoice.currency }}</div>

            <div class="secondary-balance">
              {{ fixFiat(invoice.amountUsd) }} &nbsp;USD
            </div>
          </el-col>
        </el-row>

        <el-row
          :gutter="20"
          class="actions-buttons"
          type="flex">
          <el-col :span="6">
            <el-button
              :disabled="invoice.status === 'paid'"
              @click="openSend">PAY</el-button>
          </el-col>
        </el-row>
      </el-card>
    </el-card>

    <el-card
      v-loading="transactionsIsLoading"
      class="invoice-history"
      shadow="never">
      <div
        slot="header"
        class="clearfix">
        <span>Payments</span>
      </div>

      <el-table
        v-if="transactionList[0] && !$isMobileView"
        :data="transactionList"
        :row-class-name="tableRowClassName"
        style="width: 100%"
        class="table"
        @row-click="(row) => openTransactionExternal(row)">
        <el-table-column
          prop="date"
          label="Date"
          width="170"
          sortable>
          <template slot-scope="scope">
            <span style="color: #9b9b9b;">{{ convertTime(scope.row.createdAt) }}</span>
          </template>
        </el-table-column>

        <el-table-column
          prop="from-to"
          label="From / To"
          width="255"
          class-name="from-to">
          <template slot-scope="scope">
            <el-tooltip
              class="add-address"
              effect="light"
              placement="top">
              <div
                slot="content"
                class="add-address-item">
                {{ scope.row.from.hash }}
              </div>
              <span
                class="add-address gray">
                {{ formatHash(scope.row.from.hash) }}
              </span>
            </el-tooltip>

            <i class="material-icons md-11 arrow">arrow_forward</i>

            <el-tooltip
              class="add-address"
              effect="light"
              placement="top">
              <div
                slot="content"
                class="add-address-item">
                {{ scope.row.to.hash }}
              </div>

              <span
                class="add-address gray">
                {{ formatHash(scope.row.to.hash) }}
              </span>
            </el-tooltip>
          </template>
        </el-table-column>

        <el-table-column
          prop="description"
          label="Description"
          class-name="description">
          <template
            slot-scope="scope">
            <template
              v-if="!$isMdDesktopView">
              <span
                v-if="scope.row.descr"
                @click.stop="addDescription(scope.row.id)">
                {{ scope.row.descr }}
              </span>

              <el-button
                v-else
                type="text"
                @click.stop="addDescription(scope.row.id)">
                + Add description
              </el-button>
            </template>

            <template
              v-else>
              <el-tooltip
                effect="light"
                placement="top">
                <div
                  slot="content">
                  <span
                    v-if="scope.row.descr"
                    @click.stop="addDescription(scope.row.id)">
                    {{ scope.row.descr }}
                  </span>

                  <el-button
                    v-else
                    type="text"
                    @click.stop="addDescription(scope.row.id)">
                    + Add description
                  </el-button>
                </div>
                <i class="material-icons md-dark md-18">info</i>
              </el-tooltip>
            </template>
          </template>
        </el-table-column>

        <el-table-column
          prop="amount"
          label="Amount"
          class-name="amount">
          <template slot-scope="scope">
            <div
              v-if="typeof scope.row.rate.USD === 'number' || scope.row.token"
              :class="['number', { green: scope.row.direction === 'in' }]">
              {{ getTxnSign(scope.row.direction) }}{{ getTxnAmount(scope.row, 'fiat') }}&nbsp;USD
            </div>

            <div
              v-if="typeof scope.row.amount === 'number' || scope.row.token"
              class="crypto">
              {{ getTxnSign(scope.row.direction) }}{{ getTxnAmount(scope.row, 'crypto') }}&nbsp;{{ scope.row.symbol }}
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="status"
          width="35"
          class-name="status">
          <template slot-scope="scope">
            <i
              v-if="scope.row.status"
              :class="['material-icons', 'md-14', {
                green: scope.row.status === 'success',
                gray: scope.row.status === 'pending',
                red: scope.row.status === 'failure'
            }]">
              <template v-if="scope.row.status === 'success'">
                brightness_1
              </template>

              <template v-else-if="scope.row.status === 'pending'">
                access_time
              </template>

              <template v-else-if="scope.row.status === 'failure'">
                clear
              </template>
            </i>
          </template>
        </el-table-column>

        <el-table-column
          prop="info"
          width="44"
          class-name="info">
          <template slot-scope="scope">
            <i
              class="material-icons md-21 orange"
              @click="openTransactionExternal(scope.row)">
              open_in_new
            </i>
          </template>
        </el-table-column>
      </el-table>

      <div
        v-if="transactionList[0] && $isMobileView"
        class="transactions-mobile">

        <div class="currency-switch">
          <span
            :class="{ active: selectedCurrency === 'USD'}"
            @click="selectedCurrency = 'USD'">USD</span>

          <span
            :class="{ active: selectedCurrency === invoice.currency }"
            @click="selectedCurrency = invoice.currency">{{ invoice.currency }}</span>
        </div>

        <el-row
          v-for="transaction in transactionList"
          :key="transaction.id"
          type="flex"
          @click.native="openTransactionExternal(transaction)">
          <el-col :span="24">
            <el-row>
              <el-col
                :span="16"
                class="date"><img
                  v-if="transaction.direction === 'in'"
                  src="../../../assets/images/receive.svg"
                  @click="openTransactionExternal(transaction)">
                <img
                  v-else
                  src="../../../assets/images/send.svg"
                  @click="openTransactionExternal(transaction)">
                <span>{{ convertTime(transaction.createdAt) }}</span>
              </el-col>

              <el-col
                :span="8"
                class="user">
                <div v-if="transaction.direction === 'in'">
                  <el-tooltip
                    v-if="reset && row[transaction.from.hash]"
                    effect="light"
                    placement="top">
                    <div
                      slot="content"
                      class="tooltip-contact">
                      <span class="tooltip-contact-book"><i class="material-icons md-18">recent_actors</i></span>
                      {{ row[transaction.from.hash] }}
                    </div>
                    <span>
                      <i class="material-icons md-18 green">person</i>
                    </span>
                  </el-tooltip>
                </div>
              </el-col>
            </el-row>

            <el-row>
              <el-col
                :span="24"
                class="description">
                <span
                  v-if="transaction.descr"
                  @click.stop="addDescription(transaction.id)">
                  {{ transaction.descr }}
                </span>

                <el-button
                  v-else
                  type="text"
                  @click.stop="addDescription(transaction.id)">
                  + Add description
                </el-button>
              </el-col>
            </el-row>

            <el-row>
              <el-col
                :span="12"
                class="amount">
                <div
                  v-if="selectedCurrency === 'USD' && (typeof transaction.rate.USD === 'number' || transaction.token)"
                  :class="['number', { green: transaction.direction === 'in' }]">
                  {{ getTxnSign(transaction.direction) }}{{ getTxnAmount(transaction, 'fiat') }}&nbsp;USD
                </div>

                <div
                  v-else-if="selectedCurrency === invoice.currency && (typeof transaction.amount === 'number' || transaction.token)"
                  :class="['number', { green: transaction.direction === 'in' }]">
                  {{ getTxnSign(transaction.direction) }}{{ getTxnAmount(transaction, 'crypto') }}&nbsp;{{ transaction.symbol }}
                </div>
              </el-col>

              <el-col
                :span="12"
                :class="['status', {
                  green: transaction.status === 'success',
                  gray: transaction.status === 'pending',
                  red: transaction.status === 'failure'
              }]">
                <i
                  v-if="transaction.status"
                  :class="['material-icons', 'md-14', {
                    green: transaction.status === 'success',
                    gray: transaction.status === 'pending',
                    red: transaction.status === 'failure'
                }]">
                  <template v-if="transaction.status === 'success'">
                    brightness_1
                  </template>

                  <template v-else-if="transaction.status === 'pending'">
                    access_time
                  </template>

                  <template v-else-if="transaction.status === 'failure'">
                    clear
                  </template>
                </i>
                {{ transaction.status }}
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>

      <div
        v-if="!transactionList[0]"
        class="not-found">
        No payment transactions
      </div>

    </el-card>
  </el-container>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { _get, _find } from '@/utils/lodash'
import copyAddressMixin from '@/mixins/copy-address'
import currencyMixin from '@/mixins/currency'
import cryptoMixin from '@/mixins/crypto'
import themeIcons from '@/mixins/theme-icons'
import screenSize from '@/mixins/screen-size'

export default {
  mixins: [copyAddressMixin, currencyMixin, cryptoMixin, themeIcons, screenSize],
  data () {
    return {
      row: {},
      reset: true,
      selectedCurrency: 'USD'
    }
  },
  computed: {
    ...mapGetters({
      invoices: 'wallet/invoices',
      transactionList: 'wallet/invoiceTransactionList',
      assets: 'wallet/defaultAssets',
      isDark: 'auth/isDark',
      transactionsIsLoading: 'status/loadingInvoices'
    }),
    invoice () {
      const id = this.$route.params.id

      return _find(this.invoices, ['id', +id]) || null
    }
  },
  watch: {
    $route () {
      if (this.$route.params.id) {
        this.getInvoice(this.$route.params.id)
      }
    }
  },
  created () {
    if (this.$route.params.id) {
      this.getInvoice(this.$route.params.id)
    }
  },
  methods: {
    ...mapActions({
      getInvoice: 'wallet/getInvoice'
    }),
    tableRowClassName ({ row }) {
      if (row.status === 'failure') return 'red-row'
      else return ''
    },
    addDescription (id) {
      this.$eventHub.$emit('popup:description:add', id)
    },
    openTransactionExternal (transaction) {
      const link = this.getNetworkLink(transaction)

      if (link) { window.open(link, '_blank') } else { return false }
    },
    invoiceIcon (invoice) {
      return `/img/invoice-services/${invoice.service.id}.svg`
    },
    openSend () {
      const { currency: crypto, address, amount } = this.invoice
      const invoice = this.invoice
      const assetId = _get(this.assets, `${crypto}.id`, null)

      if (!assetId) {
        this.$message({ message: `You have not got a ${crypto} asset. So you can not pay now.`, type: 'error' })
        return false
      }

      this.$eventHub.$emit('popup:send', { crypto, address, amount, assetId, invoice })
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/partials/variables";

.current-invoice {
  min-width: 820px;

  .invoice-info, .invoice-history {
    border: none;
  }

  .invoice-info {
    width: 100%;

    .el-card__header {
      padding-top: 40px;
      padding-bottom: 20px;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.2px;
      border-bottom: none;
    }

    .invoice-id {
      color: $--color-gray-light;

      .title {
        text-decoration: underline;
      }

      .date {
        padding-left: 20px;
        font-size: $--font-size-small;
      }
    }

    .invoice-descr {
      margin-top: 20px;

      img {
        .dark & {
          background-color: $--color-gray-super-light;
        }
      }
      .title {
        padding-left:10px;
        font-weight: bold;

        .dark & {
          color: $--color-gray-super-light;
        }
      }

      .descr {
        padding-left: 10px;
        font-size: $--font-size-small;

        .dark & {
          color: $--color-gray-super-light;
        }
      }
    }

    .material-icons {
      vertical-align: middle;
      margin-top: -3px;
    }

    .actions {
      background-color: $--card-background-color;

      .currency-icon {
        width: 50px;
        height: 50px;
        vertical-align: middle;
        margin-left: 0;

        @media (min-width: 990px) and (max-width: 1381px) {
          width: 40px;
          height: 40px;
        }
      }

      .main-balance {
        font-size: 28px;
        font-weight: 500;
        white-space: nowrap;
        text-align: right;
        margin-top: -15px;

        .status {
          padding: 2px 7px;
          font-size: $--font-size-small;
          display: inline-block;
          margin-bottom: 7px;

          &.green {
            background-color: $--color-green;
            color: $--color-white;
          }
          &.gray {
            background-color: $--color-gray;
            color: $--color-white;
          }
          &.orange {
            background-color: $--color-orange;
            color: $--color-white;
          }
        }

        @media (min-width: 375px) and (max-width: 440px) {
          font-size: 24px;
        }
        @media (max-width: 374px) {
          font-size: 18px;
        }
      }

      .secondary-balance {
        opacity: 0.4;
        font-size: 20px;
        font-weight: 500;
        white-space: nowrap;

        @media (min-width: 375px) and (max-width: 440px) {
          font-size: 18px;
        }
        @media (max-width: 374px) {
          font-size: 14px;
        }
      }

      .actions-buttons {
        flex-wrap: wrap;
        margin-left: -10px;
        margin-top: 10px;

        .el-col {
          box-sizing: border-box;
          margin-left: 10px;
          margin-top: 20px;

          @media (min-width: 570px) and (max-width: 638px) {
            margin-left: 0;
            flex: 1 0 230px !important;
          }
          @media (min-width: 480px) and (max-width: 569px) {
            margin-left: 0;
            flex: 1 0 190px !important;
          }
          @media (min-width: 331px) and (max-width: 479px) {
            margin-left: 0;
            flex: 1 0 135px !important;
          }
          @media (max-width: 330px) {
            margin-left: 0;
            flex: 1 0 100px !important;
          }
        }

        .el-col:first-child {
          margin-left: 0;
        }

        .el-button {
          width: 100%;
          font-size: 15px;
          padding: 14px 0;
        }
      }
    }
  }

  .invoice-history {

    .el-card__header {
      padding-top: 15px;
      padding-bottom: 0;
      font-size: 24px;
      font-weight: 500;
      letter-spacing: 0.2px;
      border-bottom: none;
    }

    .table {

      .el-table__row {
        cursor: pointer;
      }

      .cell {
        display: inline-block;
        word-break: keep-all;
        line-height: 24px;

        .material-icons {
          margin: 0 5px;
        }
      }

      td.from-to {
        font-size: $--font-size-smallest;

        .orange {
          background-color: rgba(240, 131, 14, 0.2);
          color: $--color-orange;
          padding: 4px;
        }

        .green {
          background-color: rgba(122, 179, 23, 0.2);
          color: $--color-green;
          padding: 4px;
        }

        .gray {
          background-color: rgba(155, 155, 155, 0.2);
          color: $--color-gray-light;
          padding: 4px;
          margin: 0 0 2px 0;
          white-space: nowrap;
          cursor: pointer;

          .material-icons {
            margin: 0;
            vertical-align: middle;
          }
        }
      }

      .info {

        .material-icons {
          margin: 0;
        }
      }

      td.description {
        color: #9b9b9b;

        .el-button {
          cursor: pointer;
          color: #9b9b9b;
        }
      }

      .amount {
        text-align: right;

        .green {
          color: $--color-green;
        }

        .number {
          border-bottom: 1px solid $--color-gray-lighter;
        }

        .crypto {
          font-size: 10px;
          color: $--color-gray-light;
        }
      }

      .material-icons.arrow {
        cursor: auto;
      }

      .status {

        .material-icons {
          margin: 0;
          cursor: auto;
        }
      }
    }

    .transactions-mobile {

      .currency-switch {
        margin-top: -10px;
        text-align: right;
        margin-bottom: 40px;

        span {
          margin-left: 15px;
          cursor: pointer;
          color: $--color-gray-light;
          font-size: 14px;

          &.active {
            color: $--color-orange;
            font-weight: 500;
          }
        }
      }

      > .el-row {
        margin-bottom: 20px;
        padding-bottom: 20px;
        border-bottom: 1px solid $--color-gray-lighter;

        >.el-col {
          cursor: pointer;
        }
      }

      .user {
        text-align: right;
      }

      .date {
        font-size: 15px;
        color: $--color-gray-light;
        line-height: 20px;

        img {
          margin-right: 10px;
          margin-left: 0 !important;
        }

        span {
          vertical-align: top;
        }
      }

      .amount {
        font-size: 15px;
        font-weight: 500;

        .green {
          color: $--color-green;
        }
      }

      .status {
        text-align: right;
        font-size: 15px;
        text-transform: capitalize;
        line-height: 14px;

        &.green {
          color: $--color-green;
        }
        &.gray {
          color: $--color-gray-light;
        }
        &.red {
          color: $--color-red;
        }

        .material-icons {
          vertical-align: top;
        }
      }

      .description {
        color: $--color-gray-lighter;

        .el-button--text {
          color: $--color-gray-light;
          font-weight: normal;
        }
      }
    }
  }

  @media (max-width: 991px) {
    min-width: 100%;
  }

  @media (min-width: 992px) and (max-width: 1381px) {
    min-width: unset;
  }

  &.dark {
    .transactions-mobile {
      .amount {
        color: $--color-gray-lighter;
      }
    }
  }

}

.el-tooltip__popper.is-light {
  padding: 8px 10px 5px 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .12) !important;
  border: 0 !important;

  .add-address-item {
    font-size: $--font-size-smallest;

    .add-address-text {
      vertical-align: super;
      margin-left: 3px;
    }
  }

  .tooltip-contact {
    line-height: 20px;

    .tooltip-contact-book {
      margin-right: 3px;
      color: $--color-gray-light;
      float: left;
    }

    .tooltip-contact-book:hover {
      color: $--color-gray;
    }
  }

  .popper__arrow {
    border: 0;
  }
}
</style>
