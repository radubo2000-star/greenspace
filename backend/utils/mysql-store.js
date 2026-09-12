// ============================================
// MYSQL STORE — GALERY / STATISTICS / METRICS
// ============================================
// Single module that stores gallery/statistics/testimonial data in MySQL.
// Database access for:
//   - gallery collections (stories, video testimonials, before/after, live streams)
//   - annual statistics
//   - home-page testimonials
//   - gallery metrics (story views, likes, comments, live viewers,
//     before/after views & project stats)
//
// Every table is defined in backend/sql/schema.sql.

const db = require('../config/database');

// ============================================
// HELPERS
// ============================================

/** Convert 'YYYY-MM-DD HH:MM:SS[.mmm]' (or NULL) to an ISO string. */
function toIsoString(value) {
  if (!value) return undefined;
  const str = String(value).replace(' ', 'T');
  return new Date(str.endsWith('Z') || /[+-]\d{2}:\d{2}$/.test(str) ? str : `${str}Z`).toISOString();
}

/** Map gallery_stories row -> frontend Story shape. */
function storyFromRow(row) {
  return {
    id: String(row.id),
    type: row.type,
    url: row.url,
    thumbnail: row.thumbnail,
    location: row.location,
    title: row.title,
    description: row.description,
    date: row.display_date,
    timestamp: Number(row.timestamp || 0),
  };
}

/** Map gallery_testimonials row -> frontend Testimonial shape. */
function videoTestimonialFromRow(row) {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    videoUrl: row.video_url,
    thumbnail: row.thumbnail,
    title: row.title,
    description: row.description,
    duration: row.duration,
    rating: row.rating,
    timestamp: Number(row.timestamp || 0),
    createdAt: toIsoString(row.created_at),
  };
}

/** Map gallery_before_after row -> frontend BeforeAfterProject shape. */
function beforeAfterFromRow(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    date: row.display_date,
    beforeImage: row.before_image,
    afterImage: row.after_image,
    volunteers: row.volunteers,
    treesPlanted: row.trees_planted,
    wasteCollected: row.waste_collected,
    area: row.area,
    timestamp: Number(row.timestamp || 0),
  };
}

/** Map gallery_live_streams row -> frontend LiveStream shape. */
function liveStreamFromRow(row) {
  return {
    id: String(row.id),
    title: row.title,
    description: row.description,
    thumbnail: row.thumbnail,
    streamUrl: row.stream_url,
    isLive: !!row.is_live,
    scheduledTime: row.scheduled_time
      ? toIsoString(row.scheduled_time)
      : undefined,
    viewers: row.viewers || 0,
    durationHours: row.duration_hours,
    timestamp: Number(row.timestamp || 0),
  };
}

/** Map annual_statistics row -> frontend AnnualStatistics shape. */
function statisticsFromRow(row) {
  return {
    id: String(row.id),
    year: row.year,
    volunteers: row.volunteers,
    treesPlanted: row.trees_planted,
    projects: row.projects,
    events: row.events,
    plantingEvents: row.planting_events,
    wasteCollected: row.waste_collected,
    participants: row.participants,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

/** Map homepage_testimonials row -> Testimonial type. */
function homepageTestimonialFromRow(row) {
  return {
    id: String(row.id),
    name: row.name,
    role: row.role,
    image: row.image,
    quote: row.quote,
    rating: row.rating,
    order: row.testimonial_order,
    isActive: !!row.is_active,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  };
}

// ============================================
// GALLERY STORIES
// ============================================

async function getAllStories() {
  const rows = await db.query('SELECT * FROM gallery_stories ORDER BY timestamp DESC, id DESC');
  return rows.map(storyFromRow);
}

async function createStory(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO gallery_stories (type, url, thumbnail, location, title, description, display_date, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.type || 'image',
      data.url,
      data.thumbnail ?? null,
      data.location ?? null,
      data.title ?? null,
      data.description ?? null,
      data.date ?? null,
      data.timestamp ?? Date.now(),
    ]
  );
  return { id: String(result.insertId) };
}

async function updateStory(id, data) {
  await db.getPool().execute(
    `UPDATE gallery_stories SET
       type = ?, url = ?, thumbnail = ?, location = ?, title = ?, description = ?,
       display_date = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      data.type ?? 'image',
      data.url,
      data.thumbnail ?? null,
      data.location ?? null,
      data.title ?? null,
      data.description ?? null,
      data.date ?? null,
      id,
    ]
  );
}

async function deleteStory(id) {
  await db.query('DELETE FROM gallery_stories WHERE id = ?', [id]);
}

// ============================================
// GALLERY VIDEO TESTIMONIALS
// ============================================

async function getAllGalleryTestimonials() {
  const rows = await db.query('SELECT * FROM gallery_testimonials ORDER BY timestamp DESC, id DESC');
  return rows.map(videoTestimonialFromRow);
}

async function createGalleryTestimonial(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO gallery_testimonials
       (name, role, avatar, video_url, thumbnail, title, description, duration, rating, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.role ?? null,
      data.avatar ?? null,
      data.videoUrl ?? null,
      data.thumbnail ?? null,
      data.title ?? null,
      data.description ?? null,
      data.duration ?? null,
      data.rating ?? null,
      data.timestamp ?? Date.now(),
    ]
  );
  return { id: String(result.insertId) };
}

async function updateGalleryTestimonial(id, data) {
  await db.getPool().execute(
    `UPDATE gallery_testimonials SET
       name = ?, role = ?, avatar = ?, video_url = ?, thumbnail = ?, title = ?,
       description = ?, duration = ?, rating = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      data.name,
      data.role ?? null,
      data.avatar ?? null,
      data.videoUrl ?? null,
      data.thumbnail ?? null,
      data.title ?? null,
      data.description ?? null,
      data.duration ?? null,
      data.rating ?? null,
      id,
    ]
  );
}

