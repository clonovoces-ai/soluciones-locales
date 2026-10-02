// Demo Sistema de Turnos & Tienda E-commerce para Pet Shops & Peluquerías Caninas
let isDarkMode = false; // Modo claro predeterminado

// Detección dinámica de host (funciona en Vercel, localhost y celulares en red)
const getHost = () => (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
const isCustomDomain = () => typeof window !== 'undefined' && window.location.hostname.includes('adrianschuster.com.ar');

const HUB_URL = (import.meta as any).env?.VITE_HUB_URL || (isCustomDomain() ? 'https://sd.adrianschuster.com.ar/' : `http://${getHost()}:3000/`);
const PETSHOP_WHATSAPP = (import.meta as any).env?.VITE_WHATSAPP_NUM || '5491123351610'; // WhatsApp de Adrián / Pet Shop

const getCustomBusinessName = () => {
  if (typeof window === 'undefined') return 'Patitas & Co. Pet Shop';
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('demo') || params.get('local') || params.get('comercio') || params.get('nombre');
  if (nameParam && nameParam.trim()) {
    return nameParam.trim();
  }
  return 'Patitas & Co. Pet Shop';
};

const isCustomDemo = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return !!(params.get('demo') || params.get('local') || params.get('comercio') || params.get('nombre'));
};

type PetSize = 'pequeno' | 'mediano' | 'grande' | 'gato';

interface PetSizeOption {
  id: PetSize;
  name: string;
  weight: string;
  examples: string;
  icon: string;
  priceMultiplier: number;
}

const PET_SIZES: PetSizeOption[] = [
  {
    id: 'pequeno',
    name: 'Pequeño',
    weight: 'Hasta 8 kg',
    examples: 'Caniche, Bulldog Francés, Shih Tzu',
    icon: '🐕',
    priceMultiplier: 1.0
  },
  {
    id: 'mediano',
    name: 'Mediano',
    weight: '8 a 20 kg',
    examples: 'Cocker, Beagle, Schnauzer, Mestizo',
    icon: '🦮',
    priceMultiplier: 1.25
  },
  {
    id: 'grande',
    name: 'Grande / Gigante',
    weight: '+20 kg',
    examples: 'Golden, Labrador, Ovejero, Boxer',
    icon: '🐕‍🦺',
    priceMultiplier: 1.55
  },
  {
    id: 'gato',
    name: 'Gatito / Felino',
    weight: 'Cualquier peso',
    examples: 'Baño seco / cepillado con cuidado especial',
    icon: '🐱',
    priceMultiplier: 1.15
  }
];

interface Service {
  id: string;
  name: string;
  basePrice: number;
  duration: string;
  description: string;
  badge?: string;
  icon: string;
  category: 'bano' | 'corte' | 'salud';
}

const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Baño Completo Spa + Secado & Perfume',
    basePrice: 11000,
    duration: '1h 15m',
    description: 'Doble lavado con shampoo hipoalergénico, acondicionador desenredante, secado tibio, corte de uñas, limpieza de oídos y pañuelo de regalo.',
    icon: '🛁',
    badge: 'Popular',
    category: 'bano'
  },
  {
    id: 's2',
    name: 'Baño Spa + Corte Completo / De Raza',
    basePrice: 15500,
    duration: '2h 00m',
    description: 'La experiencia completa: baño spa profundo + corte higiénico y corte a tijera/máquina adaptado al estándar de la raza o a pedido de la familia.',
    icon: '✂️',
    badge: 'Más Elegido',
    category: 'corte'
  },
  {
    id: 's3',
    name: 'Baño Medicado / Dermatológico',
    basePrice: 13500,
    duration: '1h 30m',
    description: 'Tratamiento especial para pieles sensibles, alergias o picazón. Uso de shampoo antiséptico/antifúngico con 10 minutos de reposo terapéutico.',
    icon: '🧼',
    badge: 'Cuidado Especial',
    category: 'bano'
  },
  {
    id: 's4',
    name: 'Deslanado Profundo & Eliminación de Subpelo',
    basePrice: 14000,
    duration: '1h 45m',
    description: 'Tratamiento intensivo con herramientas deslanadoras profesionales para retirar todo el pelo muerto suelto. Reduce 80% la caída en casa.',
    icon: '🐾',
    category: 'corte'
  },
  {
    id: 's5',
    name: 'Consulta Veterinaria Clínica / Vacunación',
    basePrice: 9000,
    duration: '30 min',
    description: 'Chequeo general preventivo, control de peso, aplicación de vacunas obligatorias (Séxtuple, Antirrábica) y firma de libreta sanitaria.',
    icon: '🩺',
    badge: 'Salud',
    category: 'salud'
  }
];

type ProductCategory = 'todos' | 'perros' | 'gatos' | 'farmacia' | 'snacks' | 'accesorios';

interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  weight: string;
  icon: string;
  badge?: string;
  brand: string;
}

