// 为每个代码块添加复制按钮
document.addEventListener('DOMContentLoaded', function () {
  let id = 0
  var blocks = document.querySelectorAll(
    '.article-body figure.highlight',
  )
  blocks.forEach(function (block) {
    // 避免重复添加
    if (block.querySelector('.copy-btn')) return

    var btn = document.createElement('button')
    btn.className = 'copy-btn'
    btn.textContent = '复制'
    btn.setAttribute('title', '复制代码到剪贴板')

    btn.addEventListener('click', function () {
      clearTimeout(id)
      var code =
        block.querySelector('.code pre') ||
        block.querySelector('.code code') ||
        block.querySelector('pre')
      var text = code ? code.innerText : ''
      navigator.clipboard
        .writeText(text)
        .then(function () {
          btn.textContent = '已复制'
          btn.classList.add('copied')
          id = setTimeout(function () {
            btn.textContent = '复制'
            btn.classList.remove('copied')
          }, 2000)
        })
        .catch(function () {
          btn.textContent = '失败'
          id = setTimeout(function () {
            btn.textContent = '复制'
          }, 2000)
        })
    })

    block.appendChild(btn)
  })
})
