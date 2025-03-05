const express = require('express');
const app = express();
const port = 3000; // Можеш вибрати інший порт

app.get('/', (req, res) => {
  res.send('Сервер працює!');
});

app.listen(port, () => {
  console.log(`Сервер запущено на порту ${port}`);
});
