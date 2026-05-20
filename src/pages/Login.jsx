import { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({

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

      const res = await axios.post(

        "https://rockyitservices-new.onrender.com/api/auth/login",

        formData

      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      );

      alert("Login Successful");

      navigate("/dashboard");

    } catch (error) {

      console.log(error);

      alert(
        error.response?.data?.message
        || "Login failed"
      );

    } finally {

      setLoading(false);

    }

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="flex justify-center items-center py-20">

        <div className="bg-white shadow-2xl rounded-3xl p-10 w-full max-w-lg">

          <h1 className="text-4xl font-bold text-center text-gray-800">

            Customer Login

          </h1>

          <p className="text-center text-gray-500 mt-3">

            Login to access support

          </p>

          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >

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
              className="bg-black hover:bg-gray-800 text-white w-full py-4 rounded-xl text-lg font-bold"
            >

              {
                loading
                  ? "Logging in..."
                  : "Login"
              }

            </button>

          </form>

        </div>

      </div>

    </div>

  );

}