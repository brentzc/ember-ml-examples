import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import tf from "@tensorflow/tfjs";
import mobilenet from "@tensorflow-models/mobilenet";
import knnClassifier from "@tensorflow-models/knn-classifier";

export default class MovementComponent extends Component {

    @tracked webcam = null;
    @tracked model = null;
    @tracked net = null;
    @tracked predictions = [];
    @tracked classifier = null;

    @tracked buttons = [
        { label: 'Up' },
        { label: 'Down' },
        { label: 'Left' },
        { label: 'Right' }
    ]

    @action async loadModel(element) {
        console.log('load model');
        this.classifier = knnClassifier.create();
        this.net = await mobilenet.load();
        this.webcam = await tf.data.webcam(element);
    }

    @action async addExample(class_id) {
        console.log(class_id);
        const img = await this.webcam.capture();
        const activation = this.net.infer(img, "conv_preds");
        this.classifier.addExample(activation, class_id);
        img.dispose();
    }

    @action async runPredictions() {
        if (this.classifier.getNumClasses() > 0) {
            const img = await this.webcam.capture();
            const activation = this.net.infer(img, 'conv_preds');
            const result = await this.classifier.predictClass(activation);
            console.log(result);
            img.dispose();
        }

        await tf.nextFrame();
        console.log('done');
    }
}
