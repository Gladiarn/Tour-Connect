import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface Destination {
  _id: string;
  name: string;
  rating: number;
  images: string[];
  description: string;
  budget: number;
  location: string;
  activityType: string;
}

const HybridChatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "👋 Hello! I'm Toury, your travel assistant at Tour Connect! How can I help you plan your dream vacation today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [popularDestinations, setPopularDestinations] = useState<Destination[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Fetch popular destinations on component mount
  useEffect(() => {
    fetchPopularDestinations();
  }, []);

  // Fetch real popular destinations from your API
  const fetchPopularDestinations = async () => {
    setIsFetchingData(true);
    try {
      const response = await fetch('http://localhost:5000/api/destination/popular', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ search: '' }), // Empty search to get all popular
      });
      
      if (response.ok) {
        const data = await response.json();
        setPopularDestinations(data);
        console.log('Fetched popular destinations:', data);
      }
    } catch (error) {
      console.error('Failed to fetch popular destinations:', error);
    } finally {
      setIsFetchingData(false);
    }
  };

  // Generate response with real popular destinations
  const getPopularDestinationsResponse = (): string => {
    if (isFetchingData) {
      return "⏳ Fetching our latest popular destinations for you...";
    }

    if (popularDestinations.length === 0) {
      return "🌟 **Our Popular Eastern Visayas Destinations**: \n• Kalanggaman Island - Famous sandbar \n• Sambawan Island - Marine sanctuary \n• Cuatro Islas - Four unique islands \n• San Juanico Bridge - Longest bridge \n• Padre Burgos - Whale shark watching";
    }

    let response = "🌟 **Our Most Popular Destinations**:\n\n";
    
    popularDestinations.slice(0, 5).forEach((dest) => {
      const emoji = getDestinationEmoji(dest.activityType);
      response += `${emoji} **${dest.name}**\n`;
      response += `   • Rating: ${'★'.repeat(Math.round(dest.rating))} (${dest.rating}/5)\n`;
      response += `   • Location: ${dest.location}\n`;
      response += `   • Budget: ₱${dest.budget?.toLocaleString() || 'Varies'}\n`;
      response += `   • Type: ${dest.activityType}\n\n`;
    });

    response += "💡 *Tip: Ask about any destination by name for more details!*";
    return response;
  };

  // Generate detailed response for a specific destination
  const getDestinationResponse = (destination: Destination): string => {
    const emoji = getDestinationEmoji(destination.activityType);
    return `${emoji} **${destination.name}**\n` +
           `📍 ${destination.location}\n` +
           `⭐ ${'★'.repeat(Math.round(destination.rating))} (${destination.rating}/5)\n` +
           `💰 Budget: ₱${destination.budget?.toLocaleString() || 'Contact for pricing'}\n` +
           `🎯 Activity: ${destination.activityType}\n` +
           `📝 ${destination.description?.substring(0, 150)}${destination.description?.length > 150 ? '...' : ''}\n\n` +
           `🔗 *Visit the destination page for photos and booking!*`;
  };

  // Get appropriate emoji for activity type
  const getDestinationEmoji = (activityType: string): string => {
    const type = activityType.toLowerCase();
    if (type.includes('beach') || type.includes('island')) return '🏝️';
    if (type.includes('mountain') || type.includes('hiking')) return '⛰️';
    if (type.includes('diving') || type.includes('snorkeling')) return '🐠';
    if (type.includes('culture') || type.includes('historical')) return '🏛️';
    if (type.includes('adventure')) return '🚀';
    if (type.includes('nature')) return '🌿';
    return '📍';
  };

  // Get AI response (fallback)
  const getAIResponse = async (): Promise<string> => {
    // Simulate AI thinking
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const responses = [
      "I'd love to help! For detailed planning, please contact our travel experts at support@tourconnect.com or call +63 912 345 6789.",
      "Great question! Our team specializes in custom travel plans. Visit our website to browse all destinations and packages.",
      "I recommend checking our destination pages for photos, reviews, and detailed itineraries. Each package is customizable!",
      "For personalized assistance, our travel consultants are available 8AM-8PM. They can create the perfect itinerary for you!",
    ];
    
    return responses[Math.floor(Math.random() * responses.length)];
  };

  // Check FAQ first
  const getFAQResponse = (question: string): string | null => {
    const lowerQ = question.toLowerCase();
    
    // Check for popular destinations questions
    if (lowerQ.includes('popular') || 
        lowerQ.includes('recommend') || 
        lowerQ.includes('best place') || 
        lowerQ.includes('top destination') ||
        lowerQ.includes('what to visit')) {
      return getPopularDestinationsResponse();
    }
    
    // Check for destination names in the question
    if (popularDestinations.length > 0) {
      for (const dest of popularDestinations) {
        const destNameLower = dest.name.toLowerCase();
        if (lowerQ.includes(destNameLower) || 
            (destNameLower.includes(lowerQ) && lowerQ.length > 3)) {
          return getDestinationResponse(dest);
        }
      }
    }
    
    // Static FAQ for common questions
    const staticFAQ: { [key: string]: string } = {
      'how to book': "📝 **Booking Process**: \n1️⃣ Choose destination \n2️⃣ Select dates on calendar \n3️⃣ Add transportation (optional) \n4️⃣ Click 'Book Now' button \n5️⃣ Complete payment \n\nConfirmation email sent instantly!",
      'price': "💰 **Price Range**: \n• Budget: ₱3,000 - ₱5,000 (3 days) \n• Standard: ₱5,000 - ₱10,000 \n• Premium: ₱10,000 - ₱15,000 \n\n*Prices per person, include hotel + breakfast*",
      'cancel': "❌ **Cancellation Policy**: \n• Free cancellation: 7+ days before trip \n• 50% refund: 3-7 days before \n• No refund: Within 3 days \n• Contact support for emergencies",
      'contact': "📞 **Contact Us**: \n• Email: support@tourconnect.com \n• Phone: +63 912 345 6789 \n• Hours: 8AM - 8PM daily \n• Live chat: Right here! 😊",
      'transport': "🚗 **Transportation Options**: \n• Van Rental: ₱2,500/day (6-10 persons) \n• Boat Transfer: ₱1,800/ride \n• Airport Pickup: Included in premium packages \n\nSelect during booking!",
      'group discount': "👥 **Group Discounts**: \n• 5-9 people: 10% OFF \n• 10+ people: 15% OFF \n• Custom quotes for 20+ \nContact us for large groups!",
    };
    
    // Check static FAQ
    for (const [keyword, answer] of Object.entries(staticFAQ)) {
      if (lowerQ.includes(keyword)) {
        return answer;
      }
    }
    
    // Combined keyword checks
    if ((lowerQ.includes('best') || lowerQ.includes('when')) && lowerQ.includes('visit')) {
      return "🌞 **Best Time to Visit Eastern Visayas**: \n• Dry season: March to June (ideal for islands) \n• Whale shark season: November to May \n• Avoid: Typhoon season (July to October)";
    }
    
    if (lowerQ.includes('include') || lowerQ.includes('what include')) {
      return "✅ **Package Includes**: \n• Hotel accommodation \n• Daily breakfast \n• Guided tours \n• 24/7 support \n• Transportation (if selected) \n• All entrance fees";
    }
    
    return null;
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Handle send message
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Get response
    const faqResponse = getFAQResponse(input);
    
    if (faqResponse) {
      // Instant FAQ response
      setTimeout(() => {
        const botMessage: Message = {
          id: messages.length + 2,
          text: faqResponse,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        setIsLoading(false);
      }, 500);
    } else {
      // AI response (simulated)
      const aiResponse = await getAIResponse();
      const botMessage: Message = {
        id: messages.length + 2,
        text: aiResponse,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setIsLoading(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Handle quick question click
  const handleQuickQuestion = (question: string) => {
    setInput(question);
    setTimeout(() => handleSend(), 100);
  };

  // Get quick questions based on fetched data
  const getQuickQuestions = (): string[] => {
    const baseQuestions = [
      "Popular destinations?",
      "How to book?",
      "Price range?",
      "Best time to visit?",
    ];

    if (popularDestinations.length > 0) {
      // Add first destination name as question
      const firstDest = popularDestinations[0];
      if (firstDest) {
        baseQuestions.push(`Tell me about ${firstDest.name}`);
      }
      // Add second destination if available
      if (popularDestinations.length > 1) {
        const secondDest = popularDestinations[1];
        baseQuestions.push(`What is ${secondDest.name}?`);
      }
    }

    baseQuestions.push("Contact support?");
    return baseQuestions;
  };

  // Your colors
  const PRIMARY_COLOR = '#3C3D37';
  const HEADER_BG = '#697565';
  const USER_BG = '#3C3D37';
  const BOT_BG = '#F5F5F5';
  const BUTTON_BG = '#3C3D37';
  const BUTTON_HOVER = '#55564F';

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full shadow-2xl transition-all duration-300 flex items-center justify-center ${
          isOpen 
            ? 'rotate-90 scale-110' 
            : 'hover:scale-110 hover:shadow-3xl'
        }`}
        style={{
          backgroundColor: BUTTON_BG,
          color: 'white'
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
        <div className="fixed bottom-28 right-6 z-50 w-[400px] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col animate-slide-up border" style={{ borderColor: PRIMARY_COLOR }}>
          {/* Header */}
          <div className="rounded-t-2xl p-5" style={{ backgroundColor: HEADER_BG, color: 'white' }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center" style={{ borderColor: PRIMARY_COLOR, borderWidth: '2px' }}>
                  <span className="text-2xl">✈️</span>
                </div>
                <div>
                  <h3 className="font-bold text-lg">Tour Connect Assistant</h3>
                  <p className="text-sm opacity-90">
                    {isFetchingData ? 'Loading destinations...' : `${popularDestinations.length} destinations available`}
                  </p>
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
                className={`mb-4 ${msg.sender === 'user' ? 'text-right' : ''}`}
              >
                <div
                  className={`inline-block max-w-[85%] rounded-2xl p-4 whitespace-pre-line ${
                    msg.sender === 'user'
                      ? 'rounded-br-none shadow-lg'
                      : 'border rounded-bl-none shadow-sm'
                  }`}
                  style={{
                    backgroundColor: msg.sender === 'user' ? USER_BG : BOT_BG,
                    color: msg.sender === 'user' ? 'white' : PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    borderWidth: msg.sender === 'user' ? '0' : '1px'
                  }}
                >
                  {msg.text}
                </div>
                <div className={`text-xs mt-1 px-1 ${msg.sender === 'user' ? 'text-right' : ''}`} style={{ color: PRIMARY_COLOR, opacity: 0.7 }}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="mb-4">
                <div className="inline-block border rounded-2xl rounded-bl-none p-4 shadow-sm" style={{ backgroundColor: BOT_BG, borderColor: PRIMARY_COLOR }}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY_COLOR }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY_COLOR, animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: PRIMARY_COLOR, animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions */}
          <div className="border-t p-4" style={{ backgroundColor: '#F9F9F9', borderColor: PRIMARY_COLOR }}>
            <p className="text-xs mb-2 font-medium" style={{ color: PRIMARY_COLOR }}>Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {getQuickQuestions().map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuickQuestion(q)}
                  className="text-xs px-3 py-2 rounded-full transition-all duration-200 hover:scale-105 active:scale-95 border"
                  style={{
                    backgroundColor: 'white',
                    color: PRIMARY_COLOR,
                    borderColor: PRIMARY_COLOR,
                    borderWidth: '1px'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#F0F0F0'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="border-t p-5 bg-white rounded-b-2xl" style={{ borderColor: PRIMARY_COLOR }}>
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
                  borderWidth: '1px',
                  color: PRIMARY_COLOR
                }}
                disabled={isLoading}
              />
              <button
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 rounded-xl text-white transition-all duration-300 shadow-md hover:shadow-lg font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: BUTTON_BG
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = BUTTON_HOVER}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = BUTTON_BG}
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
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce {
          animation: bounce 0.6s infinite;
        }
      `}</style>
    </>
  );
};

export default HybridChatbot;