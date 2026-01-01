export default function FeatureCard({ title, desc }) {
  return (
    <div className="border rounded-2xl p-6 bg-white shadow-sm">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      <p className="text-gray-600 text-sm">{desc}</p>
    </div>
  )
}
