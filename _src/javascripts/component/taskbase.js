var Validator = require("./../common/Validator.js");
var sprintf = require("sprintf");

module.exports = {
    propTypes: {
        data: React.PropTypes.shape({
            taskid: React.PropTypes.string.isRequired,
            title: React.PropTypes.string.isRequired,
            date: React.PropTypes.string.isRequired,
            folderid: React.PropTypes.string
        }),
        folders: React.PropTypes.array.isRequired,
        days: React.PropTypes.object.isRequired
    },
    validate:function(title, date, folder){
        console.log("validate " + title +":"+ date +":"+folder);
        var error_title = Validator.validate( title ,
                                    [ {name:"blank",
                                       message:sprintf( Messages.get("error").required, Messages.get("app").task_title)}
                                    ]);
        var error_date = Validator.validate( date ,
                                    [ {name:"blank",message:sprintf( Messages.get("error").required, Messages.get("app").task_date)},
                                      {name:"date",message:Messages.get("error").date}
                                    ]);
        if(!error_date && (!this.props.data || this.props.data.date != date)){
            var days = this.props.days;
            var limit = Define.number_of_limit.task_per_date;
            console.log(days);
            for(key in days){
                console.log(key);
                if(key == date){
                    if(days[key].count >= limit){
                        error_date = sprintf(Messages.get("error").limit_task_per_date, limit); 
                    }
                    break;
                }
            }
        }

        var error_folder = null;
        if(Validator.isNotBlank(folder) && (!this.props.data || this.props.data.folderid != folder)){
            var folders = this.props.folders;
            var limit = Define.number_of_limit.task_per_folder;
            console.log(folders);
            for(var i=0;i<folders.length;i++){
                console.log(limit);
                if(folders[i].folderid == folder){
                    if(folders[i].ids.length >= limit){
                        error_folder = sprintf(Messages.get("error").limit_task_per_folder, limit); 
                    }
                    break;
                }
            } 
        }

        if( error_title || error_date || error_folder){
            return {error:{title:error_title,date:error_date, folder:error_folder}};
        }           
        return null;
    }
};
