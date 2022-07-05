import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-octane-mfe/tests/helpers';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';

module('Integration | Component | test', function (hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function (assert) {
    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });

    await render(hbs`<Test />`);

    assert.dom(this.element).hasText('');

    // Template block usage:
    await render(hbs`
      <Test>
        template block text
      </Test>
    `);

    assert.dom(this.element).hasText('template block text');
  });
});
