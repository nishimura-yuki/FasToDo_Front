
module.exports = React.createClass({
    propTypes: {
        style:  React.PropTypes.object, 
        content: React.PropTypes.node.isRequired
    },
    render: function(){
        return (
            <div className="popup" style={this.props.style}>
                {this.props.content}
            </div>
        )
   }
});
