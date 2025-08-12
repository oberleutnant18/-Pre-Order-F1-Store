// ===== i18n strings =====
const STRINGS = {
  th: {
    store_name: "สินค้า Pre-Order F1 Store",
    store_tag: "โมเดล • พวงกุญแจ • ของที่ระลึก • เสื้อผ้า",
    categories: "หมวดหมู่",
    filters: "ตัวกรอง",
    price_range: "ช่วงราคา",
    search: "ค้นหา",
    products: "สินค้า",
    sort_popular: "ยอดนิยม",
    sort_price_asc: "ราคาต่ำ→สูง",
    sort_price_desc: "ราคาสูง→ต่ำ",
    sort_name_asc: "ชื่อ A→Z",
    your_cart: "ตะกร้าของคุณ",
    subtotal: "ยอดรวม",
    checkout: "ชำระเงิน",
    order_summary: "สรุปคำสั่งซื้อ",
    total: "รวม",
    promptpay_note: "ชำระเงินด้วยการสแกนคิวอาร์พร้อมเพย์ ระบบจะสร้างคิวอาร์ไดนามิกตามยอดรวม",
    promptpay_id: "หมายเลขพร้อมเพย์ (มือถือ/บัตรประชาชน)",
    merchant_name: "ชื่อร้าน",
    generate_qr: "สร้างคิวอาร์",
    copy_payload: "คัดลอก Payload",
    qr_hint: "หากคิวอาร์ไม่แสดง สามารถวาง Payload ในแอปธนาคารเพื่อชำระได้",
    i_have_paid: "ฉันได้ชำระเงินแล้ว",
    place_order: "ยืนยันคำสั่งซื้อ",
  },
  en: {
    store_name: "F1 Merch Store",
    store_tag: "Models • Keychains • Souvenirs • Apparel",
    categories: "Categories",
    filters: "Filters",
    price_range: "Price range",
    search: "Search",
    products: "Products",
    sort_popular: "Most popular",
    sort_price_asc: "Price: Low→High",
    sort_price_desc: "Price: High→Low",
    sort_name_asc: "Name: A→Z",
    your_cart: "Your cart",
    subtotal: "Subtotal",
    checkout: "Checkout",
    order_summary: "Order summary",
    total: "Total",
    promptpay_note: "Pay by scanning a PromptPay QR. A dynamic QR will be generated for your order total.",
    promptpay_id: "PromptPay ID (phone / national ID)",
    merchant_name: "Store name",
    generate_qr: "Generate QR",
    copy_payload: "Copy Payload",
    qr_hint: "If the QR does not appear, paste the payload into your bank app to pay.",
    i_have_paid: "I've paid",
    place_order: "Place order",
  }
};

let LANG = localStorage.getItem("lang") || "th";
const t = k => (STRINGS[LANG] && STRINGS[LANG][k]) || k;

function applyI18n(){
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const key = el.dataset.i18n;
    el.textContent = t(key);
  });
  document.getElementById("searchInput").placeholder = LANG==="th" ? "Ferrari, keychain..." : "Ferrari, keychain...";
}
document.addEventListener("DOMContentLoaded", applyI18n);

// ===== demo product data =====
const PRODUCTS = [
  { id:"mfsf24ml1-18", name:"Ferrari SF-24 miami spacial livery 1:18 ", emoji:"🏎️", cat:"Models", price: 2500, popular: true },
  { id:"mdlw14", name:"Mercedes W14 1:43 Mini", emoji:"🏎️", cat:"Models", price: 1590, popular: true },
  { id:"kcrb24", name:"Red Bull Wheel Rim Keychain", emoji:"🔧", cat:"Keychains", price: 350 },
  { id:"kcferr", name:"Ferrari 75th Anniversary Keychain", emoji:"🔑", cat:"Keychains", price: 420 },
  { id:"svrpit", name:"Pit Board Acrylic Souvenir", emoji:"🏁", cat:"Souvenirs", price: 790 },
  { id:"svrtkt", name:"Ticket Stub Shadowbox", emoji:"🎟️", cat:"Souvenirs", price: 1290 },
  { id:"tee44", name:"Team Tee #44", emoji:"👕", cat:"Apparel", price: 890 },
  { id:"cap16", name:"Driver Cap #16", emoji:"🧢", cat:"Apparel", price: 1290 },
];

