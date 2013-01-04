exports.eejsBlock_scripts = function (hook, context)
{
  var syncJS = '<script type="text/javascript">\n';
  syncJS += 'var servDate = ' + new Date().getTime() + '\n';
  syncJS += 'var clientDate = new Date().getTime();\n';
  syncJS += '_insertTimestampDiff = servDate - clientDate;\n';
  syncJS += '</script>\n';
  
  context.content = context.content + syncJS;
}
