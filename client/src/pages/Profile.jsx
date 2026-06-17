import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import api from '../services/api'
import { authSuccess } from '../features/auth/authSlice'
import { useDispatch } from 'react-redux'

// ─── Small reusable input ────────────────────────────────────────────────────
const Field = ({ label, name, type = 'text', value, onChange, disabled }) => (
  <div>
    <label className="block font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1.5">
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink placeholder-muted
                 focus:outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet
                 disabled:opacity-50 disabled:cursor-not-allowed transition"
    />
  </div>
)

// ─── Status banner ───────────────────────────────────────────────────────────
const Banner = ({ type, msg }) => {
  if (!msg) return null
  const styles =
    type === 'success'
      ? 'bg-green-50 border-green-200 text-green-700'
      : 'bg-red-50 border-red-200 text-red-600'
  return (
    <p className={`rounded-xl border px-4 py-3 text-sm ${styles}`}>{msg}</p>
  )
}

// ─── Section wrapper ─────────────────────────────────────────────────────────
const Section = ({ title, children }) => (
  <div className="rounded-2xl border border-line bg-white p-6 space-y-5">
    <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
    {children}
  </div>
)

// ─── Main component ───────────────────────────────────────────────────────────
const Profile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, handleLogout } = useAuth()

  // ── Profile edit state ──
  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: user?.address || '',
  })
  const [profileLoading, setProfileLoading] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  // ── Password change state ──
  const [pwForm, setPwForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pwLoading, setPwLoading] = useState(false)
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  if (!user) {
    navigate('/login')
    return null
  }

  // ── Handlers ──
  const handleProfileChange = (e) =>
    setProfileForm({ ...profileForm, [e.target.name]: e.target.value })

  const handlePwChange = (e) =>
    setPwForm({ ...pwForm, [e.target.name]: e.target.value })

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg({ type: '', text: '' })
    try {
      const res = await api.patch('/users/me', profileForm)
      const updatedUser = res.data.data
      const token = localStorage.getItem('accessToken')
      dispatch(authSuccess({ user: updatedUser, accessToken: token }))
      setProfileMsg({ type: 'success', text: 'Profile updated successfully.' })
    } catch (err) {
      setProfileMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update profile.',
      })
    } finally {
      setProfileLoading(false)
    }
  }

  const handlePwSubmit = async (e) => {
    e.preventDefault()
    setPwMsg({ type: '', text: '' })

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMsg({ type: 'error', text: 'New passwords do not match.' })
      return
    }

    setPwLoading(true)
    try {
      await api.patch('/users/me/password', {
        oldPassword: pwForm.oldPassword,
        newPassword: pwForm.newPassword,
      })
      setPwMsg({ type: 'success', text: 'Password changed successfully.' })
      setPwForm({ oldPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      setPwMsg({
        type: 'error',
        text: err.response?.data?.message || 'Failed to change password.',
      })
    } finally {
      setPwLoading(false)
    }
  }

  const onLogout = async () => {
    await handleLogout()
    navigate('/')
  }

  // ── Render ──
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Page header */}
      <header className="flex items-start justify-between">
        <div>
          <p className="font-tag text-xs uppercase tracking-[0.2em] text-violet">
            Account
          </p>
          <h1 className="mt-2 font-display text-2xl font-semibold text-ink md:text-3xl">
            My Profile
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="mt-1 rounded-lg border border-line px-4 py-2 text-sm font-medium text-muted
                     hover:border-coral/50 hover:text-coral transition"
        >
          Sign out
        </button>
      </header>

      {/* Read-only info card */}
      <Section title="Account info">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
              Email
            </p>
            <p className="text-sm text-ink">{user.email}</p>
          </div>
          <div>
            <p className="font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
              Role
            </p>
            <span className="inline-block rounded-full bg-violet/10 px-3 py-0.5 text-xs font-medium capitalize text-violet">
              {user.role}
            </span>
          </div>
          <div>
            <p className="font-tag text-[10px] uppercase tracking-[0.18em] text-muted mb-1">
              Member since
            </p>
            <p className="text-sm text-ink">
              {new Date(user.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </p>
          </div>
        </div>
      </Section>

      {/* Edit profile form */}
      <Section title="Edit profile">
        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <Banner type={profileMsg.type} msg={profileMsg.text} />
          <Field
            label="Full name"
            name="name"
            value={profileForm.name}
            onChange={handleProfileChange}
            disabled={profileLoading}
          />
          <Field
            label="Phone"
            name="phone"
            value={profileForm.phone}
            onChange={handleProfileChange}
            disabled={profileLoading}
          />
          <Field
            label="Address"
            name="address"
            value={profileForm.address}
            onChange={handleProfileChange}
            disabled={profileLoading}
          />
          <button
            type="submit"
            disabled={profileLoading}
            className="rounded-lg bg-violet px-5 py-2.5 text-sm font-medium text-white
                       hover:bg-violet/90 transition disabled:opacity-50"
          >
            {profileLoading ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </Section>

      {/* Change password form */}
      <Section title="Change password">
        <form onSubmit={handlePwSubmit} className="space-y-4">
          <Banner type={pwMsg.type} msg={pwMsg.text} />
          <Field
            label="Current password"
            name="oldPassword"
            type="password"
            value={pwForm.oldPassword}
            onChange={handlePwChange}
            disabled={pwLoading}
          />
          <Field
            label="New password"
            name="newPassword"
            type="password"
            value={pwForm.newPassword}
            onChange={handlePwChange}
            disabled={pwLoading}
          />
          <Field
            label="Confirm new password"
            name="confirmPassword"
            type="password"
            value={pwForm.confirmPassword}
            onChange={handlePwChange}
            disabled={pwLoading}
          />
          <button
            type="submit"
            disabled={pwLoading}
            className="rounded-lg bg-ink px-5 py-2.5 text-sm font-medium text-paper
                       hover:bg-ink/90 transition disabled:opacity-50"
          >
            {pwLoading ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </Section>
    </div>
  )
}

export default Profile