async function deleteGalleryTestimonial(id) {
  await db.query('DELETE FROM gallery_testimonials WHERE id = ?', [id]);
}

// ============================================
// GALLERY BEFORE/AFTER PROJECTS
// ============================================

async function getAllBeforeAfter() {
  const rows = await db.query('SELECT * FROM gallery_before_after ORDER BY timestamp DESC, id DESC');
  return rows.map(beforeAfterFromRow);
}

async function createBeforeAfter(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO gallery_before_after
       (title, description, category, location, display_date, before_image, after_image,
        volunteers, trees_planted, waste_collected, area, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description ?? null,
      data.category ?? 'general',
      data.location ?? null,
      data.date ?? null,
      data.beforeImage ?? null,
      data.afterImage ?? null,
      data.volunteers ?? 0,
      data.treesPlanted ?? 0,
      data.wasteCollected ?? 0,
      data.area ?? 0,
      data.timestamp ?? Date.now(),
    ]
  );
  return { id: String(result.insertId) };
}

async function updateBeforeAfter(id, data) {
  await db.getPool().execute(
    `UPDATE gallery_before_after SET
       title = ?, description = ?, category = ?, location = ?, display_date = ?,
       before_image = ?, after_image = ?, volunteers = ?, trees_planted = ?,
       waste_collected = ?, area = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      data.title,
      data.description ?? null,
      data.category ?? 'general',
      data.location ?? null,
      data.date ?? null,
      data.beforeImage ?? null,
      data.afterImage ?? null,
      data.volunteers ?? 0,
      data.treesPlanted ?? 0,
      data.wasteCollected ?? 0,
      data.area ?? 0,
      id,
    ]
  );
}

async function deleteBeforeAfter(id) {
  await db.query('DELETE FROM gallery_before_after WHERE id = ?', [id]);
}

// ============================================
// GALLERY LIVE STREAMS
// ============================================

async function getAllLiveStreams() {
  const rows = await db.query('SELECT * FROM gallery_live_streams ORDER BY timestamp DESC, id DESC');
  return rows.map(liveStreamFromRow);
}

async function createLiveStream(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO gallery_live_streams
       (title, description, thumbnail, stream_url, is_live, scheduled_time, viewers, duration_hours, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.description ?? null,
      data.thumbnail ?? null,
      data.streamUrl ?? null,
      data.isLive ?? false,
      data.scheduledTime ? new Date(data.scheduledTime) : null,
      data.viewers ?? 0,
      data.durationHours ?? 2,
      data.timestamp ?? Date.now(),
    ]
  );
  return { id: String(result.insertId) };
}

async function updateLiveStream(id, data) {
  await db.getPool().execute(
    `UPDATE gallery_live_streams SET
       title = ?, description = ?, thumbnail = ?, stream_url = ?, is_live = ?,
       scheduled_time = ?, viewers = ?, duration_hours = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      data.title,
      data.description ?? null,
      data.thumbnail ?? null,
      data.streamUrl ?? null,
      data.isLive ?? false,
      data.scheduledTime ? new Date(data.scheduledTime) : null,
      data.viewers ?? 0,
      data.durationHours ?? 2,
      id,
    ]
  );
}

async function deleteLiveStream(id) {
  await db.query('DELETE FROM gallery_live_streams WHERE id = ?', [id]);
}

// ============================================
// ANNUAL STATISTICS
// ============================================

