import express from 'express';
import nodeHtmlToImage from 'node-html-to-image'
import fs from 'fs'
import font2base64 from 'node-font2base64'

const app = express();
const PORT = process.env.PORT || 3000;

const htmlcontent = fs.readFileSync('./index.html').toString();

const _IMG_URL = fs.readFileSync('./static/Menage.png');
const _base64Image = new Buffer.from(_IMG_URL).toString('base64');
const _dataURI = 'data:image/png;base64,' + _base64Image
const _fontData = font2base64.encodeToDataUrlSync('./static/font.ttf');

app.get('/menage/:text', async (req, res) => {
  if (!req.params.text) return res.send('lagay k ng text te')

  const image = await nodeHtmlToImage({
    output: './image.png',
    html: htmlcontent,
    content: {
      text: req.params.text,
      image: _dataURI,
      fontdata: _fontData
    },
    puppeteerArgs: { args: ['--no-sandbox'] }
  })
  res.writeHead(200, { 'Content-Type': 'image/png' });
  res.end(image, 'binary');
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
