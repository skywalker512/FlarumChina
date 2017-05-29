import {extend} from 'flarum/extend';
import IndexPage from 'flarum/components/IndexPage';
import ItemList from 'flarum/utils/ItemList';
import DiscussionList from 'flarum/components/DiscussionList';
import Select from 'flarum/components/Select';

export default function () {
    IndexPage.prototype.viewItems = function () {
        const items = new ItemList();
        const sortMap = app.cache.discussionList.sortMap();

        const sortOptions = {};
        for (const i in sortMap) {
            sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
        }

        let sort = this.params().sort;

        if (this.props.routeName == 'index.filter') {
            sort = 'hot'
        }

        items.add('sort',
            Select.component({
                options: sortOptions,
                value: sort || Object.keys(sortMap)[0],
                onchange: this.changeSort.bind(this)
            })
        );

        return items;
    };

    IndexPage.prototype.changeSort = function (sort) {
        const params = this.params();

        if (sort === 'hot') {
			m.route(app.route('index'));
            m.route(m.route() + 'hot');
        } else {
            if (sort === Object.keys(app.cache.discussionList.sortMap())[0]) {
                delete params.sort;
            } else {
                params.sort = sort;
            }
            if (params.filter == 'hot') {
                delete params.filter;
            }
            m.route(app.route('index', params));
        }
    };

    extend(DiscussionList.prototype, 'sortMap', function (map) {
        map.hot = 'hot';
    });

    extend(DiscussionList.prototype, 'requestParams', function(params) {
        if (this.props.params.filter === 'hot') {
            params.filter.q = ' is:hot';
        }
    });
}