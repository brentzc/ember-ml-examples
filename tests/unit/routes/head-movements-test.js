import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | head-movements', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:head-movements');
    assert.ok(route);
  });
});
