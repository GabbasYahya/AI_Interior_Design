import { addDays, subDays } from "date-fns";

export type FurnitureDimensions = {
  width: number;
  depth: number;
  height: number;
};

export interface FurnitureProduct {
  id: string;
  sku: string;
  name: string;
  description: string;
  category: string;
  style: string[];
  room_type: string[];
  wood_type: string;
  finish: string;
  price: number;
  discount_price?: number;
  stock: number;
  featured?: boolean;
  image_path: string;
  weight: number;
  dimensions: FurnitureDimensions;
  created_at: string;
}

export interface StockStatus {
  status: "in_stock" | "low_stock" | "out_of_stock";
  message: string;
  available: boolean;
}

interface RecommendationOptions {
  style?: string;
  roomType?: string;
  budget?: number;
}

const CURRENCY_FORMATTER = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR"
});

const MOCK_PRODUCTS: FurnitureProduct[] = [
  {
    id: "prod-1",
    sku: "ADZ-SOFA-001",
    name: "Linea Velvet Sofa",
    description:
      "Canapé 3 places recouvert de velours côtelé, accoudoirs fins et structure en bois de hêtre massif.",
    category: "sofa",
    style: ["modern", "mid-century", "minimalist"],
    room_type: ["living_room"],
    wood_type: "Beech",
    finish: "Walnut",
    price: 1599,
    discount_price: 1399,
    stock: 12,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1616628188505-4041b48d87ed?auto=format&fit=crop&w=1200&q=80",
    weight: 58,
    dimensions: { width: 230, depth: 92, height: 84 },
    created_at: subDays(new Date(), 10).toISOString()
  },
  {
    id: "prod-2",
    sku: "ADZ-CHAIR-002",
    name: "Nordic Shell Lounge Chair",
    description:
      "Fauteuil coque minimaliste, assise en lin naturel et piètement en chêne blanchi.",
    category: "chair",
    style: ["scandinavian", "minimalist"],
    room_type: ["living_room", "bedroom"],
    wood_type: "Oak",
    finish: "Matte wax",
    price: 549,
    stock: 5,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    weight: 14,
    dimensions: { width: 78, depth: 72, height: 86 },
    created_at: subDays(new Date(), 21).toISOString()
  },
  {
    id: "prod-3",
    sku: "ADZ-TABLE-003",
    name: "Atlas Marble Dining Table",
    description:
      "Table de salle à manger avec plateau en marbre Calacatta et base en acier brossé.",
    category: "table",
    style: ["art_deco", "modern", "luxury"],
    room_type: ["dining_room"],
    wood_type: "Ash",
    finish: "Brushed steel",
    price: 2490,
    stock: 3,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    weight: 92,
    dimensions: { width: 200, depth: 100, height: 76 },
    created_at: subDays(new Date(), 5).toISOString()
  },
  {
    id: "prod-4",
    sku: "ADZ-DESK-004",
    name: "Aero Standing Desk",
    description:
      "Bureau réglable en hauteur avec plateau en noyer et cadre motorisé silencieux.",
    category: "desk",
    style: ["modern", "industrial"],
    room_type: ["office", "studio"],
    wood_type: "Walnut",
    finish: "Oil",
    price: 1299,
    discount_price: 1199,
    stock: 8,
    image_path:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    weight: 48,
    dimensions: { width: 160, depth: 80, height: 73 },
    created_at: subDays(new Date(), 30).toISOString()
  },
  {
    id: "prod-5",
    sku: "ADZ-LAMP-005",
    name: "Halo Arc Floor Lamp",
    description:
      "Lampadaire arc à LED, intensité variable, finition laiton brossé.",
    category: "lamp",
    style: ["modern", "contemporary"],
    room_type: ["living_room", "bedroom"],
    wood_type: "Aluminium",
    finish: "Brass",
    price: 389,
    stock: 18,
    image_path:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    weight: 9,
    dimensions: { width: 35, depth: 35, height: 192 },
    created_at: subDays(new Date(), 2).toISOString()
  },
  {
    id: "prod-6",
    sku: "ADZ-KITCH-006",
    name: "Aurora Kitchen Island",
    description:
      "Îlot de cuisine avec plan de travail quartz et rangements intégrés.",
    category: "kitchen",
    style: ["modern", "minimalist"],
    room_type: ["kitchen"],
    wood_type: "Birch",
    finish: "Matte lacquer",
    price: 2890,
    stock: 2,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1507668077129-56e32842fceb?auto=format&fit=crop&w=1200&q=80",
    weight: 120,
    dimensions: { width: 210, depth: 95, height: 92 },
    created_at: subDays(new Date(), 12).toISOString()
  },
  {
    id: "prod-7",
    sku: "ADZ-BED-007",
    name: "Cloud Nine Bed Frame",
    description:
      "Lit double avec tête de lit rembourrée et sommier en bois aux lattes flexibles.",
    category: "bed",
    style: ["minimalist", "luxury"],
    room_type: ["bedroom"],
    wood_type: "Oak",
    finish: "Natural oil",
    price: 1890,
    discount_price: 1690,
    stock: 6,
    image_path:
      "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80",
    weight: 65,
    dimensions: { width: 180, depth: 215, height: 110 },
    created_at: subDays(new Date(), 14).toISOString()
  },
  {
    id: "prod-8",
    sku: "ADZ-OUT-008",
    name: "Solstice Outdoor Set",
    description:
      "Salon d'extérieur en rotin synthétique, coussins déperlants, table basse assortie.",
    category: "garden",
    style: ["boho", "coastal"],
    room_type: ["terrace", "outdoor"],
    wood_type: "Synthetic",
    finish: "Weatherproof",
    price: 1490,
    stock: 7,
    image_path:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    weight: 42,
    dimensions: { width: 240, depth: 150, height: 85 },
    created_at: subDays(new Date(), 18).toISOString()
  },
  {
    id: "prod-9",
    sku: "ADZ-STOOL-009",
    name: "Pivot Counter Stool",
    description: "Tabouret pivotant, assise cuir pleine fleur, piétement acier noir mat.",
    category: "stool",
    style: ["industrial", "modern"],
    room_type: ["kitchen", "bar"],
    wood_type: "Steel",
    finish: "Matte black",
    price: 249,
    stock: 24,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    weight: 11,
    dimensions: { width: 45, depth: 45, height: 80 },
    created_at: addDays(new Date(), -40).toISOString()
  },
  {
    id: "prod-10",
    sku: "ADZ-MIR-010",
    name: "Ellipse Statement Mirror",
    description: "Grand miroir mural, cadre aluminium champagne, bords polis.",
    category: "mirror",
    style: ["art_deco", "luxury"],
    room_type: ["living_room", "bedroom", "entry"],
    wood_type: "Aluminium",
    finish: "Champagne",
    price: 690,
    stock: 11,
    image_path:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    weight: 17,
    dimensions: { width: 110, depth: 5, height: 180 },
    created_at: subDays(new Date(), 8).toISOString()
  },
  {
    id: "prod-11",
    sku: "ADZ-STORAGE-011",
    name: "Heritage Oak Wardrobe",
    description: "Armoire 3 portes, finitions chêne fumé, rangements modulaires.",
  category: "wardrobe",
    style: ["traditional", "modern"],
    room_type: ["bedroom", "dressing"],
    wood_type: "Oak",
    finish: "Smoked",
    price: 2190,
    stock: 4,
    image_path:
      "https://images.unsplash.com/photo-1616594039964-280d02761bbb?auto=format&fit=crop&w=1200&q=80",
    weight: 102,
    dimensions: { width: 210, depth: 65, height: 230 },
    created_at: subDays(new Date(), 16).toISOString()
  },
  {
    id: "prod-12",
    sku: "ADZ-TV-012",
    name: "Orbit Media Console",
    description: "Meuble TV chêne clair, passe-câbles intégrés, façade cannelée.",
    category: "tv table",
    style: ["mid-century", "modern"],
    room_type: ["living_room"],
    wood_type: "Oak",
    finish: "Natural matte",
    price: 990,
    stock: 9,
    image_path:
      "https://images.unsplash.com/photo-1595526114035-0d45ed655de1?auto=format&fit=crop&w=1200&q=80",
    weight: 35,
    dimensions: { width: 180, depth: 45, height: 55 },
    created_at: subDays(new Date(), 6).toISOString()
  },
  {
    id: "prod-13",
    sku: "ADZ-RUG-013",
    name: "Horizon Wool Rug",
    description:
      "Tapis en laine mérinos tissé main, palette dégradée inspirée des horizons nordiques.",
    category: "rug",
    style: ["scandinavian", "minimalist"],
    room_type: ["living_room", "bedroom"],
    wood_type: "Wool",
    finish: "Hand tufted",
    price: 690,
    discount_price: 620,
    stock: 14,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1616627458300-3e5d4d64f4ff?auto=format&fit=crop&w=1200&q=80",
    weight: 12,
    dimensions: { width: 240, depth: 160, height: 2 },
    created_at: subDays(new Date(), 4).toISOString()
  },
  {
    id: "prod-14",
    sku: "ADZ-SHELF-014",
    name: "Aria Modular Bookshelf",
    description:
      "Bibliothèque modulaire en chêne clair avec inserts métalliques, configurable en 12 combinaisons.",
    category: "shelf",
    style: ["modern", "minimalist"],
    room_type: ["living_room", "office"],
    wood_type: "Oak",
    finish: "Matte lacquer",
    price: 1280,
    stock: 5,
    featured: false,
    image_path:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    weight: 54,
    dimensions: { width: 180, depth: 35, height: 210 },
    created_at: subDays(new Date(), 11).toISOString()
  },
  {
    id: "prod-15",
    sku: "ADZ-LIGHT-015",
    name: "Eclipse Pendant Trio",
    description:
      "Suspension triple en verre opalin soufflé bouche et laiton satiné, hauteur ajustable.",
    category: "lighting",
    style: ["art_deco", "luxury", "modern"],
    room_type: ["dining_room", "kitchen"],
    wood_type: "Brass",
    finish: "Brushed brass",
    price: 840,
    stock: 9,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&w=1200&q=80",
    weight: 8,
    dimensions: { width: 120, depth: 30, height: 35 },
    created_at: subDays(new Date(), 7).toISOString()
  },
  {
    id: "prod-16",
    sku: "ADZ-BENCH-016",
    name: "Sierra Entryway Bench",
    description:
      "Banc d'entrée en frêne fumé avec assise en cuir végane et étagère basse pour chaussures.",
    category: "bench",
    style: ["modern", "rustic"],
    room_type: ["entry", "living_room"],
    wood_type: "Ash",
    finish: "Smoked oil",
    price: 540,
    stock: 10,
    image_path:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=1200&q=80",
    weight: 22,
    dimensions: { width: 135, depth: 38, height: 46 },
    created_at: subDays(new Date(), 17).toISOString()
  },
  {
    id: "prod-17",
    sku: "ADZ-SOFA-017",
    name: "Haven Modular Sectional",
    description:
      "Canapé modulable 5 éléments, tissu performance anti-taches et dossier ergonomique.",
    category: "sofa",
    style: ["contemporary", "family", "minimalist"],
    room_type: ["living_room"],
    wood_type: "Pine",
    finish: "Powder coat",
    price: 2390,
    stock: 4,
    featured: true,
    image_path:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    weight: 88,
    dimensions: { width: 290, depth: 200, height: 85 },
    created_at: subDays(new Date(), 3).toISOString()
  },
  {
    id: "prod-18",
    sku: "ADZ-DRESS-018",
    name: "Lumiere Six-Drawer Dresser",
    description:
      "Commode 6 tiroirs en noyer américain, inserts laiton brossé et système de fermeture douce.",
    category: "storage",
    style: ["mid-century", "luxury"],
    room_type: ["bedroom", "dressing"],
    wood_type: "Walnut",
    finish: "Hand rubbed oil",
    price: 1780,
    stock: 6,
    discount_price: 1650,
    featured: false,
    image_path:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
    weight: 68,
    dimensions: { width: 165, depth: 48, height: 95 },
    created_at: subDays(new Date(), 9).toISOString()
  },
  {
    id: "prod-19",
    sku: "ADZ-CHAIR-019",
    name: "Orbit Task Chair",
    description:
      "Chaise de bureau respirante avec dossier mesh ergonomique, translation 3D et accoudoirs réglables.",
    category: "chair",
    style: ["office", "modern"],
    room_type: ["office", "studio"],
    wood_type: "Aluminium",
    finish: "Graphite",
    price: 620,
    stock: 15,
    image_path:
      "https://images.unsplash.com/photo-1505691723518-36a5ac3be353?auto=format&fit=crop&w=1200&q=80",
    weight: 16,
    dimensions: { width: 68, depth: 68, height: 115 },
    created_at: subDays(new Date(), 13).toISOString()
  },
  {
    id: "prod-20",
    sku: "ADZ-DECOR-020",
    name: "Cascade Ceramic Planter",
    description:
      "Cache-pot en céramique tournée avec émaillage réactif, livré avec soucoupe en liège.",
    category: "decor",
    style: ["boho", "modern"],
    room_type: ["living_room", "terrace", "office"],
    wood_type: "Ceramic",
    finish: "Reactive glaze",
    price: 120,
    stock: 28,
    image_path:
      "https://images.unsplash.com/photo-1470246973918-29a93221c455?auto=format&fit=crop&w=1200&q=80",
    weight: 5,
    dimensions: { width: 28, depth: 28, height: 35 },
    created_at: addDays(new Date(), -25).toISOString()
  }
];

