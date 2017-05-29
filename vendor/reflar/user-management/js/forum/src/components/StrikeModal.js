import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import Discussion from 'flarum/models/Discussion';
import ModStrikeModal from 'Reflar/UserManagement/components/ModStrikeModal';

export default class StrikeModal extends Modal {
    init() {
        super.init();

        this.post = this.props.post;
      
        this.user = app.store.getById('users', this.post.data.relationships.user.data.id);
      
        this.reason = m.prop('');
      
        this.time = new Date();

    }

    className() {
        return 'StrikeModal Modal';
    }

    title() {
        var username = this.user.data.attributes.username;
        return app.translator.trans('reflar-usermanagement.forum.modal.post.title', {username});
    }

    content() {

        return [
            m('div', {className: 'Modal-body'}, [
                m('div', {className: 'Form'}, [
                    m('div', {className: 'Form-group'}, [
                        m('label', {},  app.translator.trans('reflar-usermanagement.forum.modal.post.strike_reason')),
                        m('textarea', {
                            rows: '3',
                            className: 'FormControl',
                            placeholder: app.translator.trans('reflar-usermanagement.forum.modal.post.reason_placeholder'),
                            oninput: m.withAttr('value', this.reason)
                        })
                    ]),
                    m('div', {className: 'Form-group'}, [
                        m(Button, {
                            className: 'Button Button--primary',
                            type: 'submit',
                            loading: this.loading,
                            disabled: !this.reason()
                        }, app.translator.trans('reflar-usermanagement.forum.modal.post.submit_button'))
                    ])
                ])
            ])
        ];
    }
  success(response) {
	app.modal.close();
	m.redraw();
    app.modal.show(new ModStrikeModal(this.user));
  }

    onsubmit(e) {
        e.preventDefault();

        this.loading = true;
		
		this.post.pushAttributes({ hideTime: new Date(), hideUser: app.session.user });
		this.post.save({ isHidden: true });

        app.request({
            method: 'POST',
            url: app.forum.attribute('apiUrl') + '/strike',
            data: {
            "post_id": this.post.data.attributes.id,
            "reason": this.reason()
            }
        }).then(this.success.bind(this), 
                this.loaded.bind(this)
        );
    }
}