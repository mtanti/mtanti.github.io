class NeuralNetFaces extends NeuralNet {

    connW;
    connB;
    params;

    constructor(canvas, useSliders) {
        super();

        const coordInp = [
            [50, 50],
            [50, 150],
            [50, 250],
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
            if (useSliders) this.connB[j].createSliderConnection(); else this.connB[j].createButtonsConnection();
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

class NeuralNetFacesInstance1 extends NeuralNetFaces {

    trainingItem;
    outputElem;

    constructor() {
        super(
            document.getElementById('faces_instance1_canvas'),
            true,
        );

        this.trainingItem = new TrainingItem(document.getElementById('faces_instance1_img'), [0, 1, 0, 0], 1);

        this.outputElem = document.getElementById('faces_instance1_output');
        this.update();
    }

    update() {
        let output = this.getOutput(this.trainingItem)[0];
        this.trainingItem.shadeElem(output);
        this.outputElem.innerText = output.toFixed(3);
    }

}

class NeuralNetFacesInstance2 extends NeuralNetFaces {

    trainingItem;
    outputElem;

    constructor() {
        super(
            document.getElementById('faces_instance2_canvas'),
            true,
        );

        this.trainingItem = new TrainingItem(document.getElementById('faces_instance2_img'), [0, 1, 1, 0], 1);

        this.outputElem = document.getElementById('faces_instance2_output');
        this.update();
    }

    update() {
        let output = this.getOutput(this.trainingItem)[0];
        this.trainingItem.shadeElem(output);
        this.outputElem.innerText = output.toFixed(3);
    }

}

class NeuralNetFacesHuman extends NeuralNetFaces {

    trainingSet;

    constructor() {
        super(
            document.getElementById('faces_human_canvas'),
            true,
        );

        this.trainingSet = [
            new TrainingItem(document.getElementById('faces_human_img1'), [0, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_human_img2'), [0, 1, 1, 0], 0),
            new TrainingItem(document.getElementById('faces_human_img3'), [1, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_human_img4'), [0, 0, 0, 0], 0),
            new TrainingItem(document.getElementById('faces_human_img5'), [0, 0, 0, 1], 1),
            new TrainingItem(document.getElementById('faces_human_img6'), [0, 0, 0, 0], 0),

            new TrainingItem(document.getElementById('faces_human_img7'),  [0, 1, 0, 1], 0),
            new TrainingItem(document.getElementById('faces_human_img8'),  [1, 0, 0, 0], 0),
            new TrainingItem(document.getElementById('faces_human_img9'),  [0, 1, 0, 0], 0),
            new TrainingItem(document.getElementById('faces_human_img10'), [0, 1, 1, 0], 0),
        ];

        this.update();
    }

    update() {
        for (let i = 0; i < this.trainingSet.length; i++) {
            let output = this.getOutput(this.trainingSet[i]);
            this.trainingSet[i].shadeElem(output);
        }
    }

}

class NeuralNetFacesComputer extends NeuralNetFaces {

    trainingSet;
    errorElem;

    constructor() {
        super(
            document.getElementById('faces_computer_canvas'),
            false,
        );

        this.trainingSet = [
            new TrainingItem(document.getElementById('faces_computer_img1'), [0, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_computer_img2'), [0, 1, 1, 0], 0),
            new TrainingItem(document.getElementById('faces_computer_img3'), [1, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_computer_img4'), [0, 0, 0, 0], 0),
            new TrainingItem(document.getElementById('faces_computer_img5'), [0, 0, 0, 1], 1),
            new TrainingItem(document.getElementById('faces_computer_img6'), [0, 0, 0, 0], 0),
        ];

        this.errorElem = document.getElementById('faces_computer_error');
        this.update();
    }

    update() {
        let totalError = 0.0;
        for (let i = 0; i < this.trainingSet.length; i++) {
            let output = this.getOutput(this.trainingSet[i])[0];
            let error = Math.pow(output - this.trainingSet[i].target, 2);
            this.trainingSet[i].shadeElem(output);
            this.trainingSet[i].elem.innerHTML = `Target: ${this.trainingSet[i].target}<br />Output: ${output.toFixed(3)}<br />Error: ${error.toFixed(3)}`;
            totalError += error;
        }
        this.errorElem.innerText = (totalError/this.trainingSet.length).toFixed(3);
    }

    automate() {
        let bestNewValues = [];
        for (let i = 0; i < this.params.length; i++) {
            let currValue = this.params[i].value;
            let bestNewValue = null;
            let bestAverageError = null;
            for (let newValue of [currValue, currValue - 0.2, currValue + 0.2]) {
                this.params[i].setValue(newValue);
                let totalError = 0.0;
                for (let j = 0; j < this.trainingSet.length; j++) {
                    let output = this.getOutput(this.trainingSet[j])[0];
                    let error = Math.pow(output - this.trainingSet[j].target, 2);
                    totalError += error;
                }
                let averageError = totalError/this.trainingSet.length;
                this.params[i].setValue(currValue);

                if (bestAverageError === null || averageError < bestAverageError) {
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
    new NeuralNetFacesInstance1();
    new NeuralNetFacesInstance2();
    new NeuralNetFacesHuman();
    const nn = new NeuralNetFacesComputer();
    document.getElementById('automate').onclick = (() => {
        nn.automate();
    });
}