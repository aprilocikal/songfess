import { useEffect, useState, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { supabase } from "../lib/supabase";
import {
  FiHeart,
  FiMusic,
  FiMail,
  FiShare2,
  FiArrowLeft,
  FiInstagram,
} from "react-icons/fi";
import Swal from "sweetalert2";
import * as htmlToImage from "html-to-image";

export default function View() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverBase64, setCoverBase64] = useState(null);
  const cardRef = useRef(null);

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

    try {
      const res = await fetch(
        `https://images.weserv.nl/?url=${encodeURIComponent(data.cover)}`,
      );
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverBase64(reader.result);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      console.error("Failed to convert cover to base64", e);
    }
  }

  function handleShare() {
    const url = window.location.href;

    navigator.clipboard.writeText(url).then(() => {
      Swal.fire({
        icon: "success",
        title: "Link Copied!",
        text: "Share this message with someone ",
        timer: 1500,
        showConfirmButton: false,
        iconColor: "#10b981",
        background: "#f0fdf4",
      });
    });
  }

  async function handleShareToIG() {
    if (!cardRef.current) return;

    Swal.fire({
      title: "Preparing image...",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });

    try {
      // Small timeout to ensure loading UI is rendered
      await new Promise((r) => setTimeout(r, 100));

      // Gunakan resolusi 1080x1920 (Aspect Ratio 9:16) spesifik untuk IG Story
      const blob = await htmlToImage.toBlob(cardRef.current, {
        pixelRatio: 1,
        canvasWidth: 1080,
        canvasHeight: 1920,
        backgroundColor: "#ecfdf5", // emerald-50 base
      });

      if (!blob) {
        Swal.close();
        throw new Error("Failed to generate image");
      }

      const file = new File([blob], `${data.recipient}-songfess.png`, {
        type: "image/png",
      });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        Swal.close();
        try {
          await navigator.share({
            files: [file],
            title: "SongFess for " + data.recipient,
            text: "Check out this message!",
          });
        } catch (err) {
          console.log("Sharing cancelled or failed", err);
        }
      } else {
        Swal.close();
        Swal.fire({
          icon: "info",
          title: "Browser Tidak Mendukung",
          text: "Fitur share otomatis ke Instagram Story hanya bisa digunakan di HP/Mobile. Buka link ini di HP kamu ya!",
        });
      }
    } catch (error) {
      console.error(error);
      Swal.close();
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong while creating the image.",
      });
    }
  }

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="w-14 h-14 sm:w-16 sm:h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
          <p className="mt-4 sm:mt-6 text-gray-600 text-sm sm:text-base">
            Loading message...
          </p>
        </div>
      </div>
    );
  }

  /* ================= NOT FOUND ================= */
  if (!data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
        <Navbar />
        <div className="flex flex-col items-center justify-center h-[70vh] px-4 sm:px-6 text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 sm:mb-6">
            <FiMail className="text-3xl sm:text-4xl text-gray-400" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-3">
            Message Not Found
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md">
            This message might have been deleted or doesn't exist.
          </p>
          <Link
            to="/browse"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-2.5 sm:px-8 sm:py-3 rounded-full font-semibold text-sm sm:text-base shadow-lg hover:scale-105 transition-all">
            <FiArrowLeft className="text-sm" />
            Browse Messages
          </Link>
        </div>
      </div>
    );
  }

  /* ================= MAIN VIEW ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <Navbar />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 lg:pt-12 pb-12 sm:pb-16 lg:pb-20">
        {/* Back Button */}
        <Link
          to="/browse"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 mb-6 sm:mb-8 transition-colors group">
          <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
          Back to browse
        </Link>

        {/* MAIN CARD */}
        <div className="bg-white/90 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          {/* HEADER */}
          <div className="text-center px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 lg:pt-12 pb-6 sm:pb-8 bg-gradient-to-b from-emerald-50/50 to-transparent">
            <div className="mx-auto mb-4 sm:mb-6 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-2xl sm:text-3xl shadow-lg">
              <FiMail />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-2 sm:mb-3">
              Hello, {data.recipient}
            </h1>

            <p className="text-xs sm:text-sm lg:text-base text-gray-600 max-w-xl mx-auto leading-relaxed">
              Someone chose this song specially for you. Take a moment, listen,
              and feel the message
            </p>
          </div>

          {/* SONG SECTION */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <div className="bg-gradient-to-br from-white to-emerald-50/30 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-100/50 shadow-sm">
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-center sm:items-start">
                {/* COVER */}
                <div className="flex-shrink-0">
                  <img
                    src={coverBase64 || data.cover}
                    alt={data.song_title}
                    crossOrigin="anonymous"
                    className="w-32 h-32 sm:w-40 sm:h-40 lg:w-44 lg:h-44 rounded-xl sm:rounded-2xl object-cover shadow-lg"
                  />
                </div>

                {/* INFO */}
                <div className="flex-1 w-full text-center sm:text-left space-y-3 sm:space-y-4">
                  <div>
                    <div className="flex items-center justify-center sm:justify-start gap-2 text-xs sm:text-sm font-semibold text-emerald-600 mb-1 sm:mb-2">
                      <FiMusic className="text-sm" />
                      <span>Selected Song</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
                      {data.song_title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600">
                      {data.artist}
                    </p>
                  </div>

                  {/* AUDIO */}
                  {data.preview && (
                    <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-4 border border-emerald-100/50 shadow-sm">
                      <audio
                        controls
                        src={data.preview}
                        className="w-full h-8 sm:h-10"
                        style={{ maxHeight: "40px" }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* MESSAGE */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-emerald-200/50">
              <div className="flex gap-3 sm:gap-4">
                <div className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center text-lg sm:text-xl shadow-md">
                  <FiHeart />
                </div>
                <div className="flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-emerald-700 mb-2">
                    Personal Message
                  </p>
                  <p className="text-sm sm:text-base lg:text-lg text-gray-800 italic leading-relaxed">
                    "{data.message}"
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8 lg:pb-10 mt-2">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleShareToIG}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white rounded-xl sm:rounded-full font-semibold text-sm sm:text-base shadow-md hover:scale-[1.02] transition-all">
                <FiInstagram className="text-base" />
                Share IG Story
              </button>

              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-white border-2 border-emerald-300 text-emerald-700 rounded-xl sm:rounded-full font-semibold text-sm sm:text-base hover:bg-emerald-50 hover:scale-[1.02] transition-all shadow-sm">
                <FiShare2 className="text-base" />
                Share Link
              </button>

              <Link
                to="/submit"
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 sm:py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl sm:rounded-full font-semibold text-sm sm:text-base shadow-lg hover:scale-[1.02] transition-all">
                <FiMail className="text-base" />
                Send Message
              </Link>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <p className="mt-6 sm:mt-8 lg:mt-10 text-center text-xs sm:text-sm text-gray-500">
          <span className="font-semibold text-emerald-600">SongFess</span> —
          Messages told through music
        </p>
      </div>

      {/* IG STORY EXPORT CONTAINER (HIDDEN 9:16 layout) */}
      {/* Container ini wujud khusus hanya untuk di-screenshot menjadi gambar 1080 x 1920 */}
      <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden pointer-events-none z-[-1]">
        <div
          ref={cardRef}
          className="w-[1080px] h-[1920px] bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex flex-col items-center justify-center p-16">
          {/* Watermark / Header */}
          <div className="mb-16 flex flex-col items-center">
            <div className="font-bold text-5xl text-emerald-600 tracking-wider mb-2">
              SongFess
            </div>
            <div className="text-2xl text-emerald-800/60 font-medium">
              Messages told through music
            </div>
          </div>

          {/* High-Res Card */}
          <div className="bg-white/95 backdrop-blur-md w-full max-w-[900px] rounded-[3rem] shadow-2xl border border-white/60 overflow-hidden">
            <div className="text-center px-12 pt-20 pb-12 bg-gradient-to-b from-emerald-50/80 to-transparent">
              <div className="mx-auto mb-10 w-32 h-32 rounded-[2rem] bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white text-6xl shadow-xl">
                <FiMail />
              </div>

              <h1 className="text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6">
                Hello, {data.recipient}
              </h1>

              <p className="text-3xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Someone chose this song specially for you. Take a moment,
                listen, and feel the message.
              </p>
            </div>

            {/* SONG SECTION */}
            <div className="px-12 pb-12">
              <div className="bg-gradient-to-br from-white to-emerald-50/40 rounded-[2.5rem] p-10 border border-emerald-100/60 shadow-md flex items-center gap-10">
                <img
                  src={coverBase64 || data.cover}
                  alt={data.song_title}
                  crossOrigin="anonymous"
                  className="w-64 h-64 rounded-3xl object-cover shadow-xl"
                />
                <div className="flex-1">
                  <div className="flex items-center gap-3 text-2xl font-bold text-emerald-600 mb-4">
                    <FiMusic />
                    <span>Selected Song</span>
                  </div>
                  <h2 className="text-5xl font-extrabold text-gray-800 mb-4 line-clamp-2">
                    {data.song_title}
                  </h2>
                  <p className="text-3xl text-gray-600 font-medium line-clamp-1">
                    {data.artist}
                  </p>
                </div>
              </div>
            </div>

            {/* MESSAGE SECTION */}
            <div className="px-12 pb-20">
              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-[2.5rem] p-10 border border-emerald-200/60 flex gap-8">
                <div className="flex-shrink-0 w-20 h-20 rounded-3xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white flex items-center justify-center text-4xl shadow-lg mt-2">
                  <FiHeart />
                </div>
                <div className="flex-1">
                  <p className="text-2xl font-bold text-emerald-700 mb-4">
                    Personal Message
                  </p>
                  <p className="text-4xl text-gray-800 italic leading-snug break-words whitespace-pre-wrap">
                    "{data.message}"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
