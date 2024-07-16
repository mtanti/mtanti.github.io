class NeuralNetText extends NeuralNet {

    initS;
    connWer;
    connWrr;
    connWo;
    connBo;

    constructor(canvas, useSliders, timeSteps) {
        super();

        const coordIni = [
            [50, 50],
            [50, 250],
        ];
        let coordInp = [
            [
                [50, 450],
                [150, 450],
            ],
        ];
        for (let i = 0; i < timeSteps - 1; i++) {
            const coords = [
                [
                    coordInp[coordInp.length - 1][0][0] + 200,
                    coordInp[coordInp.length - 1][0][1],
                ],
                [
                    coordInp[coordInp.length - 1][1][0] + 200,
                    coordInp[coordInp.length - 1][1][1],
                ],
            ];
            coordInp.push(coords);
        }
        let coordRec = [
            [
                [250, 50],
                [250, 250],
            ],
        ];
        for (let i = 0; i < timeSteps - 1; i++) {
            const coords = [
                [
                    coordRec[coordRec.length - 1][0][0] + 200,
                    coordRec[coordRec.length - 1][0][1],
                ],
                [
                    coordRec[coordRec.length - 1][1][0] + 200,
                    coordRec[coordRec.length - 1][1][1],
                ],
            ];
            coordRec.push(coords);
        }
        const coordOut = [
            [
                coordRec[coordRec.length - 1][0][0] + 100,
                (coordRec[coordRec.length - 1][0][1] + coordRec[coordRec.length - 1][1][1])/2,
            ],
        ];
        

        this.initS = [];
        for (let i = 0; i < coordRec[0].length; i++) {
            this.initS.push(0.0);
        }

        this.connWer = [];
        for (let t = 0; t < coordRec.length; t++) {
            this.connWer.push([]);
            for (let i = 0; i < coordRec[t].length; i++) {
                this.connWer[t].push([]);
                for (let j = 0; j < coordInp[t].length; j++) {
                    this.connWer[t][i].push(
                        new Parameter(canvas, coordInp[t][j][0], coordInp[t][j][1], coordRec[t][i][0], coordRec[t][i][1], 'black', 0.0, (value) => this.setWer(i, j, value))
                    );
                    if (useSliders) this.connWer[t][i][j].createSliderConnection(); else this.connWer[t][i][j].createButtonsConnection();
                }
            }
        }

        this.connWrr = [];
        for (let t = 0; t < coordRec.length; t++) {
            this.connWrr.push([]);
            for (let i = 0; i < coordRec[t].length; i++) {
                this.connWrr[t].push([]);
                if (t == 0) {
                    for (let j = 0; j < coordIni.length; j++) {
                        this.connWrr[0][i].push(
                            new Parameter(canvas, coordIni[j][0], coordIni[j][1], coordRec[0][i][0], coordRec[0][i][1], 'black', 0.0, (value) => this.setWrr(i, j, value))
                        );
                        if (useSliders) this.connWrr[0][i][j].createSliderConnection(); else this.connWrr[0][i][j].createButtonsConnection();
                    }
                }
                else {
                    for (let j = 0; j < coordInp[t].length; j++) {
                        this.connWrr[t][i].push(
                            new Parameter(canvas, coordRec[t - 1][j][0], coordRec[t - 1][j][1], coordRec[t][i][0], coordRec[t][i][1], 'black', 0.0, (value) => this.setWrr(i, j, value))
                        );
                        if (useSliders) this.connWrr[t][i][j].createSliderConnection(); else this.connWrr[t][i][j].createButtonsConnection();
                    }
                }
                createCircle(canvas, coordRec[t][i][0], coordRec[t][i][1], NeuralNet.nodeRadius, 'black');
            }
        }

        this.connWo = [];
        for (let i = 0; i < coordOut.length; i++) {
            this.connWo.push([]);
            for (let j = 0; j < coordRec[coordRec.length - 1].length; j++) {
                this.connWo[i].push(
                    new Parameter(canvas, coordRec[coordRec.length - 1][j][0], coordRec[coordRec.length - 1][j][1], coordOut[i][0], coordOut[i][1], 'black', 0.0, this.update.bind(this))
                );
                if (useSliders) this.connWo[i][j].createSliderConnection(); else this.connWo[i][j].createButtonsConnection();
            }
            createCircle(canvas, coordOut[i][0], coordOut[i][1], NeuralNet.nodeRadius, 'black');
        }
    }

    setWer(i, j, value) {
        for (let t = 0; t < this.connWer.length; t++) {
            this.connWer[t][i][j].setListenerStatus(false);
        }
        for (let t = 0; t < this.connWer.length; t++) {
            this.connWer[t][i][j].setValue(value);
        }
        for (let t = 0; t < this.connWer.length; t++) {
            this.connWer[t][i][j].setListenerStatus(true);
        }
        this.update();
    }

    setWrr(i, j, value) {
        for (let t = 0; t < this.connWrr.length; t++) {
            this.connWrr[t][i][j].setListenerStatus(false);
        }
        for (let t = 0; t < this.connWrr.length; t++) {
            this.connWrr[t][i][j].setValue(value);
        }
        for (let t = 0; t < this.connWrr.length; t++) {
            this.connWrr[t][i][j].setListenerStatus(true);
        }
        this.update();
    }

    getHidden(trainingItem) {
        let hiddenValues = [];
        hiddenValues.push(this.initS);
        for (let t = 0; t < trainingItem.input.length; t++) {
            let newHidden = [];
            for (let i = 0; i < this.connWrr[0].length; i++) {
                let logit = 0.0;
                for (let j = 0; j < this.connWer[0][i].length; j++) {
                    logit += this.connWer[0][i][j].value*trainingItem.input[t][j];
                }
                for (let j = 0; j < this.connWrr[0][i].length; j++) {
                    logit += this.connWrr[0][i][j].value*hiddenValues[t][j];
                }
                newHidden.push(NeuralNet.sigmoid(logit));
            }
            hiddenValues.push(newHidden);
        }
        return hiddenValues;
    }

    getOutput(trainingItem) {
        let hiddenValues = this.getHidden(trainingItem)[trainingItem.input.length];
        let outputs = [];
        for (let i = 0; i < this.connWo.length; i++) {
            let logit = 0.0;
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
            true,
            3,
        );

        this.trainingItem = new TrainingItem(document.getElementById('text_instance_box'), [[1, 0], [0, 1], [1, 0]], 1);

        this.outputElem = document.getElementById('text_instance_output');
        this.update();
    }

    update() {
        let output = this.getOutput(this.trainingItem)[0];
        this.trainingItem.shadeElem(output);
        this.outputElem.innerText = output.toFixed(3);
    }

}

class NeuralNetTextHuman extends NeuralNetText {

    trainingSet;

    constructor() {
        const canvas = document.getElementById('text_human_canvas');
        super(
            canvas,
            true,
            1,
        );
        
        const elem = document.createElement('div');
        elem.innerHTML = '...';
        canvas.appendChild(elem);
        elem.style.fontFamily = 'Arial';
        elem.style.fontSize = '32pt';
        elem.style.position = 'absolute';
        elem.style.left = '250px';
        elem.style.top = '120px';

        this.trainingSet = [
            new TrainingItem(document.getElementById('text_human_box1'), [[1, 0]], 1),
            new TrainingItem(document.getElementById('text_human_box2'), [[0, 1]], 0),
            new TrainingItem(document.getElementById('text_human_box3'), [[0, 1], [1, 0]], 1),
            new TrainingItem(document.getElementById('text_human_box4'), [[0, 1], [0, 1]], 0),
            new TrainingItem(document.getElementById('text_human_box5'), [[1, 0], [0, 1], [1, 0]], 1),
            new TrainingItem(document.getElementById('text_human_box6'), [[0, 1], [0, 1], [0, 1]], 0),
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
    new NeuralNetTextInstance();
    new NeuralNetTextHuman();
}