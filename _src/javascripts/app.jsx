 
// load css
require("../stylesheets/reset.css");
require("../stylesheets/base.css");
require("../stylesheets/app.css");

// load module
var Route = ReactRouter.Route;
var Body = require("./view/app_body.jsx");

console.log(AppEnv);
var App =  React.createClass({
    render: function(){
        return (
           <Body env={AppEnv} />
        )
    }
});

// Router
var routes = (
    <Route handler={App} >
        <Route name="app" path="/"  />
        <Route name="list" path="list/:type/:id"  />
    </Route>
);

// Render
ReactRouter.run( routes, function(Handler) {
    React.render( <Handler /> , document.getElementById('wrapper') );
});



