import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Navbar from "../components/Navbar";
import { Link } from "react-router-dom";
import {
  FiMessageCircle,
  FiMusic,
  FiHeart,
  FiEye,
  FiSend,
} from "react-icons/fi";

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex items-center justify-center h-[70vh]">
          <div className="text-center">
            <div className="w-16 h-16 sm:w-20 sm:h-20 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4 sm:mb-6"></div>
            <p className="text-gray-500 text-base sm:text-lg font-medium">
              Loading live messages...
            </p>
          </div>
        </div>
      </div>
    );
  }

  const half = Math.ceil(messages.length / 2);
  const topRow = messages.slice(0, half);
  const bottomRow = messages.slice(half);

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      {/* HERO SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-16">
        <div className="text-center mb-12 sm:mb-16 lg:mb-20">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-4 sm:mb-6 leading-tight px-4">
            Share Your Feelings
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 leading-relaxed">
            Express what words can't say through the power of music
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-16 sm:mb-20 lg:mb-24">
          <Feature
            id="share"
            icon={<FiSend />}
            title="Share Messages"
            desc="Choose a song and write a heartfelt message to someone special."
            active={activeFeature}
            onClick={setActiveFeature}
          />
          <Feature
            id="browse"
            icon={<FiEye />}
            title="Browse Messages"
            desc="Discover messages from others and feel their emotions."
            active={activeFeature}
            onClick={setActiveFeature}
          />
          <Feature
            id="listen"
            icon={<FiHeart />}
            title="Listen & Feel"
            desc="Read stories and experience the soundtrack of feelings."
            active={activeFeature}
            onClick={setActiveFeature}
          />
        </div>
      </section>

      {/* LIVE MESSAGES SECTION */}
      <section className="py-16 sm:py-20 lg:py-28 bg-gradient-to-b from-white/50 via-emerald-50/30 to-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-12 lg:mb-16">
            <div className="inline-block mb-4">
              <span className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-xs sm:text-sm font-semibold">
                Live Now
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">
              Live Messages
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600">
              Real feelings, real music, shared by real people
            </p>
          </div>

          {/* TOP ROW */}
          <div className="relative overflow-hidden mb-8 sm:mb-10 lg:mb-14 rounded-2xl sm:rounded-3xl bg-white/40 backdrop-blur-sm py-4 sm:py-6 shadow-sm">
            <div className="marquee-right flex gap-4 sm:gap-6 px-2 sm:px-4">
              {topRow.concat(topRow).map((m, i) => (
                <MessageCard key={`top-${m.id}-${i}`} message={m} />
              ))}
            </div>
          </div>

          {/* BOTTOM ROW */}
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/40 backdrop-blur-sm py-4 sm:py-6 shadow-sm">
            <div className="marquee-left flex gap-4 sm:gap-6 px-2 sm:px-4">
              {bottomRow.concat(bottomRow).map((m, i) => (
                <MessageCard key={`bottom-${m.id}-${i}`} message={m} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 sm:py-20 lg:py-24 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3 sm:mb-4">
            Ready to share your message?
          </h3>
          <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8">
            Pick a song that speaks to your heart and let your feelings flow
          </p>
          <Link
            to="/submit"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white px-8 py-3 sm:px-10 sm:py-4 rounded-full font-bold text-base sm:text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            <span>Create Your Message</span>
            <FiSend className="text-lg" />
          </Link>
        </div>
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

        .marquee-right {
          animation: scroll-right 50s linear infinite;
          width: max-content;
        }

        .marquee-left {
          animation: scroll-left 50s linear infinite;
          width: max-content;
        }

        @media (max-width: 640px) {
          .marquee-right,
          .marquee-left {
            animation-duration: 80s;
          }
        }

       
      `}</style>
    </div>
  );
}

/* FEATURE CARD COMPONENT */
function Feature({ id, icon, title, desc, active, onClick }) {
  const isActive = active === id;

  return (
    <button
      onClick={() => onClick(id)}
      className={`bg-white/70 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg border-2 transition-all duration-300 text-left group hover:shadow-xl ${
        isActive
          ? "border-emerald-500 shadow-emerald-200/50 scale-105 bg-white"
          : "border-gray-200 hover:border-emerald-300"
      }`}
    >
      <div
        className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center mb-4 sm:mb-5 transition-all duration-300 ${
          isActive
            ? "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md"
            : "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100"
        }`}
      >
        {icon && <div className="text-2xl sm:text-3xl">{icon}</div>}
      </div>
      <h3 className="font-bold text-lg sm:text-xl text-gray-800 mb-2 sm:mb-3">
        {title}
      </h3>
      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
        {desc}
      </p>
    </button>
  );
}

/* MESSAGE CARD COMPONENT */
function MessageCard({ message }) {
  return (
    <Link
      to={`/view/${message.id}`}
      className="flex-shrink-0 w-64 sm:w-72 lg:w-80 bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-5 sm:p-6 shadow-lg border border-gray-100 hover:shadow-2xl hover:scale-105 hover:border-emerald-200 transition-all duration-300 group"
    >
      <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 mb-3 sm:mb-4">
        <FiMessageCircle className="text-emerald-500 text-base sm:text-lg flex-shrink-0" />
        <span className="font-medium">
          To:{" "}
          <span className="text-emerald-600 font-semibold">
            {message.recipient}
          </span>
        </span>
      </div>

      <p className="italic text-sm sm:text-base text-gray-700 mb-4 sm:mb-5 line-clamp-3 leading-relaxed">
        "{message.message}"
      </p>

      {message.song_title && (
        <div className="flex items-center gap-3 bg-gradient-to-r from-emerald-50 to-teal-50 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-emerald-100 group-hover:border-emerald-200 transition-colors">
          <img
            src={message.cover}
            alt={message.song_title}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl object-cover shadow-md flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-xs sm:text-sm text-gray-800 truncate mb-1">
              {message.song_title}
            </p>
            <p className="text-xs text-gray-500 truncate">{message.artist}</p>
          </div>
          <FiMusic className="text-emerald-500 text-lg flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      )}
    </Link>
  );
}
