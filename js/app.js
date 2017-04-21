//Sneha Mohanty AngularJs paint app
//controller
var drawApp = angular.module("drawApp", []);
drawApp.controller("drawCtrl", function ($scope,$interval,wbRenderer) {
	'use strict';

    
	var colors,
		colorValue,
			canvas,
			context,
			points,
			lineColorNumber,
			fillColorNumber,
			mouseDown,
			startPos,
			endPos,
			createRenderObject,
			renderPath,
			backgroundImage,
			min,
			max,
		        min = 10;
			max = 30;

			renderPath = function (data) {
				if ($scope.tool === "rectangle" || $scope.tool === "line" || $scope.tool === "circle" || $scope.tool === "triangle" || $scope.tool === "semi" || $scope.tool==="usemi" || $scope.tool==="pent" || $scope.tool==="fur" || $scope.tool==="pix" || $scope.tool==="gl" || $scope.tool ==="stroke2" || $scope.tool ==="stroke1") {
					wbRenderer.renderAll();
				}

				wbRenderer.render(data);
			},

			createRenderObject = function () {
				var data,
						pointsLength;

				pointsLength = points.length;

				switch ($scope.tool) {
					case "pencil":
						data = {
							ToolName: "pencil",
							LineWidth:window.localStorage.stw,
							Points: points,
							Color:window.localStorage.st
						};
						break;

					case "line":
						data = {
							ToolName: "line",
							LineColor: window.localStorage.st,
							LineWidth: window.localStorage.stw,
							StartX: startPos.x,
							StartY: startPos.y,
							EndX: endPos.x,
							EndY: endPos.y
						};
						break;

					case "rectangle":
						data = {
							ToolName: "rectangle",
							LineColor: window.localStorage.st,
							FillColor: window.localStorage.fl,
							LineWidth: window.localStorage.stw,
							StartX: startPos.x,
							StartY: startPos.y,
							Width: endPos.x - startPos.x,
							Height: endPos.y - startPos.y,
							FillShape: $scope.fillShape
						};
						break;
					
					case "circle":
						data = {
							ToolName: "circle",
							LineColor: window.localStorage.st,
							FillColor: window.localStorage.fl,
							LineWidth: window.localStorage.stw,
							StartX: startPos.x,
							StartY: startPos.y,
							Radius: (Math.abs(endPos.x - startPos.x) + (Math.abs(endPos.y - startPos.y)) / 2),
							FillShape: $scope.fillShape
						};
						break;

					case "triangle":
						data = {
							ToolName: "triangle",
							FillColor:window.localStorage.fl,
							StartX: startPos.x,
							StartY: startPos.y,
							EndX: endPos.x,
							EndY: endPos.y,
							FillShape: $scope.fillShape,
							LineColor:window.localStorage.st,
							LineWidth:window.localStorage.stw
						
							};
								break;
								
					case "semi":
						data = {
							ToolName: "semi",
							LineColor: window.localStorage.st,
							FillColor: window.localStorage.fl,
							LineWidth: window.localStorage.stw,
							StartX: startPos.x,
							StartY: startPos.y,
							Radius: (Math.abs(endPos.x - startPos.x) + (Math.abs(endPos.y - startPos.y)) / 2),
							FillShape: $scope.fillShape
						
							};
								break;
								
								
					case "usemi":
						data = {
							ToolName: "usemi",
							LineColor: window.localStorage.st,
							FillColor: window.localStorage.fl,
							LineWidth: window.localStorage.stw,
							StartX: startPos.x,
							StartY: startPos.y,
							Radius: (Math.abs(endPos.x - startPos.x) + (Math.abs(endPos.y - startPos.y)) / 2),
							FillShape: $scope.fillShape
						
							};
								break;
					
					case "pent":
						data={
						
							ToolName:"pent",
							LineColor:window.localStorage.st,
							FillColor: window.localStorage.fl,
							LineWidth: window.localStorage.stw,
							StartX:startPos.x,
							StartY:startPos.y,
							Radius: (Math.abs(endPos.x - startPos.x) + (Math.abs(endPos.y - startPos.y)) / 2),
							FillShape: $scope.fillShape
							};
							
							break;
							
						case "tp":
						data = {
							ToolName: "tp",
							LineWidth:window.localStorage.stw,
							Points: points,
							Color:"rgba(0,0,0,1)"
						};
						break;

						case "stroke1":
							data = {
								
							ToolName:"stroke1",
							LineWidth:window.localStorage.stw,
							Points:points,
							FillStyle:window.localStorage.fl,
							Color:window.localStorage.st,
							mouseX: startPos.x,
							mouseY: startPos.y,
							

								};
							break;
					
						case "stroke2":
							data = {
							ToolName:"stroke2",
							Color:window.localStorage.st,
							mouseX: startPos.x,
							mouseY: startPos.y,
							Points:points

								};
							break;
						
						case "stroke3":
							data = {
								
							ToolName:"stroke3",
							LineWidth:window.localStorage.stw,
							Color:window.localStorage.st,
							mouseX: startPos.x,
							mouseY: startPos.y,
							
								};
							break;
					
						case "stroke4":
							data = {

							ToolName:"stroke4",
							Color:window.localStorage.st,
							Points: points
							
							
								};
							break;

						case "pixel":
							data = {
							
							ToolName:"pixel",
							StartX: startPos.x,
							StartY: startPos.y,
							EndX: endPos.x,
							EndY: endPos.y,			
							Points:points
							
								};
							break;
						
						case "gl":
							data = {

							ToolName:"gl",		
							Points:points,
							LineWidth:window.localStorage.stw

								};
							break;

						case "fur":
							data = {

							ToolName:"fur",		
							StartX: startPos.x,
							StartY: startPos.y,
							EndX: endPos.x,
							EndY: endPos.y
							
								};
							break;
						
						case "blob":
							data = {
							Points:points,
							FillStyle:window.localStorage.fl,
							StartX: startPos.x,
							EndX: endPos.x,
							EndY: endPos.y,	
							StartY: startPos.y
    							
								};
							break;

					default:
						console.log("createRenderObject: unkown tool");
						data = {};
						break;
				}

				return data;
			};

			

// bindings
	
	$scope.tool = "pencil";
	$scope.fillShape = false;

// functions
	$scope.init = function () {
		var offset;

		
		
		canvas = document.getElementById("canvas");
		context = canvas.getContext("2d");
		wbRenderer.setContext(context);
		offset = 5;  // mouse cursor offset
		points = [];
		
		mouseDown = false;
		startPos = { x: 0, y: 0 };
		endPos = { x: 0, y: 0 };		
		
		canvas.onmousedown = canvas.touchstart = function (e) {
			var data;

			points.push({
				x: (e.pageX - canvas.offsetLeft) - offset,
				y: (e.pageY - canvas.offsetTop) - offset,
				color: window.localStorage.st
			});			

			mouseDown = true;

			startPos.x = points[0].x;
			startPos.y = points[0].y;
			endPos.x = points[0].x;
			endPos.y = points[0].y;

			data = createRenderObject();
			renderPath(data);
		};

		canvas.onmousemove = canvas.touchmove = function (e) {
			var x, y, lastPoint, data;

			if (mouseDown) {
				x = (e.pageX - canvas.offsetLeft) - offset;
				y = (e.pageY - canvas.offsetTop) - offset;

				points.push({
					x: x,
					y: y,
					color: window.localStorage.st
				});
				
				lastPoint = points[points.length - 1];
				endPos.x = lastPoint.x;
				endPos.y = lastPoint.y;

				data = createRenderObject();
				renderPath(data);				
			}			
		};

		canvas.onmouseup =canvas.touchend = function (e) {
			var data;

			mouseDown = false;
			data = createRenderObject();
			wbRenderer.addToBuffer(data);

			points = [];
			startPos.x = 0;
			startPos.y = 0;
			endPos.x = 0;
			endPos.y = 0;
		};
	};
$scope.isToolNameSelected = function () {
		var i;

		for (i = 0; i < arguments.length; i++) {
			if (arguments[i] === $scope.tool) {
				return true;
			}
		}

		return false;
	};

	

	
		
	$scope.stw = 15;
	
	$scope.st = '#172f21';
	
	$scope.fl = '#800000 ';


$scope.$watchCollection ("[stw, st, fl]", function( newValue, oldValue ) {
    window.localStorage.st = $scope.st;
    window.localStorage.stw = $scope.stw;
    window.localStorage.fl = $scope.fl;
  }); 



	

		$scope.undo = function () {
		wbRenderer.undo();
		wbRenderer.renderAll();

		points = [];
		startPos.x = 0;
		startPos.y = 0;
		endPos.x = 0;
		endPos.y = 0;
	};
	
	


	  window.localStorage.st = $scope.st;
  window.localStorage.stw = $scope.stw; 
	window.localStorage.fl = $scope.fl;


	$scope.draw = function(direction){
	
	 var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height); 
    var img = document.getElementById("lamp")
    var pat = ctx.createPattern(img, direction);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
	ctx.globalAlpha=1;
    ctx.fill();
	
	
								};
								
		$scope.draw1 = function(direction){
	
	 var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height); 
    var img = document.getElementById("stars")
    var pat = ctx.createPattern(img, direction);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
	ctx.globalAlpha=1;
    ctx.fill();
	
	
								};
								
		$scope.draw2 = function(direction){
	
	 var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height); 
    var img = document.getElementById("dots")
    var pat = ctx.createPattern(img, direction);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
	ctx.globalAlpha=1;
    ctx.fill();
	
	
								};
								
								
							
		$scope.draw3 = function(direction){
	
	 var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height); 
    var img = document.getElementById("patt")
    var pat = ctx.createPattern(img, direction);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
	ctx.globalAlpha=1;
    ctx.fill();
	
								};
								
								
							
		$scope.draw4 = function(direction){
	
	 var c = document.getElementById("canvas");
    var ctx = c.getContext("2d");
    //ctx.clearRect(0, 0, c.width, c.height); 
    var img = document.getElementById("color")
    var pat = ctx.createPattern(img, direction);
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = pat;
	ctx.globalAlpha=1;
    ctx.fill();
	
								};


	
	$scope.save = function(){



var canvas1 = document.getElementById("canvas");        
  if (canvas1.getContext) {
     var context = canvas1.getContext("2d");                
     var myImage = canvas1.toDataURL("image/png");      
  }
 // var imageElement = document.getElementById("MyPix");  
 window.location = myImage;

}; 

