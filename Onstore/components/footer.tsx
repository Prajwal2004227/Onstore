"use client";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <motion.footer
      className="bg-gray-900 text-gray-300"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          <div className="space-y-8 xl:col-span-1">
            <motion.span
              className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00FFFF] to-[#00CCCC]"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              OneStore
            </motion.span>
            <p className="text-gray-400 text-base">
              Bringing the future to your doorstep. Explore our cutting-edge
              tech products and revolutionize your digital life.
            </p>
            <div className="flex space-x-6">
              {["Facebook", "Instagram", "Twitter", "GitHub", "LinkedIn"].map(
                (social) => (
                  <motion.a
                    key={social}
                    href="#"
                    className="text-gray-400 hover:text-[#00FFFF]"
                    whileHover={{ y: -2 }}
                    whileTap={{ y: 0 }}
                  >
                    <span className="sr-only">{social}</span>
                    <i className={`fab fa-${social.toLowerCase()}`}></i>
                  </motion.a>
                )
              )}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Solutions
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Smart Home", "Wearables", "Audio", "Computers"].map(
                    (item) => (
                      <motion.li key={item} whileHover={{ x: 2 }}>
                        <a
                          href="#"
                          className="text-base text-gray-400 hover:text-[#00FFFF]"
                        >
                          {item}
                        </a>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Pricing", "Documentation", "Guides", "API Status"].map(
                    (item) => (
                      <motion.li key={item} whileHover={{ x: 2 }}>
                        <a
                          href="#"
                          className="text-base text-gray-400 hover:text-[#00FFFF]"
                        >
                          {item}
                        </a>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  {["About", "Blog", "Jobs", "Press", "Partners"].map(
                    (item) => (
                      <motion.li key={item} whileHover={{ x: 2 }}>
                        <a
                          href="#"
                          className="text-base text-gray-400 hover:text-[#00FFFF]"
                        >
                          {item}
                        </a>
                      </motion.li>
                    )
                  )}
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">
                  Legal
                </h3>
                <ul className="mt-4 space-y-4">
                  {["Claim", "Privacy", "Terms"].map((item) => (
                    <motion.li key={item} whileHover={{ x: 2 }}>
                      <a
                        href="#"
                        className="text-base text-gray-400 hover:text-[#00FFFF]"
                      >
                        {item}
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-800 pt-8">
          <p className="text-base text-gray-400 xl:text-center">
            &copy; 2024 OneStore, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </motion.footer>
  );
}
