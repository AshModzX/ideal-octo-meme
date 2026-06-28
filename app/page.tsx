import Link from "next/link";
import { getCategories, getShopInfo } from "@/lib/kv";

export default async function Home() {
  const shopInfo = await getShopInfo();
  const categories = await getCategories();

  return (
    <div>
      <section className="relative bg-gradient-to-br from-amber-100 to-amber-200 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold text-amber-900 mb-4">{shopInfo.name}</h1>
          <p className="text-2xl text-amber-800 mb-8">{shopInfo.description}</p>
          <Link href="/products" className="inline-block bg-amber-800 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-amber-900 transition-colors">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.id}`}
                className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="h-48 bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center">
                  <span className="text-6xl">👠</span>
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-xl font-semibold text-gray-900 group-hover:text-amber-800 transition-colors">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Why Choose Us?</h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            Experience handcrafted footwear with attention to detail and quality. 
            Each pair is made with love and care, ensuring comfort and style for every occasion.
          </p>
        </div>
      </section>
    </div>
  );
}
