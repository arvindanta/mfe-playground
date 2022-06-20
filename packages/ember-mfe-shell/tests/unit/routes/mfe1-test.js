import { module, test } from 'qunit';
import { setupTest } from 'ember-mfe-shell/tests/helpers';

module('Unit | Route | mfe1', function (hooks) {
  setupTest(hooks);

  test('it exists', function (assert) {
    let route = this.owner.lookup('route:mfe1');
    assert.ok(route);
  });
});
