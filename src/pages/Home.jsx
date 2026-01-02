import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import { FiMessageCircle } from "react-icons/fi";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const [activeFeature, setActiveFeature] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  async function fetchMessages() {
    const { data } = await supabase
      .from("messages")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setMessages(data);
  }

  if (messages.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50">
        <Navbar />
        <div className="flex items-center justify-center h-[60vh] text-gray-400">
          Loading live messages...
        </div>
      </div>
    );
  }

  const half = Math.ceil(messages.length / 2);
  const topRow = messages.slice(0, half);
  const bottomRow = messages.slice(half);

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
            title="Share Messages"
            desc="Choose a song and write a heartfelt message."
            active={activeFeature}
            onClick={setActiveFeature}
          />
          <Feature
            id="browse"
            title="Browse Messages"
            desc="Find messages written by others."
            active={activeFeature}
            onClick={setActiveFeature}
          />
          <Feature
            id="listen"
            title="Listen & Feel"
            desc="Read stories and feel the music."
            active={activeFeature}
            onClick={setActiveFeature}
          />
        </div>
      </section>

      {/* LIVE MESSAGES */}
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

          {/* ROW ATAS */}
          <div className="relative overflow-hidden mb-14 rounded-3xl bg-white/50 py-6">
            <div className="marquee-right flex gap-6 px-4">
              {topRow.concat(topRow).map((m, i) => (
                <MessageCard key={`top-${m.id}-${i}`} message={m} />
              ))}
            </div>
          </div>

          {/* ROW BAWAH */}
          <div className="relative overflow-hidden rounded-3xl bg-white/50 py-6">
            <div className="marquee-left flex gap-6 px-4">
              {bottomRow.concat(bottomRow).map((m, i) => (
                <MessageCard key={`bottom-${m.id}-${i}`} message={m} />
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

      {/* MARQUEE ANIMATION */}
      <style>{`
        @keyframes scroll-right {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }

        @keyframes scroll-left {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }

        /* DESKTOP */
        @media (min-width: 768px) {
          .marquee-right {
            animation: scroll-right 50s linear infinite;
            width: max-content;
          }

          .marquee-left {
            animation: scroll-left 50s linear infinite;
            width: max-content;
          }
        }

        /* MOBILE (AUTO JALAN PELAN) */
        @media (max-width: 767px) {
          .marquee-right {
            animation: scroll-right 90s linear infinite;
            width: max-content;
          }

          .marquee-left {
            animation: scroll-left 90s linear infinite;
            width: max-content;
          }
        }

        
      `}</style>
    </div>
  );
}

/* FEATURE CARD */
function Feature({ id, title, desc, active, onClick }) {
  const isActive = active === id;

  return (
    <button
      onClick={() => onClick(id)}
      className={`bg-white/80 rounded-3xl p-8 shadow-md border-2 transition-all text-left
        ${
          isActive
            ? "border-emerald-500 shadow-emerald-200 scale-[1.03]"
            : "border-emerald-100 hover:shadow-xl hover:border-emerald-300"
        }`}
    >
      <h3 className="font-bold text-xl text-gray-800 mb-3">{title}</h3>
      <p className="text-gray-600">{desc}</p>
    </button>
  );
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
        To: {message.recipient}
      </p>

      <p className="italic text-gray-800 mb-4 line-clamp-3">
        "{message.message}"
      </p>

      {message.song_title && (
        <div className="flex items-center gap-3 bg-emerald-50/60 p-3 rounded-xl">
          <img
            src={message.cover}
            alt=""
            className="w-12 h-12 rounded-lg object-cover"
          />
          <div className="min-w-0">
            <p className="font-semibold text-sm truncate">
              {message.song_title}
            </p>
            <p className="text-xs text-gray-500 truncate">{message.artist}</p>
          </div>
        </div>
      )}
    </Link>
  );
}
