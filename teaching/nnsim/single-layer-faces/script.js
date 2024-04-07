class NeuralNetFacesInstance extends NeuralNet {

    connW;
    connB;
    trainingItem;

    constructor() {
        super();

        const canvas = document.getElementById('faces_instance_canvas');
        const coordInput0 = [50, 50];
        const coordInput1 = [50, 150];
        const coordInput2 = [50, 250];
        const coordInput3 = [50, 350];
        const coordNode = [400, 200];
        const coordBias = [400, 350];

        this.connW = [
            new Parameter(canvas, coordInput0[0], coordInput0[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput1[0], coordInput1[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput2[0], coordInput2[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput3[0], coordInput3[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
        ];
        this.connB = new Parameter(canvas, coordBias[0], coordBias[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this));
        createCircle(canvas, coordNode[0], coordNode[1], NeuralNet.nodeRadius, 'black');

        this.trainingItem = new TrainingItem(document.getElementById('faces_instance_img'), [1, 1, 0, 0], 1);

        for (let i = 0; i < this.connW.length; i++) {
            this.connW[i].createSliderConnection();
        }
        this.connB.createSliderConnection();

        this.outputElem = document.getElementById('faces_instance_output');
        this.outputElem.innerText = '0.500';
    }

    update() {
        let logit = this.connB.value;
        for (let j = 0; j < this.connW.length; j++) {
            logit += this.connW[j].value*this.trainingItem.input[j];
        }
        let output = NeuralNet.sigmoid(logit);
        this.trainingItem.shadeElem(output);
        this.outputElem.innerText = output.toFixed(3);
    }

}

class NeuralNetFacesHuman extends NeuralNet {

    connW;
    connB;
    trainingSet;

    constructor() {
        super();

        const canvas = document.getElementById('faces_human_canvas');
        const coordInput0 = [50, 50];
        const coordInput1 = [50, 150];
        const coordInput2 = [50, 250];
        const coordInput3 = [50, 350];
        const coordNode = [400, 200];
        const coordBias = [400, 350];

        this.connW = [
            new Parameter(canvas, coordInput0[0], coordInput0[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput1[0], coordInput1[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput2[0], coordInput2[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput3[0], coordInput3[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
        ];
        this.connB = new Parameter(canvas, coordBias[0], coordBias[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this));
        createCircle(canvas, coordNode[0], coordNode[1], NeuralNet.nodeRadius, 'black');

        this.trainingSet = [
            new TrainingItem(document.getElementById('faces_human_img1'), [0, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_human_img2'), [0, 1, 1, 0], 0),
            new TrainingItem(document.getElementById('faces_human_img3'), [1, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_human_img4'), [0, 0, 0, 0], 0),
            new TrainingItem(document.getElementById('faces_human_img5'), [0, 0, 0, 1], 1),
            new TrainingItem(document.getElementById('faces_human_img6'), [0, 0, 0, 0], 0),
        ];

        for (let i = 0; i < this.connW.length; i++) {
            this.connW[i].createSliderConnection();
        }
        this.connB.createSliderConnection();
    }

    update() {
        for (let i = 0; i < this.trainingSet.length; i++) {
            let logit = this.connB.value;
            for (let j = 0; j < this.connW.length; j++) {
                logit += this.connW[j].value*this.trainingSet[i].input[j];
            }
            let output = NeuralNet.sigmoid(logit);
            this.trainingSet[i].shadeElem(output);
        }
    }

}

class NeuralNetFacesComputer extends NeuralNet {

    connW;
    connB;
    trainingSet;

    constructor() {
        super();

        const canvas = document.getElementById('faces_computer_canvas');
        const coordInput0 = [50, 50];
        const coordInput1 = [50, 150];
        const coordInput2 = [50, 250];
        const coordInput3 = [50, 350];
        const coordNode = [400, 200];
        const coordBias = [400, 350];

        this.connW = [
            new Parameter(canvas, coordInput0[0], coordInput0[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput1[0], coordInput1[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput2[0], coordInput2[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
            new Parameter(canvas, coordInput3[0], coordInput3[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this)),
        ];
        this.connB = new Parameter(canvas, coordBias[0], coordBias[1], coordNode[0], coordNode[1], 0.0, this.update.bind(this));
        createCircle(canvas, coordNode[0], coordNode[1], NeuralNet.nodeRadius, 'black');

        this.trainingSet = [
            new TrainingItem(document.getElementById('faces_computer_img1'), [0, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_computer_img2'), [0, 1, 1, 0], 0),
            new TrainingItem(document.getElementById('faces_computer_img3'), [1, 1, 0, 0], 1),
            new TrainingItem(document.getElementById('faces_computer_img4'), [0, 0, 0, 0], 0),
            new TrainingItem(document.getElementById('faces_computer_img5'), [0, 0, 0, 1], 1),
            new TrainingItem(document.getElementById('faces_computer_img6'), [0, 0, 0, 0], 0),
        ];

        for (let i = 0; i < this.connW.length; i++) {
            this.connW[i].createButtonsConnection();
        }
        this.connB.createButtonsConnection();

        this.errorElem = document.getElementById('faces_computer_error');
        this.errorElem.innerText = '0.250';
    }

    update() {
        let totalError = 0.0;
        for (let i = 0; i < this.trainingSet.length; i++) {
            let logit = this.connB.value;
            for (let j = 0; j < this.connW.length; j++) {
                logit += this.connW[j].value*this.trainingSet[i].input[j];
            }
            let output = NeuralNet.sigmoid(logit);
            this.trainingSet[i].shadeElem(output);
            totalError += Math.pow(output - this.trainingSet[i].target, 2)
        }
        this.errorElem.innerText = (totalError/this.trainingSet.length).toFixed(3);
    }

}

function onloadFunction() {
    new NeuralNetFacesInstance();
    new NeuralNetFacesHuman();
    new NeuralNetFacesComputer();
}