const networkDelay = (min = 120, max = 280) =>
  new Promise((resolve) => setTimeout(resolve, Math.random() * (max - min) + min));

const byCreatedAtDesc = (a: FurnitureProduct, b: FurnitureProduct) =>
  new Date(b.created_at).getTime() - new Date(a.created_at).getTime();

const cloneProducts = (products: FurnitureProduct[]) =>
  products.map((product) => ({ ...product, dimensions: { ...product.dimensions } }));

export class FurnitureAPIService {
  async getFeaturedProducts(limit = 20): Promise<FurnitureProduct[]> {
    await networkDelay();
    const featured = MOCK_PRODUCTS.filter((product) => product.featured);
    const fallback = featured.length > 0 ? featured : MOCK_PRODUCTS;
    return cloneProducts(fallback.sort(byCreatedAtDesc).slice(0, limit));
  }

  async getRecommendationsForStyle(style: string, roomType?: string, budget?: number): Promise<FurnitureProduct[]> {
    await networkDelay();

    const normalizedStyle = style.toLowerCase();
    const normalizedRoom = roomType?.toLowerCase();

    const matches = MOCK_PRODUCTS.filter((product) => {
      const effectivePrice = product.discount_price ?? product.price;
      const matchesStyle = product.style.some((tag) => tag.toLowerCase().includes(normalizedStyle));
      const matchesRoom = normalizedRoom ? product.room_type.some((type) => type.toLowerCase() === normalizedRoom) : true;
      const matchesBudget = typeof budget === "number" ? effectivePrice <= budget : true;
      return matchesStyle && matchesRoom && matchesBudget;
    });

    if (matches.length === 0) {
      return cloneProducts(MOCK_PRODUCTS.sort(byCreatedAtDesc).slice(0, 8));
    }

    return cloneProducts(matches.sort(byCreatedAtDesc));
  }

