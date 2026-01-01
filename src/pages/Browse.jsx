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
  const [messages, setMessages] = useState([]);   // 🔒 cache data
  const [filtered, setFiltered] = useState([]);   // 🔥 hasil search saja
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();

    // REALTIME (DELETE / UPDATE)
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

    const { data, error } = await supabase
      .from("messages")
      .select("*");

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setMessages(data || []);
    setFiltered([]); // ✅ KOSONGKAN → tidak tampil apa-apa
    setLoading(false);
  }

  function handleSearch(value) {
    setQuery(value);

    if (!value.trim()) {
      setFiltered([]); // 🔥 kosong kalau input kosong
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto mt-12 px-6 pb-12">
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-3">
            Browse Messages
          </h1>
          <p className="text-gray-600">
            Type a name or keyword to find a message
          </p>
        </div>

        {/* SEARCH */}
        <div className="relative mb-10">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <FiSearch className="text-2xl text-gray-400" />
          </div>

          <input
            placeholder="Search by name, message, song, or artist..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full bg-white/80 border-2 border-gray-200 pl-16 pr-14 py-5 rounded-2xl focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100 outline-none shadow-lg text-lg"
          />

          {query && (
            <button
              onClick={() => handleSearch("")}
              className="absolute inset-y-0 right-5 flex items-center text-gray-400 hover:text-emerald-600"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        {/* STATE: BELUM SEARCH */}
        {!query && !loading && (
          <div className="text-center py-24">
            <FiSearch className="mx-auto text-6xl text-emerald-300 mb-4" />
            <p className="text-gray-600 text-lg">
              Start typing to search messages
            </p>
          </div>
        )}

        {/* STATE: LOADING */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading messages...</p>
          </div>
        )}

        {/* RESULTS */}
        <div className="space-y-5">
          {filtered.map((m) => (
            <Link
              key={m.id}
              to={`/view/${m.id}`}
              className="block bg-white/80 border-2 border-white/50 rounded-3xl p-6 hover:shadow-xl hover:border-emerald-300 transition group"
            >
              <div className="flex items-center gap-2 mb-3">
                <FiMessageCircle className="text-emerald-500" />
                <p className="font-bold text-gray-800">
                  To:{" "}
                  <span className="text-emerald-600">
                    {m.recipient}
                  </span>
                </p>
              </div>

              <p className="italic text-gray-700 mb-4 line-clamp-3">
                "{m.message}"
              </p>

              {m.song_title && (
                <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <img
                    src={m.cover}
                    className="w-14 h-14 rounded-xl"
                    alt=""
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {m.song_title}
                    </p>
                    <p className="text-sm text-gray-600 truncate">
                      {m.artist}
                    </p>
                  </div>
                  <FiMusic className="text-emerald-500 text-xl" />
                </div>
              )}

              <div className="mt-4 flex items-center justify-center gap-2 text-emerald-600 opacity-0 group-hover:opacity-100 transition">
                <span className="text-sm font-semibold">
                  View Details
                </span>
                <FiArrowRight />
              </div>
            </Link>
          ))}
        </div>

        {/* STATE: TIDAK ADA HASIL */}
        {query && !loading && filtered.length === 0 && (
          <div className="text-center py-20">
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              No messages found
            </h3>
            <p className="text-gray-500">
              Try another name or keyword
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
