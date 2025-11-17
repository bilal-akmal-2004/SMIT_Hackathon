// client/src/pages/LandingPage.jsx
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";

function LandingPage() {
  const { theme } = useTheme();
  const navigate = useNavigate();

  const features = [
    {
      icon: "📄",
      title: "Upload Medical Reports",
      description: "Upload all your test reports & prescriptions securely",
    },
    {
      icon: "🤖",
      title: "AI-Powered Analysis",
      description: "Gemini AI reads and explains your reports in simple words",
    },
    {
      icon: "🌐",
      title: "Bilingual Summaries",
      description: "Get easy-to-understand summaries in English & Roman Urdu",
    },
    {
      icon: "📊",
      title: "Track Vitals",
      description: "Manually add BP, Sugar, Weight readings and track trends",
    },
    {
      icon: "📅",
      title: "Medical Timeline",
      description: "View your entire health history in one organized timeline",
    },
    {
      icon: "🔒",
      title: "Secure & Private",
      description: "Your health data is encrypted and completely private",
    },
  ];

  const stats = [
    { number: "AI", label: "Powered Analysis" },
    { number: "Bilingual", label: "Summaries" },
    { number: "Secure", label: "Storage" },
  ];

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 to-white text-gray-800"
          : "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
      }`}
    >
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">H</span>
            </div>
            <span
              className={`text-2xl font-bold ${
                theme === "light" ? "text-green-600" : "text-green-400"
              }`}
            >
              HealthMate
            </span>
          </div>

          <div className="flex space-x-4">
            <button
              onClick={() => navigate("/auth")}
              className={`px-6 py-2 rounded-lg font-medium transition-all duration-300 ${
                theme === "light"
                  ? "bg-green-500 text-white hover:bg-green-600"
                  : "bg-green-600 text-white hover:bg-green-500"
              }`}
            >
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="lg:w-1/2 mb-12 lg:mb-0">
            <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
              Your Personal{" "}
              <span
                className={`${
                  theme === "light" ? "text-green-600" : "text-green-400"
                }`}
              >
                Health Companion
              </span>
            </h1>
            <p
              className={`text-xl mb-8 ${
                theme === "light" ? "text-gray-600" : "text-gray-300"
              }`}
            >
              Store, analyze, and understand your medical reports with
              AI-powered insights in both English and Roman Urdu. Your health,
              made simple.
            </p>

            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => navigate("/auth")}
                className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 ${
                  theme === "light"
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-lg hover:shadow-xl"
                    : "bg-green-600 text-white hover:bg-green-500 shadow-lg hover:shadow-xl"
                }`}
              >
                Start Your Health Journey
              </button>
              <button
                onClick={() => navigate("/auth")}
                className={`px-8 py-4 rounded-xl font-semibold text-lg border-2 transition-all duration-300 ${
                  theme === "light"
                    ? "border-green-500 text-green-600 hover:bg-green-50"
                    : "border-green-400 text-green-400 hover:bg-green-900/20"
                }`}
              >
                Login to Account
              </button>
            </div>
          </div>

          <div className="lg:w-1/2 flex justify-center w-[100%]">
            <div
              className={`relative w-full max-w-md p-8 rounded-3xl ${
                theme === "light"
                  ? "bg-white shadow-2xl"
                  : "bg-gray-800 shadow-2xl"
              }`}
            >
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🩺</span>
                </div>
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
                  <div key={index} className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        theme === "light" ? "bg-green-400" : "bg-green-500"
                      }`}
                    ></div>
                    <span className="font-semibold">{stat.number}</span>
                    <span
                      className={
                        theme === "light" ? "text-gray-600" : "text-gray-300"
                      }
                    >
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        className={`py-16 ${theme === "light" ? "bg-white" : "bg-gray-800"}`}
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`p-6 rounded-2xl transition-all duration-300 hover:transform hover:scale-105 ${
                  theme === "light"
                    ? "bg-green-50 border border-green-100 hover:shadow-lg"
                    : "bg-gray-700 border border-gray-600 hover:shadow-lg"
                }`}
              >
                <div className="text-3xl mb-4">{feature.icon}</div>
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
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
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col space-y-8">
              {[
                {
                  step: "1",
                  title: "Upload Your Reports",
                  desc: "Upload PDFs or images of your medical reports, prescriptions, or lab results",
                },
                {
                  step: "2",
                  title: "AI Analysis",
                  desc: "Gemini AI reads and analyzes your reports, identifying key information and patterns",
                },
                {
                  step: "3",
                  title: "Bilingual Summary",
                  desc: "Get easy-to-understand explanations in both English and Roman Urdu",
                },
                {
                  step: "4",
                  title: "Track & Monitor",
                  desc: "View your health timeline and track vital signs over time",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-6">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                      theme === "light"
                        ? "bg-green-500 text-white"
                        : "bg-green-600 text-white"
                    }`}
                  >
                    <span className="font-bold">{item.step}</span>
                  </div>
                  <div>
                    <h3
                      className={`text-xl font-semibold mb-2 ${
                        theme === "light" ? "text-green-700" : "text-green-400"
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
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
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
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-4 bg-white text-green-600 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate("/auth")}
              className="px-8 py-4 border-2 border-white rounded-xl font-semibold text-lg hover:bg-white hover:text-green-600 transition-all duration-300"
            >
              Login Now
            </button>
          </div>

          {/* Disclaimer */}
          <p className="mt-12 text-sm opacity-75 max-w-2xl mx-auto">
            <strong>Important:</strong> HealthMate is designed to help you
            understand your medical reports better. It is not a substitute for
            professional medical advice. Always consult your doctor before
            making any health decisions.
          </p>
          <p className="mt-2 text-sm opacity-75">
            <strong>Roman Urdu:</strong> "Yeh AI sirf samajhne ke liye hai,
            ilaaj ke liye nahi."
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer
        className={`py-8 ${theme === "light" ? "bg-gray-100" : "bg-gray-900"}`}
      >
        <div className="container mx-auto px-6 text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
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
          </div>
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
      </footer>
    </div>
  );
}

export default LandingPage;
