import { Outlet } from 'react-router-dom'
import Sidebar, { MobileNav } from './Sidebar'
import Header from './Header'
import BubblesChat from '../bubbles/BubblesChat'
import UpgradeModal from '../billing/UpgradeModal'
import Toasts from '../ui/Toasts'
import { useApp } from '../../store/AppStore'

export default function AppLayout() {
  const { shop, isFree } = useApp()

  return (
    <div className="flex min-h-screen bg-canvas">
      <Sidebar />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header />
        <main className="flex-1 px-4 sm:px-6 py-6 pb-28 lg:pb-10 max-w-[1500px] w-full mx-auto">
          <Outlet />
        </main>
        {isFree && (
          <div className="hidden lg:block text-center py-4 text-[11px] font-semibold text-slate-400 border-t border-slate-100">
            Powered by <span className="text-brand-500">WashAI</span> — {shop?.name}
          </div>
        )}
      </div>
      <MobileNav />
      <BubblesChat />
      <UpgradeModal />
      <Toasts />
    </div>
  )
}
