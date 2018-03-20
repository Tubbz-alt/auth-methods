/**
 * DO NOT EDIT
 *
 * This file was automatically generated by
 *   https://github.com/Polymer/gen-typescript-declarations
 *
 * To modify these typings, edit the source file(s):
 *   auth-method-oauth1.html
 */

/// <reference path="../polymer/types/polymer-element.d.ts" />
/// <reference path="../events-target-behavior/events-target-behavior.d.ts" />
/// <reference path="../paper-masked-input/paper-masked-input.d.ts" />
/// <reference path="../paper-icon-button/paper-icon-button.d.ts" />
/// <reference path="../paper-button/paper-button.d.ts" />
/// <reference path="../paper-input/paper-input.d.ts" />
/// <reference path="../arc-icons/arc-icons.d.ts" />
/// <reference path="../paper-styles/paper-styles.d.ts" />
/// <reference path="../iron-flex-layout/iron-flex-layout.d.ts" />
/// <reference path="../iron-form/iron-form.d.ts" />
/// <reference path="../paper-item/paper-item.d.ts" />
/// <reference path="../paper-toast/paper-toast.d.ts" />
/// <reference path="../paper-dropdown-menu/paper-dropdown-menu.d.ts" />
/// <reference path="../paper-listbox/paper-listbox.d.ts" />
/// <reference path="../paper-spinner/paper-spinner.d.ts" />
/// <reference path="../neon-animation/web-animations.d.ts" />
/// <reference path="auth-methods-mixin.d.ts" />
/// <reference path="auth-methods-styles.d.ts" />

declare namespace UiElements {

