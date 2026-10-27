/* Demo shop logic: pushes GA4-style e-commerce events to the dataLayer.
   No personal data is collected. Cart lives in sessionStorage. */
window.dataLayer = window.dataLayer || [];

var PRODUCTS = {
  'OF-001': { item_id: 'OF-001', item_name: 'Nordvik Lounge Set',     item_category: 'outdoor_furniture', price: 3500 },
  'SH-001': { item_id: 'SH-001', item_name: 'Nordvik Garden Studio', item_category: 'summer_house',      price: 9000 }
};
var VAT = { DE: 0.19, AT: 0.20, FR: 0.20, NL: 0.21, UK: 0.20, SE: 0.25 };

function store(key, val) { try { if (val === undefined) return sessionStorage.getItem(key); sessionStorage.setItem(key, val); } catch (e) { return null; } }
var market = (new URLSearchParams(location.search).get('market') || store('market') || 'DE').toUpperCase();
store('market', market);

function getCart() { try { return JSON.parse(store('cart') || '[]'); } catch (e) { return []; } }
function itemsFor(ids) { return ids.map(function (id) { return Object.assign({ quantity: 1 }, PRODUCTS[id]); }); }
function valueOf(items) { return items.reduce(function (s, i) { return s + i.price * i.quantity; }, 0); }

function pushEcom(event, ecommerce) {
  window.dataLayer.push({ ecommerce: null });                  // clear the previous ecommerce object
  window.dataLayer.push({ event: event, market: market, ecommerce: ecommerce });
}
var renderCart = null;   // set on the checkout page so the summary can refresh when the market changes

function addMarketSelector() {
  var header = document.querySelector('header'); if (!header) return;
  var wrap = document.createElement('label'); wrap.className = 'market-select'; wrap.textContent = 'Market: ';
  var sel = document.createElement('select'); sel.id = 'market-select';
  Object.keys(VAT).forEach(function (m) { var o = document.createElement('option'); o.value = m; o.textContent = m; sel.appendChild(o); });
  sel.value = market;
  sel.addEventListener('change', function () {
    market = sel.value; store('market', market);
    var q = document.getElementById('quote-market'); if (q) q.value = market;
    if (renderCart) renderCart();
  });
  wrap.appendChild(sel); header.appendChild(wrap);
}
function say(text) { var m = document.getElementById('msg'); if (m) m.textContent = text; }

document.addEventListener('DOMContentLoaded', function () {
  var page = document.body.getAttribute('data-page');
  addMarketSelector();

  if (page === 'product') {
    var id = document.body.getAttribute('data-product');
    pushEcom('view_item', { currency: 'EUR', value: PRODUCTS[id].price, items: itemsFor([id]) });
    document.getElementById('add-to-cart').addEventListener('click', function () {
      var cart = getCart(); cart.push(id); store('cart', JSON.stringify(cart));
      pushEcom('add_to_cart', { currency: 'EUR', value: PRODUCTS[id].price, items: itemsFor([id]) });
      say('Added to cart. Go to Checkout to continue.');
    });
  }

  if (page === 'checkout') {
    var cart = getCart(), items = itemsFor(cart), box = document.getElementById('cart'), btn = document.getElementById('place-order');
    if (!cart.length) { box.textContent = 'Your cart is empty. Add a product first.'; btn.disabled = true; return; }
    renderCart = function () {
      box.innerHTML = items.map(function (i) { return '<p>' + i.item_name + ': EUR ' + i.price.toLocaleString('en') + '</p>'; }).join('') +
                      '<p><strong>Total: EUR ' + valueOf(items).toLocaleString('en') + ' incl. VAT</strong> (market ' + market + ')</p>';
    };
    renderCart();
    pushEcom('begin_checkout', { currency: 'EUR', value: valueOf(items), items: items });
    btn.addEventListener('click', function () {
      var value = valueOf(items), vat = VAT[market] || 0.19;
      pushEcom('purchase', {
        transaction_id: 'T' + Date.now(), currency: 'EUR', value: value,
        tax: Math.round(value * vat / (1 + vat) * 100) / 100, shipping: 0, items: items
      });
      store('cart', '[]'); btn.disabled = true; say('Test order placed. Thank you (nothing was charged).');
    });
  }

  if (page === 'quote') {
    document.getElementById('quote-market').value = market;
    document.getElementById('quote-form').addEventListener('submit', function (e) {
      e.preventDefault();
      window.dataLayer.push({ event: 'quote_request', market: document.getElementById('quote-market').value,
                              product_interest: document.getElementById('product-interest').value });
      say('Quote request recorded (demo, no data stored).');
    });
  }
});
