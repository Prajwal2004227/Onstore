"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Star, ShoppingCart, Heart, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import useCartStore from "@/stores/cartStore";
import { getProductDetails } from "@/actions/catalog/getProductDetails";
import ProductCatalog from "@/components/productCatalog";
import { getRelatedProducts } from "@/actions/catalog/getRelatedProducts";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailPage({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const [product, setProduct] = useState<any>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const addToCart = useCartStore((state) => state.addToCart);
  const { toast } = useToast();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productData = await getProductDetails(parseInt(productId));
        setProduct(productData);
        const relatedProductsData = await getRelatedProducts(
          // @ts-ignore
          parseInt(productData?.productPages[0].pageId),
          parseInt(productId)
        );
        setRelatedProducts(relatedProductsData);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) fetchData();
  }, [productId]);

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.localizeInfos?.title || "Product",
        price: product.price,
        quantity: 1,
        image: product.attributeValues.p_image.value.downloadLink,
      });
      toast({
        title: "Added to Cart",
        description: `${product.attributeValues.p_title.value} has been added to your cart.`,
        duration: 3000,
        variant: "tealBlack",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 flex items-center justify-center">
        <motion.div
          className="w-16 h-16 border-4 border-t-[#00FFFF] border-r-[#00FFFF] border-b-gray-800 border-l-gray-800 rounded-full animate-spin"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <motion.button
          className="mb-8 flex items-center text-[#00FFFF] hover:text-[#00CCCC] transition-colors duration-300"
          onClick={() => router.back()}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft className="mr-2 h-5 w-5" />
          Back
        </motion.button>

        {/* Product details */}
        <motion.div
          className="grid md:grid-cols-2 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="relative aspect-square overflow-hidden rounded-lg ">
            <Image
              src={product.attributeValues.p_image.value.downloadLink}
              alt={product.name}
              layout="fill"
              objectFit="contain"
              className="transition-transform duration-300 hover:scale-110"
            />
          </div>

          <div className="space-y-6">
            <h1 className="text-3xl font-bold text-[#00FFFF]">
              {product.attributeValues.p_title.value}
            </h1>
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < Math.floor(4.5) ? "text-yellow-400" : "text-gray-400"
                    }`}
                    fill={i < Math.floor(4.5) ? "currentColor" : "none"}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-400">(4.5 stars)</span>
            </div>
            <p className="text-xl font-semibold">
              ${product.attributeValues.p_price.value.toFixed(2)}
            </p>
            <div
              className="text-gray-400"
              dangerouslySetInnerHTML={{
                __html:
                  product.attributeValues.p_description.value[0].htmlValue,
              }}
            />

            <div className="flex space-x-4">
              <Button
                className="flex-1 bg-[#00FFFF] hover:bg-[#00CCCC] text-gray-900 font-semibold"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <Button className="text-[#00FFFF] border-[#00FFFF] hover:bg-[#00FFFF] hover:text-gray-900">
                <Heart className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <motion.section
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <ProductCatalog
              title="Related Products"
              products={relatedProducts}
            />
          </motion.section>
        )}
      </main>
    </div>
  );
}
