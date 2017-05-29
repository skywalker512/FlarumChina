import { extend, override } from 'flarum/extend';

import app from 'flarum/app';
import AvatarEditor from 'flarum/components/AvatarEditor';
import ProfileImageCropModal from 'wiseclock/flarum-ext-profile-image-crop/components/ProfileImageCropModal';;

app.initializers.add('wiseclock-profile-image-crop', function()
{
    extend(AvatarEditor.prototype, 'config', function()
    {
        let noAvatar = $('.AvatarEditor a.AvatarEditor--noAvatar').length > 0;

        if (noAvatar)
        {
            $('.AvatarEditor a.AvatarEditor--noAvatar').off('touchend').on('touchend', function (e)
            {
                e.preventDefault();
                $(this).mouseenter();
                $(this).click();
            });
        }

        if (!noAvatar)
        {
            $('.AvatarEditor a.Dropdown-toggle').off('touchend');
            $('.AvatarEditor ul.Dropdown-menu li.item-upload button').off('touchend').on('touchend', function (e)
            {
                e.preventDefault();
                $(this).mouseenter();
                $(this).click();
            });
        }
    });

    override(AvatarEditor.prototype, 'upload', function (superUpload)
    {
        if (window.FileReader)
        {
            if (this.loading) return;

            const $input = $('<input id="dpUpload" type="file">');
            const aEditor = this;
            const uploadUserId = this.props.user.id();
            $input.appendTo('body').hide().click().on('change', function(e)
            {
                let file = $(e.target)[0].files[0];
                let reader  = new FileReader();
                reader.addEventListener("load", function()
                {
                    let modal = new ProfileImageCropModal(reader.result);

                    let arrayReader = new FileReader();
                    arrayReader.onloadend = function(x)
                    {
                        var arr = (new Uint8Array(x.target.result)).subarray(0, 4);
                        var header = "";
                        for(var i = 0; i < arr.length; i++)
                            header += arr[i].toString(16);

                        switch(header.toLowerCase())
                        {
                            case "89504e47":
                                modal.supported = true; // png
                                break;
                            case "47494638":
                                modal.supported = true; // gif
                                break;
                            case "ffd8ffe0":
                            case "ffd8ffe1":
                            case "ffd8ffe2":
                                modal.supported = true; // jpeg
                                break;
                            default:
                                break;
                        }
                        if (header.toLowerCase().substring(0, 4) == '424d')
                            modal.supported = true; // bmp
                    };
                    arrayReader.readAsArrayBuffer(file);

                    modal.userId = uploadUserId;
                    modal.file = file;
                    modal.onhide = function()
                    {
                        if (this.success)
                            aEditor.success(this.success);
                        aEditor.loading = false;
                        m.redraw();
                    }
                    app.modal.show(modal);
                }, false);

                if (file)
                {
                    reader.readAsDataURL(file);
                }
            });
        }
        else
        {
            superUpload();
        }
    });
});
