<template>
  <el-container
    direction="horizontal"
    class="content"
    type="flex">
    <el-col
      :span="8"
      class="col-assets">
      <el-aside
        v-loading="assetsIsLoading"
        v-if="$route.params.page === 'wallet'"
        width="80%"
        class="assets-list">
        <el-row
          :style="`background-color: ${asset ? cryptoColor(asset.symbol): cryptoColor('default')}`"
          class="asset-select-mobile hidden-md-and-up"
          @click.native="showSelectAsset">
          <el-col
            :span="16"
            class="asset-name">
            <template v-if="asset">
              {{ asset.name }}
            </template>
            <template v-else>Assets</template>
          </el-col>

          <el-col
            :span="8"
            class="asset-action">
            <i
              v-show="!showMobileMenu"
              class="material-icons md-24">arrow_drop_down</i>
            <i
              v-show="showMobileMenu"
              class="material-icons md-24">arrow_drop_up</i>
          </el-col>
        </el-row>

        <el-container
          direction="horizontal"
          class="assets-header hidden-sm-and-down">
          <el-col :span="8">
            <h2>Assets</h2>
          </el-col>
        </el-container>

        <el-container
          :class="{ 'hidden-sm-and-down': !showMobileMenu }"
          direction="vertical">
          <el-menu
            v-if="assets[0]"
            ref="menu"
            :default-active="defaultActiveAsset"
            class="assets-menu">
            <el-menu-item-group class="clearfix">
              <el-menu-item
                v-for="(asset, index) in assets"
                v-if="asset.type === 'cryptocurrency'"
                :key="index"
                :index="`${path}/asset/${asset.id}`"
                class="asset-amount clearfix"
                @click.native="handleClickMenu($event, asset)">
                <el-col
                  :span="serviceUnavailable(asset) ? 22 : 13"
                  class="asset-name">
                  <div class="asset-name-container">
                    <div class="child">
                      <div class="image">
                        <img
                          :src="getSrc(asset)"
                          class="currency-icon">
                      </div>
                      <div class="text">{{ asset.name }}
                        <span
                          v-if="serviceUnavailable(asset)"
                          class="unavailable">
                          <i class="material-icons md-dark md-12">
                            watch_later
                          </i>
                          Service temporary unavailable</span>
                      </div>
                    </div>
                  </div>
                </el-col>

                <el-col :span="serviceUnavailable(asset) ? 0 : 9">
                  <template v-if="!serviceUnavailable(asset)">
                    <div class="main-balance">
                      {{ getFiatBalance(asset) }}&nbsp;USD
                    </div>

                    <div class="secondary-balance">
                      {{ getBalance(asset) }}&nbsp;{{ asset.symbol }}
                    </div>
                  </template>

                  <template v-else>
                    &nbsp;
                  </template>
                </el-col>
              </el-menu-item>
            </el-menu-item-group>

            <el-menu-item-group class="clearfix">
              <template slot="title">
                <span>My Tokens</span>
                <i
                  class="material-icons md-dark md-18"
                  @click="createAsset('newToken')">
                  add_circle_outline
                </i>
              </template>
              <el-menu-item
                v-for="(asset, index) in assets"
                v-if="asset.type === 'token'"
                :key="index"
                :index="`${path}/asset/${asset.id}`"
                class="asset-amount clearfix"
                @click.native="handleClickMenu($event, asset)">
                <el-col
                  :span="serviceUnavailable(asset) ? 22 : 13"
                  class="asset-name">
                  <div class="asset-name-container">
                    <div class="child">
                      <div class="image">
                        <img
                          :src="getSrcToken(asset)"
                          class="currency-icon"
                          @error="(e) => { e.target.src = getRandomSrcToken(asset) }">
                      </div>
                      <div class="text">{{ asset.name }}
                        <span
                          v-if="serviceUnavailable(asset)"
                          class="unavailable">
                          <i class="material-icons md-dark md-12">
                            watch_later
                          </i>
                          Service temporary unavailable</span>
                      </div>
                    </div>
                  </div>
                </el-col>

                <el-col :span="serviceUnavailable(asset) ? 0 : 9">
                  <template v-if="!serviceUnavailable(asset)">
                    <div class="main-balance alone">
                      {{ getBalance(asset) }}&nbsp;{{ asset.symbol }}
                    </div>
                  </template>

                  <template v-else>
                    &nbsp;
                  </template>
                </el-col>

                <el-col
                  :span="2"
                  class="asset-actions">
                  <el-dropdown
                    trigger="click"
                    @command="handleAssetAction">
                    <span class="el-dropdown-link">
                      <i
                        class="material-icons md-dark md-24 more">
                        more_vert
                      </i>
                    </span>
                    <el-dropdown-menu
                      slot="dropdown"
                      :class="{ 'closer-dropdown': true, 'asset-dropdown': true, dark: isDark }">
                      <el-dropdown-item :command="{ action: 'remove', asset }">Remove</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-menu-item>
            </el-menu-item-group>
          </el-menu>

          <el-button
            class="add-asset-button"
            @click="createAsset('newToken')">
            ADD NEW TOKEN
          </el-button>

        </el-container>

        <template v-if="invoices[0]">
          <el-container
            direction="horizontal"
            class="invoices assets-header hidden-sm-and-down">
            <el-col :span="24">
              <h2>Invoices</h2>
            </el-col>
          </el-container>

          <el-container
            :class="{ 'hidden-sm-and-down': !showMobileMenu }"
            direction="vertical">

            <el-menu
              ref="menu-invoices"
              :default-active="null"
              class="assets-menu invoices-menu">
              <el-menu-item
                v-for="(invoice, index) in invoices"
                :key="index"
                :index="`${path}/invoice/${invoice.id}`"
                class="asset-amount clearfix"
                @click.native="handleClickInvoice($event, invoice)">
                <el-col
                  :span="13"
                  class="asset-name">
                  <div class="asset-name-container">
                    <div class="child">
                      <div class="image">
                        <img
                          :src="invoiceIcon(invoice)"
                          class="currency-icon">
                      </div>
                      <div class="text">{{ invoice.service.title }}
                        <span class="descr">
                          {{ invoice.description }}
                        </span>
                      </div>
                    </div>
                </div></el-col>

                <el-col :span="9">
                  <div
                    :class="['main-balance', {
                      green: invoice.status === 'paid',
                      gray: invoice.status === 'pending',
                      orange: invoice.status === 'new' }]">
                    <i
                      :class="['material-icons', 'md-10']">
                      brightness_1
                    </i> {{ fixCrypto(invoice.amount) }} &nbsp;{{ invoice.currency }}
                  </div>

                  <div class="secondary-balance">
                    {{ fixFiat(invoice.amountUsd) }} &nbsp;USD
                  </div>
                </el-col>

                <el-col
                  :span="2"
                  class="asset-actions">
                  <el-dropdown
                    v-if="invoice.status === 'new'"
                    trigger="click"
                    @command="handleAssetAction">
                    <span class="el-dropdown-link">
                      <i
                        class="material-icons md-dark md-24 more">
                        more_vert
                      </i>
                    </span>
                    <el-dropdown-menu
                      slot="dropdown"
                      :class="{ 'closer-dropdown': true, 'asset-dropdown': true, dark: isDark }">
                      <el-dropdown-item :command="{ action: 'pay', invoice }">Pay</el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </el-col>
              </el-menu-item>
            </el-menu>
          </el-container>
        </template>
      </el-aside>
    </el-col>

    <el-col
      :span="16"
      class="col-main">
      <router-view/>
    </el-col>
  </el-container>
