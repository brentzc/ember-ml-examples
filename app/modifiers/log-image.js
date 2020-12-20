import { modifier } from 'ember-modifier';

export default modifier(function logImage(element/*, params, hash*/) {
    console.log('element');
    console.log(element);
});
