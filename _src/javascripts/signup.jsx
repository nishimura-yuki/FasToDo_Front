// load css
require("../stylesheets/reset.css");
require("../stylesheets/base.css");
require("../stylesheets/signup.css");

// load module
var Route = ReactRouter.Route;
var Body = require("./view/signup_body.jsx");

var App =  React.createClass({
    render: function(){
        return ( <Body /> );
    }
});

// Router
var routes = (
    <Route path="*" handler={App} />
);

// Render
ReactRouter.run( routes, function(Handler) {
    React.render( <Handler /> , document.getElementById('wrapper') );
});


