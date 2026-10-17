/* ============================================================
   product.js — Dynamic product data + page render
============================================================ */

/* ---- All Products Catalogue ---- */
const PRODUCTS = {
  'ub-smash': {
    id: 'ub-smash', cat: 'Burgers',
    name: 'Urban Smash Double',
    price: 890,
    badge: 'Best Seller',
    rating: 4.9, reviews: 312,
    desc: 'Two hand-smashed beef patties cooked on a searingly hot flat-top, layered with melted American cheese, slow-caramelised onions, crispy lettuce, and our legendary secret sauce — all inside a toasted brioche bun. This is the burger that started it all.',
    tags: ['100% Halal', 'Flame-Grilled', 'House Sauce', 'Brioche Bun'],
    img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=900&q=90',
    thumbs: [
      'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&q=80',
      'https://images.unsplash.com/photo-1550317138-10000687a72b?w=300&q=80',
      'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&q=80',
    ],
    related: ['bbq-tower', 'mushroom-swiss', 'crunch-chicken', 'loaded-fries'],
  },
  'bbq-tower': {
    id: 'bbq-tower', cat: 'Burgers',
    name: 'BBQ Tower Burger',
    price: 950,
    rating: 4.7, reviews: 198,
    desc: 'A towering stack of our signature beef patty, smoky house-made BBQ sauce, crispy onion rings, beef rasher, and sharp cheddar. Stack it, smash it, love it.',
    tags: ['100% Halal', 'Smoky BBQ', 'Single Patty'],
    img: 'https://images.unsplash.com/photo-1550317138-10000687a72b?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1550317138-10000687a72b?w=300&q=80'],
    related: ['ub-smash', 'mushroom-swiss', 'crunch-chicken', 'classic-fries'],
  },
  'mushroom-swiss': {
    id: 'mushroom-swiss', cat: 'Burgers',
    name: 'Mushroom Swiss Melt',
    price: 820,
    rating: 4.6, reviews: 145,
    desc: 'Earthy sautéed wild mushrooms, creamy Swiss cheese, truffle aioli, and peppery arugula on a toasted bun. Sophisticated, savoury, and utterly satisfying.',
    tags: ['100% Halal', 'Truffle Aioli', 'Wild Mushrooms'],
    img: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=300&q=80'],
    related: ['ub-smash', 'bbq-tower', 'loaded-fries', 'oreo-shake'],
  },
  'marg-pizza': {
    id: 'marg-pizza', cat: 'Pizza',
    name: 'Margherita Royale',
    price: 1150,
    badge: 'Fan Fave',
    rating: 4.8, reviews: 226,
    desc: 'Stone-baked 12" base, crushed San Marzano tomatoes, hand-pulled buffalo mozzarella, and a finishing drizzle of cold-pressed extra-virgin olive oil with fresh basil. Simple. Perfect.',
    tags: ['Stone Baked', 'Buffalo Mozzarella', 'No Meat', 'Large'],
    img: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=300&q=80', 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80'],
    related: ['BBQ-chicken-pizza', 'truffle-pasta', 'rose-pasta', 'lemonade'],
  },
  'BBQ-chicken-pizza': {
    id: 'BBQ-chicken-pizza', cat: 'Pizza',
    name: 'BBQ Chicken Blaze',
    price: 1250,
    rating: 4.7, reviews: 183,
    desc: 'Shredded BBQ chicken, sweet caramelised onions, smoked mozzarella, and a jalapeño honey drizzle on our signature stone-baked crust.',
    tags: ['Stone Baked', '100% Halal', 'Smoky', 'Large'],
    img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=300&q=80'],
    related: ['marg-pizza', 'truffle-pasta', 'crunch-chicken', 'lemonade'],
  },
  'truffle-pasta': {
    id: 'truffle-pasta', cat: 'Pasta',
    name: 'Truffle Prawn Linguine',
    price: 1300,
    badge: "Chef's Pick",
    rating: 4.9, reviews: 97,
    desc: 'Al dente linguine tossed with tiger prawns, black truffle oil, aged parmesan, a whisper of chilli, and fresh parsley. Our most talked-about dish.',
    tags: ['Truffle Oil', 'Tiger Prawns', 'Parmesan', 'Al Dente'],
    img: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=300&q=80', 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=80'],
    related: ['rose-pasta', 'marg-pizza', 'oreo-shake', 'lemonade'],
  },
  'rose-pasta': {
    id: 'rose-pasta', cat: 'Pasta',
    name: 'Rose Chicken Penne',
    price: 1100,
    rating: 4.6, reviews: 134,
    desc: 'Grilled chicken breast, roasted red peppers, and fresh cream combined in our house-made rose sauce. Finished with basil oil and a grating of aged parmesan.',
    tags: ['Grilled Chicken', 'Rose Sauce', 'Al Dente', 'Halal'],
    img: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1612874742237-6526221588e3?w=300&q=80'],
    related: ['truffle-pasta', 'marg-pizza', 'lemonade', 'classic-fries'],
  },
  'loaded-fries': {
    id: 'loaded-fries', cat: 'Fries',
    name: 'Loaded Cheese Fries',
    price: 450,
    badge: '🔥 Hot',
    rating: 4.8, reviews: 289,
    desc: 'A generous tangle of golden crinkle fries smothered in warm nacho cheese sauce, pickled jalapeños, crispy shallots, and spring onions.',
    tags: ['Crinkle Cut', 'Nacho Cheese', 'Jalapeños', 'Shareable'],
    img: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=300&q=80', 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=300&q=80'],
    related: ['classic-fries', 'ub-smash', 'crunch-chicken', 'oreo-shake'],
  },
  'classic-fries': {
    id: 'classic-fries', cat: 'Fries',
    name: 'Classic Salted Fries',
    price: 280,
    rating: 4.5, reviews: 410,
    desc: 'Thin-cut, double-fried golden potatoes seasoned with our house salt blend. Crispy outside, fluffy inside. The purist\'s choice.',
    tags: ['Thin-Cut', 'Double-Fried', 'Sea Salt'],
    img: 'https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1518013431117-eb1465fa5752?w=300&q=80'],
    related: ['loaded-fries', 'ub-smash', 'bbq-tower', 'oreo-shake'],
  },
  'crunch-chicken': {
    id: 'crunch-chicken', cat: 'Fried Chicken',
    name: 'Crunch Fire Chicken',
    price: 750,
    badge: '🔥 Spicy',
    rating: 4.9, reviews: 257,
    desc: 'A bone-in chicken thigh marinated in our Nashville hot blend, slow-fried to shatteringly crispy perfection. Topped with house pickles and a honey-sriracha drizzle on a toasted sesame bun.',
    tags: ['Nashville Hot', '100% Halal', 'Bone-in Thigh', 'Spicy'],
    img: 'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?w=300&q=80', 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&q=80'],
    related: ['crispy-strips', 'loaded-fries', 'ub-smash', 'oreo-shake'],
  },
  'crispy-strips': {
    id: 'crispy-strips', cat: 'Fried Chicken',
    name: 'Crispy Chicken Strips',
    price: 680,
    rating: 4.6, reviews: 178,
    desc: 'Juicy chicken breast tenders coated in a spiced panko crust, fried to a perfect golden crunch. Served with smoky chipotle dipping sauce.',
    tags: ['Breast Strips', 'Panko Crust', '100% Halal', 'Chipotle Dip'],
    img: 'https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=300&q=80'],
    related: ['crunch-chicken', 'loaded-fries', 'ub-smash', 'lemonade'],
  },
  'shawarma-wrap': {
    id: 'shawarma-wrap', cat: 'Wraps',
    name: 'Smoky Shawarma Wrap',
    price: 520,
    rating: 4.7, reviews: 201,
    desc: "Flame-grilled chicken strips, house garlic sauce, crunchy pickles, tomato, and fresh herbs rolled tightly in a warm soft flatbread. Karachi's favourite grab-and-go.",
    tags: ['Grilled Chicken', 'Garlic Sauce', 'Flatbread', 'Halal'],
    img: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=300&q=80'],
    related: ['bbq-wrap', 'crunch-chicken', 'classic-fries', 'lemonade'],
  },
  'bbq-wrap': {
    id: 'bbq-wrap', cat: 'Wraps',
    name: 'BBQ Beef Wrap',
    price: 580,
    rating: 4.6, reviews: 145,
    desc: 'Seasoned ground beef, smoky BBQ sauce, crisp romaine lettuce, vine tomato, and melted cheddar in a toasted flour tortilla.',
    tags: ['Ground Beef', 'BBQ Sauce', 'Tortilla', 'Halal'],
    img: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=300&q=80'],
    related: ['shawarma-wrap', 'ub-smash', 'classic-fries', 'oreo-shake'],
  },
  'oreo-shake': {
    id: 'oreo-shake', cat: 'Drinks',
    name: 'Oreo Thick Shake',
    price: 380,
    rating: 4.8, reviews: 322,
    desc: 'Velvety vanilla soft-serve blended with crushed Oreo cookies, piled with whipped cream and a drizzle of dark chocolate sauce. Ridiculously thick. Ridiculously good.',
    tags: ['Thick Shake', 'Oreo', 'Vanilla', 'Whipped Cream'],
    img: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1544145945-f90425340c7e?w=300&q=80', 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80'],
    related: ['lemonade', 'loaded-fries', 'ub-smash', 'crunch-chicken'],
  },
  'lemonade': {
    id: 'lemonade', cat: 'Drinks',
    name: 'Fresh Mint Lemonade',
    price: 220,
    rating: 4.7, reviews: 267,
    desc: 'Hand-squeezed lemons, crushed fresh mint, a hint of ginger syrup, and chilled sparkling water. The perfect companion to any Urban Bites meal.',
    tags: ['Hand-Squeezed', 'Mint', 'Ginger', 'Refreshing'],
    img: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=900&q=90',
    thumbs: ['https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&q=80'],
    related: ['oreo-shake', 'classic-fries', 'loaded-fries', 'ub-smash'],
  },
};

