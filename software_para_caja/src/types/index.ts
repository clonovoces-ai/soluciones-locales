export type Role = 'cajero' | 'dueno';

export type PaymentMethod = 'efectivo' | 'transferencia' | 'debito' | 'credito' | 'mixto';

export interface Product {
  id: string;
  barcode: string;
  name: string;
  brand: string;
  category: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  minStock: number;
  isQuickItem?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface PaymentDetails {
  method: PaymentMethod;
  amountEfectivo?: number;
  amountDigital?: number;
  voucherRef?: string;
  cashReceived?: number;
  cashChange?: number;
}

export interface Sale {
  id: string;
  ticketNumber: number;
  timestamp: string;
  cashierName: string;
  shiftId: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  payment: PaymentDetails;
  isVoided: boolean;
}

export type WithdrawalReason = 
  | 'proveedor'
  | 'gastos_operativos'
  | 'adelanto_sueldo'
  | 'retiro_dueno';

export interface CashWithdrawal {
  id: string;
  shiftId: string;
  timestamp: string;
  cashierName: string;
  reasonType: WithdrawalReason;
  amount: number;
  description: string;
}

export type ShiftStatus = 'open' | 'closed';

export interface CashShift {
  id: string;
  cashierName: string;
  shiftType: 'Mañana' | 'Tarde' | 'Noche' | 'Completo';
  openedAt: string;
  closedAt?: string;
  initialCash: number;
  status: ShiftStatus;
  withdrawals: CashWithdrawal[];
  declaredCash?: number;
  expectedCash?: number;
  cashDifference?: number;
  notes?: string;
}

export type AuditSeverity = 'info' | 'warning' | 'danger';

export type AuditEventType = 
  | 'sale_voided'
  | 'item_removed'
  | 'price_override'
  | 'manual_drawer_open'
  | 'shift_opened'
  | 'shift_closed'
  | 'price_bulk_update'
  | 'withdrawal_created'
  | 'backup_export';

export interface AuditLog {
  id: string;
  timestamp: string;
  eventType: AuditEventType;
  cashierName: string;
  details: string;
  severity: AuditSeverity;
  metadata?: Record<string, any>;
}

export interface ParkedCart {
  id: string;
  timestamp: string;
  note: string;
  items: CartItem[];
}

export interface AppSettings {
  businessName: string;
  taxCondition: string; // "Responsable Inscripto", "Monotributo", "Uso Interno"
  address: string;
  phone: string;
  ticketFooter: string;
  ticketWidth: '58mm' | '80mm';
  soundEnabled: boolean;
  adminPin: string;
}