const CATS = ["All","Models","Keychains","Souvenirs","Apparel"];

// ===== helpers =====
const THB = n => n.toLocaleString("th-TH",{style:"currency", currency:"THB"});
const clamp = (n,min,max)=>Math.max(min,Math.min(max,n));

// ===== render categories =====
const categoryList = document.getElementById("categoryList");
let ACTIVE_CAT = "All";
function renderCategories(){
  categoryList.innerHTML = "";
  CATS.forEach(c=>{
    const li = document.createElement("li");
    const count = c==="All"? PRODUCTS.length : PRODUCTS.filter(p=>p.cat===c).length;
    li.innerHTML = `<span>${c}</span><span class="badge">${count}</span>`;
    if (c===ACTIVE_CAT) li.classList.add("active");
    li.addEventListener("click", ()=>{ ACTIVE_CAT=c; renderCategories(); renderGrid(); });
    categoryList.appendChild(li);
  });
}
renderCategories();

// ===== render grid =====
const productGrid = document.getElementById("productGrid");
const priceRange = document.getElementById("priceRange");
const priceDisplay = document.getElementById("priceDisplay");
const searchInput = document.getElementById("searchInput");
const sortSelect = document.getElementById("sortSelect");

function renderGrid(){
  const maxPrice = parseInt(priceRange.value,10);
  priceDisplay.textContent = THB(maxPrice);
  const q = searchInput.value.trim().toLowerCase();

  let items = PRODUCTS.filter(p=> p.price<=maxPrice && (ACTIVE_CAT==="All" || p.cat===ACTIVE_CAT) && (!q || p.name.toLowerCase().includes(q)) );

  if (sortSelect.value==="price_asc") items.sort((a,b)=>a.price-b.price);
  else if (sortSelect.value==="price_desc") items.sort((a,b)=>b.price-a.price);
  else if (sortSelect.value==="name_asc") items.sort((a,b)=>a.name.localeCompare(b.name));
  else items.sort((a,b)=>(b.popular?1:0)-(a.popular?1:0));

  productGrid.innerHTML = "";
  items.forEach(p=>{
    const card = document.createElement("article");
    card.className = "card";
    card.innerHTML = `
      <div class="thumb">${p.emoji}</div>
      <div class="content">
        <h3>${p.name}</h3>
        <div class="meta"><span class="badge">${p.cat}</span></div>
        <div class="price">${THB(p.price)}</div>
      </div>
      <div class="actions">
        <button data-id="${p.id}" class="add">${LANG==='th'?'เพิ่มลงตะกร้า':'Add to cart'}</button>
        <button class="primary buy" data-id="${p.id}">${LANG==='th'?'ซื้อเลย':'Buy now'}</button>
      </div>`;
    productGrid.appendChild(card);
  });
}
[priceRange, searchInput, sortSelect].forEach(el=> el.addEventListener("input", renderGrid));
renderGrid();

// ===== cart =====
const cartBtn = document.getElementById("cartButton");
const cartDrawer = document.getElementById("cartDrawer");
const closeCart = document.getElementById("closeCart");
const cartCount = document.getElementById("cartCount");
const cartItems = document.getElementById("cartItems");
const cartSubtotal = document.getElementById("cartSubtotal");
const checkoutBtn = document.getElementById("checkoutBtn");
let CART = JSON.parse(localStorage.getItem("cart")||"{}");

function openCart(){ cartDrawer.classList.add("open"); cartDrawer.setAttribute("aria-hidden","false"); }
function closeCartDrawer(){ cartDrawer.classList.remove("open"); cartDrawer.setAttribute("aria-hidden","true"); }

cartBtn.addEventListener("click", openCart);
closeCart.addEventListener("click", closeCartDrawer);

