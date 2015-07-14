
var ActiveTask = require("./../template/activetask.jsx");
var DoneTask = require("./../template/donetask.jsx");
var TaskAdd = require("./../template/taskadd.jsx");
var TaskListBase = require("./../component/tasklistbase.js");

module.exports = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        drag: React.PropTypes.string.isRequired, 
        tasks: React.PropTypes.object.isRequired,
        folders: React.PropTypes.array.isRequired,
        days: React.PropTypes.object.isRequired,

        taskAdd: React.PropTypes.func.isRequired,
        taskUpdate: React.PropTypes.func.isRequired,
        taskDelete: React.PropTypes.func.isRequired,
        taskActive: React.PropTypes.func.isRequired,
        taskDone: React.PropTypes.func.isRequired,
        taskOrderForDate: React.PropTypes.func.isRequired,
        taskOrderForFolder: React.PropTypes.func.isRequired,
        taskDrag: React.PropTypes.func.isRequired,
        taskDrop: React.PropTypes.func.isRequired

    },

    componentWillReceiveProps: function(newProps){
        /*
        if( newProps.reset ){
            this.setState( this._init_state );
        }
        */
    },

    getTaskList:function( ids ){
        var resList = [];
        for( var i=0; i<ids.length; i++ ){
             var t = this.props.tasks[ids[i].id];
             if( !t ) continue;
             resList.push( t );
        }
        return resList; 
    },

    render: function(){

        var title = "";
        var activetaskNode = [];

        var defaultDate = "";
        var defaultFolder = "";
        var notfound = true;
        var listNode = (<div></div>);
        if( this.props.state.type == "day" ){
            if( this.props.state.id == "past" ){
                title    = this.props.days.past.name; 
                notfound = false;
                listNode = (<TaskListForPast 
                                tasks={ this.getTaskList( this.props.days.past.ids ) }
                                folders={this.props.folders}
                                days={this.props.days}
                                drag={this.props.drag}
                                taskUpdate={this.props.taskUpdate}
                                taskDelete={this.props.taskDelete}
                                taskDone={this.props.taskDone}
                                taskOrder={this.props.taskOrderForDate}
                                taskActive={this.props.taskActive}
                                taskDrag={this.props.taskDrag}
                                taskDrop={this.props.taskDrop}
                            />);
            }else{
                var d = this.props.days[this.props.state.id]; 
                if( d ){
                    title    = d.name; 
                    notfound = false;
                    listNode = (<TaskListForDate  date={d} 
                                    tasks={ this.getTaskList( d.ids ) }
                                    folders={this.props.folders}
                                    days={this.props.days}
                                    drag={this.props.drag}
                                    taskAdd={this.props.taskAdd}
                                    taskUpdate={this.props.taskUpdate}
                                    taskDelete={this.props.taskDelete}
                                    taskDone={this.props.taskDone}
                                    taskOrder={this.props.taskOrderForDate}
                                    taskActive={this.props.taskActive}
                                    taskDrag={this.props.taskDrag}
                                    taskDrop={this.props.taskDrop}
                                />);
                }
            }
            
        }else if( this.props.state.type == "folder"){
            var f = this.props.folders;
            for( var i=0;i<f.length; i++ ){
                if( this.props.state.id == f[i].folderid ){
                    title = f[i].name;
                    notfound = false;
                    listNode = (<TaskListForFolder folder={f[i]} 
                                    tasks={ this.getTaskList( f[i].ids ) }
                                    folders={this.props.folders}
                                    days={this.props.days}
                                    drag={this.props.drag}
                                    taskAdd={this.props.taskAdd}
                                    taskUpdate={this.props.taskUpdate}
                                    taskDelete={this.props.taskDelete}
                                    taskDone={this.props.taskDone}
                                    taskOrder={this.props.taskOrderForFolder}
                                    taskActive={this.props.taskActive}
                                    taskDrag={this.props.taskDrag}
                                    taskDrop={this.props.taskDrop}
                                />);
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

        return (
            <div className="content-main">
                <div className="content-main-inner">
                    <div className="menu-title" >
                        <p>{title}</p>
                    </div>
                    {listNode}
               </div>
            </div>
        )
    }
});

var TaskListForDate = React.createClass({
    mixins: [TaskListBase] ,
    propTypes: {
        date: React.PropTypes.object.isRequired ,
        taskAdd: React.PropTypes.func.isRequired,
    },
    _init_state: { 
        editing_id: null 
    },
    getInitialState: function(){
        return this._init_state; 
    },

    _taskEdit: function(id){
        this.setState( {editing_id: id} );
    }, 
    _taskCancel: function(id){
        this.setState( {editing_id: null} );        
    },
    _taskUpdate: function(id, data){
        this.props.taskUpdate(id, data);
        this.setState( {editing_id: null} );
    },

    createTaskList: function( ){

        var resNode = {active: [], done: []};

        var activetaskMap = {};
        var donetaskMap = {};
        var activeDates = [];
        var doneDates = [];
        
        var dragid = this.props.drag;

        var activedragDate = "";
        var dateSingleCheck = null;
        var single = true;
        for( var i=0; i<this.state.tasks.length; i++ ){
            var t = this.state.tasks[i];
            if(t.status == "active"){
                if(t.taskid == dragid){
                    activedragDate = t.date; 
                }
                var dateList = activetaskMap[t.date];
                if(!dateList){
                    activetaskMap[t.date] = dateList = [];
                    activeDates.push( t.date );
                }
                dateList.push( t ); 
                if(dateSingleCheck != null && dateSingleCheck != t.date){
                    single = false;
                }
                dateSingleCheck = t.date;
            }else if(t.status == "done"){
                var dateList = donetaskMap[t.date];
                if(!dateList){
                    donetaskMap[t.date] = dateList = [];
                    doneDates.push( t.date );
                }
                dateList.push( t );            
                if(dateSingleCheck != null && dateSingleCheck != t.date){
                    single = false;
                }
                dateSingleCheck = t.date;
            }
        }
        activeDates.sort(); 
        doneDates.sort(); 

        for( var i=0;i<activeDates.length;i++ ){
            var d = null;
            var dat = activeDates[i];
            if(activedragDate == dat){
                d = dragid; 
            }
            resNode.active.push( this.createActiveTaskList( activetaskMap[dat], dat, d ) );
         }

         for( var i=0;i<doneDates.length;i++ ){
            var dat = doneDates[i];
            resNode.done.push( this.createDoneTaskList( donetaskMap[dat], dat , single) );
         }
         return resNode;

    },

    createActiveTaskList: function( tasks, date, dragid){
        var classDrag = "";
        var taskNode = []; 
        var show_id = null;
        var target_show_type = {type:"edit"};
        var default_show_type = {type:"show"};
        var onDropFunc = this._preventDefault;
        var onOverFunc = this._preventDefault;
        if(dragid){
            show_id = dragid; 
            target_show_type = {type:"drag"};
            default_show_type = {type:"drop"};
            classDrag = "task-list-active-date-list_drag";
            onDropFunc = this._onDrop;
            onOverFunc = this._onDragOver;
        }else if(this.state.editing_id){
            default_show_type = {type:"stay"};
            show_id = this.state.editing_id; 
        }
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
                    {"-- " + date + " --"}
                </div>
                <div className={"task-list-active-date_list "+classDrag} 
                     onDrop={onDropFunc}
                     onDragOver={onOverFunc}>
                    {taskNode}
                </div>
            </div>
        );
    },

    createActiveTask: function( task, show ){
        return (<ActiveTask key={task.taskid} data={task} 
                    show={show}
                    folders={this.props.folders}
                    days={this.props.days}
                    sub="folder"
                    onSave={this._taskUpdate}
                    onDelete={this.props.taskDelete}
                    onDone={this.props.taskDone}
                    onDrag={this.props.taskDrag}
                    onEdit={this._taskEdit}
                    onCancel={this._taskCancel}
                    onDragOver={this._onTaskDragOver}
                    onDragEnd={this._onTaskDragEnd}
                />);
    },

    createDoneTaskList: function( tasks, date, single){

        var taskNode = []; 
        var singleHidden = single ? "hidden" : ""; 
        for( var i=0; i<tasks.length; i++ ){
            taskNode.push( this.createDoneTask( tasks[i] ) );
        } 
        return (
            <div className="task-list-active_date" >
                <div className={"task-list-active-date_title "+singleHidden}>
                    {"-- " + date + " --"}
                </div>
                <div className="task-list-active-date_list" >
                    {taskNode}
                </div>
            </div>
        );

    },
    createDoneTask: function( task ){
         return (<DoneTask key={task.taskid} data={task} 
                    onDelete={this.props.taskDelete}
                    onActive={this.props.taskActive}
                />);   
    },

    render:function(){

        var taskList = this.createTaskList();
        return ( <div>
                    <TaskAdd
                        folders={this.props.folders}
                        days={this.props.days}
                        defaultdate={this.props.date.date}
                        defaultfolder=""
                        add={this.props.taskAdd}
                    />
                    <div className="task-list">
                        <div className="task-list_active">
                            {taskList.active}
                        </div>
                        <div className="task-separate-line" />
                        <div className="task-list_done">
                            {taskList.done}
                        </div>
                    </div>
                 </div>
               );

    } 

});

