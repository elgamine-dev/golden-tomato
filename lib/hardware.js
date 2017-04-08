var five = require("johnny-five");
var board = new five.Board();
var segments;
let btns;
let leds;
var isReady = false


/**
 * Mapping pin number to screen segment
 *   _2_
 * 8|_9_|3
 * 6|_5_|4
 *  
 */
var pins = {
    segments : [
          2,
        8,9,3,
        6,5,4
    ],
    buttons: ["A0", "A1"],
    leds: [10/* green */, 11 /* red */]
};

var numbers = [
    '1101111', //0
    '0001001', //1
    '1011110', //2
    '1011011', //3
    '0111001', //4
    '1110011', //5
    '1110111', //6
    '1001001', //7
    '1111111', //8
    '1111011', //9
    '0000000', //empty
];

var chars = {
    p : '1111100',
    l : '0100110',
    s : '1110011'
}

var percent = {
    "100": '1101111',
    "84" : '1100111',
    "68" : '1100110',
    "52" : '1100100',
    "34" : '1100000',
    "18" : '1000000',
    "5"  : '0000000'
}

board.on("ready", function() {
    segments = new five.Leds(pins.segments)
    leds = new five.Leds(pins.leds)
    btns = new five.Buttons(pins.buttons)
    isReady = true

    leds.off()
    digit(0)


    leds.on()
});


function letter(id){
    // if(!chars[id]) {
    //     return;
    // }
    clear()
    set(chars[id])
}

function digit(no){
    if(no>10) {
        return;
    }
    clear();
    set(numbers[no])
}

function percentage(no) {
    if(no > 84) {
        return set(percent["100"])
    }
    
    if(no > 62) {
        return set(percent["68"])
    }
    
    if(no > 44) {
        return set(percent["52"])
    }
    
    if(no > 32) {
        return set(percent["34"])
    }
    
    if(no > 16) {
        return set(percent["18"])
    }
    
    return set(percent["5"])
}

function set(what) {
    console.log(what)
    clear()
    let parts = what.split('')
    for(let i=0; i<7; i++) {
        if(parts[i] === '1' ){
            segments[i].on()
        }
    }
}

function clear(){
    segments.off()
}

function onReady(cb){
    if (isReady) {
        return cb();
    }
    let val = setInterval(()=>{
        if(isReady){
            clearInterval(val)
            cb()
        }
    },100)
}

function onPressed(id, cb) {
    btns[id].on("press", cb)
}

function led(id) {
    return id !== undefined && leds[id] || leds
}


module.exports = {
    digit,
    letter,
    onReady,
    onPressed,
    percentage,
    led
}