  async getProductsForRoom(
    roomType: string,
    measurements: { length: number; width: number; height: number },
    style?: string,
    budget?: number
  ): Promise<FurnitureProduct[]> {
    await networkDelay();

    const usableWidth = measurements.width * 100;
    const usableLength = measurements.length * 100;

    const normalizedRoom = roomType.toLowerCase();
    const normalizedStyle = style?.toLowerCase();

    const matches = MOCK_PRODUCTS.filter((product) => {
      const effectivePrice = product.discount_price ?? product.price;
      const fitsRoom = product.room_type.some((type) => type.toLowerCase() === normalizedRoom);
      const fitsStyle = normalizedStyle ? product.style.some((tag) => tag.toLowerCase().includes(normalizedStyle)) : true;
      const fitsBudget = typeof budget === "number" ? effectivePrice <= budget : true;
      const fitsDimensions = product.dimensions.width <= usableWidth && product.dimensions.depth <= usableLength;

      return fitsRoom && fitsStyle && fitsBudget && fitsDimensions;
    });

    if (matches.length === 0) {
      const roomFallback = MOCK_PRODUCTS.filter((product) =>
        product.room_type.some((type) => type.toLowerCase() === normalizedRoom)
      );
      return cloneProducts(roomFallback.slice(0, 6));
    }

    return cloneProducts(matches.sort(byCreatedAtDesc));
  }

