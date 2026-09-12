// ============================================
// GALLERY ROUTES (MySQL)
// ============================================
// Public read + metrics endpoints for the gallery (stories, video
// testimonials, before/after projects, live streams). Admin CRUD is
// protected by adminAuth.
// All gallery data is stored in MySQL.

const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const store = require('../utils/mysql-store');
const { validateFieldLengths } = require('../utils/sanitize');
const logger = require('../utils/logger');

function requireValidBody(req, res) {
  const error = validateFieldLengths(req.body);
  if (error) {
    res.status(400).json({ success: false, error });
    return false;
  }
  return true;
}

// ============================================
// PUBLIC READS
// ============================================

router.get('/stories', async (_req, res) => {
  try {
    res.json({ success: true, stories: await store.getAllStories() });
  } catch (error) {
    logger.error('Error reading stories:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea story-urilor.' });
  }
});

router.get('/testimonials', async (_req, res) => {
  try {
    res.json({ success: true, testimonials: await store.getAllGalleryTestimonials() });
  } catch (error) {
    logger.error('Error reading gallery testimonials:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea testimonialelor.' });
  }
});

router.get('/before-after', async (_req, res) => {
  try {
    res.json({ success: true, projects: await store.getAllBeforeAfter() });
  } catch (error) {
    logger.error('Error reading before/after projects:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea proiectelor.' });
  }
});

router.get('/live-streams', async (_req, res) => {
  try {
    res.json({ success: true, streams: await store.getAllLiveStreams() });
  } catch (error) {
    logger.error('Error reading live streams:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea live stream-urilor.' });
  }
});

// ============================================
// METRICS (public, light writes)
// ============================================

router.post('/stories/:id/views', async (req, res) => {
  try {
    await store.incrementStoryViewsFor(req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error incrementing story views:', error);
    res.status(500).json({ success: false, error: 'Eroare la înregistrarea vizualizării.' });
  }
});

router.get('/stories/:id/views', async (req, res) => {
  try {
    const views = await store.getStoryViewsFor(req.params.id);
    res.json({ success: true, views });
  } catch (error) {
    logger.error('Error reading story views:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea vizualizărilor.' });
  }
});

router.post('/testimonials/:id/likes', async (req, res) => {
  try {
    const userId = req.body?.userId || 'anonymous';
    const liked = await store.toggleTestimonialLikeFor(req.params.id, userId);
    const likes = await store.getTestimonialLikesFor(req.params.id);
    res.json({ success: true, liked, likes });
  } catch (error) {
    logger.error('Error toggling testimonial like:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea aprecierii.' });
  }
});

router.get('/testimonials/:id/likes', async (req, res) => {
  try {
    const likes = await store.getTestimonialLikesFor(req.params.id);
    const isLiked = req.query.userId
      ? await store.hasUserLikedTestimonial(req.params.id, String(req.query.userId))
      : false;
    res.json({ success: true, likes, isLiked });
  } catch (error) {
    logger.error('Error reading testimonial likes:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea aprecierilor.' });
  }
});

router.post('/testimonials/:id/comments', async (req, res) => {
  try {
    const { userId, userName, text } = req.body || {};
    if (!text || !String(text).trim()) {
      return res.status(400).json({ success: false, error: 'Comentariul este gol.' });
    }
    const result = await store.addTestimonialCommentTo(
      req.params.id,
      userId || 'anonymous',
      String(text).trim(),
      userName
    );
    res.status(201).json({ success: true, id: result.id });
  } catch (error) {
    logger.error('Error adding testimonial comment:', error);
    res.status(500).json({ success: false, error: 'Eroare la adăugarea comentariului.' });
  }
});

router.get('/testimonials/:id/comments', async (req, res) => {
  try {
    const comments = await store.getTestimonialCommentsFor(req.params.id);
    res.json({ success: true, comments });
  } catch (error) {
    logger.error('Error reading testimonial comments:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea comentariilor.' });
  }
});

router.post('/live-streams/:id/join', async (req, res) => {
  try {
    const userId = req.body?.userId || 'anonymous';
    await store.joinLiveStreamFor(req.params.id, userId);
    const viewers = await store.getLiveStreamViewersFor(req.params.id);
    res.json({ success: true, viewers });
  } catch (error) {
    logger.error('Error joining live stream:', error);
    res.status(500).json({ success: false, error: 'Eroare la conectarea la stream.' });
  }
});

router.post('/live-streams/:id/leave', async (req, res) => {
  try {
    const userId = req.body?.userId || 'anonymous';
    await store.leaveLiveStreamFor(req.params.id, userId);
    const viewers = await store.getLiveStreamViewersFor(req.params.id);
    res.json({ success: true, viewers });
  } catch (error) {
    logger.error('Error leaving live stream:', error);
    res.status(500).json({ success: false, error: 'Eroare la deconectarea de la stream.' });
  }
});

router.get('/live-streams/:id/viewers', async (req, res) => {
  try {
    const viewers = await store.getLiveStreamViewersFor(req.params.id);
    res.json({ success: true, viewers });
  } catch (error) {
    logger.error('Error reading live viewers:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea spectatorilor.' });
  }
});

