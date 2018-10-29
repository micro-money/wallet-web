<template>
  <el-card
    v-loading="loading"
    class="invoice-history"
    shadow="never">

    <el-container
      direction="horizontal"
      class="invoices assets-header hidden-sm-and-down">
      <el-col :span="24">
        <h2>Invoices</h2>
      </el-col>
    </el-container>

    <el-table
      v-if="invoices"
      :data="invoices"
      style="width: 100%"
      class="table"
      @row-click="(row) => openInvoice(row)">
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
        prop="from"
        label="From"
        width="255"
        class-name="from-to">
        <template slot-scope="scope">
          <img
            :src="invoiceIcon(scope.row)"
            class="currency-icon">

          {{ scope.row.service.title }} {{ scope.row.description }}
        </template>
      </el-table-column>

      <el-table-column
        prop="amount"
        label="Amount"
        class-name="amount"/>

      <el-table-column
        prop="currency"
        label="Currency"/>

      <el-table-column
        prop="status"
        label="Status"
        width="100"
        class-name="status">
        <template slot-scope="scope">
          <i
            v-if="scope.row.status"
            :class="['material-icons', 'md-14', {
              green: scope.row.status === 'paid',
              gray: scope.row.status === 'pending',
              orange: scope.row.status === 'new'
          }]">
            brightness_1
          </i>
        </template>
      </el-table-column>

      <el-table-column
        prop="info"
        width="44"
        class-name="info">
        <template slot-scope="scope">
          <i
            class="material-icons md-16 orange"
            @click.stop="openInvoice(scope.row)">
            trending_flat
          </i>
        </template>
      </el-table-column>
    </el-table>

  </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import currencyMixin from '@/mixins/currency'
import cryptoMixin from '@/mixins/crypto'

export default {
  mixins: [currencyMixin, cryptoMixin],
  data () {
    return {}
  },
  computed: {
    ...mapGetters({
      invoices: 'wallet/invoices',
      loading: 'status/loadingInvoices',
      isDark: 'auth/isDark'
    })
  },
  methods: {
    openInvoice (invoice) {
      this.$router.push({ path: `/account/wallet/invoice/${invoice.id}` })
    },
    invoiceIcon (invoice) {
      return `/img/invoice-services/${invoice.service.id}.svg`
    }
  }
}
</script>

<style lang="scss">
@import "../../../../assets/partials/variables";

.invoice-history {
  img.currency-icon {
    width: 36px;
    height: 36px;
    vertical-align: middle;
    margin-right: 10px;
  }
}
</style>
