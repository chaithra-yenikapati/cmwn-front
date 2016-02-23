import _ from 'lodash';

import Log from 'components/log';

var Util = {
    /**
     *  Takes in a nested json object and extracts properties from its data
     *  Expects nested data to have the following properties:
     *  'data' properties will exist at any level at whih an entity can exists
     *  e.g. groups.data.users.data
     *  'data' will arbitrarily be an array or object
     *  @param {object} target - the target json data
     *  @param {string} key - the property to extract
     *  @param {*} [notFoundValue=null] - value to be returned if key does not exist
     *  @returns {*} - generally returns an array of one or more entities, or if the
     *  property does not exist, returns notFoundValue
     */
    normalize: function (target, key, notFoundValue) {
        var retVal = _.get(target, 'data', target);
        retVal = _.get(retVal, key, retVal);
        retVal = _.get(retVal, 'data', retVal);
        retVal = retVal === target.data || retVal === target ? notFoundValue : retVal;
        retVal = _.isArray(retVal) ? retVal : [retVal];
        return retVal;
    },
    addAttr: function (item, key, value) {
        item[key] = value;
        return value;
    },
    /** from http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript */
    uuid: function () {
        Log.info('uuid deprecated. Use ShortId');
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);//eslint-disable-line eqeqeq
            return v.toString(16);
        });
    },
    setPageTitle: function (text) {
        var titleElem = document.getElementsByTagName('title')[0];
        var title = document.createTextNode(text);
        if (titleElem == null) {
            titleElem = document.createElement('title');
            document.getElementsByTagName('head')[0].appendChild(titleElem);
        }
        while (titleElem && titleElem.lastChild) {
            titleElem.removeChild(titleElem.lastChild);
        }
        titleElem.appendChild(title);
    }
};

export default Util;

