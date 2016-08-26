import { extend } from 'flarum/extend';
import app from 'flarum/app';
import DiscussionPage from 'flarum/components/DiscussionPage';
import Button from 'flarum/components/Button';
import ShareSocialModal from 'vingle/share/social/components/ShareSocialModal';

app.initializers.add('vingle-share-social', function() {
	extend(DiscussionPage.prototype, 'sidebarItems', function(items) {
		items.add('share-social',
			Button.component({
				className: 'Button Button-icon Button--share',
				icon: 'share-alt',
				children: app.forum.attribute('vingle.share.social') ? app.forum.attribute('vingle.share.social') : 'Share',
				onclick: () => app.modal.show(new ShareSocialModal())
			}), 5);
	});
});
