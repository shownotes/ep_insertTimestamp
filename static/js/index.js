var pauseRegex = new RegExp('([0-9]{10}:)' + ep_insertTimestamp.settings.triggerSequence);
var seqLength = ep_insertTimestamp.settings.triggerSequence.length;

exports.aceEditEvent = function(hook, context)
{
  if(!context.callstack.docTextChanged)
    return;
  
  var ace = context.editorInfo.editor;
  
  // Original by simonwaldherr, http://shownotes.github.com/EtherpadBookmarklets/
  var padlines = ace.exportText().split('\n');
  var timestamp = new Date().getTime() + ep_insertTimestamp.timeDiff;
  timestamp = Math.round(timestamp/1000);
  
  for(var i = 0; i < padlines.length; i++)
  {
    if(padlines[i].indexOf(ep_insertTimestamp.settings.triggerSequence) == 0 &&
       padlines[i].length == seqLength)
    {
      ace.replaceRange([i,0], [i, seqLength], timestamp + ' ');
    }
    else if(ep_insertTimestamp.settings.replacePause)
    {
      var pauseResult = padlines[i].match(pauseRegex);
      if(pauseResult)
      {
        ace.replaceRange([i,11], [i,11 + seqLength], timestamp + '');
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
  if(updateInterval != -1)
    setInterval(timeSync, updateInterval);
}

function timeSync()
{
  if(pad.collabClient)
  {
    pad.collabClient.sendMessage({"type": "timeSync"});
  }
}