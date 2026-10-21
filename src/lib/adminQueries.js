import { supabase } from './supabase'

// Thin wrappers around Supabase for the admin dashboard. These run with the
// logged-in user's session; RLS policies (see supabase/migrations) are what
// actually enforce that only the owner can write. These helpers do NOT
// bypass security — they're just convenience.

export async function listAll(table, orderBy = 'order') {
  const { data, error } = await supabase.from(table).select('*').order(orderBy, { ascending: true })
  if (error) throw error
  return data
}

export async function createRow(table, payload) {
  const { data, error } = await supabase.from(table).insert(payload).select().single()
  if (error) throw error
  return data
}

export async function updateRow(table, id, payload) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteRow(table, id) {
  const { error } = await supabase.from(table).delete().eq('id', id)
  if (error) throw error
}

export async function getSingleton(table) {
  const { data, error } = await supabase.from(table).select('*').single()
  if (error) throw error
  return data
}

export async function upsertSingleton(table, id, payload) {
  const { data, error } = await supabase.from(table).update(payload).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function uploadFile(bucket, path, file) {
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true })
  if (error) throw error
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
