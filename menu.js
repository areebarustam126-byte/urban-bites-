/* ============================================================
   menu.js — Category filter + Add to Cart for Menu page
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ---- Initialize card stagger index ---- */
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach((card, i) => {
        card.style.setProperty('--card-index', i % 12);
    });

    /* ---- Category filter ---- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const menuEmpty = document.getElementById('menuEmpty');
    let isFiltering = false;

    function filterMenu(cat) {
        if (!cat) cat = 'all';

        let activeBtn = null;
        filterBtns.forEach(b => {
            const isActive = b.dataset.cat === cat;
            b.classList.toggle('active', isActive);
            b.setAttribute('aria-pressed', isActive ? 'true' : 'false');
            if (isActive) activeBtn = b;
        });

        // Smoothly scroll active button into view on mobile
        if (activeBtn) {
            activeBtn.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }

        // Quick fade-out for non-matching cards
        menuCards.forEach(card => {
            const match = cat === 'all' || card.dataset.cat === cat;
            if (!match && !card.classList.contains('hidden')) {
                card.classList.add('filtering-out');
            }
        });

        setTimeout(() => {
            let visible = 0;
            menuCards.forEach(card => {
                const match = cat === 'all' || card.dataset.cat === cat;
                card.classList.remove('filtering-out', 'filtering-in');

                if (match) {
                    card.classList.remove('hidden');
                    card.style.setProperty('--card-index', visible % 9);
                    card.classList.add('filtering-in');
                    visible++;
                } else {
                    card.classList.add('hidden');
                }
            });

            if (menuEmpty) menuEmpty.style.display = visible === 0 ? 'block' : 'none';
        }, 160);
    }

    // Expose globally (used by footer links and external links)
    window.filterMenu = filterMenu;

    filterBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            filterMenu(btn.dataset.cat);
        });
    });

    /* ---- Check URL param for initial category ---- */
    const urlCat = new URLSearchParams(window.location.search).get('cat');
    if (urlCat) {
        filterMenu(urlCat);
    }

    /* ---- Add to Cart with Micro-animation ---- */
    document.querySelectorAll('.add-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const { id, name, price, img } = btn.dataset;
            Cart.add({ id, name, price: parseInt(price), img, qty: 1 });

            // Button micro-animation feedback
            btn.classList.add('added');
            const originalText = btn.innerHTML;
            btn.innerHTML = '✓ Added';
            setTimeout(() => {
                btn.classList.remove('added');
                btn.innerHTML = originalText;
            }, 1000);

            showToast(`<strong>${name}</strong> added to cart!`, '🛒');
        });
    });

});