function addToCart(id, qty=1){
  CART[id] = (CART[id]||0)+qty;
  localStorage.setItem("cart", JSON.stringify(CART));
  renderCart();
}
function setQty(id, qty){
  if (qty<=0) delete CART[id]; else CART[id]=qty;
  localStorage.setItem("cart", JSON.stringify(CART));
  renderCart();
}
function renderCart(){
  const entries = Object.entries(CART);
  cartCount.textContent = entries.reduce((a, [id,q])=>a+q,0);
  cartItems.innerHTML = "";
  let total = 0;
  entries.forEach(([id, qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    if (!p) return;
    total += p.price*qty;
    const row = document.createElement("div");
    row.className = "cart-item";
    row.innerHTML = `
      <div class="thumb">${p.emoji}</div>
      <div>
        <h4>${p.name}</h4>
        <div class="muted">${THB(p.price)}</div>
      </div>
      <div class="qty">
        <button class="icon-btn" data-action="dec" data-id="${id}">−</button>
        <strong>${qty}</strong>
        <button class="icon-btn" data-action="inc" data-id="${id}">+</button>
      </div>
    `;
    cartItems.appendChild(row);
  });
  cartSubtotal.textContent = THB(total);
  checkoutBtn.disabled = total<=0;
}
renderCart();

productGrid.addEventListener("click", e=>{
  if (e.target.matches("button.add")) { addToCart(e.target.dataset.id, 1); openCart(); }
  if (e.target.matches("button.buy")) { addToCart(e.target.dataset.id, 1); openCheckout(); }
});

cartItems.addEventListener("click", e=>{
  if (e.target.dataset.action==="inc") setQty(e.target.dataset.id, (CART[e.target.dataset.id]||1)+1);
  if (e.target.dataset.action==="dec") setQty(e.target.dataset.id, (CART[e.target.dataset.id]||1)-1);
});

// ===== checkout (PromptPay QR) =====
const checkoutModal = document.getElementById("checkoutModal");
const closeCheckout = document.getElementById("closeCheckout");
const summaryList = document.getElementById("summaryList");
const summaryTotal = document.getElementById("summaryTotal");
const ppForm = document.getElementById("promptpayForm");
const ppIdInput = document.getElementById("ppId");
const merchantNameInput = document.getElementById("merchantName");
const qrContainer = document.getElementById("qrContainer");
const copyPayloadBtn = document.getElementById("copyPayload");
const confirmPaid = document.getElementById("confirmPaid");
const placeOrder = document.getElementById("placeOrder");

function openCheckout(){
  // render summary
  const entries = Object.entries(CART);
  summaryList.innerHTML = "";
  let total = 0;
  entries.forEach(([id, qty])=>{
    const p = PRODUCTS.find(x=>x.id===id);
    if (!p) return;
    total += p.price*qty;
    const div = document.createElement("div");
    div.className="summary-item";
    div.innerHTML = `<span>${p.name} × ${qty}</span><span>${THB(p.price*qty)}</span>`;
    summaryList.appendChild(div);
  });
  summaryTotal.textContent = THB(total);
  checkoutModal.setAttribute("aria-hidden","false");
}
closeCheckout.addEventListener("click", ()=> checkoutModal.setAttribute("aria-hidden","true"));
checkoutBtn.addEventListener("click", openCheckout);

document.getElementById("year").textContent = new Date().getFullYear();

// ---- PromptPay payload (EMVCo) ----
// Based on Thai QR standard: AID A000000677010111 and sub-tags:
// 01 = phone (format 66XXXXXXXXX), 02 = national ID.
// CRC-16/XMODEM, initial 0xFFFF. (Ref: Blognone explanation)
function crc16xmodem(str){
  let crc = 0xFFFF;
  for (let i=0; i<str.length; i++){
    crc ^= (str.charCodeAt(i) << 8);
    for (let j=0; j<8; j++){
      if (crc & 0x8000) crc = (crc << 1) ^ 0x1021;
      else crc = crc << 1;
      crc &= 0xFFFF;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

function formatTLV(id, value){
  const len = value.length.toString().padStart(2,"0");
  return id + len + value;
}

// Normalize PromptPay ID
function normalizePP(id){
  const digits = id.replace(/[^0-9]/g,"");
  if (digits.length>=9 && digits.length<=10){ // phone like 08xxxxxxxx or 9 digits without leading 0
    let phone = digits;
    if (phone.startsWith("0")) phone = phone.slice(1);
    return { type:"01", value:"0066"+phone.padStart(9,"0") };
  } else if (digits.length===13){ // national ID (no hyphens)
    return { type:"02", value:digits };
  }
  throw new Error("Invalid PromptPay ID");
}

function buildPromptPayPayload(ppId, amountTHB, merchantName=""){
  const anyId = normalizePP(ppId);
  const aid = formatTLV("00", "A000000677010111");
  const proxy = formatTLV(anyId.type, anyId.value);
  const merchantAcc = formatTLV("29", aid + proxy);

  // 00: Payload Format Indicator (01), 01: Dynamic QR (12)
  const pfi = formatTLV("00","01");
  const poi = formatTLV("01","12"); // dynamic

  // 53: currency THB (764), 54: amount, 58: country TH, 59: merchant name (optional), 63: CRC
  const currency = formatTLV("53","764");
  const amount = amountTHB>0 ? formatTLV("54", amountTHB.toFixed(2)) : "";
  const country = formatTLV("58","TH");
  const mname = merchantName ? formatTLV("59", merchantName.substring(0,25)) : "";

  // Build without CRC then append CRC tag with placeholder
  let base = pfi + poi + merchantAcc + currency + amount + country + mname + "6304";
  const crc = crc16xmodem(base);
  return base + crc;
}

// Render QR using Google Chart (simple for demo; replace with local generator for production)
function renderQR(payload){
  const size = 260;
  const url = "https://chart.googleapis.com/chart?chs="+size+"x"+size+"&cht=qr&chl="+encodeURIComponent(payload);
  qrContainer.innerHTML = `<img src="${url}" width="${size}" height="${size}" alt="PromptPay QR">`;
}

ppForm.addEventListener("submit", (e)=>{
  e.preventDefault();
  const totalTHB = Object.entries(CART).reduce((sum,[id,q])=>{
    const p = PRODUCTS.find(x=>x.id===id); return sum + (p?p.price*q:0);
  }, 0);
  try{
    const payload = buildPromptPayPayload(ppIdInput.value, totalTHB, merchantNameInput.value.trim());
    renderQR(payload);
    copyPayloadBtn.dataset.payload = payload;
    confirmPaid.disabled = false;
  }catch(err){
    alert(LANG==="th" ? "หมายเลขพร้อมเพย์ไม่ถูกต้อง" : "Invalid PromptPay ID");
  }
});

copyPayloadBtn.addEventListener("click", async ()=>{
  const payload = copyPayloadBtn.dataset.payload || "";
  if(!payload) return;
  try{
    await navigator.clipboard.writeText(payload);
    copyPayloadBtn.textContent = LANG==="th" ? "คัดลอกแล้ว" : "Copied";
    setTimeout(()=> copyPayloadBtn.textContent = t("copy_payload"), 1200);
  }catch(e){
    prompt("Copy this payload:", payload);
  }
});

confirmPaid.addEventListener("change", ()=>{
  placeOrder.disabled = !confirmPaid.checked;
});
placeOrder.addEventListener("click", ()=>{
  // In a real app, verify payment with your backend/bank API before confirming.
  alert(LANG==="th" ? "สั่งซื้อสำเร็จ! ขอบคุณค่ะ" : "Order placed! Thank you.");
  CART = {}; localStorage.setItem("cart","{}");
  renderCart();
  checkoutModal.setAttribute("aria-hidden","true");
});

// ===== language switch =====
const langSelect = document.getElementById("langSelect");
langSelect.value = LANG;
langSelect.addEventListener("change", ()=>{
  LANG = langSelect.value;
  localStorage.setItem("lang", LANG);
  applyI18n();
  renderGrid();
});

// ===== interactions for a11y =====
document.addEventListener("keydown", (e)=>{
  if (e.key==="Escape"){
    closeCartDrawer();
    checkoutModal.setAttribute("aria-hidden","true");
  }
});
