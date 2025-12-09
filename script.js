/* -------------------------
  Product modal + qty + buy
-------------------------*/

document.addEventListener('DOMContentLoaded', () => {

  /* -------------------------
      STEP 1: PRODUCT DATA
  -------------------------*/
  const PRODUCTS = {
  "haldi": {
    title: "Haldi (Turmeric)",
    desc: "Pure Lakadong turmeric with high curcumin.",
    price: 120,
    img: "images/Haldi.jpeg"
  },
  "mirch": {
    title: "Mirch (Chilli)",
    desc: "Finest quality red chilli powder.",
    price: 110,
    img: "images/Redchilli.jpeg"
  },
  "dhaniya": {
    title: "Dhaniya (Coriander Powder)",
    desc: "Fresh ground coriander with natural aroma.",
    price: 90,
    img: "images/Dhaniya.jpeg"
  },
  "black-pepper": {
    title: "Black Pepper",
    desc: "Strong aromatic black pepper.",
    price: 150,
    img: "images/Blackpepper.jpeg"
  },
  "garam-masala": {
    title: "Garam Masala",
    desc: "Traditional blend of premium spices.",
    price: 140,
    img: "images/Garam.jpeg"
  },
  "amchur": {
    title: "Amchur",
    desc: "Premium dried mango powder.",
    price: 95,
    img: "images/Amchur.jpeg"
  },
  "cinnamon": {
    title: "Cinnamon",
    desc: "Natural aromatic cinnamon sticks.",
    price: 160,
    img: "images/Cinnamon.jpeg"
  },
  "dhaniya-powder": {
    title: "Dhaniya Powder",
    desc: "Fine ground coriander.",
    price: 85,
    img: "images/coriander.jpeg"
  },
  "jeera": {
    title: "Jeera (Cumin)",
    desc: "Strong aromatic cumin seeds.",
    price: 130,
    img: "images/Jira.jpeg"
  },
  "kali-mirch": {
    title: "Kali Mirch",
    desc: "Whole black pepper seeds.",
    price: 150,
    img: "images/Kalimirch.jpeg"
  },
  "red-chilli": {
    title: "Red Chilli",
    desc: "High-quality red chilli powder.",
    price: 110,
    img: "images/Redchilli.jpeg"
  },
  "s-jeera": {
    title: "Sabut Jeera",
    desc: "Whole cumin seeds.",
    price: 135,
    img: "images/Sabut-Jeera.png"
  },
  "s-dhaniya": {
    title: "Sabut Dhaniya",
    desc: "Whole coriander seeds.",
    price: 80,
    img: "images/Sabut-Dhaniya.png"
  }
};

  /* -------------------------
      STEP 2: MODAL ELEMENTS
  -------------------------*/
  const modal = document.getElementById('productModal');
  const modalImg = document.getElementById('modalImgEl');
  const modalTitle = document.getElementById('modalTitle');
  const modalShort = document.getElementById('modalShort');
  const modalFeatures = document.getElementById('modalFeatures');
  const modalPrice = document.getElementById('modalPrice');
  const addToCartBtn = document.getElementById('addToCartBtn');
  const closeBtn = document.getElementById('closeModal');

  /* -------------------------
      STEP 3: QTY CONTROLS
  -------------------------*/
  const qtyWrap = document.createElement('div');
  qtyWrap.className = 'qty-wrap';
  qtyWrap.innerHTML = `
    <button type="button" id="qtyMinus">-</button>
    <input id="qtyInput" type="number" min="1" value="1" />
    <button type="button" id="qtyPlus">+</button>
    <div style="margin-left:10px;color:var(--muted)">Total: <span id="totalPrice">₹ —</span></div>
  `;
  addToCartBtn.insertAdjacentElement('beforebegin', qtyWrap);

  const qtyInput = document.getElementById('qtyInput');
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const totalPriceEl = document.getElementById('totalPrice');
  let currentProductId = null;

  function formatINR(n){
    return n.toLocaleString('en-IN', { maximumFractionDigits:0 });
  }

  /* -------------------------
      STEP 4: OPEN POPUP
  -------------------------*/
  window.openProduct = function(id){
    const p = PRODUCTS[id];

    if(!p){
      alert("⚠ Product info missing for: " + id);
      return;
    }

    currentProductId = id;

    modalImg.src = p.img;
    modalImg.alt = p.title;
    modalTitle.textContent = p.title;
    modalShort.textContent = p.desc;
    modalFeatures.innerHTML = "";
    ["100% Natural","Premium Quality","Hygienically Packed"].forEach(f => {
      const li = document.createElement("li");
      li.textContent = f;
      modalFeatures.appendChild(li);
    });

    modalPrice.dataset.unit = p.price;
    modalPrice.textContent = "₹ " + formatINR(p.price);
    qtyInput.value = 1;
    totalPriceEl.textContent = "₹ " + formatINR(p.price);

    modal.classList.add('open');
    document.body.style.overflow = "hidden";
  };

  /* -------------------------
      CLOSE POPUP
  -------------------------*/
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', e => { if(e.target === modal) closeModal(); });

  function closeModal(){
    modal.classList.remove('open');
    document.body.style.overflow = "";
  }

  /* -------------------------
      QTY BUTTONS
  -------------------------*/
  function updateTotal(){
    const qty = Number(qtyInput.value);
    const unit = Number(modalPrice.dataset.unit);
    totalPriceEl.textContent = "₹ " + formatINR(qty * unit);
  }
  qtyPlus.onclick = () => { qtyInput.value++; updateTotal(); };
  qtyMinus.onclick = () => { qtyInput.value = Math.max(1, qtyInput.value - 1); updateTotal(); };
  qtyInput.oninput = updateTotal;

  /* -------------------------
      CLICK HANDLER (PRODUCT CARDS)
  -------------------------*/
  document.querySelectorAll(".product-card").forEach(card => {
    const id = card.dataset.id;
    card.addEventListener("click", () => openProduct(id));
    card.style.cursor = "pointer";
  });

});
/* -----------------------------
       FULL CART SYSTEM
------------------------------*/

