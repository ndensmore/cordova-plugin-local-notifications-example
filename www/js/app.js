var app=(function() {
    "use strict";
    function SeqObj(sec, type, alert) {
        this.sec = sec;
        this.type = type;
        this.alert = alert;
    }
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
    let $btnDom = document.getElementById('btnDom');
    let $btnStart = document.getElementById('btnStart');
    let $btnInt = document.getElementById('btnInt');
    let $btnReset = document.getElementById('btnReset');
    let $timer = document.getElementById('timer');
    let start_ms=0, end_ms=0, paused_ms=0, elapsed_ms=0, timer=0;
    let routeType = "DOM";
    let app = {
        data: getdata(),
        initialize: function() {
            console.log('initialize');
            this.bindEvents();
            this.el.btnStart.disabled = true;    
            this.el.btnStart.btnReset = true;   
        },
        btnDom_onClick: function(e){
            console.log('btnDom_onClick');
            routeType = "DOM";
            $btnStart.disabled = false;
            $btnInt.disabled = true;
            var btns = document.getElementsByClassName('route');
            for (var itm of btns) {
                itm.classList.add('btn-default');
                itm.classList.remove('btn-primary');
            }
            e.target.classList.remove('btn-default');
            e.target.classList.add('btn-primary');
        },
        btnStart_onClick: function(e){
            console.log('btnStart_onClick'); 
     
    
    
        },
        btnInt_onClick: function(e){
            console.log('btnInt_onClick');
            routeType = "INT";
            $btnStart.disabled = false;
            $btnInt.disabled = true;
            var btns = document.getElementsByClassName('route');
            for (var itm of btns) {
                itm.classList.add('btn-default');
                itm.classList.remove('btn-primary');
            }
            e.target.classList.remove('btn-default');
            e.target.classList.add('btn-primary');
    
    
        },
        btnReset_onClick: function(e){
            console.log('btnReset_onClick');
    
    
    
        },
        bindEvents: function() {
            document.addEventListener('deviceready', this.onDeviceReady, false);
            $btnDom.addEventListener("click",this.btnDom_onClick);
            $btnStart.addEventListener("click", this.btnStart_click);
            $btnInt.addEventListener("click", this.btnInt_click);
            $btnReset.addEventListener("click", this.btnReset_click);
        },
        onDeviceReady: function() {
            this.receivedEvent('deviceready');
        },
        receivedEvent: function(id) {
            var parentElement = document.getElementById(id);
            var listeningElement = parentElement.querySelector('.listening');
            var receivedElement = parentElement.querySelector('.received');
    
            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
    
            console.log('Received Event: ' + id);
        },
        tick: function() {
            elapsed_ms = (new Date().getTime() - start_ms) - paused_ms;
            updateClock(elapsed_ms);
            var seconds = Math.round(msElapsed / 1000);
            displayAlerts(seconds);
            if (seconds - 1 > end_ms) { window.clearInterval(timer); }
            //if (tarmac.endTime === seconds) { }
        },
        updateClock: function(ms) {
            var milliseconds = parseInt((ms % 1000) / 100),
                seconds = Math.floor((ms / 1000) % 60),
                minutes = Math.floor((ms / (1000 * 60)) % 60),
                hours = Math.floor((ms / (1000 * 60 * 60)) % 24),
                display = '00:00:00';
            hours = (hours < 10) ? "0" + hours : hours;
            minutes = (minutes < 10) ? "0" + minutes : minutes;
            seconds = (seconds < 10) ? "0" + seconds : seconds;
            display = hours + ":" + minutes + ":" + seconds;
            $timer.innerHTML = display;
        }
    };
})();