autowatch = 1
mgraphics.init();
mgraphics.relative_coords = 0;
mgraphics.autofill = 0;

// Include the JTextBox class definition
include("JTextBox_class.js");

// Define text for text box. Using the \ character to split multiple
// linse only for readbility - has no effect on the text rendering
var text = "<h1>JSUI Text Renderer\
<bd>A <st>response<bd> to the effort required to manually display JSUI text \
if you want to use <st>multiple fonts <bd>and/or font sizes or <rd>colors. \
<bd>This will also <em>word-wrap the text to a defined 'text box'! \
<cr>This is an example of a Dynamic JTextBox."

var plainText = "<h1>A HEADING<bd>A response to the effort <st>required to manually display JSUI text \
if you want to use multiple fonts and/or <bd>font sizes or colors. \
This will also word-wrap the text to a defined text box."

var text2 = "Jaded zombies acted quaintly but kept driving their oxen forward."
var text3 = "A mad boxer shot a quick, gloved jab to the jaw of his dizzy opponent. <cr>This is an example of a Static JTextBox."

var staticText = "This is an example of a Static JTextBox."

var styles = {
  "none" : {},
	"basic" : {
		"padding": 12,
		"background" : [0.8, 0.8, 0.8, 1.0],
		"color": [0.3, 0.3, 0.3, 1.0],
		"font": "Arial",
		"size": 20,
		"lineheight": 1.2,
		"align": "right",
		"bd" : {
			"size": 20
		},
		"em": {
			"font" : "Arial Italic"
		},
		"rd": {
			"color": [1.0, 0,0,1.0],
			"size" : 20
		},
		"st": {
			"color": [0,0,0.5,1],
			"size" : 20,
		},
		"h1": {
			"font": "Arial Bold",
			"size": 24,
			"lineheight": 1.2,
			"color": [0, 0,0,1.0],
		}
	},
	"style2" : {
		"background" : [0.9, 0.8, 0.0, 1.0],
		"color": [0.0, 0.0, 0.0, 1.0],
		"padding": 6,
		"font": "American Typewriter",
		"size": 12,
		"lineheight": 1.2,
		"align": "center",
		"bd": {
		},
		"st": {
		},
		"em": {
		},
		"h1": {
			"font": "Ableton Regular Bold",
			"size": 24,
			"lineheight": 1.2,
		},
		"h2": {
			"size": 14,
			"lineheight": 1.1
		}
	}
}

// Create a couple of text boxes
var myTextBox = new JTextBox(this, text, styles["basic"], 0, 0, 0, 0);
var tb2 = new JTextBox(this, text3, styles["style2"], 100, 250, 200, 150);

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

