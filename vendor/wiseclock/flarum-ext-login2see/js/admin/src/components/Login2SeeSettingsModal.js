import SettingsModal from 'flarum/components/SettingsModal';
import Switch from "flarum/components/Switch";
import Select from 'flarum/components/Select';
import app from 'flarum/app';

export default class Login2SeeSettingsModal extends SettingsModal
{
    constructor()
    {
        super();
        this.linkOptions =
        {
            'no_replace': app.translator.trans('wiseclock-login2see.admin.link.no_replace'),
            'replace_address': app.translator.trans('wiseclock-login2see.admin.link.replace_address'),
            'replace_all': app.translator.trans('wiseclock-login2see.admin.link.replace_all'),
        };
    }

    className()
    {
        return 'Login2SeeSettingsModal Modal--small';
    }

    title()
    {
        return app.translator.trans('wiseclock-login2see.admin.title');
    }

    form()
    {
        return [
            m('div', {className: 'WiseClockLogin2See'}, [
                m('fieldset', {className: 'WiseClockLogin2See-post'}, [
                    m('legend', {}, app.translator.trans('wiseclock-login2see.admin.post.title')),
                    m('div', {className: 'helpText'}, app.translator.trans('wiseclock-login2see.admin.post.help')),
                    m('input', {className: 'FormControl', bidi: this.setting('wiseclock.login2see.post', '100')}),
                ]),
                m('fieldset', {className: 'WiseClockLogin2See-link'}, [
                    m('legend', {}, app.translator.trans('wiseclock-login2see.admin.link.title')),
                    Select.component(
                    {
                        options: this.linkOptions,
                        onchange: this.setting('wiseclock.login2see.link', Object.keys(this.linkOptions)[1]),
                        value: this.setting('wiseclock.login2see.link', Object.keys(this.linkOptions)[1])()
                    })
                ]),
                m('fieldset', {className: 'WiseClockLogin2See-image'}, [
                    m('legend', {}, app.translator.trans('wiseclock-login2see.admin.image.title')),
                    Switch.component(
                    {
                        state: JSON.parse(this.setting('wiseclock.login2see.image', 0)()),
                        onchange: this.setting('wiseclock.login2see.image', 1),
                        children: app.translator.trans('wiseclock-login2see.admin.image.label'),
                    }),
                ]),
                m('fieldset', {className: 'WiseClockLogin2See-php'}, [
                    m('legend', {}, app.translator.trans('wiseclock-login2see.admin.php.title')),
                    m('div', {className: 'helpText'}, app.translator.trans('wiseclock-login2see.admin.php.help')),
                    Switch.component(
                    {
                        state: JSON.parse(this.setting('wiseclock.login2see.php', 0)()),
                        onchange: this.setting('wiseclock.login2see.php', 1),
                        children: app.translator.trans('wiseclock-login2see.admin.php.label'),
                    }),
                ]),
            ]),
        ];
    }
}
