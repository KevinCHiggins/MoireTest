

document.querySelector("#render-button").addEventListener("click", switchRender);
document.querySelector("#move-up-button").addEventListener("click", function() {move(1); });
document.querySelector("#move-down-button").addEventListener("click", function() {move(-1); });
document.querySelector("#masked-button").addEventListener("click", function() {masking(this.value)});
document.querySelector("#unmasked-button").addEventListener("click", function() {masking(this.value)});
document.querySelector("#sent-to-mask-button").addEventListener("click", function() {masking(this.value)})
document.querySelector("#next-button").addEventListener("click", switchEl);
document.querySelector("#delete-button").addEventListener("click", deleteShape);
document.querySelector("#dl-button").addEventListener("click", downloadSvg);
document.querySelector("#concealed-dl-link").addEventListener("click", function() { this.style.display = "none"; })
document.querySelector("#dash-array-field").addEventListener("input", function() { changeDashArray(this.value) });
document.querySelector("#stroke-width-field").addEventListener("change", function() { changeStrokeWidth(this.value) });

document.querySelector("#disabled-radius-field").addEventListener("change", function() { changeRadius(this.value) });
document.querySelector("#col-button").addEventListener("change", function() { changeColour(this.value) });
document.querySelector("#fill-button").addEventListener("change", function() { fill(this.checked) });
document.querySelector("#add-shape-button").addEventListener("click", function() { addShape(document.querySelector("#add-shape-menu").value);});
var dragged = false;
var xhttp = new XMLHttpRequest();
var handleSize = 10;
var dragUpdates = 0;
var handles = [];
var timeLastDragged= new Date();
var shapes = [];
var shapeMasking = []; // 2D array, 2 members in each subarray: boolean masked (false means part of mask) and a string, which for now is always = MASK_NAME; empty string, unmasked
const MASK_NAME = "mask1";
var filename = "svg/desert.svg";
const CLIPPING_WORKAROUND = " M 0 0 M 500 500";
var loadedDefinitions;
var selectedHandle = -1;
var selectedShapeId = 0; // there'll always be a shapes selected; start with first member of array selected
var svgObject;
function addShape(shapeType) {
	//could have an array to translate between menu values and svg element names!
	// sort out shapeMasking and shapes as follows: add an empty shape on top; copy all above selected to place above; create new shape; add it after selected; set unmasked; select new shape; call masking with unmasked - check shape can't cover handles
	console.log("Adding", shapeType);
	let newShape = null;
	if (shapeType == "Hatching") {
		newShape = document.createElementNS("http://www.w3.org/2000/svg", "line");
		newShape.setAttributeNS(null, "x1", 200);
		newShape.setAttributeNS(null, "y1", 200);
		newShape.setAttributeNS(null, "x2", 205);
		newShape.setAttributeNS(null, "y2", 205);
		newShape.setAttributeNS(null, "stroke-dasharray", "1,1");
		newShape.setAttributeNS(null, "stroke-width", 100);
		newShape.setAttributeNS(null, "stroke", "#444466");
	}
	else if (shapeType == "Rectangle") {
		newShape = document.createElementNS("http://www.w3.org/2000/svg", "rect");
		newShape.setAttributeNS(null, "x", 200);
		newShape.setAttributeNS(null, "y", 200);
		newShape.setAttributeNS(null, "width", 205);
		newShape.setAttributeNS(null, "height", 205);
		newShape.setAttributeNS(null, "stroke-width", 1);
		newShape.setAttributeNS(null, "fill", "#444466");
		newShape.setAttributeNS(null, "stroke", "#444466");
	}
	else if (shapeType == "Circle") {
		newShape = document.createElementNS("http://www.w3.org/2000/svg", "circle");
		newShape.setAttributeNS(null, "cx", 200);
		newShape.setAttributeNS(null, "cy", 200);
		newShape.setAttributeNS(null, "r", 205);
		newShape.setAttributeNS(null, "stroke-width", 1);
		newShape.setAttributeNS(null, "fill", "#444466");
		newShape.setAttributeNS(null, "stroke", "#444466");			
	}
	else if (shapeType == "Quadratic curve") {
		newShape = document.createElementNS("http://www.w3.org/2000/svg", "path");
		newShape.setAttributeNS(null, "d", "M 200 200 q -50 0 0 50" + CLIPPING_WORKAROUND); // put in workaround here too just to avoid edge case of unedited curve lacking workaround
		newShape.setAttributeNS(null, "stroke-dasharray", "1,1");
		newShape.setAttributeNS(null, "stroke-width", 100);
		newShape.setAttributeNS(null, "fill", "none");
		newShape.setAttributeNS(null, "stroke", "#444466");	
	}


	console.log("Built", newShape);

	//if selected is highest then just push... else push highest el onto next position in array; shift up any/all between el and selected; insert new before shape after selected
	//AND SAME WITH MASKING
	if (selectedShapeId == shapes.length - 1) {
		console.log("New shape added to end of svgObject and array and masking");
		shapes.push(newShape);
		shapeMasking.push(maskOpt(0, ""));
		switchEl();
		svgObject.appendChild(shapes[selectedShapeId]); // trivial point, but, I should check my style elsewhere - do I use the "newShape" or index the array?
	}
	else { // my first approach of shifting all elements up was never gonna work - first I need to find the lowest object in the array that's **NOT** in the mask
		// go up through all shapes higher than selected and check if svgObject is parentNode (hmm it's simpler than shapeMasking) - if so, insert before; if none found append
	//FIXME _________________________________________ okay, I see, there are two imperatives here and I only satisfied one, of putting the shape in the right place in 
	//the document... it also needs to be put into the array which is an unrelated problem actually and simply shifting elements WILL work there
		let placeFound = false;
		console.log("id",selectedShapeId,"length",shapes.length);
		for (i = selectedShapeId + 1; i < shapes.length; i++) {
			if (shapes[i].parentNode == svgObject) {
				svgObject.insertBefore(newShape, shapes[i]);
				placeFound = true;
			}
		}
		if (!placeFound) {
			svgObject.appendChild(newShape);
		}

		// need to shift up! Start by creating the new space (actually by pushing the last element up into it)
		let origTopPos = shapes.length - 1;
		shapes.push(shapes[origTopPos]); 
		console.log("After push it", shapes);
		shapeMasking.push(shapeMasking[origTopPos]);
		for (i = shapes.length - 2; i > selectedShapeId; i--) { // note: if the new shape is being inserted 2nd last, this won't run at all
			shapes[i] = shapes[i - 1];
			shapeMasking[i] = shapeMasking[i - 1];
		}
		console.log("After insert", shapes);
		shapes[selectedShapeId + 1] = newShape; // insert new shape INTO THE ARRAY at the position after the selected (previously) shape
		shapeMasking[selectedShapeId + 1] = maskOpt(0, ""); // same for masking
		switchEl(); // this will among other things UPDATE THE SELECTION
		//svgObject.insertBefore(newShape, shapes[selectedShapeId + 1]); // insert before the shape above newShape in the array - due to just calling switchEl, newShape is selected!
	}

	masking("unmasked");

	redrawHandles();

}
function maskOpt(isMasked, name) {
	let options = [];
	options.push(isMasked);
	options.push(name);
	return options;
}
function masking(value) {
	let maskingOptions = [];
	let shape = shapes[selectedShapeId];
	console.log(shape);
	let mask = document.getElementById(MASK_NAME); // assuming it's there, but we put it in during loading
	if (value == "sent") {
		shape.parentNode.removeChild(shape);
		console.log("sent");
		
		if (mask.children != null && mask.children.length > 0) { // D'OH! I had this " length > 1" but of course there need only be 1+, not 2+ others, as current's been removed
			console.log("Mask has multiple members now"); // FIXME deal with order... a little more complex than with shapes____________________________________________
			let onTop = true;
			for (i = selectedShapeId + 1; i < shapeMasking.length; i++) { // search for shapes in mask that are later in display order
				console.log("checking position of", i, shapes[i]);
				if (!shapeMasking[i][0] && shapeMasking[i][1] == MASK_NAME) {
					console.log("inserted before", i);
					mask.insertBefore(shape, shapes[i]);
					onTop = false;
					break;
				}
			}
			if (onTop) { // no shape was found later in display order... this check is to avoid putting the current shape in twice ()
				mask.appendChild(shape);

			}
			
		}
		else {
			mask.appendChild(shape);
		}
		maskingOptions = maskOpt(false, MASK_NAME);
		console.log("nwo a child of ", shape.parentNode);
	}
	else if (value == "masked") { 
		console.log("y", shape);
		shape.parentNode.removeChild(shape);
		let onTop = true;
		if (selectedShapeId < shapes.length - 1) { // if the currently selected shape is NOT the last i.e. NOT to be displayed on top
			console.log("Searching where to slip in");
			for (i = selectedShapeId + 1; i < shapes.length; i++) { //search for shapes later in display order
				if (shapeMasking[i][0] || shapeMasking[i][1] == "") { // if the later shape is NOT in the mask, insert current shape before it in display order
					console.log("shape", i,"is not In the mask")
					svgObject.insertBefore(shape, shapes[i]);
					onTop = false;
					break;
				}
			}
		}
		if (onTop) { // it's last, add on top of other shapes
			console.log("on top, masked");
			svgObject.appendChild(shape); 
			redrawHandles();
		}
		
		

		maskingOptions = maskOpt(true, MASK_NAME);
		shapes[selectedShapeId].setAttributeNS(null, "mask", "url(#" + MASK_NAME + ")");
		console.log("Setting mask");
		
	}
	else {//make this a default case too just in case of weird input, but it should be "unmasked" _______________________________
		//check if it was previously sent to mask:

		console.log("y", shape);
		console.log(shape.parentNode);
		shape.setAttributeNS(null, "mask", "");
		shape.parentNode.removeChild(shape);
		let onTop = true;
		if (selectedShapeId < shapes.length - 1) { // if the currently selected shape is NOT the last i.e. NOT to be displayed on top
			console.log("searching for later shapes");
			for (i = selectedShapeId + 1; i < shapes.length; i++) { //search for shapes later in display order
				console.log("Is shape", i, " in the mask?", shapeMasking[i][0]);
				if (shapeMasking[i][0] || shapeMasking[i][1] == "") { // if the later shape is NOT in the mask, insert current shape before it in display order
					svgObject.insertBefore(shape, shapes[i]);
					onTop = false;
					break;
				}
			}
		}
		if (onTop) { // it's last, add on top of other shapes
			console.log("Shape ", selectedShapeId, "Top");
			svgObject.appendChild(shape); 
			redrawHandles();
		}
		
		maskingOptions = maskOpt(false, "");
	}

	shapeMasking[selectedShapeId] = maskingOptions;
	console.log(shapeMasking[selectedShapeId]);
}
function switchRender() {
	console.log(svgObject.getAttribute("shape-rendering"));
	if (svgObject.getAttribute("shape-rendering") == "crispEdges") {
		svgObject.setAttribute("shape-rendering", "geometricPrecision");
	}

	else if (svgObject.getAttribute("shape-rendering") == "geometricPrecision") {
		svgObject.setAttribute("shape-rendering", "crispEdges");
	}
	console.log(svgObject.getAttribute("shape-rendering"));
}
xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
    	console.log("Going to setup with " + this);
    	setupSvg(this);
    }
};
function move(amount) {
	if (amount == 0) return;
	var newPos = selectedShapeId + amount;
	if (newPos > shapes.length - 1) {
		newPos = shapes.length - 1;
	}
	else if (newPos < 0) {
		newPos = 0;
	}
	var increment = amount / Math.abs(amount); //find out which way to move, i.e. increment 1 or -1, in case amount was larger than 1 or less than -1
	console.log(increment);
	for (i = 0; i < (Math.abs(selectedShapeId - newPos)); i++) { //the selected shape moves along by 1 or -1, swapping with the shape in its target position, till it reaches newPos
		tempShape = shapes[selectedShapeId];
		tempMasking = shapeMasking[selectedShapeId];
		shapes[selectedShapeId] = shapes[selectedShapeId + increment];
		shapeMasking[selectedShapeId] = shapeMasking[selectedShapeId + increment];
		shapes[selectedShapeId + increment] = tempShape;
		shapeMasking[selectedShapeId + increment] = tempMasking;
		selectedShapeId = selectedShapeId + increment;
	}
	console.log("Position now " + selectedShapeId);
	console.log("Shape masking array at", selectedShapeId, "is now", shapeMasking[selectedShapeId][0], shapeMasking[selectedShapeId][1]);
	let maskingState = "unmasked";
	if (shapeMasking[selectedShapeId][0]) {
		maskingState = "masked";
	}
	else if (shapeMasking[selectedShapeId][1] == MASK_NAME) {
		maskingState = "sent";
	}
	console.log("Reinserting shape with state", maskingState);
	masking(maskingState);

}
xhttp.open("GET", filename, true);
xhttp.send();
function copySvgAttr(orig, copy, attr) {
	//console.log(copy, orig, attr);
	copy.setAttributeNS(null, attr, orig.getAttributeNS(null, attr));
}
function setupSvg(xml) {
	loadedSVG = xml.responseXML.firstChild;

	var loadedElements = loadedSVG.children;
	console.log(loadedElements);
	if (loadedElements.length == 0) {
		console.log("No SVG elements loaded.");
		window.alert("No SVG elements loaded. Stopping script.")
		debugger;
	}
	var j = 0;
	//Messy-----------------------------------------------
	console.log("loade length" + loadedElements.length);
	var shapesInMask = []; // initialise to an empty array - maybe no masked shapes will be loaded in which case the loop at the end of this function will run 0x
	for (i = 0; i < loadedElements.length; i++) {
		if (loadedElements[i].nodeName == "defs") { // only compatible with one defs element, which I think is fair enough
			loadedDefinitions = loadedElements[i].cloneNode();
			loadedDefinitions.innerHTML = loadedElements[i].innerHTML;
			console.log("Loaded defs", loadedDefinitions);
		}
		// put masked shapes into their own array for the mo
		console.log(loadedDefinitions);
		shapesInMask = loadedDefinitions.getElementsByTagName("mask")[0].children;
		console.log(shapesInMask);

		if (loadedElements[i].nodeName == "circle" |loadedElements[i].nodeName == "rect" | loadedElements[i].nodeName == "line" | loadedElements[i].nodeName == "path") {

			shapes[j] = loadedElements[i].cloneNode(true);
			if (shapes[j].nodeName == "path" && shapes[j].getAttributeNS(null, "d").substring(shapes[j].getAttributeNS(null, "d").length - 16) != CLIPPING_WORKAROUND) { // SUPER HARD CODED
				console.log("SHape", j, "got the workaround");
				shapes[j].setAttributeNS(null, "d", shapes[j].getAttributeNS(null, "d") + CLIPPING_WORKAROUND); //mask clipping workaround!!
			}
			if (shapes[j].getAttributeNS(null, "fill") == null) { // I'm not dealing with the edge case of a loaded shape with no fill and no stroke...
				shapes[j].setAttributeNS(null, "fill", "none");
			}
			else if (shapes[j].getAttributeNS(null, "fill") == "none") {} // there is a a stroke (I assume) but fill is set to "none", so leave it
			else { // in this app, there's only one colour per shape, so if there is a fill here, set the stroke to be of the same colour
				shapes[j].setAttributeNS(null, "stroke", standardiseColour(shapes[j].getAttributeNS(null, "fill")));
			}
			// FIXME load masking info!
			let maskingOptions = [];
			let maskString = shapes[j].getAttributeNS(null, "mask");
			console.log("shape",j,"String",maskString,".");
			var maskName = ""; // a default option ... going with var for scoping
			maskingOptions[0] = false; // default is not masked
			if (maskString.length > 0) {
				maskName = "url(#" + maskString.substring(5, maskString.length - 1)+ ")";
				maskingOptions[0] = true; // it is masked!
				console.log("Found (within a shape not itself in a mask) mask ref named ", maskName);
			}

			
			maskingOptions[1] = maskName;
			shapeMasking[j] = maskingOptions;
			console.log("loaded" + loadedElements[i].nodeName);
			j++;
		}
	}
	console.log(shapes.length + " shapes loade?");
	svgFrame = document.querySelector(".svg-panel");
	console.log(svgFrame.firstChild);
	svgFrame.removeChild(svgFrame.firstChild);
	svgObject = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	copySvgAttr(loadedSVG, svgObject, "id");
	//copySvgAttr(loadedSVG, svgObject, "xmlns");
	copySvgAttr(loadedSVG, svgObject, "viewBox");
	copySvgAttr(loadedSVG, svgObject, "height");
	copySvgAttr(loadedSVG, svgObject, "width");
	copySvgAttr(loadedSVG, svgObject, "shape-rendering");
	if (loadedDefinitions != undefined) { // if a defs element was loaded, append it first
		svgObject.appendChild(loadedDefinitions);
		console.log("defs loaded");
	}
	else {
		let createdDefinitions = document.createElementNS("http://www.w3.org/2000/svg", "defs");
		svgObject.appendChild(createdDefinitions);
		console.log("defs created");
	}
	if (!document.querySelector("" + MASK_NAME)) { // check if there is the mask we want (i.e. named the way this app names it)
		console.log("ADDING MASK");
		//defs go before shapes... of course, this is not compatible with any 
		definitions = svgObject.getElementsByTagName("defs")[0];
		console.log(definitions);
		mask = document.createElementNS("http://www.w3.org/2000/svg", "mask");
		mask.setAttributeNS(null, "id", MASK_NAME);

		definitions.appendChild(mask);	
		svgObject.appendChild(definitions);
	}

	//svgFrame.replaceChild(svgObject, svgFrame.firstChild);

	for (i = 0; i < shapes.length; i++) { // append all loaded shapes APART FROM ONES WITHIN THE MASK
		console.log("i is " + i);
		
		svgObject.appendChild(shapes[i]);

		console.log("Element copied to final SVG obj");
	}

	// add all shapes within the mask to the shapes array - in this case, I throw them on the top (having lost original order info) - and fill in the appropriate masking options
	for (i = 0; i < shapesInMask.length; i++) {
		shapes.push(shapesInMask[i]);
		shapeMasking.push([false, "mask1"]);
	}

	document.querySelector("#col-button").value = standardiseColour(shapes[selectedShapeId].getAttributeNS(null, "stroke"));
	console.log(shapes.length, "elements loaded!");
	//svgObject = 
	setControls();
	resetHandles(shapes[selectedShapeId]);

	svgFrame.appendChild(svgObject);	
}


