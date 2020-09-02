var vid;
var selfie;
var selfieSize=640;
var selfieBuff, selfieSnap;
var selfieCnv, selfie64;
var snap;
var receivedImage;
var masker;
var masked;

function setup() {
  cnv=createCanvas(windowWidth, windowHeight);
  var constraints = {
    audio: false,
    video: {
      mandatory: {
        minWidth:1280,
        minHeight:720
      }
    }
  }
  vid=createCapture(constraints);
  // vid.hide();
  // vid.size(320,320);
  selfie=createImage(selfieSize,selfieSize);
  selfieBuff=createGraphics(selfieSize, selfieSize);
  selfieSnap=createImage(selfieSize, selfieSize);
  snap=new Button(width/2,height*0.8,height*0.2,height*0.15,'snap');
  masker=new Masker(selfieSize,selfieSize,selfieSize*0.5,selfieSize*0.4,selfieSize*0.4,selfieSize*0.5);
}

function Masker(w,h,x,y,ew,eh){
  var buf=createGraphics(w,h);
  buf.fill(255,255);
  buf.noStroke();
  buf.ellipse(x,y,ew,eh);
  
  this.get=function(){
    return buf.get();
  };
}


function draw() {
  background(200,0,100);
  image(masker.get(),50,50,100,100);
  selfie.copy(vid,vid.width/2-vid.height/2,0,vid.height,vid.height,0,0,selfie.width, selfie.height);
  push();
  imageMode(CENTER);
  // image(vid,width/2, height/2);
  translate(width/2, height/2);
  scale(-1,1);
  image(selfie,0,0);
  
  pop();
  drawGuide();
  snap.show();
  if(snap.click()){
    console.log("snap");
    // noLoop();
    takeSelfie();
    image(selfieSnap,0,0,100,100);
    
    
  }
  if(receivedImage){
    image(receivedImage,100,100,200,200);
  }
  
  // if(selfie64 && !receivedImage){
  //   receivedImage=loadImage(selfie64);
  // }

}

function mousePressed(){
  receivedImage=loadImage(selfie64, displayImage);
  selfieSnap.save('selfie','png');
}

function displayImage(){
  console.log("showing received image");
  
}

function takeSelfie(){
  selfieBuff.clear();
  selfieBuff.imageMode(CORNER);
  selfieBuff.image(selfie,0,0,selfieBuff.width, selfieBuff.height);
  // selfieBuff.push();
  // selfieBuff.translate(selfieBuff.width/2, selfieBuff.height/2);
  // selfieBuff.fill(180);
  // selfieBuff.noStroke();
  // selfieBuff.beginShape();
  // selfieBuff.vertex(selfieSize/2,selfieSize/2);
  // selfieBuff.vertex(-selfieSize/2,selfieSize/2);
  // selfieBuff.vertex(-selfieSize/2,-selfieSize/2);
  // selfieBuff.vertex(selfieSize/2,-selfieSize/2);
  // selfieBuff.beginContour();
  // for(var i=0; i<30; i++){
  //   selfieBuff.vertex(0+cos(TWO_PI-i*TWO_PI/30)*selfieSize*0.2, -selfieSize*0.1+sin(TWO_PI-i*TWO_PI/30)*selfieSize*0.25);
  // }
  // selfieBuff.endContour();
  // selfieBuff.endShape();
  // // ellipse(0,-selfieSize*0.1,selfieSize*0.4,selfieSize*0.5);
  // selfieBuff.pop();
  var sTemp=selfieBuff.get();
  console.log(sTemp);
  // var masked=createImage(selfieSize,selfieSize);
  var masked=copy(sTemp,0,0,selfieSize,selfieSize,0,0,selfieSize,selfieSize);
  sTemp.mask(masker.get());
  selfieSnap=sTemp;//selfieBuff.get();
  // selfieCnv=createCanvas(selfieSize,selfieSize);
  // selfieCnv.image(selfieSnap,0,0,selfieSize,selfieSize);
  // selfieCnv.loadPixels();
  selfie64=selfieSnap.canvas.toDataURL();
  
  // console.log(selfie64);
}

// function getBase64Image(img) {
//     // Create an empty canvas element
//     var canvas = document.createElement("canvas");
//     canvas.width = img.width;
//     canvas.height = img.height;

//     // Copy the image contents to the canvas
//     var ctx = canvas.getContext("2d");
//     ctx.drawImage(img, 0, 0);

//     // Get the data-URL formatted image
//     // Firefox supports PNG and JPEG. You could check img.src to
//     // guess the original format, but be aware the using "image/jpg"
//     // will re-encode the image.
//     var dataURL = canvas.toDataURL("image/png");

//     return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
// }

function drawGuide(){
  push();
  translate(width/2, height/2);
  fill(255,150);
  noStroke();
  beginShape();
  vertex(selfieSize/2,selfieSize/2);
  vertex(-selfieSize/2,selfieSize/2);
  vertex(-selfieSize/2,-selfieSize/2);
  vertex(selfieSize/2,-selfieSize/2);
  beginContour();
  for(var i=0; i<30; i++){
    vertex(0+cos(TWO_PI-i*TWO_PI/30)*selfieSize*0.2, -selfieSize*0.1+sin(TWO_PI-i*TWO_PI/30)*selfieSize*0.25);
  }
  endContour();
  endShape();
  // ellipse(0,-selfieSize*0.1,selfieSize*0.4,selfieSize*0.5);
  pop();
}

function Button(x,y,w,h,label){
  var hover=false;
  
  this.click=function(){
    return hover;
  };
  
  this.show=function(){
    var touchHover=touches.length>0 && touches[0].x>x-w/2 && touches[0].x<x+w/2 && touches[0].y>y-h/2 && touches[0].y<y+h/2;
    var mouseHover=mouseX>x-w/2 && mouseX<x+w/2 && mouseY>y-h/2 && mouseY<y+h/2;
    hover=touchHover || mouseHover;
    console.log(hover, mouseHover, touchHover);
    fill(235,135,0,100);
    if(hover){
      fill(0,235,135,150);
    }
    stroke(255);
    strokeWeight(h*0.05);
    rectMode(CENTER);
    rect(x,y,w,h,h*0.3);
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(h*0.5);
    text(label,x,y);
  };
}