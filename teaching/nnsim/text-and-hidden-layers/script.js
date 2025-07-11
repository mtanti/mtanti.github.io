class NeuralNetText extends NeuralNet {

    onehotPos;
    numWords;
    useSharedParams;
    connWh;
    connBh;
    connWo;
    connBo;
    params;
    coordHid;
    coordOut;

    constructor(canvas, connectionType) {
        super();

        this.onehotSize = 3;
        this.numWords = 2;
        this.canvas = canvas;

        const coordInp = [
            [20, 45],
            [20, 95],
            [20, 145],
            [20, 195],
            [20, 245],
            [20, 295],
            [20, 345],
            [20, 395],
        ];
        const coordHid = [
            [170, 100],
            [170, 300],
        ];
        this.coordHid = coordHid;
        const coordOut = [
            [320, 200],
        ];
        this.coordOut = coordOut;
        this.params = [];

        this.connWh = [];
        for (let i = 0; i < coordHid.length; i++) {
            this.connWh.push([]);
            for (let j = 0; j < coordInp.length; j++) {
                let param = new Parameter(canvas, coordInp[j][0], coordInp[j][1], coordHid[i][0], coordHid[i][1], 'black', 0.0, this.update.bind(this));
                this.connWh[i].push(param);
                this.params.push(param);
                if (connectionType == 'slider') {
                    param.createSliderConnection();
                }
                else if (connectionType == 'interactionless') {
                    param.createInteractionlessConnection();
                }
                else {
                    param.createlabellessConnection();
                }
            }
            createCircle(canvas, coordHid[i][0], coordHid[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connBh = [];
        for (let j = 0; j < coordHid.length; j++) {
            let param = new Parameter(canvas, coordHid[j][0], coordHid[j][1], coordHid[j][0], coordHid[j][1] + 150, 'black', 0.0, this.update.bind(this));
            this.connBh.push(param);
            this.params.push(param);
            if (connectionType == 'slider') {
                param.createSliderConnection();
            }
            else if (connectionType == 'interactionless') {
                param.createInteractionlessConnection();
            }
            else {
                param.createlabellessConnection();
            }
        }

        this.connWo = [];
        for (let i = 0; i < coordOut.length; i++) {
            this.connWo.push([]);
            for (let j = 0; j < coordHid.length; j++) {
                let param = new Parameter(canvas, coordHid[j][0], coordHid[j][1], coordOut[i][0], coordOut[i][1], 'black', 0.0, this.update.bind(this));
                this.connWo[i].push(param);
                this.params.push(param);
                if (connectionType == 'slider') {
                    param.createSliderConnection();
                }
                else if (connectionType == 'interactionless') {
                    param.createInteractionlessConnection();
                }
                else {
                    param.createlabellessConnection();
                }
            }
            createCircle(canvas, coordOut[i][0], coordOut[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connBo = [];
        for (let j = 0; j < coordOut.length; j++) {
            let param = new Parameter(canvas, coordOut[j][0], coordOut[j][1], coordOut[j][0], coordOut[j][1] + 150, 'black', 0.0, this.update.bind(this));
            this.connBo.push(param);
            this.params.push(param);
            if (connectionType == 'slider') {
                param.createSliderConnection();
            }
            else if (connectionType == 'interactionless') {
                param.createInteractionlessConnection();
            }
            else {
                param.createlabellessConnection();
            }
        }
    }

    update() {
    }

    getHidden(trainingItem) {
        let hiddenValues = [];
        for (let i = 0; i < this.connWh.length; i++) {
            let logit = this.connBh[i].value;
            for (let j = 0; j < this.connWh[i].length; j++) {
                logit += this.connWh[i][j].value*trainingItem.input[j];
            }
            hiddenValues.push(NeuralNet.sigmoid(logit));
        }
        return hiddenValues;
    }

    getOutput(trainingItem) {
        let hiddenValues = this.getHidden(trainingItem);
        let outputs = [];
        for (let i = 0; i < this.connWo.length; i++) {
            let logit = this.connBo[i].value;
            for (let j = 0; j < this.connWo[i].length; j++) {
                logit += this.connWo[i][j].value*hiddenValues[j];
            }
            outputs.push(NeuralNet.sigmoid(logit));
        }
        return outputs;
    }

}

class NeuralNetTextInstance extends NeuralNetText {

    trainingItem;
    outputElem;

    constructor() {
        super(
            document.getElementById('text_instance_canvas'),
            'slider',
        );

        this.trainingItem = new TrainingItem(document.getElementById('text_instance_box'), [1, 0, 0, 0,  0, 0, 1, 0], 1);

        this.outputElem = document.getElementById('text_instance_output');
        this.update();
    }

    update() {
        let output = this.getOutput(this.trainingItem)[0];
        this.trainingItem.shadeElem(output);
        this.outputElem.innerText = output.toFixed(3);
    }

}

class NeuralNetTextComputer extends NeuralNetText {

    trainingSet;
    trainingSetTexts;
    errorElem;
    updateListeners;

    constructor() {
        super(
            document.getElementById('text_computer_canvas'),
            'interactionless',
        );

        this.updateListeners = [];
        this.trainingSetTexts = [
            'it\'s good',
            'it\'s bad',
            'not bad',
            'not good',
        ];
        this.trainingSet = [
            new TrainingItem(document.getElementById('text_computer_box1'), [1, 0, 0, 0,  0, 0, 1, 0], 1),
            new TrainingItem(document.getElementById('text_computer_box2'), [1, 0, 0, 0,  0, 0, 0, 1], 0),
            new TrainingItem(document.getElementById('text_computer_box3'), [0, 1, 0, 0,  0, 0, 0, 1], 1),
            new TrainingItem(document.getElementById('text_computer_box4'), [0, 1, 0, 0,  0, 0, 1, 0], 0),
        ];

        this.errorElem = document.getElementById('text_computer_error');
        this.update();
    }

    addUpdateListener(listener) {
        this.updateListeners.push(listener);
    }

    initialise() {
        for (let i = 0; i < this.params.length; i++) {
            let r = Math.floor(Math.random()*4);
            let value = [-2.0, -1.0, 1.0, 2.0][r];
            this.params[i].setValue(value);
        }
    }

    getAverageError() {
        let totalError = 0.0;
        for (let j = 0; j < this.trainingSet.length; j++) {
            let output = this.getOutput(this.trainingSet[j])[0];
            let error = Math.pow(output - this.trainingSet[j].target, 2);
            totalError += error;
        }
        return totalError/this.trainingSet.length;
    }

    update() {
        let hiddens = [];
        let outputs = [];
        let errors = [];
        for (let i = 0; i < this.trainingSet.length; i++) {
            hiddens.push(this.getHidden(this.trainingSet[i]))
            let output = this.getOutput(this.trainingSet[i])[0];
            outputs.push(output);
            let error = Math.pow(output - this.trainingSet[i].target, 2);
            errors.push(error);
            this.trainingSet[i].shadeElem(output);
            this.trainingSet[i].elem.innerHTML = `Text: ${this.trainingSetTexts[i]}<br />Target: ${this.trainingSet[i].target}<br />Output: ${output.toFixed(3)}<br />Error: ${error.toFixed(3)}`;
        }
        this.errorElem.innerText = this.getAverageError().toFixed(3);

        for (let i = 0; i < this.updateListeners.length; i++) {
            this.updateListeners[i](this, hiddens, outputs, errors);
        }
    }

    automate() {
        let bestNewValues = [];
        let currAverageError = this.getAverageError();
        for (let i = 0; i < this.params.length; i++) {
            let currValue = this.params[i].value;
            let bestNewValue = currValue;
            let bestAverageError = currAverageError;
            for (let newValue of [currValue - 0.2, currValue + 0.2]) {
                this.params[i].setValue(newValue);
                let averageError = this.getAverageError();
                this.params[i].setValue(currValue);

                if (averageError < bestAverageError) {
                    bestNewValue = newValue;
                    bestAverageError = averageError;
                }
            }
            bestNewValues.push(bestNewValue);
        }

        for (let i = 0; i < this.params.length; i++) {
            this.params[i].setValue(bestNewValues[i]);
        }
    }

}

class NeuralNetTextHidden extends NeuralNetText {

    hiddenElem1;
    hiddenElem2;
    outputElem;

    constructor(canvas, trainingItemIndex) {
        super(canvas, 'labelless');

        this.trainingItemIndex = trainingItemIndex;
        this.hiddenElem1 = this._createTextBox(this.coordHid[0][0], this.coordHid[0][1]);
        this.hiddenElem2 = this._createTextBox(this.coordHid[1][0], this.coordHid[1][1]);
        this.outputElem = this._createTextBox(this.coordOut[0][0], this.coordOut[0][1]);
    }

    _createTextBox(centreX, centreY) {
        const radius = NeuralNet.nodeRadius;
        const elem = document.createElement('div');
        this.canvas.appendChild(elem);
        elem.style.borderStyle = '';
        elem.style.width = (radius*2)+'px';
        elem.style.height = (radius*2)+'px';
        elem.style.position = 'absolute';
        elem.style.left = (centreX-radius)+'px';
        elem.style.top = (centreY-radius)+'px';
        elem.style.fontFamily = 'Courier New';
        elem.style.fontSize = '15px';
        elem.style.textAlign = 'center';
        elem.style.color = 'white';
        elem.style.lineHeight = (radius*2)+'px';
        return elem;
    }

    listener(mainNN, hiddens, outputs, errors) {
        this.hiddenElem1.innerText = hiddens[this.trainingItemIndex][0].toFixed(3);
        this.hiddenElem2.innerText = hiddens[this.trainingItemIndex][1].toFixed(3);
        this.outputElem.innerText = outputs[this.trainingItemIndex].toFixed(3);
    }

}

function onloadFunction() {
    new NeuralNetTextInstance();

    const computer = new NeuralNetTextComputer();
    document.getElementById('initialise').onclick = (() => {
        computer.initialise();
    });
    document.getElementById('automate').onclick = (() => {
        computer.automate();
    });

    const hidden1 = new NeuralNetTextHidden(
        document.getElementById('text_hidden1_canvas'),
        0,
    );
    const hidden2 = new NeuralNetTextHidden(
        document.getElementById('text_hidden2_canvas'),
        1,
    );
    const hidden3 = new NeuralNetTextHidden(
        document.getElementById('text_hidden3_canvas'),
        2,
    );
    const hidden4 = new NeuralNetTextHidden(
        document.getElementById('text_hidden4_canvas'),
        3,
    );

    const scatter = new Chart(
        document.getElementById('scatter'),
        {
            type: 'scatter',
            data: {
                datasets: [
                    {
                        label: 'it\'s good',
                        data: [
                            {x: 0, y: 0},
                        ],
                        pointRadius: 10,
                        backgroundColor: 'blue',
                    },
                    {
                        label: 'it\'s bad',
                        data: [
                            {x: 0, y: 0},
                        ],
                        pointRadius: 10,
                        backgroundColor: 'red',
                    },
                    {
                        label: 'not bad',
                        data: [
                            {x: 0, y: 0},
                        ],
                        pointRadius: 10,
                        backgroundColor: 'cyan',
                    },
                    {
                        label: 'not good',
                        data: [
                            {x: 0, y: 0},
                        ],
                        pointRadius: 10,
                        backgroundColor: 'magenta',
                    },
                ]
            },
            options: {
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'neural unit 1',
                        },
                        min: -0.1,
                        max: 1.1,
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'neural unit 2',
                        },
                        min: -0.1,
                        max: 1.1,
                    }
                },
                responsive: false,
            }
        }
    );

    computer.addUpdateListener(hidden1.listener.bind(hidden1));
    computer.addUpdateListener(hidden2.listener.bind(hidden2));
    computer.addUpdateListener(hidden3.listener.bind(hidden3));
    computer.addUpdateListener(hidden4.listener.bind(hidden4));
    computer.addUpdateListener((mainNN, hiddens, outputs, errors) => {
        for (let i = 0; i < 4; i++) {
            scatter.data.datasets[i].data[0].x = hiddens[i][0];
            scatter.data.datasets[i].data[0].y = hiddens[i][1];
        }
        scatter.update();
    });

    computer.update();
}
