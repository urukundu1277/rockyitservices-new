import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ServiceCard from "../components/ServiceCard";
import Hero from "../components/Hero";

const previewServices = [
  { title: "AWS Cloud Services", icon: "☁️", desc: "Cloud architecture, deployment and management on AWS." },
  { title: "Website Design", icon: "🎨", desc: "Responsive, modern website design for businesses." },
  { title: "Website Hosting", icon: "🌐", desc: "Fast and secure website hosting and maintenance." },
  { title: "Laptop Repair", icon: "💻", desc: "Fast laptop hardware and software fixes." },
  { title: "Desktop Repair", icon: "🖥️", desc: "Desktop hardware & software troubleshooting." },
  { title: "Printer Repair", icon: "🖨️", desc: "Printer diagnostics and cartridge support." },
  { title: "CCTV Installation", icon: "📹", desc: "Secure CCTV installation and setup." },
  { title: "Networking Solutions", icon: "🌐", desc: "LAN/WAN setup and cabling." },
  { title: "WiFi Setup", icon: "📶", desc: "Wireless planning and secure setups." },
  { title: "Software Installation", icon: "💾", desc: "App installs and configuration." },
  { title: "Windows Installation", icon: "🪟", desc: "Windows OS install and recovery." },
  { title: "Data Recovery", icon: "🔁", desc: "Recover lost files and data." },
  { title: "Computer AMC Services", icon: "🛠️", desc: "Annual maintenance contracts for systems." },
  { title: "Chip Level Repair", icon: "🔧", desc: "Advanced motherboard and chip-level fixes." },
  { title: "Server Maintenance", icon: "🗄️", desc: "Server upkeep, monitoring and support." },
  { title: "Custom PC Build", icon: "🧩", desc: "Custom workstation and gaming PC builds." },
  { title: "Antivirus Installation", icon: "🛡️", desc: "Antivirus setup and security hardening." },
  { title: "Remote IT Support", icon: "📞", desc: "Quick remote IT assistance." },
];

