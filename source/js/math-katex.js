;(function () {
  const article = document.querySelector('.article-body')
  if (!article) return

  let html = article.innerHTML

  // 第1步：保护代码块（<pre>, <code>, <figure class="highlight">）
  const codeBlocks = []
  const PLACEHOLDER = '___KATEX_CODE_BLOCK_'

  html = html.replace(
    /<figure\s+class="highlight"[\s\S]*?<\/figure>/g,
    (m) => {
      codeBlocks.push(m)
      return PLACEHOLDER + (codeBlocks.length - 1) + '___'
    },
  )
  html = html.replace(/<pre[\s\S]*?<\/pre>/g, (m) => {
    codeBlocks.push(m)
    return PLACEHOLDER + (codeBlocks.length - 1) + '___'
  })
  html = html.replace(/<code[\s\S]*?<\/code>/g, (m) => {
    codeBlocks.push(m)
    return PLACEHOLDER + (codeBlocks.length - 1) + '___'
  })

  // 第2步：渲染公式
  function cleanFormula(f) {
    return f
      .replace(/<br\s*\/?>/gi, '\n')
      .replace(/\\\\/g, '\\')
      .replace(/&gt;/g, '>')
      .replace(/&lt;/g, '<')
      .replace(/&amp;/g, '&')
  }

  // 优先处理 $$...$$（块级），再处理 $...$（行内），避免冲突
  // 注意正则：[\s\S]*? 非贪婪匹配，? 让最短匹配
  html = html.replace(
    /\$\$([\s\S]*?)\$\$/g,
    (match, formula) => {
      try {
        const clean = cleanFormula(formula).trim()
        if (!clean) return match
        return katex.renderToString(clean, {
          displayMode: true,
          throwOnError: false,
        })
      } catch (e) {
        return match
      }
    },
  )

  html = html.replace(
    /(^|[^\\$])\$([^$]+?)\$/g,
    (match, before, formula) => {
      try {
        const trimmed = formula.trim()
        // 忽略纯数字或纯标点
        if (/^[\d\s.,;:!?()\[\]{}'\-–—]+$/.test(trimmed))
          return match
        // 至少要包含一个数学特征（\命令、^、_、{\}）
        if (!/[\\^_{}]/.test(trimmed)) return match
        const clean = cleanFormula(trimmed)
        return (
          before +
          katex.renderToString(clean, {
            displayMode: false,
            throwOnError: false,
          })
        )
      } catch (e) {
        return match
      }
    },
  )

  // 第3步：还原代码块
  html = html.replace(
    new RegExp(PLACEHOLDER + '(\\d+)___', 'g'),
    (_, i) => codeBlocks[parseInt(i)],
  )

  article.innerHTML = html
})()
