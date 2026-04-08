import { Skeleton } from "@/components/ui/skeleton";
import { useCategories, useProducts } from "@/hooks/useBackend";
import type { CartItem, Product } from "@/types";
import { useState } from "react";

interface ShopPageProps {
  cart: CartItem[];
  onAddToCart: (product: Product) => void;
  customerName: string;
  customerAddress: string;
  onCustomerNameChange: (v: string) => void;
  onCustomerAddressChange: (v: string) => void;
  onCheckout: () => void;
}

function ProductCard({
  product,
  onAdd,
}: {
  product: Product;
  onAdd: (p: Product) => void;
}) {
  return (
    <div
      className="card-sharp bg-card group"
      data-ocid={`product-card-${product.id}`}
    >
      {/* Stylish placeholder box */}
      <div className="relative overflow-hidden bg-muted h-64 flex items-center justify-center">
        <div className="absolute inset-0 flex items-end p-4">
          <span className="text-[10px] font-mono text-muted-foreground tracking-widest uppercase opacity-60">
            {product.category}
          </span>
        </div>
        <div className="w-16 h-16 border-2 border-border/60 rotate-45 group-hover:rotate-[50deg] transition-smooth" />
      </div>

      <div className="p-4 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="font-display font-bold text-base leading-tight truncate uppercase">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-xs text-muted-foreground mt-1 font-mono line-clamp-1">
              {product.description}
            </p>
          )}
          <p className="font-mono font-bold text-sm mt-2">
            ₹{product.price.toLocaleString("en-IN")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onAdd(product)}
          className="flex-shrink-0 w-10 h-10 bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg hover:opacity-80 transition-smooth rounded-full"
          aria-label={`Add ${product.name} to bag`}
          data-ocid={`add-to-cart-${product.id}`}
        >
          +
        </button>
      </div>
    </div>
  );
}

function ProductSkeleton() {
  return (
    <div className="card-sharp bg-card">
      <Skeleton className="h-64 w-full rounded-none" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-4 w-3/4 rounded-none" />
        <Skeleton className="h-3 w-1/2 rounded-none" />
        <Skeleton className="h-4 w-1/4 rounded-none" />
      </div>
    </div>
  );
}

function CategoryTabSkeleton() {
  return (
    <div className="flex gap-0 overflow-x-auto scrollbar-none">
      {["s-cat-1", "s-cat-2", "s-cat-3", "s-cat-4"].map((k) => (
        <Skeleton key={k} className="h-10 w-20 mx-2 rounded-none" />
      ))}
    </div>
  );
}

export function ShopPage({
  cart,
  onAddToCart,
  customerName,
  customerAddress,
  onCustomerNameChange,
  onCustomerAddressChange,
  onCheckout,
}: ShopPageProps) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [checkoutError, setCheckoutError] = useState("");

  const { data: products = [], isLoading: productsLoading } = useProducts();
  const { data: categories = [], isLoading: categoriesLoading } =
    useCategories();

  // Deduplicate: ensure exactly one "All" tab at the front
  const allCategories = [
    { id: "All", label: "ALL" },
    ...categories.filter((c) => c.id !== "All"),
  ];

  const filtered =
    selectedCategory === "All"
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0);

  const handleCheckout = () => {
    if (!customerName.trim() || !customerAddress.trim()) {
      setCheckoutError("Please enter your name and delivery address.");
      return;
    }
    if (cart.length === 0) {
      setCheckoutError(
        "Add at least one item to your bag before checking out.",
      );
      return;
    }
    setCheckoutError("");
    onCheckout();
  };

  return (
    <>
      {/* Category tabs */}
      <div
        className="border-b border-border bg-card sticky top-[89px] z-30"
        data-ocid="category-tabs"
      >
        <div className="max-w-5xl mx-auto px-4">
          {categoriesLoading ? (
            <div className="py-1">
              <CategoryTabSkeleton />
            </div>
          ) : (
            <div className="flex gap-0 overflow-x-auto scrollbar-none">
              {allCategories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-5 py-3 text-xs font-mono tracking-widest uppercase transition-smooth whitespace-nowrap border-b-2 ${
                    selectedCategory === cat.id
                      ? "border-foreground text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground"
                  }`}
                  data-ocid={`cat-tab-${cat.id.toLowerCase()}`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products grid */}
      <section className="max-w-5xl mx-auto px-4 py-8">
        {productsLoading ? (
          <div className="product-grid">
            {["s1", "s2", "s3", "s4", "s5", "s6"].map((k) => (
              <ProductSkeleton key={k} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-24 text-center"
            data-ocid="empty-state"
          >
            <div className="w-12 h-12 border-2 border-border rotate-45 mb-6" />
            <p className="font-mono text-xs tracking-widest text-muted-foreground uppercase">
              No products found
            </p>
          </div>
        ) : (
          <div className="product-grid">
            {filtered.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAdd={onAddToCart}
              />
            ))}
          </div>
        )}
      </section>

      {/* Customer info + checkout */}
      <div className="border-t border-border bg-card">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <p className="text-[10px] font-mono tracking-[0.3em] text-muted-foreground uppercase mb-4">
            CHECKOUT
          </p>

          <div className="max-w-md space-y-3">
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => {
                onCustomerNameChange(e.target.value);
                setCheckoutError("");
              }}
              className="w-full border border-border bg-input px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-body"
              data-ocid="checkout-name"
            />
            <input
              type="text"
              placeholder="Delivery Address / Pincode"
              value={customerAddress}
              onChange={(e) => {
                onCustomerAddressChange(e.target.value);
                setCheckoutError("");
              }}
              className="w-full border border-border bg-input px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-body"
              data-ocid="checkout-address"
            />

            {checkoutError && (
              <p
                className="text-xs font-mono text-destructive tracking-wide"
                data-ocid="checkout-error"
                role="alert"
              >
                {checkoutError}
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              className="w-full btn-primary py-3.5 text-sm font-bold tracking-widest font-mono"
              data-ocid="checkout-btn"
            >
              CHECKOUT VIA WHATSAPP ({cartCount}{" "}
              {cartCount === 1 ? "ITEM" : "ITEMS"})
            </button>

            <a
              href="https://www.instagram.com/shift.west/"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center text-xs font-mono text-muted-foreground hover:text-foreground transition-smooth tracking-widest pt-1"
              data-ocid="instagram-link-checkout"
            >
              @SHIFT.WEST
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
