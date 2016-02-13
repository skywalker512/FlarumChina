import User from 'flarum/core/models/User';
//import addTagsPermissionScope from 'flarum/tags/addTagsPermissionScope';
//import addTagPermission from 'flarum/tags/addTagPermission';
import addGuardianPane from 'hyn/guardian/addGuardianPane';

app.initializers.add('hyn-guardian', app => {
    //addTagsPermissionScope();
    //addTagPermission();
    addGuardianPane();
});
