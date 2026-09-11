// ============================================
// TEAM MEMBERS STORE
// ============================================
// CRUD for team members (pagina „Echipa”).
// Uses Firebase Realtime Database at the "team" path, with a
// file-based fallback (backend/data/team/*.json).

const fs = require('fs');
const path = require('path');
const { dataFolder } = require('./folders');
const firebaseStore = require('./firebase-store');
const logger = require('./logger');

const teamFolder = path.join(dataFolder, 'team');
const TEAM_COLLECTION = 'team';

/**
 * Ensure the team data folder exists.
 */
function ensureTeamFolder() {
  if (!fs.existsSync(teamFolder)) {
    fs.mkdirSync(teamFolder, { recursive: true });
  }
}

/**
 * Sort members by order (asc), then createdAt (desc — newest first).
 * Mirrors the old frontend sorting so the admin table stays consistent.

 * @param {Array<Object>} members
 * @returns {Array<Object>}
 */
function sortMembers(members) {
  return members.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/**
 * Read all members from Firebase Realtime Database.
 * @returns {Promise<Array<Object>>}
 */
async function readFromFirebase() {
  const db = firebaseStore.getDatabase();
  const ref = db.ref(TEAM_COLLECTION);
  const snapshot = await ref.once('value');
  const data = snapshot.val();

  if (!data) return [];

  return sortMembers(
    Object.entries(data).map(([id, value]) => ({
      id,
      ...value,
    }))
  );
}

/**
 * Read all members from the filesystem fallback.
 * @returns {Array<Object>}
 */
function readFromFiles() {
  ensureTeamFolder();

  const members = [];
  for (const file of fs.readdirSync(teamFolder)) {
    if (!file.startsWith('team_') || !file.endsWith('.json')) continue;
    try {
      const content = fs.readFileSync(path.join(teamFolder, file), 'utf8');
      const data = JSON.parse(content);
      const id = file.replace(/^team_/, '').replace(/\.json$/, '');
      members.push({ id, ...data });
    } catch (error) {
      logger.warn('Failed to read team file:', file, error.message);
    }
  }

  return sortMembers(members);
}

/**
 * Get all team members (Firebase first, file fallback).
 * @returns {Promise<Array<Object>>}
 */
async function getTeamMembers() {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      return await readFromFirebase();
    } catch (error) {
      logger.warn('Firebase team read failed, falling back to file:', error.message);
    }
  }
  return readFromFiles();
}

/**
 * Get a single team member by id.
 * @returns {Promise<Object|null>}
 */
async function getTeamMemberById(id) {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      const db = firebaseStore.getDatabase();
      const snapshot = await db.ref(`${TEAM_COLLECTION}/${id}`).once('value');
      if (!snapshot.exists()) return null;
      return { id, ...snapshot.val() };
    } catch (error) {
      logger.warn('Firebase team read failed, falling back to file:', error.message);
    }
  }

  const filePath = path.join(teamFolder, `team_${id}.json`);
  if (!fs.existsSync(filePath)) return null;

  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return { id, ...data };
  } catch (error) {
    logger.error('Error reading team member file:', error);
    return null;
  }
}

/**
 * Create a new team member.
 * @returns {Promise<{id: string}>}
 */
async function addTeamMember(data) {
  const memberData = {
    ...data,
    createdAt: new Date().toISOString(),
  };

  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      const newRef = firebaseStore.getDatabase().ref(TEAM_COLLECTION).push();
      await newRef.set(memberData);
      return { id: newRef.key };
    } catch (error) {
      logger.warn('Firebase team write failed, falling back to file:', error.message);
    }
  }

  ensureTeamFolder();
  const id = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  fs.writeFileSync(
    path.join(teamFolder, `team_${id}.json`),
    JSON.stringify(memberData, null, 2)
  );
  return { id };
}

/**
 * Update an existing team member (merge + updatedAt).
 */
async function updateTeamMember(id, data) {
  if (firebaseStore.isFirebaseDbAvailable()) {

    try {
      const db = firebaseStore.getDatabase();
      const ref = db.ref(`${TEAM_COLLECTION}/${id}`);
      const snapshot = await ref.once('value');
      if (!snapshot.exists()) {
        throw new Error('Team member not found');
      }
      await ref.set({
        ...snapshot.val(),
        ...data,
        updatedAt: new Date().toISOString(),
      });
      return;
    } catch (error) {
      if (error.message === 'Team member not found') {
        throw error;
      }
      logger.warn('Firebase team update failed, falling back to file:', error.message);
    }
  }

  const filePath = path.join(teamFolder, `team_${id}.json`);
  if (!fs.existsSync(filePath)) {

    throw new Error('Team member not found');
  }
  const existing = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  fs.writeFileSync(
    filePath,
    JSON.stringify({
      ...existing,
      ...data,
      updatedAt: new Date().toISOString(),
    }, null, 2)
  );
}

/**
 * Delete a team member (idempotent.
 */
async function deleteTeamMember(id) {
  if (firebaseStore.isFirebaseDbAvailable()) {
    try {
      await firebaseStore.getDatabase().ref(`${TEAM_COLLECTION}/${id}`).remove();
      return;
    } catch (error) {
      logger.warn('Firebase team delete failed, falling back to file:', error.message);
      throw error;
    }
  }

  const filePath = path.join(teamFolder, `team_${id}.json`);
  if (fs.existsSync(filePath)) {

    fs.unlinkSync(filePath);
  }
}

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
};