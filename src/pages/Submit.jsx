import Swal from "sweetalert2"
import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { supabase } from "../lib/supabase"

export default function Submit() {
  const navigate = useNavigate()

  const [recipient, setRecipient] = useState("")
  const [message, setMessage] = useState("")
  const [query, setQuery] = useState("")
  const [results, setResults] = useState([])
  const [selectedSong, setSelectedSong] = useState(null)
  const [loading, setLoading] = useState(false)

  // 🔑 kunci agar suggestion hanya muncul sekali
  const lastSelectedQuery = useRef("")

  /* =========================
     SEARCH SONG (iTunes API)
  ========================= */
  useEffect(() => {
    // ❌ jangan search kalau:
    // - query < 2
    // - query sama dengan lagu yg sudah dipilih
    if (
      query.length < 2 ||
      query === lastSelectedQuery.current
    ) {
      setResults([])
      return
    }

    const delay = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://itunes.apple.com/search?term=${encodeURIComponent(
            query
          )}&media=music&limit=5`
        )
        const data = await res.json()
        setResults(data.results || [])
      } catch (err) {
        console.error(err)
      }
    }, 400)

    return () => clearTimeout(delay)
  }, [query])

  /* =========================
     SAVE TO LOCAL HISTORY
     (DIBACA OLEH History.jsx)
  ========================= */
  function saveToLocalHistory(messageId) {
    const history =
      JSON.parse(localStorage.getItem("songfess_history")) || []

    history.unshift({
      id: messageId,
      savedAt: Date.now(),
    })

    localStorage.setItem(
      "songfess_history",
      JSON.stringify(history)
    )
  }

  /* =========================
     SUBMIT
  ========================= */
  async function handleSubmit(e) {
    e.preventDefault()

    if (!selectedSong) {
      Swal.fire({
        icon: "warning",
        title: "Song Required 🎵",
        text: "Please choose a song first",
        confirmButtonColor: "#16a34a",
      })
      return
    }

    setLoading(true)

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
      .single()

    setLoading(false)

    if (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to send message",
        confirmButtonColor: "#dc2626",
      })
      return
    }

    // ✅ SAMBUNG KE HISTORY
    saveToLocalHistory(data.id)

    Swal.fire({
      icon: "success",
      title: "Message Sent",
      text: "Your message has been sent successfully",
      confirmButtonColor: "#16a34a",
      timer: 1500,
      showConfirmButton: false,
    }).then(() => navigate("/history"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      <div className="max-w-2xl mx-auto mt-12 px-4 pb-12">
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
                className="w-full border-2 border-gray-200 px-5 py-4 rounded-2xl
                  outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
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
                className="w-full border-2 border-gray-200 px-5 py-4 rounded-2xl h-36 resize-none
                  outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
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
                  setQuery(e.target.value)
                  setSelectedSong(null) // reset jika user ketik ulang
                }}
                placeholder="Search for a song..."
                className="w-full border-2 border-gray-200 px-5 py-4 rounded-2xl
                  outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200"
              />

              {results.length > 0 && (
                <div className="absolute z-20 w-full bg-white rounded-2xl shadow-xl mt-2 overflow-hidden">
                  {results.map((song) => (
                    <button
                      key={song.trackId}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault() // 🔥 FIX DOUBLE CLICK
                        setSelectedSong(song)
                        setQuery(song.trackName)
                        lastSelectedQuery.current = song.trackName
                        setResults([])
                      }}
                      className="flex items-center gap-4 w-full px-5 py-4 hover:bg-emerald-50 text-left"
                    >
                      <img
                        src={song.artworkUrl100}
                        className="w-14 h-14 rounded-xl"
                        alt=""
                      />
                      <div>
                        <p className="font-semibold">
                          {song.trackName}
                        </p>
                        <p className="text-sm text-gray-500">
                          {song.artistName}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* SELECTED SONG + PREVIEW */}
            {selectedSong && (
              <div className="bg-emerald-50 p-4 rounded-2xl space-y-3">
                <div className="flex items-center gap-4">
                  <img
                    src={selectedSong.artworkUrl100}
                    className="w-16 h-16 rounded-xl"
                    alt=""
                  />
                  <div>
                    <p className="font-bold">
                      {selectedSong.trackName}
                    </p>
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
                text-white py-4 rounded-2xl font-bold text-lg disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>

          </form>
        </div>
      </div>
    </div>
  )
}
