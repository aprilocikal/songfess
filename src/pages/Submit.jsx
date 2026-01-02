import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import {
  FiMusic,
  FiUser,
  FiMessageSquare,
  FiSearch,
  FiCheck,
} from "react-icons/fi";

export default function Submit() {
  const navigate = useNavigate();

  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [selectedSong, setSelectedSong] = useState(null);
  const [loading, setLoading] = useState(false);

  const lastSelectedQuery = useRef("");

  // Save to localStorage
  function saveToLocalHistory(messageId) {
    const history = JSON.parse(localStorage.getItem("songfess_history")) || [];
    history.unshift({ id: messageId, savedAt: Date.now() });
    localStorage.setItem("songfess_history", JSON.stringify(history));
  }

  // Search song from iTunes API
  useEffect(() => {
    if (query.length < 2 || query === lastSelectedQuery.current) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const isLocalhost = location.hostname === "localhost";

        const url = isLocalhost
          ? `/itunes/search?term=${encodeURIComponent(
              query
            )}&media=music&entity=song&limit=6`
          : `${
              import.meta.env.VITE_SUPABASE_URL
            }/functions/v1/search-song?term=${encodeURIComponent(query)}`;

        const res = await fetch(url);
        const data = await res.json();

        setResults(data.results || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [query]);

  // Submit form
  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSong) {
      Swal.fire({
        icon: "warning",
        title: "Song Required",
        text: "Please choose a song first",
        confirmButtonColor: "#10b981",
        iconColor: "#f59e0b",
      });
      return;
    }

    setLoading(true);

    const { data, error } = await supabase
      .from("messages")
      .insert({
        recipient,
        message,
        song_title: selectedSong.trackName,
        artist: selectedSong.artistName,
        cover: selectedSong.artworkUrl100,
        preview: selectedSong.previewUrl,
      })
      .select()
      .single();

    setLoading(false);

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: error.message,
        confirmButtonColor: "#10b981",
      });
      return;
    }

    saveToLocalHistory(data.id);

    Swal.fire({
      title: "Message Sent! 🎉",
      text: "Your message has been successfully delivered.",
      icon: "success",
      timer: 1800,
      showConfirmButton: false,
      iconColor: "#10b981",
    }).then(() => navigate("/history"));
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 lg:pt-12 pb-12 sm:pb-16">
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 p-5 sm:p-6 lg:p-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiMusic className="text-2xl sm:text-3xl text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2">
              Send a Message
            </h1>
            <p className="text-xs sm:text-sm text-gray-600">
              Share your feelings through music
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            {/* Recipient */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUser className="text-emerald-600" />
                Recipient
              </label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Who is this message for?"
                className="w-full border-2 border-gray-200 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none text-sm sm:text-base transition-all"
                required
              />
            </div>

            {/* Message */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiMessageSquare className="text-emerald-600" />
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message here..."
                className="w-full border-2 border-gray-200 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl h-28 sm:h-32 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none resize-none text-sm sm:text-base transition-all"
                required
              />
            </div>

            {/* Song Search */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiSearch className="text-emerald-600" />
                Choose a Song
              </label>
              <div className="relative">
                <input
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setSelectedSong(null);
                  }}
                  placeholder="Search for a song..."
                  className="w-full border-2 border-gray-200 px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl sm:rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none text-sm sm:text-base transition-all"
                />

                {/* Search Results Dropdown */}
                {results.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 max-h-64 sm:max-h-72 overflow-y-auto">
                    {results.map((song) => (
                      <button
                        key={song.trackId}
                        type="button"
                        onClick={() => {
                          setSelectedSong(song);
                          setQuery(song.trackName);
                          lastSelectedQuery.current = song.trackName;
                          setResults([]);
                        }}
                        className="flex items-center gap-3 sm:gap-4 w-full px-4 sm:px-5 py-3 sm:py-4 hover:bg-emerald-50 transition-colors text-left border-b border-gray-50 last:border-0"
                      >
                        <img
                          src={song.artworkUrl100}
                          className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover shadow-sm flex-shrink-0"
                          alt={song.trackName}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                            {song.trackName}
                          </p>
                          <p className="text-xs sm:text-sm text-gray-500 truncate">
                            {song.artistName}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Song Preview */}
              {selectedSong && (
                <div className="mt-3 p-3 sm:p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-2">
                    <FiCheck className="text-emerald-600" />
                    <p className="text-xs sm:text-sm font-semibold text-emerald-700">
                      Selected Song
                    </p>
                  </div>
                  <audio
                    controls
                    src={selectedSong.previewUrl}
                    className="w-full h-8 sm:h-10"
                    style={{ maxHeight: "40px" }}
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-3 sm:py-3.5 lg:py-4 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-300"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Sending...
                </span>
              ) : (
                "Send Message"
              )}
            </button>
          </form>

          {/* Helper Text */}
          <p className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-gray-500">
            Your message will be saved in history for 7 days
          </p>
        </div>
      </div>
    </div>
  );
}
