import { createActor } from "@/backend";
import type { Category, Product } from "@/types";
import { useActor } from "@caffeineai/core-infrastructure";
import { useQueryClient } from "@tanstack/react-query";
import { Edit2, Loader2, Plus, Trash2, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const ADMIN_PASSWORD = "subash7";

// ─── tiny inline actor helpers ─────────────────────────────────────────────

type AdminActor = {
  addProduct: (
    name: string,
    price: number,
    category: string,
    password: string,
  ) => Promise<{ ok: Product } | { err: string }>;
  updateProduct: (
    id: bigint,
    name: string,
    price: number,
    category: string,
    password: string,
  ) => Promise<{ ok: Product } | { err: string }>;
  deleteProduct: (
    id: bigint,
    password: string,
  ) => Promise<{ ok: null } | { err: string }>;
  addCategory: (
    name: string,
    password: string,
  ) => Promise<{ ok: Category } | { err: string }>;
  deleteCategory: (
    id: bigint,
    password: string,
  ) => Promise<{ ok: null } | { err: string }>;
};

// ─── shared tiny components ────────────────────────────────────────────────

function Label({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[10px] font-mono tracking-widest text-muted-foreground uppercase">
      {children}
    </span>
  );
}

function InlineInput({
  type = "text",
  placeholder,
  value,
  onChange,
  className = "",
  "data-ocid": ocid,
}: {
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  className?: string;
  "data-ocid"?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`w-full border border-border bg-input px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring font-body ${className}`}
      data-ocid={ocid}
    />
  );
}

function StatusMsg({
  message,
  isError,
}: { message: string; isError?: boolean }) {
  if (!message) return null;
  return (
    <p
      className={`text-xs font-mono mt-1 ${isError ? "text-destructive" : "text-muted-foreground"}`}
    >
      {message}
    </p>
  );
}

// ─── Products Section ──────────────────────────────────────────────────────

interface ProductsSectionProps {
  products: Product[];
  categories: Category[];
  actor: AdminActor | null;
  onRefresh: () => void;
}

