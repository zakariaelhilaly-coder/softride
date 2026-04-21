'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState({
    whatsapp: '', email: '', address: '', instagram: '', admin_password: '',
  })
  const [newPassword, setNewPassword] = useState('')
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    fetch('/api/admin/settings').then(r => {
      if (r.status === 401) { router.push('/admin'); return null }
      return r.json()
    }).then(data => { if (data) setSettings(s => ({ ...s, ...data })) })
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const data: Record<string, string> = { ...settings }
    if (newPassword) data.admin_password = newPassword
    await fetch('/api/admin/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    setSaved(true)
    setNewPassword('')
    setLoading(false)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-dark text-white px-6 py-4 flex items-center justify-between">
        <span className="font-bold text-lg">⚙️ Softride Admin</span>
        <Link href="/" className="text-sm text-gray-300 hover:text-white">👁️ Voir le site</Link>
      </header>
      <div className="flex">
        <aside className="w-56 bg-white h-[calc(100vh-60px)] sticky top-0 border-r p-4">
          <nav className="space-y-1">
            {[
              { href: '/admin/dashboard', icon: '📊', label: 'Tableau de bord' },
              { href: '/admin/dashboard/products', icon: '📦', label: 'Produits' },
              { href: '/admin/dashboard/categories', icon: '🗂️', label: 'Catégories' },
              { href: '/admin/dashboard/settings', icon: '⚙️', label: 'Paramètres' },
            ].map(item => (
              <Link key={item.href} href={item.href} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-green-50 hover:text-primary transition-colors">
                <span>{item.icon}</span>{item.label}
              </Link>
            ))}
          </nav>
        </aside>

        <main className="flex-1 p-8 max-w-2xl">
          <h1 className="text-2xl font-bold text-dark mb-6">Paramètres du site</h1>

          <form onSubmit={handleSave} className="space-y-5 bg-white rounded-2xl p-6 shadow-sm border">
            {[
              { key: 'whatsapp', label: 'Numéro WhatsApp', placeholder: '212770892279', type: 'text' },
              { key: 'email', label: 'Email', placeholder: 'contact@softride.ma', type: 'email' },
              { key: 'address', label: 'Adresse', placeholder: 'Rabat • Salé • Kénitra', type: 'text' },
              { key: 'instagram', label: 'Instagram', placeholder: '@softride000', type: 'text' },
            ].map(field => (
              <div key={field.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{field.label}</label>
                <input
                  type={field.type}
                  value={settings[field.key as keyof typeof settings]}
                  onChange={e => setSettings(s => ({ ...s, [field.key]: e.target.value }))}
                  placeholder={field.placeholder}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
                />
              </div>
            ))}

            <hr className="border-gray-100" />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nouveau mot de passe admin</label>
              <input
                type="password"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                placeholder="Laisser vide pour ne pas changer"
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 outline-none focus:border-primary"
              />
            </div>

            {saved && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3">
                ✅ Paramètres enregistrés avec succès !
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-dark transition-colors disabled:opacity-50">
              {loading ? 'Enregistrement...' : '💾 Enregistrer les paramètres'}
            </button>
          </form>
        </main>
      </div>
    </div>
  )
}
