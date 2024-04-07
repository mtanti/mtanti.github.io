function getDistance(srcX, srcY, trgX, trgY) {
    return Math.sqrt(Math.pow(srcX - trgX, 2) + Math.pow(srcY - trgY, 2));
}

function getAngle(srcX, srcY, trgX, trgY) {
    if (srcX == trgX && srcY == trgY) {
        throw Error('Source and target coordinates must be different.');
    }

    let angle;
    if (trgY == srcY && srcX < trgX) {
        angle = 0.0;
    } else if (trgY == srcY && srcX > trgX) {
        angle = -Math.PI;
    } else if (trgY > srcY && srcX == trgX) {
        angle = Math.PI/2;
    } else if (trgY < srcY && srcX == trgX) {
        angle = -Math.PI/2;
    }
    else {
        angle = Math.atan((trgY - srcY)/(trgX - srcX));
        if (trgX < srcX) {
            if (angle < 0) {
                angle += Math.PI;
            }
            else {
                angle -= Math.PI;
            }
        }
    }
    return angle;
}

function getLeftTop(srcX, srcY, trgX, trgY) {
    const radius = getDistance(srcX, srcY, trgX, trgY)/2;

    let alpha = getAngle(srcX, srcY, trgX, trgY);
    if (alpha < 0) {
        alpha += 2*Math.PI;
    }
    let left;
    let top;
    if (alpha >= 0*Math.PI/2 && alpha < 1*Math.PI/2) {
        left = Math.min(srcX, trgX) - radius*(1 - Math.cos(alpha));
        top = Math.min(srcY, trgY) + radius*Math.sin(alpha);
    }
    else if (alpha >= 1*Math.PI/2 && alpha < 2*Math.PI/2) {
        left = Math.min(srcX, trgX) - radius*(1 + Math.cos(alpha));
        top = Math.min(srcY, trgY) + radius*Math.sin(alpha);
    }
    else if (alpha >= 2*Math.PI/2 && alpha < 3*Math.PI/2) {
        left = Math.min(srcX, trgX) - radius*(1 + Math.cos(alpha));
        top = Math.min(srcY, trgY) - radius*Math.sin(alpha);
    }
    else {
        left = Math.min(srcX, trgX) - radius*(1 - Math.cos(alpha));
        top = Math.min(srcY, trgY) - radius*Math.sin(alpha);
    }
    return [left, top];
}

function getLeftTopCentreOffset(srcX, srcY, trgX, trgY, width, dx, dy) {
    let left = (srcX + trgX)/2 - width/2;
    let top = (srcY + trgY)/2;

    const angle = getAngle(srcX, srcY, trgX, trgY);

    left += dx*Math.cos(angle);
    top += dx*Math.sin(angle);

    left += dy*Math.cos(angle + Math.PI/2);
    top += dy*Math.sin(angle + Math.PI/2);

    return [left, top];
}

function createLabel(canvas, srcX, srcY, trgX, trgY, dx, dy, initValue, fontFamily, fontSize) {
    const angle = getAngle(srcX, srcY, trgX, trgY);

    const elem = document.createElement('div');
    canvas.appendChild(elem);
    elem.style.fontFamily = fontFamily;
    elem.style.fontSize = fontSize;
    elem.style.position = 'absolute';
    elem.style.padding = '0px';
    elem.style.margin = '0px';

    function setValue(value) {
        elem.style.rotate = '0rad';
        elem.innerText = ''+value;
        const [left, top] = getLeftTopCentreOffset(srcX, srcY, trgX, trgY, elem.clientWidth, dx, dy);
        elem.style.width = elem.clientWidth;
        elem.style.height = elem.clientHeight;
        elem.style.left = left+'px';
        elem.style.top = top+'px';
        elem.style.rotate = angle+'rad';
    }
    setValue(initValue);

    return setValue;
}

function createButton(canvas, srcX, srcY, trgX, trgY, label, dx, dy, listener) {
    const angle = getAngle(srcX, srcY, trgX, trgY);

    const elem = document.createElement('input');
    canvas.appendChild(elem);
    elem.type = 'button';
    elem.value = label;
    const [left, top] = getLeftTopCentreOffset(srcX, srcY, trgX, trgY, elem.clientWidth, dx, dy);
    elem.style.position = 'absolute';
    elem.style.rotate = angle+'rad';
    elem.style.left = left+'px';
    elem.style.top = top+'px';
    elem.addEventListener('click', (event) => {
        listener();
    });
}

