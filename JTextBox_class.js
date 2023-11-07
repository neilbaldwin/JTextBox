//----------------------------------------------------------------------------
// JTextBox : class definition
//----------------------------------------------------------------------------
function JTextBox(parent, text, st, x, y, w, h) {
	this.parent = parent
	this.text = text;
	this.style = st
  if ((w == 0) && (h == 0)) {
    this.hx = 0;
    this.hy = 0;
    this.hw = this.parent.box.rect[2] - this.parent.box.rect[0]
    this.hh = this.parent.box.rect[3] - this.parent.box.rect[1]
    this.resize = true
  } else {
    this.hx = x
    this.hy = y
    this.hw = w
    this.hh = h
    this.resize = false
  }
	
	this.calcWindow = function() {
    if (this.resize) {
      this.hw = (this.w > 0) ? this.w : this.parent.box.rect[2] - this.parent.box.rect[0]
      this.hh = (this.h > 0) ? this.h : this.parent.box.rect[3] - this.parent.box.rect[1]  
    }
	}
	
	this.paint = function() {
		// Set defaults if any missing from style definition
		var f = (this.style.font) ? this.style.font : "Ableton Sans Regular"
		var fs = (this.style.size) ? this.style.size : 12
		var lh = (this.style.lineheight) ? this.style.lineheight : 1.0
		var color = (this.style.color) ? this.style.color: [0.0, 0.0, 0.0, 1.0];
		var bg = (this.style.background) ? this.style.background : [0.0, 0.0, 0.0, 0.0]
		var p = (this.style.padding) ? this.style.padding : 8

		// Initialise some variables
		var tx = 0
		var ty = 0
		var words = ""
		var metrics = []

		// Calculate drawing space for word-wrap by subtracting padding
		var tw = this.hw - p
		var th = this.hh - p

		// Default index skip (number of characters in tag e.g. ""<h1>")
		var ts = 4

		// Draw background rectangle and fill
		mgraphics.set_source_rgba(bg);		
		mgraphics.rectangle(this.hx, this.hy, this.hw, this.hh);
		mgraphics.fill();

		// Find and build array of indexes where tags
    // can be found in original coded text source
		var tagArray = []
		for (var i = 0; i < text.length; i++) {
			if (text[i] == "<") {
				var tagType = text.slice(i+1, i+3)
				tagArray.push({"index": i, "tag": tagType})		
			}
		}
		// If no tags, add a blank tag so that renderer has something to do
		if (tagArray.length == 0) {
			tagArray.push({"index": 0, "tag": "  "})
		}

		// Iterrate tag array
		for (var t = 0; t < tagArray.length; t++) {
			var te = (t < tagArray.length-1) ? tagArray[t+1].index : text.length;
			var tag = tagArray[t].tag

			// If tag is "cr" then perform a 'carriage return' (new line)
			if (tag == "cr") {
				tx = 0;
				ty = ty + (metrics[1] * lh * 2)
			} else if (tag == "  ") {
				// Blank tag if no tags are found in text string
				ts = 0
			} else {
				ts = 4
				// Override default style only if a tag definition is present
				// in the current style definition dict
				if (this.style[tag]) {

          // If no property found for this tag, set property from base style
					if (this.style[tag].color) {
						color = (this.style[tag].color);
					} else {
						if (this.style.color) { color = (this.style.color) };
					}

          // Do this for color, font, font size and line height
					if (this.style[tag].font) {
						f = (this.style[tag].font)
					} else {
						f = (this.style.font)
					}
			
					if (this.style[tag].size) {
						fs = (this.style[tag].size)
					} else {
						fs = (this.style.size)
					}
			
					if (this.style[tag].lineheight) {
						lh = this.style[tag].lineheight;
					} else {
						lh = this.style.lineheight;
					}
				}
			}

			// Draw and fill background rectangle
			mgraphics.set_source_rgba(color);
			mgraphics.select_font_face(f)
			mgraphics.set_font_size(fs, 0)

			// Get font size properties
			var ascent = mgraphics.font_extents()[0]
			var descent = mgraphics.font_extents()[1]
			var height = mgraphics.font_extents()[2]
		
			// Extract actual text associated with this tag
			var str = this.text.substring(tagArray[t].index + ts, te).trim()
			// then split into single 'words'
			words = str.split(" ");

			// Iterrate through all words associated with current tag
			for (w = 0; w < words.length; w++) {
				var word = words[w]
				// Append a space unless it's the last word
				if (w < words.length-1) { word = word + " " }

				// Get text measurements for positioning calculations
				metrics = mgraphics.text_measure(word);
				// If word position larger than text box width wrap to next line
				if (tx + metrics[0] > tw - p) {
					tx = 0;
					ty = ty + (metrics[1] * lh)
				}
				// If drawing position still inside text box then draw (vertical clipping)
				if (ty + metrics[1] < th) {
					mgraphics.move_to(this.hx + p + tx, this.hy + p + ty + height - descent)
					mgraphics.show_text(word);
					tx = tx + metrics[0]	
				}
			}

			// Special case for end of word list - adds whitespace before next tag
			if (t < tagArray.length-1) {
				word = " "
				metrics = mgraphics.text_measure(word);
				// Word wrap and vertical clipping like before
				if (tx + metrics[0] > tw - p) {
					tx = 0;
					ty = ty + (metrics[1] * lh)
				}
				if (ty + metrics[1] < th){
					mgraphics.move_to(this.hx + p + tx, this.hy + p + ty + height - descent)
					mgraphics.show_text(word);
					tx = tx + metrics[0]	
				}
			}

			// Always start new line for heading
			if (tag[0] == "h") {
				ty = ty + (metrics[1] * lh);
				tx = 0;					
			}
		}
	}
}
