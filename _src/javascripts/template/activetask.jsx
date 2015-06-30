
module.exports = React.createClass({
    _init_state: {
        showtype: "show" 
    },
    getInitialState: function(){
        return this._init_state;
    }, 
    propTypes: {
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        }),
        onSave: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired,
        onEdit: React.PropTypes.func,
        onCancel: React.PropTypes.func,
    },
    componentWillReceiveProps: function(newProps){
        var s = this._init_state;
        if(newProps.showtype == "edit"){
            s.showtype = "edit"; 
        }
        this.setState( s );
    }, 
    _onEdit: function(){
        this.props.onEdit(this.props.data.id);
    },
    _onDone: function(){
        this.props.onDone(this.props.data.id);
    },
    _onSave: function(){
        this.props.onSave(this.props.data.id);
    },
    _onCancel: function(){
        this.props.onSave(this.props.data.id);
    },
    _onDrag: function(){
        this.props.onDrag(this.props.data.id);
    },
    _onDelete: function(){
        this.props.onDelete(this.props.data.id);
    },
    render: function(){
        var classname = "active-task";
        var editHidden = "";
        var showHidden = "";
        if(this.state.showtype == "edit"){
            classname += " active-task-edit"; 
            editHidden = "hidden";
        }else{
            classname += " active-task-normal";
            showHidden = "hidden";
        }
        return (
            <div className={classname} >
                <div className="activetask-buttons {showHidden}">
                    <button className="task-save-button" type="button" onClick={this._onSave} name="save">Save</button>
                    <button className="task-cancel-button" type="button" onClick={this._onCancel} name="cancel">Cancel</button>
                </div>  
                <div className="activetask-drag">
                    <img className={editHidden} src="images/list-icon.png" alt="" /> 
                </div>
                <div className="activetask-info" onClick={this._onEdit} >
                    <div className="activetask-check" onClick={this._onDone}>
                        <img src="images/check-icon.png" alt="" />
                    </div>
                    <div className="activetask-title activetask-title-show {editHidden}">
                        <p>{this.props.data.title}</p>
                    </div>
                    <div className="activetask-title activetask-title-input {showHidden}">
                        <input className="task-title-input" type="text" value={this.props.data.title} />
                    </div>
                </div>
                <div className="activetask-bin {editHidden}" >
                    <img src="images/bin-icon.png" alt="" />       
                </div>
            </div>
        ) 
    }
});

/*
var ActiveTask_Buttons = React.createClass({
    render: function(){
        var classname = "activetask-buttons";
        if(this.props.showtype != "edit"){
            classname += " hidden";
        }
        return (
            <div className={classname}>
                <button className="task-save-button" type="button" name="save">Save</button>
                <button className="task-cancel-button" type="button" name="cancel">Cancel</button>
            </div>    
        )    
    }
});

var ActiveTask_Drag = React.createClass({
    
    render: function(){
        var show = "";
        if(this.props.showtype == "edit"){
            show = "hidden";
        }
        return (
            <div className="activetask-drag">
                <img className={show} src="images/list-icon.png" alt="" /> 
            </div>
        ) 
    }    
});

var ActiveTask_Info = React.createClass({
    propTypes: {
        data: React.PropTypes.shape({
            id: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired
        }),
        showtype: React.PropTypes.string.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired
    },

    clickDone: function(){
        this.props.onDone();
    },
    clickInfo: function(){
        this.props.onEdit();
    },
    render: function(){
        var title_class = "activetask-title activetask-title-show"; 
        var input_class = "activetask-title activetask-title-input";
        if(this.props.showtype == "edit"){
            title_class += " hidden";
        }else{
            input_class += " hidden";
        }
        return (
            <div className="activetask-info" onClick={this.clickInfo} >
                <div className="activetask-check" onClick={this.clickDone}>
                    <img src="images/check-icon.png" alt="" />
                </div>
                <div className={title_class}>
                    <p>{this.props.data.title}</p>
                </div>
                <div className={input_class}>
                    <input className="task-title-input" type="text" value={this.props.data.title} />
                </div>
            </div>
        )
    }
});

var ActiveTask_Bin = React.createClass({
    render: function(){
        var classname = "activetask-bin";
        if(this.props.showtype == "edit"){
            classname += " hidden";
        }
        return (
            <div className={classname}>
                 <img src="images/bin-icon.png" alt="" />       
            </div>
        )    
    }
});

*/
