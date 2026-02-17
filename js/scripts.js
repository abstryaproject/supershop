// ---------- Cart & Product Variables ----------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
const productGrid = document.getElementById("product-grid");
const cartSidebar = document.getElementById("cart-sidebar");
const cartOverlay = document.getElementById("cart-overlay");
const cartItems = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const cartCount = document.getElementById("cart-count");
const checkoutBtn = document.getElementById("checkoutBtn");
const checkoutForm = document.getElementById("checkout-form");
const cartFooter = document.getElementById("cart-footer");
const searchInput = document.getElementById("search-input");
const customerName = document.getElementById("customerName");
const customerPhone = document.getElementById("customerPhone");
const customerAddress = document.getElementById("customerAddress");
const deliveryDateTime = document.getElementById("deliveryDateTime");
const placeOrderBtn = document.getElementById("placeOrderBtn");
let inCheckout = false;

// ---------- Slide Text ----------
const slides = document.querySelectorAll('#slide-text p');
let currentSlide = 0;
function showSlide(index){
  slides.forEach((p) => {
    p.classList.remove('active');
    p.style.left = "100%";
  });
  slides[index].classList.add('active');
  slides[index].style.left = "0";
}
showSlide(currentSlide);
setInterval(() => {
  currentSlide = (currentSlide + 1) % slides.length;
  showSlide(currentSlide);
}, 3000);

// ---------- Render Products ----------
function renderProducts(list){
  productGrid.innerHTML = list.map(p=>`
  <div class="product-card">
    <img src="${p.image}">
    <h4>${p.name}</h4>
    <p>₦${p.price.toLocaleString()}</p>
    <button class="add-btn" onclick="addToCart(${p.id})">Add to Cart</button>
  </div>`).join('');
}

// ---------- Cart Functions ----------
function addToCart(id){
  const item = cart.find(i=>i.id===id);
  if(item) item.quantity++;
  else cart.push({...products.find(p=>p.id===id), quantity:1});
  saveCart(); updateCart(); openCart();
}
function updateCart(){
  cartCount.textContent = cart.reduce((a,b)=>a+b.quantity,0);
  cartItems.innerHTML = cart.map(i=>`
    <div class="cart-item">
      <div><b>${i.name}</b><br>₦${i.price} × ${i.quantity}</div>
      <div>
        <button onclick="changeQty(${i.id},-1)">−</button>
        ${i.quantity}
        <button onclick="changeQty(${i.id},1)">+</button>
        <button onclick="removeItem(${i.id})">Remove</button>
      </div>
    </div>`).join("");
  cartTotal.textContent="₦"+cart.reduce((s,i)=>s+i.price*i.quantity,0).toLocaleString();
}
function changeQty(id,d){
  const item = cart.find(i=>i.id===id);
  item.quantity += d;
  if(item.quantity<=0) cart = cart.filter(i=>i.id!==id);
  saveCart(); updateCart();
}
function removeItem(id){
  cart = cart.filter(i=>i.id!==id);
  saveCart(); updateCart();
}
function saveCart(){localStorage.setItem("cart", JSON.stringify(cart));}

// ---------- Search ----------
searchInput.addEventListener("input",(e)=>{
  const term = e.target.value.toLowerCase();
  const filtered = products.filter(p=>p.name.toLowerCase().includes(term));
  renderProducts(filtered);
});

// ---------- Sidebar Toggle ----------
document.getElementById("cart-btn").onclick=openCart;
document.getElementById("close-cart").onclick=closeCart;
cartOverlay.onclick=closeCart;
function openCart(){
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}
function closeCart(){
  if(inCheckout){
    checkoutForm.style.display="none";
    cartItems.style.display="block";
    cartFooter.style.display="flex";
    inCheckout=false;
  } else {
    cartSidebar.classList.remove("active");
    cartOverlay.classList.remove("active");
  }
}

// ---------- Checkout ----------
checkoutBtn.onclick = () => {
  if (cart.length === 0) {
    showNotification("Cart is empty", "error");
    return;
  }

  cartItems.style.display = "none";
  checkoutForm.style.display = "block";
  cartFooter.style.display = "none";
  inCheckout = true;
};

// ---------- Prevent Past Dates ----------
function setMinTime(){
  const d = new Date();
  d.setMinutes(0,0,0);
  deliveryDateTime.min = d.toISOString().slice(0,16);
}

// ---------- Format Date ----------
function formatDT(v){
  const d = new Date(v);
  return d.toLocaleString("en-GB",{day:"numeric",month:"short",year:"numeric",hour:"numeric",hour12:true});
}

