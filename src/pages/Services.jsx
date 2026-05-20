import { useCallback } from "react";
import Navbar from "../components/Navbar";
import ServiceCard from "../components/ServiceCard";
import Footer from "../components/Footer";

const services = [
  { title: "AWS Cloud Services", icon: "☁️", desc: "Cloud architecture, deployment and management on AWS." },
  { title: "Website Design", icon: "🎨", desc: "Responsive, modern website design for businesses." },
  { title: "Website Hosting", icon: "🌐", desc: "Fast and secure website hosting and maintenance." },
  { title: "Laptop Repair", icon: "💻", desc: "Hardware and software fixes for laptops." },
  { title: "Desktop Repair", icon: "🖥️", desc: "Desktop troubleshooting and upgrades." },
  { title: "Printer Repair", icon: "🖨️", desc: "Printer maintenance and cartridge support." },
  { title: "CCTV Installation", icon: "📹", desc: "CCTV setup and surveillance solutions." },
  { title: "Networking Solutions", icon: "🌐", desc: "LAN/WAN setup and cabling." },
  { title: "WiFi Setup", icon: "📶", desc: "Wireless planning and secure setups." },
  { title: "Software Installation", icon: "💾", desc: "App installs and configuration." },
  { title: "OS Installation", icon: "🛠️", desc: "Windows/Linux OS installs and tuning." },
  { title: "Data Recovery", icon: "🔁", desc: "Recover lost or corrupted data." },
  { title: "Computer AMC Services", icon: "🔧", desc: "Annual maintenance contracts." },
  { title: "Chip Level Repair", icon: "🔬", desc: "Advanced board-level diagnostics." },
  { title: "Server Maintenance", icon: "🗄️", desc: "Server monitoring and upkeep." },
  { title: "Custom PC Build", icon: "⚙️", desc: "Custom gaming and workstation builds." },
  { title: "Antivirus Installation", icon: "🛡️", desc: "Security setup and malware removal." },
  { title: "Remote IT Support", icon: "📞", desc: "Quick remote assistance." },
];

export default function Services() {
  const handleBook = useCallback((title) => {
    // navigate to home and open booking modal with this service prefilled
    const url = `/?service=${encodeURIComponent(title)}`;
    window.location.href = url;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <section className="max-w-7xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-gray-800">Our Services</h1>
        <p className="mt-2 text-gray-600">Comprehensive IT services for businesses and home users.</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.desc} onBook={() => handleBook(s.title)} />
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}