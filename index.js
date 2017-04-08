let hw = require('./lib/hardware')
let express = require('express')

let config = require('./config')

let app = express()
const  port = process.env.PORT || 3000 


app.get('/', (req, res)=>{
    // console.log(req.params)
    // hw.digit(parseInt(req.params.no))
    res.send('work sessions : ' + workCount)
})

const START_BTN = 0
const RESET_BTN = 1
const WORK_LED = 0
const BREAK_LED = 1

const WORK_STATE = 0
const SHORT_BREAK_STATE = 1
const LONG_BREAK_STATE = 2

let currentState = WORK_STATE;
let workCount = 0
let isActive

hw.onReady(()=>{

    let si;
    

    hw.onPressed(START_BTN, ()=>{
        if (isActive) {
            return false
        }

        countdown(currentState, 
        ()=>{
            isActive = true
        },
        ()=>{
            if(currentState === WORK_STATE) {
                workCount++
            }

            setTimeout(()=>{

                if (currentState === LONG_BREAK_STATE || currentState === SHORT_BREAK_STATE) {
                    currentState = WORK_STATE
                } else if(workCount % config.work_sessions_count_before_long_break === 0) {
                    currentState = LONG_BREAK_STATE
                } else {
                    currentState = SHORT_BREAK_STATE
                }
                hw.letter(stateLetter())
            },500)

            isActive = false
        })
        

        
    })

    hw.onPressed(RESET_BTN, ()=>{
        hw.letter('p')
    })

    app.listen(port)    
})


function countdown(state, onStart, onFinished) {
    onStart()
    let led = ( state === 1 || state === 2) && BREAK_LED || WORK_LED   
    let startAt = 9
    console.log("state :",state, "led : ", led, "w_count:", workCount)


    hw.led().stop().off()

    let count = startAt
    hw.digit(startAt)
    hw.led(led).on()
    hw.led(led).brightness(255)


    si = setInterval(()=>{
        count--
        minutes = count //obviously wrong, just for intital testing
        hw.led(led).brightness(ratio(startAt, count))
        if(count===0) {
            clearInterval(si)
            hw.led(led).blink(1500)
            onFinished()
        }
        // if(minutes < 10) {
        //     hw.digit(minutes)
        // } else {
            hw.percentage((count / startAt) * 100)
        // }
    },500)
}


function stateLetter(){
    return (workCount % config.work_sessions_count_before_long_break === 0) && 'l' || 's' 
}

function ratio(max, curr){
    return parseInt( (curr / max ) * 255, 10)
}