function ProductsSection({
  products,
  categories,
  actor,
  onRefresh,
}: ProductsSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCategory, setEditCategory] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [editStatus, setEditStatus] = useState("");
  const [editError, setEditError] = useState(false);
  const [editLoading, setEditLoading] = useState(false);

  const [addName, setAddName] = useState("");
  const [addPrice, setAddPrice] = useState("");
  const [addCategory, setAddCategory] = useState("");
  const [addDesc, setAddDesc] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [addError, setAddError] = useState(false);
  const [addLoading, setAddLoading] = useState(false);

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const productCategories = categories.filter((c) => c.id !== "All");

  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditName(p.name);
    setEditPrice(String(p.price));
    setEditCategory(p.category);
    setEditDesc(p.description ?? "");
    setEditStatus("");
    setEditError(false);
  }

  function cancelEdit() {
    setEditingId(null);
    setEditStatus("");
    setEditError(false);
  }

  async function handleSaveEdit() {
    if (!actor || !editingId) return;
    const price = Number(editPrice);
    if (!editName.trim() || Number.isNaN(price) || price <= 0) {
      setEditStatus("Name and valid price are required.");
      setEditError(true);
      return;
    }
    setEditLoading(true);
    setEditStatus("");
    try {
      const res = await actor.updateProduct(
        BigInt(editingId),
        editName.trim(),
        price,
        editCategory,
        ADMIN_PASSWORD,
      );
      if ("err" in res) {
        setEditStatus(res.err);
        setEditError(true);
      } else {
        setEditStatus("Saved.");
        setEditError(false);
        setEditingId(null);
        onRefresh();
      }
    } catch {
      setEditStatus("Failed to save. Try again.");
      setEditError(true);
    } finally {
      setEditLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!actor) return;
    setDeletingId(id);
    try {
      const res = await actor.deleteProduct(BigInt(id), ADMIN_PASSWORD);
      if ("err" in res) {
        // surface the error briefly
      }
      onRefresh();
    } catch {
      // silently recover
    } finally {
      setDeletingId(null);
    }
  }

  async function handleAdd() {
    if (!actor) return;
    const price = Number(addPrice);
    if (!addName.trim() || Number.isNaN(price) || price <= 0) {
      setAddStatus("Name and valid price are required.");
      setAddError(true);
      return;
    }
    setAddLoading(true);
    setAddStatus("");
    try {
      const res = await actor.addProduct(
        addName.trim(),
        price,
        addCategory || (productCategories[0]?.id ?? ""),
        ADMIN_PASSWORD,
      );
      if ("err" in res) {
        setAddStatus(res.err);
        setAddError(true);
      } else {
        setAddStatus("Product added.");
        setAddError(false);
        setAddName("");
        setAddPrice("");
        setAddDesc("");
        onRefresh();
      }
    } catch {
      setAddStatus("Failed to add. Try again.");
      setAddError(true);
    } finally {
      setAddLoading(false);
    }
  }

  return (
    <section className="space-y-4" data-ocid="admin-products-section">
      <Label>Products</Label>

      {/* Product list */}
      <div className="border border-border divide-y divide-border">
        {products.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs font-mono text-muted-foreground">
              NO PRODUCTS YET
            </p>
          </div>
        )}
        {products.map((p) =>
          editingId === p.id ? (
            <div key={p.id} className="p-4 space-y-3 bg-muted/30">
              <div className="grid grid-cols-2 gap-2">
                <InlineInput
                  placeholder="Product name"
                  value={editName}
                  onChange={setEditName}
                  data-ocid="edit-product-name"
                />
                <InlineInput
                  type="number"
                  placeholder="Price (₹)"
                  value={editPrice}
                  onChange={setEditPrice}
                  data-ocid="edit-product-price"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={editCategory}
                  onChange={(e) => setEditCategory(e.target.value)}
                  className="w-full border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-body"
                  data-ocid="edit-product-category"
                >
                  {productCategories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <InlineInput
                  placeholder="Description (optional)"
                  value={editDesc}
                  onChange={setEditDesc}
                  data-ocid="edit-product-desc"
                />
              </div>
              <StatusMsg message={editStatus} isError={editError} />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  disabled={editLoading}
                  className="btn-primary text-xs px-4 py-2 font-mono tracking-widest flex items-center gap-1.5"
                  data-ocid="edit-product-save"
                >
                  {editLoading && (
                    <Loader2 size={12} className="animate-spin" />
                  )}
                  SAVE
                </button>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="border border-border text-xs px-4 py-2 font-mono tracking-widest hover:bg-muted transition-smooth"
                  data-ocid="edit-product-cancel"
                >
                  CANCEL
                </button>
              </div>
            </div>
          ) : (
            <div
              key={p.id}
              className="flex items-center gap-3 px-4 py-3"
              data-ocid={`product-row-${p.id}`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{p.name}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  ₹{p.price.toLocaleString("en-IN")} · {p.category}
                </p>
              </div>
              <button
                type="button"
                onClick={() => startEdit(p)}
                className="p-1.5 btn-ghost"
                aria-label={`Edit ${p.name}`}
                data-ocid={`edit-product-btn-${p.id}`}
              >
                <Edit2 size={14} />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(p.id)}
                disabled={deletingId === p.id}
                className="p-1.5 btn-ghost text-destructive"
                aria-label={`Delete ${p.name}`}
                data-ocid={`delete-product-btn-${p.id}`}
              >
                {deletingId === p.id ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Trash2 size={14} />
                )}
              </button>
            </div>
          ),
        )}
      </div>

      {/* Add product form */}
      <div
        className="border border-border p-4 space-y-3"
        data-ocid="add-product-form"
      >
        <Label>Add Product</Label>
        <div className="grid grid-cols-2 gap-2">
          <InlineInput
            placeholder="Product name"
            value={addName}
            onChange={setAddName}
            data-ocid="add-product-name"
          />
          <InlineInput
            type="number"
            placeholder="Price (₹)"
            value={addPrice}
            onChange={setAddPrice}
            data-ocid="add-product-price"
          />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <select
            value={addCategory}
            onChange={(e) => setAddCategory(e.target.value)}
            className="w-full border border-border bg-input px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring font-body"
            data-ocid="add-product-category"
          >
            {productCategories.length === 0 && (
              <option value="">No categories</option>
            )}
            {productCategories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
          <InlineInput
            placeholder="Description (optional)"
            value={addDesc}
            onChange={setAddDesc}
            data-ocid="add-product-desc"
          />
        </div>
        <StatusMsg message={addStatus} isError={addError} />
        <button
          type="button"
          onClick={handleAdd}
          disabled={addLoading}
          className="btn-primary text-xs px-4 py-2 font-mono tracking-widest flex items-center gap-1.5"
          data-ocid="add-product-btn"
        >
          {addLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
          ADD PRODUCT
        </button>
      </div>
    </section>
  );
}

