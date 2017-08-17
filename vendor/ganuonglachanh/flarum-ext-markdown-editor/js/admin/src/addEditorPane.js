import {extend} from "flarum/extend";
import AdminNav from "flarum/components/AdminNav";
import AdminLinkButton from "flarum/components/AdminLinkButton";
import EditorPage from "ganuonglachanh/mdeditor/components/EditorPage";

export default function () {
    // create the route
    app.routes['ganuonglachanh-mdeditor'] = {path: '/ganuonglachanh/mdeditor', component: EditorPage.component()};

    // bind the route we created to the three dots settings button
    app.extensionSettings['ganuonglachanh-mdeditor'] = () => m.route(app.route('ganuonglachanh-mdeditor'));

    extend(AdminNav.prototype, 'items', items => {
        // add the Editor tab to the admin navigation menu
        items.add('ganuonglachanh-mdeditor', AdminLinkButton.component({
            href: app.route('ganuonglachanh-mdeditor'),
            icon: 'pencil',
            children: app.translator.trans('ganuonglachanh-mdeditor.admin.help_texts.title'),
            description: app.translator.trans('ganuonglachanh-mdeditor.admin.help_texts.description')
        }));
    });
}
