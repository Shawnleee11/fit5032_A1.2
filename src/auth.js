// very small auth helper (no backend)
const KEY = 'a12_user'

export function login(email, role='user') {
  const user = { email, role }
  localStorage.setItem(KEY, JSON.stringify(user))
  return user
}

export function logout() {
  localStorage.removeItem(KEY)
}

export function currentUser() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || 'null')
  } catch { return null }
}

export function isLoggedIn() {
  return !!currentUser()
}

export function hasRole(role) {
  const u = currentUser()
  return !!u && u.role === role
}