export default function Home() {
  const [formData, setFormData] = useState({ name: "", phone: "", whatsappLocal: "", email: "", requirement: "" });
  const [showBooking, setShowBooking] = useState(false);
  const [bookingForm, setBookingForm] = useState({ name: '', phone: '', whatsappLocal: '', email: '', requirement: '', serviceType: '' });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      // validate local 10-digit mobile number (customer doesn't need to fill country code)
      const local = formData.whatsappLocal?.replace(/[^0-9]/g, '');
      if (!/^[6-9][0-9]{9}$/.test(local)) {
        setErrorMessage('Please enter a valid 10-digit Indian mobile number (starting with 6-9)');
        setShowError(true);
        setLoading(false);
        return;
      }

      const payload = { ...formData, whatsappNumber: `91${local}` };
      delete payload.whatsappLocal;
      await axios.post("https://rockyitservices-new.onrender.com/api/customers/register", payload);
      setSuccessMessage('Request Submitted Successfully');
      setShowSuccess(true);
      setFormData({ name: "", phone: "", whatsappLocal: "", email: "", requirement: "" });
    } catch (error) {
      console.log(error);
      const msg = error?.response?.data?.message || error.message || 'Something went wrong';
      setErrorMessage(msg);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const svc = params.get('service');
      if (svc) {
        openBooking({ title: svc });
        // remove param from URL
        params.delete('service');
        const newUrl = `${window.location.pathname}${params.toString() ? '?' + params.toString() : ''}`;
        window.history.replaceState({}, '', newUrl);
      }
    } catch (err) {
      // ignore
    }
  }, []);

  const openBooking = (service) => {
    setBookingForm({ name: '', phone: '', whatsappLocal: '', email: '', requirement: '', serviceType: service.title });
    setShowBooking(true);
  };

  const handleBookingChange = (e) => setBookingForm({ ...bookingForm, [e.target.name]: e.target.value });

  const submitBooking = async (e) => {
    e.preventDefault();
    try {
      const local = bookingForm.whatsappLocal?.replace(/[^0-9]/g, '');
      if (!/^[6-9][0-9]{9}$/.test(local)) {
        setErrorMessage('Please enter a valid 10-digit mobile number');
        setShowError(true);
        return;
      }
      // validate email
      const email = bookingForm.email?.trim();
      if (!email) {
        setErrorMessage('Please enter an email address');
        setShowError(true);
        return;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setErrorMessage('Please enter a valid email address');
        setShowError(true);
        return;
      }
      const payload = {
        name: bookingForm.name,
        phone: bookingForm.phone || bookingForm.whatsappLocal,
        whatsappNumber: `91${local}`,
        requirement: bookingForm.requirement || (`Request for ${bookingForm.serviceType}`),
        email: email,
      };
      // include serviceType if backend supports it
      payload.serviceType = bookingForm.serviceType;
      await axios.post('https://rockyitservices-new.onrender.com/api/customers/register', payload);
      // show success toast/modal
      setShowBooking(false);
      setSuccessMessage('Booking Submitted Successfully!');
      setShowSuccess(true);
      setBookingForm({ name: '', phone: '', whatsappLocal: '', email: '', requirement: '', serviceType: '' });
    } catch (err) {
      console.error('Booking error:', err);
      const msg = err?.response?.data?.message || err.message || 'Failed to submit booking';
      setErrorMessage(`Booking failed: ${msg}`);
      setShowError(true);
    }
  };

  // auto-hide success toast after 4 seconds
  useEffect(() => {
    if (showSuccess) {
      const t = setTimeout(() => {
        setShowSuccess(false);
        setSuccessMessage('');
      }, 4000);
      return () => clearTimeout(t);
    }
  }, [showSuccess]);

  useEffect(() => {
    if (showError) {
      const t = setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 5000);
      return () => clearTimeout(t);
    }
  }, [showError]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Navbar />

      <Hero openBooking={openBooking} />

      <section className="max-w-7xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800">Our Services</h2>
        <p className="text-gray-600 mt-2">A quick preview of services we provide.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {previewServices.map((s) => (
            <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.desc} onBook={() => openBooking(s)} />
          ))}
        </div>
      </section>

      {/* Why Choose section moved below contact form for better flow */}

      {/* Contact moved to a dedicated page for cleaner UI */}

      {showBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Book Service: {bookingForm.serviceType}</h3>
              <button onClick={() => setShowBooking(false)} className="text-gray-500">Close</button>
            </div>
            <form onSubmit={submitBooking} className="mt-4 space-y-3">
              <input name="name" value={bookingForm.name} onChange={handleBookingChange} placeholder="Full Name" required className="border border-gray-200 p-3 rounded-lg w-full" />
              <div className="flex">
                <div className="inline-flex items-center px-3 rounded-l-lg bg-gray-100 border border-r-0 border-gray-200">+91</div>
                <input name="whatsappLocal" value={bookingForm.whatsappLocal} onChange={handleBookingChange} placeholder="WhatsApp Number (10 digits)" required className="border border-gray-200 p-3 rounded-r-lg w-full" />
              </div>
              <input name="email" value={bookingForm.email} onChange={handleBookingChange} placeholder="Email Address" required className="border border-gray-200 p-3 rounded-lg w-full" />
              <textarea name="requirement" value={bookingForm.requirement} onChange={handleBookingChange} placeholder="Problem Description" className="border border-gray-200 p-3 rounded-lg w-full h-24" />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowBooking(false)} className="px-4 py-2 rounded-lg border">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-emerald-600 text-white rounded-lg">Submit Booking</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed right-6 bottom-6 z-50">
          <div className="max-w-sm w-full bg-emerald-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-enter">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.707a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 10-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">{successMessage || 'Booking Submitted Successfully!'}</div>
              <div className="text-sm opacity-90">Our team will contact you shortly.</div>
            </div>
            <button onClick={() => { setShowSuccess(false); setSuccessMessage(''); }} className="ml-4 text-white/90 hover:text-white">✕</button>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed right-6 bottom-20 z-50">
          <div className="max-w-sm w-full bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-enter">
            <div className="flex-shrink-0">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-1-9V6a1 1 0 112 0v3a1 1 0 11-2 0zm0 4a1 1 0 102 0 1 1 0 00-2 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="font-semibold">{errorMessage || 'Something went wrong'}</div>
            </div>
            <button onClick={() => { setShowError(false); setErrorMessage(''); }} className="ml-4 text-white/90 hover:text-white">✕</button>
          </div>
        </div>
      )}

      <section className="max-w-7xl mx-auto px-6 py-12 bg-white rounded-3xl shadow-lg">
        <h3 className="text-2xl font-bold">Why Choose Rocky IT Services?</h3>
        <div className="mt-6 grid md:grid-cols-3 gap-6 text-gray-700">
          <div className="space-y-2">
            <h4 className="font-semibold">Experienced Team</h4>
            <p>Certified technicians with real-world experience.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Fast Turnaround</h4>
            <p>Rapid diagnostics and efficient repairs.</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-semibold">Trusted Support</h4>
            <p>Secure processes and reliable remote assistance.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}