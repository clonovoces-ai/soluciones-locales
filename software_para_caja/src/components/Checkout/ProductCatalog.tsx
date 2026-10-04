import React, { useState, useMemo, useRef, useEffect } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types';
import { formatMoney } from '../../utils/formatters';
import { Search, Zap, Plus, Barcode, CheckCircle2 } from 'lucide-react';

interface ProductCatalogProps {
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export const ProductCatalog: React.FC<ProductCatalogProps> = ({ searchInputRef }) => {
  const { products, addToCart, scanBarcode } = usePOS();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [justAddedId, setJustAddedId] = useState<string | null>(null);

  // Extract quick items and categories
  const quickItems = useMemo(
    () => products.filter(p => p.isQuickItem),
    [products]
  );

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach(p => {
      if (p.category && !p.isQuickItem) set.add(p.category);
    });
    return Array.from(set);
  }, [products]);

  // Filtered regular items
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Si estamos en filtro 'todos' o coincide con la categoría
      const matchesCategory =
        selectedCategory === 'todos' || p.category === selectedCategory;

      if (!matchesCategory) return false;

      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase().trim();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      );
    });
  }, [products, searchTerm, selectedCategory]);

  const handleProductClick = (product: Product) => {
    addToCart(product, 1);
    setJustAddedId(product.id);
    setTimeout(() => setJustAddedId(null), 600);
  };

  const handleManualSearchEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      const term = searchTerm.trim();
      if (!term) return;

      // Intentar primero como código de barras exacto
      const result = scanBarcode(term);
      if (result.success) {
        setSearchTerm('');
        return;
      }

      // Si hay 1 solo resultado filtrado, agregarlo
      if (filteredProducts.length === 1) {
        handleProductClick(filteredProducts[0]);
        setSearchTerm('');
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-slate-900/90 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
      {/* Search Bar & Manual Barcode input */}
      <div className="p-3 bg-slate-800/80 border-b border-slate-700/80 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder="Buscar por nombre, marca o escanear código (F2)..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleManualSearchEnter}
            className="w-full pl-10 pr-24 py-2.5 rounded-xl bg-slate-950 text-white placeholder-slate-500 border border-slate-700 text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
            >
              Limpiar
            </button>
          )}
        </div>

        {/* Quick buttons bar for items without barcodes */}
        {quickItems.length > 0 && (
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-amber-400 uppercase tracking-wider mb-1.5">
              <Zap className="w-3 h-3" />
              <span>Botonera Rápida (Sin código de barras)</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5">
              {quickItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => handleProductClick(item)}
                  className="px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-left transition active:scale-95 flex flex-col justify-between cursor-pointer group"
                >
                  <span className="text-[11px] font-semibold truncate group-hover:text-amber-200">
                    {item.name}
                  </span>
                  <span className="text-xs font-mono font-bold text-emerald-400 mt-0.5">
                    {formatMoney(item.salePrice)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin text-xs">
          <button
            onClick={() => setSelectedCategory('todos')}
            className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
              selectedCategory === 'todos'
                ? 'bg-slate-700 text-white shadow'
                : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            Todos ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 shadow'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-3">
        {filteredProducts.length === 0 ? (
          <div className="h-full min-h-[220px] flex flex-col items-center justify-center text-center p-6 text-slate-500">
            <Barcode className="w-10 h-10 mb-2 opacity-40 text-slate-400" />
            <p className="font-semibold text-slate-300 text-sm">No se encontraron productos</p>
            <p className="text-xs text-slate-500 mt-1">
              Prueba con otro término de búsqueda o agrega el producto al catálogo.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {filteredProducts.map(product => {
              const isJustAdded = justAddedId === product.id;
              const isLowStock = product.stock <= product.minStock && product.stock > 0;
              const isNoStock = product.stock <= 0;

              return (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className={`p-3 rounded-xl border text-left transition flex flex-col justify-between relative group cursor-pointer ${
                    isJustAdded
                      ? 'bg-emerald-500/20 border-emerald-500 scale-[0.98]'
                      : 'bg-slate-800/40 hover:bg-slate-800/90 border-slate-700/60 hover:border-slate-600'
                  }`}
                >
                  {/* Top Bar: Category badge & Stock */}
                  <div className="flex items-center justify-between text-[11px] mb-1.5 w-full">
                    <span className="text-slate-400 font-medium truncate max-w-[120px]">
                      {product.category}
                    </span>
                    <span
                      className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                        isNoStock
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : isLowStock
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-slate-700/60 text-slate-400'
                      }`}
                      title={
                        isNoStock
                          ? 'Sin stock'
                          : isLowStock
                          ? 'Stock bajo por debajo del mínimo'
                          : 'Stock normal'
                      }
                    >
                      {product.stock} un.
                    </span>
                  </div>

                  {/* Product Title */}
                  <div className="mb-2">
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-white line-clamp-2 leading-snug">
                      {product.name}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5 truncate">
                      {product.brand ? `${product.brand} • ` : ''}
                      {product.barcode}
                    </p>
                  </div>

                  {/* Price & Add indicator */}
                  <div className="flex items-center justify-between mt-auto pt-1 border-t border-slate-700/40 w-full">
                    <span className="font-bold font-mono text-base text-emerald-400">
                      {formatMoney(product.salePrice)}
                    </span>
                    <div className="w-7 h-7 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-slate-950 flex items-center justify-center transition">
                      {isJustAdded ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
