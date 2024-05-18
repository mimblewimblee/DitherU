/*
Dithering Tool: Floyd Steinberg Error Diffusion
Tommaso Aulopi, Giacomo Pisani
ISIA Urbino 
a.a.2023/2024 
Matematica per il design
Prof. Andreas Gysin
*/

let img;
let imgcopy;
let imgcopy2;
let slider;
let baseMatrix = [
  [0, 2],
  [3, 1]
];

function preload() {
  img = loadImage("floyd.jpg");
  imgcopy = loadImage("floyd.jpg");
  imgcopy2 = loadImage("floyd.jpg");
}

function setup() {
  createCanvas(img.width, img.height);
  slider = createSlider(1, 6, 3, 1); // Slider per cambiare la dimensione della matrice
  slider.position(10, 50);
  slider.size(img.width);
  slider.input(ditherO);
  image(img, 0, 0);
  filter(GRAY);
}

function ditherO() {
  imgcopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  dither();
}

function random() {
  imgcopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  randomdith();
}

function onebit() {
  imgcopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  bit();
}

function ditherF() {
  imgcopy.copy(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
  FloydSteinberg(imgcopy, 1);
  image(imgcopy, 0, 0);
  filter(GRAY);
}

//--------------------------------------------------

function randomdith() {
  imgcopy.loadPixels();
  let ditheredImg = createImage(img.width, img.height);
  ditheredImg.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = imgcopy.pixels[index];
      let g = imgcopy.pixels[index + 1];
      let b = imgcopy.pixels[index + 2];

      let gray = (r + g + b) / 3;
      let threshold = random(255);
      let newColor = gray > threshold ? 255 : 0;

      ditheredImg.pixels[index] = newColor;
      ditheredImg.pixels[index + 1] = newColor;
      ditheredImg.pixels[index + 2] = newColor;
      ditheredImg.pixels[index + 3] = 255;
    }
  }

  ditheredImg.updatePixels();
  image(ditheredImg, 0, 0);
  noLoop();
}

//--------------------------------------------------

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function getColorAtindex(img, x, y) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  let red = pix[idx];
  let green = pix[idx + 1];
  let blue = pix[idx + 2];
  let alpha = pix[idx + 3];
  return color(red, green, blue, alpha);
}

function setColorAtIndex(img, x, y, clr) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  pix[idx] = red(clr);
  pix[idx + 1] = green(clr);
  pix[idx + 2] = blue(clr);
  pix[idx + 3] = alpha(clr);
}

function closestStep(max, steps, value) {
  return round(steps * value / 255) * floor(255 / steps);
}

function FloydSteinberg(img, steps) {
  img.loadPixels();
  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let clr = getColorAtindex(img, x, y);
      let oldR = red(clr);
      let oldG = green(clr);
      let oldB = blue(clr);
      let newR = closestStep(255, steps, oldR);
      let newG = closestStep(255, steps, oldG);
      let newB = closestStep(255, steps, oldB);
      let newClr = color(newR, newG, newB);
      setColorAtIndex(img, x, y, newClr);
      let errR = oldR - newR;
      let errG = oldG - newG;
      let errB = oldB - newB;
      distributeError(img, x, y, errR, errG, errB);
    }
  }
  img.updatePixels();
}

function distributeError(img, x, y, errR, errG, errB) {
  addError(img, 7 / 16.0, x + 1, y, errR, errG, errB);
  addError(img, 3 / 16.0, x - 1, y + 1, errR, errG, errB);
  addError(img, 5 / 16.0, x, y + 1, errR, errG, errB);
  addError(img, 1 / 16.0, x + 1, y + 1, errR, errG, errB);
}

function addError(img, factor, x, y, errR, errG, errB) {
  if (x < 0 || x >= img.width || y < 0 || y >= img.height) return;
  let clr = getColorAtindex(img, x, y);
  let r = red(clr);
  let g = green(clr);
  let b = blue(clr);
  clr.setRed(r + errR * factor);
  clr.setGreen(g + errG * factor);
  clr.setBlue(b + errB * factor);
  setColorAtIndex(img, x, y, clr);
}

//--------------------------------------------------

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
  imgcopy.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = imgcopy.pixels[index];
      let g = imgcopy.pixels[index + 1];
      let b = imgcopy.pixels[index + 2];
      let avg = (r + g + b) / 3;

      if (avg > (ditherMatrix[x % matrixSize][y % matrixSize] / (matrixSize * matrixSize)) * 255) {
        ditheredImage.pixels[index] = 255;
        ditheredImage.pixels[index + 1] = 255;
        ditheredImage.pixels[index + 2] = 255;
        ditheredImage.pixels[index + 3] = 255;
      } else {
        ditheredImage.pixels[index] = 0;
        ditheredImage.pixels[index + 1] = 0;
        ditheredImage.pixels[index + 2] = 0;
        ditheredImage.pixels[index + 3] = 255;
      }
    }
  }

  ditheredImage.updatePixels();
  image(ditheredImage, 0, 0);
}

//--------------------------------------------------

function bit() {
  imgcopy.loadPixels();
  let threshold = 128;
  for (let i = 0; i < imgcopy.pixels.length; i += 4) {
    let x = (i / 4) % imgcopy.width;
    let y = Math.floor((i / 4) / imgcopy.width);
    let pixelValue = (imgcopy.pixels[i] + imgcopy.pixels[i + 1] + imgcopy.pixels[i + 2]) / 3;
    let newPixelValue = pixelValue < threshold ? 0 : 255;
    imgcopy.pixels[i] = newPixelValue;
    imgcopy.pixels[i + 1] = newPixelValue;
    imgcopy.pixels[i + 2] = newPixelValue;
    imgcopy.pixels[i + 3] = 255;
  }
  imgcopy.updatePixels();
  image(imgcopy, 0, 0);
  noLoop();
}
function reset(){
  location. reload()
}