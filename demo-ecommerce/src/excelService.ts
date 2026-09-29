import * as XLSX from 'xlsx';
import type { Product, StoreProfile } from './types';

export function exportCatalogToExcel(profile: StoreProfile, customProducts?: Product[]) {
  const productsToExport = customProducts && customProducts.length > 0 ? customProducts : profile.products;

  const data = productsToExport.map((p, idx) => ({
    'Código': p.code || `PROD-${idx + 1}`,
    'Nombre del Producto': p.name,
    'Categoría': p.category,
    'Precio ($)': p.price,
    'Precio Anterior ($)': p.originalPrice || '',
    'Unidad / Presentación': p.unit || 'unidad',
    'Descripción': p.description,
    'Etiqueta / Promo': p.badge || '',
    'En Stock (SI/NO)': p.stock !== false ? 'SI' : 'NO'
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);

  // Auto-ajustar anchos de columnas
  const colWidths = [
    { wch: 12 }, // Código
    { wch: 38 }, // Nombre
    { wch: 22 }, // Categoría
    { wch: 14 }, // Precio
    { wch: 18 }, // Precio Anterior
    { wch: 20 }, // Unidad
    { wch: 45 }, // Descripción
    { wch: 20 }, // Etiqueta
    { wch: 16 }  // En Stock
  ];
  worksheet['!cols'] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Catálogo');

  const fileName = `Catalogo_${profile.name.replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export function parseExcelProducts(file: File): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const buffer = e.target?.result;
        const workbook = XLSX.read(buffer, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        if (!sheetName) {
          throw new Error('El archivo Excel no contiene hojas de cálculo.');
        }

        const sheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

        if (!rawRows || rawRows.length === 0) {
          throw new Error('La planilla Excel está vacía.');
        }

        const parsedProducts: Product[] = [];

        rawRows.forEach((row, index) => {
          // Soporta variaciones de nombres de columnas
          const name = String(row['Nombre del Producto'] || row['Nombre'] || row['Producto'] || '').trim();
          const category = String(row['Categoría'] || row['Categoria'] || row['Rubro'] || 'General').trim();
          const rawPrice = row['Precio ($)'] || row['Precio'] || row['Valor'] || 0;
          const price = typeof rawPrice === 'number' ? rawPrice : parseFloat(String(rawPrice).replace(/[^0-9.]/g, '')) || 0;
          const rawOldPrice = row['Precio Anterior ($)'] || row['Precio Anterior'];
          const originalPrice = rawOldPrice ? (typeof rawOldPrice === 'number' ? rawOldPrice : parseFloat(String(rawOldPrice))) : undefined;
          const unit = String(row['Unidad / Presentación'] || row['Unidad'] || 'unidad').trim();
          const description = String(row['Descripción'] || row['Descripcion'] || '').trim();
          const badge = String(row['Etiqueta / Promo'] || row['Promo'] || row['Etiqueta'] || '').trim();
          const code = String(row['Código'] || row['Codigo'] || `EX-${index + 1}`).trim();
          const stockRaw = String(row['En Stock (SI/NO)'] || row['Stock'] || 'SI').toUpperCase();
          const stock = !stockRaw.includes('NO');

          if (name && price > 0) {
            parsedProducts.push({
              id: `imported-${Date.now()}-${index}`,
              code,
              name,
              category,
              price,
              originalPrice,
              unit,
              description,
              badge: badge || undefined,
              stock,
              image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=700&q=80' // Imagen de placeholder de alta calidad
            });
          }
        });

        if (parsedProducts.length === 0) {
          throw new Error('No se encontraron filas válidas con Nombre y Precio mayor a 0.');
        }

        resolve(parsedProducts);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Error al procesar el archivo Excel.'));
      }
    };

    reader.onerror = () => reject(new Error('Error de lectura en el archivo.'));
    reader.readAsBinaryString(file);
  });
}