// ---------- Place Order ----------
function placeOrder(){
  const name = customerName.value;
  const phone = customerPhone.value;
  const addr = customerAddress.value;
  const dt = deliveryDateTime.value;
  if(!name || !phone || !addr || !dt) return showNotification("Please fill all fields", "error");
  
  contactBtn.disabled=true;
  contactBtn.textContent="Please Wait...";
  let msg = `Hello SuperShop 👋\nCustomer Name: ${name}\nPhone: ${phone}\n\nI want to order:\n\n`;
  cart.forEach((i,n)=>{msg+=`${n+1}. ${i.name} x${i.quantity} – ₦${(i.price*i.quantity).toLocaleString()}\n`;});
  msg+=`\nTotal: ₦${cart.reduce((s,i)=>s+i.price*i.quantity,0).toLocaleString()}\n\nDelivery address: ${addr}\nDelivery date & time: ${formatDT(dt)}`;
  
  window.open(`https://wa.me/2348138605126?text=${encodeURIComponent(msg)}`, "_blank");
  showNotification("Order opened in WhatsApp!");
}
function showNotification(message, type = "success", duration = 3000) {
  const notif = document.getElementById("notification");
  notif.textContent = message;

  // Set background based on type
  if(type === "error") {
    notif.style.background = "#c62828"; // red for errors
  } else {
    notif.style.background = "var(--primary-color)"; // default green/primary
  }

  notif.classList.remove("hide");
  notif.classList.add("show");

  setTimeout(() => {
    notif.classList.remove("show");
    notif.classList.add("hide");
  }, duration);
}


// ---------- Contact Form ----------
const contactForm=document.getElementById('contact-form');
const contactBtn=document.getElementById('contact-btn');
contactForm.addEventListener('submit', e=>{
  e.preventDefault();
  const name=document.getElementById('contact-name').value.trim();
  const phone=document.getElementById('contact-phone').value.trim();
  const message=document.getElementById('contact-message').value.trim();
  if(!name||!phone||!message) return showNotification("Please fill all fields");
  
  contactBtn.disabled=true;
  contactBtn.textContent="Please Wait...";
  let msg=`Hello SuperShop 👋\nContact from website:\nName: ${name}\nPhone: ${phone}\nMessage: ${message}`;
  window.open(`https://wa.me/2348138605126?text=${encodeURIComponent(msg)}`, "_blank");
  contactBtn.disabled=false;
  contactBtn.textContent="Send Message";
  contactForm.reset();
  showNotification("Message opened in WhatsApp!");
});

const offlineBtn = document.getElementById('offlineBtn');
const onlineBtn = document.getElementById('onlineBtn');
let hideTimeout = null;

// Show button with fade and auto-hide on mobile
function fadeIn(button) {
  button.style.display = 'inline-block';
  setTimeout(() => button.style.opacity = 1, 50);

  if (window.innerWidth <= 768) { // auto-hide only on mobile
    clearTimeout(hideTimeout);
    hideTimeout = setTimeout(() => fadeOut(button), 5000);
  }
}

// Fade out button
function fadeOut(button) {
  button.style.opacity = 0;
  setTimeout(() => button.style.display = 'none', 500);
}

// Update buttons based on connection
function updateConnectionButtons() {
  if (!navigator.onLine) {
    fadeIn(offlineBtn);
    fadeOut(onlineBtn);
  } else {
    fadeOut(offlineBtn);
    fadeIn(onlineBtn);
  }
}

// Retry button click
onlineBtn.addEventListener('click', () => {
  if (navigator.onLine) {
    window.location.href = "";
  } else {
    alert("Still offline. Please connect to the internet.");
  }
});

// Initial check
updateConnectionButtons();

// Listen to online/offline changes
window.addEventListener('online', updateConnectionButtons);
window.addEventListener('offline', updateConnectionButtons);

document.getElementById("continueShopping").onclick = () => {
  closeCart();
};

// ---------- Init ----------
renderProducts(products);
updateCart();
setMinTime();

// ---------- Mobile Shop Info Slide ----------
function enableMobileShopInfoSlide(){
  const container = document.querySelector(".shop-info-container");
  const boxes = container ? container.children : [];
  if(!container || boxes.length===0) return;
  if(window.innerWidth > 600) return;
  let index = 0;
  if(container.slideInterval) clearInterval(container.slideInterval);
  container.slideInterval = setInterval(()=>{
    container.scrollTo({left: boxes[index].offsetLeft, behavior:"smooth"});
    index = (index+1)%boxes.length;
  }, 2500);
}
window.addEventListener("load", enableMobileShopInfoSlide);
window.addEventListener("resize", enableMobileShopInfoSlide);