const CATALOG_PRODUCTS: Product[] = [
  // Perros
  {
    id: 'p1',
    name: 'Royal Canin Mini Adult',
    brand: 'Royal Canin',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 36500,
    weight: 'Bolsa 7.5 kg',
    icon: '🥩',
    badge: 'Envío Gratis'
  },
  {
    id: 'p2',
    name: 'Purina Pro Plan OptiHealth Adulto Mediano',
    brand: 'Pro Plan',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 52000,
    weight: 'Bolsa 15 kg',
    icon: '🍖',
    badge: 'Promo 10% OFF'
  },
  {
    id: 'p3',
    name: 'Vitalcan Balanced Adulto Raza Grande',
    brand: 'Vitalcan',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 43000,
    weight: 'Bolsa 20 kg',
    icon: '🥩',
    badge: 'Más Vendido'
  },
  {
    id: 'p4',
    name: 'Pedigree Pouch Carne en Salsa',
    brand: 'Pedigree',
    category: 'perros',
    categoryLabel: 'Perros',
    price: 11500,
    weight: 'Caja x 12 sobres',
    icon: '🍲'
  },

  // Gatos
  {
    id: 'p5',
    name: 'Royal Canin Feline Indoor Adult',
    brand: 'Royal Canin',
    category: 'gatos',
    categoryLabel: 'Gatos',
    price: 38900,
    weight: 'Bolsa 7.5 kg',
    icon: '🐟',
    badge: 'Top Gatos'
  },
  {
    id: 'p6',
    name: 'Purina Excellent Gato Pollo & Arroz',
    brand: 'Excellent',
    category: 'gatos',
    categoryLabel: 'Gatos',
    price: 34500,
    weight: 'Bolsa 10 kg',
    icon: '🍗'
  },
  {
    id: 'p7',
    name: 'Piedras Sanitarias Aglomerantes Odor-Lock',
    brand: 'Sanitarias',
    category: 'gatos',
    categoryLabel: 'Gatos',
    price: 7800,
    weight: 'Bolsa 10 kg',
    icon: '✨'
  },
  {
    id: 'p8',
    name: 'Snack Churu Atún con Salmón',
    brand: 'Inaba Churu',
    category: 'gatos',
    categoryLabel: 'Gatos',
    price: 4800,
    weight: 'Pack x 4 tubos',
    icon: '🍣',
    badge: 'Favorito'
  },

  // Farmacia & Antiparasitarios
  {
    id: 'p9',
    name: 'Nexgard Spectra (10 a 30 kg)',
    brand: 'Boehringer',
    category: 'farmacia',
    categoryLabel: 'Farmacia',
    price: 18500,
    weight: '1 Pastilla Masticable (Pulgas, Garrapatas y Parásitos)',
    icon: '💊',
    badge: 'Top Farmacia'
  },
  {
    id: 'p10',
    name: 'Bravecto Perros (20 a 40 kg)',
    brand: 'MSD',
    category: 'farmacia',
    categoryLabel: 'Farmacia',
    price: 32000,
    weight: 'Protección x 12 Semanas',
    icon: '🛡️'
  },
  {
    id: 'p11',
    name: 'Pipeta Antiparasitaria Frontline Plus Perro',
    brand: 'Frontline',
    category: 'farmacia',
    categoryLabel: 'Farmacia',
    price: 8900,
    weight: '1 Pipeta Spot-on',
    icon: '💧'
  },

  // Snacks & Juguetes
  {
    id: 'p12',
    name: 'Juguete Kong Classic Rellenable',
    brand: 'Kong',
    category: 'snacks',
    categoryLabel: 'Snacks & Juguetes',
    price: 16500,
    weight: 'Tamaño Large (Caucho natural)',
    icon: '🎾',
    badge: 'Indestructible'
  },
  {
    id: 'p13',
    name: 'Huesos de Cuero Prensado 100% Vacuno',
    brand: 'Patitas Gourmet',
    category: 'snacks',
    categoryLabel: 'Snacks & Juguetes',
    price: 6200,
    weight: 'Pack x 3 unidades (15 cm)',
    icon: '🦴'
  },

  // Accesorios
  {
    id: 'p14',
    name: 'Pretal Antitirones Ergonómico Acolchado',
    brand: 'Julius Style',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 19800,
    weight: 'Talle Regulable M/L',
    icon: '🦮',
    badge: 'Recomendado'
  },
  {
    id: 'p15',
    name: 'Cama Colchón Antiestrés Lavable',
    brand: 'Fluffy Pet',
    category: 'accesorios',
    categoryLabel: 'Accesorios',
    price: 24500,
    weight: 'Diámetro 70 cm',
    icon: '🛏️'
  }
];

const TIME_SLOTS = [
  '09:00', '10:30', '12:00', '14:00', '15:30', '17:00', '18:30'
];

function getUpcomingDays() {
  const days = [];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() === 0) continue; // Saltar domingos

    days.push({
      dateStr: d.toISOString().split('T')[0],
      dayName: i === 0 ? 'Hoy' : (i === 1 ? 'Mañana' : dayNames[d.getDay()]),
      dayNum: d.getDate(),
      month: monthNames[d.getMonth()]
    });
    if (days.length >= 5) break;
  }
  return days;
}

// Estado
interface BookingState {
  selectedSize: PetSize;
  selectedServiceId: string;
  selectedDate: string;
  selectedTime: string | null;
  petName: string;
  petBreed: string;
  ownerName: string;
  ownerPhone: string;
  behaviorNotes: string;
  needsMattedHairCare: boolean;
  
  // E-commerce Tienda
  selectedStoreCategory: ProductCategory;
  searchQuery: string;
  cart: { [productId: string]: number };
  isCartOpen: boolean;
  deliveryMethod: 'delivery' | 'retiro';
  deliveryAddress: string;
}

const state: BookingState = {
  selectedSize: 'pequeno',
  selectedServiceId: 's1',
  selectedDate: getUpcomingDays()[0]?.dateStr || '',
  selectedTime: '10:30',
  petName: '',
  petBreed: '',
  ownerName: '',
  ownerPhone: '',
  behaviorNotes: '',
  needsMattedHairCare: false,

  selectedStoreCategory: 'todos',
  searchQuery: '',
  cart: {},
  isCartOpen: false,
  deliveryMethod: 'delivery',
  deliveryAddress: ''
};

function init() {
  const savedTheme = localStorage.getItem('patitas_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : false; // Por defecto modo claro
  document.documentElement.classList.toggle('dark', isDarkMode);
  render();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('patitas_theme', isDarkMode ? 'dark' : 'light');
  render();
}

function formatPrice(n: number) {
  return '$' + Math.round(n).toLocaleString('es-AR');
}

function calculateFinalPrice(basePrice: number, size: PetSize, needsMatted: boolean) {
  const sizeOption = PET_SIZES.find(s => s.id === size);
  const mult = sizeOption ? sizeOption.priceMultiplier : 1.0;
  let finalP = basePrice * mult;
  if (needsMatted) {
    finalP += 3000;
  }
  return finalP;
}

// Acciones Carrito
function addToCart(productId: string) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  render();
}

function updateCartQty(productId: string, delta: number) {
  if (!state.cart[productId]) return;
  const newQty = state.cart[productId] + delta;
  if (newQty <= 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = newQty;
  }
  render();
}

function getCartItemCount() {
  return Object.values(state.cart).reduce((sum, q) => sum + q, 0);
}

function getCartSubtotal() {
  return Object.entries(state.cart).reduce((sum, [pId, qty]) => {
    const prod = CATALOG_PRODUCTS.find(p => p.id === pId);
    return sum + (prod ? prod.price * qty : 0);
  }, 0);
}

