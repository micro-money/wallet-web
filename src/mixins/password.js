export default {
  data () {
    return {
      isPassVisible: false
    }
  },
  computed: {
    iconVisiblePassword () {
      return !this.isPassVisible ? 'visibility' : 'visibility_off'
    }
  }
}
