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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {teamMembers.map((member) => (
            <div
              key={member._id}
              className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              {/* Member Image */}
              <div className="relative h-64 bg-gradient-to-br from-cyan-400 to-violet-600 overflow-hidden">
                {member.image ? (
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white text-6xl font-bold">
                    {member.name.charAt(0)}
                  </div>
                )}
              </div>

              {/* Member Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {member.name}
                </h3>
                <p className="text-cyan-600 font-semibold mb-3">
                  {member.position}
                </p>

                {member.experience && (
                  <p className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Experience:</span> {member.experience}
                  </p>
                )}

                {member.bio && (
                  <p className="text-gray-700 text-sm mb-4 line-clamp-3">
                    {member.bio}
                  </p>
                )}

                {member.expertise && member.expertise.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-600 mb-2">
                      Expertise:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-cyan-100 text-cyan-700 text-xs font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="pt-4 border-t border-gray-200 space-y-2">
                  {member.email && (
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center text-sm text-gray-600 hover:text-cyan-600 transition-colors"
                    >
                      <span className="mr-2">📧</span>
                      {member.email}
                    </a>
                  )}
                  {member.phone && (
                    <a
                      href={`tel:${member.phone}`}
                      className="flex items-center text-sm text-gray-600 hover:text-cyan-600 transition-colors"
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
