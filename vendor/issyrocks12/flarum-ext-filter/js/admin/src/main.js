import app from 'flarum/app';
import addWordPane from 'issyrocks12/filter/addWordPane';

app.initializers.add('issyrocks12-filter', app => {
    addWordPane();
});
