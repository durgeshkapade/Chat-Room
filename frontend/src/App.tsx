import {BrowserRouter as Router , Routes ,Route} from 'react-router-dom'
import './App.css'
import { HomePage } from './pages/home'
import ChatPage from './pages/chat'


export function App() {
  return (

    <div>
      <Router>
        <Routes>
          <Route path='/chat/:id' element={<ChatPage/>} />
          <Route path='/' element={<HomePage/>} />
        </Routes>
      </Router>
     
    </div>

  )
}



export default App