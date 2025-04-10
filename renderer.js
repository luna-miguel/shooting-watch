var A_key = "a";
var B_key = "b";
var start_key = "enter";
var select_key = "shift";

var highScore = 0;

var unlock1 = false;
var unlock2 = false;

const A = document.getElementById("A");
const B = document.getElementById("B");
const start = document.getElementById("start");
const select = document.getElementById("select");

var A_key_down, B_key_down, start_key_down, select_key_down;
A_key_down = B_key_down = start_key_down = select_key_down = false;

var A_mouse_down, B_mouse_down, start_mouse_down, select_mouse_down;
A_mouse_down = B_mouse_down = start_mouse_down = select_mouse_down = false;

var last_clicked;

function press(button) { button.style.filter = "brightness(50%)"; pressAction(button); }
function release(button) { button.style.filter = "brightness(100%)"; releaseAction(button); }

A.addEventListener("mousedown", () => { if ( A_key_down === false ) { press(A); A_mouse_down = true; last_clicked = A; } });
B.addEventListener("mousedown", () => { if ( B_key_down === false ) { press(B); B_mouse_down = true; last_clicked = B; } });
start.addEventListener("mousedown", () => {  if ( start_key_down === false ) { press(start); start_mouse_down = true; last_clicked = start; } });
select.addEventListener("mousedown", () => { if ( select_key_down === false ) { press(select); select_mouse_down = true; last_clicked = select; } });

// Button is clicked with mouse, but not released within the button's region
document.addEventListener("mouseup", () => {
    if ( last_clicked === A && A_key_down === false ) { A_mouse_down = false; release(A); }
    if ( last_clicked === B && B_key_down === false ) { B_mouse_down = false; release(B); }
    if ( last_clicked === start && start_key_down === false ) { start_mouse_down = false; release(start); }
    if ( last_clicked === select && select_key_down === false ) { select_mouse_down = false; release(select); }
    last_clicked = null;
});

// Release functions are used above for mouse, as even if the click is released outside of the button's region, it will still register the button release 
// Just restore opacity, do not trigger release function because it will register twice if the button is clicked correctly
A.addEventListener("mouseup", () => { A_mouse_down = false; if ( A_key_down === false ) { A.style.filter = "brightness(100%)"; } });
B.addEventListener("mouseup", () => { B_mouse_down = false; if ( B_key_down === false ) { B.style.filter = "brightness(100%)"; } });
start.addEventListener("mouseup", () => { start_mouse_down = false; if ( start_key_down === false ) { start.style.filter = "brightness(100%)"; } });
select.addEventListener("mouseup", () => { select_mouse_down = false; if ( select_key_down === false ) { select.style.filter = "brightness(100%)"; } });


document.addEventListener('keydown', function(event) {
    if (event.key.toLowerCase() === A_key) { if ( A_mouse_down === false ) { press(A); A_key_down = true; } }
    if (event.key.toLowerCase() === B_key) { if ( B_mouse_down === false ) { press(B); B_key_down = true; } }
    if (event.key.toLowerCase() === start_key) { if ( start_mouse_down === false ) { press(start); start_key_down = true; } }
    if (event.key.toLowerCase() === select_key) { if ( select_mouse_down === false ) { press(select); select_key_down = true; } }
});

document.addEventListener('keyup', function(event) {
    if (event.key.toLowerCase() === A_key) { A_key_down = false; if ( A_mouse_down === false ) { release(A); } }
    if (event.key.toLowerCase() === B_key) { B_key_down = false; if ( B_mouse_down === false ) { release(B); } }
    if (event.key.toLowerCase() === start_key) { start_key_down = false; if ( start_mouse_down === false ) { release(start); } }
    if (event.key.toLowerCase() === select_key) { select_key_down = false; if ( select_mouse_down === false ) { release(select); } }
});

// Prevent button from constantly performing action when held down
var held = false;

function pressAction(button) {

    if(button === select && isShooting === false && held === false) { changeMode(); held = true; }

    // Shooting counter
    if(mode === 0) {
        if(button === start && held === false && ready === false && isShooting === false) { resetShootingCount(); readyShootingCount(); }
        if(button === A && held === false && ready === true && isShooting === false) { held = true; beginShooting(); updateShooting(); }
        else if(button === A && held === false && isShooting === true) { held = true; updateShooting(); }
        if(button === B && held === false && ready === true && isShooting === false) { held = true; beginShooting(); updateShooting(); }
        else if(button === B && held === false && isShooting === true) { held = true; updateShooting(); }
    }

    // Stopwatch
    if(mode === 2) {
        if(button === A && freeze === true) { freeze = false; show(cursor); }
        else if(button === A && timer === true) { stopStopWatch(); paused = true; }
        if (button === B && timer === true && freeze === false) { freeze = true; blinkIn(cursor); }
        if (button === B && freeze === true && held === false) { updateStopWatch(); held = true; }
    }

    // Dice and slots
    if(mode === 3) {
        if(button === start && held === false && rolling === false) { held = true; setupRoll(); roll(); }
        if(button === A && held === false && rolling === true) { held = true; stopRoll(); }
        if(button === B && held === false && rolling === true) { held = true; stopRoll(); }
    }
    if(mode === 4) {
        if(button === start && held === false && rolling === false) { held = true; setupRoll(); roll(); }
        if(button === A && held === false && rolling === true) { held = true; stopRoll(); }
        if(button === B && held === false && rolling === true) { held = true; stopRoll(); }
    }

}

