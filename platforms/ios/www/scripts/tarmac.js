
var tarmac = (function () {
    "use strict";
    function SeqObj(sec, type, alert) {
        this.sec = sec;
        this.type = type;
        this.alert = alert;
    }
    var tarmac = {
        divTimer: null,
        divAlerts: null,
        btnReset: null,
        btnPauseResume: null,
        btnDomestic: null,
        btnInternational: null,
        msStart: 0,
        msPaused: 0,
        msPausedStart: 0,
        //dateStarted: null,
        //datePaused:null,
        paused: true,
        timer: null,
        data: [],
        endTime: 0,
        routeType: '',
    };
    tarmac.init = function () {
        tarmac.btnDom = document.getElementById('btn1');
        tarmac.btnInt = document.getElementById('btn2');
        tarmac.btnStart = document.getElementById('btn3');
        tarmac.btnReset = document.getElementById('btn4');
        tarmac.divTimer = document.getElementById('timer');
        tarmac.divAlerts = document.getElementById('alerts');
        tarmac.btnReset.disabled = true;
        tarmac.btnStart.disabled = true;
        tarmac.btnReset.addEventListener("click", resetTimer);
        tarmac.btnStart.addEventListener("click", startTimer);
        tarmac.btnDom.addEventListener("click", routeClick);
        tarmac.btnInt.addEventListener("click", routeClick);
        localStorage.setItem('tarmac', JSON.stringify(tarmac));





        
    };
    tarmac.pause = function () {
        localStorage.setItem('tarmac', JSON.stringify(tarmac));
    };
    tarmac.resume = function () {
        var data = JSON.parse(localStorage.getItem('tarmac'));
        for (var key in Object.keys(data)) {
            if (tarmac.hasOwnProperty(key)) {
                tarmac[key] = data[key];
            }
        }
        if (!tarmac.paused) {
            tarmac.timer = window.setInterval(tick, 1000);
        }
    };
    tarmac.data = getdata();
    function getdata() {
        var data = [];
        data.push(new SeqObj(3, "", "Delay announcement"));
        data.push(new SeqObj(9, "", "FAs start snack service"));
        data.push(new SeqObj(12, "DOM", "Consult dispatch"));
        data.push(new SeqObj(18, "INT", "Consult dispatch"));
        data.push(new SeqObj(15, "DOM", "Advise ATC"));
        data.push(new SeqObj(21, "INT", "Advise ATC"));
        data.push(new SeqObj(18, "DOM", "Deplane"));
        data.push(new SeqObj(24, "INT", "Deplane"));
        return data;
    }

    function schedule() {
        var id = 0;
        var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
        for (var obj in tarmac.data) {
            if (obj.type === tarmac.routeType) {
                id++;

                var now = new Date().getTime(),
                    time = new Date(now + obj.sec * 1000);
                cordova.plugins.notification.local.schedule({
                    id: id,
                    title: 'Tarmac',
                    text: obj.text,
                    at: time,
                    sound: sound,
                    badge: 12
                });
            }
        }
    }
    function updateClock(ms) {
        var milliseconds = parseInt((ms % 1000) / 100),
            seconds = Math.floor((ms / 1000) % 60),
            minutes = Math.floor((ms / (1000 * 60)) % 60),
            hours = Math.floor((ms / (1000 * 60 * 60)) % 24),
            display = '00:00:00';
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        display = hours + ":" + minutes + ":" + seconds;
        tarmac.divTimer.innerHTML = display;
    }
    function displayAlerts(sec) {
        tarmac.data.forEach(function (item) {
            if (item.type && (item.type !== tarmac.routeType)) { return; }
            if (sec > item.sec && !item.displayed) {
                item.displayed = true;
                var div = document.createElement('div');
                div.innerHTML = '<div class="alert alert-info alert-dismissible"><a href="#" class="close" data-dismiss="alert" aria-label="close">×</a><span>' + item.alert + '</span></div>';
                tarmac.divAlerts.appendChild(div);
            }
        });
    }
    function tick() {
        var msElapsed = (new Date().getTime() - tarmac.msStart) - tarmac.msPaused;
        //if ( tarmac.endTime * 1000 <= msElapsed) { window.clearInterval(tarmac.timer); }
        updateClock(msElapsed);
        var seconds = Math.round(msElapsed / 1000);
        displayAlerts(seconds);
        if (seconds - 1 > tarmac.endTime) { window.clearInterval(tarmac.timer); }
        //if (tarmac.endTime === seconds) { }
    }
    function startTimer(e) {
        tarmac.btnStart.removeEventListener("click", startTimer);
        tarmac.btnStart.addEventListener("click", pauseTimer);
        tarmac.btnStart.innerText = "Pause";
        tarmac.msStart = new Date().getTime();
        tarmac.paused = false;
        tarmac.timer = window.setInterval(tick, 1000);
        schedule();
    }
    function resumeTimer(e) {
        if (tarmac.paused) {
            var msNow = new Date().getTime();
            tarmac.msPaused += (msNow - tarmac.msPausedStart);
            tarmac.msPausedStart = 0;
            tarmac.paused = false;
        }
        tarmac.btnStart.removeEventListener("click", resumeTimer);
        tarmac.btnStart.addEventListener("click", pauseTimer);
        tarmac.btnStart.innerText = "Pause";
        tarmac.timer = window.setInterval(tick, 1000);
    }
    function pauseTimer(e) {
        tarmac.paused = true;
        tarmac.btnStart.removeEventListener("click", pauseTimer);
        tarmac.btnStart.addEventListener("click", resumeTimer);
        window.clearInterval(tarmac.timer);
        tarmac.msPausedStart = new Date().getTime();
        tarmac.btnStart.innerText = "Resume";
    }
    function resetTimer(e) {
        window.clearInterval(tarmac.timer);
        tarmac.btnStart.removeEventListener("click", pauseTimer);
        tarmac.btnStart.removeEventListener("click", resumeTimer);
        tarmac.btnStart.addEventListener("click", startTimer);
        tarmac.msPausedStart = 0;
        tarmac.msPaused = 0;
        tarmac.msStart = 0;
        tarmac.timer = null;
        tarmac.data = getdata();
        tarmac.paused = true;
        tarmac.btnStart.innerText = "Start";
        $('#alerts').empty();
        updateClock(0);
    }
    function routeClick(e) {
        var btn = e.target;
        tarmac.routeType = btn.value;
        tarmac.endTime = tarmac.routeType === 'INT' ? 24 : 18;
        tarmac.btnStart.disabled = false;
        tarmac.btnReset.disabled = false;
        var btns = document.getElementsByClassName('route');
        for (var itm of btns) {
            itm.classList.add('btn-default');
            itm.classList.remove('btn-primary');
        }
        e.target.classList.remove('btn-default');
        e.target.classList.add('btn-primary');
    }
    return tarmac;
})();


