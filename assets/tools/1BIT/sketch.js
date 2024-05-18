/*
Dithering Tool: Floyd Steinberg Error Diffusion
Tommaso Aulopi, Giacomo Pisani
ISIA Urbino 
a.a.2023/2024 
Matematica per il design
Prof. Andreas Gysin
*/





let img;


let m = [
  [3, 1],
  [0, 2],
];



function preload() {
  
  img = loadImage("floyd.png");


}

function setup() {
  createCanvas(img.width,img.height)

  image(img, 0, 0);
 
  //L'immagine viene convertita in scala di grigi (funzione che può essere disabilitata nel momento in cui si vuole lavorare in RGB)
  filter(GRAY);

}

function onebit(){

  bit();

}



function bit() {
  img.loadPixels();
  for (let i = 0; i < img.pixels.length; i += 4) {
    let x = (i / 4 | 0) % img.width;
    let y = (i / 4 / img.width | 0);
    let thresh = m[x % 1][y % 1] * 20 + 20;
    let pixel = (img.pixels[i] + img.pixels[i + 1] + img.pixels[i + 2]) / 3;
    let pixelValue = pixel < thresh ? 0 : 255; 
  
    img.pixels[i] = pixelValue;
    img.pixels[i + 1] = pixelValue;
    img.pixels[i + 2] = pixelValue;
    img.pixels[i + 3] = 255;
  }
  img.updatePixels();
  image(img, 0, 0);
  noLoop();
}

