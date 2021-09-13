import mp from 'minapp-promise'

Component({
  properties: {
    os: {
      type: String,
      value: 'auto',
    },

    hideBack: Boolean,
  },

  lifetimes: {
    attached() {
      this.init()
    }
  },

  methods: {
    init() {
      this._heights().then(heights => {
        this.setData(heights)
        this.triggerEvent('grow', {
          height: heights.statusBarHeight + heights.titleBarHeight,
        })
      })

      if (this.data.os === 'auto') {
        this._os().then(os => this.setData({ os }))
      }

      if (this._canGoBack()) {
        this.setData({ canGoBack: true })
      }
    },

    handleBack() {
      mp.navigateBack()
    },

    _heights() {
      return mp.getSystemInfo().then(({ statusBarHeight, system }) => {
        const titleBarHeight = system.indexOf('Android') === -1 ? 44 : 48
        return { statusBarHeight, titleBarHeight }
      })
    },

    _os() {
      return mp.getSystemInfo().then(({ system }) =>
        system.includes('Android') ? 'android' : 'ios'
      )
    },

    _canGoBack() {
      return !this.data.hideBack && getCurrentPages().length > 1
    }
  }
})
