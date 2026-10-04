import React, { useState, useMemo } from 'react';
import { usePOS } from '../../context/POSContext';
import { Sale } from '../../types';
import { formatMoney, formatDateTime } from '../../utils/formatters';
import {
  BarChart3,
  TrendingUp,
  CreditCard,
  ShoppingBag,
  DollarSign,
  Printer,
  XCircle,
  Eye,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import { ReceiptModal } from '../Checkout/ReceiptModal';

export const MetricsViewer: React.FC = () => {
  const { sales, voidSale } = usePOS();
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [period, setPeriod] = useState<'today' | 'all'>('all');

  const filteredSales = useMemo(() => {
    if (period === 'all') return sales;
    const today = new Date().toISOString().slice(0, 10);
    return sales.filter(s => s.timestamp.startsWith(today));
  }, [sales, period]);

  // Overall calculations
  const activeSales = filteredSales.filter(s => !s.isVoided);
  const totalRevenue = activeSales.reduce((acc, s) => acc + s.total, 0);

  // Estimated gross profit (Sale price - Cost price)
  const totalProfit = activeSales.reduce((acc, s) => {
    const saleProfit = s.items.reduce((sum, item) => {
      const itemCost = item.product.costPrice * item.quantity;
      return sum + (item.subtotal - itemCost);
    }, 0);
    return acc + saleProfit;
  }, 0);

  const profitMarginPercent = totalRevenue > 0 ? Math.round((totalProfit / totalRevenue) * 100) : 0;
  const averageTicket = activeSales.length > 0 ? Math.round(totalRevenue / activeSales.length) : 0;

  // Payment methods breakdown
  const paymentBreakdown = useMemo(() => {
    let cash = 0;
    let qr = 0;
    let card = 0;

    activeSales.forEach(s => {
      if (s.payment.method === 'efectivo') cash += s.total;
      else if (s.payment.method === 'transferencia') qr += s.total;
      else if (s.payment.method === 'debito' || s.payment.method === 'credito') card += s.total;
      else if (s.payment.method === 'mixto') {
        cash += s.payment.amountEfectivo || 0;
        qr += s.payment.amountDigital || 0;
      }
    });

    const total = cash + qr + card || 1;
    return {
      cash,
      cashPct: Math.round((cash / total) * 100),
      qr,
      qrPct: Math.round((qr / total) * 100),
      card,
      cardPct: Math.round((card / total) * 100),
    };
  }, [activeSales]);

  // Top products sold
  const topProducts = useMemo(() => {
    const map = new Map<string, { name: string; brand: string; qty: number; revenue: number }>();
    activeSales.forEach(s => {
      s.items.forEach(item => {
        const id = item.product.id;
        const current = map.get(id) || {
          name: item.product.name,
          brand: item.product.brand,
          qty: 0,
          revenue: 0,
        };
        current.qty += item.quantity;
        current.revenue += item.subtotal;
        map.set(id, current);
      });
    });

    return Array.from(map.values())
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 5);
  }, [activeSales]);

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400">
            <BarChart3 className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">
              Panel de Métricas y Ventas (Dueño)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rendimiento del negocio, cálculo real de ganancia bruta, ticket promedio y reimpresión de comprobantes
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setPeriod('today')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              period === 'today'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Ventas de Hoy
          </button>
          <button
            onClick={() => setPeriod('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              period === 'all'
                ? 'bg-amber-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Histórico Total
          </button>
        </div>
      </div>

      {/* Main KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Total Ingresos */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Total Ventas</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-400">
            {formatMoney(totalRevenue)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            {activeSales.length} comprobantes cobrados
          </span>
        </div>

        {/* Ganancia Bruta */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Ganancia Bruta</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-blue-400">
            {formatMoney(totalProfit)}
          </div>
          <span className="text-[11px] text-emerald-400 font-mono mt-1 block">
            Margen neto promedio: ~{profitMarginPercent}%
          </span>
        </div>

        {/* Ticket Promedio */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Ticket Promedio</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold font-mono text-amber-400">
            {formatMoney(averageTicket)}
          </div>
          <span className="text-[11px] text-slate-500 font-mono mt-1 block">
            Por transacción
          </span>
        </div>

        {/* Medio Dominante */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
            <span className="font-semibold uppercase">Medios de Cobro</span>
            <CreditCard className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xs space-y-1 font-mono mt-1">
            <div className="flex justify-between">
              <span className="text-slate-400">Efectivo:</span>
              <span className="text-emerald-400 font-bold">{paymentBreakdown.cashPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">QR / Transfer:</span>
              <span className="text-sky-400 font-bold">{paymentBreakdown.qrPct}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tarjetas:</span>
              <span className="text-indigo-400 font-bold">{paymentBreakdown.cardPct}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top 5 Products & Cash vs Digital Ratio */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top 5 Products */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl">
          <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Productos Más Vendidos (Rotación)</span>
          </h3>

          {topProducts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">
              No hay ventas en este período para calcular el ranking.
            </p>
          ) : (
            <div className="space-y-2">
              {topProducts.map((p, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold text-[10px] flex items-center justify-center font-mono">
                      #{idx + 1}
                    </span>
                    <div className="truncate">
                      <span className="font-semibold text-slate-200 block truncate">
                        {p.name}
                      </span>
                      {p.brand && (
                        <span className="text-[10px] text-slate-500">
                          {p.brand}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-emerald-400 block">
                      {p.qty} un.
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatMoney(p.revenue)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Visual Progress Ratio */}
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-slate-200 mb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-purple-400" />
              <span>Distribución de Cobros (Físico vs Digital)</span>
            </h3>

            {/* Stacked bar */}
            <div className="h-4 w-full bg-slate-950 rounded-full overflow-hidden flex mb-4">
              <div
                style={{ width: `${paymentBreakdown.cashPct}%` }}
                className="bg-emerald-500 h-full transition-all"
                title={`Efectivo: ${paymentBreakdown.cashPct}%`}
              />
              <div
                style={{ width: `${paymentBreakdown.qrPct}%` }}
                className="bg-sky-500 h-full transition-all"
                title={`Mercado Pago / QR: ${paymentBreakdown.qrPct}%`}
              />
              <div
                style={{ width: `${paymentBreakdown.cardPct}%` }}
                className="bg-indigo-500 h-full transition-all"
                title={`Tarjetas: ${paymentBreakdown.cardPct}%`}
              />
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-emerald-400 font-semibold uppercase block">
                  Efectivo
                </span>
                <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                  {formatMoney(paymentBreakdown.cash)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {paymentBreakdown.cashPct}% del total
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-sky-400 font-semibold uppercase block">
                  Mercado Pago / QR
                </span>
                <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                  {formatMoney(paymentBreakdown.qr)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {paymentBreakdown.qrPct}% del total
                </span>
              </div>

              <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-[10px] text-indigo-400 font-semibold uppercase block">
                  Tarjetas
                </span>
                <span className="font-mono font-bold text-slate-200 mt-0.5 block">
                  {formatMoney(paymentBreakdown.card)}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  {paymentBreakdown.cardPct}% del total
                </span>
              </div>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 mt-4 border-t border-slate-800 pt-3">
            💡 <strong>Tip comercial:</strong> Los cobros en efectivo eliminan cualquier retención digital y fortalecen la liquidez de cambio en mostrador.
          </div>
        </div>
      </div>

      {/* History of internal sales receipts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Historial de Tickets Emitidos</span>
        </h3>

        {filteredSales.length === 0 ? (
          <p className="text-xs text-slate-500 py-6 text-center">
            No se registran tickets en este período.
          </p>
        ) : (
          <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            {filteredSales.map(sale => (
              <div
                key={sale.id}
                className="p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-slate-900/60 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200 text-sm">
                      Ticket #{sale.ticketNumber}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                      {sale.payment.method}
                    </span>
                    {sale.isVoided && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-500/20 text-rose-400 border border-rose-500/30">
                        ANULADO
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {formatDateTime(sale.timestamp)} • Cajero: {sale.cashierName} • {sale.items.length} artículos
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className={`font-mono font-bold text-base ${sale.isVoided ? 'line-through text-slate-600' : 'text-emerald-400'}`}>
                    {formatMoney(sale.total)}
                  </span>

                  <button
                    type="button"
                    onClick={() => setSelectedSale(sale)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
                    title="Ver e imprimir ticket"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {!sale.isVoided && (
                    <button
                      type="button"
                      onClick={() => {
                        const reason = prompt('Indique el motivo de la anulación del ticket:');
                        if (reason && reason.trim()) {
                          voidSale(sale.id, reason.trim());
                        }
                      }}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                      title="Anular ticket (Restaura stock y registra auditoría)"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Receipt Modal for viewing/reprinting */}
      {selectedSale && (
        <ReceiptModal
          sale={selectedSale}
          onClose={() => setSelectedSale(null)}
        />
      )}
    </div>
  );
};
