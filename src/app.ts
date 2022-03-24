import express from 'express';
import cors from 'cors';
import Character from './models/Characters';
import './dbObjects';
const app = express();
const port = 3000;

app.use(cors());

app.get('/get-characters', async (req, res) => {
  const characters = await Character.findAll({
    attributes: ['id', 'name', 'image_large'],
  });
  res.json(characters ? characters : {content: 'none'});
});

app.listen(port, () => {
  console.log(`Example app is listening on port ${port}`);
});
