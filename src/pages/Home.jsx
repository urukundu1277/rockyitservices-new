import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import Hero from "../components/Hero";

const previewServices = [
  {
    title: "AWS Cloud Services",
    icon: "☁️",
    desc: "Cloud architecture, deployment and management on AWS.",
  },
  {
    title: "Website Design",
    icon: "🎨",
    desc: "Responsive, modern website design for businesses.",
  },
  {
    title: "Website Hosting",
    icon: "🌐",
    desc: "Fast and secure website hosting and maintenance.",
  },
  {
    title: "Laptop Repair",
    icon: "💻",
    desc: "Fast laptop hardware and software fixes.",
  },
  {
    title: "Desktop Repair",
    icon: "🖥️",
    desc: "Desktop hardware & software troubleshooting.",
  },
  {
    title: "Printer Repair",
    icon: "🖨️",
    desc: "Printer diagnostics and cartridge support.",
  },
  {
    title: "Networking Solutions",
    icon: "🌐",
    desc: "LAN/WAN setup and cabling.",
  },
  {
    title: "WiFi Setup",
    icon: "📶",
    desc: "Wireless planning and secure setups.",
  },
  {
    title: "Software Installation",
    icon: "💾",
    desc: "App installs and configuration.",
  },
  {
    title: "Windows Installation",
    icon: "🪟",
    desc: "Windows OS install and recovery.",
  },
  {
    title: "Computer AMC Services",
    icon: "🛠️",
    desc: "Annual maintenance contracts for systems.",
  },
  {
    title: "Server Maintenance",
    icon: "🗄️",
    desc: "Server upkeep, monitoring and support.",
  },
  {
    title: "Custom PC Build",
    icon: "🧩",
    desc: "Custom workstation and gaming PC builds.",
  },
  {
    title: "VPN Setup",
    icon: "🌐",
    desc: "Secure VPN installation and network configuration.",
  },
  {
    title: "Remote IT Support",
    icon: "📞",
    desc: "Quick remote IT assistance.",
  },
];

