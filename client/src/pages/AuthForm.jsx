import React, { useState } from "react";
import Joi from "joi";
import { useTheme } from "../context/ThemeContext"; // adjust path as needed
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";

function AuthForm() {
  const navigate = useNavigate();

  // this state is for when the use want to log in or he want to sign up
  const [formState, setFormState] = useState("Sign up");

  const { theme } = useTheme(); // inside the AuthForm component

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "", // using it in Sign Up
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { error } = schema.validate(formData, { abortEarly: false });

    if (error) {
      const formattedErrors = {};
      error.details.forEach((detail) => {
        formattedErrors[detail.path[0]] = detail.message;
      });
      setErrors(formattedErrors);
    } else {
      setErrors({});
      console.log("Form data is valid ✅", formData);
      try {
        const url = formState === "Sign up" ? "/register" : "/login";
        const res = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth${url}`,
          formData,
          { withCredentials: true } // allows cookies
        );
        console.log("Resospoin in handle sub,it: ", res);
        toast.success(res.data.msg);
        console.log("Logged in:", res.data.user);
        // (Optional) Save user if returned
        localStorage.setItem("user", JSON.stringify("some user"));

        // ✅ Redirect
        navigate("/home");
      } catch (err) {
        toast.error(err.response?.data?.msg || "Something went wrong");
      }
    }
  };
  // here is the scheme for the joi
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.empty": "This field is required.",
        "string.email": "Please enter a valid email address.",
      }),

    password: Joi.string().min(6).required().messages({
      "string.empty": "This field is required.",
      "string.min": "Password must be at least 6 characters long.",
    }),

    name:
      formState === "Sign up"
        ? Joi.string().min(3).required().messages({
            "string.empty": "Name is required.",
            "string.min": "Name must be at least 3 characters long.",
          })
        : Joi.optional(),
  });

  return (
    <div
      className={`border ${
        theme === "light"
          ? "border-gray-300 bg-white text-black"
          : "border-gray-700 bg-gray-900 text-white"
      } lg:w-1/2 xl:w-5/12 p-6 sm:p-12 rounded-2xl`}
    >
      <div className="mt-12 flex flex-col items-center">
        <h1 className="text-2xl xl:text-3xl font-extrabold">
          {formState === "Sign up" ? "Sign Up" : "Log in"}
        </h1>
        <div className="w-full flex-1 mt-8">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col items-center">
              <button
                type="button"
                className={`w-full max-w-xs font-bold cursor-pointer shadow-sm rounded-lg py-3 flex items-center justify-center transition-all duration-300 ease-in-out focus:outline-none hover:shadow focus:shadow-sm focus:shadow-outline ${
                  theme === "light"
                    ? "bg-indigo-100 text-gray-800"
                    : "bg-indigo-900 text-white"
                }`}
              >
                <div className="bg-white p-2 rounded-full ">
                  <svg className="w-4" viewBox="0 0 533.5 544.3">
                    <path
                      d="M533.5 278.4c0-18.5-1.5-37.1-4.7-55.3H272.1v104.8h147c-6.1 33.8-25.7 63.7-54.4 82.7v68h87.7c51.5-47.4 81.1-117.4 81.1-200.2z"
                      fill="#4285f4"
                    />
                    <path
                      d="M272.1 544.3c73.4 0 135.3-24.1 180.4-65.7l-87.7-68c-24.4 16.6-55.9 26-92.6 26-71 0-131.2-47.9-152.8-112.3H28.9v70.1c46.2 91.9 140.3 149.9 243.2 149.9z"
                      fill="#34a853"
                    />
                    <path
                      d="M119.3 324.3c-11.4-33.8-11.4-70.4 0-104.2V150H28.9c-38.6 76.9-38.6 167.5 0 244.4l90.4-70.1z"
                      fill="#fbbc04"
                    />
                    <path
                      d="M272.1 107.7c38.8-.6 76.3 14 104.4 40.8l77.7-77.7C405 24.6 339.7-.8 272.1 0 169.2 0 75.1 58 28.9 150l90.4 70.1c21.5-64.5 81.8-112.4 152.8-112.4z"
                      fill="#ea4335"
                    />
                  </svg>
                </div>
                <span className="ml-4 ">
                  {formState === "Sign up"
                    ? "Sign Up with Google"
                    : "Log in with Google"}
                </span>
              </button>
            </div>
            <div className="my-12 border-b text-center">
              <div
                className={`leading-none px-2 inline-block text-sm tracking-wide font-medium transform translate-y-1/2 ${
                  theme === "light"
                    ? "text-gray-600 bg-white"
                    : "text-gray-300 bg-gray-800"
                }`}
              >
                {formState === "Sign up"
                  ? "Or sign up with e-mail"
                  : "Or log in with e-mail"}
              </div>
            </div>
            <div className="mx-auto max-w-xs">
              {formState === "Sign up" ? (
                // this code here is for the sign up part
                <>
                  {" "}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium text-sm focus:outline-none mt-5 ${
                      theme === "light"
                        ? "bg-gray-100 border border-gray-200 placeholder-gray-500 text-black focus:border-gray-400 focus:bg-white"
                        : "bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:border-gray-400 focus:bg-gray-700"
                    }`}
                    type="text"
                    placeholder="User Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm flex justify-center">
                      {errors.name}
                    </p>
                  )}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium text-sm focus:outline-none mt-5 ${
                      theme === "light"
                        ? "bg-gray-100 border border-gray-200 placeholder-gray-500 text-black focus:border-gray-400 focus:bg-white"
                        : "bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:border-gray-400 focus:bg-gray-700"
                    }`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex justify-center">
                      {errors.email}
                    </p>
                  )}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium text-sm focus:outline-none mt-5 ${
                      theme === "light"
                        ? "bg-gray-100 border border-gray-200 placeholder-gray-500 text-black focus:border-gray-400 focus:bg-white"
                        : "bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:border-gray-400 focus:bg-gray-700"
                    }`}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm flex justify-center">
                      {errors.password}
                    </p>
                  )}
                  <button
                    className={`mt-5 tracking-wide font-semibold w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                      theme === "light"
                        ? "bg-indigo-500 text-gray-100 hover:bg-indigo-700"
                        : "bg-indigo-900 text-white hover:bg-indigo-600"
                    }`}
                  >
                    <svg
                      className="w-6 h-6 -ml-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                      <circle cx="8.5" cy={7} r={4} />
                      <path d="M20 8v6M23 11h-6" />
                    </svg>
                    <span className="ml-3">Sign Up</span>
                  </button>
                  <p className="flex justify-center mt-4">
                    Already have an account ?{" "}
                    <button
                      onClick={() => {
                        setFormState("Log in");
                        setFormData({ ...formData, name: "" });
                      }}
                      className="text-blue-400 cursor-pointer"
                    >
                      Click here
                    </button>
                  </p>{" "}
                </>
              ) : (
                <>
                  {/* this code here for the log in part  */}{" "}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium text-sm focus:outline-none mt-5 ${
                      theme === "light"
                        ? "bg-gray-100 border border-gray-200 placeholder-gray-500 text-black focus:border-gray-400 focus:bg-white"
                        : "bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:border-gray-400 focus:bg-gray-700"
                    }`}
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm flex justify-center">
                      {errors.email}
                    </p>
                  )}
                  <input
                    className={`w-full px-8 py-4 rounded-lg font-medium text-sm focus:outline-none mt-5 ${
                      theme === "light"
                        ? "bg-gray-100 border border-gray-200 placeholder-gray-500 text-black focus:border-gray-400 focus:bg-white"
                        : "bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:border-gray-400 focus:bg-gray-700"
                    }`}
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm flex justify-center">
                      {errors.password}
                    </p>
                  )}
                  <button
                    className={`mt-5 tracking-wide font-semibold w-full py-4 rounded-lg transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none ${
                      theme === "light"
                        ? "bg-indigo-500 text-gray-100 hover:bg-indigo-700"
                        : "bg-indigo-900 text-white hover:bg-indigo-600"
                    }`}
                  >
                    <span className="ml-3">Log in</span>
                  </button>
                  <p className="flex justify-center mt-4">
                    Dont have an account ?{" "}
                    <button
                      onClick={() => setFormState("Sign up")}
                      className="text-blue-400 cursor-pointer"
                    >
                      Click here
                    </button>
                  </p>{" "}
                </>
              )}

              <p
                className={`mt-6 text-xs text-center ${
                  theme === "light" ? "text-gray-600" : "text-gray-400"
                }`}
              >
                I agree to abide by templatana's
                <a href="#" className="border-b border-gray-500 border-dotted">
                  Terms of Service
                </a>
                and its
                <a href="#" className="border-b border-gray-500 border-dotted">
                  Privacy Policy
                </a>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AuthForm;
