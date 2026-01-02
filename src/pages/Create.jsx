import { useState } from "react"

export default function Create() {
  const [song, setSong] = useState("")
  const [artist, setArtist] = useState("")
  const [message, setMessage] = useState("")

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border rounded-2xl p-6 space-y-4 shadow-sm">
        <h2 className="text-2xl font-bold text-green-600 text-center">
          Kirim Lagu 
        </h2>

        <input
          placeholder="Judul Lagu"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setSong(e.target.value)}
        />

        <input
          placeholder="Nama Artis"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400"
          onChange={(e) => setArtist(e.target.value)}
        />

        <textarea
          placeholder="Pesan rahasia..."
          rows="4"
          className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl font-semibold transition"
        >
          Buat Link
        </button>
      </div>
    </div>
  )
}
