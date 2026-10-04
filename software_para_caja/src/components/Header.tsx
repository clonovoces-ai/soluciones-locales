import React, { useState } from 'react';
import { usePOS } from '../context/POSContext';
import {
  ShoppingCart,
  Receipt,
  Package,
  ShieldAlert,
  BarChart3,
  Lock,
  Unlock,
  Volume2,
  VolumeX,
  CreditCard,
  Clock,
  UserCheck,
  AlertCircle
} from 'lucide-react';
import { PinModal } from './Auth/PinModal';

interface HeaderProps {
  onOpenWithdrawalModal: () => void;
  onOpenShiftModal: () => void;
  onOpenSettingsModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenWithdrawalModal,
  onOpenShiftModal,
  onOpenSettingsModal,
}) => {
  const {
    currentRole,
    switchRole,
    activeShift,
    activeTab,
    setActiveTab,
    settings,
    updateSettings,
    parkedCarts,
    triggerManualDrawerOpen,
  } = usePOS();

  const [showPinModal, setShowPinModal] = useState(false);

  const handleRoleToggle = () => {
    if (currentRole === 'cajero') {
      setShowPinModal(true);
    } else {
      // Switching back to cajero does not require pin
      switchRole('cajero');
    }
  };

  const handleTabClick = (tab: 'checkout' | 'shifts' | 'inventory' | 'audit' | 'metrics') => {
    if ((tab === 'audit' || tab === 'metrics') && currentRole !== 'dueno') {
      setShowPinModal(true);
      return;
    }
    setActiveTab(tab);
  };

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 select-none sticky top-0 z-40 shadow-lg">
      {/* Top utility bar */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 text-xs">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-slate-200 uppercase tracking-wide">
              {settings.businessName}
            </span>
          </div>

          <span className="text-slate-600">|</span>

          {/* Estado de Caja */}
          {activeShift ? (
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                Turno {activeShift.shiftType} ({activeShift.cashierName})
              </span>
              <button
                onClick={onOpenWithdrawalModal}
                className="text-amber-400 hover:text-amber-300 underline font-medium cursor-pointer ml-1"
                title="Registrar pago a proveedor, gasto o retiro"
              >
                + Retiro de Caja
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenShiftModal}
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 font-medium border border-amber-500/20 hover:bg-amber-500/20 transition-colors cursor-pointer"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              Caja Cerrada (Abrir Turno)
            </button>
          )}
        </div>

        {/* Atajos rápidos y modo de usuario */}
        <div className="flex items-center gap-3">
          {/* Botón manual cajón portabilletes */}
          <button
            onClick={() => triggerManualDrawerOpen('Apertura rápida desde barra')}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition border border-slate-700 cursor-pointer"
            title="Abrir cajón portabilletes (Registra auditoría)"
          >
            <CreditCard className="w-3.5 h-3.5 text-amber-400" />
            <span>Abrir Cajón</span>
          </button>

          {/* Toggle sonido */}
          <button
            onClick={() => updateSettings({ soundEnabled: !settings.soundEnabled })}
            className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            title={settings.soundEnabled ? 'Silenciar sonidos de escaneo' : 'Activar sonidos'}
          >
            {settings.soundEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>

          {/* Perfil Rol */}
          <button
            onClick={handleRoleToggle}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition border cursor-pointer ${
              currentRole === 'dueno'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 hover:bg-amber-500/30'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            {currentRole === 'dueno' ? (
              <>
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Modo Dueño</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Modo Cajero (Ciego)</span>
              </>
            )}
          </button>

          {/* Configuración */}
          {currentRole === 'dueno' && (
            <button
              onClick={onOpenSettingsModal}
              className="text-slate-400 hover:text-slate-200 transition cursor-pointer text-xs underline"
            >
              Ajustes
            </button>
          )}
        </div>
      </div>

      {/* Main navigation tabs */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Tab Checkout */}
          <button
            onClick={() => handleTabClick('checkout')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
              activeTab === 'checkout'
                ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Venta / Mostrador</span>
            {parkedCarts.length > 0 && (
              <span className="ml-1 bg-amber-500 text-slate-950 text-xs font-bold px-1.5 py-0.2 rounded-full">
                {parkedCarts.length}
              </span>
            )}
          </button>

          {/* Tab Arqueo y Turnos */}
          <button
            onClick={() => handleTabClick('shifts')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
              activeTab === 'shifts'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Receipt className="w-4 h-4" />
            <span>Arqueo y Turnos</span>
          </button>

          {/* Tab Inventario & Precios */}
          <button
            onClick={() => handleTabClick('inventory')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
              activeTab === 'inventory'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Inventario & Precios</span>
          </button>

          {/* Tab Auditoría Antirrobo (Exclusivo Dueño) */}
          <button
            onClick={() => handleTabClick('audit')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Auditoría Antirrobo</span>
            {currentRole !== 'dueno' && <Lock className="w-3 h-3 text-slate-500" />}
          </button>

          {/* Tab Métricas y Ganancias */}
          <button
            onClick={() => handleTabClick('metrics')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-medium text-sm transition cursor-pointer ${
              activeTab === 'metrics'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Métricas del Negocio</span>
            {currentRole !== 'dueno' && <Lock className="w-3 h-3 text-slate-500" />}
          </button>
        </div>

        {/* Badges de Atajos rápidos de teclado */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-400">
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">F2: Buscar</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">F4: Cobrar</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">F8: En Espera</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded border border-slate-700 font-mono">Supr: Borrar</span>
        </div>
      </div>

      {/* Modal de PIN para Administrador */}
      {showPinModal && (
        <PinModal
          onClose={() => setShowPinModal(false)}
          onSuccess={() => {
            setShowPinModal(false);
            switchRole('dueno', settings.adminPin);
          }}
        />
      )}
    </header>
  );
};
