
var ActiveTask = require("./../template/activetask.jsx");
var DoneTask = require("./../template/donetask.jsx");
var TaskBase = require("./../component/taskbase.js");

module.exports = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        drag: React.PropTypes.object.isRequired, 
        tasks: React.PropTypes.object.isRequired,
        folders: React.PropTypes.array.isRequired,
        days: React.PropTypes.object.isRequired,

        taskAdd: React.PropTypes.func.isRequired,
        taskUpdate: React.PropTypes.func.isRequired,
        taskDelete: React.PropTypes.func.isRequired,
        taskActive: React.PropTypes.func.isRequired,
        taskDone: React.PropTypes.func.isRequired,
        taskDrag: React.PropTypes.func.isRequired

    },
    _init_state: {
        editing_id:false
    },
    getInitialState: function () {
        return this._init_state;
    },
    componentWillReceiveProps: function(newProps){
        if( newProps.reset ){
            this.setState( this._init_state );
        }
    },

    _taskDrop: function(id , type){
        console.log("enter " + id + ":" + type);
    },

    _taskEdit: function(id){
        console.log("edit " + id);
        this.setState( {editing_id: id} );
    }, 
    _taskCancel: function(id){
        console.log("cancel " + id);
        this.setState( {editing_id: false} );        
    },

    createActiveTasks: function( ids ){

        var node = [];

        var taskMap = {};
        var dates = [];
        var dragid = false;
        var dragging_date = "";
        if(this.props.drag && this.props.drag.type == "task"){
            dragid = this.props.drag.id; 
        }
        for( var i=0; i<ids.length; i++ ){
             var t = this.props.tasks[ids[i].id];
             if( !t ) continue;
             if(t.status == "active"){
                if(t.taskid == dragid){
                    dragging_date = t.date; 
                }
                var dateList = taskMap[t.date];
                if(!dateList){
                    taskMap[t.date] = dateList = [];
                    dates.push( t.date );
                }
                dateList.push( t ); 
            }
         }
         dates.sort(); 
         for( var i=0;i<dates.length;i++ ){
               node.push(
                    <ActiveTaskList key={dates[i]} date={dates[i]} 
                        tasks={taskMap[dates[i]]}
                        folders={this.props.folders}
                        days={this.props.days}
                        drag={this.props.drag}
                        dragging={dragging_date == dates[i]}
                        edit={this.state.editing_id}
                        taskUpdate={this.props.taskUpdate}
                        taskDelete={this.props.taskDelete}
                        taskDone={this.props.taskDone}
                        taskActive={this.props.taskActive}
                        taskDrag={this.props.taskDrag}
                        taskDrop={this._taskDrop}
                        taskEdit={this._taskEdit}
                        taskCancel={this._taskCancel}
                    />
               ); 
         }
         return node;
    },
    /*
    createTasks: function( ids ){
        var tasks = {active:[], done:[]}; 

        var show_id = false;
        var show_type = {};
        if(this.state.dragging && this.state.dragging.type == "task"){
            show_id = this.state.dragging.id; 
            show_type = {type:"drag", 
                         pos:{x:this.state.dragging.pos.x,
                              y:this.state.dragging.pos.y
                         },
                         diff:{x:this.state.dragging.diff.x,
                               y:this.state.dragging.diff.y
                         }
            };
        }else{
            show_id = this.state.editing_id; 
            show_type = {type:"edit"};
        }
        for( var i=0; i<ids.length; i++ ){
            var t = this.state.data.tasks[ids[i].id];
            if( !t ) continue;
            switch(t.status){
                case "active":
                    tasks.active.push( this.createActiveTask(t , 
                                       t.taskid == show_id ? show_type : {type:"show"} 
                                       )
                                     );

                    break;
                case "done":
                    tasks.done.push( this.createDoneTask(t) );
                    break;
            }
        } 
        
        return tasks;

    },

    createDoneTask: function( task ){
        return (<DoneTask key={task.taskid} data={task} 
                    onDelete={this.taskDelete}
                    onActive={this.taskActive}
                />);
    },
*/
    render: function(){

        var title = "";
        var activetaskNode = [];

        var defaultDate = "";
        var defaultFolder = "";
        var notfound = true;
        if( this.props.state.type == "day" ){
            var d = this.props.days[this.props.state.id]; 
            if( d ){
                defaultDate = d.date; 
                title       = d.name; 
                notfound = false;
                activetaskNode = this.createActiveTasks( d.ids );
            }
        }else if( this.props.state.type == "folder"){
            var f = this.props.folders;
            for( var i=0;i<f.length; i++ ){
                if( this.props.state.id == f[i].folderid ){
                    defaultFolder = this.props.state.id;              
                    title = f[i].name;
                    activetaskNode = this.createActiveTasks( f[i].ids );
                    notfound = false;
                    break;
                }
            }
        }

        if(notfound){
            return (
                <div className="content-main">
                    <div className="content-main-inner">
                        <div className="menu-title" >
                            <p>{Messages.get("app").not_found}</p>
                        </div>
                    </div>
                </div>
            );
        }
        
        var addNode = (<div key="taskadd" ></div>);
        var doneNode = (<div key="donetasks"></div>);
        if(this.props.state.type != "day" || this.props.state.id != "past"){
            addNode =  ( <TaskAdd key="taskadd" 
                            folders={this.props.folders}
                            days={this.props.days}
                            defaultdate={defaultDate}
                            defaultfolder={defaultFolder}
                            add={this.props.taskAdd}
                        />
                      ); 
        }

        return (
            <div className="content-main">
                <div className="content-main-inner">
                    <div className="menu-title" >
                        <p>{this.props.state.name}</p>
                    </div>
                    {addNode} 
                    <div className="task-list">
                        <div className="task-list_active">
                            {activetaskNode}
                        </div>
                        <div className="task-separate-line" />
                        <div className="task-list_done">
                        </div>
                    </div>
                </div>
            </div>
        )
    }
});

