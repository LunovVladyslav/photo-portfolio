import { useState, useEffect } from "react";
import { Navigation } from "./components/Navigation";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Portfolio } from "./components/Portfolio";
import { Pricing } from "./components/Pricing";
import { Contact } from "./components/Contact";
import { PhotoCollection } from "./components/PhotoCollection";
import { Toaster } from "./components/ui/sonner";
import AdminApp from "./AdminApp";
import { Settings } from "lucide-react";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [showAdmin, setShowAdmin] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else if (sectionId === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleScrollDown = () => {
    scrollToSection("about");
  };

  // Check URL for admin access
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("admin") === "true") {
      setShowAdmin(true);
    }
  }, []);

  useEffect(() => {
    if (showAdmin) return; // Don't add scroll listener in admin mode

    const handleScroll = () => {
      const sections = [
        "home",
        "about",
        "portfolio",
        "pricing",
        "contact",
        "collection",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(sectionId);
            break;
          }
        } else if (
          sectionId === "home" &&
          scrollPosition < 200
        ) {
          setActiveSection("home");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, [showAdmin]);

  // If admin panel is active, show it
  if (showAdmin) {
    return (
      <AdminApp onBackToPortfolio={() => setShowAdmin(false)} />
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        activeSection={activeSection}
        onNavigate={scrollToSection}
      />
      <Hero onScrollDown={handleScrollDown} />
      <About />
      <Portfolio />
      <Pricing />
      <Contact />
      <PhotoCollection />

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-2xl mb-4 italic">
            Kelly McKeefrey
          </p>
          <p className="text-gray-400 mb-4">
            Fashion & Portrait Photographer
          </p>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Kelly McKeefrey
            Photography. All rights reserved.
          </p>
        </div>
      </footer>

      {/* Admin Access Button (Hidden) */}
      <button
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-6 right-6 p-3 bg-black text-white rounded-full shadow-lg hover:bg-gray-800 transition-colors z-50"
        title="Admin Access"
      >
        <Settings size={20} />
      </button>

      <Toaster />
    </div>
  );
}