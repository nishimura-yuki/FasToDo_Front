
module.exports = {

    propTypes: {
        drag: React.PropTypes.string, 
        tasks: React.PropTypes.object.isRequired,
        folders: React.PropTypes.array.isRequired,
        days: React.PropTypes.object.isRequired,
        reset: React.PropTypes.bool,

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
    getNotfoundNode: function(){
        return (<div className="menu-title" >
                    <p>{Messages.get("app").not_found}</p>
                </div> 
               );
    }

};