//var svgObject = document.getElementById("vector");
function downloadSvg() {
	for (i = 0; i < handles.length; i++) {
		svgObject.removeChild(document.querySelector("#handle" + i));
		console.log("removed handles");
	}
	var svgArray = [];
	svgText = '<svg xmlns="http://www.w3.org/2000/svg" id="vector" viewBox="0 0 500 500" height="500" width="500" shape-rendering="crispEdges">';
	svgText += svgObject.innerHTML + "</svg>";
	svgArray[0] = svgText;
	var blob = new Blob(svgArray, {type: "text/html"});
	var link = document.querySelector("#concealed-dl-link");
	link.style.display = "inline";
	link.href = URL.createObjectURL(blob);
	link.download = new Date().toLocaleString() + ".svg";
	resetHandles(shapes[selectedShapeId]);
}
function standardiseColour(str){ //Thanks to JayB on SO
    var ctx = document.createElement("canvas").getContext("2d");
    ctx.fillStyle = str;
    return ctx.fillStyle;
}
function deleteShape(e) {
	
	// remove selected from its parentNode; shift down all els above selected; pop highest; 
	console.log("Deleting shape id", selectedShapeId, "with parent", shapes[selectedShapeId].parentNode, "which is", shapes[selectedShapeId]);
	shapes[selectedShapeId].parentNode.removeChild(shapes[selectedShapeId]);
	if (selectedShapeId == shapes.length - 1) {
		shapes.pop();
		shapeMasking.pop();
	}
	else {
		for (i = selectedShapeId; i < shapes.length - 2; i++) { // yes, it's okay to use array length here despite recent my slip ups on that! -2 is because the top is done separately
			console.log("i is ", i);
			shapes[i] = shapes[i + 1];
			shapeMasking[selectedShapeId] = shapeMasking[selectedShapeId + 1];
		}
		console.log("Shapes.length", shapes.length,"shape at shapes.length - 2", shapes[shapes.length - 2]);
		shapes[shapes.length - 2] = shapes.pop();
		console.log(shapes[shapes.length -1]);
		shapeMasking[shapeMasking.length - 2] = shapeMasking.pop();
	}

	console.log("selected", selectedShapeId);
	if (selectedShapeId == shapes.length) {
		console.log("going back one");
		selectedShapeId = shapes.length - 2; //dodgy fake here - going back to to call switchEl to go forward 1!
		
	}
	switchEl();
	
}
function switchEl(e) {
	for (i = 0; i < handles.length; i++) {
		console.log(i);
		console.log(svgObject);
		console.log(svgObject.querySelector("#handle" + i));
		svgObject.removeChild(svgObject.querySelector("#handle" + i));
	}
	if (shapes.length > 0) { // if there are any remaining shapes
		if (selectedShapeId  < shapes.length - 1) { selectedShapeId++; } else { selectedShapeId = 0; }
		document.querySelector("#col-button").value = standardiseColour(shapes[selectedShapeId].getAttributeNS(null, "stroke"));

		resetHandles(shapes[selectedShapeId]);
		console.log("Shape no.", selectedShapeId);
		setControls()
	}
	else {
		
		selectedShapeId = -1; // original "none" value and also compatible with addShape's search
		disableEdits();

	}
;
}
function disableEdits() { // for when no shape is selected
	handles = []; 
}
function changeStrokeWidth(val) {
	shapes[selectedShapeId].setAttributeNS(null, "stroke-width", val);
}
function changeRadius(val) { // gonna skimp on validation here and assume that my concealing logic means this will never be called without a circle selected
	shapes[selectedShapeId].setAttributeNS(null, "r", val);
	console.log("RRRR");
}
function changeColour(val) {
	shapes[selectedShapeId].setAttributeNS(null, "stroke", val);
	console.log(shapes[selectedShapeId].nodeName, shapes[selectedShapeId].getAttributeNS(null, "fill"));
	if (shapes[selectedShapeId].getAttributeNS(null, "fill") == "none") {
		
		console.log("No fill");
	}
	else {
		console.log("fill");
		shapes[selectedShapeId].setAttributeNS(null, "fill", val);
	}
}
function changeDashArray(val) {
	shapes[selectedShapeId].setAttributeNS(null, "stroke-dasharray", val);
}
function fill(isFilled) {
	if (isFilled) {
		shapes[selectedShapeId].setAttributeNS(null, "fill", document.getElementById("col-button").value);
	}
	else {
		shapes[selectedShapeId].setAttributeNS(null, "fill", "none");
	}
}
function manifestHandle(x, y) {
	console.log("make");
	var newHandle = document.createElementNS("http://www.w3.org/2000/svg", "rect");
	newHandle.setAttributeNS(null, "x", x - handleSize / 2); //handle is around centre point
	newHandle.setAttributeNS(null, "y", y - handleSize / 2);
	newHandle.setAttributeNS(null, "width", handleSize);
	newHandle.setAttributeNS(null, "height", handleSize);
	newHandle.setAttributeNS(null, "fill", "red");
	newHandle.setAttributeNS(null, "class", "draggable");
	newHandle.setAttributeNS(null, "id", "handle" + i);
	newHandle.addEventListener("mousedown", startDragging);
	document.addEventListener("mousemove", drag);
	newHandle.addEventListener("mouseup", endDragging);
	console.log("hwre is it??" + newHandle.getAttributeNS(null, "id") + x + y);
	svgObject.appendChild(newHandle);
}
function getId(handle) {
	return handle.getAttributeNS(null, "id").charAt(6);
}
function startDragging(e) {
	console.log("boom");
	thisHandle = e.currentTarget;
	selectedHandle = getId(thisHandle);
	grabX = e.offsetX - handles[selectedHandle][0];
	grabY = e.offsetY - handles[selectedHandle][1];
	console.log("Graby" + grabX);
	console.log("Graby" + grabY);
	console.log((handles[selectedHandle][0]) + " " + (handles[selectedHandle][1])); 
}
function drag(e) {
	if (selectedHandle >= 0) { //drawing the lines is making it hard to mouseup
		newX = e.offsetX - grabX;
		newY = e.offsetY - grabY;
		handles[selectedHandle][0] = newX;
		handles[selectedHandle][1] = newY;
		console.log((handles[selectedHandle][0]) + " " + (handles[selectedHandle][1])); 
		handle = document.querySelector("#handle" + selectedHandle);
		handle.setAttributeNS(null, "x", newX - handleSize / 2); //this should be a method that handles it in one place
		handle.setAttributeNS(null, "y", newY - handleSize / 2);
		time = new Date();
		redrawHandles(); // so they'll be displayed on top - quick and dirty fix
		updateShape(shapes[selectedShapeId]);
		console.log("Update took", new Date() - time);	//this shows that it's not the function call to UpdateShape that takes time, it's the browser rendering after
	}
}
function endDragging(e) {
	selectedHandle = -1;
	dragged = false;

}
function redrawHandles() {
	for (i = 0; i < handles.length; i++) {
		handle = svgObject.querySelector("#handle" + i);
		svgObject.removeChild(handle);
		svgObject.appendChild(handle); //quick fix of order of displaying
	}
}
function updateShape(shape) {
	//dragUpdates += 1;
	//console.log("Update " + dragUpdates);
	var stroke = shape.getAttributeNS(null, "stroke");
	
	if (shape.nodeName == "line") {
		handleX = handles[selectedHandle][0];
		handleY = handles[selectedHandle][1];
		if (selectedHandle== 0){
		
			shape.setAttributeNS(null, "x1", handleX);
			shape.setAttributeNS(null, "y1", handleY);
		}
		else {
			shape.setAttributeNS(null, "x2",handleX);

			shape.setAttributeNS(null, "y2", handleY);
		}
	}
	else if (shape.nodeName == "rect") { // find bounds of rectangle determined by current handle and opposite handle, while finding new handle id;
										// realise bounds as rect; reset handles

		// id of opposite handle, found by bitwise NOT (and a mask to avoid getting the 1's complement)
		var oppHandle = ~selectedHandle & 3;

		var newHandleId = 0; // we'll build up the newHandleId (either 0, 1, 2 or 3 - a new place in the handles array for the handle which is perceptually 
		// the same as the previous selected handle before update, i.e. under the mouse) logically while determining the 
		// variables for the new bounds
		var newLeft, newRight, newTop, newBottom;
		// find new bounds (i.e. not of currently stored rect but rect determined by current handle position and its opposite handle which hasn't moved)
		if (handles[oppHandle][0] > handles[selectedHandle][0]) {
			newLeft = handles[selectedHandle][0]; 
			newRight = handles[oppHandle][0];
		}
		else {
			newLeft = handles[oppHandle][0];
			newRight = handles[selectedHandle][0];
			newHandleId += 2; // selected handle is further right than opposite handle, so set flag for right
		}
		if (handles[oppHandle][1] > handles[selectedHandle][1]) {
			newTop = handles[selectedHandle][1]; 
			newBottom = handles[oppHandle][1];
		}
		else {
			newTop = handles[oppHandle][1];
			newBottom = handles[selectedHandle][1];
			newHandleId += 1; // selected handle is further down than opposite handle, so set flag for bottom
		}
		selectedHandle = newHandleId;
		// realise bounds as rectangle settings/parameters
		shape.setAttributeNS(null, "x", newLeft);
		shape.setAttributeNS(null, "y", newTop);
		shape.setAttributeNS(null, "width", newRight - newLeft);
		shape.setAttributeNS(null, "height", newBottom - newTop);
		handles[0][0] = handles[1][0] = newLeft;
		handles[2][0] = handles[3][0] = newRight;
		handles[0][1] = handles[2][1] = newTop;
		handles[1][1] = handles[3][1] = newBottom;
		refreshRectHandles(shape);
		/*
		handles[0][0] = newLeft;
		handles[2][0] = newRight;
		handles[0][1] = newTop;
		handles[1][1] = newBottom;
		handles[1][0] = newLeft;
		handles[3][0] = newRight;
		handles[2][1] = newTop;
		handles[3][1] = newBottom;
		*/
		
	}
	else if (shape.nodeName =="circle") { //leave r for a second
		shape.setAttributeNS(null, "cx", handles[0][0]);
		shape.setAttributeNS(null, "cy", handles[0][1]);
	}
	else if (shape.nodeName == "path") { //FIXME again the assumption that all paths will have data of form M x y q x y x y
		var startX = Number(handles[0][0]);
		var startY = Number(handles[0][1]);
		var data = "M " + startX + " " + startY + " q " + (handles[1][0] - startX) + " " + (handles[1][1] - startY) + " " + (handles[2][0]- startX) + " " + (handles[2][1] - startY) + CLIPPING_WORKAROUND;;
		console.log(data);
		shape.setAttributeNS(null, "d", data);

	}
	//shape.setAttributeNS(null, "stroke-width", 500);
	shape.setAttributeNS(null, "stroke", stroke);
	//shape.setAttributeNS(null, "stroke-dasharray", "1,2,1,2,1,1,1,2");
	//shape.setAttributeNS(null, "mask", "url(#mask1"); //overall mask for all shapes

	

}
function getPathCoords(el) {	// a basic version of what's to come - assume paths only have an M and a q command, in that order
	console.log("getting corods?");


	var data = el.getAttributeNS(null, "d");
	var parts = [];
	pairs = [];
	parts = data.split(" ");
	console.log(parts);
	if (parts.length > 14 || parts[0] !== "M" || parts[3] !== "q") { window.alert("Full data string parsing for path elements not implemented yet!"); debugger; }
	// FIXME MASSIVE ASSUMPTIONS BELOW - implement actual parsing! But this hardcoding makes my workaround easy - I simply don't read the invisible commands (so they don't get handles)
	startX = Number(parts[1]);
	startY = Number(parts[2]);
	pairs[0]= [startX, startY];
	handles[0] = [startX, startY];
	pairs[1] = [Number(parts[4]) + startX, Number(parts[5]) + startY];
	pairs[2] = [Number(parts[6]) + startX, Number(parts[7]) + startY];
	
	return pairs;
}
function refreshRectHandles(shape) {
	for (i = 0; i < handles.length; i++) {
		console.log(i);
		console.log(svgObject);
		console.log(svgObject.querySelector("#handle" + i));
		svgObject.removeChild(svgObject.querySelector("#handle" + i));
	}
	resetHandles(shape);
	/*
	handles = [];
	let rectWidth = parseInt(el.getAttributeNS(null, "width"));
	let rectHeight = parseInt(el.getAttributeNS(null, "height"));
	// handleId will be a 2-bit bitflag: 1 indicates bottom rather than top, 2 indicates right rather than left
	handles.push([el.getAttributeNS(null, "x"), el.getAttributeNS(null, "y")]); // 0 + 0 top left
	handles.push([el.getAttributeNS(null, "x"), parseInt(el.getAttributeNS(null, "y")) + rectHeight]); // 0 + 1 bottom left
	handles.push([parseInt(el.getAttributeNS(null, "x")) + rectWidth, el.getAttributeNS(null, "y")]); // 2 + 0 top right
	handles.push([parseInt(el.getAttributeNS(null, "x")) + rectWidth, parseInt(el.getAttributeNS(null, "y")) + rectHeight]); // 2 + 1 bottom right
	for (i = 0; i < handles.length; i++) {
		manifestHandle(handles[i][0], handles[i][1]);
	}
	console.log("handles", handles);
	*/
}
function resetHandles(el) { // pass which element you want to handles to control
	console.log("reset, called with " + el.nodeName);
	handles = [];
	
	if (el.nodeName == "path") {
		handles = getPathCoords(el);
		console.log(handles);
	}
	else if (el.nodeName == "line") {
		for (i = 0; i < 2; i++) {
			handles.push([el.getAttributeNS(null, "x" + (i + 1)), el.getAttributeNS(null, "y" + (i + 1))]);
		}

	}
	else if (el.nodeName == "rect") {
		let rectWidth = parseInt(el.getAttributeNS(null, "width"));
		let rectHeight = parseInt(el.getAttributeNS(null, "height"));
		// handleId will be a 2-bit bitflag: 1 indicates bottom rather than top, 2 indicates right rather than left
		handles.push([el.getAttributeNS(null, "x"), el.getAttributeNS(null, "y")]); // 0 + 0 top left
		handles.push([el.getAttributeNS(null, "x"), parseInt(el.getAttributeNS(null, "y")) + rectHeight]); // 0 + 1 bottom left
		handles.push([parseInt(el.getAttributeNS(null, "x")) + rectWidth, el.getAttributeNS(null, "y")]); // 2 + 0 top right
		handles.push([parseInt(el.getAttributeNS(null, "x")) + rectWidth, parseInt(el.getAttributeNS(null, "y")) + rectHeight]); // 2 + 1 bottom right
		
		console.log("handles", handles);
	}
	else if (el.nodeName =="circle") {
		handles.push([el.getAttributeNS(null, "cx"), el.getAttributeNS(null, "cy")]);
	}
	console.log("handles leng" + handles.length);
	for (i = 0; i < handles.length; i++) {
		manifestHandle(handles[i][0], handles[i][1]);
	}
}
function setControls() {
	console.log("Switching vals");
	if (shapes[selectedShapeId].nodeName == "circle") {
		document.getElementById("disabled-radius-field").disabled = false;
		document.getElementById("disabled-radius-field").value = shapes[selectedShapeId].getAttributeNS(null, "r");
		
	}
	else {
		document.getElementById("disabled-radius-field").disabled = true;
	}
	document.getElementById("dash-array-field").value = shapes[selectedShapeId].getAttributeNS(null, "stroke-dasharray");
	document.getElementById("stroke-width-field").value = shapes[selectedShapeId].getAttributeNS(null, "stroke-width");
	document.getElementById("fill-button").checked = (shapes[selectedShapeId].getAttributeNS(null, "fill") != "none");
	console.log("IS filled?", shapes[selectedShapeId].getAttributeNS(null, "fill") != "none");
	console.log("Is selected?", document.getElementById("fill-button").checked);
	if (shapeMasking[selectedShapeId][0] == true) {
		console.log("shapeMasking for",selectedShapeId,"=",shapeMasking[selectedShapeId][0]);
		document.getElementById("masked-button").checked = true;
	}
	else {
		if (shapeMasking[selectedShapeId][1] != "") {
			document.getElementById("sent-to-mask-button").checked = true;
		}
		else {
			document.getElementById("unmasked-button").checked = true;
		}
		

	}

}