/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   auth-method-basic.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../events-target-behavior/events-target-behavior.d.ts" />
/// <reference path="../paper-masked-input/paper-masked-input.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../paper-input/paper-input.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../iron-form/iron-form.d.ts" />
/// <reference path="auth-methods-mixin.d.ts" />
/// <reference path="auth-methods-styles.d.ts" />
/// <reference path="auth-method-step.d.ts" />

declare namespace UiElements {

  /**
   * The `<auth-method-basic>` element displays a form to provide the Basic
   * auth credentials.
   * It calculates base64 has while typing into username or password field.
   *
   * It accepts `hash` as a property and once set it will atempt to decode it
   * and set username and paswword.
   *
   * ### Example
   *
   * ```html
   * <auth-method-basic hash="dGVzdDp0ZXN0"></auth-method-basic>
   * ```
   *
   * This example will produce a form with prefilled username and passowrd with
   * value "test".
   *
   * ## Changes in version 2.0
   *
   * - Removed `OpendablePanelBehavior`. The element will always react to headers
   * change event
   *
   * ### Styling
   *
   * `<auth-methods>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--auth-method-basic` | Mixin applied to the element. | `{}`
   * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
   *
   * This is very basic element. Style inputs using `paper-input`'s or `
   * paper-toggle`'s css variables.
   */
  class AuthMethodBasic extends
    ArcBehaviors.EventsTargetBehavior(
    ArcBehaviors.AuthMethodsMixin(
    Polymer.Element)) {

    /**
     * base64 hash of the uid and passwd. When set it will override current username and password.
     */
    hash: string|null|undefined;

    /**
     * The password.
     */
    password: string|null|undefined;

    /**
     * The username.
     */
    username: string|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;

    /**
     * Resets state of the form.
     */
    reset(): void;

    /**
     * Validates the form.
     *
     * @returns Validation result.
     */
    validate(): Boolean|null;

    /**
     * Dispatches `auth-settings-changed` custom event.
     */
    _settingsChanged(): void;

    /**
     * Creates a settings object with user provided data.
     *
     * @returns User provided data
     */
    getSettings(): object|null;

    /**
     * Restores settings from stored value.
     *
     * @param settings Object returned by `_getSettings()`
     */
    restore(settings: object|null): void;

    /**
     * Decodes hash value on change from the external source.
     *
     * @param hash Hash value
     */
    _hashChanged(hash: String|null): void;

    /**
     * Computes hash value for given username or password.
     * It computes value if at least one value for username and password is
     * provided. Otherwise it sets hash to empty string.
     *
     * @param uid Username
     * @param passwd Password
     * @returns Computed hash.
     */
    hashData(uid: String|null, passwd: String|null): String|null;

    /**
     * Sets the hash value for current username and password.
     *
     * @param uid Username
     * @param passwd Password
     */
    _userInputChanged(uid: String|null, passwd: String|null): void;

    /**
     * Clears username input.
     */
    clearUsername(): void;

    /**
     * Handler to the `auth-settings-changed` event (fired by all auth panels).
     * If the event was fired by other element with the same method ttype
     * then the form will be updated to incomming values.
     * This helps to sync changes between elements in the same app.
     */
    _onAuthSettings(e: any): void;

    /**
     * Handler for the `request-header-changed` custom event.
     * If the panel is opened the it checks if current header updates
     * authorization.
     */
    _headerChangedHandler(e: any): void;
  }
}

interface HTMLElementTagNameMap {
  "auth-method-basic": UiElements.AuthMethodBasic;
}
