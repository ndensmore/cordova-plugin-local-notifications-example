/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


let jData=[{"id":2001,"title":"Tarmac Notification","text":"msg 5 sec","trigger":{"in":5,"unit":"second"},"sound":"file://beep.caf","foreground":true},{"id":2002,"title":"Tarmac Notification","text":"msg 25 sec","trigger":{"in":25,"unit":"second"},"sound":"file://beep.caf","foreground":true},{"id":2003,"title":"Tarmac Notification","text":"msg 35 sec","trigger":{"in":35,"unit":"second"},"sound":"file://beep.caf","foreground":true},{"id":2004,"title":"Tarmac Notification","text":"msg 60 sec","trigger":{"in":60,"unit":"second"},"sound":"file://beep.caf","foreground":true}];

alert(JSON.stringify(sch));
let SeqObj=function (sec, type, alert) {
    this.id=0;
    this.sec = sec;
    this.type = type;
    this.alert = alert;
};
var app = {
    getData:function getdata() {
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
    },
    showToast:function(text){
        setTimeout(function () {
            if (device.platform != 'windows') {
                window.plugins.toast.showShortBottom(text);
            } else {
                showDialog(text);
            }
        }, 100);
    },
    showDialog:function(text){
        if (dialog) {
            dialog.content = text;
            return;
        }
        dialog = new Windows.UI.Popups.MessageDialog(text);
        dialog.showAsync().done(function () {
            dialog = null;
        });
    },
    registerPermission:function(){
        cordova.plugins.notification.local.registerPermission(function (granted) {
            showToast(granted ? 'Yes' : 'No');
        });
    },
    scheduleDelayed:function(o){
        var now = new Date().getTime(),
            time = new Date(now + o.sec * 1000);
        var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';
        cordova.plugins.notification.local.schedule({
            id: o.id,
            title: 'Tarmac Notification',
            text: o.alert,
            trigger: { in: o.sec, unit: 'second' },
            sound: sound,
            foreground: true
        });
    },
    startTimer:function(){
        var i=1000;
        let data=JSON.parse(jData);
        data.forEach(cordova.plugins.notification.local.schedule);
    },
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        app.receivedEvent('deviceready');
        //app.startTimer();

    document.getElementById('btnStart').addEventListener('click', app.startTimer);
    },
    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();
