const canvas = document.getElementById('memeCanvas');
const ctx = canvas.getContext('2d');
const imageInput = document.getElementById('imageInput');
let uploadedImage = null;

// Carrega a imagem selecionada no canvas
imageInput.addEventListener('change', (event) => {
  const file = event.target.files[0];
  const reader = new FileReader();

  reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
    img.onload = () => {
      uploadedImage = img;
      drawImage();
    };
  };

  reader.readAsDataURL(file);
});

// Função para desenhar texto com quebra automática e ajuste de posição
function drawText(text, isTop) {
  if (!text) return;

  const maxWidth = canvas.width - 40; // Largura máxima com margem de 20px
  let fontSize = 40;
  ctx.font = `${fontSize}px Impact`;
  let lines = [];
  const words = text.split(' ');
  
  if (words.length === 0) return;
  
  let currentLine = words[0];
  
  // Divide o texto em linhas que cabem na largura do canvas
  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    const testLine = currentLine + ' ' + word;
    const testWidth = ctx.measureText(testLine).width;
    
    if (testWidth > maxWidth) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine);
  
  // Ajusta o tamanho da fonte para caber na largura
  let maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
  while (maxLineWidth > maxWidth && fontSize > 10) {
    fontSize -= 2;
    ctx.font = `${fontSize}px Helvetica Neue Bold, Arial Black, sans-serif`;
    maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
  }

  // Inverte linhas para texto inferior (desenha de baixo para cima)
  if (!isTop) lines = lines.reverse();

  // Configurações visuais
  const lineHeight = fontSize * 1.2;
  const yStart = isTop 
    ? 20 // Texto superior começa no topo
    : canvas.height - 20 - lineHeight; // Texto inferior começa na base

  ctx.fillStyle = 'white';
  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.max(3, Math.floor(fontSize / 10));
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';

  // Desenha cada linha considerando a direção
  lines.forEach((line, index) => {
    const yPosition = isTop 
      ? yStart + index * lineHeight 
      : yStart - index * lineHeight; // Subtrai para subir no texto inferior

    ctx.fillText(line, canvas.width / 2, yPosition);
    ctx.strokeText(line, canvas.width / 2, yPosition);
  });
}

// Função principal para desenhar imagem e textos
function drawImage() {
  if (uploadedImage) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(uploadedImage, 0, 0, canvas.width, canvas.height);

    const topText = document.getElementById('topText').value;
    const bottomText = document.getElementById('bottomText').value;

    drawText(topText, true); // Desenha texto superior
    drawText(bottomText, false); // Desenha texto inferior
  }
}

// Gera o meme ao clicar no botão
function generateMeme() {
  drawImage();
}

// Baixa o meme como imagem PNG
function downloadMeme() {
  const link = document.createElement('a');
  link.download = 'meme.png';
  link.href = canvas.toDataURL();
  link.click();
}