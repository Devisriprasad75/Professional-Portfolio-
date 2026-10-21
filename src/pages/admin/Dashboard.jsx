import { useState } from 'react'
import {
  User, GraduationCap, Wrench, FolderKanban, BookOpen, Trophy, BadgeCheck, Mail, LogOut, ExternalLink, Eye, LayoutDashboard,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import ProfileEditor from './ProfileEditor'
import MessagesViewer from './MessagesViewer'
import CrudManager from './CrudManager'
import SiteSettingsEditor from './SiteSettingsEditor'
import DashboardOverview from './DashboardOverview'

const TABS = [
  { key: 'overview', label: 'Overview', icon: LayoutDashboard },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'education', label: 'Education', icon: GraduationCap },
  { key: 'skills', label: 'Skills', icon: Wrench },
  { key: 'projects', label: 'Projects', icon: FolderKanban },
  { key: 'experience', label: 'Experience', icon: BookOpen },
  { key: 'achievements', label: 'Achievements', icon: Trophy },
  { key: 'certifications', label: 'Certifications', icon: BadgeCheck },
  { key: 'sections', label: 'Site Sections', icon: Eye },
  { key: 'messages', label: 'Messages', icon: Mail },
]

export default function Dashboard() {
  const [tab, setTab] = useState('overview')
  const { signOut, user } = useAuth()

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="hidden w-64 shrink-0 border-r border-bg-border p-5 lg:block">
        <p className="mb-1 font-display text-lg font-semibold">
          DSP<span className="text-accent-blue">.</span> Admin
        </p>
        <p className="mb-6 truncate text-xs text-ink-faint">{user?.email}</p>
        <nav className="space-y-1">
          {TABS.map((t) => {
            const Icon = t.icon
            return (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition-colors ${
                  tab === t.key ? 'bg-accent-blue/10 text-accent-blue' : 'text-ink-muted hover:bg-bg-raised hover:text-ink'
                }`}
              >
                <Icon size={16} /> {t.label}
              </button>
            )
          })}
        </nav>
        <div className="mt-8 space-y-1 border-t border-bg-border pt-4">
          <a href="/" target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-ink-muted hover:bg-bg-raised hover:text-ink">
            <ExternalLink size={16} /> View Site
          </a>
          <button onClick={signOut} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-red-400 hover:bg-red-500/10">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Mobile tab bar */}
      <div className="fixed inset-x-0 bottom-0 z-40 flex overflow-x-auto border-t border-bg-border bg-bg/95 backdrop-blur lg:hidden">
        {TABS.map((t) => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex min-w-[72px] flex-col items-center gap-1 px-3 py-2.5 text-xs ${
                tab === t.key ? 'text-accent-blue' : 'text-ink-faint'
              }`}
            >
              <Icon size={16} /> {t.label}
            </button>
          )
        })}
      </div>

      <main className="flex-1 overflow-y-auto p-6 pb-24 lg:p-10 lg:pb-10">
        {tab === 'overview' && <DashboardOverview onOpenSection={setTab} />}
        {tab === 'profile' && <ProfileEditor />}

        {tab === 'education' && (
          <CrudManager
            table="education"
            title="Education"
            fields={[
              { key: 'degree', label: 'Degree / Qualification' },
              { key: 'institution', label: 'Institution' },
              { key: 'location', label: 'Location' },
              { key: 'start_date', label: 'Start date', type: 'date' },
              { key: 'end_date', label: 'End date', type: 'date' },
              { key: 'end_label', label: 'Date label (e.g. "Expected June 2027")' },
              { key: 'details', label: 'Relevant coursework / details', type: 'textarea' },
              { key: 'order', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            emptyRow={{ degree: '', institution: '', location: '', start_date: '', end_date: '', end_label: '', details: '', order: 0, published: true }}
          />
        )}

        {tab === 'skills' && (
          <CrudManager
            table="skill_categories"
            title="Skill Categories"
            fields={[
              { key: 'name', label: 'Category name' },
              { key: 'icon', label: 'Lucide icon name (e.g. Code2, Database, Server)' },
              { key: 'skills', label: 'Skills', type: 'array' },
              { key: 'order', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            emptyRow={{ name: '', icon: 'Code2', skills: [], order: 0, published: true }}
          />
        )}

        {tab === 'projects' && (
          <CrudManager
            table="projects"
            title="Projects"
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'summary', label: 'Short summary', type: 'textarea' },
              { key: 'description', label: 'Detailed description', type: 'textarea' },
              { key: 'technologies', label: 'Technologies', type: 'array' },
              { key: 'thumbnail_url', label: 'Thumbnail image', type: 'image' },
              { key: 'github_url', label: 'GitHub repository URL' },
              { key: 'live_url', label: 'Live demo URL' },
              { key: 'status', label: 'Status', type: 'select', options: ['In Progress', 'Completed'] },
              { key: 'featured', label: 'Featured project', type: 'boolean' },
              { key: 'order', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            emptyRow={{
              title: '', summary: '', description: '', technologies: [], thumbnail_url: '',
              github_url: '', live_url: '', status: 'In Progress', featured: false, order: 0, published: true,
            }}
          />
        )}

        {tab === 'experience' && (
          <CrudManager
            table="experience"
            title="Experience & Learning"
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'organization', label: 'Organization' },
              { key: 'type', label: 'Type (e.g. "Training", "Learning")' },
              { key: 'start_date', label: 'Start date', type: 'date' },
              { key: 'end_date', label: 'End date', type: 'date' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'order', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            emptyRow={{ title: '', organization: '', type: 'Learning', start_date: '', end_date: '', description: '', order: 0, published: true }}
          />
        )}

        {tab === 'achievements' && (
          <CrudManager
            table="achievements"
            title="Achievements"
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'issuer', label: 'Issuer / Event' },
              { key: 'date', label: 'Date', type: 'date' },
              { key: 'description', label: 'Description', type: 'textarea' },
              { key: 'order', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            emptyRow={{ title: '', issuer: '', date: '', description: '', order: 0, published: true }}
          />
        )}

        {tab === 'certifications' && (
          <CrudManager
            table="certifications"
            title="Certifications"
            fields={[
              { key: 'title', label: 'Title' },
              { key: 'issuer', label: 'Issuer' },
              { key: 'issue_date', label: 'Issue date', type: 'date' },
              { key: 'credential_url', label: 'Credential URL' },
              { key: 'image_url', label: 'Certificate image', type: 'image' },
              { key: 'order', label: 'Display order', type: 'number' },
              { key: 'published', label: 'Published', type: 'boolean' },
            ]}
            emptyRow={{ title: '', issuer: '', issue_date: '', credential_url: '', image_url: '', order: 0, published: true }}
          />
        )}

        {tab === 'messages' && <MessagesViewer />}
        {tab === 'sections' && <SiteSettingsEditor />}
      </main>
    </div>
  )
}
