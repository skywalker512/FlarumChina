/* global $ */
/* global app */
import { extend } from 'flarum/extend'
import Post from 'flarum/components/Post'
import Page from 'flarum/components/Page'

app.initializers.add('sijad-details', app => {
  extend(Post.prototype, 'config', function (original, isInitialized) {
    if (isInitialized) return
    this.$('details').details()
  })
  extend(Page.prototype, 'config', function (original, isInitialized) {
    if (isInitialized) return
    if (!$.fn.details.support) $('#app').addClass('no-details')
  })
})
