import './App.css';
import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Lazy load components for better performance
const Home = lazy(() => import("./Home"));
const EventsPage = lazy(() => import("./components/eventspage"));
const Certificate = lazy(() => import("./components/Certificate"));
const Faculty = lazy(() => import("./components/Faculty"));


function App() {
    return (
      <div className="App">
        <Router>
          <Suspense fallback={
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              height: '100vh',
              color: 'white',
              fontSize: '20px'
            }}>
              Loading...
            </div>
          }>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/faculty" element={<Faculty />} />
              <Route path="/verify" element={<Certificate />} />
            </Routes>
          </Suspense>
        </Router>
      </div>
    );
}

export default App
