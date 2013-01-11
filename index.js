exports.eejsBlock_scripts = function (hook, context)
{
  var syncJS = '<script type="text/javascript">\n';
  syncJS += 'var servDate = ' + new Date().getTime() + '\n';
  syncJS += 'var clientDate = new Date().getTime();\n';
  syncJS += '_insertTimestampDiff = servDate - clientDate;\n';
  syncJS += '</script>\n';
  
  context.content = context.content + syncJS;
}

exports.handleMessage = function(hook, context, callback)
{
  var msg = context.message;
  var client = context.client;
    
  if (msg.type == 'COLLABROOM' && msg.data.type == "timeSync")
  {
    client.json.send({ type: "COLLABROOM",
                       data: {
                               type: "timeSync",
                               payload: { servTime: new Date().getTime() }
                             }
                     });
    return [null];
  }
  else
  {
    callback();
  }
}
