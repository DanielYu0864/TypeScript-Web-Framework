// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"src/views/UserForm.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserForm = void 0;

var UserForm =
/** @class */
function () {
  function UserForm(parent) {
    this.parent = parent;
  }

  UserForm.prototype.eventsMap = function () {
    return {
      'click:button': this.onButtonClick
    };
  };

  UserForm.prototype.onButtonClick = function () {
    console.log('hi');
  };

  UserForm.prototype.template = function () {
    return "\n      <div>\n        <h1>User Form</h1>\n        <input/>\n        <button>click</button>\n      </div>\n    ";
  };

  UserForm.prototype.bindEvents = function (fragment) {
    var eventsMap = this.eventsMap();

    var _loop_1 = function _loop_1(eventKey) {
      var _a = eventKey.split(':'),
          eventName = _a[0],
          selector = _a[1];

      fragment.querySelectorAll(selector).forEach(function (element) {
        element.addEventListener(eventName, eventsMap[eventKey]);
      });
    };

    for (var eventKey in eventsMap) {
      _loop_1(eventKey);
    }
  };

  UserForm.prototype.render = function () {
    var templateElement = document.createElement('template');
    templateElement.innerHTML = this.template();
    this.bindEvents(templateElement.content);
    this.parent.append(templateElement.content);
  };

  return UserForm;
}();

exports.UserForm = UserForm;
},{}],"src/index.ts":[function(require,module,exports) {
"use strict"; // $ parcel index.html -> ts run client server
// $ json-server -w db.json  - to run json (backend) server in terminal

Object.defineProperty(exports, "__esModule", {
  value: true
});
/*
! assign backend and client in the package.json so now can just run:
  $ npm run start:db - run backend server
  $ npm run start:parcel - run client server
*/
//! Framework idea

/*
  Model Classes => Handle data, used to represent Users, Blog Posts, Images, etc
  View Classes => Handle HTML and events caused by the user (like clicks)
*/
//! backend servers

/*
  $ npm install -g json-server
  use 'JSON Server' to contain the user data
    User Instance | axios -> save()  ->  JSON Server
                          <- fetch() <-
*/
//! Framework steps and needs

/*
  1. Create a class to represent a User and all of its data (like name and age)
    a. User class needs to have the ability to store some data, retrieve it, and change it
    b. Also needs to have the ability to notify the rest of the app when some data is changed
    c. User needs to be able to persist dat to an outside server, and the retrieve it at some future point

    *Extraction Approach:
    I Build class User as a 'mega' class with tons of methods (in src/models/User.ts):
      class User {
        private data: UserProps; -> Object to store info about a particular user (name, age)
        get(propName:string): (string | number); -> Gets a single piece of info about this user (name, age)
        set(update: UserProps):void; -> Changes info about this user (name, age) (using Object.assign)
        on(eventName: string, callback:() => {}); -> Registers an event handler with this object, so other parts of the app know when something changes
        trigger(eventName:string):void; -> Triggers an event to tell other parts of the app that someting has changed
        fetch(): Promise; -> Fetches some data from the server about a particular user
        save (): Promise; -> Saves some data about this user to the server
      }

    II Pefactor User to use composition:
      class User {
        attributes:Attributes; -> Gives us the ability to store properties tied to this user (name, age, etc)
          \=> class Attributes<T> { ** T = generic type
            private data: T;
            get<K extends keyof T>(key: K): T[K];
            set(update: T):void;
          }
        events: Events; -> Gives us the ability to tell other parts of our application whenever data tied to a particular user is changed
          \=> class Eventing {
            on(eventName: string, callback:() => {});
            trigger(eventName:string):void;
          }
        sync:Sync<UserProps>; -> Gives us the ability to save this persons data to a remote server, then retrieve it in the future
          \=> class Sync<T> {
            save(id:num, data:T): AxoisPromise<T>;
            fetch(id:number):AxiosPromise<T>;
          }
      }

    III Refactor User to be a reusable class that can represent any piece of data, not just a User
      Caller function
        \=> class User {
          get()
          set()
          on()
          trigger()
          fetch()
          save()
        }
          \=> class attributes<T> {
            get(key:K):T[K]
            set(update:void)
          }
          \=> class Eventing {
            on(eventName:string, callback: () => {})
            trigger(eventName: string): void
          }
          \=> class Sync<T> {
            fetch(id: number): Promise
            save(data: T): Promise
          }
*/
//* inheritance in this project
// import { User } from './models/Users';
// const user = User.buildUser({ id: 1 });
//* Reminder on accessores "get"
// class Person {
//   constructor(public firstName: string, public lastName: string) { }
//   get fullName(): string { // not really calling a function * don't need "()"
//     return `${this.firstName} ${this.lastName}`;
//   }
// }
//* Reminder on how 'this' works in javascript

/*
const colors = {
  color: 'red',
  printColor() {
    console.log(this.color);
  }
}

colors.printColor(); // works

const printColor = colors.printColor;

printColor(); // cause error 'cause the 'this' is undefined
*/
// user.on('change', () => {
//   console.log(user);
// });
// // user.trigger('change');
// // user.set({ name: 'New name' })
// user.fetch();
//!

var UserForm_1 = require("./views/UserForm");

var userForm = new UserForm_1.UserForm(document.getElementById('root'));
userForm.render();
},{"./views/UserForm":"src/views/UserForm.ts"}],"../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "2687" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["../../../../AppData/Roaming/npm/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/index.ts"], null)
//# sourceMappingURL=/src.f10117fe.js.map