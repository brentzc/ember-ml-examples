import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | sentiment-analysis', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:sentiment-analysis');
    assert.ok(route);
  });
});
