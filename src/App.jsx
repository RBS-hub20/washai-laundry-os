import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './store/AppStore'
import AppLayout from './components/layout/AppLayout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Orders from './pages/Orders'
import Customers from './pages/Customers'
import Riders from './pages/Riders'
import Inventory from './pages/Inventory'
import Pricing from './pages/Pricing'
import Settings from './pages/Settings'
import SuperAdmin from './pages/SuperAdmin'
import Track from './pages/Track'
import { LogoSvg } from './components/brand/Logo'

function Splash() {
  return (
    <div className="min-h-screen grid place-items-center bg-canvas">
      <div className="text-center">
        <div className="animate-float inline-block">
          <LogoSvg size={78} />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-400 tracking-wide">Warming up the suds…</p>
      </div>
    </div>
  )
}

function Guard({ children }) {
  const { ready, session } = useApp()
  const loc = useLocation()
  if (!ready) return <Splash />
  if (!session.loggedIn) return <Navigate to="/login" state={{ from: loc }} replace />
  return children
}

function AdminGuard({ children }) {
  const { session } = useApp()
  if (session.role !== 'admin') return <Navigate to="/dashboard" replace />
  return children
}

function LoginRoute() {
  const { ready, session } = useApp()
  if (!ready) return <Splash />
  if (session.loggedIn) return <Navigate to="/dashboard" replace />
  return <Login />
}

function LandingRoute() {
  const { ready } = useApp()
  if (!ready) return <Splash />
  return <Landing />
}

function PublicTrack() {
  const { ready } = useApp()
  if (!ready) return <Splash />
  return <Track standalone />
}

function Router() {
  const { ready, session } = useApp()
  if (!ready) return <Splash />

  return (
    <Routes>
      {/* public marketing site */}
      <Route path="/" element={<LandingRoute />} />
      <Route path="/login" element={<LoginRoute />} />
      {/* /track is public when signed out, embedded in the shell when signed in */}
      {!session.loggedIn && <Route path="/track" element={<PublicTrack />} />}

      <Route
        element={
          <Guard>
            <AppLayout />
          </Guard>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/customers" element={<Customers />} />
        <Route path="/riders" element={<Riders />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/track" element={<Track />} />
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <SuperAdmin />
            </AdminGuard>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </AppProvider>
  )
}
