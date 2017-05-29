import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import humanTime from 'flarum/helpers/humanTime';
import FieldSet from 'flarum/components/FieldSet';

export default class AdminStrikeModal extends Modal {
  init() {
    super.init();
    
    this.user = this.props.user;
    
    
    app.request({
          method: 'GET',
          url: app.forum.attribute('apiUrl') + '/strike/'+this.user.data.id,
    }).then(
          response => {
            this.strikes = response.data;
            this.flatstrikes = [];
            for(i = 0; i < this.strikes.length; i++) {
              this.flatstrikes[i] = [];
              this.flatstrikes[i]['index'] = i+1;
              this.flatstrikes[i]['id'] = this.strikes[i].attributes['id'];
              this.flatstrikes[i]['actor'] = this.strikes[i].attributes['actor'];
              this.flatstrikes[i]['reason'] = this.strikes[i].attributes['reason'];
              this.flatstrikes[i]['post'] = this.strikes[i].attributes['post'];
              this.flatstrikes[i]['time'] = new Date(this.strikes[i].attributes['time']);
            }
            if (this.strikes.length == 0) {
              this.strikes = undefined;
            }
            m.redraw();
            this.loading = false;
    });
  }

  className() {
    if (this.strikes !== undefined) {
      return 'AdminStrikeModal Modal';
    } else {
      return 'NoStrikeModal Modal Modal--small'
    }
  }

  title() {
    var username = this.user.data.attributes.username;
    return app.translator.trans('reflar-usermanagement.admin.modal.view.title', {username});
  }

  content() {
    return (
      m('div', {className: 'Modal-body'}, [
          m('div', {className: 'Form Form--centered'}, [
             FieldSet.component({
               className: 'AdminStrikeModal--fieldset',
                children: [
                  (this.strikes !== undefined ?  
                  m('table', {className: "NotificationGrid"}, [m('thead', [m('tr', [m('td',[app.translator.trans('reflar-usermanagement.admin.modal.view.number')]),m('td',[app.translator.trans('reflar-usermanagement.admin.modal.view.reason')]),m('td',[app.translator.trans('reflar-usermanagement.admin.modal.view.content')]),m('td', {className: "HideOnMobile"}, [app.translator.trans('reflar-usermanagement.admin.modal.view.actor')]),m('td', {className: "HideOnMobile"}, [app.translator.trans('reflar-usermanagement.admin.modal.view.time')]),m('td',[app.translator.trans('reflar-usermanagement.admin.modal.view.remove')])])]),m('tbody',[
                    this.flatstrikes.map((strike) => {
                      return [
                        m('tr', [m('td',[strike['index']]),m('td',[strike['reason']]),m('td',[m('a', {target: "_blank", href: app.forum.attribute('baseUrl') + '/d/' + strike['post']},[app.translator.trans('reflar-usermanagement.admin.modal.view.link')])]),m('td', {className: "HideOnMobile"}, [m('a', {target: "_blank", href: app.forum.attribute('baseUrl') + '/u/' + strike['actor']},[strike['actor']])]),m('td', {className: "HideOnMobile"}, [humanTime(strike['time'])]),m('td',[m('a', {className: "icon fa fa-fw fa-times", onclick: ()=>{this.deleteStrike(strike['id'], strike['index'])}})])])
                      ]})])])
                       : m('tr', [m('td',[app.translator.trans('reflar-usermanagement.admin.modal.view.no_strikes')])])),
                  ]})
                  ]
              )]
          )
       )}
  
    deleteStrike(id, index) {

        if (this.loading) return;
      
        this.loading = true;

         app.request({
            method: 'Delete',
            url: app.forum.attribute('apiUrl') + '/strike/'+id
        }).then(this.flatstrikes.splice(index - 1, 1)
        );
    }
}