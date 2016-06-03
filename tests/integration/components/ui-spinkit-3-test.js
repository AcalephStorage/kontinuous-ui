import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

moduleForComponent('ui-spinkit-3', 'Integration | Component | ui spinkit 3', {
  integration: true
});

test('it renders', function(assert) {
  assert.expect(2);

  // Set any properties with this.set('myProperty', 'value');
  // Handle any actions with this.on('myAction', function(val) { ... });

  this.render(hbs`{{ui-spinkit-3}}`);

  assert.equal(this.$().text().trim(), '');

  // Template block usage:
  this.render(hbs`
    {{#ui-spinkit-3}}
      template block text
    {{/ui-spinkit-3}}
  `);

  assert.equal(this.$().text().trim(), 'template block text');
});
