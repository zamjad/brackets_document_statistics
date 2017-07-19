/** Simple extension that display the document statistics */
define(function (require, exports, module) {
    "use strict";

    var CommandManager = brackets.getModule("command/CommandManager"),
        EditorManager  = brackets.getModule("editor/EditorManager"),        
        Menus          = brackets.getModule("command/Menus"),
        DocumentManager= brackets.getModule('document/DocumentManager'),
        Dialogs        = brackets.getModule("widgets/Dialogs");
            
    var MENU_DOC_STATS = "extension.document.statistics";   // package-style naming to avoid collisions
    
    CommandManager.register("Document Statistics", MENU_DOC_STATS, function () {
        
        var editor = EditorManager.getFocusedEditor();
        var document = DocumentManager.getCurrentDocument();
        var text = document.getText();
        
        var words = text.split(/[\s\r\n]+/).filter(function(n) { return n != ''; });
        var wordCount = words.length;
        
        var uniqueWords = words.reduce(function(p, c) {
            if (p.indexOf(c) < 0)
                p.push(c);
            return p;
        }, []).length;        

        var largestWord = words.reduce(function (x, y) {
            return x.length > y.length ? x : y;
        });
        
        var wordLengths = words.map(function(n) {
            return n.length;
        });        
        
        words.forEach(function(n) {
            
        });
        
        var avgWordLen = 0;
        
        if (wordCount > 0) {
            avgWordLen = (words.map(function(n) {
                return n.length;
            }).reduce(function(x, y) {
                return x + y;
            }, 0)) / wordCount;
        }
            
        var mod = mostFrequent(wordLengths);
        
        var displayStat = "<p><em>Lines:</em><b> " + editor.lineCount() + "</b></p>";
        displayStat += "<p><em>Words:</em><b> " + wordCount + "</b></p>";
        displayStat += "<p><em>Unique words:</em><b> " + uniqueWords + "</b></p>";
        displayStat += "<p><em>Largest word:</em><b> " + largestWord + "</b></p>";
        displayStat += "<p><em>Largest word length:</em><b> " + largestWord.length + "</b></p>";
        displayStat += "<p><em>Most of the words are </em><b>" + mod['item'] + " </b><em>characters long";
        
        if (mod['frequency'] === 1) {
            displayStat += " appears</em><b> " + mod['frequency'] + " </b><em>time</em></p>";
        }
        else {
            displayStat += " appears</em><b> " + mod['frequency'] + " </b><em>times</em></p>";
        }
        displayStat += "<p><em>Total letters:</em><b> " + text.length + "</b></p>";
        
        if (wordCount > 0) {
            displayStat += "<p>Average word length:<b> " + avgWordLen.toFixed(3) + "</p>";
        }
        
        Dialogs.showModalDialog('a',"Document Statistics", displayStat);        
    });
    
    // extension main menu
    Menus.addMenu('Extensions', 'extension.main');
    var menu = Menus.getMenu('extension.main');     
    
    // Then create a menu item bound to the command
    // The label of the menu item is the name we gave the command (see above)
    menu.addMenuItem(MENU_DOC_STATS, "Ctrl-Alt-D");
    
    menu.addMenuDivider();
    
    var MENU_ABOUT = "extension.about";
    CommandManager.register("About Extension", MENU_ABOUT, function () {
        var displayAbout = "<img style=\"float: left; margin:11px 5px 0px 0px; padding:0;\" src=\"styles/images/brackets_icon.svg\" alt=\"logo\" width=\"20\" height=\"20\"><h3 style=\"margin-bottom:-5px;\">Document Statistics</h3>";
        displayAbout += "<small>version: 0.0.1</small>";
        displayAbout += "<p>Author: Zeeshan Amjad</p>"
        displayAbout += "<p>This Brackets extension provides some basic statistical information about currently open document.</p>"
        Dialogs.showModalDialog('a',"About Document Statistics", displayAbout);
    } );
    
    menu.addMenuItem(MENU_ABOUT);    
    
  function mostFrequent(data) {
  	var count = {};
    var most = {};
    var compare = -1;
    
    data.forEach(function(n){
    	if (count[n] === undefined)
        	count[n] = 1;
        else
            count[n] += 1;
            
        if (count[n] > compare) {
            compare = count[n];
            most['item'] = n;
            most['frequency'] = count[n];
        }
    });
    
      return most;
  }    
});
