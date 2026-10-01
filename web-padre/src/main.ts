// Portal Principal - Web Padre: Soluciones Digitales para Comercios
let isDarkMode = true;

// URL dinámica de los demos (soporta variables en Vercel, subdominios adrianschuster.com.ar y localhost/WiFi local)
const getHost = () => (typeof window !== 'undefined' ? window.location.hostname : 'localhost');
const isCustomDomain = () => typeof window !== 'undefined' && window.location.hostname.includes('adrianschuster.com.ar');

const ECOMMERCE_DEMO_URL = (import.meta as any).env?.VITE_ECOMMERCE_URL || (isCustomDomain() ? 'https://ecommerce.adrianschuster.com.ar/' : `http://${getHost()}:5173/`);
const LANDING_DEMO_URL = (import.meta as any).env?.VITE_LANDING_URL || (isCustomDomain() ? 'https://landing.adrianschuster.com.ar/' : `http://${getHost()}:5175/`);
const BARBERIA_DEMO_URL = (import.meta as any).env?.VITE_BARBERIA_URL || (isCustomDomain() ? 'https://turnos.adrianschuster.com.ar/' : `http://${getHost()}:5176/`);
const WHATSAPP_CONSULTA = (import.meta as any).env?.VITE_WHATSAPP_NUM || '5491100000000'; // Tu número de WhatsApp para recibir consultas

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

  app.innerHTML = `
    <!-- Barra Superior / Navbar -->
    <nav class="sticky top-0 z-40 bg-white/90 dark:bg-[#0E1015]/90 backdrop-blur-md border-b border-neutral-100 dark:border-neutral-800 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <!-- Logo / Marca -->
        <a href="#" class="flex items-center gap-2.5">
          <div class="w-9 h-9 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 flex items-center justify-center font-black text-base shadow-sm">
            ⚡
          </div>
          <div>
            <span class="font-bold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white block leading-tight">
              Soluciones Digitales
            </span>
            <span class="text-[11px] text-neutral-400 block -mt-0.5">para Comercios Locales</span>
          </div>
        </a>

        <!-- Enlaces & Acciones -->
        <div class="flex items-center gap-2 sm:gap-3">
          <a
            href="#soluciones"
            class="hidden md:inline-block text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            Soluciones
          </a>
          <a
            href="#rubros"
            class="hidden md:inline-block text-xs font-medium text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            ¿Para quién es?
          </a>


          <!-- Toggle Tema -->
          <button
            id="theme-toggle-btn"
            class="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>

          <!-- Botón de Contacto Directo WhatsApp -->
          <a
            href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Vi el portal de soluciones digitales y me gustaría consultar para mi comercio.')}"
            target="_blank"
            class="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-semibold hover:bg-neutral-800 dark:hover:bg-neutral-100 shadow-sm transition-all active:scale-95"
          >
            <span>💬</span>
            <span class="hidden sm:inline">Hablar por WhatsApp</span>
            <span class="sm:hidden">Consultar</span>
          </a>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="py-16 sm:py-24 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-6">
      <h1 class="text-3xl sm:text-5xl md:text-6xl font-extrabold text-neutral-900 dark:text-white tracking-tight leading-[1.15]">
        Llevá tu negocio al mundo digital y actualizá tu forma de llegar a la gente.
      </h1>

      <p class="text-sm sm:text-base md:text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto leading-relaxed">
        Soluciones prácticas y accesibles para que almacenes, kioscos, rotiserías y comercios de barrio reciban pedidos directos a su WhatsApp, modernicen su imagen y controlen su stock.
      </p>

      <!-- Métricas rápidas de impacto -->
      <div class="pt-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
        <div class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold text-base">✓</span>
          <span><strong>0% Comisión</strong> por venta</span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold text-base">✓</span>
          <span>Actualización con <strong>Excel</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-emerald-500 font-bold text-base">✓</span>
          <span><strong>100% Adaptado</strong> a celulares</span>
        </div>
      </div>
    </header>

    <!-- SECCIÓN: LAS SOLUCIONES DIGITALES (LAS TARJETAS PRINCIPALES) -->
    <section id="soluciones" class="max-w-7xl mx-auto px-4 sm:px-6 py-12 scroll-mt-20">
      <div class="text-center max-w-xl mx-auto mb-12 space-y-2">
        <h2 class="text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white tracking-tight">
          Nuestras Soluciones Digitales
        </h2>
        <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Elegí el modelo que mejor se adapte al rubro y a las necesidades de tu comercio.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <!-- SOLUCIÓN 1: E-COMMERCE & CATÁLOGO WHATSAPP -->
        <div class="bg-white dark:bg-[#14171F] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
                🛒
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Demo en Vivo
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                1. Catálogo & E-commerce WhatsApp
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                Ideal para <strong>almacenes, kioscos, fiambrerías y dietéticas</strong>. Tus clientes eligen productos con fotos y te mandan el pedido listo a tu WhatsApp con total y dirección.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Carrito con cálculo de delivery
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Carga de precios masiva con Excel (.xlsx)
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Selector de rubros y modo oscuro
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Sin apps que instalar para el cliente
              </li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <a
              href="${ECOMMERCE_DEMO_URL}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95"
            >
              <span>Abrir Demo de E-commerce</span>
              <span>→</span>
            </a>
            <p class="text-[10px] text-center text-neutral-400">
              Catálogo interactivo con carrito y WhatsApp
            </p>
          </div>
        </div>

        <!-- SOLUCIÓN 2: LANDING PAGE GASTRONÓMICA / SERVICIOS -->
        <div class="bg-white dark:bg-[#14171F] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
                🍷
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Demo en Vivo
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                2. Landing Page Gastronómica & Menú
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                Diseñada para <strong>rotiserías, pizzerías, cafeterías y restaurantes</strong>. Muestra tu carta visual, menú del día, fotos del local, opiniones y botón de reservas.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Carta / Menú digital interactivo
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Botón directo para reservar mesa
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Integración con Google Maps y Reseñas
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Posicionamiento SEO de cercanía
              </li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <a
              href="${LANDING_DEMO_URL}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95"
            >
              <span>Abrir Demo Landing Page</span>
              <span>→</span>
            </a>
            <p class="text-[10px] text-center text-neutral-400">
              Menú interactivo y reservas
            </p>
          </div>
        </div>

        <!-- SOLUCIÓN 3: SISTEMA DE TURNOS ONLINE (BARBERÍA & ESTÉTICA) -->
        <div class="bg-white dark:bg-[#14171F] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl">
                💈
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300">
                Demo en Vivo
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                3. Turnos Online Barbería & Estética
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                Para <strong>barberías, peluquerías, salones de estética y consultorios</strong>. Tus clientes eligen profesional, servicio, día y horario sin esperas.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Reserva por profesional y servicio
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Grilla de horarios interactiva
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> Confirmación directa a WhatsApp
              </li>
              <li class="flex items-center gap-2">
                <span class="text-emerald-500 font-bold">✓</span> 0% comisiones mensuales
              </li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <a
              href="${BARBERIA_DEMO_URL}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-semibold text-xs text-center flex items-center justify-center gap-2 hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-sm active:scale-95"
            >
              <span>Abrir Demo de Turnos</span>
              <span>→</span>
            </a>
            <p class="text-[10px] text-center text-neutral-400">
              Barbería & estética sin intermediarios
            </p>
          </div>
        </div>

        <!-- SOLUCIÓN 4: SOFTWARE DE CAJA & POS LOCAL -->
        <div class="bg-white dark:bg-[#14171F] rounded-3xl p-6 sm:p-7 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <div class="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl">
                💻
              </div>
              <span class="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300">
                POS Mostrador
              </span>
            </div>

            <div>
              <h3 class="text-lg font-bold text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                4. Software de Caja & POS Local
              </h3>
              <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-2 leading-relaxed">
                Para cobrar rápido en el mostrador físico del local. <strong>Funciona sin conexión a internet</strong> con lector de código de barras USB y control de caja diario.
              </p>
            </div>

            <ul class="space-y-2 text-xs text-neutral-600 dark:text-neutral-400 pt-2 border-t border-neutral-100 dark:border-neutral-800">
              <li class="flex items-center gap-2">
                <span class="text-indigo-500 font-bold">✓</span> 100% Offline (no depende de internet)
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-500 font-bold">✓</span> Compatible con lectores de código de barras
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-500 font-bold">✓</span> Control de stock y alerta de reposición
              </li>
              <li class="flex items-center gap-2">
                <span class="text-indigo-500 font-bold">✓</span> Arqueo de caja y totales al cierre
              </li>
            </ul>
          </div>

          <div class="pt-6 mt-6 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
            <a
              href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Me interesa conocer más sobre el Sistema de Caja y POS para mi local.')}"
              target="_blank"
              class="w-full py-3 px-4 rounded-xl border border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600 text-neutral-800 dark:text-neutral-200 font-semibold text-xs text-center flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span>Consultar por el POS</span>
              <span>💬</span>
            </a>
            <p class="text-[10px] text-center text-neutral-400">
              Instalación local en PC del comercio
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECCIÓN: PARA QUIÉNES ESTÁ PENSADO (RUBROS & NEGOCIOS) -->
    <section id="rubros" class="max-w-7xl mx-auto px-4 sm:px-6 py-16 scroll-mt-20 border-t border-neutral-100 dark:border-neutral-800/60">
      <div class="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50">
          ✨ 100% Adaptable a tu modelo de trabajo
        </span>
        <h2 class="text-2xl sm:text-4xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
          ¿Para qué tipo de comercios está pensado?
        </h2>
        <p class="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed">
          No importa qué vendas ni el tamaño de tu local: desarrollamos soluciones personalizadas que resuelven los problemas diarios de atención, pedidos y turnos.
        </p>
      </div>

      <!-- Grilla interactiva y visual de rubros -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <!-- 1. Estética y Belleza -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">💅</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-pink-50 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 border border-pink-200 dark:border-pink-800/60">
                Turnos Online
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Estética, Barberías & Belleza
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Nailbars, peluquerías, barberías, centros de depilación, spas, estudios de tatuajes y masajes.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Los clientes reservan horario y profesional directamente desde el celular sin llamadas ni esperas.
            </div>
          </div>
        </div>

        <!-- 2. Gastronomía -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🍕</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60">
                Menú & Pedidos
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Gastronomía, Bares & Rotiserías
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Restaurantes, pizzerías, cafeterías, cervecerías, hamburgueserías y food trucks.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Carta digital visual con fotos, botón de reservas y pedidos por WhatsApp con cálculo de delivery.
            </div>
          </div>
        </div>

        <!-- 3. Comercios de Barrio y Retail -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🛒</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60">
                Catálogo WhatsApp
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Comercios de Barrio & Retail
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Almacenes, kioscos, dietéticas, fiambrerías, tiendas de ropa y ferreterías de barrio.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Catálogo autogestionado con Excel (.xlsx), carrito ágil y cobro en mostrador con POS offline.
            </div>
          </div>
        </div>

        <!-- 4. Deportes y Recreación -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🎾</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60">
                Canchas & Cupos
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Deportes & Recreación
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Alquiler de canchas (fútbol, pádel, tenis), gimnasios, boxes de crossfit, yoga y pilates.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Reserva por franja horaria, gestión de señas y cupos máximos por clase en tiempo real.
            </div>
          </div>
        </div>

        <!-- 5. Mascotas y Veterinaria -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🐾</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-800/60">
                Agenda de Pacientes
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Mascotas & Veterinarias
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Peluquerías caninas, clínicas veterinarias, pet shops y guarderías.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Agendamiento de turnos para baño, corte y consultas clínicas con datos de la mascota.
            </div>
          </div>
        </div>

        <!-- 6. Talleres & Automotor -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🚗</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-cyan-50 dark:bg-cyan-950/60 text-cyan-600 dark:text-cyan-400 border border-cyan-200 dark:border-cyan-800/60">
                Service & Talleres
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Talleres & Servicios Automotores
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Talleres mecánicos, lavaderos de autos premium, lubricentros y gomerías.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Turnos ordenados para service y mantenimientos, evitando autos acumulados en el taller.
            </div>
          </div>
        </div>

        <!-- 7. Productoras de Eventos y Boliches -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🎟️</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800/60">
                Acreditación QR
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Eventos, Fiestas & Boliches
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Salones de fiestas infantiles, productoras de eventos, boliches y recitales locales.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Venta de entradas, reserva de fechas con seña y validación rápida de accesos con QR en puerta.
            </div>
          </div>
        </div>

        <!-- 8. Electrónica, Tecnología & Reparaciones -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">🛠️</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60">
                Servicio Técnico
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Tecnología & Reparaciones
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Service de celulares, locales de informática, electrónica y reparación de electrodomésticos.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Registro de equipos en reparación, estado del servicio para el cliente y control de garantías.
            </div>
          </div>
        </div>

        <!-- 9. Mayoristas y Distribuidores B2B -->
        <div class="bg-white dark:bg-[#14171F] p-6 rounded-2xl border border-neutral-200/80 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all shadow-sm hover:shadow-md flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">📦</span>
              <span class="text-[11px] font-bold px-2.5 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200 dark:border-teal-800/60">
                Portal B2B
              </span>
            </div>
            <h3 class="text-base font-bold text-neutral-900 dark:text-white">
              Mayoristas & Distribuidores
            </h3>
            <p class="text-xs text-neutral-400 dark:text-neutral-400 mt-1">
              Proveedores de insumos gastronómicos, bebidas, artículos de limpieza y packaging.
            </p>
            <div class="mt-4 pt-3 border-t border-neutral-100 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-300">
              <strong class="text-neutral-900 dark:text-white font-semibold">Beneficio:</strong> Catálogo privado para clientes recurrentes que compran por bulto o lista de precios especial.
            </div>
          </div>
        </div>

      </div>

      <!-- BANNER DESTACADO: ¿NO VES TU RUBRO? DESARROLLO A MEDIDA -->
      <div class="mt-10 bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 dark:from-[#181B24] dark:to-[#12141A] rounded-3xl p-8 sm:p-10 border border-neutral-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
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
            class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white text-neutral-900 font-bold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-md active:scale-95 text-center"
          >
            <span>💬</span>
            <span>Consultar por mi rubro</span>
            <span>→</span>
          </a>
        </div>
      </div>
    </section>



    <!-- FOOTER / CTA FINAL -->
    <footer class="bg-white dark:bg-[#0E1015] border-t border-neutral-200 dark:border-neutral-800 py-12 px-4 sm:px-6 mt-12 text-center transition-colors">
      <div class="max-w-xl mx-auto space-y-4">
        <h3 class="text-xl font-bold text-neutral-900 dark:text-white">
          ¿Listo para digitalizar tu negocio?
        </h3>
        <p class="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
          Enviame un mensaje por WhatsApp, contame qué rubro tenés y coordinamos la propuesta para tu negocio.
        </p>
        <a
          href="https://wa.me/${WHATSAPP_CONSULTA}?text=${encodeURIComponent('Hola! Quiero digitalizar mi local. ¿Podemos coordinar?')}"
          target="_blank"
          class="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
        >
          <span>💬</span>
          <span>Escribinos al WhatsApp</span>
        </a>

        <div class="pt-8 text-[11px] text-neutral-400">
          © 2026 Soluciones Digitales para Comercios
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
