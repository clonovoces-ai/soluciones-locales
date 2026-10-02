// Cotizador & Tarifario Online en Vivo con Dólar Blue en Tiempo Real
let isDarkMode = true;

interface RubroTarifa {
  id: string;
  name: string;
  icon: string;
  solucion: string;
  anclaje: string;
  usdSetup: number;
  usdAbono: number;
  usdEntradaSetup: number;
  usdEntradaAbono: number;
  demoUrl: string;
}

const RUBROS_DATA: RubroTarifa[] = [
  {
    id: 'petshop',
    name: 'Pet Shops & Peluquerías Caninas',
    icon: '🐶',
    solucion: 'E-commerce WhatsApp & Turnos Peluquería por Tamaño',
    anclaje: '1 bolsa Royal Canin 7.5kg (~$85.000) o 2 baños',
    usdSetup: 42,
    usdAbono: 10,
    usdEntradaSetup: 20,
    usdEntradaAbono: 10,
    demoUrl: 'https://petshop.adrianschuster.com.ar/'
  },
  {
    id: 'unas',
    name: 'Estudios de Uñas & Belleza',
    icon: '💅',
    solucion: 'Turnos Online por Especialista, Fecha y Servicio',
    anclaje: '2 servicios de kapping o esculpidas (~$60.000 - $70.000)',
    usdSetup: 32,
    usdAbono: 8,
    usdEntradaSetup: 16,
    usdEntradaAbono: 8,
    demoUrl: 'https://unas.adrianschuster.com.ar/'
  },
  {
    id: 'barberia',
    name: 'Barberías & Peluquerías',
    icon: '💈',
    solucion: 'Turnos Online por Barbero y Franja Horaria',
    anclaje: '3 cortes de cabello estándar (~$50.000 - $60.000)',
    usdSetup: 29,
    usdAbono: 8,
    usdEntradaSetup: 13,
    usdEntradaAbono: 8,
    demoUrl: 'https://turnos.adrianschuster.com.ar/'
  },
  {
    id: 'gastronomia',
    name: 'Gastronomía & Rotiserías',
    icon: '🍕',
    solucion: 'Carta Digital + Delivery WhatsApp (0% comisiones)',
    anclaje: '3 pizzas de muzzarella (~$60.000) o 2 pedidos familiares',
    usdSetup: 38,
    usdAbono: 10,
    usdEntradaSetup: 16,
    usdEntradaAbono: 10,
    demoUrl: 'https://landing.adrianschuster.com.ar/'
  },
  {
    id: 'retail',
    name: 'Comercios de Barrio / Retail (Almacén, Dietética)',
    icon: '🛒',
    solucion: 'Catálogo Web con Carrito + Carga con Excel',
    anclaje: '2 a 3 compras promedio de barrio (~$70.000)',
    usdSetup: 42,
    usdAbono: 10,
    usdEntradaSetup: 20,
    usdEntradaAbono: 10,
    demoUrl: 'https://sd.adrianschuster.com.ar/'
  },
  {
    id: 'pos',
    name: 'Software de Caja & POS Local',
    icon: '💻',
    solucion: 'Control de Stock, Caja Diaria y Código de Barras (Offline)',
    anclaje: 'Equivale a 2 días de cobro o control de mermas de stock',
    usdSetup: 55,
    usdAbono: 0,
    usdEntradaSetup: 55,
    usdEntradaAbono: 0,
    demoUrl: 'https://sd.adrianschuster.com.ar/'
  }
];

interface AppState {
  dollarBuy: number;
  dollarSell: number;
  dollarLiveSell: number;
  lastUpdated: string;
  isLoadingDollar: boolean;
  isManualMode: boolean;
  roundToThousands: boolean;
  toastMessage: string | null;
  clientsSim: { [id: string]: { setups: number; abonos: number } };
}

const state: AppState = {
  dollarBuy: 1535,
  dollarSell: 1555,
  dollarLiveSell: 1555,
  lastUpdated: 'Cargando...',
  isLoadingDollar: false,
  isManualMode: false,
  roundToThousands: true,
  toastMessage: null,
  clientsSim: {
    petshop: { setups: 3, abonos: 2 },
    unas: { setups: 4, abonos: 3 },
    barberia: { setups: 3, abonos: 2 },
    gastronomia: { setups: 2, abonos: 2 },
    retail: { setups: 2, abonos: 1 },
    pos: { setups: 1, abonos: 0 }
  }
};

