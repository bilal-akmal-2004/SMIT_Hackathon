// client/src/pages/LandingPage.jsx
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

function LandingPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: "📄",
      title: "Upload Medical Reports",
      description: "Upload all your test reports & prescriptions securely",
      delay: 0.1,
    },
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Gemini AI reads and explains your reports in simple words",
      delay: 0.2,
    },
    {
      icon: "🌐",
      title: "Bilingual Summaries",
      description: "Get easy-to-understand summaries in English & Roman Urdu",
      delay: 0.3,
    },
    {
      icon: "📊",
      title: "Track Vitals",
      description: "Manually add BP, Sugar, Weight readings and track trends",
      delay: 0.4,
    },
    {
      icon: "📅",
      title: "Medical Timeline",
      description: "View your entire health history in one organized timeline",
      delay: 0.5,
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your health data is encrypted and completely private",
      delay: 0.6,
    },
  ];

  const stats = [
    { number: "AI", label: "Powered Analysis", icon: "🧠" },
    { number: "Bilingual", label: "Summaries", icon: "🌍" },
    { number: "Secure", label: "Storage", icon: "🛡️" },
  ];

  const howItWorks = [
    {
      step: "1",
      title: "Upload Your Reports",
      desc: "Upload PDFs or images of your medical reports, prescriptions, or lab results",
      icon: "📤",
    },
    {
      step: "2",
      title: "AI Analysis",
      desc: "Gemini AI reads and analyzes your reports, identifying key information and patterns",
      icon: "🔍",
    },
    {
      step: "3",
      title: "Bilingual Summary",
      desc: "Get easy-to-understand explanations in both English and Roman Urdu",
      icon: "💬",
    },
    {
      step: "4",
      title: "Track & Monitor",
      desc: "View your health timeline and track vital signs over time",
      icon: "📈",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
      },
    },
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 overflow-hidden ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50 text-gray-800"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white"
      }`}
    >
      {/* Navigation */}
      <motion.nav
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-4"
      >
        <div className="flex justify-between items-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center space-x-2 cursor-pointer"
          >
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span
              className={`text-2xl font-bold ${
                theme === "light" ? "text-green-600" : "text-green-400"
              }`}
            >
              HealthMate
            </span>
          </motion.div>

          <motion.div whileHover={{ scale: 1.05 }} className="flex space-x-4">
            <button
              onClick={() => navigate("/auth")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl ${
                theme === "light"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:w-1/2 mb-12 lg:mb-0"
          >
            <motion.h1
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-5xl lg:text-6xl font-bold leading-tight mb-6"
            >
              Your Personal{" "}
              <motion.span
                className={`${
                  theme === "light" ? "text-green-600" : "text-green-400"
                }`}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                Health Companion
              </motion.span>
            </motion.h1>
            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className={`text-xl mb-8 ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Store, analyze, and understand your medical reports with
              AI-powered insights in both English and Roman Urdu. Your health,
              made simple.
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
            >
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 shadow-lg ${
                  theme === "light"
                    ? "bg-green-500 text-white hover:bg-green-600 hover:shadow-xl"
                    : "bg-green-600 text-white hover:bg-green-500 hover:shadow-xl"
                }`}
              >
                Start Your Health Journey
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate("/auth")}
                className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 ${
                  theme === "light"
                    ? "border-green-500 text-green-600 hover:bg-green-50 hover:shadow-lg"
                    : "border-green-400 text-green-400 hover:bg-green-900/20 hover:shadow-lg"
                }`}
              >
                Login to Account
              </motion.button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="lg:w-1/2 flex justify-center w-[100%]"
          >
            <motion.div
              whileHover={{ y: -5, scale: 1.02 }}
              className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl ${
                theme === "light" ? "bg-white" : "bg-gray-800"
              }`}
            >
              <div className="text-center mb-6">
                <motion.div
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.8 }}
                  className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-200 dark:from-green-900 dark:to-emerald-800 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <span className="text-3xl">🩺</span>
                </motion.div>
                <h3 className="text-2xl font-bold mb-2">HealthMate</h3>
                <p
                  className={
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }
                >
                  Sehat ka Smart Dost
                </p>
              </div>

              <div className="space-y-4">
                {stats.map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ x: 10, scale: 1.02 }}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-3 p-3 rounded-lg transition-all duration-300 hover:bg-green-50 dark:hover:bg-gray-700"
                  >
                    <div className="text-lg">{stat.icon}</div>
                    <div>
                      <span className="font-bold text-green-600 dark:text-green-400">
                        {stat.number}
                      </span>
                      <span className="ml-2 text-gray-600 dark:text-gray-300">
                        {stat.label}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-16 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
      >
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              Everything You Need for Your{" "}
              <span
                className={
                  theme === "light" ? "text-green-600" : "text-green-400"
                }
              >
                Health Management
              </span>
            </h2>
            <p
              className={`text-xl max-w-2xl mx-auto ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              From uploading reports to understanding them in simple language -
              HealthMate makes healthcare management effortless
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.05,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className={`p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                  theme === "light"
                    ? "bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 hover:shadow-2xl"
                    : "bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:shadow-2xl"
                }`}
              >
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="text-3xl mb-4"
                >
                  {feature.icon}
                </motion.div>
                <h3
                  className={`text-xl font-semibold mb-3 ${
                    theme === "light" ? "text-green-700" : "text-green-400"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={
                    theme === "light" ? "text-gray-600" : "text-gray-300"
                  }
                >
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4">
              How{" "}
              <span
                className={
                  theme === "light" ? "text-green-600" : "text-green-400"
                }
              >
                HealthMate
              </span>{" "}
              Works
            </h2>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ x: -50, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  whileHover={{ x: 10 }}
                  className={`flex items-start space-x-6 p-6 rounded-2xl transition-all duration-300 cursor-pointer ${
                    theme === "light"
                      ? "hover:bg-green-50"
                      : "hover:bg-gray-700"
                  }`}
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-lg ${
                      theme === "light"
                        ? "bg-green-500 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    <span className="font-bold">{item.step}</span>
                  </motion.div>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">{item.icon}</div>
                    <div>
                      <h3
                        className={`text-xl font-semibold mb-2 ${
                          theme === "light"
                            ? "text-green-700"
                            : "text-green-400"
                        }`}
                      >
                        {item.title}
                      </h3>
                      <p
                        className={
                          theme === "light" ? "text-gray-600" : "text-gray-300"
                        }
                      >
                        {item.desc}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <motion.section
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className={`py-16 ${
          theme === "light" ? "bg-green-600" : "bg-green-700"
        } text-white`}
      >
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who are managing their health smarter with
            HealthMate
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Free Account
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/auth")}
              className="px-8 py-4 border-2 border-white rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Login Now
            </motion.button>
          </div>

          {/* Disclaimer */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            viewport={{ once: true }}
            className="mt-12"
          >
            <p className="text-sm opacity-75 max-w-2xl mx-auto">
              <strong>Important:</strong> HealthMate is designed to help you
              understand your medical reports better. It is not a substitute for
              professional medical advice. Always consult your doctor before
              making any health decisions.
            </p>
            <p className="mt-2 text-sm opacity-75">
              <strong>Roman Urdu:</strong> "Yeh AI sirf samajhne ke liye hai,
              ilaaj ke liye nahi."
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className={`py-8 ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}
      >
        <div className="container mx-auto px-6 text-center">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center justify-center space-x-2 mb-4"
          >
            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span
              className={`text-xl font-bold ${
                theme === "light" ? "text-green-600" : "text-green-400"
              }`}
            >
              HealthMate
            </span>
          </motion.div>
          <p className={theme === "light" ? "text-gray-600" : "text-gray-400"}>
            Your personal health companion • Sehat ka Smart Dost
          </p>
          <p
            className={`mt-2 text-sm ${
              theme === "light" ? "text-gray-500" : "text-gray-500"
            }`}
          >
            © 2024 HealthMate. All rights reserved.
          </p>
        </div>
      </motion.footer>
    </div>
  );
}

export default LandingPage;
