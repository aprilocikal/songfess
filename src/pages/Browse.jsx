import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiX,
  FiMessageCircle,
  FiMusic,
  FiArrowRight,
} from "react-icons/fi";

export default function Browse() {
  const [query, setQuery] = useState("");
  const [messages, setMessages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
        },
        () => fetchMessages()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  async function fetchMessages() {
    setLoading(true);

    const { data, error } = await supabase.from("messages").select("*");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setFiltered([]);
    setLoading(false);
  }

  function handleSearch(value) {
    setQuery(value);

    if (!value.trim()) {
      setFiltered([]);
      return;
    }

    const q = value.toLowerCase();

    const result = messages.filter(
      (m) =>
        m.recipient?.toLowerCase().includes(q) ||
        m.message?.toLowerCase().includes(q) ||
        m.song_title?.toLowerCase().includes(q) ||
        m.artist?.toLowerCase().includes(q)
    );

    setFiltered(result);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 lg:pt-12 pb-12 sm:pb-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Browse Messages
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Type a name or keyword to find a message
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 sm:mb-10">
          <div className="absolute inset-y-0 left-4 sm:left-5 flex items-center pointer-events-none">
            <FiSearch className="text-xl sm:text-2xl text-gray-400" />
          </div>

          <input
            placeholder="Search by name, message, song, or artist..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-sm border-2 border-gray-200 pl-12 sm:pl-16 pr-12 sm:pr-14 py-3.5 sm:py-4 lg:py-5 rounded-xl sm:rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none shadow-lg text-base sm:text-lg transition-all"
          />

          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute inset-y-0 right-4 sm:right-5 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Empty State - No Search */}
        {!query && !loading && (
          <div className="text-center py-16 sm:py-20 lg:py-24">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <FiSearch className="text-4xl sm:text-5xl text-emerald-400" />
            </div>
            <p className="text-base sm:text-lg text-gray-600">
              Start typing to search messages
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-block w-14 h-14 sm:w-16 sm:h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Loading messages...
            </p>
          </div>
        )}

        {/* Results */}
        <div className="space-y-4 sm:space-y-5">
          {filtered.map((m) => (
            <Link
              key={m.id}
              to={`/view/${m.id}`}
              className="block bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 hover:shadow-xl hover:border-emerald-300 transition-all duration-300 group"
            >
              <div className="flex items-center gap-2 mb-3">
                <FiMessageCircle className="text-base sm:text-lg text-emerald-500 flex-shrink-0" />
                <p className="font-bold text-sm sm:text-base text-gray-800">
                  To: <span className="text-emerald-600">{m.recipient}</span>
                </p>
              </div>

              <p className="italic text-sm sm:text-base text-gray-700 mb-4 line-clamp-3 leading-relaxed">
                "{m.message}"
              </p>

              {m.song_title && (
                <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl border border-emerald-100/50">
                  <img
                    src={m.cover}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover shadow-sm flex-shrink-0"
                    alt={m.song_title}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                      {m.song_title}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                      {m.artist}
                    </p>
                  </div>
                  <FiMusic className="text-lg sm:text-xl text-emerald-500 flex-shrink-0" />
                </div>
              )}

              <div className="mt-3 sm:mt-4 flex items-center justify-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-xs sm:text-sm font-semibold">
                  View Details
                </span>
                <FiArrowRight className="text-sm" />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State - No Results */}
        {query && !loading && filtered.length === 0 && (
          <div className="text-center py-16 sm:py-20">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-4 sm:mb-6 bg-gray-100 rounded-2xl flex items-center justify-center">
              <FiSearch className="text-4xl sm:text-5xl text-gray-300" />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-700 mb-2">
              No messages found
            </h3>
            <p className="text-sm sm:text-base text-gray-500">
              Try another name or keyword
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
