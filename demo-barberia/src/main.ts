// Demo Sistema de Turnos Online para Barberías - La Hermandad Barber Club
let isDarkMode = true;

// Detección dinámica de host (funciona en Vercel, localhost y en la red WiFi del celular)
const getHost = () => (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
const isCustomDomain = () => typeof window !== 'undefined' && window.location.hostname.includes('adrianschuster.com.ar');

const HUB_URL = (import.meta as any).env?.VITE_HUB_URL || (isCustomDomain() ? 'https://sd.adrianschuster.com.ar/' : `http://${getHost()}:3000/`);
const BARBERSHOP_WHATSAPP = (import.meta as any).env?.VITE_WHATSAPP_NUM || '5491123351610'; // WhatsApp del local (+54 9 11 2335-1610)

const getCustomBusinessName = () => {
  if (typeof window === 'undefined') return 'La Hermandad Barber Club';
  const params = new URLSearchParams(window.location.search);
  const nameParam = params.get('demo') || params.get('local') || params.get('comercio') || params.get('nombre');
  if (nameParam && nameParam.trim()) {
    return nameParam.trim();
  }
  return 'La Hermandad Barber Club';
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
}

interface Barber {
  id: string;
  name: string;
  specialty: string;
  avatar: string;
}

const SERVICES: Service[] = [
  {
    id: 's1',
    name: 'Corte Degradé / Fade',
    duration: '35 min',
    price: 9000,
    description: 'Fade bajo, medio o alto con navaja, detalles a trimmer y peinado con cera mate.',
    icon: '✂️',
    badge: 'Popular'
  },
  {
    id: 's2',
    name: 'Perfilado de Barba & Toalla Caliente',
    duration: '25 min',
    price: 6500,
    description: 'Diseño de líneas a navaja, toalla caliente aromatizada, aceite y bálsamo hidratante.',
    icon: '🧔'
  },
  {
    id: 's3',
    name: 'Combo Corte + Barba VIP',
    duration: '55 min',
    price: 14000,
    description: 'La experiencia completa: corte degradé + arreglo de barba con toalla caliente y lavado.',
    icon: '💈',
    badge: 'Más Elegido'
  },
  {
    id: 's4',
    name: 'Corte Clásico a Tijera',
    duration: '30 min',
    price: 8500,
    description: 'Estilo tradicional ejecutivo a pura tijera, prolijidad en nuca y patillas.',
    icon: '📐'
  },
  {
    id: 's5',
    name: 'Afeitado Tradicional de Cabeza / Barba',
    duration: '35 min',
    price: 7500,
    description: 'Afeitado al ras con jabón espumoso artesanal, doble toalla caliente y loción after-shave.',
    icon: '🪒'
  },
  {
    id: 's6',
    name: 'Colorimetría / Platinado Global',
    duration: '90 min',
    price: 24000,
    description: 'Decoloración cuidada con plex protector, matizado ceniza o blanco perla.',
    icon: '🎨'
  }
];

const BARBERS: Barber[] = [
  {
    id: 'any',
    name: 'Cualquiera disponible',
    specialty: 'Atención más rápida',
    avatar: '⚡'
  },
  {
    id: 'b1',
    name: 'Marcos "El Chino"',
    specialty: 'Especialista en Skin Fade & Diseños',
    avatar: '💈'
  },
  {
    id: 'b2',
    name: 'Gonzalo V.',
    specialty: 'Master Barber en Barbas y Navaja',
    avatar: '🧔'
  },
  {
    id: 'b3',
    name: 'Tomás R.',
    specialty: 'Especialista en Tijera y Texturas',
    avatar: '✂️'
  }
];

const DAYS = [
  { id: 'hoy', label: 'Hoy', date: 'Jueves' },
  { id: 'manana', label: 'Mañana', date: 'Viernes' },
  { id: 'sabado', label: 'Sábado', date: 'Fin de semana' },
  { id: 'martes', label: 'Martes', date: 'Próxima semana' }
];

const TIME_SLOTS = [
  '10:00', '10:45', '11:30', '12:15',
  '14:00', '14:45', '15:30', '16:15',
  '17:00', '17:45', '18:30', '19:15', '20:00'
];

// Estado de la reserva
let selectedService: Service = SERVICES[2]; // Combo por defecto
let selectedBarber: Barber = BARBERS[0];
let selectedDay = DAYS[0];
let selectedTime = '17:00';
let customerName = '';
let customerPhone = '';

function formatMoney(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function init() {
  const savedTheme = localStorage.getItem('barber_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : true;
  document.documentElement.classList.toggle('dark', isDarkMode);
  render();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('barber_theme', isDarkMode ? 'dark' : 'light');
  render();
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const businessName = getCustomBusinessName();
  const hasCustomDemo = isCustomDemo();

  app.innerHTML = `
    <!-- Barra Superior / Floating Industrial Capsule Navbar -->
    <header class="sticky top-3 z-40 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <nav class="bg-[#101218]/90 dark:bg-[#101218]/90 backdrop-blur-xl border border-neutral-800 rounded-2xl sm:rounded-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-2xl transition-all">
        <!-- Logo & Identidad -->
        <a href="#" class="flex items-center gap-3 group min-w-0">
          <div class="relative w-10 h-10 rounded-xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-amber-500/40 text-amber-400 flex items-center justify-center text-xl shadow-amber-glow group-hover:scale-105 transition-transform flex-shrink-0">
            💈
            <span class="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-500 animate-ping opacity-75"></span>
          </div>
          <div class="min-w-0">
            <span class="font-display font-extrabold text-base sm:text-lg tracking-tight text-white block leading-tight truncate">
              ${businessName}
            </span>
            <div class="flex items-center gap-2">
              <span class="text-[10px] sm:text-[11px] text-amber-500/80 font-mono font-bold uppercase tracking-wider truncate">
                ${hasCustomDemo ? 'Demo Exclusiva' : 'Barber Club & Grooming'}
              </span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block flex-shrink-0"></span>
            </div>
          </div>
        </a>

        <!-- Enlaces Desktop -->
        <nav class="hidden md:flex items-center gap-6 text-xs font-semibold text-neutral-300">
          <a href="#turnos" class="hover:text-amber-400 transition-colors">Sacar Turno</a>
          <a href="#servicios" class="hover:text-amber-400 transition-colors">Servicios & Precios</a>
          <a href="#barberos" class="hover:text-amber-400 transition-colors">Equipo</a>
          <a href="#ubicacion" class="hover:text-amber-400 transition-colors">Ubicación</a>
        </nav>

        <!-- Acciones -->
        <div class="flex items-center gap-2 sm:gap-3">
          <!-- Toggle Tema -->
          <button
            id="barber-theme-toggle"
            class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>

          <!-- Botón Directo Reservar -->
          <a
            href="#turnos"
            class="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-display font-black text-xs shadow-amber-glow transition-all active:scale-95 flex items-center gap-1.5 flex-shrink-0"
          >
            <span>✂️</span>
            <span>Reservar Turno</span>
          </a>
        </div>
      </nav>
    </header>

    ${hasCustomDemo ? `
      <!-- Alerta demo personalizada -->
      <div class="max-w-4xl mx-auto px-4 mt-6">
        <div class="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 text-center text-xs text-amber-200 font-medium flex items-center justify-center gap-2">
          <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Boceto interactivo de demostración preparado para <strong>${businessName}</strong>.</span>
        </div>
      </div>
    ` : ''}

    <main class="space-y-16 sm:space-y-24 mt-6">
      <!-- HERO SECTION -->
      <section class="relative pt-8 sm:pt-14 pb-12 px-4 sm:px-6 max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <!-- Columna Texto -->
          <div class="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold shadow-inner">
              <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Abierto hoy • Turnos disponibles de 10:00 a 20:30 hs</span>
            </div>

            <h1 class="font-display text-3xl sm:text-5xl md:text-6xl font-black tracking-tight text-white leading-[1.12]">
              ${hasCustomDemo ? `Tu turno en <span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">${businessName}</span> sin esperas.` : 'Cortes impecables, <br/><span class="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500">tu turno en 30 segundos.</span>'}
            </h1>

            <p class="text-sm sm:text-base text-neutral-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
              Elegí tu barbero favorito, seleccioná el horario que más te convenga y confirmá tu turno al instante directo por WhatsApp. Sin aplicaciones ni intermediarios.
            </p>

            <div class="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <a
                href="#turnos"
                class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-display font-black text-xs text-center shadow-amber-glow transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                <span>✂️</span>
                <span>Agendar Turno Online</span>
              </a>

              <a
                href="#servicios"
                class="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-800 font-bold text-xs text-center transition-all active:scale-95 flex items-center justify-center gap-2"
              >
                <span>Ver Precios & Servicios</span>
              </a>
            </div>

            <!-- Badges de Confianza -->
            <div class="pt-6 grid grid-cols-3 gap-3 border-t border-neutral-800/80">
              <div class="text-center lg:text-left">
                <span class="block text-xl sm:text-2xl font-black text-amber-400 font-mono">4.9 ★</span>
                <span class="text-[11px] text-neutral-400">+380 reseñas en Google</span>
              </div>
              <div class="text-center lg:text-left">
                <span class="block text-xl sm:text-2xl font-black text-white font-mono">30 seg</span>
                <span class="text-[11px] text-neutral-400">Reserva sin registro</span>
              </div>
              <div class="text-center lg:text-left">
                <span class="block text-xl sm:text-2xl font-black text-white font-mono">🍺 ☕</span>
                <span class="text-[11px] text-neutral-400">Bebida de cortesía</span>
              </div>
            </div>
          </div>

          <!-- Columna Imagen Hero -->
          <div class="lg:col-span-5 relative">
            <div class="relative rounded-3xl overflow-hidden shadow-2xl border border-neutral-800 group">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=80"
                alt="Barbería Tradicional"
                class="w-full h-80 sm:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-[#08090C] via-black/40 to-transparent flex flex-col justify-end p-6 text-white">
                <div class="inline-flex items-center gap-2 mb-1">
                  <span class="w-3 h-3 rounded-full barber-pole-stripes border border-white/20"></span>
                  <span class="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">Experiencia Premium</span>
                </div>
                <p class="font-display text-lg font-bold">Toalla caliente y afeitado tradicional a navaja</p>
                <p class="text-xs text-neutral-300 mt-1">Sillones hidráulicos vintage, música ambiente y café de especialidad.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN PRINCIPAL: MOTOR INTERACTIVO DE TURNOS (EL SISTEMA) -->
      <section id="turnos" class="max-w-5xl mx-auto px-4 sm:px-6 py-6 scroll-mt-24">
        <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span class="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
            Reserva Fácil & Rápida
          </span>
          <h2 class="font-display text-2xl sm:text-4xl font-black tracking-tight text-white">
            Sistema de Turnos Online
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400">
            Completá los 3 pasos y confirmá directo a nuestro WhatsApp sin intermediarios ni señas obligatorias.
          </p>
        </div>

        <div class="bg-[#101218] rounded-3xl p-6 sm:p-8 border border-neutral-800 shadow-2xl space-y-8">
          <!-- PASO 1: ELEGIR SERVICIO & LISTA DE PRECIOS -->
          <div id="servicios" class="space-y-4 scroll-mt-28">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono flex items-center justify-center text-xs">1</span>
                Elegí tu Servicio & Precios
              </span>
              <span class="text-[11px] font-mono text-neutral-500">Paso 1 de 3</span>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              ${SERVICES.map(svc => {
                const isSelected = selectedService.id === svc.id;
                return `
                  <button
                    type="button"
                    data-service-id="${svc.id}"
                    class="service-select-btn text-left p-5 rounded-2xl border transition-all duration-200 relative group cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/[0.08] shadow-barber-selected scale-[1.02]'
                        : 'border-neutral-800/90 hover:border-neutral-700 bg-[#141720]/80 hover:bg-[#181c27]'
                    }"
                  >
                    <div class="flex items-start justify-between gap-2">
                      <div class="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-2xl">
                        ${svc.icon}
                      </div>
                      ${svc.badge ? `
                        <span class="px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase bg-amber-500 text-neutral-950 shadow-sm font-mono">
                          ${svc.badge}
                        </span>
                      ` : ''}
                    </div>
                    <h4 class="font-display font-bold text-sm sm:text-base text-white mt-3 leading-snug">
                      ${svc.name}
                    </h4>
                    <p class="text-[11px] text-neutral-400 mt-1 line-clamp-2 leading-relaxed">
                      ${svc.description}
                    </p>
                    <div class="mt-4 pt-3 border-t border-neutral-800/80 flex items-center justify-between text-xs">
                      <span class="font-mono font-black text-base text-amber-400">
                        ${formatMoney(svc.price)}
                      </span>
                      <span class="text-[11px] text-neutral-400 font-mono">
                        ⏱️ ${svc.duration}
                      </span>
                    </div>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- PASO 2: ELEGIR BARBERO -->
          <div class="space-y-4 pt-4 border-t border-neutral-800/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono flex items-center justify-center text-xs">2</span>
                Elegí con quién atenderte
              </span>
              <span class="text-[11px] font-mono text-neutral-500">Paso 2 de 3</span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
              ${BARBERS.map(b => {
                const isSelected = selectedBarber.id === b.id;
                return `
                  <button
                    type="button"
                    data-barber-id="${b.id}"
                    class="barber-select-btn text-left p-4 rounded-2xl border transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500/[0.08] shadow-barber-selected scale-[1.02]'
                        : 'border-neutral-800/90 hover:border-neutral-700 bg-[#141720]/80 hover:bg-[#181c27]'
                    }"
                  >
                    <div class="w-10 h-10 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xl mb-2.5">
                      ${b.avatar}
                    </div>
                    <h5 class="font-bold text-xs sm:text-sm text-white leading-tight">
                      ${b.name}
                    </h5>
                    <p class="text-[10px] text-neutral-400 mt-0.5 line-clamp-1 font-mono">
                      ${b.specialty}
                    </p>
                  </button>
                `;
              }).join('')}
            </div>
          </div>

          <!-- PASO 3: DÍA Y HORARIO -->
          <div class="space-y-4 pt-4 border-t border-neutral-800/80">
            <div class="flex items-center justify-between">
              <span class="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <span class="w-6 h-6 rounded-lg bg-amber-500/20 text-amber-400 font-mono flex items-center justify-center text-xs">3</span>
                Elegí Día y Horario
              </span>
              <span class="text-[11px] font-mono text-neutral-500">Paso 3 de 3</span>
            </div>

            <!-- Selector de Día -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              ${DAYS.map(d => {
                const isSelected = selectedDay.id === d.id;
                return `
                  <button
                    type="button"
                    data-day-id="${d.id}"
                    class="day-select-btn p-3.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'border-amber-500 bg-amber-500 text-neutral-950 font-black shadow-amber-glow'
                        : 'border-neutral-800 bg-[#141720] text-neutral-300 hover:border-neutral-700'
                    }"
                  >
                    <span class="block text-xs font-bold">${d.label}</span>
                    <span class="block text-[10px] opacity-80 mt-0.5 font-mono">${d.date}</span>
                  </button>
                `;
              }).join('')}
            </div>

            <!-- Grilla de Horarios -->
            <div class="pt-2">
              <label class="text-[11px] font-semibold text-neutral-400 block mb-2 font-mono">
                Horarios disponibles para ${selectedDay.label}:
              </label>
              <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2">
                ${TIME_SLOTS.map(t => {
                  const isSelected = selectedTime === t;
                  return `
                    <button
                      type="button"
                      data-time="${t}"
                      class="time-select-btn py-2.5 px-1 text-center rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500 text-neutral-950 shadow-md font-extrabold scale-105'
                          : 'border-neutral-800 hover:border-amber-500/50 text-neutral-300 bg-[#141720] hover:bg-[#181c27]'
                      }"
                    >
                      ${t}
                    </button>
                  `;
                }).join('')}
              </div>
            </div>
          </div>

          <!-- RESUMEN TICKET EN TIEMPO REAL & BOTÓN WHATSAPP -->
          <div class="pt-6 border-t border-neutral-800 bg-gradient-to-b from-neutral-900/80 to-[#0A0C10] -mx-6 -mb-6 sm:-mx-8 sm:-mb-8 p-6 sm:p-8 rounded-b-3xl space-y-6">
            <div class="space-y-2">
              <span class="text-[11px] font-mono font-bold uppercase tracking-widest text-amber-400">
                Resumen de tu Turno:
              </span>
              <div class="flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm">
                <div>
                  <strong class="font-display text-white block font-bold text-base sm:text-lg">
                    ${selectedService.name}
                  </strong>
                  <span class="text-neutral-400 text-xs font-mono">
                    Con: <strong class="text-amber-300">${selectedBarber.name}</strong> • ${selectedDay.label} (${selectedDay.date}) a las <strong class="text-amber-300">${selectedTime} hs</strong>
                  </span>
                </div>
                <div class="text-right">
                  <span class="text-2xl sm:text-3xl font-black text-amber-400 font-mono block">
                    ${formatMoney(selectedService.price)}
                  </span>
                  <span class="text-[10px] text-neutral-400 font-mono">Duración: ${selectedService.duration}</span>
                </div>
              </div>
            </div>

            <!-- Formulario con Nombre -->
            <form id="barber-booking-form" class="space-y-4">
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label class="text-[11px] font-semibold text-neutral-400 block mb-1">Tu Nombre y Apellido *</label>
                  <input
                    type="text"
                    id="client-name"
                    value="${customerName}"
                    placeholder="Ej: Marcelo Gómez"
                    required
                    class="w-full bg-[#141720] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label class="text-[11px] font-semibold text-neutral-400 block mb-1">Teléfono (opcional)</label>
                  <input
                    type="tel"
                    id="client-phone"
                    value="${customerPhone}"
                    placeholder="Ej: 11 2345-6789"
                    class="w-full bg-[#141720] border border-neutral-800 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                class="w-full py-4 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-display font-black text-sm shadow-amber-glow transition-all hover:scale-[1.01] active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>💬</span>
                <span>Confirmar Turno por WhatsApp</span>
              </button>
              <p class="text-[11px] text-center text-neutral-400">
                Se te abrirá WhatsApp con el mensaje armado. ¡Confirmación en el acto sin trámites!
              </p>
            </form>
          </div>
        </div>
      </section>

      <!-- SECCIÓN: NUESTRO EQUIPO -->
      <section id="barberos" class="max-w-6xl mx-auto px-4 sm:px-6 py-6 scroll-mt-24">
        <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span class="text-xs font-mono font-extrabold uppercase tracking-widest text-amber-400">
            Profesionales
          </span>
          <h2 class="font-display text-2xl sm:text-3xl font-black tracking-tight text-white">
            Nuestro Equipo
          </h2>
          <p class="text-xs sm:text-sm text-neutral-400">
            Barberos con trayectoria, capacitación continua y pasión por el detalle.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="p-6 rounded-3xl bg-[#101218] border border-neutral-800 space-y-4 text-center">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-neutral-900 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl shadow-sm">
              💈
            </div>
            <div>
              <h4 class="font-display font-bold text-base text-white">Marcos "El Chino"</h4>
              <span class="text-xs text-amber-400 font-mono font-semibold">Master Fade & Freestyle</span>
              <p class="text-xs text-neutral-400 mt-2 leading-relaxed">
                Más de 8 años de experiencia en cortes urbanos, líneas perfectas y degradés a navaja limpia.
              </p>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-[#101218] border border-neutral-800 space-y-4 text-center">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-neutral-900 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl shadow-sm">
              🧔
            </div>
            <div>
              <h4 class="font-display font-bold text-base text-white">Gonzalo V.</h4>
              <span class="text-xs text-amber-400 font-mono font-semibold">Especialista en Barbas</span>
              <p class="text-xs text-neutral-400 mt-2 leading-relaxed">
                Técnica tradicional de navaja y toalla caliente. Asesoramiento en morfología facial y cuidado de barba.
              </p>
            </div>
          </div>

          <div class="p-6 rounded-3xl bg-[#101218] border border-neutral-800 space-y-4 text-center">
            <div class="w-20 h-20 mx-auto rounded-2xl bg-neutral-900 border border-amber-500/30 text-amber-400 flex items-center justify-center text-3xl shadow-sm">
              ✂️
            </div>
            <div>
              <h4 class="font-display font-bold text-base text-white">Tomás R.</h4>
              <span class="text-xs text-amber-400 font-mono font-semibold">Texturas & Clásicos</span>
              <p class="text-xs text-neutral-400 mt-2 leading-relaxed">
                Perfeccionista de la tijera y cortes desmechados. Estilos clásicos europeos y peinados modernos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- SECCIÓN: UBICACIÓN & HORARIOS CON GOOGLE MAPS -->
      <section id="ubicacion" class="max-w-6xl mx-auto px-4 sm:px-6 py-6 scroll-mt-24">
        <div class="bg-[#101218] rounded-3xl p-6 sm:p-10 border border-neutral-800 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center shadow-2xl">
          <div class="space-y-6">
            <div>
              <span class="text-xs font-mono font-bold uppercase tracking-widest text-amber-400">¿Dónde estamos?</span>
              <h3 class="font-display text-2xl sm:text-3xl font-black tracking-tight text-white mt-1">
                El Club & Horarios
              </h3>
            </div>

            <div class="space-y-4 text-xs sm:text-sm text-neutral-300">
              <div class="flex items-start gap-3">
                <span class="text-lg">📍</span>
                <div>
                  <strong class="text-white block font-bold">Dirección</strong>
                  <span class="text-neutral-400">Av. Triunvirato 4120, Villa Urquiza, CABA</span>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-lg">🕒</span>
                <div>
                  <strong class="text-white block font-bold">Horarios de Atención</strong>
                  <p class="text-neutral-400">Martes a Sábados: 10:00 a 20:30 hs (Corrido)</p>
                  <p class="text-amber-500/90 text-xs mt-0.5">Domingos y Lunes cerrado por descanso.</p>
                </div>
              </div>

              <div class="flex items-start gap-3">
                <span class="text-lg">🎮</span>
                <div>
                  <strong class="text-white block font-bold">Sala de Espera</strong>
                  <span class="text-neutral-400">PlayStation 5, café de especialidad, bebidas frías y WiFi libre.</span>
                </div>
              </div>
            </div>

            <a
              href="https://maps.google.com/?q=Av.+Triunvirato+4120+Buenos+Aires"
              target="_blank"
              class="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-neutral-950 text-xs font-bold transition-all active:scale-95 shadow-sm hover:bg-neutral-200"
            >
              <span>🗺️</span>
              <span>Abrir en Google Maps</span>
            </a>
          </div>

          <!-- Mapa Real Interactivo -->
          <div class="h-80 sm:h-96 w-full rounded-2xl overflow-hidden border border-neutral-800 relative shadow-md bg-neutral-900">
            <iframe
              src="https://maps.google.com/maps?q=Av.+Triunvirato+4120,+Villa+Urquiza,+Buenos+Aires&t=&z=16&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="100%"
              style="border:0;"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade"
              title="Ubicación Google Maps Barbería"
              class="w-full h-full"
            ></iframe>
          </div>
        </div>
      </section>
    </main>

    <!-- FOOTER COMERCIAL & CIERRE -->
    <footer class="bg-[#050608] border-t border-neutral-800 mt-20 pt-12 pb-8 px-4 sm:px-6 transition-colors">
      <div class="max-w-6xl mx-auto space-y-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-xs text-neutral-400">
          <div class="space-y-2">
            <span class="font-display text-base font-black tracking-tight text-white block">La Hermandad Barber Club</span>
            <p class="text-neutral-500">Cortes clásicos, degradés y cuidado de barba tradicional con sistema de turnos propio sin comisiones.</p>
          </div>
          <div>
            <strong class="text-white block mb-2 font-bold">Horarios</strong>
            <p>Mar a Sáb: 10:00 a 20:30 hs</p>
            <p class="text-amber-400">Con turno previo</p>
          </div>
          <div>
            <strong class="text-white block mb-2 font-bold">Contacto</strong>
            <p>Av. Triunvirato 4120, Villa Urquiza</p>
            <p>WhatsApp: +54 9 11 2335-1610</p>
          </div>
          <div class="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-neutral-200 space-y-2">
            <span class="font-bold block text-amber-400">¿Querés esta web para tu barbería?</span>
            <p class="text-[11px] text-neutral-400">Permití que tus clientes reserven solos en 30 segundos sin intermediarios ni comisiones abusivas.</p>
            <a
              href="${HUB_URL}"
              class="inline-block text-[11px] font-bold text-amber-400 underline"
            >
              Consultar contratación →
            </a>
          </div>
        </div>

        <div class="pt-8 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <p>© 2026 La Hermandad • Demo Interactiva de Turnos Online.</p>
          <a href="${HUB_URL}" class="hover:text-neutral-200 underline">
            Volver a Soluciones Digitales
          </a>
        </div>
      </div>
    </footer>
  `;

  // Event Listeners
  const themeToggle = document.getElementById('barber-theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
  }

  // Selección de Servicio
  document.querySelectorAll('.service-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-service-id');
      const found = SERVICES.find(s => s.id === id);
      if (found) {
        selectedService = found;
        render();
      }
    });
  });

  // Selección de Barbero
  document.querySelectorAll('.barber-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-barber-id');
      const found = BARBERS.find(b => b.id === id);
      if (found) {
        selectedBarber = found;
        render();
      }
    });
  });

  // Selección de Día
  document.querySelectorAll('.day-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = (e.currentTarget as HTMLElement).getAttribute('data-day-id');
      const found = DAYS.find(d => d.id === id);
      if (found) {
        selectedDay = found;
        render();
      }
    });
  });

  // Selección de Horario
  document.querySelectorAll('.time-select-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const time = (e.currentTarget as HTMLElement).getAttribute('data-time');
      if (time) {
        selectedTime = time;
        render();
      }
    });
  });

  // Inputs cliente
  const nameInput = document.getElementById('client-name') as HTMLInputElement | null;
  if (nameInput) {
    nameInput.addEventListener('input', (e) => {
      customerName = (e.target as HTMLInputElement).value;
    });
  }

  const phoneInput = document.getElementById('client-phone') as HTMLInputElement | null;
  if (phoneInput) {
    phoneInput.addEventListener('input', (e) => {
      customerPhone = (e.target as HTMLInputElement).value;
    });
  }

  // Formulario Confirmar Turno
  const form = document.getElementById('barber-booking-form');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = customerName.trim() || 'Cliente';
      const phoneText = customerPhone.trim() ? `%0A📞 *Teléfono:* ${encodeURIComponent(customerPhone.trim())}` : '';

      const currentBiz = getCustomBusinessName();
      const msg = `¡Hola ${encodeURIComponent(currentBiz)}! Quiero confirmar la reserva de este turno:%0A%0A👤 *Cliente:* ${encodeURIComponent(name)}${phoneText}%0A✂️ *Servicio:* ${encodeURIComponent(selectedService.name)} (${formatMoney(selectedService.price)})%0A💈 *Profesional:* ${encodeURIComponent(selectedBarber.name)}%0A📅 *Fecha:* ${encodeURIComponent(selectedDay.label)} (${encodeURIComponent(selectedDay.date)})%0A🕒 *Horario:* ${encodeURIComponent(selectedTime)} hs%0A⏱️ *Duración estimada:* ${encodeURIComponent(selectedService.duration)}%0A%0A¿Me confirman la disponibilidad? ¡Muchas gracias!`;

      window.open(`https://wa.me/${BARBERSHOP_WHATSAPP}?text=${msg}`, '_blank');
    });
  }
}

document.addEventListener('DOMContentLoaded', init);
init();
