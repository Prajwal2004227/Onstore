"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Package, Truck, CheckCircle, AlertCircle } from "lucide-react";
import { getOrders } from "@/actions/orders/get-orders";
import { useRouter } from "next/navigation";
import {
  IOrdersByMarkerEntity,
  IOrdersEntity,
} from "oneentry/dist/orders/ordersInterfaces";

interface Product {
  id: number;
  title: string;
  price: number;
  quantity: number | null;
}

interface OrderItem {
  id: number;
  createdDate: string;
  statusIdentifier: string;
  totalSum: string;
  products: Product[];
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: "Processing" | "Shipped" | "Delivered" | "Cancelled";
  items: OrderItem[];
}

interface IOrder {
  items: OrderItem[];
  total: number;
}

const orderStatusIcons = {
  processing: <Package className="w-5 h-5 text-yellow-500" />,
  shipped: <Truck className="w-5 h-5 text-blue-500" />,
  delivered: <CheckCircle className="w-5 h-5 text-green-500" />,
  cancelled: <AlertCircle className="w-5 h-5 text-red-500" />,
};

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<IOrder>({ items: [], total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Simulating API call to fetch orders
    const fetchOrders = async () => {
      const data = await getOrders();
      console.log({ data });
      if (data !== undefined)
        setOrders({ items: data.items.reverse(), total: data.total });
      else setOrders({ total: 0, items: [] });
      setIsLoading(false);
    };

    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <motion.div
        className="max-w-4xl mx-auto"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.h1
          className="text-4xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#00CCCC]"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          My Orders
        </motion.h1>

        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <motion.div
                key={index}
                className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-700 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-700 rounded w-1/3"></div>
              </motion.div>
            ))}
          </div>
        ) : (
          <AnimatePresence>
            {orders?.items?.map((order, index) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-gray-800 rounded-lg shadow-lg mb-6 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-[#00FFFF]">
                      Order #{order.id}
                    </h2>
                    <Badge className={` text-white`}>
                      {/* @ts-ignore */}
                      {orderStatusIcons[order.statusIdentifier]}
                      <span className="ml-2 capitalize">
                        {order.statusIdentifier}
                      </span>
                    </Badge>
                  </div>
                  <div className="flex justify-between text-gray-400 mb-4">
                    <span>
                      Order Date: {order.createdDate.split("T").shift()}
                    </span>
                    <span>Total: ${order.totalSum}</span>
                  </div>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="items">
                      <AccordionTrigger className="text-[#00FFFF] hover:text-[#00CCCC]">
                        View Order Details
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 mt-4">
                          {order.products.map((item) => (
                            <div
                              key={item.id}
                              className="flex items-center space-x-4"
                            >
                              <div className="flex-1">
                                <h3 className="font-semibold text-[#00FFFF]">
                                  {item.title}
                                </h3>
                                <p className="text-gray-400">
                                  Quantity: {item.quantity}
                                </p>
                              </div>
                              <span className="text-[#00FFFF]">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
                <div className="bg-gray-700 p-4 flex justify-between items-center">
                  <Button className="text-[#00FFFF] border-[#00FFFF] hover:bg-[#00FFFF] hover:text-gray-900">
                    Track Order
                  </Button>
                  <Button className="text-gray-400 hover:text-[#00FFFF]">
                    Need Help?
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!isLoading && orders?.total === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <Package className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-[#00FFFF]">
              No orders yet
            </h2>
            <p className="text-gray-400 mb-6">
              Looks like you haven&apos;t placed any orders. Start shopping to
              see your orders here!
            </p>
            <Button
              className="bg-[#00FFFF] hover:bg-[#00CCCC] text-gray-900 font-semibold"
              onClick={() => router.push("/")}
            >
              Start Shopping
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
