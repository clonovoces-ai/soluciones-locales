import { Product, CashShift, Sale, AuditLog, AppSettings, ParkedCart } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    barcode: '7790895000997',
    name: 'Coca Cola 2.25L Sabor Original',
    brand: 'Coca Cola',
    category: 'Bebidas',
    costPrice: 2400,
    salePrice: 3500,
    stock: 24,
    minStock: 8,
  },
  {
    id: 'prod-2',
    barcode: '7790895000454',
    name: 'Coca Cola 500ml',
    brand: 'Coca Cola',
    category: 'Bebidas',
    costPrice: 1000,
    salePrice: 1600,
    stock: 45,
    minStock: 12,
  },
  {
    id: 'prod-3',
    barcode: '7791813423143',
    name: 'Alfajor Havanna Mar del Plata',
    brand: 'Havanna',
    category: 'Golosinas',
    costPrice: 1500,
    salePrice: 2200,
    stock: 30,
    minStock: 10,
  },
  {
    id: 'prod-4',
    barcode: '7790580120000',
    name: 'Galletitas Chocolinas 250g',
    brand: 'Bagley',
    category: 'Almacén',
    costPrice: 1200,
    salePrice: 1850,
    stock: 18,
    minStock: 6,
  },
  {
    id: 'prod-5',
    barcode: '7790742111002',
    name: 'Yerba Mate Playadito 1kg',
    brand: 'Playadito',
    category: 'Almacén',
    costPrice: 3100,
    salePrice: 4600,
    stock: 15,
    minStock: 5,
  },
  {
    id: 'prod-6',
    barcode: '7791234567890',
    name: 'Cigarrillos Marlboro Box 20',
    brand: 'Marlboro',
    category: 'Tabaquería',
    costPrice: 3200,
    salePrice: 3600,
    stock: 40,
    minStock: 10,
  },
  {
    id: 'prod-7',
    barcode: '7798014561234',
    name: 'Agua Villavicencio 1.5L Sin Gas',
    brand: 'Villavicencio',
    category: 'Bebidas',
    costPrice: 900,
    salePrice: 1400,
    stock: 4,
    minStock: 10, // Stock bajo de prueba
  },
  {
    id: 'prod-8',
    barcode: '7790040112345',
    name: 'Caramelos Sugus Confitados 50g',
    brand: 'Arcor',
    category: 'Golosinas',
    costPrice: 450,
    salePrice: 750,
    stock: 0, // Stock crítico de prueba
    minStock: 15,
  },
  // Artículos Rápidos (Botonera frecuente sin código de barras)
  {
    id: 'quick-1',
    barcode: 'RAPIDO-01',
    name: 'Bolsa de Consorcio Reforzada',
    brand: 'Genérica',
    category: 'Bazar / Limpieza',
    costPrice: 150,
    salePrice: 350,
    stock: 120,
    minStock: 30,
    isQuickItem: true,
  },
  {
    id: 'quick-2',
    barcode: 'RAPIDO-02',
    name: 'Bolsa de Hielo en Rolito 2kg',
    brand: 'Hielo Polar',
    category: 'Bebidas',
    costPrice: 1200,
    salePrice: 2000,
    stock: 25,
    minStock: 10,
    isQuickItem: true,
  },
  {
    id: 'quick-3',
    barcode: 'RAPIDO-03',
    name: 'Fotocopia Simple B/N',
    brand: 'Servicios',
    category: 'Servicios',
    costPrice: 50,
    salePrice: 200,
    stock: 9999,
    minStock: 50,
    isQuickItem: true,
  },
  {
    id: 'quick-4',
    barcode: 'RAPIDO-04',
    name: 'Caramelo Suelto Surtido (x1)',
    brand: 'Varios',
    category: 'Golosinas',
    costPrice: 60,
    salePrice: 150,
    stock: 350,
    minStock: 50,
    isQuickItem: true,
  },
  {
    id: 'quick-5',
    barcode: 'RAPIDO-05',
    name: 'Carga Virtual / Seguro de Servicio',
    brand: 'Servicios',
    category: 'Servicios',
    costPrice: 0,
    salePrice: 300,
    stock: 9999,
    minStock: 10,
    isQuickItem: true,
  }
];

