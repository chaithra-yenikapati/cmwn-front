import React from 'react';
import ReactDOM from 'react-dom';
import Screenfull from 'screenfull';
import ClassNames from 'classnames';
import _ from 'lodash';
import {Button, Glyphicon} from 'react-bootstrap';

import getEventsForGame from 'components/game_events';
import GLOBALS from 'components/globals';
import HttpManager from 'components/http_manager';

import 'components/game.scss';

const EVENT_PREFIX = '_e_';

const FULLSCREEN = 'Full Screen';
const DEMO_MODE = 'Demo Mode';

/**
 * Game wrapper iframe component.
 * Listens for 'game-event'
 * Has three default events - init, onFlipEarned, and onSave
 * Provides data to component via respond method in details of init event
 * additional arbitrary events can be added by adding additional
 * props prefixed with 'on'. Should the game issue events with
 * these names, any provided callbacks will fire. For example:
 * ```
 * var event = new Event('save', {bubbles: true}, {name: 'save', gameData: {state: {...}}});
 * window.frameElement.dispatchEvent(event)
 * ```
 * note that the component may provide incomplete or empty
 * state data, so any missing properties should be actively
 * regenerated by the game itself.
 */
var Game = React.createClass({
    getDefaultProps: function () {
        return {
            onFlipEarned: _.noop,
            onSave: _.noop,
            isTeacher: false,
            gameState: {}
        };
    },
    getInitialState: function () {
        return {
            fullscreenFallback: false,
            demo: false
        };
    },
    componentWillMount: function () {
        this.setEvent();
        this.setState({
            currentGame: this.props.game,
            eventHandler: getEventsForGame(
                EVENT_PREFIX,
                this.props.game,
                this.props.currentUser._links,
                this.onExit
            )
        });
    },
    componentDidMount: function () {
        var frame = ReactDOM.findDOMNode(this.refs.gameRef);
        var callApi = _.debounce(function () {
            HttpManager.GET({
                url: (GLOBALS.API_URL),
                handleErrors: false
            });
        }, 5000);

        this.setState({
            currentGame: this.props.game,
            eventHandler: getEventsForGame(
                EVENT_PREFIX,
                this.props.game,
                this.props.currentUser._links,
                this.onExit
            )
        });

        if (!frame) {
            return;
        }

        frame.addEventListener('load', function () {
            frame.contentWindow.addEventListener('click', callApi, false);
        }, false);
    },
    componentWillReceiveProps: function (nextProps) {
        var frame = ReactDOM.findDOMNode(this.refs.gameRef);
        var callApi = _.debounce(function () {
            HttpManager.GET({
                url: (GLOBALS.API_URL),
                handleErrors: false
            });
        }, 10000);
        frame.addEventListener('load', function () {
            frame.contentWindow.addEventListener('click', callApi, false);
        }, false);

        this.setState({
            currentGame: nextProps.game,
            eventHandler: getEventsForGame(
                EVENT_PREFIX,
                nextProps.game,
                nextProps.currentUser._links,
                this.onExit
            )
        });
    },
    componentWillUnmount: function () {
        this.clearEvent();
    },
    onExit: function (nextState) {
        this.setState(nextState);
    },
    gameEventHandler: function (e) {
        if (e.name != null) {
            if (_.isFunction(this[EVENT_PREFIX + _.upperFirst(e.name)])) {
                this[EVENT_PREFIX + _.upperFirst(e.name)](...arguments);
            }
            if (_.isFunction(this.state.eventHandler[EVENT_PREFIX + _.upperFirst(e.name)])) {
                this.state.eventHandler[EVENT_PREFIX + _.upperFirst(e.name)](...arguments);
            }
            if (_.isFunction(this.props['on' + _.upperFirst(e.name)])) {
                this.props['on' + _.upperFirst(e.name)](...arguments);
            }
        }
    },
    setEvent: function () {
        window.addEventListener('game-event', this.gameEventHandler);
        window.addEventListener('platform-event', this.gameEventHandler);
        window.addEventListener('keydown', this.listenForEsc);
    },
    clearEvent: function () {
        window.removeEventListener('game-event', this.gameEventHandler);
        window.removeEventListener('keydown', this.listenForEsc);
    },
    listenForEsc: function (e) {
        var self = this;
        if (e.keyCode === 27 || e.charCode === 27) {
            self.setState({fullscreenFallback: false});
            Screenfull.exit();
        }
    },
    dispatchPlatformEvent(name, data) {
        /** TODO: MPR, 1/15/16: Polyfill event */
        var event = new Event('platform-event', {bubbles: true, cancelable: false});
        this.toggleDemoButton();
        _.defaults(event, {type: 'platform-event', name, data});
        ReactDOM.findDOMNode(this.refs.gameRef).contentWindow.dispatchEvent(event);
    },
    makeFullScreen: function () {
        var self = this;
        if (Screenfull.enabled) {
            Screenfull.request(ReactDOM.findDOMNode(self.refs.gameRef));
        } else {
            self.setState({fullscreenFallback: true});
        }
    },
    toggleDemoButton: function () {
        if (this.state.demo){
            this.setState({demo: false});
        } else {
            this.setState({demo: true});
        }
    },
    render: function () {
        if (this.props.url == null) {
            return null;
        }
        return (
                <div ref="wrapRef" className={ClassNames(
                    'game',
                    {fullscreen: this.state.fullscreenFallback}
                )}>
                    <iframe ref="gameRef" src={this.props.url} allowtransparency="true" />
                    <Button className="purple standard" onClick={this.makeFullScreen}>
                        <Glyphicon glyph="fullscreen" /> {FULLSCREEN}
                    </Button>
                    <Button className={ClassNames('standard',
                            {'purple': !this.state.demo},
                            {'green': this.state.demo},
                            {hidden: !this.props.isTeacher}
                        )}
                        onClick={() => this.dispatchPlatformEvent('toggle-demo-mode')}>{DEMO_MODE}
                    </Button>
                </div>
               ) ;
    }
});

export default Game;

