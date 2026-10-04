// Portal Principal - Web Padre: Soluciones Digitales para Comercios
let isDarkMode = true;

const WHATSAPP_CONSULTA = (import.meta as any).env?.VITE_WHATSAPP_NUM || '5491123351610'; // WhatsApp de Adrián Schuster

function init() {
  const savedTheme = localStorage.getItem('hub_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : true;
  document.documentElement.classList.toggle('dark', isDarkMode);
  render();
}

function toggleTheme() {
  isDarkMode = !isDarkMode;
  document.documentElement.classList.toggle('dark', isDarkMode);
  localStorage.setItem('hub_theme', isDarkMode ? 'dark' : 'light');
  render();
}

function render() {
  const app = document.getElementById('app');
  if (!app) return;

  const isCustomDomain = () => typeof window !== 'undefined' && window.location.hostname.includes('adrianschuster.com.ar');
  const getDemoUrl = (slug: string, localPort: number) => {
    if (typeof window === 'undefined') return '#';
    if (isCustomDomain()) {
      if (slug === 'unas') return 'https://unas.adrianschuster.com.ar';
      if (slug === 'barberia') return 'https://turnos.adrianschuster.com.ar';
      if (slug === 'mascotas') return 'https://petshop.adrianschuster.com.ar';
      if (slug === 'ecommerce') return 'https://ecommerce.adrianschuster.com.ar';
      if (slug === 'landing') return 'https://landing.adrianschuster.com.ar';
    }
    return `http://${window.location.hostname}:${localPort}`;
  };

  app.innerHTML = `
    <!-- Barra Superior / Floating Capsule Navbar -->
    <header class="sticky top-3 z-40 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      <nav class="bg-[#121622]/90 backdrop-blur-xl border border-hub-border rounded-2xl sm:rounded-full px-4 sm:px-6 h-16 flex items-center justify-between gap-4 shadow-2xl transition-all">
        <!-- Logo / Marca -->
        <a href="#" class="flex items-center gap-3 group min-w-0">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-emerald-500 text-white flex items-center justify-center font-black text-lg shadow-hub-glow group-hover:scale-105 transition-transform flex-shrink-0">
            ⚡
          </div>
          <div class="min-w-0">
            <span class="font-extrabold text-base sm:text-lg tracking-tight text-white block leading-tight truncate">
              Soluciones Digitales
            </span>
            <span class="text-[10px] sm:text-[11px] text-blue-400 font-medium block truncate">para Comercios Locales</span>
          </div>
        </a>

        <!-- Enlaces & Acciones -->
        <div class="flex items-center gap-2 sm:gap-4">
          <a
            href="#soluciones"
            class="hidden md:inline-block text-xs font-semibold text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Soluciones
          </a>
          <a
            href="#demos"
            class="hidden md:inline-block text-xs font-semibold text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Demos en Vivo
          </a>
          <a
            href="#rubros"
            class="hidden md:inline-block text-xs font-semibold text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Rubros
          </a>
          <a
            href="#sobre-mi"
            class="hidden md:inline-block text-xs font-semibold text-neutral-300 hover:text-white px-3.5 py-1.5 rounded-full hover:bg-neutral-800 transition-colors"
          >
            Quién soy
          </a>

          <!-- Toggle Tema -->
          <button
            id="theme-toggle-btn"
            class="w-9 h-9 rounded-xl bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>

          <!-- Botón de Contacto Directo WhatsApp -->
          <a
            href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola Adrián! Vi el portal de soluciones digitales y me gustaría consultar para mi comercio.')}"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold shadow-emerald-glow transition-all active:scale-95 flex-shrink-0"
          >
            <span>💬</span>
            <span class="hidden sm:inline">WhatsApp Directo</span>
            <span class="sm:hidden">Consultar</span>
          </a>
        </div>
      </nav>
    </header>

    <!-- Hero Section -->
    <header class="relative pt-12 sm:pt-20 pb-16 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6 overflow-hidden">
      <!-- Glow decorativo de fondo -->
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-r from-blue-600/15 via-indigo-600/15 to-emerald-500/15 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold">
        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>Sin comisiones abusivas • Directo al WhatsApp de tu negocio</span>
      </div>

      <h1 class="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-[1.12]">
        Llevá tu negocio al mundo digital y <br class="hidden sm:inline" />
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
          multiplicá tus ventas y reservas.
        </span>
      </h1>

      <p class="text-sm sm:text-base md:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
        Herramientas prácticas y accesibles para que comercios locales, barberías, salones de belleza y pet shops reciban pedidos y turnos directos a su WhatsApp en menos de 24 horas.
      </p>

      <div class="pt-2 flex flex-wrap items-center justify-center gap-3">
        <a
          href="#soluciones"
          class="px-7 py-3.5 rounded-xl bg-white text-neutral-950 font-bold text-xs sm:text-sm hover:bg-neutral-200 transition-all shadow-lg active:scale-95"
        >
          Ver Todas las Soluciones ↓
        </a>
        <a
          href="#demos"
          class="px-7 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-hub-glow transition-all active:scale-95"
        >
          Probar Demos en Vivo ✨
        </a>
      </div>

      <!-- Métricas rápidas de impacto -->
      <div class="pt-6 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-neutral-400 border-t border-hub-border">
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span><strong>0% Comisión</strong> por venta o turno</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span>Puesta en marcha <strong>en 24 horas</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-emerald-400 font-bold text-base">✓</span>
          <span><strong>100% Adaptado</strong> a celulares</span>
        </div>
      </div>
    </header>

    <!-- SECCIÓN: DEMOS EN VIVO (SHOWCASE INTERACTIVO) -->
    <section id="demos" class="max-w-6xl mx-auto px-4 sm:px-6 py-12 scroll-mt-24">
      <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span class="text-xs font-bold uppercase tracking-widest text-emerald-400 font-mono">
          Experiencias Reales
        </span>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Probá las Demos Interactivas
        </h2>
        <p class="text-xs sm:text-sm text-neutral-400">
          Hacé clic en cualquiera de nuestras demos para ver exactamente cómo lo experimentarán tus clientes.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <!-- Demo Uñas -->
        <a
          href="${getDemoUrl('unas', 5175)}"
          target="_blank"
          class="group p-5 rounded-3xl bg-hub-card border border-hub-border hover:border-pink-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-pink-500 to-rose-400 text-white flex items-center justify-center text-2xl shadow-md">
              💅
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-pink-400 tracking-wider">Estética & Uñas</span>
              <h3 class="text-base font-bold text-white group-hover:text-pink-300 transition-colors mt-0.5">
                Glow & Co. Nails Studio
              </h3>
              <p class="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Reserva de turnos con selección de manicura, día, horario y retiro previo de esmalte.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-hub-border flex items-center justify-between text-xs font-bold text-pink-400">
            <span>Abrir Demo en Vivo</span>
            <span>→</span>
          </div>
        </a>

        <!-- Demo Barbería -->
        <a
          href="${getDemoUrl('barberia', 5176)}"
          target="_blank"
          class="group p-5 rounded-3xl bg-hub-card border border-hub-border hover:border-amber-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-500 text-neutral-950 flex items-center justify-center text-2xl shadow-md">
              💈
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-amber-400 tracking-wider">Barberías & Grooming</span>
              <h3 class="text-base font-bold text-white group-hover:text-amber-300 transition-colors mt-0.5">
                La Hermandad Barber Club
              </h3>
              <p class="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Agenda de barberos por especialista, degradés, toalla caliente y ticket directo a WhatsApp.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-hub-border flex items-center justify-between text-xs font-bold text-amber-400">
            <span>Abrir Demo en Vivo</span>
            <span>→</span>
          </div>
        </a>

        <!-- Demo Mascotas -->
        <a
          href="${getDemoUrl('mascotas', 5178)}"
          target="_blank"
          class="group p-5 rounded-3xl bg-hub-card border border-hub-border hover:border-teal-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-500 text-white flex items-center justify-center text-2xl shadow-md">
              🐾
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-teal-400 tracking-wider">Mascotas & Veterinaria</span>
              <h3 class="text-base font-bold text-white group-hover:text-teal-300 transition-colors mt-0.5">
                Patitas Felices Pet Spa
              </h3>
              <p class="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Peluquería canina con selector de tamaño (chico, mediano, gigante) y baño desparasitario.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-hub-border flex items-center justify-between text-xs font-bold text-teal-400">
            <span>Abrir Demo en Vivo</span>
            <span>→</span>
          </div>
        </a>

        <!-- Demo Catálogo Ecommerce -->
        <a
          href="${getDemoUrl('ecommerce', 5174)}"
          target="_blank"
          class="group p-5 rounded-3xl bg-hub-card border border-hub-border hover:border-emerald-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-500 to-green-600 text-white flex items-center justify-center text-2xl shadow-md">
              🛒
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">Comercio & Retail</span>
              <h3 class="text-base font-bold text-white group-hover:text-emerald-300 transition-colors mt-0.5">
                Catálogo Express & Delivery
              </h3>
              <p class="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Catálogo digital con carrito para almacenes, kioscos y dietéticas con carga rápida en Excel.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-hub-border flex items-center justify-between text-xs font-bold text-emerald-400">
            <span>Abrir Demo en Vivo</span>
            <span>→</span>
          </div>
        </a>

        <!-- Demo Gastronómica -->
        <a
          href="${getDemoUrl('landing', 5177)}"
          target="_blank"
          class="group p-5 rounded-3xl bg-hub-card border border-hub-border hover:border-orange-500/60 transition-all duration-300 shadow-xl flex flex-col justify-between hover:scale-[1.02]"
        >
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-red-600 text-white flex items-center justify-center text-2xl shadow-md">
              🔥
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-orange-400 tracking-wider">Gastronomía & Bodegón</span>
              <h3 class="text-base font-bold text-white group-hover:text-orange-300 transition-colors mt-0.5">
                Fuego & Harina • Horno a Leña
              </h3>
              <p class="text-xs text-neutral-400 mt-1.5 leading-relaxed">
                Carta digital de fuegos, reservas de mesas y pedidos directos sin intermediarios.
              </p>
            </div>
          </div>
          <div class="mt-4 pt-3 border-t border-hub-border flex items-center justify-between text-xs font-bold text-orange-400">
            <span>Abrir Demo en Vivo</span>
            <span>→</span>
          </div>
        </a>

        <!-- Card Consulta a Medida -->
        <div class="p-5 rounded-3xl bg-gradient-to-br from-blue-900/40 via-indigo-900/40 to-neutral-900 border border-blue-500/30 flex flex-col justify-between shadow-xl">
          <div class="space-y-3">
            <div class="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <span class="text-[10px] uppercase font-bold text-blue-400 tracking-wider">Personalizado</span>
              <h3 class="text-base font-bold text-white mt-0.5">
                ¿Querés una demo con tu local?
              </h3>
              <p class="text-xs text-neutral-300 mt-1.5 leading-relaxed">
                Te preparo un boceto interactivo exclusivo con el nombre, fotos y servicios de tu negocio sin cargo.
              </p>
            </div>
          </div>
          <a
            href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola Adrián! Me gustaría ver un boceto interactivo para mi negocio.')}"
            target="_blank"
            class="mt-4 pt-3 border-t border-blue-500/30 flex items-center justify-between text-xs font-bold text-blue-300 hover:text-white transition-colors"
          >
            <span>Pedir mi boceto gratis</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- SECCIÓN: LAS SOLUCIONES DIGITALES -->
    <section id="soluciones" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20 border-t border-hub-border">
      <div class="text-center max-w-xl mx-auto mb-12 space-y-2">
        <h2 class="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          Nuestras Soluciones Digitales
        </h2>
        <p class="text-xs sm:text-sm text-neutral-400">
          Elegí el modelo que mejor se adapte al rubro y a las necesidades de tu comercio.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- SOLUCIÓN 1: SISTEMA DE TURNOS ONLINE -->
        <div class="bg-hub-card rounded-3xl p-6 sm:p-7 border border-hub-border shadow-xl hover:border-pink-500/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-400 flex items-center justify-center text-2xl">
                📅
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-pink-500/10 text-pink-300 border border-pink-500/20">
                Turnos Online
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-pink-400 transition-colors">
                1. Sistema de Turnos Online
              </h3>
              <p class="text-xs text-neutral-400 mt-2 leading-relaxed">
                Para <strong>barberías, peluquerías, salones de uñas, estéticas y pet shops</strong>. Tus clientes eligen servicio, profesional, día y hora, y el turno llega listo a tu WhatsApp sin pagar comisiones mensuales.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-300 pt-2 border-t border-hub-border">
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Sin comisiones por turno agendado</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Selector de profesional y servicios</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Sin apps pesadas para el cliente</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Confirmación directa en tu WhatsApp</li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-hub-border space-y-2">
            <a
              href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Me interesa consultar por el Sistema de Turnos Online para mi negocio.')}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl bg-white text-neutral-950 font-bold text-xs text-center flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-sm active:scale-95"
            >
              <span>Consultar por Turnos Online</span>
              <span>💬</span>
            </a>
          </div>
        </div>

        <!-- SOLUCIÓN 2: E-COMMERCE & CATÁLOGO WHATSAPP -->
        <div class="bg-hub-card rounded-3xl p-6 sm:p-7 border border-hub-border shadow-xl hover:border-emerald-500/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl">
                🛒
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Catálogo Web
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                2. Catálogo & Pedidos WhatsApp
              </h3>
              <p class="text-xs text-neutral-400 mt-2 leading-relaxed">
                Ideal para <strong>almacenes, kioscos, fiambrerías y dietéticas</strong>. Tus clientes eligen productos con fotos y te mandan el pedido armado a tu WhatsApp con total y dirección.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-300 pt-2 border-t border-hub-border">
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Carrito con cálculo de delivery</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Carga de precios masiva con Excel (.xlsx)</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Selector de rubros y modo oscuro</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Sin intermediarios ni porcentajes</li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-hub-border space-y-2">
            <a
              href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Me interesa consultar por el Catálogo y E-commerce por WhatsApp para mi negocio.')}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl bg-white text-neutral-950 font-bold text-xs text-center flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-sm active:scale-95"
            >
              <span>Consultar por Catálogo WhatsApp</span>
              <span>💬</span>
            </a>
          </div>
        </div>

        <!-- SOLUCIÓN 3: LANDING GASTRONÓMICA / POS -->
        <div class="bg-hub-card rounded-3xl p-6 sm:p-7 border border-hub-border shadow-xl hover:border-amber-500/50 transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-2xl">
                🍷
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Menú & Reservas
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-white group-hover:text-amber-400 transition-colors">
                3. Menú Digital & Carta Gastronómica
              </h3>
              <p class="text-xs text-neutral-400 mt-2 leading-relaxed">
                Diseñada para <strong>rotiserías, pizzerías, cafeterías y restaurantes</strong>. Muestra tu carta visual, menú del día, fotos del local, opiniones y botón de reservas.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-300 pt-2 border-t border-hub-border">
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Carta / Menú digital interactivo</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Botón directo para reservar mesa</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Integración con Google Maps y Reseñas</li>
              <li class="flex items-center gap-2"><span class="text-emerald-400 font-bold">✓</span> Software de Caja POS Offline disponible</li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-hub-border space-y-2">
            <a
              href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Me interesa consultar por el Menú Digital Gastronómico.')}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl bg-white text-neutral-950 font-bold text-xs text-center flex items-center justify-center gap-2 hover:bg-neutral-200 transition-all shadow-sm active:scale-95"
            >
              <span>Consultar por Menú Digital</span>
              <span>💬</span>
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN: PARA QUIÉNES ESTÁ PENSADO (RUBROS & NEGOCIOS) -->
    <section id="rubros" class="max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 border-t border-hub-border">
      <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          ✨ 100% Adaptable a tu modelo de trabajo
        </span>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          ¿Para qué tipo de comercios está pensado?
        </h2>
        <p class="text-sm text-neutral-400 leading-relaxed">
          No importa qué vendas ni el tamaño de tu local: desarrollamos soluciones personalizadas que resuelven los problemas diarios de atención, pedidos y turnos.
        </p>
      </div>

      <!-- Grilla interactiva y visual de rubros -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <!-- 1. Estética y Belleza -->
        <div class="bg-hub-card p-6 rounded-2xl border border-hub-border hover:border-pink-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">💅</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-500/10 text-pink-300 border border-pink-500/20">
                Turnos Online
              </span>
            </div>
            <h3 class="text-base font-bold text-white">
              Estética, Barberías & Belleza
            </h3>
            <p class="text-xs text-neutral-400 mt-1">
              Nailbars, peluquerías, barberías, centros de depilación, spas, estudios de tatuajes y masajes.
            </p>
            <div class="mt-4 pt-3 border-t border-hub-border text-xs text-neutral-300">
              <strong class="text-white font-semibold">Beneficio:</strong> Los clientes reservan horario y profesional directamente desde el celular sin llamadas ni esperas.
            </div>
          </div>
        </div>

        <!-- 2. Gastronomía -->
        <div class="bg-hub-card p-6 rounded-2xl border border-hub-border hover:border-amber-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🍕</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Menú & Pedidos
              </span>
            </div>
            <h3 class="text-base font-bold text-white">
              Gastronomía, Bares & Rotiserías
            </h3>
            <p class="text-xs text-neutral-400 mt-1">
              Restaurantes, pizzerías, cafeterías, cervecerías, hamburgueserías y food trucks.
            </p>
            <div class="mt-4 pt-3 border-t border-hub-border text-xs text-neutral-300">
              <strong class="text-white font-semibold">Beneficio:</strong> Carta digital visual con fotos, botón de reservas y pedidos por WhatsApp con cálculo de delivery.
            </div>
          </div>
        </div>

        <!-- 3. Comercios de Barrio y Retail -->
        <div class="bg-hub-card p-6 rounded-2xl border border-hub-border hover:border-emerald-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🛒</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Catálogo WhatsApp
              </span>
            </div>
            <h3 class="text-base font-bold text-white">
              Comercios de Barrio & Retail
            </h3>
            <p class="text-xs text-neutral-400 mt-1">
              Almacenes, kioscos, dietéticas, fiambrerías, tiendas de ropa y ferreterías de barrio.
            </p>
            <div class="mt-4 pt-3 border-t border-hub-border text-xs text-neutral-300">
              <strong class="text-white font-semibold">Beneficio:</strong> Catálogo autogestionado con Excel (.xlsx), carrito ágil y cobro en mostrador con POS offline.
            </div>
          </div>
        </div>

        <!-- 4. Deportes y Recreación -->
        <div class="bg-hub-card p-6 rounded-2xl border border-hub-border hover:border-blue-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🎾</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                Canchas & Cupos
              </span>
            </div>
            <h3 class="text-base font-bold text-white">
              Deportes & Recreación
            </h3>
            <p class="text-xs text-neutral-400 mt-1">
              Alquiler de canchas (fútbol, pádel, tenis), gimnasios, boxes de crossfit, yoga y pilates.
            </p>
            <div class="mt-4 pt-3 border-t border-hub-border text-xs text-neutral-300">
              <strong class="text-white font-semibold">Beneficio:</strong> Reserva por franja horaria, gestión de señas y cupos máximos por clase en tiempo real.
            </div>
          </div>
        </div>

        <!-- 5. Mascotas y Veterinaria -->
        <div class="bg-hub-card p-6 rounded-2xl border border-hub-border hover:border-teal-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🐾</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/20">
                Peluquería & Tienda
              </span>
            </div>
            <h3 class="text-base font-bold text-white">
              Mascotas & Veterinarias
            </h3>
            <p class="text-xs text-neutral-400 mt-1">
              Peluquerías caninas, clínicas veterinarias, pet shops y guarderías.
            </p>
            <div class="mt-4 pt-3 border-t border-hub-border text-xs text-neutral-300">
              <strong class="text-white font-semibold">Beneficio:</strong> Agendamiento de turnos para baño y corte por tamaño de perro, y delivery de alimentos balanceados.
            </div>
          </div>
        </div>

        <!-- 6. Talleres & Automotor -->
        <div class="bg-hub-card p-6 rounded-2xl border border-hub-border hover:border-cyan-500/40 transition-all shadow-lg flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🚗</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                Service & Talleres
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Talleres & Servicios Automotores
            </h3>
            <p class="text-xs text-neutral-400 mt-1">
              Talleres mecánicos, lavaderos de autos premium, lubricentros y gomerías.
            </p>
            <div class="mt-4 pt-3 border-t border-hub-border text-xs text-neutral-300">
              <strong class="text-white font-semibold">Beneficio:</strong> Turnos ordenados para service y mantenimientos, evitando autos acumulados en el taller.
            </div>
          </div>
        </div>
      </div>

      <!-- BANNER DESTACADO: ¿NO VES TU RUBRO? -->
      <div class="mt-10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 rounded-3xl p-8 sm:p-10 border border-hub-border text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
        <div class="space-y-2 text-center md:text-left max-w-xl">
          <div class="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <span>💡</span> Soluciones a medida
          </div>
          <h3 class="text-xl sm:text-2xl font-bold">
            ¿Tu rubro no está en la lista? Lo armamos para vos.
          </h3>
          <p class="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            Cada comercio funciona de una manera única. Si atendés público, cobrás productos o brindás un servicio, adaptamos y construimos la herramienta exacta que necesita tu negocio.
          </p>
        </div>

        <div class="flex-shrink-0">
          <a
            href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Tengo un comercio y me gustaría saber cómo podemos adaptar una solución digital a mi rubro.')}"
            target="_blank"
            class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-white text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-md active:scale-95 text-center"
          >
            <span>💬</span>
            <span>Consultar por mi rubro</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>

    <!-- SECCIÓN: QUIÉN ESTÁ DETRÁS / SOBRE MÍ -->
    <section id="sobre-mi" class="max-w-6xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 border-t border-hub-border">
      <div class="text-center max-w-xl mx-auto mb-10 space-y-2">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
          👋 Trato personal y cercano
        </span>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Quién está detrás del proyecto
        </h2>
        <p class="text-xs sm:text-sm text-neutral-400">
          Tecnología simple, atención personalizada y sin intermediarios para negocios locales.
        </p>
      </div>

      <div class="bg-hub-card rounded-3xl border border-hub-border p-6 sm:p-10 shadow-xl">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <!-- Columna Foto -->
          <div class="lg:col-span-5 flex flex-col items-center text-center">
            <div class="relative group">
              <div class="absolute -inset-1 bg-gradient-to-tr from-blue-500 to-emerald-400 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div class="relative w-52 h-52 sm:w-60 sm:h-60 rounded-3xl overflow-hidden border-2 border-neutral-700 shadow-xl bg-neutral-800">
                <img
                  src="/adrian.jpg"
                  alt="Adrián Schuster - Creador de Soluciones Digitales"
                  class="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>

            <div class="mt-6">
              <h3 class="text-lg font-bold text-white">Adrián Schuster</h3>
              <p class="text-xs text-neutral-400">Desarrollo Web & Soluciones para Comercios</p>
              <p class="text-[11px] text-neutral-500 mt-0.5">Buenos Aires, Argentina</p>
            </div>
          </div>

          <!-- Columna Mensaje y Valores -->
          <div class="lg:col-span-7 space-y-6">
            <div>
              <h4 class="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
                "Creo herramientas simples para que los comercios locales vendan más y atiendan mejor, sin complicaciones ni costos ocultos."
              </h4>
              <p class="mt-3 text-sm text-neutral-300 leading-relaxed">
                Sé lo demandante que es estar al frente de un local todos los días. Por eso no ofrezco sistemas enlatados difíciles de usar ni abonos mensuales abusivos. Mi trabajo es armarte una herramienta ágil que funcione directo desde el celular de tus clientes a tu WhatsApp, adaptada 100% a cómo trabajás vos.
              </p>
            </div>

            <!-- 3 Pilares de confianza -->
            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div class="text-lg mb-1.5">🤝</div>
                <h5 class="text-xs font-bold text-white">Trato directo 1 a 1</h5>
                <p class="text-[11px] text-neutral-400 mt-1">Sin intermediarios ni robots. Coordinás todo directamente conmigo.</p>
              </div>

              <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div class="text-lg mb-1.5">🛡️</div>
                <h5 class="text-xs font-bold text-white">0% Comisiones</h5>
                <p class="text-[11px] text-neutral-400 mt-1">Lo que vendés o reservás es 100% tuyo. Sin porcentajes por venta.</p>
              </div>

              <div class="p-4 rounded-2xl bg-neutral-900 border border-neutral-800">
                <div class="text-lg mb-1.5">🚀</div>
                <h5 class="text-xs font-bold text-white">Puesta en marcha</h5>
                <p class="text-[11px] text-neutral-400 mt-1">Te entrego todo listo y te enseño a usarlo en 10 minutos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FOOTER / CTA FINAL -->
    <footer class="bg-[#07090E] border-t border-hub-border py-12 px-4 sm:px-6 mt-12 text-center transition-colors">
      <div class="max-w-xl mx-auto space-y-4">
        <h3 class="text-xl font-bold text-white">
          ¿Listo para digitalizar tu negocio?
        </h3>
        <p class="text-xs sm:text-sm text-neutral-400">
          Enviame un mensaje por WhatsApp, contame qué rubro tenés y coordinamos la propuesta para tu negocio.
        </p>
        <a
          href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Quiero digitalizar mi local. ¿Podemos coordinar?')}"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-emerald-glow transition-all active:scale-95"
        >
          <span>💬</span>
          <span>Escribinos al WhatsApp</span>
        </a>

        <div class="pt-8 text-[11px] text-neutral-500">
          © 2026 Soluciones Digitales • Desarrollado por Adrián Schuster
        </div>
      </div>
    </footer>
  `;

  // Event Listeners
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) {
    themeBtn.addEventListener('click', toggleTheme);
  }
}

document.addEventListener('DOMContentLoaded', init);
init();