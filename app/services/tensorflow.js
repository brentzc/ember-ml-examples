import Service from '@ember/service';
import { action } from '@ember/object';

import tf from "@tensorflow/tfjs";
import mobilenet from "@tensorflow-models/mobilenet";
import knnClassifier from "@tensorflow-models/knn-classifier";

import fetch from 'fetch';

const sentiment_model_url = 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/model.json';
const sentiment_metadata_url = 'https://storage.googleapis.com/tfjs-models/tfjs/sentiment_cnn_v1/metadata.json';

export default class TensorflowService extends Service {

    model = null;
    text_sentiment_model = null;
    text_sentiment_metadata = null;
    webcam = null;

    @action async initializeMobileNetModel() {
        if (!this.model) {
            this.model = await mobilenet.load();
        }
    }

    @action async initializeTextSentimentModel() {
        this.text_sentiment_model = await tf.loadLayersModel(sentiment_model_url);
        await this.loadTextSentimentMetadata();
    }

    @action async loadTextSentimentMetadata() {
        this.text_sentiment_metadata = await fetch(sentiment_metadata_url).then(res => res.json());
    }

    @action async initializeWebcam(video_element) {
        this.webcam = await tf.data.webcam(video_element)
    }

    @action async initializeCustomClassifier() {
        this.classifier = knnClassifier.create();
        await this.initializeMobileNetModel();
    }

    async captureImage() {
        if (!this.webcam) {
            throw new Error('Webcam not initialized.');
        }

        const img = await this.webcam.capture();
        const predictions = await this.model.classify(img);
        img.dispose();

        return predictions;
    }

    classifyImage(img_element) {
        if (!this.model) {
            throw new Error('Mobilenet model not initialized.');
        }

        return this.model.classify(img_element);
    }

    async trainModelWithClass(class_id) {
        const img = await this.webcam.capture();
        const activation = this.model.infer(img, 'conv_preds');
        this.classifier.addExample(activation, class_id);
        img.dispose();
    }

    async predictClassFromWebcam() {
        const img = await this.webcam.capture();
        const activation = this.model.infer(img, 'conv_preds');
        const result = await this.classifier.predictClass(activation);
        console.log(result);
        img.dispose();
        await tf.nextFrame();

        return result;
    }

    padSequences(sequences) {
        const metadata = this.text_sentiment_metadata;
        return sequences.map(seq => {
            if (seq.length > metadata.max_len) {
                seq.splice(0, seq.length - metadata.max_len);
            }
            if (seq.length < metadata.max_len) {
                const pad = [ ...new Array(metadata.max_len - seq.length) ].map(() => 0);
                seq = pad.concat(seq);
            }

            return seq;
        })
    }

    createTextVector(str) {
        if (!this.text_sentiment_metadata) {
            throw new Error('Text Sentiment Metadata not loaded');
        }
        
        const trimmed = str
            .trim()
            .toLowerCase()
            .replace(/(\.|\,|\!|\?)/g, "")
            .split(" ");

        const sequence =  trimmed.map(word => {
            const word_index = this.text_sentiment_metadata.word_index[word];
            if (typeof word_index === 'undefined') {
                return 2; // oov index
            }

            return word_index + this.text_sentiment_metadata.index_from;
        });

        return this.padSequences([ sequence ]);
    }

    predictTextSentiment(str) {
        const sequence = this.createTextVector(str);
        const input = tf.tensor2d(sequence, [ 1, this.text_sentiment_metadata.max_len ]);
        const prediction = this.text_sentiment_model.predict(input);
        const score = prediction.dataSync()[0];
        prediction.dispose();

        return score;
    }
}
