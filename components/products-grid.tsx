"use client";

import { useState } from "react";
import { ShoppingBag, MapPin, User, RefreshCw, Loader2, Package, Phone, Mail, X } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface Product {
  id: number;
  name: string;
  price: number;
  location: string;
  owner_id: number;
  image: string;
  phone?: string;
  email?: string;
}

interface ProductsGridProps {
  currentUser: string | null;
}

export function ProductsGrid({ currentUser }: ProductsGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [rentingId, setRentingId] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showContactModal, setShowContactModal] = useState(false);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/products`);
      const data = await res.json();
      setProducts(data);
      setLoaded(true);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  async function rentProduct(product: Product) {
    if (!currentUser) {
      alert("Please login first!");
      return;
    }

    setSelectedProduct(product);
    setShowContactModal(true);
  }

  async function confirmRent() {
    if (!selectedProduct) return;

    setRentingId(selectedProduct.id);
    try {
      const res = await fetch(`${API_BASE_URL}/rent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: currentUser, product_id: selectedProduct.id }),
      });
      const data = await res.json();
      alert(data.message);
      setShowContactModal(false);
      setSelectedProduct(null);
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
                    src={`${API_BASE_URL}/${product.image}`}
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
                    onClick={() => rentProduct(product)}
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

      {/* Contact Modal */}
      {showContactModal && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle>Owner Contact Information</CardTitle>
                <CardDescription>Product: {selectedProduct.name}</CardDescription>
              </div>
              <button
                onClick={() => {
                  setShowContactModal(false);
                  setSelectedProduct(null);
                }}
                className="p-1 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Product Details */}
              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Product:</span> {selectedProduct.name}
                </p>
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Price:</span> ₹{selectedProduct.price}
                </p>
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Location:</span> {selectedProduct.location}
                </p>
                <p className="text-sm font-medium">
                  <span className="text-muted-foreground">Owner ID:</span> {selectedProduct.owner_id}
                </p>
              </div>

              {/* Contact Information */}
              <div className="space-y-3 border-t border-border pt-4">
                <h4 className="font-semibold text-sm">Contact Details</h4>
                
                {selectedProduct.phone ? (
                  <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Phone</p>
                      <p className="font-medium text-foreground">{selectedProduct.phone}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No phone provided</p>
                  </div>
                )}

                {selectedProduct.email ? (
                  <div className="flex items-center gap-3 p-3 bg-accent/20 rounded-lg">
                    <Mail className="h-5 w-5 text-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="font-medium text-foreground break-all">{selectedProduct.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">No email provided</p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowContactModal(false);
                    setSelectedProduct(null);
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  onClick={confirmRent}
                  className="flex-1 gap-2"
                  disabled={rentingId === selectedProduct.id}
                >
                  {rentingId === selectedProduct.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <ShoppingBag className="h-4 w-4" />
                  )}
                  Confirm Rent
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </Card>
  );
}
