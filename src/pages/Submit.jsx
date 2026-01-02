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

  /* =========================
     SAVE TO LOCAL STORAGE
  ========================= */
  function saveToLocalHistory(messageId) {
    const history =
      JSON.parse(localStorage.getItem("songfess_history")) || [];

    history.unshift({
      id: messageId,
      savedAt: Date.now(),
    });

    localStorage.setItem(
      "songfess_history",
      JSON.stringify(history)
    );
  }

  /* =========================
     SEARCH SONG
  ========================= */
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

  /* =========================
     SUBMIT
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault();

    if (!selectedSong) {
      Swal.fire({
        icon: "warning",
        title: "Song Required",
        text: "Please choose a song first",
        confirmButtonColor: "#10b981",
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
      });
      return;
    }

    saveToLocalHistory(data.id);

    Swal.fire({
      title: "Message Sent",
      text: "Your message has been successfully delivered.",
      icon: "success",
      timer: 1600,
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
            <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto mb-4 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
              <FiMusic className="text-2xl sm:text-3xl text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
              Send a Message
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Share your feelings through music
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Recipient */}
            <div>
              <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                <FiUser className="text-emerald-600" />
                Recipient
              </label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className="w-full border-2 border-gray-200 px-5 py-3.5 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
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
                className="w-full border-2 border-gray-200 px-5 py-3.5 rounded-2xl h-32 resize-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
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
                  className="w-full border-2 border-gray-200 px-5 py-3.5 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none transition-all"
                />

                {results.length > 0 && (
                  <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-2xl border border-gray-100 max-h-72 overflow-y-auto">
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
                        className="flex items-center gap-4 w-full px-5 py-4 hover:bg-emerald-50 transition text-left border-b last:border-0"
                      >
                        <img
                          src={song.artworkUrl100}
                          className="w-14 h-14 rounded-xl object-cover"
                          alt={song.trackName}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">
                            {song.trackName}
                          </p>
                          <p className="text-sm text-gray-500 truncate mb-1">
                            {song.artistName}
                          </p>

                          {song.previewUrl && (
                            <audio
                              controls
                              src={song.previewUrl}
                              className="w-full h-7"
                              onClick={(e) => e.stopPropagation()}
                            />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Selected Song Preview */}
              {selectedSong && (
                <div className="mt-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                  <div className="flex items-center gap-2 mb-3">
                    <FiCheck className="text-emerald-600" />
                    <p className="text-sm font-semibold text-emerald-700">
                      Selected Song
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    <img
                      src={selectedSong.artworkUrl100}
                      className="w-16 h-16 rounded-xl object-cover shadow-sm"
                      alt={selectedSong.trackName}
                    />

                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">
                        {selectedSong.trackName}
                      </p>
                      <p className="text-sm text-gray-500 truncate mb-2">
                        {selectedSong.artistName}
                      </p>

                      {selectedSong.previewUrl ? (
                        <audio
                          controls
                          src={selectedSong.previewUrl}
                          className="w-full h-8"
                        />
                      ) : (
                        <p className="text-xs text-gray-400 italic">
                          Preview not available
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:opacity-60 transition-all"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Your message will be saved in history for 7 days
          </p>
        </div>
      </div>
    </div>
  );
}
