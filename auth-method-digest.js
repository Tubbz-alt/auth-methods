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
import {PolymerElement} from '@polymer/polymer/polymer-element.js';
import {EventsTargetMixin} from '@advanced-rest-client/events-target-mixin/events-target-mixin.js';
import {AuthMethodsMixin} from './auth-methods-mixin.js';
import {html} from '@polymer/polymer/lib/utils/html-tag.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/paper-icon-button/paper-icon-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/iron-collapse/iron-collapse.js';
import '@advanced-rest-client/paper-masked-input/paper-masked-input.js';
import '@advanced-rest-client/arc-icons/arc-icons.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/paper-dropdown-menu/paper-dropdown-menu.js';
import '@polymer/paper-listbox/paper-listbox.js';
import '@polymer/paper-item/paper-item.js';
import './auth-methods-styles.js';
import './auth-method-step.js';
/**
 * The `<auth-method-digest>` element displays a form for digest authentication.
 * The user have to choose is he want to provide username and password only or
 * all digest parameters to calculate final authorization header.
 *
 * In first case, the listeners and the transport method must perform handshake
 * by it's own. Otherwise authorization header should be set with calculated value.
 *
 * ### Example
 * ```
 * <auth-method-digest username="john" password="doe"></auth-method-digest>
 * ```
 *
 * The `settings` property (of the element or even detail property) for full form
 * has the following structure:
 *
 * ```
 * {
 *  "username": String,
 *  "realm": String,
 *  "nonce": String,
 *  "uri": String,
 *  "response": String,
 *  "opaque": String,
 *  "qop": String - can be empty,
 *  "nc": String,
 *  "cnonce": String
 * }
 * ```
 *
 * ## Response calculation
 * Depending on the algorithm and quality of protection (qop) properties the hasing
 * algorithm may need following data:
 * - request URL
 * - request payload (body)
 * - request HTTP method
 *
 * The element should be provided with this information by setting it's properties.
 * However, the element will listen for `url-value-changed`, `http-method-changed`
 * and `body-value-changed` events on the window object. Once the event is handled
 * it will set up corresponding properties.
 * All this events must have a `value` property set on event's detail object.
 *
 *
 * ## Changes in version 2.0
 *
 * - `CryptoJS` library is not included by default. Use
 * `advanced-rest-client/cryptojs-lib` component to include the library if
 * your project doesn't use crypto libraries already.
 *
 * ### Styling
 *
 * `<auth-methods>` provides the following custom properties and mixins for styling:
 *
 * Custom property | Description | Default
 * ----------------|-------------|----------
 * `--auth-method-digest` | Mixin applied to the element. | `{}`
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
 * @demo demo/digest.html
 */
class AuthMethodDigest extends AuthMethodsMixin(EventsTargetMixin(PolymerElement)) {
  static get template() {
    return html`
    <style include="auth-methods-styles">
    :host {
      display: block;
      @apply --auth-method-panel;
      @apply --auth-method-digest;
    }

    paper-item:hover {
      @apply --paper-item-hover;
    }
    </style>
    <auth-method-step step-start-index="[[stepStartIndex]]" step="1" no-steps="[[noSteps]]">
      <span slot="title">Set authorization data</span>
      <iron-form>
        <form autocomplete="on">
          <paper-input label="User name" value="{{username}}" type="text" required="" auto-validate="" autocomplete="on">
            <paper-icon-button class="action-icon" slot="suffix" on-tap="clearUsername" icon="arc:clear" alt="Clear input icon" title="Clear input"></paper-icon-button>
          </paper-input>
          <paper-masked-input label="Password" value="{{password}}" required="" auto-validate="" autocomplete="on"></paper-masked-input>
          <div class="adv-toggle">
            <paper-checkbox class="adv-settings-input" checked="{{fullForm}}">Advanced settings</paper-checkbox>
          </div>
          <iron-collapse opened="[[fullForm]]">
            <div class="extended-form">
              <paper-input label="Server issued realm" value="{{realm}}" type="text" required="[[fullForm]]" auto-validate="" autocomplete="on"></paper-input>
              <paper-input label="Server issued nonce" value="{{nonce}}" type="text" required="[[fullForm]]" auto-validate="" autocomplete="on"></paper-input>
              <paper-dropdown-menu label="Quality of protection">
                <paper-listbox slot="dropdown-content" selected="{{qop}}" attr-for-selected="data-qop">
                  <paper-item data-qop="auth">auth</paper-item>
                  <paper-item data-qop="auth-int">auth-int</paper-item>
                </paper-listbox>
              </paper-dropdown-menu>
              <paper-input label="Nounce count" value="{{nc}}" type="number" required="[[fullForm]]" auto-validate="" autocomplete="on"></paper-input>
              <paper-dropdown-menu label="Hash algorithm">
                <paper-listbox slot="dropdown-content" selected="{{algorithm}}" attr-for-selected="data-algorithm">
                  <paper-item data-algorithm="MD5">MD5</paper-item>
                  <paper-item data-algorithm="MD5-sess">MD5-sess</paper-item>
                </paper-listbox>
              </paper-dropdown-menu>
              <paper-input label="Server issued opaque string" value="{{opaque}}" type="string" autocomplete="on"></paper-input>
              <paper-input label="Client nounce" value="{{cnonce}}" type="string" autocomplete="on"></paper-input>
            </div>
          </iron-collapse>
        </form>
      </iron-form>
    </auth-method-step>
`;
  }

