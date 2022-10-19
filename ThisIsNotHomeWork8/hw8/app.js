const express = require("express");
const path = require('path');

const PORT = process.env.PORT || 8080;

const app = express();


app.get("/api", (req, res) => {
  res.json({ message: "Hello from server!" });
});
app.use(express.static(path.resolve(__dirname, 'build')));

app.get('*', (req, res) => {
  console.log('in here!!',__dirname)
  res.sendFile(path.resolve(__dirname, 'build', 'index.html'));
});
app.set('trust proxy', true);

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});

