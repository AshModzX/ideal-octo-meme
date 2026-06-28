import { getShopInfo } from "@/lib/kv";

export default async function AboutPage() {
  const shopInfo = await getShopInfo();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-center mb-12 text-gray-900">About Us</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <h2 className="text-3xl font-bold mb-6 text-gray-900">Our Story</h2>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Welcome to {shopInfo.name}! We are passionate about bringing you the finest handcrafted footwear from Nepal.
          </p>
          <p className="text-gray-600 mb-4 leading-relaxed">
            With years of experience in traditional shoemaking, we combine heritage craftsmanship with modern designs
            to create beautiful, comfortable, and durable juttis and footwear for every occasion.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our commitment to quality ensures that every pair is made with care, using premium materials and techniques
            passed down through generations.
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-100 to-amber-200 rounded-2xl h-96 flex items-center justify-center">
          <span className="text-8xl">👞</span>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-900">Find Us</h2>
        <div className="bg-gray-200 rounded-2xl h-96 flex items-center justify-center">
          <div className="text-center">
            <p className="text-gray-600 mb-2">{shopInfo.address}</p>
            <iframe
              width="100%"
              height="400"
              frameBorder="0"
              style={{ border: 0, borderRadius: '1rem' }}
              src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyD4iE2xVSpkfh8rLgZJ3u0QmXK2G1oVZ1E&q=${encodeURIComponent(shopInfo.address)}`}
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
}
