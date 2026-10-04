import React, { useState, useEffect } from 'react';
import { Product } from '../../types';
import { usePOS } from '../../context/POSContext';
import { calculateMargin } from '../../utils/formatters';
import { X, Save, Barcode } from 'lucide-react';

interface ProductFormModalProps {
  product?: Product | null;
  onClose: () => void;
}

export const ProductFormModal: React.FC<ProductFormModalProps> = ({
  product,
  onClose,
}) => {
  const { saveProduct } = usePOS();

  const [barcode, setBarcode] = useState('');
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('Almacén');
  const [costPrice, setCostPrice] = useState('0');
  const [salePrice, setSalePrice] = useState('0');
  const [stock, setStock] = useState('10');
  const [minStock, setMinStock] = useState('5');
  const [isQuickItem, setIsQuickItem] = useState(false);

  useEffect(() => {
    if (product) {
      setBarcode(product.barcode);
      setName(product.name);
      setBrand(product.brand);
      setCategory(product.category);
      setCostPrice(product.costPrice.toString());
      setSalePrice(product.salePrice.toString());
      setStock(product.stock.toString());
      setMinStock(product.minStock.toString());
      setIsQuickItem(!!product.isQuickItem);
    } else {
      // Auto generate a random barcode placeholder if needed
      setBarcode('');
    }
  }, [product]);

  const cost = parseFloat(costPrice) || 0;
  const sale = parseFloat(salePrice) || 0;
  const margin = calculateMargin(cost, sale);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const saved: Product = {
      id: product ? product.id : 'prod-' + Date.now(),
      barcode: barcode.trim() || 'INT-' + Math.floor(100000 + Math.random() * 900000),
      name: name.trim(),
      brand: brand.trim(),
      category: category.trim() || 'General',
      costPrice: cost,
      salePrice: sale,
      stock: parseInt(stock) || 0,
      minStock: parseInt(minStock) || 0,
      isQuickItem,
    };

    saveProduct(saved);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2 text-blue-400">
            <Barcode className="w-5 h-5" />
            <h3 className="font-bold text-base text-white">
              {product ? 'Editar Artículo' : 'Nuevo Artículo al Catálogo'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Barcode & Quick Item */}
          <div className="grid grid-cols-3 gap-3 items-end">
            <div className="col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Código de Barras (EAN):
              </label>
              <input
                type="text"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                placeholder="Escanee con pistola o escriba..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500 font-semibold"
              />
            </div>
            <label className="flex items-center gap-2 text-xs text-amber-300 font-medium pb-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isQuickItem}
                onChange={e => setIsQuickItem(e.target.checked)}
                className="rounded border-slate-700 text-amber-500 focus:ring-0"
              />
              <span>Botonera Rápida</span>
            </label>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Nombre / Descripción del Producto *:
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Ej: Galletitas Oreo 118g"
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white text-sm font-semibold focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Brand & Category */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Marca:
              </label>
              <input
                type="text"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                placeholder="Ej: Bagley, Coca Cola..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Rubro / Categoría:
              </label>
              <input
                type="text"
                value={category}
                onChange={e => setCategory(e.target.value)}
                placeholder="Ej: Bebidas, Golosinas..."
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* Prices & Margin Calculation */}
          <div className="bg-slate-950/70 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Precio de Costo ($):
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  value={costPrice}
                  onChange={e => setCostPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold text-sm focus:outline-none focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Precio de Venta ($) *:
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  required
                  value={salePrice}
                  onChange={e => setSalePrice(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-emerald-400 font-mono font-bold text-sm focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Calculated Margin Pill */}
            <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Margen Comercial Estimado:</span>
              <span
                className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                  margin >= 30
                    ? 'bg-emerald-500/20 text-emerald-400'
                    : margin > 0
                    ? 'bg-amber-500/20 text-amber-400'
                    : 'bg-rose-500/20 text-rose-400'
                }`}
              >
                +{margin}% de ganancia bruta
              </span>
            </div>
          </div>

          {/* Stocks */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stock Actual (Unidades):
              </label>
              <input
                type="number"
                value={stock}
                onChange={e => setStock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Stock Mínimo (Alerta):
              </label>
              <input
                type="number"
                min="0"
                value={minStock}
                onChange={e => setMinStock(e.target.value)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Producto</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
