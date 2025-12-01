import React, { useState, useRef, useEffect } from "react";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const HybridChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! I'm Toury, your travel assistant at Tour Connect! How can I help you plan your dream vacation today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Your colors
  const PRIMARY_COLOR = "#3C3D37"; // Text & borders
  const HEADER_BG = "#697565"; // Header background
  const USER_BG = "#3C3D37"; // User message background
  const BOT_BG = "#F5F5F5"; // Bot message background
  const BUTTON_BG = "#3C3D37"; // Button background
  const BUTTON_HOVER = "#55564F"; // Button hover

  // FAQ Database (instant answers) - same as before
  const faqDatabase: { [key: string]: string } = {
    // Eastern Visayas Destinations
    "popular destination":
      "🌟 **Top Eastern Visayas Destinations**: \n• Kalanggaman Island - Famous sandbar, crystal clear waters \n• Sambawan Island - Marine sanctuary, diving paradise \n• Cuatro Islas - Four unique islands in one tour \n• San Juanico Bridge - Longest bridge in the Philippines \n• Padre Burgos - Whale shark watching, diving spots \n\nAll packages include local guide + breakfast!",

    kalanggaman:
      "🏝️ **Kalanggaman Island Package**: \n• Price: ₱3,500 - ₱6,000 (day tour) \n• Best time: March to June (calm seas) \n• Includes: Boat transfer, picnic lunch, snorkeling gear \n• Highlights: Iconic sandbar, turquoise waters, photo spots \n• Location: Palompon, Leyte",

    sambawan:
      "🐠 **Sambawan Island Package**: \n• Price: ₱4,000 - ₱7,000 (overnight) \n• Best time: April to September \n• Includes: Cottage stay, meals, diving/snorkeling \n• Highlights: Marine biodiversity, hilltop view, sunset \n• Location: Biliran Province",

    "cuatro islas":
      "🏝️🏝️🏝️🏝️ **Cuatro Islas Package**: \n• Price: ₱4,500 - ₱8,000 (island hopping) \n• Best time: Year-round (avoid typhoon season) \n• Includes: Boat tour, 4 island visits, lunch, guide \n• Islands: Apid, Digyo, Himokilan, Mahaba \n• Location: Inopacan, Leyte",

    "san juanico":
      "🌉 **San Juanico Bridge Tour**: \n• Price: ₱1,500 - ₱3,000 (half day) \n• Best time: Early morning or sunset \n• Includes: Transportation, guide, photo stops \n• Highlights: Bridge viewing, history tour, scenic views \n• Connects: Leyte and Samar",

    "padre burgos":
      "🦈 **Padre Burgos Whale Shark Package**: \n• Price: ₱3,000 - ₱5,500 (whale shark interaction) \n• Best time: November to May \n• Includes: Boat, snorkel gear, briefings, guide \n• Experience: Ethical whale shark watching \n• Location: Southern Leyte",

    leyte:
      "🗺️ **Leyte Exploration Package**: \n• Price: ₱6,000 - ₱12,000 (3 days) \n• Includes: Tacloban city tour, MacArthur Landing, Santo Niño Shrine \n• Historical sites: WWII memorials, heritage buildings \n• Add-ons: Lake Danao, Mahagnao Volcano \n• Perfect for: History buffs, nature lovers",

    samar:
      "🌲 **Samar Adventure Package**: \n• Price: ₱5,500 - ₱10,000 (3 days) \n• Includes: Sohoton Caves, Ulot River tubing, Tandaya Museum \n• Adventures: Spelunking, river trekking, bird watching \n• Natural wonders: Caves, rivers, forests \n• Location: Eastern Samar",

    biliran:
      "⛰️ **Biliran Nature Package**: \n• Price: ₱4,500 - ₱9,000 (3 days) \n• Includes: Tinago Falls, Ulan-ulan Falls, hot springs \n• Activities: Waterfall hopping, trekking, swimming \n• Natural hot springs: Libtong, Mainit \n• Island features: Volcano, rice terraces",

    tacloban:
      "🏙️ **Tacloban City Experience**: \n• Price: ₱2,500 - ₱5,000 (2 days) \n• Includes: City tour, accommodation, local food tour \n• Must-visit: San Juanico Bridge, Sto. Niño Shrine \n• Food to try: Binagol, Moron, Suman Latik \n• Cultural sites: Leyte Provincial Capitol, Madonna of Japan",

    // Booking & General
    "how to book":
      "📝 **Booking Process**: \n1️⃣ Choose Eastern Visayas destination \n2️⃣ Select dates (check ferry schedules) \n3️⃣ Add transportation options \n4️⃣ Click 'Book Now' button \n5️⃣ Complete payment \n\nWe handle all ferry/boat arrangements!",

    price:
      "💰 **Price Range (Eastern Visayas)**: \n• Day tours: ₱1,500 - ₱5,000 per person \n• 2-3 day packages: ₱3,000 - ₱8,000 \n• 4-7 day packages: ₱6,000 - ₱15,000 \n• Custom itineraries available \n\n*All packages include local guide + some meals*",

    "best time":
      "📅 **Best Time to Visit Eastern Visayas**: \n• Dry season: March to June (ideal for islands) \n• Whale shark season: November to May \n• Avoid: Typhoon season (July to October) \n• Festivals: \n  - Pintados-Kasadyaan (June, Tacloban) \n  - Sangyaw Festival (June, Tacloban) \n  - Buyogan Festival (August, Abuyog)",

    transport:
      "🚢 **Transportation in Eastern Visayas**: \n• Van transfers: ₱2,000 - ₱4,000/day \n• Boat rentals: ₱3,000 - ₱8,000/day (depends on island) \n• Ferry tickets: Included in packages \n• Tricycle tours: ₱500 - ₱1,500/half day \n\nNote: Some islands require boat transfers",

    include:
      "✅ **Package Includes**: \n• Accommodation (hotel/resort/beach cottage) \n• Daily breakfast \n• Local English-speaking guide \n• Transportation as per itinerary \n• Entrance fees to attractions \n• Boat transfers for island tours \n• 24/7 customer support",

    food: "🍽️ **Local Food to Try**: \n• Binagol (Tacloban) - Taro dessert in coconut shell \n• Moron - Chocolate rice cake \n• Suman Latik - Sticky rice with coconut caramel \n• Waray-Waray cuisine - Fresh seafood, simple preparation \n• Local specialties in each province",

    culture:
      "🎭 **Eastern Visayas Culture**: \n• People: Waray ethnic group, known for resilience \n• Language: Waray-Waray, Cebuano, English \n• History: Significant WWII sites, Spanish colonial heritage \n• Arts: Pintados body art tradition, traditional dances \n• Hospitality: Known for warm, welcoming locals",

    safety:
      "🛡️ **Travel Safety Tips**: \n• Check weather forecasts before island tours \n• Follow guide instructions during water activities \n• Keep valuables secure \n• Stay hydrated, use sunscreen \n• Emergency contact: Tour Connect support 24/7 \n• Local emergency: 911 (Philippines emergency number)",

    "group discount":
      "👥 **Group Discounts**: \n• 4-6 people: 8% OFF \n• 7-10 people: 12% OFF \n• 11+ people: 15% OFF \n• Student groups: Additional 5% discount \n• Custom quotes for large tour groups",

    family:
      "👨‍👩‍👧‍👦 **Family-Friendly Tours**: \n• Kalanggaman Island - Shallow waters, safe for kids \n• Tacloban City Tour - Educational, historical sites \n• Sohoton Caves (Samar) - Adventure for older kids \n• Ask about: Child discounts, family-sized accommodations",

    budget:
      "💸 **Budget Tips**: \n• Travel in groups to share costs \n• Visit during shoulder seasons (Feb, Oct) \n• Book early for ferry discounts \n• Try local eateries instead of hotels \n• Combine nearby attractions in one day",

    souvenir:
      "🎁 **Local Souvenirs**: \n• Handwoven bags (Biliran) \n• Shell crafts (Eastern Samar) \n• Wood carvings (Leyte) \n• Local delicacies (Binagol, Moron) \n• Pintados-inspired artwork",
  };

  // Quick questions for buttons
  const quickQuestions = [
    "Kalanggaman Island?",
    "Sambawan Island?",
    "Best time to visit?",
    "How to book?",
    "Price range?",
    "Group discounts?",
  ];

  // Check FAQ first
  const getFAQResponse = (question: string): string | null => {
    const lowerQ = question.toLowerCase();

    // Exact matches
    for (const [keyword, answer] of Object.entries(faqDatabase)) {
      if (lowerQ.includes(keyword)) {
        return answer;
      }
    }

    // Combined keyword checks
    if (lowerQ.includes("eastern visayas") || lowerQ.includes("region 8")) {
      return faqDatabase["popular destination"];
    }

    if (lowerQ.includes("whale shark") || lowerQ.includes("butanding")) {
      return faqDatabase["padre burgos"];
    }

    if (lowerQ.includes("island hopping") || lowerQ.includes("island tour")) {
      return faqDatabase["cuatro islas"];
    }

    if (lowerQ.includes("waterfall") || lowerQ.includes("falls")) {
      return "💦 **Waterfalls in Eastern Visayas**: \n• Tinago Falls (Biliran) - Multi-tiered, refreshing \n• Ulan-ulan Falls (Biliran) - Hidden gem, less crowded \n• Tagpong Lawas Falls (Samar) - Forest setting, natural pool \n• Most accessible: Tinago Falls (30-min hike)";
    }

    if (lowerQ.includes("history") || lowerQ.includes("historical")) {
      return "🏛️ **Historical Sites**: \n• MacArthur Landing Memorial (Palo, Leyte) - WWII history \n• Leyte Provincial Capitol - American colonial architecture \n• Sto. Niño Shrine (Tacloban) - Imelda Marcos museum \n• Tandaya Museum (Samar) - Regional artifacts \n• Red Beach (Palo) - WWII landing site";
    }

    if (lowerQ.includes("festival") || lowerQ.includes("event")) {
      return "🎉 **Festivals & Events**: \n• Pintados-Kasadyaan Festival (June) - Cultural dance, body paint \n• Sangyaw Festival (June) - Street dancing, parade \n• Buyogan Festival (August) - Bee-themed, Abuyog, Leyte \n• Balangiga Encounter Day (Sept 28) - Historical commemoration \n• Best to visit during June festivals!";
    }

    if (lowerQ.includes("include") || lowerQ.includes("what include")) {
      return "✅ **Package Includes**: \n• Hotel accommodation \n• Daily breakfast \n• Guided tours \n• 24/7 support \n• Transportation (if selected) \n• All entrance fees";
    }

    if (
      (lowerQ.includes("how") || lowerQ.includes("what")) &&
      lowerQ.includes("do")
    ) {
      return faqDatabase["how to book"];
    }

    return null;
  };

  // Get AI response (fallback)
  const getAIResponse = async (): Promise<string> => {
    // Simulate AI thinking
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const responses = [
      "I'd love to help! For detailed planning, please contact our travel experts at support@tourconnect.com or call +63 912 345 6789.",
      "Great question! Our team specializes in custom travel plans. Visit our website to browse all destinations and packages.",
      "I recommend checking our destination pages for photos, reviews, and detailed itineraries. Each package is customizable!",
      "For personalized assistance, our travel consultants are available 8AM-8PM. They can create the perfect itinerary for you!",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    // Get response
    const faqResponse = getFAQResponse(input);

    if (faqResponse) {
      // Instant FAQ response
      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: faqResponse,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
    } else {
      // AI response (simulated)
      const aiResponse = await getAIResponse();
      const botMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen ? "rotate-90 scale-110" : "hover:scale-110 hover:shadow-3xl"
        }`}
        style={{
          backgroundColor: BUTTON_BG,
          color: "white",
        }}
        aria-label="Chat with travel assistant"
      >
        {isOpen ? (
          <span className="text-2xl font-bold">✕</span>
        ) : (
          <div className="relative">
            <span className="text-3xl">🤖</span>
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
          </div>
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-28 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up border"
          style={{ borderColor: PRIMARY_COLOR }}
        >
          {/* Header */}
          <div
            className="rounded-t-2xl p-5"
            style={{ backgroundColor: HEADER_BG, color: "white" }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
                  style={{ borderColor: PRIMARY_COLOR, borderWidth: "2px" }}
                >
                  <span className="text-2xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tour Connect Assistant</h3>
                  <p className="text-sm opacity-90">Online • Ready to help</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-xs">Live</span>
              </div>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-5 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`mb-4 ${msg.sender === "user" ? "text-right" : ""}`}
              >
                <div
                  className={`inline-block max-w-[85%] rounded-2xl p-4 whitespace-pre-line ${
                    msg.sender === "user"
                      ? "rounded-br-none shadow-lg"
                      : "border rounded-bl-none shadow-sm"
                  }`}
                  style={{
                    backgroundColor: msg.sender === "user" ? USER_BG : BOT_BG,
                    color: msg.sender === "user" ? "white" : PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    borderWidth: msg.sender === "user" ? "0" : "1px",
                  }}
                >
                  {msg.text}
                </div>
                <div
                  className={`text-xs mt-1 px-1 ${
                    msg.sender === "user" ? "text-right" : ""
                  }`}
                  style={{ color: PRIMARY_COLOR, opacity: 0.7 }}
                >
                  {msg.timestamp.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="mb-4">
                <div
                  className="inline-block border rounded-2xl rounded-bl-none p-4 shadow-sm"
                  style={{
                    backgroundColor: BOT_BG,
                    borderColor: PRIMARY_COLOR,
                  }}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{ backgroundColor: PRIMARY_COLOR }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: PRIMARY_COLOR,
                        animationDelay: "0.1s",
                      }}
                    ></div>
                    <div
                      className="w-2 h-2 rounded-full animate-bounce"
                      style={{
                        backgroundColor: PRIMARY_COLOR,
                        animationDelay: "0.2s",
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div
            className="border-t p-4"
            style={{ backgroundColor: "#F9F9F9", borderColor: PRIMARY_COLOR }}
          >
            <p
              className="text-xs mb-2 font-medium"
              style={{ color: PRIMARY_COLOR }}
            >
              Quick questions:
            </p>
            <div className="flex flex-wrap gap-2">
              {quickQuestions.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 border"
                  style={{
                    backgroundColor: "white",
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    borderWidth: "1px",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "#F0F0F0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "white")
                  }
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div
            className="border-t p-5 bg-white rounded-b-2xl"
            style={{ borderColor: PRIMARY_COLOR }}
          >
            <div className="flex gap-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about destinations, bookings, prices..."
                className="flex-1 rounded-xl px-4 py-3 focus:outline-none transition-all"
                style={{
                  borderColor: PRIMARY_COLOR,
                  borderWidth: "1px",
                  color: PRIMARY_COLOR,
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 rounded-xl text-white transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: BUTTON_BG,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = BUTTON_HOVER)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = BUTTON_BG)
                }
              >
                <span>Send</span>
                <span className="text-lg">↑</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add CSS animation */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </>
  );
};

export default HybridChatbot;
