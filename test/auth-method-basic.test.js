import { fixture, assert, nextFrame, aTimeout } from '@open-wc/testing';
import sinon from 'sinon/pkg/sinon-esm.js';
import '../auth-method-basic.js';

describe('<auth-method-basic>', function() {
  async function basicFixture() {
    return (await fixture(`<auth-method-basic></auth-method-basic>`));
  }

  async function valuesFixture() {
    return (await fixture(`<auth-method-basic username="test" password="test"></auth-method-basic>`));
  }

  describe('initialization', () => {
    it('can be initialized with document.createElement', () => {
      const element = document.createElement('auth-method-basic');
      assert.ok(element);
    });

    it('hash is empty', async () => {
      const element = await basicFixture();
      assert.equal(element.hash, '');
    });

    it('password is empty', async () => {
      const element = await basicFixture();
      assert.equal(element.password, '');
    });

    it('username is empty', async () => {
      const element = await basicFixture();
      assert.equal(element.username, '');
    });
  });

  describe('settings computation', () => {
    it('computes settings object', async () => {
      const element = await valuesFixture();
      const settings = element.getSettings();
      assert.equal(settings.username, element.username, 'username is set');
      assert.equal(settings.password, element.password, 'password is set');
      assert.equal(settings.hash, 'dGVzdDp0ZXN0', 'hash is  set');
    });
  });

  describe('hash computation', () => {
    it('computes has from empty values', async () => {
      const element = await basicFixture();
      assert.equal(element.hash, '');
    });

    it('computes hash from value', async () => {
      const element = await valuesFixture();
      assert.equal(element.hash, 'dGVzdDp0ZXN0');
    });
  });

  describe('validation', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
      await nextFrame();
    });

    it('Not valid without username', async () => {
      const result = element.validate();
      assert.isFalse(result);
    });

    it('Not valid with password only', async () => {
      element.password = 'test';
      await nextFrame();
      const result = element.validate();
      assert.isFalse(result);
    });

    it('Valid with username', async () => {
      element.username = 'test';
      await nextFrame();
      const result = element.validate();
      assert.isTrue(result);
    });

    it('Valid with username and password', async () => {
      element.username = 'test';
      element.password = 'password';
      await nextFrame();
      const result = element.validate();
      assert.isTrue(result);
    });
  });

  describe('Settings notification', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('Dispatches `auth-settings-changed` event once', async () => {
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      element.username = 'test';
      await aTimeout();
      assert.isTrue(spy.calledOnce);
    });

    it('Invalid settings dispatched', async () => {
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      element.password = 'test';
      await aTimeout();
      const detail = spy.args[0][0].detail;
      assert.equal(detail.settings.username, '', 'username is empty');
      assert.equal(detail.settings.password, 'test', 'password is set');
      assert.equal(detail.settings.hash, 'OnRlc3Q=', 'hash is set');
      assert.equal(detail.type, 'basic', 'type is set');
      assert.isFalse(detail.valid, 'valid is false');
    });

    it('Valid settings dispatched', async () => {
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      element.username = 'test';
      await aTimeout();
      const detail = spy.args[0][0].detail;
      assert.equal(detail.settings.username, 'test', 'Username is set');
      assert.equal(detail.settings.password, '', 'Password is empty');
      assert.equal(detail.settings.hash, 'dGVzdDo=', 'Hash is set');
      assert.equal(detail.type, 'basic', 'type is set');
      assert.isTrue(detail.valid, 'valid is true');
    });

    it('notifies settings after restoring settings', async () => {
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      element.restore({
        username: 'test',
        password: 'test'
      });
      await aTimeout();
      const detail = spy.args[0][0].detail;
      assert.equal(detail.settings.username, 'test', 'Username is set');
      assert.equal(detail.settings.password, 'test', 'Password is set');
      assert.equal(detail.settings.hash, 'dGVzdDp0ZXN0', 'Hash is set');
      assert.equal(detail.type, 'basic', 'type is set');
      assert.isTrue(detail.valid, 'valid is true');
    });

    it('notifies settings change immediately after user input', () => {
      const input = element.shadowRoot.querySelector('anypoint-input').inputElement;
      input.value = 'test';
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      const detail = spy.args[0][0].detail;
      assert.equal(detail.settings.username, 'test', 'Username is set');
      assert.equal(detail.settings.password, '', 'Password is empty');
      assert.equal(detail.settings.hash, 'dGVzdDo=', 'Hash is set');
      assert.equal(detail.type, 'basic', 'type is set');
      assert.isTrue(detail.valid, 'valid is true');
    });

    it('does not call restore after event disaptch', () => {
      const input = element.shadowRoot.querySelector('anypoint-input').inputElement;
      input.value = 'test';
      const spy = sinon.stub(element, 'restore');
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      assert.isFalse(spy.called);
    });
  });

  describe('username input handler', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets the value', () => {
      const input = element.shadowRoot.querySelector('anypoint-input').inputElement;
      input.value = 'test';
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      assert.equal(element.username, 'test');
    });

    it('dispatches change event', () => {
      const input = element.shadowRoot.querySelector('anypoint-input').inputElement;
      input.value = 'test';
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      assert.isTrue(spy.called);
    });
  });

  describe('password input handler', () => {
    let element;
    beforeEach(async () => {
      element = await basicFixture();
    });

    it('sets the value', () => {
      const input = element.shadowRoot.querySelector('anypoint-masked-input').inputElement;
      input.value = 'test';
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      assert.equal(element.password, 'test');
    });

    it('dispatches change event', () => {
      const input = element.shadowRoot.querySelector('anypoint-masked-input').inputElement;
      input.value = 'test';
      const spy = sinon.stub();
      element.addEventListener('auth-settings-changed', spy);
      input.dispatchEvent(new CustomEvent('input', { bubbles: true, composed: true }));
      assert.isTrue(spy.called);
    });
  });

  describe('password input handler', () => {
    let element;
    beforeEach(async () => {
      element = await valuesFixture();
    });

    it('clears username', () => {
      element.reset();
      assert.equal(element.username, '');
    });

    it('clears password', () => {
      element.reset();
      assert.equal(element.password, '');
    });
  });

  describe('auth-settings-changed handler', () => {
    let element;
    beforeEach(async () => {
      element = await valuesFixture();
    });

    function fire(type) {
      type = type || 'basic';
      const e = new CustomEvent('auth-settings-changed', {
        bubbles: true,
        detail: {
          settings: {
            username: 'updated',
            password: 'value'
          },
          type
        }
      });
      document.body.dispatchEvent(e);
    }

    it('updates username from the event', () => {
      fire();
      assert.equal(element.username, 'updated');
    });

    it('updates password', () => {
      fire();
      assert.equal(element.password, 'value');
    });

    it('ignores other types', () => {
      fire('other');
      assert.equal(element.password, 'test');
    });
  });
});
