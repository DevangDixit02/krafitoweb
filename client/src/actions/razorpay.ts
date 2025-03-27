"use server";

import Razorpay from "razorpay";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export const createRazorpayOrder = async (amount: number) => {
  try {
    const order = await razorpay.orders.create({
      amount: amount * 100, // Convert to paise (smallest currency unit)
      currency: "INR",
      payment_capture: true, // Auto-capture payment
    });

    return {
      success: true,
      order,
    };
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    return {
      success: false,
      error: "Failed to create Razorpay order.",
    };
  }
};

export const verifyRazorpayPayment = async (
  razorpay_order_id: string,
  razorpay_payment_id: string,
  razorpay_signature: string
) => {
  try {
    const crypto = await import("crypto");
    const hmac = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generatedSignature = hmac.digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return {
        success: false,
        error: "Payment verification failed.",
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error("Razorpay Verification Error:", error);
    return {
      success: false,
      error: "Failed to verify Razorpay payment.",
    };
  }
};
