import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { X, TrendingUp, CheckCircle, AlertCircle } from 'lucide-react';

interface BulkPriceModalProps {
  onClose: () => void;
}

export const BulkPriceModal: React.FC<BulkPriceModalProps> = ({ onClose }) => {
  const { products, bulkUpdatePrices } = usePOS();
  const [percentage, setPercentage] = useState<string>('10');
  const [filterType, setFilterType] = useState<'all' | 'category' | 'brand'>('all');
  const [filterValue, setFilterValue] = useState<string>('');
  const [updatedCount, setUpdatedCount] = useState<number | null>(null);

  // Extract unique categories and brands
  const categories = Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  const brands = Array.from(new Set(products.map(p => p.brand).filter(Boolean)));

  const handleApply = (e: React.FormEvent) => {
    e.preventDefault();
    const pct = parseFloat(percentage);
    if (isNaN(pct) || pct <= 0) return;

    const count = bulkUpdatePrices(pct, filterType, filterValue);
    setUpdatedCount(count);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2 text-amber-400">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">
              Aumento Masivo de Precios
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {updatedCount !== null ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-14 h-14 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-lg font-bold text-white">¡Precios Actualizados!</h4>
              <p className="text-xs text-slate-300 mt-1">
                Se aplicó un aumento del <strong>+{percentage}%</strong> a{' '}
                <strong>{updatedCount} productos</strong> con éxito.
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow transition cursor-pointer"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleApply} className="p-6 space-y-4">
            <p className="text-xs text-slate-400">
              Ajuste los precios de costo y venta de forma masiva ante listas de precios nuevas o inflación.
            </p>

            {/* Percentage input */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Porcentaje de Aumento (%):
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  required
                  placeholder="Ej: 8"
                  value={percentage}
                  onChange={e => setPercentage(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xl font-bold focus:outline-none focus:border-amber-500"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-mono font-bold">
                  %
                </span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex gap-1.5">
              {['5', '8', '10', '12', '15', '20'].map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPercentage(p)}
                  className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono font-semibold rounded-lg border border-slate-700 text-center cursor-pointer"
                >
                  +{p}%
                </button>
              ))}
            </div>

            {/* Scope filter */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Alcance del Aumento:
              </label>
              <div className="grid grid-cols-3 gap-2 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('all');
                    setFilterValue('');
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    filterType === 'all'
                      ? 'bg-amber-600 text-white border-amber-500 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Todo el Catálogo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('category');
                    setFilterValue(categories[0] || '');
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    filterType === 'category'
                      ? 'bg-amber-600 text-white border-amber-500 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Por Rubro
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterType('brand');
                    setFilterValue(brands[0] || '');
                  }}
                  className={`py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                    filterType === 'brand'
                      ? 'bg-amber-600 text-white border-amber-500 shadow'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  Por Marca
                </button>
              </div>

              {/* Sub filter dropdown */}
              {filterType === 'category' && (
                <select
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              )}

              {filterType === 'brand' && (
                <select
                  value={filterValue}
                  onChange={e => setFilterValue(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {brands.map(brand => (
                    <option key={brand} value={brand}>
                      {brand}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold transition shadow cursor-pointer"
              >
                Aplicar Aumento
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
