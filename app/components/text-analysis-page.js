import Component from '@glimmer/component';
import { inject as service } from '@ember/service';

export default class TextAnalysisPageComponent extends Component {
    @service tensorflow;
}
