import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import { FiHeart, FiMusic, FiMail } from "react-icons/fi";
import Swal from "sweetalert2";
import { FiShare2 } from "react-icons/fi";

export default function View() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMessage();
  }, [id]);

  async function loadMessage() {
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
      return;
    }

    setData(data);
    setLoading(false);
  }

  function handleShare() {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Share this message with someone 💚",
        timer: 1500,
        showConfirmButton: false,
        iconColor: "#22c55e",
        background: "#f0fdf4",
      });
    });
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-32">
          <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-6 text-gray-600 text-lg">Loading message...</p>
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center mt-32 px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-3">
            Message Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            This message might have been deleted or doesn’t exist.
          </p>
          <Link
            to="/browse"
            className="bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white px-8 py-3 rounded-full font-semibold shadow-lg hover:scale-105 transition"
          >
            Browse Messages
          </Link>
        </div>
      </div>
    );
  }

  /* ================= MAIN VIEW ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-50">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 mt-16 pb-20 relative">
        {/* Decorative blur */}
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-emerald-300 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute top-40 -right-20 w-72 h-72 bg-teal-300 rounded-full blur-3xl opacity-20"></div>

        {/* CARD */}
        <div className="relative bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 overflow-hidden">
          {/* HEADER */}
          <div className="text-center px-8 pt-12 pb-10 bg-gradient-to-b from-emerald-50 to-transparent">
            <div className="mx-auto mb-6 w-24 h-24 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-4xl shadow-lg">
              <FiMail />
            </div>

            <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 bg-clip-text text-transparent mb-4">
              Hello, {data.recipient}
            </h1>

            <p className="text-gray-600 max-w-2xl mx-auto">
              Someone chose this song specially for you. Take a moment, listen,
              and feel the message
            </p>
          </div>

          {/* SONG SECTION */}
          <div className="px-8 pb-10">
            <div className="bg-white rounded-2xl p-8 border border-emerald-100 shadow-md">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                {/* COVER */}
                <img
                  src={data.cover}
                  alt={data.song_title}
                  className="w-56 h-56 rounded-2xl object-cover shadow-xl"
                />

                {/* INFO */}
                <div className="flex-1 space-y-4 w-full">
                  <div>
                    <p className="flex items-center gap-2 text-sm font-semibold text-emerald-600 mb-1">
                      <FiMusic />
                      Selected Song
                    </p>
                    <h2 className="text-3xl font-bold text-gray-800">
                      {data.song_title}
                    </h2>
                    <p className="text-lg text-gray-600">{data.artist}</p>
                  </div>

                  {/* AUDIO */}
                  {data.preview && (
                    <div className="mt-4 bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                      <audio controls src={data.preview} className="w-full" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGE */}
          <div className="px-8 pb-12">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-8 border border-emerald-200">
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center text-xl">
                  <FiMail />
                </div>
                <div>
                  <p className="text-sm font-bold text-emerald-700 mb-2">
                    Message
                  </p>
                  <p className="text-lg text-gray-800 italic leading-relaxed">
                    “{data.message}”
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTION */}
          <div className="pb-12 text-center">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/browse"
                className="px-8 py-3 border-2 border-emerald-300 text-emerald-700 rounded-full font-semibold hover:bg-emerald-50 transition"
              >
                Browse Messages
              </Link>
              <Link
                to="/submit"
                className="px-8 py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-green-600 text-white rounded-full font-semibold shadow-lg hover:scale-105 transition"
              >
                Send Your Message
              </Link>
              <button
                onClick={handleShare}
                className="px-8 py-3 bg-white border-2 border-emerald-300
            text-emerald-700 rounded-full font-semibold
            flex items-center justify-center gap-2
            hover:bg-emerald-50 hover:scale-105 transition-all duration-300 shadow-md"
              >
                <FiShare2 />
                Share Link
              </button>
            </div>
          </div>
        </div>

        {/* FOOT NOTE */}
        <p className="mt-10 text-center text-gray-600">
          Songfess — messages told through music
        </p>
      </div>
    </div>
  );
}
