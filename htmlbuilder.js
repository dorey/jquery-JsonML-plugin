/**
 * HTMLBuilder
 *
 * A micro-library designed to make creating/mainipulating DOM Elements
 * fast and easy
 *
 * Copyright 2010, Carlos Killpack
 * Dual licensed under New BSD and WTFPL licenses
 */
(function (window, undefined) {
    /**
     * @constructor
     */
    var Builder = function () {
        "use strict";
        var self = this,
            /*
             * Iterate over an array (in a functional style) with
             * each item
             */
            forEach = typeof Array.prototype.forEach === 'function' ?
                function (array, action) {
                    array.forEach(action);
                } :
                function (array, action) {
                    for (var i = 0, l = array.length; i < l; i += 1) {
                        action(array[i]);
                    }
                },
            /*
             * Enumerate local object members
             *
             * @param   {Object}      o   The object
             * @returns {Array}           Enumerated members
             */
            keys = typeof Object.getOwnPropertyNames === 'function' ?
                function (o) {
                    return Object.getOwnPropertyNames(o);
                } :
                function (o) {
                    var key, keys = [];
                    for (key in o) {
                        o.hasOwnProperty(key) && keys.push(key);
                    }
                    return keys;
                };
        self.version = '0.2.1';
        /*
         * Creates an elements, sets its properties, and inserts
         * its contents. Takes the following array literal
         * as an argument: (everything is optional but don't forget
         * to use null in place of the value you don't need)
         * 
         * [
         *     <tagname>,
         *     {<key>: <value>},
         *     <content> || [...]
         * ]
         * 
         */
        self.build = function (elDef, callback) {
            var el = document.createElement(elDef[0]);
            elDef[1] && forEach(keys(elDef[1]), function (key) {
                el.setAttribute(key, elDef[1][key]);
            });
            elDef[2] &&
                typeof elDef[2] === 'string' ?
                    self.insert(document.createTextNode(elDef[2]), el, null) :
                    elDef[2] instanceof Array &&
                        self.build(elDef[2], function (subEl) {
                            self.insert(subEl, el, null);
                        });
            return callback ? callback(el) : el;
        };
        /*
         * Creates multiple elements and puts them in a
         * DocumentFragment. A defList looks like this:
         *
         * [
         *     [
         *          <tagname>,
         *          {<key>: <value>},
         *          <content> || [...]
         *     ], ...
         * ]
         *
         */
        self.polyBuild = function (defList, callback) {
            var frag = document.createDocumentFragment();
            forEach(defList, function (def) {
                self.build(def, function (el) {
                    self.insert(el, frag, null);
                });
            });
            return callback ? callback(frag): frag;
        };
        /*
         * Appends a DocumentFragment (or related object) to the
         * target elements
         *
         * Fragment -- insert into --> target
         */
        self.insert = function (frag, target, callback) {
            target.appendChild(frag);
            return callback ? callback(target) : target;
        };
        /*
         * Creates one elements and appends it to the target element
         * (A shortcut for build and insert)
         */
        self.make = function (elDef, target, callback) {
            return self.build(elDef, function (el) {
                self.insert(el, target, null);
            });
        };
        /*
         * Creates multiple elements and appends them to the target
         * element (A shortcut for polyBuild and insert)
         */
        self.factory = function (defList, repeat, callback) {
            var frag = document.createDocumentFragment();
            return (function worker(i) {
                return (i > 0) ?
                    self.polyBuild(defList, function (els) {
                        self.insert(els, frag, function () {
                            worker(i - 1);
                        });
                    }) :
                    callback ? callback(frag) : frag;
            }(repeat));
        };
        /*
         * Deletes an element or an array of elements and returns a
         * a reference or an array of references to the parent(s) of
         * the deleted element(s).
         */
        self.destroy = function (target, callback) {
            var parent = [],
                targets = target instanceof Array || target instanceof NodeList ?
                    target :
                    [target];
            forEach(targets, function (t) {
                parent.push(t.parentNode);
                t.parentNode.removeChild(t);
            });
            parent = parent.length === 1 ? parent[0] : parent;
            return callback ? callback(parent) : parent;
        };
    };
    window['builder'] = new Builder();
}(window, null));