$scope.file_changed = function(element) {
      var files = element.files; // FileList object
      var can = document.getElementById('canvas');
      var ctx = can.getContext('2d');
      var photofile = element.files[0]
      var reader = new FileReader();
          reader.onload = (function(theFile) {
                return function(e) {

                  var img = new Image();
                  img.onload = function(){
                      //can.width = img.width;
                         //can.height = img.height;
			img.width = can.width;
			img.height = can.height;
                      ctx.drawImage(img,0,0);
                  }
                  img.src = e.target.result;

                  $scope.imageSource= e.target.result; 
                  $scope.$apply();  
                };
              })(photofile);
          reader.readAsDataURL(photofile); 
  };// End Method file_changed



});

//factory


drawApp.factory("wbRenderer", function () {
	"use strict";
	var context,
			renderPencil,
			renderLine,
			renderRectangle,
			renderCircle,
			renderTriangle,
			renderSemi,
			renderUsemi,
			renderPent,
			renderTp,
			renderStr1,
			renderStr2,
			renderStr3,
			renderStr4,
			renderPix,
			renderStar,
			renderGl,
			renderFur,
			renderBlob,
			renderAll,
			//getRandomInt,
			buffer = [];


	
	/*getRandomInt = function(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
*/

function polygon(ctx, x, y, radius, sides, startAngle, anticlockwise) {
  if (sides < 3) return;
  var a = (Math.PI * 2)/sides;
  a = anticlockwise?-a:a;
  ctx.save();
  ctx.translate(x,y);
  ctx.rotate(startAngle);
  ctx.moveTo(radius,0);
  for (var i = 1; i < sides; i++) {
    ctx.lineTo(radius*Math.cos(a*i),radius*Math.sin(a*i));
  }
  ctx.closePath();
  ctx.restore();
};


function drawPixels(x, y) {
  for (var i = -10; i < 10; i+= 4) {
    for (var j = -10; j < 10; j+= 4) {
      if (Math.random() > 0.5) {
	context.lineWidth = 3;
        context.fillStyle = ['red', 'orange', 'yellow', 'green', 
                         'light-blue', 'blue', 'purple'][getRandomInt(0,6)];
        context.fillRect(x+i, y+j, 4, 4);
      }
    }
  }
};


function midPointBtw(p1, p2) {
  return {
    x: p1.x + (p2.x - p1.x) / 2,
    y: p1.y + (p2.y - p1.y) / 2
  };
}
function getPattern() {
  var patternCanvas = document.createElement('canvas'),
      dotWidth = 20,
      dotDistance = 5,
      ctx = patternCanvas.getContext('2d');

  patternCanvas.width = patternCanvas.height = 10;
  ctx.strokeStyle = 'green';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(0, 5);
  ctx.lineTo(10, 5);
  ctx.closePath();
  ctx.stroke();
  return ctx.createPattern(patternCanvas, 'repeat');
};


function distanceBetween(point1, point2) {
  return Math.sqrt(Math.pow(point2.x - point1.x, 2) + Math.pow(point2.y - point1.y, 2));
}
function angleBetween(point1, point2) {
  return Math.atan2( point2.x - point1.x, point2.y - point1.y );
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

	//to be removed

	renderBlob = function(data){
	
			var density = 50;			
		 context.lineWidth = 10;
  context.lineJoin = context.lineCap = 'round';
		context.globalCompositeOperation="source-over";

context.moveTo(data.Points[0].x, data.Points[0].y);

		 for (i = 0; i < data.Points.length; i++)
        {	
  for (var i = density; i--; ) {
	
      var radius = 20;
      var offsetX = getRandomInt(-radius, radius);
      var offsetY = getRandomInt(-radius, radius);
	//context.beginPath();
	context.fillStyle = data.FillStyle;
	context.globalCompositeOperation="source-over";
      context.fillRect(data.Points[i].x + offsetX, data.Points[i].y + offsetY, 1, 1);
	

		}
	context.fill();
}



				

		};

	renderFur = function(data){

		var x,y;
		var img = new Image();
img.src = 'js/brush2.png';
img.width = 5;
		var lastPoint;
		lastPoint = { x: data.EndX, y: data.EndY };
		
		 var currentPoint = { x: data.StartX, y: data.StartY };
  var dist = distanceBetween(lastPoint, currentPoint);
  var angle = angleBetween(lastPoint, currentPoint);
  
		
  for (var i = 0; i < dist; i++) {
    x = lastPoint.x + (Math.sin(angle) * i);
    y = lastPoint.y + (Math.cos(angle) * i);
    context.save();
    context.translate(x, y);
    context.scale(0.5, 0.5);
	context.globalAlpha=0.6;
context.globalCompositeOperation="source-over";
    context.rotate(Math.PI * 180 / getRandomInt(0, 180));
    context.drawImage(img, 0, 0);
   
    context.restore();
 				 }
  
  lastPoint = currentPoint;


				};

	

renderGl = function(data){
			
			
context.lineWidth = data.LineWidth;
context.lineJoin = context.lineCap = 'round';
context.strokeStyle = getPattern();
 context.globalAlpha=0.9;
context.globalCompositeOperation="source-over";


 var p1 = data.Points[0];
  var p2 = data.Points[1];
  
  context.beginPath();
  context.moveTo(p1.x, p1.y);

  for (var i = 1, len = data.Points.length; i < len; i++) {
    var midPoint = midPointBtw(p1, p2);
    context.quadraticCurveTo(p1.x, p1.y, midPoint.x, midPoint.y);
    p1 = data.Points[i];
    p2 = data.Points[i+1];

  							}
  
	context.lineTo(p1.x, p1.y);
  	context.stroke();

				

		};


	renderPix = function(data){
		var i;
		
		var lastPoint;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.lineJoin = context.lineCap = 'round';
		for (i = 0; i < data.Points.length; i++) {
			drawPixels(data.Points[i].x, data.Points[i].y);
			context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.lineJoin = context.lineCap = 'round';
		}	
  
  		lastPoint = { x: data.EndX, y: data.EndY };
				
				};
	



	renderPencil = function (data) {
		var i;

		context.beginPath();					
		context.lineCap = 'round';
		context.lineJoin="round";
		context.strokeStyle = data.Color;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.moveTo(data.Points[0].x, data.Points[0].y);
		for (i = 0; i < data.Points.length; i++) {
			context.lineTo(data.Points[i].x, data.Points[i].y);
		}
		context.stroke();
	};
	
	renderLine = function (data) {
		context.beginPath();
		context.strokeStyle = data.LineColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.lineCap = 'round';
		context.moveTo(data.StartX, data.StartY);
		context.lineTo(data.EndX, data.EndY);
		context.stroke();
	};

	renderRectangle = function (data) {
		context.beginPath();
		context.strokeStyle = data.LineColor;
		context.fillStyle = data.FillColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.rect(data.StartX, data.StartY, data.Width, data.Height);

		if (data.FillShape) {
			context.fill();
		}
		
		context.stroke();
	};

	renderCircle = function (data) {
		context.beginPath();
		context.strokeStyle = data.LineColor;
		context.fillStyle = data.FillColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.arc(data.StartX, data.StartY, data.Radius, 0, Math.PI * 2, false);

		if (data.FillShape) {
			context.fill();
		}

		context.stroke();
	};
	
	renderSemi = function (data) {
		context.beginPath();
		context.strokeStyle = data.LineColor;
		context.fillStyle = data.FillColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.arc(data.StartX, data.StartY, data.Radius,0, Math.PI,true);
		context.closePath();
		if (data.FillShape) {
			context.fill();
		}

		context.stroke();
	};
	
	
	renderUsemi = function (data) {
		context.beginPath();
		context.strokeStyle = data.LineColor;
		context.fillStyle = data.FillColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.arc(data.StartX, data.StartY, data.Radius,0, Math.PI,false);
		context.closePath();
		if (data.FillShape) {
			context.fill();
		}

		context.stroke();
	};
	
	renderPent = function(data){
	
			context.beginPath();
		context.strokeStyle = data.LineColor;
		context.fillStyle = data.FillColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
	  polygon(context,data.StartX,data.StartY,data.Radius,5,-Math.PI/2,0);  //ctx, x, y, radius, sides, startAngle, anticlockwise
	
	
	if (data.FillShape) {
			context.fill();
		}

		context.stroke();
	};
	
	
	 renderTp = function(data){
					var i;

		context.beginPath();					
		context.lineCap = 'round';
		context.lineJoin="round";
		context.strokeStyle = data.Color;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="destination-out";
		context.moveTo(data.Points[0].x, data.Points[0].y);
		for (i = 0; i < data.Points.length; i++) {
			context.lineTo(data.Points[i].x, data.Points[i].y);
		}
		context.stroke();



							};
	
	
	
//This is the random circles corrected version, remove the blob
	
	renderStr1 = function(data){
		
			var i;

	context.globalAlpha=0.8*Math.random();
	context.globalCompositeOperation = 'source-over';

		 for (i = 0; i < data.Points.length; i++)
        {	
		var radius = getRandomInt(5, 20);
	  
           context.beginPath();
		 context.fillStyle = data.FillStyle;
		
           context.arc( data.Points[i].x, data.Points[i].y, radius, 0, Math.PI*2, true);
		context.fill();

      
           
        }
			
	

				};


function drawStar(x, y, angle) {
  var length = 15;
  context.save();
  context.translate(x, y);
  context.beginPath();
  context.rotate(Math.PI / 180 * angle);
  for (var i = 5; i--;) {
    context.lineTo(0, length);
    context.translate(0, length);
    context.rotate((Math.PI * 2 / 10));
    context.lineTo(0, -length);
    context.translate(0, -length);
    context.rotate(-(Math.PI * 6 / 10));
  }
  context.lineTo(0, length);
  context.closePath();
  context.stroke();
  context.restore();
};


//render STROKE 2


	renderStr2 = function(data){
		var angle;
context.lineJoin = context.lineCap = 'round';
context.strokeStyle =data.Color;
	context.globalAlpha=1;
context.globalCompositeOperation="source-over";
context.lineWidth=3;
	angle = getRandomInt(0, 180);

	for (var i = 0; i < data.Points.length; i++) {
    drawStar(data.Points[i].x, data.Points[i].y,angle);
  }



				};

//Stroke 3 (code to be corrected, has f'ing errors )

	renderStr3 = function(data){

	var i, cx, cy, dx, dy;

        cx = Math.round(data.mouseX / 100) * 100;
        cy = Math.round(data.mouseY / 100) * 100;

        dx = (cx - data.mouseX) * 10;
        dy = (cy - data.mouseY) * 10;

       context.lineWidth = data.LineWidth;
       context.strokeStyle = data.Color;
	context.globalAlpha=0.1*Math.random();
	context.lineCap = 'round';
	context.lineJoin="round";
	context.globalCompositeOperation = 'darker';
    
        for (i = 0; i < 50; i++)
        {
            context.beginPath();
            context.moveTo( cx, cy );
            context.quadraticCurveTo(data.mouseX + Math.random() * dx, data.mouseY + Math.random() * dy, cx, cy);
	
            context.stroke();

	}
			
		};

	//the sketcher
	renderStr4 = function(data){
	var dx,dy,d,i,len;
		  context.beginPath();
		  context.moveTo(data.Points[data.Points.length - 2].x, data.Points[data.Points.length - 2].y);
		  context.lineTo(data.Points[data.Points.length - 1].x, data.Points[data.Points.length - 1].y);
		 context.globalAlpha=0.3;
		context.lineWidth = 1;
		context.globalCompositeOperation="source-over";

		  context.stroke();
  
  for (var i = 0, len = data.Points.length; i < len; i++) {
    dx = data.Points[i].x - data.Points[data.Points.length-1].x;
    dy = data.Points[i].y - data.Points[data.Points.length-1].y;
    d = dx * dx + dy * dy;

    if (d < 1000) {
      context.beginPath();
      context.strokeStyle = data.Color;
      context.moveTo( data.Points[data.Points.length-1].x + (dx * 0.2), data.Points[data.Points.length-1].y + (dy * 0.2));
      context.lineTo( data.Points[i].x - (dx * 0.2), data.Points[i].y - (dy * 0.2));
		 context.globalAlpha=0.3;
		context.lineWidth = 1;
		//context.globalCompositeOperation="source-over";
      context.stroke();
		}
			}
			        };


	
	renderTriangle = function (data) {
		context.beginPath();
		context.strokeStyle = data.LineColor;
		context.lineCap = 'round';
		context.lineJoin="round";
		context.fillStyle = data.FillColor;
		context.lineWidth = data.LineWidth;
		context.globalAlpha=1;
		context.globalCompositeOperation="source-over";
		context.moveTo(data.StartX,data.StartY);
		context.lineTo(data.EndX,data.EndY);
		context.lineTo(data.StartX,data.EndY);
		context.lineTo(data.StartX,data.StartY);

		if (data.FillShape) {
			context.fill();
		}

		context.stroke();
	};
	



	
	
	renderAll = function () {
		var i;

		context.clearRect(0, 0, canvas.width, canvas.height);
		for (i = 0; i < buffer.length; i++) {
			switch (buffer[i].ToolName) {
				case "pencil":
					renderPencil(buffer[i]);
					break;
				case "line":
					renderLine(buffer[i]);
					break;
				case "rectangle":
					renderRectangle(buffer[i]);
					break;
				case "circle":
					renderCircle(buffer[i]);
					break;
				case "triangle":
					renderTriangle(buffer[i]);
					break;
				case "semi":
					renderSemi(buffer[i]);
					break;
				case "usemi":
					renderUsemi(buffer[i]);
					break;
				case "pent":
				    renderPent(buffer[i]);
					break;
				case "tp":
				    renderTp(buffer[i]);
					break;
				case "stroke1":
				    renderStr1(buffer[i]);
					break;
				case "stroke2":
				    renderStr2(buffer[i]);
					break;
				case "stroke3":
				    renderStr3(buffer[i]);
					break;
				case "stroke4":
				    renderStr4(buffer[i]);
					break;
				case "star":
				    renderStar(buffer[i]);
					break;
				case "pixel":
				    renderPix(buffer[i]);
					break;
				case "gl":
				    renderGl(buffer[i]);
					break;
				case "fur":
				    renderFur(buffer[i]);
					break;
				case "blob":
				    renderBlob(buffer[i]);
					break;
			}
		}
	};


	
	return {
		addToBuffer: function (data) {
			buffer.push(data);
		},

		renderAll: function () {
			renderAll();
		},

		render: function (data) {
			switch (data.ToolName) {
				case "pencil":
					renderPencil(data);
					break;
				
				case "line":
					renderLine(data);
					break;
				case "rectangle":
					renderRectangle(data);
					break;
				case "circle":
					renderCircle(data);
					break;
				case "triangle":
					renderTriangle(data);
					break;
				case "semi":
					renderSemi(data);
					break;
				case "usemi":
					renderUsemi(data);
					break;
				case "pent":
					renderPent(data);
					break;
				case "tp":
					renderTp(data);
					break;
				case "stroke1":
					renderStr1(data);
					break;
				case "stroke2":
					renderStr2(data);
					break;
				case "stroke3":
					renderStr3(data);
					break;
				case "stroke4":
					renderStr4(data);
					break;
				case "star":
					renderStar(data);
					break;
				case "pixel":
					renderPix(data);
					break;
				case "gl":
					renderGl(data);
					break;
				case "fur":
					renderFur(data);
					break;
				case "blob":
					renderBlob(data);
					break;
				
			}
		},

		setContext: function (ctx) {
			context = ctx;
		},

		undo: function () {
			buffer.pop();			
		}
	};
});
