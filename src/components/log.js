/* eslint-disable no-console, no-debugger*/
import GLOBALS from 'components/globals';

class Logger {
    constructor() { }
    info() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.info('%c User Action: ', 'color: #d0e2ec;', ...arguments);
        }
        trackJs.console.info(...arguments); //eslint-disable-line no-undef
        Rollbar.info(...arguments); //eslint-disable-line no-undef
    }
    log() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.log('%c System: ', 'color: #bfe2ca;', ...arguments);
        }
        trackJs.console.log(...arguments); //eslint-disable-line no-undef
        Rollbar.log(...arguments); //eslint-disable-line no-undef
    }
    warn() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.warn('%c Warning: ', 'color: #fed88f;', ...arguments);
        }
        trackJs.console.warn(...arguments); //eslint-disable-line no-undef
        Rollbar.warn(...arguments); //eslint-disable-line no-undef
    }
    error() {
        if (GLOBALS.MODE.toLowerCase() === 'dev' || GLOBALS.MODE.toLowerCase() === 'development') {
            console.error('%c Error: ', 'color: #f4858e; font-weight: bold;', ...arguments);
            if (GLOBALS.debugging === true || window.debugging === true || this.debugging === true) {
                debugger;
            }
        }
        trackJs.console.error(...arguments); //eslint-disable-line no-undef
        Rollbar.error(...arguments); //eslint-disable-line no-undef
        Bugsnag.notifyException(...arguments); //eslint-disable-line no-undef
        Raven.captureException(...arguments); //eslint-disable-line no-undef
        Raygun.send(...arguments); //eslint-disable-line no-undef
    }
}

var Log = new Logger();

export default Log;