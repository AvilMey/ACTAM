const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");

    myForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const input = csvFile.files[0];
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        document.write(text);
      };

      reader.readAsText(input);

      reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        loops(data);
        document.write(JSON.stringify(data));
    };
    });

function csvToArray(str, delimiter = ",") {
    const headers = str.slice(0, str.indexOf("\n")).split(delimiter);
    const rows = str.slice(str.indexOf("\n") + 1).split("\n");
    console.log(rows)

    for (let i = 0; i < rows.length; i++) {
        rows[i] = rows[i].split(delimiter);   
    }
    console.log(rows)
    
    var rearrangedArray=[];
    for (let i = 0; i < rows[0].length; i++) {
        for (let j = 0; j < rows.length; j++) {
            console.log(rows[j][i])
            rearrangedArray.push(rows[j][i])
        }
    }
    console.log(rearrangedArray)

    var size = rows.length; 
    var arrayOfArrays = [];

    for (var i=0; i<rearrangedArray.length; i+=size) {
        arrayOfArrays.push(rearrangedArray.slice(i,i+size));
    }

    array1=arrayOfArrays.slice(0,size);
    array2=rearrangedArray.slice(size,size*2);
    array3=rearrangedArray.slice(size*2,size*3);
    array4=rearrangedArray.slice(size*3,size*4);

    console.log(arrayOfArrays);
    console.log(array1)
    console.log(array2)
    console.log(array3)
    console.log(array4)

    return arrayOfArrays;
}

randomArray=[[1,2,3,4],[6,7,8,9],[10,1,12,13,],[15,16,17,18]]
const c = new AudioContext()

var attack = .3;
var decay = .3;
var release=.3;

var gains = {};

  function playMonth(amp){
    const o = c.createOscillator();
    o.frequency.value = Math.pow(2,1/12)*440;
    var gain = c.createGain();
    gain.connect(c.destination);
    o.connect(gain);
    const now = c.currentTime;
    gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(amp/(12*4), now+attack);
    gain.gain.linearRampToValueAtTime(amp/(12*4*2),now+decay+attack);
    gain.gain.linearRampToValueAtTime(0,now+decay+attack+release);
    o.start()
    o.stop(now+attack+decay+release);
  }

  function playAvgTemp(amp){
    const o = c.createOscillator();
    o.frequency.value = Math.pow(2,5/12)*440;
    var gain = c.createGain();
    gain.connect(c.destination);
    o.connect(gain);
    const now = c.currentTime;
    gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(amp/(24*4), now+attack);
    gain.gain.linearRampToValueAtTime(amp/(24*4*2),now+decay+attack);
    gain.gain.linearRampToValueAtTime(0,now+decay+attack+release);
    o.start()
    o.stop(now+attack+decay+release);
  }

  function playPrecipitation(amp){
    const o = c.createOscillator();
    o.frequency.value = Math.pow(2,9/12)*440;
    var gain = c.createGain();
    gain.connect(c.destination);
    o.connect(gain);
    const now = c.currentTime;
    gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(amp/(150*4), now+attack);
    gain.gain.linearRampToValueAtTime(amp/(150*4*2),now+decay+attack);
    gain.gain.linearRampToValueAtTime(0,now+decay+attack+release);
    o.start()
    o.stop(now+attack+decay+release);
  }

  function playHumidity(amp){
    const o = c.createOscillator();
    o.frequency.value = Math.pow(2,9/12)*440;
    var gain = c.createGain();
    gain.connect(c.destination);
    o.connect(gain);
    const now = c.currentTime;
    gain.gain.setValueAtTime(0,now);
    gain.gain.linearRampToValueAtTime(amp/(81*4), now+attack);
    gain.gain.linearRampToValueAtTime(amp/(81*4*2),now+decay+attack);
    gain.gain.linearRampToValueAtTime(0,now+decay+attack+release);
    o.start()
    o.stop(now+attack+decay+release);
  }

var funcs=[playMonth,playAvgTemp,playPrecipitation,playHumidity]

/* for (let i = 0; i < arrayOfArrays.length; i++) {
    for (let j = 0; j < arrayOfArrays[0].length; j++) {
        let func = functions[j]
        let val = all[i][j]
        func[val]
    }
} */

async function loops(fileData) {
    for (let i = 0; i < fileData.length; i++) {
      await wait(1000)
      for (let j = 0; j < fileData[i].length; j++) {
        let func = funcs[j]
        let val = fileData[i][j]
        console.log(func)
        console.log(val)
        func(val)
        await wait(400)
      }
    }
  }
  
  function wait(ms) {
    return new Promise(r => setTimeout(r, ms));
  }
//https://en.climate-data.org/europe/italy/lombardy/milan-1094/