<template>
  <transition name="slide">
    <div
      v-if="showHeaderNotice"
      :class="{ 'header-notice': true, [getField(headerNotice, currentKey, 'class')]: true }">
      <ul>
        <li :class="{ 'title': true, 'has-email': isEmail }">{{ getField(headerNotice, currentKey, 'title') }}</li>
        <li
          :class="{ 'form': true, 'has-email': isEmail }">
          <el-form
            v-show="!isEmail"
            ref="form-email-send"
            :model="model"
            :rules="rules">
            <el-form-item
              :class="{ 'focused': emailIsFocused }"
              prop="email">
              <el-input
                v-model="model.email"
                placeholder="Email"
                @focus="emailIsFocused = true"
                @blur="emailIsFocused = !!model.email"/>
            </el-form-item>
          </el-form>
        </li>
        <li :class="{ 'send': true, 'has-email': isEmail, 'disabled': !model.email }">
          <span @click="handleSendEmail">{{ getField(headerNotice, currentKey, 'textButton') }}</span>
          <i
            v-show="getField(headerNotice, currentKey, 'textButton') !== ''"
            class="material-icons md-light md-18 arr">
            trending_flat
          </i>
        </li>
      </ul>
      <i
        class="material-icons md-light md-18 close"
        @click="closeHeaderNotice">
        close
      </i>
    </div>
  </transition>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { _get } from '@/utils/lodash'
import validateMixin from '@/mixins/validate'

export default {
  mixins: [validateMixin],
  data () {
    return {
      model: {
        email: null
      },
      showHeaderNotice: false,
      emailIsFocused: false,
      headerNotice: {
        empty: {
          title: 'Please enter and verify your email to make sure that your wallet is fully protected.',
          textButton: 'Send',
          class: 'orange'
        },
        confirm: {
          title: 'Please verify your email to make sure that your wallet is fully protected.',
          textButton: 'Resend email',
          class: 'orange'
        }
      },
      currentKey: 'empty',
      rules: {
        email: [
          { validator: (rule, value, callback) => this.validateDebounced('email', value, callback), trigger: 'change' }
        ]
      }
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user'
    }),
    isEmail () {
      const email = _get(this.user, 'email', null)

      return email !== '' ? email : null
    },
    isConfirmed () {
      return _get(this.user, 'confirmed', null)
    }
  },
  watch: {
    user () {
      this.checkEmail()
    }
  },
  mounted () {
    this.checkEmail()
  },
  methods: {
    ...mapActions({
      sendEmail: 'auth/sendEmail'
    }),
    closeHeaderNotice () {
      this.showHeaderNotice = false
    },
    getField (headerNotice, currentKey, key) {
      return headerNotice[currentKey][key]
    },
    checkEmail () {
      this.showHeaderNotice = false

      if (!this.isEmail) this.currentKey = 'empty'
      else if (!this.isConfirmed) {
        this.model.email = this.user.email
        this.currentKey = 'confirm'
      }

      if (!this.isConfirmed || !this.isEmail) setTimeout(() => { this.showHeaderNotice = true }, 2500)
    },
    handleSendEmail () {
      this.$refs['form-email-send'].validate(async (valid) => {
        if (valid) {
          this.showHeaderNotice = false

          await this.sendEmail(this.model.email)

          this.$message({ message: 'Thank you! Please check your mailbox and follow the link', type: 'success' })
        } else {
          this.$message({ message: 'Enter a valid email address', type: 'error' })
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../assets/partials/variables";

.header-notice {
  color: $--color-white;
  padding: 0 8.5%;
  font-size: $--font-size-base;
  transition: all .4s cubic-bezier(.25, .8, .25, 1);
  transition-duration: .3s;

  &.orange {
    background-color: $--color-orange;
  }

  &.green {
    background-color: $--color-green;
  }

  .close {
    position: absolute;
    right: 10px;
    top: 13px;
    color: $--color-gray-light;
    cursor: pointer;
  }

  ul {
    display: flex;
    list-style: none;
    padding: 0 0 0 15px;
    margin: 11px 0 2px 0;
  }

  .title {
    padding: 3px 0 10px 0;
  }

  .form {
    flex: 1;
    text-align: right;
    flex-basis: 40%;
  }

  .send {
    padding: 3px 0 10px 10px;
    white-space: nowrap;

    span {
      border-bottom: 1px solid $--color-white;
      margin-right: 5px;
      cursor: pointer;
    }

    i {
      vertical-align: middle;
    }

    &.disabled {
      opacity: 0.5;
    }

    @media (min-width: 991px) and (max-width: 1380px) {
        padding: 3px 30px 10px 10px;
    }
  }

  > li {
    flex: 1;
  }

  .el-form {
    font-size: $--font-size-small;
    margin-top: -8px;

    .el-form-item {
      margin-bottom: 0;
    }

    .el-form-item__label {
      font-size: 14px;
      top: 0;
    }

    .el-form-item__error {
      position: absolute;
      color: $--color-orange;
      top: 30px;
      transform-origin: center top 0;
      z-index: 2003;
      padding: 10px 10px;
      margin: 5px 0;
      background-color: #fff;
      border: 1px solid #e5e5e5;
      border-radius: 4px;
      -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      box-shadow: 0 2px 12px 0 rgba(0, 0, 0, .1);
      right: 0;
      left: unset;
    }

    .el-input {
      font-size: $--font-size-small;

      .el-input__inner {
        padding: 5px 5px 5px 10px;
        height: 28px;
        width: 250px;
      }
    }
  }

  @media (min-width: 991px) and (max-width: 1380px) {
    padding: 0 2%;
  }

  @media all and (max-width: 990px) {
    padding: 0;
    flex-flow:column wrap;

    .title:not(.has-email) {
      display: flex;
      flex-grow:0;
      flex-basis:90%;
    }

    .form:not(.has-email) {
      margin-top: 10px;
      display: flex;
      flex-grow:0;
      flex-basis:250px;
    }

    .form.has-email {
      flex-basis: auto;
    }

    .send:not(.has-email) {
      margin-left: 0;
      margin-top: 10px;
      padding-right: 10%;
    }

    .send.has-email {
      padding-left: 0;
      padding-right: 10%;
    }

    ul {
      flex-wrap: wrap;
    }

    > li {
      flex-basis: 75%;
    }
  }

  @media all and (max-width: 480px) {
    .el-input__inner {
      width: 150px !important;
    }

    .form.has-email {
      display: none;
    }

    .send.has-email {
      padding-left: 0;
      margin-top: 5px;
    }
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
