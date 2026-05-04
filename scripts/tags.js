// scripts/tags.js
// Victorian Gazette 自定义标签

// ==========================================
// 1. 段落旁注
// ==========================================
hexo.extend.tag.register(
  'paranote',
  function (args, content) {
    const type = args[0] || 'summary'
    const note = args[1] || ''
    const side = args[2] || ''
    const markerClass =
      side === 'left'
        ? 'paranote-marker paranote-marker-left'
        : 'paranote-marker'
    return `<div class="paranote-paragraph paranote-${type}"><span class="${markerClass}">${note}</span>${content}</div>`
  },
  { ends: true },
)

// ==========================================
// 2. 词语旁批
// ==========================================
hexo.extend.tag.register('marginalia', function (args) {
  const term = args[0] || ''
  const note = args[1] || ''
  return `<span class="marginalia-container"><span class="marginalia-term">${term}</span><span class="marginalia-note">${note}</span></span>`
})

// ==========================================
// 3. 脚注引用（手动编号）
//    {% fn "note1" %} → 显示 [note1]，锚点到 #fn:note1
//    {% fn "note1" "1" %} → 显示 [1]，锚点到 #fn:note1
// ==========================================
hexo.extend.tag.register('fn', function (args) {
  const id = args[0] || '1'
  const display = args[1] || id
  return `<sup id="fnref:${id}"><a href="#fn:${id}" class="footnote-ref">[${display}]</a></sup>`
})

// ==========================================
// 4. 脚注列表容器
// ==========================================
hexo.extend.tag.register(
  'footnotes',
  function (args, content) {
    return `<hr class="footnotes-separator"><ol class="footnotes-list">${content}</ol>`
  },
  { ends: true },
)

// ==========================================
// 5. 单条脚注
//    {% fnitem "note1" "注释文字" %}
// ==========================================
hexo.extend.tag.register('fnitem', function (args) {
  const id = args[0] || ''
  const text = args[1] || ''
  return `<li id="fn:${id}">${text} <a href="#fnref:${id}" class="footnote-backref">↩</a></li>`
})

// ==========================================
// 6. 首字下沉
// ==========================================
hexo.extend.tag.register(
  'dropcap',
  function (args, content) {
    const letter = args[0] || ''
    return `<span class="drop-cap">${letter}</span>${content}`
  },
)

// ==========================================
// 7. 重点文字
// ==========================================
hexo.extend.tag.register(
  'emphasis',
  function (args, content) {
    return `<span class="text-emphasis">${content}</span>`
  },
  { ends: true },
)

// ==========================================
// 8. 右浮动插图
// ==========================================
hexo.extend.tag.register('figureright', function (args) {
  const src = args[0] || ''
  const caption = args[1] || ''
  const size = (args[2] || '100% 100%').split(' ')

  return `<figure class="article-image-right"><img style="width:${size[0]};height:${size[1]}" src="${src}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`
})

// ==========================================
// 9. 全宽插图
// ==========================================
hexo.extend.tag.register('figurefull', function (args) {
  const src = args[0] || ''
  const caption = args[1] || ''
  return `<figure class="article-image-full"><img src="${src}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`
})

// ==========================================
// 10. 文章末尾装饰符
// ==========================================
hexo.extend.tag.register('fin', function () {
  return '<div class="article-fin">❦</div>'
})
