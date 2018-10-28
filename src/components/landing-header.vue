<template>
  <el-container
    class="header-content"
    direction="horizontal">
    <img
      src="./../assets/images/logo-light.svg"
      class="logo">

    <div class="menu"/>

    <el-button
      v-if="!user"
      class="menu-button"
      type="text"
      data-test="login"
      @click="$eventHub.$emit('popup:auth', 'auth')">
      Log In Wallet&nbsp;&nbsp;<i class="material-icons md-light md-24 right-arrow">arrow_forward</i>
    </el-button>

    <el-dropdown
      v-else
      trigger="click">
      <el-button
        class="menu-button name"
        type="text">
        {{ userName }}&nbsp;&nbsp;<i class="material-icons md-24">arrow_drop_down</i>
      </el-button>

      <el-dropdown-menu
        slot="dropdown"
        class="dropdown-menu">
        <el-dropdown-item @click.native="$router.push('/account/wallet')">Wallet</el-dropdown-item>
        <el-dropdown-item @click.native="logout">Logout</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-container>
</template>

<script>
import { _get } from '@/utils/lodash'

export default {
  props: {
    signIn: {
      type: Boolean,
      default: false
    },
    user: {
      type: Object,
      default: () => { return {} }
    },
    logout: {
      type: Function,
      default: () => {}
    }
  },
  computed: {
    userName () {
      return _get(this.user, 'displayName', null) || _get(this.user, 'email', null) || _get(this.user, 'givenName', null)
    }
  }
}
</script>

<style lang="scss">
.app-wrapper {

  &.landing {

    .header {
      background: transparent;

      .header-content {

        .menu {
          background: transparent;
          margin: auto;
          border: none;

          li {
            font-size: 15px;
            font-weight: 400;
            letter-spacing: 0.3px;
            padding: 0 25px;
          }
        }

        @media (max-width: 660px) {
          .logo {
            margin-right: 10px;
            padding-top: 2px;
          }

          .menu-button {
            margin: 8px 20px 8px 8px;
            white-space: nowrap;
          }
        }
      }
    }
  }
}
</style>
