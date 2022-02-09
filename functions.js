import _ from "lodash";
import * as ss from 'simple-statistics'
import { create, all } from 'mathjs'

const config = { }
const math = create(all, config)




const c = new AudioContext;


//Input vars
var SoundType = "acoustic"; // This can be manual, piano, acoustic, edm or organ, when it is manual we use the other params, if it is any of the other we only use duration2, ScaleType, NumTimes and threshold
var ScaleType = "Chromatic";  // Can be any from the object "Scales" defined above


// All this are in seconds, they are to parametrize the waveform
var attack = 0.06; 
var release = 0.1;
var decay = 0.05;
var sustain = 0.15;
//----------------
var oscType = "square"; // can be sine, square, sawtooth, triangle
var baseFreq = 440; // Base note freq
var threshold = 0.4; //Value from 0 to 1, it is a threshold to decide if a pixel is played or not, when 0 all pixels are played, higher values means only very edgy objets are played

//Filter
var filterTyp = "lowshelf"; // can be: lowpass, highpass, bandpass, lowshelf, highshelf, peaking, notch, allpass
var filtFreq = 500; // filter freq reference
var filtQslider = 4; // Some other parameter for the filter that I don't remember, have to be positive
var filtGain = 2; // Other parameter of the filter. can be either negative or positve

//Distortion
var ApplyDist = true; // true or false
var DistValue = 400; //Ammount of distortion
var DistOver = "2x";//Oversampling after distortion. Valid values are 'none', '2x', or '4x'. 

var NumFreqs = 12; //How many frequencies we want to have in total
var NumTimes = 20; //How many time steps we want to have in total 

var detune = true; //Detune the oscilators can only be true or false
var unisonWidth =  10; //Detune value, it can be a low number, from 1 to 20 more or less

var harmonics = [1,0.5,1,0.5,1]; // Weigths for the harmonics, the size of the array is the number of harmonics, and the values are the weigths.

var duration2 = 1; //Duration of notes when preset synth is used
//------------------------------------

const duration = (attack + release + decay + sustain ) *1000; // duration when manual
var norm = 0;

var piano = Synth.createInstrument('piano');
var acoustic = Synth.createInstrument('acoustic');
var organ = Synth.createInstrument('organ');
var edm = Synth.createInstrument('edm');

//Scales
const Scales = {
    Chromatic : ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"],
    Ionian    : ["C","D","E","F","G","A","B","C"],
    Dorian    : ["D","E","F","G","A","B","C","D"],
    Phrygian  : ["E","F","G","A","B","C","D","E"],
    Lydian    : ["F","G","A","B","C","D","E","F"],
    Mixo      : ["G","A","B","C","D","E","F","G"],
    Aeolian   : ["A","B","C","D","E","F","G","A"],
    Locrian   : ["B","C","D","E","F","G","A","B"],
    Melodic   : ["C","D","D#","F","G","A","B","C"],
    Harmonic  : ["D","E","F","G","A","A#","C#","D"],
    Blues     : ["E","G","A","A#","B","D","E"],
    FPenta    : ["F","G","A","C","D","F"],
    CPenta    : ["C","D","E","G","A","C"],
    GPenta    : ["G","A#","C","D","F","G"],
    APenta    : ["A","C","D","E","G","A"]

};

var W;
var Waux;
var H;
var imageData;
var data2Play;
var A;

// Dial Button
// Duration2 Button

var knobPositionXDuration2;
var knobPositionYDuration2;
var mouseXDuration2;
var mouseYDuration2;
var knobCenterXDuration2;
var knobCenterYDuration2;
var adjacentSideDuration2;
var oppositeSideDuration2;
var currentRadiansAngleDuration2;
var getRadiansInDegreesDuration2;
var finalAngleInDegreesDuration2;
var volumeSettingDuration2;
var tickHighlightPositionDuration2;
var startingTickAngleDuration2 = -135;
var tickContainerDuration2 = document.getElementById("tickContainer-duration2");
var volumeKnobDuration2 = document.getElementById("knob-duration2");
var boundingRectangleDuration2 = volumeKnobDuration2.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// NumTimes

var knobPositionXNumTimes;
var knobPositionYNumTimes;
var mouseXNumTimes;
var mouseYNumTimes;
var knobCenterXNumTimes;
var knobCenterYNumTimes;
var adjacentSideNumTimes;
var oppositeSideNumTimes;
var currentRadiansAngleNumTimes;
var getRadiansInDegreesNumTimes;
var finalAngleInDegreesNumTimes;
var volumeSettingNumTimes;
var tickHighlightPositionNumTimes;
var startingTickAngleNumTimes = -135;
var tickContainerNumTimes = document.getElementById("tickContainer-numTimes");
var volumeKnobNumTimes = document.getElementById("knob-numTimes");
var boundingRectangleNumTimes = volumeKnobNumTimes.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Threshold

var knobPositionXThreshold;
var knobPositionYThreshold;
var mouseXThreshold;
var mouseYThreshold;
var knobCenterXThreshold;
var knobCenterYThreshold;
var adjacentSideThreshold;
var oppositeSideThreshold;
var currentRadiansAngleThreshold;
var getRadiansInDegreesThreshold;
var finalAngleInDegreesThreshold;
var volumeSettingThreshold;
var tickHighlightPositionThreshold;
var startingTickAngleThreshold = -135;
var tickContainerThreshold = document.getElementById("tickContainer-threshold");
var volumeKnobThreshold = document.getElementById("knob-threshold");
var boundingRectangleThreshold = volumeKnobThreshold.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Attack

