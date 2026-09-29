import * as XLSX from 'xlsx';
import type { Product } from './products';

// Exporta una plantilla de Excel con las columnas listas y productos de ejemplo
export function downloadExcelTemplate(products: Product[]) {
  const data = products.map((p) => ({
    'Código de Barras': p.barcode || '',
    'Nombre del Producto': p.name,
    'Categoría': p.category,
    'Precio': p.price,
    'Unidad': p.unit || 'c/u',
    'Descripción': p.description || '',
    'Etiqueta / Badge': p.badge || '',
    'URL Imagen': p.image || ''
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Productos');

  // Ajustar anchos de columna
  worksheet['!cols'] = [
    { wch: 18 }, // Código de barras
    { wch: 32 }, // Nombre
    { wch: 20 }, // Categoría
    { wch: 12 }, // Precio
    { wch: 10 }, // Unidad
    { wch: 40 }, // Descripción
    { wch: 15 }, // Etiqueta
    { wch: 35 }  // URL Imagen
  ];

  XLSX.writeFile(workbook, 'Lista_Productos_Comercio.xlsx');
}

// Parsea un archivo subido (.xlsx o .csv) a una lista de Product[]
export async function parseExcelFile(file: File): Promise<Product[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rawJson: any[] = XLSX.utils.sheet_to_json(worksheet);

        const parsedProducts: Product[] = rawJson.map((row, idx) => {
          // Permisivo con nombres de columnas comunes
          const name = row['Nombre del Producto'] || row['Nombre'] || row['Producto'] || row['nombre'] || 'Producto sin nombre';
          const priceRaw = row['Precio'] || row['precio'] || row['Precio Venta'] || 0;
          const price = typeof priceRaw === 'number' ? priceRaw : parseFloat(String(priceRaw).replace(/[^0-9.-]+/g, '')) || 0;
          const category = row['Categoría'] || row['Categoria'] || row['categoria'] || 'General';
          const barcode = String(row['Código de Barras'] || row['Codigo'] || row['codigo'] || '').trim();
          const unit = row['Unidad'] || row['unidad'] || 'c/u';
          const description = row['Descripción'] || row['Descripcion'] || row['descripcion'] || '';
          const badge = row['Etiqueta / Badge'] || row['Etiqueta'] || row['badge'] || '';
          const image = row['URL Imagen'] || row['Imagen'] || row['imagen'] || 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=500&auto=format&fit=crop&q=60';

          return {
            id: `prod-import-${Date.now()}-${idx}`,
            name,
            price,
            category,
            barcode,
            unit,
            description,
            badge,
            image
          };
        });

        resolve(parsedProducts);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (error) => reject(error);
    reader.readAsArrayBuffer(file);
  });
}
