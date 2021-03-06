const React = require("react");
const { DOM: dom, PropTypes } = React;
const { connect } = require("react-redux");
const { bindActionCreators } = require("redux");
const { isEnabled } = require("devtools-config");
const Svg = require("./utils/Svg");

const actions = require("../actions");
const WhyPaused = React.createFactory(require("./WhyPaused"));
const Breakpoints = React.createFactory(require("./Breakpoints"));
const Expressions = React.createFactory(require("./Expressions"));
const Scopes = React.createFactory(require("./Scopes"));
const Frames = React.createFactory(require("./Frames"));
const EventListeners = React.createFactory(require("./EventListeners"));
const Accordion = React.createFactory(require("./Accordion"));
const CommandBar = React.createFactory(require("./CommandBar"));
require("./RightSidebar.css");

function debugBtn(onClick, type, className, tooltip) {
  className = `${type} ${className}`;
  return dom.button(
    { onClick, className, key: type, title: tooltip },
    Svg(type, { title: tooltip, "aria-label": tooltip })
  );
}

const RightSidebar = React.createClass({
  propTypes: {
    evaluateExpressions: PropTypes.func,
  },

  contextTypes: {
    shortcuts: PropTypes.object
  },

  displayName: "RightSidebar",

  getInitialState() {
    return {
      expressionInputVisibility: true
    };
  },

  watchExpressionHeaderButtons() {
    const { expressionInputVisibility } = this.state;
    return [
      dom.button({
        onClick: evt => {
          evt.stopPropagation();
          this.setState({
            expressionInputVisibility: !expressionInputVisibility
          });
        },
        key: "add-button",
        className: "add-button",
        title: L10N.getStr("watchExpressions.addButton")
      },
        "+"
      ),
      debugBtn(
        evt => {
          evt.stopPropagation();
          this.props.evaluateExpressions();
        },
        "refresh",
        "refresh",
        L10N.getStr("watchExpressions.refreshButton")
      )
    ];
  },

  getItems() {
    const { expressionInputVisibility } = this.state;

    const items = [
      { header: L10N.getStr("breakpoints.header"),
        component: Breakpoints,
        opened: true },
      { header: L10N.getStr("callStack.header"),
        component: Frames },
      { header: L10N.getStr("scopes.header"),
        component: Scopes }
    ];

    if (isEnabled("eventListeners")) {
      items.push({
        header: L10N.getStr("eventListenersHeader"),
        component: EventListeners
      });
    }

    if (isEnabled("watchExpressions")) {
      items.unshift({ header: L10N.getStr("watchExpressions.header"),
        buttons: this.watchExpressionHeaderButtons(),
        component: Expressions,
        componentProps: { expressionInputVisibility },
        opened: true
      });
    }

    return items;
  },

  render() {
    return (
      dom.div(
        { className: "right-sidebar",
          style: { overflowX: "hidden" }},
        CommandBar(),
        isEnabled("whyPaused") ? WhyPaused() : null,
        Accordion({
          items: this.getItems()
        })
      )
    );
  }
});

module.exports = connect(
  () => ({}),
  dispatch => bindActionCreators(actions, dispatch)
)(RightSidebar);
