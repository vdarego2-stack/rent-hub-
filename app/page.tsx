"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { AuthForms } from "@/components/auth-forms";
import { AddProductForm } from "@/components/add-product-form";
import { ProductsGrid } from "@/components/products-grid";
import { Sparkles, ArrowRight, Shield, Clock, MapPin } from "lucide-react";

export default function Home() {
  const [currentUser, setCurrentUser] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");
    if (storedUser) {
      setCurrentUser(storedUser);
    }
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar currentUser={currentUser} />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-muted via-transparent to-transparent" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 sm:py-24 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Sparkles className="h-4 w-4" />
              <span>Your trusted rental marketplace</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance mb-6 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
              Rent anything,
              <br />
              <span className="text-muted-foreground">anytime</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              Connect with people in your area to rent items you need. Save money, reduce waste, build community.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
              <a href="#auth" className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full font-medium hover:opacity-90 transition-opacity">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </a>
              <a href="#products" className="inline-flex items-center gap-2 px-6 py-3 border border-border rounded-full font-medium hover:bg-muted transition-colors">
                Browse Products
              </a>
            </div>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mt-16 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-400">
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Secure Transactions</h3>
                <p className="text-sm text-muted-foreground">Safe and trusted rental experience</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-primary/10">
                <Clock className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Flexible Duration</h3>
                <p className="text-sm text-muted-foreground">Rent for as long as you need</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-6 rounded-2xl bg-card border border-border">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold mb-1">Local Community</h3>
                <p className="text-sm text-muted-foreground">Connect with people near you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* User Status */}
        {currentUser && (
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-green-50 text-green-700 border border-green-200 animate-in fade-in slide-in-from-top-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium">Logged in as User ID: {currentUser}</span>
          </div>
        )}

        {/* Auth Section */}
        <section id="auth" className="scroll-mt-20">
          <AuthForms onLoginSuccess={setCurrentUser} />
        </section>

        {/* Add Product Section */}
        <section>
          <AddProductForm currentUser={currentUser} />
        </section>

        {/* Products Section */}
        <section id="products" className="scroll-mt-20">
          <ProductsGrid currentUser={currentUser} />
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <span className="font-semibold">RentHub</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Your trusted rental marketplace
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
