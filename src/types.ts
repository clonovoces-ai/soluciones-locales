export interface Product {
  id: string;
  code?: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  unit?: string; // 'unidad', '100g', 'kg', 'pack'
  description: string;
  image: string;
  badge?: string; // '🔥 Oferta', '⭐ Más vendido', '❄️ Frío', etc.
  stock?: boolean;
}

export interface StoreProfile {
  id: string;
  name: string;
  rubro: string;
  rubroIcon: string;
  tagline: string;
  badgeText: string;
  phone: string; // WhatsApp number
  address: string;
  hours: string;
  deliveryEstimate: string;
  freeShippingThreshold: number;
  shippingCost: number;
  cashDiscountPercent: number;
  heroHeadline: string;
  heroSubtitle: string;
  bannerNotice: string;
  themeColor: string; // Tailwind color class or hex
  accentColor: string;
  categories: { name: string; icon: string }[];
  products: Product[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  itemNotes?: string;
}

export interface CheckoutData {
  customerName: string;
  phone: string;
  deliveryType: 'envio' | 'retiro';
  address: string;
  floorApt: string;
  paymentMethod: string;
  notes: string;
}
