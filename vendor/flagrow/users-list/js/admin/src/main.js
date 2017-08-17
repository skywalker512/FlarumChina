import app from 'flarum/app';
import addUsersListPane from 'flagrow/users-list/addUsersListPane';

app.initializers.add('flagrow-users-list', app => {
    addUsersListPane();
});
