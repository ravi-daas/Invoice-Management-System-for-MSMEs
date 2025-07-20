import { randomUUID } from 'crypto';
import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Product } from "@/types";
import { useInventory } from "@/contexts/InventoryStoreContext";
import { createProduct, fetchOrCreateInventory, fetchProducts } from "@/apis/products";

export default function InventoryPage() {
  const {
    inventory,
    addProduct,
    updateProduct,
    deleteProduct,
    setInventoryDirectly,
  } = useInventory();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Product>({
    id: "",
    name: "",
    sku: "",
    category: "",
    quantity: 0,
    price: 0,
    status: "In Stock",
    hsnCode: "",
  });

  const handleAddProduct = () => {
    createProduct(newProduct);
    addProduct(newProduct);
    setIsDialogOpen(false);
    setNewProduct({
      id: "",
      name: "",
      sku: "",
      category: "",
      quantity: 0,
      price: 0,
      status: "In Stock",
      hsnCode: "",
    });
  };

  useEffect(() => {
    const fetchInventory = async () => {
      const data = await fetchOrCreateInventory();
      console.log(data);
      setInventoryDirectly(data);
    };
    fetchInventory();
  }, []);

  const handleUpdateProduct = () => {
    if (selectedProduct) {
      updateProduct(selectedProduct.id, selectedProduct);
      setIsEditDialogOpen(false);
      setSelectedProduct(null);
    }
  };

  const handleEditClick = (product: Product) => {
    console.log(product);

    setSelectedProduct(product);
    setIsEditDialogOpen(true);
  };

  const handleDeleteClick = (productId: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      deleteProduct(productId); // Assuming you have a deleteProduct function
    }
  };

  const filteredProducts = inventory.products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
        <Button
          onClick={() => setIsDialogOpen(true)}
          className="bg-purple-400 hover:bg-purple-500 text-white"
        >
          <Plus className="mr-2 h-4 w-4 " />
          Add Product
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-4">
            <Input
              placeholder="Search products by Name or SKU..."
              className="max-w-sm"
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="secondary">
              <Search className="mr-2 h-4 w-4" />
              Search
            </Button>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>SKU</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        {product.name}
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.hsnCode}</TableCell>
                      <TableCell>{product.quantity}</TableCell>
                      <TableCell>${product.price}</TableCell>
                      <TableCell>{product.status}</TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#67338a] dark:text-[#bb6cef]"
                          onClick={() => handleEditClick(product)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-[#67338a] "
                          onClick={() => handleDeleteClick(product.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center">
                      No products found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Product Name</label>
              <Input
                placeholder="Enter product name"
                value={newProduct.name}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, name: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                {" "}
                <label className="text-sm font-medium">SKU</label>
                <Input
                  placeholder="Enter SKU"
                  value={newProduct.sku}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, sku: e.target.value })
                  }
                />
              </div>
              <div>
                {" "}
                <label className="text-sm font-medium">HSN Code</label>
                <Input
                  placeholder="Enter HSN Code"
                  value={newProduct.hsnCode}
                  onChange={(e) =>
                    setNewProduct({ ...newProduct, hsnCode: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <div>
            <div>
              <label className="text-sm font-medium">Category</label>
              <Input
                placeholder="Enter category"
                value={newProduct.category}
                onChange={(e) =>
                  setNewProduct({ ...newProduct, category: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="text-sm font-medium">Quantity</label>
                <Input
                  placeholder="0"
                  type="number"
                  value={newProduct.quantity}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      quantity: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div>
                <label className="text-sm font-medium">Price ($)</label>
                <Input
                  placeholder="0.00"
                  type="number"
                  value={newProduct.price}
                  onChange={(e) =>
                    setNewProduct({
                      ...newProduct,
                      price: Number(e.target.value),
                    })
                  }
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            <Button variant="secondary" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddProduct}>Add Product</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="mt-6">
              <label className="text-sm font-medium mb-1 block mt-4">
                Product Name
              </label>
              <Input
                placeholder="Enter product name"
                value={selectedProduct.name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />

              {/* SKU */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div>
                  {" "}
                  <label className="text-sm font-medium">SKU</label>
                  <Input
                    placeholder="Enter SKU"
                    value={selectedProduct.sku}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        sku: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  {" "}
                  <label className="text-sm font-medium">HSN Code</label>
                  <Input
                    placeholder="Enter HSN Code"
                    value={selectedProduct.hsnCode}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        hsnCode: e.target.value,
                      })
                    }
                  />
                </div>
              </div>

              {/* Category */}
              <label className="text-sm font-medium mb-1 block mt-4">
                Category
              </label>
              <Input
                placeholder="Enter category"
                value={selectedProduct.category}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    category: e.target.value,
                  })
                }
              />

              {/* Quantity & Price in One Row */}
              <div className="flex space-x-4">
                {/* Quantity */}
                <div className="w-1/2">
                  <label className="text-sm font-medium mb-1 block mt-4">
                    Quantity
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter quantity"
                    value={selectedProduct.quantity}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        quantity: Number(e.target.value),
                      })
                    }
                  />
                </div>

                {/* Price */}
                <div className="w-1/2">
                  <label className="text-sm font-medium mb-1 block mt-4">
                    Price
                  </label>
                  <Input
                    type="number"
                    placeholder="Enter price"
                    value={selectedProduct.price}
                    onChange={(e) =>
                      setSelectedProduct({
                        ...selectedProduct,
                        price: Number(e.target.value),
                      })
                    }
                  />
                </div>
              </div>

              {/* Status (Dropdown) */}
              <label className="text-sm font-medium mb-1 block mt-4">
                Status
              </label>
              <select
                className="border p-2 rounded w-full"
                value={selectedProduct.status}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    status: e.target.value,
                  })
                }
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out Of Stock">Out Of Stock</option>
              </select>

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-4">
                <Button
                  variant="secondary"
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleUpdateProduct}>Save Changes</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