// ─── Categories Section ────────────────────────────────────────────────────

interface CategoriesSectionProps {
  categories: Category[];
  actor: AdminActor | null;
  onRefresh: () => void;
}

function CategoriesSection({
  categories,
  actor,
  onRefresh,
}: CategoriesSectionProps) {
  const [addLabel, setAddLabel] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [addError, setAddError] = useState(false);
  const [addLoading, setAddLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const displayCategories = categories.filter((c) => c.id !== "All");

  async function handleAdd() {
    if (!actor) return;
    if (!addLabel.trim()) {
      setAddStatus("Category name is required.");
      setAddError(true);
      return;
    }
    setAddLoading(true);
    setAddStatus("");
    try {
      const res = await actor.addCategory(addLabel.trim(), ADMIN_PASSWORD);
      if ("err" in res) {
        setAddStatus(res.err);
        setAddError(true);
      } else {
        setAddStatus("Category added.");
        setAddError(false);
        setAddLabel("");
        onRefresh();
      }
    } catch {
      setAddStatus("Failed to add. Try again.");
      setAddError(true);
    } finally {
      setAddLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!actor) return;
    setDeletingId(id);
    try {
      const res = await actor.deleteCategory(BigInt(id), ADMIN_PASSWORD);
      if ("err" in res) {
        // category in use — silently ignore for now
      }
      onRefresh();
    } catch {
      // silently recover
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <section className="space-y-4" data-ocid="admin-categories-section">
      <Label>Categories</Label>

      <div className="border border-border divide-y divide-border">
        {displayCategories.length === 0 && (
          <div className="px-4 py-6 text-center">
            <p className="text-xs font-mono text-muted-foreground">
              NO CATEGORIES YET
            </p>
          </div>
        )}
        {displayCategories.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-3 px-4 py-3"
            data-ocid={`category-row-${c.id}`}
          >
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium">{c.label}</p>
              <p className="text-xs font-mono text-muted-foreground">{c.id}</p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(c.id)}
              disabled={deletingId === c.id}
              className="p-1.5 btn-ghost text-destructive"
              aria-label={`Delete ${c.label}`}
              data-ocid={`delete-category-btn-${c.id}`}
            >
              {deletingId === c.id ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Trash2 size={14} />
              )}
            </button>
          </div>
        ))}
      </div>

      {/* Add category form */}
      <div
        className="border border-border p-4 space-y-3"
        data-ocid="add-category-form"
      >
        <Label>Add Category</Label>
        <InlineInput
          placeholder="Category name (e.g. Jackets)"
          value={addLabel}
          onChange={setAddLabel}
          data-ocid="add-category-label"
        />
        <StatusMsg message={addStatus} isError={addError} />
        <button
          type="button"
          onClick={handleAdd}
          disabled={addLoading}
          className="btn-primary text-xs px-4 py-2 font-mono tracking-widest flex items-center gap-1.5"
          data-ocid="add-category-btn"
        >
          {addLoading ? (
            <Loader2 size={12} className="animate-spin" />
          ) : (
            <Plus size={12} />
          )}
          ADD CATEGORY
        </button>
      </div>
    </section>
  );
}

