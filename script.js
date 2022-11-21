const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext("2d");
let file= document.getElementById("file");
const button = document.getElementById("btn-download");
const img= document.querySelector('.img');

let loaded= "";
const image1 = new Image();
image1.src = "";
const inputSlider = document.getElementById("resolution");
const inputLabel = document.getElementById("resolutionLabel");
file.addEventListener('change',(event)=>{
    const file = event.target.files[0];
  
    // Check if the file is an image.
    if (file.type && !file.type.startsWith('image/')) {
      console.log('File is not an image.', file.type, file);
      return;
    }
  
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
    
      image1.src= event.target.result;
    });
    reader.readAsDataURL(file);
    inputSlider.value=0;
  
})

class Cell {
  constructor(x, y, symbol, color) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillText(this.symbol, this.x, this.y);
  }
}
class AsciiEffect {
  #imageCellArray = [];
  #pixels = [];
  #ctx;
  #width;
  #height;
  constructor(ctx, width, height) {
    this.#ctx = ctx;
    this.#height = height;
    this.#width = width;

    this.#ctx.drawImage(image1, 0, 0, this.#width, this.#height);
    this.#pixels = this.#ctx.getImageData(0, 0, this.#width, this.#height);
  }
  #convertToSymbol(g) {
    if (g > 250) return "@";
    else if (g > 240) return "!";
    else if (g > 230) return "a";
    else if (g > 220) return "*";
    else if (g > 200) return "#";
    else if (g > 180) return "$";
    else if (g > 160) return "%";
    else if (g > 140) return "^";
    else if (g > 120) return "&";
    else if (g > 100) return "*";
    else if (g > 80) return "(";
    else if (g > 60) return ")";
    else if (g > 40) return "]";
    else if (g > 20) return ";";
    else if (g > 10) return "g";
    else if (g > 0) return "0";
  }
  #scanImage(cellSize) {
    this.#imageCellArray = [];
    for (let y = 0; y < this.#pixels.height; y += cellSize * 2) {
      for (let x = 0; x < this.#pixels.width; x += cellSize * 2) {
        const posX = x * 4;
        const posY = y * 4;
        const pos = posY * this.#pixels.width + posX;
        if (this.#pixels.data[pos + 3] > 128) {
          const red = this.#pixels.data[pos];
          const green = this.#pixels.data[pos + 1];
          const blue = this.#pixels.data[pos + 2];
          const total = red + green + blue;
          const averageColorValue = total / 3;
          const color = `rgb(${red},${green},${blue})`;
          const symbol = this.#convertToSymbol(averageColorValue);
          if (total > 200)
            this.#imageCellArray.push(new Cell(x, y, symbol, color));
        }
      }
    }
    console.log(this.#imageCellArray);
  }
  #drawAscii() {
    this.#ctx.clearRect(0, 0, this.#width, this.#height);
    for (let i = 0; i < this.#imageCellArray.length; i++) {
      this.#imageCellArray[i].draw(this.#ctx);
    }
  }
  draw(cellSize) {
    this.#scanImage(cellSize);
    this.#drawAscii();
  }
}
let effect;

const handleSlider = () => {
  if (inputSlider.value == 1) {
    inputLabel.innerHTML = "Original Image";
    ctx.drawImage(image1, 0, 0, canvas.width, canvas.height);
  } else {
    inputLabel.innerHTML="";
    effect.draw(parseInt(inputSlider.value));
  }
};
inputSlider.addEventListener("change", handleSlider);

image1.onload = function initialize() {
  canvas.width = image1.width;
  canvas.height = image1.height;
  ctx.drawImage(image1, 0, 0);
  effect = new AsciiEffect(ctx, image1.width, image1.height);
  handleSlider();
};


