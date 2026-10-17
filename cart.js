/* ============================================================
   cart.js — LocalStorage Cart Engine for URBAN BITES
============================================================ */

const Cart = (() => {
  const KEY = 'ub_cart';

  function getAll() {
    try { return JSON.parse(localStorage.getItem(KEY)) || []; }
    catch { return []; }
  }

  function save(items) {
    localStorage.setItem(KEY, JSON.stringify(items));
    _emit();
  }

  function add(item) {
    const items = getAll();
    const idx = items.findIndex(i => i.id === item.id);
    if (idx > -1) {
      items[idx].qty += (item.qty || 1);
    } else {
      items.push({ ...item, qty: item.qty || 1 });
    }
    save(items);
  }

  function remove(id) {
    save(getAll().filter(i => i.id !== id));
  }

  function setQty(id, qty) {
    const items = getAll();
    const idx = items.findIndex(i => i.id === id);
    if (idx > -1) {
      if (qty <= 0) { items.splice(idx, 1); }
      else { items[idx].qty = qty; }
    }
    save(items);
  }

  function clear() { save([]); }

  function count() { return getAll().reduce((s, i) => s + i.qty, 0); }

  function subtotal() {
    return getAll().reduce((s, i) => s + i.price * i.qty, 0);
  }

  /* Event bus — simple pub/sub */
  const _listeners = [];
  function _emit() { _listeners.forEach(fn => fn(getAll())); }
  function onChange(fn) { _listeners.push(fn); }

  return { getAll, add, remove, setQty, clear, count, subtotal, onChange };
})();

/* ============================================================
   Update all cart badges on the page
============================================================ */
function updateCartBadges() {
  const count = Cart.count();
  document.querySelectorAll('.cart-badge').forEach(el => {
    el.textContent = count;
    const wasVisible = el.classList.contains('visible');
    el.classList.toggle('visible', count > 0);
    if (count > 0) {
      el.classList.remove('bounce');
      // trigger reflow so re-adding class restarts animation
      void el.offsetWidth;
      el.classList.add('bounce');
    }
  });
}

Cart.onChange(updateCartBadges);

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadges();
});
