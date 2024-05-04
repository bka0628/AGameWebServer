const path = require('path');

exports.getClientMax = async (req, res) => {
  const filePath = path.join(
    __dirname,
    '../',
    'public',
    'client',
    'Install League of Legends kr.zip'
  );

  res.download(filePath);
};

exports.getClientWhindo = async (req, res) => {
  const filePath = path.join(
    __dirname,
    '../',
    'public',
    'client',
    'Install League of Legends kr.exe'
  );

  res.download(filePath);
};
