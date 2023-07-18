
var locNot = (function () {
    'use strict';
    var id = 1, dialog;
    var ln = {};
    ln.callback = function () {
        cordova.plugins.notification.local.getIds(function (ids) {
            showToast('IDs: ' + ids.join(' ,'));
        });
    };

    ln.showToast = function (text) {
        setTimeout(function () {
            if (device.platform != 'windows') {
                window.plugins.toast.showShortBottom(text);
            } else {
                showDialog(text);
            }
        }, 100);
    };

    ln.showDialog = function (text) {
        if (dialog) {
            dialog.content = text;
            return;
        }

        dialog = new Windows.UI.Popups.MessageDialog(text);

        dialog.showAsync().done(function () {
            dialog = null;
        });
    };

    ln.hasPermission = function () {
        cordova.plugins.notification.local.hasPermission(function (granted) {
            showToast(granted ? 'Yes' : 'No');
        });
    };

    ln.registerPermission = function () {
        cordova.plugins.notification.local.registerPermission(function (granted) {
            showToast(granted ? 'Yes' : 'No');
        });
    };

    ln.schedule = function () {
        cordova.plugins.notification.local.schedule({
            id: 1,
            text: 'Test Message 1',
            icon: 'http://3.bp.blogspot.com/-Qdsy-GpempY/UU_BN9LTqSI/AAAAAAAAAMA/LkwLW2yNBJ4/s1600/supersu.png',
            smallIcon: 'res://cordova',
            sound: null,
            badge: 1,
            data: { test: id }
        });
    };

    ln.scheduleMultiple = function () {
        cordova.plugins.notification.local.schedule([{
            id: 1,
            text: 'Multi Message 1',
            icon: 'res://cordova'
        }, {
            id: 2,
            text: 'Multi Message 2',
            icon: 'res://icon',
            smallIcon: 'ic_media_play'
        }, {
            id: 3,
            text: 'Multi Message 3',
            icon: 'res://icon',
            smallIcon: 'ic_media_pause'
        }]);
    };

    ln.scheduleDelayed = function () {
        var now = new Date().getTime(),
            _5_sec_from_now = new Date(now + 5 * 1000);

        var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

        cordova.plugins.notification.local.schedule({
            id: 1,
            title: 'Scheduled with delay',
            text: 'Test Message 1',
            at: _5_sec_from_now,
            sound: sound,
            badge: 12
        });
    };

    ln.scheduleMinutely = function () {
        var sound = device.platform == 'Android' ? 'file://sound.mp3' : 'file://beep.caf';

        cordova.plugins.notification.local.schedule({
            id: 1,
            text: 'Scheduled every minute',
            every: 'minute',
            sound: sound,
            icon: 'res://icon',
            smallIcon: 'res://ic_popup_sync'
        });
    };

    ln.update = function () {
        cordova.plugins.notification.local.update({
            id: 1,
            text: 'Updated Message 1',
            icon: 'res://icon',
            color: 'FF0000',
            json: { updated: true }
        });
    };

    ln.updateInterval = function () {
        cordova.plugins.notification.local.update({
            id: 1,
            text: 'Updated Message 1',
            every: 'minute'
        });
    };

    ln.clearSingle = function () {
        cordova.plugins.notification.local.clear(1, callback);
    };

    ln.clearMultiple = function () {
        cordova.plugins.notification.local.clear([2, 3], callback);
    };

    ln.clearAll = function () {
        cordova.plugins.notification.local.clearAll(callback);
    };


    ln.cancel = function () {
        cordova.plugins.notification.local.cancel(1, callback);
    };

    ln.cancelMultiple = function () {
        cordova.plugins.notification.local.cancel([2, 3], callback);
    };

    ln.cancelAll = function () {
        cordova.plugins.notification.local.cancelAll(callback);
    };


    ln.isPresent = function () {
        cordova.plugins.notification.local.isPresent(id, function (present) {
            showToast(present ? 'Yes' : 'No');
        });
    };

    ln.isScheduled = function () {
        cordova.plugins.notification.local.isScheduled(id, function (scheduled) {
            showToast(scheduled ? 'Yes' : 'No');
        });
    };

    ln.isTriggered = function () {
        cordova.plugins.notification.local.isTriggered(id, function (triggered) {
            showToast(triggered ? 'Yes' : 'No');
        });
    };


    var callbackIds = function (ids) {
        console.log(ids);
        showToast(ids.length === 0 ? '- none -' : ids.join(' ,'));
    };

    ln.getIds = function () {
        cordova.plugins.notification.local.getIds(callbackIds);
    };

    ln.getScheduledIds = function () {
        cordova.plugins.notification.local.getScheduledIds(callbackIds);
    };

    ln.getTriggeredIds = function () {
        cordova.plugins.notification.local.getTriggeredIds(callbackIds);
    };


    var callbackOpts = function (notifications) {
        console.log(notifications);
        showToast(notifications.length === 0 ? '- none -' : notifications.join(' ,'));
    };

    var callbackSingleOpts = function (notification) {
        console.log(notification);
        showToast(notification ? notification.toString() : '- none -');
    };

    ln.get = function () {
        cordova.plugins.notification.local.get(1, callbackSingleOpts);
    };

    ln.getMultiple = function () {
        cordova.plugins.notification.local.get([1, 2], callbackOpts);
    };

    ln.getAll = function () {
        cordova.plugins.notification.local.getAll(callbackOpts);
    };

    ln.getScheduled = function () {
        cordova.plugins.notification.local.getScheduled(callbackOpts);
    };

    ln.getTriggered = function () {
        cordova.plugins.notification.local.getTriggered(callbackOpts);
    };


    ln.setDefaultTitle = function () {
        cordova.plugins.notification.local.setDefaults({
            title: 'New Default Title'
        });
    };

    document.addEventListener('deviceready', function () {

        cordova.plugins.notification.local.on('schedule', function (notification) {
            console.log('onschedule', arguments);
            // showToast('scheduled: ' + notification.id);
        });

        cordova.plugins.notification.local.on('update', function (notification) {
            console.log('onupdate', arguments);
            // showToast('updated: ' + notification.id);
        });

        cordova.plugins.notification.local.on('trigger', function (notification) {
            console.log('ontrigger', arguments);
            showToast('triggered: ' + notification.id);
        });

        cordova.plugins.notification.local.on('click', function (notification) {
            console.log('onclick', arguments);
            showToast('clicked: ' + notification.id);
        });

        cordova.plugins.notification.local.on('cancel', function (notification) {
            console.log('oncancel', arguments);
            // showToast('canceled: ' + notification.id);
        });

        cordova.plugins.notification.local.on('clear', function (notification) {
            console.log('onclear', arguments);
            showToast('cleared: ' + notification.id);
        });

        cordova.plugins.notification.local.on('cancelall', function () {
            console.log('oncancelall', arguments);
            // showToast('canceled all');
        });

        cordova.plugins.notification.local.on('clearall', function () {
            console.log('onclearall', arguments);
            // showToast('cleared all');
        });
    }, false);


    app.initialize();

    return ln;
})();