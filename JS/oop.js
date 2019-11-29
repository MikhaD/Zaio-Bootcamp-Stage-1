class Svg {
	constructor(shapes, center, parameters) {
		this.parameters = "";
		for (let key in parameters) {
			this.parameters += `${key}="${parameters[key]}" `
		}
		this.shapes = shapes;
		this.center = center;
		this.maxWidth = 0;
		this.maxHeight = 0;
		if (this.center == true) {
			this.shapes.forEach(shape => {
				if (shape.parameters["width"] !== undefined && shape.parameters["width"] > this.maxWidth)
					this.maxWidth = shape.parameters["width"];
				if (shape.parameters["height"] !== undefined && shape.parameters["height"] > this.maxHeight)
					this.maxHeight = shape.parameters["height"];
			});
		}
	}

	addShape(shape) {
		this.shapes.push(shape);
		if (this.center) {
			if (shape.parameters["width"] !== undefined && shape.parameters["width"] > this.maxWidth)
				this.maxWidth = shape.parameters["width"];
			if (shape.parameters["height"] !== undefined && shape.parameters["height"] > this.maxHeight)
				this.maxHeight = shape.parameters["height"];
		}
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
		element.innerHTML += `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">\n\t${this.generateCode()}</svg>`;
	}
}

/**
 * @abstract
 * @constructor parameters
 */
class Shape {
	static default_size = 50;
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

class Circle extends Shape {
	constructor(size, color, strokeWidth, strokeColor, parameters) {
		parameters["r"] = (size/2)-(isNaN(strokeWidth) ? 0 : strokeWidth/2);
		parameters["fill"] = color;
		parameters["stroke-width"] = strokeWidth;
		parameters["stroke"] = strokeColor;
		super(parameters);
		this.size = size;
		this.color = color;
		this.strokeWidth = strokeWidth;
		this.strokeColor = strokeColor;
	}
	center(x, y) {
		this.parameters["cx"] = this.size/2;
		this.parameters["cy"] = this.size/2;
	}
}

class Option extends Circle {
	constructor(id, size, color) {
		this.id = id;

		super();
	}
}