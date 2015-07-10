
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
        },
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

//=========================

var Promise = require("promise");
var sprintf = require("sprintf");
var DateCalculator = require("./../common/DateCalculator.js");
var Validator = require("./../common/Validator.js");

var ActiveTask = require("./../template/activetask.jsx");
var DoneTask = require("./../template/donetask.jsx");
var DayMenu = require("./../template/daymenu.jsx");
var FolderMenu = require("./../template/foldermenu.jsx");
var TaskBase = require("./../component/taskbase.js");
var Popup = require("./../component/popup.jsx");
var Language = require("./../template/language.jsx");
var Timezone = require("./../template/timezone.jsx");

module.exports = React.createClass({
    propTypes: {
        env: React.PropTypes.object.isRequired 
    },
    _init_state: { 
        user: null ,
        dates: {} ,
        popup: {}
    },
    getInitialState: function(){
        var state = this._init_state;
        state.user = this.props.env.user;
        state.dates = this.getDates( state.user.timezone.offset );
        return state;
    }, 
    getDates: function( offset ){
        var dateCalc = new DateCalculator( offset );
        var dates = {};
        dates.today    = dateCalc.getToday();
        dates.tomorrow = dateCalc.getTomorrow();
        dates.dat      = dateCalc.getDAT();
        dates.future   = dateCalc.getDate( 7 );
        dates.past     = dateCalc.getDate( -7 )
        console.log(dates);
        return dates;
    },

    changeDate: function(){
        console.log("change!!!"); 
        this.setState({dates: this.getDates(this.state.user.timezone.offset)});
    },
    updateUserSettings:function(user){
        console.log("change user");
        var dates = this.getDates(user.timezone.offset);
        this.setState({user:user, dates:dates});
    },

    render:function(){
        Messages.setLanguage(this.state.user.language);
        return (
            <div className="wrapper" >
                <Header user={this.state.user} 
                        changeDate={this.changeDate} 
                        updateUserSettings={this.updateUserSettings}
                />
                <Content user={this.state.user} 
                         dates={this.state.dates} 
                />
            </div>
        ); 
    }
});

// Header
var Header = React.createClass({
    propTypes: {
        user: React.PropTypes.object.isRequired ,
        changeDate: React.PropTypes.func.isRequired,
        updateUserSettings: React.PropTypes.func.isRequired
    },
    _init_state:{
        show_settings: "close" 
    },
    getInitialState: function(){
        return this._init_state; 
    } , 
    componentWillReceiveProps:function(newProps){
        this.setState( this._init_state ); 
    },
    _changeDate: function(){
        this.props.changeDate();
    },
    _onSaveSettings:function( data ){
        console.log("change user");
        console.log(data);
        if( this.props.user.language == data.language &&
            this.props.user.timezone.name == data.timezone){
            this._onSettingsIcon();
            return; 
        }
        
        var _this = this;
        Request.put( Define.api_host + "/api/user/settings")
               .send({ language: data.language, timezone:data.timezone })
               .end(function(err, res){
                    console.log(err);
                    console.log(res);
                    _this.props.updateUserSettings( res.body );
               });

    },
    _onSettingsIcon:function(){
        if(this.state.show_settings == "show"){
            this.setState( {show_settings: "close"} );
        }else{
            this.setState( {show_settings: "show"} );
        } 
    },
    _onLogout:function(){
    
    },

    render: function() {
        var iconClass = "";
        if(this.state.show_settings == "show"){
            iconClass = "header-info-settings_open"; 
        }
        return (
          <div >
              <div className="header">
                <Clock changeDate={this._changeDate} timezone_offset={this.props.user.timezone.offset} />
                <div className="header_info">
                    <div className="header-info_unit1">
                        <div className="header-info-unit1_search">
                            <img src="/images/search-icon.png" alt=""/>
                            <input className="search-text-input" type="text" name="search" />
                        </div>
                        <div className="header-info-unit1_userid">
                            {this.props.user.userid}
                        </div>
                    </div>
                    <div className={"header-info_settings "+ iconClass}>
                        <img id="header-settings-icon" src="/images/config-icon.png" alt="" onClick={this._onSettingsIcon} />
                    </div>
                </div> 
              </div>
              <SettingsPopup
                 parent="header-settings-icon"
                 onSave={this._onSaveSettings}
                 onCancel={this._onSettingsIcon}
                 onLogout={this._onLogout}
                 user={this.props.user}
                 show={this.state.show_settings}
              />
          </div>
        )
    }
});

