var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var exec = require('child_process').exec, child;
var port = process.env.PORT || 3000;
var srvpos = 0;
//var ads1x15 = require('node-ads1x15');
//var adc = new ads1x15(1); // set to 0 for ads1015

var Gpio = require('pigpio').Gpio,
  A1 = new Gpio(16, {mode: Gpio.OUTPUT}),
  A2 = new Gpio(20, {mode: Gpio.OUTPUT}),
  AEn = new Gpio(13, {mode: Gpio.OUTPUT}),

  B1 = new Gpio(26, {mode: Gpio.OUTPUT}),
  B2 = new Gpio(21, {mode: Gpio.OUTPUT}),
  BEn = new Gpio(19, {mode: Gpio.OUTPUT}),

  LEDR = new Gpio(22, {mode: Gpio.OUTPUT}),
  LEDG = new Gpio(27, {mode: Gpio.OUTPUT}),
  LEDB = new Gpio(17, {mode: Gpio.OUTPUT}),

  SrvCam = new Gpio(12, {mode: Gpio.OUTPUT});

app.get('/', function(req, res){
  res.sendfile('Touch.html');
  console.log('HTML sent to client');
});

LEDR.digitalWrite(1);
LEDG.digitalWrite(1);
LEDB.digitalWrite(1);

child = exec("sudo bash start_stream.sh", function(error, stdout, stderr){});

//Whenever someone connects this gets executed
io.on('connection', function(socket){
  console.log('A user connected');
  
  socket.on('pos', function (msx, msy) {
    //console.log('X:' + msx + ' Y: ' + msy);
    //io.emit('posBack', msx, msy);
	
    msx = Math.min(Math.max(parseInt(msx), -255), 255);
    msy = Math.min(Math.max(parseInt(msy), -255), 255);

    if(msx > 0){
      A1.digitalWrite(1);
      A2.digitalWrite(0);
      AEn.pwmWrite(msx);
    } else {
      A1.digitalWrite(0);
      A2.digitalWrite(1);
      AEn.pwmWrite(Math.abs(msx));
    }

    if(msy > 0){
      B1.digitalWrite(1);
      B2.digitalWrite(0);
      BEn.pwmWrite(msy);
    } else {
      B1.digitalWrite(0);
      B2.digitalWrite(1);
      BEn.pwmWrite(Math.abs(msy));
    }

  });
  
  socket.on('light', function(toggle) {
  //  LED.digitalWrite(toggle);    
  
    LEDR.pwmWrite(100);
    LEDG.pwmWrite(255-213);
    LEDB.pwmWrite(255);
  //  SrvCam.pwmWrite(255);

    if (srvpos == 0){
      SrvCam.servoWrite(1000);
      srvpos += 1;
    }
    else if (srvpos == 1){
      SrvCam.servoWrite(1100);
      srvpos += 1;
    }
    else if (srvpos == 2){
      SrvCam.servoWrite(1200);
      srvpos += 1;
    }
    else if (srvpos == 3){
      SrvCam.servoWrite(1300);
      srvpos += 1;
    }
    else if (srvpos == 4){
      SrvCam.servoWrite(1400);
      srvpos += 1;
    }
    else if (srvpos == 5){
      SrvCam.servoWrite(1500);
      srvpos += 1;
    }
    else {
      SrvCam.servoWrite(1600);
      srvpos = 0;
    }
  
  });  
  
  socket.on('cam', function(toggle) {
    var numPics = 0;
    console.log('Taking a picture..');
    //Count jpg files in directory to prevent overwriting
    child = exec("find -type f -name '*.jpg' | wc -l", function(error, stdout, stderr){
      numPics = parseInt(stdout)+1;
      // Turn off streamer, take photo, restart streamer
      var command = 'sudo killall mjpg_streamer ; raspistill -o cam' + numPics + '.jpg -n && sudo bash start_stream.sh';
        //console.log("command: ", command);
        child = exec(command, function(error, stdout, stderr){
        io.emit('cam', 1);
      });
    });
    
  });
  
  socket.on('power', function(toggle) {
    child = exec("sudo poweroff");
  });
  
  //Whenever someone disconnects this piece of code is executed
  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });

  /*
  setInterval(function(){ // send temperature every 5 sec
    child = exec("cat /sys/class/thermal/thermal_zone0/temp", function(error, stdout, stderr){
      if(error !== null){
         console.log('exec error: ' + error);
      } else {
         var temp = parseFloat(stdout)/1000;
         io.emit('temp', temp);
         console.log('temp', temp);
      }
    });
    if(!adc.busy){
      adc.readADCSingleEnded(0, '4096', '250', function(err, data){ //channel, gain, samples
        if(!err){          
          voltage = 2*parseFloat(data)/1000;
          console.log("ADC: ", voltage);
          io.emit('volt', voltage);
        }
      });
    }
  }, 5000);
  */

});


http.listen(port, function(){
  console.log('listening on *:' + port);
});
