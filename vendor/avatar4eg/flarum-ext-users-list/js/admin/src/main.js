import app from 'flarum/app';
import addUsersListPane from 'avatar4eg/users-list/addUsersListPane';

app.initializers.add('avatar4eg-users-list', app => {
    addUsersListPane();
});
