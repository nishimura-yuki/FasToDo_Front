
var TaskBase = require("./../component/taskbase.js");

module.exports = React.createClass({
    mixins: [TaskBase],
    propTypes: {
        data: React.PropTypes.shape({
            taskid: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            date: React.PropTypes.string,
            folderid: React.PropTypes.string
        }),
        show: React.PropTypes.shape({
            type: React.PropTypes.string.isRequired,
            pos:  React.PropTypes.object
        }),
        sub: React.PropTypes.string,
        onSave: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired,
        onDone: React.PropTypes.func.isRequired,
        onDrag: React.PropTypes.func.isRequired,
        onEdit: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onDragOver: React.PropTypes.func.isRequired,
        onDragEnd: React.PropTypes.func.isRequired
    },
    _init_state: { 
        title:"",
        date:"",
        folder:"",
        error: null
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

    _onDragStart: function(event){
        console.log("drag start");
        var el = document.getElementById(this.getDOMId());
        el.className = el.className + " activetask_dragging";
        console.log(this.props.data);
        event.dataTransfer.setData("task", this.props.data);
        event.dataTransfer.setDragImage( el, 14, 14);
        this.props.onDrag(this.props.data.taskid);
    },
    _onDragEnd: function(event){
        console.log("drag end");
        this.props.onDragEnd();
    },
    _onOverBefore: function(event){
        this.props.onDragOver( this.props.data.taskid, "before" );
    },
    _onOverAfter: function(event){
        this.props.onDragOver( this.props.data.taskid, "after" );
    },

    getDOMId: function(){
        return "ACTIVE_" + this.props.data.taskid;
    },

    render: function(){
        var mainClass = "";
        var classname = "";
        var editHidden = "";
        var showHidden = "";
        var stayHidden = "";
        var errorTitle = "";
        var errorDate = "";
        var errorMesTitle = "";
        var errorMesDate = "";
        var errorMesFolder = "";
        var subInfo = "";
        var subHidden = "";
        var dropBefore = (<div key={"activetask-dropbefore_"+this.props.data.taskid}></div>);
        var dropAfter  = (<div key={"activetask-dropafter_"+this.props.data.taskid}></div>);
        if(this.props.show.type == "edit"){
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
            if(this.props.show.type == "drag"){
                mainClass = "activetask_dragging activetask_dragmotion"; 
            }else if(this.props.show.type == "drop"){
                mainClass = "activetask_dragmotion"; 
                dropBefore = (<div className="activetask-drop-before" onDragEnter={this._onOverBefore} 
                              key={"activetask-dropbefore_"+this.props.data.taskid}></div>);
                dropAfter = (<div className="activetask-drop-after" onDragEnter={this._onOverAfter} 
                              key={"activetask-dropafter_"+this.props.data.taskid}></div>);
            }else if(this.props.show.type == "stay"){
                stayHidden = "hidden"; 
            }
            classname = "activetask-unit_show";
            showHidden = "hidden";
        }

        if(this.props.sub == "date"){
            subInfo = this.props.data.date; 
        }else if( this.props.sub == "folder" ){
            var folders = this.props.folders;
            for(var i=0;i<folders.length; i++){
                if( this.props.data.folderid == folders[i].folderid ){
                    subInfo = folders[i].name; 
                    break;
                } 
            }
        }
        if(subInfo.length <= 0){
            subHidden = "hidden";
        }

        var folders = this.props.folders.map(function (f) {
            return (
                <option value={f.folderid}>{f.name}</option>
            );
        });

        return (
            <div className={"activetask "+ mainClass} id={this.getDOMId()} >
                {dropBefore}
                {dropAfter}
                <div className={"activetask_unit "+classname} >
                    <div className={'activetask_buttons ' + showHidden}>
                        <button className="task-save-button" type="button" onClick={this._onSave} name="save">{Messages.get("app").save}</button>
                        <button className="task-cancel-button" type="button" onClick={this._onCancel} name="cancel">{Messages.get("app").cancel}</button>
                    </div>  
                    <div className="activetask_drag">
                        <img className={editHidden + " " + stayHidden} src="/images/list-icon.png" alt="" 
                             onDragStart={this._onDragStart}
                             onDragEnd={this._onDragEnd}
                        /> 
                    </div>
                    <div className="activetask_info" onClick={this._onEdit} >
                        <div className="activetask-info_check" onClick={this._onDone}>
                            <img className={editHidden} src="/images/check-icon.png" alt="" />
                        </div>
                        <div className="activetask-info_title" >
                            <div className={"activetask-info-title_show "+editHidden}>
                                <p>{this.state.title}</p>
                                <div className={"activetask-info-title-show_sub "+subHidden}>
                                    {subInfo}
                                </div>
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

