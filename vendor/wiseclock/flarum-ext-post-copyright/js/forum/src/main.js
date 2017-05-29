import { extend, override } from 'flarum/extend';

import app from 'flarum/app';

import Post from 'flarum/models/Post';
import Model from 'flarum/Model';

import HeaderPrimary from 'flarum/components/HeaderPrimary';
import DiscussionPage from 'flarum/components/DiscussionPage';

import CommentPost from 'flarum/components/CommentPost';

import DiscussionComposer from 'flarum/components/DiscussionComposer';
import EditPostComposer from "flarum/components/EditPostComposer";
import ReplyComposer from "flarum/components/ReplyComposer";

import TextEditor from "flarum/components/TextEditor";
import Select from 'flarum/components/Select';

app.initializers.add('wiseclock-post-copyright', function()
{
    Post.prototype.copyright = Model.attribute('copyright');

    function getDefaults(index)
    {
        var dbValString = app.forum.attribute('wiseclock.post-copyright.defaults');
        var dbVal;
        if (dbValString === null)
            dbVal = [true, true, true, true];
        else
            dbVal = JSON.parse(dbValString);
        return dbVal[index];
    }

    const wiseclockCopyrightOptions =
    {
        'sourced': app.translator.trans('wiseclock-post-copyright.forum.composer.sourced'),
        'authorized': app.translator.trans('wiseclock-post-copyright.forum.composer.authorized'),
        'paid': app.translator.trans('wiseclock-post-copyright.forum.composer.paid'),
        'prohibited': app.translator.trans('wiseclock-post-copyright.forum.composer.prohibited'),
        'none': app.translator.trans('wiseclock-post-copyright.forum.composer.none'),
    };
    const wiseclockCopyrightShown =
    {
        'sourced': app.translator.trans('wiseclock-post-copyright.forum.post.sourced'),
        'authorized': app.translator.trans('wiseclock-post-copyright.forum.post.authorized'),
        'paid': app.translator.trans('wiseclock-post-copyright.forum.post.paid'),
        'prohibited': app.translator.trans('wiseclock-post-copyright.forum.post.prohibited'),
    };

    var wiseclockCopyrightAvailableOptions = {};
    var wiseclockCopyrightAvailableShown = {};
    var wiseclockCopyrightPrimaryColor = false;
    var wiseclockCopyrightAlignRight = false;
    var wiseclockCopyrightDiscussionsOnly = false;
    var wiseclockCopyrightAllowTrespass = false;
    var wiseclockCopyrightIcon = '© ';

    extend(HeaderPrimary.prototype, 'init', function ()
    {
        if (app.forum.attribute('wiseclock.post-copyright.primary_color') !== null)
            wiseclockCopyrightPrimaryColor = JSON.parse(app.forum.attribute('wiseclock.post-copyright.primary_color'));

        if (app.forum.attribute('wiseclock.post-copyright.discussions_only') !== null)
            wiseclockCopyrightDiscussionsOnly = JSON.parse(app.forum.attribute('wiseclock.post-copyright.discussions_only'));

        if (app.forum.attribute('wiseclock.post-copyright.align_right') !== null)
            wiseclockCopyrightAlignRight = JSON.parse(app.forum.attribute('wiseclock.post-copyright.align_right'));

        if (app.forum.attribute('wiseclock.post-copyright.icon') !== null)
            wiseclockCopyrightIcon = app.forum.attribute('wiseclock.post-copyright.icon');

        if (app.forum.attribute('wiseclock.post-copyright.allow_trespass') !== null)
            wiseclockCopyrightAllowTrespass = JSON.parse(app.forum.attribute('wiseclock.post-copyright.allow_trespass'));

        if (app.forum.attribute('wiseclock.post-copyright.addition') !== null)
        {
            let additions = app.forum.attribute('wiseclock.post-copyright.addition');
            let additionLines = additions.match(/[^\r\n]+/g);
            additionLines.forEach(function(element, index)
            {
                let optionComponents = element.match(/([^\\\][^,]|\\,)+/g);
                if (optionComponents.length == 3)
                {
                    let optionKey = optionComponents[0];
                    let optionMenu = optionComponents[1];
                    let optionUI = optionComponents[2];
                    wiseclockCopyrightAvailableOptions[optionKey] = optionMenu;
                    wiseclockCopyrightAvailableShown[optionKey] = optionUI;
                }
            });
        }

        var optionKeys = Object.keys(wiseclockCopyrightOptions);
        optionKeys.forEach(function(key, index)
        {
            if ((index >= 4 || getDefaults(index)) && !wiseclockCopyrightAvailableOptions.hasOwnProperty(key))
            {
                wiseclockCopyrightAvailableOptions[key] = wiseclockCopyrightOptions[key];
                if (key != 'none')
                    wiseclockCopyrightAvailableShown[key] = wiseclockCopyrightShown[key];
            }
        });
    });

    extend(DiscussionComposer.prototype, 'init', function (items)
    {
        const _editor = this.editor;
        _editor.props.copyright = {};
        _editor.props.copyright.options = wiseclockCopyrightAvailableOptions;
        _editor.props.copyright.value = m.prop(Object.keys(wiseclockCopyrightAvailableOptions)[0]);
    });
    extend(EditPostComposer.prototype, 'init', function (items)
    {
        const _editor = this.editor;
        _editor.props.copyright = {};
        _editor.props.copyright.options = wiseclockCopyrightAvailableOptions;
        let copyrightKey = this.props.post.data.attributes.copyright;
        if (!wiseclockCopyrightAvailableOptions.hasOwnProperty(copyrightKey))
            copyrightKey = Object.keys(wiseclockCopyrightAvailableOptions)[0];
        _editor.props.copyright.value = m.prop(copyrightKey);

        if (app.current instanceof DiscussionPage)
        {
            let discussionStartPost = app.current.stream.discussion.data.relationships.posts.data[0];
            if (discussionStartPost.type == 'posts')
            {
                let startPostId = discussionStartPost.id;
                let currentPostId = this.props.post.id();
                let isEditingStartPost = startPostId === currentPostId;
                if (wiseclockCopyrightDiscussionsOnly && !isEditingStartPost)
                    _editor.props.copyright.hidden = true;
            }
        }

        let currentUserId = app.session.user.id();
        let currentPostUserId = this.props.post.data.relationships.user.data.id;
        if (!wiseclockCopyrightAllowTrespass && currentUserId != currentPostUserId)
            _editor.props.copyright.hidden = true;
    });

    extend(EditPostComposer.prototype, 'data', function(data)
    {
        if (this.editor.props.copyright.value())
            data.copyright = this.editor.props.copyright.value();
    });
    extend(ReplyComposer.prototype, 'data', function(data)
    {
        if (this.editor.props.copyright.value())
            data.copyright = this.editor.props.copyright.value();
    });
    extend(DiscussionComposer.prototype, 'data', function(data)
    {
        if (this.editor.props.copyright.value())
            data.copyright = this.editor.props.copyright.value();
    });

    extend(CommentPost.prototype, 'content', function (list)
    {
        if (!this.isEditing())
        {
            var copyrightKey = this.props.post.data.attributes.copyright;

            let hidden = false;
            if (app.current instanceof DiscussionPage)
            {
                let discussionStartPost = app.current.stream.discussion.data.relationships.posts.data[0];
                if (discussionStartPost.type == 'posts')
                {
                    let startPostId = discussionStartPost.id;
                    let currentPostId = this.props.post.id();
                    let isEditingStartPost = startPostId === currentPostId;
                    if (wiseclockCopyrightDiscussionsOnly && !isEditingStartPost)
                        hidden = true;
                }
            }

            if (hidden || copyrightKey == 'none' || !wiseclockCopyrightAvailableShown.hasOwnProperty(copyrightKey))
                return;
            var copyrightString = wiseclockCopyrightAvailableShown[copyrightKey];
            var extraClass = '';
            if (wiseclockCopyrightAlignRight)
                extraClass = ' Copyright-wrapper-right';
            list.push(m('div.Copyright-wrapper' + extraClass, m.trust(wiseclockCopyrightIcon + copyrightString)));
        }
    });

    extend(TextEditor.prototype, 'controlItems', function (items)
    {
        const _editor = this;
        let addDropdown = true;

        if (!_editor.props.copyright)
        {
            _editor.props.copyright = {};
            _editor.props.copyright.options = wiseclockCopyrightAvailableOptions;
            _editor.props.copyright.value = m.prop('none');

            if (wiseclockCopyrightDiscussionsOnly)
                _editor.props.copyright.hidden = true;
        }

        if (_editor.props.copyright.hidden)
            return;

        var dropdown = Select.component({
            options: _editor.props.copyright.options,
            onchange: _editor.props.copyright.value,
            value: _editor.props.copyright.value() || Object.keys(wiseclockCopyrightAvailableOptions)[0]
        });

        var extraClass = wiseclockCopyrightPrimaryColor ? ' Dropdown-primary' : '';
        items.add('wiseclock-post-copyright-selector' + extraClass, dropdown, 0);
    });

});
