<template>
  <el-dialog
    :visible.sync="showAddDescription"
    :before-close="handleClose"
    :width="!fullscreen ? '530px' : 'auto'"
    :fullscreen="fullscreen"
    custom-class="dialog"
    title="Edit description"
    center>
    <el-form
      ref="form"
      :model="model"
      :rules="rules">
      <el-form-item
        :class="{ 'focused': descriptionIsFocused }"
        label="Description"
        prop="description">
        <el-input
          v-model="model.description"
          @focus="descriptionIsFocused = true"
          @blur="descriptionIsFocused = !!model.description"/>
      </el-form-item>
    </el-form>

    <div
      slot="footer"
      class="dialog-footer">
      <el-form>
        <el-form-item>
          <el-button
            :disabled="!canAdd"
            type="primary"
            class="dialog-button"
            @click="add">
            Ok
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  props: {
    showAddDescription: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    id: {
      type: Number,
      default: null
    }
  },
  data () {
    return {
      descriptionIsFocused: false,
      model: {
        description: null
      },
      rules: {
        description: [
          { required: true, message: 'Please input description', trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    canAdd () {
      return this.model.description && this.id
    }
  },
  methods: {
    ...mapActions({ addDescription: 'transaction/update' }),
    handleClose () {
      if (this.$refs.form) this.$refs.form.resetFields()
      if (this.id) this.$emit('update:id', null)

      this.$emit('close')
    },
    add () {
      this.addDescription({ id: this.id, description: this.model.description })
      this.handleClose()
    }
  }
}
</script>

<style lang="scss" scoped>
@import "./../../assets/partials/variables";

.dialog {

  .dialog-button {
    width: 100%;
    height: 64px;
    font-size: 16px;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 1.4px;

    &:hover, &.is-disabled {

      .button-description {
        color: inherit;
      }
    }
  }

  .buttons-wrapper {
    margin: 24px 0 3px 0;
  }

  .dialog-footer {
    font-size: 14px;
    margin-top: 20px;

    .footer-button.text {
      font-size: 14px;
    }
  }
}

</style>
