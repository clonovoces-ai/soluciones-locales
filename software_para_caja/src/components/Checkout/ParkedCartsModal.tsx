import React from 'react';
import { usePOS } from '../../context/POSContext';
import { formatMoney, formatTimeOnly } from '../../utils/formatters';
import { X, Play, Trash2, Clock, Layers } from 'lucide-react';

interface ParkedCartsModalProps {
  onClose: () => void;
}

export const ParkedCartsModal: React.FC<ParkedCartsModalProps> = ({ onClose }) => {
  const { parkedCarts, restoreParkedSale, deleteParkedSale } = usePOS();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2 text-amber-400">
            <Layers className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Ventas en Espera</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of parked carts */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {parkedCarts.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Clock className="w-10 h-10 mx-auto mb-2 opacity-40 text-slate-400" />
              <p className="font-semibold text-slate-300 text-sm">No hay ventas pausadas</p>
              <p className="text-xs text-slate-500 mt-1">
                Puedes poner en espera una venta con el botón [En Espera] o tecla F8.
              </p>
            </div>
          ) : (
            parkedCarts.map(cart => {
              const total = cart.items.reduce((s, i) => s + i.subtotal, 0);
              const count = cart.items.reduce((s, i) => s + i.quantity, 0);

              return (
                <div
                  key={cart.id}
                  className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-slate-700 transition space-y-2.5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold text-amber-400">
                        {cart.note || 'Venta en espera'}
                      </span>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>Pausado a las {formatTimeOnly(cart.timestamp)}</span>
                        <span>•</span>
                        <span>{count} artículos</span>
                      </div>
                    </div>
                    <span className="font-bold font-mono text-base text-emerald-400">
                      {formatMoney(total)}
                    </span>
                  </div>

                  {/* Previsualización ítems */}
                  <div className="text-xs text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800 space-y-0.5 max-h-24 overflow-y-auto">
                    {cart.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span className="truncate max-w-[240px]">
                          {it.quantity}x {it.product.name}
                        </span>
                        <span className="font-mono text-slate-300">
                          {formatMoney(it.subtotal)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => deleteParkedSale(cart.id)}
                      className="px-3 py-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5 inline mr-1" />
                      Descartar
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        restoreParkedSale(cart.id);
                        onClose();
                      }}
                      className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 shadow cursor-pointer"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Cargar a Caja</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
