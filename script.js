document.addEventListener('DOMContentLoaded', function () {
  
  // === ESTADO DEL CARRITO ===
  let cart = [];

  // === ELEMENTOS DEL DOM ===
  const cartSidebar = document.getElementById('cartSidebar');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartToggle = document.getElementById('cartToggle');
  const cartClose = document.getElementById('cartClose');
  const cartItems = document.getElementById('cartItems');
  const cartEmpty = document.getElementById('cartEmpty');
  const cartSummary = document.getElementById('cartSummary');
  const cartCount = document.getElementById('cartCount');
  const cartTotal = document.getElementById('cartTotal');
  const toast = document.getElementById('toast');

  // === ABRIR / CERRAR CARRITO ===
  function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.classList.add('open');
    document.body.style.overflow = 'hidden'; // Evita scroll del body
  }

  function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  function toggleCart() {
    cartSidebar.classList.contains('open') ? closeCart() : openCart();
  }

  cartToggle?.addEventListener('click', toggleCart);
  cartOverlay?.addEventListener('click', closeCart);
  cartClose?.addEventListener('click', closeCart);

  // === AGREGAR PRODUCTO ===
  function addToCart(name, price, icon) {
    const existing = cart.find(item => item.name === name);
    
    if (existing) {
      existing.qty++;
    } else {
      cart.push({ name, price, icon, qty: 1 });
    }
    
    renderCart();
    showToast(`🍦 ${name} agregado`);
    animateCartBtn();
    openCart(); // Abre el carrito al añadir
  }

  // === CAMBIAR CANTIDAD ===
  function changeQty(index, delta) {
    cart[index].qty += delta;
    if (cart[index].qty <= 0) {
      cart.splice(index, 1);
    }
    renderCart();
  }

  // === VACIAR CARRITO ===
  function clearCart() {
    cart = [];
    renderCart();
    showToast('🗑️ Carrito vaciado');
  }

  // === RENDERIZAR CARRITO ===
  function renderCart() {
    const totalQty = cart.reduce((sum, i) => sum + i.qty, 0);
    const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

    cartCount.textContent = totalQty;
    cartTotal.textContent = '$' + totalPrice.toLocaleString('es-CO');

    // Mostrar/ocultar estado vacío
    if (cart.length === 0) {
      cartItems.innerHTML = '';
      cartItems.appendChild(cartEmpty);
      cartEmpty.style.display = 'flex';
      cartSummary.style.display = 'none';
      return;
    }

    cartEmpty.style.display = 'none';
    cartSummary.style.display = 'block';
    cartItems.innerHTML = '';

    // Renderizar items
    cart.forEach((item, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'cart-item';
      itemEl.innerHTML = `
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${(item.price * item.qty).toLocaleString('es-CO')}</p>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn minus" data-index="${index}">−</button>
          <span>${item.qty}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>
      `;
      cartItems.appendChild(itemEl);
    });

    // Eventos de botones +/-
    document.querySelectorAll('.qty-btn.minus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        changeQty(parseInt(e.target.dataset.index), -1);
      });
    });

    document.querySelectorAll('.qty-btn.plus').forEach(btn => {
      btn.addEventListener('click', (e) => {
        changeQty(parseInt(e.target.dataset.index), 1);
      });
    });
  }

  // === CHECKOUT ===
  function checkout() {
    if (cart.length === 0) {
      showToast('⚠️ Agrega productos primero');
      return;
    }
    
    const total = cart.reduce((sum, i) => sum + i.price * i.qty, 0);
    const itemsList = cart.map(i => `• ${i.icon} ${i.name} x${i.qty}`).join('\n');
    
    alert(`🍦 ¡Pedido recibido!\n\n${itemsList}\n\n💰 Total: $${total.toLocaleString('es-CO')}\n\n✅ Te contactaremos para confirmar.`);
    
    cart = [];
    renderCart();
    closeCart();
    showToast('✅ ¡Pedido realizado!');
  }

  // === TOAST NOTIFICACIÓN ===
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2500);
  }

  // === ANIMACIÓN BOTÓN CARRITO ===
  function animateCartBtn() {
    cartToggle.style.transform = 'scale(1.25)';
    setTimeout(() => { cartToggle.style.transform = 'scale(1)'; }, 200);
  }

  // === FILTRAR CATEGORÍAS ===
  function filterCategory(btn, category) {
    document.querySelectorAll('.cat-card').forEach(c => c.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('.product-card').forEach(card => {
      const match = category === 'todos' || card.dataset.cat === category;
      card.classList.toggle('hidden', !match);
      
      if (match) {
        card.style.animation = 'none';
        void card.offsetWidth; // Reinicia animación
        card.style.animation = 'fadeIn 0.4s ease both';
      }
    });
  }

  // === EVENTOS: BOTONES "AÑADIR" ===
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      addToCart(
        this.dataset.name,
        parseInt(this.dataset.price),
        this.dataset.icon
      );
    });
  });

  // === EVENTOS: CATEGORÍAS ===
  document.querySelectorAll('.cat-card').forEach(card => {
    card.addEventListener('click', function () {
      filterCategory(this, this.dataset.cat);
    });
  });

  // === EVENTOS: CHECKOUT Y LIMPIAR ===
  document.querySelector('.btn-checkout')?.addEventListener('click', checkout);
  document.querySelector('.btn-clear')?.addEventListener('click', clearCart);

  // === NAVBAR: EFECTO SCROLL ===
  window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    navbar.style.boxShadow = window.scrollY > 30 
      ? '0 4px 24px rgba(255,107,157,0.18)' 
      : '0 2px 20px rgba(255,107,157,0.10)';
  });

  // === INICIALIZAR ===
  renderCart();
});