var TaskListForPast = React.createClass({
    mixins: [TaskListBase] ,
    _init_state: { 
        editing_id: null 
    },
    getInitialState: function(){
        return this._init_state; 
    },

    _taskEdit: function(id){
        this.setState( {editing_id: id} );
    }, 
    _taskCancel: function(id){
        this.setState( {editing_id: null} );        
    },
    _taskUpdate: function(id, data){
        this.props.taskUpdate(id, data);
        this.setState( {editing_id: null} );
    },

    createTaskList: function( ){

        var resNode = [];

        var activetaskMap = {};
        var activeDates = [];
        var dragid = this.props.drag;

        var activedragDate = "";
        for( var i=0; i<this.state.tasks.length; i++ ){
            var t = this.state.tasks[i];
            if(t.status == "active"){
                if(t.taskid == dragid){
                    activedragDate = t.date; 
                }
                var dateList = activetaskMap[t.date];
                if(!dateList){
                    activetaskMap[t.date] = dateList = [];
                    activeDates.push( t.date );
                }
                dateList.push( t ); 
            }
        }
        activeDates.sort(); 
        for( var i=0;i<activeDates.length;i++ ){
            var d = null;
            var dat = activeDates[i];
            if(activedragDate == dat){
                d = dragid; 
            }
            resNode.push( this.createActiveTaskList( activetaskMap[dat], dat, d ) );
         }
         return resNode;
    },

    createActiveTaskList: function( tasks, date, dragid){
        var classDrag = "";
        var taskNode = []; 
        var show_id = null;
        var target_show_type = {type:"edit"};
        var default_show_type = {type:"show"};
        var onDropFunc = this._preventDefault;
        var onOverFunc = this._preventDefault;
        if(dragid){
            show_id = dragid; 
            target_show_type = {type:"drag"};
            default_show_type = {type:"drop"};
            classDrag = "task-list-active-date-list_drag";
            onDropFunc = this._onDrop;
            onOverFunc = this._onDragOver;
        }else if(this.state.editing_id){
            default_show_type = {type:"stay"};
            show_id = this.state.editing_id; 
        }
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
                    {"-- " + date + " --"}
                </div>
                <div className={"task-list-active-date_list "+classDrag} 
                     onDrop={onDropFunc}
                     onDragOver={onOverFunc}>
                    {taskNode}
                </div>
            </div>
        );
    },

    createActiveTask: function( task, show ){
        return (<ActiveTask key={task.taskid} data={task} 
                    show={show}
                    folders={this.props.folders}
                    days={this.props.days}
                    sub="folder"
                    onSave={this._taskUpdate}
                    onDelete={this.props.taskDelete}
                    onDone={this.props.taskDone}
                    onDrag={this.props.taskDrag}
                    onEdit={this._taskEdit}
                    onCancel={this._taskCancel}
                    onDragOver={this._onTaskDragOver}
                    onDragEnd={this._onTaskDragEnd}
                />);
    },

    render:function(){

        var taskList = this.createTaskList();

        return ( <div>
                    <div className="task-list">
                        <div className="task-list_active">
                            {taskList}
                        </div>
                    </div>
                 </div>
               );

    } 

});

