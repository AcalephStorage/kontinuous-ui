import Ember from 'ember';
import {task} from 'ember-concurrency';
import Configuration from '../config/environment';

export default Ember.Component.extend({

  classNames: Ember.String.w('ui right internal rail stage-details'),

  pipeline: Ember.inject.service(),
  store: Ember.inject.service(),
  session: Ember.inject.service(),
  notify: Ember.inject.service(),

  aceEditor: null,

  willPullRequest: Ember.computed.equal('commitOption.option', 'pull_request'),
  editorAction: Ember.computed('definition', function() {
    let definition = this.get('definition');
    if (definition) {
      return definition.sha ? 'Update' : 'Create';
    }
    return '';
  }),

  init() {
    this._super(...arguments);
    this.resetForm();
    this.performTask(this.get('definitionFetcher'));
  },

  didRender() {
    if (this.$('input[name="commit-option"][checked="checked"]').length === 0) {
      let commitOption = this.get('commitOption.option');
      this.$(`input[name="commit-option"][value="${commitOption}"]`).attr("checked", "checked");
    }
    this.aceEditorInit();
  },

  willDestroyElement() {
    this.removeObserver('definition.content', this, this.aceEditorContentChange);
    if (this.aceEditor) {
      this.aceEditor.destroy();
      this.aceEditor.container.remove();
    }
  },

  aceEditorInit() {
    let textEditor = this.$("div#definition-content");
    if (textEditor.length && !textEditor.hasClass('ace_editor')) {
      let editorID = textEditor.attr('id');
      this.aceEditor = ace.edit(editorID);
      this.aceEditor.getSession().setTabSize(2);
      this.aceEditor.getSession().setMode("ace/mode/yaml");
      this.aceEditor.on('change', () => {
        this.set('definition.content', this.aceEditor.getSession().getValue());
      });
      this.addObserver('definition.content', this, this.aceEditorContentChange);
      this.notifyPropertyChange('definition.content');
    }
  },

  aceEditorContentChange() {
    if (!this.get('definition.content')) {
      this.aceEditor.getSession().setValue('');
    }
    else if (this.aceEditor.getSession().getValue() !== this.get('definition.content')) {
      this.aceEditor.getSession().setValue(this.get('definition.content'));
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
    createDefinition() {
      this.set('definition', {content: ''});
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

  serializeDefinition(res) {
    let currentDefinition = this.get('definition') || {};
    if (res && res.content) {
      res.content = atob(res.content);
    }
    Ember.assign(currentDefinition, res);
    this.set('definition', currentDefinition);
    this.notifyPropertyChange('definition');
  },

  definitionFetcher: task(function*(ajaxOptions) {
    let definition = yield Ember.$.ajax(ajaxOptions)
    this.serializeDefinition(definition);
  }).drop(),

  definitionUpdater: task(function*(ajaxOptions) {
    Ember.assign(ajaxOptions, {
      type: 'POST',
      data: JSON.stringify({
        definition: {
          content: btoa(this.get('definition.content')),
          sha: this.get('definition.sha')
        },
        commit: this.get('commitOption')
      }),
      contentType: 'application/json;chartset=UTF-8'
    });

    let action = this.get('editorAction').toLowerCase();
    yield Ember.$.ajax(ajaxOptions)
      .then((definition) => {
        this.get('notify').success(`Successfully ${action}d the definition file for the pipeline`);
        this.serializeDefinition(definition);
      }, (res) => {
        this.get('notify').error(res.responseJSON.Message || `Failed to ${action} the definition file for the pipeline`);
      });
  }).drop(),

});
