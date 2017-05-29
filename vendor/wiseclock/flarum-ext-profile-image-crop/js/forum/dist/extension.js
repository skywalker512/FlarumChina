System.register('wiseclock/flarum-ext-profile-image-crop/components/ProfileImageCropModal', ['flarum/components/Modal', 'flarum/components/Button', 'flarum/app'], function (_export) {
    'use strict';

    var Modal, Button, app, ProfileImageCropModal;
    return {
        setters: [function (_flarumComponentsModal) {
            Modal = _flarumComponentsModal['default'];
        }, function (_flarumComponentsButton) {
            Button = _flarumComponentsButton['default'];
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }],
        execute: function () {
            ProfileImageCropModal = (function (_Modal) {
                babelHelpers.inherits(ProfileImageCropModal, _Modal);

                function ProfileImageCropModal(imgData) {
                    babelHelpers.classCallCheck(this, ProfileImageCropModal);

                    babelHelpers.get(Object.getPrototypeOf(ProfileImageCropModal.prototype), 'constructor', this).call(this);
                    this.data = imgData;
                }

                babelHelpers.createClass(ProfileImageCropModal, [{
                    key: 'init',
                    value: function init() {
                        babelHelpers.get(Object.getPrototypeOf(ProfileImageCropModal.prototype), 'init', this).call(this);
                    }
                }, {
                    key: 'className',
                    value: function className() {
                        return 'WiseClockProfileImageCropModal Modal--small';
                    }
                }, {
                    key: 'title',
                    value: function title() {
                        return app.translator.trans('core.forum.user.avatar_upload_button');
                    }
                }, {
                    key: 'content',
                    value: function content() {
                        return m(
                            'div',
                            { className: 'WiseClockProfileImageCropModalBody Modal-body' },
                            m(
                                'div',
                                { className: 'Form Form--centered' },
                                m(
                                    'div',
                                    { className: 'Form-group' },
                                    m('div', { id: 'avatar_crop' })
                                ),
                                m(
                                    'div',
                                    { className: 'Form-group' },
                                    Button.component({
                                        className: 'Button Button--primary Button--block',
                                        type: 'submit',
                                        loading: this.loading,
                                        children: app.translator.trans('core.forum.edit_user.submit_button')
                                    })
                                )
                            )
                        );
                    }
                }, {
                    key: 'hideSuccess',
                    value: function hideSuccess(modal, data) {
                        this.success = data;
                        babelHelpers.get(Object.getPrototypeOf(ProfileImageCropModal.prototype), 'hide', this).call(this);
                    }
                }, {
                    key: 'hideFailure',
                    value: function hideFailure(modal, data) {
                        this.failure = data;
                        babelHelpers.get(Object.getPrototypeOf(ProfileImageCropModal.prototype), 'hide', this).call(this);
                    }
                }, {
                    key: 'onready',
                    value: function onready() {
                        $('#avatar_crop').html('');
                        this.croppieArea = $('#avatar_crop').croppie({
                            viewport: {
                                width: 230,
                                height: 230,
                                type: 'circle'
                            }
                        });
                        this.croppieArea.croppie('bind', {
                            url: this.data
                        });
                    }
                }, {
                    key: 'dataURLtoFile',
                    value: function dataURLtoFile(dataurl, filename) {
                        var arr = dataurl.split(','),
                            mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]),
                            n = bstr.length,
                            u8arr = new Uint8Array(n);
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n);
                        }
                        return new File([u8arr], filename, { type: mime });
                    }
                }, {
                    key: 'onsubmit',
                    value: function onsubmit(e) {
                        var _this = this;

                        e.preventDefault();
                        var userid = this.userId;
                        var modal = this;
                        var originalFile = this.file;
                        if (this.croppieArea && userid) {
                            if (modal.supported) {
                                (function () {
                                    var useBlob = false;
                                    if (window.Blob) useBlob = true;
                                    _this.croppieArea.croppie('result', {
                                        type: useBlob ? 'blob' : 'base64',
                                        size: 'original',
                                        circle: false
                                    }).then(function (image) {
                                        var file = useBlob ? image : modal.dataURLtoFile(image, 'croppieImage.png');
                                        var data = new FormData();
                                        data.append('avatar', file);
                                        app.request({
                                            method: 'POST',
                                            url: app.forum.attribute('apiUrl') + '/users/' + userid + '/avatar',
                                            serialize: function serialize(raw) {
                                                return raw;
                                            },
                                            data: data
                                        }).then(modal.hideSuccess.bind(modal, this), modal.hideFailure.bind(modal, this));
                                    });
                                })();
                            } else {
                                var data = new FormData();
                                data.append('avatar', originalFile);
                                app.request({
                                    method: 'POST',
                                    url: app.forum.attribute('apiUrl') + '/users/' + userid + '/avatar',
                                    serialize: function serialize(raw) {
                                        return raw;
                                    },
                                    data: data
                                }).then(modal.hideSuccess.bind(modal, this), modal.hideFailure.bind(modal, this));
                            }
                        }
                    }
                }]);
                return ProfileImageCropModal;
            })(Modal);

            _export('default', ProfileImageCropModal);
        }
    };
});;
System.register('wiseclock/flarum-ext-profile-image-crop/main', ['flarum/extend', 'flarum/app', 'flarum/components/AvatarEditor', 'wiseclock/flarum-ext-profile-image-crop/components/ProfileImageCropModal'], function (_export) {
    'use strict';

    var extend, override, app, AvatarEditor, ProfileImageCropModal;
    return {
        setters: [function (_flarumExtend) {
            extend = _flarumExtend.extend;
            override = _flarumExtend.override;
        }, function (_flarumApp) {
            app = _flarumApp['default'];
        }, function (_flarumComponentsAvatarEditor) {
            AvatarEditor = _flarumComponentsAvatarEditor['default'];
        }, function (_wiseclockFlarumExtProfileImageCropComponentsProfileImageCropModal) {
            ProfileImageCropModal = _wiseclockFlarumExtProfileImageCropComponentsProfileImageCropModal['default'];
        }],
        execute: function () {
            ;

            app.initializers.add('wiseclock-profile-image-crop', function () {
                extend(AvatarEditor.prototype, 'config', function () {
                    var noAvatar = $('.AvatarEditor a.AvatarEditor--noAvatar').length > 0;

                    if (noAvatar) {
                        $('.AvatarEditor a.AvatarEditor--noAvatar').off('touchend').on('touchend', function (e) {
                            e.preventDefault();
                            $(this).mouseenter();
                            $(this).click();
                        });
                    }

                    if (!noAvatar) {
                        $('.AvatarEditor a.Dropdown-toggle').off('touchend');
                        $('.AvatarEditor ul.Dropdown-menu li.item-upload button').off('touchend').on('touchend', function (e) {
                            e.preventDefault();
                            $(this).mouseenter();
                            $(this).click();
                        });
                    }
                });

                override(AvatarEditor.prototype, 'upload', function (superUpload) {
                    var _this = this;

                    if (window.FileReader) {
                        var _ret = (function () {
                            if (_this.loading) return {
                                    v: undefined
                                };

                            var $input = $('<input id="dpUpload" type="file">');
                            var aEditor = _this;
                            var uploadUserId = _this.props.user.id();
                            $input.appendTo('body').hide().click().on('change', function (e) {
                                var file = $(e.target)[0].files[0];
                                var reader = new FileReader();
                                reader.addEventListener("load", function () {
                                    var modal = new ProfileImageCropModal(reader.result);

                                    var arrayReader = new FileReader();
                                    arrayReader.onloadend = function (x) {
                                        var arr = new Uint8Array(x.target.result).subarray(0, 4);
                                        var header = "";
                                        for (var i = 0; i < arr.length; i++) header += arr[i].toString(16);

                                        switch (header.toLowerCase()) {
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
                                        if (header.toLowerCase().substring(0, 4) == '424d') modal.supported = true; // bmp
                                    };
                                    arrayReader.readAsArrayBuffer(file);

                                    modal.userId = uploadUserId;
                                    modal.file = file;
                                    modal.onhide = function () {
                                        if (this.success) aEditor.success(this.success);
                                        aEditor.loading = false;
                                        m.redraw();
                                    };
                                    app.modal.show(modal);
                                }, false);

                                if (file) {
                                    reader.readAsDataURL(file);
                                }
                            });
                        })();

                        if (typeof _ret === 'object') return _ret.v;
                    } else {
                        superUpload();
                    }
                });
            });
        }
    };
});