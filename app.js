const canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

const SCREEN_WIDTH = 160;
const SCREEN_HEIGHT = 100;

let playerPosition = 0; //range from -1 (left edge) to +1 (right edge)
let playerDistance = 100000;
let playerSpeed = 1;

canvas.height = SCREEN_HEIGHT;
canvas.width = SCREEN_WIDTH;
canvas.style.background = "blue";

let d;

const grass = ctx.createImageData(1,1); // only do this once per page
d  = grass.data;
d[0] = 0;
d[1] = 200;
d[2] = 0;
d[3] = 255;

const grassDark = ctx.createImageData(1,1); // only do this once per page
d  = grassDark.data;
d[0] = 0;
d[1] = 150;
d[2] = 0;
d[3] = 255;

const curbDark = ctx.createImageData(1,1); // only do this once per page
d  = curbDark.data;
d[0] = 214;
d[1] = 4;
d[2] = 4;
d[3] = 255;

const curbLight = ctx.createImageData(1,1); // only do this once per page
d  = curbLight.data;
d[0] = 214;
d[1] = 200;
d[2] = 200;
d[3] = 255;

const road = ctx.createImageData(1,1); // only do this once per page
d  = road.data;
d[0] = 150;
d[1] = 150;
d[2] = 150;
d[3] = 255;

const roadLine = ctx.createImageData(1,1); // only do this once per page
d  = roadLine.data;
d[0] = 255;
d[1] = 255;
d[2] = 255;
d[3] = 255;

const carImage = new Image();
carImage.src = "resources/images/car.png";

function updateScreen() {
    for (let y = 0; y < SCREEN_HEIGHT; y ++)
    {
        let perspective = y / (SCREEN_HEIGHT / 2);
        let grassColor = Math.sin((20 * Math.pow(1-perspective, 3)) + playerDistance * 0.0001);
        let curbColor = Math.sin(80 * (Math.pow(1-perspective, 3)) + playerDistance * 0.0001);

        for (let x = 0; x < SCREEN_WIDTH; x++)
        {


            let roadMiddlePoint = 0.5;
            //0.1 - minimum road width
            let roadWidth = 0.1 + perspective * 0.8;
            let curbWidth = roadWidth * 0.15;

            roadWidth *= 0.5;

            let leftGrassBound = (roadMiddlePoint - roadWidth - curbWidth) * SCREEN_WIDTH;
            let leftCurbBound = (roadMiddlePoint - roadWidth) * SCREEN_WIDTH;
            let rightGrassBound = (roadMiddlePoint + roadWidth + curbWidth) * SCREEN_WIDTH;
            let rightCurbBound = (roadMiddlePoint + roadWidth) * SCREEN_WIDTH;

            let row = SCREEN_HEIGHT / 2 + y;

            let currentGrass;
            if (grassColor > 0){
                currentGrass = grass;
            }
            else {
                currentGrass = grassDark;
            }

            let currentCurb;
            if (curbColor > 0){
                currentCurb = curbLight;
            }
            else {
                currentCurb = curbDark;
            }

            if (x >= 0 && x < leftGrassBound) {
                ctx.putImageData(currentGrass, x, row);
            }
            if (x > leftGrassBound && x < leftCurbBound) {
                ctx.putImageData(currentCurb, x, row);
            }
            if (x >= leftCurbBound && x <= rightCurbBound) {
                ctx.putImageData(road, x, row);
            }
            if (x > rightCurbBound && x < rightGrassBound) {
                ctx.putImageData(currentCurb, x, row);
            }
            if (x > rightGrassBound && x < SCREEN_WIDTH) {
                ctx.putImageData(currentGrass, x, row);
            }

            let carY = SCREEN_HEIGHT - carImage.height - 3;
            let carX = SCREEN_WIDTH / 2 + (SCREEN_WIDTH * playerPosition / 2) - carImage.width/2;

            ctx.drawImage(carImage, carX, carY);

            playerDistance += playerSpeed;

        }
    }
}

setTimeout(() => {
    setInterval(()=>{
        updateScreen();
    }, 10);
}, 2000);
