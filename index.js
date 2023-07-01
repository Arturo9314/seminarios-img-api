const express = require('express');
const { createCanvas, loadImage } = require('canvas');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/generar-imagen-seminario', async (req, res) => {
  const autor = req.query.autor || 'Autor';
  const title = req.query.title || 'Título';
  const colorIndex = req.query.color || 0;
  const colorsList = [
    { primaryColor: '#3B035A', secondaryColor: '#310252' },
    { primaryColor: '#034023', secondaryColor: '#034526' },
    { primaryColor: '#7A0880', secondaryColor: '#85098B' },
    { primaryColor: '#2D2C4F', secondaryColor: '#33325A' },
    { primaryColor: '#606A01', secondaryColor: '#656F02' },
    { primaryColor: '#02555A', secondaryColor: '#02595E' },
    { primaryColor: '#5A0215', secondaryColor: '#620217' },
  ];

  const { primaryColor, secondaryColor } = colorsList[colorIndex];

  const canvas = createCanvas(1280, 720);
  const ctx = canvas.getContext('2d');

  async function drawImage() {
    const backgroundImage = await loadImage(path.join(__dirname, 'images', 'maxresdefault.png'));
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    
    const createDiamondPattern = (backgroundColor, diamondColor) => {
      const patternCanvas = createCanvas(1280, 85);
      const patternContext = patternCanvas.getContext('2d');
      const patternSize = 45; // Tamaño del rombo
  
      patternCanvas.width = patternSize;
      patternCanvas.height = patternSize;
      patternContext.fillStyle = backgroundColor;
      patternContext.fillRect(0, 0, patternSize, patternSize);

      patternContext.fillStyle = diamondColor; // Color del rombo
      patternContext.beginPath();
      patternContext.moveTo(patternSize / 2, 0);
      patternContext.lineTo(patternSize, patternSize / 2);
      patternContext.lineTo(patternSize / 2, patternSize);
      patternContext.lineTo(0, patternSize / 2);
      patternContext.closePath();
      patternContext.fill();
  
      return patternCanvas;
    };
    const backgroundPattern = ctx.createPattern(createDiamondPattern(primaryColor, secondaryColor), 'repeat');
    ctx.fillStyle = backgroundPattern;
    ctx.fillRect(0, canvas.height - 85, canvas.width, 85);    
    // Configurar el estilo del autor
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#FFC300';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Calcular la posición central para el autor
    const autorX = 900;
    const autorY = 600;

    // Dibujar el autor en el lienzo
    ctx.fillText(autor, autorX, autorY);

    // Configurar el estilo del título
    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    // Calcular la posición central para el título
    const titleX = canvas.width / 2;
    const titleY = 690;

    // Dibujar el título en el lienzo
    ctx.fillText(title, titleX, titleY);
  }
  await drawImage();
  const dataURL = canvas.toDataURL();
  res.send(dataURL);
});

app.listen(port, () => {
  console.log('API escuchando en el puerto', port);
});
