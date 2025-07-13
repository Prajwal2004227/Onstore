"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  LogIn,
} from "lucide-react";
import { useRouter } from "next/navigation";
import useCartStore from "@/stores/cartStore";
import getUserSession from "@/actions/auth/getUserSession";
import { IOrderData } from "oneentry/dist/orders/ordersInterfaces";
import createOrder from "@/actions/orders/create-order";
import Image from "next/image";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";

export default function CartPage() {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cart);
  const cleartCart = useCartStore((state) => state.clearCart);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<IUserEntity | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function fetchUser() {
      const userData = await getUserSession();
      setUser(userData ?? null);
    }
    fetchUser();
  }, []);

  const createOrderAndCheckout = async () => {
    const data: IOrderData = {
      formData: [],
      formIdentifier: "order-form",
      paymentAccountIdentifier: "stripe-payment",
      products: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
      })),
    };
    const url = await createOrder(data);
    cleartCart();
    router.push(url);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.1; // Assuming 10% tax
  const total = subtotal + tax;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-3xl sm:text-4xl font-bold text-center mb-8 sm:mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#00CCCC]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Your Cart
        </motion.h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-700 rounded-md"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <>
            <AnimatePresence>
              {cartItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mb-4 relative overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
                    <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={80}
                        height={80}
                        className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md"
                      />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-[#00FFFF] line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-gray-400">
                          ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between sm:justify-end sm:flex-1">
                      <div className="flex items-center space-x-2">
                        <Button
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="text-[#00FFFF] border-[#00FFFF] hover:bg-[#00FFFF] hover:text-gray-900"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <Input
                          type="number"
                          min="0"
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className="w-16 bg-gray-700 border-gray-600 text-center text-[#00FFFF]"
                        />
                        <Button
                          size="icon"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="text-[#00FFFF] border-[#00FFFF] hover:bg-[#00FFFF] hover:text-gray-900"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeItem(item.id)}
                        className="text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200 ml-4"
                      >
                        <Trash2 className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg mt-8"
            >
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-[#00FFFF]">
                Order Summary
              </h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-gray-700 my-2"></div>
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-[#00FFFF]">${total.toFixed(2)}</span>
                </div>
              </div>
              {user ? (
                <Button
                  className="w-full mt-6 bg-[#00FFFF] hover:bg-[#00CCCC] text-gray-900 font-semibold"
                  disabled={!cartItems.length}
                  onClick={createOrderAndCheckout}
                >
                  <CreditCard className="mr-2 h-5 w-5" />
                  Proceed to Checkout
                </Button>
              ) : (
                <Button
                  className="w-full mt-6 bg-[#00FFFF] hover:bg-[#00CCCC] text-gray-900 font-semibold"
                  onClick={() => router.push("/auth?type=login")}
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Login to Checkout
                </Button>
              )}
            </motion.div>
          </>
        )}

        {!isLoading && cartItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-[#00FFFF]">
              Your cart is empty
            </h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven&apos;t added any items to your cart yet.
            </p>
            <Button
              className="bg-[#00FFFF] hover:bg-[#00CCCC] text-gray-900 font-semibold"
              onClick={() => router.push("/")}
            >
              Continue Shopping
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