  static get is() { return 'auth-method-digest'; }
  static get properties() {
    return {
      // The password.
      password: {
        type: String,
        notify: true,
        observer: '_processInput'
      },
      // The username.
      username: {
        type: String,
        notify: true,
        observer: '_processInput'
      },
      // If set then it will display all form fields.
      fullForm: {
        type: Boolean,
        value: false,
        observer: '_processInput'
      },
      // Server issued realm.
      realm: {
        type: String,
        observer: '_processInput'
      },
      // Server issued nonce.
      nonce: {
        type: String,
        observer: '_processInput'
      },
      // The realm value for the digest response.
      algorithm: {
        type: String,
        observer: '_processInput'
      },
      /**
       * The quality of protection value for the digest response.
       * Either '', 'auth' or 'auth-int'
       */
      qop: {
        type: String,
        observer: '_processInput'
      },
      // Nonce count - increments with each request used with the same nonce
      nc: {
        type: Number,
        value: 1,
        observer: '_processInput'
      },
      // Client nonce
      cnonce: {
        type: String,
        observer: '_processInput'
      },
      // A string of data specified by the server
      opaque: {
        type: String,
        observer: '_processInput'
      },
      // Hashed response to server challenge
      response: {
        type: String
      },
      // Request HTTP method
      httpMethod: {
        type: String,
        observer: '_processInput'
      },
      // Current request URL.
      requestUrl: {
        type: String,
        observer: '_processInput'
      },
      // Current request body.
      requestBody: {
        type: String,
        observer: '_processInput'
      }
    };
  }

  constructor() {
    super();
    this._onUrlChanged = this._onUrlChanged.bind(this);
    this._onHttpMethodChanged = this._onHttpMethodChanged.bind(this);
    this._onBodyChanged = this._onBodyChanged.bind(this);
    this._onAuthSettings = this._onAuthSettings.bind(this);
  }

  _attachListeners(node) {
    node.addEventListener('url-value-changed', this._onUrlChanged);
    node.addEventListener('http-method-changed', this._onHttpMethodChanged);
    node.addEventListener('body-value-changed', this._onBodyChanged);
    node.addEventListener('auth-settings-changed', this._onAuthSettings);
  }

  _detachListeners(node) {
    node.removeEventListener('url-value-changed', this._onUrlChanged);
    node.removeEventListener('http-method-changed', this._onHttpMethodChanged);
    node.removeEventListener('body-value-changed', this._onBodyChanged);
    node.removeEventListener('auth-settings-changed', this._onAuthSettings);
  }
  /**
   * Validates the form.
   *
   * @return {Boolean} Validation result.
   */
  validate() {
    const form = this.shadowRoot.querySelector('iron-form');
    return form.validate();
  }
  /**
   * Returns current settings. Object's structure depends on `fullForm`
   * property. If it's `false` then the object will contain username and
   * password. Otherwise it will contain a list of parameters of the
   * Authorization header.
   *
   * @return {Object}
   */
  getSettings() {
    if (!this.fullForm) {
      return {
        password: this.password || '',
        username: this.username || ''
      };
    }
    this.response =  this.generateResponse();
    var settings = {};
    settings.username = this.username || '';
    settings.realm = this.realm;
    settings.nonce = this.nonce;
    settings.uri = this.requestUrl;
    settings.response = this.response;
    settings.opaque = this.opaque;
    settings.qop = this.qop;
    settings.nc = ('00000000' + this.nc).slice(-8);
    settings.cnonce = this.cnonce;
    return settings;
  }

