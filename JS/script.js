const colors = ["red", "orangered", "darkorange", "orange", "yellow", "greenyellow", "chartreuse", "green", "seagreen", "darkcyan", "lightseagreen", "aqua", "deepskyblue", "dodgerblue", "blue", "blueviolet", "darkorchid", "darkmagenta", "violet", "pink", "black"];

var root = document.documentElement;
var selected;

//Add the stars
const stars = document.querySelector("#stars");
for (let i = 0; i < 5; i++) {
	stars.innerHTML += '<img id="star'+i+'" src="images/star.svg" height="15">';
}

// Add the color circles
const svgOptions = document.querySelector("#svgOptions");
colors.forEach(element => {
	// tabindex allows the svgs to take focus
	svgOptions.innerHTML += '<svg viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" class="option" id="'+element+'" tabindex="0">\n\t<circle class="center" cx="35.5696" cy="36.3487" r="25" fill="'+element+'"/>\n\t<circle class="outline" cx="35.5696" cy="36.3487" r="32" stroke="black" stroke-width="0"/>\n</svg>';
});

var colorTexts = document.getElementsByClassName("colorText");
// Find a way to add these event listeners without having to run through colors twice
colors.forEach(element => {
	document.getElementById(element).addEventListener("click", () => {
		// consider making a named function which detects which option was clicked instead of multiple anonymous functions
		selected = element;
		root.style.setProperty("--selected", selected);
		for (let item of colorTexts) {
			item.innerText = selected;
		}
	});
});

var numSelected = 0;

// use closure instead of delaring variables outside the function?
var counters = document.getElementsByClassName("counter");
// Increase or decrease the number of items selected when the plus and minus buttons are pressed
document.getElementById("plus").addEventListener("click", () => {
	if (numSelected < 50) {
		++numSelected;
		counters[1].innerText = numSelected;
	}
});

document.getElementById(colors[0]).focus();
var selected = colors[0];

document.getElementById("minus").addEventListener("click", () => {
	if (numSelected > 0) {
		--numSelected;
		counters[1].innerText = numSelected;
	}
});

var details = document.getElementById("details");

document.getElementById("continue").addEventListener("click", () => {
	if (numSelected > 0) {
		document.getElementById("actionButton").innerText = "Checkout Now";
		counters[0].innerText = numSelected;
		details.innerHTML = "";
		for (let i = 0; i < numSelected; ++i) {
			details.innerHTML += '<svg width="30" height="30" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">\n\t<circle cx="35.5696" cy="36.3487" r="25" fill="'+selected+'"/>\n</svg>';
		}
	}
});

document.getElementById("cancel").addEventListener("click", () => {
	if (numSelected > 0) {
		counters[1].innerText = 0;
		numSelected = 0;
		// remove once checkout is implemented
		counters[0].innerText = 0;
		document.getElementById("actionButton").innerText = "Add to cart";
		details.innerHTML = "";
	}
});

// Toggle darkmode and ensure page maintains last selected theme on reload and revisit
var darkMode = localStorage.getItem("darkmode");

const enableDarkmode = () => {
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
