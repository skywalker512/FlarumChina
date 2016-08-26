import Modal from 'flarum/components/Modal';
import icon from 'flarum/helpers/icon'
import Button from 'flarum/components/Button';

export default class ShareSocialModal
extends Modal {
  init() {
    super.init();
  }

  className() {
    return 'Modal--small';
  }

  title() {
    return app.forum.attribute('vingle.share.social') ? app.forum.attribute('vingle.share.social') : 'Share';
  }

  content() {

    return [ < div className = "Modal-body" > 
    < div className = "Form Form--centered" >
    < div className = "Form-group" >
    {
    Button.component({
        className: 'Button Button--rounded Share--facebook',
        icon: 'facebook fa-lg',
        onclick: () => {
          const width = 1000;
          const height = 500;
          const top = $(window).height() / 2 - height / 2;
          const left = $(window).width() / 2 - width / 2;
          window.open( 'https://www.facebook.com/sharer.php?=100&p[url]=' + encodeURIComponent(app.forum.attribute('baseUrl')) + '/d/' + app.current.discussion.id() + '&t=' + encodeURIComponent(app.title), app.title,'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no');
        } 
      })

  }
  {
    Button.component({
        className: 'Button Button--rounded Share--twitter',
        icon: 'twitter fa-lg',
        
        onclick: () => {
          const width = 1000;
          const height = 500;
          const top = $(window).height() / 2 - height / 2;
          const left = $(window).width() / 2 - width / 2;
          window.open( 'https://twitter.com/intent/tweet?url=' + encodeURIComponent(app.forum.attribute('baseUrl')) + '/d/' + app.current.discussion.id() + '&text=' + encodeURIComponent(app.title), app.title,'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no');
        } 
      })
  }
  {
    Button.component({
        className: 'Button Button--rounded Share--google',
        icon: 'google-plus fa-lg',
        
        onclick: () => {
          const width = 1000;
          const height = 500;
          const top = $(window).height() / 2 - height / 2;
          const left = $(window).width() / 2 - width / 2;
          window.open( 'https://plus.google.com/share?url=' + encodeURIComponent(app.forum.attribute('baseUrl')) + '/d/' + app.current.discussion.id(), app.title,'width=' + width + ', height= ' + height + ', top=' + top + ', left=' + left + ', status=no, scrollbars=no, resizable=no');
        } 
      })
  }
    </div>
    </div>
    < /div>];
  }
}