var knobPositionXAttack;
var knobPositionYAttack;
var mouseXAttack;
var mouseYAttack;
var knobCenterXAttack;
var knobCenterYAttack;
var adjacentSideAttack;
var oppositeSideAttack;
var currentRadiansAngleAttack;
var getRadiansInDegreesAttack;
var finalAngleInDegreesAttack;
var volumeSettingAttack;
var tickHighlightPositionAttack;
var startingTickAngleAttack = -135;
var tickContainerAttack = document.getElementById("tickContainer-attack");
var volumeKnobAttack = document.getElementById("knob-attack");
var boundingRectangleAttack = volumeKnobAttack.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Release

var knobPositionXRelease;
var knobPositionYRelease;
var mouseXRelease;
var mouseYRelease;
var knobCenterXRelease;
var knobCenterYRelease;
var adjacentSideRelease;
var oppositeSideRelease;
var currentRadiansAngleRelease;
var getRadiansInDegreesRelease;
var finalAngleInDegreesRelease;
var volumeSettingRelease;
var tickHighlightPositionRelease;
var startingTickAngleRelease = -135;
var tickContainerRelease = document.getElementById("tickContainer-release");
var volumeKnobRelease = document.getElementById("knob-release");
var boundingRectangleRelease = volumeKnobRelease.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Decay

var knobPositionXDecay;
var knobPositionYDecay;
var mouseXDecay;
var mouseYDecay;
var knobCenterXDecay;
var knobCenterYDecay;
var adjacentSideDecay;
var oppositeSideDecay;
var currentRadiansAngleDecay;
var getRadiansInDegreesDecay;
var finalAngleInDegreesDecay;
var volumeSettingDecay;
var tickHighlightPositionDecay;
var startingTickAngleDecay = -135;
var tickContainerDecay = document.getElementById("tickContainer-decay");
var volumeKnobDecay = document.getElementById("knob-decay");
var boundingRectangleDecay = volumeKnobDecay.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)

// Sustain

var knobPositionXSustain;
var knobPositionYSustain;
var mouseXSustain;
var mouseYSustain;
var knobCenterXSustain;
var knobCenterYSustain;
var adjacentSideSustain;
var oppositeSideSustain;
var currentRadiansAngleSustain;
var getRadiansInDegreesSustain;
var finalAngleInDegreesSustain;
var volumeSettingSustain;
var tickHighlightPositionSustain;
var startingTickAngleSustain = -135;
var tickContainerSustain = document.getElementById("tickContainer-sustain");
var volumeKnobSustain = document.getElementById("knob-sustain");
var boundingRectangleSustain = volumeKnobSustain.getBoundingClientRect(); //get rectangular geometric data of knob (x, y, width, height)
//


const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

const canv = document.getElementById("bar")
//const context = canv.getContext("2d")

function drawLine(x){
    /*console.log(x,canv.width);
    context.beginPath();
    context.clearRect(0,0,canv.width,canv.height);
    context.moveTo(x,0);
    context.lineTo(x, canv.height);
    context.stroke();    */
    var img = document.getElementById("myImage");
    var imagePercentage = img.width/window.screen.width;
    canv.style.width = x/img.width*imagePercentage*100 + "%";
    canv.style.height = 30 + "px";
    canv.style.backgroundColor = "green";
}

function playButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });

    //--------- Play Code --------//

    document.getElementById('hihi').addEventListener('click',function () {

        // Scales Select

        var e = document.getElementById("ScaleSelect");
        var value = e.options[e.selectedIndex].value;
        ScaleType = value;
        console.log(value);

        if(SoundType == "piano" || SoundType == "acoustic" || SoundType == "organ" || SoundType == "edm" || SoundType == "manual"){
            if(SoundType != "manual"){NumFreqs = Scales[ScaleType].length;}
        playImage(normalizeImage(horizontalDerivative(medianFilter(data2Play)),NumFreqs,NumTimes));}
        else{alert("Please select a valid SoundType")}
    } 
    );
        

}

function pianoButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Piano').addEventListener('click',function () {
        SoundType = "piano";
    } 
    );
}

function acousticButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Acoustic').addEventListener('click',function () {
        SoundType = "acoustic";
    } 
    );
}

function edmButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Edm').addEventListener('click',function () {
        SoundType = "edm";
    } 
    );
}

function organButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Organ').addEventListener('click',function () {
        SoundType = "organ";
    } 
    );
}

function manualButton(){
    //document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(data2Play)); });
    document.getElementById('Manual').addEventListener('click',function () {
        SoundType = "manual";
    } 
    );
}

