import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import {Utils} from "./utils"

createApp(App)
    .use(vuetify)
    .mount('#app')

interface Vector2{
    x:number,
    y:number,
}

interface IObject{
    id: number,
    x: number,
    y: number,
    rotation: number,
    scale: number
}

const maxHeight = 85;
const maxWidth = 85;

const maxZoom = 0.4;

const unitSize = 30;
const gridColour = "#747474" 

const editorElement = document.getElementById("editor");
const canvas = <HTMLCanvasElement>editorElement;
const ctx = canvas.getContext('2d')!;

const layerDisplay = document.getElementById("layer-display");

//layers:layer:strokes:objects
let layers:Array<Array<Array<IObject>>> = [[]];
let currentLayer:number = 0;

let cameraPosition:Vector2 = {x:100, y:100};

let buttonsDown:Array<boolean> = [false, false, false]

let scale = 1;

let activeTool:undefined|string;

let lastPencilPos:Vector2|undefined;

let currentStroke:Array<IObject> = [];

if (ctx == null)
    throw new Error("CTX is not defined");



const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    draw();
}

//init funcs
resize()
draw();

//event listeners
window.addEventListener('resize', resize)

canvas.onmousedown = (e) => {
    e.preventDefault();

    buttonsDown[e.button] = true;

    toolStart(mouseToWorldCoords(e.clientX, e.clientY));
}

canvas.onmouseup = (e) => {
    e.preventDefault();


    buttonsDown[e.button] = false;

    toolEnd(mouseToWorldCoords(e.clientX, e.clientY));
}

window.onmouseout = (e) => {
    buttonsDown = [false, false, false];
}

canvas.onmousemove = (e) => {
    e.preventDefault();

    if (buttonsDown[1]){
        cameraPosition.x += e.movementX;
        cameraPosition.y += e.movementY;

        checkCameraBounds();

        draw();
    }

    let mousePos:Vector2 = mouseToWorldCoords(e.clientX, e.clientY);

    let delta:Vector2 = mouseToWorldCoords(e.movementX, e.movementY);

    let previous:Vector2 = Utils.subtractVector2(mousePos, delta);

    toolMove(previous, mousePos);

    e.preventDefault();

}

document.onwheel = (e) => {
    scale += e.deltaY / 300;

    //console.log(scale);

    if (scale <= maxZoom) {
        scale = maxZoom;
    }

    checkCameraBounds();

    draw();
}

document.onkeydown = (e) => {
    if (e.key === "z" && e.ctrlKey){
        undo();

        draw();
    }
}

//Hacky fix for formatting in the colour picker. Better solution is to fork the lib but too lazy.
document.querySelector(".vacp-copy-button")!.innerHTML = "Copy";



//register buttons
document.getElementById("pencil")!.onclick = () => {
    selectTool("pencil");
}

document.getElementById("left-layer")!.onclick = () => {
    changeLayer(-1);
}

document.getElementById("right-layer")!.onclick = () => {
    changeLayer(1);
}


//funcs
function drawGrid(scale:number):void{

    ctx.strokeStyle = gridColour;

    //draw horizontal lines
    for (let i = 0; i < maxHeight + 1; i++){
        ctx.beginPath();
        ctx.moveTo(cameraPosition.x, (unitSize*scale*i) + cameraPosition.y);
        ctx.lineTo((unitSize * scale * maxWidth) + cameraPosition.x, (unitSize*scale*i) + cameraPosition.y);
        ctx.stroke();
    }

    //draw vertical lines
    for (let i = 0; i < maxWidth + 1; i++){
        ctx.beginPath();
        ctx.moveTo((unitSize*scale*i) + cameraPosition.x, cameraPosition.y);
        ctx.lineTo((unitSize*scale*i) + cameraPosition.x, (unitSize * scale * maxHeight) + cameraPosition.y);
        ctx.stroke();
    }
}

function draw(){
    clearCanvas();
    drawGrid(scale);

    drawEditorContents();

    drawStroke(currentStroke);
}

