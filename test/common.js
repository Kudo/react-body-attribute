/*jshint newcap: false */
/*global describe, it, before */
'use strict';
var expect = require('expect.js'),
    React = require('react'),
    BodyAttribute = require('../');

describe('BodyAttribute', function () {
  before(function () {
    BodyAttribute.canUseDOM = false;
  });

  it('has a displayName', function () {
    var el = React.createElement(BodyAttribute);
    expect(el.type.displayName).to.be.a('string');
    expect(el.type.displayName).not.to.be.empty();
    expect(el.type.displayName).to.equal('SideEffect(BodyAttribute)');
  });
  it('hides itself from the DOM', function () {
    var Component = React.createClass({
      render: function () {
        return React.createElement(BodyAttribute, {bodyClassName: 'irrelevant'},
          React.createElement('div', null, 'hello')
        );
      }
    });
    var markup = React.renderToStaticMarkup(React.createElement(Component));
    expect(markup).to.equal('<div>hello</div>');
  });
  it('throws an error if it has multiple children', function (done) {
    var Component = React.createClass({
      render: function () {
        return React.createElement(BodyAttribute, {bodyClassName: 'irrelevant'},
          React.createElement('div', null, 'hello'),
          React.createElement('div', null, 'world')
        );
      }
    });
    expect(function () {
      React.renderToStaticMarkup(React.createElement(Component));
    }).to.throwException(function (e) {
      expect(e.message).to.match(/^Invariant Violation:/);
      done();
    });
  });
  it('works with complex children', function () {
    var Component1 = React.createClass({
      render: function() {
        return React.createElement('p', null,
          React.createElement('span', null, 'c'),
          React.createElement('span', null, 'd')
        );
      }
    });
    var Component2 = React.createClass({
      render: function () {
        return React.createElement(BodyAttribute, {bodyClassName: 'irrelevant'},
          React.createElement('div', null,
            React.createElement('div', null, 'a'),
            React.createElement('div', null, 'b'),
            React.createElement('div', null, React.createElement(Component1))
          )
        );
      }
    });
    var markup = React.renderToStaticMarkup(React.createElement(Component2));
    expect(markup).to.equal(
      '<div>' +
        '<div>a</div>' +
        '<div>b</div>' +
        '<div>' +
          '<p>' +
            '<span>c</span>' +
            '<span>d</span>' +
          '</p>' +
        '</div>' +
      '</div>'
    );
  });
});

describe('BodyAttribute.rewind', function () {
  it('clears the mounted instances', function () {
    React.renderToStaticMarkup(
      React.createElement(BodyAttribute, {bodyClassName: 'a'},
        React.createElement(BodyAttribute, {bodyClassName: 'b'}, React.createElement(BodyAttribute, {bodyClassName: 'c'}))
      )
    );
    expect(BodyAttribute.peek()).to.equal('c');
    BodyAttribute.rewind();
    expect(BodyAttribute.peek()).to.equal(undefined);
  });
  it('returns the latest document bodyClassName', function () {
    var bodyClassName = 'cheese';
    React.renderToStaticMarkup(
      React.createElement(BodyAttribute, {bodyClassName: 'a'},
        React.createElement(BodyAttribute, {bodyClassName: 'b'}, React.createElement(BodyAttribute, {bodyClassName: bodyClassName}))
      )
    );
    expect(BodyAttribute.rewind()).to.equal(bodyClassName);
  });
  it('returns undefined if no mounted instances exist', function () {
    React.renderToStaticMarkup(
      React.createElement(BodyAttribute, {bodyClassName: 'a'},
        React.createElement(BodyAttribute, {bodyClassName: 'b'}, React.createElement(BodyAttribute, {bodyClassName: 'c'}))
      )
    );
    BodyAttribute.rewind();
    expect(BodyAttribute.peek()).to.equal(undefined);
  });
});
