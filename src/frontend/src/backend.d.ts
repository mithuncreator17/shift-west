import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Product {
    id: bigint;
    name: string;
    category: string;
    price: bigint;
}
export interface Category {
    id: bigint;
    name: string;
}
export interface backendInterface {
    addCategory(name: string, password: string): Promise<{
        __kind__: "ok";
        ok: Category;
    } | {
        __kind__: "err";
        err: string;
    }>;
    addProduct(name: string, price: bigint, category: string, password: string): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteCategory(id: bigint, password: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    deleteProduct(id: bigint, password: string): Promise<{
        __kind__: "ok";
        ok: boolean;
    } | {
        __kind__: "err";
        err: string;
    }>;
    getCategory(id: bigint): Promise<Category | null>;
    getProduct(id: bigint): Promise<Product | null>;
    listCategories(): Promise<Array<Category>>;
    listProducts(): Promise<Array<Product>>;
    updateProduct(id: bigint, name: string, price: bigint, category: string, password: string): Promise<{
        __kind__: "ok";
        ok: Product;
    } | {
        __kind__: "err";
        err: string;
    }>;
}
