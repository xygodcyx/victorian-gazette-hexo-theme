addEventListener('DOMContentLoaded', () => {
  ;(function () {
    var checkbox = document.getElementById(
      'immersive-toggle',
    )
    if (!checkbox) return

    // 页面加载时从 localStorage 恢复状态
    var savedState = localStorage.getItem('immersive-mode')
    if (savedState === 'true') {
      checkbox.checked = true
    }

    // 监听 checkbox 变化，存储状态
    checkbox.addEventListener('change', function () {
      localStorage.setItem('immersive-mode', this.checked)
    })

    // 如果页面通过链接跳转（下一篇/上一篇），状态可能丢失，
    // 但我们在页面加载时已经恢复了 checkbox，所以无需额外处理。
    // 注意：浏览器的前进后退也会保留表单状态，但用 localStorage 更可靠。
  })()
})

function toggleImmersive() {
  var body = document.body
  var gazette = document.querySelector('.gazette')
  var articleLayout = document.querySelector(
    '.article-layout',
  )

  if (body.classList.contains('immersive-mode')) {
    // 退出沉浸模式
    body.classList.remove('immersive-mode')
    var exitBtn = document.querySelector('.immersive-exit')
    if (exitBtn) exitBtn.remove()
    if (gazette) gazette.style.display = ''
    if (articleLayout) articleLayout.style.display = ''
    document.documentElement.style.overflow = ''
    body.style.overflow = ''
  } else {
    // 进入沉浸模式：克隆文章主体并全屏展示
    var clone = articleLayout.cloneNode(true)
    clone.id = 'immersive-clone'

    // 移除旁注栏中的交互元素（保留文字显示）
    var paranotes = clone.querySelectorAll(
      '.paranote-marker',
    )
    paranotes.forEach(function (p) {
      p.style.opacity = '0.5'
    })

    // 创建沉浸容器
    var container = document.createElement('div')
    container.className = 'immersive-container'
    container.appendChild(clone)

    // 隐藏原页面
    gazette.style.display = 'none'

    // 插入克隆
    document.body.appendChild(container)

    // 添加退出按钮
    var exitBtn = document.createElement('button')
    exitBtn.className = 'immersive-exit'
    exitBtn.textContent = '退出沉浸 ✕'
    exitBtn.onclick = toggleImmersive
    document.body.appendChild(exitBtn)

    body.classList.add('immersive-mode')

    // 禁止背景滚动
    document.documentElement.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
  }
}

// ESC 键退出
document.addEventListener('keypress', function (e) {
  console.log(e.key)
  if (
    e.key === 'Escape' &&
    document.body.classList.contains('immersive-mode')
  ) {
    toggleImmersive()
  }
})
