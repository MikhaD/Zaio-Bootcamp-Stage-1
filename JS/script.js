//#########################################################
//#####################   CLASSES   #######################
//#########################################################

/**
 * An Svg object represents an svg, and can be made up of multiple Shape derived objects
 * @param {shapes} Array - An array of Shape derived objects
 * @param {center} boolean - Center all svg elements within the svg if true
 * @param {parameters} Object - A list of key value pairs of attributes that apply to the svg
 */
class Svg {
	constructor(shapes, center, parameters) {
		this.parameters = "";
		for (let key in parameters) {
			this.parameters += `${key}="${parameters[key]}" `
		}
		this.shapes = shapes;
		this.center = center;
		if (parameters["width"] === undefined) {
			this.maxWidth = 0;
			this.shapes.forEach(shape => {
				if (shape.parameters["width"] !== undefined && shape.parameters["width"] > this.maxWidth)
					this.maxWidth = shape.parameters["width"];
			});
		}
		else this.maxWidth = parameters["width"];
		if (parameters["height"] === undefined) {
			this.maxHeight = 0;
			this.shapes.forEach(shape => {
				if (shape.parameters["height"] !== undefined && shape.parameters["height"] > this.maxHeight)
					this.maxHeight = shape.parameters["height"];
			});
		}
		else this.maxWidth = parameters["height"];
	}

	addShape(shape) {
		this.shapes.push(shape);
		if (shape.parameters["width"] !== undefined && shape.parameters["width"] > this.maxWidth)
			this.maxWidth = shape.parameters["width"];
		if (shape.parameters["height"] !== undefined && shape.parameters["height"] > this.maxHeight)
			this.maxHeight = shape.parameters["height"];
	}

	generateCode() {
		var code = "";
		this.shapes.forEach(shape => {
			if (this.center == true) {
				shape.center(this.maxWidth, this.maxHeight);
			}
			var line = "<" + shape.constructor.name.toLowerCase();
			for (let key of Object.keys(shape.parameters)) {
				line += ` ${key}="${shape.parameters[key]}"`;
			}
			code += `${line}></${shape.constructor.name.toLowerCase()}>\n`;
		});
		return code;
	}
	addTo(element) {
		element.innerHTML += `<svg ${this.parameters}width="${this.maxWidth}" height="${this.maxHeight}" xmlns="http://www.w3.org/2000/svg">\n\t${this.generateCode()}</svg>`;
	}
}
/**
 * The abstract parent class for svg shapes
 * @abstract
 * @param {parameters} Object - A list of key value pairs of attributes that apply to the shape
 */
class Shape {
	constructor(parameters) {
		if (new.target === Shape) {
			throw new TypeError("Cannot instantiate abstract class");
		}
		this.parameters = parameters;
	}
	center(x, y) {
		this.parameters["x"] = x/2;
		this.parameters["y"] = y/2;
	}
}

class Path extends Shape {
	constructor(color, d, parameters) {
		super(parameters);
		parameters["fill"] = color;
		parameters["d"] = d;
	}
}

/**
 * A circle svg path
 * @param {size} number - The width & height of the circle
 * @param {color} string - The circle's fill color, none for transparent
 * @param {strokeWidth} number - The width of the stroke around the circle. 0 for no stroke.
 * @param {strokeColor} string - The 
 * @param {parameters} Object - A list of key value pairs of attributes that apply to the shape
 */
class Circle extends Shape {
	constructor(size, color, strokeWidth, strokeColor, parameters) {
		parameters["width"] = size;
		parameters["height"] = size;
		parameters["r"] = (size/2)-(isNaN(strokeWidth) ? 0 : strokeWidth/2);
		parameters["fill"] = color;
		parameters["stroke-width"] = strokeWidth;
		parameters["stroke"] = strokeColor;
		super(parameters);
		this.size = size;
	}
	center(x, y) {
		this.parameters["cx"] = x/2;
		this.parameters["cy"] = y/2;
	}
}

/**
 * Generate a pseudo random number between two numbers, based on a seed
 * @param {seed} number - The seed to base the random numbers on. Random objects with the same parameters will generate the same sequence
 * @param {min} number - The minimum integer to generate numbers between (inclusive)
 * @param {max} number - The maximum integer to generate numbers between (exclusive)
 */
