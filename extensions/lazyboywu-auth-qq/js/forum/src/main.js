import { extend } from 'flarum/extend';
import app from 'flarum/app';
import LogInButtons from 'flarum/components/LogInButtons';
import LogInButton from 'flarum/components/LogInButton';

// 导航栏右侧
import HeaderSecondary from 'flarum/components/HeaderSecondary';

app.initializers.add('lazyboywu-auth-qq', () => {
  extend(LogInButtons.prototype, 'items', function(items) {
    items.add('qq',
      LogInButton.component({
        //children: app.translator.trans('flarum_auth_qq.forum.log_in.with_qq_button'),
        children: 'Log in with QQ',
        icon: 'qq',
        className: 'Button LogInButton--qq',
        path: '/auth/qq',
      })
    );
  });

  // 导航栏右侧
  extend(HeaderSecondary.prototype, 'items', function(items) {
    if (app.session.user) {
      return;
    }
    items.add('qq',
        LogInButton.component({
          children: '',
          icon: 'qq',
          className: 'Button Button--link Button--qq',
          path: '/auth/qq',
        })
      );
  });

});