export const INITIAL_SETTINGS: AppSettings = {
  businessName: 'Kiosco & Almacén El Progreso',
  taxCondition: 'Control Interno y Venta Local',
  address: 'Av. Corrientes 3450, CABA',
  phone: '+54 9 11 5555-4321',
  ticketFooter: '¡Muchas gracias por su compra!',
  ticketWidth: '58mm',
  soundEnabled: true,
  adminPin: '1234', // Clave predeterminada de administrador / dueño
};

const STORAGE_KEYS = {
  PRODUCTS: 'pos_products_v1',
  SHIFTS: 'pos_shifts_v1',
  ACTIVE_SHIFT: 'pos_active_shift_v1',
  SALES: 'pos_sales_v1',
  AUDIT: 'pos_audit_v1',
  SETTINGS: 'pos_settings_v1',
  PARKED: 'pos_parked_v1',
  TICKET_SEQ: 'pos_ticket_seq_v1',
};

export class StorageService {
  static getProducts(): Product[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(INITIAL_PRODUCTS));
      return INITIAL_PRODUCTS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_PRODUCTS;
    }
  }

  static saveProducts(products: Product[]): void {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
  }

  static getActiveShift(): CashShift | null {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_SHIFT);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  static saveActiveShift(shift: CashShift | null): void {
    if (shift) {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_SHIFT, JSON.stringify(shift));
    } else {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_SHIFT);
    }
  }

  static getShifts(): CashShift[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SHIFTS);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveShifts(shifts: CashShift[]): void {
    localStorage.setItem(STORAGE_KEYS.SHIFTS, JSON.stringify(shifts));
  }

  static getSales(): Sale[] {
    const raw = localStorage.getItem(STORAGE_KEYS.SALES);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveSales(sales: Sale[]): void {
    localStorage.setItem(STORAGE_KEYS.SALES, JSON.stringify(sales));
  }

  static getNextTicketNumber(): number {
    const current = Number(localStorage.getItem(STORAGE_KEYS.TICKET_SEQ) || '1000');
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.TICKET_SEQ, next.toString());
    return next;
  }

  static getAuditLogs(): AuditLog[] {
    const raw = localStorage.getItem(STORAGE_KEYS.AUDIT);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveAuditLogs(logs: AuditLog[]): void {
    localStorage.setItem(STORAGE_KEYS.AUDIT, JSON.stringify(logs));
  }

  static getParkedCarts(): ParkedCart[] {
    const raw = localStorage.getItem(STORAGE_KEYS.PARKED);
    if (!raw) return [];
    try {
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveParkedCarts(carts: ParkedCart[]): void {
    localStorage.setItem(STORAGE_KEYS.PARKED, JSON.stringify(carts));
  }

  static getSettings(): AppSettings {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(INITIAL_SETTINGS));
      return INITIAL_SETTINGS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return INITIAL_SETTINGS;
    }
  }

  static saveSettings(settings: AppSettings): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }

  // Backup Full JSON
  static exportFullBackup(): string {
    const data = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      products: this.getProducts(),
      shifts: this.getShifts(),
      activeShift: this.getActiveShift(),
      sales: this.getSales(),
      audit: this.getAuditLogs(),
      settings: this.getSettings(),
    };
    return JSON.stringify(data, null, 2);
  }

  static importFullBackup(jsonContent: string): boolean {
    try {
      const data = JSON.parse(jsonContent);
      if (data.products) this.saveProducts(data.products);
      if (data.shifts) this.saveShifts(data.shifts);
      if (data.activeShift) this.saveActiveShift(data.activeShift);
      if (data.sales) this.saveSales(data.sales);
      if (data.audit) this.saveAuditLogs(data.audit);
      if (data.settings) this.saveSettings(data.settings);
      return true;
    } catch {
      return false;
    }
  }
}