class Random {
	constructor(seed, min, max) {
		this.seed = seed;
		this.min = min;
		this.range = Math.abs(max-min);
	}
	/**
	 * Return a random number between the min & max values specified in the constructor
	 */
	nextInt() {
		var x = Math.sin(this.seed++) * 10000;
		x -= Math.floor(x);
		x *= this.range;
		x += this.min;
		return Math.floor(x);
	}
}
//#########################################################
//####################   VARIABLES   ######################
//#########################################################

const colors = ["red", "orangered", "darkorange", "orange", "yellow", "greenyellow", "chartreuse", "green", "seagreen", "darkcyan", "lightseagreen", "deepskyblue", "aqua", "dodgerblue", "blue", "blueviolet", "darkorchid", "darkmagenta", "violet", "pink", "black"];

const root = document.documentElement;
// The id of the currently selected color
var selected;
// The span elements that display the name of the color
var colorTexts = document.getElementsByClassName("colorText");
// The quantity of the color selected
var numSelected = 0;
// The colors for the star rating
const emptyStarColor = "#444";
const fullStarColor = "#ffe600";
// The number of stars in the star rating
const numberOfStars = 5;
// The star elements
var stars = document.getElementsByClassName("star");
// The number of reviews the page has had
var reviews = 1293;
// A random number generator for the prices of the items which will stay consistant
const prices = new Random(8, 14, 25);
// The amount to discount the prices by
const discount = 1.25;

//#########################################################
//##################   FUNCTIONALITY   ####################
//#########################################################
// Space numbers out
function formatNumber(num) {
	num = String(num);
	var result = "";
	for (let i = 0, j = (num.length - 1); i < num.length; ++i, --j) {
		result += (((i) % 3 == 0) ? " " : "") + num.charAt(j)
	}
	return result.split("").reverse().join("").trim();
}
//###################################   DARKMODE   ###################################
// Toggle darkmode and ensure page maintains last selected theme on reload and revisit
(() => {
	var darkMode = localStorage.getItem("darkmode");
	
	function enableDarkmode() {
		document.body.classList.add("darkmode");
		localStorage.setItem("darkmode", "true");
		darkMode = "true";
	};
	
	if (darkMode === "true")
	enableDarkmode();
	
	document.getElementById("theme").addEventListener("click", () => {
		if (darkMode === "true") {
			document.body.classList.remove("darkmode");
			localStorage.setItem("darkmode", "false");
			darkMode = "false";
		}
		else
		enableDarkmode();
	});
})()
//#####################################   STARS   ####################################
// Ensure that your rating is there on reload if you previously made a rating
var numStars = localStorage.getItem("stars");
if (numStars === null || isNaN(numStars) || numStars > numberOfStars) {
	localStorage.setItem("stars", 0);
	numStars = 0;
	document.getElementById("reviews").innerText = `${formatNumber(reviews)} reviews`;
}
else {
	numStars = Number(numStars);
	document.getElementById("reviews").innerText = `${formatNumber(++reviews)} reviews`;
}

