// ============================================
// TEAM MEMBERS STORE (MySQL)
// ============================================
// CRUD for team members (pagina „Echipa”).
// Data lives in the `team_members` table (see sql/schema.sql).

const db = require('../config/database');

/**
 * Map a MySQL row to the camelCase object the API/frontend expects.
 */
function rowToMember(row) {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role,
    email: row.email,
    image: row.image,
    description: row.description,
    order: row.member_order || 0,
    isActive: !!row.is_active,
    createdAt: row.created_at
      ? new Date(String(row.created_at).replace(' ', 'T') + 'Z').toISOString()
      : undefined,
    updatedAt: row.updated_at
      ? new Date(String(row.updated_at).replace(' ', 'T') + 'Z').toISOString()
      : undefined,
  };
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
 * Get all team members.
 * @returns {Promise<Array<Object>>}
 */
async function getTeamMembers() {
  const rows = await db.query('SELECT * FROM team_members ORDER BY member_order ASC, id DESC');
  return sortMembers(rows.map(rowToMember));
}

/**
 * Get a single team member by id.
 * @returns {Promise<Object|null>}
 */
async function getTeamMemberById(id) {
  const rows = await db.query('SELECT * FROM team_members WHERE id = ?', [id]);
  if (!rows.length) return null;
  return rowToMember(rows[0]);
}

/**
 * Create a new team member.
 * @param {Object} data - camelCase payload (name required)
 * @returns {Promise<{id: string}>}
 */
async function addTeamMember(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO team_members (name, role, email, image, description, member_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.role ?? null,
      data.email ?? null,
      data.image ?? null,
      data.description ?? null,
      data.order ?? 0,
      data.isActive ?? true,
    ]
  );
  return { id: String(result.insertId) };
}

/**
 * Update an existing team member (merge + updatedAt).
 */
async function updateTeamMember(id, data) {
  const fields = [];
  const params = [];

  const columnMap = {
    name: 'name',
    role: 'role',
    email: 'email',
    image: 'image',
    description: 'description',
    order: 'member_order',
    isActive: 'is_active',
  };

  for (const [key, column] of Object.entries(columnMap)) {
    if (data[key] !== undefined) {
      fields.push(`${column} = ?`);
      params.push(data[key]);
    }
  }

  if (fields.length === 0) return;

  fields.push('updated_at = NOW()');
  params.push(id);

  const [result] = await db.getPool().execute(
    `UPDATE team_members SET ${fields.join(', ')} WHERE id = ?`,
    params
  );

  if (result.affectedRows === 0) {
    const exists = await db.query('SELECT id FROM team_members WHERE id = ?', [id]);
    if (!exists.length) {
      throw new Error('Team member not found');
    }
  }
}

/**
 * Delete a team member (idempotent).
 */
async function deleteTeamMember(id) {
  await db.query('DELETE FROM team_members WHERE id = ?', [id]);
}

module.exports = {
  getTeamMembers,
  getTeamMemberById,
  addTeamMember,
  updateTeamMember,
  deleteTeamMember,
};