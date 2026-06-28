import { useState } from 'react'
import AdminProducts from '../../components/admin/AdminProducts'
import AdminOrders from '../../components/admin/AdminOrders'
import AdminMaintenance from '../../components/admin/AdminMaintenance'

const TABS = [
  { id: 'products', label: 'Products' },
  { id: 'orders', label: 'Orders' },
  { id: 'maintenance', label: 'Maintenance' },
]

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products')

  return (
    <div>
      {/* Header */}
      <header className="mb-8">
        <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
          Admin
        </p>
        <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
          Dashboard
        </h1>
      </header>

      {/* Tabs */}
      <div className="mb-8 flex gap-2 border-b border-line">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-1 text-sm font-medium border-b-2 transition -mb-px ${
              activeTab === tab.id
                ? 'border-violet text-violet'
                : 'border-transparent text-muted hover:text-ink'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'products' && <AdminProducts />}
      {activeTab === 'orders' && <AdminOrders />}
      {activeTab === 'maintenance' && <AdminMaintenance />}
    </div>
  )
}

export default AdminDashboard