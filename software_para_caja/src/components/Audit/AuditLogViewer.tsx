import React, { useState } from 'react';
import { usePOS } from '../../context/POSContext';
import { formatDateTime } from '../../utils/formatters';
import {
  ShieldAlert,
  AlertTriangle,
  Info,
  Clock,
  User,
  Trash2,
  Edit2,
  DollarSign,
  Download
} from 'lucide-react';

export const AuditLogViewer: React.FC = () => {
  const { auditLogs } = usePOS();
  const [filterSeverity, setFilterSeverity] = useState<'all' | 'danger' | 'warning' | 'info'>('all');

  const filteredLogs = auditLogs.filter(log => {
    if (filterSeverity === 'all') return true;
    return log.severity === filterSeverity;
  });

  const getEventBadge = (type: string, severity: string) => {
    switch (type) {
      case 'item_removed':
        return {
          label: 'Producto Borrado',
          icon: Trash2,
          color: 'bg-amber-500/10 text-amber-300 border-amber-500/20',
        };
      case 'price_override':
        return {
          label: 'Alteración de Precio',
          icon: Edit2,
          color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
        };
      case 'sale_voided':
        return {
          label: 'Venta Anulada',
          icon: AlertTriangle,
          color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
        };
      case 'manual_drawer_open':
        return {
          label: 'Apertura sin Venta',
          icon: DollarSign,
          color: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
        };
      default:
        return {
          label: type.replace('_', ' '),
          icon: Info,
          color: 'bg-slate-700/60 text-slate-300 border-slate-600',
        };
    }
  };

  const handleExportAudit = () => {
    let csv = 'FechaHora,Cajero,Evento,Gravedad,Detalle\n';
    auditLogs.forEach(l => {
      csv += `"${l.timestamp}","${l.cashierName}","${l.eventType}","${l.severity}","${l.details.replace(/"/g, '""')}"\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `auditoria_antirrobo_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-400">
            <ShieldAlert className="w-6 h-6" />
            <h2 className="text-xl font-bold text-white">
              Log de Auditoría Antirrobo (Caja Oculta)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Registro silencioso de toda acción sensible en mostrador: productos quitados del ticket, ventas descartadas, aperturas manuales de cajón y alteraciones de precios.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportAudit}
          className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Exportar Registro</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 text-xs">
        <button
          onClick={() => setFilterSeverity('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            filterSeverity === 'all'
              ? 'bg-slate-700 text-white'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          Todos ({auditLogs.length})
        </button>
        <button
          onClick={() => setFilterSeverity('danger')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            filterSeverity === 'danger'
              ? 'bg-rose-600 text-white shadow'
              : 'text-rose-400 hover:bg-slate-800'
          }`}
        >
          Críticos / Alertas Rojas ({auditLogs.filter(l => l.severity === 'danger').length})
        </button>
        <button
          onClick={() => setFilterSeverity('warning')}
          className={`px-3 py-1.5 rounded-lg font-medium transition cursor-pointer ${
            filterSeverity === 'warning'
              ? 'bg-amber-600 text-white shadow'
              : 'text-amber-400 hover:bg-slate-800'
          }`}
        >
          Advertencias ({auditLogs.filter(l => l.severity === 'warning').length})
        </button>
      </div>

      {/* Audit Events List */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden divide-y divide-slate-800">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-slate-500">
            <ShieldAlert className="w-10 h-10 mx-auto mb-2 opacity-30 text-slate-400" />
            <p className="font-semibold text-slate-300 text-sm">
              Sin eventos registrados
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Las acciones de cobro se desarrollan con total normalidad.
            </p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const badge = getEventBadge(log.eventType, log.severity);
            const Icon = badge.icon;

            return (
              <div
                key={log.id}
                className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 transition"
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`p-2 rounded-xl border shrink-0 ${
                      log.severity === 'danger'
                        ? 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                        : log.severity === 'warning'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide border ${badge.color}`}>
                        {badge.label}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">
                        {log.details}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {formatDateTime(log.timestamp)}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        Cajero: <strong className="text-slate-300">{log.cashierName}</strong>
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span
                    className={`font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      log.severity === 'danger'
                        ? 'text-rose-400 bg-rose-500/10'
                        : log.severity === 'warning'
                        ? 'text-amber-400 bg-amber-500/10'
                        : 'text-slate-400 bg-slate-800'
                    }`}
                  >
                    {log.severity}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