function releaseAction(button) {

    if (button === select && held === true) { held = false; }

    // Shooting counter 
    if(mode === 0) {
        if (button === A && held === true) { held = false; }
        if (button === B && held === true) { held = false; }
    }

    // Stopwatch
    if(mode === 2) {
        if(button === A && timer === false && paused === false) { startStopWatch(); }
        else if(button === A && paused === true) { stopStopWatch(); paused = false; }
        if(button === B && timer === false) { resetStopWatch(); }
        else if(button === B) { held = false; }
    }

    // Dice and slots
    if(mode === 3) {
        if(button === start && held === true) { held = false; }
        if(button === A && held === true) { held = false; }
        if(button === B && held === true) { held = false; }
    }
    if(mode === 4) {
        if(button === start && held === true) { held = false; }
        if(button === A && held === true) { held = false; }
        if(button === B && held === true) { held = false; }
    }

}

document.body.onload = function () { changeDisplay(); };

const secret1 = 62;     // Shooting count must be exactly 62 to unlock secret mode 1
const secret2 = 160;    // Shooting count must be greater than 160 to unlock secret mode 2

const startingTime = 10; 

var mode = 0;

const colon = document.getElementById("colon");
const cursor = document.getElementById("cursor");

const big_0 = document.getElementById('big_0');
const big_1 = document.getElementById('big_1');
const big_2 = document.getElementById('big_2');
const big_3 = document.getElementById('big_3');
const small_0 = document.getElementById('small_0');
const small_1 = document.getElementById('small_1');

function hide(element) { element.style.visibility = "hidden"; }
function show(element) { element.style.visibility = "visible"; }

function setText(element, text) { element.innerText = text; }

function changeMode() { // Adjust cursor
    mode += 1;     
    if (mode === 3 && unlock1 === false) { mode += 1; }  
    if (mode === 4 && unlock2 === false) { mode += 1; } 
    if (mode > 4) { mode = 0; }
    cursor.style.transform = `translate(${-297 + (mode * 43)}px, 0)`;   
    changeDisplay();
}

function resetVisibility () {
    show(colon);
    show(big_0); show(big_1); show(big_2); show(big_3);
    show(small_0); show(small_1);
}

function refresh() {

    resetVisibility();
    resetStopWatch();
    resetRoll();

    isShooting = false;
    freeze = false;
    rolling = false;

    show(cursor);
}

function changeDisplay () { // Update display depending on mode
    refresh();
    if (mode === 0) { resetShootingCount(); }
    if (mode === 1) { startTime(); }
    if (mode === 2) { resetStopWatch(); }
    if (mode === 3) { setDice(); }
    if (mode === 4) { setSlots(); }
}

var currentCount = 0;
var timeLeft = startingTime;
var ready = false;
var isShooting = false;


function resetShootingCount () {

    hide(colon);
    hide(big_0); hide(big_1); hide(big_2);
    hide(small_0); hide(small_1);

    currentCount = 0;
    timeLeft = startingTime;
    ready = isShooting = false;

    if(highScore >= 1000) {
        show(big_0);
        setText(big_0, Math.floor(highScore / 1000));
    }
    if(highScore >= 100) {
        show(big_1);
        setText(big_1, Math.floor((highScore / 100) % 10));
    }
    if(highScore >= 10) {
        show(big_2);
        setText(big_2, Math.floor((highScore / 10) % 10));
    }
    show(big_3);
    setText(big_3, Math.floor(highScore % 10));
}

function readyShootingCount () { // User presses start

    freeze = false;
    show(small_0);
    setText(small_0, Math.floor(timeLeft / 10));
    show(small_1);
    setText(small_1, (timeLeft % 10));

    currentCount = 0;
    ready = true;

}

function beginShooting () { // User begins shooting after pressing start
    hide(big_0); hide(big_1); hide(big_2);
    isShooting = true;
    shotTimer();
}

