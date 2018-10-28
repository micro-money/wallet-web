export default {
  data () {
    return {
      clientWidth: 0,
      clientHeight: 0
    }
  },
  computed: {
    $isLgDesktopView () {
      return this.clientWidth < 1441
    },
    $isMdDesktopView () {
      return this.clientWidth < 1281
    },
    $isTabletView () {
      return this.clientWidth < 991
    },
    $isMobileView () {
      return this.clientWidth < 600
    }
  },
  methods: {
    _updateDimensions () {
      this.clientWidth = Math.max(document.documentElement.clientWidth,
        window.innerWidth || 0)
      this.clientHeight = Math.max(document.documentElement.clientHeight,
        window.innerHeight || 0)
    }
  },
  mounted () {
    this.$nextTick(() => {
      this._updateDimensions()
      window.addEventListener('resize', this._updateDimensions,
        { 'passive': true })
    })
  },
  destroyed () {
    window.removeEventListener('resize', this._updateDimensions)
  }
}
