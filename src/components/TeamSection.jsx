import { useState, useEffect } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/team` : "https://rockyitservices-new.onrender.com/api/team";

export default function TeamSection() {
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center">
            <p className="text-gray-500">Loading team members...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error || teamMembers.length === 0) {
    return null;
  }

  return (
    <section id="team-section" className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-cyan-600 to-violet-600 bg-clip-text text-transparent">
            Our Team
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Meet the talented professionals behind Rocky IT Services
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Member Image - Smaller */}
              <div className="relative h-32 bg-gradient-to-br from-cyan-400 to-violet-600 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-4xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-cyan-600 font-semibold text-sm mb-3">
                  {member.position}
                </p>

                {/* Contact Info */}
                <div className="space-y-2 border-t border-gray-200 pt-3">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center text-xs text-gray-600 hover:text-cyan-600 transition-colors truncate"
                    >
                      <span className="mr-2">📧</span>
                      <span className="truncate">{member.email}</span>
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center text-xs text-gray-600 hover:text-cyan-600 transition-colors"
                    >
                      <span className="mr-2">📱</span>
                      {member.phone}
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
