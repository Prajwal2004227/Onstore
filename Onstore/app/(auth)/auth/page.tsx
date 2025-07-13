"use client";
import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ChevronLeft,
  Facebook,
  Instagram,
  ShoppingBag,
  Star,
  Key,
  Loader2,
} from "lucide-react";
import { getSignupFormData, handleSignupSubmit } from "@/actions/auth/signup";
import { getLoginFormData, handleLoginSubmit } from "@/actions/auth/login";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { IAttributes } from "oneentry/dist/base/utils";

interface SignUpFormData {
  email: string;
  password: string;
  name: string;
}

interface LoginFormData {
  email: string;
  password: string;
}

export default function Component() {
  const [isSignUp, setIsSignUp] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<IAttributes[]>([]);
  const [inputValues, setInputValues] = useState<
    Partial<SignUpFormData & LoginFormData>
  >({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>("Not valid");

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get("type");
    setIsSignUp(type !== "login");
  }, [searchParams]);

  useEffect(() => {
    setIsLoading(true);
    setError(null);
    const fetchData = isSignUp ? getSignupFormData : getLoginFormData;
    fetchData()
      .then((data) => setFormData(data))
      .catch((err) => setError("Failed to load form data. Please try again."))
      .finally(() => setIsLoading(false));
  }, [isSignUp]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInputValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (isSignUp) {
        if (inputValues.email && inputValues.password && inputValues.name) {
          const response = await handleSignupSubmit(
            inputValues as SignUpFormData
          );

          if ("identifier" in response) {
            setInputValues({});
            setIsSignUp(false);
            toast({
              title: "User Created. Please login to continue.",
              duration: 3000,
              variant: "tealBlack",
            });
          } else {
            setError(response.message);
          }
        } else {
          setError("Please fill out all required fields.");
        }
      } else {
        if (inputValues.email && inputValues.password) {
          const response = await handleLoginSubmit(
            inputValues as LoginFormData
          );
          if (response.message) {
            setError(response.message);
          }
        } else {
          setError("Please fill out all required fields.");
        }
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleForm = () => {
    setIsSignUp(!isSignUp);
    setError(null);
    setInputValues({});
  };

  return (
    <div className="flex min-h-screen bg-gray-900 text-white">
      <div className="w-full max-w-6xl mx-auto flex flex-col lg:flex-row">
        <AnimatePresence mode="wait">
          <motion.div
            key={isSignUp ? "signup" : "signin"}
            className="w-full lg:w-3/5 p-4 sm:p-8 lg:p-12"
            initial={{ opacity: 0, x: isSignUp ? 50 : -50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isSignUp ? -50 : 50 }}
            transition={{ duration: 0.5 }}
          >
            <div
              className="mb-8 lg:mb-12 cursor-pointer"
              onClick={() => router.push("/")}
            >
              <ChevronLeft className="text-gray-400 h-6 w-6 sm:h-8 sm:w-8" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2 sm:mb-4">
                {isSignUp ? "Sign Up" : "Sign In"}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8">
                {isSignUp
                  ? "Join our e-commerce platform and start shopping!"
                  : "Welcome back! Please enter your details"}
              </p>
            </motion.div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-[#00FFFF]" />
              </div>
            ) : (
              <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                {formData.map((field: any) => (
                  <motion.div
                    key={field.marker}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Label
                      htmlFor={field.marker}
                      className="text-base sm:text-lg text-gray-400 mb-1 sm:mb-2 block"
                    >
                      {field.localizeInfos.title}
                    </Label>
                    <Input
                      id={field.marker}
                      type={
                        field.marker === "password"
                          ? showPassword
                            ? "text"
                            : "password"
                          : "text"
                      }
                      name={field.marker}
                      className="bg-gray-800 border-gray-700 text-white text-base sm:text-lg p-4 sm:p-6"
                      placeholder={field.localizeInfos.title}
                      value={
                        inputValues[field.marker as keyof typeof inputValues] ||
                        ""
                      }
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                    />
                  </motion.div>
                ))}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-500 text mt-2 text-center"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    className="w-full bg-[#00FFFF] hover:bg-[#00CCCC] text-black text-base sm:text-xl font-bold p-4 sm:p-6"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-5 w-5 sm:h-6 sm:w-6 animate-spin" />
                    ) : isSignUp ? (
                      "Sign Up"
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </form>
            )}

            <motion.div
              className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <div className="text-base sm:text-lg lg:text-xl text-gray-400">
                Or continue with
              </div>
              <div className="flex space-x-4">
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-900 border-gray-700 w-12 h-12 sm:w-auto sm:h-auto p-2"
                  disabled={isSubmitting}
                >
                  <Facebook className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="hidden sm:inline-block sm:ml-2">
                    Facebook
                  </span>
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="bg-gray-900 border-gray-700 w-12 h-12 sm:w-auto sm:h-auto  p-2"
                  disabled={isSubmitting}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="h-5 w-5 sm:h-6 sm:w-6"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  <span className="hidden sm:inline-block sm:ml-2">Google</span>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="mt-4 sm:mt-5 flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <p className="text-base sm:text-lg lg:text-xl text-white">
                {isSignUp ? "Already a member?" : "Don't have an account?"}
              </p>
              <Button
                variant="link"
                className="text-lg sm:text-xl lg:text-2xl text-white"
                onClick={toggleForm}
                disabled={isSubmitting}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <motion.div
          className="w-full hidden lg:w-2/5 bg-gradient-to-br from-[#00FFFF] to-black p-12 lg:flex flex-col justify-between items-center h-full"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-12 h-full flex flex-col items-center justify-center">
            <motion.div
              className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              {isSignUp ? (
                <>
                  <h3 className="text-3xl font-bold mb-4">New Arrivals</h3>
                  <p className="text-5xl font-bold mb-4">1,234</p>
                  <div className="flex justify-between items-center w-full ">
                    <div className="h-3 w-36 bg-black bg-opacity-50 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-[#00FFFF]"
                        initial={{ width: 0 }}
                        animate={{ width: "70%" }}
                        transition={{ delay: 0.6, duration: 0.8 }}
                      />
                    </div>
                    <span className="text-2xl font-bold  text-end">
                      70% increase
                    </span>
                  </div>
                </>
              ) : (
                <div className="p-3 py-0">
                  <h3 className="text-3xl font-bold mb-4 ">Customer Reviews</h3>
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="text-yellow-400 h-8 w-8 mr-1" />
                    ))}
                    <span className="ml-2 text-3xl font-bold">4.9</span>
                  </div>
                  <p className="text-xl text-gray-200">
                    Based on 10,000+ reviews
                  </p>
                </div>
              )}
            </motion.div>
            <motion.div
              className="bg-black bg-opacity-50 p-8 rounded-lg shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex items-center mb-4">
                {isSignUp ? (
                  <ShoppingBag className="text-[#00FFFF] h-8 w-8 mr-4" />
                ) : (
                  <Key className="text-[#00FFFF] h-8 w-8 mr-4" />
                )}
                <h3 className="text-2xl font-bold">
                  {isSignUp ? "Exclusive Deals" : "Secure Shopping"}
                </h3>
              </div>
              <p className="text-xl text-gray-200">
                {isSignUp
                  ? "Sign up now and get access to exclusive deals and promotions!"
                  : "Your data is protected with state-of-the-art encryption technology."}
              </p>
            </motion.div>
          </div>
          <div className="flex justify-end space-x-6">
            <Instagram className="text-white h-8 w-8" />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
