let app = (function ($) {
  'use strict';

  function SeqObj(sec, type, alert) {
    this.sec = sec;
    this.type = type;
    this.alert = alert;
  }
  let app = {
    etime: null, // HTML time display
    erst: null, // HTML reset button
    ego: null, // HTML start/stop button
    data: null,
    seqData: [],
    type: '',
    loadData: function () {
      app.seqData = [];
      app.seqData.push(new SeqObj(30, "", "Delay announcement"));
      app.seqData.push(new SeqObj(90, "", "FAs start snack service"));
      app.seqData.push(new SeqObj(120, "DOM", "Consult dispatch"));
      app.seqData.push(new SeqObj(180, "INT", "Consult dispatch"));
      app.seqData.push(new SeqObj(150, "DOM", "Advise ATC"));
      app.seqData.push(new SeqObj(210, "INT", "Advise ATC"));
      app.seqData.push(new SeqObj(180, "DOM", "Deplane"));
      app.seqData.push(new SeqObj(240, "INT", "Deplane"));
    },
    init: function () {
      // (A1) GET HTML ELEMENTS
      app.displayTime = document.getElementById("sw-time");
      app.btnReset = document.getElementById("sw-rst");
      app.btnPauseResume = document.getElementById("sw-go");
      app.btnDom = document.getElementById("btn-dom");
      app.btnInt = document.getElementById("btn-int");


      // (A2) ENABLE BUTTON CONTROLS

      app.btnReset.disabled = true;
      app.btnPauseResume.disabled = true;
      app.btnReset.addEventListener("click", app.reset);
      app.btnPauseResume.addEventListener("click", app.start);
      app.btnDom.addEventListener("click", app.domClick);
      app.btnInt.addEventListener("click", app.intClick);
    },
    domClick: function (e) {
      app.type = "DOM";
      app.end = 180;
      app.btnReset.disabled = false;
      app.btnPauseResume.disabled = false;
      $(app.btnDom).removeClass('btn-default').addClass('btn-primary');
      $(app.btnInt).removeClass('btn-primary').addClass('btn-default');

    },
    intClick: function () {
      app.type = "INT";
      app.end = 240;
      app.btnReset.disabled = false;
      app.btnPauseResume.disabled = false;
      $(app.btnInt).removeClass('btn-default').addClass('btn-primary');
      $(app.btnDom).removeClass('btn-primary').addClass('btn-default');
    },
    showAlert: function () {
      app.seqData.forEach((item) => {
        if (item.type && item.type !== app.type) { return; }
        if (item.sec === app.now && !item.displayed) {
          $('<div class="alert alert-info alert-dismissible">')
            .append($('<a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a>'))
            .append($('<span>', { text: item.alert }))
            .appendTo($('#alerts'));
          item.displayed = true;
        }
      });



    },


    // (B) TIMER ACTION
    timer: null, // timer object
    now: 0, // current elapsed time
    end: 0,
    tick: function () {
      // (B1) CALCULATE HOURS, MINS, SECONDS
      app.now++;
      var remain = app.now;
      var hours = Math.floor(remain / 3600);
      remain -= hours * 3600;
      var mins = Math.floor(remain / 60);
      remain -= mins * 60;
      var secs = remain;
      console.log('app.now', app.now);
      app.showAlert();
      // (B2) UPDATE THE DISPLAY TIMER
      if (hours < 10) {
        hours = "0" + hours;
      }
      if (mins < 10) {
        mins = "0" + mins;
      }
      if (secs < 10) {
        secs = "0" + secs;
      }
      app.displayTime.innerHTML = hours + ":" + mins + ":" + secs;
      if (app.now === app.end) { app.stop(); }
    },
    // (C) START!
    start: function () {
      app.timer = setInterval(app.tick, 1000);
      app.btnPauseResume.value = "Stop";
      app.btnPauseResume.innerHTML = "Pause";
      app.btnPauseResume.removeEventListener("click", app.start);
      app.btnPauseResume.addEventListener("click", app.stop);      
    },
    // (D) STOP
    stop: function () {
      clearInterval(app.timer);
      app.timer = null;
      app.btnPauseResume.value = "Start";
      app.btnPauseResume.innerHTML = "Resume";
      app.btnPauseResume.removeEventListener("click", app.stop);
      app.btnPauseResume.addEventListener("click", app.start);
    },
    // (E) RESET
    reset: function () {
      if (app.timer != null) {
        app.stop();
      }
      app.now = -1;
      app.tick();
      app.btnPauseResume.innerHTML = "Start";
      $('#alerts').empty();
      app.loadData();
    },
    onDeviceReady: function () {
      console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    }
  };
  app.loadData();
  window.addEventListener("load", app.init);
  document.addEventListener('deviceready', app.onDeviceReady, false);
  return app;
})(jQuery);





