// src/components/listoffunctions.js
import { supabase } from './supabaseClient';

// Existing fetch functions

export async function getFacultyData() {
  const { data, error } = await supabase
    .from('facultydata')
    .select('*')
    .order('id', { ascending: true });
  if (error) throw error;
  return data;
}

export async function getExecutiveMembers(year) {
  const { data, error } = await supabase.from('members').select('*');
  if (error) throw error;
  return data.filter(item => item.year === year);
}

export async function getAllMembers() {
  const { data, error } = await supabase.from('members').select('*');
  if (error) throw error;
  return data;
}

export async function getEventData() {
  const { data, error } = await supabase.from('events').select('*');
  if (error) throw error;
  return data;
}

export async function getProjectData() {
  const { data, error } = await supabase.from('projects').select('*');
  if (error) throw error;
  return data;
}

export async function getAchievementData() {
  const { data, error } = await supabase.from('achievements').select('*');
  if (error) throw error;
  return data;
}

// New append (insert) functions

export async function addFacultyMember(faculty) {
  const { data, error } = await supabase.from('facultydata').insert([faculty]);
  if (error) throw error;
  return data;
}

export async function addExecutiveMember(member) {
  const { data, error } = await supabase.from('members').insert([member]);
  if (error) throw error;
  return data;
}

export async function addEvent(event) {
  const { data, error } = await supabase.from('events').insert([event]);
  if (error) throw error;
  return data;
}

export async function addProject(project) {
  const { data, error } = await supabase.from('projects').insert([project]);
  if (error) throw error;
  return data;
}

export async function addAchievement(achievement) {
  const { data, error } = await supabase.from('achievements').insert([achievement]);
  if (error) throw error;
  return data;
}

// New update (modify) functions

export async function updateFacultyMember(id, updates) {
  const { data, error } = await supabase.from('facultydata').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

export async function updateExecutiveMember(id, updates) {
  const { data, error } = await supabase.from('members').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

export async function updateEvent(id, updates) {
  const { data, error } = await supabase.from('events').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

export async function updateProject(id, updates) {
  const { data, error } = await supabase.from('projects').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

export async function updateAchievement(id, updates) {
  const { data, error } = await supabase.from('achievements').update(updates).eq('id', id);
  if (error) throw error;
  return data;
}

// New delete (remove) functions

export async function deleteFacultyMember(id) {
  const { data, error } = await supabase.from('facultydata').delete().eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteExecutiveMember(id) {
  const { data, error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteEvent(id) {
  const { data, error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteProject(id) {
  const { data, error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteAchievement(id) {
  const { data, error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw error;
  return data;
}
