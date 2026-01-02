import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { FiClock, FiInbox, FiMusic, FiUser, FiCalendar } from "react-icons/fi";

const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000; // 7 days

export default function History() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentAudioRef = useRef(null);

  useEffect(() => {
    loadHistory();
  }, []);

  async function loadHistory() {
    const raw = JSON.parse(localStorage.getItem("songfess_history")) || [];
    const now = Date.now();

    // Filter valid messages (not expired)
    const valid = raw.filter((item) => now - item.savedAt < EXPIRE_TIME);

    // Update localStorage with valid items only
    localStorage.setItem("songfess_history", JSON.stringify(valid));

    if (valid.length === 0) {
      setMessages([]);
      setLoading(false);
      return;
    }

    // Fetch messages from Supabase
    const ids = valid.map((i) => i.id);
    const { data } = await supabase
      .from("messages")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: false });

    setMessages(data || []);
    setLoading(false);
  }

  // Auto pause previous audio when new one plays
  function handlePlay(e) {
    const audio = e.target;

    if (currentAudioRef.current && currentAudioRef.current !== audio) {
      currentAudioRef.current.pause();
    }

    currentAudioRef.current = audio;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 lg:pt-12 pb-12 sm:pb-16">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 animate-fade-in">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-3">
            Your History
          </h1>
          <p className="text-sm sm:text-base text-gray-600">
            Messages you've sent in the last 7 days
          </p>
        </div>

        {/* Info Banner */}
        <div
          className="bg-white/70 backdrop-blur-sm border-2 border-emerald-200/50 rounded-xl sm:rounded-2xl p-3 sm:p-4 mb-6 sm:mb-8 flex items-center gap-2 sm:gap-3 animate-fade-in shadow-sm"
          style={{ animationDelay: "100ms" }}
        >
          <FiClock className="text-lg sm:text-xl text-emerald-600 flex-shrink-0" />
          <p className="text-xs sm:text-sm text-gray-700">
            History automatically expires after{" "}
            <span className="font-bold text-emerald-600">7 days</span>
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16 sm:py-20">
            <div className="inline-block w-14 h-14 sm:w-16 sm:h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-sm sm:text-base text-gray-600">
              Loading history...
            </p>
          </div>
        )}

        {/* Empty State */}
        {!loading && messages.length === 0 && (
          <div className="text-center py-16 sm:py-20 animate-fade-in">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <FiInbox className="text-4xl sm:text-5xl text-emerald-400" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-2 sm:mb-3">
              No History Yet
            </h3>
            <p className="text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 max-w-md mx-auto">
              Your sent messages will appear here and expire after 7 days
            </p>
            <Link
              to="/submit"
              className="inline-block bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Send Your First Message
            </Link>
          </div>
        )}

        {/* Messages List */}
        <div className="space-y-4 sm:space-y-5">
          {messages.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl sm:rounded-3xl p-4 sm:p-5 lg:p-6 shadow-md hover:shadow-xl hover:scale-[1.01] transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${idx * 80}ms` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4 sm:mb-5">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center text-white text-base sm:text-lg font-bold shadow-md">
                    {m.recipient.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-0.5">Sent to</p>
                    <p className="font-bold text-sm sm:text-base text-gray-800">
                      {m.recipient}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-gray-400 bg-gray-50 px-2.5 sm:px-3 py-1.5 rounded-full">
                  <FiCalendar className="text-xs flex-shrink-0" />
                  <span className="hidden sm:inline">
                    {new Date(m.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="sm:hidden">
                    {new Date(m.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Message */}
              <div className="mb-4 sm:mb-5 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl border border-emerald-100/50">
                <p className="text-xs sm:text-sm text-emerald-700 font-semibold mb-1.5 sm:mb-2">
                  Your Message:
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                  "{m.message}"
                </p>
              </div>

              {/* Song Info */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 bg-white rounded-xl sm:rounded-2xl border border-gray-100 group-hover:border-emerald-200 transition-colors">
                {m.cover && (
                  <img
                    src={m.cover}
                    alt="cover"
                    className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-lg sm:rounded-xl object-cover shadow-md group-hover:scale-105 transition-transform duration-300 flex-shrink-0"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm sm:text-base text-gray-800 mb-0.5 sm:mb-1 truncate">
                    {m.song_title}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-600 truncate">
                    {m.artist}
                  </p>
                </div>

                <FiMusic className="text-emerald-500 text-xl sm:text-2xl flex-shrink-0" />
              </div>

              {/* Audio Player */}
              {m.preview && (
                <div className="mt-3 sm:mt-4 bg-gray-50 rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-gray-100">
                  <audio
                    controls
                    src={m.preview}
                    className="w-full h-8 sm:h-10"
                    onPlay={handlePlay}
                    style={{ maxHeight: "40px" }}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Animations */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
}
