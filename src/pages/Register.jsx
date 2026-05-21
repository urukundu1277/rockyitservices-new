import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({

      name: "",
      email: "",
      password: ""

    });

  const [loading, setLoading] =
    useState(false);

  const handleChange = (e) => {

    setFormData({

      ...formData,

      [e.target.name]:
        e.target.value

    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      setLoading(true);

      await axios.post(

        "https://rockyitservices-new.onrender.com/api/auth/register",

        formData

      );

      alert(
        "Registration Successful"
      );

      navigate("/login");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message
        || "Registration failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex justify-center items-center px-4 py-10 sm:py-20">

        <div className="bg-white shadow-2xl rounded-2xl sm:rounded-3xl p-6 sm:p-10 w-full max-w-lg">

          <h1 className="text-4xl font-bold text-center text-gray-800">

            Customer Registration

          </h1>

          <p className="text-center text-gray-500 mt-3">

            Create your support account

          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border p-4 rounded-xl"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-green-500 hover:bg-green-600 text-white w-full py-4 rounded-xl text-lg font-bold"
            >

              {
                loading
                  ? "Registering..."
                  : "Create Account"
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}