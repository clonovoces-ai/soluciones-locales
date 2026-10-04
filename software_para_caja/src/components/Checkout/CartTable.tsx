import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { CartItem } from '../../types';
import { formatMoney } from '../../utils/formatters';
import {
  Trash2,
  Plus,
  Minus,
  Edit2,
  PauseCircle,
  XCircle,
  ArrowRight,
  Layers
} from 'lucide-react';

interface CartTableProps {
  onOpenPaymentModal: () => void;
  onOpenParkedModal: () => void;
}

export const CartTable: React.FC<CartTableProps> = ({
  onOpenPaymentModal,
  onOpenParkedModal,
}) => {
  const {
    cart,
    cartTotal,
    cartCount,
    updateCartItemQuantity,
    removeCartItem,
    overrideCartItemPrice,
    clearCart,
    parkCurrentSale,
    parkedCarts,
    currentRole,
  } = usePOS();

  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [overrideInput, setOverrideInput] = useState<string>('');

  const handlePriceClick = (item: CartItem) => {
    setEditingPriceId(item.product.id);
    setOverrideInput(item.unitPrice.toString());
  };

  const handlePriceSave = (productId: string) => {
    const val = parseFloat(overrideInput);
    if (!isNaN(val) && val >= 0) {
      overrideCartItemPrice(productId, val);
    }
    setEditingPriceId(null);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Table Header */}
      <div className="px-5 py-3.5 bg-slate-800/80 border-b border-slate-700/80 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="font-bold text-sm tracking-wide text-white uppercase">
            Ticket en Curso
          </h2>
          <span className="text-xs bg-slate-700 text-slate-300 font-medium px-2 py-0.5 rounded-full">
            {cartCount} {cartCount === 1 ? 'artículo' : 'artículos'}
          </span>
        </div>

        {/* Botón Ver Ventas en espera */}
        {parkedCarts.length > 0 && (
          <button
            onClick={onOpenParkedModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30 transition cursor-pointer"
          >
            <PauseCircle className="w-3.5 h-3.5" />
            <span>Recuperar Venta ({parkedCarts.length})</span>
          </button>
        )}
      </div>

      {/* Items Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-1">
        {cart.length === 0 ? (
          <div className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-8 text-slate-500">
            <div className="w-16 h-16 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-center mb-3">
              <span className="text-3xl">🛒</span>
            </div>
            <p className="font-semibold text-slate-300 text-base">El ticket está vacío</p>
            <p className="text-xs text-slate-400 max-w-xs mt-1">
              Pasa un producto con la <strong className="text-emerald-400">pistola lectora de código de barras</strong> o búscalo en el catálogo derecho.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500 bg-slate-950/60 px-3 py-1.5 rounded-lg border border-slate-800">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Lector activo en segundo plano (No hace falta hacer clic)</span>
            </div>
          </div>
        ) : (
          cart.map((item, idx) => (
            <div
              key={item.product.id}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 hover:bg-slate-800/80 transition border border-transparent hover:border-slate-700/60 gap-3 group"
            >
              {/* Index & Name */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="text-xs font-mono font-semibold text-slate-500 w-5 pt-0.5">
                  #{idx + 1}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <p className="font-semibold text-sm text-slate-100 truncate">
                      {item.product.name}
                    </p>
                    {item.product.brand && (
                      <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">
                        {item.product.brand}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-slate-400">
                    <span className="font-mono text-[11px] text-slate-500">
                      {item.product.barcode}
                    </span>
                    <span>•</span>
                    {/* Precio Unitario (Click to edit) */}
                    {editingPriceId === item.product.id ? (
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] text-slate-400">$</span>
                        <input
                          type="number"
                          value={overrideInput}
                          onChange={e => setOverrideInput(e.target.value)}
                          onBlur={() => handlePriceSave(item.product.id)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') handlePriceSave(item.product.id);
                            if (e.key === 'Escape') setEditingPriceId(null);
                          }}
                          autoFocus
                          className="w-20 px-1.5 py-0.5 text-xs bg-slate-950 text-emerald-400 font-mono rounded border border-emerald-500 focus:outline-none"
                        />
                      </div>
                    ) : (
                      <button
                        onClick={() => handlePriceClick(item)}
                        className="inline-flex items-center gap-1 text-slate-300 hover:text-amber-300 transition group/price cursor-pointer"
                        title="Haga clic para modificar precio manualmente (Registra en auditoría)"
                      >
                        <span>{formatMoney(item.unitPrice)} c/u</span>
                        <Edit2 className="w-2.5 h-2.5 opacity-0 group-hover/price:opacity-100 text-amber-400" />
                        {item.unitPrice !== item.product.salePrice && (
                          <span className="text-[9px] bg-amber-500/20 text-amber-400 px-1 rounded border border-amber-500/30">
                            Modificado
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-1 bg-slate-950/70 p-1 rounded-xl border border-slate-700/60 shrink-0">
                <button
                  type="button"
                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
                  title="Restar 1"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={e => {
                    const q = parseInt(e.target.value);
                    if (!isNaN(q) && q > 0) {
                      updateCartItemQuantity(item.product.id, q);
                    }
                  }}
                  className="w-10 text-center font-bold text-sm bg-transparent text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 rounded font-mono"
                />
                <button
                  type="button"
                  onClick={() => updateCartItemQuantity(item.product.id, item.quantity + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition active:scale-95 cursor-pointer"
                  title="Sumar 1"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Subtotal */}
              <div className="text-right w-24 shrink-0">
                <div className="font-bold text-base font-mono text-emerald-400">
                  {formatMoney(item.subtotal)}
                </div>
              </div>

              {/* Delete Item */}
              <button
                type="button"
                onClick={() => removeCartItem(item.product.id)}
                className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition shrink-0 cursor-pointer"
                title="Eliminar producto (Registra en auditoría antirrobo)"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary & Action Footer */}
      <div className="bg-slate-950/90 border-t border-slate-800 p-4 space-y-3">
        {/* Total Display */}
        <div className="flex items-center justify-between px-2">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
              Total a Cobrar
            </span>
            <div className="text-[11px] text-slate-500">
              {cartCount} unidades en lista
            </div>
          </div>
          <div className="text-right">
            <span className="text-3xl font-extrabold font-mono text-emerald-400 tracking-tight">
              {formatMoney(cartTotal)}
            </span>
          </div>
        </div>

        {/* Buttons Bar */}
        <div className="grid grid-cols-12 gap-2">
          {/* Vaciar Ticket */}
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => {
              if (window.confirm('¿Confirma cancelar y vaciar el ticket en curso?')) {
                clearCart('Cancelado por cajero en mostrador');
              }
            }}
            className="col-span-3 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800/80 hover:bg-rose-900/30 hover:text-rose-300 text-slate-400 text-xs font-semibold border border-slate-700/60 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            title="Cancelar venta (Registra en auditoría)"
          >
            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span className="hidden sm:inline">Cancelar</span>
          </button>

          {/* Venta en Espera */}
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={() => parkCurrentSale()}
            className="col-span-4 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-semibold border border-slate-700 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
            title="Pausar venta para cobrarle a otro cliente (F8)"
          >
            <PauseCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>En Espera [F8]</span>
          </button>

          {/* Cobrar Ahora */}
          <button
            type="button"
            disabled={cart.length === 0}
            onClick={onOpenPaymentModal}
            className="col-span-5 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg shadow-emerald-900/40 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.98] transition cursor-pointer"
            title="Cobrar venta en curso (F4)"
          >
            <span>COBRAR [F4]</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
