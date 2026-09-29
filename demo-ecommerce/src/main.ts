import './style.css';
import confetti from 'canvas-confetti';
import type { CartItem, CheckoutData, Product, StoreProfile } from './types';
import { STORE_PROFILES } from './profiles';
import { exportCatalogToExcel, parseExcelProducts } from './excelService';
import { playTapSound, playSuccessChime } from './soundEffects';

// --- Estado Global ---
let currentProfile: StoreProfile = STORE_PROFILES[0];
let activeCategory = 'Todos';
let searchQuery = '';
let cart: CartItem[] = [];
let isDarkMode = true;

// Modales y Vistas
let isCartOpen = false;
let isSavingsModalOpen = false;
let isExcelModalOpen = false;
let isInfoModalOpen = false;
let isDemoMenuOpen = false;
let selectedProductForDetail: Product | null = null;
let toastMessage: string | null = null;
let toastTimeout: number | null = null;

// Checkout
let checkout: CheckoutData = {
  customerName: '',
  phone: '',
  deliveryType: 'envio',
  address: '',
  floorApt: '',
  paymentMethod: 'Efectivo (10% descuento)',
  notes: ''
};

let estimatedMonthlySales = 1500000;

function init() {
  const savedProfileId = localStorage.getItem('demo_selected_profile');
  if (savedProfileId) {
    const found = STORE_PROFILES.find(p => p.id === savedProfileId);
    if (found) currentProfile = found;
  }

  // Inicializar Tema (Predeterminado: Oscuro)
  const savedTheme = localStorage.getItem('demo_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : true;
  document.documentElement.classList.toggle('dark', isDarkMode);

  loadCart();
  render();
}

function applyTheme(dark: boolean) {
  isDarkMode = dark;
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('demo_theme', isDarkMode ? 'dark' : 'light');
}

function toggleTheme() {
  applyTheme(!isDarkMode);
  showToast(isDarkMode ? 'Modo Oscuro activado 🌙' : 'Modo Claro activado ☀️');
  render();
}

function loadCart() {
  const saved = localStorage.getItem(`demo_cart_${currentProfile.id}`);
  if (saved) {
    try {
      cart = JSON.parse(saved);
    } catch {
      cart = [];
    }
  } else {
    cart = [];
  }
}

function saveCart() {
  localStorage.setItem(`demo_cart_${currentProfile.id}`, JSON.stringify(cart));
}

function switchProfile(profileId: string) {
  const found = STORE_PROFILES.find(p => p.id === profileId);
  if (found) {
    currentProfile = found;
    localStorage.setItem('demo_selected_profile', profileId);
    activeCategory = 'Todos';
    searchQuery = '';
    isDemoMenuOpen = false;
    loadCart();
    playTapSound();
    showToast(`Mostrando: ${currentProfile.name}`);
    render();
  }
}

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(msg: string) {
  toastMessage = msg;
  if (toastTimeout) window.clearTimeout(toastTimeout);
  render();
  toastTimeout = window.setTimeout(() => {
    toastMessage = null;
    render();
  }, 2400);
}

function addToCart(product: Product, quantity = 1, notes = '') {
  playTapSound();
  const existing = cart.find(item => item.product.id === product.id);
  if (existing) {
    existing.quantity += quantity;
    if (notes) existing.itemNotes = notes;
  } else {
    cart.push({ product, quantity, itemNotes: notes });
  }
  saveCart();
  showToast(`Agregado al pedido`);
  render();
}

function updateQuantity(productId: string, delta: number) {
  playTapSound();
  const item = cart.find(i => i.product.id === productId);
  if (!item) return;

  item.quantity += delta;
  if (item.quantity <= 0) {
    cart = cart.filter(i => i.product.id !== productId);
  }
  saveCart();
  render();
}

function removeFromCart(productId: string) {
  playTapSound();
  cart = cart.filter(i => i.product.id !== productId);
  saveCart();
  render();
}

function clearCart() {
  playTapSound();
  cart = [];
  saveCart();
  render();
}

function getCartSubtotal(): number {
  return cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
}

function getCartCount(): number {
  return cart.reduce((acc, item) => acc + item.quantity, 0);
}

function getShippingCost(): number {
  if (checkout.deliveryType === 'retiro') return 0;
  const subtotal = getCartSubtotal();
  if (subtotal >= currentProfile.freeShippingThreshold) return 0;
  return currentProfile.shippingCost;
}

function getDiscountAmount(): number {
  const isCash = checkout.paymentMethod.toLowerCase().includes('efectivo');
  if (!isCash) return 0;
  const subtotal = getCartSubtotal();
  return Math.round((subtotal * currentProfile.cashDiscountPercent) / 100);
}

function getCartTotal(): number {
  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscountAmount();
  return Math.max(0, subtotal - discount + shipping);
}

function sendWhatsAppOrder() {
  if (cart.length === 0) return;

  if (!checkout.customerName.trim()) {
    showToast('Por favor ingresá tu nombre');
    return;
  }

  if (checkout.deliveryType === 'envio' && !checkout.address.trim()) {
    showToast('Por favor ingresá tu dirección');
    return;
  }

  playSuccessChime();
  confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });

  const subtotal = getCartSubtotal();
  const shipping = getShippingCost();
  const discount = getDiscountAmount();
  const total = getCartTotal();

  let message = `🛒 *Nuevo Pedido - ${currentProfile.name}*\n`;
  message += `━━━━━━━━━━━━━━━━━\n`;
  message += `👤 *Cliente:* ${checkout.customerName.trim()}\n`;
  if (checkout.phone.trim()) message += `📞 *Tel:* ${checkout.phone.trim()}\n`;
  message += `📍 *Entrega:* ${checkout.deliveryType === 'envio' ? 'Envío a Domicilio' : 'Retiro en Local'}\n`;

  if (checkout.deliveryType === 'envio') {
    message += `🏠 *Dirección:* ${checkout.address.trim()}${checkout.floorApt ? ' (' + checkout.floorApt.trim() + ')' : ''}\n`;
  }

  message += `💳 *Pago:* ${checkout.paymentMethod}\n`;
  if (checkout.notes.trim()) message += `📝 *Nota:* ${checkout.notes.trim()}\n`;
  message += `━━━━━━━━━━━━━━━━━\n`;
  message += `🛍️ *Productos:*\n`;

  cart.forEach((item, index) => {
    message += `${index + 1}. ${item.product.name} x${item.quantity}\n   ↳ ${formatMoney(item.product.price * item.quantity)}\n`;
  });

  message += `━━━━━━━━━━━━━━━━━\n`;
  message += `Subtotal: ${formatMoney(subtotal)}\n`;
  if (discount > 0) message += `Descuento Efectivo (${currentProfile.cashDiscountPercent}%): -${formatMoney(discount)}\n`;
  if (checkout.deliveryType === 'envio') message += `Envío: ${shipping === 0 ? 'Gratis' : formatMoney(shipping)}\n`;
  message += `*Total: ${formatMoney(total)}*\n`;

  const waUrl = `https://wa.me/${currentProfile.phone}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');

  setTimeout(() => {
    isCartOpen = false;
    showToast('¡Pedido enviado al WhatsApp del comercio!');
    render();
  }, 800);
}

function getFilteredProducts(): Product[] {
  let list = currentProfile.products;

  if (activeCategory !== 'Todos') {
    list = list.filter(p => p.category === activeCategory);
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase().trim();
    list = list.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  return list;
}

// --- Renderizado Limpio, Minimalista con Modo Oscuro ---
function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const cartCount = getCartCount();
  const cartSubtotal = getCartSubtotal();
  const filteredProducts = getFilteredProducts();

  app.innerHTML = `
    <!-- Barra de Navegación Principal -->
    <nav class="sticky top-0 z-40 bg-white/90 dark:bg-[#0E1015]/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 transition-colors">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo / Marca del Comercio -->
        <div class="flex items-center gap-3 cursor-pointer" id="store-brand-click">
          <div class="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-xl shrink-0">
            ${currentProfile.rubroIcon}
          </div>
          <div class="min-w-0">
            <div class="flex items-center gap-2">
              <h1 class="text-base sm:text-lg font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight truncate">
                ${currentProfile.name.split('•')[0].trim()}
              </h1>
              <span class="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-800/40">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span> Abierto
              </span>
            </div>
            <p class="text-xs text-neutral-400 dark:text-neutral-500 truncate hidden sm:block">
              ${currentProfile.address}
            </p>
          </div>
        </div>

        <!-- Botones Header -->
        <div class="flex items-center gap-2">
          <!-- Botón Horarios e Info -->
          <button
            id="open-info-btn"
            class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-all"
          >
            Horarios & Info
          </button>

          <!-- Menú de Opciones (Rubros + Panel Dueño) -->
          <div class="relative">
            <button
              id="open-demo-menu-btn"
              class="inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-200 transition-all active:scale-95"
              title="Opciones de Demostración y Panel del Dueño"
              aria-label="Opciones del comercio"
            >
              ⚙️
            </button>

            <!-- Menú Desplegable -->
            ${isDemoMenuOpen ? `
              <div class="absolute top-12 right-0 w-72 bg-white dark:bg-[#14171F] rounded-2xl shadow-2xl border border-neutral-100 dark:border-neutral-800 p-3 space-y-2 text-xs text-neutral-700 dark:text-neutral-200 z-50 animate-in fade-in zoom-in-95">
                <div class="px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
                  Cambiar tipo de comercio
                </div>
                ${STORE_PROFILES.map(p => `
                  <button
                    data-profile-id="${p.id}"
                    class="profile-btn w-full text-left px-2.5 py-2 rounded-xl flex items-center justify-between transition-colors ${
                      p.id === currentProfile.id
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-semibold text-neutral-900 dark:text-white'
                        : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/60'
                    }"
                  >
                    <span>${p.rubroIcon} ${p.rubro}</span>
                    ${p.id === currentProfile.id ? '<span class="text-emerald-500 font-bold">✓</span>' : ''}
                  </button>
                `).join('')}

                <!-- Switch de Tema Claro / Oscuro -->
                <div class="border-t border-neutral-100 dark:border-neutral-800 pt-2 mt-1">
                  <button
                    id="demo-theme-btn"
                    class="w-full text-left px-2.5 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/80 flex items-center justify-between font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
                  >
                    <span class="flex items-center gap-2">
                      <span>${isDarkMode ? '☀️' : '🌙'}</span>
                      <span>Tema: <strong>${isDarkMode ? 'Oscuro' : 'Claro'}</strong></span>
                    </span>
                    <span class="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-full text-neutral-600 dark:text-neutral-300 font-semibold">
                      ${isDarkMode ? 'Cambiar a Claro' : 'Cambiar a Oscuro'}
                    </span>
                  </button>
                </div>

                <!-- SECCIÓN EXCLUSIVA PARA EL DUEÑO -->
                <div class="border-t border-neutral-100 dark:border-neutral-800 pt-2.5 mt-2 space-y-1.5">
                  <div class="px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-800/40">
                    <div class="flex items-center gap-1.5 text-amber-800 dark:text-amber-300 font-bold text-[10px] uppercase tracking-wide">
                      <span>🔒</span> Solo visible por el dueño
                    </div>
                    <p class="text-[10px] text-amber-700/80 dark:text-amber-400/80 leading-tight mt-0.5">
                      Tus clientes no ven esto; solo ven el catálogo.
                    </p>
                  </div>

                  <button
                    id="demo-savings-btn"
                    class="w-full text-left px-2.5 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/80 flex items-center justify-between font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
                  >
                    <span class="flex items-center gap-2"><span>💰</span> Calculadora de Ahorro</span>
                    <span class="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500 dark:text-neutral-400 font-semibold">vs Apps</span>
                  </button>

                  <button
                    id="demo-excel-btn"
                    class="w-full text-left px-2.5 py-2 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-800/80 flex items-center justify-between font-medium text-neutral-800 dark:text-neutral-200 transition-colors"
                  >
                    <span class="flex items-center gap-2"><span>📊</span> Cargar catálogo Excel</span>
                    <span class="text-[10px] bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.5 rounded text-neutral-500 dark:text-neutral-400 font-semibold">.xlsx</span>
                  </button>
                </div>
              </div>
            ` : ''}
          </div>

          <!-- Bolsa de Compras Minimalista -->
          <button
            id="open-cart-btn"
            class="relative inline-flex items-center justify-center w-10 h-10 rounded-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 transition-all active:scale-95 shadow-sm"
            aria-label="Ver bolsa de compras"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            ${cartCount > 0 ? `
              <span class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-[#0E1015]">
                ${cartCount}
              </span>
            ` : ''}
          </button>
        </div>
      </div>
    </nav>

    <!-- Hero Sutil & Buscador -->
    <header class="bg-white dark:bg-[#0E1015] border-b border-neutral-100 dark:border-neutral-800 py-8 sm:py-10 px-4 sm:px-6 transition-colors">
      <div class="max-w-2xl mx-auto text-center space-y-4">
        <h2 class="text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-neutral-100 tracking-tight">
          ${currentProfile.heroHeadline}
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 max-w-md mx-auto">
          ${currentProfile.heroSubtitle}
        </p>

        <!-- Buscador Limpio Tipo iOS Spotlight -->
        <div class="pt-2 max-w-md mx-auto relative">
          <div class="relative flex items-center">
            <svg class="w-4 h-4 text-neutral-400 dark:text-neutral-500 absolute left-4 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              placeholder="Buscar producto..."
              value="${searchQuery}"
              class="w-full pl-11 pr-10 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800/80 hover:bg-neutral-200/60 dark:hover:bg-neutral-800 focus:bg-white dark:focus:bg-neutral-800 text-sm text-neutral-800 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100 transition-all border border-transparent"
            />
            ${searchQuery ? `
              <button id="clear-search-btn" class="absolute right-3.5 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 text-xs">✕</button>
            ` : ''}
          </div>
        </div>
      </div>
    </header>

    <!-- Navegación de Categorías (Tabs Horizontales Limpias) -->
    <div class="sticky top-16 z-30 bg-white/95 dark:bg-[#0E1015]/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 py-2.5 px-4 sm:px-6 transition-colors">
      <div class="max-w-5xl mx-auto flex items-center gap-2 overflow-x-auto no-scrollbar">
        ${currentProfile.categories.map(cat => `
          <button
            data-category="${cat.name}"
            class="category-btn px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === cat.name
                ? 'bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-sm'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800'
            }"
          >
            ${cat.name}
          </button>
        `).join('')}
      </div>
    </div>

    <!-- Catálogo de Productos (Cards Limpias & Elegantes) -->
    <main class="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 flex-grow">
      ${filteredProducts.length === 0 ? `
        <div class="py-16 text-center text-neutral-400 dark:text-neutral-500">
          <p class="text-sm font-medium">No se encontraron productos para tu búsqueda.</p>
          <button id="reset-search-btn" class="mt-3 text-xs text-neutral-900 dark:text-neutral-100 font-semibold underline underline-offset-4">
            Ver todos los productos
          </button>
        </div>
      ` : `
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          ${filteredProducts.map(product => {
            const inCart = cart.find(item => item.product.id === product.id);
            const qty = inCart ? inCart.quantity : 0;

            return `
              <div class="group flex flex-col justify-between">
                <!-- Imagen -->
                <div
                  class="relative aspect-square rounded-2xl overflow-hidden bg-neutral-100 dark:bg-neutral-800/60 cursor-pointer product-click"
                  data-product-id="${product.id}"
                >
                  <img
                    src="${product.image}"
                    alt="${product.name}"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onerror="this.src='https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80'"
                  />
                  ${product.badge ? `
                    <span class="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/90 dark:bg-neutral-900/90 backdrop-blur text-neutral-900 dark:text-white shadow-sm">
                      ${product.badge}
                    </span>
                  ` : ''}

                  <!-- Botón Agregar Rápido Flotante -->
                  <div class="absolute bottom-2.5 right-2.5">
                    ${qty === 0 ? `
                      <button
                        data-add-id="${product.id}"
                        class="add-to-cart-btn w-9 h-9 rounded-full bg-white/95 dark:bg-neutral-900/95 hover:bg-white dark:hover:bg-neutral-900 text-neutral-900 dark:text-white flex items-center justify-center shadow-md active:scale-90 transition-all font-semibold"
                        title="Agregar al pedido"
                      >
                        <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    ` : `
                      <div class="flex items-center gap-1.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 px-2 py-1 rounded-full shadow-md">
                        <button data-decrement-id="${product.id}" class="decrement-btn text-xs font-bold px-1 hover:opacity-75">−</button>
                        <span class="text-xs font-semibold px-0.5">${qty}</span>
                        <button data-increment-id="${product.id}" class="increment-btn text-xs font-bold px-1 hover:opacity-75">+</button>
                      </div>
                    `}
                  </div>
                </div>

                <!-- Detalles -->
                <div class="pt-3 cursor-pointer product-click" data-product-id="${product.id}">
                  <h3 class="text-sm font-medium text-neutral-900 dark:text-neutral-100 line-clamp-1 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
                    ${product.name}
                  </h3>
                  <div class="flex items-baseline gap-1.5 mt-1">
                    <span class="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                      ${formatMoney(product.price)}
                    </span>
                    ${product.unit ? `
                      <span class="text-[11px] text-neutral-400 dark:text-neutral-500">/ ${product.unit}</span>
                    ` : ''}
                  </div>
                </div>
              </div>
            `;
          }).join('')}
        </div>
      `}
    </main>

    <!-- Barra Inferior Flotante (Limpia & Minimalista) -->
    ${cartCount > 0 ? `
      <div class="fixed bottom-5 left-0 right-0 z-40 px-4 pointer-events-none">
        <div class="max-w-md mx-auto pointer-events-auto">
          <button
            id="floating-cart-btn"
            class="w-full bg-neutral-900 dark:bg-white hover:bg-neutral-800 dark:hover:bg-neutral-100 text-white dark:text-neutral-900 px-5 py-3.5 rounded-full shadow-2xl flex items-center justify-between transition-transform active:scale-95"
          >
            <div class="flex items-center gap-2.5">
              <span class="w-6 h-6 rounded-full bg-white/20 dark:bg-black/10 text-white dark:text-neutral-900 text-xs font-bold flex items-center justify-center">
                ${cartCount}
              </span>
              <span class="text-sm font-medium">Ver pedido</span>
            </div>
            <span class="text-sm font-bold">${formatMoney(cartSubtotal)}</span>
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Drawer Lateral: Pedido & Checkout a WhatsApp (Modern Sheet) -->
    ${isCartOpen ? `
      <div class="fixed inset-0 z-50 overflow-hidden">
        <div id="cart-backdrop" class="absolute inset-0 bg-neutral-900/40 dark:bg-black/70 backdrop-blur-sm transition-opacity"></div>

        <div class="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white dark:bg-[#14171F] shadow-2xl flex flex-col justify-between z-10 transition-colors">
          <!-- Header -->
          <div class="p-5 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
            <div>
              <h3 class="font-semibold text-neutral-900 dark:text-neutral-100 text-lg">Tu Pedido</h3>
              <span class="text-xs text-neutral-400 dark:text-neutral-500">${cartCount} productos</span>
            </div>
            <div class="flex items-center gap-2">
              ${cart.length > 0 ? `
                <button id="clear-cart-btn" class="text-xs text-neutral-400 hover:text-red-500 transition-colors px-2 py-1">
                  Vaciar
                </button>
              ` : ''}
              <button id="close-cart-btn" class="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center text-sm font-semibold">
                ✕
              </button>
            </div>
          </div>

          <!-- Lista de Ítems -->
          <div class="flex-grow overflow-y-auto p-5 space-y-4">
            ${cart.length === 0 ? `
              <div class="py-20 text-center text-neutral-400 dark:text-neutral-500">
                <p class="text-sm font-medium">La bolsa está vacía</p>
                <button id="start-shopping-btn" class="mt-3 text-xs text-neutral-900 dark:text-white font-semibold underline underline-offset-4">
                  Comenzar a comprar
                </button>
              </div>
            ` : `
              <div class="space-y-3">
                ${cart.map(item => `
                  <div class="flex items-center justify-between gap-3 py-2 border-b border-neutral-50 dark:border-neutral-800/60">
                    <img src="${item.product.image}" alt="${item.product.name}" class="w-12 h-12 rounded-xl object-cover bg-neutral-100 dark:bg-neutral-800 shrink-0" />
                    <div class="flex-grow min-w-0">
                      <h4 class="text-sm font-medium text-neutral-900 dark:text-neutral-100 truncate">${item.product.name}</h4>
                      <span class="text-xs text-neutral-400 dark:text-neutral-500">${formatMoney(item.product.price)} c/u</span>
                    </div>
                    <div class="flex items-center gap-2 shrink-0">
                      <div class="flex items-center border border-neutral-200 dark:border-neutral-700 rounded-full px-2 py-0.5">
                        <button data-cart-dec="${item.product.id}" class="text-xs font-bold px-1 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white">−</button>
                        <span class="text-xs font-semibold px-2 text-neutral-900 dark:text-neutral-100">${item.quantity}</span>
                        <button data-cart-inc="${item.product.id}" class="text-xs font-bold px-1 text-neutral-600 dark:text-neutral-300 hover:text-black dark:hover:text-white">+</button>
                      </div>
                      <button data-cart-remove="${item.product.id}" class="text-neutral-300 dark:text-neutral-600 hover:text-red-500 text-xs p-1" title="Eliminar">✕</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Formulario de Entrega & Pago -->
              <div class="pt-4 space-y-3.5">
                <div class="flex bg-neutral-100 dark:bg-neutral-800 p-1 rounded-full text-xs font-medium">
                  <button
                    id="delivery-envio-btn"
                    class="flex-1 py-1.5 rounded-full transition-all ${
                      checkout.deliveryType === 'envio'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }"
                  >
                    Envío a Domicilio
                  </button>
                  <button
                    id="delivery-retiro-btn"
                    class="flex-1 py-1.5 rounded-full transition-all ${
                      checkout.deliveryType === 'retiro'
                        ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white shadow-sm font-semibold'
                        : 'text-neutral-500 dark:text-neutral-400'
                    }"
                  >
                    Retiro en Local
                  </button>
                </div>

                <input
                  type="text"
                  id="input-name"
                  value="${checkout.customerName}"
                  placeholder="Tu nombre completo *"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 focus:bg-white dark:focus:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                />

                <input
                  type="tel"
                  id="input-phone"
                  value="${checkout.phone}"
                  placeholder="Teléfono / WhatsApp (opcional)"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 focus:bg-white dark:focus:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                />

                ${checkout.deliveryType === 'envio' ? `
                  <input
                    type="text"
                    id="input-address"
                    value="${checkout.address}"
                    placeholder="Dirección de entrega (calle y número) *"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 focus:bg-white dark:focus:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                  />
                  <input
                    type="text"
                    id="input-floor"
                    value="${checkout.floorApt}"
                    placeholder="Piso / Depto / Timbre (opcional)"
                    class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 focus:bg-white dark:focus:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-xs sm:text-sm text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                  />
                ` : ''}

                <select
                  id="select-payment"
                  class="w-full px-3.5 py-2.5 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 focus:bg-white dark:focus:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-xs sm:text-sm text-neutral-800 dark:text-neutral-100"
                >
                  <option value="Efectivo (10% descuento)" ${checkout.paymentMethod.includes('Efectivo') ? 'selected' : ''}>
                    Efectivo (${currentProfile.cashDiscountPercent}% OFF)
                  </option>
                  <option value="Mercado Pago / QR" ${checkout.paymentMethod.includes('Mercado') ? 'selected' : ''}>
                    Mercado Pago / Transferencia
                  </option>
                  <option value="Tarjeta de Débito" ${checkout.paymentMethod.includes('Tarjeta') ? 'selected' : ''}>
                    Tarjeta Débito / Crédito
                  </option>
                </select>

                <input
                  type="text"
                  id="input-notes"
                  value="${checkout.notes}"
                  placeholder="Aclaración adicional para el pedido..."
                  class="w-full px-3.5 py-2 rounded-xl bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-xs text-neutral-900 dark:text-neutral-100 placeholder-neutral-400"
                />
              </div>
            `}
          </div>

          <!-- Footer con Totales y Botón Limpio -->
          ${cart.length > 0 ? `
            <div class="p-5 border-t border-neutral-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/60 space-y-3 pb-8 sm:pb-5">
              <div class="space-y-1 text-xs text-neutral-500 dark:text-neutral-400">
                <div class="flex justify-between">
                  <span>Subtotal:</span>
                  <span class="font-medium text-neutral-800 dark:text-neutral-200">${formatMoney(cartSubtotal)}</span>
                </div>
                ${getDiscountAmount() > 0 ? `
                  <div class="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
                    <span>Descuento efectivo:</span>
                    <span>-${formatMoney(getDiscountAmount())}</span>
                  </div>
                ` : ''}
                ${checkout.deliveryType === 'envio' ? `
                  <div class="flex justify-between">
                    <span>Envío:</span>
                    <span class="font-medium text-neutral-800 dark:text-neutral-200">${getShippingCost() === 0 ? 'Gratis' : formatMoney(getShippingCost())}</span>
                  </div>
                ` : ''}
                <div class="flex justify-between text-base font-bold text-neutral-900 dark:text-neutral-100 pt-2 border-t border-neutral-200 dark:border-neutral-700">
                  <span>Total:</span>
                  <span>${formatMoney(getCartTotal())}</span>
                </div>
              </div>

              <button
                id="send-whatsapp-btn"
                class="w-full py-3.5 px-4 rounded-xl bg-neutral-900 dark:bg-emerald-600 hover:bg-neutral-800 dark:hover:bg-emerald-500 text-white font-medium text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2 shadow-sm"
              >
                <span>Enviar pedido por WhatsApp</span>
                <span>→</span>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    <!-- Modal: Detalle de Producto -->
    ${selectedProductForDetail ? `
      <div class="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-[#14171F] rounded-3xl max-w-sm w-full overflow-hidden shadow-2xl relative border border-neutral-100 dark:border-neutral-800">
          <button id="close-product-detail-btn" class="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 dark:bg-neutral-800/80 backdrop-blur text-neutral-700 dark:text-neutral-200 flex items-center justify-center text-xs font-bold shadow-sm">
            ✕
          </button>
          <div class="aspect-square bg-neutral-100 dark:bg-neutral-800">
            <img src="${selectedProductForDetail.image}" alt="${selectedProductForDetail.name}" class="w-full h-full object-cover" />
          </div>
          <div class="p-5 space-y-3">
            <div>
              <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-400 dark:text-neutral-500">
                ${selectedProductForDetail.category}
              </span>
              <h3 class="text-base font-semibold text-neutral-900 dark:text-neutral-100 mt-0.5">
                ${selectedProductForDetail.name}
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 leading-relaxed">
                ${selectedProductForDetail.description}
              </p>
            </div>
            <div class="flex items-baseline justify-between pt-2">
              <span class="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                ${formatMoney(selectedProductForDetail.price)}
              </span>
              ${selectedProductForDetail.unit ? `
                <span class="text-xs text-neutral-400 dark:text-neutral-500">Presentación: ${selectedProductForDetail.unit}</span>
              ` : ''}
            </div>
            <button
              id="detail-add-btn"
              class="w-full py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 font-medium rounded-xl text-xs transition-all"
            >
              Agregar a la bolsa
            </button>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Modal: Calculadora de Ahorro para el Dueño -->
    ${isSavingsModalOpen ? `
      <div class="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-[#14171F] rounded-3xl max-w-md w-full p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 relative">
          <button id="close-savings-btn" class="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white flex items-center justify-center text-xs">
            ✕
          </button>
          
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-1">
            <span>🔒</span>
            <span>HERRAMIENTA EXCLUSIVA PARA EL DUEÑO</span>
          </div>
          <h3 class="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Calculadora de Ahorro Real</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1">Comparación directa con comisiones de apps de delivery (25%).</p>

          <div class="my-5 p-4 rounded-2xl bg-neutral-50 dark:bg-neutral-800/60 space-y-3">
            <div class="flex justify-between items-center text-xs">
              <span class="font-medium text-neutral-600 dark:text-neutral-400">Ventas mensuales estimadas:</span>
              <span class="font-bold text-neutral-900 dark:text-neutral-100 text-sm">${formatMoney(estimatedMonthlySales)}</span>
            </div>
            <input
              type="range"
              id="sales-range-input"
              min="300000"
              max="5000000"
              step="100000"
              value="${estimatedMonthlySales}"
              class="w-full accent-neutral-900 dark:accent-emerald-500 cursor-pointer"
            />
          </div>

          <div class="grid grid-cols-2 gap-3 mb-4">
            <div class="p-3.5 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-100 dark:border-red-900/40 text-center">
              <span class="text-[11px] font-medium text-red-600 dark:text-red-400 block">Comisión Apps (25%)</span>
              <span class="text-base font-bold text-red-700 dark:text-red-300 block mt-0.5">-${formatMoney(Math.round(estimatedMonthlySales * 0.25))}</span>
            </div>
            <div class="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/40 text-center">
              <span class="text-[11px] font-medium text-emerald-700 dark:text-emerald-300 block">Con Tu Web Propia</span>
              <span class="text-base font-bold text-emerald-700 dark:text-emerald-300 block mt-0.5">$0 Comisión</span>
            </div>
          </div>

          <p class="text-xs text-neutral-500 dark:text-neutral-400 text-center mb-4 leading-relaxed">
            Con tu catálogo directo a WhatsApp, el 100% del pago de tus clientes ingresa directamente a tu cuenta.
          </p>

          <button id="close-savings-bottom-btn" class="w-full py-2.5 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl text-xs font-medium">
            Volver al catálogo
          </button>
        </div>
      </div>
    ` : ''}

    <!-- Modal: Excel -->
    ${isExcelModalOpen ? `
      <div class="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-[#14171F] rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-neutral-100 dark:border-neutral-800 relative">
          <button id="close-excel-btn" class="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white flex items-center justify-center text-xs">
            ✕
          </button>
          
          <div class="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-1">
            <span>🔒</span>
            <span>PANEL DE ADMINISTRACIÓN</span>
          </div>
          <h3 class="text-base font-semibold text-neutral-900 dark:text-neutral-100">Actualizar con Excel</h3>
          <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-1 mb-4">Descargá o subí tu lista de precios en formato .xlsx.</p>

          <button
            id="download-excel-btn"
            class="w-full py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-800 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-medium mb-3 flex items-center justify-center gap-1.5 transition-colors"
          >
            📥 Descargar Catálogo Actual (.xlsx)
          </button>

          <label class="block border-2 border-dashed border-neutral-200 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-500 rounded-2xl p-5 text-center cursor-pointer transition-colors">
            <span class="text-xs font-medium text-neutral-700 dark:text-neutral-300 block">Subir archivo modificado</span>
            <span class="text-[10px] text-neutral-400 dark:text-neutral-500 block mt-0.5">.xlsx o .xls</span>
            <input type="file" id="excel-file-input" accept=".xlsx,.xls" class="hidden" />
          </label>
          <div id="excel-status" class="mt-2 text-xs text-center"></div>
        </div>
      </div>
    ` : ''}

    <!-- Modal: Info del Local -->
    ${isInfoModalOpen ? `
      <div class="fixed inset-0 z-50 overflow-y-auto bg-neutral-900/40 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div class="bg-white dark:bg-[#14171F] rounded-3xl max-w-sm w-full p-6 shadow-2xl relative border border-neutral-100 dark:border-neutral-800 space-y-4">
          <button id="close-info-btn-2" class="absolute top-4 right-4 w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-black dark:hover:text-white flex items-center justify-center text-xs">
            ✕
          </button>
          <div class="flex items-center gap-3">
            <span class="text-2xl">${currentProfile.rubroIcon}</span>
            <div>
              <h3 class="text-base font-semibold text-neutral-900 dark:text-neutral-100">${currentProfile.name}</h3>
              <p class="text-xs text-neutral-400 dark:text-neutral-500">Información del comercio</p>
            </div>
          </div>
          <div class="space-y-2 text-xs text-neutral-600 dark:text-neutral-400">
            <p><strong class="text-neutral-900 dark:text-neutral-200">Dirección:</strong> ${currentProfile.address}</p>
            <p><strong class="text-neutral-900 dark:text-neutral-200">Horarios:</strong> ${currentProfile.hours}</p>
            <p><strong class="text-neutral-900 dark:text-neutral-200">Envíos:</strong> ${currentProfile.deliveryEstimate} (Gratis desde ${formatMoney(currentProfile.freeShippingThreshold)})</p>
          </div>
        </div>
      </div>
    ` : ''}

    <!-- Toast Minimalista -->
    ${toastMessage ? `
      <div class="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-neutral-900/90 dark:bg-white/90 text-white dark:text-neutral-900 px-4 py-2 rounded-full shadow-lg text-xs font-medium backdrop-blur-sm pointer-events-none">
        ${toastMessage}
      </div>
    ` : ''}
  `;

  attachListeners();
}

function attachListeners() {
  // Cambio de perfil desde el menú de demo
  document.querySelectorAll('.profile-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-profile-id');
      if (id) switchProfile(id);
    });
  });

  // Categorías
  document.querySelectorAll('.category-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = (e.currentTarget as HTMLElement).getAttribute('data-category');
      if (cat) {
        activeCategory = cat;
        playTapSound();
        render();
      }
    });
  });

  // Buscador
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = (e.target as HTMLInputElement).value;
      render();
      const newInput = document.getElementById('search-input') as HTMLInputElement | null;
      if (newInput) {
        newInput.focus();
        newInput.setSelectionRange(newInput.value.length, newInput.value.length);
      }
    });
  }

  const clearSearchBtn = document.getElementById('clear-search-btn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      playTapSound();
      render();
    });
  }

  const resetSearchBtn = document.getElementById('reset-search-btn');
  if (resetSearchBtn) {
    resetSearchBtn.addEventListener('click', () => {
      searchQuery = '';
      activeCategory = 'Todos';
      playTapSound();
      render();
    });
  }

  // Agregar al carrito
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (e.currentTarget as HTMLElement).getAttribute('data-add-id');
      const prod = currentProfile.products.find(p => p.id === id);
      if (prod) addToCart(prod);
    });
  });

  // Stepper en tarjeta
  document.querySelectorAll('.increment-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (e.currentTarget as HTMLElement).getAttribute('data-increment-id');
      if (id) updateQuantity(id, 1);
    });
  });

  document.querySelectorAll('.decrement-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const id = (e.currentTarget as HTMLElement).getAttribute('data-decrement-id');
      if (id) updateQuantity(id, -1);
    });
  });

  // Detalle de Producto al clickear tarjeta
  document.querySelectorAll('.product-click').forEach(elem => {
    elem.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-product-id');
      const prod = currentProfile.products.find(p => p.id === id);
      if (prod) {
        selectedProductForDetail = prod;
        playTapSound();
        render();
      }
    });
  });

  const closeDetailBtn = document.getElementById('close-product-detail-btn');
  if (closeDetailBtn) {
    closeDetailBtn.addEventListener('click', () => {
      selectedProductForDetail = null;
      render();
    });
  }

  const detailAddBtn = document.getElementById('detail-add-btn');
  if (detailAddBtn && selectedProductForDetail) {
    detailAddBtn.addEventListener('click', () => {
      if (selectedProductForDetail) {
        addToCart(selectedProductForDetail);
        selectedProductForDetail = null;
      }
    });
  }

  // Carrito Drawer
  const openCartBtn = document.getElementById('open-cart-btn');
  if (openCartBtn) {
    openCartBtn.addEventListener('click', () => {
      isCartOpen = true;
      playTapSound();
      render();
    });
  }

  const floatingCartBtn = document.getElementById('floating-cart-btn');
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', () => {
      isCartOpen = true;
      playTapSound();
      render();
    });
  }

  const closeCartBtn = document.getElementById('close-cart-btn');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      isCartOpen = false;
      render();
    });
  }

  const cartBackdrop = document.getElementById('cart-backdrop');
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', () => {
      isCartOpen = false;
      render();
    });
  }

  const clearCartBtn = document.getElementById('clear-cart-btn');
  if (clearCartBtn) {
    clearCartBtn.addEventListener('click', clearCart);
  }

  const startShoppingBtn = document.getElementById('start-shopping-btn');
  if (startShoppingBtn) {
    startShoppingBtn.addEventListener('click', () => {
      isCartOpen = false;
      render();
    });
  }

  document.querySelectorAll('[data-cart-inc]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-cart-inc');
      if (id) updateQuantity(id, 1);
    });
  });

  document.querySelectorAll('[data-cart-dec]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-cart-dec');
      if (id) updateQuantity(id, -1);
    });
  });

  document.querySelectorAll('[data-cart-remove]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-cart-remove');
      if (id) removeFromCart(id);
    });
  });

  // Inputs checkout
  const inputName = document.getElementById('input-name') as HTMLInputElement | null;
  if (inputName) {
    inputName.addEventListener('input', (e) => {
      checkout.customerName = (e.target as HTMLInputElement).value;
    });
  }

  const inputPhone = document.getElementById('input-phone') as HTMLInputElement | null;
  if (inputPhone) {
    inputPhone.addEventListener('input', (e) => {
      checkout.phone = (e.target as HTMLInputElement).value;
    });
  }

  const inputAddress = document.getElementById('input-address') as HTMLInputElement | null;
  if (inputAddress) {
    inputAddress.addEventListener('input', (e) => {
      checkout.address = (e.target as HTMLInputElement).value;
    });
  }

  const inputFloor = document.getElementById('input-floor') as HTMLInputElement | null;
  if (inputFloor) {
    inputFloor.addEventListener('input', (e) => {
      checkout.floorApt = (e.target as HTMLInputElement).value;
    });
  }

  const selectPayment = document.getElementById('select-payment') as HTMLSelectElement | null;
  if (selectPayment) {
    selectPayment.addEventListener('change', (e) => {
      checkout.paymentMethod = (e.target as HTMLSelectElement).value;
      render();
    });
  }

  const inputNotes = document.getElementById('input-notes') as HTMLInputElement | null;
  if (inputNotes) {
    inputNotes.addEventListener('input', (e) => {
      checkout.notes = (e.target as HTMLInputElement).value;
    });
  }

  const deliveryEnvioBtn = document.getElementById('delivery-envio-btn');
  if (deliveryEnvioBtn) {
    deliveryEnvioBtn.addEventListener('click', () => {
      checkout.deliveryType = 'envio';
      render();
    });
  }

  const deliveryRetiroBtn = document.getElementById('delivery-retiro-btn');
  if (deliveryRetiroBtn) {
    deliveryRetiroBtn.addEventListener('click', () => {
      checkout.deliveryType = 'retiro';
      render();
    });
  }

  const sendWhatsAppBtn = document.getElementById('send-whatsapp-btn');
  if (sendWhatsAppBtn) {
    sendWhatsAppBtn.addEventListener('click', sendWhatsAppOrder);
  }

  // Toggle de Tema Claro / Oscuro dentro del menú de ajustes
  const demoThemeBtn = document.getElementById('demo-theme-btn');
  if (demoThemeBtn) {
    demoThemeBtn.addEventListener('click', () => {
      toggleTheme();
    });
  }

  // Menú Flotante de Demo
  const openDemoMenuBtn = document.getElementById('open-demo-menu-btn');
  if (openDemoMenuBtn) {
    openDemoMenuBtn.addEventListener('click', () => {
      isDemoMenuOpen = !isDemoMenuOpen;
      render();
    });
  }

  const demoSavingsBtn = document.getElementById('demo-savings-btn');
  if (demoSavingsBtn) {
    demoSavingsBtn.addEventListener('click', () => {
      isSavingsModalOpen = true;
      isDemoMenuOpen = false;
      render();
    });
  }

  const demoExcelBtn = document.getElementById('demo-excel-btn');
  if (demoExcelBtn) {
    demoExcelBtn.addEventListener('click', () => {
      isExcelModalOpen = true;
      isDemoMenuOpen = false;
      render();
    });
  }

  const closeSavingsBtn = document.getElementById('close-savings-btn');
  if (closeSavingsBtn) {
    closeSavingsBtn.addEventListener('click', () => {
      isSavingsModalOpen = false;
      render();
    });
  }

  const closeSavingsBottomBtn = document.getElementById('close-savings-bottom-btn');
  if (closeSavingsBottomBtn) {
    closeSavingsBottomBtn.addEventListener('click', () => {
      isSavingsModalOpen = false;
      render();
    });
  }

  const salesRangeInput = document.getElementById('sales-range-input') as HTMLInputElement | null;
  if (salesRangeInput) {
    salesRangeInput.addEventListener('input', (e) => {
      estimatedMonthlySales = parseInt((e.target as HTMLInputElement).value, 10);
      render();
    });
  }

  const closeExcelBtn = document.getElementById('close-excel-btn');
  if (closeExcelBtn) {
    closeExcelBtn.addEventListener('click', () => {
      isExcelModalOpen = false;
      render();
    });
  }

  const downloadExcelBtn = document.getElementById('download-excel-btn');
  if (downloadExcelBtn) {
    downloadExcelBtn.addEventListener('click', () => {
      exportCatalogToExcel(currentProfile);
      showToast('Excel descargado');
    });
  }

  const excelFileInput = document.getElementById('excel-file-input') as HTMLInputElement | null;
  if (excelFileInput) {
    excelFileInput.addEventListener('change', async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      const statusDiv = document.getElementById('excel-status');
      if (file && statusDiv) {
        statusDiv.innerHTML = '<span class="text-neutral-500">Procesando...</span>';
        try {
          const newProducts = await parseExcelProducts(file);
          currentProfile.products = newProducts;
          statusDiv.innerHTML = `<span class="text-emerald-600 font-semibold">Listo: ${newProducts.length} productos</span>`;
          setTimeout(() => {
            isExcelModalOpen = false;
            showToast(`${newProducts.length} productos actualizados`);
            render();
          }, 1000);
        } catch (err) {
          statusDiv.innerHTML = `<span class="text-red-500 font-medium">${(err as Error).message}</span>`;
        }
      }
    });
  }

  // Modal Info
  const openInfoBtn = document.getElementById('open-info-btn');
  if (openInfoBtn) {
    openInfoBtn.addEventListener('click', () => {
      isInfoModalOpen = true;
      render();
    });
  }

  const closeInfoBtn2 = document.getElementById('close-info-btn-2');
  if (closeInfoBtn2) {
    closeInfoBtn2.addEventListener('click', () => {
      isInfoModalOpen = false;
      render();
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
init();
