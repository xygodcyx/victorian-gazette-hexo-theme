;(function () {
  // 只在文章页运行
  const article = document.querySelector('.article-body')
  if (!article) return

  // 1. 计算阅读时间
  const timeEl = document.getElementById('reading-time')
  if (timeEl) {
    const text = article.textContent.trim()
    const chineseChars = (
      text.match(/[\u4e00-\u9fff]/g) || []
    ).length
    const englishWords = (text.match(/[a-zA-Z]+/g) || [])
      .length
    const minutes = Math.max(
      1,
      Math.ceil(chineseChars / 400 + englishWords / 200),
    )
    timeEl.textContent = '预计阅读 ' + minutes + ' 分钟'
  }

  // 2. 进度条
  const bar = document.getElementById(
    'reading-progress-bar',
  )
  console.log(bar)
  if (!bar) return

  function updateProgress() {
    const articleTop = article.getBoundingClientRect().top
    const articleHeight = article.offsetHeight
    const windowHeight = window.innerHeight
    const totalScroll = articleHeight - windowHeight
    if (totalScroll <= 0) {
      bar.style.width = '100%'
      return
    }

    const scrolledPast = Math.max(0, -articleTop)
    const progress = Math.min(
      100,
      Math.round((scrolledPast / totalScroll) * 100),
    )
    bar.style.width = progress + '%'
  }

  window.addEventListener('scroll', updateProgress, {
    passive: true,
  })
  window.addEventListener('resize', updateProgress, {
    passive: true,
  })
  updateProgress()
})()
