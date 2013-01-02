exports.aceEditEvent = function(hook, context)
{
  if(context.callstack.type == "idleWorkTimer")
	return;
  
  var ace = context.editorInfo.editor;
  
  // Original by simonwaldherr, http://shownotes.github.com/EtherpadBookmarklets/
  var padlines=ace.exportText().split('\n');
  var timestamp=Math.round(new Date().getTime()/1000);
  
  for(var i = 0; i < padlines.length; i++)
  {
    if(padlines[i].indexOf('###') == 0)
    {
      ace.replaceRange([i,0], [i,3], '' + timestamp);
    }
  }
}
