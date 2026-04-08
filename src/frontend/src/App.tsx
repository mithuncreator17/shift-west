import { AdminPanel, CartDrawer, Layout } from "@/components/Layout";
import { ShopPage } from "@/components/ShopPage";
import { useCategories, useProducts } from "@/hooks/useBackend";
import type { CartItem, Product } from "@/types";
import { useCallback, useState } from "react";
import { toast } from "sonner";

const ADMIN_CLICK_THRESHOLD = 5;
const WHATSAPP_PHONE = "918220435476";

export default function App() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const [customerName, setCustomerName] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");

  const { data: products = [] } = useProducts();
  const { data: categories = [] } = useCategories();

  void logoClickCount;

  const handleLogoClick = useCallback(() => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= ADMIN_CLICK_THRESHOLD) {
        setIsAdminVisible(true);
        return 0;
      }
      return next;
    });
  }, []);

  const handleAddToCart = useCallback((product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    toast.success(`${product.name} added to bag`);
  }, []);

  const handleRemoveFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const handleCheckout = useCallback(() => {
    if (cart.length === 0) {
      toast.error("Add at least one item to your bag before checking out.");
      return;
    }
    if (!customerName.trim() || !customerAddress.trim()) {
      toast.error("Please enter your name and delivery address.");
      return;
    }
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const itemsText = cart
      .map((i) => `• ${i.name} x${i.quantity} — ₹${i.price * i.quantity}`)
      .join("\n");
    const message = `🛍️ *New Order from Shift West!*\n\n👤 *Name:* ${customerName}\n📍 *Address:* ${customerAddress}\n\n🧾 *Items:*\n${itemsText}\n\n💰 *Total: ₹${total.toLocaleString("en-IN")}*\n\n_Powered by ShiftWest_`;

    window.open(
      `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  }, [cart, customerName, customerAddress]);

  return (
    <Layout
      cartItems={cart}
      onLogoClick={handleLogoClick}
      onCartOpen={() => setIsCartOpen(true)}
    >
      <ShopPage
        cart={cart}
        onAddToCart={handleAddToCart}
        customerName={customerName}
        customerAddress={customerAddress}
        onCustomerNameChange={setCustomerName}
        onCustomerAddressChange={setCustomerAddress}
        onCheckout={handleCheckout}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={handleRemoveFromCart}
        customerName={customerName}
        customerAddress={customerAddress}
        onNameChange={setCustomerName}
        onAddressChange={setCustomerAddress}
        onCheckout={handleCheckout}
      />
      <AdminPanel
        isVisible={isAdminVisible}
        onClose={() => setIsAdminVisible(false)}
        products={products}
        categories={categories}
      />
    </Layout>
  );
}