//Add the stars
(() => {
	var tempStars = numStars;
	for (let i = 0; i < numberOfStars; i++) {
		new Svg([new Path(emptyStarColor, "M9.098 1.917c.6-1.843 3.206-1.843 3.804 0l1.017 3.13a2 2 0 0 0 1.902 1.382h3.3c1.937 0 2.743 2.48 1.176 3.618l-2.66 1.934a2 2 0 0 0-.727 2.236l1.017 3.13c.6 1.843-1.5 3.375-3.078 2.236l-2.66-1.934a2 2 0 0 0-2.351 0l-2.66 1.934c-1.567 1.14-3.676-.393-3.078-2.236l1.017-3.13a2 2 0 0 0-.727-2.236l-2.66-1.934C.147 8.907.952 6.427 2.9 6.427h3.3a2 2 0 0 0 1.902-1.382l1.017-3.13z"
		, {"number":i, "style":`fill: ${(tempStars-- > 0) ? fullStarColor : emptyStarColor};`})], false, {"width":22, "height":20, "class":"star"}).addTo(document.querySelector("#stars"));
	}
})()
// Function executed when mousing over a star
function onStar(event) {
	if (event.target.getAttribute("class") === "star") {
		var starNum = event.target.children[0].getAttribute("number");
	}
	else
	var starNum = event.target.getAttribute("number");
	for (let i = 0; i <= starNum; ++i) {
		stars[i].children[0].style.fill = fullStarColor;
	}
}
// Function executed when mousing off a star
function offStar() {
	for (let i = 0; i < stars.length; ++i) {
		stars[i].children[0].style.fill = emptyStarColor;
	}
}
// Function executed when clicking on a star
function clickStar(event) {
	for (let i = 0; i < stars.length; ++i) {
		stars[i].removeEventListener("mouseover", onStar);
		stars[i].removeEventListener("mouseout", offStar);
	}
	offStar(event);
	onStar(event);
	if (numStars == 0)
		document.getElementById("reviews").innerText = `${formatNumber(++reviews)} reviews`;
	numStars = (Number(event.target.getAttribute("number")) + 1);
	localStorage.setItem("stars", numStars);
	// numStars = event.target.getAttribute("number");
}
// Add events to stars
for (let i = 0; i < stars.length; ++i) {
	if (numStars == 0) {
		stars[i].addEventListener("mouseover", onStar);
		stars[i].addEventListener("mouseout", offStar);
	}
	stars[i].addEventListener("click", clickStar);
}
//##################################   SET DISCOUNT   ################################
document.getElementById("discount").innerText = `${(discount-1)*100}% OFF`
//#################################   COLOR OPTIONS   ################################
// Function to add to buttons. Named function used instead of anon to save memory
function onOption(event) {
	if (event.target.getAttribute("class") === "option") {
		selected = event.target.children[0].getAttribute("fill");
		var price = event.target.getAttribute("price");
	}
	else {
		selected = event.target.getAttribute("fill");
		var price = event.target.parentNode.getAttribute("price")
	}
	
	document.getElementById("oldPrice").innerText = `$${price}`;
	document.getElementById("price").innerText = `$${Math.floor(price/discount)+0.99}`;

	root.style.setProperty("--selected", selected);
	for (let item of colorTexts) {
		item.innerText = selected;
	}
}
// Add color options
colors.forEach(element => {
	// tabindex allows the svgs to take focus
	new Svg([new Circle(30, element, 0, "none", {"class":"center"}), new Circle(40, "none", 3, "black", {"class":"outline"})], true, {"class":"option", "tabindex":0, "id": element, "price":prices.nextInt()+0.99}).addTo(document.querySelector("#svgOptions"));
});
// Select first option
onOption({"target":document.getElementById(colors[0])});
document.getElementById(colors[0]).focus();
var selected = colors[0];
// Add event listeners to color options
colors.forEach(element => {
	document.getElementById(element).addEventListener("click", onOption);
});
//#############################   BUTTON FUNCTIONALITY   #############################
// Increment number of items selected when the plus is pressed
document.getElementById("plus").addEventListener("click", () => {
	if (numSelected < 50) {
		++numSelected;
		document.getElementsByClassName("counter")[1].innerText = numSelected;
	}
});
// Decrement number of items selected when the minus is pressed
document.getElementById("minus").addEventListener("click", () => {
	if (numSelected > 0) {
		--numSelected;
		document.getElementsByClassName("counter")[1].innerText = numSelected;
	}
});
// Generate details section when continue is pressed and at least one is selected
document.getElementById("continue").addEventListener("click", () => {
	if (numSelected > 0) {
		document.getElementById("actionButton").innerText = "Checkout Now";
		document.getElementById("actionButton").setAttribute("data-target", "#checkout");
		document.getElementsByClassName("counter")[0].innerText = numSelected;
		document.getElementById("details").innerHTML = "";
		for (let i = 0; i < numSelected; ++i) {
			new Svg([new Circle(20, selected, 0, "black", {})], true, {"class":"selection"}).addTo(document.getElementById("details"));
		}
	}
});
// Remove details when cancel is pressed
document.getElementById("cancelBtn1").addEventListener("click", () => {
	if (numSelected > 0) {
		document.getElementsByClassName("counter")[1].innerText = 0;
		numSelected = 0;
	}
});
// Refresh page when checkout is pressed
document.getElementById("checkoutBtn").addEventListener("click", () => {
	document.body.innerHTML = "Thank you for your Purchase!";
	document.body.classList.add("thanks");
	setTimeout(() => {
		window.location.reload(false);
	}, 3000);
});
// Set counters to 0 and 
document.getElementById("cancelBtn2").addEventListener("click", () => {
	document.getElementsByClassName("counter")[0].innerText = 0;
	document.getElementById("actionButton").innerText = "Add to cart";
	document.getElementById("actionButton").setAttribute("data-target", "#quantity");
	details.innerHTML = "";
	document.getElementById("orders").innerHTML = "";
	// Set price to 0
});