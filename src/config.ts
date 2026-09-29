// Configuración principal del comercio
// Solo necesitas cambiar estos datos para adaptarlo a cualquier cliente en 2 minutos

export interface StoreConfig {
  name: string;
  tagline: string;
  badge: string;
  whatsapp: string; // Formato internacional sin '+' ni espacios (ej: 5491122334455)
  instagram: string;
  address: string;
  mapsUrl: string;
  hours: string;
  deliveryNotice: string;
  paymentMethods: string[];
  bannerAlert?: string;
}

export const storeConfig: StoreConfig = {
  name: "Almacén & Kiosco Central",
  tagline: "Bebidas frías, golosinas, fiambres y todo para tu día al mejor precio",
  badge: "🟢 Abierto Ahora • Envíos en 30-45 min",
  whatsapp: "5491100000000", // Reemplazar con el número real del cliente
  instagram: "almacencentral.ok",
  address: "Av. Rivadavia 4520, CABA",
  mapsUrl: "https://maps.google.com/?q=Av.+Rivadavia+4520",
  hours: "Lun a Sáb: 08:30 a 23:00 | Dom: 10:00 a 21:00",
  deliveryNotice: "🛵 Envíos sin cargo en el barrio a partir de $8.000",
  paymentMethods: [
    "💵 Efectivo (10% descuento)",
    "💳 Débito / Tarjetas",
    "📲 Mercado Pago / QR",
    "🏦 Transferencia Bancaria"
  ],
  bannerAlert: "🔥 ¡Promoción de la semana: 15% off en snacks seleccionados pagando en efectivo!"
};
