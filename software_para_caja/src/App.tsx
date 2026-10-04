import React, { useState, useRef, useEffect } from 'react';
import { usePOS } from './context/POSContext';
import { useBarcodeScanner } from './utils/barcodeListener';
import { Header } from './components/Header';
import { CartTable } from './components/Checkout/CartTable';
import { ProductCatalog } from './components/Checkout/ProductCatalog';
import { PaymentModal } from './components/Checkout/PaymentModal';
import { ReceiptModal } from './components/Checkout/ReceiptModal';
import { ParkedCartsModal } from './components/Checkout/ParkedCartsModal';
import { ShiftManager } from './components/CashRegister/ShiftManager';
import { WithdrawalsModal } from './components/CashRegister/WithdrawalsModal';
import { BlindCloseModal } from './components/CashRegister/BlindCloseModal';
import { InventoryManager } from './components/Inventory/InventoryManager';
import { AuditLogViewer } from './components/Audit/AuditLogViewer';
import { MetricsViewer } from './components/Metrics/MetricsViewer';
import { SettingsModal } from './components/Settings/SettingsModal';
import { Sale } from './types';

export const AppContent: React.FC = () => {
  const {
    scanBarcode,
    activeTab,
    cart,
    parkCurrentSale,
    activeShift,
  } = usePOS();

  // Search input ref to focus with F2
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active Modals
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showParkedModal, setShowParkedModal] = useState(false);
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [completedSale, setCompletedSale] = useState<Sale | null>(null);

  // Hardware Barcode Scanner listener (Global)
  useBarcodeScanner({
    onScan: (scannedCode) => {
      // Hardware barcode scanner automatically feeds into cart
      scanBarcode(scannedCode);
    },
  });

  // Global POS Keyboard Shortcuts
  useEffect(() => {
    const handleGlobalShortcuts = (e: KeyboardEvent) => {
      // F2: Focus Search
      if (e.key === 'F2') {
        e.preventDefault();
        searchInputRef.current?.focus();
        searchInputRef.current?.select();
        return;
      }

      // F4: Cobrar / Payment
      if (e.key === 'F4') {
        e.preventDefault();
        if (cart.length > 0 && !showPaymentModal) {
          setShowPaymentModal(true);
        }
        return;
      }

      // F8: Venta en espera
      if (e.key === 'F8') {
        e.preventDefault();
        if (cart.length > 0) {
          parkCurrentSale();
        }
        return;
      }
    };

    window.addEventListener('keydown', handleGlobalShortcuts);
    return () => window.removeEventListener('keydown', handleGlobalShortcuts);
  }, [cart, showPaymentModal, parkCurrentSale]);

  const handleSaleCompleted = (sale: Sale) => {
    setShowPaymentModal(false);
    setCompletedSale(sale);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Persistent Navigation Header */}
      <Header
        onOpenWithdrawalModal={() => setShowWithdrawalModal(true)}
        onOpenShiftModal={() => setShowShiftModal(true)}
        onOpenSettingsModal={() => setShowSettingsModal(true)}
      />

      {/* Main Container */}
      <main className="flex-1 p-2 sm:p-4 overflow-y-auto">
        {activeTab === 'checkout' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 h-[calc(100vh-5.5rem)]">
            {/* Left Column: Cart Table (5 cols on large screens) */}
            <div className="lg:col-span-5 h-full">
              <CartTable
                onOpenPaymentModal={() => setShowPaymentModal(true)}
                onOpenParkedModal={() => setShowParkedModal(true)}
              />
            </div>

            {/* Right Column: Catalog, Quick Buttons & Search (7 cols) */}
            <div className="lg:col-span-7 h-full">
              <ProductCatalog searchInputRef={searchInputRef} />
            </div>
          </div>
        )}

        {activeTab === 'shifts' && <ShiftManager />}

        {activeTab === 'inventory' && <InventoryManager />}

        {activeTab === 'audit' && <AuditLogViewer />}

        {activeTab === 'metrics' && <MetricsViewer />}
      </main>

      {/* Modals */}
      {showPaymentModal && (
        <PaymentModal
          onClose={() => setShowPaymentModal(false)}
          onSaleCompleted={handleSaleCompleted}
        />
      )}

      {completedSale && (
        <ReceiptModal
          sale={completedSale}
          onClose={() => setCompletedSale(null)}
        />
      )}

      {showParkedModal && (
        <ParkedCartsModal onClose={() => setShowParkedModal(false)} />
      )}

      {showWithdrawalModal && (
        <WithdrawalsModal onClose={() => setShowWithdrawalModal(false)} />
      )}

      {showShiftModal && (
        <BlindCloseModal onClose={() => setShowShiftModal(false)} />
      )}

      {showSettingsModal && (
        <SettingsModal onClose={() => setShowSettingsModal(false)} />
      )}
    </div>
  );
};
