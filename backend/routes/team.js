// ============================================
// TEAM ROUTES
// ============================================
// Public GET (active members) and admin CRUD (all members).
// Admin endpoints are protected by adminAuth inside this module so the
// public /team GET can stay reachable without authentication.

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const { cacheHeaders, noCache } = require('../middleware/cacheHeaders');
const { validateFieldLengths } = require('../utils/sanitize');
const teamStore = require('../utils/team-store');
const logger = require('../utils/logger');

/**
 * Validate a team member payload (all fields optional except name on create).
 * @returns {string|null} Error message or null if valid
 */
function validateTeamMemberPayload(body, { requireName = false } = {}) {
  if (!body || typeof body !== 'object') {
    return 'Date invalide.';
  }
  if (requireName && !body.name?.trim()) {
    return 'Numele este obligatoriu.';
  }
  return validateFieldLengths(body);
}

/**
 * GET /team — public list of active members (for the public page).
 */
router.get('/team', cacheHeaders(60), async (req, res) => {
  try {
    const members = await teamStore.getTeamMembers();
    res.json({
      success: true,
      team: members.filter(member => member.isActive),
    });
  } catch (error) {
    logger.error('Error fetching team members:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la citirea echipei.',
    });
  }
});

/**
 * GET /admin/team — admin list of all members.
 */
router.get('/admin/team', noCache, adminAuth, async (req, res) => {
  try {
    const members = await teamStore.getTeamMembers();
    res.json({
      success: true,
      team: members,
    });
  } catch (error) {
    logger.error('Error fetching team members (admin):', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la citirea echipei.',
    });
  }
});

/**
 * GET /admin/team/:id — admin fetch single member.
 */
router.get('/admin/team/:id', adminAuth, async (req, res) => {
  try {
    const member = await teamStore.getTeamMemberById(req.params.id);
    if (!member) {
      return res.status(404).json({
        success: false,
        error: 'Membrul echipei nu a fost găsit.',
      });
    }
    res.json({
      success: true,
      team: member,
    });
  } catch (error) {
    logger.error('Error fetching team member:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la citirea membrului echipei.',
    });
  }
});

/**
 * POST /admin/team — create a new team member.
 */
router.post('/admin/team', adminAuth, async (req, res) => {
  try {
    const validationError = validateTeamMemberPayload(req.body, { requireName: true });
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    const { id } = await teamStore.addTeamMember(req.body);
    logger.info('Team member created:', id);

    res.status(201).json({
      success: true,
      id,
      message: 'Membrul echipei a fost adăugat cu succes!',
    });
  } catch (error) {
    logger.error('Error creating team member:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la adăugarea membrului echipei.',
    });
  }
});

/**
 * PUT /admin/team/:id — update a team member (incl. optional description).
 */
router.put('/admin/team/:id', adminAuth, async (req, res) => {
  try {
    const validationError = validateTeamMemberPayload(req.body);
    if (validationError) {
      return res.status(400).json({ success: false, error: validationError });
    }

    await teamStore.updateTeamMember(req.params.id, req.body);
    logger.info('Team member updated:', req.params.id);

    res.json({
      success: true,
      message: 'Membrul echipei a fost actualizat cu succes!',
    });
  } catch (error) {
    if (error.message === 'Team member not found') {
      return res.status(404).json({
        success: false,
        error: 'Membrul echipei nu a fost găsit.',
      });
    }
    logger.error('Error updating team member:', error);
    res.status(500).json({
      success: false,
      error: 'A apărut o eroare la actualizarea membrului echipei.',
    });
  }
});

/**
 * DELETE /admin/team/:id — delete a team member.
 */
router.delete('/admin/team/:id', adminAuth, async (req, res) => {
  try {
    await teamStore.deleteTeamMember(req.params.id);
    logger.info('Team member deleted:', req.params.id);

    res.json({
      success: true,
      message: 'Membrul echipei a fost șters cu succes!',
    });
  } catch (error) {
    logger.error('Error deleting team member:', error);
    res.status(500).json({
      success: false,
      error: 'Nu s-a putut șterge membrul echipei.',
    });
  }
});

module.exports = router;