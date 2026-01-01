import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home.jsx"
import Submit from "../pages/Submit.jsx"
import Browse from "../pages/Browse.jsx"
import History from "../pages/History.jsx"
import View from "../pages/View.jsx"

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/browse" element={<Browse />} />
        <Route path="/history" element={<History />} />
        <Route path="/view/:id" element={<View />} />
      </Routes>
    </BrowserRouter>
  )
}
