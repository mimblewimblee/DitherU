/*
Dithering Tool: Floyd Steinberg Error Diffusion
Tommaso Aulopi, Giacomo Pisani
ISIA Urbino 
a.a.2023/2024 
Matematica per il design
Prof. Andreas Gysin
*/





let img;

function preload() {
  
  img = loadImage("sfumatura.png");


}

function setup() {
  createCanvas(img.width*2,img.height)

  image(img, 0, 0);
 
  //L'immagine viene convertita in scala di grigi (funzione che può essere disabilitata nel momento in cui si vuole lavorare in RGB)
  filter(GRAY);

}
//funzione collegata al pulsante che permette l'applicazione del dithering di Floyd Steinberg sull'immagine


function ditherF(){

  FloydSteinberg(img, 1);//applica il dithering all'immagine
  image(img, img.width, 0);
  filter(GRAY);//L'immagine viene convertita in scala di grigi (funzione che può essere disabilitata nel momento in cui si vuole lavorare in RGB)

}

function imageIndex(img, x, y) {
  return 4 * (x + y * img.width);
}

function getColorAtindex(img, x, y) {
  let idx = imageIndex(img, x, y);
  let pix = img.pixels;
  let red = pix[idx];
  let green = pix[idx];
  let blue = pix[idx];
  let alpha = pix[idx];
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

// trova il valore più vicino, operazione di "Quantize"
function closestStep(max, steps, value) {
  return round(steps * value / 255) * floor(255 / steps);
}
//applicazione del dithering di Floyd Steinberg
function FloydSteinberg(img, steps) {
  img.loadPixels();// riga che permette di lavorare solo sui pixel dell'immagine

  for (let y = 0; y < img.height; y++) {
    for (let x = 0; x < img.width; x++) {
      let clr = getColorAtindex(img, x, y);
      let oldR = red(clr);
      let oldG = green(clr);
      let oldB = blue(clr);
      let newR = closestStep(255, steps, oldR);// in questo modo posso ottenere solo due tipi di numeri (0 o 255)
      let newG = closestStep(255, steps, oldG);// in questo modo posso ottenere solo due tipi di numeri (0 o 255)
      let newB = closestStep(255, steps, oldB);// in questo modo posso ottenere solo due tipi di numeri (0 o 255)

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
//distribuzione dell'errore del pixel ai pixel adiacenti
function distributeError(img, x, y, errR, errG, errB) {
  addError(img, 7 / 16.0, x + 1, y, errR, errG, errB);
  addError(img, 3 / 16.0, x - 1, y + 1, errR, errG, errB);
  addError(img, 5 / 16.0, x, y + 1, errR, errG, errB);
  addError(img, 1 / 16.0, x + 1, y + 1, errR, errG, errB);
}
  //aggiunge l'errore
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
