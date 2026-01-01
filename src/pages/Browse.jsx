import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"
import {
  FiSearch,
  FiX,
  FiMessageCircle,
  FiMusic,
  FiArrowRight,
} from "react-icons/fi"

export default function Browse() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState([])
  const [filtered, setFiltered] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    setLoading(true)
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      setLoading(false)
      return
    }

    setMessages(data || [])
    setFiltered(data || [])
    setLoading(false)
  }

  function handleSearch(value) {
    setQuery(value)

    if (!value) {
      setFiltered(messages)
      return
    }

    const q = value.toLowerCase()

    const filteredData = messages.filter((m) =>
      m.recipient?.toLowerCase().includes(q) ||
      m.message?.toLowerCase().includes(q) ||
      m.song_title?.toLowerCase().includes(q) ||
      m.artist?.toLowerCase().includes(q)
    )

    setFiltered(filteredData)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-12 px-6 pb-12">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Browse Messages
          </h1>
          <p className="text-gray-600">
            Search through all shared messages
          </p>
        </div>

        {/* Search Bar */}
        <div
          className="relative mb-8 animate-fade-in"
          style={{ animationDelay: "100ms" }}
        >
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <FiSearch className="text-2xl text-gray-400" />
          </div>

          <input
            placeholder="Search by name, message, song, or artist..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/80 backdrop-blur-md border-2 border-gray-200 pl-16 pr-14 py-5 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 transition-all outline-none shadow-lg text-lg"
          />

          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-emerald-600 transition-colors"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* Results Count */}
        {!loading && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filtered.length === 0
                ? "No messages found"
                : "Found message"}
            </p>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">
              Loading messages...
            </p>
          </div>
        )}

        {/* Messages */}
        <div className="space-y-5">
          {filtered.map((m, idx) => (
            <Link
              key={m.id}
              to={`/view/${m.id}`}
              className="block bg-white/80 backdrop-blur-md border-2 border-white/50 rounded-3xl p-6 hover:shadow-2xl hover:scale-[1.02] hover:border-emerald-300 transition-all duration-300 animate-fade-in group"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <FiMessageCircle className="text-emerald-500 text-xl" />
                  <p className="font-bold text-lg text-gray-800">
                    To:{" "}
                    <span className="text-emerald-600">
                      {m.recipient}
                    </span>
                  </p>
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
              <p className="text-gray-700 leading-relaxed mb-4 italic line-clamp-3">
                "{m.message}"
              </p>

              {/* Song */}
              {m.song_title && (
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 group-hover:border-emerald-200 transition-colors">
                  <img
                    src={m.cover}
                    alt={m.song_title}
                    className="w-16 h-16 rounded-xl object-cover shadow-md group-hover:scale-110 transition-transform duration-300"
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 truncate">
                      {m.song_title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {m.artist}
                    </p>
                  </div>

                  <FiMusic className="text-emerald-500 text-2xl" />
                </div>
              )}

              {/* Hover */}
              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-sm font-semibold">
                  View Details
                </span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <FiSearch className="mx-auto text-6xl text-gray-300 mb-4" />
            <h3 className="text-2xl font-bold text-gray-700 mb-2">
              No messages found
            </h3>
            <p className="text-gray-500">
              {query
                ? "Try searching with different keywords"
                : "Be the first to share a message!"}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
