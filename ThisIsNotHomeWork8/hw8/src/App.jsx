import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './components/Search/Search';
import Bookings from './components/Booking/Bookings';
import 'bootstrap/dist/css/bootstrap.min.css';
import city from './city.jpg'
const App = () => {
  return (
    <div className="App">
      <img src={city} className='bg-img'></img>
      <Router>
        <Routes>
          <Route path='/search' element={<Search thisis={'bew'} />}></Route>
          <Route path='/bookings' element={<Bookings />}></Route>
          <Route path='*' element={<Search />}></Route>
        </Routes>
      </Router> 
    </div>
  );
}

export default App;
