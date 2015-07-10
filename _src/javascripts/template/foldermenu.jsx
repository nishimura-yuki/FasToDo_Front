
var Link = ReactRouter.Link;

module.exports = React.createClass({
    propTypes: {
        count: React.PropTypes.number.isRequired, 
        id: React.PropTypes.string.isRequired ,
        name: React.PropTypes.string.isRequired ,
        editing: React.PropTypes.bool ,
        onEdit: React.PropTypes.func.isRequired

    },
    
    _onEdit:function(){
        this.props.onEdit(this.props.id); 
    },

    render: function(){
        var c = this.props.count;
        if( c <= 0 ){
            c = ""; 
        }else if( c >= 100 ){
            c = "+99"; 
        }
        var editing = "";
        if(this.props.editing){
            editing = "folder-menu-section-icon-settings_editing";
        }
        return (
            <div className="folder-menu" id={this.props.id}>
                <div className="folder-menu_sort" >
                    <img src="/images/list-icon.png" alt=""/>
                </div>
                <div className="folder-menu_section">
                    <div className="folder-menu-section_link">
                        <Link to="list" params={{type: "folder", id: this.props.id}}>
                            <img src="/images/folder-icon.png" alt=""/>
                            <div className="folder-menu-section-link_name">
                                {this.props.name}
                            </div>
                        </Link>
                    </div>
                    <div className="folder-menu-section_icon">
                        <div className={"folder-menu-section-icon_settings "+editing}>
                            <img src="/images/config-icon16.png" alt="" onClick={this._onEdit}/>
                        </div>
                        <div className="folder-menu-section-icon_count">
                            {c}
                        </div>
                    </div>
                </div>
            </div>
        )
   }
});

