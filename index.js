/*jslint browser: true*/
/*global exports*/
var settings;

exports.loadSettings = function (hook, context) {
  "use strict";
  settings = {};
  settings.updateInterval = 1500;
  settings.triggerSequence = '###';
  settings.replacePause = true;
  
  if(context.settings.ep_insertTimestamp) {
    if(context.settings.ep_insertTimestamp.updateInterval) {
      settings.updateInterval = context.settings.ep_insertTimestamp.updateInterval;
    }
    if(context.settings.ep_insertTimestamp.triggerSequence) {
      settings.triggerSequence = context.settings.ep_insertTimestamp.triggerSequence;
    }
    if(context.settings.ep_insertTimestamp.replacePause) {
      settings.replacePause =  context.settings.ep_insertTimestamp.replacePause;
    }
  }
};

exports.eejsBlock_scripts = function (hook, context) {
  "use strict";
  var syncJS = '<script type="text/javascript">';
  syncJS += 'ep_insertTimestamp={};';
  syncJS += 'ep_insertTimestamp.settings=' + JSON.stringify(settings) + ";";
  syncJS += '</script>';

  context.content = context.content + syncJS;
};

exports.handleMessage = function(hook, context, callback) {
  "use strict";
  var msg = context.message;
  var client = context.client;
    
  if (msg.type === 'COLLABROOM' && msg.data.type === "timeSync") {
    client.json.send({ type: "COLLABROOM",
                       data: {
                               type: "timeSync",
                               payload: { servTime: new Date().getTime() }
                             }
                     });
    return [null];
  }
  callback();
};
