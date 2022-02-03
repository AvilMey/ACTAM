var c = new AudioContext();

var attack = 0.01;
var release = 0.2;
var baseNote = 440;

function play(n) {
  const o = c.createOscillator();
  const g = c.createGain();
  o.frequency.value = baseNote*Math.pow(2,n/12);
  o.connect(g);
  g.connect(c.destination);
  const now = c.currentTime;
  g.gain.setValueAtTime(0, now);
  g.gain.linearRampToValueAtTime(1, now+attack);
  g.gain.linearRampToValueAtTime(0, now+attack+release);
  o.start();
  o.stop(now+attack+release);
}

keys = "asdfghjkl"

//notes = [1,3,5,1,1,3,5,1,5,6,8,5,6,8];
notes_index = 0;
tempo = 200;
notes = [0,0,0,0,0,0,0,0,0];

function playNotes() {
  noteToBePlayed = notes.indexOf(1,notes_index);
  notes_index = noteToBePlayed + 1;
  if (noteToBePlayed >= 0) 
    play(noteToBePlayed)
  else {
    noteToBePlayed = notes.indexOf(1,notes_index);
    if (noteToBePlayed >=0) {
      play(noteToBePlayed);
      notes_index = noteToBePlayed + 1;
    }
  } 

  setTimeout(playNotes, tempo)
}

playNotes()

document.onkeydown = function(e) {
  notes[keys.indexOf(e.key)] = 1;
}

document.onkeyup = function(e) {
  notes[keys.indexOf(e.key)] = 0;
}


