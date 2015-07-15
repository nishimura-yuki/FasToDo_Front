
var ActiveTask = require("./../template/activetask.jsx");
var DoneTask = require("./../template/donetask.jsx");
var TaskAdd = require("./../template/taskadd.jsx");
var TaskListBase = require("./../component/tasklistbase.js");
var ContentMainRoute = require("./_app_content_main_route.jsx");

module.exports = React.createClass({
    mixins: [ReactRouter.State,ContentMainRoute  ] ,

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
        console.log("render date");
        var id = "today";
        var params = this.getParams();
        if( params.id ) id = params.id;

        var d = this.props.days[id]; 
        if( !d ) return this.getNotfoundNode(); 
        
        return (
            <div>
                <div className="menu-title" >
                    <p>{d.name}</p>
                </div> 
                <TaskList  date={d} 
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
                />                   
            </div>
        );
    }
});

var TaskList = React.createClass({
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
            <div className="task-list-active_date" key={"tasklistfordate-active-"+date} >
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
            <div className="task-list-active_date" key={"tasklistfordate-done-"+date} >
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
                    <TaskAdd key="task-add"
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

