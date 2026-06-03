import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/team` : "https://rockyitservices-new.onrender.com/api/team";

export default function Team() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_BASE);
      setTeamMembers(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching team members:", err);
      setError("Failed to load team members");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <Navbar />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center">
            <p className="text-gray-500">Loading team members...</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  if (error || teamMembers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <Navbar />
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800">Our Team</h2>
            <p className="text-gray-500 mt-4">No team members added yet.</p>
          </div>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
            Our Team
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet the talented professionals behind Rocky IT Services
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Member Image */}
              <div className="relative h-48 bg-gradient-to-br from-cyan-400 to-violet-600 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-5xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-cyan-600 font-semibold text-sm mb-4">
                  {member.position}
                </p>

                {/* Contact Info */}
                <div className="space-y-3 border-t border-gray-200 pt-4">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center text-sm text-gray-700 hover:text-cyan-600 transition-colors group"
                    >
                      <span className="mr-3 text-lg">📧</span>
                      <span className="truncate">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center text-sm text-gray-700 hover:text-cyan-600 transition-colors"
                    >
                      <span className="mr-3 text-lg">📱</span>
                      {member.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
