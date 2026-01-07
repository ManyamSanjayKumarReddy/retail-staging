import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";

// Sample items data
const items = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop",
    price: 2999,
    originalPrice: 4999,
    discountPercent: 40,
  },
  {
    id: "2",
    name: "Smart Watch Series Pro",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop",
    price: 5499,
    originalPrice: 7999,
    discountPercent: 31,
  },
  {
    id: "3",
    name: "Portable Bluetooth Speaker",
    image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=400&fit=crop",
    price: 1499,
    originalPrice: 2499,
    discountPercent: 40,
  },
  {
    id: "4",
    name: "Designer Sunglasses",
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop",
    price: 899,
    originalPrice: 1499,
    discountPercent: 40,
  },
  {
    id: "5",
    name: "Leather Backpack Premium",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop",
    price: 3499,
    originalPrice: 5999,
    discountPercent: 42,
  },
  {
    id: "6",
    name: "Wireless Earbuds Pro",
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400&h=400&fit=crop",
    price: 1999,
    originalPrice: 3499,
    discountPercent: 43,
  },
  {
    id: "7",
    name: "Minimalist Wristwatch",
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    price: 4999,
    originalPrice: 6999,
    discountPercent: 29,
  },
  {
    id: "8",
    name: "Premium Sneakers Collection",
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    price: 3999,
    originalPrice: 5499,
    discountPercent: 27,
  },
];

const Items = () => {
  return (
    <Layout>
      <section className="bg-background py-12 md:py-16">
        <div className="container">
          {/* Page Header */}
          <div className="mb-10 text-center">
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Our Products
            </h1>
            <p className="mx-auto max-w-2xl text-foreground-secondary">
              Browse our complete collection of premium products. Order via
              WhatsApp for instant service and same-day delivery.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProductCard {...item} detailPath={`/items/${item.id}`} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Items;
