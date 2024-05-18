/*
Dithering Tool: Ordered Dithering with Adjustable Matrix Size
Tommaso Aulopi, Giacomo Pisani
ISIA Urbino 
a.a.2023/2024 
Matematica per il design
Prof. Andreas Gysin
*/

let img;
let slider;

let baseMatrix = [
  [0, 2],
  [3, 1]
];

function preload() {
  img = loadImage("sfumatura.png");
}

function setup() {
  createCanvas(img.width * 2, img.height);
  slider = createSlider(1, 6, 3, 1); // Slider per cambiare la dimensione della matrice
  slider.position(img.width, img.height+20);
  slider.size(img.width);
  slider.input(dither);  // Call dither() when slider value changes
  noLoop();
  image(img, 0, 0); // Visualizza l'immagine originale a sinistra
  dither();

}

function draw() {
  // Non serve ridisegnare continuamente, basta chiamare dither() quando il valore dello slider cambia
}

function generateDitherMatrix(n) {
  if (n == 1) {
    return baseMatrix;
  } else {
    let smallerMatrix = generateDitherMatrix(n - 1);
    let size = smallerMatrix.length;
    let newSize = size * 2;
    let newMatrix = Array.from(Array(newSize), () => new Array(newSize));
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let value = smallerMatrix[y][x];
        newMatrix[y][x] = 4 * value;
        newMatrix[y][x + size] = 4 * value + 2;
        newMatrix[y + size][x] = 4 * value + 3;
        newMatrix[y + size][x + size] = 4 * value + 1;
      }
    }
    
    return newMatrix;
  }
}

function dither() {
  let matrixSize = Math.pow(2, slider.value());
  let ditherMatrix = generateDitherMatrix(slider.value());
  let ditheredImage = createImage(img.width, img.height);
  ditheredImage.loadPixels();
  img.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];
      let avg = (r + g + b) / 3;

      // Apply dithering based on the matrix
      if (avg > (ditherMatrix[x % matrixSize][y % matrixSize] / (matrixSize * matrixSize)) * 255) {
        ditheredImage.set(x, y, color(255));
      } else {
        ditheredImage.set(x, y, color(0));
      }
    }
  }
  
  ditheredImage.updatePixels();
  image(ditheredImage, img.width, 0); // Visualizza l'immagine dithered a destra
}
