const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

var audio, sourceNode, dataArrayl, dataArrayr, bufferLength, size;

const audioContext = new AudioContext()
const filter = audioContext.createBiquadFilter()
const delay = audioContext.createDelay(1.5)
const feedback = audioContext.createGain()
const delayGain = audioContext.createGain()
const output = audioContext.createGain()
const reverb = audioContext.createConvolver();
const dist = audioContext.createWaveShaper();
const gain = audioContext.createGain();
const analyserl = audioContext.createAnalyser();
const analyserr = audioContext.createAnalyser();
const splitter = audioContext.createChannelSplitter();
const compressor = audioContext.createDynamicsCompressor()
const fps = 120;

function getGuitar() {
    return navigator.mediaDevices.getUserMedia({
      audio: {
        echoCancellation: false,
        autoGainControl: false,
        noiseSuppression: false,
        latency: 0
      }
    })
}
setup();
async function setup() {

	analyserl.smoothingTimeConstant = 0.7;
	analyserr.smoothingTimeConstant = 0.7;

	const guitar = await getGuitar()
    if (audioContext.state === 'suspended') {
      await audioContext.resume()
    }
    const sourceNode = audioContext.createMediaStreamSource(guitar)


	analyserl.fftSize = 4096;
	analyserr.fftSize = 4096;
	bufferLength = analyserl.fftSize;
	dataArrayl = new Float32Array(bufferLength);
	dataArrayr = new Float32Array(bufferLength);


	sourceNode.connect(splitter);
	sourceNode.connect(audioContext.destination);
	splitter.connect(analyserl,0,0);
    splitter.connect(analyserr,1,0);


	draw();
}


function draw() {
	setTimeout(function(){
		requestAnimationFrame(draw);
		analyserl.getFloatTimeDomainData(dataArrayl);
		analyserr.getFloatTimeDomainData(dataArrayr);
	    ctx.fillRect(0, 0, canvas.width, canvas.height);
		ctx.beginPath();
		//ctx.moveTo((dataArrayl[0]+1)*size,-(dataArrayr[0]+1)*size/2+size);
		ctx.moveTo((dataArrayl[0]+1)*canvas.height/2+canvas.width/4,-(dataArrayr[0]+1)*size/2+size);
		ctx.lineWidth = .5;
		ctx.strokeStyle = "#98FFFD";
		ctx.shadowBlur = 50;
		ctx.shadowColor = "white";
		for (var i = 0; i < dataArrayl.length; i++) {
			//ctx.lineTo((dataArrayl[i]+1)*size,-(dataArrayr[i]+1)*size/2+size);
			ctx.lineTo((dataArrayl[i]+1)*canvas.height/2+canvas.width/4,-(dataArrayr[i]+1)*size/2+size);
		}
		ctx.stroke();
	},1000/fps);
}

window.onresize = function(){
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	if(canvas.width > canvas.height) size = canvas.height;
	else size = canvas.width;
}
window.onresize();