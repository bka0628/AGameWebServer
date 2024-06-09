const db = require('../config/database');
const { formatDate } = require('../config/date');

exports.getUserInquiries = async (req, res) => {
  const { userId } = req;
  const { page } = req.query;

  const itemsPerPage = 10;
  const offset = (page - 1) * itemsPerPage;

  if (!userId) {
    return res.status(400).json({ message: 'not userId' });
  }

  db.execute(
    `
    SELECT
      inquiries.id,
      inquiries.type,
      inquiries.title,
      inquiries.date,
    CASE
        WHEN inquiryAnswers.content IS NULL THEN '접수 완료'
        ELSE '답변 완료'
    END AS status
    FROM
      inquiries
    LEFT JOIN
      inquiryAnswers ON inquiries.id = inquiryAnswers.inquiries_id
    WHERE
	    inquiries.user_id = ?
    ORDER BY
      inquiries.date DESC
    LIMIT ${itemsPerPage} OFFSET ${offset};`,
    [userId]
  ).then((result) => {
    const inquiries = result[0].map((item) => {
      return {
        id: item.id,
        type: item.type,
        title: item.title,
        date: formatDate(item.date),
        status: item.status,
      };
    });

    return res.status(200).json({ inquiries });
  });
};

exports.createInquiries = async (req, res) => {
  const { inquiryType, inquiryTitle, inquiryContent } = req.body;
  const { userId } = req;

  if (!inquiryType || !inquiryTitle || !inquiryContent) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'not userId' });
  }

  db.execute(
    `INSERT INTO inquiries(type, user_id, title, content)
  VALUES (?, ?, ?, ?)`,
    [inquiryType, userId, inquiryTitle, inquiryContent]
  )
    .then(() => {
      return res.status(201).json({ message: 'Inquiry created' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    });
};

exports.getTotalInquiriesCount = async (req, res) => {
  const { userId } = req;

  if (!userId) {
    return res.status(400).json({ message: 'not userId' });
  }

  const totalInquiriesCount = await db
    .execute(
      `
      SELECT 
        COUNT(*) AS count 
      FROM 
        inquiries
      WHERE 
        user_id = ${userId} 
    `
    )
    .then((result) => {
      return result[0][0].count;
    })
    .catch((err) => {
      console.error(err);
    });

  res.json({ totalInquiriesCount });
};

exports.getInquiriesById = async (req, res) => {
  const { userId } = req;
  const { id } = req.params;

  const newsItem = await db
    .execute(
      `
      SELECT 
        id, type, title, content, date
      FROM 
        news 
      WHERE id = ${id} and user_id = ${userId}
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

exports.getPrevNextInquiriesById = async (req, res) => {
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
