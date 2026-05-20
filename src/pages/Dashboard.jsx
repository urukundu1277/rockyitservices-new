import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import { useNavigate } from "react-router-dom";

export default function Dashboard() {

  const navigate = useNavigate();

  const user =
    JSON.parse(
      localStorage.getItem("user")
    );

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");

  };

  return (

    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">

        {/* TOP */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-5xl font-bold text-gray-800">

              Customer Dashboard

            </h1>

            <p className="mt-4 text-lg text-gray-600">

              Welcome back,
              {user?.name}

            </p>

          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-xl font-bold"
          >
            Logout
          </button>

        </div>

        {/* CARDS */}

        <div className="grid md:grid-cols-3 gap-6 mt-14">

          <div className="bg-white p-8 rounded-3xl shadow-xl">

            <h2 className="text-gray-500 text-lg">

              Total Tickets

            </h2>

            <h1 className="text-5xl font-bold mt-4">

              0

            </h1>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl">

            <h2 className="text-gray-500 text-lg">

              Active Support

            </h2>

            <h1 className="text-5xl font-bold mt-4 text-blue-500">

              0

            </h1>

          </div>

          <div className="bg-white p-8 rounded-3xl shadow-xl">

            <h2 className="text-gray-500 text-lg">

              Completed

            </h2>

            <h1 className="text-5xl font-bold mt-4 text-green-500">

              0

            </h1>

          </div>

        </div>

        {/* SUPPORT FORM */}

        <div className="bg-white rounded-3xl shadow-xl mt-14 p-10">

          <h2 className="text-4xl font-bold text-gray-800">

            Raise Support Ticket

          </h2>

          <p className="mt-3 text-gray-500">

            Describe your issue and our IT team will contact you.

          </p>

          <form className="mt-10 space-y-5">

            <input
              type="text"
              placeholder="Issue Title"
              className="w-full border p-4 rounded-xl"
            />

            <textarea
              placeholder="Describe your issue"
              className="w-full border p-4 rounded-xl h-40"
            />

            <button
              type="submit"
              className="bg-black hover:bg-gray-800 text-white px-8 py-4 rounded-xl text-lg font-bold"
            >
              Submit Ticket
            </button>

          </form>

        </div>

      </section>
        <Footer />

    </div>

  );

}