async function fetchDollarLive() {
  state.isLoadingDollar = true;
  render();

  try {
    // 1. Intentar con DolarApi
    const res = await fetch('https://dolarapi.com/v1/dolares/blue', { cache: 'no-store' });
    if (!res.ok) throw new Error('DolarApi failed');
    const data = await res.json();
    
    if (data && data.venta) {
      state.dollarSell = Number(data.venta);
      state.dollarLiveSell = Number(data.venta);
      state.dollarBuy = Number(data.compra) || Number(data.venta) - 20;
      state.isManualMode = false;
      const d = data.fechaActualizacion ? new Date(data.fechaActualizacion) : new Date();
      state.lastUpdated = `${d.toLocaleDateString('es-AR')} ${d.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit' })}`;
    }
  } catch (err) {
    // 2. Fallback con Bluelytics
    try {
      const res2 = await fetch('https://api.bluelytics.com.ar/v2/latest', { cache: 'no-store' });
      const data2 = await res2.json();
      if (data2 && data2.blue) {
        state.dollarSell = Number(data2.blue.value_sell);
        state.dollarLiveSell = Number(data2.blue.value_sell);
        state.dollarBuy = Number(data2.blue.value_buy);
        state.isManualMode = false;
        state.lastUpdated = 'Recién (Bluelytics)';
      }
    } catch (err2) {
      // Dejar valor predeterminado si no hay conexión
      state.lastUpdated = 'Predeterminado ($1.555)';
    }
  } finally {
    state.isLoadingDollar = false;
    render();
  }
}

function calculateArs(usd: number): number {
  if (usd <= 0) return 0;
  const raw = usd * state.dollarSell;
  if (!state.roundToThousands) {
    return Math.round(raw);
  }
  // Redondeo inteligente a miles
  if (raw >= 30000) {
    return Math.round(raw / 1000) * 1000;
  }
  // Para valores más chicos, redondear al múltiplo de 500 más cercano
  return Math.round(raw / 500) * 500;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 0
  }).format(amount);
}

function showToast(msg: string) {
  state.toastMessage = msg;
  render();
  setTimeout(() => {
    state.toastMessage = null;
    render();
  }, 3500);
}

