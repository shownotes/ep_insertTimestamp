/*jslint browser: true, unparam: true, indent: 2 */
/*global exports, ep_insertTimestamp, pad*/

exports.aceEditEvent = function (hook, context) {
  "use strict";
  if (!context.callstack.docTextChanged) {
    return;
  }
  // Original by simonwaldherr, http://shownotes.github.com/EtherpadBookmarklets/
  var ace = context.editorInfo.editor,
    on_switches = ["on", "yes", "true"],
    useRelativeTimestamps = false,
    padlines = ace.exportText().split('\n'),
    timestamp = Math.round((Date.now() + ep_insertTimestamp.timeDiff) / 1000),
    timearray = [],
    regexdate = [],
    timedate,
    triggersq = ep_insertTimestamp.settings.triggerSequence,
    i = 0,
    starttimestamp,
    starttimestring,
    j,
    time,
    hours,
    minutes,
    seconds,
    returntime;

  regexdate[0] = /((\d\d\d\d)[,\-](\d\d)[,\-](\d\d)[,\- ](\d\d)[,:](\d\d)[,:](\d\d))/i; //ISO8601
  regexdate[1] = /((\d\d)\.(\d\d)\.(\d\d\d\d) (\d\d):(\d\d):(\d\d))/i; //DIN1355-1
  for (i = 0; i < padlines.length; i += 1) {
    starttimestring = padlines[i].match(/^starttime: */i);
    if (starttimestring) {
      starttimestring = starttimestring[0]; // the part that matches aforementioned regex
      starttimestring = padlines[i].substring(starttimestring.length); // only the date part
      if (!isNaN(Date.parse(starttimestring))) {
        starttimestamp = Math.round(Date.parse(starttimestring) / 1000);
      } else if (regexdate[0].test(starttimestring)) {
        timearray = regexdate[0].exec(starttimestring);
        timedate = new Date(timearray[2], (timearray[3] - 1), timearray[4], timearray[5], timearray[6], timearray[7], 0);
        starttimestamp = Math.round(timedate.getTime() / 1000);
      } else if (regexdate[1].test(starttimestring)) {
        timearray = regexdate[1].exec(starttimestring);
        timedate = new Date(timearray[4], (timearray[3] - 1), timearray[2], timearray[5], timearray[6], timearray[7], 0);
        starttimestamp = Math.round(timedate.getTime() / 1000);
      }
    }
    if (padlines[i].toLowerCase().indexOf('relativetimestamps:') === 0) {
      for (j = 0; j < on_switches.length; j += 1) {
        if (padlines[i].toLowerCase().indexOf(on_switches[j]) !== -1) {
          useRelativeTimestamps = true;
        }
      }
    }

    if (padlines[i].indexOf(triggersq + ' ') === 0) {
      if ((typeof starttimestamp === 'number') && useRelativeTimestamps) {
        time = parseInt(timestamp, 10) - parseInt(starttimestamp, 10);
        returntime = '';
        hours = Math.floor(time / 3600);
        minutes = Math.floor((time - (hours * 3600)) / 60);
        seconds = time - (hours * 3600) - (minutes * 60);
        returntime += (hours < 10) ? '0' + hours + ':' : hours + ':';
        returntime += (minutes < 10) ? '0' + minutes + ':' : minutes + ':';
        returntime += (seconds < 10) ? '0' + seconds : seconds;
        ace.replaceRange([i, 0], [i, triggersq.length], returntime.toString());
      } else {
        ace.replaceRange([i, 0], [i, triggersq.length], timestamp.toString());
      }
    }
  }
};

function timeSync() {
  "use strict";
  if (pad.collabClient) {
    pad.collabClient.sendMessage({
      "type": "timeSync"
    });
  }
}

// That is no real time-syncing, but it's enough for our needs
exports.handleClientMessage_timeSync = function (hook, context) {
  "use strict";
  ep_insertTimestamp.timeDiff = context.payload.servTime - Date.now();
};

exports.documentReady = function () {
  "use strict";
  var updateInterval = ep_insertTimestamp.settings.updateInterval;
  if ((typeof updateInterval === 'number') && (updateInterval !== -1)) {
    setInterval(timeSync, updateInterval);
  }
};

exports.postAceInit = function () {
  setTimeout(timeSync, 0);
};

// vim:set sw=2 et:
