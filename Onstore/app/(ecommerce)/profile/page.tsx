"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { Package, DollarSign, Calendar } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import getUserSession from "@/actions/auth/getUserSession";
import { getOrders } from "@/actions/orders/get-orders";
import { IUserEntity } from "oneentry/dist/users/usersInterfaces";

interface UserStats {
  lifetimeOrders: number;
  lifetimeSpent: number;
  yearlyOrders: number;
  yearlySpent: number;
  monthlyOrders: number;
  monthlySpent: number;
}

export default function ProfilePage() {
  const [user, setUser] = useState<IUserEntity | null>(null);

  const [stats, setStats] = useState<UserStats>({
    lifetimeOrders: 42,
    lifetimeSpent: 3750.5,
    yearlyOrders: 15,
    yearlySpent: 1250.75,
    monthlyOrders: 3,
    monthlySpent: 275.25,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userData = await getUserSession();
      if (userData) setUser(userData);

      const orders = await getOrders();
      if (orders) {
        let lifetimeOrders = 0;
        let lifetimeSpent = 0;
        let yearlyOrders = 0;
        let yearlySpent = 0;
        let monthlyOrders = 0;
        let monthlySpent = 0;

        orders.items.forEach((order) => {
          const orderDate = new Date(order.createdDate);
          const orderYear = orderDate.getFullYear();
          const orderMonth = orderDate.getMonth() + 1;
          const totalSum = parseFloat(order.totalSum);
          const currentYear = new Date().getFullYear(); // Define current year here
          const currentMonth = new Date().getMonth() + 1; // Define current month here

          // Lifetime
          lifetimeOrders += 1;
          lifetimeSpent += totalSum;

          // Yearly
          if (orderYear === currentYear) {
            yearlyOrders += 1;
            yearlySpent += totalSum;
          }

          // Monthly
          if (orderYear === currentYear && orderMonth === currentMonth) {
            monthlyOrders += 1;
            monthlySpent += totalSum;
          }
        });

        setStats({
          lifetimeOrders,
          lifetimeSpent,
          yearlyOrders,
          yearlySpent,
          monthlyOrders,
          monthlySpent,
        });
      }
    };
    fetchData();
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
          My Profile
        </motion.h1>

        {isLoading ? (
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
              <div className="flex items-center space-x-4">
                <div className="w-24 h-24 bg-gray-700 rounded-full"></div>
                <div className="space-y-2 flex-1">
                  <div className="h-6 bg-gray-700 rounded w-1/4"></div>
                  <div className="h-4 bg-gray-700 rounded w-1/2"></div>
                </div>
              </div>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg shadow-lg animate-pulse">
              <div className="h-6 bg-gray-700 rounded w-1/4 mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-700 rounded w-full"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8"
            >
              <div className="flex items-center space-x-4">
                <Avatar className="h-24 w-24 text-6xl text-[#00FFFF]">
                  <AvatarFallback className="bg-[#0F172A]">
                    {user?.formData[0].value.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-2xl font-semibold text-[#00FFFF]">
                    {user?.formData[0].value}
                  </h2>
                  <p className="text-gray-400">{user?.identifier}</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-gray-800 p-6 rounded-lg shadow-lg"
            >
              <h3 className="text-xl font-semibold mb-4 text-[#00FFFF]">
                My Stats
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <StatCard
                  icon={<Package className="h-8 w-8 text-[#00FFFF]" />}
                  title="Lifetime Orders"
                  value={stats.lifetimeOrders}
                />
                <StatCard
                  icon={<DollarSign className="h-8 w-8 text-[#00FFFF]" />}
                  title="Lifetime Spent"
                  value={`$${stats.lifetimeSpent.toFixed(2)}`}
                />
                <StatCard
                  icon={<Calendar className="h-8 w-8 text-[#00FFFF]" />}
                  title="This Year"
                  value={`${stats.yearlyOrders} orders`}
                  subvalue={`$${stats.yearlySpent.toFixed(2)} spent`}
                />
              </div>
            </motion.div>
          </>
        )}
      </motion.div>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subvalue,
}: {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  subvalue?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="bg-gray-700 p-4 rounded-lg flex items-center space-x-4"
    >
      {icon}
      <div>
        <h4 className="text-sm font-medium text-gray-400">{title}</h4>
        <p className="text-2xl font-bold text-[#00FFFF]">{value}</p>
        {subvalue && <p className="text-sm text-gray-400">{subvalue}</p>}
      </div>
    </motion.div>
  );
}
