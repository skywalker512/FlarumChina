/* global $ */
/* global m */
/* global grecaptcha */
import app from 'flarum/app';
import { extend } from 'flarum/extend';
import SignUpModal from 'flarum/components/SignUpModal';
// import LogInModal from 'flarum/components/LogInModal';

app.initializers.add('sijad-recaptcha', () => {
  const isAvail = () => typeof grecaptcha !== 'undefined';
  const recaptchaValue = m.prop();
  const recaptchaID = m.prop();

  function load() {
    const key = app.forum.attribute('recaptchaPublic');

    if (!key) return;

    const render = () => {
      if (this.$('.g-recaptcha').length) return;

      const el = $('<div class="Form-group g-recaptcha">')
        .insertBefore(this.$('[type="submit"]').parent())[0];

      if (el && !$(el).data('g-rendred')) {
        recaptchaID(grecaptcha.render(el, {
          sitekey: key,
          theme: app.forum.attribute('darkMode') ? 'dark' : 'light',
          callback: val => {
            recaptchaValue(val);
          },
        }));
        $(el).data('g-rendred', true);
        m.redraw();
      }
    };

    if (isAvail()) {
      render();
    } else {
      $.getScript(
        `https://www.google.com/recaptcha/api.js?hl=${app.locale}&render=explicit`,
        () => {
          let attemps = 0;
          const interval = setInterval(() => {
            ++attemps;
            if (isAvail()) {
              clearInterval(interval);
              render();
            }
            if (attemps > 100) {
              clearInterval(interval);
            }
          }, 100);
        }
      );
    }
  }
  extend(SignUpModal.prototype, 'config', load);
  // extend(LogInModal.prototype, 'config', load);

  function clean() {
    this.$('.g-recaptcha').remove();
  }
  extend(SignUpModal.prototype, 'logIn', clean);
  // extend(LogInModal.prototype, 'signUp', clean);

  extend(SignUpModal.prototype, 'submitData', function (data) {
    const newData = data;
    newData['g-recaptcha-response'] = recaptchaValue();
    return newData;
  });

  extend(SignUpModal.prototype, 'onerror', function () {
    if (isAvail()) {
      grecaptcha.reset(recaptchaID());
    }
  });
});
