const svgCaptcha = require('svg-captcha');

exports.getCaptcha = async (req, res) => {
  const captcha = svgCaptcha.create({
    size: 6,
    ignoreChars: '0o1ilI',
    noise: 3,
    color: true,
    background: '#ffffff',
    width: 280,
    height: 50,
    fontSize: 50,
  });

  req.session.captcha = captcha.text;

  res.type('svg');
  res.status(200).send(captcha.data);
};

exports.getIsCaptcha = async (req, res) => {
  let isCaptcha = false;

  if (req.session.loginFailCount >= 5) {
    isCaptcha = true;
  }

  res.status(200).json({ isCaptcha });
}
