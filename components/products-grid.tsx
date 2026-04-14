"use client";

import { useState } from "react";
import { ShoppingBag, MapPin, User, RefreshCw, Loader2, Package, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  location: string;
  owner_id: number;
  image: string;
}

interface ProductsGridProps {
  currentUser: string | null;
}

export function ProductsGrid({ currentUser }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [rentingId, setRentingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
      const data = await res.json();
      setProducts(data);
      setLoaded(true);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteProduct(productId: number) {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }
    if (!confirm("Are you sure you want to delete this product?")) return;

    setDeletingId(productId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delete_product/${productId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser }),
      });
      const data = await res.json();
      alert(data.message);
      if (res.ok) {
        setProducts(products.filter(p => p.id !== productId));
      }
    } catch {
      alert("Error deleting product");
    } finally {
      setDeletingId(null);
    }
  }

  async function rentProduct(productId: number) {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    setRentingId(productId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser, product_id: productId }),
      });
      const data = await res.json();
      alert(data.message);
    } catch {
      alert("Error renting product");
    } finally {
      setRentingId(null);
    }
  }

  return (
    <Card className="transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <ShoppingBag className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg">Available Products</CardTitle>
              <CardDescription>Browse items available for rent</CardDescription>
            </div>
          </div>
          <Button onClick={loadProducts} variant="outline" size="sm" className="gap-2" disabled={loading}>
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            {loaded ? "Refresh" : "Load Products"}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {!loaded && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Click &quot;Load Products&quot; to see available items</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        )}

        {loaded && products.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Package className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">No products available yet</p>
          </div>
        )}

        {products.length > 0 && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="group bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={`${process.env.NEXT_PUBLIC_API_URL}/${product.image}`}
                    alt={product.name}
                    className="w-full h-40 object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/200";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-foreground mb-2 truncate">{product.name}</h3>
                  <div className="space-y-1 text-sm text-muted-foreground mb-4">
                    <p className="font-medium text-lg text-foreground">
                      {"₹"}{product.price}
                    </p>
                    <p className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {product.location}
                    </p>
                    <p className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      Owner ID: {product.owner_id}
                    </p>
                  </div>
                  <Button
                    onClick={() => rentProduct(product.id)}
                    className="w-full gap-2"
                    disabled={rentingId === product.id}
                  >
                    {rentingId === product.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <ShoppingBag className="h-4 w-4" />
                    )}
                    Rent Now
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
