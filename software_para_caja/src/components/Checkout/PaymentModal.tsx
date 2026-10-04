import React, { useState, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { PaymentMethod, PaymentDetails, Sale } from '../../types';
import { formatMoney } from '../../utils/formatters';
import {
  X,
  Banknote,
  QrCode,
  CreditCard,
  Split,
  CheckCircle,
  Calculator,
  ArrowRight
} from 'lucide-react';

interface PaymentModalProps {
  onClose: () => void;
  onSaleCompleted: (sale: Sale) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  onClose,
  onSaleCompleted,
}) => {
  const { cartTotal, completeSale } = usePOS();
  const [method, setMethod] = useState<PaymentMethod>('efectivo');

  // Efectivo state
  const [cashGiven, setCashGiven] = useState<number>(cartTotal);

  // Mixto state
  const [mixedCash, setMixedCash] = useState<number>(Math.floor(cartTotal / 2));
  const [mixedDigital, setMixedDigital] = useState<number>(cartTotal - Math.floor(cartTotal / 2));

  // Tarjeta / QR ref
  const [voucherRef, setVoucherRef] = useState<string>('');

  useEffect(() => {
    setCashGiven(cartTotal);
    setMixedCash(Math.floor(cartTotal / 2));
    setMixedDigital(cartTotal - Math.floor(cartTotal / 2));
  }, [cartTotal]);

  // Keyboard navigation: Escape closes modal, Enter confirms if valid
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const change = Math.max(0, cashGiven - cartTotal);
  const isCashSufficient = cashGiven >= cartTotal;
  const isMixedValid = mixedCash + mixedDigital >= cartTotal;

  const handleQuickCash = (amount: number) => {
    setCashGiven(amount);
  };

  const handleAddBill = (bill: number) => {
    setCashGiven(prev => prev + bill);
  };

  const handleConfirm = () => {
    let paymentDetails: PaymentDetails;

    if (method === 'efectivo') {
      if (!isCashSufficient) return;
      paymentDetails = {
        method: 'efectivo',
        amountEfectivo: cartTotal,
        cashReceived: cashGiven,
        cashChange: change,
      };
    } else if (method === 'transferencia') {
      paymentDetails = {
        method: 'transferencia',
        amountDigital: cartTotal,
        voucherRef: voucherRef.trim() || 'QR-VERIFICADO',
      };
    } else if (method === 'debito') {
      paymentDetails = {
        method: 'debito',
        amountDigital: cartTotal,
        voucherRef: voucherRef.trim() || 'POS-DEBITO',
      };
    } else if (method === 'credito') {
      paymentDetails = {
        method: 'credito',
        amountDigital: cartTotal,
        voucherRef: voucherRef.trim() || 'POS-CREDITO',
      };
    } else {
      // Mixto
      if (!isMixedValid) return;
      paymentDetails = {
        method: 'mixto',
        amountEfectivo: mixedCash,
        amountDigital: mixedDigital,
        cashReceived: mixedCash,
        voucherRef: voucherRef.trim() || 'COBRO-MIXTO',
      };
    }

    const completed = completeSale(paymentDetails);
    if (completed) {
      onSaleCompleted(completed);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div>
            <h3 className="font-bold text-lg text-white">Finalizar Cobro</h3>
            <p className="text-xs text-slate-400">Seleccione el método de pago del cliente</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5 flex-1 overflow-y-auto">
          {/* Big Amount Due */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total a pagar
            </span>
            <div className="text-4xl font-extrabold font-mono text-emerald-400 mt-0.5">
              {formatMoney(cartTotal)}
            </div>
          </div>

          {/* Payment Method Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setMethod('efectivo')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                method === 'efectivo'
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Banknote className="w-5 h-5" />
              <span className="text-xs font-semibold">Efectivo</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('transferencia')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                method === 'transferencia'
                  ? 'bg-sky-600 text-white border-sky-500 shadow-md'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-xs font-semibold">Mercado Pago / QR</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('debito')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                method === 'debito' || method === 'credito'
                  ? 'bg-indigo-600 text-white border-indigo-500 shadow-md'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-xs font-semibold">Tarjeta Posnet</span>
            </button>

            <button
              type="button"
              onClick={() => setMethod('mixto')}
              className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 cursor-pointer ${
                method === 'mixto'
                  ? 'bg-purple-600 text-white border-purple-500 shadow-md'
                  : 'bg-slate-800/60 text-slate-300 border-slate-700 hover:bg-slate-800'
              }`}
            >
              <Split className="w-5 h-5" />
              <span className="text-xs font-semibold">Cobro Mixto</span>
            </button>
          </div>

          {/* Efectivo view */}
          {method === 'efectivo' && (
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Efectivo Entregado por el Cliente:
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base">
                    $
                  </span>
                  <input
                    type="number"
                    min={cartTotal}
                    value={cashGiven || ''}
                    onChange={e => setCashGiven(parseFloat(e.target.value) || 0)}
                    autoFocus
                    className="w-full pl-8 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-xl font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Billete Shortcuts */}
              <div>
                <div className="text-[11px] font-semibold text-slate-400 uppercase mb-1.5">
                  Atajos rápidos de billetes comunes:
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickCash(cartTotal)}
                    className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 border border-slate-700 text-center cursor-pointer"
                  >
                    Exacto
                  </button>
                  {[1000, 2000, 5000, 10000, 20000].map(bill => (
                    <button
                      key={bill}
                      type="button"
                      onClick={() => handleQuickCash(bill)}
                      className="py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-lg text-slate-200 border border-slate-700 text-center cursor-pointer font-mono"
                    >
                      ${bill >= 1000 ? `${bill / 1000}k` : bill}
                    </button>
                  ))}
                </div>
              </div>

              {/* Vuelto a Entregar */}
              <div
                className={`p-3 rounded-xl border flex items-center justify-between ${
                  isCashSufficient
                    ? 'bg-emerald-500/10 border-emerald-500/30'
                    : 'bg-rose-500/10 border-rose-500/30'
                }`}
              >
                <div>
                  <span className="text-xs font-semibold text-slate-300">
                    {isCashSufficient ? 'Vuelto a Entregar:' : 'Monto Insuficiente:'}
                  </span>
                  {!isCashSufficient && (
                    <p className="text-[11px] text-rose-400">
                      Faltan {formatMoney(cartTotal - cashGiven)}
                    </p>
                  )}
                </div>
                <span
                  className={`text-2xl font-extrabold font-mono ${
                    isCashSufficient ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatMoney(change)}
                </span>
              </div>
            </div>
          )}

          {/* Mercado Pago / QR view */}
          {method === 'transferencia' && (
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex items-center gap-3 p-3 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-300 text-xs">
                <QrCode className="w-8 h-8 shrink-0 text-sky-400" />
                <div>
                  <p className="font-semibold text-sm">Validación Visual de QR / MP</p>
                  <p className="text-sky-300/80 mt-0.5">
                    Solicite al cliente mostrar el comprobante en su pantalla antes de finalizar.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Número de Operación / Últimos 4 dígitos (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: 849204..."
                  value={voucherRef}
                  onChange={e => setVoucherRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}

          {/* Tarjeta Posnet view */}
          {(method === 'debito' || method === 'credito') && (
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('debito')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-xs border ${
                    method === 'debito'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Tarjeta de Débito
                </button>
                <button
                  type="button"
                  onClick={() => setMethod('credito')}
                  className={`flex-1 py-2 rounded-lg font-semibold text-xs border ${
                    method === 'credito'
                      ? 'bg-indigo-600 text-white border-indigo-500'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Tarjeta de Crédito
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Número de Cupón o Lote del POSNET (Opcional):
                </label>
                <input
                  type="text"
                  placeholder="Ej: Cupón #0482"
                  value={voucherRef}
                  onChange={e => setVoucherRef(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          )}

          {/* Cobro Mixto view */}
          {method === 'mixto' && (
            <div className="space-y-4 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Parte Efectivo:
                  </label>
                  <input
                    type="number"
                    value={mixedCash}
                    onChange={e => {
                      const val = parseFloat(e.target.value) || 0;
                      setMixedCash(val);
                      setMixedDigital(Math.max(0, cartTotal - val));
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Parte Digital (QR / Tarjeta):
                  </label>
                  <input
                    type="number"
                    value={mixedDigital}
                    onChange={e => {
                      const val = parseFloat(e.target.value) || 0;
                      setMixedDigital(val);
                      setMixedCash(Math.max(0, cartTotal - val));
                    }}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs flex justify-between">
                <span className="text-slate-400">Suma total ingresada:</span>
                <span className="font-mono font-bold text-emerald-400">
                  {formatMoney(mixedCash + mixedDigital)} / {formatMoney(cartTotal)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="bg-slate-800/80 px-6 py-4 border-t border-slate-700 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-semibold border border-slate-700 transition cursor-pointer"
          >
            Cancelar
          </button>

          <button
            type="button"
            disabled={method === 'efectivo' ? !isCashSufficient : method === 'mixto' ? !isMixedValid : false}
            onClick={handleConfirm}
            className="flex-1 max-w-xs flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition cursor-pointer"
          >
            <CheckCircle className="w-4 h-4" />
            <span>Confirmar Cobro</span>
          </button>
        </div>
      </div>
    </div>
  );
};
