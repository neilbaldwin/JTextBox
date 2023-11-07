autowatch = 1
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

// Include the JTextBox class definition
include("JTextBox_class.js");

// Define text for text box. Using the \ character to split multiple
// line only for readbility - has no effect on the text rendering
var text = "<h1>JSUI Text Renderer\
<bd>A response to the effort required to manually display JSUI text \
if you want to use <st>multiple fonts <bd>and/or font sizes or <rd>colors. \
<bd>This will also <em>word-wrap the text <bd>to a defined 'text box'! \
<cr>This is an example of a Dynamic JTextBox."

var staticText = "<bd>This is an example of a Static JTextBox."

var styles = {
  "none" : {},
	"basic" : {
		"padding": 12,
		"background" : [0.7, 0.7, 0.7, 0.9],
		"color": [0.2, 0.2, 0.2, 1.0],
		"font": "Ableton Sans Regular",
		"size": 16,
		"lineheight": 1.4,
		"bd" : {
			"size": 16
		},
		"em": {
			// "size": 20
		},
		"rd": {
			"color": [1.0, 0,0,1.0]
		},
		"st": {
			"font": "Impact"
		},
		"h1": {
			"font": "Ableton Sans Bold",
			"size": 24,
			"lineheight": 1.6
		}
	},
	"style2" : {
		"background" : [0.9, 0.8, 0.0, 1.0],
		"color": [0.0, 0.0, 0.0, 1.0],
		"padding": 12,
		"font": "Ableton Sans Bold",
		"size": 12,
		"lineheight": 1.02,
		"bd": {
		},
		"st": {
		},
		"em": {
		},
		"h1": {
			"size": 14,
			"lineheight": 1.1,
		},
		"h2": {
			"size": 18,
			"lineheight": 1.1
		}
	}
}

// Create a couple of text boxes
var myTextBox = new JTextBox(this, text, styles["basic"], 0, 0, 0, 0);
var tb2 = new JTextBox(this, staticText, styles["style2"], 200, 200, 200, 200);

// JSUI Paint Function - call your text box paint function here
function paint() {
	myTextBox.paint();
	tb2.paint();
}

function onresize(w, h) {
	this.box.size(w, h);
	myTextBox.calcWindow()
	tb2.calcWindow();
	refresh();
}

