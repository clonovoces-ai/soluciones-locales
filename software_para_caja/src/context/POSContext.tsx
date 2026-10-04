import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  CartItem,
  CashShift,
  Sale,
  AuditLog,
  ParkedCart,
  AppSettings,
  Role,
  PaymentDetails,
  WithdrawalReason,
  CashWithdrawal,
  AuditEventType,
  AuditSeverity
} from '../types';
import { StorageService } from '../utils/storage';
import { sound } from '../utils/audio';

interface POSContextType {
  products: Product[];
  cart: CartItem[];
  cartTotal: number;
  cartCount: number;
  activeShift: CashShift | null;
  shifts: CashShift[];
  sales: Sale[];
  auditLogs: AuditLog[];
  parkedCarts: ParkedCart[];
  settings: AppSettings;
  currentRole: Role;
  activeTab: 'checkout' | 'shifts' | 'inventory' | 'audit' | 'metrics';
  setActiveTab: (tab: 'checkout' | 'shifts' | 'inventory' | 'audit' | 'metrics') => void;
  
  // Checkout & Cart
  addToCart: (product: Product, quantity?: number) => void;
  scanBarcode: (barcode: string) => { success: boolean; product?: Product };
  updateCartItemQuantity: (productId: string, quantity: number) => void;
  removeCartItem: (productId: string) => void;
  overrideCartItemPrice: (productId: string, newPrice: number) => void;
  clearCart: (reason?: string) => void;
  parkCurrentSale: (note?: string) => void;
  restoreParkedSale: (parkedId: string) => void;
  deleteParkedSale: (parkedId: string) => void;
  completeSale: (payment: PaymentDetails) => Sale | null;
  voidSale: (saleId: string, reason: string) => void;
  
  // Shifts & Cash
  openShift: (cashierName: string, shiftType: CashShift['shiftType'], initialCash: number) => void;
  addCashWithdrawal: (reason: WithdrawalReason, amount: number, description: string) => void;
  closeShiftBlind: (declaredCash: number, notes?: string) => CashShift | null;
  triggerManualDrawerOpen: (reason?: string) => void;

  // Inventory & Pricing
  saveProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  bulkUpdatePrices: (percentage: number, filterType: 'all' | 'category' | 'brand', filterValue?: string) => number;
  
  // Roles & Settings
  switchRole: (role: Role, pin?: string) => boolean;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  logAuditEvent: (eventType: AuditEventType, details: string, severity?: AuditSeverity, metadata?: Record<string, any>) => void;
  
  // Backup
  exportBackup: () => string;
  importBackup: (jsonContent: string) => boolean;
}

const POSContext = createContext<POSContextType | undefined>(undefined);

