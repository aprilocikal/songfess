import { useEffect, useState, useRef } from "react"
import Navbar from "../components/Navbar"
import { supabase } from "../lib/supabase"
import { FiClock, FiInbox, FiMusic } from "react-icons/fi"

const EXPIRE_TIME = 7 * 24 * 60 * 60 * 1000 // 7 hari

export default function History() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const currentAudioRef = useRef(null)

  useEffect(() => {
    loadHistory()
  }, [])

  async function loadHistory() {
    const raw =
      JSON.parse(localStorage.getItem("songfess_history")) || []

    const now = Date.now()

    const valid = raw.filter(
      (item) => now - item.savedAt < EXPIRE_TIME
    )

    localStorage.setItem(
      "songfess_history",
      JSON.stringify(valid)
    )

    if (valid.length === 0) {
      setMessages([])
      setLoading(false)
      return
    }

    const ids = valid.map((i) => i.id)

    const { data } = await supabase
      .from("messages")
      .select("*")
      .in("id", ids)
      .order("created_at", { ascending: false })

    setMessages(data || [])
    setLoading(false)
  }

  // ✅ auto pause previous audio
  function handlePlay(e) {
    const audio = e.target

    if (
      currentAudioRef.current &&
      currentAudioRef.current !== audio
    ) {
      currentAudioRef.current.pause()
    }

    currentAudioRef.current = audio
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-12 px-6 pb-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Your History
          </h1>
          <p className="text-gray-600">
            Messages you've sent in the last 7 days
          </p>
        </div>

        {/* Info Banner */}
        <div
          className="bg-white/60 backdrop-blur-md border-2 border-emerald-200 rounded-2xl p-4 mb-8 flex items-center gap-3 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <FiClock className="text-2xl text-emerald-600" />
          <p className="text-sm text-gray-700">
            History automatically expires after{" "}
            <span className="font-bold text-emerald-600">
              7 days
            </span>
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">
              Loading history...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading && messages.length === 0 && (
          <div className="text-center py-20 animate-fade-in">
            <FiInbox className="mx-auto text-7xl text-emerald-300 mb-6" />
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No History Yet
            </h3>
            <p className="text-gray-500 mb-8">
              Your sent messages will appear here and expire after
              7 days
            </p>
            <a
              href="/submit"
              className="inline-block bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Send Your First Message
            </a>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-6">
          {messages.map((m, idx) => (
            <div
              key={m.id}
              className="bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-3xl p-6 shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                    {m.recipient.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">
                      Sent to
                    </p>
                    <p className="font-bold text-lg text-gray-800">
                      {m.recipient}
                    </p>
                  </div>
                </div>
                <span className="text-xs text-gray-400 bg-gray-100 px-3 py-1 rounded-full">
                  {new Date(m.created_at).toLocaleDateString(
                    "id-ID",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    }
                  )}
                </span>
              </div>

              {/* Message */}
              <div className="mb-5 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100">
                <p className="text-sm text-emerald-700 font-semibold mb-2">
                  Your Message:
                </p>
                <p className="text-gray-700 leading-relaxed italic">
                  "{m.message}"
                </p>
              </div>

              {/* Song */}
              <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border-2 border-gray-100 group-hover:border-emerald-200 transition-colors">
                {m.cover && (
                  <img
                    src={m.cover}
                    alt="cover"
                    className="w-20 h-20 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
                  />
                )}

                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 mb-1 truncate">
                    {m.song_title}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {m.artist}
                  </p>
                </div>

                <FiMusic className="text-emerald-500 text-2xl" />
              </div>

              {/* Audio */}
              {m.preview && (
                <div className="mt-4 bg-gray-100 rounded-2xl p-4 border border-gray-200">
                  <audio
                    controls
                    src={m.preview}
                    className="w-full rounded-xl"
                    onPlay={handlePlay}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

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
  )
}
