import { supabase, isSupabaseConfigured } from './supabase'
import * as fallback from '../data/fallbackContent'

// Every public-facing read goes through these helpers. When Supabase is
// configured, they hit the DB (RLS limits anonymous users to published
// rows — see supabase/migrations). Until then, the site renders from the
// resume-sourced fallback content so it's never broken or empty.

async function readTable(table, { orderBy = 'order', fallbackData } = {}) {
  if (!isSupabaseConfigured) return fallbackData
  const { data, error } = await supabase
    .from(table)
    .select('*')
    .eq('published', true)
    .order(orderBy, { ascending: true })
  if (error) {
    console.error(`[content] failed to load ${table}:`, error.message)
    return fallbackData
  }
  return data?.length ? data : fallbackData
}

export async function getProfile() {
  if (!isSupabaseConfigured) return fallback.profile
  const { data, error } = await supabase.from('profile').select('*').single()
  if (error || !data) return fallback.profile
  return data
}

export async function getSiteSettings() {
  if (!isSupabaseConfigured) return fallback.siteSettings
  const { data, error } = await supabase.from('site_settings').select('*').eq('id', true).single()
  if (error || !data) {
    if (error) console.error('[content] failed to load site settings:', error.message)
    return fallback.siteSettings
  }
  return data
}

export const getEducation = () => readTable('education', { fallbackData: fallback.education })
export const getSkillCategories = () => readTable('skill_categories', { fallbackData: fallback.skillCategories })
export const getProjects = () => readTable('projects', { fallbackData: fallback.projects })
export const getExperience = () => readTable('experience', { fallbackData: fallback.experience })
export const getAchievements = () => readTable('achievements', { fallbackData: fallback.achievements })
export const getCertifications = () => readTable('certifications', { fallbackData: fallback.certifications })
