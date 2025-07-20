import { deleteProductById, updateProductById } from "@/apis/products";
import { InventoryState, Product } from "@/types";
import { createContext, useContext, useState, ReactNode } from "react";

interface InventoryContextType {
  inventory: InventoryState;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, updatedProduct: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  setInventoryDirectly: (newInventory: InventoryState) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(
  undefined
);

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryState>({
    totalProducts: 0,
    lowStockItems: 0,
    outOfStockItems: 0,
    products: [],
  });

  const addProduct = (product: Product) => {
    setInventory((prev) => ({
      ...prev,
      totalProducts: prev.totalProducts + 1,
      products: [...prev.products, product],
    }));
  };

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    updateProductById(id, updatedProduct);
    setInventory((prev) => ({
      ...prev,
      products: prev.products.map((product) =>
        product.id === id ? { ...product, ...updatedProduct } : product
      ),
    }));
  };

  const deleteProduct = (id: string) => {
    deleteProductById(id);
    setInventory((prev) => ({
      ...prev,
      totalProducts: prev.totalProducts - 1,
      products: prev.products.filter((product) => product.id !== id),
    }));
  };

  const setInventoryDirectly = (newInventory: InventoryState) => {
    setInventory(newInventory);
  };

  return (
    <InventoryContext.Provider
      value={{
        inventory,
        addProduct,
        updateProduct,
        deleteProduct,
        setInventoryDirectly,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
