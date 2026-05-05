const { truncate, stripHTML } = require('hexo-util')

// 过滤块级标签
function stripBlockTags(html) {
  return html
    .replace(
      /<\/?(p|div|figure|pre|table|blockquote|h[1-6]|ul|ol|li|hr|br|section|article|header|footer|aside|nav)[^>]*>/gi,
      '',
    )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

hexo.extend.helper.register(
  'safe_truncate',
  function (content, options) {
    // 优先使用 <!-- more --> 手动摘要
    if (this.excerpt) return this.excerpt

    const config = Object.assign(
      {
        length: 120,
        omission: '…',
      },
      options,
    )

    // 1. 去掉所有 HTML 标签，得到纯文本
    const plainText = stripHTML(stripBlockTags(content))

    // 2. 截取纯文本到指定字数
    if (plainText.length <= config.length) return plainText

    return (
      plainText.slice(0, config.length).trimEnd() +
      config.omission
    )
  },
)
