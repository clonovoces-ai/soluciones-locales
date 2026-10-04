import React, { useState, useRef } from 'react';
import { usePOS } from '../../context/POSContext';
import { X, Settings, Download, Upload, ShieldCheck, Printer, Save } from 'lucide-react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const { settings, updateSettings, exportBackup, importBackup } = usePOS();

  const [businessName, setBusinessName] = useState(settings.businessName);
  const [address, setAddress] = useState(settings.address);
  const [phone, setPhone] = useState(settings.phone);
  const [ticketFooter, setTicketFooter] = useState(settings.ticketFooter);
  const [ticketWidth, setTicketWidth] = useState(settings.ticketWidth);
  const [adminPin, setAdminPin] = useState(settings.adminPin);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      businessName,
      address,
      phone,
      ticketFooter,
      ticketWidth,
      adminPin: adminPin.trim() || '1234',
    });
    alert('Ajustes guardados correctamente.');
    onClose();
  };

  const handleExportBackup = () => {
    const json = exportBackup();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backup_pos_${businessName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      try {
        const text = evt.target?.result as string;
        const success = importBackup(text);
        if (success) {
          alert('¡Copia de seguridad restaurada con éxito!');
          onClose();
        } else {
          alert('Error: el archivo no es un backup válido.');
        }
      } catch {
        alert('Error al leer el archivo.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-800/90 px-6 py-4 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-2 text-slate-200">
            <Settings className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-base text-white">
              Configuración del Sistema POS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-700 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Business Info */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 text-sm">
              Datos del Comercio para Comprobantes
            </h4>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Nombre de Fantasía del Local:
              </label>
              <input
                type="text"
                required
                value={businessName}
                onChange={e => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-medium focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Dirección / Localidad:
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Teléfono / WhatsApp:
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1 font-semibold">
                Pie del Ticket:
              </label>
              <input
                type="text"
                value={ticketFooter}
                onChange={e => setTicketFooter(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Printer & Security */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <Printer className="w-4 h-4 text-emerald-400" />
              <span>Impresora y Seguridad</span>
            </h4>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  Ancho de Impresora Térmica:
                </label>
                <select
                  value={ticketWidth}
                  onChange={e => setTicketWidth(e.target.value as '58mm' | '80mm')}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-indigo-500"
                >
                  <option value="58mm">58mm (Mini Impresora POS)</option>
                  <option value="80mm">80mm (Estándar Punto de Venta)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1 font-semibold">
                  PIN de Administrador (Dueño):
                </label>
                <input
                  type="password"
                  maxLength={6}
                  value={adminPin}
                  onChange={e => setAdminPin(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono font-bold tracking-widest focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>
          </div>

          {/* Backup & Restore */}
          <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800">
            <h4 className="font-bold text-slate-200 text-sm flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Copia de Seguridad Inmune a Fallas</span>
            </h4>
            <p className="text-slate-400 text-[11px]">
              Descargue un archivo de respaldo con todos los productos, ventas, turnos e historial de auditoría para guardar en un pendrive o la nube.
            </p>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={handleExportBackup}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Descargar Backup JSON</span>
              </button>

              <input
                type="file"
                ref={fileInputRef}
                accept=".json"
                onChange={handleImportBackup}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <Upload className="w-4 h-4 text-indigo-400" />
                <span>Restaurar Backup</span>
              </button>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
            >
              Cerrar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition flex items-center gap-1.5 shadow cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Guardar Configuración</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
