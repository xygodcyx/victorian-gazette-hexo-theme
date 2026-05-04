// scripts/tags.js
// Victorian Gazette 自定义标签

// 1. 段落旁注：{% paranote "类型" "标注文字" %}段落内容{% endparanote %}
hexo.extend.tag.register(
  'paranote',
  function (args, content) {
    const type = args[0] || 'summary'
    const note = args[1] || ''
    const side = args[2] || '' // 可选 'left'
    const markerClass =
      side === 'left'
        ? 'paranote-marker paranote-marker-left'
        : 'paranote-marker'

    return `<div class="paranote-paragraph paranote-${type}"><span class="${markerClass}">${note}</span>${content}</div>`
  },
  { ends: true },
)

// 2. 词语旁批：{% marginalia "词语" "注释内容" %}
hexo.extend.tag.register('marginalia', function (args) {
  const term = args[0] || ''
  const note = args[1] || ''
  return `<span class="marginalia-container"><span class="marginalia-term">${term}</span><span class="marginalia-note">${note}</span></span>`
})

// 3. 脚注引用：{% fn %}（自动编号）
let footnoteCounter = 0

hexo.extend.tag.register('fn', function (args) {
  footnoteCounter++
  const id = 'fn-' + footnoteCounter
  return `<sup id="fnref:${id}"><a href="#fn:${id}" class="footnote-ref">[${footnoteCounter}]</a></sup>`
})

// 每篇文章开头重置脚注计数
hexo.extend.filter.register(
  'before_post_render',
  function (data) {
    footnoteCounter = 0
    return data
  },
)

// 4. 脚注列表容器：{% footnotes %} 内容 {% endfootnotes %}
hexo.extend.tag.register(
  'footnotes',
  function (args, content) {
    return `<hr class="footnotes-separator"><ol class="footnotes-list">${content}</ol>`
  },
  { ends: true },
)

// 5. 单条脚注：{% fnitem "id" "注释文字" %}
hexo.extend.tag.register('fnitem', function (args) {
  const id = args[0] || ''
  const text = args[1] || ''
  return `<li id="fn:${id}">${text} <a href="#fnref:${id}" class="footnote-backref">↩</a></li>`
})

// 6. 首字下沉：{% dropcap "首字" %}后面的文字
hexo.extend.tag.register(
  'dropcap',
  function (args, content) {
    const letter = args[0] || ''
    return `<span class="drop-cap">${letter}</span>${content}`
  },
)

// 7. 重点文字：{% emphasis %}文字{% endemphasis %}
hexo.extend.tag.register(
  'emphasis',
  function (args, content) {
    return `<span class="text-emphasis">${content}</span>`
  },
  { ends: true },
)

// 8. 右浮动插图：{% figure-right "图片URL" "图注" %}
hexo.extend.tag.register('figureright', function (args) {
  const src = args[0] || ''
  const caption = args[1] || ''
  return `<figure class="article-image-right"><img src="${src}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`
})

// 9. 全宽插图：{% figure-full "图片URL" "图注" %}
hexo.extend.tag.register('figurefull', function (args) {
  const src = args[0] || ''
  const caption = args[1] || ''
  return `<figure class="article-image-full"><img src="${src}" alt="${caption}" /><figcaption>${caption}</figcaption></figure>`
})

// 10. 文章末尾装饰符：{% fin %}
hexo.extend.tag.register('fin', function () {
  return '<div class="article-fin">❦</div>'
})
