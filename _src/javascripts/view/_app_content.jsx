
/*
var tasks = { 
    "01": { id: "01", title: "shopping", date:"2015/06/22", status: "active",orderid:0, folderid:"F001" },
    "02": { id: "02", title: "training", date:"2015/06/22", status: "active",orderid:1, folderid:"F002" },
    "03": { id: "03", title: "work", date:"2015/06/22", status: "active",orderid:2, folderid:null },
    "04": { id: "04", title: "playing piano", date:"2015/06/22", status: "done",orderid:3, folderid:null  },
    "05": { id: "05", title: "reading books", date:"2015/06/22",   status: "active",orderid:4, folderid:"F001"  },
    "06": { id: "06", title: "dinner with girlfriend", date:"2015/06/22",  status: "active",orderid:5, folderid:"F002"  },
    "07": { id: "07", title: "reporting", date:"2015/06/22", status: "done",orderid:6, folderid:null  },
    "08": { id: "08", title: "study English", date:"2015/06/22",  status: "done",orderid:7, folderid:"F001"  },
    "09": { id: "09", title: "study English", date:"2015/06/22", status: "done",orderid:8, folderid:"F002"  },
    "10": { id: "10", title: "hogehoge あああああ 適当な文字列を最大限入力してレイアウトくずれのテストを実施 ", date:"2015/07/01", status: "active",orderid:9, folderid:"F002"  },
};
var AppData = {
    days: { 
        today: {
                name:"Today", count: 30,
                ids: [ {id:"01",orderid:0} , {id:"05",orderid:1} , {id:"07", orderid:2} ]
        },
        tomorrow: {
                name:"Tomorrow" , count: 2,
                ids: [ {id:"02",orderid:0} , {id:"03",orderid:1} , {id:"09", orderid:2} ]
        },
        anytime: {
                name:"Anytime" , count: 30,
                ids: [ {id:"01",orderid:0} , {id:"05",orderid:1} , {id:"07", orderid:2} ]
        })
        past: {
                name: "Past", count: 30,
                ids: [ {id:"01",orderid:0} , {id:"05",orderid:1} , {id:"07", orderid:2} ,
                       {id:"02",orderid:3} , {id:"03",orderid:4} , {id:"04", orderid:5} ,
                       {id:"06", orderid:6} 
                     ]
        }
    },
    folders: [ 
        { id:"F001", name:"testddddddddddddddddddddddddddddddddddddddddddddddddddddddddd", count: 0 , orderid:1,
            ids: [ {id:"05",orderid:0} , {id:"01",orderid:1} , {id:"08", orderid:2} ]
        },
        { id:"F002", name:"test2", count: 40 , orderid:1,
            ids: [ {id:"09",orderid:0} , {id:"06",orderid:1} , {id:"02", orderid:2}, {id:"10", orderid:3}  ]
        }       
    ],
    tasks: tasks
};
*/

var Promise = require("promise");

var ContentMenu = require("./_app_content_menu.jsx");
var ContentMain = require("./_app_content_main.jsx");

