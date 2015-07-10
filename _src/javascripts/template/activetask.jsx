
var TaskBase = require("./../component/taskbase.js");

module.exports = React.createClass({
    mixins: [TaskBase],
    propTypes: {
        onSave: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        showtype: React.PropTypes.string
    },
    _init_state: { 
        title:"",
        date:"",
        folder:"",
        error: null,
        drag: false
    },
    getInitialState: function(){
        return this._init_state;
    }, 
    componentWillMount: function(){
        var state = this._init_state;
        state.title = this.props.data.title;
        state.date = this.props.data.date;
        state.folder = this.props.data.folderid;
        this.setState( state ); 
    },
    componentWillReceiveProps: function(newProps){
        var state = this._init_state;
        state.title  = newProps.data.title;
        state.date   = newProps.data.date;
        state.folder = newProps.data.folderid;
        this.setState( state ); 
    },
    _onEdit: function(event){
        if(event.target.tagName.toLowerCase() == "p"){
            this.props.onEdit(this.props.data.taskid);
        }
    },
    _onDone: function(){
        this.props.onDone(this.props.data.taskid);
    },
    _onSave: function(){
        var title  = this.state.title ? this.state.title.trim()  : "";
        var date   = this.state.date  ? this.state.date.trim()   : "";
        var folder = this.state.folder? this.state.folder.trim() : null;
        var error = this.validate(title, date, folder);
        if(error){
            this.setState(error);
            return; 
        }
        this.props.onSave(this.props.data.taskid, 
                          {
                            title: title, 
                            date: date,
                            folderid: folder
                          }                         
                         );
    }, 
    _onCancel: function(){
        this.props.onCancel(this.props.data.taskid);
    },

    _onDelete: function(){
        this.props.onDelete(this.props.data.taskid);
    },

    _onChangeTitle:function(event){
        this.setState({ title: event.target.value });
    },
    _onChangeDate:function(event){
        this.setState({ date: event.target.value });
    },
    _onChangeFolder:function(event){
        this.setState({ folder: event.target.value });
    },

    _onDragClick: function(event){
        if(this.props.showtype != "edit"){
            this.setState({ drag:true }); 
        }
    },
    _onDrag: function(event){
        //this.props.onDrag(this.props.data.taskid);
        event.preventDefault();
        console.log("drag start??");
        console.log(event);
    },

    render: function(){
        var mainClass = "";
        var classname = "";
        var editHidden = "";
        var showHidden = "";
        var errorTitle = "";
        var errorDate = "";
        var errorMesTitle = "";
        var errorMesDate = "";
        var errorMesFolder = "";
        if(this.props.showtype == "edit"){
            classname = "activetask-unit_edit"; 
            editHidden = "hidden";
            if(this.state.error){
                if(this.state.error.title){
                    errorTitle = "p_input-error";
                    errorMesTitle = this.state.error.title;
                } 
                if(this.state.error.date){
                    errorDate = "p_input-error";
                    errorMesDate = this.state.error.date;
                }
                if(this.state.error.folder){
                    errorMesFolder = this.state.error.folder;
                }
            }
        }else{
            if(this.state.drag){
                mainClass = "activetask_dragging"; 
            }
            classname = "activetask-unit_show";
            showHidden = "hidden";
        }

        var folders = this.props.folders.map(function (f) {
            return (
                <option value={f.folderid}>{f.name}</option>
            );
        });

        return (
            <div className={"activetask "+ mainClass} >
                <div className={"activetask_unit "+classname} >
                    <div className={'activetask_buttons ' + showHidden}>
                        <button className="task-save-button" type="button" onClick={this._onSave} name="save">{Messages.get("app").save}</button>
                        <button className="task-cancel-button" type="button" onClick={this._onCancel} name="cancel">{Messages.get("app").cancel}</button>
                    </div>  
                    <div className="activetask_drag">
                        <img className={editHidden} src="/images/list-icon.png" alt="" 
                             onDragStart={this._onDrag}
                             onClick={this._onDragClick}
                        /> 
                    </div>
                    <div className="activetask_info" onClick={this._onEdit} >
                        <div className="activetask-info_check" onClick={this._onDone}>
                            <img className={editHidden} src="/images/check-icon.png" alt="" />
                        </div>
                        <div className="activetask-info_title" >
                            <div className={"activetask-info-title_show "+editHidden}>
                                <p>{this.state.title}</p>
                            </div>
                            <div className={"activetask-info_input " + showHidden} >
                                <div className="activetask-info-input_title" >
                                    <input className={"task-title-input "+errorTitle} type="text" 
                                           onChange={this._onChangeTitle} value={this.state.title}
                                    />
                                </div>
                                <div className="activetask-info-input_date" >
                                    <input className={"task-date-input "+errorDate} type="text" name="date" 
                                        onChange={this._onChangeDate}
                                        placeholder="yyyy/mm/dd" value={this.state.date} 
                                    />
                                </div>
                                <div className="activetask-info-input_folder" >
                                    <select className="task-folder-select" name="folder" ref="folder" 
                                        onChange={this._onChangeFolder} value={this.state.folder} 
                                    >
                                        <option value="" >{Messages.get("app").empty_select}</option>
                                        {folders}
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={'activetask_bin ' + editHidden} >
                        <img src="/images/bin-icon.png" alt="" onClick={this._onDelete}/>       
                    </div>
                </div>
                <div className="activetask_error">
                    <p>{errorMesTitle}</p>
                    <p>{errorMesDate}</p>
                    <p>{errorMesFolder}</p>
                </div>
            </div>
        ) 
    }
});

