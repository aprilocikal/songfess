import Swal from "sweetalert2";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";

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
     (DIBACA OLEH History.jsx)
  ========================= */
  function saveToLocalHistory(messageId) {
    const history = JSON.parse(localStorage.getItem("songfess_history")) || [];

    history.unshift({
      id: messageId,
      savedAt: Date.now(),
    });

    localStorage.setItem("songfess_history", JSON.stringify(history));
  }

  /* =========================
     SEARCH SONG (iTunes via Proxy)
  ========================= */
  useEffect(() => {
    if (query.length < 2 || query === lastSelectedQuery.current) {
      setResults([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `/itunes/search?term=${encodeURIComponent(
            query
          )}&media=music&entity=song&limit=6`
        );
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
        title: "Song Required 🎵",
        text: "Please choose a song first",
        confirmButtonColor: "#16a34a",
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
        text: "Failed to send message",
      });
      return;
    }

    // 🔥 INI KUNCI HISTORY
    saveToLocalHistory(data.id);

    Swal.fire({
      title: "Message Sent",
      text: "Your message has been successfully delivered.",
      icon: "success",
      timer: 1600,
      showConfirmButton: false,
      background: "#ffffff",
      color: "#374151", // gray-700
      iconColor: "#10b981", // emerald-500
      customClass: {
        popup: "rounded-2xl shadow-xl",
        title: "text-lg font-semibold",
        content: "text-sm text-gray-600",
      },
      didOpen: () => {
        Swal.showLoading(false);
      },
    }).then(() => {
      navigate("/history");
    });
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12 px-4 pb-20">
        <div className="bg-white rounded-3xl shadow-xl p-8 space-y-6">
          <h1 className="text-4xl font-bold text-center text-emerald-600">
            Send a Message
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TO */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                To
              </label>
              <input
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter recipient name..."
                className="w-full border-2 px-5 py-4 rounded-2xl
                focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>

            {/* MESSAGE */}
            <div>
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your heartfelt message..."
                className="w-full border-2 px-5 py-4 rounded-2xl h-36 resize-none
                focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
                required
              />
            </div>

            {/* SONG SEARCH */}
            <div className="relative">
              <label className="block mb-2 text-sm font-semibold text-gray-700">
                Choose a Song
              </label>

              <input
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedSong(null);
                }}
                placeholder="Search for a song..."
                className="w-full border-2 px-5 py-4 rounded-2xl
                focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />

              {/* DROPDOWN */}
              {results.length > 0 && (
                <div className="absolute z-50 mt-2 w-full bg-white rounded-2xl shadow-xl max-h-72 overflow-y-auto">
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
                      className="flex items-center gap-4 w-full px-5 py-4 hover:bg-emerald-50 text-left"
                    >
                      <img
                        src={song.artworkUrl100}
                        className="w-12 h-12 rounded-xl"
                        alt=""
                      />
                      <div>
                        <p className="font-semibold text-sm">
                          {song.trackName}
                        </p>
                        <p className="text-xs text-gray-500">
                          {song.artistName}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SELECTED SONG */}
            {selectedSong && (
              <div className="bg-emerald-50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSong.artworkUrl100}
                    className="w-16 h-16 rounded-xl"
                    alt=""
                  />
                  <div>
                    <p className="font-bold">{selectedSong.trackName}</p>
                    <p className="text-sm text-gray-600">
                      {selectedSong.artistName}
                    </p>
                  </div>
                </div>

                {selectedSong.previewUrl && (
                  <audio
                    controls
                    src={selectedSong.previewUrl}
                    className="w-full"
                  />
                )}
              </div>
            )}

            {/* SUBMIT */}
            <button
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-green-600
              text-white py-4 rounded-2xl font-bold disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
