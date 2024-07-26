let interface;
let amp;
let vol;
let spectrum;
let playing = false;

let bassInterval = 0;
let snareInterval = 0;

let textFlag = true;
let flashFlag = 0;

let scaleFactor = 0.35; 

const seed = [500, 501, 502, 600, 625, 626, 642, 665, 666, 667, 668, 700, 
              749, 750, 751, 786, 799, 812, 833, 857, 875, 889, 909, 917];
 
let centrePoint;
let pointsCount = 1000;
let deltaTheta = 2 * Math.PI / pointsCount;
let points;

let a = 50000;
let n = 500;
let fft;

let accelleration = 1000;
let nChange = 0.0003;

let font;

let aCurrent = 10;
let aPast = 0;

let chance = 10;

let soundFlag = 0;

function preload(){

    //Loading in the sound files:
    interface = loadSound("sound/iconostasis.wav");
    font = loadFont("fonts/Playfair_Display/PlayfairDisplay-VariableFont_wght.ttf")

}

function  setup(){

    createCanvas(windowWidth,windowHeight);
    background(0);
    centrePoint = new p5.Vector(windowWidth/2,windowHeight/2);
    frameRate(60);

    amp = new p5.Amplitude();
    fft = new p5.FFT();

    interface.setVolume(0.2);            //Setting the volume

}

function draw(){

  background(0);

  if(playing == true){

    background(255);
    textFlag == false;

  }else if(textFlag == true){

    textFont(font);
    stroke("white");
    fill("white");
    textSize(200);
    textAlign(CENTER);
    text("ICONOSTASIS", windowWidth / 2, windowHeight / 2);
    textSize(50);
    text("click", windowWidth / 2, windowHeight / 2 + 140);

  }

  spectrum = fft.analyze();
  vol = amp.getLevel();
  vol = map(vol,0,0.015,0,0.1);

  if(frameCount % 4 == 0){
    aPast = aCurrent;
  }

  aCurrent = vol * 800000 * scaleFactor;

  if(snare(spectrum)){
    snareInterval = 0;
    a = vol * 800000 * scaleFactor;
    let randomSeed = floor(random(seed.length));
    n = seed[randomSeed];
    n += nChange;
    nChange = random(0, 0.01)
  }else{
    a = lerp(a,aCurrent,0.01);
    n += nChange;
  }
  

  points = [];

  for(let i = 0; i < pointsCount; i++){
    let theta = i * deltaTheta;
    let r = a * sin(theta * n);
    let point = polarToCart(r,theta);
    points.push(point);
  }

  stroke("white");
  strokeWeight(0.08);
  
  for(let i = 0; i < points.length - 1; i++){
    
    let initialPoint = points[i];
    let finalPoint = points[i + 1];
    line(initialPoint.x + centrePoint.x,initialPoint.y + centrePoint.y,finalPoint.x + centrePoint.x,finalPoint.y + centrePoint.y);

  }
 
}

function mouseClicked(){
  togglePlaying();
  textFlag = false;
  flashFlag = 0;
}

function togglePlaying(){
  if(soundFlag == 0){
    interface.play();
    playing = false;
    soundFlag = 1;
  }
}


function play(){
  playing = true;
}

function polarToCart(radius,theta){
  x = radius * Math.cos(theta);
  y = radius * Math.sin(theta);
  return new p5.Vector(x,y);
}

function snare(spectrum){
  if(fft.getEnergy(5000, 20000) >= 10){
      return true;
  }
}


