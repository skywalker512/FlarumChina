import { extend } from 'flarum/extend';
import app from 'flarum/app';
import LogInButtons from 'flarum/components/LogInButtons';
import LogInButton from 'flarum/components/LogInButton';

app.initializers.add('stanleysong-auth-wechat', () => {
  extend(LogInButtons.prototype, 'items', function(items) {
    items.add('wechat',
      <LogInButton
        className="Button LogInButton--wechat"
        icon="wechat"
        path="/auth/wechat">
        {app.translator.trans('stanleysong-auth-wechat.forum.log_in.with_wechat_button')}
      </LogInButton>
    );
  });
});