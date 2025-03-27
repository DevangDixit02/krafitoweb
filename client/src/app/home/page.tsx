"use client";

import { Button } from "@/components/ui/button";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useProductStore } from "@/store/useProductStore";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { banners, fetchBanners } = useSettingsStore();
  const { products, fetchAllProductsForAdmin } = useProductStore();
  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        await fetchBanners();
        await fetchAllProductsForAdmin();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (banners.length === 0) return;

    const bannerTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 5000);

    return () => clearInterval(bannerTimer);
  }, [banners.length]);

  const collections = Array.from(new Set(products.map((p) => p.collection)));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Section */}
      <section className="relative h-[600px] overflow-hidden">
        {banners.length > 0 ? (
          banners.map((bannerItem, index) => (
            <div
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out transform ${
                currentSlide === index
                  ? "opacity-100 scale-100"
                  : "opacity-0 scale-95"
              }`}
              key={bannerItem.id}
            >
              <div className="absolute inset-0">
                <img
                  src={bannerItem.imageUrl || "/fallback-banner.jpg"}
                  alt={`Banner ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20" />
              </div>
              <div className="relative h-full container mx-auto px-6 flex items-center justify-center text-center">
                <div className="text-white space-y-6 max-w-2xl">
                  
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500 text-xl">
            Loading banners...
          </div>
        )}

        {/* Pagination Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-4 h-4 rounded-full transition-all ${
                currentSlide === index
                  ? "bg-white w-8"
                  : "bg-white/50 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
      </section>

      {/* Collections Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-4xl font-bold mb-4">
            SHOP BY COLLECTION
          </h2>
          <p className="text-center text-gray-500 mb-10 text-lg">
            Find your favorite styles in every collection
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {collections.length > 0 ? (
              collections.map((collection, index) => {
                const collectionImage =
                  products.find((p) => p.collection === collection)
                    ?.images[0] || "/fallback-image.jpg";
                return (
                  <div
                    key={index}
                    className="relative group overflow-hidden cursor-pointer rounded-lg shadow-lg"
                    onClick={() => router.push(`/collections/${collection}`)}
                  >
                    <div className="aspect-[3/4] relative rounded-lg overflow-hidden">
                      <img
                        src={collectionImage}
                        alt={collection}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center text-white p-4">
                        <h3 className="text-2xl font-semibold mb-2">
                          {collection}
                        </h3>
                        <Button className="mt-4 bg-white text-black hover:bg-gray-100 px-6 py-3 rounded-full text-lg">
                          SHOP NOW
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center text-gray-500 col-span-full text-lg">
                No collections available.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
