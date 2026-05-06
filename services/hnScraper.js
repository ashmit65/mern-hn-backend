const axios = require('axios');
const cheerio = require('cheerio');
const Story = require('../models/Story');

async function scrapeHackerNews() {
  try {
    console.log('Starting scrape of Hacker News...');
    
    const { data } = await axios.get('https://news.ycombinator.com', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    
    const $ = cheerio.load(data);
    const stories = [];
    
    // Get top 10 stories
    $('.athing').slice(0, 10).each((index, element) => {
      const hnId = $(element).attr('id');
      
      // Get title and URL
      const titleElement = $(element).find('.titleline > a').first();
      const title = titleElement.text().trim();
      let url = titleElement.attr('href');
      
      // If URL is relative, prepend HN base URL
      if (url && !url.startsWith('http')) {
        url = `https://news.ycombinator.com/${url}`;
      }
      
      // Get subtext row (next row after .athing)
      const subtext = $(element).next();
      
      // Get points
      const pointsText = subtext.find('.score').text();
      const points = pointsText ? parseInt(pointsText) : 0;
      
      // Get author
      const author = subtext.find('.hnuser').text().trim() || 'Unknown';
      
      // Get posted time
      const postedAt = subtext.find('.age').attr('title') || '';
      
      stories.push({
        hnId,
        title,
        url: url || '',
        points,
        author,
        postedAt
      });
    });
    
    if (stories.length === 0) {
      console.log('No stories found - HN structure may have changed');
      return;
    }
    
    // Upsert each story to avoid wiping existing data on partial failures
    const operations = stories.map((story) => ({
      updateOne: {
        filter: { hnId: story.hnId },
        update: { $set: story },
        upsert: true
      }
    }));

    await Story.bulkWrite(operations, { ordered: false });
    
    console.log(`Successfully scraped and saved ${stories.length} stories`);
    
  } catch (error) {
    console.error('Error scraping Hacker News:', error.message);
  }
}

module.exports = { scrapeHackerNews };
