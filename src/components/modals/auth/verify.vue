<template>
  <el-dialog
    v-loading="loading"
    :visible.sync="show"
    :before-close="handleClose"
    :fullscreen="true"
    custom-class="dialog verify"
    title=""
    center>
    <transition name="slide">
      <div
        v-show="!loading"
        class="result">
        <div v-if="isConfirmed">
          <i class="material-icons icon green">done_all</i>
          <p class="title">Congrats! You have successfully verified your email address</p>
          <p class="sub">Now your wallet is fully protected!</p>
        </div>

        <div v-else-if="isConfirmed === false">
          <i class="material-icons icon orange">error_outline</i>
          <p class="title">Error: "Your email address has not been confirmed"</p>
          <p class="sub">Please enter a valid email and try to get another email with confirmation link</p>
        </div>
        <div v-else>
          Sending...
        </div>
      </div>
    </transition>
    <span
      slot="footer"
      class="dialog-footer">
      <el-button
        type="primary"
        class="dialog-button"
        @click="handleClose">
        Ok
      </el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { _get } from '@/utils/lodash'

export default {
  data () {
    return {
      show: false,
      token: null,
      user: {
        confirmed: null
      }
    }
  },
  computed: {
    ...mapGetters({
      loading: 'status/loading'
    }),
    isConfirmed () {
      return _get(this.user, 'confirmed', null)
    }
  },
  created () {
    let response

    this.$eventHub.$on('popup:verify', async (token) => {
      this.token = token
      this.show = true

      response = await this.confirmEmail(this.token)

      if (response) {
        this.user = response.data.user
      } else {
        this.user.confirmed = false
      }
    })
  },
  methods: {
    ...mapActions({
      confirmEmail: 'auth/confirmEmail'
    }),
    handleClose () {
      this.show = false
    }
  }
}
</script>

<style lang="scss">
@import "../../../assets/partials/_colors.scss";

.verify {
  .el-dialog__header {
    background-color: #ffffff;
    position: fixed;
    text-align: center;
    display: block;
    width: 100%;
    padding: 0 0 40px 0 !important;

    .el-dialog__headerbtn {
      top: 20px;
      right: 20px;
    }
  }

  .el-dialog__footer {
    position: fixed;
    background-color: #ffffff;
    bottom: 0;
    display: block;
    width: 100%;
    text-align: center;
    padding: 0 0 80px 0 !important;

    .dialog-button {
      width: 300px;
    }

    @media (max-width: 600px) {
      padding: 0 0 10px 0 !important;
    }
  }

  .el-dialog__body {
    height: 60%;
    padding-top: 10% !important;

    @media (max-width: 1025px) {
      padding-top: 10% !important;
    }

    @media (max-width: 321px) {
      padding-top: 15% !important;
    }
  }

  .result {
    display: flex;
    justify-content: center;
    text-align: center;
    height: 100%;
    font-size: 24px;

    .icon {
      display: block;
      text-align: center;
      font-size: 96px;
      margin-bottom: 10px;
    }

    .title {
      color: $--color-gray;
    }

    .sub {
      margin-top: 10%;
      font-size: 20px;
    }
  }

  .footer-button {
    text-align: center;
  }
}

.slide-leave-active,
.slide-enter-active {
  transition: 1s;
}

.slide-enter {
  transform: translate(0, -100%);
}

.slide-leave-to {
  transition: 0.5s;
  transform: translate(0, -100%);
}
</style>
