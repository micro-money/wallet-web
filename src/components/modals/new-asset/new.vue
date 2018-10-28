<template>
  <el-form class="buttons-wrapper">
    <el-form-item>
      <el-button
        class="dialog-button"
        @click="$emit('change-current-key', 'newCrypto')">
        Add new cryptocurrency

        <div class="button-description">BTC, ETH, LTC and 32 other</div>
      </el-button>
    </el-form-item>

    <el-form-item>
      <el-button
        class="dialog-button"
        @click="$emit('change-current-key', 'newToken')">
        Add new token

        <div class="button-description">AMM, OmiseGo, ICO Box and 12 other</div>
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  props: {
    changeCurrentKey: {
      type: Function,
      default: () => {}
    }
  }
}
</script>
