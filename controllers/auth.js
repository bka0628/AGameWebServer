const db = require('../config/database');
const { createJSONToken } = require('../config/auth');

exports.login = async (req, res) => {
  const { id, password, captcha } = req.body;

  if (!id || !password) {
    console.log('fasd');
    return res.status(400).json({ message: 'Invalid input' });
  }

  try {
    const [[user]] = await db.execute(
      `SELECT * FROM users WHERE id = ? AND type = ?`,
      [id, 'USER']
    );

    let isCaptcha = false;

    if (req.session.loginFailCount >= 5) {
      isCaptcha = true;

      if (captcha !== req.session.captcha) {
        return res.status(422).json({ message: '자동 입력 방지 문자가 일치하지 않습니다.' , isCaptcha});
      }
    }

    if (!user) {
      if (req.session.loginFailCount) {
        req.session.loginFailCount++;
      } else {
        req.session.loginFailCount = 1;
      }

      if (req.session.loginFailCount >= 5) {
        isCaptcha = true;
      }

      return res.status(422).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.', isCaptcha });
    }

    if (user.password !== password) {
      if (req.session.loginFailCount) {
        req.session.loginFailCount++;
      } else {
        req.session.loginFailCount = 1;
      }

      if (req.session.loginFailCount >= 5) {
        isCaptcha = true;
      }

      return res.status(422).json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.', isCaptcha});
    }

    if (req.session.loginFailCount) {
      delete req.session.loginFailCount;
    }

    delete req.session.loginFailCount;

    const token = createJSONToken(user.id);

    res.status(200).json({ token, userId: user.id });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

exports.signup = async (req, res) => {
  const { id, password, captcha } = req.body;
  const sessionCaptcha = req.session.captcha;

  try {
    const [users] = await db.execute(`SELECT * FROM users WHERE id = ?`, [id]);

    console.log('sessionCaptcha', sessionCaptcha);

    if (users.length > 0) {
      return res.status(409).json({ message: 'Username already exists.' });
    }

    if (captcha !== sessionCaptcha) {
      return res.status(422).json({ message: 'Invalid captcha' });
    }

    await db.execute(
      `INSERT INTO users (id, password, type) VALUES (?, ?, ?)`,
      [id, password, 'USER']
    );

    res.status(201).json({ message: 'user created' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};
