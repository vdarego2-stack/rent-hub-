"use client";

import { useState } from "react";
import { UserPlus, LogIn, Mail, Lock, User, Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface AuthFormsProps {
  onLoginSuccess: (userId: string, email: string) => void;
}

export function AuthForms({ onLoginSuccess }: AuthFormsProps) {
  const [signupData, setSignupData] = useState({ name: "", email: "", password: "" });
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [signupMsg, setSignupMsg] = useState({ text: "", type: "" });
  const [loginMsg, setLoginMsg] = useState({ text: "", type: "" });
  const [signupLoading, setSignupLoading] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);

  async function handleSignup() {
    setSignupLoading(true);
    setSignupMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(signupData),
      });
      const data = await res.json();
      setSignupMsg({ text: data.message, type: res.ok ? "success" : "error" });
      if (res.ok) {
        setSignupData({ name: "", email: "", password: "" });
      }
    } catch {
      setSignupMsg({ text: "Error connecting to server", type: "error" });
    } finally {
      setSignupLoading(false);
    }
  }

  async function handleLogin() {
    setLoginLoading(true);
    setLoginMsg({ text: "", type: "" });
    try {
      const res = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const data = await res.json();
      setLoginMsg({ text: data.message, type: res.ok ? "success" : "error" });
      if (res.ok) {
        localStorage.setItem("currentUser", data.user_id);
        localStorage.setItem("userEmail", loginData.email);
        onLoginSuccess(data.user_id, loginData.email);
        setLoginData({ email: "", password: "" });
      }
    } catch {
      setLoginMsg({ text: "Error connecting to server", type: "error" });
    } finally {
      setLoginLoading(false);
    }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Signup Card */}
      <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <UserPlus className="h-5 w-5 text-primary transition-transform group-hover:scale-110" />
            </div>
            <div>
              <CardTitle className="text-lg">Sign Up</CardTitle>
              <CardDescription>Create a new account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Name"
              className="pl-10"
              value={signupData.name}
              onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
            />
          </div>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-10"
              value={signupData.email}
              onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10"
              value={signupData.password}
              onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
            />
          </div>
          <Button onClick={handleSignup} className="w-full gap-2" disabled={signupLoading}>
            {signupLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <UserPlus className="h-4 w-4" />
            )}
            Sign Up
          </Button>
          {signupMsg.text && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-lg animate-in fade-in slide-in-from-top-2 ${
                signupMsg.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {signupMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {signupMsg.text}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Login Card */}
      <Card className="group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-accent/30 group-hover:bg-accent/50 transition-colors">
              <LogIn className="h-5 w-5 text-foreground transition-transform group-hover:scale-110" />
            </div>
            <div>
              <CardTitle className="text-lg">Log In</CardTitle>
              <CardDescription>Access your account</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="email"
              placeholder="Email"
              className="pl-10"
              value={loginData.email}
              onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
            />
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="password"
              placeholder="Password"
              className="pl-10"
              value={loginData.password}
              onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
            />
          </div>
          <Button onClick={handleLogin} className="w-full gap-2" disabled={loginLoading}>
            {loginLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogIn className="h-4 w-4" />
            )}
            Log In
          </Button>
          {loginMsg.text && (
            <div
              className={`flex items-center gap-2 text-sm p-3 rounded-lg animate-in fade-in slide-in-from-top-2 ${
                loginMsg.type === "success"
                  ? "bg-green-50 text-green-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {loginMsg.type === "success" ? (
                <CheckCircle2 className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {loginMsg.text}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