export const POSProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeShift, setActiveShift] = useState<CashShift | null>(() => StorageService.getActiveShift());
  const [shifts, setShifts] = useState<CashShift[]>(() => StorageService.getShifts());
  const [sales, setSales] = useState<Sale[]>(() => StorageService.getSales());
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => StorageService.getAuditLogs());
  const [parkedCarts, setParkedCarts] = useState<ParkedCart[]>(() => StorageService.getParkedCarts());
  const [settings, setSettings] = useState<AppSettings>(() => StorageService.getSettings());
  const [currentRole, setCurrentRole] = useState<Role>('cajero');
  const [activeTab, setActiveTab] = useState<'checkout' | 'shifts' | 'inventory' | 'audit' | 'metrics'>('checkout');

  // Sound sync
  useEffect(() => {
    sound.enabled = settings.soundEnabled;
  }, [settings.soundEnabled]);

  // Persistence hooks
  useEffect(() => {
    StorageService.saveProducts(products);
  }, [products]);

  useEffect(() => {
    StorageService.saveActiveShift(activeShift);
  }, [activeShift]);

  useEffect(() => {
    StorageService.saveShifts(shifts);
  }, [shifts]);

  useEffect(() => {
    StorageService.saveSales(sales);
  }, [sales]);

  useEffect(() => {
    StorageService.saveAuditLogs(auditLogs);
  }, [auditLogs]);

  useEffect(() => {
    StorageService.saveParkedCarts(parkedCarts);
  }, [parkedCarts]);

  useEffect(() => {
    StorageService.saveSettings(settings);
  }, [settings]);

  // Auditoría Helper
  const logAuditEvent = (
    eventType: AuditEventType,
    details: string,
    severity: AuditSeverity = 'info',
    metadata?: Record<string, any>
  ) => {
    const cashier = activeShift ? activeShift.cashierName : (currentRole === 'dueno' ? 'Dueño/Admin' : 'Cajero');
    const newLog: AuditLog = {
      id: 'audit-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      eventType,
      cashierName: cashier,
      details,
      severity,
      metadata,
    };
    setAuditLogs(prev => [newLog, ...prev]);
  };

  // Cart Calculations
  const cartTotal = cart.reduce((sum, item) => sum + item.subtotal, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Cart Operations
  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: newQty,
          subtotal: newQty * updated[existingIndex].unitPrice,
        };
        return updated;
      } else {
        return [
          ...prevCart,
          {
            product,
            quantity,
            unitPrice: product.salePrice,
            subtotal: product.salePrice * quantity,
          },
        ];
      }
    });
    sound.playScanSuccess();
  };

  const scanBarcode = (barcode: string): { success: boolean; product?: Product } => {
    const cleanBarcode = barcode.trim();
    if (!cleanBarcode) return { success: false };

    const found = products.find(
      p => p.barcode.toLowerCase() === cleanBarcode.toLowerCase()
    );

    if (found) {
      addToCart(found, 1);
      return { success: true, product: found };
    } else {
      sound.playScanError();
      return { success: false };
    }
  };

  const updateCartItemQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeCartItem(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity,
            subtotal: quantity * item.unitPrice,
          };
        }
        return item;
      })
    );
  };

  const removeCartItem = (productId: string) => {
    const itemToRemove = cart.find(i => i.product.id === productId);
    if (itemToRemove) {
      // Auditoría antirrobo: registrar eliminación de ítem que ya estaba en el ticket
      logAuditEvent(
        'item_removed',
        `Producto borrado del carrito: "${itemToRemove.product.name}" (${itemToRemove.quantity} un. x $${itemToRemove.unitPrice})`,
        'warning',
        { productId, product: itemToRemove.product.name, qty: itemToRemove.quantity, subtotal: itemToRemove.subtotal }
      );
    }
    setCart(prev => prev.filter(i => i.product.id !== productId));
  };

  const overrideCartItemPrice = (productId: string, newPrice: number) => {
    const item = cart.find(i => i.product.id === productId);
    if (!item) return;

    if (newPrice !== item.product.salePrice) {
      logAuditEvent(
        'price_override',
        `Precio modificado en mostrador para "${item.product.name}": De $${item.product.salePrice} a $${newPrice}`,
        'danger',
        { productId, originalPrice: item.product.salePrice, overridePrice: newPrice }
      );
    }

    setCart(prev =>
      prev.map(i => {
        if (i.product.id === productId) {
          return {
            ...i,
            unitPrice: newPrice,
            subtotal: i.quantity * newPrice,
          };
        }
        return i;
      })
    );
  };

  const clearCart = (reason = 'Venta cancelada o vaciada en mostrador') => {
    if (cart.length > 0) {
      logAuditEvent(
        'sale_voided',
        `Carrito descartado antes de cobrar. Monto: $${cartTotal} (${cart.length} ítems). Motivo: ${reason}`,
        'danger',
        { total: cartTotal, itemCount: cart.length }
      );
    }
    setCart([]);
  };

  const parkCurrentSale = (note = 'Cliente en góndola') => {
    if (cart.length === 0) return;
    const newParked: ParkedCart = {
      id: 'parked-' + Date.now(),
      timestamp: new Date().toISOString(),
      note,
      items: [...cart],
    };
    setParkedCarts(prev => [newParked, ...prev]);
    setCart([]);
  };

  const restoreParkedSale = (parkedId: string) => {
    const target = parkedCarts.find(p => p.id === parkedId);
    if (!target) return;
    // Si el carrito actual tiene ítems, se aparca el actual antes de restaurar
    if (cart.length > 0) {
      parkCurrentSale('Venta previa desplazada');
    }
    setCart(target.items);
    setParkedCarts(prev => prev.filter(p => p.id !== parkedId));
  };

  const deleteParkedSale = (parkedId: string) => {
    const target = parkedCarts.find(p => p.id === parkedId);
    if (target) {
      const sum = target.items.reduce((s, i) => s + i.subtotal, 0);
      logAuditEvent(
        'sale_voided',
        `Venta en espera eliminada definitivamente. Monto: $${sum}. Nota: ${target.note}`,
        'warning'
      );
    }
    setParkedCarts(prev => prev.filter(p => p.id !== parkedId));
  };

  const completeSale = (payment: PaymentDetails): Sale | null => {
    if (cart.length === 0) return null;

    const ticketNumber = StorageService.getNextTicketNumber();
    const newSale: Sale = {
      id: 'sale-' + Date.now(),
      ticketNumber,
      timestamp: new Date().toISOString(),
      cashierName: activeShift ? activeShift.cashierName : 'Cajero 1',
      shiftId: activeShift ? activeShift.id : 'sin-turno',
      items: [...cart],
      subtotal: cartTotal,
      discount: 0,
      total: cartTotal,
      payment,
      isVoided: false,
    };

    // Actualizar stock de los productos
    setProducts(prevProducts => {
      const map = new Map(cart.map(c => [c.product.id, c.quantity]));
      return prevProducts.map(p => {
        if (map.has(p.id)) {
          const qtySold = map.get(p.id) || 0;
          return {
            ...p,
            stock: Math.max(0, p.stock - qtySold),
          };
        }
        return p;
      });
    });

    setSales(prev => [newSale, ...prev]);
    setCart([]);
    sound.playSaleSuccess();
    return newSale;
  };

  const voidSale = (saleId: string, reason: string) => {
    const sale = sales.find(s => s.id === saleId);
    if (!sale) return;

    // Restaurar stock
    setProducts(prevProducts => {
      const map = new Map(sale.items.map(c => [c.product.id, c.quantity]));
      return prevProducts.map(p => {
        if (map.has(p.id)) {
          const qty = map.get(p.id) || 0;
          return {
            ...p,
            stock: p.stock + qty,
          };
        }
        return p;
      });
    });

    setSales(prev =>
      prev.map(s => (s.id === saleId ? { ...s, isVoided: true } : s))
    );

    logAuditEvent(
      'sale_voided',
      `Ticket #${sale.ticketNumber} anulado por importe $${sale.total}. Motivo: ${reason}`,
      'danger',
      { saleId, ticketNumber: sale.ticketNumber, total: sale.total }
    );
  };

  // Shifts & Cash
  const openShift = (
    cashierName: string,
    shiftType: CashShift['shiftType'],
    initialCash: number
  ) => {
    const newShift: CashShift = {
      id: 'shift-' + Date.now(),
      cashierName,
      shiftType,
      openedAt: new Date().toISOString(),
      initialCash,
      status: 'open',
      withdrawals: [],
    };
    setActiveShift(newShift);
    logAuditEvent(
      'shift_opened',
      `Apertura de turno (${shiftType}) por cajero "${cashierName}". Fondo inicial: $${initialCash}`,
      'info',
      { shiftId: newShift.id, initialCash, cashierName }
    );
  };

  const addCashWithdrawal = (
    reason: WithdrawalReason,
    amount: number,
    description: string
  ) => {
    if (!activeShift) return;
    const withdrawal: CashWithdrawal = {
      id: 'with-' + Date.now(),
      shiftId: activeShift.id,
      timestamp: new Date().toISOString(),
      cashierName: activeShift.cashierName,
      reasonType: reason,
      amount,
      description,
    };

    const updatedShift: CashShift = {
      ...activeShift,
      withdrawals: [...activeShift.withdrawals, withdrawal],
    };

    setActiveShift(updatedShift);
    logAuditEvent(
      'withdrawal_created',
      `Salida de dinero ($${amount}) - Motivo: ${reason}. Detalle: "${description}"`,
      reason === 'retiro_dueno' ? 'info' : 'warning',
      { amount, reason, description }
    );
  };

  const closeShiftBlind = (declaredCash: number, notes = ''): CashShift | null => {
    if (!activeShift) return null;

    // Calcular ventas en efectivo del turno actual
    const shiftSales = sales.filter(
      s => s.shiftId === activeShift.id && !s.isVoided
    );

    const shiftCashSales = shiftSales.reduce((acc, s) => {
      if (s.payment.method === 'efectivo') {
        return acc + s.total;
      }
      if (s.payment.method === 'mixto') {
        return acc + (s.payment.amountEfectivo || 0);
      }
      return acc;
    }, 0);

    const totalWithdrawals = activeShift.withdrawals.reduce(
      (acc, w) => acc + w.amount,
      0
    );

    // Caja esperada = Fondo Inicial + Ventas Efectivo - Retiros
    const expectedCash = activeShift.initialCash + shiftCashSales - totalWithdrawals;
    const difference = declaredCash - expectedCash; // >0 Sobrante, <0 Faltante

    const closedShift: CashShift = {
      ...activeShift,
      closedAt: new Date().toISOString(),
      status: 'closed',
      declaredCash,
      expectedCash,
      cashDifference: difference,
      notes,
    };

    // Guardar en historial de turnos y limpiar turno activo
    setShifts(prev => [closedShift, ...prev]);
    setActiveShift(null);

    const diffSeverity: AuditSeverity =
      difference === 0 ? 'info' : Math.abs(difference) > 1000 ? 'danger' : 'warning';
    const diffText =
      difference === 0
        ? 'Caja exacta sin diferencias'
        : difference > 0
        ? `Sobrante de $${difference}`
        : `Faltante de $${Math.abs(difference)}`;

    logAuditEvent(
      'shift_closed',
      `Cierre de turno ciego finalizado. Cajero declaró: $${declaredCash} (Esperado: $${expectedCash}). Resultado: ${diffText}`,
      diffSeverity,
      { declaredCash, expectedCash, difference }
    );

    return closedShift;
  };

  const triggerManualDrawerOpen = (reason = 'Apertura manual por botón') => {
    sound.playDrawerClick();
    logAuditEvent(
      'manual_drawer_open',
      `Apertura de cajón portabilletes manual disparada sin cobro. Motivo: ${reason}`,
      'danger'
    );
  };

  // Inventory & Pricing
  const saveProduct = (product: Product) => {
    setProducts(prev => {
      const idx = prev.findIndex(p => p.id === product.id);
      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = product;
        return copy;
      } else {
        return [product, ...prev];
      }
    });
  };

  const deleteProduct = (productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
  };

  const bulkUpdatePrices = (
    percentage: number,
    filterType: 'all' | 'category' | 'brand',
    filterValue?: string
  ): number => {
    const factor = 1 + percentage / 100;
    let count = 0;

    setProducts(prev =>
      prev.map(p => {
        let match = false;
        if (filterType === 'all') match = true;
        if (filterType === 'category' && p.category === filterValue) match = true;
        if (filterType === 'brand' && p.brand === filterValue) match = true;

        if (match) {
          count++;
          const newSale = Math.round(p.salePrice * factor);
          const newCost = Math.round(p.costPrice * factor);
          return {
            ...p,
            salePrice: newSale,
            costPrice: newCost,
          };
        }
        return p;
      })
    );

    logAuditEvent(
      'price_bulk_update',
      `Actualización masiva de precios (+${percentage}%): Aplicado a ${count} productos (Filtro: ${filterType} ${filterValue || ''})`,
      'warning',
      { percentage, filterType, filterValue, count }
    );

    return count;
  };

  // Roles & PIN
  const switchRole = (role: Role, pin?: string): boolean => {
    if (role === 'cajero') {
      setCurrentRole('cajero');
      return true;
    }
    // Para cambiar a 'dueno', verificar PIN
    if (pin === settings.adminPin) {
      setCurrentRole('dueno');
      return true;
    }
    return false;
  };

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const exportBackup = () => {
    logAuditEvent('backup_export', 'Exportación de copia de seguridad del sistema descargada', 'info');
    return StorageService.exportFullBackup();
  };

  const importBackup = (jsonContent: string): boolean => {
    const ok = StorageService.importFullBackup(jsonContent);
    if (ok) {
      setProducts(StorageService.getProducts());
      setActiveShift(StorageService.getActiveShift());
      setShifts(StorageService.getShifts());
      setSales(StorageService.getSales());
      setAuditLogs(StorageService.getAuditLogs());
      setSettings(StorageService.getSettings());
      setParkedCarts(StorageService.getParkedCarts());
    }
    return ok;
  };

  return (
    <POSContext.Provider
      value={{
        products,
        cart,
        cartTotal,
        cartCount,
        activeShift,
        shifts,
        sales,
        auditLogs,
        parkedCarts,
        settings,
        currentRole,
        activeTab,
        setActiveTab,
        addToCart,
        scanBarcode,
        updateCartItemQuantity,
        removeCartItem,
        overrideCartItemPrice,
        clearCart,
        parkCurrentSale,
        restoreParkedSale,
        deleteParkedSale,
        completeSale,
        voidSale,
        openShift,
        addCashWithdrawal,
        closeShiftBlind,
        triggerManualDrawerOpen,
        saveProduct,
        deleteProduct,
        bulkUpdatePrices,
        switchRole,
        updateSettings,
        logAuditEvent,
        exportBackup,
        importBackup,
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = (): POSContextType => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
