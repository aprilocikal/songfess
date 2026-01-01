import { useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import Navbar from "../components/Navbar"
import { Link } from "react-router-dom"
import { FiMessageCircle} from "react-icons/fi"
import { FiMenu, FiX } from "react-icons/fi"


export default function Home() {
  const [messages, setMessages] = useState([])
  const [activeFeature, setActiveFeature] = useState(null) // ✅ TAMBAHAN
  

  useEffect(() => {
    fetchMessages()
  }, [])

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20)

    if (data) setMessages(data)
  }

  const half = Math.ceil(messages.length / 2)
  const topRow = messages.slice(0, half)
  const bottomRow = messages.slice(half)

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      {/* HERO */}
      <section className="max-w-7xl mx-auto px-6 mt-20">
        <div className="text-center mb-20">
          <h1 className="text-6xl md:text-7xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
            Share Your Feelings
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Express what words can't say through the power of music
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          <Feature
            id="share"
            active={activeFeature}
            onClick={setActiveFeature}
            title="Share Messages"
            desc="Choose a song and write a heartfelt message."
          />
          <Feature
            id="browse"
            active={activeFeature}
            onClick={setActiveFeature}
            title="Browse Messages"
            desc="Find messages written by others."
          />
          <Feature
            id="listen"
            active={activeFeature}
            onClick={setActiveFeature}
            title="Listen & Feel"
            desc="Read stories and feel the music."
          />
        </div>
      </section>

      {/* PUBLIC MESSAGES */}
      <section className="py-28 bg-gradient-to-b from-emerald-50/70 via-white/80 to-emerald-50/70">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-bold text-emerald-600 mb-2">
               Live Messages
            </h2>
            <p className="text-gray-600">
              Messages flowing slowly from real people
            </p>
          </div>

          <div className="relative overflow-hidden mb-14 rounded-3xl bg-white/50 py-6">
            <div className="marquee-right">
              {topRow.concat(topRow).map((m, i) => (
                <MessageCard key={`${m.id}-top-${i}`} message={m} />
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-3xl bg-white/50 py-6">
            <div className="marquee-left">
              {bottomRow.concat(bottomRow).map((m, i) => (
                <MessageCard key={`${m.id}-bottom-${i}`} message={m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 text-center">
        <h3 className="text-3xl font-bold text-gray-800 mb-4">
          Ready to share your message?
        </h3>
        <p className="text-gray-600 mb-8">
          Pick a song and let your feelings flow
        </p>
        <Link
          to="/submit"
          className="inline-block bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-10 py-4 rounded-full font-bold text-lg shadow-lg hover:scale-105 transition"
        >
          Create Message
        </Link>
      </section>

      {/* ANIMATION */}
      <style>{`
        @keyframes scroll-right {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes scroll-left {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        .marquee-right,
        .marquee-left {
          display: flex;
          gap: 1.5rem;
          width: max-content;
          will-change: transform;
        }

        .marquee-right {
          animation: scroll-right 50s linear infinite;
        }

        .marquee-left {
          animation: scroll-left 50s linear infinite;
        }
      `}</style>
    </div>
  )
}

/* FEATURE */
function Feature({ id, title, desc, active, onClick }) {
  const isActive = active === id

  return (
    <button
      onClick={() => onClick(id)}
      className={`
        text-left bg-white/80 rounded-3xl p-8 shadow-md border-2 transition-all
        ${isActive
          ? "border-emerald-500 shadow-emerald-200 scale-[1.03]"
          : "border-emerald-100 hover:shadow-xl hover:border-emerald-300"}
      `}
    >
      <h3 className="font-bold text-xl text-gray-800 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">{desc}</p>
    </button>
  )
}

/* MESSAGE CARD */
function MessageCard({ message }) {
  return (
    <Link
      to={`/view/${message.id}`}
      className="flex-shrink-0 w-80 bg-white/80 rounded-2xl p-6 shadow-md border border-emerald-100 hover:shadow-xl hover:scale-105 transition"
    >
      <p className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <FiMessageCircle className="text-emerald-500" />
        <span>To: {message.recipient}</span>
      </p>

      <p className="italic text-gray-800 mb-4 line-clamp-3">
        "{message.message}"
      </p>

      {message.song_title && (
        <div className="flex items-center gap-3 bg-emerald-50/60 p-3 rounded-xl">
          
          <img
            src={message.cover}
            className="w-12 h-12 rounded-lg"
            alt=""
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {message.song_title}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {message.artist}
            </p>
          </div>
        </div>
      )}
    </Link>
  )
}