  async getSimilarProducts(product: FurnitureProduct): Promise<FurnitureProduct[]> {
    await networkDelay();

    const normalizedCategory = product.category.toLowerCase();

    const similar = MOCK_PRODUCTS.filter((candidate) => {
      if (candidate.id === product.id) return false;
      const sameCategory = candidate.category.toLowerCase() === normalizedCategory;
      const sharedStyle = candidate.style.some((style) => product.style.includes(style));
      return sameCategory || sharedStyle;
    });

    return cloneProducts(similar.sort(byCreatedAtDesc));
  }

  getStockStatus(product: FurnitureProduct): StockStatus {
    if (product.stock <= 0) {
      return { status: "out_of_stock", message: "Out of stock", available: false };
    }

    if (product.stock < 5) {
      return { status: "low_stock", message: `${product.stock} left`, available: true };
    }

    return { status: "in_stock", message: "In stock", available: true };
  }

  formatPrice(product: FurnitureProduct) {
    const currentPrice = product.discount_price ?? product.price;
    const hasDiscount = typeof product.discount_price === "number" && product.discount_price < product.price;

    return {
      current: CURRENCY_FORMATTER.format(currentPrice),
      original: hasDiscount ? CURRENCY_FORMATTER.format(product.price) : undefined,
      hasDiscount
    };
  }

  async searchProducts(query: string, options: RecommendationOptions = {}): Promise<FurnitureProduct[]> {
    await networkDelay();

    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return this.getRecommendationsForStyle(options.style ?? "", options.roomType, options.budget);
    }

    const results = MOCK_PRODUCTS.filter((product) => {
      const textMatch =
        product.name.toLowerCase().includes(normalizedQuery) ||
        product.description.toLowerCase().includes(normalizedQuery) ||
        product.category.toLowerCase().includes(normalizedQuery);

      const styleMatch = options.style
        ? product.style.some((tag) => tag.toLowerCase().includes(options.style!.toLowerCase()))
        : true;

      return textMatch && styleMatch;
    });

    return cloneProducts(results.sort(byCreatedAtDesc));
  }
}

export const furnitureAPI = new FurnitureAPIService();
