import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class ClassifierComponent extends Component {
    @service tensorflow;

    @tracked selected_tab  = 'Image List';
    @tracked predictions = [];

    tabs = [ 'Image List', 'Webcam' ];
    selected_tab_classes = 'border-indigo-500 bg-indigo-500 hover:bg-indigo-700 text-white';
    unselected_tab_classes = 'border-white hover:border-gray-200 text-indigo-500 hover:bg-gray-200';

    images = [
        {
            title: 'Vulture',
            description: 'A scavenging bird of prey.',
            path: 'assets/images/vulture.jpg'
        },
        {
            title: 'Spatula',
            description: 'A tool for flipping eggs and burgers mostly',
            path: 'assets/images/spatula.jpg'
        },
        {
            title: 'Space Shuttle',
            description: 'Goes into space',
            path: 'assets/images/shuttle.jpg'
        },
        {
            title: 'Radio',
            description: 'Like an old phone or something... idk',
            path: 'assets/images/radio.jpg'
        },
        {
            title: 'Volleyball',
            description: 'Famously needed to play the sport "Volleyball"',
            path: 'assets/images/volleyball.jpg'
        }
    ]

    @action async captureImage() {
        try {
            this.predictions = await this.tensorflow.captureImage();
        } catch (error) {
            console.error(error);
        }
    }

    @action async clickImage(element) {
        this.predictions = await this.tensorflow.classifyImage(element);
    }

    @action selectTab(tab) {
        this.selected_tab = tab;
    }
}
