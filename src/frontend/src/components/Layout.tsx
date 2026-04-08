import { Badge } from "@/components/ui/badge";
import type { CartItem } from "@/types";
import { Instagram, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
  cartItems: CartItem[];
  onLogoClick: () => void;
  onCartOpen: () => void;
}

export function Layout({
  children,
  cartItems,
  onLogoClick,
  onCartOpen,
}: LayoutProps) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header
        className={`sticky top-0 z-40 bg-card border-b border-border transition-smooth ${scrolled ? "shadow-subtle" : ""}`}
        data-ocid="main-header"
      >
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          {/* SVG Logo */}
          <button
            type="button"
            onClick={onLogoClick}
            className="focus:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Shift West logo"
            data-ocid="logo-btn"
          >
            <div className="flex flex-col items-start gap-0.5">
              <svg
                viewBox="0 0 220 36"
                width="220"
                height="36"
                role="img"
                aria-label="Shift West"
                className="fill-foreground"
              >
                <title>Shift West</title>
                <text
                  x="0"
                  y="30"
                  fontFamily="General Sans, sans-serif"
                  fontWeight="900"
                  fontSize="32"
                  letterSpacing="-1"
                >
                  SHIFT WEST
                </text>
              </svg>
              <span className="text-[9px] font-mono text-muted-foreground tracking-[0.25em] uppercase pl-0.5">
                ESSENTIALS 2026 · TIRUPPUR
              </span>
            </div>
          </button>

          {/* Right actions */}
          <button
            type="button"
            onClick={onCartOpen}
            className="relative p-2 btn-ghost"
            aria-label={`Open cart, ${cartCount} items`}
            data-ocid="cart-btn"
          >
            <ShoppingBag size={20} />
            {cartCount > 0 && (
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-primary text-primary-foreground rounded-full">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>

        {/* Tagline strip */}
        <div className="border-t border-border bg-primary text-primary-foreground text-center py-1.5">
          <span className="text-[10px] font-mono tracking-[0.4em] uppercase">
            SHIFT THE CULTURE
          </span>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 bg-background" data-ocid="main-content">
        {children}
      </main>

      {/* Footer */}
      <footer
        className="bg-card border-t border-border mt-auto"
        data-ocid="main-footer"
      >
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <svg
              viewBox="0 0 160 24"
              width="160"
              height="24"
              role="img"
              aria-label="Shift West"
              className="fill-foreground"
            >
              <title>Shift West</title>
              <text
                x="0"
                y="20"
                fontFamily="General Sans, sans-serif"
                fontWeight="900"
                fontSize="22"
                letterSpacing="-0.5"
              >
                SHIFT WEST
              </text>
            </svg>
            <span className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase">
              ESSENTIALS 2026 · TIRUPPUR
            </span>
          </div>

          <a
            href="https://www.instagram.com/shift.west/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-smooth"
            data-ocid="instagram-link"
          >
            <Instagram size={16} />
            @shift.west
          </a>
        </div>

        <div className="border-t border-border">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center">
            <span className="text-[10px] font-mono text-muted-foreground">
              © {new Date().getFullYear()}. Built with love using{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-foreground transition-colors"
              >
                caffeine.ai
              </a>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ───────── Cart Drawer ───────── */
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (id: string) => void;
  customerName: string;
  customerAddress: string;
  onNameChange: (v: string) => void;
  onAddressChange: (v: string) => void;
  onCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onRemove,
  customerName,
  customerAddress,
  onNameChange,
  onAddressChange,
  onCheckout,
}: CartDrawerProps) {
  const total = items.reduce((s, i) => s + i.price * i.quantity, 0);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 flex m-0 p-0 w-full h-full bg-transparent max-w-none max-h-none"
      aria-label="Shopping bag"
    >
      {/* Backdrop */}
      <div
        className="flex-1 bg-foreground/40"
        onClick={onClose}
        onKeyDown={(e) => e.key === "Escape" && onClose()}
        aria-hidden="true"
        role="presentation"
      />

      {/* Drawer */}
      <div className="w-full max-w-sm bg-card border-l border-border flex flex-col h-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <span className="font-display font-bold text-lg tracking-tight">
            BAG
          </span>
          <button
            type="button"
            onClick={onClose}
            className="p-1 btn-ghost"
            aria-label="Close bag"
            data-ocid="cart-close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center h-40 text-center"
              data-ocid="cart-empty"
            >
              <ShoppingBag size={32} className="text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground font-mono tracking-wide">
                YOUR BAG IS EMPTY
              </p>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 border-b border-border pb-4"
                data-ocid={`cart-item-${item.id}`}
              >
                <div className="w-14 h-14 bg-muted flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{item.name}</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    ₹{item.price} × {item.quantity}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground hover:text-foreground transition-colors p-1"
                  aria-label={`Remove ${item.name}`}
                  data-ocid={`remove-item-${item.id}`}
                >
                  <X size={14} />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Checkout form */}
        {items.length > 0 && (
          <div className="border-t border-border px-6 py-5 space-y-3">
            <div className="flex justify-between text-sm font-mono mb-1">
              <span className="text-muted-foreground tracking-wide">TOTAL</span>
              <span className="font-bold">
                ₹{total.toLocaleString("en-IN")}
              </span>
            </div>
            <input
              type="text"
              placeholder="Your Name"
              value={customerName}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-body"
              data-ocid="checkout-name"
            />
            <input
              type="text"
              placeholder="Delivery Address / Pincode"
              value={customerAddress}
              onChange={(e) => onAddressChange(e.target.value)}
              className="w-full border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-body"
              data-ocid="checkout-address"
            />
            <button
              type="button"
              onClick={onCheckout}
              className="w-full btn-primary py-3 text-sm font-bold tracking-widest font-mono"
              data-ocid="checkout-btn"
            >
              CHECKOUT VIA WHATSAPP
            </button>
          </div>
        )}
      </div>
    </dialog>
  );
}

export { AdminPanel } from "@/components/AdminPanel";
