const Story = require('../models/Story');
const User = require('../models/User');
const { scrapeHackerNews } = require('../services/hnScraper');

// @desc    Get all stories
// @route   GET /api/stories
// @access  Public
exports.getStories = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 10, 1), 50);
    const skip = (page - 1) * limit;
    
    const stories = await Story.find()
      .sort({ points: -1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Story.countDocuments();
    
    res.json({
      stories,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalStories: total
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Trigger scrape manually
// @route   POST /api/stories/scrape
// @access  Private
exports.manualScrape = async (req, res) => {
  try {
    const stats = await scrapeHackerNews();
    res.json({ 
      msg: 'Scraping completed successfully',
      newStories: stats.newStories,
      totalScraped: stats.totalScraped
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get single story
// @route   GET /api/stories/:id
// @access  Public
exports.getStoryById = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ msg: 'Story not found' });
    }
    res.json(story);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Toggle bookmark
// @route   POST /api/stories/:id/bookmark
// @access  Private
exports.toggleBookmark = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) {
      return res.status(404).json({ msg: 'Story not found' });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if already bookmarked
    const bookmarkIndex = user.bookmarks.indexOf(req.params.id);
    
    if (bookmarkIndex === -1) {
      // Add bookmark
      user.bookmarks.push(req.params.id);
      await user.save();
      res.json({ bookmarked: true, msg: 'Story bookmarked' });
    } else {
      // Remove bookmark
      user.bookmarks.splice(bookmarkIndex, 1);
      await user.save();
      res.json({ bookmarked: false, msg: 'Bookmark removed' });
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Get user bookmarks
// @route   GET /api/stories/bookmarks
// @access  Private
exports.getBookmarks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: 'bookmarks',
      options: { sort: { points: -1 } }
    });
    
    res.json(user.bookmarks);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
