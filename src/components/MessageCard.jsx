import { Link } from "react-router-dom"

export default function MessageCard({
  id,
  to,
  message,
  song,
  artist,
  clickable = true
}) {
  const CardContent = (
    <>
      <div className="p-4 min-h-[120px]">
        <span className="text-xs text-gray-400">To: {to}</span>
        <p className="mt-3 text-gray-800 italic line-clamp-3">
          {message}
        </p>
      </div>

      <div className="border-t p-4 text-sm text-gray-600 flex justify-between">
        <div>
          <p className="font-medium">{song}</p>
          {artist && <p className="text-xs">{artist}</p>}
        </div>
        <span className="text-green-500 font-bold">♫</span>
      </div>
    </>
  )

  // ❌ TIDAK CLICKABLE (HOME)
  if (!clickable) {
    return (
      <div className="border rounded-2xl overflow-hidden bg-white shadow-sm">
        {CardContent}
      </div>
    )
  }

  // ✅ CLICKABLE (BROWSE / HISTORY)
  if (!id) return null

  return (
    <Link
      to={`/view/${id}`}
      className="border rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition block"
    >
      {CardContent}
    </Link>
  )
}
