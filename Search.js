

document.addEventListener('DOMContentLoaded', function () {
  // try multiple selectors to find the search input and icon
  const input = document.getElementById('searchInput')
             || document.querySelector('input[type="search"]')
             || document.querySelector('input[type="text"]')
             || document.querySelector('input[placeholder*="Search"]')
             || document.querySelector('input[placeholder*="product"]');

  const icon = document.getElementById('searchIcon')
            || document.querySelector('.search-box img')
            || document.querySelector('.search-icon')
            || document.querySelector('img[alt*="search" i]')
            || document.querySelector('.search-button img');

  // function that heuristically finds product containers on the page
  function findProductNodes() {
    // 1) exact class used in examples
    let nodes = Array.from(document.querySelectorAll('.product-box'));
    if (nodes.length) return nodes;

    // 2) direct children of a .products container
    const productsContainer = document.querySelector('.products');
    if (productsContainer) {
      nodes = Array.from(productsContainer.children).filter(n => n.nodeType === 1);
      if (nodes.length) return nodes;
    }

    // 3) any element with class name containing "product" or "card" or "item"
    nodes = Array.from(document.querySelectorAll('[class*="product"], [class*="card"], [class*="item"]'));
    if (nodes.length) {
      // de-duplicate and return
      return nodes.filter((v,i,a)=>a.indexOf(v)===i);
    }

    // 4) fallback: find parents of h3/h4 headings (common for product titles)
    const headers = Array.from(document.querySelectorAll('h3, h4, .title, .name'));
    if (headers.length) {
      const parents = headers.map(h => h.closest('div') || h.parentElement).filter(Boolean);
      if (parents.length) return parents.filter((v,i,a)=>a.indexOf(v)===i);
    }

    // 5) final fallback: divs that contain an image and some text
    const divs = Array.from(document.querySelectorAll('div')).filter(d => {
      try {
        return d.querySelector('img') && d.innerText.trim().length > 0;
      } catch (e) { return false; }
    }).slice(0, 50);

    return divs;
  }

  // normalize text
  function norm(s) { return (s || '').toLowerCase().trim(); }

  // main search routine
  function searchItems() {
    const q = input ? norm(input.value) : '';
    const products = findProductNodes();

    if (!products || products.length === 0) {
      console.warn('Search script: no product nodes found. Consider adding class="product-box" to each product container or wrapping them in <div class="products">.');
    }

    products.forEach(p => {
      // build text to search: title, data-name attr, fallback to innerText
      const titleEl = p.querySelector('h3, h4, .title, .name, figcaption');
      const pieces = [];
      if (titleEl) pieces.push(titleEl.innerText);
      const dataName = p.getAttribute && p.getAttribute('data-name');
      if (dataName) pieces.push(dataName);
      pieces.push(p.innerText || '');
      const text = norm(pieces.join(' '));

      // match
      const keep = (q === '') || (text.includes(q));
      // show/hide
      p.style.display = keep ? '' : 'none';
    });
  }

  // wire events
  if (input) {
    input.addEventListener('keyup', searchItems);        // live search
    input.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') searchItems();            // enter key triggers search
    });
  } else {
    console.warn('Search script: search input not found. Add id="searchInput" or use a text input on the page.');
  }

  if (icon) {
    icon.addEventListener('click', searchItems);
    // if the icon is inside a button, make sure clicking that button triggers search too
    if (icon.parentElement && icon.parentElement.tagName === 'BUTTON') {
      icon.parentElement.addEventListener('click', searchItems);
    }
  } else {
    console.warn('Search script: search icon not found. Add id="searchIcon" to your image or ensure it exists inside .search-box.');
  }

  // initial show-all
  searchItems();
});