function playImage(data){
    //console.log(data);
    var durationAux;

    if(SoundType == "manual"){
        durationAux = duration
    } else {
        durationAux = duration2 * 1000;
        console.log(durationAux);
        console.log(duration);
    }
     
    for(var j = 0; j <data[0].length; j++){
       
        amps = selectColumn(data,j);
        setTimeout(playOscillators, durationAux*j,amps);
        setTimeout(drawLine,durationAux*j, (j+1)*Waux/NumTimes);
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

// function generateImg(width, height){
//     var buffer = new Uint8ClampedArray(width* height* 4);
//     for(var y = 0; y< height; y++) {
//         for(var x = 0; x< width; x++) {
//             var pos = (y*width + x)*4;
//             buffer[pos] = Math.floor(Math.random() * 256);
//             buffer[pos+1] = Math.floor(Math.random() * 256);
//             buffer[pos+2] = Math.floor(Math.random() * 256);
//             buffer[pos+3] = 255;
//         }
//     }
//     return buffer;
// }

function playOscillators(amps){
    console.log(amps.length);
    norm = 0;
    for(i=0; i< amps.length; i++){
        if(amps[i] > threshold){
            norm = norm + 1;
        }
    }
    for(i=0; i< amps.length; i++){
        if(amps[i] > threshold){
            Synth.setVolume(1/norm - 0.01);
            n = amps.length - i - 1;
            //console.log(amps[i]);
            f = baseFreq*Math.pow(2,n/12)

            if(SoundType == "manual"){
                harmonicsWeigths = math.multiply(harmonics,amps[i]);
                createHarmonics(f,harmonicsWeigths,detune);}

            else if(SoundType == "piano"){
                piano.play(Scales[ScaleType][n], 4, duration2);}

            else if(SoundType == "acoustic"){
                acoustic.play(Scales[ScaleType][n], 4, duration2);}
            else if(SoundType == "organ"){
                organ.play(Scales[ScaleType][n], 4, duration2);}
                //console.log("volume is " + Synth.getVolume());}
            else if(SoundType == "edm"){
                edm.play(Scales[ScaleType][n], 4, duration2);}

       
        }   
    }
}

function createOscillators(f, amplitud, detune){


    var o = c.createOscillator();
    var g = c.createGain();

    var filter = c.createBiquadFilter();
    var distortion = c.createWaveShaper();

    //Filter
    filter.type = filterTyp;
    filter.frequency.value = filtFreq;
    filter.Q.value = filtQslider;
    filter.gain.value = filtGain;

    //Distortion
    distortion.curve = makeDistortionCurve(DistValue);
    distortion.oversample = DistOver;       

    //Oscillator
    o.type = oscType;
    o.frequency.value = f;
    o.detune.value = detune;

    
    
    if(ApplyDist==true){
        o.connect(distortion)
        distortion.connect(filter);
        filter.connect(g);
        g.connect(c.destination);}
    else{
        o.connect(filter);
        filter.connect(g);
        g.connect(c.destination);}

    now = c.currentTime;
    
    //Waveform
    g.gain.setValueAtTime(0, now);   
    g.gain.linearRampToValueAtTime(amplitud/(norm), now+attack);
    g.gain.setTargetAtTime(sustain, now+attack, decay);
    g.gain.linearRampToValueAtTime(0, now+attack+release+decay+sustain);

    //Start
    o.start(now);
    o.stop(now+attack+release+decay+sustain);
}

function createHarmonics(f, harmonicsWeigths, detune){
    //createOscillators(f,amps[i], 0); 
    
    for(var i=0; i<harmonicsWeigths.length ; i++){
        //console.log(harmonicsWeigths.length);
        createOscillators(f*(i+1),harmonicsWeigths[i], 0);
        if (detune == true){
            createOscillators(f*(i+1),harmonicsWeigths[i], -unisonWidth); 
            createOscillators(f*(i+1),harmonicsWeigths[i], unisonWidth);
        }
    }
}



//get image from user and plot

function showImage(fileReader) {
    // Reset Time bar
    canv.style.backgroundColor = "transparent";

    var img = document.getElementById("myImage");
    var realImg = document.getElementById("realImage");
    img.onload = () => getImageData(img, realImg);
    img.src = fileReader.result;
    realImg.src = fileReader.result;
}

function getImageData(img, realImg) {
    W = realImg.width;
    Waux = img.width;
    H = realImg.height;
    console.log(W,H);
    canvas.width = W;
    canvas.height = H;
    canv.height = 30 + "px";
    canv.width = img.width;
    canv.style.position = "absolute";
    canv.style.marginLeft = img.x - 8  + "px";
    canv.style.marginTop = img.y + img.height - 5 + "px";
   
    ctx.drawImage(realImg, 0, 0);
    imageData = ctx.getImageData(0, 0, W, H).data;
    data2Play =  image2OneChannel(imageData, H, W );
    data2Play = math.abs(math.add(data2Play, -modeOfMatrix(data2Play)));
    //console.log(data2Play);
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

 function modeOfMatrix(matrix){
    a1d = [].concat(...matrix);
    mode = ss.mode(a1d);
    return mode;
 }
// function getRGB(imgData) {
//     for (var i=0;i<imgData.length;i+=4) {
//         R[i/4] = imgData[i];
//         G[i/4] = imgData[i+1];
//         B[i/4] = imgData[i+2];
//     }
// }

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
                //console.log(Q);
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

const median = arr => {
    const mid = Math.floor(arr.length / 2),
        nums = [...arr].sort((a, b) => a - b);
    return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
};




function makeDistortionCurve(amount) {
    var k = typeof amount === 'number' ? amount : 50,
      n_samples = 44100,
      curve = new Float32Array(n_samples),
      deg = Math.PI / 180,
      i = 0,
      x;
    for ( ; i < n_samples; ++i ) {
      x = i * 2 / n_samples - 1;
      curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
    }
    return curve;
  };

  // Slider Duration2

  function mainDuration2()
  {
      volumeKnobDuration2.addEventListener(getMouseDownDuration2(), onMouseDownDuration2); //listen for mouse button click
      document.addEventListener(getMouseUpDuration2(), onMouseUpDuration2); //listen for mouse button release

      createTicksDuration2(27, 0);
  }

  //on mouse button down
  function onMouseDownDuration2()
  {
      document.addEventListener(getMouseMoveDuration2(), onMouseMoveDuration2); //start drag
  }

  //on mouse button release
  function onMouseUpDuration2()
  {
      document.removeEventListener(getMouseMoveDuration2(), onMouseMoveDuration2); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveDuration2(event)
  {
      knobPositionXDuration2 = boundingRectangleDuration2.left; //get knob's global x position
      knobPositionYDuration2 = boundingRectangleDuration2.top; //get knob's global y position

      if(detectMobileDuration2() == "desktop")
      {
          mouseXDuration2 = event.pageX; //get mouse's x global position
          mouseYDuration2 = event.pageY; //get mouse's y global position
      } else {
          mouseXDuration2 = event.touches[0].pageX; //get finger's x global position
          mouseYDuration2 = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXDuration2 = boundingRectangleDuration2.width / 2 + knobPositionXDuration2; //get global horizontal center position of knob relative to mouse position
      knobCenterYDuration2 = boundingRectangleDuration2.height / 2 + knobPositionYDuration2; //get global vertical center position of knob relative to mouse position

      adjacentSideDuration2 = knobCenterXDuration2 - mouseXDuration2; //compute adjacent value of imaginary right angle triangle
      oppositeSideDuration2 = knobCenterYDuration2 - mouseYDuration2; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleDuration2 = Math.atan2(adjacentSideDuration2, oppositeSideDuration2);

      getRadiansInDegreesDuration2 = currentRadiansAngleDuration2 * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesDuration2 = -(getRadiansInDegreesDuration2 - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesDuration2 >= 0 && finalAngleInDegreesDuration2 <= 270)
      {
          volumeKnobDuration2.style.transform = "rotate(" + finalAngleInDegreesDuration2 + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingDuration2 = Math.ceil(finalAngleInDegreesDuration2 * (4 / 270) + 0.7 );

          tickHighlightPositionDuration2 = Math.round((volumeSettingDuration2 * 27/5)); //interpolate how many ticks need to be highlighted
          duration2 = volumeSettingDuration2;
          console.log("Dur");
          createTicksDuration2(27, tickHighlightPositionDuration2); //highlight ticks

          document.getElementById("volumeValue-duration2").innerHTML = volumeSettingDuration2 + " seconds"; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksDuration2(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerDuration2.firstChild)
      {
          tickContainerDuration2.removeChild(tickContainerDuration2.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickDuration2 = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickDuration2.className = "tick activetick";
          } else {
              tickDuration2.className = "tick";
          }

          tickContainerDuration2.appendChild(tickDuration2);
          tickDuration2.style.transform = "rotate(" + startingTickAngleDuration2 + "deg)";
          startingTickAngleDuration2 += 10;
      }

      startingTickAngleDuration2 = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileDuration2()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownDuration2()
  {
      if(detectMobileDuration2() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpDuration2()
  {
      if(detectMobileDuration2() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveDuration2()
  {
      if(detectMobileDuration2() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  // Slider NumTimes

  function mainNumTimes()
  {
      volumeSettingNumTimes = 1;
      volumeKnobNumTimes.addEventListener(getMouseDownNumTimes(), onMouseDownNumTimes); //listen for mouse button click
      document.addEventListener(getMouseUpNumTimes(), onMouseUpNumTimes); //listen for mouse button release

      createTicksNumTimes(27, 0);
  }

  //on mouse button down
  function onMouseDownNumTimes()
  {
      document.addEventListener(getMouseMoveNumTimes(), onMouseMoveNumTimes); //start drag
  }

  //on mouse button release
  function onMouseUpNumTimes()
  {
      document.removeEventListener(getMouseMoveNumTimes(), onMouseMoveNumTimes); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveNumTimes(event)
  {
      knobPositionXNumTimes = boundingRectangleNumTimes.left; //get knob's global x position
      knobPositionYNumTimes = boundingRectangleNumTimes.top; //get knob's global y position

      if(detectMobileNumTimes() == "desktop")
      {
          mouseXNumTimes = event.pageX; //get mouse's x global position
          mouseYNumTimes = event.pageY; //get mouse's y global position
      } else {
          mouseXNumTimes = event.touches[0].pageX; //get finger's x global position
          mouseYNumTimes = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXNumTimes = boundingRectangleNumTimes.width / 2 + knobPositionXNumTimes; //get global horizontal center position of knob relative to mouse position
      knobCenterYNumTimes = boundingRectangleNumTimes.height / 2 + knobPositionYNumTimes; //get global vertical center position of knob relative to mouse position

      adjacentSideNumTimes = knobCenterXNumTimes - mouseXNumTimes; //compute adjacent value of imaginary right angle triangle
      oppositeSideNumTimes = knobCenterYNumTimes - mouseYNumTimes; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleNumTimes = Math.atan2(adjacentSideNumTimes, oppositeSideNumTimes);

      getRadiansInDegreesNumTimes = currentRadiansAngleNumTimes * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesNumTimes = -(getRadiansInDegreesNumTimes - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesNumTimes >= 0 && finalAngleInDegreesNumTimes <= 270)
      {
          volumeKnobNumTimes.style.transform = "rotate(" + finalAngleInDegreesNumTimes + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingNumTimes = Math.ceil(finalAngleInDegreesNumTimes * (499 / 270) + 0.7 );

          tickHighlightPositionNumTimes = Math.round((volumeSettingNumTimes * 27/500)); //interpolate how many ticks need to be highlighted
          NumTimes = volumeSettingNumTimes;
          createTicksNumTimes(27, tickHighlightPositionNumTimes); //highlight ticks

          document.getElementById("volumeValue-numTimes").innerHTML = volumeSettingNumTimes; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksNumTimes(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerNumTimes.firstChild)
      {
          tickContainerNumTimes.removeChild(tickContainerNumTimes.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickNumTimes = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickNumTimes.className = "tick activetick";
          } else {
              tickNumTimes.className = "tick";
          }

          tickContainerNumTimes.appendChild(tickNumTimes);
          tickNumTimes.style.transform = "rotate(" + startingTickAngleNumTimes + "deg)";
          startingTickAngleNumTimes += 10;
      }

      startingTickAngleNumTimes = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileNumTimes()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownNumTimes()
  {
      if(detectMobileNumTimes() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpNumTimes()
  {
      if(detectMobileNumTimes() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveNumTimes()
  {
      if(detectMobileNumTimes() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  // Slider Threshold

  function mainThreshold()
  {
      volumeKnobThreshold.addEventListener(getMouseDownThreshold(), onMouseDownThreshold); //listen for mouse button click
      document.addEventListener(getMouseUpThreshold(), onMouseUpThreshold); //listen for mouse button release

      createTicksThreshold(27, 0);
  }

  //on mouse button down
  function onMouseDownThreshold()
  {
      document.addEventListener(getMouseMoveThreshold(), onMouseMoveThreshold); //start drag
  }

  //on mouse button release
  function onMouseUpThreshold()
  {
      document.removeEventListener(getMouseMoveThreshold(), onMouseMoveThreshold); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveThreshold(event)
  {
      knobPositionXThreshold = boundingRectangleThreshold.left; //get knob's global x position
      knobPositionYThreshold = boundingRectangleThreshold.top; //get knob's global y position

      if(detectMobileThreshold() == "desktop")
      {
          mouseXThreshold = event.pageX; //get mouse's x global position
          mouseYThreshold = event.pageY; //get mouse's y global position
      } else {
          mouseXThreshold = event.touches[0].pageX; //get finger's x global position
          mouseYThreshold = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXThreshold = boundingRectangleThreshold.width / 2 + knobPositionXThreshold; //get global horizontal center position of knob relative to mouse position
      knobCenterYThreshold = boundingRectangleThreshold.height / 2 + knobPositionYThreshold; //get global vertical center position of knob relative to mouse position

      adjacentSideThreshold = knobCenterXThreshold - mouseXThreshold; //compute adjacent value of imaginary right angle triangle
      oppositeSideThreshold = knobCenterYThreshold - mouseYThreshold; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleThreshold = Math.atan2(adjacentSideThreshold, oppositeSideThreshold);

      getRadiansInDegreesThreshold = currentRadiansAngleThreshold * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesThreshold = -(getRadiansInDegreesThreshold - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesThreshold >= 0 && finalAngleInDegreesThreshold <= 270)
      {
          volumeKnobThreshold.style.transform = "rotate(" + finalAngleInDegreesThreshold + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingThreshold = Math.round(finalAngleInDegreesThreshold * (1 / 270)*100)/100;

          tickHighlightPositionThreshold = Math.round((volumeSettingThreshold * 27/1)); //interpolate how many ticks need to be highlighted
          threshold = volumeSettingThreshold;
          createTicksThreshold(27, tickHighlightPositionThreshold); //highlight ticks

          document.getElementById("volumeValue-threshold").innerHTML = volumeSettingThreshold; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksThreshold(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerThreshold.firstChild)
      {
          tickContainerThreshold.removeChild(tickContainerThreshold.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickThreshold = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickThreshold.className = "tick activetick";
          } else {
              tickThreshold.className = "tick";
          }

          tickContainerThreshold.appendChild(tickThreshold);
          tickThreshold.style.transform = "rotate(" + startingTickAngleThreshold + "deg)";
          startingTickAngleThreshold += 10;
      }

      startingTickAngleThreshold = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileThreshold()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownThreshold()
  {
      if(detectMobileThreshold() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpThreshold()
  {
      if(detectMobileThreshold() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveThreshold()
  {
      if(detectMobileThreshold() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }

  // Slider Attack
  
  function mainAttack()
  {
      volumeKnobAttack.addEventListener(getMouseDownAttack(), onMouseDownAttack); //listen for mouse button click
      document.addEventListener(getMouseUpAttack(), onMouseUpAttack); //listen for mouse button release

      createTicksAttack(27, 0);
  }

  //on mouse button down
  function onMouseDownAttack()
  {
      document.addEventListener(getMouseMoveAttack(), onMouseMoveAttack); //start drag
  }

  //on mouse button release
  function onMouseUpAttack()
  {
      document.removeEventListener(getMouseMoveAttack(), onMouseMoveAttack); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveAttack(event)
  {
      knobPositionXAttack = boundingRectangleAttack.left; //get knob's global x position
      knobPositionYAttack = boundingRectangleAttack.top; //get knob's global y position

      if(detectMobileAttack() == "desktop")
      {
          mouseXAttack = event.pageX; //get mouse's x global position
          mouseYAttack = event.pageY; //get mouse's y global position
      } else {
          mouseXAttack = event.touches[0].pageX; //get finger's x global position
          mouseYAttack = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXAttack = boundingRectangleAttack.width / 2 + knobPositionXAttack; //get global horizontal center position of knob relative to mouse position
      knobCenterYAttack = boundingRectangleAttack.height / 2 + knobPositionYAttack; //get global vertical center position of knob relative to mouse position

      adjacentSideAttack = knobCenterXAttack - mouseXAttack; //compute adjacent value of imaginary right angle triangle
      oppositeSideAttack = knobCenterYAttack - mouseYAttack; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleAttack = Math.atan2(adjacentSideAttack, oppositeSideAttack);

      getRadiansInDegreesAttack = currentRadiansAngleAttack * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesAttack = -(getRadiansInDegreesAttack - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesAttack >= 0 && finalAngleInDegreesAttack <= 270)
      {
          volumeKnobAttack.style.transform = "rotate(" + finalAngleInDegreesAttack + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingAttack = Math.round(finalAngleInDegreesAttack * (1 / 270)*100)/100;

          tickHighlightPositionAttack = Math.round((volumeSettingAttack * 27/1)); //interpolate how many ticks need to be highlighted
          attack = volumeSettingAttack;
          createTicksAttack(27, tickHighlightPositionAttack); //highlight ticks

          document.getElementById("volumeValue-attack").innerHTML = volumeSettingAttack; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksAttack(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerAttack.firstChild)
      {
          tickContainerAttack.removeChild(tickContainerAttack.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickAttack = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickAttack.className = "tick activetick";
          } else {
              tickAttack.className = "tick";
          }

          tickContainerAttack.appendChild(tickAttack);
          tickAttack.style.transform = "rotate(" + startingTickAngleAttack + "deg)";
          startingTickAngleAttack += 10;
      }

      startingTickAngleAttack = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileAttack()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownAttack()
  {
      if(detectMobileAttack() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpAttack()
  {
      if(detectMobileAttack() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveAttack()
  {
      if(detectMobileAttack() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  
  // Release Button

  function mainRelease()
  {
      volumeKnobRelease.addEventListener(getMouseDownRelease(), onMouseDownRelease); //listen for mouse button click
      document.addEventListener(getMouseUpRelease(), onMouseUpRelease); //listen for mouse button release

      createTicksRelease(27, 0);
  }

  //on mouse button down
  function onMouseDownRelease()
  {
      document.addEventListener(getMouseMoveRelease(), onMouseMoveRelease); //start drag
  }

  //on mouse button release
  function onMouseUpRelease()
  {
      document.removeEventListener(getMouseMoveRelease(), onMouseMoveRelease); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveRelease(event)
  {
      knobPositionXRelease = boundingRectangleRelease.left; //get knob's global x position
      knobPositionYRelease = boundingRectangleRelease.top; //get knob's global y position

      if(detectMobileRelease() == "desktop")
      {
          mouseXRelease = event.pageX; //get mouse's x global position
          mouseYRelease = event.pageY; //get mouse's y global position
      } else {
          mouseXRelease = event.touches[0].pageX; //get finger's x global position
          mouseYRelease = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXRelease = boundingRectangleRelease.width / 2 + knobPositionXRelease; //get global horizontal center position of knob relative to mouse position
      knobCenterYRelease = boundingRectangleRelease.height / 2 + knobPositionYRelease; //get global vertical center position of knob relative to mouse position

      adjacentSideRelease = knobCenterXRelease - mouseXRelease; //compute adjacent value of imaginary right angle triangle
      oppositeSideRelease = knobCenterYRelease - mouseYRelease; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleRelease = Math.atan2(adjacentSideRelease, oppositeSideRelease);

      getRadiansInDegreesRelease = currentRadiansAngleRelease * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesRelease = -(getRadiansInDegreesRelease - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesRelease >= 0 && finalAngleInDegreesRelease <= 270)
      {
          volumeKnobRelease.style.transform = "rotate(" + finalAngleInDegreesRelease + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingRelease = Math.round(finalAngleInDegreesRelease * (1 / 270)*100)/100;

          tickHighlightPositionRelease = Math.round((volumeSettingRelease * 27/1)); //interpolate how many ticks need to be highlighted
          release = volumeSettingRelease;
          createTicksRelease(27, tickHighlightPositionRelease); //highlight ticks

          document.getElementById("volumeValue-release").innerHTML = volumeSettingRelease; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksRelease(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerRelease.firstChild)
      {
          tickContainerRelease.removeChild(tickContainerRelease.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickRelease = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickRelease.className = "tick activetick";
          } else {
              tickRelease.className = "tick";
          }

          tickContainerRelease.appendChild(tickRelease);
          tickRelease.style.transform = "rotate(" + startingTickAngleRelease + "deg)";
          startingTickAngleRelease += 10;
      }

      startingTickAngleRelease = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileRelease()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownRelease()
  {
      if(detectMobileRelease() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpRelease()
  {
      if(detectMobileRelease() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveRelease()
  {
      if(detectMobileRelease() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }
  
  // Decay Button

  function mainDecay()
  {
      volumeKnobDecay.addEventListener(getMouseDownDecay(), onMouseDownDecay); //listen for mouse button click
      document.addEventListener(getMouseUpDecay(), onMouseUpDecay); //listen for mouse button decay

      createTicksDecay(27, 0);
  }

  //on mouse button down
  function onMouseDownDecay()
  {
      document.addEventListener(getMouseMoveDecay(), onMouseMoveDecay); //start drag
  }

  //on mouse button decay
  function onMouseUpDecay()
  {
      document.removeEventListener(getMouseMoveDecay(), onMouseMoveDecay); //stop drag
  }

  //compute mouse angle relative to center of volume knob
  //For clarification, see my basic trig explanation at:
  //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
  function onMouseMoveDecay(event)
  {
      knobPositionXDecay = boundingRectangleDecay.left; //get knob's global x position
      knobPositionYDecay = boundingRectangleDecay.top; //get knob's global y position

      if(detectMobileDecay() == "desktop")
      {
          mouseXDecay = event.pageX; //get mouse's x global position
          mouseYDecay = event.pageY; //get mouse's y global position
      } else {
          mouseXDecay = event.touches[0].pageX; //get finger's x global position
          mouseYDecay = event.touches[0].pageY; //get finger's y global position
      }

      knobCenterXDecay = boundingRectangleDecay.width / 2 + knobPositionXDecay; //get global horizontal center position of knob relative to mouse position
      knobCenterYDecay = boundingRectangleDecay.height / 2 + knobPositionYDecay; //get global vertical center position of knob relative to mouse position

      adjacentSideDecay = knobCenterXDecay - mouseXDecay; //compute adjacent value of imaginary right angle triangle
      oppositeSideDecay = knobCenterYDecay - mouseYDecay; //compute opposite value of imaginary right angle triangle

      //arc-tangent function returns circular angle in radians
      //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
      currentRadiansAngleDecay = Math.atan2(adjacentSideDecay, oppositeSideDecay);

      getRadiansInDegreesDecay = currentRadiansAngleDecay * 180 / Math.PI; //convert radians into degrees

      finalAngleInDegreesDecay = -(getRadiansInDegreesDecay - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction

      //only allow rotate if greater than zero degrees or lesser than 270 degrees
      if(finalAngleInDegreesDecay >= 0 && finalAngleInDegreesDecay <= 270)
      {
          volumeKnobDecay.style.transform = "rotate(" + finalAngleInDegreesDecay + "deg)"; //use dynamic CSS transform to rotate volume knob

          //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
          volumeSettingDecay = Math.round(finalAngleInDegreesDecay * (1 / 270)*100)/100;

          tickHighlightPositionDecay = Math.round((volumeSettingDecay * 27/1)); //interpolate how many ticks need to be highlighted
          decay = volumeSettingDecay;
          createTicksDecay(27, tickHighlightPositionDecay); //highlight ticks

          document.getElementById("volumeValue-decay").innerHTML = volumeSettingDecay; //update volume text
      }
  }

  //dynamically create volume knob "ticks"
  function createTicksDecay(numTicks, highlightNumTicks)
  {
      //reset first by deleting all existing ticks
      while(tickContainerDecay.firstChild)
      {
          tickContainerDecay.removeChild(tickContainerDecay.firstChild);
      }

      //create ticks
      for(var i=0;i<numTicks;i++)
      {
          var tickDecay = document.createElement("div");

          //highlight only the appropriate ticks using dynamic CSS
          if(i < highlightNumTicks)
          {
              tickDecay.className = "tick activetick";
          } else {
              tickDecay.className = "tick";
          }

          tickContainerDecay.appendChild(tickDecay);
          tickDecay.style.transform = "rotate(" + startingTickAngleDecay + "deg)";
          startingTickAngleDecay += 10;
      }

      startingTickAngleDecay = -135; //reset
  }

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
  function detectMobileDecay()
  {
      var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));

      if(result !== null)
      {
          return "mobile";
      } else {
          return "desktop";
      }
  }

  function getMouseDownDecay()
  {
      if(detectMobileDecay() == "desktop")
      {
          return "mousedown";
      } else {
          return "touchstart";
      }
  }

  function getMouseUpDecay()
  {
      if(detectMobileDecay() == "desktop")
      {
          return "mouseup";
      } else {
          return "touchend";
      }
  }

  function getMouseMoveDecay()
  {
      if(detectMobileDecay() == "desktop")
      {
          return "mousemove";
      } else {
          return "touchmove";
      }
  }

    // Sustain Button

    function mainSustain()
    {
        volumeKnobSustain.addEventListener(getMouseDownSustain(), onMouseDownSustain); //listen for mouse button click
        document.addEventListener(getMouseUpSustain(), onMouseUpSustain); //listen for mouse button sustain
  
        createTicksSustain(27, 0);
    }
  
    //on mouse button down
    function onMouseDownSustain()
    {
        document.addEventListener(getMouseMoveSustain(), onMouseMoveSustain); //start drag
    }
  
    //on mouse button sustain
    function onMouseUpSustain()
    {
        document.removeEventListener(getMouseMoveSustain(), onMouseMoveSustain); //stop drag
    }
  
    //compute mouse angle relative to center of volume knob
    //For clarification, see my basic trig explanation at:
    //https://www.quora.com/What-is-the-significance-of-the-number-pi-to-the-universe/answer/Kevin-Lam-15
    function onMouseMoveSustain(event)
    {
        knobPositionXSustain = boundingRectangleSustain.left; //get knob's global x position
        knobPositionYSustain = boundingRectangleSustain.top; //get knob's global y position
  
        if(detectMobileSustain() == "desktop")
        {
            mouseXSustain = event.pageX; //get mouse's x global position
            mouseYSustain = event.pageY; //get mouse's y global position
        } else {
            mouseXSustain = event.touches[0].pageX; //get finger's x global position
            mouseYSustain = event.touches[0].pageY; //get finger's y global position
        }
  
        knobCenterXSustain = boundingRectangleSustain.width / 2 + knobPositionXSustain; //get global horizontal center position of knob relative to mouse position
        knobCenterYSustain = boundingRectangleSustain.height / 2 + knobPositionYSustain; //get global vertical center position of knob relative to mouse position
  
        adjacentSideSustain = knobCenterXSustain - mouseXSustain; //compute adjacent value of imaginary right angle triangle
        oppositeSideSustain = knobCenterYSustain - mouseYSustain; //compute opposite value of imaginary right angle triangle
  
        //arc-tangent function returns circular angle in radians
        //use atan2() instead of atan() because atan() returns only 180 degree max (PI radians) but atan2() returns four quadrant's 360 degree max (2PI radians)
        currentRadiansAngleSustain = Math.atan2(adjacentSideSustain, oppositeSideSustain);
  
        getRadiansInDegreesSustain = currentRadiansAngleSustain * 180 / Math.PI; //convert radians into degrees
  
        finalAngleInDegreesSustain = -(getRadiansInDegreesSustain - 135); //knob is already starting at -135 degrees due to visual design so 135 degrees needs to be subtracted to compensate for the angle offset, negative value represents clockwise direction
  
        //only allow rotate if greater than zero degrees or lesser than 270 degrees
        if(finalAngleInDegreesSustain >= 0 && finalAngleInDegreesSustain <= 270)
        {
            volumeKnobSustain.style.transform = "rotate(" + finalAngleInDegreesSustain + "deg)"; //use dynamic CSS transform to rotate volume knob
  
            //270 degrees maximum freedom of rotation / 100% volume = 1% of volume difference per 2.7 degrees of rotation
            volumeSettingSustain = Math.round(finalAngleInDegreesSustain * (1 / 270)*100)/100;
  
            tickHighlightPositionSustain = Math.round((volumeSettingSustain * 27/1)); //interpolate how many ticks need to be highlighted
            sustain = volumeSettingSustain;
            createTicksSustain(27, tickHighlightPositionSustain); //highlight ticks
  
            document.getElementById("volumeValue-sustain").innerHTML = volumeSettingSustain; //update volume text
        }
    }
  
    //dynamically create volume knob "ticks"
    function createTicksSustain(numTicks, highlightNumTicks)
    {
        //reset first by deleting all existing ticks
        while(tickContainerSustain.firstChild)
        {
            tickContainerSustain.removeChild(tickContainerSustain.firstChild);
        }
  
        //create ticks
        for(var i=0;i<numTicks;i++)
        {
            var tickSustain = document.createElement("div");
  
            //highlight only the appropriate ticks using dynamic CSS
            if(i < highlightNumTicks)
            {
                tickSustain.className = "tick activetick";
            } else {
                tickSustain.className = "tick";
            }
  
            tickContainerSustain.appendChild(tickSustain);
            tickSustain.style.transform = "rotate(" + startingTickAngleSustain + "deg)";
            startingTickAngleSustain += 10;
        }
  
        startingTickAngleSustain = -135; //reset
    }
  
    //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/
    function detectMobileSustain()
    {
        var result = (navigator.userAgent.match(/(iphone)|(ipod)|(ipad)|(android)|(blackberry)|(windows phone)|(symbian)/i));
  
        if(result !== null)
        {
            return "mobile";
        } else {
            return "desktop";
        }
    }
  
    function getMouseDownSustain()
    {
        if(detectMobileSustain() == "desktop")
        {
            return "mousedown";
        } else {
            return "touchstart";
        }
    }
  
    function getMouseUpSustain()
    {
        if(detectMobileSustain() == "desktop")
        {
            return "mouseup";
        } else {
            return "touchend";
        }
    }
  
    function getMouseMoveSustain()
    {
        if(detectMobileSustain() == "desktop")
        {
            return "mousemove";
        } else {
            return "touchmove";
        }
    }

  // Slider Button

  //detect for mobile devices from https://www.sitepoint.com/navigator-useragent-mobiles-including-ipad/

  mainDuration2();
  mainNumTimes();
  mainThreshold();
  mainAttack();
  mainRelease();
  mainDecay();
  mainSustain();

export { showImage, playButton, pianoButton, acousticButton, edmButton, organButton, manualButton};
