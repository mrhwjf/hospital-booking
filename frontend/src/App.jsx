import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

import LichHenCuaToiPage from './features/scheduling/pages/patients/LichHenCuaToiPage'
import DatLichPage from './features/scheduling/pages/patients/DatLichPage'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <LichHenCuaToiPage />
      {/* <DatLichPage /> */}
    </>
  )
}

export default App
