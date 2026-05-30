import { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Nav from './components/layout/Nav.tsx';
import Atlas from './scenes/Atlas.tsx';
import Stories from './scenes/Stories.tsx';
import Methodology from './scenes/Methodology.tsx';
import Markets from './scenes/Markets.tsx';
import Finance from './scenes/Finance.tsx';
import { useAtlasStore } from './store.ts';
import type { Scene } from './store.ts';

export default function App() {
  const { setScene } = useAtlasStore();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const path = location.pathname.replace('/', '') as Scene;
    if (['atlas', 'stories', 'methodology', 'markets', 'finance'].includes(path)) {
      setScene(path as Scene);
    }
  }, [location.pathname, setScene]);

  const handleNavChange = (scene: Scene) => {
    setScene(scene);
    navigate(`/${scene}`);
  };

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-ink">
      <Nav onNavigate={handleNavChange} />
      <main className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/" element={<Navigate to="/atlas" replace />} />
          <Route path="/atlas" element={<Atlas />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<Stories />} />
          <Route path="/methodology" element={<Methodology />} />
          <Route path="/markets" element={<Markets />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="*" element={<Navigate to="/atlas" replace />} />
        </Routes>
      </main>
    </div>
  );
}
