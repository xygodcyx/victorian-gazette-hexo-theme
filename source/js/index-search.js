import Fuse from 'https://cdn.jsdelivr.net/npm/fuse.js@7.3.0/dist/fuse.mjs'

async function initSearch() {
  const res = await fetch('/search.json')
  if (!res.ok) return
  const data = await res.json()

  const openBtns = document.querySelectorAll('.open-search')
  const closeBtn = document.getElementById('close-search')
  const modal = document.getElementById('search-modal')
  const input = document.getElementById('search-input')
  const resultsBox = document.getElementById(
    'search-results',
  )

  let lastFocusedElement = null
  let selectedIndex = 0
  let currentResults = []
  let debounceTimer = null

  const fuse = new Fuse(data, {
    keys: [
      { name: 'title', weight: 0.6 },
      { name: 'content', weight: 0.4 },
    ],
    includeScore: true,
    includeMatches: true,
    threshold: 0.3,
    distance: 100,
    useExtendedSearch: true,
    minMatchCharLength: 1,
    shouldSort: true,
    findAllMatches: true,
    ignoreLocation: true,
    ignoreFieldNorm: true,
  })

  function showAllResults() {
    readerResult(data)
    highlightKeyword([])
  }

  showAllResults()

  openBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      lastFocusedElement = document.activeElement
      openModal()
    })
  })

  closeBtn.addEventListener('click', closeModal)

  function openModal() {
    modal.classList.add('active')
    document.body.classList.add('modal-open')
    input.focus()
    selectedIndex = 0
  }

  function closeModal() {
    modal.classList.remove('active')
    document.body.classList.remove('modal-open')
    lastFocusedElement?.focus()
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal()
  })

  // 键盘快捷键
  document.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey && e.shiftKey && e.key === 'K') ||
      (e.ctrlKey && e.key === 'k')
    ) {
      e.preventDefault()
      if (!modal.classList.contains('active')) openModal()
      else input.focus()
    }
    if (!modal.classList.contains('active')) return
    if (e.key === 'Escape') {
      closeModal()
      return
    }

    const items = resultsBox.querySelectorAll(
      '.search-result-item',
    )
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (items.length > 0) {
        selectedIndex = Math.min(
          selectedIndex + 1,
          items.length - 1,
        )
        updateSelectedItem(items)
      }
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (items.length > 0) {
        selectedIndex = Math.max(selectedIndex - 1, 0)
        updateSelectedItem(items)
      }
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (selectedIndex >= 0 && items[selectedIndex]) {
        items[selectedIndex].click()
      } else if (items.length > 0) {
        items[0].click()
      }
    }
  })

  function updateSelectedItem(items) {
    items.forEach((item, i) => {
      if (i === selectedIndex) {
        item.classList.add('selected')
        item.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      } else {
        item.classList.remove('selected')
      }
    })
  }

  function readerResult(results) {
    currentResults = results
    resultsBox.innerHTML = results
      .map((post, i) => {
        const snippet =
          escapeHtml((post.content || '').slice(0, 120)) +
          '...'
        return `<a class="search-result-item" href="${post.url.startsWith('//') ? post.url.slice(1) : post.url}" data-index="${i}">
          <div class="search-result-header"><span class="search-result-icon"></span><span class="search-title">${escapeHtml(post.title)}</span></div>
          <p class="search-content">${snippet}</p></a>`
      })
      .join('')
    selectedIndex = 0
    updateSelectedItem(
      resultsBox.querySelectorAll('.search-result-item'),
    )
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  function highlightKeyword(keywords) {
    if (!('CSS' in window) || !CSS.highlights) return
    CSS.highlights.clear()
    if (!keywords.length) return
    const ranges = []
    resultsBox
      .querySelectorAll('.search-result-item')
      .forEach((item) => {
        const walker = document.createTreeWalker(
          item,
          NodeFilter.SHOW_TEXT,
        )
        let node
        while ((node = walker.nextNode())) {
          for (const word of keywords) {
            if (!word) continue
            const regex = new RegExp(
              word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
              'gi',
            )
            let match
            while (
              (match = regex.exec(node.textContent)) !==
              null
            ) {
              const range = new Range()
              range.setStart(node, match.index)
              range.setEnd(
                node,
                match.index + match[0].length,
              )
              ranges.push(range)
            }
          }
        }
      })
    if (ranges.length) {
      CSS.highlights.set(
        'search-highlight',
        new Highlight(...ranges),
      )
    }
  }

  input.addEventListener('input', (e) => {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      const query = e.target.value.trim()
      if (!query) {
        readerResult(data)
        highlightKeyword([])
        return
      }
      const keywords = query.split(/\s+/).filter(Boolean)
      const extendedQuery = keywords
        .map((k) => `'${k}`)
        .join(' ')
      const results = fuse
        .search(extendedQuery)
        .map((r) => r.item)
      if (!results.length) {
        resultsBox.innerHTML =
          '<div class="search-empty"><span class="search-empty-icon"></span><p>未找到相关文章</p><p class="search-empty-tip">试试其他关键词吧</p></div>'
        highlightKeyword([])
        currentResults = []
        return
      }
      readerResult(results)
      highlightKeyword(keywords)
    }, 200)
  })

  window.addEventListener('beforeunload', () =>
    clearTimeout(debounceTimer),
  )
}

initSearch()
