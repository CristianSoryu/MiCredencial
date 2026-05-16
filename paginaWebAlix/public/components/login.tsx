import { useState } from "react"

export default function login () {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  return (
    <div>
      <input value={username} onChange={(e) => setUsername(e.target.value)} type="text" />
      <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" />
      <button>Login</button>
    </div>
  )
}