function createSlider(canvas, srcX, srcY, trgX, trgY, dx, dy, min, max, step, initValue, listener) {
    const length = 90;
    const angle = getAngle(srcX, srcY, trgX, trgY);
    const [left, top] = getLeftTopCentreOffset(srcX, srcY, trgX, trgY, length, dx, dy);

    const elem = document.createElement('input');
    canvas.appendChild(elem);
    elem.type = 'range';
    elem.min = ''+min;
    elem.max = ''+max;
    elem.step = ''+step;
    elem.value = initValue;
    elem.style.width = length+'px';
    elem.style.position = 'absolute';
    elem.style.rotate = angle+'rad';
    elem.style.left = left+'px';
    elem.style.top = top+'px';
    elem.addEventListener('input', (event) => {
        listener(event.target.value);
    });

    function setValue(value) {
        elem.value = value;
    }
    return setValue;
}

function createLine(canvas, srcX, srcY, trgX, trgY, width, colour) {
    const length = getDistance(srcX, srcY, trgX, trgY);
    const angle = getAngle(srcX, srcY, trgX, trgY);
    const [left, top] = getLeftTop(srcX, srcY, trgX, trgY);

    const elem = document.createElement('div');
    canvas.appendChild(elem);
    elem.style.backgroundColor = colour;
    elem.style.borderStyle = '';
    elem.style.width = length+'px';
    elem.style.height = width+'px';
    elem.style.borderRadius = (length/2)+'px';
    elem.style.position = 'absolute';
    elem.style.rotate = angle+'rad';
    elem.style.left = left+'px';
    elem.style.top = top+'px';
}

function createCircle(canvas, centreX, centreY, radius, colour) {
    const elem = document.createElement('div');
    canvas.appendChild(elem);
    elem.style.backgroundColor = colour;
    elem.style.borderStyle = '';
    elem.style.width = (radius*2)+'px';
    elem.style.height = (radius*2)+'px';
    elem.style.borderRadius = '50%';
    elem.style.position = 'absolute';
    elem.style.left = (centreX-radius)+'px';
    elem.style.top = (centreY-radius)+'px';
}

class Parameter {

    constructor(canvas, srcX, srcY, trgX, trgY, initValue, listener) {
        this.canvas = canvas;
        this.srcX = srcX;
        this.srcY = srcY;
        this.trgX = trgX;
        this.trgY = trgY;
        this.value = initValue;
        this.listener = listener;
    }

    _createLineAndLabel() {
        createLine(this.canvas, this.srcX, this.srcY, this.trgX, this.trgY, 10, 'black');
        const setter = createLabel(this.canvas, this.srcX, this.srcY, this.trgX, this.trgY, 0, 20, this.value.toFixed(1), 'Courier New', '15px');
        return (value) => {
            setter(value.toFixed(1));
        };
    }

    createSliderConnection() {
        let labelSetValue = this._createLineAndLabel()

        createSlider(this.canvas, this.srcX, this.srcY, this.trgX, this.trgY, 0, 0, -10.0, 10.0, 0.1, this.value, (value)=>{
            this.value = parseFloat(value);
            labelSetValue(this.value);
            this.listener();
        });
    }

    createButtonsConnection() {
        let labelSetValue = this._createLineAndLabel()

        createButton(this.canvas, this.srcX, this.srcY, this.trgX, this.trgY, '−', -20, 0, ()=>{
            this.value -= 0.2;
            labelSetValue(this.value);
            this.listener();
        });
        createButton(this.canvas, this.srcX, this.srcY, this.trgX, this.trgY, '+', 20, 0, ()=>{
            this.value += 0.2;
            labelSetValue(this.value);
            this.listener();
        });
    }

}

class TrainingItem {

    constructor(elem, input, target) {
        this.elem = elem;
        this.input = input;
        this.target = target;
    }

    shadeElem(value) {
        const shade = Math.round(255*value);
        this.elem.style.borderColor = "rgb("+shade+","+shade+","+shade+")";
    }

}

class NeuralNet {

    static nodeRadius = 30;

    static sigmoid(x) {
        return 1/(1 + Math.exp(-x));
    }

}