// Content
module.exports = React.createClass({
    mixins: [ ReactRouter.State ] ,
    propTypes: {
        user: React.PropTypes.object.isRequired,
        dates: React.PropTypes.object.isRequired
    },
    _init_data:{
        days: {
            today:   { name:"" , count:0, ids:[] } ,
            tomorrow:{ name:"" , count:0, ids:[] } ,
            anytime: { name:"" , count:0, ids:[] } ,
            past:    { name:"" , count:0, ids:[] } 
        },
        folders: [] ,
        tasks: {} 
    },
    _init_state: {
        data: this._init_data ,
        loaded: false, loading:false,
        reset: false, 
        taskdragging: null 
    },
    getInitialState: function () {
        return this._init_state;
    },
    componentDidMount: function () {
        this.loadContentData();
    },
    componentWillReceiveProps: function(newProps){
        var state = {reset: true};
        if( newProps.user != this.props.user ||
            newProps.dates != this.props.dates){
            this.loadContentData();
        }
        this.setState( state );
    },

    loadTask: function(){
        console.log("load task");
        var _this = this;
        return new Promise(function (resolve, reject) {
            console.log("request task");
            Request.get( Define.api_host + "/api/task")
                   .query({"condition[schedule.greaterequal]": encodeURI(_this.props.dates.past),
                           "condition[schedule.lessequal]": encodeURI(_this.props.dates.future)})
                   .end(function(err, res){
                        console.log(err);
                        console.log(res.body);
                        resolve(res.body);
                    });
        })
    },
    loadFolder: function(){
        console.log("load folder");
        return new Promise(function (resolve, reject) {
            Request.get( Define.api_host + "/api/folder")
                   .end(function(err, res){
                        console.log(err);
                        console.log(res.body);
                        resolve(res.body);
                   });
        })
    },
    loadContentData: function(){
        console.log("content load");
        if(this.state.loading) return;
        this.setState({data:this._init_data, loading: true, loaded: false});
        var _this = this;
        Promise.all([ this.loadTask(), this.loadFolder() ])
               .then( function(res){

                    var tasks = res[0];
                    var folders = res[1];
                    var appData = _this._init_data;
                    appData.days.today.name    = Messages.get("app").today;
                    appData.days.tomorrow.name = Messages.get("app").tomorrow;
                    appData.days.anytime.name  = Messages.get("app").anytime;
                    appData.days.past.name     = Messages.get("app").past;
                    appData.days.today.date    = _this.props.dates.today;
                    appData.days.tomorrow.date = _this.props.dates.tomorrow;
                    appData.days.anytime.date  = _this.props.dates.dat;

                    //フォルダ情報整理
                    var mapOrder = {};
                    for( var i=0;i<folders.length; i++ ){
                        var f = folders[i];
                        mapOrder[f.folderid] = f.ids;
                        _this.refreshFolderAdd( appData.folders, f );
                    }
                    
                    console.log(appData.folders);

                    //タスク情報整理
                    for( var i=0; i<tasks.length; i++){
                        console.log(tasks[i]);
                        _this.refreshTaskAdd(appData, tasks[i] );
                    }

                    //フォルダのカウントを更新
                    for( var i=0;i<appData.folders.length; i++ ){
                        var f = appData.folders[i];
                        var ids = mapOrder[f.folderid];
                        for( var j=0; j<ids.length; j++ ){
                            _this.refreshFolderOrderAdd( f,
                                                     {taskid:  ids[j].id ,
                                                      orderid: ids[j].orderid
                                                     },
                                                     appData.tasks);
                        } 
                    } 

                    console.log("finish loadContent");
                    _this.refreshOrder( appData );
                    _this.setState( {data:appData , loaded:true, loading:false } ); 

               })
               .catch( function(err){
                    //読み込みエラーを通知 
               });
    },

    /* data event */
    taskAdd: function(data){
        console.log(data);
        var _this = this;
        Request.post( Define.api_host + "/api/task")
               .send({ title: data.title, schedule:data.date, folderid:data.folderid })
               .end(function(err, res){
                    console.log(res.body);
                    var resData = res.body;
                    var appData = _this.state.data;
                    _this.refreshTaskAdd( appData, resData.task );
                    if(data.folderid){
                        var folder = null;
                        for(var i=0;i<appData.folders.length;i++){
                             if(data.folderid == appData.folders[i].folderid){
                                _this.refreshFolderOrderAdd( appData.folders[i],
                                                          {taskid: resData.task.taskid ,
                                                           orderid: resData.folderorderid
                                                          },
                                                          appData.tasks);
                                break;
                             }
                        }
                    }
                    
                    _this.setState( {data:appData} );

                });
    },
    taskUpdate: function(id, data){
        console.log("task update: " + id);
        console.log(data);
        var task = this.state.data.tasks[id];
        if(!task){
            return; 
        }
        var taskData = {};
        var folderData = null; 
        for(key in data){
            if(task[key] != data[key]){
                if(key == "folderid"){
                    folderData = {folderid: data[key]}; 
                }else if(key == "date"){
                    taskData.schedule = data[key];
                }else{
                    taskData[key] = data[key]; 
                }
            } 
        } 

        var _this = this;
        Request.put( Define.api_host + "/api/task/" + id)
               .send({ task: taskData, folder:folderData })
               .end(function(err, res){
                    console.log("update after");
                    console.log(res.body);
                    var resTask = res.body.task;
                    var appData = _this.state.data;
                    var newFolder = null;
                    console.log(folderData);
                    if(folderData){ //フォルダに変更があった
                        if(folderData.folderid){
                            var folder = _this.getFolderInfo( appData.folders, folderData.folderid );
                            if(folder){
                                newFolder = {folder: folder,
                                             folderorder:{ taskid: task.taskid, orderid: res.body.folderorderid}
                                            };
                            }
                        }
                    }else{
                        if(task.folderid){
                            var folder = _this.getFolderInfo( appData.folders, task.folderid );
                            if(folder){
                                var ids = folder.ids;
                                for(var i=0;i<ids.length;i++){
                                    if(ids[i].id == task.taskid){
                                        newFolder = {folder: folder,
                                                    folderorder:{ taskid:ids[i].id, orderid:ids[i].orderid }
                                                    };
                                        break;
                                    } 
                                }
                            }
                        } 
                    }
                    _this.refreshTaskUpdate( appData, resTask, newFolder );
                    _this.setState( {data:appData, editing_id:false} );
                });
    },
    taskDelete: function(id){
        console.log("task delete: " + id);
        var task = this.state.data.tasks[id];
        if(!task){
            return; 
        }
        var _this = this;
        Request.del( Define.api_host + "/api/task/" + id)
               .end(function(err, res){
                    console.log(err);
                    console.log(res.body);
                });

        var appData = this.state.data;
        this.refreshTaskDelete( appData, task );
        this.refreshRemoveTaskFromFolder( appData.folders, task );
        this.setState( {data:appData} );

    },
    taskDone:function(id){
        console.log("done: " + id);
        var task = this.state.data.tasks[id];
        if(!task || task.status == "done") return;
        var _this = this;
        Request.put( Define.api_host + "/api/task/done/" + id)
               .end(function(err, res){
                    console.log(err);
                    console.log(res.body);
               });

        var appData = this.state.data;
        this.refreshTaskDone(appData, id);
        this.setState( {data:appData} );

    }, 
    taskActive:function(id){
        console.log("active: " + id);
        var task = this.state.data.tasks[id];
        if(!task || task.status == "active") return;
        var _this = this;
        Request.put( Define.api_host + "/api/task/active/" + id)
               .end(function(err, res){
                    console.log(err);
                    console.log(res.body);
               });   
        
        var appData = this.state.data;
        this.refreshTaskActive(appData, id);
        this.setState( {data:appData} );

    },
    taskOrderForDate:function(id, beforeid){
        var task = this.state.data.tasks[id];
        if(!task) return;
        if( beforeid != "top" ){
            var taskDate = task.date;
            task = this.state.data.tasks[beforeid];
            if(!task || task.date != taskDate) return;
        }

        Request.put( Define.api_host + "/api/task/order/" + id)
               .send({ type: "date", before:beforeid })
               .end(function(err, res){
                    console.log(err);
                    console.log(res.body);
        });     

        var appData = this.state.data;
        this.refreshTaskOrderForDate(appData, id, beforeid);
        this.setState( {data:appData, taskdragging:null});

    },
    taskOrderForFolder:function(id, beforeid){
        var task = this.state.data.tasks[id];
        if(!task) return;
        if( beforeid != "top" ){
            var taskFolder = task.folderid;
            task = this.state.data.tasks[beforeid];
            if(!task || task.folderid != taskFolder) return;
        }
        Request.put( Define.api_host + "/api/task/order/" + id)
               .send({ type: "folder", before:beforeid })
               .end(function(err, res){
                    console.log(err);
                    console.log(res.body);
        });     

        var appData = this.state.data;
        this.refreshTaskOrderForFolder(appData, id, beforeid);
        this.setState( {data:appData, taskdragging:null});

    },
    folderAdd: function(data){
        console.log(data);
        var _this = this;
        Request.post( Define.api_host + "/api/folder")
               .send({ name: data.name })
               .end(function(err, res){
                    console.log(res.body);
                    var appData = _this.state.data;
                    _this.refreshFolderAdd( appData.folders , res.body );
                    _this.setState({data: appData});
                });   
    },
    folderUpdate: function(id, data){
        console.log("folder update: " + id); 
        var folder = this.getFolderInfo( this.state.data.folders, id );
        if(!folder) return;
        var _this = this;
        Request.put( Define.api_host + "/api/folder/" + id)
               .send({ name: data.name })
               .end(function(err, res){
                    console.log(res.body);
                    var appData = _this.state.data;
                    _this.refreshFolderUpdate( appData, res.body );
                    _this.setState( {data:appData} );
                });   
    },
    folderDelete: function(id){
        console.log("folder delete: " + id);
        var folder = this.getFolderInfo( this.state.data.folders, id );
        if(!folder) return;
        var _this = this;
        Request.del( Define.api_host + "/api/folder/" + id)
               .end(function(err, res){
                    console.log(res.body);
                    var appData = _this.state.data;
                    _this.refreshFolderDelete( appData, id );
                    _this.setState( {data:appData} );
                });   
    },
    /* data event **/

    /* data refresh */
    refreshTaskAdd:function( appData, task ){
        appData.tasks[task.taskid] = {
            taskid: task.taskid,
            title: task.title,
            date: task.date,
            status: task.status,
            orderid: task.orderid
        }
        console.log(task.date);
        var d = this.getDateInfo( appData.days, task.date );
        d.day.ids.push({id:task.taskid, orderid:task.orderid });
        d.date.count++;
        if(task.status == "active"){
            d.day.count++; 
        }
    },

    refreshTaskUpdate:function(appData, task, newFolder ){
        var prevTask = appData.tasks[task.taskid];
        if(prevTask.date != task.date){
            this.refreshTaskDelete( appData, prevTask );
            this.refreshTaskAdd( appData, task );
        }else{
            appData.tasks[task.taskid] = {
                taskid: task.taskid,
                title: task.title,
                date: task.date,
                status: task.status,
                orderid: task.orderid
            }
        }
        console.log(newFolder);
        this.refreshRemoveTaskFromFolder( appData.folders, prevTask );
        if(newFolder){
            this.refreshFolderOrderAdd(newFolder.folder, newFolder.folderorder, appData.tasks);
        }
    },
    refreshTaskDelete:function( appData, task ){
        //tasks から削除
        appData.tasks[task.taskid] = null;
        //関連している日付及びフォルダから削除
        var d = this.getDateInfo( appData.days, task.date );
        console.log("days id");
        if(task.status == "active"){
            d.day.count--;
        }
        d.date.count--;
        console.log(d.day.ids);
        this.removeIds( d.day.ids, task.taskid );
        console.log(d.day.ids);
    },
    refreshTaskDone:function(appData, taskid){
        var task = appData.tasks[taskid];
        if(!task || task.status == "done") return;
        //カウントを調整、フォルダからは自動削除（仕様）
        var d = this.getDateInfo( appData.days, task.date );
        d.day.count--;
        this.refreshRemoveTaskFromFolder( appData.folders, task );
        task.status = "done";
        task.folderid = null;
    },
    refreshTaskActive:function(appData, taskid){
        var task = appData.tasks[taskid];
        if(!task || task.status == "active") return;
        //カウントを調整
        var d = this.getDateInfo( appData.days, task.date );
        d.day.count++;
        task.status = "active";
        task.folderid = null;   
    },
    refreshFolderAdd:function( folders, folder ){
        folder.count = 0;
        folder.ids = [];
        folders.push( folder );
    },
    refreshFolderOrderAdd:function(folder, folderOrder, tasks){
        folder.ids.push({
                        id: folderOrder.taskid,
                        orderid: folderOrder.orderid
                    }); 
        var task = tasks[folderOrder.taskid];
        if(task){
            task.folderid = folder.folderid; 
            if(task.status == "active"){
                folder.count++;
            }
        }
    },
    refreshRemoveTaskFromFolder: function( folders, task ){
        var folder = this.getFolderInfo( folders, task.folderid );
        if( folder ){
            if(task.status == "active"){
                folder.count--;
            }
            console.log(folder.ids);
            this.removeIds( folder.ids, task.taskid );
            console.log(folder.ids);
        }
    },
    refreshFolderUpdate: function( appData, folder ){
        var folders = appData.folders;
        for( var i=0; i<folders.length; i++ ){
            if(folders[i].folderid == folder.folderid){
                folder.count = folders[i].count;
                folder.ids = folders[i].ids;
                folders[i] = folder;
                break;
            } 
        }
    },
    refreshFolderDelete: function(appData, folderid){
        Object.keys(appData.tasks).forEach(function(key) {
            var task = this[key];
            console.log(task);
            if(task.folderid == folderid){
                task.folderid = null; 
            }
        }, appData.tasks);
        var indx = -1;
        for( var i=0; i<appData.folders.length; i++ ){
            if(appData.folders[i].folderid == folderid){
                indx = i;
                break;
            } 
        }
        appData.folders.splice(indx, 1); 
    },
    refreshTaskOrderForDate: function(appData, id, beforeid){
        var task = appData.tasks[id];
        var beforeOrder = -1;
        if(beforeid != "top"){
            beforeOrder = appData.tasks[beforeid].orderid;
        }
        var dateInfo = this.getDateInfo(appData.days, task.date);
        var ids = dateInfo.day.ids;
        console.log(ids);
        for(var i=0;i<ids.length; i++){
            var t = appData.tasks[ids[i].id];
            if(t.taskid == task.taskid){
                ids[i].orderid = (beforeOrder+1); 
                t.orderid = ids[i].orderid;
            }else{
                if(t.date == task.date){
                    if(ids[i].orderid > beforeOrder){
                        ids[i].orderid++;
                        t.orderid = ids[i].orderid;
                    } 
                }
            }
        }

        console.log(ids);
        this.refreshDateOrder( appData.days );
    },
    refreshTaskOrderForFolder: function(appData, id, beforeid){
        var task = appData.tasks[id];
        var folder = this.getFolderInfo(appData.folders, task.folderid);
        var beforeOrder = -1;
        var ids = folder.ids;
        if(beforeid != "top"){
            for(var i=0;i<ids.length;i++){
                if(ids[i].id == beforeid){
                    beforeOrder = ids[i].orderid;
                    break;
                } 
            }
        }
        console.log(ids);
        for(var i=0;i<ids.length; i++){
            var t = appData.tasks[ids[i].id];
            if(t.taskid == task.taskid){
                ids[i].orderid = (beforeOrder+1); 
            }else{
                if(ids[i].orderid > beforeOrder){
                    ids[i].orderid++;
                } 
            }
        }
        console.log(ids);
        this.refreshOrderFolderOrder( appData.folders );
    },

    refreshOrder:function( appData ){
        this.refreshDateOrder( appData.days );
        this.refreshFolderOrder( appData.folders );
        this.refreshOrderFolderOrder( appData.folders );
    },
    refreshDateOrder: function(days){
        days.today.ids.sort( this.sort );
        days.tomorrow.ids.sort( this.sort );
        days.past.ids.sort( this.sort );
        days.anytime.ids.sort( this.sort );
    },
    refreshFolderOrder: function(folders){
        folders.sort( this.sort ); 
    },
    refreshOrderFolderOrder: function(folders){
        for(var i=0;i<folders.length;i++){
            folders[i].ids.sort( this.sort ); 
        } 
    },

    /* data refresh **/
    sort: function(a, b){
        if(a.orderid < b.orderid) return -1;
        if(a.orderid > b.orderid) return 1;
        return 0;
    },

    getDateInfo:function( days, date ){
        var day= {};
        if( date == this.props.dates.today){
            day = days.today; 
        }else if( date == this.props.dates.tomorrow ){
            day = days.tomorrow; 
        }else if( date < this.props.dates.today ){
            day = days.past; 
        }else{
            day = days.anytime; 
        }
        var dat = days[date];
        if(!dat){
            days[date] = { count:0 }; 
            dat = days[date];
        }
        return { day:day, date:dat };
    },
    getFolderInfo:function(folders, folderid){
        for(var i=0;i<folders.length; i++){
            if(folders[i].folderid == folderid){
                return folders[i];
            } 
        } 
        return null;
    },
    removeIds:function( ids, id ){
        var indx = -1;
        for( var i=0;i<ids.length;i++ ){
            if(ids[i].id == id){
                indx = i; 
                break;
            } 
        }
        if( indx >= 0 ){
            console.log(ids);
            var orderid = ids[indx].orderid;
            ids.splice( indx, 1 );
            ids.map( function( i ){
                if(i.orderid > orderid){
                    i.orderid--; 
                } 
            });
            console.log(ids);
        }
    },

    taskDrag:function(id){
        console.log("task drag: "+ id);
        this.setState( {taskdragging:id });
    },
    taskDrop:function(){
        console.log("task drop ");
        this.setState( {taskdragging:null });
    },

    render: function(){
        if( !this.state.loaded ){
            return (
                <div className="content loading">
                </div>
            );
        }else{ 
            var state = {type:"day", id:"today"};
            var params = this.getParams();
            if( params.type ) state.type = params.type;
            if( params.id ) state.id = params.id;

            return (
                <div className="content" >
                    <ContentMenu state={state}
                        reset={this.state.reset}
                        drag={this.state.taskdragging}
                        days={this.state.data.days}
                        folders={this.state.data.folders}
                        folderAdd={this.folderAdd}
                        folderEdit={this.folderUpdate}
                        folderDelete={this.folderDelete}
                    />
                    <ContentMain state={state}
                        reset={this.state.reset}
                        drag={this.state.taskdragging}
                        days={this.state.data.days}
                        folders={this.state.data.folders}
                        tasks={this.state.data.tasks}
                        taskAdd={this.taskAdd}
                        taskUpdate={this.taskUpdate}
                        taskDelete={this.taskDelete}
                        taskActive={this.taskActive}
                        taskDone={this.taskDone}
                        taskOrderForDate={this.taskOrderForDate}
                        taskOrderForFolder={this.taskOrderForFolder}
                        taskDrag={this.taskDrag}
                        taskDrop={this.taskDrop}
                    />
                </div>        
            ) 
        }
    }
});




