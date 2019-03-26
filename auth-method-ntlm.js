/**
@license
Copyright 2018 The Advanced REST client authors <arc@mulesoft.com>
Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at
http://www.apache.org/licenses/LICENSE-2.0
Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.
*/
import {PolymerElement} from '../../@polymer/polymer/polymer-element.js';
import {html} from '../../@polymer/polymer/lib/utils/html-tag.js';
import {EventsTargetMixin} from '../../@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import {AuthMethodsMixin} from './auth-methods-mixin.js';
import '../../@advanced-rest-client/paper-masked-input/paper-masked-input.js';
import '../../@polymer/paper-icon-button/paper-icon-button.js';
import '../../@polymer/paper-input/paper-input.js';
import '../../@advanced-rest-client/arc-icons/arc-icons.js';
import '../../@polymer/iron-form/iron-form.js';
import './auth-methods-styles.js';
import './auth-method-step.js';
/**
 * The `<auth-method-ntlm>` element displays a form to provide the NTLM auth
 * credentials.
 *
 * It only provides data since NTLM authentication and all calculations must
 * be conducted when working on socket.
 *
 * This form requires to provide at least username and password. The domain
 * parameter is not required in NTLM so it may be empty.
 *
 * ### Example
 *
 * ```html
 * <auth-method-ntlm username="john" password="doe" domain="my-nt-domain"></auth-method-ntlm>
 * ```
 *
 * ### Styling
 *
 * `<auth-methods>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--auth-method-ntlm` | Mixin applied to the element. | `{}`
 * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
 *
 * This is very basic element. Style inputs using `paper-input`'s or `
 * paper-toggle`'s css variables.
 *
 * @customElement
 * @polymer
 * @memberof UiElements
 * @appliesMixin EventsTargetMixin
 * @appliesMixin AuthMethodsMixin
 * @demo demo/ntlm.html
 */
class AuthMethodNtlm extends AuthMethodsMixin(EventsTargetMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="auth-methods-styles">
    :host {
      display: block;
      @apply --auth-method-panel;
      @apply --auth-method-ntlm;
    }
    </style>
    <auth-method-step step-start-index="[[stepStartIndex]]" step="1" no-steps="[[noSteps]]">
      <span slot="title">Set authorization data</span>
      <iron-form>
        <form autocomplete="on">
          <paper-input required="" auto-validate="" label="User name" value="{{username}}"
            type="text" autocomplete="on">
            <paper-icon-button class="action-icon" slot="suffix" on-click="_clearField" icon="arc:clear"
              alt="Clear input icon" title="Clear username"></paper-icon-button>
          </paper-input>
          <paper-masked-input required="" auto-validate="" label="Password" value="{{password}}"
            autocomplete="on"></paper-masked-input>
          <paper-input label="NT domain" value="{{domain}}" type="text">
            <paper-icon-button class="action-icon"
              slot="suffix" on-click="_clearField" icon="arc:clear"
              alt="Clear input icon" title="Clear domain"></paper-icon-button>
          </paper-input>
        </form>
      </iron-form>
    </auth-method-step>
`;
  }

  static get is() {
    return 'auth-method-ntlm';
  }
  static get properties() {
    return {
      // The domain parameter for the request.
      domain: {
        type: String,
        notify: true
      },
      // The password.
      password: {
        type: String,
        notify: true
      },
      // The username.
      username: {
        type: String,
        notify: true
      }
    };
  }

  static get observers() {
    return [
      '_settingsChanged(username, password, domain)'
    ];
  }

  constructor() {
    super();
    this._onAuthSettings = this._onAuthSettings.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('auth-settings-changed', this._onAuthSettings);
  }
  _detachListeners(node) {
    node.removeEventListener('auth-settings-changed', this._onAuthSettings);
  }

  /**
   * Validates the form.
   *
   * @return {Boolean} `true` if valid, `false` otherwise.
   */
  validate() {
    const form = this.shadowRoot.querySelector('iron-form');
    return form.validate();
  }

  _settingsChanged() {
    if (!this.shadowRoot || this.__cancelChangeEvent) {
      return;
    }
    this._notifySettingsChange('ntlm');
  }
  /**
   * Creates a settings object with user provided data.
   *
   * @return {Object} User provided data
   */
  getSettings() {
    return {
      domain: this.domain || '',
      password: this.password || '',
      username: this.username || ''
    };
  }

  /**
   * Restores settings from stored value.
   *
   * @param {Object} settings Object returned by `_getSettings()`
   */
  restore(settings) {
    this.domain = settings.domain;
    this.password = settings.password;
    this.username = settings.username;
  }

  // Removes a value from the (paper-)input going up through path of the event.
  _clearField(e) {
    const path = e.composedPath();
    let inputTarget;
    while ((inputTarget = path.shift())) {
      if (inputTarget.nodeName === 'INPUT' || inputTarget.nodeName === 'PAPER-INPUT') {
        break;
      }
    }
    if (!inputTarget) {
      return;
    }
    inputTarget.value = '';
  }

  /**
   * Handler for the `auth-settings-changed` event (fired by all auth panels).
   * If the event was fired by other element with the same method ttype
   * then the form will be updated to incomming values.
   *
   * @param {Event} e
   */
  _onAuthSettings(e) {
    if (e.target === this || e.detail.type !== 'ntlm') {
      return;
    }
    this.__cancelChangeEvent = true;
    this.restore(e.detail.settings);
    this.__cancelChangeEvent = false;
  }
  /**
   * Fired when error occured when decoding hash.
   *
   * @event error
   * @param {Error} error The error object.
   */
  /**
   * Fired when the any of the auth method settings has changed.
   * This event will be fired quite frequently - each time anything in the text field changed.
   * With one exception. This event will not be fired if the validation of the form didn't passed.
   *
   * The `domain` field is not required in the form so check for missing `domain` value if it's
   * required in your application.
   *
   * @event auth-settings-changed
   * @param {Object} settings Current settings containing domain, password
   * and username.
   * @param {String} type The authorization type - ntlm
   * @param {Boolean} valid True if the form has been validated.
   */
}
window.customElements.define(AuthMethodNtlm.is, AuthMethodNtlm);
