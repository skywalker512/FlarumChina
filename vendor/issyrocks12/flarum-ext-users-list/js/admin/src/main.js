import app from 'flarum/app';
import addUsersListPane from 'issyrocks12/users-list/addUsersListPane';

app.initializers.add('issyrocks12-users-list', app => {
    addUsersListPane();
});
