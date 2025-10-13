import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <div className="topbar">
        <div className="topbar-inner">
          <div className="brand">Farm Manager</div>
          <div className="nav">
            <Link to="/dashboard" className="btn small secondary">Dashboard</Link>
            <Link to="/reports" className="btn small ">View all Records</Link>
          </div>
        </div>
      </div>
      <div className="container content">{children}</div>
    </div>
  )
}


