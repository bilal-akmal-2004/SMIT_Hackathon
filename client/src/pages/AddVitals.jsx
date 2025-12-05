// client/src/pages/AddVitals.jsx

// Importing required hooks, libraries, and components
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";
import { motion } from "framer-motion";

const AddVitals = () => {
  // Form state for vital entry
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split("T")[0], // Default to today's date
    type: "BP", // Default vital type
    value: "",
    notes: "",
  });

  // Loading state for submit button
  const [loading, setLoading] = useState(false);

  // Navigation hook
  const navigate = useNavigate();

  // Get current theme from context
  const { theme } = useTheme();

  // Handle all form input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit form and send POST request to backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/api/vitals`,
        formData,
        { withCredentials: true } // Send cookies for authentication
      );
      navigate("/dashboard", { replace: true }); // Redirect after success
    } catch (err) {
      alert("Failed to save vital. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Labels shown above value input depending on selected vital type
  const typeLabels = {
    BP: "Blood Pressure (e.g., 120/80)",
    Sugar: "Blood Sugar (mg/dL)",
    Weight: "Weight (e.g., 70 kg)",
    Temperature: "Temperature (°F or °C)",
    Other: "Value",
  };

  // Framer Motion animation container settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Animate children one-by-one
      },
    },
  };

  // Animation settings for individual items
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} // Fade-in
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`min-h-screen w-[100%] transition-colors duration-300 ${
        theme === "light"
          ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
          : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
      }`}
    >
      {/* Full-width responsive layout container */}
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header Section */}
        <motion.div
          initial={{ y: -50, opacity: 0 }} // Slide down
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-3 mb-6 sm:mb-8"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ scale: 1.1, x: -2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate(-1)}
            className={`p-2.5 rounded-full transition-all duration-300 ${
              theme === "light"
                ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200 hover:shadow-md"
                : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 hover:shadow-md"
            }`}
            aria-label="Go back"
          >
            ←
          </motion.button>

          {/* Page Title */}
          <motion.div
            initial={{ x: -20, opacity: 0 }} // Slide in
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
              Add Manual Vital
            </h1>
            <p
              className={`text-sm opacity-80 mt-1 ${
                theme === "light" ? "text-gray-600" : "text-gray-400"
              }`}
            >
              Record your health readings anytime
            </p>
          </motion.div>
        </motion.div>

        {/* Form Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
            theme === "light"
              ? "bg-white border border-green-200 hover:border-green-300"
              : "bg-gray-800 border border-gray-700 hover:border-gray-600"
          }`}
        >
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Date Input */}
            <motion.div variants={itemVariants}>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                📅 Date
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }} // Slight zoom on focus
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base ${
                  theme === "light"
                    ? "border-green-300 bg-green-50 focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
                    : "border-gray-700 bg-gray-900 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
                }`}
                required
              />
            </motion.div>

            {/* Vital Type Dropdown */}
            <motion.div variants={itemVariants}>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                ❤️ Type of Vital
              </label>
              <motion.select
                whileFocus={{ scale: 1.02 }}
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base ${
                  theme === "light"
                    ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
                    : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
                }`}
              >
                {/* Dropdown Options */}
                <option value="BP">🫀 Blood Pressure</option>
                <option value="Sugar">🩸 Blood Sugar</option>
                <option value="Weight">⚖️ Weight</option>
                <option value="Temperature">🌡️ Temperature</option>
                <option value="Other">📝 Other</option>
              </motion.select>
            </motion.div>

            {/* Value Input */}
            <motion.div variants={itemVariants}>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                📊 {typeLabels[formData.type]} {/* Dynamic label */}
              </label>
              <motion.input
                whileFocus={{ scale: 1.02 }}
                name="value"
                value={formData.value}
                onChange={handleChange}
                placeholder="e.g., 120/80, 95, 70 kg"
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base ${
                  theme === "light"
                    ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
                    : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
                }`}
                required
              />
            </motion.div>

            {/* Notes Field */}
            <motion.div variants={itemVariants}>
              <label
                className={`block mb-2 font-medium text-sm sm:text-base ${
                  theme === "light" ? "text-gray-800" : "text-gray-200"
                }`}
              >
                📝 Notes (Optional)
              </label>
              <motion.textarea
                whileFocus={{ scale: 1.02 }}
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="How are you feeling? Any symptoms?"
                className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base resize-none ${
                  theme === "light"
                    ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
                    : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
                }`}
                rows="3"
              />
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-3 pt-2"
            >
              {/* Cancel Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={() => navigate(-1)}
                className={`py-3 rounded-xl font-medium transition-all duration-300 text-center ${
                  theme === "light"
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300 hover:shadow-md"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600 hover:shadow-md"
                } sm:flex-1`}
              >
                ↩️ Cancel
              </motion.button>

              {/* Save Button */}
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading} // Disable while loading
                className={`py-3 rounded-xl font-medium text-white transition-all duration-300 text-center shadow-md ${
                  loading
                    ? "opacity-70 cursor-not-allowed"
                    : theme === "light"
                    ? "bg-green-600 hover:bg-green-700 border border-green-600 hover:shadow-lg"
                    : "bg-green-600 hover:bg-green-500 border border-green-600 hover:shadow-lg"
                } sm:flex-1`}
              >
                {/* Show spinner when saving */}
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <motion.div
                      animate={{ rotate: 360 }} // Spinner animation
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                    />
                    Saving...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    💾 Save Vital
                  </span>
                )}
              </motion.button>
            </motion.div>
          </form>
        </motion.div>

        {/* Helpful Tips Section */}
        <motion.div
          initial={{ y: 50, opacity: 0 }} // Slide-up animation
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className={`mt-6 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
            theme === "light"
              ? "bg-green-50 border border-green-200 hover:border-green-300"
              : "bg-gray-800 border border-gray-700 hover:border-gray-600"
          }`}
        >
          <motion.h3
            whileHover={{ x: 5 }}
            className={`font-semibold mb-3 flex items-center gap-2 ${
              theme === "light" ? "text-green-700" : "text-green-400"
            }`}
          >
            💡 Quick Tips
          </motion.h3>

          {/* Tips list with animations */}
          <motion.ul
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className={`text-sm space-y-2 ${
              theme === "light" ? "text-gray-600" : "text-gray-300"
            }`}
          >
            {[
              "• Blood Pressure: Enter as systolic/diastolic (e.g., 120/80)",
              "• Blood Sugar: Enter in mg/dL (e.g., 95)",
              "• Weight: Include units (e.g., 70 kg or 154 lbs)",
              "• Temperature: Specify units (e.g., 98.6°F or 37°C)",
              "• Track regularly to monitor your health trends",
            ].map((tip, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                whileHover={{ x: 5 }}
                className="transition-all duration-200"
              >
                {tip}
              </motion.li>
            ))}
          </motion.ul>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Export component
