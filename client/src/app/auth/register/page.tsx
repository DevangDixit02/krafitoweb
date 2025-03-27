"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";
import { protectSignInAction } from "@/actions/auth";
import { useAuthStore } from "@/store/useAuthStore";

import banner from "../../../../public/images/banner.jpg";
import logo from "../../../../public/images/logo.png";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const { register, isLoading } = useAuthStore();
  const router = useRouter();

  // Handle input changes
  const handleOnChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [event.target.name]: event.target.value,
      }));
    },
    []
  );

  // Handle form submission
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationResponse = await protectSignInAction(formData.email);
    if (!validationResponse.success) {
      toast.error(validationResponse.error || "Invalid credentials.", {
        style: { backgroundColor: "#ff4d4d", color: "#fff" },
      });
      return;
    }

    const userId = await register(
      formData.name,
      formData.email,
      formData.password
    );
    if (userId) {
      toast.success("Account created successfully.", {
        style: { backgroundColor: "purple", color: "#fff" },
      });
      router.push("/auth/login");
    }
  };

  return (
    <div className="min-h-screen flex bg-[#fff6f4]">
      {/* Left Image Section */}
      <div className="hidden lg:block w-1/2 bg-[#ffede1] relative overflow-hidden">
        <Image
          src={banner}
          alt="Register"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center p-8 lg:p-16">
        <div className="max-w-md mx-auto w-full">
          <div className="flex justify-center mb-6">
            <Image src={logo} width={200} height={50} alt="Logo" />
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                required
                className="bg-[#ffede1]"
                value={formData.name}
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                required
                className="bg-[#ffede1]"
                value={formData.email}
                onChange={handleOnChange}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                required
                className="bg-[#ffede1]"
                value={formData.password}
                onChange={handleOnChange}
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white hover:bg-gray-900 transition-all"
            >
              {isLoading ? "Creating..." : "CREATE ACCOUNT"}
              {!isLoading && <ArrowRight className="w-4 h-4 ml-2" />}
            </Button>

            {/* Redirect to Login */}
            <p className="text-center text-sm text-[#3f3d56]">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="text-black font-bold hover:underline"
              >
                Sign In
              </Link>
            </p>
          </form>
        </div>
      </div>

      <Toaster />
    </div>
  );
};

export default RegisterPage;
