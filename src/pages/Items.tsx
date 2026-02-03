import { useState, useEffect, useMemo } from "react";
import { Layout } from "@/components/layout/Layout";
import { ProductCard } from "@/components/ProductCard";
import { Pagination } from "@/components/Pagination";
import { Package, Loader2, Search, Filter, ArrowUpDown } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Product, StatusTag } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { parsePrice, calculateDiscountPercent } from "@/lib/priceUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ITEMS_PER_PAGE = 12;

type SortOption = "newest" | "oldest" | "price-low" | "price-high" | "name-asc" | "name-desc";

interface ProductWithTags extends Product {
  status_tags?: StatusTag[];
}

const Items = () => {
  const [products, setProducts] = useState<ProductWithTags[]>([]);
  const [allProducts, setAllProducts] = useState<ProductWithTags[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  // Extract unique categories from products
  const categories = useMemo(() => {
    const cats = [...new Set(allProducts.map(p => p.category).filter(Boolean))];
    return cats.sort();
  }, [allProducts]);

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      // Fetch products
      const { data: productsData, error: fetchError } = await supabase
        .from("products")
        .select("*")
        .eq("is_rental", false)
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (fetchError) throw fetchError;

      // Fetch all status tags
      const { data: tagsData } = await supabase
        .from("status_tags")
        .select("*")
        .eq("is_active", true);

      // Fetch product-tag relationships
      const { data: productTagsData } = await supabase
        .from("product_status_tags")
        .select("product_id, status_tag_id");

      // Map tags to products
      const productsWithTags = (productsData || []).map(product => {
        const productTagIds = (productTagsData || [])
          .filter(pt => pt.product_id === product.id)
          .map(pt => pt.status_tag_id);
        
        const productTags = (tagsData || []).filter(tag => productTagIds.includes(tag.id));
        
        return {
          ...product,
          status_tags: productTags
        };
      });

      setAllProducts(productsWithTags);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // parsePrice is now imported from @/lib/priceUtils

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = allProducts;

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.description?.toLowerCase().includes(query) ||
          p.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory && selectedCategory !== "all") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case "oldest":
          return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case "price-low":
          return parsePrice(a.price) - parsePrice(b.price);
        case "price-high":
          return parsePrice(b.price) - parsePrice(a.price);
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return result;
  }, [allProducts, searchQuery, selectedCategory, sortBy]);

  // Paginated products
  const paginatedProducts = useMemo(() => {
    const from = (currentPage - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE;
    return filteredProducts.slice(from, to);
  }, [filteredProducts, currentPage]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSortBy("newest");
  };

  return (
    <Layout>
      <section className="bg-background py-14 md:py-20">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-semibold text-primary animate-fade-in">
              <Package className="h-4 w-4" />
              Shop Now
            </span>
            <h1 className="mb-4 text-3xl font-bold text-foreground md:text-4xl lg:text-5xl animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
              Our Products
            </h1>
            <p className="mx-auto max-w-2xl text-muted-foreground text-lg animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              Browse our complete collection of premium products. Order now for instant service and same-day delivery.
            </p>
          </div>

          {/* Search and Filter Bar */}
          <div className="mb-8 flex flex-col gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {/* Search Row */}
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            {/* Filters Row */}
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-[140px] sm:w-[160px]">
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowUpDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
                <Select value={sortBy} onValueChange={(val) => setSortBy(val as SortOption)}>
                  <SelectTrigger className="w-[140px] sm:w-[160px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name-asc">Name: A to Z</SelectItem>
                    <SelectItem value="name-desc">Name: Z to A</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {(searchQuery || selectedCategory !== "all" || sortBy !== "newest") && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  Clear All
                </Button>
              )}
            </div>
          </div>

          {/* Results count */}
          {!loading && !error && (
            <p className="mb-6 text-sm text-muted-foreground">
              Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              {selectedCategory !== "all" && ` in "${selectedCategory}"`}
              {searchQuery && ` for "${searchQuery}"`}
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 text-destructive">
              <p>Failed to load products. Please try again later.</p>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && filteredProducts.length === 0 && (
            <div className="text-center py-20 text-muted-foreground">
              <Package className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No products found</p>
              <p className="text-sm mt-1">Try adjusting your search or filter</p>
              {(searchQuery || selectedCategory !== "all") && (
                <Button variant="outline" className="mt-4" onClick={clearFilters}>
                  Clear Filters
                </Button>
              )}
            </div>
          )}

          {/* Products Grid */}
          {!loading && !error && paginatedProducts.length > 0 && (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {paginatedProducts.map((item, index) => (
                  <div
                    key={item.id}
                    className="opacity-0 animate-fade-in-up"
                    style={{ animationDelay: `${0.1 + index * 0.05}s` }}
                  >
                    <ProductCard
                      id={item.id}
                      name={item.name}
                      image={item.images?.[0] || item.image || "/placeholder.svg"}
                      price={item.price}
                      originalPrice={item.original_price}
                      discountPercent={calculateDiscountPercent(item.price, item.original_price) || undefined}
                      statusTags={item.status_tags}
                      detailPath={`/items/${item.id}`}
                    />
                  </div>
                ))}
              </div>

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={filteredProducts.length}
                itemsPerPage={ITEMS_PER_PAGE}
              />
            </>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Items;
