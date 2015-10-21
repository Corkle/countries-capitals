app.factory('PageTitle', function() {
   var title = 'Countries & Capitals';
    return {
        get: function() {return title;},
        set: function(newTitle) {title = newTitle;}
    };
});