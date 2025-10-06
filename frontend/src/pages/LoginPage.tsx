import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from "../firebase"


export function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth,email, password)
      navigate('/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed')
    }
  }



  return (
    <div className="card" style={{ maxWidth: 420, margin: '40px auto' }}>
      <div className="page-title">Login</div>
      {error && <div className="alert error" style={{ marginBottom: 12 }}>{error}</div>}
      <form onSubmit={onSubmit}>
        <div className="field">
          <label className="label">Email</label>
          <input className="input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input className="input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button className="btn block" type="submit">Sign in</button>
      </form>
    </div>
  )
}