function copyPitch(rubro: RubroTarifa) {
  const pSetup = formatCurrency(calculateArs(rubro.usdSetup));
  const pEntrada = formatCurrency(calculateArs(rubro.usdEntradaSetup));
  const pAbono = formatCurrency(calculateArs(rubro.usdAbono));

  let pitchText = '';
  if (rubro.usdAbono > 0) {
    pitchText = `¡Hola! Mirá, como trabajo directo con comercios de la zona sin intermediarios, te paso las dos opciones accesibles que tenemos:\n\n` +
      `• Opción 1 (Sin abonos): ${pSetup} final (pago único). Te lo dejo 100% personalizado con tu logo, servicios/turnos y tu WhatsApp listo para usar. No pagás nunca más nada.\n` +
      `• Opción 2 (Con soporte): ${pEntrada} de inicio + ${pAbono} por mes (me mandás los cambios de precios o fotos por WhatsApp y te los actualizo yo).\n\n` +
      `Te lo entrego funcionando en 24 a 48 hs. ¿Cuál de las dos opciones te queda más cómoda?`;
  } else {
    pitchText = `¡Hola! Mirá, la instalación y configuración del Sistema de Caja y POS para tu local es de ${pSetup} final (pago único).\n\n` +
      `Te lo dejo instalado en tu máquina con lector de código de barras, control de stock y arqueo diario. Funciona 100% sin internet y no pagás abonos mensuales.\n\n` +
      `¿Te gustaría coordinar la instalación?`;
  }

  navigator.clipboard.writeText(pitchText).then(() => {
    showToast(`✓ Mensaje copiado con precios de hoy (${pSetup})`);
  }).catch(() => {
    showToast('Error al copiar al portapapeles');
  });
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

  // Cálculos simulador
  let totalSetupArs = 0;
  let totalAbonoArs = 0;
  let totalClientsSetup = 0;
  let totalClientsAbono = 0;

  RUBROS_DATA.forEach(r => {
    const sim = state.clientsSim[r.id] || { setups: 0, abonos: 0 };
    totalClientsSetup += sim.setups;
    totalClientsAbono += sim.abonos;
    totalSetupArs += calculateArs(r.usdSetup) * sim.setups;
    totalAbonoArs += calculateArs(r.usdAbono) * sim.abonos;
  });

  const totalTrimestral = totalSetupArs + (totalAbonoArs * 3);

  app.innerHTML = `
    <!-- Topbar / Header -->
    <header class="sticky top-0 z-40 bg-white/95 dark:bg-[#0E1015]/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-colors">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-base shadow-sm group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <span class="font-extrabold text-sm sm:text-base tracking-tight text-neutral-900 dark:text-white block leading-tight">
              Cotizador & Tarifario en Vivo
            </span>
            <span class="text-[11px] text-neutral-400 block -mt-0.5">Soluciones Digitales • Dólar Hoy</span>
          </div>
        </a>

        <div class="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            class="text-xs font-semibold text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white px-3 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors hidden sm:inline-block"
          >
            ← Volver al Portal
          </a>

          <button
            id="theme-toggle-btn"
            class="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 flex items-center justify-center text-sm transition-all active:scale-95"
            title="Cambiar tema"
          >
            ${isDarkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </div>
    </header>

    <!-- Toast Notification Flotante -->
    ${state.toastMessage ? `
      <div class="fixed top-20 right-4 sm:right-6 z-50 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs sm:text-sm font-bold animate-in fade-in slide-in-from-top-4 duration-200">
        <span>💬</span>
        <span>${state.toastMessage}</span>
      </div>
    ` : ''}

    <main class="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex-grow w-full space-y-8">
      
      <!-- HERO / PANEL DE COTIZACIÓN DEL DÓLAR BLUE -->
      <section class="bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-800 dark:from-[#141720] dark:to-[#0D1017] rounded-3xl p-6 sm:p-8 text-white border border-neutral-800 shadow-xl relative overflow-hidden">
        <div class="absolute -right-16 -top-16 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div class="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          
          <div class="space-y-2">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${state.isManualMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}">
              <span class="w-2 h-2 rounded-full ${state.isManualMode ? 'bg-amber-400' : 'bg-emerald-400 animate-ping'}"></span>
              <span>${state.isManualMode ? '⚙️ Modo Simulación Manual' : '🟢 Dólar Blue en Tiempo Real (DolarHoy)'}</span>
            </div>
            
            <h1 class="text-2xl sm:text-4xl font-black tracking-tight">
              Precios al Dólar del Momento
            </h1>
            <p class="text-xs sm:text-sm text-neutral-300 max-w-xl leading-relaxed">
              Tus precios se recalculan automáticamente según la cotización del Dólar Blue. Si el dólar sube o baja, copiás el mensaje con la cifra exacta del día.
            </p>
          </div>

          <!-- Card Cotización Dólar -->
          <div class="bg-white/10 dark:bg-black/30 backdrop-blur-md rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row sm:items-center gap-6">
            
            <!-- Compra / Venta -->
            <div class="flex items-center gap-5">
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Compra</span>
                <span class="text-lg sm:text-xl font-bold text-neutral-200">
                  ${formatCurrency(state.dollarBuy)}
                </span>
              </div>
              <div class="w-px h-10 bg-white/10"></div>
              <div>
                <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">Venta (Base Precios)</span>
                <span class="text-3xl sm:text-4xl font-black text-emerald-400 flex items-center gap-2">
                  ${formatCurrency(state.dollarSell)}
                </span>
              </div>
            </div>

            <!-- Botón Actualizar -->
            <button
              id="btn-refresh-dollar"
              class="px-4 py-2.5 rounded-xl bg-white text-neutral-900 font-bold text-xs flex items-center justify-center gap-2 hover:bg-neutral-100 transition-all active:scale-95 shadow-md flex-shrink-0"
              ${state.isLoadingDollar ? 'disabled' : ''}
            >
              <span>${state.isLoadingDollar ? '⏳' : '🔄'}</span>
              <span>${state.isLoadingDollar ? 'Consultando...' : 'Actualizar'}</span>
            </button>
          </div>
        </div>

        <!-- Barra inferior de control: Ajuste manual y redondeo -->
        <div class="mt-6 pt-5 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-4 text-xs">
          
          <!-- Ajuste manual rápido de dólar -->
          <div class="flex items-center gap-2 flex-wrap">
            <span class="text-neutral-400 font-medium">Ajustar cotización:</span>
            <button class="btn-adjust-dollar px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold active:scale-95" data-delta="-50">- $50</button>
            <button class="btn-adjust-dollar px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold active:scale-95" data-delta="-10">- $10</button>
            <input
              type="number"
              id="input-dollar-manual"
              value="${state.dollarSell}"
              class="w-24 px-2 py-1 rounded-lg bg-neutral-800 border border-neutral-700 text-white font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
            <button class="btn-adjust-dollar px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold active:scale-95" data-delta="10">+ $10</button>
            <button class="btn-adjust-dollar px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold active:scale-95" data-delta="50">+ $50</button>
            
            ${state.isManualMode ? `
              <button
                id="btn-reset-dollar"
                class="px-2.5 py-1 rounded-lg bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-600/50 font-bold"
              >
                Volver a Dólar en Vivo ($${state.dollarLiveSell})
              </button>
            ` : ''}
          </div>

          <!-- Switch Redondeo -->
          <div class="flex items-center gap-2">
            <label class="flex items-center gap-2 cursor-pointer select-none text-neutral-300">
              <input
                type="checkbox"
                id="checkbox-round"
                ${state.roundToThousands ? 'checked' : ''}
                class="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-400 accent-emerald-500"
              />
              <span>Redondear precios a números limpios (miles)</span>
            </label>
          </div>
        </div>

        <div class="mt-2 text-[10px] text-neutral-400 flex items-center justify-between">
          <span>Última lectura: ${state.lastUpdated}</span>
          <span>Fuentes: DolarApi.com / Bluelytics / DolarHoy</span>
        </div>
      </section>

      <!-- GRILLA DE RUBROS Y TARIFAS -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight">
              Tarifario por Rubro & Respuestas Rápidas
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400">
              Hacé clic en <strong>"Copiar Respuesta WhatsApp"</strong> para pegar el presupuesto actualizado en el chat con el comerciante.
            </p>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          ${RUBROS_DATA.map(r => {
            const setupArs = calculateArs(r.usdSetup);
            const entradaSetupArs = calculateArs(r.usdEntradaSetup);
            const entradaAbonoArs = calculateArs(r.usdEntradaAbono);

            return `
              <div class="bg-white dark:bg-[#141720] rounded-3xl p-6 border border-neutral-200/80 dark:border-neutral-800 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
                
                <div class="space-y-4">
                  <!-- Header Card -->
                  <div class="flex items-start justify-between gap-3">
                    <div class="flex items-center gap-3">
                      <span class="text-3xl p-2.5 rounded-2xl bg-neutral-100 dark:bg-neutral-800/80 group-hover:scale-110 transition-transform">
                        ${r.icon}
                      </span>
                      <div>
                        <h3 class="font-extrabold text-sm sm:text-base text-neutral-900 dark:text-white leading-tight">
                          ${r.name}
                        </h3>
                        <span class="text-[11px] text-neutral-400 font-medium block mt-0.5">
                          ${r.solucion}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Anclaje mental -->
                  <div class="p-3 rounded-2xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900/50 text-[11px] text-emerald-900 dark:text-emerald-300 leading-snug">
                    <strong class="font-bold">Anclaje de valor:</strong> ${r.anclaje}
                  </div>

                  <!-- Bloque de Precios en Vivo -->
                  <div class="space-y-2.5 pt-2 border-t border-neutral-100 dark:border-neutral-800">
                    
                    <!-- Opción 1: Setup Pago Único -->
                    <div class="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                      <div>
                        <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Opción 1: Pago Único</span>
                        <span class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">USD ${r.usdSetup}</span>
                      </div>
                      <div class="text-right">
                        <span class="text-lg font-black text-neutral-900 dark:text-white block">
                          ${formatCurrency(setupArs)}
                        </span>
                        <span class="text-[9px] text-emerald-600 dark:text-emerald-400 font-bold">Sin abonos nunca</span>
                      </div>
                    </div>

                    <!-- Opción 2: Plan Entrada con Abono -->
                    ${r.usdAbono > 0 ? `
                      <div class="flex items-center justify-between p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800">
                        <div>
                          <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Opción 2: Con Abono</span>
                          <span class="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium">USD ${r.usdEntradaSetup} + USD ${r.usdEntradaAbono}/m</span>
                        </div>
                        <div class="text-right">
                          <span class="text-sm font-bold text-neutral-900 dark:text-white block">
                            ${formatCurrency(entradaSetupArs)}
                          </span>
                          <span class="text-[10px] text-neutral-500 dark:text-neutral-400 font-semibold block">
                            + ${formatCurrency(entradaAbonoArs)} / mes
                          </span>
                        </div>
                      </div>
                    ` : `
                      <div class="p-3 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50 text-[11px] text-indigo-900 dark:text-indigo-300">
                        Instalación local única. No requiere abono mensual.
                      </div>
                    `}
                  </div>
                </div>

                <!-- Footer Card: Botón Copiar Pitch y Ver Demo -->
                <div class="pt-5 mt-5 border-t border-neutral-100 dark:border-neutral-800 space-y-2">
                  <button
                    class="btn-copy-pitch w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                    data-id="${r.id}"
                  >
                    <span>📋</span>
                    <span>Copiar Respuesta WhatsApp</span>
                  </button>

                  <a
                    href="${r.demoUrl}"
                    target="_blank"
                    class="w-full py-2 px-3 rounded-xl border border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600 text-neutral-700 dark:text-neutral-300 font-semibold text-[11px] text-center flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Abrir Demo en Vivo</span>
                    <span>→</span>
                  </a>
                </div>

              </div>
            `;
          }).join('')}
        </div>
      </section>

      <!-- SIMULADOR INTERACTIVO DE FACTURACIÓN -->
      <section class="bg-white dark:bg-[#141720] rounded-3xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-5">
          <div>
            <h2 class="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <span>🧮</span>
              <span>Simulador de Ingresos y Facturación</span>
            </h2>
            <p class="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
              Estimá tus ingresos modificando la cantidad de comercios que cerrás en cada rubro.
            </p>
          </div>

          <div class="flex items-center gap-4 text-xs font-bold text-neutral-500 dark:text-neutral-400">
            <span>${totalClientsSetup} clientes de Setup</span>
            <span>•</span>
            <span>${totalClientsAbono} clientes recurrentes</span>
          </div>
        </div>

        <!-- Tabla interactiva del simulador -->
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-neutral-100 dark:border-neutral-800 text-[11px] uppercase tracking-wider text-neutral-400">
                <th class="py-3 px-3">Rubro</th>
                <th class="py-3 px-3 text-right">Precio Setup</th>
                <th class="py-3 px-3 text-center">Clientes Setup</th>
                <th class="py-3 px-3 text-right">Subtotal Setups</th>
                <th class="py-3 px-3 text-right">Abono/mes</th>
                <th class="py-3 px-3 text-center">Clientes Abono</th>
                <th class="py-3 px-3 text-right">MRR (Mensual)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-neutral-100 dark:divide-neutral-800/60 font-medium">
              ${RUBROS_DATA.map(r => {
                const sim = state.clientsSim[r.id] || { setups: 0, abonos: 0 };
                const setupArs = calculateArs(r.usdSetup);
                const abonoArs = calculateArs(r.usdAbono);
                const subSetup = setupArs * sim.setups;
                const subAbono = abonoArs * sim.abonos;

                return `
                  <tr class="hover:bg-neutral-50/60 dark:hover:bg-neutral-800/30 transition-colors">
                    <td class="py-3 px-3 font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                      <span>${r.icon}</span>
                      <span>${r.name}</span>
                    </td>
                    <td class="py-3 px-3 text-right text-neutral-500 dark:text-neutral-400">
                      ${formatCurrency(setupArs)}
                    </td>
                    <td class="py-3 px-3">
                      <div class="flex items-center justify-center gap-1.5">
                        <button class="btn-step-sim w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center" data-id="${r.id}" data-type="setups" data-delta="-1">-</button>
                        <span class="w-6 text-center font-bold text-neutral-900 dark:text-white">${sim.setups}</span>
                        <button class="btn-step-sim w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center" data-id="${r.id}" data-type="setups" data-delta="1">+</button>
                      </div>
                    </td>
                    <td class="py-3 px-3 text-right font-bold text-neutral-900 dark:text-white">
                      ${formatCurrency(subSetup)}
                    </td>
                    <td class="py-3 px-3 text-right text-neutral-500 dark:text-neutral-400">
                      ${r.usdAbono > 0 ? formatCurrency(abonoArs) : '-'}
                    </td>
                    <td class="py-3 px-3">
                      ${r.usdAbono > 0 ? `
                        <div class="flex items-center justify-center gap-1.5">
                          <button class="btn-step-sim w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center" data-id="${r.id}" data-type="abonos" data-delta="-1">-</button>
                          <span class="w-6 text-center font-bold text-neutral-900 dark:text-white">${sim.abonos}</span>
                          <button class="btn-step-sim w-6 h-6 rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 font-bold hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center" data-id="${r.id}" data-type="abonos" data-delta="1">+</button>
                        </div>
                      ` : '<span class="text-center block text-neutral-400">-</span>'}
                    </td>
                    <td class="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">
                      ${r.usdAbono > 0 ? formatCurrency(subAbono) : '-'}
                    </td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>

        <!-- Cajas Resumen de Totales -->
        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
          <div class="p-5 rounded-2xl bg-neutral-50 dark:bg-neutral-900/60 border border-neutral-100 dark:border-neutral-800 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">Facturación Setups Iniciales</span>
            <span class="text-2xl font-black text-neutral-900 dark:text-white block">
              ${formatCurrency(totalSetupArs)}
            </span>
            <span class="text-[11px] text-neutral-500">Cobro único de puesta en marcha</span>
          </div>

          <div class="p-5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-100 dark:border-emerald-900/60 space-y-1">
            <span class="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block">Ingreso Recurrente (MRR)</span>
            <span class="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">
              ${formatCurrency(totalAbonoArs)} / mes
            </span>
            <span class="text-[11px] text-emerald-800/80 dark:text-emerald-300/80">Ingreso fijo pasivo mensual</span>
          </div>

          <div class="p-5 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 space-y-1 shadow-lg">
            <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500 block">Proyección 3 Meses</span>
            <span class="text-2xl font-black block">
              ${formatCurrency(totalTrimestral)}
            </span>
            <span class="text-[11px] text-neutral-300 dark:text-neutral-600">Setups iniciales + 3 meses de abonos</span>
          </div>
        </div>

      </section>

    </main>

    <!-- Footer -->
    <footer class="border-t border-neutral-200 dark:border-neutral-800 py-8 px-4 text-center text-xs text-neutral-400">
      <div class="max-w-xl mx-auto space-y-2">
        <p>© 2026 Soluciones Digitales • Desarrollado por Adrián Schuster</p>
        <p class="text-[11px] text-neutral-500">Cotizaciones sincronizadas en tiempo real con DolarHoy / DolarApi</p>
      </div>
    </footer>
  `;

  // Attach event listeners
  const themeBtn = document.getElementById('theme-toggle-btn');
  if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

  const refreshBtn = document.getElementById('btn-refresh-dollar');
  if (refreshBtn) refreshBtn.addEventListener('click', fetchDollarLive);

  const roundCheckbox = document.getElementById('checkbox-round') as HTMLInputElement;
  if (roundCheckbox) {
    roundCheckbox.addEventListener('change', (e) => {
      state.roundToThousands = (e.target as HTMLInputElement).checked;
      render();
    });
  }

  // Ajustes de dólar por delta
  document.querySelectorAll('.btn-adjust-dollar').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const delta = Number((e.currentTarget as HTMLElement).dataset.delta) || 0;
      state.dollarSell = Math.max(100, state.dollarSell + delta);
      state.isManualMode = true;
      render();
    });
  });

  const manualInput = document.getElementById('input-dollar-manual') as HTMLInputElement;
  if (manualInput) {
    manualInput.addEventListener('change', (e) => {
      const val = Number((e.target as HTMLInputElement).value);
      if (val > 0) {
        state.dollarSell = val;
        state.isManualMode = true;
        render();
      }
    });
  }

  const resetDollarBtn = document.getElementById('btn-reset-dollar');
  if (resetDollarBtn) {
    resetDollarBtn.addEventListener('click', () => {
      state.dollarSell = state.dollarLiveSell;
      state.isManualMode = false;
      render();
    });
  }

  // Botones Copiar Pitch
  document.querySelectorAll('.btn-copy-pitch').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const rubroId = (e.currentTarget as HTMLElement).dataset.id;
      const rubro = RUBROS_DATA.find(r => r.id === rubroId);
      if (rubro) copyPitch(rubro);
    });
  });

  // Botones Stepper Simulador
  document.querySelectorAll('.btn-step-sim').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget as HTMLElement;
      const rubroId = target.dataset.id!;
      const simType = target.dataset.type as 'setups' | 'abonos';
      const delta = Number(target.dataset.delta) || 0;

      if (!state.clientsSim[rubroId]) {
        state.clientsSim[rubroId] = { setups: 0, abonos: 0 };
      }
      state.clientsSim[rubroId][simType] = Math.max(0, state.clientsSim[rubroId][simType] + delta);
      render();
    });
  });
}

function init() {
  const savedTheme = localStorage.getItem('hub_theme');
  isDarkMode = savedTheme !== null ? savedTheme === 'dark' : true;
  document.documentElement.classList.toggle('dark', isDarkMode);
  render();
  fetchDollarLive();
}

document.addEventListener('DOMContentLoaded', init);
init();
