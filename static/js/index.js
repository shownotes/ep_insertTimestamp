var pauseRegex = new RegExp('([0-9]{10}:)' + ep_insertTimestamp.settings.triggerSequence);
var seqLength = ep_insertTimestamp.settings.triggerSequence.length;

exports.aceEditEvent = function(hook, context)
{
  if(!context.callstack.docTextChanged)
    return;
  
  var ace = context.editorInfo.editor;
  
  // Original by simonwaldherr, http://shownotes.github.com/EtherpadBookmarklets/
  var padlines = ace.exportText().split('\n'),
      timestamp = Math.round(new Date().getTime() / 1000),
      timearray = [], timedate,
      regexdate = /(^Starttime:(\d\d)\.(\d\d).(\d\d\d\d) (\d\d):(\d\d):(\d\d))/i,
      i = 0, starttimestamp;
      
  for (i = 0; i < padlines.length; i++) {
      if (padlines[i].indexOf('Starttime:') === 0) {
          if(regexdate.test(padlines[i])) {
            timearray = regexdate.exec(padlines[i]);
            timedate = new Date(timearray[4], (timearray[3] - 1), timearray[2], timearray[5], timearray[6], timearray[7], 0);
            starttimestamp = Math.round(timedate.getTime() / 1000);
          }
      }
      if (padlines[i].indexOf('### ') === 0) {
          if(typeof starttimestamp === 'number') {
              var time = parseInt(timestamp, 10) - parseInt(starttimestamp, 10),
                  date, hours, minutes, seconds, returntime = '';
              hours = Math.floor(time / 3600);
              minutes = Math.floor((time - (hours * 3600)) / 60);
              seconds = time - (hours * 3600) - (minutes * 60);
              returntime += (hours < 10) ? '0' + hours + ':' : hours + ':';
              returntime += (minutes < 10) ? '0' + minutes + ':' : minutes + ':';
              returntime += (seconds < 10) ? '0' + seconds : seconds;
              ace.replaceRange([i, 0], [i, 3], '' + returntime);
          } else {
              ace.replaceRange([i, 0], [i, 3], '' + timestamp);
          }
      }
  }
}

// That is no real time-syncing, but it's enough for our needs
exports.handleClientMessage_timeSync = function(hook, context)
{
  //var oldDiff = ep_insertTimestamp.timeDiff;
  ep_insertTimestamp.timeDiff = context.payload.servTime - new Date().getTime();
  //console.log(oldDiff - ep_insertTimestamp.timeDiff)
}

exports.documentReady = function(hook, context)
{
  var updateInterval = ep_insertTimestamp.settings.updateInterval
  if(typeof updateInterval === 'number')
    setInterval(timeSync, updateInterval);
}

function timeSync()
{
  if(pad.collabClient)
  {
    pad.collabClient.sendMessage({"type": "timeSync"});
  }
}