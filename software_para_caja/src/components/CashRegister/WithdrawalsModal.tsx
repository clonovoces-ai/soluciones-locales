import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { WithdrawalReason } from '../../types';
import { X, Truck, Sparkles, DollarSign, UserCheck, AlertCircle } from 'lucide-react';

interface WithdrawalsModalProps {
  onClose: () => void;
}

export const WithdrawalsModal: React.FC<WithdrawalsModalProps> = ({ onClose }) => {
  const { activeShift, addCashWithdrawal } = usePOS();
  const [reason, setReason] = useState<WithdrawalReason>('proveedor');
  const [amount, setAmount] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [error, setError] = useState<string>('');

  if (!activeShift) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-2" />
          <h3 className="font-bold text-white text-base">Caja Cerrada</h3>
          <p className="text-xs text-slate-400 mt-1 mb-4">
            Debe iniciar un turno de caja para asentar salidas de dinero.
          </p>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-semibold cursor-pointer"
          >
            Entendido
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Ingrese un importe válido mayor a 0');
      return;
    }
    if (!description.trim()) {
      setError('Ingrese el detalle o motivo del retiro');
      return;
    }

    addCashWithdrawal(reason, parsedAmount, description.trim());
    onClose();
  };

  const categories = [
    {
      id: 'proveedor',
      label: 'Pago a Proveedores',
      icon: Truck,
      color: 'border-blue-500/40 bg-blue-500/10 text-blue-300',
      description: 'Panadero, distribuidora de gaseosas, golosinas, etc.',
    },
    {
      id: 'gastos_operativos',
      label: 'Gastos Operativos',
      icon: Sparkles,
      color: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
      description: 'Limpieza, bolsas, viáticos, hielo, librería.',
    },
    {
      id: 'adelanto_sueldo',
      label: 'Adelanto de Sueldo',
      icon: DollarSign,
      color: 'border-amber-500/40 bg-amber-500/10 text-amber-300',
      description: 'Anticipos autorizados de caja al personal.',
    },
    {
      id: 'retiro_dueno',
      label: 'Retiro del Dueño',
      icon: UserCheck,
      color: 'border-purple-500/40 bg-purple-500/10 text-purple-300',
      description: 'Extracción de ganancias o fondos por el titular.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div>
            <h3 className="font-bold text-base text-white">Retiro de Efectivo de Caja</h3>
            <p className="text-xs text-slate-400">
              Turno {activeShift.shiftType} • Cajero: {activeShift.cashierName}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Reason Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2">
              Categoría del Egreso:
            </label>
            <div className="grid grid-cols-2 gap-2">
              {categories.map(cat => {
                const Icon = cat.icon;
                const isSelected = reason === cat.id;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setReason(cat.id as WithdrawalReason)}
                    className={`p-3 rounded-xl border text-left transition flex flex-col justify-between cursor-pointer ${
                      isSelected
                        ? `${cat.color} ring-1 ring-white/20`
                        : 'bg-slate-800/40 border-slate-700 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span className="font-bold text-xs truncate">{cat.label}</span>
                    </div>
                    <span className="text-[10px] opacity-75 line-clamp-1">
                      {cat.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Amount input */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Importe a Retirar ($):
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-base font-bold">
                $
              </span>
              <input
                type="number"
                step="any"
                min="1"
                placeholder="0"
                value={amount}
                onChange={e => {
                  setAmount(e.target.value);
                  setError('');
                }}
                autoFocus
                className="w-full pl-8 pr-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Detalle / Proveedor / Concepto:
            </label>
            <input
              type="text"
              placeholder="Ej: Distribuidora Quilmes 2 cajones, Panadero factura #12, etc."
              value={description}
              onChange={e => {
                setDescription(e.target.value);
                setError('');
              }}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
            />
          </div>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
              {error}
            </p>
          )}

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow cursor-pointer"
            >
              Registrar Egreso
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