function handleConfirmBooking() {
  const service = SERVICES.find(s => s.id === state.selectedServiceId);
  const sizeOpt = PET_SIZES.find(s => s.id === state.selectedSize);
  const businessName = getCustomBusinessName();

  if (!service) {
    alert('Por favor elegí un servicio para continuar.');
    return;
  }

  if (!state.selectedTime) {
    alert('Por favor elegí un horario.');
    return;
  }

  const finalPrice = calculateFinalPrice(service.basePrice, state.selectedSize, state.needsMattedHairCare);
  const petNameStr = state.petName.trim() || 'Mi Mascota';
  const ownerNameStr = state.ownerName.trim() || 'Tutor';
  const nudosText = state.needsMattedHairCare ? '⚠️ SÍ (tiene nudos compactados)' : '❌ NO';

  const message = 
`🐾 *¡Hola ${businessName}! Quiero reservar un turno para mi mascota:*

🐶 *Mascota:* ${petNameStr}${state.petBreed.trim() ? ` (${state.petBreed.trim()})` : ''}
📏 *Tamaño:* ${sizeOpt?.name} (${sizeOpt?.weight})
✨ *Servicio:* ${service.name}
💰 *Valor Estimado:* ${formatPrice(finalPrice)}
📅 *Fecha:* ${state.selectedDate}
⏰ *Horario:* ${state.selectedTime} hs
🧶 *¿Tiene nudos difíciles?:* ${nudosText}
👤 *Tutor:* ${ownerNameStr}${state.ownerPhone ? `\n📱 *Teléfono:* ${state.ownerPhone}` : ''}${state.behaviorNotes.trim() ? `\n💬 *Notas:* ${state.behaviorNotes.trim()}` : ''}

_Enviado desde el sistema de turnos online de ${businessName}_`;

  const waUrl = `https://wa.me/${PETSHOP_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

function handleSendCartOrder() {
  const items = Object.entries(state.cart);
  if (items.length === 0) {
    alert('Tu carrito está vacío.');
    return;
  }

  const businessName = getCustomBusinessName();
  const subtotal = getCartSubtotal();
  const deliveryCost = state.deliveryMethod === 'delivery' ? (subtotal >= 35000 ? 0 : 2500) : 0;
  const total = subtotal + deliveryCost;

  let lines = `🛒 *¡Hola ${businessName}! Quiero hacer el siguiente pedido de la tienda:*\n\n`;
  items.forEach(([pId, qty]) => {
    const p = CATALOG_PRODUCTS.find(prod => prod.id === pId);
    if (p) {
      lines += `▪️ *${qty}x* ${p.name} (${p.weight}) - ${formatPrice(p.price * qty)}\n`;
    }
  });

  lines += `\n💵 *Subtotal:* ${formatPrice(subtotal)}`;
  if (state.deliveryMethod === 'delivery') {
    lines += `\n🛵 *Envío:* ${deliveryCost === 0 ? '¡GRATIS!' : formatPrice(deliveryCost)}`;
    if (state.deliveryAddress.trim()) {
      lines += `\n📍 *Dirección de Entrega:* ${state.deliveryAddress.trim()}`;
    }
  } else {
    lines += `\n🏪 *Entrega:* Retiro en el local`;
  }

  lines += `\n💰 *TOTAL FINAL:* ${formatPrice(total)}\n\n_¿Tienen stock para despachar? ¡Muchas gracias!_`;

  window.open(`https://wa.me/${PETSHOP_WHATSAPP}?text=${encodeURIComponent(lines)}`, '_blank');
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const businessName = getCustomBusinessName();
  const isCustom = isCustomDemo();
  const upcomingDays = getUpcomingDays();
  const selectedService = SERVICES.find(s => s.id === state.selectedServiceId);
  const selectedSizeOpt = PET_SIZES.find(s => s.id === state.selectedSize);

  // Filtrado de productos para la tienda
  const filteredProducts = CATALOG_PRODUCTS.filter(p => {
    const matchesCat = state.selectedStoreCategory === 'todos' || p.category === state.selectedStoreCategory;
    const q = state.searchQuery.toLowerCase().trim();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.weight.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const cartCount = getCartItemCount();
  const cartSubtotal = getCartSubtotal();
  const deliveryCost = state.deliveryMethod === 'delivery' ? (cartSubtotal >= 35000 ? 0 : 2500) : 0;

  app.innerHTML = `
    <!-- Barra Superior / Navbar -->
    <nav class="sticky top-0 z-40 bg-white/95 dark:bg-[#0E0F14]/95 backdrop-blur-md border-b border-amber-100 dark:border-neutral-800/80 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo / Marca -->
        <a href="#" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center text-xl shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
            🐾
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-white leading-tight">
                ${businessName}
              </span>
              ${isCustom ? `
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  Demo
                </span>
              ` : ''}
            </div>
            <span class="text-[11px] text-neutral-400 block -mt-0.5 font-medium">Pet Shop, Turnos & E-commerce</span>
          </div>
        </a>

        <!-- Acciones Header -->
        <div class="flex items-center gap-2 sm:gap-3">
          <a
            href="#peluqueria"
            class="hidden md:inline-block text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Turnos Peluquería
          </a>
          <a
            href="#tienda"
            class="hidden md:inline-block text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-orange-600 dark:hover:text-orange-400 px-3 py-1.5 rounded-full hover:bg-orange-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Tienda Online 🥩
          </a>

          <!-- Botón Carrito con Badge -->
          <button
            id="toggle-cart-btn"
            class="relative px-3 sm:px-4 py-2 rounded-full bg-orange-50 dark:bg-neutral-800 hover:bg-orange-100 dark:hover:bg-neutral-700 text-orange-600 dark:text-orange-400 font-bold text-xs flex items-center gap-2 transition-all active:scale-95 border border-orange-200 dark:border-neutral-700"
          >
            <span>🛒</span>
            <span class="hidden sm:inline">Carrito</span>
            ${cartCount > 0 ? `
              <span class="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-[10px] font-black">
                ${cartCount}
              </span>
            ` : ''}
          </button>

          <!-- Toggle Dark Mode -->
          <button
            id="theme-toggle-btn"
            class="w-9 h-9 rounded-full bg-amber-50 dark:bg-neutral-800 hover:bg-amber-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>

          <!-- Botón WhatsApp Consulta -->
          <a
            href="https://wa.me/${PETSHOP_WHATSAPP}?text=${encodeURIComponent(`Hola ${businessName}! Quería hacer una consulta.`)}"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white text-xs font-bold shadow-md shadow-orange-500/25 transition-all active:scale-95"
          >
            <span>💬</span>
            <span class="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>

    ${isCustom ? `
      <!-- Alerta flotante informativa para el dueño del local -->
      <div class="bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <span>🐾</span>
        <span>Boceto interactivo de demostración preparado para <strong>${businessName}</strong>.</span>
      </div>
    ` : ''}

    <!-- Hero Section -->
    <header class="relative py-12 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6 overflow-hidden">
      <!-- Glow decorativo de fondo -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80 shadow-sm">
        <span>🐶</span>
        <span>Peluquería canina con turnos online + E-commerce de alimentos</span>
      </div>

      <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.15]">
        Todo para tu mascota, <br class="hidden sm:inline" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-amber-500 to-orange-400">
          a un clic de distancia.
        </span>
      </h1>

      <p class="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
        Agendá el baño o corte de tu perro por tamaño, o pedí alimentos balanceados y farmacia con delivery a tu casa.
      </p>

      <!-- Botones de Acción Hero -->
      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#peluqueria"
          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md shadow-orange-500/25 active:scale-95"
        >
          Pedir Turno de Peluquería 🛁
        </a>
        <a
          href="#tienda"
          class="px-6 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md active:scale-95"
        >
          Explorar Tienda Online 🛒
        </a>
      </div>

      <!-- Trust Badges -->
      <div class="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
        <div class="flex items-center gap-1.5">
          <span class="text-orange-500 font-bold text-base">✓</span>
          <span>Trato respetuoso y sin estrés</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-orange-500 font-bold text-base">✓</span>
          <span>Envíos sin cargo desde $35.000</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-orange-500 font-bold text-base">✓</span>
          <span>Pedidos directos a WhatsApp</span>
        </div>
      </div>
    </header>

    <!-- SECCIÓN: SELECTOR DE TAMAÑO & PELUQUERÍA CANINA (HOME ORIGINAL) -->
    <section id="peluqueria" class="max-w-5xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      
      <!-- Paso 1: Tamaño de la mascota -->
      <div class="bg-white dark:bg-[#14151C] p-6 sm:p-8 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm mb-10 space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <span class="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Paso 1</span>
            <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              ¿De qué tamaño es tu mascota?
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              El tamaño determina los tiempos de secado y los valores del servicio.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          ${PET_SIZES.map(opt => {
            const isSelected = state.selectedSize === opt.id;
            return `
              <button
                class="pet-size-btn p-4 rounded-2xl border text-left transition-all relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-orange-50/80 dark:bg-orange-950/40 border-orange-500 ring-2 ring-orange-500/20 shadow-md scale-102'
                    : 'border-neutral-200/80 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-900/40'
                }"
                data-size="${opt.id}"
              >
                <div>
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-3xl">${opt.icon}</span>
                    ${isSelected ? `
                      <span class="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center text-xs font-bold">✓</span>
                    ` : ''}
                  </div>
                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white">
                    ${opt.name}
                  </h3>
                  <span class="text-[11px] font-semibold text-orange-600 dark:text-orange-400 block mt-0.5">
                    ${opt.weight}
                  </span>
                </div>
                <p class="text-[10px] text-neutral-400 mt-2 leading-tight">
                  ${opt.examples}
                </p>
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Paso 2: Selección de Servicio -->
      <div class="mb-8">
        <span class="text-xs font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400">Paso 2</span>
        <h2 class="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Elegí el Servicio para tu ${selectedSizeOpt?.name}
        </h2>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
          Los precios se ajustan automáticamente según el tamaño seleccionado.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${SERVICES.map(s => {
          const isSelected = state.selectedServiceId === s.id;
          const currentPrice = calculateFinalPrice(s.basePrice, state.selectedSize, false);

          return `
            <div
              class="service-card cursor-pointer rounded-3xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-orange-50/70 dark:bg-orange-950/30 border-orange-400 dark:border-orange-500/80 shadow-md ring-2 ring-orange-400/30'
                  : 'bg-white dark:bg-[#14151C] border-amber-100/80 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700 shadow-sm'
              }"
              data-id="${s.id}"
            >
              <div>
                <div class="flex items-start justify-between gap-3 mb-2">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl sm:text-3xl">${s.icon}</span>
                    <div>
                      <h3 class="font-bold text-sm sm:text-base text-neutral-900 dark:text-white leading-tight">
                        ${s.name}
                      </h3>
                      <span class="text-[11px] text-neutral-400 font-medium">⏱️ ${s.duration}</span>
                    </div>
                  </div>
                  ${s.badge ? `
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                      ${s.badge}
                    </span>
                  ` : ''}
                </div>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                  ${s.description}
                </p>
              </div>

              <div class="mt-4 pt-3 border-t border-amber-100/60 dark:border-neutral-800/80 flex items-center justify-between">
                <div>
                  <span class="font-black text-base sm:text-lg text-orange-600 dark:text-orange-400">
                    ${formatPrice(currentPrice)}
                  </span>
                  <span class="text-[10px] text-neutral-400 block -mt-1 font-medium">Para ${selectedSizeOpt?.name}</span>
                </div>
                <button
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-orange-500 text-white shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-orange-100 dark:hover:bg-neutral-700'
                  }"
                >
                  ${isSelected ? '✓ Seleccionado' : 'Seleccionar'}
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    </section>

    <!-- SECCIÓN INTERACTIVA DE FECHA, DATOS Y CONFIRMACIÓN -->
    <section id="reservar" class="max-w-5xl mx-auto px-4 sm:px-6 py-8 scroll-mt-20">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- COLUMNA IZQUIERDA: CONFIGURADOR DEL TURNO -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- Fecha -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-amber-100/80 dark:border-neutral-800 shadow-sm space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              3. Elegí el Día
            </label>
            <div class="grid grid-cols-5 gap-2">
              ${upcomingDays.map(d => {
                const isSelected = state.selectedDate === d.dateStr;
                return `
                  <button
                    class="date-btn py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-md shadow-orange-500/25 scale-105'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
                    }"
                    data-date="${d.dateStr}"
                  >
                    <span class="text-[10px] font-medium uppercase tracking-wider opacity-80">${d.dayName}</span>
                    <span class="text-base sm:text-lg font-black my-0.5">${d.dayNum}</span>
                    <span class="text-[10px] opacity-75">${d.month}</span>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Horarios disponibles -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-amber-100/80 dark:border-neutral-800 shadow-sm space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              4. Horarios Disponibles
            </label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              ${TIME_SLOTS.map(t => {
                const isSelected = state.selectedTime === t;
                return `
                  <button
                    class="time-btn py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm scale-105'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-orange-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                    }"
                    data-time="${t}"
                  >
                    ${t} hs
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- Datos de la Mascota y Tutor -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-amber-100/80 dark:border-neutral-800 shadow-sm space-y-4">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              5. Datos de la Mascota y Tutor
            </label>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Nombre de la Mascota *</label>
                <input
                  type="text"
                  id="pet-name"
                  placeholder="Ej: Milo, Luna, Rocco"
                  value="${state.petName}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Raza o Mezcla</label>
                <input
                  type="text"
                  id="pet-breed"
                  placeholder="Ej: Caniche, Mestizo, Golden"
                  value="${state.petBreed}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Tu Nombre (Tutor) *</label>
                <input
                  type="text"
                  id="owner-name"
                  placeholder="Ej: Lucas González"
                  value="${state.ownerName}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Teléfono de contacto</label>
                <input
                  type="tel"
                  id="owner-phone"
                  placeholder="Ej: 11 5566-7788"
                  value="${state.ownerPhone}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <!-- Checkbox nudos compactados -->
            <div class="p-3.5 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 flex items-start gap-3">
              <input
                type="checkbox"
                id="matted-checkbox"
                ${state.needsMattedHairCare ? 'checked' : ''}
                class="mt-0.5 w-4 h-4 rounded text-orange-600 focus:ring-orange-500 border-amber-300"
              />
              <label for="matted-checkbox" class="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span class="font-bold text-neutral-900 dark:text-white block">¿Tiene nudos difíciles o pelo apelmazado?</span>
                <span class="text-[11px] text-neutral-500 dark:text-neutral-400">Marcá esta casilla para que el peluquero reserve tiempo adicional de desanudado suave con bálsamo nutritivo (+$3.000).</span>
              </label>
            </div>

            <div>
              <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Comportamiento o aclaraciones</label>
              <input
                type="text"
                id="behavior-notes"
                placeholder="Ej: Tiene miedo a la secadora, piel alérgica, es viejito"
                value="${state.behaviorNotes}"
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: RESUMEN Y BOTÓN CONFIRMAR -->
        <div class="lg:col-span-5 sticky top-24">
          <div class="bg-white dark:bg-[#14151C] p-6 rounded-3xl border border-orange-200/80 dark:border-orange-900/50 shadow-xl space-y-5">
            <div class="flex items-center justify-between border-b border-amber-100 dark:border-neutral-800 pb-4">
              <h3 class="font-bold text-base text-neutral-900 dark:text-white flex items-center gap-2">
                <span>📋</span>
                <span>Resumen del Turno</span>
              </h3>
              <span class="text-xs font-bold text-orange-600 dark:text-orange-400">
                Paso Final
              </span>
            </div>

            ${selectedService ? `
              <div class="space-y-3.5 text-xs">
                <div class="flex items-start justify-between gap-2">
                  <span class="text-neutral-500 dark:text-neutral-400">Servicio:</span>
                  <div class="text-right">
                    <span class="font-bold text-neutral-900 dark:text-white block">${selectedService.name}</span>
                    <span class="text-[10px] text-neutral-400">⏱️ ${selectedService.duration}</span>
                  </div>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-neutral-500 dark:text-neutral-400">Tamaño Mascota:</span>
                  <span class="font-bold text-neutral-900 dark:text-white">
                    ${selectedSizeOpt?.name} (${selectedSizeOpt?.weight})
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-neutral-500 dark:text-neutral-400">Fecha:</span>
                  <span class="font-bold text-neutral-900 dark:text-white">
                    ${state.selectedDate}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-neutral-500 dark:text-neutral-400">Horario:</span>
                  <span class="font-bold text-orange-600 dark:text-orange-400 text-sm">
                    ${state.selectedTime ? `${state.selectedTime} hs` : 'Sin seleccionar'}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-neutral-500 dark:text-neutral-400">Tratamiento de nudos:</span>
                  <span class="font-semibold text-neutral-800 dark:text-neutral-200">
                    ${state.needsMattedHairCare ? 'Sí (+$3.000)' : 'No'}
                  </span>
                </div>

                <div class="pt-4 border-t border-amber-100 dark:border-neutral-800 flex items-center justify-between text-base">
                  <span class="font-bold text-neutral-900 dark:text-white">Total Estimado:</span>
                  <span class="font-black text-xl text-orange-600 dark:text-orange-400">
                    ${formatPrice(calculateFinalPrice(selectedService.basePrice, state.selectedSize, state.needsMattedHairCare))}
                  </span>
                </div>
              </div>
            ` : `
              <div class="py-6 text-center text-xs text-neutral-400">
                Elegí un servicio para armar el turno.
              </div>
            `}

            <div class="pt-2">
              <button
                id="btn-confirm-booking"
                class="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                <span>💬</span>
                <span>Confirmar Turno por WhatsApp</span>
              </button>
              <p class="text-[10px] text-center text-neutral-400 mt-2">
                Envía los datos de tu mascota directamente al local sin descargar aplicaciones.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- SECCIÓN: TIENDA ONLINE / E-COMMERCE PET SHOP COMPLETO -->
    <section id="tienda" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 border-t border-amber-100 dark:border-neutral-800">
      
      <!-- Encabezado de la tienda -->
      <div class="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/80">
          🛍️ E-commerce Pet Shop con Carrito
        </span>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Tienda Online & Delivery
        </h2>
        <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Sumá al carrito alimentos balanceados, antiparasitarios y accesorios, y enviá tu pedido armado a WhatsApp.
        </p>
      </div>

      <!-- Barra de herramientas: Buscador y Categorías -->
      <div class="bg-white dark:bg-[#14151C] p-4 sm:p-5 rounded-3xl border border-amber-100 dark:border-neutral-800 shadow-sm mb-8 space-y-4">
        
        <!-- Buscador -->
        <div class="relative">
          <span class="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-neutral-400 text-base">
            🔍
          </span>
          <input
            type="text"
            id="store-search-input"
            placeholder="Buscar por marca (Royal Canin, Pro Plan), producto o peso..."
            value="${state.searchQuery}"
            class="w-full pl-11 pr-4 py-3 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/60 dark:bg-neutral-900/60 text-neutral-900 dark:text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
          />
          ${state.searchQuery ? `
            <button
              id="clear-search-btn"
              class="absolute inset-y-0 right-0 pr-4 flex items-center text-xs text-neutral-400 hover:text-neutral-600"
            >
              ✕ Limpiar
            </button>
          ` : ''}
        </div>

        <!-- Categorías de la Tienda -->
        <div class="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-semibold scrollbar-none">
          ${[
            { id: 'todos', label: 'Todos' },
            { id: 'perros', label: '🐶 Perros' },
            { id: 'gatos', label: '🐱 Gatos' },
            { id: 'farmacia', label: '💊 Farmacia' },
            { id: 'snacks', label: '🦴 Snacks & Juguetes' },
            { id: 'accesorios', label: '🦮 Accesorios' }
          ].map(cat => {
            const isSelected = state.selectedStoreCategory === cat.id;
            return `
              <button
                class="store-cat-btn px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-orange-100 dark:hover:bg-neutral-700'
                }"
                data-cat="${cat.id}"
              >
                ${cat.label}
              </button>
            `;
          }).join('')}
        </div>
      </div>

      <!-- Grilla de Productos del Catálogo E-commerce -->
      ${filteredProducts.length > 0 ? `
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          ${filteredProducts.map(p => {
            const inCartQty = state.cart[p.id] || 0;

            return `
              <div class="bg-white dark:bg-[#14151C] rounded-3xl p-5 border border-amber-100/80 dark:border-neutral-800 shadow-sm flex flex-col justify-between group hover:shadow-lg hover:border-orange-200 dark:hover:border-neutral-700 transition-all">
                <div>
                  <div class="flex items-center justify-between mb-3">
                    <span class="text-3xl p-2.5 rounded-2xl bg-amber-50 dark:bg-neutral-800/80 group-hover:scale-110 transition-transform">
                      ${p.icon}
                    </span>
                    ${p.badge ? `
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300">
                        ${p.badge}
                      </span>
                    ` : `
                      <span class="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        ${p.brand}
                      </span>
                    `}
                  </div>

                  <span class="text-[10px] font-bold uppercase tracking-wider text-orange-600 dark:text-orange-400 block mb-0.5">
                    ${p.categoryLabel}
                  </span>

                  <h3 class="font-bold text-sm text-neutral-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors leading-snug">
                    ${p.name}
                  </h3>

                  <p class="text-xs text-neutral-400 mt-1 font-medium">
                    ${p.weight}
                  </p>
                </div>

                <div class="mt-5 pt-3 border-t border-amber-100/60 dark:border-neutral-800/80">
                  <div class="flex items-center justify-between mb-3">
                    <div>
                      <span class="text-[10px] text-neutral-400 block font-medium">Precio</span>
                      <span class="font-black text-lg text-neutral-900 dark:text-white">
                        ${formatPrice(p.price)}
                      </span>
                    </div>
                  </div>

                  ${inCartQty === 0 ? `
                    <button
                      class="btn-add-to-cart w-full py-2.5 px-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all"
                      data-id="${p.id}"
                    >
                      <span>🛒</span>
                      <span>Agregar al Carrito</span>
                    </button>
                  ` : `
                    <div class="flex items-center justify-between bg-orange-50 dark:bg-neutral-800 rounded-xl p-1 border border-orange-200 dark:border-neutral-700">
                      <button
                        class="btn-cart-minus w-8 h-8 rounded-lg bg-white dark:bg-neutral-900 text-orange-600 dark:text-orange-400 font-black text-sm flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                        data-id="${p.id}"
                      >
                        -
                      </button>
                      <span class="text-xs font-black text-orange-950 dark:text-orange-200">
                        ${inCartQty} en carrito
                      </span>
                      <button
                        class="btn-cart-plus w-8 h-8 rounded-lg bg-orange-500 text-white font-black text-sm flex items-center justify-center shadow-xs active:scale-90 transition-transform"
                        data-id="${p.id}"
                      >
                        +
                      </button>
                    </div>
                  `}
                </div>
              </div>
            `;
          }).join('')}
        </div>
      ` : `
        <div class="text-center py-16 bg-white dark:bg-[#14151C] rounded-3xl border border-dashed border-neutral-300 dark:border-neutral-800 space-y-2">
          <span class="text-3xl block">🔍</span>
          <h4 class="font-bold text-sm text-neutral-700 dark:text-neutral-300">No encontramos productos con ese nombre</h4>
          <p class="text-xs text-neutral-400">Probá con otra palabra o seleccioná otra categoría.</p>
        </div>
      `}
    </section>

    <!-- DRAWER / MODAL DEL CARRITO DE COMPRAS -->
    ${state.isCartOpen ? `
      <div id="cart-backdrop" class="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
        <div class="w-full max-w-md bg-white dark:bg-[#12131A] h-full shadow-2xl flex flex-col justify-between overflow-hidden animate-in slide-in-from-right duration-200">
          
          <!-- Header Carrito -->
          <div class="p-5 border-b border-amber-100 dark:border-neutral-800 flex items-center justify-between bg-amber-50/50 dark:bg-neutral-900/50">
            <div class="flex items-center gap-2.5">
              <span class="text-2xl">🛒</span>
              <div>
                <h3 class="font-extrabold text-base text-neutral-900 dark:text-white leading-tight">
                  Tu Carrito de Compras
                </h3>
                <span class="text-[11px] text-neutral-400">
                  ${cartCount} producto${cartCount === 1 ? '' : 's'} seleccionado${cartCount === 1 ? '' : 's'}
                </span>
              </div>
            </div>

            <button
              id="close-cart-btn"
              class="w-8 h-8 rounded-full bg-neutral-200/60 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white flex items-center justify-center text-sm font-bold"
            >
              ✕
            </button>
          </div>

          <!-- Items Carrito -->
          <div class="p-5 flex-grow overflow-y-auto space-y-3 divide-y divide-neutral-100 dark:divide-neutral-800/60">
            ${cartCount > 0 ? Object.entries(state.cart).map(([pId, qty]) => {
              const prod = CATALOG_PRODUCTS.find(p => p.id === pId);
              if (!prod) return '';

              return `
                <div class="pt-3 first:pt-0 flex items-center justify-between gap-3">
                  <div class="flex items-center gap-3">
                    <span class="text-2xl p-2 rounded-xl bg-amber-50 dark:bg-neutral-800">${prod.icon}</span>
                    <div>
                      <h4 class="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white leading-tight">
                        ${prod.name}
                      </h4>
                      <span class="text-[10px] text-neutral-400 font-medium">${prod.weight}</span>
                      <span class="text-xs font-black text-orange-600 dark:text-orange-400 block mt-0.5">
                        ${formatPrice(prod.price * qty)}
                      </span>
                    </div>
                  </div>

                  <!-- Controles de cantidad -->
                  <div class="flex items-center gap-1.5 bg-neutral-100 dark:bg-neutral-800 p-1 rounded-xl">
                    <button
                      class="btn-cart-minus w-6 h-6 rounded-lg bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 font-bold text-xs flex items-center justify-center"
                      data-id="${prod.id}"
                    >
                      -
                    </button>
                    <span class="text-xs font-black px-1.5 text-neutral-900 dark:text-white">
                      ${qty}
                    </span>
                    <button
                      class="btn-cart-plus w-6 h-6 rounded-lg bg-orange-500 text-white font-bold text-xs flex items-center justify-center"
                      data-id="${prod.id}"
                    >
                      +
                    </button>
                  </div>
                </div>
              `;
            }).join('') : `
              <div class="py-16 text-center text-neutral-400 space-y-2">
                <span class="text-4xl block">🧺</span>
                <p class="text-sm font-semibold">Tu carrito está vacío</p>
                <p class="text-xs">Elegí productos de la tienda para sumarlos acá.</p>
              </div>
            `}
          </div>

          <!-- Checkout & Envío -->
          ${cartCount > 0 ? `
            <div class="p-5 border-t border-amber-100 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 space-y-4">
              
              <!-- Tipo de Entrega -->
              <div>
                <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-2">
                  Método de Entrega
                </label>
                <div class="grid grid-cols-2 gap-2 text-xs font-bold">
                  <button
                    class="delivery-method-btn py-2.5 px-3 rounded-xl border text-center transition-all ${
                      state.deliveryMethod === 'delivery'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }"
                    data-method="delivery"
                  >
                    🛵 Envío a Domicilio
                  </button>
                  <button
                    class="delivery-method-btn py-2.5 px-3 rounded-xl border text-center transition-all ${
                      state.deliveryMethod === 'retiro'
                        ? 'bg-orange-500 text-white border-orange-500 shadow-sm'
                        : 'border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300'
                    }"
                    data-method="retiro"
                  >
                    🏪 Retiro en Local
                  </button>
                </div>
              </div>

              ${state.deliveryMethod === 'delivery' ? `
                <div>
                  <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">
                    Dirección de entrega y timbre
                  </label>
                  <input
                    type="text"
                    id="cart-address-input"
                    placeholder="Ej: Av. Santa Fe 3420, 4B (Palermo)"
                    value="${state.deliveryAddress}"
                    class="w-full px-3 py-2 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  <span class="text-[10px] text-neutral-400 block mt-1">
                    ${cartSubtotal >= 35000 ? '🎉 ¡Genial! Tu compra califica para Envío Sin Cargo.' : '🛵 Envío estándar: $2.500 (Gratis superando $35.000)'}
                  </span>
                </div>
              ` : ''}

              <!-- Totales -->
              <div class="space-y-1.5 text-xs pt-2 border-t border-neutral-200 dark:border-neutral-800">
                <div class="flex justify-between text-neutral-500 dark:text-neutral-400">
                  <span>Subtotal:</span>
                  <span class="font-bold text-neutral-900 dark:text-white">${formatPrice(cartSubtotal)}</span>
                </div>
                ${state.deliveryMethod === 'delivery' ? `
                  <div class="flex justify-between text-neutral-500 dark:text-neutral-400">
                    <span>Costo de Envío:</span>
                    <span class="font-bold ${deliveryCost === 0 ? 'text-emerald-500' : 'text-neutral-900 dark:text-white'}">
                      ${deliveryCost === 0 ? 'GRATIS' : formatPrice(deliveryCost)}
                    </span>
                  </div>
                ` : ''}
                <div class="flex justify-between text-base font-extrabold text-neutral-900 dark:text-white pt-2 border-t border-neutral-200 dark:border-neutral-800">
                  <span>Total:</span>
                  <span class="text-orange-600 dark:text-orange-400 text-lg">
                    ${formatPrice(cartSubtotal + deliveryCost)}
                  </span>
                </div>
              </div>

              <!-- Botón Enviar WhatsApp -->
              <button
                id="btn-send-cart-order"
                class="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 active:scale-95 transition-all"
              >
                <span>💬</span>
                <span>Enviar Pedido por WhatsApp</span>
              </button>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    <!-- BARRA FLOTANTE DE CARRITO (SI TIENE ITEMS Y NO ESTÁ ABIERTO EL MODAL) -->
    ${cartCount > 0 && !state.isCartOpen ? `
      <div class="fixed bottom-6 right-6 z-40 animate-bounce-short">
        <button
          id="floating-cart-btn"
          class="px-5 py-3 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/30 flex items-center gap-3 active:scale-95 transition-transform"
        >
          <span>🛒</span>
          <span>Ver Carrito (${cartCount})</span>
          <span class="px-2 py-0.5 rounded-lg bg-black/20 text-xs">
            ${formatPrice(cartSubtotal)}
          </span>
        </button>
      </div>
    ` : ''}

    <!-- FOOTER / BANNER DEL PROVEEDOR (ADRIÁN SCHUSTER) -->
    <footer class="bg-white dark:bg-[#0A0B0E] border-t border-amber-100 dark:border-neutral-800 py-12 px-4 sm:px-6 mt-16 text-center transition-colors">
      <div class="max-w-xl mx-auto space-y-4">
        <div class="w-10 h-10 mx-auto rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-sm shadow-sm">
          ⚡
        </div>
        <h3 class="text-base font-bold text-neutral-900 dark:text-white">
          ¿Tenés un Pet Shop, Veterinaria o Peluquería Canina?
        </h3>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Este sistema reúne lo mejor de dos mundos: <strong>turnos de baño por tamaño de perro y tienda online con carrito a WhatsApp</strong>. 0% comisiones y 100% autogestionable.
        </p>

        <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
          <a
            href="${HUB_URL}"
            target="_blank"
            class="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-800 dark:text-neutral-200 text-xs font-semibold transition-all"
          >
            Ver más Soluciones Digitales
          </a>
          <a
            href="https://wa.me/${PETSHOP_WHATSAPP}?text=${encodeURIComponent(`Hola Adrián! Vi la demo completa para Pet Shops (${businessName}) y quiero consultar para mi local.`)}"
            target="_blank"
            class="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md transition-all"
          >
            💬 Consultar por WhatsApp
          </a>
        </div>

        <div class="pt-6 text-[11px] text-neutral-400">
          © 2026 Soluciones Digitales • Desarrollado por Adrián Schuster
        </div>
      </div>
    </footer>
  `;

  // Attach event listeners
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }

  // Selector de tamaño
  document.querySelectorAll('.pet-size-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedSize = (target.dataset.size as PetSize) || 'pequeno';
      render();
    });
  });

  // Selector de servicio
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedServiceId = target.dataset.id || 's1';
      render();
    });
  });

  // Selector de fecha
  document.querySelectorAll('.date-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedDate = target.dataset.date || '';
      render();
    });
  });

  // Selector de hora
  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedTime = target.dataset.time || null;
      render();
    });
  });

  // Inputs
  const petNameInput = document.getElementById('pet-name') as HTMLInputElement;
  if (petNameInput) {
    petNameInput.addEventListener('input', (e) => {
      state.petName = (e.target as HTMLInputElement).value;
    });
  }

  const petBreedInput = document.getElementById('pet-breed') as HTMLInputElement;
  if (petBreedInput) {
    petBreedInput.addEventListener('input', (e) => {
      state.petBreed = (e.target as HTMLInputElement).value;
    });
  }

  const ownerNameInput = document.getElementById('owner-name') as HTMLInputElement;
  if (ownerNameInput) {
    ownerNameInput.addEventListener('input', (e) => {
      state.ownerName = (e.target as HTMLInputElement).value;
    });
  }

  const ownerPhoneInput = document.getElementById('owner-phone') as HTMLInputElement;
  if (ownerPhoneInput) {
    ownerPhoneInput.addEventListener('input', (e) => {
      state.ownerPhone = (e.target as HTMLInputElement).value;
    });
  }

  const mattedCheckbox = document.getElementById('matted-checkbox') as HTMLInputElement;
  if (mattedCheckbox) {
    mattedCheckbox.addEventListener('change', (e) => {
      state.needsMattedHairCare = (e.target as HTMLInputElement).checked;
      render();
    });
  }

  const notesInput = document.getElementById('behavior-notes') as HTMLInputElement;
  if (notesInput) {
    notesInput.addEventListener('input', (e) => {
      state.behaviorNotes = (e.target as HTMLInputElement).value;
    });
  }

  // Botón Confirmar Turno
  const confirmBtn = document.getElementById('btn-confirm-booking');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleConfirmBooking);
  }

  // ---- TIENDA E-COMMERCE LISTENERS ----
  // Buscador
  const searchInput = document.getElementById('store-search-input') as HTMLInputElement;
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      state.searchQuery = (e.target as HTMLInputElement).value;
      render();
    });
  }

  const clearSearchBtn = document.getElementById('clear-search-btn');
  if (clearSearchBtn) {
    clearSearchBtn.addEventListener('click', () => {
      state.searchQuery = '';
      render();
    });
  }

  // Categorías de la Tienda
  document.querySelectorAll('.store-cat-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedStoreCategory = (target.dataset.cat as ProductCategory) || 'todos';
      render();
    });
  });

  // Agregar al Carrito
  document.querySelectorAll('.btn-add-to-cart').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const pId = target.dataset.id;
      if (pId) addToCart(pId);
    });
  });

  // Cantidad + / -
  document.querySelectorAll('.btn-cart-plus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const pId = target.dataset.id;
      if (pId) updateCartQty(pId, 1);
    });
  });

  document.querySelectorAll('.btn-cart-minus').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const pId = target.dataset.id;
      if (pId) updateCartQty(pId, -1);
    });
  });

  // Abrir / Cerrar Carrito
  const toggleCartBtn = document.getElementById('toggle-cart-btn');
  if (toggleCartBtn) {
    toggleCartBtn.addEventListener('click', () => {
      state.isCartOpen = !state.isCartOpen;
      render();
    });
  }

  const floatingCartBtn = document.getElementById('floating-cart-btn');
  if (floatingCartBtn) {
    floatingCartBtn.addEventListener('click', () => {
      state.isCartOpen = true;
      render();
    });
  }

  const closeCartBtn = document.getElementById('close-cart-btn');
  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
      state.isCartOpen = false;
      render();
    });
  }

  const cartBackdrop = document.getElementById('cart-backdrop');
  if (cartBackdrop) {
    cartBackdrop.addEventListener('click', (e) => {
      if (e.target === cartBackdrop) {
        state.isCartOpen = false;
        render();
      }
    });
  }

  // Método de entrega en Carrito
  document.querySelectorAll('.delivery-method-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.deliveryMethod = (target.dataset.method as 'delivery' | 'retiro') || 'delivery';
      render();
    });
  });

  const addressInput = document.getElementById('cart-address-input') as HTMLInputElement;
  if (addressInput) {
    addressInput.addEventListener('input', (e) => {
      state.deliveryAddress = (e.target as HTMLInputElement).value;
    });
  }

  const sendCartBtn = document.getElementById('btn-send-cart-order');
  if (sendCartBtn) {
    sendCartBtn.addEventListener('click', handleSendCartOrder);
  }
}

document.addEventListener('DOMContentLoaded', init);
init();
