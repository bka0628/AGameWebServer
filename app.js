const session = require('express-session');
const express = require('express');
const path = require('path');

const newsRouter = require('./routes/news');
const supportRouter = require('./routes/support');
const downloadRouter = require('./routes/download');
const authRouter = require('./routes/auth');
const captchaRouter = require('./routes/captcha');

const corsMiddleware = require('./middleware/cors');

const app = express();

const PORT = process.env.PORT || 4000;

app.use(
  session({
    secret: 'keyboard_cat',
    resave: false,
    saveUninitialized: false,
  })
);
app.use(express.json());
app.use(corsMiddleware);


app.use('/api/news', newsRouter);
app.use('/api/support', supportRouter);
app.use('/api/download/client', downloadRouter);
app.use('/api/auth', authRouter);
app.use('/api/captcha', captchaRouter);

app.use(express.static('public'));
app.use(express.static('public/build'));

app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'build', 'index.html');

  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
