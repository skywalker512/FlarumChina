'use strict';

System.register('Davis/SecureHttps/main', ['flarum/app', 'flarum/extend', 'flarum/components/CommentPost'], function (_export, _context) {
    var app, extend, CommentPost;
    return {
        setters: [function (_flarumApp) {
            app = _flarumApp.default;
        }, function (_flarumExtend) {
            extend = _flarumExtend.extend;
        }, function (_flarumComponentsCommentPost) {
            CommentPost = _flarumComponentsCommentPost.default;
        }],
        execute: function () {

            app.initializers.add('davis-securehttps-forum', function () {
                extend(CommentPost.prototype, 'init', function () {
                    var proxy = app.forum.attribute('davis-securehttps.proxy');
                    if (proxy == true || proxy == undefined || proxy == '') {
                        var myRe = /<img src="http:\/\/(.+)" title="(.*)" alt="(.*)">/g;
                        var myArray;
                        while ((myArray = myRe.exec(this.props.post.contentHtml())) !== null) {
                            myArray[1] = encodeURIComponent(myArray[1]);
                            myArray[1] = myArray[1].replace('%2F', '%252F'); //Apache Support
                            this.props.post.contentHtml = m.prop(this.props.post.contentHtml().replace(myArray[0], '<img src="' + app.forum.attribute('apiUrl') + '/davis/securehttps/' + myArray[1] + '/" title="' + myArray[2] + '" alt="' + myArray[3] + '">'));
                        }
                    } else {
                        this.props.post.contentHtml = m.prop(
                        //I know this is a mess, this is the shortest way to achieve this. There's a TON of excaping that happened lol
                        this.props.post.contentHtml().replace(/<img src="http:\/\/(.+)" title="(.*)" alt="(.*)">/g, '<img onerror="$(this).next().empty().append(\'<blockquote style=&#92;&#39;background-color: #c0392b; color: white;&#92;&#39; class=&#92;&#39;uncited&#92;&#39;><div><p>' + app.translator.trans('davis-securehttps.forum.removed') + '| <a href=&#92;&#39;#&#92;&#39; style=&#92;&#39;color:white;&#92;&#39;onclick=&#92;&#39;window.open(&#92;&#34;http://$1&#92;&#34;,&#92;&#34;name&#92;&#34;,&#92;&#34;width=600,height=400&#92;&#34;)&#92;&#39;>' + app.translator.trans('davis-securehttps.forum.show') + '</a></p></div></blockquote>\');$(this).hide();" onload="$(this).next().empty();" class="securehttps-replaced" src="https://$1" title="$2" alt="$3"><span><br><br><i class="icon fa fa-spinner fa-spin fa-3x fa-fw"></i> Loading Image<br></span>'));
                    }
                });
            });
        }
    };
});