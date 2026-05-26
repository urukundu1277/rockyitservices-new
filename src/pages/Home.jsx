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
  //{ title: "CCTV Installation", icon: "📹", desc: "Secure CCTV installation and setup." },
  { title: "Networking Solutions", icon: "🌐", desc: "LAN/WAN setup and cabling." },
  { title: "WiFi Setup", icon: "📶", desc: "Wireless planning and secure setups." },
  { title: "Software Installation", icon: "💾", desc: "App installs and configuration." },
  { title: "Windows Installation", icon: "🪟", desc: "Windows OS install and recovery." },
  //{ title: "Data Recovery", icon: "🔁", desc: "Recover lost files and data." },
  { title: "Computer AMC Services", icon: "🛠️", desc: "Annual maintenance contracts for systems." },
  //{ title: "Chip Level Repair", icon: "🔧", desc: "Advanced motherboard and chip-level fixes." },
  { title: "Server Maintenance", icon: "🗄️", desc: "Server upkeep, monitoring and support." },
  { title: "Custom PC Build", icon: "🧩", desc: "Custom workstation and gaming PC builds." },
  { title: "VPN Setup", icon: "🌐", desc: "Secure VPN installation and network configuration." },
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

  const openBooking = (service) => {
    setBookingForm({ name: '', phone: '', whatsappLocal: '', email: '', requirement: '', serviceType: service.title });
    setShowBooking(true);
  };

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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBooking(false)} />
          <div className="relative w-full max-w-md bg-white rounded-xl p-5 sm:p-6 shadow-2xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
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
        <div className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 z-50">
          <div className="max-w-sm mx-auto md:mx-0 w-full bg-emerald-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-enter">
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
        <div className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-20 z-50">
          <div className="max-w-sm mx-auto md:mx-0 w-full bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3 animate-enter">
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

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">Why Choose Rocky IT Services?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">We deliver excellence through expert professionals, rapid solutions, and unwavering commitment to your success.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Experienced Team */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-blue-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">👨‍💻</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">IT Support</h3>
              <p className="text-gray-700 leading-relaxed">
                We help home users and small businesses with reliable IT services, technical support, and smart technology solutions for daily needs.
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-600 font-bold"></span>
                  <span>Friendly Technical Assistance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-blue-600 font-bold"></span>
                  <span>Reliable IT Solutions</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Fast Turnaround */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-3xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">⚡</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Fast & Efficient Service</h3>
              <p className="text-gray-700 leading-relaxed">
                Our team provides quick response and smooth support to reduce downtime and keep your systems working properly.
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-emerald-600 font-bold"></span>
                  <span>Quick Issue Resolution</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-emerald-600 font-bold"></span>
                  <span>Smooth Service Experience</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Trusted Support */}
          <div
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-purple-100 p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-200 rounded-full -mr-16 -mt-16 opacity-20 group-hover:opacity-40 transition-opacity" />
            
            <div className="relative z-10">
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center text-white text-3xl mb-4 shadow-lg transform group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl">🛡️</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Trusted Customer Support</h3>
              <p className="text-gray-700 leading-relaxed">
                We are committed to delivering secure, dependable, and professional IT support with customer satisfaction as our priority.
              </p>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-purple-600 font-bold"></span>
                  <span>Safe & Secure Assistance</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="text-purple-600 font-bold"></span>
                  <span>Dedicated Support Service</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} // export default Home; // export default Home;           