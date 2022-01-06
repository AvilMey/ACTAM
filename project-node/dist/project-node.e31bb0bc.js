// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.js":[function(require,module,exports) {
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

//import { generateImg, image2OneChannel,playOscillators, selectColumn} from "./functions";
var c = new AudioContext();
var attack = 0.001;
var release = 0.005;
var duration = (attack + release) * 1000;
var W;
var H;
var imageData;
var data2Play;
var A;
var B;
var C;
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
var canv = document.getElementById("bar");
var context = canv.getContext("2d"); // var idata = ctx.createImageData(width, height);
// buffer = generateImg(width, height);
// idata.data.set(buffer);
// ctx.putImageData(idata, 0, 0);
//var data = image2OneChannel(idata.data, height, width);
//document.getElementById('hihi').addEventListener('click',function () { playImage(reduceImage(horizontalDerivative(medianFilter(data2Play)),12,20)); });

document.getElementById('hihi').addEventListener('click', function () {
  playImage(normalizeImage(horizontalDerivative(medianFilter(data2Play)), 12, 700));
});

document.getElementById('myFile').onchange = function (evt) {
  var tgt = evt.target || window.event.srcElement,
      files = tgt.files; // FileReader support

  if (FileReader && files && files.length) {
    var fr = new FileReader();

    fr.onload = function () {
      return showImage(fr);
    };

    fr.readAsDataURL(files[0]);
  }
};

function drawLine(x) {
  context.beginPath();
  context.clearRect(0, 0, canv.width, canv.height);
  context.moveTo(x, 0);
  context.lineTo(x, canv.height);
  context.stroke();
} //AUDIO FUNCTIONS


function playImage(data) {
  //console.log(data[0].length);
  for (var j = 0; j < data[0].length; j++) {
    amps = selectColumn(data, j);
    setTimeout(playOscillators, duration * j, amps);
    setTimeout(drawLine, duration * j, (j + 1 / 2) * W / 20);
  }
}

function playOscillators(amps) {
  console.log(amps.length);

  for (i = 0; i < amps.length; i++) {
    f = 440 * Math.pow(2, i / 12);
    var o = c.createOscillator();
    var g = c.createGain();
    o.frequency.value = f;
    o.connect(g);
    g.connect(c.destination);
    now = c.currentTime;
    g.gain.setValueAtTime(0, now);
    console.log(amps[i]);
    g.gain.linearRampToValueAtTime(amps[i], now + attack);
    g.gain.linearRampToValueAtTime(0, now + attack + release);
    o.start(now);
    o.stop(now + attack + release);
  }
} // IMAGE PROCESSING


function image2OneChannel(imgData, height, width) {
  var data = [];

  for (var i = 0; i < height; i++) {
    data[i] = new Array(width);
  }

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pos = (y * width + x) * 4;
      data[y][x] = Math.floor((imgData[pos] + imgData[pos + 1] + imgData[pos + 2]) / 3);
    }
  }

  return data;
}

