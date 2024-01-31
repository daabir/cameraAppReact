import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Camera from './components/Camera';

function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path='/' element={<Camera/>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
