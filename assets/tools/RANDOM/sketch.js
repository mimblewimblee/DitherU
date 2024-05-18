let img;

function preload() {

  img = loadImage('sfumatura.png');
}

function setup() {
  createCanvas(img.width, img.height);
  img.loadPixels();
  let ditheredImg = createImage(img.width, img.height);
  ditheredImg.loadPixels();

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let index = (x + y * img.width) * 4;
      let r = img.pixels[index];
      let g = img.pixels[index + 1];
      let b = img.pixels[index + 2];


      let gray = (r + g + b) / 3;

      // Apply random dithering
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
}

function draw() {

  noLoop();
}
