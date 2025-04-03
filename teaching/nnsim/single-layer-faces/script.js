class NeuralNetFaces extends NeuralNet {

    connW;
    connB;

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

        this.connW = [];
        for (let i = 0; i < coordOut.length; i++) {
            this.connW.push([]);
            for (let j = 0; j < coordInp.length; j++) {
                this.connW[i].push(
                    new Parameter(canvas, coordInp[j][0], coordInp[j][1], coordOut[i][0], coordOut[i][1], 'black', 0.0, this.update.bind(this))
                );
                if (useSliders) this.connW[i][j].createSliderConnection(); else this.connW[i][j].createButtonsConnection();
            }
            createCircle(canvas, coordOut[i][0], coordOut[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connB = [];
        for (let j = 0; j < coordOut.length; j++) {
            this.connB.push(
                new Parameter(canvas, coordOut[j][0], coordOut[j][1], coordOut[j][0], coordOut[j][1] + 150, 'black', 0.0, this.update.bind(this))
            );
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
            this.trainingSet[i].shadeElem(output);
            totalError += Math.pow(output - this.trainingSet[i].target, 2)
        }
        this.errorElem.innerText = (totalError/this.trainingSet.length).toFixed(3);
    }

}

function onloadFunction() {
    new NeuralNetFacesInstance1();
    new NeuralNetFacesInstance2();
    new NeuralNetFacesHuman();
    new NeuralNetFacesComputer();
}