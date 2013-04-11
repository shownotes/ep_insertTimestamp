# ep_insertTimestamp
## Function
Inserts the current UNIX-timestamp when the user types a the string defined in `triggerSequence` at the beginning of a line.
There is a very simple time-offset-correction implemented, which is triggered every `updateInterval` milliseconds.
If Starttime is defined like ```Starttime:YYYY-MM-DD HH:MM:SS``` (as defined in ISO8601) or ```Starttime:DD.MM.YYYY HH:MM:SS``` (as defined in DIN1355-1) the timedistance from current time to defined time will inserted, instead of current timestamp.

## Settings
```JSON
"ep_insertTimestamp" : {
                         "updateInterval": "30000",
                         "triggerSequence": "###",
                         "replacePause": true
                       }
```
Sub-Settings:

* `updateInterval`, defaults to `30000`, `-1` means no auto-updating, the interval in which the time-offset gets updated
* `triggerSequence`, defaults to `###`, the characters the user has to write to trigger a timestamp-insertation
* `replacePause`, defaults to `true`, true if a OSF-pause-sequence (e.g. `###:###`) should also be replaced.
