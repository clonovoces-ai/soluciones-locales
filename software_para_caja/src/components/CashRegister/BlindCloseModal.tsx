import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { CashShift } from '../../types';
import { formatMoney, formatDateTime } from '../../utils/formatters';
import {
  X,
  EyeOff,
  Calculator,
  CheckCircle,
  Printer,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

interface BlindCloseModalProps {
  onClose: () => void;
}

export const BlindCloseModal: React.FC<BlindCloseModalProps> = ({ onClose }) => {
  const { activeShift, closeShiftBlind, settings } = usePOS();

  // Mode: 'count' | 'result'
  const [step, setStep] = useState<'count' | 'result'>('count');
  const [closedResult, setClosedResult] = useState<CashShift | null>(null);

  // Cash denomination counter
  const [billCounts, setBillCounts] = useState<{ [denom: number]: number }>({
    20000: 0,
    10000: 0,
    5000: 0,
    2000: 0,
    1000: 0,
    500: 0,
    200: 0,
    100: 0,
  });

  const [manualTotal, setManualTotal] = useState<string>('');
  const [useManualInput, setUseManualInput] = useState<boolean>(false);
  const [notes, setNotes] = useState<string>('');

  if (!activeShift) return null;

  const calculatedFromBills = Object.entries(billCounts).reduce(
    (sum, [denom, count]) => sum + Number(denom) * (Number(count) || 0),
    0
  );

  const declaredCash = useManualInput
    ? parseFloat(manualTotal) || 0
    : calculatedFromBills;

  const handleBillChange = (denom: number, count: number) => {
    setBillCounts(prev => ({
      ...prev,
      [denom]: Math.max(0, count || 0),
    }));
  };

  const handleFinishClose = () => {
    if (declaredCash < 0) return;
    const result = closeShiftBlind(declaredCash, notes.trim());
    if (result) {
      setClosedResult(result);
      setStep('result');
    }
  };

  const handlePrintClosure = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2">
            <EyeOff className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-base text-white">
                Arqueo Ciego de Cierre de Caja
              </h3>
              <p className="text-xs text-slate-400">
                Turno {activeShift.shiftType} • Cajero: {activeShift.cashierName}
              </p>
            </div>
          </div>
          {step === 'result' && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        {step === 'count' ? (
          <div className="p-6 space-y-4">
            <div className="bg-indigo-500/10 border border-indigo-500/20 p-3.5 rounded-xl text-xs text-indigo-200">
              <p className="font-semibold text-sm mb-0.5">Control Ciego Antirrobo</p>
              El sistema <strong>no muestra el monto esperado de antemano</strong>. Cuente el dinero físico real que tiene en el cajón portabilletes y cárguelo a continuación.
            </div>

            {/* Toggle between bill counter and direct total */}
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-300">
                {useManualInput ? 'Ingreso directo del total' : 'Desglose por denominación de billetes'}
              </span>
              <button
                type="button"
                onClick={() => setUseManualInput(!useManualInput)}
                className="text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                {useManualInput ? 'Contar billetes' : 'Cargar importe directo'}
              </button>
            </div>

            {useManualInput ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Total de dinero físico en efectivo contado ($):
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-lg font-bold">
                    $
                  </span>
                  <input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={manualTotal}
                    onChange={e => setManualTotal(e.target.value)}
                    autoFocus
                    className="w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-2xl font-bold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {[20000, 10000, 5000, 2000, 1000, 500, 200, 100].map(denom => (
                    <div
                      key={denom}
                      className="flex items-center justify-between p-2 rounded-lg bg-slate-900 border border-slate-800"
                    >
                      <span className="font-mono font-bold text-slate-300">
                        ${denom.toLocaleString()}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] text-slate-500">x</span>
                        <input
                          type="number"
                          min="0"
                          value={billCounts[denom] || ''}
                          placeholder="0"
                          onChange={e =>
                            handleBillChange(denom, parseInt(e.target.value) || 0)
                          }
                          className="w-16 px-1.5 py-1 text-center font-mono font-bold bg-slate-950 text-white rounded border border-slate-700 focus:outline-none focus:border-indigo-500 text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Total Declared Indicator */}
            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-400 uppercase">
                Total Físico Declarado:
              </span>
              <span className="text-2xl font-extrabold font-mono text-emerald-400">
                {formatMoney(declaredCash)}
              </span>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Observaciones del turno (Opcional):
              </label>
              <input
                type="text"
                placeholder="Ej: Se entregaron $500 de vuelto extra por falta de monedas..."
                value={notes}
                onChange={e => setNotes(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Volver sin cerrar
              </button>
              <button
                type="button"
                onClick={handleFinishClose}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
              >
                <span>Confirmar y Emitir Arqueo</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        ) : (
          /* Result Step */
          <div className="p-6 space-y-4">
            {closedResult && (
              <>
                {/* Status difference badge */}
                <div
                  className={`p-4 rounded-xl border text-center ${
                    closedResult.cashDifference === 0
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : (closedResult.cashDifference || 0) > 0
                      ? 'bg-blue-500/10 border-blue-500/30 text-blue-300'
                      : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                  }`}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider">
                    Resultado del Arqueo
                  </p>
                  <div className="text-3xl font-black font-mono mt-1">
                    {closedResult.cashDifference === 0
                      ? 'Caja Exacta'
                      : (closedResult.cashDifference || 0) > 0
                      ? `+ Sobrante: ${formatMoney(closedResult.cashDifference || 0)}`
                      : `- Faltante: ${formatMoney(Math.abs(closedResult.cashDifference || 0))}`}
                  </div>
                </div>

                {/* Detailed comparison table */}
                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Fondo Inicial de Caja:</span>
                    <span className="font-mono font-semibold text-slate-200">
                      {formatMoney(closedResult.initialCash)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Efectivo Físico Declarado:</span>
                    <span className="font-mono font-bold text-slate-100">
                      {formatMoney(closedResult.declaredCash || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1 border-b border-slate-800">
                    <span className="text-slate-400">Efectivo Teórico Esperado:</span>
                    <span className="font-mono font-bold text-slate-100">
                      {formatMoney(closedResult.expectedCash || 0)}
                    </span>
                  </div>

                  <div className="flex justify-between py-1">
                    <span className="text-slate-400">Total Retiros / Egresos:</span>
                    <span className="font-mono font-semibold text-amber-400">
                      {formatMoney(
                        closedResult.withdrawals.reduce((a, b) => a + b.amount, 0)
                      )}
                    </span>
                  </div>
                </div>

                {/* Print button & finalize */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={handlePrintClosure}
                    className="flex items-center justify-center gap-1.5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimir Resumen</span>
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition shadow cursor-pointer"
                  >
                    Finalizar y Salir
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