// ─── Main AdminPanel ───────────────────────────────────────────────────────

interface AdminPanelProps {
  isVisible: boolean;
  onClose: () => void;
  products?: Product[];
  categories?: Category[];
}

export function AdminPanel({
  isVisible,
  onClose,
  products = [],
  categories = [],
}: AdminPanelProps) {
  const [pass, setPass] = useState("");
  const [isAuth, setIsAuth] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { actor } = useActor(createActor);
  const queryClient = useQueryClient();
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["products"] });
    queryClient.invalidateQueries({ queryKey: ["categories"] });
  }, [queryClient]);

  const handleClose = useCallback(() => {
    setIsAuth(false);
    setPass("");
    setLoginError("");
    onClose();
  }, [onClose]);

  const handleLogin = useCallback(() => {
    if (pass === ADMIN_PASSWORD) {
      setIsAuth(true);
      setLoginError("");
    } else {
      setLoginError("Incorrect password.");
    }
  }, [pass]);

  // lock scroll while open
  useEffect(() => {
    if (isVisible) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVisible]);

  // Escape key
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isVisible) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isVisible, handleClose]);

  if (!isVisible) return null;

  return (
    <dialog
      open
      className="fixed inset-0 z-50 m-0 p-0 w-full h-full max-w-none max-h-none bg-foreground/50 backdrop-blur-sm flex items-start justify-end"
      aria-label="Admin panel"
      data-ocid="admin-panel"
    >
      {/* Backdrop */}
      <div
        className="flex-1 h-full"
        onClick={handleClose}
        onKeyDown={(e) => e.key === "Escape" && handleClose()}
        aria-hidden="true"
        role="presentation"
      />

      {/* Panel */}
      <div
        ref={scrollRef}
        className="w-full max-w-lg bg-card border-l border-border h-full flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border flex-shrink-0">
          <div>
            <p className="font-display font-black text-base tracking-tight">
              {isAuth ? "ADMIN DASHBOARD" : "OWNER LOGIN"}
            </p>
            <p className="text-[9px] font-mono text-muted-foreground tracking-widest uppercase mt-0.5">
              SHIFT WEST · {isAuth ? "OWNER" : "ADMIN ACCESS"}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 btn-ghost"
            aria-label="Close admin panel"
            data-ocid="admin-close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {!isAuth ? (
            /* ── Login ── */
            <div className="px-6 py-8 space-y-5 max-w-sm mx-auto">
              <input
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                className="w-full border border-border bg-input px-3 py-2.5 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                data-ocid="admin-password"
                ref={(el) => {
                  if (el && !isAuth) el.focus();
                }}
              />
              {loginError && (
                <p className="text-xs text-destructive font-mono">
                  {loginError}
                </p>
              )}
              <button
                type="button"
                onClick={handleLogin}
                className="w-full btn-primary py-3 text-sm font-bold tracking-widest font-mono"
                data-ocid="admin-login-btn"
              >
                UNLOCK ADMIN
              </button>
            </div>
          ) : (
            /* ── Dashboard ── */
            <div className="px-6 py-6 space-y-8" data-ocid="admin-dashboard">
              <ProductsSection
                products={products}
                categories={categories}
                actor={actor as unknown as AdminActor | null}
                onRefresh={handleRefresh}
              />

              <div className="border-t border-border" />

              <CategoriesSection
                categories={categories}
                actor={actor as unknown as AdminActor | null}
                onRefresh={handleRefresh}
              />

              <div className="border-t border-border pt-4">
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full border border-border py-3 text-sm font-bold tracking-widest font-mono hover:bg-muted transition-smooth"
                  data-ocid="admin-logout-btn"
                >
                  LOGOUT
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
