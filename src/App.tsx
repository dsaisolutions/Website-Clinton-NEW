import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Instructors from './pages/Instructors';
import Calendar from './pages/Calendar';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminCalendar from './pages/AdminCalendar';

function PublicLayout({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/instructors" element={<PublicLayout><Instructors /></PublicLayout>} />
          <Route path="/calendar" element={<PublicLayout><Calendar /></PublicLayout>} />
          <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/calendar" element={<AdminCalendar />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
