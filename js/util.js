(function (root) {
	var util = {};


	/**
	 *	hexToRGB
	 		- Converts hex to RGB. duh
	 *	Usage:
	 		util.hextoRGB('03F');			->	[0, 51, 255]
	 		util.hextoRGB('#03F');			->	[0, 51, 255]
	 		util.hextoRGB('0033FF');		->	[0, 51, 255]
	 		util.hextoRGB('#0033FF');		->	[0, 51, 255]
	 *	from http://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
	 */
	util.hexToRGB = function (hex) {
		var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i
			.exec(hex.
				replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, function(m, r, g, b) {
					return r + r + g + g + b + b;
				}));
		return [
			parseInt(result[1], 16),
			parseInt(result[2], 16),
			parseInt(result[3], 16)
		];
	};


	/** hexToRGBA. -.-
	 *	- ugh.
	 */
	util.hexToRGBA = function (hex) {
		return util.hexToRGB(hex).concat([1]);
	};


	/** hexToRGBN
	 *	- Normalized RGB
	 */
	util.hexToRGBN = function (hex) {
		return util.hexToRGB(hex).map(function (c) {
			return c / 255;
		});
	};


	/** hexToRGBA. -.-
	 * Usage:
		util.RGBToHex(0, 51, 255)		-> 		#0033FF
		util.RGBToHex([0, 51, 255])		-> 		#0033FF
	 */
	util.RGBToHex = function (r, g, b) {
		var toHex = function (c) {
			if ((c = c.toString(16)).length === 1)
				return '0' + c;
			return c;
		};
		if (r instanceof Array) {
			r = r[0];
			g = r[1];
			b = r[2];
		}
		return ("#" + toHex(r) + toHex(g) + toHex(b)).toUpperCase();
	};

	util.pixelToN = function (a) {
		if (a instanceof Array) {
			return a.map(function (a) {
				return a / 3000;
			});
		}
		return a / 3000;
	};

	root.util = util;
}(this));

window.requestAnimFrame = (function() {
  return window.requestAnimationFrame ||
         window.webkitRequestAnimationFrame ||
         window.mozRequestAnimationFrame ||
         window.oRequestAnimationFrame ||
         window.msRequestAnimationFrame ||
         function(/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
           window.setTimeout(callback, 1000/60);
         };
})();
