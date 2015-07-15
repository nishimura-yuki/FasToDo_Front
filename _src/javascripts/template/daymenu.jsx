
var Link = ReactRouter.Link;

module.exports = React.createClass({
    propTypes: {
        count: React.PropTypes.number.isRequired, 
        link: React.PropTypes.string.isRequired ,
        id: React.PropTypes.string.isRequired ,
        image: React.PropTypes.string.isRequired ,
        name: React.PropTypes.string.isRequired ,
        lastline: React.PropTypes.bool
    },
    render: function(){
        var classname = "";
        var c = this.props.count;
        if(this.props.lastline){
            classname = "day-menu_last";
        }
        if( c <= 0 ){
            c = ""; 
        }else if( c >= 100 ){
            c = "+99"; 
        }
        return (
            <div className={"day-menu "+classname}>
                <div className="day-menu_link">
                    <Link to={this.props.link} params={{id: this.props.id}}>
                        <img src={this.props.image} alt=""/>
                        <div className="day-menu-link_name">
                            {this.props.name}
                        </div>
                    </Link>
                </div>
                <div className="day-menu_count">
                    {c}
                </div>
            </div>
        )
   }
});