export default function Home() {
  const [showBooking, setShowBooking] = useState(false);

  const [bookingForm, setBookingForm] = useState({
    name: "",
    phone: "",
    whatsappLocal: "",
    email: "",
    requirement: "",
    serviceType: "",
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const openBooking = (service) => {
    setBookingForm({
      name: "",
      phone: "",
      whatsappLocal: "",
      email: "",
      requirement: "",
      serviceType: service.title,
    });

    setShowBooking(true);
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get("service");

      if (svc) {
        openBooking({ title: svc });

        params.delete("service");

        const newUrl = `${window.location.pathname}${
          params.toString() ? "?" + params.toString() : ""
        }`;

        window.history.replaceState({}, "", newUrl);
      }
    } catch (err) {}
  }, []);

  const handleBookingChange = (e) =>
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value,
    });

  const submitBooking = async (e) => {
    e.preventDefault();

    try {
      const local = bookingForm.whatsappLocal?.replace(/[^0-9]/g, "");

      if (!/^[6-9][0-9]{9}$/.test(local)) {
        setErrorMessage("Please enter a valid 10-digit mobile number");
        setShowError(true);
        return;
      }

      const email = bookingForm.email?.trim();

      if (!email) {
        setErrorMessage("Please enter an email address");
        setShowError(true);
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(email)) {
        setErrorMessage("Please enter a valid email address");
        setShowError(true);
        return;
      }

      const payload = {
        name: bookingForm.name,
        phone: bookingForm.phone || bookingForm.whatsappLocal,
        whatsappNumber: `91${local}`,
        requirement:
          bookingForm.requirement ||
          `Request for ${bookingForm.serviceType}`,
        email: email,
        serviceType: bookingForm.serviceType,
      };

      await axios.post(
        "https://rockyitservices-new.onrender.com/api/customers/register",
        payload
      );

      setShowBooking(false);

      setSuccessMessage("Booking Submitted Successfully!");
      setShowSuccess(true);

      setBookingForm({
        name: "",
        phone: "",
        whatsappLocal: "",
        email: "",
        requirement: "",
        serviceType: "",
      });
    } catch (err) {
      console.error("Booking error:", err);

      const msg =
        err?.response?.data?.message ||
        err.message ||
        "Failed to submit booking";

      setErrorMessage(`Booking failed: ${msg}`);
      setShowError(true);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage("");
      }, 4000);

      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showError) {
      const t = setTimeout(() => {
        setShowError(false);
        setErrorMessage("");
      }, 5000);

      return () => clearTimeout(t);
    }
  }, [showError]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      <Hero openBooking={openBooking} />

      {/* SERVICES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <h2 className="text-3xl font-bold text-gray-800">
          Our Services
        </h2>

        <p className="text-gray-600 mt-2">
          A quick preview of services we provide.
        </p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewServices.map((s, index) => (
            <ServiceCard
              key={s.title}
              index={index}
              icon={s.icon}
              title={s.title}
              description={s.desc}
              onBook={() => openBooking(s)}
            />
          ))}
        </div>
      </section>

      {/* WHY CHOOSE */}
      <section className="w-full py-16 sm:py-24 md:py-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center mb-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Why Choose Rocky IT Services?</h2>
          <p className="text-gray-600 text-base sm:text-lg max-w-2xl mx-auto">We're dedicated to making technology simple and accessible for everyone.</p>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-blue-50 to-blue-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 border border-blue-200">
              <div className="text-xl font-semibold text-blue-800">Fast Response</div>
              <p className="mt-3 text-sm text-gray-600">Our team is ready to assist with technical issues and support requests to minimize downtime and keep your business running.</p>
            </div>

            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 border border-emerald-200">
              <div className="text-xl font-semibold text-emerald-800">Trusted IT Solutions</div>
              <p className="mt-3 text-sm text-gray-600">We provide reliable IT services to help businesses stay connected, secure, and productive. Our team is committed to delivering quality solutions that meet your needs.</p>
            </div>

            <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-br from-yellow-50 to-yellow-100 p-8 sm:p-10 hover:shadow-2xl transition-all duration-300 border border-yellow-200">
              <div className="text-xl font-semibold text-yellow-800">Remote Support</div>
              <p className="mt-3 text-sm text-gray-600">Get fast and secure remote assistance from our IT experts. We quickly diagnose and resolve technical issues without the need for an on-site visit, helping you minimize downtime and keep your business running smoothly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* BOOKING MODAL */}
      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowBooking(false)}
          />

          <div className="relative w-full max-w-md bg-white rounded-xl p-5 sm:p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Book Service: {bookingForm.serviceType}
              </h3>

              <button
                onClick={() => setShowBooking(false)}
                className="text-gray-500"
              >
                Close
              </button>
            </div>

            <form
              onSubmit={submitBooking}
              className="mt-4 space-y-3"
            >
              <input
                name="name"
                value={bookingForm.name}
                onChange={handleBookingChange}
                placeholder="Full Name"
                required
                className="border border-gray-200 p-3 rounded-lg w-full"
              />

              <div className="flex">
                <div className="inline-flex items-center px-3 rounded-l-lg bg-gray-100 border border-r-0 border-gray-200">
                  +91
                </div>

                <input
                  name="whatsappLocal"
                  value={bookingForm.whatsappLocal}
                  onChange={handleBookingChange}
                  placeholder="WhatsApp Number"
                  required
                  className="border border-gray-200 p-3 rounded-r-lg w-full"
                />
              </div>

              <input
                name="email"
                value={bookingForm.email}
                onChange={handleBookingChange}
                placeholder="Email Address"
                required
                className="border border-gray-200 p-3 rounded-lg w-full"
              />

              <textarea
                name="requirement"
                value={bookingForm.requirement}
                onChange={handleBookingChange}
                placeholder="Problem Description"
                className="border border-gray-200 p-3 rounded-lg w-full h-24"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowBooking(false)}
                  className="px-4 py-2 rounded-lg border"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg"
                >
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {showSuccess && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-lg shadow-lg">
          {successMessage}
        </div>
      )}

      {/* ERROR MESSAGE */}
      {showError && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-lg shadow-lg">
          {errorMessage}
        </div>
      )}

      <Footer />
    </div>
  );
}