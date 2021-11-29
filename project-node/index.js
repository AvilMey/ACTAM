//import { generateImg, image2OneChannel,playOscillators, selectColumn} from "./functions";

const c = new AudioContext;

var attack = 0.1;
var release = 0.5;
var duration = (attack + release ) *1000;

var W;
var H;
var imageData;
var data2Play;
var A;


const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const canv = document.getElementById("bar")
const context = canv.getContext("2d")


// var idata = ctx.createImageData(width, height);
// buffer = generateImg(width, height);
// idata.data.set(buffer);
// ctx.putImageData(idata, 0, 0);
//var data = image2OneChannel(idata.data, height, width);


document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });

document.getElementById('myFile').onchange = function (evt) {
    var tgt = evt.target || window.event.srcElement,
        files = tgt.files;

    // FileReader support
    if (FileReader && files && files.length) {
        var fr = new FileReader();
        fr.onload = () => showImage(fr);
        fr.readAsDataURL(files[0]);
    }
}

function drawLine(x){
    context.beginPath();
    context.clearRect(0,0,canv.width,canv.height);
    context.moveTo(x,0);
    context.lineTo(x, canv.height);
    context.stroke();    
}


function playImage(data){
    //console.log(data[0].length);
    for(var j = 0; j <data[0].length; j++){
        amps = selectColumn(data,j);
        setTimeout(playOscillators, duration*j,amps);
        setTimeout(drawLine, duration*j, (j+ 1/2)*W/20);
    }
}

function image2OneChannel(imgData, height, width){
    var data = [];
    for(var i=0; i<height; i++) {
        data[i] = new Array(width);
    }
    for(var y = 0; y< height; y++) {
        for(var x = 0; x< width; x++) {
            var pos = (y*width + x)*4;
            data[y][x] = Math.floor((imgData[pos] + imgData[pos+1] + imgData[pos+2] ) / 3) ;
            
        }
    } 
    return data;   
}

function selectColumn(array, number) {
    var col = array.map(function(value,index) { return value[number]; });
    return col; 
}

function generateImg(width, height){
    var buffer = new Uint8ClampedArray(width* height* 4);
    for(var y = 0; y< height; y++) {
        for(var x = 0; x< width; x++) {
            var pos = (y*width + x)*4;
            buffer[pos] = Math.floor(Math.random() * 256);
            buffer[pos+1] = Math.floor(Math.random() * 256);
            buffer[pos+2] = Math.floor(Math.random() * 256);
            buffer[pos+3] = 255;
        }
    }
    return buffer;
}

function playOscillators(amps){
    console.log(amps.length);
    for(i=0; i< amps.length; i++){
        if(amps[i] > 50){
            f = 440*Math.pow(2,i/12)
            var o = c.createOscillator();
            var g = c.createGain();
            o.frequency.value = f;
            o.connect(g);
            g.connect(c.destination);
            now = c.currentTime;
            g.gain.setValueAtTime(0, now);
            //console.log(amps[i])    
            g.gain.linearRampToValueAtTime(amps[i]/(255*amps.length), now+attack);
            g.gain.linearRampToValueAtTime(0, now+attack+release);
            o.start(now);
            o.stop(now+attack+release);  
        }    
    }
}


//get image from user and plot

function showImage(fileReader) {
    var img = document.getElementById("myImage");
    img.onload = () => getImageData(img);
    img.src = fileReader.result;
}

function getImageData(img) {
    W = img.width;
    H = img.height;
    canvas.width = W;
    canvas.height = H;
    canv.height = 50;
    canv.width = W;
    canv.style.left = img.x;
    canv.style.top = img.y + img.height;
    canv.style.position = "absolute";
    ctx.drawImage(img, 0, 0);
    imageData = ctx.getImageData(0, 0, W, H).data;
    data2Play =  image2OneChannel(imageData, H, W );
    //console.log("image data:", imageData);
    //getRGB(imageData);
 }

 function reduceImage(matrix){
     y_len = matrix.length;
     x_len = matrix[0].length;
     //console.log(y_len);
     A = new Array(12).fill(0);
     temp = new Array(y_len);
     for (var i = 0; i < A.length ;i++){
        A[i] = new Array(20).fill(0);
    }
    for (var i = 0; i < temp.length ;i++){
        temp[i] = new Array(20).fill(0);
    }
     for (var j = 0; j < y_len ; j++){
        for (var i = 0;i  < 20 ; i++){
            avg_row = matrix[j].slice(i*Math.floor(x_len/20),(i+1)*Math.floor(x_len/20)).reduce((a,b) => a + b, 0) / Math.floor(x_len/20);
            temp[j][i] = avg_row;   
        }
        //console.log(j);
     }
     for (var i = 0; i < 20; i++){
         for (var j = 0 ; j < 12 ; j++){
            avg_col = selectColumn(temp, i).slice(j*Math.floor(y_len/12),(j+1)*Math.floor(y_len/12)).reduce((a,b) => a + b, 0) / Math.floor(y_len/12);
            A[j][i] = avg_col;
         }
    }
    return A;
 }

// function getRGB(imgData) {
//     for (var i=0;i<imgData.length;i+=4) {
//         R[i/4] = imgData[i];
//         G[i/4] = imgData[i+1];
//         B[i/4] = imgData[i+2];
//     }
// }
