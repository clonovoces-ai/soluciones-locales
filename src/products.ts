export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  unit?: string;
  description?: string;
  image?: string;
  badge?: string;
  badgeColor?: 'emerald' | 'amber' | 'rose' | 'indigo';
  barcode?: string;
  isPopular?: boolean;
}

export const initialProducts: Product[] = [
  // Promociones / Combos Destacados
  {
    id: "combo-01",
    name: "Combo Previa: Fernet Branca 750ml + 2 Coca Cola 1.5L",
    category: "Combos & Ofertas",
    price: 16900,
    oldPrice: 18200,
    unit: "combo",
    description: "Incluye 1 Fernet Branca 750ml + 2 botellas de Coca Cola 1.5L frías",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80",
    badge: "🔥 Super Promo",
    badgeColor: "rose",
    isPopular: true
  },
  {
    id: "combo-02",
    name: "Pack Picada Familiar: Queso Tybo + Salame Milán + Papas Lays",
    category: "Combos & Ofertas",
    price: 6800,
    oldPrice: 7500,
    unit: "pack",
    description: "250g queso tybo feteado + 150g salame feteado + 1 papas Lays grandes",
    image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80",
    badge: "Especial",
    badgeColor: "amber",
    isPopular: true
  },

  // Bebidas
  {
    id: "beb-01",
    name: "Coca Cola Sabor Original 1.5L",
    category: "Bebidas",
    price: 2600,
    oldPrice: 2800,
    unit: "c/u",
    description: "Botella descartable. Bien fría o natural.",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=80",
    badge: "Más vendido",
    badgeColor: "emerald",
    barcode: "7790895000454",
    isPopular: true
  },
  {
    id: "beb-02",
    name: "Cerveza Quilmes Clásica 1L",
    category: "Bebidas",
    price: 2400,
    unit: "c/u",
    description: "Presentación retornable o descartable. Muy fría.",
    image: "https://images.unsplash.com/photo-1608270191870-07206497f6c3?w=600&auto=format&fit=crop&q=80",
    badge: "Imperdible",
    badgeColor: "amber",
    barcode: "7790070411327"
  },
  {
    id: "beb-03",
    name: "Agua Mineral Villavicencio con Gas 1.5L",
    category: "Bebidas",
    price: 1500,
    unit: "c/u",
    description: "Agua mineral natural de manantial",
    image: "https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80",
    barcode: "7790314050228"
  },
  {
    id: "beb-04",
    name: "Aperitivo Fernet Branca 750ml",
    category: "Bebidas",
    price: 12500,
    unit: "c/u",
    description: "El clásico digestivo y aperitivo de hierbas",
    image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=80",
    badge: "Top Ventas",
    badgeColor: "emerald",
    barcode: "7790470000013"
  },
  {
    id: "beb-05",
    name: "Jugo Cepita Naranja 1L",
    category: "Bebidas",
    price: 1850,
    unit: "c/u",
    description: "Jugo enriquecido con vitaminas A, C y E",
    image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=600&auto=format&fit=crop&q=80",
    barcode: "7790895000508"
  },

  // Golosinas y Snacks
  {
    id: "gol-01",
    name: "Alfajor Havanna 70% Cacao Puro",
    category: "Golosinas & Snacks",
    price: 1900,
    oldPrice: 2100,
    unit: "c/u",
    description: "Relleno con abundante dulce de leche y cobertura de cacao amargo",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=600&auto=format&fit=crop&q=80",
    badge: "Destacado",
    badgeColor: "amber",
    barcode: "7791234567890",
    isPopular: true
  },
  {
    id: "gol-02",
    name: "Papas Fritas Lays Clásicas 85g",
    category: "Golosinas & Snacks",
    price: 1800,
    unit: "c/u",
    description: "Crocantes, seleccionadas y en su punto ideal de sal marina",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=600&auto=format&fit=crop&q=80",
    badge: "Oferta",
    badgeColor: "rose",
    barcode: "7790310001018"
  },
  {
    id: "gol-03",
    name: "Chocolate Milka con Leche Alpino 100g",
    category: "Golosinas & Snacks",
    price: 2300,
    unit: "c/u",
    description: "Auténtico chocolate con leche de los Alpes",
    image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=80",
    barcode: "7622210609380"
  },
  {
    id: "gol-04",
    name: "Caramelos Sugus Confitados 50g",
    category: "Golosinas & Snacks",
    price: 950,
    unit: "paq.",
    description: "Sabores frutales surtidos masticables",
    image: "https://images.unsplash.com/photo-1582058091505-f87a2e55a40f?w=600&auto=format&fit=crop&q=80",
    barcode: "7790040112345"
  },

  // Almacén
  {
    id: "alm-01",
    name: "Yerba Mate Playadito con Palo 1kg",
    category: "Almacén",
    price: 4600,
    oldPrice: 4950,
    unit: "paq.",
    description: "Elaborada con palo, de molienda suave y prolongada duración",
    image: "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=600&auto=format&fit=crop&q=80",
    badge: "Favorito",
    badgeColor: "emerald",
    barcode: "7790387011409",
    isPopular: true
  },
  {
    id: "alm-02",
    name: "Café La Virginia Torrado Molido 500g",
    category: "Almacén",
    price: 4900,
    unit: "paq.",
    description: "Aroma y cuerpo intenso para tus desayunos",
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80",
    barcode: "7790070100016"
  },
  {
    id: "alm-03",
    name: "Fideos Spaghetti Matarazzo 500g",
    category: "Almacén",
    price: 1650,
    unit: "paq.",
    description: "100% trigo candeal seleccionado, no se pegan ni se pasan",
    image: "https://images.unsplash.com/photo-1621996346565-e3d5d6281699?w=600&auto=format&fit=crop&q=80",
    barcode: "7790070001023"
  },
  {
    id: "alm-04",
    name: "Aceite de Girasol Cocinero 900ml",
    category: "Almacén",
    price: 2150,
    unit: "botella",
    description: "Aceite puro de girasol, liviano y con vitamina E",
    image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=80",
    barcode: "7790060000012"
  },

  // Lácteos & Fiambrería
  {
    id: "lac-01",
    name: "Leche La Serenísima Clásica Entera 1L",
    category: "Lácteos & Fiambrería",
    price: 1550,
    unit: "sachet",
    description: "Leche entera fresca fortificada con vitaminas A, C y D",
    image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80",
    barcode: "7793940301019"
  },
  {
    id: "lac-02",
    name: "Queso Cremoso La Paulina (x 500g)",
    category: "Lácteos & Fiambrería",
    price: 3200,
    oldPrice: 3500,
    unit: "x 500g",
    description: "Excelente fundido, cremosidad y sabor suave",
    image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=80",
    badge: "Oferta",
    badgeColor: "rose",
    barcode: "7790080004014"
  },
  {
    id: "lac-03",
    name: "Jamón Cocido Feteado Primera Calidad (x 200g)",
    category: "Lácteos & Fiambrería",
    price: 2400,
    unit: "x 200g",
    description: "Feteado fresco en el día",
    image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&auto=format&fit=crop&q=80",
    barcode: "7790080009999"
  }
];