/* ---- Render product page ---- */
document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'ub-smash';
  const p = PRODUCTS[id] || PRODUCTS['ub-smash'];

  const skel = document.getElementById('productSkeleton');
  const grid = document.getElementById('productGrid');
  const titleEl = document.getElementById('pageTitle');
  const breadEl = document.getElementById('breadProduct');
  const relatedGrid = document.getElementById('relatedGrid');

  if (!p) {
    if (skel) skel.innerHTML = `<div style="text-align:center;padding:80px 20px;grid-column:1/-1;">
      <p style="color:var(--ivory-faint);font-size:18px;">Product not found. <a href="menu.html" style="color:var(--orange);">Browse Menu →</a></p>
    </div>`;
    return;
  }

  // Page title + breadcrumb
  if (titleEl) titleEl.textContent = `${p.name} — Urban Bites`;
  if (breadEl) breadEl.textContent = p.name;

  // Build main product HTML
  let thumbsHTML = '';
  if (p.thumbs && p.thumbs.length > 1) {
    thumbsHTML = `<div class="prod-thumbs" role="list" aria-label="Product images">
      ${p.thumbs.map((t, i) => `
        <div class="prod-thumb ${i === 0 ? 'active' : ''}" role="listitem" tabindex="0" data-img="${t}" onclick="switchImg(this, '${t}')">
          <img src="${t}" alt="${p.name} view ${i + 1}" loading="lazy"/>
        </div>`).join('')}
    </div>`;
  }

  let tagsHTML = p.tags.map(t => `<span class="tag">${t}</span>`).join('');
  let starsHTML = '★'.repeat(Math.floor(p.rating)) + (p.rating % 1 >= 0.5 ? '½' : '');

  grid.innerHTML = `
    <div class="prod-img-col reveal-left">
      <div class="prod-main-img-wrap">
        <img src="${p.img}" alt="${p.name}" class="prod-main-img" id="prodMainImg" loading="eager"/>
        ${p.badge ? `<span class="prod-badge">${p.badge}</span>` : ''}
      </div>
      ${thumbsHTML}
    </div>
    <div class="prod-info-col reveal-right">
      <p class="prod-cat">${p.cat}</p>
      <h1 class="prod-title">${p.name}</h1>
      <div class="prod-rating">
        <span class="prod-stars" aria-label="${p.rating} out of 5 stars">${starsHTML}</span>
        <span class="prod-reviews">${p.rating} (${p.reviews} reviews)</span>
      </div>
      <div class="prod-price">PKR ${p.price.toLocaleString('en-PK')} <small>/ per item</small></div>
      <p class="prod-desc">${p.desc}</p>
      <div class="prod-tags">${tagsHTML}</div>
      <hr class="prod-divider"/>
      <div class="prod-qty-row">
        <span class="prod-qty-label">Quantity</span>
        <div class="qty-control" aria-label="Quantity selector">
          <button class="qty-btn" id="qtyMinus" aria-label="Decrease quantity" onclick="changeQty(-1)">−</button>
          <span class="qty-val" id="qtyVal" aria-live="polite">1</span>
          <button class="qty-btn" id="qtyPlus" aria-label="Increase quantity" onclick="changeQty(1)">+</button>
        </div>
      </div>
      <div class="prod-actions">
        <button class="btn btn-primary btn-add-cart" id="addToCartBtn" aria-label="Add ${p.name} to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
          Add to Cart
        </button>
        <a href="cart.html" class="btn btn-secondary">Go to Cart →</a>
      </div>
      <div class="prod-meta">
        <div class="prod-meta-item"><span class="icon">🥩</span> <span><strong>Halal Certified</strong> — All meats are 100% halal</span></div>
        <div class="prod-meta-item"><span class="icon">🔥</span> <span><strong>Flame-Grilled</strong> — Cooked to order on open flame</span></div>
        <div class="prod-meta-item"><span class="icon">📍</span> <span><strong>Pick-up / Dine-in</strong> — Plot 47, Block 4, Clifton, Karachi</span></div>
      </div>
    </div>
  `;

  // Qty logic
  let qty = 1;
  window.changeQty = (delta) => {
    qty = Math.max(1, Math.min(20, qty + delta));
    document.getElementById('qtyVal').textContent = qty;
  };

  // Thumbnail switcher
  window.switchImg = (thumbEl, imgSrc) => {
    document.getElementById('prodMainImg').src = imgSrc;
    document.querySelectorAll('.prod-thumb').forEach(t => t.classList.remove('active'));
    thumbEl.classList.add('active');
  };

  // Add to cart
  document.getElementById('addToCartBtn').addEventListener('click', () => {
    Cart.add({ id: p.id, name: p.name, price: p.price, img: p.thumbs[0] || p.img, qty });
    showToast(`<strong>${p.name}</strong> × ${qty} added to cart!`, '🛒');
  });

  // Related items
  if (p.related && relatedGrid) {
    relatedGrid.innerHTML = p.related.map(rid => {
      const r = PRODUCTS[rid];
      if (!r) return '';
      return `
        <a href="product.html?id=${r.id}" class="related-card reveal">
          <div style="overflow:hidden;">
            <img src="${r.thumbs ? r.thumbs[0] : r.img}" alt="${r.name}" class="related-card-img" loading="lazy"/>
          </div>
          <div class="related-card-body">
            <p class="related-card-name">${r.name}</p>
            <p class="related-card-price">PKR ${r.price.toLocaleString('en-PK')}</p>
          </div>
        </a>`;
    }).join('');
  }

  // Run scroll-reveal on injected content
  setTimeout(() => {
    const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } });
    }, { threshold: 0.1 });
    revealEls.forEach(el => { if (!el.classList.contains('visible')) observer.observe(el); });
  }, 100);
});
