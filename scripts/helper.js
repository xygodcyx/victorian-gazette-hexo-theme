const { truncate } = require('hexo-util')

// 过滤掉块级元素，只保留内联标签
function stripBlockTags(html) {
  return (
    html
      // 移除块级元素标签，但保留其内部文字
      .replace(
        /<\/?(p|div|figure|pre|table|blockquote|h[1-6]|ul|ol|li|hr|br|section|article|header|footer|aside|nav)[^>]*>/gi,
        '',
      )
      // 清理多余的空白行
      .replace(/\n{3,}/g, '\n\n')
      .trim()
  )
}

hexo.extend.helper.register(
  'safe_truncate',
  function (content, options) {
    // 1. 优先使用 <!-- more --> 手动摘要
    if (this.excerpt) return this.excerpt

    // 2. 合并参数
    const config = Object.assign(
      {
        length: 150,
        omission: '…',
      },
      options,
    )

    // 3. 先过滤掉块级标签，避免截取到表格/图片等
    const inlineOnly = stripBlockTags(content)

    // 4. 安全截断（自动闭合标签）
    return truncate(inlineOnly, config)
  },
)
