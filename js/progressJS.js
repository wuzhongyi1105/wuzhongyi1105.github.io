;(function(window) {
  //创建滑块构造函数

  function Progress(
    target,
    {
      size = 10,
      val = 0,
      precision = 0,
      getVal = () => {},
      drag = true,
      direction = 'horizontal',
      tip = false
    } = {}
  ) {
    if (!target) return alert('必须指定实例对象的容器！')
    //指定实例容器
    this.container = document.querySelector(target)
    this.size = size
    this.val = val
    this.precision = precision
    this.getVal = getVal
    this.drag = drag
    this.direction = direction
    if (typeof tip === 'object') {
      this.tip = tip || {
        trigger: 'show', // hover
        align: 'top' // bottom
      }
    } else if (typeof tip != 'boolean') {
      return alert('tip配置错误')
    }
    this.initialize()
  }

  Progress.prototype = {
    constructor: Progress,
    //初始化
    initialize: function() {
      if (
        this.size < 0 ||
        this.val < 0 ||
        this.val > 100 ||
        this.precision < 0 ||
        this.precision > 4 ||
        (this.direction != 'horizontal' && this.direction != 'vertical') ||
        !this.container ||
        (typeof this.drag != 'boolean' && typeof this.drag != 'object')
      )
        return alert('参数配置错误！')
      //调用渲染
      this.rander()
      this.renderLine()
    },
    //渲染方法
    rander: function() {
      this.bgBar = document.createElement('div')
      this.bgLine = document.createElement('div')
      this.btnTip = document.createElement('div')

      const { bgBar, container, bgLine, btnTip } = this

      //渲染bgBar
      switch (this.direction) {
        case 'horizontal':
          bgBar.classList.add('ProgressBar')
          bgBar.style.height = this.size + 'px'
          bgBar.style.width = 100 + '%'
          bgBar.style.borderRadius = this.size / 2 + 'px'
          //添加btn
          bgLine.appendChild(btnTip)

          break
        case 'vertical':
          bgBar.classList.add('ProgressBar')
          bgBar.style.width = this.size + 'px'
          bgBar.style.height = 100 + '%'
          bgBar.style.borderRadius = this.size / 2 + 'px'
          //添加btn
          btnTip.classList.add('vertical')
          bgLine.appendChild(btnTip)
          break
      }
      //渲染btn
      btnTip.classList.add('btn')
      btnTip.style.width = this.size + 'px'
      btnTip.style.height = this.size + 'px'
      //渲染bgLine
      bgLine.classList.add('ProgressLine')
      bgLine.style.borderRadius = this.size / 2 + 'px'
      bgBar.appendChild(bgLine)

      container.appendChild(bgBar)

      //是否开启拖拽
      if (this.drag) {
        this.Dragdrop()
      } else {
        this.btnTip.classList.add('disable')
      }
      //是否开启tip
      if (this.tip || typeof this.tip === 'object') this.openTip()

      //开启loading
      this.onLoading()
    },

    //拖拽方法
    Dragdrop: function() {
      const bgBar = this.bgBar
      const mothes = e => {
        // e.preventDefault()
        // e.stopPropagation()
        this.getPos(e)
      }

      bgBar.addEventListener('mousedown', e => {
        document.addEventListener('mousemove', mothes)
        this.getPos(e)
      })
      document.addEventListener('mouseup', e => {
        document.removeEventListener('mousemove', mothes)
      })
      bgBar.addEventListener('touchstart', e => {
        document.addEventListener('touchmove', mothes)
        this.getPos(e)
      })
      document.addEventListener('touchend', e => {
        document.removeEventListener('touchmove', mothes)
      })
    },

    //获取鼠标位置事件
    getPos: function(event) {
      if (typeof event.touches === 'undefined') {
        event.preventDefault()
        event.stopPropagation()
      }
      if (event.touches) event = event.touches[0]
      this.oldVal = this.val
      switch (this.direction) {
        case 'horizontal':
          let clX = event.clientX + this.size / 2 //鼠标X轴位置
          let bgBarW = this.bgBar.clientWidth //bgbar宽度
          let bgBarLeft = this.getElementLeft(this.bgBar)
          this.val =
            ((clX - bgBarLeft - this.size) / (bgBarW - this.size)) * 100
          break
        case 'vertical':
          let clY = event.clientY + this.size / 2 //鼠标X轴位置
          let bgBarH = this.bgBar.clientHeight //bgbar宽度
          let bgBarTop = this.getElementTop(this.bgBar)
          this.val =
            100 - ((clY - bgBarTop - this.size) / (bgBarH - this.size)) * 100
          break
      }

      this.val = Math.max(0, this.val)
      this.val = Math.min(100, this.val)
      this.renderLine()
      this.eventVal()
    },

    //获取元素距离屏幕左端的位置
    getElementLeft: function(element) {
      let { offsetLeft, offsetParent } = element
      while (offsetParent !== null) {
        offsetLeft += offsetParent.offsetLeft
        offsetParent = offsetParent.offsetParent
      }
      return offsetLeft
    },
    //获取元素距离屏幕上端的位置
    getElementTop: function(element) {
      let { offsetTop, offsetParent } = element
      while (offsetParent !== null) {
        offsetTop += offsetParent.offsetTop
        offsetParent = offsetParent.offsetParent
      }
      return offsetTop
    },
    //渲染line宽度
    renderLine: function() {
      switch (this.direction) {
        case 'horizontal':
          this.bgLine.style.width =
            ((this.bgBar.clientWidth - this.size) * this.val) / 100 +
            this.size +
            'px'
          break
        case 'vertical':
          this.bgLine.style.height =
            ((this.bgBar.clientHeight - this.size) * this.val) / 100 +
            this.size +
            'px'
          break
      }
    },
    //获取默认值
    eventVal: function() {
      this.val = +this.val.toFixed(this.precision)
      if (this.oldVal === this.val) {
        return
      }
      //  this.val = this.val
      //  console.log(this.val)
      this.getVal && this.getVal(this)
      if (this.tip || typeof this.tip === 'object')
        this.tipBox.innerText = `${this.val}%`
    },
    //更新默认值
    updateVal: function(res) {
      if (res < 0 || res > 100) return
      this.val = +res
      this.renderLine()
      this.val = +res.toFixed(this.precision)
      if (this.tip || typeof this.tip === 'object')
        this.tipBox.innerText = `${this.val}%`
    },
    //开启tip
    openTip: function() {
      //console.log(this)
      const btnTip = this.btnTip
      this.tipBox = document.createElement('span')
      this.tipBox.classList.add('progressVal')
      this.tipBox.innerText = `${this.val}%`
      btnTip.appendChild(this.tipBox)
      this.tip.trigger && this.tipConfig()
    },
    //配置tip
    tipConfig: function() {
      //console.log(this.tip.trigger)
      switch (this.tip.trigger) {
        case 'hover':
          this.tipBox.style.opacity = 0
          this.bgBar.addEventListener(
            'mouseenter',
            () => (this.tipBox.style.opacity = 1)
          )
          this.bgBar.addEventListener(
            'mouseleave',
            () => (this.tipBox.style.opacity = 0)
          )
          this.bgBar.addEventListener(
            'touchstart',
            () => (this.tipBox.style.opacity = 1)
          )
          this.bgBar.addEventListener(
            'touchend',
            () => (this.tipBox.style.opacity = 0)
          )
          break
        case 'show':
          this.tipBox.style.opacity = 1
          break
      }

      switch (this.tip.align) {
        case 'bottom':
          this.tipBox.classList.add('bottom')
          break
        case 'left':
          this.tipBox.classList.add('left')
          break
        case 'right':
          this.tipBox.classList.add('right')
          break
      }
    },
    //开启Loading
    onLoading: function() {
      this.btnLoading = document.createElement('span')
      const { btnLoading, btnTip } = this
      btnLoading.classList.add('loading')
      btnTip.appendChild(btnLoading)
      btnLoading.style.width = btnTip.offsetWidth + 'px'
      btnLoading.style.height = btnTip.offsetHeight + 'px'
    },
    onLoad: function(e, callback = () => {}) {
      if (typeof e !== 'boolean') return alert('onload配置错误')
      if (e) this.btnLoading.style.display = 'block'
      callback(this)
    }
  }

  window.Progress = Progress
})(window)