function horizontalDerivative(matrix) {
  y_len = matrix.length;
  x_len = matrix[0].length;
  var data = [];

  for (var i = 0; i < y_len - 2; i++) {
    data[i] = new Array(x_len - 2);
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


  var sbl_knl = [-1, -1, 1, 1]; //console.log(y_len);

  for (var j = 1; j < y_len - 1; j++) {
    for (var i = 1; i < x_len - 1; i++) {
      data[j - 1][i - 1] = Math.abs(matrix[j - 1][i - 1] * sbl_knl[0] + matrix[j][i - 1] * sbl_knl[1] + matrix[j - 1][i] * sbl_knl[2] + matrix[j][i] * sbl_knl[3]);
    }
  }

  return data;
}

function medianFilter(matrix) {
  y_len = matrix.length;
  x_len = matrix[0].length;
  var data = [];

  for (var i = 0; i < y_len; i++) {
    data[i] = new Array(x_len);
  }

  var knl = []; //console.log(y_len);
  //aca lleno los bordes de la imagen de salida con los bordes de la imagen de entrada

  for (var j = 0; j < y_len - 1; j++) {
    data[j][0] = matrix[j][0];
    data[j][x_len - 1] = matrix[j][x_len - 1];
  }

  for (var i = 1; i < x_len - 2; i++) {
    data[0][i] = matrix[0][i];
    data[y_len - 1][i] = matrix[y_len - 1][i];
  } // aca aplico el filtro de mediana


  for (var j = 1; j < y_len - 1; j++) {
    for (var i = 1; i < x_len - 1; i++) {
      knl = [matrix[j - 1][i - 1], matrix[j][i - 1], matrix[j + 1][i - 1], matrix[j - 1][i], matrix[j][i], matrix[j + 1][i], matrix[j - 1][i + 1], matrix[j][i + 1], matrix[j + 1][i + 1]];
      data[j - 1][i - 1] = median(knl);
    }
  }

  return data;
}

function normalizeImage(matrix, freqBins, timeStp) {
  y_len = matrix.length;
  x_len = matrix[0].length;
  new_y = Math.floor(y_len / freqBins);
  new_x = Math.floor(x_len / timeStp);
  Q = 0;
  var data = [];

  for (var i = 0; i < freqBins; i++) {
    data[i] = new Array(timeStp).fill(0);
  } //data = data / Math.max(data);
  //console.log(y_len);
  // tengo que definir indices para caminar por imagen


  for (var k = 0; k < freqBins; k++) {
    for (var m = 0; m < timeStp; m++) {
      for (var j = 0; j < new_y; j++) {
        for (var i = 0; i < new_x; i++) {
          data[k][m] += matrix[k * new_y + j][m * new_x + i] / (new_x * new_y);
        }
      }

      if (data[k][m] > Q) {
        Q = data[k][m];
        console.log(Q);
      }
    }
  }

  for (var k = 0; k < freqBins; k++) {
    for (var m = 0; m < timeStp; m++) {
      data[k][m] /= Q;
    }
  }

  return data;
}

function selectColumn(array, number) {
  var col = array.map(function (value, index) {
    return value[number];
  });
  return col;
}

function generateImg(width, height) {
  var buffer = new Uint8ClampedArray(width * height * 4);

  for (var y = 0; y < height; y++) {
    for (var x = 0; x < width; x++) {
      var pos = (y * width + x) * 4;
      buffer[pos] = Math.floor(Math.random() * 256);
      buffer[pos + 1] = Math.floor(Math.random() * 256);
      buffer[pos + 2] = Math.floor(Math.random() * 256);
      buffer[pos + 3] = 255;
    }
  }

  return buffer;
} // IMAGE HANDLING 
//get image from user and plot


function showImage(fileReader) {
  var img = document.getElementById("myImage");

  img.onload = function () {
    return getImageData(img);
  };

  img.src = fileReader.result;
}

function getImageData(img) {
  W = img.width;
  H = img.height;
  var aux = [];
  canvas.width = W;
  canvas.height = H;
  canv.height = 50;
  canv.width = W;
  canv.style.left = img.x;
  canv.style.top = img.y + img.height;
  canv.style.position = "absolute";
  ctx.drawImage(img, 0, 0);
  imageData = ctx.getImageData(0, 0, W, H).data;
  data2Play = image2OneChannel(imageData, H, W); //data2Play =  image2OneChannel(imageData, H, W );
  //console.log("image data:", imageData);
  //getRGB(imageData);
}

function reduceImage(matrix, freq, time) {
  y_len = matrix.length;
  x_len = matrix[0].length; //console.log(y_len);

  A = new Array(freq).fill(0);
  temp = new Array(y_len);

  for (var i = 0; i < A.length; i++) {
    A[i] = new Array(time).fill(0);
  }

  for (var i = 0; i < temp.length; i++) {
    temp[i] = new Array(time).fill(0);
  }

  for (var j = 0; j < y_len; j++) {
    for (var i = 0; i < time; i++) {
      avg_row = matrix[j].slice(i * Math.floor(x_len / time), (i + 1) * Math.floor(x_len / time)).reduce(function (a, b) {
        return a + b;
      }, 0) / Math.floor(x_len / time);
      temp[j][i] = avg_row;
    } //console.log(j);

  }

  for (var i = 0; i < time; i++) {
    for (var j = 0; j < freq; j++) {
      avg_col = selectColumn(temp, i).slice(j * Math.floor(y_len / freq), (j + 1) * Math.floor(y_len / freq)).reduce(function (a, b) {
        return a + b;
      }, 0) / Math.floor(y_len / freq);
      A[j][i] = avg_col;
    }
  }

  return A;
} //Este funcion de mediana la saque de https://www.w3resource.com/javascript-exercises/fundamental/javascript-fundamental-exercise-88.php


var median = function median(arr) {
  var mid = Math.floor(arr.length / 2),
      nums = _toConsumableArray(arr).sort(function (a, b) {
    return a - b;
  });

  return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2;
}; // function getRGB(imgData) {
//     for (var i=0;i<imgData.length;i+=4) {
//         R[i/4] = imgData[i];
//         G[i/4] = imgData[i+1];
//         B[i/4] = imgData[i+2];
//     }
// }
},{}],"../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "65279" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../../../../opt/homebrew/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/project-node.e31bb0bc.js.map