var TaskAdd = React.createClass({
    mixins: [TaskBase],
    propTypes: {
        defaultdate:   React.PropTypes.string, 
        defaultfolder: React.PropTypes.string, 
        add: React.PropTypes.func.isRequired
    },
    _init_state: { 
        showtype: "show" ,
        title: "" ,
        date: "",
        folder :"",
        error : null,
    },
    getInitialState: function(){
        var state = this._init_state;
        state.date = this.props.defaultdate;
        state.folder = this.props.defaultfolder;
        return state;
    },
    componentWillReceiveProps: function(newProps){
        var state = this._init_state;
        state.date = newProps.defaultdate;
        state.folder = newProps.defaultfolder;
        this.setState(state); 
    },
    _onClickAdd: function(e){
        e.preventDefault();
        if(this.state.showtype != "add"){
            this.setState({showtype: "add"});
        } 
    },
    _onClickCancel: function(e){
        e.preventDefault();
        if(this.state.showtype != "show"){
            this.setState({showtype: "show", error:null});
        } 
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

        this.props.add(
            {title: title, 
             date: date,
             folderid: folder
            } 
        );
        
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
    render: function(){
        var classnameNew   = "task-add_new";
        var classnameInput = "task-add_input";
        var classnameClose = "task-add_close";
        var classnameInfo  = "task-add-input_info";
        var errorTitle = "";
        var errorDate = "";
        var errorMesTitle = "";
        var errorMesDate = "";
        var errorMesFolder = "";
        if(this.state.showtype != "add"){
            classnameClose += " hidden";
            classnameInput += " task-add-input_close";
            classnameInfo += " task-add-input-info_close";
        }else{
            classnameNew += " hidden";
            classnameInfo += " task-add-input-info_open";
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
        }
        
        var folders = this.props.folders.map(function (f) {
            return (
                <option value={f.folderid}>{f.name}</option>
            );
        });

        return (
            <div className="task-add">
                <div className={classnameNew} >
                    <a href="#" onClick={this._onClickAdd} >
                        <img src="/images/add-icon.png" alt=""/>
                        <span>{Messages.get("app").add}</span>
                    </a>
                </div>
                <div className={classnameInput} >
                    <div className={classnameClose} >
                        <a href="#" onClick={this._onClickCancel} >
                            <img src="/images/remove-icon.png" alt=""/>
                        </a>
                    </div>
                    <div className={classnameInfo} >
                        <div className="task-add-input-info_title" > 
                            <input className={"task-title-input "+errorTitle} type="text" name="title" 
                                onChange={this._onChangeTitle} 
                                value={this.state.title} 
                            />
                        </div>
                        <div className="task-add-input-info_date" >
                            <input className={"task-date-input "+errorDate} type="text" name="date" 
                                onChange={this._onChangeDate}
                                placeholder="yyyy/mm/dd" value={this.state.date} 
                            />
                        </div>
                        <div className="task-add-input-info_folder" >
                            <select className="task-folder-select" name="folder" ref="folder" 
                                onChange={this._onChangeFolder} value={this.state.folder} 
                            >
                                <option value="" >{Messages.get("app").empty_select}</option>
                                {folders}
                            </select>
                        </div>
                        <div className="task-add-input-info_buttons">
                            <button className="task-save-button" type="button" name="save" onClick={this._onSave} >{Messages.get("app").save}</button>
                        </div>            
                    </div>
                    <div className="both task-add-input_error">
                            <p>{errorMesTitle}</p>
                            <p>{errorMesDate}</p>
                            <p>{errorMesFolder}</p>
                    </div>
                </div>
            </div>
        )
    }
});

var ActiveTaskList = React.createClass({
    propTypes: {
        date:  React.PropTypes.string.isRequired, 
        tasks: React.PropTypes.array.isRequired ,
        folders: React.PropTypes.array.isRequired,
        days: React.PropTypes.object.isRequired,
        drag: React.PropTypes.object ,
        edit: React.PropTypes.string ,
        dragging: React.PropTypes.bool,

        taskUpdate: React.PropTypes.func.isRequired,
        taskDelete: React.PropTypes.func.isRequired,
        taskActive: React.PropTypes.func.isRequired,
        taskDone: React.PropTypes.func.isRequired,
        taskDrag: React.PropTypes.func.isRequired,
        taskDrop: React.PropTypes.func.isRequired,
        taskEdit: React.PropTypes.func.isRequired,
        taskCancel: React.PropTypes.func.isRequired

    },

    createActiveTask: function( task , show){
        return (<ActiveTask key={task.taskid} data={task} 
                    show={show}
                    onSave={this.props.taskUpdate}
                    onDelete={this.props.taskDelete}
                    onDone={this.props.taskDone}
                    onDrag={this.props.taskDrag}
                    onEdit={this.props.taskEdit}
                    onCancel={this.props.taskCancel}
                    onDrop={this.props.taskDrop}
                    folders={this.props.folders}
                    days={this.props.days}
                />);
    },

    render:function(){
     
        var classDrag = "";
        var taskNode = []; 
        var show_id = false;
        var target_show_type = {};
        var default_show_type = {type:"show"};
        if(this.props.dragging){
            show_id = this.props.drag.id; 
            target_show_type = {type:"drag", 
                         pos:{x:this.props.drag.pos.x,
                              y:this.props.drag.pos.y
                         }
            };
            default_show_type = {type:"drop"};
            classDrag = "task-list-active-date-list_drag";
        }else{
            show_id = this.props.edit; 
            target_show_type = {type:"edit"};
        }
        var tasks = this.props.tasks;
        for( var i=0; i<tasks.length; i++ ){
            var show = default_show_type;
            if( tasks[i].taskid == show_id ){
                show = target_show_type; 
            }
            taskNode.push( this.createActiveTask( tasks[i] , show ) );
        } 
        
        return (
            <div className="task-list-active_date" >
                <div className="task-list-active-date_title">
                    {"-- " + this.props.date + " --"}
                </div>
                <div className={"task-list-active-date_list "+classDrag}>
                    {taskNode}
                </div>
            </div>
        );
    
    } 

});
