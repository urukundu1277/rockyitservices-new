import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://rockyitservices-new.onrender.com/api";

export default function Admin() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortLatest, setSortLatest] = useState(true);
  const [compactView, setCompactView] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deletingIds, setDeletingIds] = useState([]);
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState("customers");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [editingTeamId, setEditingTeamId] = useState(null);
  const [teamFormData, setTeamFormData] = useState({
    name: "",
    position: "",
    email: "",
    phone: "",
    location: "",
    company: "Rocky IT Services",
    image: null,
    imagePreview: "",
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userStr = localStorage.getItem('adminUser');

    if (!token) {
      return navigate('/admin-login', { replace: true });
    }

    verifyToken(token, userStr);
  }, []);

  const verifyToken = async (token, userStr) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/admin/verify-token`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.data.success) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        return navigate('/admin-login', { replace: true });
      }

      if (userStr) {
        try {
          setAdminUser(JSON.parse(userStr));
        } catch (e) {
          setAdminUser(userStr);
        }
      }

      fetchCustomers(token);
      fetchTeamMembers();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      navigate('/admin-login', { replace: true });
    }
  };

  const fetchCustomers = async (token) => {
    try {
      const authToken = token || localStorage.getItem('adminToken');
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

  const fetchTeamMembers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/team`);
      setTeamMembers(res.data || []);
    } catch (error) {
      console.error('Failed to fetch team members:', error.message);
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
      const authToken = localStorage.getItem('adminToken');
      await axios.patch(
        `${API_BASE_URL}/customers/${id}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
    } catch (err) {
      console.error(err);
      setCustomers(prev);
      setErrorMessage(err?.response?.data?.message || 'Failed to update status');
      setShowError(true);
    }
  };

  const deleteCustomer = async (id) => {
    if (!window.confirm('Delete this customer request permanently?')) return;
    if (deletingIds.includes(id)) return;

    setDeletingIds((ids) => [...ids, id]);

    try {
      const authToken = localStorage.getItem('adminToken');
      const res = await axios.delete(`${API_BASE_URL}/customers/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` }
      });

      setCustomers((s) => s.filter((c) => c._id !== id));
      setSuccessMessage(res.data?.message || 'Customer deleted successfully');
      setShowSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMessage(err?.response?.data?.message || err.message || 'Failed to delete customer');
      setShowError(true);
    } finally {
      setDeletingIds((ids) => ids.filter((currentId) => currentId !== id));
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

  const handleTeamFormChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "image" && files && files[0]) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamFormData((prev) => ({
          ...prev,
          image: reader.result,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setTeamFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleTeamFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: teamFormData.name,
        position: teamFormData.position,
        email: teamFormData.email,
        phone: teamFormData.phone,
        location: teamFormData.location,
        company: teamFormData.company,
        image: teamFormData.image,
      };

      if (editingTeamId) {
        const res = await axios.put(`${API_BASE_URL}/team/${editingTeamId}`, payload);
        setTeamMembers((prev) =>
          prev.map((m) => (m._id === editingTeamId ? res.data : m))
        );
        setSuccessMessage("Team member updated successfully");
      } else {
        const res = await axios.post(`${API_BASE_URL}/team`, payload);
        setTeamMembers((prev) => [res.data, ...prev]);
        setSuccessMessage("Team member added successfully");
      }

      setShowSuccess(true);
      setTeamFormData({
        name: "",
        position: "",
        email: "",
        phone: "",
        location: "",
        company: "Rocky IT Services",
        image: null,
        imagePreview: "",
      });
      setEditingTeamId(null);
      setShowTeamForm(false);
    } catch (error) {
      console.error("Team form error:", error.response?.data || error.message);
      setErrorMessage(error?.response?.data?.message || error.message || "Failed to save team member");
      setShowError(true);
    }
  };

  const editTeamMember = (member) => {
    setTeamFormData({
      name: member.name,
      position: member.position,
      email: member.email || "",
      phone: member.phone || "",
      location: member.location || "",
      company: member.company || "Rocky IT Services",
      image: member.image || null,
      imagePreview: member.image || "",
    });
    setEditingTeamId(member._id);
    setShowTeamForm(true);
  };

  const deleteTeamMember = async (id) => {
    if (!window.confirm("Delete this team member permanently?")) return;

    try {
      await axios.delete(`${API_BASE_URL}/team/${id}`);
      setTeamMembers((prev) => prev.filter((m) => m._id !== id));
      setSuccessMessage("Team member deleted successfully");
      setShowSuccess(true);
    } catch (error) {
      console.error(error);
      setErrorMessage(error?.response?.data?.message || "Failed to delete team member");
      setShowError(true);
    }
  };

  useEffect(() => {
    if (showSuccess || showError) {
      const timer = setTimeout(() => {
        setShowSuccess(false);
        setShowError(false);
        setSuccessMessage("");
        setErrorMessage("");
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess, showError]);

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
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage customer leads and support requests</p>
          </div>
          <button
            onClick={() => { localStorage.removeItem('adminToken'); localStorage.removeItem('adminUser'); navigate('/admin-login'); }}
            className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("customers")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "customers"
                ? "border-b-2 border-cyan-600 text-cyan-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Customers
          </button>
          <button
            onClick={() => setActiveTab("team")}
            className={`px-6 py-3 font-semibold transition-all ${
              activeTab === "team"
                ? "border-b-2 border-cyan-600 text-cyan-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Team Members
          </button>
        </div>

        {(showSuccess || showError) && (
          <div className="fixed top-4 left-4 right-4 z-50 mx-auto w-auto max-w-sm space-y-3 sm:right-5 sm:left-auto">
            {showSuccess && (
              <div className="flex items-start gap-3 rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-4 shadow-xl shadow-emerald-200/50">
                <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center text-lg font-semibold">✓</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-emerald-900">Deleted successfully</div>
                    <button onClick={() => setShowSuccess(false)} className="text-emerald-700 hover:text-emerald-900">×</button>
                  </div>
                  <p className="mt-1 text-sm text-emerald-800">{successMessage}</p>
                </div>
              </div>
            )}
            {showError && (
              <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-4 py-4 shadow-xl shadow-red-200/50">
                <div className="mt-0.5 h-10 w-10 flex-shrink-0 rounded-2xl bg-red-100 text-red-700 flex items-center justify-center text-lg font-semibold">!</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-3">
                    <div className="text-sm font-semibold text-red-900">Action failed</div>
                    <button onClick={() => setShowError(false)} className="text-red-700 hover:text-red-900">×</button>
                  </div>
                  <p className="mt-1 text-sm text-red-800">{errorMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mt-8">
          {activeTab === "customers" && (
            <>
              <div className="bg-gradient-to-br from-white to-gray-50 p-4 sm:p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Total Requests</div>
                <div className="text-2xl sm:text-3xl font-bold mt-2">{customers.length}</div>
              </div>
              <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 sm:p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">New Leads</div>
                <div className="text-2xl sm:text-3xl font-bold mt-2 text-yellow-600">{customers.filter(c => (c.status || 'New Lead') === 'New Lead').length}</div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 sm:p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Contacted</div>
                <div className="text-2xl sm:text-3xl font-bold mt-2 text-blue-600">{customers.filter(c => (c.status || 'New Lead') === 'Contacted').length}</div>
              </div>
              <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 sm:p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Follow Ups</div>
                <div className="text-2xl sm:text-3xl font-bold mt-2 text-indigo-600">{customers.filter(c => (c.status || 'New Lead') === 'Follow Up').length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 sm:p-6 rounded-2xl shadow">
                <div className="text-sm text-gray-500">Resolved</div>
                <div className="text-2xl sm:text-3xl font-bold mt-2 text-green-600">{customers.filter(c => (c.status || 'New Lead') === 'Resolved').length}</div>
              </div>
            </>
          )}
        </div>

        <div className="bg-white rounded-2xl shadow mt-8 overflow-hidden">
            {activeTab === "customers" && (
            <>
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
                  {["New Lead", "Contacted", "Follow Up", "Resolved"].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={() => setSortLatest(s => !s)} className="flex-1 sm:flex-initial px-3 py-2 bg-gray-100 rounded-lg text-sm">{sortLatest ? 'Sort: Latest' : 'Sort: Natural'}</button>
                <button onClick={() => setCompactView(v => !v)} className="flex-1 sm:flex-initial px-3 py-2 bg-gray-100 rounded-lg text-sm">{compactView ? 'Normal View' : 'Compact View'}</button>
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
                <>
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
                            <td className={`${compactView ? 'p-2 text-sm' : 'p-4 font-medium'} whitespace-nowrap max-w-[140px]`}><div className="truncate">{customer.name}</div></td>
                            <td className={`${compactView ? 'p-2 text-sm' : 'p-4'} whitespace-nowrap max-w-[120px]`}>
                              <div className="truncate text-sm text-gray-700">{customer.whatsappNumber || '-'}</div>
                            </td>
                            <td className={`${compactView ? 'p-2 text-sm' : 'p-4'} whitespace-nowrap max-w-[110px]`}><div className="truncate">{customer.phone}</div></td>
                            <td className={`${compactView ? 'p-2 text-sm' : 'p-4'} whitespace-nowrap max-w-[160px]`}><div className="truncate">{customer.email}</div></td>
                            <td className={`${compactView ? 'p-2 text-sm' : 'p-4'} whitespace-nowrap max-w-[180px]`}><div className="truncate">{customer.requirement}</div></td>
                            <td className={`${compactView ? 'p-2 text-sm' : 'p-4'} whitespace-nowrap max-w-[140px]`}><div className="truncate">{new Date(customer.createdAt).toLocaleString()}</div></td>
                            <td className={`${compactView ? 'p-2' : 'p-4'} whitespace-nowrap`}>
                              <div className="flex flex-wrap items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${statusClasses[customer.status || 'New Lead'] || 'bg-gray-100 text-gray-800'}`}>{customer.status || 'New Lead'}</span>
                                <select value={customer.status || 'New Lead'} onChange={(e)=>updateStatus(customer._id, e.target.value)} className="border border-gray-200 rounded px-2 py-1 text-sm">
                                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                                </select>
                              </div>
                            </td>
                            <td className={`${compactView ? 'p-2' : 'p-4'} whitespace-nowrap`}> 
                              <div className="flex flex-wrap gap-2">
                                <button onClick={() => openWhatsApp(customer.whatsappNumber, customer)} className={`flex items-center gap-2 ${compactView ? 'px-2 py-1 text-xs' : 'px-2 py-1 sm:px-3 sm:py-2'} bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition`}>
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path d="M20.52 3.48A11.95 11.95 0 0012.01 0C5.38 0 .03 5.35.03 12c0 2.13.56 4.15 1.62 5.93L0 24l6.32-1.65A11.96 11.96 0 0012 24c6.62 0 11.97-5.35 11.97-12 0-1.98-.48-3.84-1.45-5.52zM12 22.2c-1.2 0-2.38-.3-3.42-.87l-.25-.13-3.76.98.99-3.66-.13-.27A9.35 9.35 0 012.65 12 9.35 9.35 0 0112 2.65 9.35 9.35 0 0121.35 12 9.35 9.35 0 0112 22.2z" />
                                    <path d="M17.57 14.33c-.28-.14-1.64-.81-1.9-.9-.26-.09-.45-.14-.64.14-.19.28-.73.9-.9 1.09-.16.19-.32.21-.6.07-.28-.14-1.18-.43-2.25-1.39-.83-.74-1.39-1.66-1.55-1.94-.16-.28-.02-.43.12-.57.12-.12.28-.32.42-.48.14-.16.19-.28.28-.46.09-.19.05-.36-.02-.5-.07-.14-.64-1.54-.88-2.12-.23-.56-.47-.48-.64-.49-.17-.01-.36-.01-.55-.01-.19 0-.5.07-.76.36-.26.29-1 1-1 2.43 0 1.44 1.03 2.84 1.17 3.04.14.2 2.03 3.12 4.92 4.37 3.05 1.31 3.05.87 3.6.82.55-.05 1.79-.73 2.04-1.44.24-.71.24-1.32.17-1.45-.07-.13-.26-.21-.55-.35z" fill="white" />
                                  </svg>
                                  <span className={`${compactView ? 'text-xs' : 'text-sm'} hidden sm:inline`}>Chat</span>
                                </button>
                                <button
                                  onClick={() => deleteCustomer(customer._id)}
                                  disabled={deletingIds.includes(customer._id)}
                                  className={`flex items-center gap-2 ${compactView ? 'px-2 py-1 text-xs' : 'px-2 py-1 sm:px-3 sm:py-2'} ${deletingIds.includes(customer._id) ? 'bg-red-300 cursor-not-allowed' : 'bg-red-500 hover:bg-red-600'} text-white rounded-lg transition`}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                                    <path d="M9 3a1 1 0 00-1 1v1H4a1 1 0 000 2h16a1 1 0 000-2h-4V4a1 1 0 00-1-1H9z" />
                                    <path fillRule="evenodd" d="M5 8a1 1 0 011-1h12a1 1 0 011 1v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm3 2a1 1 0 00-1 1v7a1 1 0 102 0v-7a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v7a1 1 0 102 0v-7a1 1 0 00-1-1z" clipRule="evenodd" />
                                  </svg>
                                  <span className={`${compactView ? 'text-xs' : 'text-sm'} hidden sm:inline`}>{deletingIds.includes(customer._id) ? 'Deleting...' : 'Delete'}</span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </>
          )}
            </>
            )}

            {/* Team Members Section */}
            {activeTab === "team" && (
            <>
            <div className="p-4 sm:p-6 border-b flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-xl font-semibold">Team Members</h2>
              <div className="text-sm text-gray-500">Add, edit, and manage team members</div>
            </div>
            <button
              onClick={() => {
                setShowTeamForm(!showTeamForm);
                setEditingTeamId(null);
                setTeamFormData({
                  name: "",
                  position: "",
                  email: "",
                  phone: "",
                  location: "",
                  company: "Rocky IT Services",
                  image: null,
                  imagePreview: "",
                });
              }}
              className="w-full sm:w-auto px-4 py-2 bg-cyan-600 text-white rounded-lg text-sm hover:bg-cyan-700 transition"
            >
              {showTeamForm ? "Cancel" : "+ Add Team Member"}
            </button>
          </div>

          {/* Team Form */}
          {showTeamForm && (
            <form onSubmit={handleTeamFormSubmit} className="p-4 sm:p-6 border-b bg-gray-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={teamFormData.name}
                  onChange={handleTeamFormChange}
                  required
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  name="position"
                  placeholder="Role/Title"
                  value={teamFormData.position}
                  onChange={handleTeamFormChange}
                  required
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={teamFormData.email}
                  onChange={handleTeamFormChange}
                  required
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={teamFormData.phone}
                  onChange={handleTeamFormChange}
                  required
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location"
                  value={teamFormData.location}
                  onChange={handleTeamFormChange}
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
                <input
                  type="text"
                  name="company"
                  placeholder="Company"
                  value={teamFormData.company}
                  onChange={handleTeamFormChange}
                  className="border border-gray-200 rounded-lg px-3 py-2"
                />
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Upload Image</label>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleTeamFormChange}
                    className="border border-gray-200 rounded-lg px-3 py-2 w-full"
                  />
                  {teamFormData.imagePreview && (
                    <div className="mt-3">
                      <img src={teamFormData.imagePreview} alt="Preview" className="w-20 h-20 rounded-lg object-cover" />
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="mt-4 px-6 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition"
              >
                {editingTeamId ? "Update Team Member" : "Add Team Member"}
              </button>
            </form>
          )}

          {/* Team Members Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm min-w-[800px]">
              <thead className="bg-gradient-to-r from-gray-100 to-white">
                <tr className="text-sm text-gray-600">
                  <th className="p-4">Name</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Company</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {teamMembers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="p-8 text-center text-gray-600">
                      <div className="text-xl font-semibold">No team members added yet</div>
                      <div className="mt-2">Click "Add Team Member" to get started.</div>
                    </td>
                  </tr>
                ) : (
                  teamMembers.map((member) => (
                    <tr key={member._id} className="border-b hover:bg-gray-50 transition">
                      <td className="p-4 font-medium">{member.name}</td>
                      <td className="p-4">{member.position}</td>
                      <td className="p-4 text-sm text-gray-600">{member.email}</td>
                      <td className="p-4 text-sm text-gray-600">{member.phone}</td>
                      <td className="p-4 text-sm text-gray-600">{member.location || "—"}</td>
                      <td className="p-4 text-sm text-gray-600">{member.company || "—"}</td>
                      <td className="p-4 flex gap-2">
                        <button
                          onClick={() => editTeamMember(member)}
                          className="p-2 text-cyan-600 hover:bg-cyan-50 rounded-lg transition"
                          title="Edit"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" />
                            <path d="M20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteTeamMember(member._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 sm:w-5 sm:h-5">
                            <path d="M9 3a1 1 0 00-1 1v1H4a1 1 0 000 2h16a1 1 0 000-2h-4V4a1 1 0 00-1-1H9z" />
                            <path fillRule="evenodd" d="M5 8a1 1 0 011-1h12a1 1 0 011 1v11a2 2 0 01-2 2H7a2 2 0 01-2-2V8zm3 2a1 1 0 00-1 1v7a1 1 0 102 0v-7a1 1 0 00-1-1zm5 0a1 1 0 00-1 1v7a1 1 0 102 0v-7a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
            </>
            )}
        </div>
      </section>

      <Footer />
    </div>
  );
}