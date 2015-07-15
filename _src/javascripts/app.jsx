 
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
var ContentMainRouteDate     = require("./routes/_app_content_main_date.jsx");
var ContentMainRouteFolder   = require("./routes/_app_content_main_folder.jsx");
var ContentMainRoutePast     = require("./routes/_app_content_main_past.jsx");
var ContentMainRouteKeyword  = require("./routes/_app_content_main_keyword.jsx");
var routes = (
    <Route name="app" path="/" handler={App} >
        <Route name="folder" path="folder/:id" handler={ContentMainRouteFolder}/>
        <Route name="past" path="date/past" handler={ContentMainRoutePast} />
        <Route name="date" path="date/:id" handler={ContentMainRouteDate} />
        <Route name="keyword" path="keyword" handler={ContentMainRouteKeyword} />
        <Route path="*" handler={ContentMainRouteDate} />
    </Route>
);

// Render
ReactRouter.run( routes, function(Handler) {
    React.render( <Handler /> , document.getElementById('wrapper') );
});