</template>

<script>
import asset from '@/components/pages/wallet/asset'
import { mapGetters, mapActions } from 'vuex'
import { _get, _debounce, _find } from '@/utils/lodash'
import currencyMixin from '@/mixins/currency'
import cryptoMixin from '@/mixins/crypto'
import { _cloneDeep } from '../../../utils/lodash'

export default {
  components: { asset },
  mixins: [currencyMixin, cryptoMixin],
  data () {
    return {
      showMobileMenu: false,
      enterPassword: false,
      enterPasswordCb: null
    }
  },
  computed: {
    ...mapGetters({
      wallet: 'wallet/current',
      password: 'wallet/password',
      allAssets: 'wallet/assets',
      invoices: 'wallet/invoices',
      loading: 'status/loadingAssets',
      isDark: 'auth/isDark'
    }),
    path () {
      return '/account/wallet'
    },
    defaultActiveAsset () {
      return !/(transactions)|(invoice)/.test(this.$route.path) && this.assets[0]
        ? `${this.path}/asset/${this.assets[0].id}` : null
    },
    assets () {
      /*  todo: remove it - now need to show just one Eth asset */
      return this.allAssets ? _cloneDeep(this.allAssets)
        .reduce((res, asset) => {
          if (asset.type === 'token' || (asset.symbol === 'ETH' && res.findIndex(arr => arr.symbol === 'ETH') === -1)) {
            if (asset.symbol === 'ETH') asset.name = 'Ethereum'
            res.push(asset)
          }
          return res
        }, []) : []
    },
    asset () {
      const id = this.$route.params.id

      return _find(this.assets, ['id', +id]) || null
    },
    serviceUnavailable () {
      return asset => !asset || _get(asset, 'balance', null) === null
    },
    assetsIsLoading: {
      get () {
        return !this.assets || this.loading
      },
      set (newValue) {
        return newValue
      }
    }
  },
  watch: {
    password () {
      if (this.enterPassword && this.wallet.password && this.enterPasswordCb) this.enterPasswordCb()
    }
  },
  created () {
    this.assetsIsLoading = this.assets && this.assets.length !== 0
  },
  methods: {
    ...mapActions({
      removeAsset: 'wallet/removeAsset'
    }),
    getBalance (asset) {
      const assetType = _get(asset, 'type', null)
      const balance = _get(asset, 'balance', 0)

      return (assetType === 'token') ? this.fixToken(balance) : this.fixCrypto(balance)
    },
    getFiatBalance (asset) {
      return this.fixFiat(_get(asset, 'rate.USD', 0))
    },
    createAsset (type) {
      if (typeof type === 'string') this.$eventHub.$emit('popup:asset:create', type)
      else this.$eventHub.$emit('popup:asset:create', 'new')
    },
    debounceChangeAssets: _debounce(function (to) {
      this.$router.push(to)
      this.showMobileMenu = false
    }, 800),
    showSelectAsset () {
      this.showMobileMenu = !this.showMobileMenu
    },
    handleAssetAction ({ action, asset }) {
      if (action === 'remove') {
        const h = this.$createElement

        this.$msgbox({
          title: 'Remove asset',
          message: h('div', null, [
            h('p', null, `Do you really want to remove ${asset.name} Asset from your assets?`),
            h('p', null, 'Please, don`t forget to export your private key before you remove it!')
          ]),
          confirmButtonText: 'Yes, remove it',
          center: true,
          customClass: { 'dialog-confirm': true, dark: this.isDark }
        }).then(async () => {
          if (this.password) {
            await this.removeAsset(asset)
            this.$router.push({ path: '/account' })
          } else {
            this.enterPasswordCb = () => this.removeAssetWithPassword(asset)
            this.$eventHub.$emit('popup:password:enter')
            this.enterPassword = true
          }
        }).catch(() => {})
      }
    },
    async removeAssetWithPassword (asset) {
      await this.removeAsset({ id: asset.id })
      this.$router.push({ path: '/account' })
      this.enterPassword = false
      this.enterPasswordCb = null
    },
    handleClickMenu (event, asset) {
      const classes = _get(event, 'srcElement.classList', null)
      const clickMore = [...classes].includes('more')

      if (!clickMore && asset) {
        this.debounceChangeAssets(`/account/wallet/asset/${asset.id}`)
        this.$refs['menu-invoices'].activeIndex = null
      }
    },
    handleClickInvoice (event, invoice) {
      const classes = _get(event, 'srcElement.classList', null)
      const clickMore = [...classes].includes('more')

      if (!clickMore && invoice) {
        this.debounceChangeAssets(`/account/wallet/invoice/${invoice.id}`)
        this.$refs.menu.activeIndex = null
      }
    },
    invoiceIcon (invoice) {
      return `/img/invoice-services/${invoice.service.id}.svg`
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/partials/variables";

.app-wrapper {

  &.account {
    .view-container {

      .content {
        .el-table .red-row {
          background-color: $--color-red-lighter;
        }

        /* Assets List
        -------------------------- */

        .assets-list {
          min-width: 360px !important;
          margin-right: 20px;
          transition: border-color .3s, background-color .3s, color .3s;
          overflow: hidden;

          .assets-header {
            margin-left: 20px;

            .assets-controls {
              padding: 25px 5px 0 0;
              text-align: right;
            }
          }

          section:last-of-type {
            padding-bottom: 20px;
          }

          .assets-menu {
            background-color: transparent;
            border: none;

            img {
              margin: 0;
            }

            .coming-soon .el-badge__content {
              right: 0;
            }

            .el-menu-item-group__title {
              font-size: 14px;
              margin-bottom: -5px;
              margin-top: 15px;

              .material-icons {
                float: right;
                margin-right: 5px;

                @media (max-width: 990px) {
                  margin-right: 10px;
                }
              }
            }

            .el-menu-item {
              padding: 0;

              &.is-active, &:hover {
                background-color: $--color-white;
              }
            }

            .asset-amount {
              margin-top: 11px;

              .asset-name {
                font-size: 18px;
                font-weight: 400;
                color: #9b9b9b;
                overflow: hidden;
                text-overflow: ellipsis;

                .asset-name-container {
                  display: flex;
                  flex-direction: column;
                  line-height: 20px;
                  margin-bottom: 10px;

                  .child {
                    display: flex;
                    align-items: center;
                    min-height: 56px;

                    .image {
                      margin: 0 5px 0 0;
                      display: table-cell;
                      vertical-align: middle;

                      img {
                        width: 36px;
                        height: 36px;
                        vertical-align: middle;

                        @media (min-width: 990px) and (max-width: 1366px) {
                          width: 24px;
                          margin-right: 5px;
                        }
                      }
                    }

                    .text .unavailable::before {
                      content: "\A";
                      white-space: pre;
                      line-height: 5px;
                    }

                    .text .unavailable {
                      font-size: 12px;
                      line-height: 15px;

                      i {
                        padding-bottom: 4px;
                        margin-left: 0;
                      }
                    }

                    .text .descr {
                      font-size: $--font-size-small;
                    }
                  }
                }
              }

              .asset-actions {
                text-align: right;

                .more {
                  margin-left: 0;

                  @media (max-width: 990px) {
                    margin-right: 5px;
                  }
                }
              }

              .asset-actions {
                text-align: right;

                .more {
                  margin-left: 0;

                  @media (max-width: 990px) {
                    margin-right: 5px;
                  }
                }
              }

              .el-dropdown-link, .el-dropdown-link:focus {
                outline: none;
              }

              img.currency-icon {
                width: 36px;
                height: 36px;
                vertical-align: middle;
                margin-right: 10px;

                @media (min-width: 990px) and (max-width: 1366px) {
                  width: 24px;
                  margin-right: 5px;
                }
              }

              .main-balance {
                color: $--color-black;
                font-size: 18px;
                font-weight: 500;
                margin-top: -10px;
                text-align: right;
                overflow: hidden;

                &.alone {
                  margin-top: 0;
                }

                &.green {
                  color: $--color-green;
                }

                &.gray {
                  color: $--color-gray-light;
                }

                &.orange {
                  color: $--color-orange;
                }

                @media (min-width: 991px) and (max-width: 1366px) {
                  font-size: 15px;
                }
                @media (max-width: 990px) {
                  font-size: 16px;
                }
              }

              .secondary-balance {
                color: $--color-black;
                opacity: 0.4;
                font-size: 15px;
                font-weight: 500;
                margin-top: -35px;
                text-align: right;

                @media (min-width: 991px) and (max-width: 1366px) {
                  font-size: 12px;
                }
                @media (max-width: 990px) {
                  font-size: 14px;
                }

              }

              .assets-actions {

                .material-icons {
                  margin-left: -9px !important;
                }
              }
            }

            &.invoices-menu {
              .main-balance {
                font-size: $--font-size-small;
              }

              .secondary-balance {
                font-size: $--font-size-small;
              }
            }
          }

          .add-asset-button {
            margin: 30px 20px 0 20px;
            font-size: 15px;
            padding: 14px 0;
          }

          .invoices {
            margin-top: 20px;
          }

          @media (min-width: 990px) and (max-width: 1381px) {
            min-width: 260px !important;
            width: 95% !important;
          }

          @media (max-width: 989px) {
            padding-bottom: 4%;
          }

          @media (max-width: 320px) {
            min-width: 320px !important;
          }
        }

        img {
          margin-left: 20px;
          cursor: pointer;
        }

        img.currency-icon {
          margin-left: 0;
        }

        @media (max-width: 991px) {
          display: flex;
          flex-wrap: wrap;

          .col-assets, .col-main {
            flex-grow: 1;
            flex-shrink: 0;
            box-sizing: border-box;
            width: 100%;
          }

          .assets-list {
            width: 100% !important;

            .assets-header {
              margin-left: 0;
            }
          }

          .asset-select-mobile {
            width: 100%;
            min-width: unset;
            background-color: $--color-orange;
            color: $--color-white;
            cursor: pointer;
            line-height: 60px;
            vertical-align: middle;
            z-index: 1;
            padding-left: 20px;
            font-size: 18px;

            .asset-action {
              text-align: right;
              padding-right: 20px;
            }
          }
        }

        @media (min-width: 990px) and (max-width: 1381px) {
          min-width: 260px !important;
          padding: 0 0 0 2% !important;
        }

        @media (max-width: 989px) {
          padding: 0 !important;
        }
      }

      .icon-button {
        opacity: 0.5;
        vertical-align: middle;
        margin-top: -3px;

        &:hover {
          opacity: 1;
        }
      }
    }

    .footer {
      background-color: $--footer-background-color;
      height: 70px !important;

      .footer-content {
        height: 70px;
      }
    }
  }
}

.dialog-confirm .el-button {
  width: 100%;
  height: 64px;
  font-size: 16px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.3px;
}

.asset-dropdown {
  &.el-popper[x-placement^=top] {
    margin-top: 42px !important;
    margin-bottom: 0 !important;
  }
}
</style>
