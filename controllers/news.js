const db = require('../config/database.js');
const { formatDate } = require('../config/date.js');

const getfetchNewsData = async ({type, page = 0}) => {
  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;
  let typeQuery = '';

  if (type) {
    typeQuery = `WHERE type = '${type}'`;
  }

  const news = await db
    .execute(`
      SELECT 
        id, type, title, date 
      FROM 
        news 
      ${typeQuery} 
      ORDER BY 
        date DESC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `)
    .then((result) => {
      const news = result[0].map((item) => {
        if (item.type === 'Announcement') {
          item.type = '공지';
        } else if (item.type === 'Maintenance') {
          item.type = '점검';
        } else if (item.type === 'Update') {
          item.type = '업데이트';
        }

        return {
          id: item.id,
          type: item.type,
          title: item.title,
          date: formatDate(item.date),
        };
      });

      return news;
    })
    .catch((err) => {
      console.error(err);
    });

  return news;
};

exports.getAllNews = async (req, res) => {
  // const { search } = req.query;
  const { page } = req.query;

  const news = await getfetchNewsData({page});

  res.json({ news });
};

exports.getNoticesNews = async (req, res) => {
  const { page } = req.query;
  const type = 'Announcement';
  const news = await getfetchNewsData({type, page});

  res.json({ news });
};

exports.getMaintenanceNews = async (req, res) => {
  const { page } = req.query;
  const type = 'Maintenance';

  const news = await getfetchNewsData({type, page});

  res.json({ news });
};

exports.getUpdatesNews = async (req, res) => {
  const { page } = req.query;
  const type = 'Update';
  const news = await getfetchNewsData({type, page});

  res.json({ news });
};

exports.getNewsById = async (req, res) => {
  const { id } = req.params;

  const newsItem = await db
    .execute(`
      SELECT 
        id, type, title, content, date
      FROM 
        news 
      WHERE id = ${id}
    `)
    .then((result) => {
      const newsItem = result[0][0];

      if (newsItem.type === 'Announcement') {
        newsItem.type = '공지';
      } else if (newsItem.type === 'Maintenance') {
        newsItem.type = '점검';
      } else if (newsItem.type === 'Update') {
        newsItem.type = '업데이트';
      }

      return {
        id: newsItem.id,
        type: newsItem.type,
        title: newsItem.title,
        content: newsItem.content,
        date: formatDate(newsItem.date),
      };
    }).catch((err) => {
      console.error(err);
    });

  res.json(newsItem);
};

exports.getTotalNewsCount = async (req, res) => {
  const { type } = req.query;

  let typeQuery = '';

  if (type) {
    typeQuery = `WHERE type = '${type}'`;
  }

  const totalNewsCount = await db
    .execute(`
      SELECT 
        COUNT(*) AS count 
      FROM 
        news
      ${typeQuery} 
    `)
    .then((result) => {
      return result[0][0].count;
    }).catch((err) => {
      console.error(err);
    });

  res.json({ totalNewsCount });
};
