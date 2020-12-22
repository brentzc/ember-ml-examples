import Component from '@glimmer/component';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';

export default class TextAnalysisPageComponent extends Component {
    @service tensorflow;

    @tracked user_input = '';
    @tracked score = null;
    @tracked error = null;

    @action analyze() {
        try {
            this.score = this.tensorflow.predictTextSentiment(this.user_input);
            console.log(this.score);
        } catch (error) {
            this.error = error.message || error;
        }
    }
}
