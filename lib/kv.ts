import { Redis } from '@upstash/redis';
import { Category, Product, ShopInfo } from './types';

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const SHOP_INFO_KEY = 'shop:info';
const CATEGORIES_KEY = 'categories';
const PRODUCTS_KEY = 'products';

export async function getShopInfo(): Promise<ShopInfo> {
  const info = await redis.get<ShopInfo>(SHOP_INFO_KEY);
  if (!info) {
    return {
      name: 'JuttiDot com',
      description: 'Elegance meets Style',
      address: 'Bhurungkhel Marg, Kathmandu 44600, Nepal',
      phone: '+977 971-3138243',
      hours: 'Opens 9:30 am Mon',
      website: 'http://kolhapuricollection.com/',
    };
  }
  return info;
}

export async function getCategories(): Promise<Category[]> {
  const categories = await redis.get<Category[]>(CATEGORIES_KEY);
  return categories || [];
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const categories = await getCategories();
  return categories.find(c => c.id === id) || null;
}

export async function addCategory(name: string): Promise<Category> {
  const categories = await getCategories();
  const category: Category = {
    id: Date.now().toString(),
    name,
    slug: name.toLowerCase().replace(/\s+/g, '-'),
  };
  categories.push(category);
  await redis.set(CATEGORIES_KEY, categories);
  return category;
}

export async function updateCategory(id: string, name: string): Promise<void> {
  const categories = await getCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index !== -1) {
    categories[index] = { ...categories[index], name, slug: name.toLowerCase().replace(/\s+/g, '-') };
    await redis.set(CATEGORIES_KEY, categories);
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const categories = await getCategories();
  const filtered = categories.filter(c => c.id !== id);
  await redis.set(CATEGORIES_KEY, filtered);
  
  const products = await getProducts();
  const filteredProducts = products.filter(p => p.categoryId !== id);
  await redis.set(PRODUCTS_KEY, filteredProducts);
}

export async function getProducts(): Promise<Product[]> {
  const products = await redis.get<Product[]>(PRODUCTS_KEY);
  return products || [];
}

export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await getProducts();
  return products.filter(p => p.categoryId === categoryId);
}

export async function getProductById(id: string): Promise<Product | null> {
  const products = await getProducts();
  return products.find(p => p.id === id) || null;
}

export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts();
  const newProduct: Product = {
    ...product,
    id: Date.now().toString(),
  };
  products.push(newProduct);
  await redis.set(PRODUCTS_KEY, products);
  return newProduct;
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<void> {
  const products = await getProducts();
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products[index] = { ...products[index], ...product };
    await redis.set(PRODUCTS_KEY, products);
  }
}

export async function deleteProduct(id: string): Promise<void> {
  const products = await getProducts();
  const filtered = products.filter(p => p.id !== id);
  await redis.set(PRODUCTS_KEY, filtered);
}

export async function seedInitialData(): Promise<void> {
  const existingCategories = await getCategories();
  const existingProducts = await getProducts();
  
  if (existingCategories.length === 0 && existingProducts.length === 0) {
    const categories: Category[] = [
      { id: '1', name: 'Kolhapuri Juttis', slug: 'kolhapuri-juttis' },
      { id: '2', name: 'Traditional Juttis', slug: 'traditional-juttis' },
      { id: '3', name: 'Modern Flats', slug: 'modern-flats' },
      { id: '4', name: 'Wedding Collection', slug: 'wedding-collection' },
    ];

    const products: Product[] = [
      {
        id: 'p1',
        name: 'Red Traditional Kolhapuri',
        price: 1550,
        description: 'Handcrafted red Kolhapuri jutti with intricate design',
        imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=traditional%20red%20kolhapuri%20jutti%20shoe%2C%20handcrafted%20leather%20footwear&image_size=square_hd',
        categoryId: '1',
      },
      {
        id: 'p2',
        name: 'Golden Bridal Jutti',
        price: 2500,
        description: 'Elegant golden jutti perfect for weddings',
        imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=golden%20bridal%20jutti%20shoe%2C%20wedding%20footwear%2C%20intricate%20embroidery&image_size=square_hd',
        categoryId: '4',
      },
      {
        id: 'p3',
        name: 'Black Everyday Flat',
        price: 1200,
        description: 'Comfortable black flat for daily use',
        imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=black%20everyday%20flat%20shoe%2C%20comfortable%20footwear&image_size=square_hd',
        categoryId: '3',
      },
      {
        id: 'p4',
        name: 'Embroidered Pink Jutti',
        price: 1800,
        description: 'Beautiful pink jutti with detailed embroidery',
        imageUrl: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=pink%20embroidered%20jutti%20shoe%2C%20traditional%20footwear&image_size=square_hd',
        categoryId: '2',
      },
    ];

    await redis.set(CATEGORIES_KEY, categories);
    await redis.set(PRODUCTS_KEY, products);
  }
}
