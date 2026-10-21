import { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Hero from '../sections/Hero'
import About from '../sections/About'
import Education from '../sections/Education'
import Skills from '../sections/Skills'
import Projects from '../sections/Projects'
import { Experience, Achievements } from '../sections/ExperienceAchievements'
import Certifications from '../sections/Certifications'
import Resume from '../sections/Resume'
import Contact from '../sections/Contact'
import {
  getProfile, getSiteSettings, getEducation, getSkillCategories, getProjects, getExperience, getAchievements, getCertifications,
} from '../lib/content'
import { profile as fallbackProfile, siteSettings as fallbackSettings } from '../data/fallbackContent'

export default function Home() {
  const [data, setData] = useState({
    profile: fallbackProfile,
    settings: fallbackSettings,
    education: [],
    skills: [],
    projects: [],
    experience: [],
    achievements: [],
    certifications: [],
  })

  useEffect(() => {
    let active = true
    Promise.all([
      getProfile(), getSiteSettings(), getEducation(), getSkillCategories(), getProjects(), getExperience(), getAchievements(), getCertifications(),
    ]).then(([profile, settings, education, skills, projects, experience, achievements, certifications]) => {
      if (!active) return
      setData({ profile, settings, education, skills, projects, experience, achievements, certifications })
    })
    return () => { active = false }
  }, [])

  const sections = data.settings.sections || fallbackSettings.sections

  return (
    <div className="min-h-screen">
      <Navbar profile={data.profile} sections={sections} />
      <main>
        {sections.home !== false && <Hero profile={data.profile} />}
        {sections.about !== false && <About profile={data.profile} />}
        {sections.education !== false && <Education education={data.education} />}
        {sections.skills !== false && <Skills categories={data.skills} />}
        {sections.projects !== false && <Projects projects={data.projects} />}
        {sections.experience !== false && <Experience experience={data.experience} />}
        {sections.achievements !== false && <Achievements achievements={data.achievements} />}
        {sections.certifications !== false && <Certifications certifications={data.certifications} />}
        {sections.resume !== false && <Resume profile={data.profile} />}
        {sections.contact !== false && <Contact profile={data.profile} />}
      </main>
      <Footer profile={data.profile} sections={sections} />
    </div>
  )
}