async function getAllStatistics() {
  const rows = await db.query('SELECT * FROM annual_statistics ORDER BY year DESC');
  return rows.map(statisticsFromRow);
}

async function createStatistics(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO annual_statistics
       (year, volunteers, trees_planted, projects, events, planting_events, waste_collected, participants)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.year,
      data.volunteers ?? 0,
      data.treesPlanted ?? 0,
      data.projects ?? 0,
      data.events ?? 0,
      data.plantingEvents ?? 0,
      data.wasteCollected ?? 0,
      data.participants ?? 0,
    ]
  );
  return { id: String(result.insertId) };
}

async function updateStatistics(id, data) {
  await db.getPool().execute(
    `UPDATE annual_statistics SET
       year = ?, volunteers = ?, trees_planted = ?, projects = ?, events = ?,
       planting_events = ?, waste_collected = ?, participants = ?, updated_at = NOW()
     WHERE id = ?`,
    [
      data.year,
      data.volunteers ?? 0,
      data.treesPlanted ?? 0,
      data.projects ?? 0,
      data.events ?? 0,
      data.plantingEvents ?? 0,
      data.wasteCollected ?? 0,
      data.participants ?? 0,
      id,
    ]
  );
}

async function deleteStatistics(id) {
  await db.query('DELETE FROM annual_statistics WHERE id = ?', [id]);
}

// ============================================
// HOME-PAGE TESTIMONIALS
// ============================================

async function getAllHomepageTestimonials() {
  const rows = await db.query(
    'SELECT * FROM homepage_testimonials ORDER BY testimonial_order ASC, id DESC'
  );
  return rows.map(homepageTestimonialFromRow);
}

async function getActiveHomepageTestimonials() {
  const rows = await db.query(
    'SELECT * FROM homepage_testimonials WHERE is_active = TRUE ORDER BY testimonial_order ASC, id DESC'
  );
  return rows.map(homepageTestimonialFromRow);
}

