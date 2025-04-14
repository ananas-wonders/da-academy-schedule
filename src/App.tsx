
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Admin from './pages/Admin';
import TrackView from './pages/TrackView';
import NotFound from './pages/NotFound';
import Auth from './pages/Auth';
import InstructorDetails from './pages/InstructorDetails';
import CourseLists from './pages/CourseLists';
import Tracks from './pages/Tracks';
import Header from './components/Header';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/track/:id" element={<TrackView />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/instructors" element={<InstructorDetails />} />
              <Route path="/courses" element={<CourseLists />} />
              <Route path="/tracks" element={<Tracks />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