function clearCanvas(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function checkCameraBounds(){
    if (cameraPosition.x > 200){
        cameraPosition.x = 200;
    }
    if (cameraPosition.y > 200){
        cameraPosition.y = 200;
    }

    if (cameraPosition.x < -(unitSize * scale * maxWidth) + canvas.width - 200){
        cameraPosition.x = -(unitSize * scale * maxWidth) + canvas.width - 200
    }
    if (cameraPosition.y < -(unitSize * scale * maxHeight) + canvas.height - 200){
        cameraPosition.y = -(unitSize * scale * maxHeight) + canvas.height - 200
    }
}

function selectTool(tool:string){
    if (tool == activeTool){
        activeTool = undefined;
        return;
    }

    activeTool = tool;
}

function toolMove(previous:Vector2, current:Vector2){
    switch (activeTool){
        case "pencil":
            if (buttonsDown[0]){

                //possible crash if bugs.
                while ((Utils.pointDist(lastPencilPos!, current) >= unitSize)){

                    let angle = -Utils.pointAngle(current, lastPencilPos!);
                    let nextPoint:Vector2 = {x:-(unitSize)/2 * Math.cos(angle), y:-(unitSize)/2 * -Math.sin(angle)};
                    let endPoint:Vector2 = {x:-(unitSize) * Math.cos(angle), y:-(unitSize) * -Math.sin(angle)};

                    nextPoint.x += lastPencilPos!.x;
                    nextPoint.y += lastPencilPos!.y;

                    endPoint.x += lastPencilPos!.x
                    endPoint.y += lastPencilPos!.y

                    

                    addObjectToStroke(currentStroke, 507, nextPoint.x, nextPoint.y, Utils.toDegrees(angle), 1);
                    
                    lastPencilPos = endPoint;
                }

            }
            break;
        default:
            return;
    }

    draw();
}

function toolStart(current:Vector2){
    switch (activeTool){
        case "pencil":
            if (buttonsDown[0]){
                lastPencilPos = current;
            }
            break;
        default:
            return;
    }

    draw();
}

function toolEnd(current:Vector2){
    switch (activeTool){
        case "pencil":
            addStroke(currentStroke);
            currentStroke = newStroke();
            
            console.log(layers);

            lastPencilPos = undefined;
            break;
        default:
            return;
    }

    draw();
}

function genorateLayers(ammount:number){
    if (layers.length >= ammount)
        return;
    
    for (let i = 0; i < ammount - layers.length; i++){
        layers.push([]);
    }
}

function changeLayer(ammount:number){
    if (currentLayer + ammount < 0)
        return;
    
    currentLayer += ammount;

    layerDisplay!.innerText = currentLayer.toString();

    genorateLayers(currentLayer + 1);

    draw();
}

function drawEditorContents(){
    for (let i = 0; i < layers.length; i++){
        if (i == currentLayer)
            continue;
        
        drawLayer(i, 0.5);
    }

    drawLayer(currentLayer, 1);
}

function drawLayer(layerNum:number, opacity:number){

    let layer = layers[layerNum];

    ctx.globalAlpha = opacity;

    for (let j = 0; j < layer.length; j++){

        let stroke = layer[j];

        drawStroke(stroke);
    }
}

function drawLineSegment(pos:Vector2, rotation:number){
    // x = dist * dcos( angle )
    // y = dist * -dsin( angle )


    pos.x = pos.x * scale;
    pos.y = pos.y * scale;

    let dist = (unitSize * scale) / 2

    let p1:Vector2 = {x:dist * Math.cos(Utils.toRadians(rotation)), y:dist * -Math.sin(Utils.toRadians(rotation))}
    let p2:Vector2 = {x:-dist * Math.cos(Utils.toRadians(rotation)), y:-dist * -Math.sin(Utils.toRadians(rotation))}

    ctx.beginPath();
    ctx.moveTo(p1.x + cameraPosition.x + pos.x, p1.y + cameraPosition.y + pos.y);
    ctx.lineTo(p2.x + cameraPosition.x + pos.x, p2.y + cameraPosition.y + pos.y);
    ctx.stroke();
}

function addObjectToStroke(stroke:Array<IObject>,id:number, x: number, y: number, rotation: number, scale: number){
    let obj = {id:id, x:x, y:y, rotation:rotation, scale:scale}
    
    stroke.push(obj);
}

function newStroke():Array<IObject>{
    return [];
}

function addStroke(stroke:Array<IObject>){
    if (stroke.length == 0)
        return;

    layers[currentLayer].push(stroke);
}

function undo(){
    if (currentStroke.length > 0){
        currentStroke = newStroke();
        return;
    }

    layers[currentLayer].pop();
}

function drawStroke(stroke:Array<IObject>){
    for (let k = 0; k < stroke.length; k++){
        let object = stroke[k];

        if (object.id == 507){
            drawLineSegment({x:object.x, y:object.y} as Vector2, object.rotation);
        }
    }
}

function mouseToWorldCoords(x:number, y:number):Vector2{
    return {x:(x-cameraPosition.x)/scale, y:(y - cameraPosition.y)/scale} as Vector2;
}