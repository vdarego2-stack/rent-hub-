"use client";

import { useState, useRef } from "react";
import { Package, DollarSign, MapPin, ImagePlus, Upload, Loader2, CheckCircle2, AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AddProductFormProps {
  currentUser: string | null;
}

export function AddProductForm({ currentUser }: AddProductFormProps) {
  const [productData, setProductData] = useState({ name: "", price: "", location: "" });
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [msg, setMsg] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  function clearImage() {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleAddProduct() {
    if (!currentUser) {
      setMsg({ text: "Please login first!", type: "error" });
      return;
    }

    setLoading(true);
    setMsg({ text: "", type: "" });

    const formData = new FormData();
    formData.append("name", productData.name);
    formData.append("price", productData.price);
    formData.append("location", productData.location);
    formData.append("user_id", currentUser);
    if (image) {
      formData.append("image", image);
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/add_product`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setMsg({ text: data.message, type: res.ok ? "success" : "error" });
      if (res.ok) {
        setProductData({ name: "", price: "", location: "" });
        clearImage();
      }
    } catch {
      setMsg({ text: "Error adding product", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="group transition-all duration-300 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Package className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
          </div>
          <div>
            <CardTitle className="text-lg">Add Product</CardTitle>
            <CardDescription>List a new item for rent</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="relative">
            <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Product Name"
              className="pl-10"
              value={productData.name}
              onChange={(e) => setProductData({ ...productData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Price"
              className="pl-10"
              value={productData.price}
              onChange={(e) => setProductData({ ...productData, price: e.target.value })}
            />
          </div>
        </div>

        <div className="relative">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Location"
            className="pl-10"
            value={productData.location}
            onChange={(e) => setProductData({ ...productData, location: e.target.value })}
          />
        </div>

        {/* Image Upload Area */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="product-image"
          />
          
          {imagePreview ? (
            <div className="relative group/image">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-40 object-cover rounded-lg border border-border"
              />
              <button
                onClick={clearImage}
                className="absolute top-2 right-2 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <label
              htmlFor="product-image"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-muted/50 transition-all duration-200"
            >
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <ImagePlus className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">Click to upload</span> or drag and drop
                </p>
              </div>
            </label>
          )}
        </div>

        <Button onClick={handleAddProduct} className="w-full gap-2" disabled={loading}>
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Upload className="h-4 w-4" />
          )}
          Add Product
        </Button>

        {msg.text && (
          <div
            className={`flex items-center gap-2 text-sm p-3 rounded-lg animate-in fade-in slide-in-from-top-2 ${
              msg.type === "success"
                ? "bg-green-50 text-green-700"
                : "bg-red-50 text-red-700"
            }`}
          >
            {msg.type === "success" ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            {msg.text}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
