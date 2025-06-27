// src/components/listoffunctions.js
import { supabase } from './supabaseClient';

// Fetch functions

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

// Insert functions with auth check

export async function addFacultyMember(faculty) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: insertedData, error } = await supabase.from('facultydata').insert([faculty]);
  if (error) throw error;
  return insertedData;
}

export async function addExecutiveMember(member) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: insertedData, error } = await supabase.from('members').insert([member]);
  if (error) throw error;
  return insertedData;
}

export async function addEvent(event) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: insertedData, error } = await supabase.from('events').insert([event]);
  if (error) throw error;
  return insertedData;
}

export async function addProject(project) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: insertedData, error } = await supabase.from('projects').insert([project]);
  if (error) throw error;
  return insertedData;
}

export async function addAchievement(achievement) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: insertedData, error } = await supabase.from('achievements').insert([achievement]);
  if (error) throw error;
  return insertedData;
}

// Update functions with auth check

export async function updateFacultyMember(id, updates) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: updatedData, error } = await supabase.from('facultydata').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateExecutiveMember(id, updates) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: updatedData, error } = await supabase.from('members').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateEvent(id, updates) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: updatedData, error } = await supabase.from('events').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateProject(id, updates) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: updatedData, error } = await supabase.from('projects').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateAchievement(id, updates) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: updatedData, error } = await supabase.from('achievements').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

// Delete functions with auth check

export async function deleteFacultyMember(id) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: deletedData, error } = await supabase.from('facultydata').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteExecutiveMember(id) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: deletedData, error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteEvent(id) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: deletedData, error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteProject(id) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: deletedData, error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteAchievement(id) {
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data || !data.user) throw new Error('User not authenticated');

  const { data: deletedData, error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}
