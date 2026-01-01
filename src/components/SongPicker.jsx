export default function SongPicker({ value, onSelect }) {
  // DUMMY DATA (sementara)
  const songs = [
    {
      title: "Lucky",
      artist: "Jason Mraz, Colbie Caillat",
      spotify: "https://open.spotify.com/track/0IktbUcnAGrvD03AWnz3Q8"
    },
    {
      title: "Stranger",
      artist: "Olivia Rodrigo",
      spotify: "https://open.spotify.com/track/3k79jB4aGmMDUQzEwa46Rz"
    },
    {
      title: "Goyang Dumang",
      artist: "Cita Citata",
      spotify: "https://open.spotify.com/track/4iZ4pt7kvcaH6Yo8UoZ4s2"
    },
    {
      title: "I Will",
      artist: "The Beatles",
      spotify: "https://open.spotify.com/track/4aWmUDTfIPGksMNLV2rQP2"
    }
  ]

  const filtered = songs.filter((s) =>
    s.title.toLowerCase().includes(value.toLowerCase())
  )

  return (
    <div className="border rounded-xl overflow-hidden bg-white">
      {filtered.map((song, i) => (
        <button
          key={i}
          onClick={() => onSelect(song)}
          className="w-full text-left px-4 py-3 hover:bg-gray-100 flex gap-3"
        >
          <div className="flex-1">
            <p className="font-medium">{song.title}</p>
            <p className="text-sm text-gray-500">{song.artist}</p>
          </div>
          <span className="text-green-500 font-bold">♫</span>
        </button>
      ))}

      {filtered.length === 0 && (
        <p className="px-4 py-3 text-sm text-gray-400">
          Lagu tidak ditemukan
        </p>
      )}
    </div>
  )
}
