 
// load css
require("../stylesheets/base.css");
require("../stylesheets/app.css");

// load module
var Route = ReactRouter.Route;
var Header = require("./view/app/header.jsx");
var Content = require("./view/app/content.jsx");

console.log(AppEnv);
var App =  React.createClass({
    render: function(){
        return (
            <div className="wrapper">
                <Header env={AppEnv} />
                <Content env={AppEnv} />
            </div> 
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