var TaskListForFolder = React.createClass({
    mixins: [TaskListBase] ,
    propTypes: {
        folder: React.PropTypes.object.isRequired ,
        taskAdd: React.PropTypes.func.isRequired,
    },
    _init_state: { 
        editing_id: null 
    },
    getInitialState: function(){
        return this._init_state; 
    },
    _taskEdit: function(id){
        this.setState( {editing_id: id} );
    }, 
    _taskCancel: function(id){
        this.setState( {editing_id: null} );        
    },
    _taskUpdate: function(id, data){
        this.props.taskUpdate(id, data);
        this.setState( {editing_id: null} );
    },

    createTaskList: function(){
        var taskNode = []; 
        var show_id = null;
        var target_show_type = {type:"edit"};
        var default_show_type = {type:"show"};
        if(this.props.drag){
            show_id = this.props.drag; 
            target_show_type = {type:"drag"};
            default_show_type = {type:"drop"};
        }else if(this.state.editing_id){
            default_show_type = {type:"stay"};
            show_id = this.state.editing_id; 
        }

        var tasks = this.state.tasks;
        for( var i=0; i<tasks.length; i++ ){
            var show = default_show_type;
            if( tasks[i].taskid == show_id ){
                show = target_show_type; 
            }
            taskNode.push( this.createActiveTask( tasks[i] , show ) );
        } 
        return taskNode;
    },

    createActiveTask: function( task, show ){
        return (<ActiveTask key={task.taskid} data={task} 
                    show={show}
                    folders={this.props.folders}
                    days={this.props.days}
                    sub="date"
                    onSave={this._taskUpdate}
                    onDelete={this.props.taskDelete}
                    onDone={this.props.taskDone}
                    onDrag={this.props.taskDrag}
                    onEdit={this._taskEdit}
                    onCancel={this._taskCancel}
                    onDragOver={this._onTaskDragOver}
                    onDragEnd={this._onTaskDragEnd}
                />);
    },

    render:function(){

        var taskList = this.createTaskList();
        var classDrag = "";
        if(this.props.drag){
            classDrag = "task-list-active-date-list_drag"; 
        }

        return ( <div>
                    <TaskAdd
                        folders={this.props.folders}
                        days={this.props.days}
                        defaultdate=""
                        defaultfolder={this.props.folder.folderid}
                        add={this.props.taskAdd}
                    />
                    <div className="task-list">
                        <div className="task-list_active">
                            <div>
                                <div className={"task-list-active-date_list "+classDrag} 
                                    onDrop={this._onDrop}
                                    onDragOver={this._onDragOver}>
                                    {taskList}
                                </div>
                            </div>
                        </div>
                    </div>
                 </div>
               );

    } 

});
