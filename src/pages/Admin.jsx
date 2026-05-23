import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export default function Admin() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortLatest, setSortLatest] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [adminUser, setAdminUser] = useState(null);

  useEffect(() => {
    // Check for admin token authentication
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');
    
    if (!token) {
      return navigate('/admin-login', { replace: true });
    }
    
    // Parse admin user data
    try {
      if (userStr) setAdminUser(JSON.parse(userStr));
    } catch (e) {
      console.error('Failed to parse admin user:', e);
    }
    
    // Verify token is still valid
    verifyToken(token);
  }, []);

  const verifyToken = async (token) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!res.data.success) {
        // Token invalid, redirect to login
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        return navigate('/admin-login', { replace: true });
      }
      
      // Token valid, fetch customers
      fetchCustomers(token);
    } catch (error) {
      console.error('Token verification failed:', error.message);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin-login', { replace: true });
    }
  };

  const fetchCustomers = async (token) => {
    const authToken = token || localStorage.getItem('adminToken');
    try {
      const res = await axios.get(`${API_BASE_URL}/customers`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });
      setCustomers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch customers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const statuses = ["New Lead", "Contacted", "Follow Up", "Resolved"];

  const statusClasses = {
    "New Lead": "bg-yellow-100 text-yellow-800",
    Contacted: "bg-blue-100 text-blue-800",
    "Follow Up": "bg-indigo-100 text-indigo-800",
    Resolved: "bg-green-100 text-green-800",
  };

  const updateStatus = async (id, newStatus) => {
    const prev = customers;
    setCustomers((s) => s.map((c) => (c._id === id ? { ...c, status: newStatus } : c)));
    try {
      await axios.patch(`https://rockyitservices-new.onrender.com/api/customers/${id}/status`, { status: newStatus });
    } catch (err) {
      console.error(err);
      setCustomers(prev);
      alert('Failed to update status');
    }
  };

  const formatWaNumber = (num) => {
    if (!num) return null;
    const digits = num.replace(/[^0-9]/g, '');
    if (digits.length === 10) return `91${digits}`;
    if (digits.length === 11 && digits.startsWith('0')) return `91${digits.slice(1)}`;
    if (digits.length === 12 && digits.startsWith('91')) return digits;
    if (digits.startsWith('+' ) && digits.length>1) return digits.replace(/[^0-9]/g,'');
    return digits;
  };

  const openWhatsApp = (rawNumber, customer) => {
    const waNum = formatWaNumber(rawNumber);
    if (!waNum) return alert('Invalid WhatsApp number');
    const message = `Hello,\nThank you for contacting Rocky IT Services.\nHow can we assist you regarding your service request?`;
    const url = `https://wa.me/${waNum}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener');
  };

  const filtered = customers
    .filter((c) => {
    const q = query.toLowerCase();
    return (
      c.name?.toLowerCase().includes(q) ||
      c.email?.toLowerCase().includes(q) ||
      c.phone?.toLowerCase().includes(q) ||
      c.requirement?.toLowerCase().includes(q)
    );
    })
    .filter((c) => (filterStatus === 'All' ? true : (c.status || 'New Lead') === filterStatus)
    )
    .sort((a, b) => {
      if (!sortLatest) return 0;
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage customer leads and support requests</p>
          </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name, email, phone or requirement" className="border border-gray-200 rounded-lg px-4 py-2 w-full sm:w-72" />
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <button onClick={() => fetchCustomers()} className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Refresh</button>
                <button onClick={() => setCompactView(v => !v)} className="flex-1 sm:flex-initial px-3 py-2 bg-gray-100 rounded-lg text-sm">{compactView ? 'Normal View' : 'Compact View'}</button>
                <button onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin-login'); }} className="flex-1 sm:flex-initial px-4 py-2 bg-red-500 text-white rounded-lg text-sm">Logout</button>
              </div>
            </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8">
          <div className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-2xl shadow">
            <div className="text-sm text-gray-500">Total Requests</div>
            <div className="text-2xl sm:text-3xl font-bold mt-2">{customers.length}</div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-2xl shadow">
            <div className="text-sm text-gray-500">New Leads</div>
            <div className="text-2xl sm:text-3xl font-bold mt-2 text-yellow-600">{customers.filter(c => (c.status || 'New Lead') === 'New Lead').length}</div>
          </div>
          <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-2xl shadow">
            <div className="text-sm text-gray-500">Follow Ups</div>
            <div className="text-2xl sm:text-3xl font-bold mt-2 text-indigo-600">{customers.filter(c => (c.status || 'New Lead') === 'Follow Up').length}</div>
          </div>
          <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl shadow">
            <div className="text-sm text-gray-500">Resolved</div>
            <div className="text-2xl sm:text-3xl font-bold mt-2 text-green-600">{customers.filter(c => (c.status || 'New Lead') === 'Resolved').length}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">
            <div className="p-4 sm:p-6 border-b flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Customer Requests</h2>
              <div className="text-sm text-gray-500">Manage leads and update statuses</div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full lg:w-auto">
              <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search name, phone, email or requirement" className="border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-64" />
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <select value={filterStatus} onChange={(e)=>setFilterStatus(e.target.value)} className="flex-1 sm:flex-initial border border-gray-200 rounded-lg px-3 py-2 bg-white">
                  <option value="All">All Statuses</option>
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => setSortLatest(s => !s)} className="flex-1 sm:flex-initial px-3 py-2 bg-gray-100 rounded-lg text-sm">{sortLatest ? 'Sort: Latest' : 'Sort: Natural'}</button>
                <button onClick={() => setCompactView(v => !v)} className="flex-1 sm:flex-initial px-3 py-2 bg-gray-100 rounded-lg hidden md:inline text-sm">{compactView ? 'Normal View' : 'Compact View'}</button>
                <button onClick={() => fetchCustomers()} className="flex-1 sm:flex-initial px-4 py-2 bg-green-600 text-white rounded-lg text-sm">Refresh</button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
              <div className="h-10 bg-gray-200 rounded animate-pulse" />
            </div>
          ) : (
            <>
              {filtered.length === 0 ? (
                <div className="p-8 text-center text-gray-600">
                  <div className="text-xl font-semibold">No requests found</div>
                  <div className="mt-3">Try changing filters or add new requests from the homepage.</div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className={`w-full text-left ${compactView ? 'text-sm min-w-0' : 'min-w-[720px]'} rounded-lg overflow-hidden table-auto`}>
                    <thead className="bg-gradient-to-r from-gray-100 to-white">
                      <tr className="text-sm text-gray-600">
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Name</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>WhatsApp</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Phone</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Email</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Service / Issue</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Requested</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Status</th>
                        <th className={`${compactView ? 'p-2' : 'p-4'}`}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((customer) => (
                        <tr key={customer._id} className="border-b hover:bg-gray-50 transition">
                          <td className={`${compactView ? 'p-2 text-sm' : 'p-4 font-medium'}`}>{customer.name}</td>
                          <td className={`${compactView ? 'p-2 text-sm' : 'p-4'}`}>
                            <div className="flex items-center gap-3">
                              <div className="text-sm text-gray-700">{customer.whatsappNumber || '-'}</div>
                            </div>
                          </td>
                          <td className={`${compactView ? 'p-2 text-sm' : 'p-4'}`}>{customer.phone}</td>
                          <td className={`${compactView ? 'p-2 text-sm' : 'p-4'}`}>{customer.email}</td>
                          <td className={`${compactView ? 'p-2 text-sm max-w-[18rem] truncate' : 'p-4 max-w-xl truncate'}`}>{customer.requirement}</td>
                          <td className={`${compactView ? 'p-2 text-sm' : 'p-4'}`}>{new Date(customer.createdAt).toLocaleString()}</td>
                          <td className={`${compactView ? 'p-2' : 'p-4'}`}>
                            <div className="flex items-center gap-3">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[customer.status || 'New Lead'] || 'bg-gray-100 text-gray-800'}`}>{customer.status || 'New Lead'}</span>
                              <select value={customer.status || 'New Lead'} onChange={(e)=>updateStatus(customer._id, e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-sm">
                                {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </div>
                          </td>
                          <td className={`${compactView ? 'p-2' : 'p-4'}`}>
                            <div className="flex items-center gap-2">
                              <button onClick={() => openWhatsApp(customer.whatsappNumber, customer)} className={`flex items-center gap-2 ${compactView ? 'px-2 py-1 text-xs' : 'px-3 py-2'} bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition`}>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                  <path d="M20.52 3.48A11.95 11.95 0 0012.01 0C5.38 0 .03 5.35.03 12c0 2.13.56 4.15 1.62 5.93L0 24l6.32-1.65A11.96 11.96 0 0012 24c6.62 0 11.97-5.35 11.97-12 0-1.98-.48-3.84-1.45-5.52zM12 22.2c-1.2 0-2.38-.3-3.42-.87l-.25-.13-3.76.98.99-3.66-.13-.27A9.35 9.35 0 012.65 12 9.35 9.35 0 0112 2.65 9.35 9.35 0 0121.35 12 9.35 9.35 0 0112 22.2z" />
                                  <path d="M17.57 14.33c-.28-.14-1.64-.81-1.9-.9-.26-.09-.45-.14-.64.14-.19.28-.73.9-.9 1.09-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.46.09-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.44 1.03 2.84 1.17 3.04.14.2 2.03 3.12 4.92 4.37 3.05 1.31 3.05.87 3.6.82.55-.05 1.79-.73 2.04-1.44.24-.71.24-1.32.17-1.45-.07-.13-.26-.21-.55-.35z" fill="white" />
                                </svg>
                                <span className={`${compactView ? 'text-xs' : 'text-sm'}`}>Chat on WhatsApp</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}