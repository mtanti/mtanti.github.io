class NeuralNetSingleLayerFlags extends NeuralNet {

    connW;
    connB;
    params;

    constructor(canvas, useSliders) {
        super();

        const coordInp = [
            [50, 50],
            [50, 350],
        ];
        const coordOut = [
            [400, 200],
        ];

        this.params = [];

        this.connW = [];
        for (let i = 0; i < coordOut.length; i++) {
            this.connW.push([]);
            for (let j = 0; j < coordInp.length; j++) {
                let param = new Parameter(canvas, coordInp[j][0], coordInp[j][1], coordOut[i][0], coordOut[i][1], 'black', 0.0, this.update.bind(this));
                this.connW[i].push(param);
                this.params.push(param);
                if (useSliders) param.createSliderConnection(); else this.connW[i][j].createButtonsConnection();
            }
            createCircle(canvas, coordOut[i][0], coordOut[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connB = [];
        for (let j = 0; j < coordOut.length; j++) {
            let param = new Parameter(canvas, coordOut[j][0], coordOut[j][1], coordOut[j][0], coordOut[j][1] + 150, 'black', 0.0, this.update.bind(this));
            this.connB.push(param);
            this.params.push(param);
            if (useSliders) param.createSliderConnection(); else param.createButtonsConnection();
        }
    }

    getOutput(trainingItem) {
        let outputs = [];
        for (let i = 0; i < this.connW.length; i++) {
            let logit = this.connB[i].value;
            for (let j = 0; j < this.connW[i].length; j++) {
                logit += this.connW[i][j].value*trainingItem.input[j];
            }
            outputs.push(NeuralNet.sigmoid(logit));
        }
        return outputs;
    }

}

class NeuralNetTwoLayerFlags extends NeuralNet {

    connWh;
    connBh;
    connWo;
    connBo;
    params;

    constructor(canvas, useSliders) {
        super();

        const coordInp = [
            [50, 50],
            [50, 350],
        ];
        const coordHid = [
            [250, 100],
            [250, 300],
        ];
        const coordOut = [
            [400, 200],
        ];
        this.params = [];

        this.connWh = [];
        for (let i = 0; i < coordHid.length; i++) {
            this.connWh.push([]);
            for (let j = 0; j < coordInp.length; j++) {
                let param = new Parameter(canvas, coordInp[j][0], coordInp[j][1], coordHid[i][0], coordHid[i][1], 'black', 0.0, this.update.bind(this));
                this.connWh[i].push(param);
                this.params.push(param);
                if (useSliders) param.createSliderConnection(); else param.createButtonsConnection();
            }
            createCircle(canvas, coordHid[i][0], coordHid[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connBh = [];
        for (let j = 0; j < coordHid.length; j++) {
            let param = new Parameter(canvas, coordHid[j][0], coordHid[j][1], coordHid[j][0], coordHid[j][1] + 150, 'black', 0.0, this.update.bind(this));
            this.connBh.push(param);
            this.params.push(param);
            if (useSliders) param.createSliderConnection(); else param.createButtonsConnection();
        }

        this.connWo = [];
        for (let i = 0; i < coordOut.length; i++) {
            this.connWo.push([]);
            for (let j = 0; j < coordHid.length; j++) {
                let param = new Parameter(canvas, coordHid[j][0], coordHid[j][1], coordOut[i][0], coordOut[i][1], 'black', 0.0, this.update.bind(this));
                this.connWo[i].push(param);
                this.params.push(param);
                if (useSliders) param.createSliderConnection(); else param.createButtonsConnection();
            }
            createCircle(canvas, coordOut[i][0], coordOut[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connBo = [];
        for (let j = 0; j < coordOut.length; j++) {
            let param = new Parameter(canvas, coordOut[j][0], coordOut[j][1], coordOut[j][0], coordOut[j][1] + 150, 'black', 0.0, this.update.bind(this));
            this.connBo.push(param);
            this.params.push(param);
            if (useSliders) param.createSliderConnection(); else param.createButtonsConnection();
        }
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

class NeuralNetSingleLayerFlags_ extends NeuralNetSingleLayerFlags {

    trainingSet;

    constructor() {
        super(
            document.getElementById('flags_onelayer_canvas'),
            true,
        );

        this.trainingSet = [
            new TrainingItem(document.getElementById('flags_onelayer_img1'), [1, 0], 1),
            new TrainingItem(document.getElementById('flags_onelayer_img2'), [1, 1], 0),
            new TrainingItem(document.getElementById('flags_onelayer_img3'), [0, 1], 1),
            new TrainingItem(document.getElementById('flags_onelayer_img4'), [0, 0], 0),
        ];

        this.update();
    }

    update() {
        for (let i = 0; i < this.trainingSet.length; i++) {
            let output = this.getOutput(this.trainingSet[i])[0];
            this.trainingSet[i].shadeElem(output);
        }
    }

}

class NeuralNetTwoLayerFlagsInstance extends NeuralNetTwoLayerFlags {

    trainingItem;
    outputElem;

    constructor() {
        super(
            document.getElementById('flags_instance_canvas'),
            true,
        );

        this.trainingItem = new TrainingItem(document.getElementById('flags_instance_img'), [1, 0], 1);

        this.outputElem = document.getElementById('flags_instance_output');
        this.update();
    }

    update() {
        let output = this.getOutput(this.trainingItem)[0];
        this.trainingItem.shadeElem(output);
        this.outputElem.innerText = output.toFixed(3);
    }

}

class NeuralNetTwoLayerFlagsHuman extends NeuralNetTwoLayerFlags {

    trainingSet;

    constructor() {
        super(
            document.getElementById('flags_human_canvas'),
            true,
        );

        this.trainingSet = [
            new TrainingItem(document.getElementById('flags_human_img1'), [1, 0], 1),
            new TrainingItem(document.getElementById('flags_human_img2'), [1, 1], 0),
            new TrainingItem(document.getElementById('flags_human_img3'), [0, 1], 1),
            new TrainingItem(document.getElementById('flags_human_img4'), [0, 0], 0),
        ];

        this.update();
    }

    update() {
        for (let i = 0; i < this.trainingSet.length; i++) {
            let output = this.getOutput(this.trainingSet[i])[0];
            this.trainingSet[i].shadeElem(output);
        }
    }

}

class NeuralNetTwoLayerFlagsComputer extends NeuralNetTwoLayerFlags {

    trainingSet;
    errorElem;

    constructor() {
        super(
            document.getElementById('flags_computer_canvas'),
            false,
        );

        this.trainingSet = [
            new TrainingItem(document.getElementById('flags_computer_img1'), [1, 0], 1),
            new TrainingItem(document.getElementById('flags_computer_img2'), [1, 1], 0),
            new TrainingItem(document.getElementById('flags_computer_img3'), [0, 1], 1),
            new TrainingItem(document.getElementById('flags_computer_img4'), [0, 0], 0),
        ];

        this.errorElem = document.getElementById('flags_computer_error');
        this.update();
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
        for (let i = 0; i < this.trainingSet.length; i++) {
            let output = this.getOutput(this.trainingSet[i])[0];
            let error = Math.pow(output - this.trainingSet[i].target, 2);
            this.trainingSet[i].shadeElem(output);
            this.trainingSet[i].elem.innerHTML = `Target: ${this.trainingSet[i].target}<br />Output: ${output.toFixed(3)}<br />Error: ${error.toFixed(3)}`;
        }
        this.errorElem.innerText = this.getAverageError().toFixed(3);
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

function onloadFunction() {
    new NeuralNetSingleLayerFlags_();
    new NeuralNetTwoLayerFlagsInstance();
    new NeuralNetTwoLayerFlagsHuman();
    const nn = new NeuralNetTwoLayerFlagsComputer();
    document.getElementById('initialise').onclick = (() => {
        nn.initialise();
    });
    document.getElementById('automate').onclick = (() => {
        nn.automate();
    });
}
