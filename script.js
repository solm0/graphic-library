var Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Mouse = Matter.Mouse,
    MouseConstraint = Matter.MouseConstraint,

    Render = Matter.Render,
    Runner = Matter.Runner;
    
// create engine
var engine = Engine.create();
engine.gravity.y = -1;
engine.gravity.scale = 0.0001;
var world = engine.world;

var boxes = [];
var boundaries = [];

// create render
var render = Render.create({
    element: document.body,
    engine: engine
});

// create mouse, mconstraint
var mouse = Mouse.create(render.canvas);
var mConstraint = MouseConstraint.create(engine, {mouse: mouse});
World.add(world, mConstraint);

// create bodies
var boxx = Bodies.rectangle(500,200,80,80,{ friction: 0.05, restitution: 0.6})
boxes.push(boxx);
World.add(world, boxes);
console.log(boxx.position.x);

boxes.push(new Box(450, 250, 80, 80));
boxes.push(new Box(350, 230, 80, 80));
boxes.push(new Box(430, 220, 80, 80));
boxes.push(new Box(230, 210, 80, 80));
boxes.push(new Box(230, 200, 80, 80));

boundaries.push(new Boundary(400, 0, 800, 100));
boundaries.push(new Boundary(400, 600, 800, 100));
boundaries.push(new Boundary(0, 300, 100, 600));
boundaries.push(new Boundary(800, 300, 100, 600));


// run the renderer
Render.run(render);

// create runner
var runner = Runner.create();

// run the engine
Runner.run(runner, engine);




function Box(x,y,w,h) {
    var options = {
        friction: 0.05,
        restitution: 0.6
    }
    var box = Bodies.rectangle(x,y,w,h,options);
    World.add(world, box);
}

function Boundary(x,y,w,h) {
    var options = {
        friction: 0.05,
        restitution: 0.6,
        isStatic: true
    }
    var boundary = Bodies.rectangle(x,y,w,h,options);
    World.add(world, boundary);
}


let allowDownload = true;
let allowRefresh = true;
let currentBrushFunction = null;
let currentButton;

const buttonFunctions = {};
const buttonTexts = {
    button1: 'symmetrical lines',
    button2: '3 x 3',
    button3: 'fill the closed shape',
    button4: 'memory',
    button5: 'evaporate',
    button6: 'color circles',
};

let img;
let text1;
let text2;
let text3;
let text4;
let imgTextContainer;

function refTexts(work, artist, description, link) {
    this.work = work;
    this.artist = artist;
    this.description = description;
    this.link = link;
}
const noref = new refTexts(
    'no reference :-)',
    '',
    '',
    '',
)
const ref1 = new refTexts(
    'The True Cross of the Lord, sheet 28',
    'Gennady Pavlov',
    'Paper, calligraphic ink, water-colours, sharp-pointed nib pen, brush, 31x31 cm, 2010',
    'http://calligraphy-expo.com/en/participants/Gennady_Pavlov',
);
const ref2 = new refTexts(
    'Bodoni Ornament',
    'Seongjin Kim',
    '-',
    'https://www.behance.net/gallery/14142121/Bodoni-Ornament',
);
const ref3 = new refTexts(
    'Синицын, П. Преображенское и окружающие его места, их прошлое и настоящее',
    'Михаила Васильевича Нестерова',
    '1895, 195pp, 31.5x24.1cm. In a publishers compound chromolithographed binding with gold and colorful embossing.',
    'https://www.litfund.ru/auction/106/94/',
);
const refTextsArray = [noref, ref1, ref2, ref3];

const buttonImgs = {
    button1: './img/img1.jpg',
    button2: './img/img2.jpg',
    button3: './img/img3.jpeg',
    button4: '',
    button5: '',
    button6: '',
}

let buttonKeys = [];