  /**
   * Restores settings from stored value.
   *
   * @param {Object} settings Object returned by `_getSettings()`
   */
  restore(settings) {
    this.username = settings.username;
    this.password = settings.password;
    this.realm = settings.realm;
    this.nonce = settings.nonce;
    this.opaque = settings.opaque;
    this.qop = settings.qop;
    this.nc = settings.nc;
    this.cnonce = settings.cnonce;
    if (settings.uri) {
      this.requestUrl = settings.uri;
    }
    if (settings.nc) {
      this.nc = Number(settings.nc.replace(/0+/, ''));
    }
  }

  _processInput() {
    if (!this.shadowRoot || this.__cancelChangeEvent) {
      return;
    }
    if (this.fullForm) {
      if (!this.nc) {
        this.set('nc', 1);
        return;
      }
      if (!this.cnonce) {
        this.set('cnonce', this.generateCnonce());
        return;
      }
    }
    this._notifySettingsChange('digest');
  }
  /**
   * Clears usernamr field
   */
  clearUsername() {
    this.username = '';
  }

  /**
   * Generates client nonce.
   *
   * @return Generated client nonce.
   */
  generateCnonce() {
    var characters = 'abcdef0123456789';
    var token = '';
    for (var i = 0; i < 16; i++) {
      var randNum = Math.round(Math.random() * characters.length);
      token += characters.substr(randNum, 1);
    }
    return token;
  }
  /**
   * Generates the response header based on the parameters provided in the
   * form.
   *
   * See https://en.wikipedia.org/wiki/Digest_access_authentication#Overview
   *
   * @return {String} A response part of the authenticated digest request.
   */
  generateResponse() {
    /* global CryptoJS */
    var HA1 = this._getHA1();
    var HA2 = this._getHA2();
    var ncString = ('00000000' + this.nc).slice(-8);
    var responseStr = HA1 + ':' + this.nonce;
    if (!this.qop) {
      responseStr += ':' + HA2;
    } else {
      responseStr += ':' + ncString + ':' + this.cnonce + ':' + this.qop + ':' + HA2;
    }
    return CryptoJS.MD5(responseStr).toString();
  }
  // Generates HA1 as defined in Digest spec.
  _getHA1() {
    var HA1param = this.username + ':' + this.realm + ':' + this.password;
    var HA1 = CryptoJS.MD5(HA1param).toString();

    if (this.algorithm === 'MD5-sess') {
      HA1param = HA1 + ':' + this.nonce + ':' + this.cnonce;
      HA1 = CryptoJS.MD5(HA1param).toString();
    }
    return HA1;
  }
  // Generates HA2 as defined in Digest spec.
  _getHA2() {
    var HA2param = this.httpMethod + ':' + this.requestUrl;
    if (this.qop === 'auth-int') {
      HA2param += ':' + CryptoJS.MD5(this.requestBody).toString();
    }
    return CryptoJS.MD5(HA2param).toString();
  }
  /**
   * Handler to the `url-value-changed` event. When the element handle this
   * event it will update the `requestUrl` property.
   */
  _onUrlChanged(e) {
    this.requestUrl = e.detail.value;
  }
  /**
   * Handler to the `http-method-changed` event. When the element handle this
   * event it will update the `httpMethod` property.
   */
  _onHttpMethodChanged(e) {
    this.httpMethod = e.detail.value;
  }
  /**
   * Handler to the `body-value-changed` event. When the element handle this
   * event it will update the `requestBody` property.
   */
  _onBodyChanged(e) {
    this.requestBody = e.detail.value;
  }

  /**
   * Handler to the `auth-settings-changed` event (fired by all auth panels).
   * If the event was fired by other element with the same method ttype
   * then the form will be updated to incomming values.
   * This helps to sync changes between elements in the same app.
   */
  _onAuthSettings(e) {
    if (e.target === this || e.detail.type !== 'digest') {
      return;
    }
    this.restore(e.detail.settings);

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
   * @event auth-settings-changed
   * @param {Object} settings Current settings containing hash, password
   * and username.
   * @param {String} type The authorization type - basic
   * @param {Boolean} valid True if the form has been validated.
   */
}
window.customElements.define(AuthMethodDigest.is, AuthMethodDigest);
