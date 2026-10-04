import React from 'react';
import { Sale } from '../../types';
import { usePOS } from '../../context/POSContext';
import { formatMoney, formatDateTime } from '../../utils/formatters';
import { Printer, MessageCircle, X, CheckCircle2 } from 'lucide-react';

interface ReceiptModalProps {
  sale: Sale;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ sale, onClose }) => {
  const { settings } = usePOS();

  const handlePrint = () => {
    window.print();
  };

  const handleShareWhatsApp = () => {
    // Generate text receipt formatted for WhatsApp
    let text = `*COMPROBANTE DE VENTA INTERNO*\n`;
    text += `*${settings.businessName}*\n`;
    text += `Ticket #${sale.ticketNumber}\n`;
    text += `Fecha: ${formatDateTime(sale.timestamp)}\n`;
    text += `--------------------------------\n`;

    sale.items.forEach(item => {
      text += `${item.quantity}x ${item.product.name} - ${formatMoney(item.subtotal)}\n`;
    });

    text += `--------------------------------\n`;
    text += `*TOTAL: ${formatMoney(sale.total)}*\n`;
    text += `Método: ${sale.payment.method.toUpperCase()}\n`;
    text += `--------------------------------\n`;
    text += `_DOCUMENTO NO VÁLIDO COMO FACTURA_\n_USO EXCLUSIVO DE CONTROL INTERNO_\n`;

    const encoded = encodeURIComponent(text);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col my-auto">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <div>
              <h3 className="font-bold text-base">¡Cobro Registrado!</h3>
              <p className="text-xs text-emerald-100">Ticket #{sale.ticketNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-100 hover:text-white p-1 rounded-lg hover:bg-emerald-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Thermal Ticket Preview (Simulador térmico en blanco/negro) */}
        <div className="p-4 bg-slate-950 flex justify-center">
          <div
            id="thermal-receipt"
            className="bg-white text-slate-900 font-mono text-xs p-5 shadow-md w-full max-w-[320px] rounded border border-slate-200"
            style={{ fontFamily: '"Courier New", Courier, monospace' }}
          >
            {/* Encabezado Comercio */}
            <div className="text-center pb-2 border-b border-dashed border-slate-400">
              <h2 className="font-black text-sm uppercase tracking-wide">
                {settings.businessName}
              </h2>
              <p className="text-[11px] text-slate-600 mt-0.5">{settings.address}</p>
              {settings.phone && (
                <p className="text-[11px] text-slate-600">Tel: {settings.phone}</p>
              )}
            </div>

            {/* Datos Ticket */}
            <div className="py-2 border-b border-dashed border-slate-400 text-[11px] space-y-0.5">
              <div className="flex justify-between">
                <span>TICKET Nº:</span>
                <span className="font-bold">{sale.ticketNumber}</span>
              </div>
              <div className="flex justify-between">
                <span>FECHA:</span>
                <span>{formatDateTime(sale.timestamp)}</span>
              </div>
              <div className="flex justify-between">
                <span>CAJERO:</span>
                <span>{sale.cashierName}</span>
              </div>
            </div>

            {/* Items */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
              <div className="flex justify-between font-bold text-[11px] text-slate-700">
                <span>CANT / ARTÍCULO</span>
                <span>SUBTOTAL</span>
              </div>
              {sale.items.map((item, idx) => (
                <div key={idx} className="text-[11px]">
                  <div className="flex justify-between">
                    <span className="font-semibold truncate max-w-[190px]">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span className="font-bold shrink-0">{formatMoney(item.subtotal)}</span>
                  </div>
                  {item.unitPrice !== item.product.salePrice && (
                    <div className="text-[9px] text-slate-500 italic">
                      (Precio ajustado: {formatMoney(item.unitPrice)} c/u)
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Totales */}
            <div className="py-2 border-b border-dashed border-slate-400 space-y-1">
              <div className="flex justify-between text-base font-black">
                <span>TOTAL VENTA:</span>
                <span>{formatMoney(sale.total)}</span>
              </div>

              <div className="flex justify-between text-[11px] pt-1">
                <span className="capitalize">MEDIO: {sale.payment.method}</span>
                {sale.payment.voucherRef && (
                  <span className="text-[10px] text-slate-600 font-normal">
                    Ref: {sale.payment.voucherRef}
                  </span>
                )}
              </div>

              {sale.payment.cashReceived !== undefined && (
                <>
                  <div className="flex justify-between text-[11px] text-slate-600">
                    <span>Abona con:</span>
                    <span>{formatMoney(sale.payment.cashReceived)}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-800 font-bold">
                    <span>Su Vuelto:</span>
                    <span>{formatMoney(sale.payment.cashChange || 0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Blindaje Legal Obligatorio */}
            <div className="pt-3 text-center space-y-1">
              <p className="font-bold text-[9px] uppercase leading-tight text-slate-800 border border-slate-800 p-1 rounded">
                DOCUMENTO NO VÁLIDO COMO FACTURA
                <br />
                USO EXCLUSIVO DE CONTROL INTERNO
              </p>
              <p className="text-[10px] text-slate-600 italic mt-1">
                {settings.ticketFooter}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleShareWhatsApp}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 font-semibold text-xs border border-emerald-500/30 transition cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>Enviar WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs shadow-md transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Imprimir Ticket</span>
          </button>
        </div>

        {/* Close Button */}
        <div className="p-3 bg-slate-950 text-center">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-xs font-bold text-slate-400 hover:text-white uppercase tracking-wider rounded-xl bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
          >
            Siguiente Venta
          </button>
        </div>
      </div>
    </div>
  );
};
