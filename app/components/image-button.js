import Component from '@glimmer/component';
import { ref } from 'ember-ref-bucket';
import { action } from '@ember/object';

export default class ImageButtonComponent extends Component {
    @ref('img') img;
    @action click() {
        this.args.onClick(this.img);
    }
}
