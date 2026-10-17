/* ============================================================
   cart-page.js — Full Cart page interactions + real Checkout
   Sends order data to POST /api/orders and saves to database.
============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  const cartLayout = document.getElementById('cartLayout');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartItemsList = document.getElementById('cartItemsList');
  const summaryRows = document.getElementById('summaryRows');
  const cartTotalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');
  const checkoutForm = document.getElementById('checkoutForm');
  const checkoutFormEl = document.getElementById('checkoutFormEl');
  const orderConfirm = document.getElementById('orderConfirm');
  const cartSection = document.querySelector('.cart-section');

  const API_URL = '/api/orders';

  function fmt(n) { return 'PKR ' + n.toLocaleString('en-PK'); }

  /* ---- Render cart ---- */
  function renderCart() {
    const items = Cart.getAll();

    if (!items.length) {
      cartLayout.style.display = 'none';
      cartEmpty.style.display = 'block';
      return;
    }

    cartLayout.style.display = 'grid';
    cartEmpty.style.display = 'none';

    // Item rows
    cartItemsList.innerHTML = items.map(item => `
      <div class="cart-item" id="ci-${item.id}">
        <div class="cart-item-info">
          <img src="${item.img}" alt="${item.name}" class="cart-item-img" loading="lazy"/>
          <div>
            <a href="product.html?id=${item.id}" class="cart-item-name">${item.name}</a>
            <p class="cart-item-unit">${fmt(item.price)} each</p>
          </div>
        </div>
        <div>
          <div class="qty-control" aria-label="Quantity for ${item.name}">
            <button class="qty-btn" data-id="${item.id}" data-action="dec" aria-label="Decrease quantity">−</button>
            <span class="qty-val" aria-live="polite">${item.qty}</span>
            <button class="qty-btn" data-id="${item.id}" data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <span class="cart-item-total">${fmt(item.price * item.qty)}</span>
        <button class="cart-remove-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">×</button>
      </div>
    `).join('');

    // Summary
    const sub = Cart.subtotal();
    const delivery = sub >= 1000 ? 0 : 150;
    const total = sub + delivery;

    summaryRows.innerHTML = `
      <div class="summary-row"><span>Subtotal</span><span>${fmt(sub)}</span></div>
      <div class="summary-row"><span>Delivery</span><span>${delivery === 0 ? '<span style="color:#2ecc71">Free</span>' : fmt(delivery)}</span></div>
      ${delivery > 0 ? `<div class="summary-row" style="font-size:11px;color:var(--ivory-faint);"><span colspan="2">Free delivery on orders over PKR 1,000</span></div>` : ''}
    `;

    cartTotalEl.textContent = fmt(total);

    // Bind qty buttons
    cartItemsList.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.id;
        const item = Cart.getAll().find(i => i.id === id);
        if (!item) return;
        const newQty = btn.dataset.action === 'inc' ? item.qty + 1 : item.qty - 1;
        Cart.setQty(id, newQty);
        renderCart();
      });
    });

    // Bind remove buttons
    cartItemsList.querySelectorAll('.cart-remove-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        Cart.remove(btn.dataset.id);
        renderCart();
        showToast('Item removed from cart.', '🗑️');
      });
    });
  }

  /* ---- Checkout accordion ---- */
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', () => {
      const isOpen = checkoutForm.style.display !== 'none';
      if (isOpen) {
        checkoutForm.style.display = 'none';
        checkoutBtn.setAttribute('aria-expanded', 'false');
        checkoutBtn.innerHTML = 'Proceed to Checkout <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M12 5l7 7-7 7"/></svg>';
      } else {
        checkoutForm.style.display = 'block';
        checkoutBtn.setAttribute('aria-expanded', 'true');
        checkoutBtn.textContent = '↑ Close Checkout';
        checkoutForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  /* ---- Place order form validation + real API call ---- */
  if (checkoutFormEl) {
    checkoutFormEl.addEventListener('submit', async (e) => {
      e.preventDefault();

      const nameEl = document.getElementById('co-name');
      const phoneEl = document.getElementById('co-phone');
      const addrEl = document.getElementById('co-addr');
      const notesEl = document.getElementById('co-notes');
      const nameErr = document.getElementById('coNameErr');
      const phoneErr = document.getElementById('coPhoneErr');
      const addrErr = document.getElementById('coAddrErr');

      let valid = true;
      const setErr = (el, errEl, show) => {
        el.classList.toggle('error', show);
        errEl.classList.toggle('visible', show);
      };

      // Client-side validation (mirrors server rules)
      if (!nameEl.value.trim() || nameEl.value.trim().length < 2) {
        setErr(nameEl, nameErr, true); valid = false;
      } else { setErr(nameEl, nameErr, false); }

      if (!phoneEl.value.trim() || phoneEl.value.trim().length < 10) {
        setErr(phoneEl, phoneErr, true); valid = false;
      } else { setErr(phoneEl, phoneErr, false); }

      if (!addrEl.value.trim() || addrEl.value.trim().length < 8) {
        setErr(addrEl, addrErr, true); valid = false;
      } else { setErr(addrEl, addrErr, false); }

      if (!valid) return;

      // Loading state
      const placeBtn = document.getElementById('placeOrderBtn');
      placeBtn.disabled = true;
      placeBtn.textContent = 'Placing Order…';

      const payMethod = document.querySelector('input[name="payment"]:checked')?.value || 'cod';
      const cartItems = Cart.getAll().map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      }));

      try {
        const response = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: nameEl.value.trim(),
            phone: phoneEl.value.trim(),
            address: addrEl.value.trim(),
            notes: notesEl ? notesEl.value.trim() : '',
            payment: payMethod,
            items: cartItems,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          // Build confirmation with real server-returned values
          buildConfirmation(
            nameEl.value.trim(),
            addrEl.value.trim(),
            data.orderId,
            data.subtotal,
            data.deliveryFee,
            data.total,
            payMethod
          );
          Cart.clear();
          cartSection.style.display = 'none';
          orderConfirm.style.display = 'block';
          orderConfirm.scrollIntoView({ behavior: 'smooth' });
        } else {
          const msg = data.errors
            ? data.errors.map(err => err.msg).join(' ')
            : (data.message || 'Could not place order. Please try again.');
          showToast(msg, '⚠️');
          placeBtn.disabled = false;
          placeBtn.textContent = 'Place Order';
        }
      } catch (err) {
        showToast('Cannot connect to server. Please start the backend by running: node server.js', '❌');
        placeBtn.disabled = false;
        placeBtn.textContent = 'Place Order';
      }
    });
  }

  function buildConfirmation(name, address, orderId, subtotal, deliveryFee, total, payMethod) {
    const payLabels = { cod: 'Cash on Delivery', jazz: 'JazzCash', easypaisa: 'EasyPaisa' };

    document.getElementById('confirmDetails').innerHTML = `
      <h4>Order Details</h4>
      <div class="confirm-row"><span>Order ID</span><span>${orderId}</span></div>
      <div class="confirm-row"><span>Name</span><span>${name}</span></div>
      <div class="confirm-row"><span>Delivery to</span><span>${address.substring(0, 60)}${address.length > 60 ? '…' : ''}</span></div>
      <div class="confirm-row"><span>Payment</span><span>${payLabels[payMethod] || payMethod}</span></div>
      <div class="confirm-row"><span>Subtotal</span><span>PKR ${subtotal.toLocaleString('en-PK')}</span></div>
      <div class="confirm-row"><span>Delivery</span><span>${deliveryFee === 0 ? 'Free' : 'PKR 150'}</span></div>
      <div class="confirm-row"><span>Grand Total</span><span>PKR ${total.toLocaleString('en-PK')}</span></div>
    `;
  }

  /* ---- Initial render ---- */
  renderCart();
});
