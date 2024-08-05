
import Login from './auth/Login'
import Register from './auth/Register'
import {BrowserRouter, Routes, Route} from "react-router-dom"

function App() {

  return (
    <>
    <BrowserRouter>
    <Routes >
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
    </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
