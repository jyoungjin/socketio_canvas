
var socket = io();

socket.on('canvasSend', function(msgText, color, width) {
    //console.log("canvasSend" ,msgText ); 
    drawCanvasResponse(msgText, color, width);
});

socket.on('canvasClear', function() {
    //console.log("canvasClear"  ); 
    ctx.clearRect(0, 0, canvas.width, canvas.height);
     
});

var canvas;
var ctx;
var sx, sy;                 // 현재 위치
var drawing = false;            // 현재 그리는 중인가?
var selcolor;
var selwidth;

var ctx2;
var sx2, sy2;   
var sx2before, sy2before;   

var xyCoord ="";

window.onload = function() {

    canvas = document.getElementById("canvas");

    if (canvas == null || canvas.getContext == null) return;
    ctx = canvas.getContext("2d");
    ctx.lineCap="";
    
    // 현재 위치를 저장한다.
    canvas.onmousedown = function(e) {
        ctx.strokeStyle = document.getElementById("selcolor").value;
        ctx.lineWidth = document.getElementById("selwidth").value;
        e.preventDefault();
        sx = canvasX(e.clientX);
        sy = canvasY(e.clientY);
        drawing = true;
        xyCoord =sx+","+sy +"|";

    }
    
    // 현재 위치에서 새로 이동한 곳까지 선을 그린다.
    canvas.onmousemove = function(e) {
        if (drawing) {
            e.preventDefault();
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            sx = canvasX(e.clientX);
            sy = canvasY(e.clientY);
            ctx.lineTo(sx, sy);
            ctx.stroke();
            xyCoord += sx+","+sy+"|";
        }
    }

    // 그리기를 종료한다.
    canvas.onmouseup = function(e) {
        drawing = false;

        drawCanvas(xyCoord);
        socket.emit('canvasSend', xyCoord, document.getElementById("selcolor").value, document.getElementById("selwidth").value );
    }   

    // 마우스가 캔버스 밖으로 이동하면 그리기를 종료한다.
    canvas.onmouseout = function(e) {                
        
        drawing = false;
        
        drawCanvas(xyCoord);
        socket.emit('canvasSend', xyCoord, document.getElementById("selcolor").value, document.getElementById("selwidth").value );

        xyCoord ="";
        
    }           
            
}

// 모두 지우기
var btnclear = document.getElementById("clear");
btnclear.onclick = function(e) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    socket.emit('canvasClear');
}

function canvasX(clientX) {
    var bound = canvas.getBoundingClientRect();
    var bw = 5;
    return (clientX - bound.left - bw) * (canvas.width / (bound.width - bw * 2));
}

function canvasY(clientY) {
    var bound = canvas.getBoundingClientRect();
    var bw = 5;
    return (clientY - bound.top - bw) * (canvas.height / (bound.height - bw * 2));
}



function drawCanvas(xyCoordStr) {

    var xyCoord = xyCoordStr.split("|");
    
    for (var i =0; i< xyCoord.length; i++ )
    {
    if ( xyCoord[i] =="" ) break;
    var coord = xyCoord[i].split(",");

    sx2 = coord[0];
    sy2 = coord[1];
    if (sx2before == undefined ||  sy2before == undefined ) {
        sx2before = sx2;
        sy2before = sy2;
    }

    ctx.beginPath();
    ctx.moveTo(sx2before, sy2before);
    ctx.lineTo(sx2, sy2);
    ctx.stroke();
    sx2before = sx2;
    sy2before = sy2;
    }

    sx2before = undefined;
    sy2before = undefined;
                
}

function drawCanvasResponse(xyCoordStr, color, width) {

    var xyCoord = xyCoordStr.split("|");

    for (var i =0; i< xyCoord.length; i++ )
    {
    if ( xyCoord[i] =="" ) break;
    var coord = xyCoord[i].split(",");

    sx2 = coord[0];
    sy2 = coord[1];
    if (sx2before == undefined ||  sy2before == undefined ) {
        sx2before = sx2;
        sy2before = sy2;
    }

    ctx.beginPath();
    ctx.moveTo(sx2before, sy2before);
    ctx.lineTo(sx2, sy2);
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.stroke();
    sx2before = sx2;
    sy2before = sy2;
    }

    sx2before = undefined;
    sy2before = undefined;
                
}