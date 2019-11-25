const colors = ["red", "orangered", "orange", "yellow", "greenyellow", "chartreuse", "green", "seagreen", "darkcyan", "lightseagreen", "aqua", "deepskyblue", "dodgerblue", "blue", "blueviolet", "violet", "pink", "black"];

//Add the stars
const stars = document.querySelector("#stars");
for (let i = 0; i < 5; i++) {
	stars.innerHTML += '<img id="star'+i+'" src="images/star.svg" height="15">';
}

// Add the color circles
const svgOptions = document.querySelector("#svgOptions");
colors.forEach(element => {
	// tabindex allows the svgs to take focus
	svgOptions.innerHTML = '<svg width="50" height="50" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg" class="option" id="'+element+'" tabindex="0">\n\t<circle class="center" cx="35.5696" cy="36.3487" r="25" fill="'+element+'"/>\n\t<circle class="outline" cx="35.5696" cy="36.3487" r="32" stroke="black" stroke-width="0"/>\n</svg>' + svgOptions.innerHTML;
	console.log(element)
});