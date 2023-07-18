
let tarmac = (function ($) {
    "use strict";
    function SeqObj(sec, type, alert) {
        this.sec = sec;
        this.type = type;
        this.alert = alert;
    }

    let tarmac = {
        el: {
            displayTime: null,
            btnReset: null,
            btnPauseResume: null,
            btnDomestic: null,
            btnInternational: null
        },
        data: [],
        type: '',
    };
    tarmac.onResume = null;
    let startDate = 0;
    let currentDate = 0;
    let startTime = 0;
    let currentTime = 0;
    let elapsedTime = 0;
    let endTime = 0;
    let timer = null;
    let h = 0;
    let m = 0;
    let s = 0;
    let routeType = '';
    let paused = true;
    tarmac.getdata = () => {
        let data = [];
        data.push(new SeqObj(30, "", "Delay announcement"));
        data.push(new SeqObj(90, "", "FAs start snack service"));
        data.push(new SeqObj(120, "DOM", "Consult dispatch"));
        data.push(new SeqObj(180, "INT", "Consult dispatch"));
        data.push(new SeqObj(150, "DOM", "Advise ATC"));
        data.push(new SeqObj(210, "INT", "Advise ATC"));
        data.push(new SeqObj(180, "DOM", "Deplane"));
        data.push(new SeqObj(240, "INT", "Deplane"));
        return data;
    };
    tarmac.init = () => {
        tarmac.data = tarmac.getdata();
        // (A1) GET HTML ELEMENTS
        //tarmac.el.displayTime = document.getElementById("sw-time");
        //tarmac.el.btnReset = document.getElementById("sw-rst");
        //tarmac.el.btnPauseResume = document.getElementById("sw-go");
        //tarmac.el.btnDom = document.getElementById("btn-dom");
        //tarmac.el.btnInt = document.getElementById("btn-int");
        // (A2) ENABLE BUTTON CONTROLS
        tarmac.el.btnReset.disabled = true;
        tarmac.el.btnPauseResume.disabled = true;
        tarmac.el.btnReset.addEventListener("click", tarmac.reset);
        tarmac.el.btnPauseResume.addEventListener("click", tarmac.start);
        tarmac.el.btnDom.addEventListener("click", tarmac.routeClick);
        tarmac.el.btnInt.addEventListener("click", tarmac.routeClick);
    };
    tarmac.getTimeDisplay = () => {
        return h.padStart(2, 0) + ':' + m.padStart(2, 0) + ':' + s.padStart(2, 0);
    };
    function updateClock(duration) {
        var milliseconds = parseInt((duration % 1000) / 100),
            seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24),
            display = '00:00:00';
        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;
        //return hours + ":" + minutes + ":" + seconds;// + "." + milliseconds;
        display = hours + ":" + minutes + ":" + seconds;
        tarmac.el.displayTime.innerHTML = display;
    };
    tarmac.displayAlerts = (sec) => {
        console.log('sec', sec);
        tarmac.data.forEach((item) => {
            console.log('item', item);
            if (item.type && item.type !== routeType) { return; }
            if (item.sec === sec && !item.displayed) {
                $('<div class="alert alert-info alert-dismissible">')
                    .append($('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'))
                    .append($('<span>', { text: item.alert }))
                    .appendTo($('#alerts'));
                item.displayed = true;
            }
        });
    };
    tarmac.tick = () => {
        currentDate = new Date();
        currentTime = currentDate.getTime();
        startTime = startDate.getTime();
        elapsedTime = currentTime - startTime;
        //displayElapsed = msToTime(elapsedTime);
        //console.log('displayElapsed', displayElapsed);
        //if (elapsedTime >= endTime / 1000) { tarmac.stop(); }
        updateClock(elapsedTime);
        if (elapsedTime) {
            tarmac.displayAlerts(Math.floor(elapsedTime / 1000));
        }
    };
    tarmac.start = () => {
        if (!startDate) {
            startDate = new Date();
            timer = setInterval(tarmac.tick, 1000);
            tarmac.el.btnPauseResume.value = "Stop";
            tarmac.el.btnPauseResume.innerHTML = "Pause";
            tarmac.el.btnPauseResume.removeEventListener("click", tarmac.start);
            tarmac.el.btnPauseResume.addEventListener("click", tarmac.stop);

        }
    };
    tarmac.stop = () => {
        clearInterval(timer);
        timer = null;
        tarmac.el.btnPauseResume.value = "Start";
        tarmac.el.btnPauseResume.innerHTML = "Resume";
        tarmac.el.btnPauseResume.removeEventListener("click", tarmac.stop);
        tarmac.el.btnPauseResume.addEventListener("click", tarmac.start);
    };
    tarmac.reset = () => {
        if (timer != null) { tarmac.stop(); }
        tarmac.btnPauseResume.innerHTML = "Start";
        $('#alerts').empty();
    };
    tarmac.pause = () => {
        let stateData = { startDate: startDate, paused: timer === null, data: tarmac.data };
        localStorage.setItem('tarmac', JSON.stringify(startDate));
    };
    tarmac.resume = () => {
        let stateData = JSON.parse(localStorage.getItem('tarmac'));
        if (!stateData.paused) {
            tarmac.data = stateData.data;
            startDate = stateData.startDate;
            timer = setInterval(tarmac.tick, 1000);
        }
    };
    tarmac.routeClick = (e) => {
        console.log('routeClick')
        let btn = e.target;
        routeType = btn.name;
        endTime = routeType === 'INT' ? 240 : 180;
        tarmac.el.btnPauseResume.disabled = false;
        tarmac.el.btnReset.disabled = false;
        $('button.route').removeClass('btn-primary').addClass('btn-default');
        $(btn).removeClass('btn-default').addClass('btn-primary');
    };
    return tarmac;
})(jQuery);