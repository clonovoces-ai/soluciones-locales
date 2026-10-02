// Demo Sistema de Turnos Online para Uñas, Manicuría & Estética
let isDarkMode = false; // Modo claro predeterminado

// Detección dinámica de host (funciona en Vercel, localhost y celulares en red)
const getHost = () => (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
const isCustomDomain = () => typeof window !== 'undefined' && window.location.hostname.includes('adrianschuster.com.ar');

const HUB_URL = (import.meta as any).env?.VITE_HUB_URL || (isCustomDomain() ? 'https://sd.adrianschuster.com.ar/' : `http://${getHost()}:3000/`);
const BEAUTY_WHATSAPP = (import.meta as any).env?.VITE_WHATSAPP_NUM || '5491123351610'; // WhatsApp de Adrián / Estudio

const getCustomBusinessName = () => {
  if (typeof window === 'undefined') return 'Glow & Co. Nails Studio';
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('demo') || params.get('local') || params.get('comercio') || params.get('nombre');
  if (nameParam && nameParam.trim()) {
    return nameParam.trim();
  }
  return 'Glow & Co. Nails Studio';
};

const isCustomDemo = () => {
  if (typeof window === 'undefined') return false;
  const params = new URLSearchParams(window.location.search);
  return !!(params.get('demo') || params.get('local') || params.get('comercio') || params.get('nombre'));
};

interface Service {
  id: string;
  name: string;
  duration: string;
  price: number;
  description: string;
  badge?: string;
  icon: string;
  category: 'unas' | 'pies' | 'mirada';
}

interface Specialist {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Kapping Gel + Esmaltado Semipermanente',
    duration: '1h 30m',
    price: 13500,
    description: 'Baño de gel reforzador sobre tu uña natural para evitar quiebres + esmaltado semi con brillo extremo.',
    icon: '💎',
    badge: 'Más Pedido',
    category: 'unas'
  },
  {
    id: 's2',
    name: 'Esmaltado Semipermanente Clásico',
    duration: '1h 00m',
    price: 9500,
    description: 'Manicuría combinada rusa, limpieza profunda de cutículas, limado y color semi con duración de 21 días.',
    icon: '💅',
    badge: 'Básico',
    category: 'unas'
  },
  {
    id: 's3',
    name: 'Uñas Esculpidas (Polygel / Acrílico)',
    duration: '2h 00m',
    price: 18000,
    description: 'Extensión anatómica con molde, forma almendrada, cuadrada o ballerina, con color liso a elección.',
    icon: '✨',
    badge: 'Largo Soñado',
    category: 'unas'
  },
  {
    id: 's4',
    name: 'Nail Art a Mano Alzada (Add-on)',
    duration: '30 min',
    price: 3500,
    description: 'Francesitas modernas, baby boomer, degradé, efecto mármol, flores o aplicaciones de strass en hasta 4 uñas.',
    icon: '🎨',
    category: 'unas'
  },
  {
    id: 's5',
    name: 'Spa de Pies & Belleza Completa',
    duration: '1h 15m',
    price: 12000,
    description: 'Exfoliación con sales, torno ruso, remoción de asperezas, masaje hidratante y esmaltado semipermanente.',
    icon: '🦶',
    category: 'pies'
  },
  {
    id: 's6',
    name: 'Combo Lifting de Pestañas + Laminado de Cejas',
    duration: '1h 15m',
    price: 15000,
    description: 'Curvado natural con nutrición de keratina, tinte negro intenso en pestañas y peinado fijador en cejas.',
    icon: '👁️',
    badge: 'Mirada Top',
    category: 'mirada'
  },
  {
    id: 's7',
    name: 'Retiro Seguro de Gel / Acrílico',
    duration: '30 min',
    price: 4000,
    description: 'Remoción cuidada sin debilitar la uña natural, finalizando con baño de calcio e hidratación de cutículas.',
    icon: '🌸',
    category: 'unas'
  }
];

