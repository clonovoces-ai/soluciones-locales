import React, { useState, useEffect } from 'react';
import { Lock, X, AlertTriangle } from 'lucide-react';
import { usePOS } from '../../context/POSContext';

interface PinModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export const PinModal: React.FC<PinModalProps> = ({ onClose, onSuccess }) => {
  const { settings } = usePOS();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (pin === settings.adminPin) {
      onSuccess();
    } else {
      setError(true);
      setPin('');
    }
  };

  const handleDigit = (digit: string) => {
    if (pin.length < 6) {
      const next = pin + digit;
      setPin(next);
      setError(false);
      if (next === settings.adminPin) {
        onSuccess();
      }
    }
  };

  const handleDelete = () => {
    setPin(prev => prev.slice(0, -1));
    setError(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-800/80 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2 text-amber-400">
            <Lock className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">Acceso Dueño / Admin</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-slate-300 text-center mb-4">
            Ingrese el PIN de seguridad para acceder a la auditoría antirrobo, márgenes y configuración del negocio.
          </p>

          {/* PIN Display */}
          <div className="flex justify-center gap-3 mb-6">
            {[0, 1, 2, 3].map(idx => (
              <div
                key={idx}
                className={`w-11 h-12 rounded-xl flex items-center justify-center text-xl font-bold border transition ${
                  error
                    ? 'border-rose-500 bg-rose-500/10 text-rose-400'
                    : pin.length > idx
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                    : 'border-slate-700 bg-slate-800/60 text-slate-500'
                }`}
              >
                {pin.length > idx ? '●' : ''}
              </div>
            ))}
          </div>

          {error && (
            <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 mb-4 bg-rose-500/10 py-1.5 px-3 rounded-lg border border-rose-500/20">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>PIN incorrecto. Intente de nuevo. (Predeterminado: 1234)</span>
            </div>
          )}

          {/* Numeric keypad */}
          <div className="grid grid-cols-3 gap-2.5 max-w-[260px] mx-auto mb-4">
            {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => handleDigit(num)}
                className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg border border-slate-700/80 active:scale-95 transition shadow-sm cursor-pointer"
              >
                {num}
              </button>
            ))}
            <button
              type="button"
              onClick={handleDelete}
              className="h-12 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-slate-300 font-medium text-xs border border-slate-700/80 active:scale-95 transition cursor-pointer"
            >
              Borrar
            </button>
            <button
              type="button"
              onClick={() => handleDigit('0')}
              className="h-12 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-lg border border-slate-700/80 active:scale-95 transition cursor-pointer"
            >
              0
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              className="h-12 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs border border-emerald-500 active:scale-95 transition cursor-pointer"
            >
              Entrar
            </button>
          </div>

          <div className="text-center text-[11px] text-slate-500">
            PIN inicial de fábrica: <strong className="text-slate-400">1234</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