let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Update cart count
function updateCartCount(){
  document.getElementById("cartCount").textContent = cart.length;
}

// Update total price
function updateCartTotal(){
  let total = 0;
  cart.forEach(i => {
    total += i.price * i.qty;
  });

  document.getElementById("cartTotal").textContent = "₹" + total;
}

// Render cart UI
function renderCart(){
  const wrap = document.getElementById("cartItems");
  wrap.innerHTML = "";

  if(cart.length === 0){
    wrap.innerHTML = `<p style="color:#bbb">Cart is empty</p>`;
    return;
  }

  cart.forEach((item, index) => {
    wrap.innerHTML += `
      <div class="cart-item">
        <img src="${item.img}">
        <div class="cart-item-info">
          <div class="cart-item-title">${item.title}</div>
          <div class="cart-item-price">₹${item.price} × ${item.qty}</div>
        </div>
        <button class="remove-item" onclick="removeItem(${index})">✕</button>
      </div>
    `;
  });

  updateCartTotal();
}

// Remove item
window.removeItem = function(index){
  cart.splice(index, 1);
  saveCart();
};

// Save cart
function saveCart(){
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// Add to cart
document.getElementById("addToCartBtn").addEventListener("click", () => {
  if(!currentProductId) return;

  const qty = Number(document.getElementById("qtyInput").value);
  const p = PRODUCTS[currentProductId];

  cart.push({
    id: currentProductId,
    title: p.title,
    price: p.price,
    img: p.img,
    qty: qty
  });

  saveCart();

  // open cart instantly
  document.getElementById("cartDrawer").classList.add("open");
});

// Cart open/close
document.getElementById("cartBtn").onclick = () =>
  document.getElementById("cartDrawer").classList.add("open");

document.getElementById("closeCart").onclick = () =>
  document.getElementById("cartDrawer").classList.remove("open");

// Load existing cart
updateCartCount();
renderCart();
