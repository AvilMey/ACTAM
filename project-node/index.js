//import { generateImg, image2OneChannel,playOscillators, selectColumn} from "./functions";

const c = new AudioContext;

var attack = 0.001;
var release = 0.005;
var duration = (attack + release ) *1000;

var W;
var H;
var imageData;
var data2Play;
var A;
var B;
var C;

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const canv = document.getElementById("bar")
const context = canv.getContext("2d")


// var idata = ctx.createImageData(width, height);
// buffer = generateImg(width, height);
// idata.data.set(buffer);
// ctx.putImageData(idata, 0, 0);
//var data = image2OneChannel(idata.data, height, width);


//document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(horizontalDerivative(medianFilter(data2Play)),12,20)); });
document.getElementById('hihi').addEventListener('click',function () { playImage(normalizeImage(horizontalDerivative(medianFilter(data2Play)),12,700)); });


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

//AUDIO FUNCTIONS

function playImage(data){
    //console.log(data[0].length);
    for(var j = 0; j <data[0].length; j++){
        amps = selectColumn(data,j);
        setTimeout(playOscillators, duration*j,amps);
        setTimeout(drawLine, duration*j, (j+ 1/2)*W/20);
    }
}

function playOscillators(amps){
    console.log(amps.length);
    for(i=0; i< amps.length; i++){
        f = 440 * Math.pow(2, i / 12)
        var o = c.createOscillator();
        var g = c.createGain();
        o.frequency.value = f;
        o.connect(g);
        g.connect(c.destination);
        now = c.currentTime;
        g.gain.setValueAtTime(0, now);
        console.log(amps[i])
        g.gain.linearRampToValueAtTime(amps[i], now + attack);
        g.gain.linearRampToValueAtTime(0, now + attack + release);
        o.start(now);
        o.stop(now + attack + release);

    }
}




// IMAGE PROCESSING


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

function horizontalDerivative(matrix){
    y_len = matrix.length;
    x_len = matrix[0].length;
    var data = [];
    for(var i=0; i<y_len-2; i++) {
        data[i] = new Array(x_len-2);
    }
    /*
    var sbl_knl = [-1 , -2 ,-1 ,0, 0, 0, 1, 2, 1];
    //console.log(y_len);
     for (var j = 1 ; j < y_len-2 ; j++){
        for (var i = 1 ; i  < x_len-2 ; i++){
            data[j-1][i-1]=matrix[j-1][i-1]*sbl_knl[0] + matrix[j][i-1]*sbl_knl[1] + matrix[j+1][i-1]*sbl_knl[2] +
            matrix[j-1][i]*sbl_knl[3] + matrix[j][i]*sbl_knl[4] + matrix[j+1][i]*sbl_knl[5] +
            matrix[j-1][i+1]*sbl_knl[6] + matrix[j][i+1]*sbl_knl[7] + matrix[j+1][i+1]*sbl_knl[8]
              
        }

    
        //console.log(j);
     }
     */
    

    var sbl_knl = [-1 , -1 ,1, 1];
    //console.log(y_len);
     for (var j = 1 ; j < y_len-1 ; j++){
        for (var i = 1 ; i  < x_len-1 ; i++){
            data[j-1][i-1]=Math.abs(matrix[j-1][i-1]*sbl_knl[0] + matrix[j][i-1]*sbl_knl[1] + 
            matrix[j-1][i]*sbl_knl[2] + matrix[j][i]*sbl_knl[3]);       
        }
    }
    return data;
    
}

function medianFilter(matrix){
    y_len = matrix.length;
    x_len = matrix[0].length;
    var data = [];
    for(var i=0; i<y_len; i++) {
        data[i] = new Array(x_len);
    }
    var knl = [];
    //console.log(y_len);
    //aca lleno los bordes de la imagen de salida con los bordes de la imagen de entrada
    for (var j = 0 ; j < y_len - 1 ; j++){
        data[j][0]=matrix[j][0]
        data[j][x_len - 1]=matrix[j][x_len - 1]
    }
    
    for (var i = 1 ; i  < x_len - 2 ; i++){
        data[0][i]=matrix[0][i]
        data[y_len - 1][i]=matrix[y_len - 1][i]
    }

    // aca aplico el filtro de mediana
     for (var j = 1 ; j < y_len-1 ; j++){
        for (var i = 1 ; i  < x_len-1 ; i++){
            knl = [matrix[j-1][i-1], matrix[j][i-1], matrix[j+1][i-1], matrix[j-1][i], matrix[j][i], matrix[j+1][i],
            matrix[j-1][i+1], matrix[j][i+1], matrix[j+1][i+1]];
            data[j-1][i-1]= median(knl);  
        }
    }
    return data;
    
}
function normalizeImage(matrix,freqBins,timeStp){
    y_len = matrix.length;
    x_len = matrix[0].length;
    new_y = Math.floor(y_len/freqBins);
    new_x = Math.floor(x_len/timeStp);

    Q = 0;
    var data = [];
    for(var i=0; i<freqBins; i++) {
        data[i] = new Array(timeStp).fill(0);
    }
    //data = data / Math.max(data);
    //console.log(y_len);
    // tengo que definir indices para caminar por imagen
    for( var k = 0 ; k < freqBins; k++){
        for( var m = 0; m < timeStp; m++){
            for (var j = 0 ; j < new_y ; j++){
                for (var i = 0 ; i  < new_x ; i++){
                    data[k][m]+=matrix[k*new_y + j][m*new_x + i]/(new_x*new_y); 
                }
            }
            if (data[k][m]> Q){
                Q=data[k][m]
                console.log(Q);
            }
        }
    }
    
    for( var k = 0 ; k < freqBins; k++){
        for( var m = 0; m < timeStp; m++){
            data[k][m]/=Q;
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

// IMAGE HANDLING 

//get image from user and plot

function showImage(fileReader) {
    var img = document.getElementById("myImage");
    img.onload = () => getImageData(img);
    img.src = fileReader.result;
}

function getImageData(img) {
    W = img.width;
    H = img.height;
    var aux = []
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
   
    //data2Play =  image2OneChannel(imageData, H, W );
    //console.log("image data:", imageData);
    //getRGB(imageData);
 }

 function reduceImage(matrix,freq,time){
    y_len = matrix.length;
    x_len = matrix[0].length;
    //console.log(y_len);
    A = new Array(freq).fill(0);
    temp = new Array(y_len);
    for (var i = 0; i < A.length ;i++){
       A[i] = new Array(time).fill(0);
   }
   for (var i = 0; i < temp.length ;i++){
       temp[i] = new Array(time).fill(0);
   }
    for (var j = 0; j < y_len ; j++){
       for (var i = 0; i < time ; i++){
           avg_row = matrix[j].slice(i*Math.floor(x_len/time),(i+1)*Math.floor(x_len/time)).reduce((a,b) => a + b, 0) / Math.floor(x_len/time);
           temp[j][i] = avg_row;   
       }
       //console.log(j);
    }
    for (var i = 0; i < time; i++){
        for (var j = 0 ; j < freq ; j++){
           avg_col = selectColumn(temp, i).slice(j*Math.floor(y_len/freq),(j+1)*Math.floor(y_len/freq)).reduce((a,b) => a + b, 0) / Math.floor(y_len/freq);
           A[j][i] = avg_col;
        }
   }
   return A;
}

//Este funcion de mediana la saque de https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-88.php
const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};


// function getRGB(imgData) {
//     for (var i=0;i<imgData.length;i+=4) {
//         R[i/4] = imgData[i];
//         G[i/4] = imgData[i+1];
//         B[i/4] = imgData[i+2];
//     }
// }
