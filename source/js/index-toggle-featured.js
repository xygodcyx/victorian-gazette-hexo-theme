function toggleFeatured() {
  var body = document.querySelector('.featured-body')
  var btn = document.querySelector('.featured-toggle-btn')
  if (body.classList.contains('expanded')) {
    body.classList.remove('expanded')
    btn.textContent = '展开全文 ▼'
  } else {
    body.classList.add('expanded')
    btn.textContent = '收起 ▲'
  }
}
