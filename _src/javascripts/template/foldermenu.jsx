
var Link = ReactRouter.Link;

module.exports = React.createClass({
    propTypes: {
        data: React.PropTypes.object.isRequired,
        show: React.PropTypes.string.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired,
        onDragEnd: React.PropTypes.func.isRequired,
        onDragOver: React.PropTypes.func.isRequired
    },

    _onEdit:function(){
        this.props.onEdit(this.props.data.folderid); 
    },
    _onDragStart:function(event){
        console.log("onDragStart");
        var el = document.getElementById(this.props.data.folderid);
        el.className = el.className + " folder-menu_draggin";
        event.dataTransfer.dropEffect = 'move';
        event.dataTransfer.setDragImage( el, 14, 14);
        this.props.onDrag(this.props.data.folderid);
    },
    _onDragOverBefore:function(event){
        console.log("onDragOverBefore");
        event.dataTransfer.dropEffect = 'move';
        this.props.onDragOver(this.props.data.folderid, "before");
    },
    _onDragOverAfter:function(event){
        console.log("onDragOverAfter");
        event.dataTransfer.dropEffect = 'move';
        this.props.onDragOver(this.props.data.folderid, "after");
    },
    _onDragEnd:function(event){
        console.log("onDragEnd");
        event.preventDefault();
        this.props.onDragEnd();
    },

    getBeforeDropID: function(){
        return "folder-menu_dropbefore_" + this.props.data.folderid;
    },
    getAfterDropID: function(){
        return "folder-menu_dropafter_" + this.props.data.folderid;
    },
    
    render: function(){

        var count = this.props.data.count;
        if( count <= 0 ){
            count = ""; 
        }else if( count >= Define.number_of_limit.task_per_folder ){
            count = "+" + (Define.number_of_limit.task_per_folder - 1); 
        }

        var editHidden = "";
        var stayHidden = "";
        var mainClass = "";
        var editIconClass = "";
        var dropBefore = (<div key={this.getBeforeDropID()}></div>);
        var dropAfter  = (<div key={this.getAfterDropID()}></div>);
        if(this.props.show == "edit"){
            editIconClass = "folder-menu-section-icon-settings_editing";
            editHidden = "hidden";
        }else if(this.props.show == "stay"){
            stayHidden = "hidden";
        }else if(this.props.show == "drag"){
            mainClass = "folder-menu_dragging"; 
        }else if(this.props.show == "drop"){
            console.log("drop???");
            dropBefore = (<div className="folder-menu_dropbefore" onDragEnter={this._onDragOverBefore} 
                               key={this.getBeforeDropID()}></div>);
            dropAfter  = (<div className="folder-menu_dropafter" onDragEnter={this._onDragOverAfter} 
                               key={this.getAfterDropID()}></div>);
        }

        return (
            <div className="relative" >
                {dropBefore}
                {dropAfter}
                <div className={"folder-menu "+mainClass} id={this.props.data.folderid}>
                    <div className="folder-menu_sort" >
                        <img className={editHidden +" "+ stayHidden} src="/images/list-icon.png" alt="" 
                            onDragEnd={this._onDragEnd}
                            onDragStart={this._onDragStart}
                        />
                    </div>
                    <div className="folder-menu_section">
                        <div className="folder-menu-section_link">
                            <Link to="folder" params={{id: this.props.data.folderid}}>
                                <img src="/images/folder-icon.png" alt=""/>
                                <div className="folder-menu-section-link_name">
                                    {this.props.data.name}
                                </div>
                            </Link>
                        </div>
                        <div className="folder-menu-section_icon">
                            <div className={"folder-menu-section-icon_settings "+editIconClass}>
                                <img src="/images/config-icon16.png" alt="" onClick={this._onEdit}/>
                            </div>
                            <div className="folder-menu-section-icon_count">
                                {count}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
   }
});