async function createHomepageTestimonial(data) {
  const [result] = await db.getPool().execute(
    `INSERT INTO homepage_testimonials (name, role, image, quote, rating, testimonial_order, is_active)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      data.name,
      data.role ?? null,
      data.image ?? null,
      data.quote ?? null,
      data.rating ?? 5,
      data.order ?? 0,
      data.isActive ?? true,
    ]
  );
  return { id: String(result.insertId) };
}

async function updateHomepageTestimonial(id, data) {
  const fields = [];
  const params = [];
  const columnMap = {
    name: 'name',
    role: 'role',
    image: 'image',
    quote: 'quote',
    rating: 'rating',
    order: 'testimonial_order',
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
  await db.getPool().execute(
    `UPDATE homepage_testimonials SET ${fields.join(', ')} WHERE id = ?`,
    params
  );
}

async function deleteHomepageTestimonial(id) {
  await db.query('DELETE FROM homepage_testimonials WHERE id = ?', [id]);
}

// ============================================
// METRICS
// ============================================

/** Story views */
async function incrementStoryViewsFor(storyId) {
  await db.getPool().execute(
    `INSERT INTO story_views (story_id, views) VALUES (?, 1)
     ON DUPLICATE KEY UPDATE views = views + 1`,
    [storyId]
  );
}

async function getStoryViewsFor(storyId) {
  const rows = await db.query('SELECT views FROM story_views WHERE story_id = ?', [storyId]);
  return rows.length ? Number(rows[0].views) : 0;
}

/** Video-testimonial likes */
async function toggleTestimonialLikeFor(testimonialId, userId) {
  const rows = await db.query(
    'SELECT 1 FROM testimonial_likes WHERE testimonial_id = ? AND user_id = ?',
    [testimonialId, userId]
  );
  if (rows.length) {
    await db.query(
      'DELETE FROM testimonial_likes WHERE testimonial_id = ? AND user_id = ?',
      [testimonialId, userId]
    );
    return false;
  }
  await db.getPool().execute(
    'INSERT INTO testimonial_likes (testimonial_id, user_id) VALUES (?, ?)',
    [testimonialId, userId]
  );
  return true;
}

async function getTestimonialLikesFor(testimonialId) {
  const rows = await db.query(
    'SELECT COUNT(*) AS cnt FROM testimonial_likes WHERE testimonial_id = ?',
    [testimonialId]
  );
  return Number(rows[0].cnt);
}

async function hasUserLikedTestimonial(testimonialId, userId) {
  const rows = await db.query(
    'SELECT 1 FROM testimonial_likes WHERE testimonial_id = ? AND user_id = ?',
    [testimonialId, userId]
  );
  return rows.length > 0;
}

/** Video-testimonial comments */
async function addTestimonialCommentTo(testimonialId, userId, text, userName) {
  const [result] = await db.getPool().execute(
    `INSERT INTO testimonial_comments (testimonial_id, user_id, user_name, text)
     VALUES (?, ?, ?, ?)`,
    [testimonialId, userId, userName || 'Utilizator', text]
  );
  return { id: String(result.insertId) };
}

async function getTestimonialCommentsFor(testimonialId) {
  const rows = await db.query(
    `SELECT id, user_id, user_name, text, created_at
       FROM testimonial_comments
      WHERE testimonial_id = ?
      ORDER BY created_at DESC`,
    [testimonialId]
  );
  return rows.map(row => ({
    id: String(row.id),
    userId: row.user_id,
    userName: row.user_name,
    text: row.text,
    timestamp: row.created_at
      ? new Date(String(row.created_at).replace(' ', 'T') + 'Z').getTime()
      : 0,
  }));
}

/** Live-stream presence */
async function joinLiveStreamFor(streamId, userId) {
  await db.getPool().execute(
    'INSERT IGNORE INTO livestream_viewers (stream_id, user_id) VALUES (?, ?)',
    [streamId, userId]
  );
}

async function leaveLiveStreamFor(streamId, userId) {
  await db.query(
    'DELETE FROM livestream_viewers WHERE stream_id = ? AND user_id = ?',
    [streamId, userId]
  );
}

async function getLiveStreamViewersFor(streamId) {
  const rows = await db.query(
    'SELECT COUNT(*) AS cnt FROM livestream_viewers WHERE stream_id = ?',
    [streamId]
  );
  return Number(rows[0].cnt);
}

/** Before/After project views */
async function incrementBeforeAfterViewsFor(projectId) {
  await db.getPool().execute(
    `INSERT INTO before_after_views (project_id, views) VALUES (?, 1)
     ON DUPLICATE KEY UPDATE views = views + 1`,
    [projectId]
  );
}

async function getBeforeAfterViewsFor(projectId) {
  const rows = await db.query('SELECT views FROM before_after_views WHERE project_id = ?', [projectId]);
  return rows.length ? Number(rows[0].views) : 0;
}

/** Before/After project stats (volunteers, trees, waste, area) */
async function updateBeforeAfterStats(projectId, stats) {
  await db.getPool().execute(
    `INSERT INTO before_after_views (project_id, views, stats)
     VALUES (?, 0, ?)
     ON DUPLICATE KEY UPDATE stats = ?`,
    [projectId, JSON.stringify(stats), JSON.stringify(stats)]
  );
}

async function getBeforeAfterStats(projectId) {
  const rows = await db.query('SELECT stats FROM before_after_views WHERE project_id = ?', [projectId]);
  if (!rows.length || rows[0].stats === null || rows[0].stats === undefined) return {};
  // mysql2 auto-parses JSON columns; handle string form too.
  if (typeof rows[0].stats === 'string') {
    try {
      return JSON.parse(rows[0].stats);
    } catch {
      return {};
    }
  }
  return rows[0].stats;
}

module.exports = {
  // Stories
  getAllStories,
  createStory,
  updateStory,
  deleteStory,
  // Video testimonials
  getAllGalleryTestimonials,
  createGalleryTestimonial,
  updateGalleryTestimonial,
  deleteGalleryTestimonial,
  // Before/After
  getAllBeforeAfter,
  createBeforeAfter,
  updateBeforeAfter,
  deleteBeforeAfter,
  // Live streams
  getAllLiveStreams,
  createLiveStream,
  updateLiveStream,
  deleteLiveStream,
  // Annual statistics
  getAllStatistics,
  createStatistics,
  updateStatistics,
  deleteStatistics,
  // Home-page testimonials
  getAllHomepageTestimonials,
  getActiveHomepageTestimonials,
  createHomepageTestimonial,
  updateHomepageTestimonial,
  deleteHomepageTestimonial,
  // Metrics
  incrementStoryViewsFor,
  getStoryViewsFor,
  toggleTestimonialLikeFor,
  getTestimonialLikesFor,
  hasUserLikedTestimonial,
  addTestimonialCommentTo,
  getTestimonialCommentsFor,
  joinLiveStreamFor,
  leaveLiveStreamFor,
  getLiveStreamViewersFor,
  incrementBeforeAfterViewsFor,
  getBeforeAfterViewsFor,
  updateBeforeAfterStats,
  getBeforeAfterStats,
  // Row mappers (re-exported for convenience)
  storyFromRow,
  videoTestimonialFromRow,
  beforeAfterFromRow,
  liveStreamFromRow,
  statisticsFromRow,
  homepageTestimonialFromRow,
};