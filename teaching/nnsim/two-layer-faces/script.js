class NeuralNetFaces extends NeuralNet {

    connWh;
    connBh;
    connWo;
    connBo;

    constructor(canvas, useSliders) {
        super();

        const coordInp = [
            [50, 50],
            [50, 150],
            [50, 250],
            [50, 350],
        ];
        const coordHid = [
            [250, 100],
            [250, 300],
        ];
        const coordOut = [
            [400, 200],
        ];

        this.connWh = [];
        for (let i = 0; i < coordHid.length; i++) {
            this.connWh.push([]);
            for (let j = 0; j < coordInp.length; j++) {
                this.connWh[i].push(
                    new Parameter(canvas, coordInp[j][0], coordInp[j][1], coordHid[i][0], coordHid[i][1], 'black', 0.0, this.update.bind(this))
                );
                if (useSliders) this.connWh[i][j].createSliderConnection(); else this.connWh[i][j].createButtonsConnection();
            }
            createCircle(canvas, coordHid[i][0], coordHid[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connBh = [];
        for (let j = 0; j < coordHid.length; j++) {
            this.connBh.push(
                new Parameter(canvas, coordHid[j][0], coordHid[j][1], coordHid[j][0], coordHid[j][1] + 150, 'black', 0.0, this.update.bind(this))
            );
            if (useSliders) this.connBh[j].createSliderConnection(); else this.connBh[j].createButtonsConnection();
        }

        this.connWo = [];
        for (let i = 0; i < coordOut.length; i++) {
            this.connWo.push([]);
            for (let j = 0; j < coordHid.length; j++) {
                this.connWo[i].push(
                    new Parameter(canvas, coordHid[j][0], coordHid[j][1], coordOut[i][0], coordOut[i][1], 'black', 0.0, this.update.bind(this))
                );
                if (useSliders) this.connWo[i][j].createSliderConnection(); else this.connWo[i][j].createButtonsConnection();
            }
            createCircle(canvas, coordOut[i][0], coordOut[i][1], NeuralNet.nodeRadius, 'black');
        }

        this.connBo = [];
        for (let j = 0; j < coordOut.length; j++) {
            this.connBo.push(
                new Parameter(canvas, coordOut[j][0], coordOut[j][1], coordOut[j][0], coordOut[j][1] + 150, 'black', 0.0, this.update.bind(this))
            );
            if (useSliders) this.connBo[j].createSliderConnection(); else this.connBo[j].createButtonsConnection();
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


class NeuralNetFacesInstance extends NeuralNetFaces {

    trainingItem;
    outputElem;

    constructor() {
        super(
            document.getElementById('faces_instance_canvas'),
            true,
        );

        this.trainingItem = new TrainingItem(document.getElementById('faces_instance_img'), [1, 1, 0, 0], 1);

        this.outputElem = document.getElementById('faces_instance_output');
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

function onloadFunction() {
    new NeuralNetFacesInstance();
    new NeuralNetFacesHuman();
}
