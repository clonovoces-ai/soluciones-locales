// Demo Landing Page Gastronómica - Fuego & Harina
let isDarkMode = true;
let activeCategory = 'all';

// Detección dinámica de host (en producción conecta con sd.adrianschuster.com.ar, en local usa localhost:3000)
const getHubUrl = () => {
  if ((import.meta as any).env?.VITE_HUB_URL) {
    return (import.meta as any).env.VITE_HUB_URL;
  }
  if (typeof window !== 'undefined') {
    const host = window.location.hostname;
    if (host.includes('adrianschuster.com.ar')) {
      return 'https://sd.adrianschuster.com.ar/';
    }
    if (host !== 'localhost' && host !== '127.0.0.1' && !host.startsWith('192.168.')) {
      return 'https://sd.adrianschuster.com.ar/';
    }
    return `http://${host}:3000/`;
  }
  return 'https://sd.adrianschuster.com.ar/';
};
const HUB_URL = getHubUrl();
const RESTAURANT_WHATSAPP = (import.meta as any).env?.VITE_WHATSAPP_NUM || '5491100000000'; // WhatsApp del local

interface MenuItem {
  id: string;
  name: string;
  category: 'fuegos' | 'pizzas' | 'entradas' | 'postres' | 'bebidas';
  description: string;
  price: number;
  image: string;
  tag?: 'chef' | 'veggie' | 'sintacc';
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: '1',
    name: 'Ojo de Bife con Hueso (Tomahawk Cut)',
    category: 'fuegos',
    description: '700g madurado 21 días al quebracho blanco, acompañado con papas rústicas al romero y manteca de chimichurri.',
    price: 18500,
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?auto=format&fit=crop&w=800&q=80',
    tag: 'chef'
  },
  {
    id: '2',
    name: 'Vacío del Centro al Asador',
    category: 'fuegos',
    description: 'Cocción lenta de 4 horas a la estaca, crujiente por fuera y tierno al corte. Con salsa criolla ahumada.',
    price: 15900,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80',
    tag: 'sintacc'
  },
  {
    id: '3',
    name: 'Pizza Margherita Di Bufala',
    category: 'pizzas',
    description: 'Masa fermentada 48hs al horno de leña napolitano, salsa San Marzano, mozzarella fior di latte y albahaca fresca.',
    price: 11200,
    image: 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?auto=format&fit=crop&w=800&q=80',
    tag: 'veggie'
  },
  {
    id: '4',
    name: 'Pizza Focaccia con Burrata & Jamón Crudo',
    category: 'pizzas',
    description: 'Base crujiente de masa madre, burrata cremosa entera de 250g, jamón serrano estacionado y reducción de aceto.',
    price: 14400,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80',
    tag: 'chef'
  },
  {
    id: '5',
    name: 'Provoleta al Hierro Fundido con Pimientos',
    category: 'entradas',
    description: 'Queso provolone hilado dorado a las brasas, morrones asados al rescoldo, orégano silvestre y pan de campo.',
    price: 8900,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80',
    tag: 'veggie'
  },
  {
    id: '6',
    name: 'Empanadas de Lomo Cortadas a Cuchillo (x2)',
    category: 'entradas',
    description: 'Masa casera horneada a leña con relleno jugoso de lomo, cebolla de verdeo y comino norteño.',
    price: 5200,
    image: 'https://images.unsplash.com/photo-1628294895950-9805252327bc?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '7',
    name: 'Volcán de Dulce de Leche Colonial',
    category: 'postres',
    description: 'Corazón tibio fundido acompañado con helado artesanal de crema americana y crocante de nueces.',
    price: 6800,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=800&q=80',
    tag: 'chef'
  },
  {
    id: '8',
    name: 'Flan Casero de 8 Huevos con Crema & DDL',
    category: 'postres',
    description: 'El clásico indiscutido de bodegón, con caramelo oscuro intenso y dulce de leche de campo.',
    price: 5900,
    image: 'https://images.unsplash.com/photo-1528975604071-b4dc52a2d18c?auto=format&fit=crop&w=800&q=80',
    tag: 'sintacc'
  },
  {
    id: '9',
    name: 'Malbec Gran Reserva Seleccionado',
    category: 'bebidas',
    description: 'Valle de Uco, Mendoza. 14 meses en barricas de roble francés. Notas a frutos rojos y cacao.',
    price: 13500,
    image: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: '10',
    name: 'Cocktail Ahumado de la Casa (Negroni Añejado)',
    category: 'bebidas',
    description: 'Gin macerado con hierbas locales, Vermouth rosso artesanal y Campari con chip de quebracho encendido.',
    price: 6400,
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80',
    tag: 'chef'
  }
];

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function init() {
  const savedTheme = localStorage.getItem('landing_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : true;
  document.documentElement.classList.toggle('dark', isDarkMode);
  render();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('landing_theme', isDarkMode ? 'dark' : 'light');
  render();
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const filteredItems = activeCategory === 'all' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  app.innerHTML = `
    <!-- Barra superior de Demo hacia la Web Padre -->
    <aside class="bg-neutral-950 text-white text-xs py-2 px-4 border-b border-neutral-800">
      <div class="max-w-6xl mx-auto flex items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span class="text-neutral-400">Estás viendo una <strong>Demo en Vivo</strong> de Landing Page Gastronómica</span>
        </div>
        <a 
          href="${HUB_URL}" 
          class="font-semibold text-amber-400 hover:text-amber-300 underline underline-offset-2 flex items-center gap-1 text-[11px] sm:text-xs"
        >
          <span>← Volver al Portal de Soluciones</span>
        </a>
      </div>
    </aside>

    <!-- Navbar Principal -->
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-[#0C0D11]/95 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800/80 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-18 py-3 flex items-center justify-between gap-4">
        <!-- Logo & Identidad -->
        <a href="#" class="flex items-center gap-3 group">
          <div class="w-10 h-10 rounded-2xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center text-xl shadow-sm group-hover:scale-105 transition-transform">
            🔥
          </div>
          <div>
            <span class="text-lg sm:text-xl font-black tracking-tight text-neutral-900 dark:text-white block leading-tight">
              Fuego & Harina
            </span>
            <span class="text-[10px] sm:text-[11px] text-neutral-500 dark:text-neutral-400 font-bold tracking-wider uppercase block">
              Bodegón & Horno a Leña
            </span>
          </div>
        </a>

        <!-- Enlaces Desktop -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-600 dark:text-neutral-300">
          <a href="#carta" class="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Nuestra Carta</a>
          <a href="#experiencia" class="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">La Experiencia</a>
          <a href="#ubicacion" class="hover:text-amber-600 dark:hover:text-amber-400 transition-colors">Horarios & Ubicación</a>
        </nav>

        <!-- Acciones -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Switch Dark Mode -->
          <button
            id="landing-theme-toggle"
            class="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>

          <!-- Botón de Reserva Directa WhatsApp -->
          <a
            href="#reserva"
            class="px-4 py-2 rounded-full bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all active:scale-95 flex items-center gap-1.5"
          >
            <span>📅</span>
            <span>Reservar Mesa</span>
          </a>
        </div>
      </div>
    </header>

    <main class="space-y-16 sm:space-y-24">
      <!-- HERO SECTION -->
      <section class="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <!-- Columna Texto -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-700 dark:text-amber-300 text-xs font-semibold">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Abierto hoy • Mediodía 12:00 a 16:00 | Noche 19:30 a 01:00</span>
            </div>

            <h1 class="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-neutral-900 dark:text-white leading-[1.12]">
              Cocina de fuegos, masa madre y momentos compartidos.
            </h1>

            <p class="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Un homenaje a los grandes bodegones porteños con materias primas de estación, carnes maduradas al quebracho blanco y pizzas artesanales con 48 hs de fermentación lenta.
            </p>

            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#carta"
                class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs text-center shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>📖</span>
                <span>Explorar la Carta Digital</span>
              </a>

              <a
                href="#reserva"
                class="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs text-center shadow-lg shadow-amber-500/20 transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>🍷</span>
                <span>Reservar Mesa Online</span>
              </a>
            </div>

            <!-- Badges de Confianza Local -->
            <div class="pt-4 grid grid-cols-3 gap-3 border-t border-neutral-100 dark:border-neutral-800">
              <div class="text-center lg:text-left">
                <span class="block text-xl sm:text-2xl font-black text-amber-500 font-mono">4.9 ★</span>
                <span class="text-[11px] text-neutral-500 dark:text-neutral-400">+450 opiniones Google</span>
              </div>
              <div class="text-center lg:text-left">
                <span class="block text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-mono">100%</span>
                <span class="text-[11px] text-neutral-500 dark:text-neutral-400">Horno a leña propio</span>
              </div>
              <div class="text-center lg:text-left">
                <span class="block text-xl sm:text-2xl font-black text-neutral-900 dark:text-white font-mono">0 Intermediarios</span>
                <span class="text-[11px] text-neutral-500 dark:text-neutral-400">Atención directa</span>
              </div>
            </div>
          </div>

          <!-- Columna Imagen Hero -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1000&q=80"
                alt="Parrilla y fuegos Fuego & Harina"
                class="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span class="text-xs uppercase tracking-wider text-amber-400 font-bold">Plato Insignia</span>
                <p class="text-lg font-bold">Vacío del Centro al Asador al Quebracho</p>
                <p class="text-xs text-neutral-300 mt-1">4 horas de cocción lenta y salsa criolla ahumada</p>
              </div>
            </div>

            <!-- Floating mini badge -->
            <div class="absolute -bottom-4 -left-4 sm:bottom-6 sm:-left-6 bg-white dark:bg-neutral-900 p-3.5 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-xl">
                🥖
              </div>
              <div>
                <span class="text-xs font-bold text-neutral-900 dark:text-white block leading-tight">Masa Madre 48hs</span>
                <span class="text-[10px] text-neutral-400">Harinas orgánicas molidas a piedra</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN: CARTA DIGITAL INTERACTIVA -->
      <section id="carta" class="max-w-6xl mx-auto px-4 sm:px-6 py-8 scroll-mt-24">
        <div class="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span class="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
            Nuestros Sabores
          </span>
          <h2 class="text-3xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            La Carta Digital
          </h2>
          <p class="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400">
            Precios actualizados en tiempo real. Consultá o pedí directo a la cocina por WhatsApp sin recargos.
          </p>

          <!-- Filtro de Categorías -->
          <div class="pt-4 flex flex-wrap items-center justify-center gap-2">
            <button 
              data-cat="all" 
              class="cat-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === 'all' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
            >
              Todos los Platos
            </button>
            <button 
              data-cat="fuegos" 
              class="cat-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === 'fuegos' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
            >
              🥩 Fuegos & Carnes
            </button>
            <button 
              data-cat="pizzas" 
              class="cat-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === 'pizzas' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
            >
              🍕 Pizzas al Horno
            </button>
            <button 
              data-cat="entradas" 
              class="cat-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === 'entradas' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
            >
              🧀 Entradas & Tapas
            </button>
            <button 
              data-cat="postres" 
              class="cat-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === 'postres' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
            >
              🍨 Postres
            </button>
            <button 
              data-cat="bebidas" 
              class="cat-filter-btn px-4 py-2 rounded-full text-xs font-bold transition-all ${activeCategory === 'bebidas' ? 'bg-amber-500 text-neutral-950 shadow-md' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}"
            >
              🍷 Vinos & Cocktails
            </button>
          </div>
        </div>

        <!-- Grid de Platos -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          ${filteredItems.map(item => `
            <article class="bg-white dark:bg-[#13151D] rounded-3xl border border-neutral-200/80 dark:border-neutral-800/80 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
              <div>
                <div class="relative h-48 overflow-hidden">
                  <img
                    src="${item.image}"
                    alt="${item.name}"
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  ${item.tag === 'chef' ? `
                    <span class="absolute top-3 left-3 bg-amber-500 text-neutral-950 text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                      ⭐ Especialidad Chef
                    </span>
                  ` : ''}
                  ${item.tag === 'veggie' ? `
                    <span class="absolute top-3 left-3 bg-emerald-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                      🌱 Vegetariano
                    </span>
                  ` : ''}
                  ${item.tag === 'sintacc' ? `
                    <span class="absolute top-3 left-3 bg-blue-500 text-white text-[10px] font-black uppercase px-2.5 py-1 rounded-full shadow">
                      🌾 Apto Celíacos
                    </span>
                  ` : ''}
                  <span class="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white font-mono font-bold text-sm px-3 py-1 rounded-xl shadow">
                    ${formatCurrency(item.price)}
                  </span>
                </div>

                <div class="p-5 space-y-2">
                  <h3 class="font-bold text-base text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors">
                    ${item.name}
                  </h3>
                  <p class="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-3 leading-relaxed">
                    ${item.description}
                  </p>
                </div>
              </div>

              <div class="p-5 pt-0 border-t border-neutral-100 dark:border-neutral-800/60 mt-3 flex items-center justify-between gap-3">
                <span class="text-[11px] text-neutral-400">Porción generosa</span>
                <a
                  href="https://wa.me/${RESTAURANT_WHATSAPP}?text=${encodeURIComponent(`Hola! Quisiera consultar o pedir el plato "${item.name}" en Fuego & Harina.`)}"
                  target="_blank"
                  class="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-500 flex items-center gap-1 active:scale-95 transition-transform"
                >
                  <span>Pedir / Consultar</span>
                  <span>→</span>
                </a>
              </div>
            </article>
          `).join('')}
        </div>
      </section>

      <!-- SECCIÓN: RESERVA DE MESA ONLINE (INTERACTIVA) -->
      <section id="reserva" class="max-w-4xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24">
        <div class="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-neutral-800 relative overflow-hidden space-y-8">
          <div class="max-w-xl space-y-2">
            <span class="text-xs font-extrabold uppercase tracking-widest text-amber-400">
              Viví la Experiencia
            </span>
            <h2 class="text-2xl sm:text-3xl font-black tracking-tight">
              Reservá tu Mesa al Instante
            </h2>
            <p class="text-xs sm:text-sm text-neutral-400">
              Elegí las opciones y confirmá tu reserva directo por WhatsApp en un solo toque, sin intermediarios ni registros molestos.
            </p>
          </div>

          <!-- Formulario Interactivo -->
          <form id="reservation-form" class="space-y-6">
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <!-- Comensales -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-neutral-300 block">¿Cuántas personas?</label>
                <select id="res-guests" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="2 personas">2 personas (Mesa para dos)</option>
                  <option value="3 o 4 personas" selected>3 - 4 personas (Grupo pequeño)</option>
                  <option value="5 o 6 personas">5 - 6 personas (Mesa familiar)</option>
                  <option value="7 a 10 personas">7 - 10 personas (Grupo grande)</option>
                  <option value="Más de 10 personas">Más de 10 (Evento especial)</option>
                </select>
              </div>

              <!-- Día -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-neutral-300 block">Fecha</label>
                <select id="res-date" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="Hoy" selected>Hoy</option>
                  <option value="Mañana">Mañana</option>
                  <option value="Este Viernes">Este Viernes</option>
                  <option value="Este Sábado">Este Sábado</option>
                  <option value="Este Domingo">Este Domingo</option>
                  <option value="Próxima semana">Otra fecha a coordinar</option>
                </select>
              </div>

              <!-- Turno -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-neutral-300 block">Horario preferido</label>
                <select id="res-time" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="Almuerzo 13:00">Almuerzo 13:00 hs</option>
                  <option value="Almuerzo 14:30">Almuerzo 14:30 hs</option>
                  <option value="Cena 20:30 (Primer turno)" selected>Cena 20:30 hs (1er turno)</option>
                  <option value="Cena 22:30 (Segundo turno)">Cena 22:30 hs (2do turno)</option>
                </select>
              </div>

              <!-- Sector -->
              <div class="space-y-1.5">
                <label class="text-xs font-semibold text-neutral-300 block">Sector preferido</label>
                <select id="res-sector" class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500">
                  <option value="Salón Principal al frente del horno de leña">Salón Principal (Vista al horno)</option>
                  <option value="Terraza al aire libre / Patio arbolado">Patio Arbolado (Al aire libre)</option>
                  <option value="Sector Barra de Tragos">Sector Barra</option>
                  <option value="Indistinto">Cualquier sector disponible</option>
                </select>
              </div>

              <!-- Nombre del titular -->
              <div class="space-y-1.5 sm:col-span-2">
                <label class="text-xs font-semibold text-neutral-300 block">Tu Nombre y Apellido</label>
                <input
                  type="text"
                  id="res-name"
                  placeholder="Ej: Marcelo Gómez"
                  class="w-full bg-neutral-800 border border-neutral-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <!-- Botón CTA Reserva -->
            <button
              type="submit"
              class="w-full py-3.5 px-6 rounded-2xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>💬</span>
              <span>Enviar Solicitud de Reserva por WhatsApp</span>
            </button>
            <p class="text-[11px] text-center text-neutral-400">
              Te confirmamos la mesa de inmediato por mensaje de WhatsApp.
            </p>
          </form>
        </div>
      </section>

      <!-- SECCIÓN: EXPERIENCIA & FILOSOFÍA -->
      <section id="experiencia" class="max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13151D] border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
              🪵
            </div>
            <h3 class="font-bold text-lg text-neutral-900 dark:text-white">Leña de Quebracho</h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Fuegos vivos encendidos cada mañana. El aroma inconfundible del quebracho y el espinillo impregnan cada corte de carne.
            </p>
          </div>

          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13151D] border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
              🌾
            </div>
            <h3 class="font-bold text-lg text-neutral-900 dark:text-white">Masa Madre Viva</h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Pizzas livianas, digestivas y alveoladas. Harinas orgánicas molidas a piedra y 48 horas de descanso en frío.
            </p>
          </div>

          <div class="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#13151D] border border-neutral-200/80 dark:border-neutral-800/80 space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center text-2xl">
              🍷
            </div>
            <h3 class="font-bold text-lg text-neutral-900 dark:text-white">Cava Federal</h3>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
              Selección exclusiva de pequeños productores de Mendoza, Salta y Río Negro con precios justos de mostrador.
            </p>
          </div>
        </div>
      </section>

      <!-- SECCIÓN: HORARIOS & UBICACIÓN -->
      <section id="ubicacion" class="max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24">
        <div class="bg-neutral-100 dark:bg-[#13151D] rounded-3xl p-6 sm:p-10 border border-neutral-200 dark:border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div class="space-y-6">
            <div>
              <span class="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">¿Dónde encontrarnos?</span>
              <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white mt-1">
                Ubicación & Horarios
              </h2>
            </div>

            <div class="space-y-4 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
              <div class="flex items-start gap-3">
                <span class="text-lg">📍</span>
                <div>
                  <strong class="text-neutral-900 dark:text-white block">Dirección</strong>
                  <span>Av. Cerviño 3410 (Esquina Scalabrini Ortiz), Palermo Soho, CABA</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-lg">🕒</span>
                <div>
                  <strong class="text-neutral-900 dark:text-white block">Horarios de Cocina</strong>
                  <p>Martes a Domingo: 12:00 a 16:00 hs (Almuerzos)</p>
                  <p>Martes a Domingo: 19:30 a 01:00 hs (Cenas y Coctelería)</p>
                  <p class="text-neutral-400 mt-1">Lunes cerrado por descanso de personal.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-lg">🐾</span>
                <div>
                  <strong class="text-neutral-900 dark:text-white block">Pet Friendly & Estacionamiento</strong>
                  <span>Mesas en vereda y patio aptas para mascotas. Convenio con garaje a 50 metros.</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Av.+Cerviño+3410+Palermo"
              target="_blank"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold transition-all active:scale-95 shadow-sm"
            >
              <span>🗺️</span>
              <span>Abrir en Google Maps</span>
            </a>
          </div>

          <!-- Mapa Real Interactivo de Google Maps -->
          <div class="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-neutral-300 dark:border-neutral-700 relative shadow-md bg-neutral-200 dark:bg-neutral-800">
            <iframe
              src="https://maps.google.com/maps?q=Av.+Cervi%C3%B1o+3410,+Palermo,+Buenos+Aires&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación Google Maps Fuego & Harina"
              class="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>

      <!-- TESTIMONIOS REALES GOOGLE -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        <div class="text-center mb-8">
          <span class="text-xs font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">Reseñas de Clientes</span>
          <h2 class="text-2xl sm:text-3xl font-black tracking-tight text-neutral-900 dark:text-white mt-1">Lo que dicen de nosotros</h2>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white dark:bg-[#13151D] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs text-neutral-600 dark:text-neutral-300 italic">
              "El vacío al asador y la focaccia con burrata son de otro planeta. Reservamos por WhatsApp y nos tenían la mesa lista en la terraza. Atención 10/10."
            </p>
            <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
              — Camila R., Guía Local Google
            </div>
          </div>

          <div class="bg-white dark:bg-[#13151D] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs text-neutral-600 dark:text-neutral-300 italic">
              "Hermoso bodegón moderno. Muy cómodo poder ver toda la carta y los precios antes de ir. La pizza margherita con masa madre es insuperable."
            </p>
            <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
              — Federico M., Vecino de Palermo
            </div>
          </div>

          <div class="bg-white dark:bg-[#13151D] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 space-y-3">
            <div class="flex text-amber-400 text-sm">★★★★★</div>
            <p class="text-xs text-neutral-600 dark:text-neutral-300 italic">
              "El volcán de dulce de leche cerró una cena perfecta. Excelente la carta digital, rápida y sin vueltas. Volveremos siempre."
            </p>
            <div class="pt-2 border-t border-neutral-100 dark:border-neutral-800 text-[11px] font-bold text-neutral-800 dark:text-neutral-200">
              — Lucía & Martín
            </div>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER COMERCIAL & CIERRE -->
    <footer class="bg-white dark:bg-[#08090C] border-t border-neutral-200 dark:border-neutral-800 mt-20 pt-12 pb-8 px-4 sm:px-6 transition-colors">
      <div class="max-w-6xl mx-auto space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-neutral-600 dark:text-neutral-400">
          <div class="space-y-2">
            <span class="text-base font-black tracking-tight text-neutral-900 dark:text-white block">Fuego & Harina</span>
            <p class="text-neutral-500">Bodegón y Horno a Leña tradicional con propuesta gastronómica contemporánea.</p>
          </div>
          <div>
            <strong class="text-neutral-900 dark:text-white block mb-2">Horarios</strong>
            <p>Almuerzos: 12:00 a 16:00 hs</p>
            <p>Cenas: 19:30 a 01:00 hs</p>
            <p>Mar a Dom</p>
          </div>
          <div>
            <strong class="text-neutral-900 dark:text-white block mb-2">Contacto</strong>
            <p>Av. Cerviño 3410, Palermo</p>
            <p>WhatsApp: +54 9 11 0000-0000</p>
            <p>Instagram: @fuegoyharina</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-neutral-800 dark:text-neutral-200 space-y-2">
            <span class="font-bold block text-amber-700 dark:text-amber-400">¿Querés una web así?</span>
            <p class="text-[11px]">Ideal para restaurantes, cafeterías, bodegones y locales con reserva o menú.</p>
            <a
              href="${HUB_URL}"
              class="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 underline"
            >
              Consultar contratación →
            </a>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-400">
          <p>© 2026 Fuego & Harina • Demo Interactiva de Landing Page.</p>
          <a href="${HUB_URL}" class="hover:text-neutral-200 underline">
            Volver al Portal Soluciones Digitales
          </a>
        </div>
      </div>
    </footer>
  `;

  // Event Listeners
  const themeToggle = document.getElementById('landing-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Filtros de categoría de carta
  const catButtons = document.querySelectorAll('.cat-filter-btn');
  catButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = (e.currentTarget as HTMLElement).getAttribute('data-cat');
      if (target) {
        activeCategory = target;
        render();
        // Mantener scroll en carta
        const cartaSection = document.getElementById('carta');
        if (cartaSection) {
          cartaSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Manejo de formulario de reservas
  const resForm = document.getElementById('reservation-form');
  if (resForm) {
    resForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const guests = (document.getElementById('res-guests') as HTMLSelectElement)?.value || '4 personas';
      const date = (document.getElementById('res-date') as HTMLSelectElement)?.value || 'Hoy';
      const time = (document.getElementById('res-time') as HTMLSelectElement)?.value || '20:30 hs';
      const sector = (document.getElementById('res-sector') as HTMLSelectElement)?.value || 'Salón';
      const name = (document.getElementById('res-name') as HTMLInputElement)?.value.trim() || 'Cliente';

      const message = `Hola Fuego & Harina! Quisiera solicitar una reserva de mesa:%0A%0A👤 *Nombre:* ${encodeURIComponent(name)}%0A👥 *Comensales:* ${encodeURIComponent(guests)}%0A📅 *Fecha:* ${encodeURIComponent(date)}%0A🕒 *Horario:* ${encodeURIComponent(time)}%0A📍 *Sector preferido:* ${encodeURIComponent(sector)}%0A%0A¿Tienen disponibilidad? Muchas gracias!`;

      window.open(`https://wa.me/${RESTAURANT_WHATSAPP}?text=${message}`, '_blank');
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
init();
