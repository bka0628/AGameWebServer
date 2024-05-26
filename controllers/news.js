const db = require('../config/database.js');
const { formatDate } = require('../config/date.js');

exports.getNews = async (req, res) => {
  const { type, page, search } = req.query;

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;
  let typeQuery = '';
  let searchQuery = '';

  if (type) {
    typeQuery = `WHERE type = '${type}'`;
  }

  if (type && search) {
    searchQuery = `and title LIKE '%${search}%'`;
  }

  if (!type && search) {
    searchQuery = `WHERE title LIKE '%${search}%'`;
  }

  const news = await db
    .execute(
      `
      SELECT 
        id, type, title, date 
      FROM 
        news 
      ${typeQuery} ${searchQuery}
      ORDER BY 
        date DESC
      LIMIT ${itemsPerPage} OFFSET ${offset}
    `
    )
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

  res.json({ news });
};

exports.getNewsById = async (req, res) => {
  const { id } = req.params;

  const newsItem = await db
    .execute(
      `
      SELECT 
        id, type, title, content, date
      FROM 
        news 
      WHERE id = ${id}
    `
    )
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
    })
    .catch((err) => {
      console.error(err);
    });

  res.json(newsItem);
};

exports.getTotalNewsCount = async (req, res) => {
  const { type, search } = req.query;

  let typeQuery = '';
  let searchQuery = '';

  if (type) {
    typeQuery = `WHERE type = '${type}'`;
  }

  if (type && search) {
    searchQuery = `and title LIKE '%${search}%'`;
  }

  if (!type && search) {
    searchQuery = `WHERE title LIKE '%${search}%'`;
  }

  const totalNewsCount = await db
    .execute(
      `
      SELECT 
        COUNT(*) AS count 
      FROM 
        news
      ${typeQuery} ${searchQuery}
    `
    )
    .then((result) => {
      return result[0][0].count;
    })
    .catch((err) => {
      console.error(err);
    });

  res.json({ totalNewsCount });
};

exports.getPrevNextNewsById = async (req, res) => {
  const { id } = req.params;
  const { type } = req.query;

  let typeQuery = '';

  if (type) {
    typeQuery = `AND type = '${type}'`;
  }

  const prevNextNews = await db
    .execute(
      `
      (SELECT 
        id, title, date 
      FROM 
        news 
      WHERE 
        id < ${id} 
        ${typeQuery} 
      ORDER BY 
        id DESC 
      LIMIT 1)
      UNION
      (SELECT 
        id, title, date 
      FROM 
        news 
      WHERE 
        id > ${id} 
        ${typeQuery} 
      ORDER BY 
        id ASC 
      LIMIT 1)
    `
    )
    .then((result) => {
      const prevNextNews = result[0].map((item) => {
        if (item.type === 'Announcement') {
          item.type = '공지';
        } else if (item.type === 'Maintenance') {
          item.type = '점검';
        } else if (item.type === 'Update') {
          item.type = '업데이트';
        }

        return {
          id: item.id,
          title: item.title,
          date: formatDate(item.date),
        };
      });

      return prevNextNews;
    })
    .catch((err) => {
      console.error(err);
    });

  res.json(prevNextNews);
};