const SPECIALISTS: Specialist[] = [
  {
    id: 'any',
    name: 'Cualquiera disponible',
    role: 'Primer turno libre',
    avatar: '✨'
  },
  {
    id: 'sp1',
    name: 'Sofi M.',
    role: 'Especialista en Kapping & Semi',
    avatar: '💅'
  },
  {
    id: 'sp2',
    name: 'Valen R.',
    role: 'Master en Esculpidas & Nail Art',
    avatar: '💎'
  },
  {
    id: 'sp3',
    name: 'Camila T.',
    role: 'Lifting de Pestañas & Spa de Pies',
    avatar: '🌸'
  }
];

const TIME_SLOTS = [
  '09:30', '11:00', '12:30', '14:30', '16:00', '17:30', '19:00'
];

function getUpcomingDays() {
  const days = [];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  const today = new Date();
  for (let i = 0; i < 7; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    // Si es domingo, saltar si no abren
    if (d.getDay() === 0) continue;

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

// Estado de la aplicación
interface BookingState {
  selectedServiceId: string | null;
  selectedSpecialistId: string;
  selectedDate: string;
  selectedTime: string | null;
  clientName: string;
  clientPhone: string;
  needsRemoval: boolean;
  notes: string;
  filterCategory: 'todas' | 'unas' | 'pies' | 'mirada';
}

const state: BookingState = {
  selectedServiceId: 's1', // Seleccionado por defecto para facilitar la experiencia
  selectedSpecialistId: 'any',
  selectedDate: getUpcomingDays()[0]?.dateStr || '',
  selectedTime: '16:00',
  clientName: '',
  clientPhone: '',
  needsRemoval: false,
  notes: '',
  filterCategory: 'todas'
};

function init() {
  const savedTheme = localStorage.getItem('glow_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : false; // Por defecto modo claro
  document.documentElement.classList.toggle('dark', isDarkMode);
  render();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('glow_theme', isDarkMode ? 'dark' : 'light');
  render();
}

function formatPrice(n: number) {
  return '$' + n.toLocaleString('es-AR');
}

function handleConfirmBooking() {
  const service = SERVICES.find(s => s.id === state.selectedServiceId);
  const specialist = SPECIALISTS.find(sp => sp.id === state.selectedSpecialistId);
  const businessName = getCustomBusinessName();

  if (!service) {
    alert('Por favor elegí un servicio para continuar.');
    return;
  }

  if (!state.selectedTime) {
    alert('Por favor elegí un horario.');
    return;
  }

  const clientNameStr = state.clientName.trim() || 'Clienta';
  const removalText = state.needsRemoval ? '✅ SÍ (esmaltado previo para retirar)' : '❌ NO';

  const message = 
`🌸 *¡Hola ${businessName}! Quiero reservar un turno:*

💅 *Servicio:* ${service.name}
⏱️ *Duración:* ${service.duration}
💰 *Valor:* ${formatPrice(service.price)}
👩‍🦰 *Especialista:* ${specialist?.name}
📅 *Fecha:* ${state.selectedDate}
⏰ *Horario:* ${state.selectedTime} hs
🔄 *¿Necesita retiro previo?:* ${removalText}
👤 *Nombre:* ${clientNameStr}${state.clientPhone ? `\n📱 *Teléfono:* ${state.clientPhone}` : ''}${state.notes.trim() ? `\n💬 *Notas:* ${state.notes.trim()}` : ''}

_Enviado desde el sistema de turnos online de ${businessName}_`;

  const waUrl = `https://wa.me/${BEAUTY_WHATSAPP}?text=${encodeURIComponent(message)}`;
  window.open(waUrl, '_blank');
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const businessName = getCustomBusinessName();
  const isCustom = isCustomDemo();
  const upcomingDays = getUpcomingDays();
  const selectedService = SERVICES.find(s => s.id === state.selectedServiceId);

  const filteredServices = state.filterCategory === 'todas' 
    ? SERVICES 
    : SERVICES.filter(s => s.category === state.filterCategory);

  app.innerHTML = `
    <!-- Barra Superior / Navbar -->
    <nav class="sticky top-0 z-40 bg-white/95 dark:bg-[#0E0F14]/95 backdrop-blur-md border-b border-rose-100 dark:border-neutral-800/80 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo / Marca -->
        <a href="#" class="flex items-center gap-2.5 group">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-tr from-rose-500 to-pink-400 text-white flex items-center justify-center text-xl shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            💅
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="font-extrabold text-base sm:text-lg tracking-tight text-neutral-900 dark:text-white leading-tight">
                ${businessName}
              </span>
              ${isCustom ? `
                <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                  Demo
                </span>
              ` : ''}
            </div>
            <span class="text-[11px] text-neutral-400 block -mt-0.5 font-medium">Nails & Beauty Studio • Turnos Online</span>
          </div>
        </a>

        <!-- Acciones Header -->
        <div class="flex items-center gap-2 sm:gap-3">
          <a
            href="#servicios"
            class="hidden sm:inline-block text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-1.5 rounded-full hover:bg-rose-50 dark:hover:bg-neutral-800 transition-colors"
          >
            Servicios & Precios
          </a>

          <!-- Toggle Dark Mode -->
          <button
            id="theme-toggle-btn"
            class="w-9 h-9 rounded-full bg-rose-50 dark:bg-neutral-800 hover:bg-rose-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>

          <!-- Botón WhatsApp Consulta -->
          <a
            href="https://wa.me/${BEAUTY_WHATSAPP}?text=${encodeURIComponent(`Hola ${businessName}! Quería hacer una consulta sobre los turnos.`)}"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white text-xs font-bold shadow-md shadow-rose-500/25 transition-all active:scale-95"
          >
            <span>💬</span>
            <span class="hidden sm:inline">WhatsApp</span>
          </a>
        </div>
      </div>
    </nav>

    ${isCustom ? `
      <!-- Alerta flotante informativa para el dueño del local -->
      <div class="bg-rose-500 text-white text-xs py-2 px-4 text-center font-medium shadow-inner flex items-center justify-center gap-2">
        <span>✨</span>
        <span>Boceto de demostración preparado especialmente para <strong>${businessName}</strong>.</span>
      </div>
    ` : ''}

    <!-- Hero Section -->
    <header class="relative py-12 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6 overflow-hidden">
      <!-- Glow decorativo de fondo -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-rose-400/15 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800/80 shadow-sm">
        <span>✨</span>
        <span>Reservá tu turno en 30 segundos sin esperas</span>
      </div>

      <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-neutral-900 dark:text-white tracking-tight leading-[1.15]">
        Tus manos impecables, <br class="hidden sm:inline" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400">
          tu turno al instante.
        </span>
      </h1>

      <p class="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto leading-relaxed">
        Elegí tu servicio favorito, seleccioná a tu especialista de confianza y agendá tu horario directo desde tu celular.
      </p>

      <!-- Botones de Acción Hero -->
      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#servicios"
          class="px-6 py-3 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-md active:scale-95"
        >
          Ver Lista de Precios ↓
        </a>
        <a
          href="#reservar"
          class="px-6 py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-xs sm:text-sm hover:opacity-95 transition-all shadow-md shadow-rose-500/25 active:scale-95"
        >
          Agendar Turno Ahora ✨
        </a>
      </div>

      <!-- Trust Badges -->
      <div class="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 font-medium">
        <div class="flex items-center gap-1.5">
          <span class="text-rose-500 font-bold text-base">✓</span>
          <span>Esmaltes y geles premium</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-rose-500 font-bold text-base">✓</span>
          <span>Esterilización 100% quirúrgica</span>
        </div>
        <div class="flex items-center gap-1.5">
          <span class="text-rose-500 font-bold text-base">✓</span>
          <span>Confirmación a tu WhatsApp</span>
        </div>
      </div>
    </header>

    <!-- SECCIÓN: SERVICIOS Y LISTA DE PRECIOS -->
    <section id="servicios" class="max-w-5xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
        <div>
          <h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
            Nuestros Servicios & Precios
          </h2>
          <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            Hacé clic en cualquier servicio para seleccionarlo en tu reserva.
          </p>
        </div>

        <!-- Filtros por categoría -->
        <div class="flex items-center gap-1.5 bg-rose-50 dark:bg-neutral-800/80 p-1 rounded-2xl border border-rose-100 dark:border-neutral-700/60 text-xs font-semibold">
          <button
            class="category-filter-btn px-3 py-1.5 rounded-xl transition-all ${state.filterCategory === 'todas' ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}"
            data-category="todas"
          >
            Todos
          </button>
          <button
            class="category-filter-btn px-3 py-1.5 rounded-xl transition-all ${state.filterCategory === 'unas' ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}"
            data-category="unas"
          >
            💅 Uñas
          </button>
          <button
            class="category-filter-btn px-3 py-1.5 rounded-xl transition-all ${state.filterCategory === 'pies' ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}"
            data-category="pies"
          >
            🦶 Pies
          </button>
          <button
            class="category-filter-btn px-3 py-1.5 rounded-xl transition-all ${state.filterCategory === 'mirada' ? 'bg-white dark:bg-neutral-900 text-rose-600 dark:text-rose-400 shadow-sm' : 'text-neutral-600 dark:text-neutral-400'}"
            data-category="mirada"
          >
            👁️ Pestañas
          </button>
        </div>
      </div>

      <!-- Grilla de Servicios -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        ${filteredServices.map(s => {
          const isSelected = state.selectedServiceId === s.id;
          return `
            <div
              class="service-card cursor-pointer rounded-3xl p-5 border transition-all duration-200 relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-rose-50/70 dark:bg-rose-950/30 border-rose-400 dark:border-rose-500/80 shadow-md ring-2 ring-rose-400/30'
                  : 'bg-white dark:bg-[#14151C] border-rose-100/80 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-neutral-700 shadow-sm'
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
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                      ${s.badge}
                    </span>
                  ` : ''}
                </div>
                <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed mt-1">
                  ${s.description}
                </p>
              </div>

              <div class="mt-4 pt-3 border-t border-rose-100/60 dark:border-neutral-800/80 flex items-center justify-between">
                <span class="font-black text-base sm:text-lg text-rose-600 dark:text-rose-400">
                  ${formatPrice(s.price)}
                </span>
                <button
                  class="px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-rose-500 text-white shadow-sm'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-rose-100 dark:hover:bg-neutral-700'
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

    <!-- SECCIÓN INTERACTIVA DE RESERVA -->
    <section id="reservar" class="max-w-5xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      <div class="text-center max-w-xl mx-auto mb-8 space-y-1">
        <span class="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Paso a Paso</span>
        <h2 class="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          Agendá tu Turno
        </h2>
        <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Elegí la profesional, el día y la hora para confirmar por WhatsApp.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- COLUMNA IZQUIERDA: CONFIGURADOR DEL TURNO -->
        <div class="lg:col-span-7 space-y-6">
          
          <!-- 1. Especialista -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-rose-100/80 dark:border-neutral-800 shadow-sm space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              1. Elegí tu Profesional
            </label>
            <div class="grid grid-cols-2 sm:grid-cols-2 gap-2.5">
              ${SPECIALISTS.map(sp => {
                const isSelected = state.selectedSpecialistId === sp.id;
                return `
                  <button
                    class="specialist-btn p-3 rounded-2xl border text-left transition-all flex items-center gap-3 ${
                      isSelected
                        ? 'bg-rose-50 dark:bg-rose-950/40 border-rose-500 text-rose-950 dark:text-rose-200 ring-2 ring-rose-400/20 shadow-sm'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-neutral-700'
                    }"
                    data-id="${sp.id}"
                  >
                    <span class="text-2xl">${sp.avatar}</span>
                    <div class="truncate">
                      <div class="font-bold text-xs sm:text-sm text-neutral-900 dark:text-white truncate">
                        ${sp.name}
                      </div>
                      <div class="text-[10px] text-neutral-400 truncate">
                        ${sp.role}
                      </div>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 2. Fecha -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-rose-100/80 dark:border-neutral-800 shadow-sm space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              2. Elegí el Día
            </label>
            <div class="grid grid-cols-5 gap-2">
              ${upcomingDays.map(d => {
                const isSelected = state.selectedDate === d.dateStr;
                return `
                  <button
                    class="date-btn py-3 px-2 rounded-2xl border text-center transition-all flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-md shadow-rose-500/25 scale-105'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900/50 text-neutral-700 dark:text-neutral-300'
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

          <!-- 3. Horarios disponibles -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-rose-100/80 dark:border-neutral-800 shadow-sm space-y-3">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              3. Horarios Disponibles
            </label>
            <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
              ${TIME_SLOTS.map(t => {
                const isSelected = state.selectedTime === t;
                return `
                  <button
                    class="time-btn py-2.5 px-3 rounded-xl border text-center text-xs font-bold transition-all ${
                      isSelected
                        ? 'bg-rose-500 text-white border-rose-500 shadow-sm scale-105'
                        : 'border-neutral-200/80 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-neutral-700 text-neutral-800 dark:text-neutral-200'
                    }"
                    data-time="${t}"
                  >
                    ${t} hs
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- 4. Datos del Cliente & Checkbox Retiro -->
          <div class="bg-white dark:bg-[#14151C] p-5 sm:p-6 rounded-3xl border border-rose-100/80 dark:border-neutral-800 shadow-sm space-y-4">
            <label class="block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
              4. Tus Datos
            </label>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Tu Nombre y Apellido *</label>
                <input
                  type="text"
                  id="client-name"
                  placeholder="Ej: Florencia Pérez"
                  value="${state.clientName}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div>
                <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Tu Teléfono (opcional)</label>
                <input
                  type="tel"
                  id="client-phone"
                  placeholder="Ej: 11 4455-6677"
                  value="${state.clientPhone}"
                  class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>
            </div>

            <!-- Checkbox Retiro previo (Super importante en manicuría) -->
            <div class="p-3.5 rounded-2xl bg-rose-50/70 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 flex items-start gap-3">
              <input
                type="checkbox"
                id="needs-removal-checkbox"
                ${state.needsRemoval ? 'checked' : ''}
                class="mt-0.5 w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-rose-300"
              />
              <label for="needs-removal-checkbox" class="text-xs text-neutral-700 dark:text-neutral-300 cursor-pointer">
                <span class="font-bold text-neutral-900 dark:text-white block">¿Tenés esmaltado previo de otro lugar para retirar?</span>
                <span class="text-[11px] text-neutral-500 dark:text-neutral-400">Marcá esta opción para que la especialista reserve 20 minutos adicionales de preparación.</span>
              </label>
            </div>

            <div>
              <label class="block text-[11px] text-neutral-500 dark:text-neutral-400 mb-1">Notas o referencias (opcional)</label>
              <input
                type="text"
                id="client-notes"
                placeholder="Ej: Me gustaría diseño con francesitas finas"
                value="${state.notes}"
                class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50/50 dark:bg-neutral-900 text-neutral-900 dark:text-white text-xs focus:outline-none focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>
        </div>

        <!-- COLUMNA DERECHA: RESUMEN Y BOTÓN CONFIRMAR -->
        <div class="lg:col-span-5 sticky top-24">
          <div class="bg-white dark:bg-[#14151C] p-6 rounded-3xl border border-rose-200/80 dark:border-rose-900/50 shadow-xl space-y-5">
            <div class="flex items-center justify-between border-b border-rose-100 dark:border-neutral-800 pb-4">
              <h3 class="font-bold text-base text-neutral-900 dark:text-white">
                Resumen de tu Turno
              </h3>
              <span class="text-xs font-bold text-rose-600 dark:text-rose-400">
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
                  <span class="text-neutral-500 dark:text-neutral-400">Especialista:</span>
                  <span class="font-bold text-neutral-900 dark:text-white">
                    ${SPECIALISTS.find(sp => sp.id === state.selectedSpecialistId)?.name}
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
                  <span class="font-bold text-rose-600 dark:text-rose-400 text-sm">
                    ${state.selectedTime ? `${state.selectedTime} hs` : 'Sin seleccionar'}
                  </span>
                </div>

                <div class="flex items-center justify-between">
                  <span class="text-neutral-500 dark:text-neutral-400">Retiro previo:</span>
                  <span class="font-semibold text-neutral-800 dark:text-neutral-200">
                    ${state.needsRemoval ? 'Sí (+20 min)' : 'No'}
                  </span>
                </div>

                <div class="pt-4 border-t border-rose-100 dark:border-neutral-800 flex items-center justify-between text-base">
                  <span class="font-bold text-neutral-900 dark:text-white">Total a abonar:</span>
                  <span class="font-black text-xl text-rose-600 dark:text-rose-400">
                    ${formatPrice(selectedService.price)}
                  </span>
                </div>
              </div>
            ` : `
              <div class="py-6 text-center text-xs text-neutral-400">
                Elegí un servicio arriba para armar tu turno.
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
                Te abrirá la conversación con todos los datos listos. No requiere descargar apps.
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- FOOTER / BANNER DEL PROVEEDOR (ADRIÁN SCHUSTER) -->
    <footer class="bg-white dark:bg-[#0A0B0E] border-t border-rose-100 dark:border-neutral-800 py-12 px-4 sm:px-6 mt-16 text-center transition-colors">
      <div class="max-w-xl mx-auto space-y-4">
        <div class="w-10 h-10 mx-auto rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-sm shadow-sm">
          ⚡
        </div>
        <h3 class="text-base font-bold text-neutral-900 dark:text-white">
          ¿Tenés un Estudio de Uñas o Estética?
        </h3>
        <p class="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
          Este sistema permite que tus clientas reserven solas desde su celular directo a tu WhatsApp. <strong>Sin comisiones por turno y 100% autogestionable.</strong>
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
            href="https://wa.me/${BEAUTY_WHATSAPP}?text=${encodeURIComponent(`Hola Adrián! Vi la demo de turnos para Uñas y Estética (${businessName}) y quiero consultar para mi negocio.`)}"
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

  // Filtrado de categoría
  document.querySelectorAll('.category-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.filterCategory = (target.dataset.category as any) || 'todas';
      render();
    });
  });

  // Selección de servicio
  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedServiceId = target.dataset.id || null;
      render();
    });
  });

  // Selección de especialista
  document.querySelectorAll('.specialist-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedSpecialistId = target.dataset.id || 'any';
      render();
    });
  });

  // Selección de fecha
  document.querySelectorAll('.date-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedDate = target.dataset.date || '';
      render();
    });
  });

  // Selección de hora
  document.querySelectorAll('.time-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      state.selectedTime = target.dataset.time || null;
      render();
    });
  });

  // Inputs de cliente
  const nameInput = document.getElementById('client-name') as HTMLInputElement;
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      state.clientName = (e.target as HTMLInputElement).value;
    });
  }

  const phoneInput = document.getElementById('client-phone') as HTMLInputElement;
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      state.clientPhone = (e.target as HTMLInputElement).value;
    });
  }

  const removalCheckbox = document.getElementById('needs-removal-checkbox') as HTMLInputElement;
  if (removalCheckbox) {
    removalCheckbox.addEventListener('change', (e) => {
      state.needsRemoval = (e.target as HTMLInputElement).checked;
      render();
    });
  }

  const notesInput = document.getElementById('client-notes') as HTMLInputElement;
  if (notesInput) {
    notesInput.addEventListener('input', (e) => {
      state.notes = (e.target as HTMLInputElement).value;
    });
  }

  // Botón confirmar
  const confirmBtn = document.getElementById('btn-confirm-booking');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleConfirmBooking);
  }
}

document.addEventListener('DOMContentLoaded', init);
init();
