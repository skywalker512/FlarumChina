import { extend, override } from 'flarum/extend';

import app from 'flarum/app';
import CommentPost from 'flarum/components/CommentPost';
import DiscussionPage from 'flarum/components/DiscussionPage';
import DiscussionControls from 'flarum/utils/DiscussionControls';
import LogInModal from 'flarum/components/LogInModal';

app.initializers.add('wiseclock-reply2see', function()
{
    extend(CommentPost.prototype, 'config', function()
    {
        if (app.session.user && app.current instanceof DiscussionPage)
            $('.reply2see_reply').off('click').on('click',
                () => DiscussionControls.replyAction.call(app.current.discussion, true, false)
            );
        else
            $('.reply2see_reply').off('click').on('click',
                () => app.modal.show(new LogInModal())
            );
    });
});
