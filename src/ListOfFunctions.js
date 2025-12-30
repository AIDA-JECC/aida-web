// src/components/listoffunctions.js
import { supabase } from './supabaseClient';

// Helper function for authentication and approval check
async function authenticateAndCheckApproval() {
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    throw new Error('User not authenticated');
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('approved')
    .eq('id', user.id)
    .single();

  if (profileError) {
    throw new Error('Failed to check user approval status.');
  }
  if (!profile || !profile.approved) {
    throw new Error('User is not approved by an admin.');
  }
  return user; // Return the user object if approved
}

// --- Fetch functions (no changes needed for these as they are read-only) ---

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

export async function addFacultyMember(faculty) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: insertedData, error } = await supabase.from('facultydata').insert([faculty]);
  if (error) throw error;
  return insertedData;
}

export async function addExecutiveMember(member) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: insertedData, error } = await supabase.from('members').insert([member]);
  if (error) throw error;
  return insertedData;
}

export async function addEvent(event) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: insertedData, error } = await supabase.from('events').insert([event]);
  if (error) throw error;
  return insertedData;
}

export async function addProject(project) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: insertedData, error } = await supabase.from('projects').insert([project]);
  if (error) throw error;
  return insertedData;
}

export async function addAchievement(achievement) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: insertedData, error } = await supabase.from('achievements').insert([achievement]);
  if (error) throw error;
  return insertedData;
}

export async function updateFacultyMember(id, updates) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: updatedData, error } = await supabase.from('facultydata').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateExecutiveMember(id, updates) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: updatedData, error } = await supabase.from('members').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateEvent(id, updates) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: updatedData, error } = await supabase.from('events').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateProject(id, updates) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: updatedData, error } = await supabase.from('projects').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function updateAchievement(id, updates) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: updatedData, error } = await supabase.from('achievements').update(updates).eq('id', id);
  if (error) throw error;
  return updatedData;
}

export async function deleteFacultyMember(id) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: deletedData, error } = await supabase.from('facultydata').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteExecutiveMember(id) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: deletedData, error } = await supabase.from('members').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteEvent(id) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: deletedData, error } = await supabase.from('events').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteProject(id) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: deletedData, error } = await supabase.from('projects').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}

export async function deleteAchievement(id) {
  await authenticateAndCheckApproval(); // Call the helper function

  const { data: deletedData, error } = await supabase.from('achievements').delete().eq('id', id);
  if (error) throw error;
  return deletedData;
}


