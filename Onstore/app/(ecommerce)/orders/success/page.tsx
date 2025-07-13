"use client";

import { motion } from "framer-motion";
import { CheckCircle, Package, Truck, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function OrderSuccess() {
  const steps = [
    { icon: CheckCircle, text: "Order Confirmed" },
    { icon: Package, text: "Processing" },
    { icon: Truck, text: "Shipping" },
    { icon: Home, text: "Delivered" },
  ];

  return (
    <div className="min-h-[90vh] bg-gray-900 text-gray-100 flex items-center justify-center p-4">
      <motion.div
        className="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-lg"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="text-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
        >
          <CheckCircle className="w-20 h-20 text-[#00FFFF] mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-[#00FFFF] mb-2">
            Order Successful!
          </h1>
          <p className="text-gray-400">
            Your order has been placed and is being processed.
          </p>
        </motion.div>

        <motion.div
          className="space-y-4 mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center space-x-4"
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <step.icon
                className={`w-6 h-6 ${
                  index === 0 ? "text-[#00FFFF]" : "text-gray-500"
                }`}
              />
              <div
                className={`flex-1 h-1 ${
                  index === 0 ? "bg-[#00FFFF]" : "bg-gray-700"
                }`}
              />
              <span
                className={`text-sm ${
                  index === 0 ? "text-[#00FFFF]" : "text-gray-500"
                }`}
              >
                {step.text}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          className="text-center space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <p className="text-gray-400 pb-5">Thank you for your purchase!</p>
          <Link href="/" passHref>
            <Button className="bg-[#00FFFF] hover:bg-[#00CCCC] text-gray-900 font-semibold">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