function setup() {
    const cnv = createCanvas(windowWidth-330, windowHeight-50);
    cnv.addClass('cnv');
    background(220);

    const parent = createDiv('');
    parent.addClass('parent');

    imgTextContainer = createDiv('');
    imgTextContainer.addClass('img-text-container');

    const buttonSVGs = {
        button1: select('#svg1'),
        button2: select('#svg2'),
        button3: select('#svg3'),
        button4: select('#svg4'),
        button5: select('#svg5'),
        button6: select('#svg6'),
    }

    const innerbuttonSVGs = {
        button1: select('#inSvg1'),
        button2: select('#inSvg2'),
        button3: select('#inSvg3'),
        button4: select('#inSvg4'),
        button5: select('#inSvg5'),
        button6: select('#inSvg6'),
    }

    for (let i = 6; i >= 1; i--) {
        let buttonKey = 'button' + i;
        buttonKeys.push(buttonKey);
        let brushValue = window['brush' + i];
        buttonFunctions[buttonKey] = brushValue;
        let ref = refTextsArray[i] ? refTextsArray[i] : noref;
    
        
        let button = buttonSVGs[buttonKey];
        parent.child(button);
    
        let buttonText = createP(buttonTexts[buttonKey]);
        buttonText.parent(button);
    
    
        setBrushFunction(buttonKey);
        applyButtonStyle(innerbuttonSVGs[buttonKey]);
        applyReference(buttonKey, ref);
        
        button.mouseClicked(() => {
            console.log(buttonKey);
            setBrushFunction(buttonKey);
            applyButtonStyle(innerbuttonSVGs[buttonKey]);
            applyReference(buttonKey, ref);
    
            //brush3, brush4, brush5
            fillColor = random([color(193,141,79,5),color(44,134,134, 5)]);
        });
    }
    let svgs = selectAll('.container');
    console.log(svgs);
    svgs.forEach(svg => {
        let posX = random(0, windowWidth-220);
        let posY = random(0, windowHeight-500);
        svg.position(posX, posY);
    });
}

function onSVGPositionChange() {
    let svgs = document.querySelectorAll('.container');
    svgs.forEach(svg => {
        let box = boxx;

        let posX = box.position.x;
        let posY = box.position.y;
        
        svg.style.left = posX + "px";
        svg.style.top = posY + "px";
    });
}

setInterval(onSVGPositionChange, 100);




function setBrushFunction(buttonKey) {
    currentBrushFunction = buttonFunctions[buttonKey];
}

function applyButtonStyle(path) {
    if (currentButton) {
        // 이전 버튼이 있을 경우, 스타일 초기화
        currentButton.style('fill', '');
        currentButton.style('stroke', '');
        currentButton.style('stroke-width', '');
    }
    // 현재 버튼에 스타일 적용
    path.style('fill', ' rgb(204,204,204)');
    path.style('stroke', 'blue');
    path.style('stroke-width', '2px');
    // 현재 버튼을 기억
    currentButton = path;
}

function applyReference(buttonKey, ref) {
    imgTextContainer.remove();
    imgTextContainer = createDiv();
    imgTextContainer.addClass('img-text-container');
    
    text1 = createP();
    text1.addClass('text');
    text1.style('text-indent', '0px');
    text1.html(ref.work + '<br>');

    img = createImg(buttonImgs[buttonKey]);
    
    text2 = createP();
    text2.addClass('text');
    text2.style('text-indent', '0px');
    text2.html(ref.artist + '<br>');

    text3 = createP();
    text3.addClass('text');
    text3.style('text-indent', '20px');
    text3.html(ref.description + '<br>');

    text4 = createP();
    text4.addClass('text');
    text4.style('text-indent', '20px');
    text4.html('<a href="' + ref.link + '"target="_blank">' + ref.link + '</a>');
    
    imgTextContainer.child(text1);
    imgTextContainer.child(img);
    imgTextContainer.child(text2);
    imgTextContainer.child(text3);
    imgTextContainer.child(text4);
    imgTextContainer.position(windowWidth-320, 0);
}




function draw() {
    if (currentBrushFunction) {
        currentBrushFunction();
    }
}

function refresh() {
    location.reload(true);
}
function keyPressed() {
    if (keyCode === 83 && allowDownload) {
        save('library.jpg');
        allowDownload = false;
    }
    else if (keyCode === 67 && allowRefresh) {
        refresh();
        allowRefresh = false;
    }
}
function keyReleased() {
    if (keyCode === 83) {
        allowDownload = true;
    }
    if (keyCode === 67) {
        allowRefresh = true;
    }
}