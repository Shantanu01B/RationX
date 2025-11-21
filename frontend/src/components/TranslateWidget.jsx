import { useState } from "react";
import { Globe } from "lucide-react";

const TranslateWidget = () => {
  const [open, setOpen] = useState(false);

  const toggleTranslate = () => {
    setOpen(!open);

    // Open Google Translate menu if loaded
    const frame = document.querySelector("iframe.goog-te-menu-frame");
    if (frame) {
      const innerDoc = frame.contentDocument || frame.contentWindow.document;
      const selector = innerDoc.querySelector(".goog-te-menu2");
      if (selector) selector.style.display = "block";
    }
  };

  // Helper to safely select a language
  const setLanguage = (lang) => {
    const combo = document.querySelector(".goog-te-combo");
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event("change")); // 🔥 This actually triggers translation
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999]">

      {/* Floating Button */}
      <button
        onClick={toggleTranslate}
        className="bg-gradient-to-br from-indigo-600 to-purple-700 
        shadow-2xl p-4 rounded-full text-white 
        hover:scale-110 hover:shadow-purple-500/40 
        transition-all duration-300 flex items-center justify-center"
      >
        <Globe size={28} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute bottom-20 right-0 bg-white shadow-xl rounded-2xl p-3 w-44 border border-gray-200 animate-fade-in">
          <p className="text-sm font-semibold text-gray-700 mb-2">
            🌐 Select Language
          </p>

          {/* English */}
          <button
            onClick={() => window.location.reload()}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            English
          </button>

          {/* Hindi */}
          <button
            onClick={() => setLanguage("hi")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            हिंदी
          </button>

          {/* Marathi */}
          <button
            onClick={() => setLanguage("mr")}
            className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-100"
          >
            मराठी
          </button>
        </div>
      )}
    </div>
  );
};

export default TranslateWidget;