export default AddVitals;

// // this code is for the safe mode if ever code is wroing
// // client/src/pages/AddVitals.jsx
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { useTheme } from "../context/ThemeContext";
// import { motion } from "framer-motion";

// const AddVitals = () => {
//   const [formData, setFormData] = useState({
//     date: new Date().toISOString().split("T")[0],
//     type: "BP",
//     value: "",
//     notes: "",
//   });
//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();
//   const { theme } = useTheme();

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios.post(
//         `${import.meta.env.VITE_API_BASE_URL}/api/vitals`,
//         formData,
//         { withCredentials: true }
//       );
//       navigate("/dashboard", { replace: true });
//     } catch (err) {
//       alert("Failed to save vital. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const typeLabels = {
//     BP: "Blood Pressure (e.g., 120/80)",
//     Sugar: "Blood Sugar (mg/dL)",
//     Weight: "Weight (e.g., 70 kg)",
//     Temperature: "Temperature (°F or °C)",
//     Other: "Value",
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1,
//       },
//     },
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1,
//       transition: {
//         duration: 0.5,
//       },
//     },
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       transition={{ duration: 0.5 }}
//       className={`min-h-screen w-[100%] transition-colors duration-300 ${
//         theme === "light"
//           ? "bg-gradient-to-br from-green-50 via-white to-emerald-50"
//           : "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
//       }`}
//     >
//       {/* Full-width container with responsive padding */}
//       <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//         {/* Header with Animation */}
//         <motion.div
//           initial={{ y: -50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.6 }}
//           className="flex items-center gap-3 mb-6 sm:mb-8"
//         >
//           <motion.button
//             whileHover={{ scale: 1.1, x: -2 }}
//             whileTap={{ scale: 0.9 }}
//             onClick={() => navigate(-1)}
//             className={`p-2.5 rounded-full transition-all duration-300 ${
//               theme === "light"
//                 ? "bg-white text-gray-700 hover:bg-green-100 shadow-sm border border-green-200 hover:shadow-md"
//                 : "bg-gray-800 text-gray-200 hover:bg-gray-700 border border-gray-700 hover:shadow-md"
//             }`}
//             aria-label="Go back"
//           >
//             ←
//           </motion.button>
//           <motion.div
//             initial={{ x: -20, opacity: 0 }}
//             animate={{ x: 0, opacity: 1 }}
//             transition={{ delay: 0.2, duration: 0.6 }}
//           >
//             <h1 className="text-xl sm:text-2xl font-bold text-green-700 dark:text-green-400">
//               Add Manual Vital
//             </h1>
//             <p
//               className={`text-sm opacity-80 mt-1 ${
//                 theme === "light" ? "text-gray-600" : "text-gray-400"
//               }`}
//             >
//               Record your health readings anytime
//             </p>
//           </motion.div>
//         </motion.div>

//         {/* Main Form Container */}
//         <motion.div
//           variants={containerVariants}
//           initial="hidden"
//           animate="visible"
//           className={`rounded-2xl p-4 sm:p-6 shadow-lg transition-all duration-300 hover:shadow-xl ${
//             theme === "light"
//               ? "bg-white border border-green-200 hover:border-green-300"
//               : "bg-gray-800 border border-gray-700 hover:border-gray-600"
//           }`}
//         >
//           <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
//             {/* Date Input */}
//             <motion.div variants={itemVariants}>
//               <label
//                 className={`block mb-2 font-medium text-sm sm:text-base ${
//                   theme === "light" ? "text-gray-800" : "text-gray-200"
//                 }`}
//               >
//                 📅 Date
//               </label>
//               <motion.input
//                 whileFocus={{ scale: 1.02 }}
//                 type="date"
//                 name="date"
//                 value={formData.date}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base ${
//                   theme === "light"
//                     ? "border-green-300 bg-green-50 focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
//                     : "border-gray-700 bg-gray-900 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
//                 }`}
//                 required
//               />
//             </motion.div>

//             {/* Type Select */}
//             <motion.div variants={itemVariants}>
//               <label
//                 className={`block mb-2 font-medium text-sm sm:text-base ${
//                   theme === "light" ? "text-gray-800" : "text-gray-200"
//                 }`}
//               >
//                 ❤️ Type of Vital
//               </label>
//               <motion.select
//                 whileFocus={{ scale: 1.02 }}
//                 name="type"
//                 value={formData.type}
//                 onChange={handleChange}
//                 className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base ${
//                   theme === "light"
//                     ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
//                     : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
//                 }`}
//               >
//                 <option value="BP">🫀 Blood Pressure</option>
//                 <option value="Sugar">🩸 Blood Sugar</option>
//                 <option value="Weight">⚖️ Weight</option>
//                 <option value="Temperature">🌡️ Temperature</option>
//                 <option value="Other">📝 Other</option>
//               </motion.select>
//             </motion.div>

//             {/* Value Input */}
//             <motion.div variants={itemVariants}>
//               <label
//                 className={`block mb-2 font-medium text-sm sm:text-base ${
//                   theme === "light" ? "text-gray-800" : "text-gray-200"
//                 }`}
//               >
//                 📊 {typeLabels[formData.type]}
//               </label>
//               <motion.input
//                 whileFocus={{ scale: 1.02 }}
//                 name="value"
//                 value={formData.value}
//                 onChange={handleChange}
//                 placeholder="e.g., 120/80, 95, 70 kg"
//                 className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base ${
//                   theme === "light"
//                     ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
//                     : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
//                 }`}
//                 required
//               />
//             </motion.div>

//             {/* Notes Textarea */}
//             <motion.div variants={itemVariants}>
//               <label
//                 className={`block mb-2 font-medium text-sm sm:text-base ${
//                   theme === "light" ? "text-gray-800" : "text-gray-200"
//                 }`}
//               >
//                 📝 Notes (Optional)
//               </label>
//               <motion.textarea
//                 whileFocus={{ scale: 1.02 }}
//                 name="notes"
//                 value={formData.notes}
//                 onChange={handleChange}
//                 placeholder="How are you feeling? Any symptoms?"
//                 className={`w-full p-3 rounded-xl border focus:outline-none focus:ring-2 transition-all duration-300 text-base resize-none ${
//                   theme === "light"
//                     ? "border-green-300 bg-white focus:ring-green-400 focus:border-green-400 text-gray-800 hover:border-green-400"
//                     : "border-gray-700 bg-gray-800 focus:ring-green-500 focus:border-green-500 text-gray-200 hover:border-gray-600"
//                 }`}
//                 rows="3"
//               />
//             </motion.div>

//             {/* Action Buttons */}
//             <motion.div
//               variants={itemVariants}
//               className="flex flex-col sm:flex-row gap-3 pt-2"
//             >
//               <motion.button
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="button"
//                 onClick={() => navigate(-1)}
//                 className={`py-3 rounded-xl font-medium transition-all duration-300 text-center ${
//                   theme === "light"
//                     ? "bg-gray-200 text-gray-800 hover:bg-gray-300 border border-gray-300 hover:shadow-md"
//                     : "bg-gray-700 text-gray-200 hover:bg-gray-600 border border-gray-600 hover:shadow-md"
//                 } sm:flex-1`}
//               >
//                 ↩️ Cancel
//               </motion.button>
//               <motion.button
//                 whileHover={{ scale: 1.05, y: -2 }}
//                 whileTap={{ scale: 0.95 }}
//                 type="submit"
//                 disabled={loading}
//                 className={`py-3 rounded-xl font-medium text-white transition-all duration-300 text-center shadow-md ${
//                   loading
//                     ? "opacity-70 cursor-not-allowed"
//                     : theme === "light"
//                     ? "bg-green-600 hover:bg-green-700 border border-green-600 hover:shadow-lg"
//                     : "bg-green-600 hover:bg-green-500 border border-green-600 hover:shadow-lg"
//                 } sm:flex-1`}
//               >
//                 {loading ? (
//                   <span className="flex items-center justify-center gap-2">
//                     <motion.div
//                       animate={{ rotate: 360 }}
//                       transition={{
//                         duration: 1,
//                         repeat: Infinity,
//                         ease: "linear",
//                       }}
//                       className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
//                     />
//                     Saving...
//                   </span>
//                 ) : (
//                   <span className="flex items-center justify-center gap-2">
//                     💾 Save Vital
//                   </span>
//                 )}
//               </motion.button>
//             </motion.div>
//           </form>
//         </motion.div>

//         {/* Quick Tips Section */}
//         <motion.div
//           initial={{ y: 50, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ delay: 0.4, duration: 0.6 }}
//           className={`mt-6 rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:shadow-lg ${
//             theme === "light"
//               ? "bg-green-50 border border-green-200 hover:border-green-300"
//               : "bg-gray-800 border border-gray-700 hover:border-gray-600"
//           }`}
//         >
//           <motion.h3
//             whileHover={{ x: 5 }}
//             className={`font-semibold mb-3 flex items-center gap-2 ${
//               theme === "light" ? "text-green-700" : "text-green-400"
//             }`}
//           >
//             💡 Quick Tips
//           </motion.h3>
//           <motion.ul
//             variants={containerVariants}
//             initial="hidden"
//             animate="visible"
//             className={`text-sm space-y-2 ${
//               theme === "light" ? "text-gray-600" : "text-gray-300"
//             }`}
//           >
//             {[
//               "• Blood Pressure: Enter as systolic/diastolic (e.g., 120/80)",
//               "• Blood Sugar: Enter in mg/dL (e.g., 95)",
//               "• Weight: Include units (e.g., 70 kg or 154 lbs)",
//               "• Temperature: Specify units (e.g., 98.6°F or 37°C)",
//               "• Track regularly to monitor your health trends",
//             ].map((tip, index) => (
//               <motion.li
//                 key={index}
//                 variants={itemVariants}
//                 whileHover={{ x: 5 }}
//                 className="transition-all duration-200"
//               >
//                 {tip}
//               </motion.li>
//             ))}
//           </motion.ul>
//         </motion.div>
//       </div>
//     </motion.div>
//   );
// };

// export default AddVitals;
