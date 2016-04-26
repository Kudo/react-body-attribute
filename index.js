'use strict';

var React = require('react'),
    withSideEffect = require('react-side-effect');

function reducePropsToState(propsList) {
  var innermostProps = propsList[propsList.length - 1];
  if (innermostProps) {
    var result = {};
    var patt = /^body(.+)$/i;

    for (var key in innermostProps) {
      var m = patt.exec(key);
      if (innermostProps.hasOwnProperty(key) && (m != null)) {
        result[m[1]] = innermostProps[key];
      }
    }

    return result;
  }
}

function handleStateChangeOnClient(props) {
  for (var key in props) {
    if (props.hasOwnProperty(key)) {
      if (key == 'Class' || key == 'class') {
        var currentClasses = document.body.getAttribute(key);
        if (!currentClasses) {
            document.body.setAttribute(key, props[key]);
        } else if (currentClasses.indexOf(props[key]) === -1)
            // Simple dedupe to prevent handleStateChangeOnClient() called multiple time
            // document.body.setAttribute(key, currentClasses + ' ' + props[key]);
            document.body.setAttribute(key, props[key]);
      } else {
        document.body.setAttribute(key, props[key]);
      }
    }
  }
}

var BodyAttribute = React.createClass({
  displayName: 'BodyAttribute',

  render: function render() {
    if (this.props.children) {
      return React.Children.only(this.props.children);
    } else {
      return null;
    }
  }
});

module.exports = withSideEffect(
  reducePropsToState,
  handleStateChangeOnClient
)(BodyAttribute);
