const db = require('../config/database');
const { formatDate } = require('../config/date');

exports.getUserInquiries = async (req, res) => {
  const { userId } = req;

  if (!userId) {
    return res.status(400).json({ message: 'not userId' });
  }

  db.execute(
    `
    SELECT
      inquiries.id,
      inquiries.type,
      CONCAT(SUBSTR(inquiries.content, 1, 20), '...') AS content,
      inquiries.date,
    CASE
        WHEN inquiryAnswers.content IS NULL THEN '접수'
        ELSE '완료'
    END AS status
    FROM
      inquiries
    LEFT JOIN
      inquiryAnswers ON inquiries.id = inquiryAnswers.inquiries_id
    WHERE
	    inquiries.user_id = ?
    ORDER BY
      inquiries.date DESC;`,
    [userId]
  ).then((result) => {

    const inquiries = result[0].map((item) => {
      return {
        id: item.id,
        type: item.type,
        content: item.content,
        date: formatDate(item.date),
      };
    });

    return res.status(200).json({ inquiries });
  });
};

exports.createInquiries = async (req, res) => {
  const { inquiryType, inquiryContent } = req.body;
  const { userId } = req;

  if (!inquiryType || !inquiryContent) {
    return res.status(400).json({ message: 'Invalid input' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'not userId' });
  }

  db.execute(
    `INSERT INTO inquiries(type, user_id, content)
  VALUES (?, ?, ?)`,
    [inquiryType, userId, inquiryContent]
  )
    .then(() => {
      return res.status(201).json({ message: 'Inquiry created' });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: 'Internal server error' });
    });
};