router.post('/before-after/:id/views', async (req, res) => {
  try {
    await store.incrementBeforeAfterViewsFor(req.params.id);
    res.json({ success: true });
  } catch (error) {
    logger.error('Error incrementing before/after views:', error);
    res.status(500).json({ success: false, error: 'Eroare la înregistrarea vizualizării.' });
  }
});

router.get('/before-after/:id/views', async (req, res) => {
  try {
    const views = await store.getBeforeAfterViewsFor(req.params.id);
    res.json({ success: true, views });
  } catch (error) {
    logger.error('Error reading before/after views:', error);
    res.status(500).json({ success: false, error: 'Eroare la citirea vizualizărilor.' });
  }
});

router.put('/before-after/:id/stats', async (req, res) => {
  try {
    const { volunteers, treesPlanted, wasteCollected, area } = req.body || {};
    await store.updateBeforeAfterStats(req.params.id, {
      volunteers: Number(volunteers) || 0,
      treesPlanted: Number(treesPlanted) || 0,
      wasteCollected: Number(wasteCollected) || 0,
      area: Number(area) || 0,
    });
    res.json({ success: true });
  } catch (error) {
    logger.error('Error updating before/after stats:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea statisticilor.' });
  }
});

// ============================================
// ADMIN CRUD
// ============================================

router.use(adminAuth);

router.post('/stories', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    const { id } = await store.createStory(req.body);
    res.status(201).json({ success: true, id, message: 'Story adăugat cu succes!' });
  } catch (error) {
    logger.error('Error creating story:', error);
    res.status(500).json({ success: false, error: 'Eroare la salvarea story-ului.' });
  }
});

router.put('/stories/:id', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    await store.updateStory(req.params.id, req.body);
    res.json({ success: true, message: 'Story actualizat cu succes!' });
  } catch (error) {
    logger.error('Error updating story:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea story-ului.' });
  }
});

router.delete('/stories/:id', async (req, res) => {
  try {
    await store.deleteStory(req.params.id);
    res.json({ success: true, message: 'Story șters cu succes!' });
  } catch (error) {
    logger.error('Error deleting story:', error);
    res.status(500).json({ success: false, error: 'Eroare la ștergerea story-ului.' });
  }
});

router.post('/testimonials', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    const { id } = await store.createGalleryTestimonial(req.body);
    res.status(201).json({ success: true, id, message: 'Testimonial adăugat cu succes!' });
  } catch (error) {
    logger.error('Error creating gallery testimonial:', error);
    res.status(500).json({ success: false, error: 'Eroare la salvarea testimonialului.' });
  }
});

router.put('/testimonials/:id', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    await store.updateGalleryTestimonial(req.params.id, req.body);
    res.json({ success: true, message: 'Testimonial actualizat cu succes!' });
  } catch (error) {
    logger.error('Error updating gallery testimonial:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea testimonialului.' });
  }
});

router.delete('/testimonials/:id', async (req, res) => {
  try {
    await store.deleteGalleryTestimonial(req.params.id);
    res.json({ success: true, message: 'Testimonial șters cu succes!' });
  } catch (error) {
    logger.error('Error deleting gallery testimonial:', error);
    res.status(500).json({ success: false, error: 'Eroare la ștergerea testimonialului.' });
  }
});

router.post('/before-after', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    const { id } = await store.createBeforeAfter(req.body);
    res.status(201).json({ success: true, id, message: 'Proiect adăugat cu succes!' });
  } catch (error) {
    logger.error('Error creating before/after project:', error);
    res.status(500).json({ success: false, error: 'Eroare la salvarea proiectului.' });
  }
});

router.put('/before-after/:id', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    await store.updateBeforeAfter(req.params.id, req.body);
    res.json({ success: true, message: 'Proiect actualizat cu succes!' });
  } catch (error) {
    logger.error('Error updating before/after project:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea proiectului.' });
  }
});

router.delete('/before-after/:id', async (req, res) => {
  try {
    await store.deleteBeforeAfter(req.params.id);
    res.json({ success: true, message: 'Proiect șters cu succes!' });
  } catch (error) {
    logger.error('Error deleting before/after project:', error);
    res.status(500).json({ success: false, error: 'Eroare la ștergerea proiectului.' });
  }
});

router.post('/live-streams', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    const { id } = await store.createLiveStream(req.body);
    res.status(201).json({ success: true, id, message: 'Live stream adăugat cu succes!' });
  } catch (error) {
    logger.error('Error creating live stream:', error);
    res.status(500).json({ success: false, error: 'Eroare la salvarea live stream-ului.' });
  }
});

router.put('/live-streams/:id', async (req, res) => {
  if (!requireValidBody(req, res)) return;
  try {
    await store.updateLiveStream(req.params.id, req.body);
    res.json({ success: true, message: 'Live stream actualizat cu succes!' });
  } catch (error) {
    logger.error('Error updating live stream:', error);
    res.status(500).json({ success: false, error: 'Eroare la actualizarea live stream-ului.' });
  }
});

router.delete('/live-streams/:id', async (req, res) => {
  try {
    await store.deleteLiveStream(req.params.id);
    res.json({ success: true, message: 'Live stream șters cu succes!' });
  } catch (error) {
    logger.error('Error deleting live stream:', error);
    res.status(500).json({ success: false, error: 'Eroare la ștergerea live stream-ului.' });
  }
});

module.exports = router;