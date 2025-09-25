import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

export function LoginPage() {
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Demo only: no auth. Navigate to dashboard.
    navigate('/dashboard')
  }

  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <div className="page-title">Login</div>
      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label">Username</label>
          <input className="input" value={username} onChange={(e) => setUsername(e.target.value)} />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn block" type="submit">Login</button>
      </form>
    </div>
  )
}


