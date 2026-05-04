// 字号切换（保存在 localStorage）
const fontSizes = [
  'font-small',
  'font-medium',
  'font-large',
]
const fontLabels = ['小', '中', '大']
let currentSize = parseInt(
  localStorage.getItem('vg-font-size') || '1',
)

function applyFontSize(index) {
  const body = document.querySelector('.article-body')
  if (!body) return

  // 移除所有字号类
  fontSizes.forEach(function (cls) {
    body.classList.remove(cls)
  })

  // 应用当前字号
  body.classList.add(fontSizes[index])

  // 更新按钮文字
  const label = document.getElementById('font-size-label')
  if (label) {
    label.textContent = fontLabels[index]
  }

  // 存储到 localStorage
  localStorage.setItem('vg-font-size', index)
}

function toggleFontSize() {
  currentSize = (currentSize + 1) % fontSizes.length
  applyFontSize(currentSize)
}

// 页面加载时应用已存储的字号
document.addEventListener('DOMContentLoaded', function () {
  applyFontSize(currentSize)
})
