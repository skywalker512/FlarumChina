import {extend} from "flarum/extend";
import app from "flarum/app";
import PermissionGrid from "flarum/components/PermissionGrid";
import addEditorPane from "ganuonglachanh/mdeditor/addEditorPane";

app.initializers.add('ganuonglachanh-mdeditor', app => {
    // add the admin pane
    addEditorPane();
});
