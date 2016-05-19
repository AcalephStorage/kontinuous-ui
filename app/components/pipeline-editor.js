import Ember from 'ember';
import {task} from 'ember-concurrency';
import Configuration from '../config/environment';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail stage-details'),

  pipeline: Ember.inject.service(),
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  notify: Ember.inject.service(),

  willPullRequest: Ember.computed.equal('commitOption.option', 'pull_request'),

  init() {
    this._super(...arguments);
    this.resetForm();
    this.performTask(this.get('definitionFetcher'));
  },

  didRender() {
    if (this.$('input[name="commitOption"][checked="checked"]').length === 0) {
      let commitOption = this.get('commitOption.option');
      this.$(`input[name="commitOption"][value="${commitOption}"]`).attr("checked", "checked")
    }
  },

  actions: {
    close() {
      this.sendAction('close');
    },
    selectCommitOption(key) {
      this.set('commitOption.option', key);
      if (key !== 'pull_request') {
        this.set("commitOption.branch_name", "");
      }
    },
    updateDefinition() {
      this.performTask(this.get('definitionUpdater'));
    }
  },

  resetForm() {
    this.set('commitOptions', {
      commit: "Commit directly to the default branch",
      pull_request: "Create a new branch for this commit and start a pull request",
    });
    this.set('commitOption', {
      option: "commit",
      message: "",
      branch_name: ""
    });
  },

  performTask(task) {
    this.get('session').authorize('authorizer:kontinuous', (headerName, headerValue) => {
      let api = Configuration.APP.kontinuousAPI;
      let params = this.get('model').getProperties('owner', 'repo');
      let headers = {};
      headers[headerName] = headerValue;
      let url = `${api.host}/api/${api.version}/pipelines/${params.owner}/${params.repo}/definition`;
      task.perform({headers: headers, url: url});
    });
  },

  serializeDefinition(definition) {
    let currentDefinition = this.get('definition') || {};
    if (definition && definition.content) {
      definition.decodedContent = atob(definition.content);
    }
    Ember.assign(currentDefinition, definition);
    this.set('definition', currentDefinition);
  },

  normalizeDefinition() {
    let definition = this.get('definition');
    return {
      content: btoa(this.get('definition.decodedContent')),
      sha: this.get('definition.sha')
    }
  },

  definitionFetcher: task(function*(ajaxOptions) {
    yield Ember.$.ajax(ajaxOptions)
      .then((definition) => {
        this.serializeDefinition(definition);
      });
  }).drop(),

  definitionUpdater: task(function*(ajaxOptions) {
    let definition = this.normalizeDefinition();

    Ember.assign(ajaxOptions, {
      type: 'PUT',
      data: JSON.stringify({
        definition: definition,
        commit: this.get('commitOption')
      }),
      contentType: 'application/json;chartset=UTF-8'
    });

    yield Ember.$.ajax(ajaxOptions)
      .then((definition) => {
        this.get('notify').success("Successfully updated the definition file for the pipeline");
        this.serializeDefinition(definition);
      }, (res) => {
        this.get('notify').error(res.responseJSON.Message || "Failed to update the definition file for the pipeline");
      });
  }).drop(),

});