  /**
   * The `<auth-method-oauth1>` element displays a form to provide the OAuth 1a settings.
   *
   * ### Example
   *
   * ```html
   * <auth-method-oauth1 consumer-key="xyz"></auth-method-oauth1>
   * ```
   *
   * ### Required form fields
   *
   * - Consumer key
   * - Timestamp
   * - Nonce
   * - Signature method
   *
   * ## Authorizing the user
   *
   * This element displays form for user input only. To perform authorization and
   * later to sign the request, add `oauth-authorization/oauth1-authorization.html`
   * to the DOM. This element sends `oauth1-token-requested` that is handled by
   * autorization element.
   *
   * Note that the OAuth1 authorization wasn't designed for browser. Most existing
   * OAuth1 implementation disallow browsers to perform the authorization by
   * not allowing POST requests to authorization server. Therefore receiving token
   * may not be possible without using browser extensions to alter HTTP request to
   * enable CORS.
   * If the server disallow obtaining authorization token and secret from clients
   * then the application should listen for `oauth1-token-requested` custom event
   * and perform authorization on the server side.
   *
   * When application is performing authorization instead of `oauth1-authorization`
   * element then the application should dispatch `oauth1-token-response` custom event
   * with `oauth_token` and `oauth_token_secret` properties set on detail object.
   * This element handles the response to reset UI state and to updates other elements
   * status that works with authorization.
   *
   * ## Signing the request
   *
   * See description for `oauth-authorization/oauth1-authorization.html` element.
   *
   * ### Styling
   *
   * `<auth-methods>` provides the following custom properties and mixins for styling:
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--auth-method-oauth1` | Mixin applied to the element. | `{}`
   * `--auth-method-panel` | Mixin applied to all auth elements. | `{}`
   *
   * ### Theming
   *
   * Use this mixins as a theming option across all ARC elements.
   *
   * Custom property | Description | Default
   * ----------------|-------------|----------
   * `--icon-button` | Mixin applied to `paper-icon-buttons`. | `{}`
   * `--icon-button-hover` | Mixin applied to `paper-icon-buttons` when hovered. | `{}`
   * `--input-line-color` | Mixin applied to the input underline | `{}`
   * `--auth-button` | Mixin applied to authorization and next buttons` | `{}`
   * `--auth-button-hover` | Mixin for :hover state for authorization and next buttons` | `{}`
   * `--auth-button-disabled` | Mixin for disabled state for authorization and next buttons` | `{}`
   *
   * ## Changes in version 2
   * - Crypto library is no linger included into the element.
   * Use `advanced-rest-client/cryptojs-lib` component to include the library if your project doesn't use crypto libraries already.
   */
  class AuthMethodOauth1 extends
    ArcBehaviors.EventsTargetBehavior(
    ArcBehaviors.AuthMethodsMixin(
    Polymer.Element)) {

    /**
     * Returns default list of signature methods for OAuth1
     *      
     */
    readonly defaultSignatureMethods: any;

    /**
     * Client ID aka consumer key
     */
    consumerKey: string|null|undefined;

    /**
     * The client secret aka consumer secret
     */
    consumerSecret: string|null|undefined;

    /**
     * Oauth 1 token (from the oauth console)
     */
    token: string|null|undefined;

    /**
     * Oauth 1 token secret (from the oauth console)
     */
    tokenSecret: string|null|undefined;

    /**
     * Timestamp
     */
    timestamp: number|null|undefined;

    /**
     * The nonce generated for this request
     */
    nonce: string|null|undefined;

    /**
     * Optional realm
     */
    realm: string|null|undefined;

    /**
     * Signature method. Enum {`HMAC-SHA256`, `HMAC-SHA1`, `PLAINTEXT`}
     */
    signatureMethod: string|null|undefined;

    /**
     * True when currently authorizing the user.
     */
    _authorizing: boolean|null|undefined;

    /**
     * Authorization callback URL
     */
    redirectUrl: string|null|undefined;

    /**
     * OAuth1 endpoint to obtain request token to request user authorization.
     */
    requestTokenUrl: string|null|undefined;

    /**
     * Endpoint to authorize the token.
     */
    accessTokenUrl: string|null|undefined;

    /**
     * HTTP method to obtain authorization header.
     * Spec recommends POST
     */
    authTokenMethod: string|null|undefined;

    /**
     * A location of the OAuth 1 authorization parameters.
     * It can be either in the URL as a query string (`querystring` value)
     * or in the authorization header (`authorization`) value.
     */
    authParamsLocation: string|null|undefined;

    /**
     * An URL to authentication endpoint where the user should be redirected
     * to auththorize the app.
     */
    authorizationUrl: string|null|undefined;

    /**
     * RAML `securedBy` obejct definition.
     * If set, it will prefill the settings in the auth panel.
     */
    amfSettings: object|null|undefined;

    /**
     * List of currently support signature methods.
     * This can be updated when `amfSettings` property is set.
     */
    signatureMethods: any[]|null|undefined;
    _attachListeners(node: any): void;
    _detachListeners(node: any): void;
    _getAmfValue(model: any): any;
    ready(): void;

    /**
     * Validates the form.
     *
     * @returns `true` if valid, `false` otherwise.
     */
    validate(): Boolean|null;

    /**
     * Called each time when any of the settings change. It informs application
     * that the user updated the form.
     * It fires `auth-settings-changed` custom event even if the form is invalid
     * (missing some info).
     *
     * The `valid` property is always if `settings.token` amd
     * `settings.tokenSecret` is not set.
     */
    _settingsChanged(): void;
    getSettings(): any;

    /**
     * Restores settings from stored value.
     *
     * @param settings Object returned by `_getSettings()`
     */
    restore(settings: object|null): void;

    /**
     * Removes a value from the (paper-)input going up through path of the event.
     */
    _clearField(e: any): void;

    /**
     * Handler for "authorize" button click. Sends the `oauth2-token-requested` event.
     */
    authorize(): void;

    /**
     * Handles OAuth1 authorization errors.
     */
    _oauth1ErrorHandler(e: any, detail: any): void;

    /**
     * Handler for the `oauth1-token-response` custom event.
     * Sets `token` and `tokenSecret` properties from the event.
     */
    _tokenResponseHandler(e: any): void;

    /**
     * Returns current timestamp in seconds
     */
    _genTimestamp(): void;

    /**
     * Returns autogenerated nocne
     *
     * @param length Optional, size of generated string. Default to 32.
     * @returns Generated nonce string.
     */
    _genNonce(length: Number|null): String|null;

    /**
     * Called when the AMF object change
     */
    _amfSettingsChanged(model: any): void;
  }
}

interface HTMLElementTagNameMap {
  "auth-method-oauth1": UiElements.AuthMethodOauth1;
}
