import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", phone: "", whatsappLocal: "", email: "", requirement: "" });
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

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-20">
        <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8">
          <h3 className="text-2xl font-bold">New Customer Registration</h3>
          <p className="mt-2 text-gray-600">Submit your requirement and our IT team will contact you.</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <input name="name" value={formData.name} onChange={handleChange} placeholder="Full Name" required className="border border-gray-200 p-3 rounded-lg w-full" />
            <input name="phone" value={formData.phone} onChange={handleChange} placeholder="Phone Number" required className="border border-gray-200 p-3 rounded-lg w-full" />
            <div className="flex">
              <div className="inline-flex items-center px-3 rounded-l-lg bg-gray-100 border border-r-0 border-gray-200">+91</div>
              <input name="whatsappLocal" value={formData.whatsappLocal} onChange={handleChange} placeholder="WhatsApp Number (10 digits)" required className="border border-gray-200 p-3 rounded-r-lg w-full" />
            </div>
            <input name="email" value={formData.email} onChange={handleChange} placeholder="Email Address" required className="border border-gray-200 p-3 rounded-lg w-full" />
            <textarea name="requirement" value={formData.requirement} onChange={handleChange} placeholder="Requirement / Issue" required className="border border-gray-200 p-3 rounded-lg w-full h-28" />

            <button type="submit" disabled={loading} className="w-full bg-green-600 text-white py-3 rounded-lg">{loading ? 'Submitting...' : 'Submit Request'}</button>
          </form>
        </div>
      </main>

      {showSuccess && (
        <div className="fixed left-4 right-4 bottom-4 md:left-auto md:right-6 md:bottom-6 z-50">
          <div className="max-w-sm mx-auto md:mx-0 w-full bg-emerald-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
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
          <div className="max-w-sm mx-auto md:mx-0 w-full bg-red-600 text-white rounded-lg shadow-lg p-4 flex items-start gap-3">
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

      <Footer />
    </div>
  );
}
