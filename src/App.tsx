import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Layout } from "./components/Layout.tsx"
import { Home } from "./pages/Home.tsx"
import { Partner } from "./pages/Partner.tsx"
import { Projects } from "./pages/Projects.tsx"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/partner" element={<Partner />} />
          <Route path="/projects" element={<Projects />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