var Clock = React.createClass({
    propTypes: {
        timezone_offset: React.PropTypes.number.isRequired ,
        changeDate: React.PropTypes.func.isRequired
    },
    getInitialState: function(){
        this.dateCalc = new DateCalculator(this.props.timezone_offset);
        var dateTime = this.dateCalc.getCurrentDatetime(); 
        return { 
            time: this.calcRestOfTime( dateTime ) ,
            currentDate: DateCalculator.getDateFormat( dateTime )
        };
    } , 
    componentDidMount: function(){
        this.timer = setInterval(this.tick, 1000);
    } ,
    componentWillUnmount: function(){
        clearInterval(this.timer);
    } ,
    componentWillReceiveProps:function(newProps){
        if(newProps.timezone_offset != this.props.timezone_offset){
            this.dateCalc = new DateCalculator(newProps.timezone_offset);
            var dateTime = this.dateCalc.getCurrentDatetime(); 
            this.setState( {
                time: this.calcRestOfTime( dateTime ) ,
                currentDate: DateCalculator.getDateFormat( dateTime )
            });
        }
   },
    tick: function(){
        var dateTime = this.dateCalc.getCurrentDatetime(); 
        var currentDate = DateCalculator.getDateFormat( dateTime );
        var nextState = {"time": this.calcRestOfTime( dateTime )};
        if( this.state.currentDate != currentDate ){
            this.props.changeDate();
            nextState[ "currentDate" ] = currentDate;
        }
        this.setState( nextState );
    },
    calcRestOfTime: function( dateTime ){
        var diffHour = ("0" + (23 - dateTime.getHours())).slice(-2);
        var diffMin = ("0" + (59 - dateTime.getMinutes())).slice(-2);
        var diffSec = ("0" + (59 - dateTime.getSeconds())).slice(-2);
        return diffHour+":"+diffMin+":"+diffSec;
    },
    render: function(){
        return (
            <div className="clock">
                <p>{this.state.time}</p>
            </div>
        )
    }
});

var SettingsPopup = React.createClass({
    propTypes: {
        parent: React.PropTypes.string.isRequired,
        user: React.PropTypes.object.isRequired,
        show: React.PropTypes.string.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onLogout: React.PropTypes.func.isRequired
    },
    _init_state: {
        language: "",
        timezone: ""
    },
    getInitialState: function () {
        var state = this._init_state;
        state.language = this.props.user.language;
        state.timezone = this.props.user.timezone.name;
        return this._init_state;
    },    
    componentWillReceiveProps:function(newProps){
        var state = this._init_state;
        state.language = newProps.user.language;
        state.timezone = newProps.user.timezone.name;
        this.setState(state); 
    },
    _onSave:function(){
        this.props.onSave( {
            language: this.state.language,
            timezone: this.state.timezone
        });
    },
    _onClose:function(){
        this.props.onCancel(); 
    },

    _onChangeLanguage:function(event){
        console.log("lang");
        this.setState({ language: event.target.value });
    },
    _onChangeTimezone:function(event){
        console.log("tz");
        this.setState({ timezone: event.target.value });
    },

    render: function(){
        console.log(this.props.parent);
        var element = document.getElementById(this.props.parent);
        var baseTop = 0;
        var baseLeft = 0;
        var height = 0;
        var trans = "none";
        if(element){
            var rect = element.getBoundingClientRect();
            baseTop = rect.top + window.pageYOffset;
            baseLeft = rect.left + window.pageXOffset;
        }
        if(this.props.show == "show"){
            height = 225;
            trans = "height 0.2s";
        }

        var content = (
                    <div className="header-popup-settings" >
                        <div className="header-popup-settings_title">
                            <p>{Messages.get("app").settings}</p>
                        </div>
                        <div className="header-popup-settings_input">
                            <p>{Messages.get("app").language}</p>
                            
                            <Language 
                                  classname="p_input_select c_table_select-lang"
                                  name="lang" value={this.state.language}
                                  onChange={this._onChangeLanguage}
                            />
                            <p>{Messages.get("app").timezone}</p>
                            <Timezone 
                               classname="p_input_select c_table_select-timezone"
                               name="timezone" value={this.state.timezone}
                               onChange={this._onChangeTimezone}
                            />
                        </div>
                        <div className="header-popup-settings_buttons" >
                            <button className="settings-close-button" type="button" onClick={this._onClose} name="close">{Messages.get("app").close}</button>
                            <button className="settings-save-button" type="button" onClick={this._onSave} name="save">{Messages.get("app").save}</button>
                        </div>  
                        <div className="header-popup-settings_line" />
                        <div className="header-popup-settings_logout" >
                            <p><a href="/web/logout">{Messages.get("app").logout}</a></p>
                        </div>
                    </div>
        );

        var style = {
            width: 150,
            height: height,
            transition: trans,
            top: baseTop + 30,
            left: baseLeft - 50
        };
        return ( <Popup style={style} content={content} /> );
    }
});

