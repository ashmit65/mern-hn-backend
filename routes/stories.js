const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getStories,
  manualScrape,
  getStoryById,
  toggleBookmark,
  getBookmarks
} = require('../controllers/storyController');

// @route   GET /api/stories
router.get('/', getStories);

// @route   GET /api/stories/bookmarks
router.get('/bookmarks', auth, getBookmarks);

// @route   POST /api/stories/scrape
router.post('/scrape', auth, manualScrape);

// @route   GET /api/stories/:id
router.get('/:id', getStoryById);

// @route   POST /api/stories/:id/bookmark
router.post('/:id/bookmark', auth, toggleBookmark);

module.exports = router;