function shotTimer () {
    if(timeLeft !== 0 && isShooting) { // Begin countdown

        if(timeLeft < 10) { hide(small_0); }

        setText(small_1, timeLeft % 10);
        setTimeout(shotTimer, 1000);
        timeLeft -= 1;

    }
    else {
        // Time is up; stop timer and shot counting
        setText(small_1, 0);
        isShooting = ready = false;

        // Check results
        if(currentCount > highScore) { 
            freeze = true;
            if(currentCount >= 1000) { blinkIn(big_0); }
            if(currentCount >= 100) { blinkIn(big_1); }
            if(currentCount >= 10) { blinkIn(big_2); }
            blinkIn(big_3);
            highScore = currentCount; 
            localStorage.setItem('high_score', currentCount); 
        }

        if(currentCount === secret1) { unlock1 = true; }
        if(currentCount > secret2) { unlock2 = true; }
    }
}

function updateShooting () { // Update shot count
    if(isShooting) {
        currentCount += 1;
        if(currentCount >= 1000) {
            show(big_0);
            setText(big_0, Math.floor(currentCount / 1000));
        }
        if(currentCount >= 100) {
            show(big_1);
            setText(big_1, Math.floor((currentCount / 100) % 10));
        }
        if(currentCount >= 10) {
            show(big_2);
            setText(big_2, Math.floor((currentCount / 10) % 10));
        }
        setText(big_3, currentCount % 10);
    }
}

function startTime() { // Set clock
    if(mode === 1) {
        const today = new Date();
        let h = today.getHours();
        let m = today.getMinutes();
        let s = today.getSeconds();
        setText(big_0, Math.floor(h / 10)); setText(big_1, h % 10);
        setText(big_2, Math.floor(m / 10)); setText(big_3, m % 10);
        setText(small_0, Math.floor(s / 10)); setText(small_1, s % 10);
        setTimeout(startTime, 0);
    }
} 

var timer, freeze, paused;
timer = freeze = paused = false;

var m, s, ms;
m = s = ms = 0;

function startStopWatch () { timer = true; countStopWatch(); }

function resetStopWatch () {
    timer = freeze = paused = false;
    m = s = ms = 0;
    setText(big_0, 0); setText(big_1, 0); setText(big_2, 0); setText(big_3, 0);
    setText(small_0, 0); setText(small_1, 0);
}

function stopStopWatch () { timer = false; }

function updateStopWatch () {
    setText(big_0, Math.floor(m / 10)); setText(big_1, m % 10);
    setText(big_2, Math.floor(s / 10)); setText(big_3, s % 10);
    setText(small_0, Math.floor(ms / 10)); setText(small_1, ms % 10);
}

function countStopWatch () {
    if (timer) {
        ms++;
        if (ms == 100)  { s++; ms = 0; }
        if (s == 60)    { m++; s = 0; }
        if (m == 60)    { m = 0; s = 0; }
        if(freeze === false) { updateStopWatch(m, s, ms); }
        setTimeout(countStopWatch, 10);
    }
}

function blinkIn(element) {
    if(freeze === true) {
        element.style.visibility = "visible";
        setTimeout(blinkOut, 300, element);
    }
}
function blinkOut(element) {
    if(freeze === true) {
        element.style.visibility = "hidden";
        setTimeout(blinkIn, 700, element);
    }
}

var num = 1;
var rolling, rolling_0, rolling_1, rolling_2, rolling_3;
rolling = rolling_0 = rolling_1 = rolling_2 = rolling_3 = false;

function setDice () {
    hide(colon);
    hide(big_0); hide(small_0); hide(small_1);

    setText(big_0, 0); setText(big_1, 0); setText(big_2, 0);
}

function setSlots () {
    hide(colon);
    hide(small_0); hide(small_1);

    setText(big_0, 0); setText(big_1, 0); setText(big_2, 0); setText(big_3, 0);
}

function setupRoll() { if(mode === 4) { rolling_0 = true; } rolling = rolling_1 = rolling_2 = rolling_3 = true; }
function resetRoll() { rolling = rolling_0 = rolling_1 = rolling_2 = rolling_3 = false; }

function roll() {
    if(rolling) {
        num++;
        if(mode === 3 && num === 7) { num = 1; }
        else if(mode === 4 && num === 10) { num = 0; }

        if(mode === 4) { if(rolling_0) { setText(big_0, num); } }
        if(rolling_1) { setText(big_1, num); }
        if(rolling_2) { setText(big_2, num); }
        if(rolling_3) { setText(big_3, num); }

        setTimeout(roll, 10);
    }
}

function stopRoll() {
    if(rolling_0) { rolling_0 = false; }
    else if(rolling_1) { rolling_1 = false; }
    else if(rolling_2) { rolling_2 = false; }
    else if(rolling_3) { rolling_3 = false; rolling = false; }
}