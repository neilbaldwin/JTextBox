//----------------------------------------------------------------------------
// JTextBox : 'class' definition
//----------------------------------------------------------------------------
function JTextBox(parent, text, st, x, y, w, h) {

  // Default index skip (number of characters in tag e.g. ""<h1>")
  var ts = 4

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

  this.tRender = null;
  this.tImage = null;

	this.paint = function() {
		// Set defaults if any missing from style definition
		this.font = (this.style.font) ? this.style.font : "Ableton Sans Medium"
		this.fontSize = (this.style.size) ? this.style.size : 12
		this.lh = (this.style.lineheight) ? this.style.lineheight : 1.0
		this.color = (this.style.color) ? this.style.color: [0.0, 0.0, 0.0, 1.0];
		var bg = (this.style.background) ? this.style.background : [0.0, 0.0, 0.0, 0.0]
		this.p = (this.style.padding) ? this.style.padding : 8
    this.align = (this.style.align) ? this.style.align : "left"

		// Initialise some variables
		this.tx = 0
		this.ty = 0
    this.fascent = 0
    this.fdescent = 0
    this.fheight = 0

		var words = ""
		this.metrics = []

    // Flag to force rendering in certain conditions
    this.rFlag = true;

		// Calculate drawing space for word-wrap by subtracting padding
		this.tw = this.hw - this.p
		this.th = this.hh - this.p

		// Draw background rectangle and fill
		mgraphics.set_source_rgba(bg);		
		mgraphics.rectangle(this.hx, this.hy, this.hw, this.hh);
		mgraphics.fill();

		// Find and build array of indexes where tags
    // can be found in original coded text source

    var noTagHack = false

    var tagArray = []
		for (var i = 0; i < text.length; i++) {
			if (text[i] == "<") {
				var tagType = text.slice(i+1, i+3)
        if ((tagType == "cr") && (tagArray.length == 0)) {
          tagArray.push({"index": 0, "tag": "  "})
          tagArray.push({"index": i, "tag": tagType})
          noTagHack = true;
        } else {
          tagArray.push({"index": i, "tag": tagType})		
        }
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
        
        this.drawTextImage()
        this.tx = 0;
        this.ty = this.ty + (this.metrics[1] * this.lh * 2)

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
						this.color = (this.style[tag].color);
					} else {
						if (this.style.color) { this.color = (this.style.color) };
					}

          // Do this for color, font, font size and line height
					if (this.style[tag].font) {
						this.font = (this.style[tag].font)
					} else {
						this.font = (this.style.font)
					}
			
          if (this.style[tag].align) {
            this.align = (this.style[tag].align);
          } else {
            this.align = (this.style.align)
          }

					if (this.style[tag].size) {
						this.fontSize = (this.style[tag].size)
					} else {
						this.fontSize = (this.style.size)
					}
			
					if (this.style[tag].lineheight) {
						this.lh = this.style[tag].lineheight;
					} else {
						this.lh = this.style.lineheight;
					}
				}
			}

      // Special case, only create blank canvas if starting new line
      this.newTextCanvas(this.tx)

      // Extract actual text associated with this tag
      var cro = 0;
      if (noTagHack) {
        cro = (tag == "cr") ? 4 : 0;
      }
			var str = this.text.substring(tagArray[t].index + ts + cro, te).trim()
			// then split into single 'words'
			words = str.split(" ");

			// Iterrate through all words associated with current tag
			for (w = 0; w < words.length; w++) {
        if (this.tx == 0) {
          this.newTextCanvas(0)
        }
				var word = words[w]
				// Append a space unless it's the last word
				if (w < words.length-1) { word = word + " " }
				// Get text measurements for positioning calculations
        this.metrics = this.tRender.text_measure(word);
        if (this.tx + this.metrics[0] >= (this.tw - this.p)) {
          this.renderTextRow()
        }
        this.showWord(word);
			}

      // Finished rendering in current style
      if ((this.rFlag) && (t == tagArray.length-1)) {
        this.drawTextImage()
        this.rFlag = false;
      }

			// Special case for end of word list - adds whitespace before next tag
			if (t < tagArray.length-1) {
        word = " "
				this.metrics = this.tRender.text_measure(word);
        if (this.tx + this.metrics[0] >= (this.tw - this.p)) {
          this.renderTextRow()
        }
        this.showWord(word)
      }

			// Always start new line for heading
			if (tag[0] == "h") {
        this.renderTextRow()
      }
		}
    // Reset transform matrix
    mgraphics.set_matrix(1.0, 0.0, 0.0, 1.0, 0.0, 0.0);
	}

  this.getAlignOffset = function () {
    if (this.align == "left") { return this.hx + this.p }
    if (this.align == "right") { return this.hx + this.hw - this.tx - this.p }
    if (this.align == "center") { return this.hx + ((this.hw - this.tx + this.p) * 0.5) }
  }

  this.newTextCanvas = function(init) {
    if (init == 0) {
      this.tRender = new MGraphics(this.hw, this.hh)
    }
    // Setup font parameters
    this.tRender.set_source_rgba(this.color);
    this.tRender.select_font_face(this.font)
    this.tRender.set_font_size(this.fontSize, 0)

    // Get font size properties
    this.fascent = this.tRender.font_extents()[0]
    this.fdescent = this.tRender.font_extents()[1]
    this.fheight = this.tRender.font_extents()[2]
  }

  this.drawTextImage = function() {
    var tox = this.getAlignOffset()
    mgraphics.set_matrix(1.0, 0.0, 0.0, 1.0, tox, this.hy + this.p + this.ty)
     // Draw text render image to main canvas
    this.tImage = new Image(this.tRender)
    if (this.ty + this.metrics[1] < (this.th - this.p)) {
      mgraphics.image_surface_draw(this.tImage, [0, 0, this.hw, this.hh]);
    }
  }

  this.renderTextRow = function() {
    this.drawTextImage()
    this.tx = 0;
    this.ty = this.ty + (this.metrics[1] * this.lh)  
    this.newTextCanvas(0)
    this.rFlag = false;
  }

  this.showWord = function(word) {
    this.tRender.move_to(this.tx, this.fheight - this.fdescent);
    this.tRender.show_text(word);
    this.tx = this.tx + this.metrics[0]
    this.rFlag = true;
  }
}