//* header */

// Content
var Content = React.createClass({
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
        editing_id:false, editing_folderid:false
    },
    getInitialState: function () {
        return this._init_state;
    },
    componentDidMount: function () {
        this.loadContentData();
    },
    componentWillReceiveProps: function(newProps){
        var state = {editing_id: false, editing_folderid:false};
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
                            _this.refreshFolderOrder( f,
                                                     {taskid:  ids[j].id ,
                                                      orderid: ids[j].orderid
                                                     },
                                                     appData.tasks);
                        } 
                    } 

                    console.log("finish loadContent");
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
                                _this.refreshFolderOrder( appData.folders[i],
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
                    console.log(res.body);
                    var appData = _this.state.data;
                    _this.refreshTaskDelete( appData, task );
                    _this.refreshRemoveTaskFromFolder( appData.folders, task );
                    _this.setState( {data:appData} );
                });
    },
    taskDone:function(id){
        console.log("done: " + id);
        var task = this.state.data.tasks[id];
        if(!task || task.status == "done") return;
        var _this = this;
        Request.put( Define.api_host + "/api/task/done/" + id)
               .end(function(err, res){
                    console.log(res.body);
                    var appData = _this.state.data;
                    _this.refreshTaskDone(appData, id);
                    _this.setState( {data:appData} );
               });
    }, 
    taskActive:function(id){
        console.log("active: " + id);
        var task = this.state.data.tasks[id];
        if(!task || task.status == "active") return;
        var _this = this;
        Request.put( Define.api_host + "/api/task/active/" + id)
               .end(function(err, res){
                    console.log(res.body);
                    var appData = _this.state.data;
                    _this.refreshTaskActive(appData, id);
                    _this.setState( {data:appData} );
               });   
    },
    taskDrag:function(id){
    
    },
    taskEdit: function(id){
        console.log("edit " + id);
        this.setState( {editing_id: id} );
    }, 
    taskCancel: function(id){
        console.log("cancel " + id);
        this.setState( {editing_id: false} );        
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
                    _this.setState( {data:appData, editing_folderid:false} );
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
                    _this.setState( {data:appData, editing_folderid:false} );
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
        if(newFolder){
            this.refreshRemoveTaskFromFolder( appData.folders, prevTask );
            this.refreshFolderOrder(newFolder.folder, newFolder.folderorder, appData.tasks);
        }else{
            this.refreshRemoveTaskFromFolder( appData.folders, prevTask );
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
    refreshFolderOrder:function(folder, folderOrder, tasks){
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
            console.log("folder id");
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
    /* data refresh **/

    onOpenEditFolder:function(id){
        console.log("folder edit : " + id); 
        if(this.state.editing_folderid != id){
            this.setState({editing_folderid:id});
        }else if(this.state.editing_folderid == id){
            this.onCancelEditFolder();
        }
    },
    onCancelEditFolder:function(){
        this.setState({editing_folderid:false});
    },

    createFolders:function(){
        var _this = this;
        var folders = this.state.data.folders.map(function (folder) {
            var editing = false;
            if(_this.state.editing_folderid == folder.folderid){
                editing = true; 
            }
            return (
                <FolderMenu key={folder.folderid} id={folder.folderid}
                            count={folder.count} name={folder.name}
                            onEdit={_this.onOpenEditFolder}
                            editing={editing}
                />
            );
        }); 
        return folders;
    },
    createTasks: function( ids ){
        var tasks = {active:[], done:[]}; 
        for( var i=0; i<ids.length; i++ ){
            var t = this.state.data.tasks[ids[i].id];
            if( !t ) continue;
            switch(t.status){
                case "active":
                    tasks.active.push( this.createActiveTask(t , 
                                       t.taskid == this.state.editing_id ? "edit": "show"
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

    createActiveTask: function( task , showtype ){
        return (<ActiveTask key={task.taskid} data={task} showtype={showtype}
                    onSave={this.taskUpdate}
                    onDelete={this.taskDelete}
                    onDone={this.taskDone}
                    onDrag={this.taskDrag}
                    onEdit={this.taskEdit}
                    onCancel={this.taskCancel}
                    folders={this.state.data.folders}
                    days={this.state.data.days}
                />);
    },
    createDoneTask: function( task ){
        return (<DoneTask key={task.taskid} data={task} 
                    onDelete={this.taskDelete}
                    onActive={this.taskActive}
                />);
    },

    render: function(){
        console.log( "path " + this.getPath() );
        console.log( this.getParams());
        if( !this.state.loaded ){
            return (
                <div className="content loading">
                </div>
            ) 
        }else{ 

            var state = {type:"day", id:"today", 
                         none:false, name:null ,
                         date:null,  folderid:null
                        };
            var params = this.getParams();
            if( params.type ) state.type = params.type;
            if( params.id ) state.id = params.id;

            var folders = this.createFolders();
            var tasks = {active:[], done:[] };

            if( state.type == "day" ){
                var d = this.state.data.days[state.id]; 
                if( d ){
                    state.date = d.date; 
                    state.name = d.name; 
                    tasks = this.createTasks( d.ids );
                }
            }else if(state.type == "folder"){
                var f = this.state.data.folders;
                for( var i=0;i<f.length; i++ ){
                    if( state.id == f[i].folderid ){
                        state.folderid = state.id;              
                        state.name = f[i].name;
                        tasks = this.createTasks( f[i].ids );
                        break;
                    }
                }
            }
            if( !state.name ){
                state.none = true; 
            }
            console.log(state);

            var folderPopup = (<div key="folder_edit_popup"></div>);
            if(this.state.editing_folderid){
                var edit_folder = this.getFolderInfo( this.state.data.folders, this.state.editing_folderid );
                folderPopup = (<FolderEditPopup key="folder_edit_popup"
                                parent={this.state.editing_folderid}
                                folder={edit_folder}
                                show="show"
                                onSave={this.folderUpdate}
                                onDelete={this.folderDelete}
                                onCancel={this.onCancelEditFolder}
                             />); 
            }

            return (
                <div className="content" >
                    <ContentMenu state={state}
                        days={this.state.data.days}
                        folderNode={folders}
                        folders={this.state.data.folders}
                        folderAdd={this.folderAdd}
                    />
                    <ContentMain state={state}
                        days={this.state.data.days}
                        folders={this.state.data.folders}
                        tasks={tasks}
                        taskAdd={this.taskAdd}
                    />
                    {folderPopup}
                </div>        
            ) 
        }
    }
});


// Content */
// ContentMenu 

var ContentMenu = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        days: React.PropTypes.object.isRequired ,
        folderNode: React.PropTypes.arrayOf( React.PropTypes.node ),
        folders: React.PropTypes.array.isRequired,
        folderAdd: React.PropTypes.func.isRequired
    },
    _folderAdd:function( data ){
        this.props.folderAdd( data ); 
    },
    render: function(){
        return (
            <div className="content-menu">
                <DayMenus data={this.props.days} />
                <div className="folder-menus">
                    <FolderAdd add={this._folderAdd}
                        folders={this.props.folders} 
                    />
                    <div className="folder-list">
                        {this.props.folderNode}
                    </div>
                </div>
            </div>
        ) 
    }
});

var DayMenus = React.createClass({
     propTypes: {
        data: React.PropTypes.object.isRequired 
     },
     render: function(){
        return (
            <div className="day-menus">
                <DayMenu key="today" id="today" count={this.props.data.today.count}
                      image="/images/arrow-icon.png" name={Messages.get("app").today} />    
                <DayMenu key="tomorrow" id="tomorrow" count={this.props.data.tomorrow.count}
                      image="/images/arrow-icon.png" name={Messages.get("app").tomorrow} />    
                <DayMenu key="anytime" id="anytime" count={this.props.data.anytime.count}
                      image="/images/arrow-icon.png" name={Messages.get("app").anytime} />    
                <DayMenu key="past" id="past" count={this.props.data.past.count}
                      image="/images/stock-icon.png" name={Messages.get("app").past} lastline={true} />   
            </div>
        )
    }
});

var FolderAdd = React.createClass({
     propTypes: {
        add: React.PropTypes.func.isRequired ,
        folders: React.PropTypes.array.isRequired
     },
     _init_state: { 
        showtype: "show" ,
        name: "" ,
        error: null
     },
     getInitialState: function(){
        return this._init_state;
     }, 
     componentWillReceiveProps: function(newProps){
        this.setState(this._init_state); 
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
         
         var name  = this.state.name ? this.state.name.trim() : "";
         var error = null;
         if( Validator.isBlank( name ) ){
            error = sprintf( Messages.get("error").required, Messages.get("app").folder_name);
         }
         if(!error){
            var limit = Define.number_of_limit.folder;
            if(this.props.folders.length >= limit){
                error = sprintf( Messages.get("error").limit_folder, limit);
            } 
         }
         if(error){
             this.setState({error:error}); 
             return;
         } 
         this.props.add({name: this.state.name });
     },
     _onChangeName:function(event){
         this.setState({ name: event.target.value });
     },
     render: function(){
        var showHidden = "";
        var addHidden = "";
        var open = "";
        var errorMessage = "";
        if(this.state.showtype == "add"){
            open = "folder-add-open";
            addHidden = "hidden"; 
            if(this.state.error){
                errorMessage = this.state.error; 
            }
        }else{
            showHidden = "hidden"; 
        }
        return (
            <div className="folder-add">
                <div className={"folder-add_section " + open}>
                    <div className={"folder-add_show " + addHidden}> 
                        <a href="#" onClick={this._onClickAdd} >
                            <img src="/images/add-icon.png" alt="" />
                            <div className="folder-add-show_name"> 
                                {Messages.get("app").add}
                            </div>
                        </a>
                    </div>
                    <div className={"folder-add_input " + showHidden} >
                        <div className="folder-add-input_close">
                            <a href="#" onClick={this._onClickCancel} >
                                <img src="/images/remove-icon.png" alt=""/>
                            </a>
                        </div>
                        <div className="folder-add-input_info" >
                            <div className="folder-add-input-info_name" > 
                                <input className="folder-name-input" type="text" name="name" 
                                    onChange={this._onChangeName} 
                                    value={this.state.name} 
                                />
                            </div>
                            <div className="folder-add-input-info_button">
                                <button className="folder-save-button" type="button" name="save" onClick={this._onSave} >{Messages.get("app").save}</button>
                            </div>            
                        </div>
                    </div>
                </div>
                <div className="folder-add_error">
                    {errorMessage}
                </div>
            </div>
        )
    }
});

var FolderEditPopup = React.createClass({
    propTypes: {
        parent: React.PropTypes.string.isRequired,
        folder: React.PropTypes.object.isRequired,
        onSave: React.PropTypes.func.isRequired,
        onCancel: React.PropTypes.func.isRequired,
        onDelete: React.PropTypes.func.isRequired
    },
    _init_state: {
        name: "",
        error:false
    },
    getInitialState: function () {
        var state = this._init_state;
        state.name = this.props.folder.name;
        return this._init_state;
    },    
    componentWillReceiveProps:function(newProps){
        var state = this._init_state;
        state.name = newProps.folder.name;
        this.setState(state); 
    },
    _onSave:function(){
        var name  = this.state.name ? this.state.name.trim() : "";
        var error = null;
        if( Validator.isBlank( name ) ){
           error = sprintf( Messages.get("error").required, Messages.get("app").folder_name);
        }
        if(error){
            this.setState({error:error}); 
            return;
        } 
        this.props.onSave( this.props.folder.folderid, {
            name: this.state.name,
        });
    },
    _onClose:function(){
        this.props.onCancel(); 
    },
    _onDelete:function(){
        console.log("delete??");
        this.props.onDelete(this.props.folder.folderid); 
    },

    _onChangeName:function(event){
        this.setState({ name: event.target.value });
    },

    render: function(){
        var baseTop = 0;
        var baseLeft = 0;
        var height=120;
        var errorMessage = "";
        var element = document.getElementById(this.props.parent);
        if(element){
            var rect = element.getBoundingClientRect();
            baseTop = rect.top + window.pageYOffset;
            baseLeft = rect.left + window.pageXOffset;
        }
        if(this.state.error){
            errorMessage = this.state.error; 
            height = 135;
        }

        var content = (
                    <div className="folder-edit-popup" >
                        <div className="folder-edit-popup_input">
                            <div className="folder-edit-popup-input_name" > 
                                <input className="folder-name-input" type="text" name="name" 
                                    onChange={this._onChangeName} 
                                    value={this.state.name} 
                                />
                            </div>                         
                        </div>
                        <div className="folder-edit-popup_error">
                            {errorMessage}
                        </div>
                        <div className="folder-edit-popup_buttons" >
                            <button className="folder-close-button" type="button" name="close" onClick={this._onClose} >{Messages.get("app").close}</button>
                            <button className="folder-save-button" type="button" name="save" onClick={this._onSave} >{Messages.get("app").save}</button>
                        </div>  
                        <div className="folder-edit-popup_line" />
                        <div className="folder-edit-popup_delete" >
                            <p><a onClick={this._onDelete}>{Messages.get("app").delete}</a></p>
                        </div>
                    </div>
        );

        var style = {
            width: 150,
            height: height,
            top: baseTop + 18,
            left: baseLeft + 115
        };
        return ( <Popup style={style} content={content} /> );
    }
});

// ContentMenu */
// ContentMain

var ContentMain = React.createClass({
    propTypes: {
        state: React.PropTypes.shape({ 
            type: React.PropTypes.string.isRequired,
            id: React.PropTypes.string.isRequired
        }),
        tasks: React.PropTypes.shape({
            active: React.PropTypes.arrayOf(React.PropTypes.node),
            done:   React.PropTypes.arrayOf(React.PropTypes.node)
        }),
        folders: React.PropTypes.array,
        days: React.PropTypes.object,
        taskAdd: React.PropTypes.func.isRequired
    },
    _taskAdd: function(data){
        this.props.taskAdd(data);
    },

    render: function(){

        if(this.props.state.none){
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
        
        var addElem = (<div></div>);
        if(this.props.state.type != "day" || this.props.state.id != "past"){
            addElem =  ( <TaskAdd folders={this.props.folders}
                            days={this.props.days}
                            defaultdate={this.props.state.date}
                            defaultfolder={this.props.state.folderid}
                            add={this._taskAdd}
                        />
                      ); 
        }

        return (
            <div className="content-main">
                <div className="content-main-inner">
                    <div className="menu-title" >
                        <p>{this.props.state.name}</p>
                    </div>
                    {addElem} 
                    <div className="task-list">
                        <div className="active-tasks">
                            {this.props.tasks.active}
                        </div>
                        <div className="task-separate-line" />
                        <div className="done-tasks">
                            {this.props.tasks.done}
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
        console.log(state);
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


