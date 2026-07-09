import { useState } from 'react';
import Landing from './pages/Landing';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/Dashboard';
import AIAdvisor from './pages/AIAdvisor';
import Investors from './pages/Investors';
import InvestorProfile from './pages/InvestorProfile';
import IdeaVault from './pages/IdeaVault';
import Goals from './pages/Goals';
import Metrics from './pages/Metrics';
import Roadmap from './pages/Roadmap';
import Team from './pages/Team';
import './App.css';

type AppPage = 'dashboard' | 'advisor' | 'investors' | 'investor-profile' | 'goals' | 'metrics' | 'ideas' | 'roadmap' | 'team';

function AppShell() {
  const [activePage, setActivePage] = useState<AppPage>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'advisor': return <AIAdvisor />;
      case 'investors': return <Investors onOpenProfile={() => setActivePage('investor-profile')} />;
      case 'investor-profile': return <InvestorProfile onBack={() => setActivePage('investors')} />;
      case 'ideas': return <IdeaVault />;
      case 'goals': return <Goals />;
      case 'metrics': return <Metrics />;
      case 'roadmap': return <Roadmap />;
      case 'team': return <Team />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex">
      <Sidebar activePage={activePage} onNavigate={setActivePage} />
      <div className="flex-1 ml-[210px] flex flex-col">
        <Header />
        <main className="flex-1 mt-[60px] overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default function App() {
  const [view, setView] = useState<'landing' | 'app'>('landing');

  if (view === 'app') {
    return <AppShell />;
  }

  return <Landing onEnterApp={() => setView('app')} />;
}
