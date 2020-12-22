import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import { inject as service } from '@ember/service';

export default class MovementComponent extends Component {
    @service tensorflow;

    @tracked latest_result = null;
    @tracked predictions = [];
    @tracked message = null;
    @tracked error = null;
    
    @tracked selected_tab  = 'Train Model';

    tabs = [ 'Train Model', 'Live Classification' ];
    selected_tab_classes = 'border-indigo-500 bg-indigo-500 hover:bg-indigo-700 text-white';
    unselected_tab_classes = 'border-white hover:border-gray-200 text-indigo-500 hover:bg-gray-200';

    @action selectTab(tab) {
        this.selected_tab = tab;
    }

    @action async classifyHeadPosition(class_id) {
        try {
            await this.tensorflow.trainModelWithClass(class_id);
            this.message = `Model trained for class "${class_id}"`;
        } catch (error) {
            this.error = error.message ? error.message : error;
        }
    }

    @(task(function*() {
        try {
            while (true) {
                const prediction = yield this.tensorflow.predictClassFromWebcam();
                const predictions = this.predictions;
                const updated_predictions = [ prediction, ...predictions ];

                if (updated_predictions.length > 3) {
                    this.predictions = updated_predictions.slice(0, -1);
                } else {
                    this.predictions = updated_predictions;
                }

                console.log(this.predictions);
                yield timeout(3000);
            }
        } catch (error) {
            this.error = error.message ? error.message : error;
        }
    })) predictHeadPosition;

    @action cancelPrediction() {
        this.predictHeadPosition.cancelAll();
    }
}
