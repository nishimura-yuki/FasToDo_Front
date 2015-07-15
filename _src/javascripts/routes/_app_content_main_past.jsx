
var ActiveTask = require("./../template/activetask.jsx");
var TaskListBase = require("./../component/tasklistbase.js");
var ContentMainRoute = require("./_app_content_main_route.jsx");

module.exports = React.createClass({
    mixins: [ContentMainRoute] ,

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
        return (
            <div>
                <div className="menu-title" >
                    <p>{this.props.days.past.name}</p>
                </div> 
                <TaskList 
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
                />
            </div>
        );
    }
});

var TaskList = React.createClass({
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
            <div className="task-list-active_date" key={"tasklistforpast-"+date} >
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

