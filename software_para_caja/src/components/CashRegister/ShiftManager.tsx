import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatMoney, formatDateTime, formatTimeOnly } from '../../utils/formatters';
import {
  Receipt,
  PlusCircle,
  Lock,
  Unlock,
  AlertTriangle,
  Clock,
  ArrowDownCircle,
  Truck,
  Sparkles,
  DollarSign,
  UserCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { WithdrawalsModal } from './WithdrawalsModal';
import { BlindCloseModal } from './BlindCloseModal';

export const ShiftManager: React.FC = () => {
  const { activeShift, shifts, sales, openShift } = usePOS();

  // Open Shift Form state
  const [cashierName, setCashierName] = useState('Adrian');
  const [shiftType, setShiftType] = useState<'Mañana' | 'Tarde' | 'Noche' | 'Completo'>('Mañana');
  const [initialCash, setInitialCash] = useState<string>('30000');

  // Modals
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showCloseModal, setShowCloseModal] = useState(false);

  const handleOpenShift = (e: React.FormEvent) => {
    e.preventDefault();
    const fund = parseFloat(initialCash) || 0;
    openShift(cashierName.trim() || 'Cajero 1', shiftType, fund);
  };

  // Calculations for active shift
  const shiftSales = activeShift
    ? sales.filter(s => s.shiftId === activeShift.id && !s.isVoided)
    : [];

  const totalShiftSales = shiftSales.reduce((sum, s) => sum + s.total, 0);

  const shiftCashSales = shiftSales.reduce((sum, s) => {
    if (s.payment.method === 'efectivo') return sum + s.total;
    if (s.payment.method === 'mixto') return sum + (s.payment.amountEfectivo || 0);
    return sum;
  }, 0);

  const shiftDigitalSales = shiftSales.reduce((sum, s) => {
    if (s.payment.method !== 'efectivo') {
      if (s.payment.method === 'mixto') return sum + (s.payment.amountDigital || 0);
      return sum + s.total;
    }
    return sum;
  }, 0);

  const totalWithdrawals = activeShift
    ? activeShift.withdrawals.reduce((sum, w) => sum + w.amount, 0)
    : 0;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Active Shift Card or Open Shift Banner */}
      {!activeShift ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl max-w-xl mx-auto">
          <div className="flex items-center gap-3 text-amber-400 mb-4">
            <Lock className="w-8 h-8" />
            <div>
              <h2 className="text-xl font-bold text-white">Caja Cerrada</h2>
              <p className="text-xs text-slate-400">
                Inicie un turno de caja para habilitar el registro de ventas y control de efectivo
              </p>
            </div>
          </div>

          <form onSubmit={handleOpenShift} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Nombre del Cajero / Operador:
              </label>
              <input
                type="text"
                required
                value={cashierName}
                onChange={e => setCashierName(e.target.value)}
                placeholder="Ej: Adrian, María..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-emerald-500 font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Turno de Atención:
                </label>
                <select
                  value={shiftType}
                  onChange={e =>
                    setShiftType(
                      e.target.value as 'Mañana' | 'Tarde' | 'Noche' | 'Completo'
                    )
                  }
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-emerald-500"
                >
                  <option value="Mañana">Turno Mañana</option>
                  <option value="Tarde">Turno Tarde</option>
                  <option value="Noche">Turno Noche</option>
                  <option value="Completo">Turno Completo</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Fondo Inicial (Sencillo):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={initialCash}
                    onChange={e => setInitialCash(e.target.value)}
                    className="w-full pl-7 pr-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-mono font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 transition active:scale-[0.98] cursor-pointer"
            >
              Iniciar y Abrir Turno de Caja
            </button>
          </form>
        </div>
      ) : (
        /* Caja Abierta - Control de Turno Activo */
        <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
                <h2 className="text-xl font-bold text-white">
                  Turno Activo: {activeShift.shiftType}
                </h2>
                <span className="text-xs bg-emerald-500/10 text-emerald-400 font-semibold px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  En Operación
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Operado por <strong className="text-slate-200">{activeShift.cashierName}</strong> • Abierto el {formatDateTime(activeShift.openedAt)}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowWithdrawalModal(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
              >
                <ArrowDownCircle className="w-4 h-4 text-amber-400" />
                <span>Registrar Egreso / Retiro</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCloseModal(true)}
                className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition flex items-center gap-1.5 cursor-pointer"
              >
                <Lock className="w-4 h-4" />
                <span>Arqueo Ciego y Cierre</span>
              </button>
            </div>
          </div>

          {/* Metrics summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Fondo Inicial (Cambio)
              </span>
              <div className="text-2xl font-bold font-mono text-slate-200 mt-1">
                {formatMoney(activeShift.initialCash)}
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Total Ventas del Turno
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatMoney(totalShiftSales)}
              </div>
              <span className="text-[10px] text-slate-500 font-mono">
                {shiftSales.length} tickets emitidos
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Efectivo Cobrado
              </span>
              <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                {formatMoney(shiftCashSales)}
              </div>
              <span className="text-[10px] text-slate-500">
                + Digital: {formatMoney(shiftDigitalSales)}
              </span>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase">
                Egresos / Retiros
              </span>
              <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                -{formatMoney(totalWithdrawals)}
              </div>
              <span className="text-[10px] text-slate-500">
                {activeShift.withdrawals.length} salidas registradas
              </span>
            </div>
          </div>

          {/* Withdrawals list */}
          <div>
            <h3 className="font-bold text-sm text-slate-200 mb-2 flex items-center gap-2">
              <ArrowDownCircle className="w-4 h-4 text-amber-400" />
              <span>Salidas de Efectivo Asentadas en este Turno</span>
            </h3>

            {activeShift.withdrawals.length === 0 ? (
              <p className="text-xs text-slate-500 bg-slate-950/50 p-4 rounded-xl border border-slate-800">
                No se han registrado retiros ni pagos a proveedores en este turno.
              </p>
            ) : (
              <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
                {activeShift.withdrawals.map(w => (
                  <div key={w.id} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className="text-slate-500 font-mono text-[11px]">
                        {formatTimeOnly(w.timestamp)}
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide bg-amber-500/10 text-amber-300 border border-amber-500/20">
                        {w.reasonType.replace('_', ' ')}
                      </span>
                      <span className="text-slate-300 font-medium">
                        {w.description}
                      </span>
                    </div>
                    <span className="font-mono font-bold text-amber-400">
                      -{formatMoney(w.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Historical Closed Shifts */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-400">
            <Receipt className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Historial de Turnos y Arqueos</h3>
          </div>
          <span className="text-xs text-slate-500">
            {shifts.length} {shifts.length === 1 ? 'turno cerrado' : 'turnos cerrados'}
          </span>
        </div>

        {shifts.length === 0 ? (
          <div className="py-8 text-center text-slate-500 text-xs">
            Aún no hay turnos cerrados en el historial.
          </div>
        ) : (
          <div className="divide-y divide-slate-800 bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
            {shifts.map(shift => {
              const diff = shift.cashDifference ?? 0;
              return (
                <div key={shift.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-200">
                        Turno {shift.shiftType} ({shift.cashierName})
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                          diff === 0
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : diff > 0
                            ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                            : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                        }`}
                      >
                        {diff === 0 ? 'Sin diferencia' : diff > 0 ? `+ Sobrante: ${formatMoney(diff)}` : `- Faltante: ${formatMoney(Math.abs(diff))}`}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Abierto: {formatDateTime(shift.openedAt)}
                      {shift.closedAt && ` • Cerrado: ${formatDateTime(shift.closedAt)}`}
                    </p>
                    {shift.notes && (
                      <p className="text-[11px] text-amber-300/80 italic mt-0.5">
                        Nota: "{shift.notes}"
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <span className="text-[10px] text-slate-500 block">Declarado</span>
                      <span className="font-mono font-bold text-slate-200">
                        {formatMoney(shift.declaredCash || 0)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">Esperado</span>
                      <span className="font-mono font-bold text-slate-400">
                        {formatMoney(shift.expectedCash || 0)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modals */}
      {showWithdrawalModal && (
        <WithdrawalsModal onClose={() => setShowWithdrawalModal(false)} />
      )}

      {showCloseModal && (
        <BlindCloseModal onClose={() => setShowCloseModal(false)} />
      )}
    </div>
  );
};
