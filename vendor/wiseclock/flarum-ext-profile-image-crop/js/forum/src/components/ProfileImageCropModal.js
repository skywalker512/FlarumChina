import Modal from 'flarum/components/Modal';
import Button from 'flarum/components/Button';
import app from 'flarum/app';

export default class ProfileImageCropModal extends Modal
{
    constructor(imgData)
    {
        super();
        this.data = imgData;
    }

    init()
    {
        super.init();
    }

    className()
    {
        return 'WiseClockProfileImageCropModal Modal--small';
    }

    title()
    {
        return app.translator.trans('core.forum.user.avatar_upload_button');
    }

    content()
    {
        return (
            <div className="WiseClockProfileImageCropModalBody Modal-body">
                <div className="Form Form--centered">
                    <div className="Form-group">
                        <div id="avatar_crop"></div>
                    </div>
                    <div className="Form-group">
                        {Button.component({
                          className: 'Button Button--primary Button--block',
                          type: 'submit',
                          loading: this.loading,
                          children: app.translator.trans('core.forum.edit_user.submit_button')
                        })}
                    </div>
                </div>
            </div>
        );
    }

    hideSuccess(modal, data)
    {
        this.success = data;
        super.hide();
    }

    hideFailure(modal, data)
    {
        this.failure = data;
        super.hide();
    }

    onready()
    {
        $('#avatar_crop').html('');
        this.croppieArea = $('#avatar_crop').croppie(
        {
            viewport:
            {
                width: 230,
                height: 230,
                type: 'circle'
            }
        });
        this.croppieArea.croppie('bind',
        {
            url: this.data
        });
    }

    dataURLtoFile(dataurl, filename)
    {
        var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
        while(n--)
        {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, {type:mime});
    }

    onsubmit(e)
    {
        e.preventDefault();
        let userid = this.userId;
        let modal = this;
        let originalFile = this.file;
        if (this.croppieArea && userid)
        {
            if (modal.supported)
            {
                let useBlob = false;
                if (window.Blob)
                    useBlob = true;
                this.croppieArea.croppie('result',
                    {
                        type: useBlob ? 'blob' : 'base64',
                        size: 'original',
                        circle: false
                    })
                .then(function(image)
                {
                    let file = useBlob ? image : modal.dataURLtoFile(image, 'croppieImage.png');
                    let data = new FormData();
                    data.append('avatar', file);
                    app.request(
                    {
                        method: 'POST',
                        url: app.forum.attribute('apiUrl') + '/users/' + userid + '/avatar',
                        serialize: raw => raw,
                        data
                    }).then(
                        modal.hideSuccess.bind(modal, this),
                        modal.hideFailure.bind(modal, this)
                    );
                });
            }
            else
            {
                let data = new FormData();
                data.append('avatar', originalFile);
                app.request(
                {
                    method: 'POST',
                    url: app.forum.attribute('apiUrl') + '/users/' + userid + '/avatar',
                    serialize: raw => raw,
                    data
                }).then(
                    modal.hideSuccess.bind(modal, this),
                    modal.hideFailure.bind(modal, this)
                );
            }
        }
    }
}
