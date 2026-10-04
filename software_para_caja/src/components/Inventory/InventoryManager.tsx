import React, { useState, useMemo, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { Product } from '../../types';
import { formatMoney, calculateMargin } from '../../utils/formatters';
import {
  Package,
  Search,
  Plus,
  TrendingUp,
  Download,
  Upload,
  MessageCircle,
  AlertCircle,
  CheckCircle2,
  Edit2,
  Trash2,
  Filter
} from 'lucide-react';
import { ProductFormModal } from './ProductFormModal';
import { BulkPriceModal } from './BulkPriceModal';

export const InventoryManager: React.FC = () => {
  const { products, deleteProduct, saveProduct, settings } = usePOS();

  const [searchTerm, setSearchTerm] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'critical' | 'low' | 'healthy'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Extract categories
  const categories = useMemo(() => {
    return Array.from(new Set(products.map(p => p.category).filter(Boolean)));
  }, [products]);

  // Stock status counts
  const stockStats = useMemo(() => {
    let critical = 0;
    let low = 0;
    let healthy = 0;

    products.forEach(p => {
      if (p.stock <= 0) critical++;
      else if (p.stock <= p.minStock) low++;
      else healthy++;
    });

    return { critical, low, healthy, total: products.length };
  }, [products]);

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      // Stock traffic light filter
      if (stockFilter === 'critical' && p.stock > 0) return false;
      if (stockFilter === 'low' && (p.stock <= 0 || p.stock > p.minStock)) return false;
      if (stockFilter === 'healthy' && p.stock <= p.minStock) return false;

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Search term
      if (!searchTerm.trim()) return true;
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.barcode.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q)
      );
    });
  }, [products, stockFilter, selectedCategory, searchTerm]);

  // WhatsApp 1-Click Replenishment Generator
  const handleGenerateWhatsAppReplenishment = () => {
    const toOrder = products.filter(p => p.stock <= p.minStock);
    if (toOrder.length === 0) {
      alert('No hay productos con stock crítico o bajo actualmente.');
      return;
    }

    let msg = `*PEDIDO DE REPOSICIÓN DE MERCADERÍA*\n`;
    msg += `Local: *${settings.businessName}*\n`;
    msg += `Fecha: ${new Date().toLocaleDateString('es-AR')}\n`;
    msg += `------------------------------------\n`;

    toOrder.forEach(item => {
      const needed = Math.max(item.minStock * 2 - item.stock, item.minStock || 6);
      msg += `• [${item.stock <= 0 ? 'SIN STOCK' : 'BAJO'}] *${item.name}* (Marca: ${item.brand || '-'})\n`;
      msg += `   Stock actual: ${item.stock} un. | Pedir aprox: *${needed} un.*\n`;
      msg += `   Cód: ${item.barcode}\n\n`;
    });

    msg += `------------------------------------\n`;
    msg += `Solicito confirmación de entrega y precios actualizados.`;

    const encoded = encodeURIComponent(msg);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  // CSV Export
  const handleExportCSV = () => {
    let csv = 'Codigo,Nombre,Marca,Categoria,PrecioCosto,PrecioVenta,Stock,StockMinimo\n';
    products.forEach(p => {
      csv += `"${p.barcode}","${p.name.replace(/"/g, '""')}","${p.brand}","${p.category}",${p.costPrice},${p.salePrice},${p.stock},${p.minStock}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo_productos_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // CSV Import
  const handleImportCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        const lines = text.split('\n');
        let count = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          // Simple CSV line parser
          const cols = line.split(',').map(c => c.replace(/^"|"$/g, '').trim());
          if (cols.length >= 6) {
            const [barcode, name, brand, category, costStr, saleStr, stockStr, minStockStr] = cols;
            const product: Product = {
              id: 'imp-' + Date.now() + '-' + i,
              barcode: barcode || 'INT-' + i,
              name: name || 'Producto ' + i,
              brand: brand || '',
              category: category || 'General',
              costPrice: parseFloat(costStr) || 0,
              salePrice: parseFloat(saleStr) || 0,
              stock: parseInt(stockStr) || 0,
              minStock: parseInt(minStockStr) || 5,
            };
            saveProduct(product);
            count++;
          }
        }
        alert(`Se importaron ${count} productos correctamente.`);
      } catch (err) {
        alert('Error al leer el archivo CSV. Verifique el formato.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Banner & Main Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-blue-400" />
            <span>Control de Inventario & Precios</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Gestione códigos de barra, costos de compra, precios de góndola y alertas de reposición
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Aumento Masivo */}
          <button
            type="button"
            onClick={() => setShowBulkPriceModal(true)}
            className="px-3.5 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-semibold text-xs border border-amber-500/30 transition flex items-center gap-1.5 cursor-pointer"
            title="Ajuste masivo porcentual por inflación"
          >
            <TrendingUp className="w-4 h-4 text-amber-400" />
            <span>Aumento Masivo %</span>
          </button>

          {/* Exportar CSV */}
          <button
            type="button"
            onClick={handleExportCSV}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition cursor-pointer"
            title="Descargar catálogo a Excel / CSV"
          >
            <Download className="w-4 h-4" />
          </button>

          {/* Importar CSV */}
          <input
            type="file"
            ref={fileInputRef}
            accept=".csv"
            onChange={handleImportCSV}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs border border-slate-700 transition cursor-pointer"
            title="Cargar productos desde archivo CSV"
          >
            <Upload className="w-4 h-4" />
          </button>

          {/* Agregar Producto */}
          <button
            type="button"
            onClick={() => {
              setEditingProduct(null);
              setShowProductModal(true);
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow transition flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Artículo</span>
          </button>
        </div>
      </div>

      {/* Stock Traffic Light Cards (Semáforo de Reposición) */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Crítico */}
        <button
          onClick={() => setStockFilter(stockFilter === 'critical' ? 'all' : 'critical')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
            stockFilter === 'critical'
              ? 'bg-rose-500/20 border-rose-500 text-rose-300'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Crítico (Sin Stock)
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-rose-400 mt-1">
              {stockStats.critical}
            </div>
          </div>
          <AlertCircle className="w-6 h-6 text-rose-500 opacity-60" />
        </button>

        {/* Bajo Stock */}
        <button
          onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
            stockFilter === 'low'
              ? 'bg-amber-500/20 border-amber-500 text-amber-300'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Bajo Stock
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-amber-400 mt-1">
              {stockStats.low}
            </div>
          </div>
          <AlertCircle className="w-6 h-6 text-amber-500 opacity-60" />
        </button>

        {/* Saludable */}
        <button
          onClick={() => setStockFilter(stockFilter === 'healthy' ? 'all' : 'healthy')}
          className={`p-3.5 rounded-xl border text-left transition flex items-center justify-between cursor-pointer ${
            stockFilter === 'healthy'
              ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300'
          }`}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-xs font-bold uppercase tracking-wider">
                Stock Óptimo
              </span>
            </div>
            <div className="text-2xl font-black font-mono text-emerald-400 mt-1">
              {stockStats.healthy}
            </div>
          </div>
          <CheckCircle2 className="w-6 h-6 text-emerald-500 opacity-60" />
        </button>

        {/* Botón WhatsApp 1 Clic */}
        <div className="bg-slate-900 border border-slate-800 p-3.5 rounded-xl flex flex-col justify-between">
          <div className="text-[11px] font-semibold text-slate-400 uppercase">
            Reposición Proveedores
          </div>
          <button
            onClick={handleGenerateWhatsAppReplenishment}
            className="mt-1 w-full py-2 px-3 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Pedir por WhatsApp</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 p-3 rounded-2xl border border-slate-800 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, código o marca..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs font-medium focus:outline-none focus:border-blue-500"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-700 rounded-xl text-white text-xs focus:outline-none focus:border-blue-500"
        >
          <option value="all">Todos los rubros ({categories.length})</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Código / EAN</th>
                <th className="py-3 px-4">Artículo</th>
                <th className="py-3 px-4">Rubro</th>
                <th className="py-3 px-4 text-right">Costo</th>
                <th className="py-3 px-4 text-right">Venta</th>
                <th className="py-3 px-4 text-right">Margen</th>
                <th className="py-3 px-4 text-center">Stock</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 font-medium">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500">
                    No se encontraron productos con los filtros seleccionados.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const margin = calculateMargin(product.costPrice, product.salePrice);
                  const isCrit = product.stock <= 0;
                  const isLow = product.stock <= product.minStock && product.stock > 0;

                  return (
                    <tr
                      key={product.id}
                      className="hover:bg-slate-800/50 transition"
                    >
                      {/* Barcode */}
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                        {product.barcode}
                        {product.isQuickItem && (
                          <span className="ml-1.5 px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 text-[9px]">
                            Rápido
                          </span>
                        )}
                      </td>

                      {/* Name & Brand */}
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-100 block">
                          {product.name}
                        </span>
                        {product.brand && (
                          <span className="text-[10px] text-slate-500">
                            {product.brand}
                          </span>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-slate-400">
                        {product.category}
                      </td>

                      {/* Cost Price */}
                      <td className="py-3 px-4 text-right font-mono text-slate-400">
                        {formatMoney(product.costPrice)}
                      </td>

                      {/* Sale Price */}
                      <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                        {formatMoney(product.salePrice)}
                      </td>

                      {/* Margin */}
                      <td className="py-3 px-4 text-right font-mono">
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            margin >= 30
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : 'text-amber-400 bg-amber-500/10'
                          }`}
                        >
                          +{margin}%
                        </span>
                      </td>

                      {/* Stock with Traffic Light */}
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold ${
                            isCrit
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : isLow
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isCrit
                                ? 'bg-rose-500'
                                : isLow
                                ? 'bg-amber-500'
                                : 'bg-emerald-400'
                            }`}
                          ></span>
                          {product.stock} un.
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingProduct(product);
                              setShowProductModal(true);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-400 hover:bg-slate-800 transition cursor-pointer"
                            title="Editar artículo"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`¿Eliminar "${product.name}" del catálogo?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer"
                            title="Eliminar artículo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      {showProductModal && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductModal(false);
            setEditingProduct(null);
          }}
        />
      )}

      {showBulkPriceModal && (
        <BulkPriceModal onClose={() => setShowBulkPriceModal(false)} />
      )}
    </div>
  );
};
