var complate = (function (exports) {
'use strict';

if(typeof global === "undefined" && typeof window !== "undefined") {
	window.global = window;
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

var BLANKS = [undefined, null, false];
function simpleLog(type, msg) {
  console.log("[".concat(type, "] ").concat(msg)); // eslint-disable-line no-console
} // returns a function that invokes `callback` only after having itself been
// invoked `total` times

function awaitAll(total, callback) {
  var i = 0;
  return function (_) {
    i++;

    if (i === total) {
      callback();
    }
  };
} // flattens array while discarding blank values

function flatCompact(items) {
  return items.reduce(function (memo, item) {
    return BLANKS.indexOf(item) !== -1 ? memo : // eslint-disable-next-line indent
    memo.concat(item.pop ? flatCompact(item) : item);
  }, []);
}
function blank(value) {
  return BLANKS.indexOf(value) !== -1;
}
function repr(value) {
  var jsonify = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
  return "`".concat(jsonify ? JSON.stringify(value) : value, "`");
}
function noop() {}

var Fragment = {}; // poor man's symbol; used for virtual wrapper elements
// cf. https://www.w3.org/TR/html5/syntax.html#void-elements

var VOID_ELEMENTS = {}; // poor man's `Set`

["area", "base", "br", "col", "embed", "hr", "img", "input", "keygen", "link", "meta", "param", "source", "track", "wbr"].forEach(function (tag) {
  VOID_ELEMENTS[tag] = true;
}); // generates an "element generator" function which serves as a placeholder and,
// when invoked, writes the respective HTML to an output stream
//
// such an element generator expects three arguments:
// * a writable stream (an object with methods `#write`, `#writeln` and `#flush`)
// * an options object:
//     * `nonBlocking`, if truthy, permits non-blocking I/O
//     * `log` is a logging function with the signature `(level, message)`; note
//       that violations of HTML semantics are logged as "error", though user
//       agents might still successfully render the respective document
// * a callback function which is invoked upon conclusion, without any arguments
//
// the indirection via element generators serves two purposes: since this
// function implements the signature expected by JSX (which is essentially a DSL
// for function invocations), we need to inject additional arguments by other
// means - plus we need to defer element creation in order to ensure proper
// order and nesting:
//
//     <body id="top">
//         <h1>hello world</h1>
//     </body>
//
// turns into
//
//     createElement("body", { id: "top" },
//             createElement("h1", null, "hello world"));
//
// without a thunk-style indirection, `<h1>` would be created before `<body>`

function generateHTML(tag, params) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  return function (stream, options, callback) {
    var _ref = options || {},
        nonBlocking = _ref.nonBlocking,
        _ref$log = _ref.log,
        log = _ref$log === void 0 ? simpleLog : _ref$log,
        _ref$_idRegistry = _ref._idRegistry,
        _idRegistry = _ref$_idRegistry === void 0 ? {} : _ref$_idRegistry;

    if (tag !== Fragment) {
      var attribs = generateAttributes(params, {
        tag: tag,
        log: log,
        _idRegistry: _idRegistry
      });
      stream.write("<".concat(tag).concat(attribs, ">"));
    } // NB:
    // * discarding blank values (`undefined`, `null`, `false`) to allow for
    //   conditionals with boolean operators (`condition && value`)
    // * `children` might contain nested arrays due to the use of
    //   collections within JSX (`{items.map(item => <span>{item}</span>)}`)


    children = flatCompact(children);
    var isVoid = VOID_ELEMENTS[tag];
    var closingTag = isVoid || tag === Fragment ? null : tag;
    var total = children.length;

    if (total === 0) {
      closeElement(stream, closingTag, callback);
    } else {
      if (isVoid) {
        log("error", "void elements must not have children: `<".concat(tag, ">`"));
      }

      var close = awaitAll(total, function (_) {
        closeElement(stream, closingTag, callback);
      });
      processChildren(stream, children, 0, {
        tag: tag,
        nonBlocking: nonBlocking,
        log: log,
        _idRegistry: _idRegistry
      }, close);
    }
  };
}
function HTMLString(str) {
  if (blank(str) || !str.substr) {
    throw new Error("invalid ".concat(repr(this.constructor.name, false), ": ").concat(repr(str)));
  }

  this.value = str;
} // adapted from TiddlyWiki <http://tiddlywiki.com> and Python 3's `html` module

function htmlEncode(str, attribute) {
  var res = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

  if (attribute) {
    res = res.replace(/"/g, "&quot;").replace(/'/g, "&#x27;");
  }

  return res;
}

function processChildren(stream, children, startIndex, options, callback) {
  var _loop2 = function _loop2(i) {
    var child = children[i];

    if (!child.call) {
      // leaf node(s)
      var content = child instanceof HTMLString ? // eslint-disable-next-line indent
      child.value : htmlEncode(child.toString());
      stream.write(content);
      callback();
      return "continue";
    }

    var nonBlocking = options.nonBlocking,
        log = options.log,
        _idRegistry = options._idRegistry;
    var generatorOptions = {
      nonBlocking: nonBlocking,
      log: log,
      _idRegistry: _idRegistry
    };

    if (child.length !== 1) {
      // element generator -- XXX: brittle heuristic (arity)
      child(stream, generatorOptions, callback);
      return "continue";
    } // deferred child element


    var fn = function fn(element) {
      element(stream, generatorOptions, callback);
      var next = i + 1;

      if (next < children.length) {
        processChildren(stream, children, next, options, callback);
      }
    };

    if (!nonBlocking) {
      // ensure deferred child element is synchronous
      var invoked = false;
      var _fn = fn;

      fn = function fn() {
        invoked = true;
        return _fn.apply(null, arguments);
      };

      var _child = child;

      child = function child() {
        var res = _child.apply(null, arguments);

        if (!invoked) {
          var msg = "invalid non-blocking operation detected";
          throw new Error("".concat(msg, ": `").concat(options.tag, "`"));
        }

        return res;
      };
    }

    child(fn);
    return "break"; // remainder processing continues recursively above
  };

  _loop: for (var i = startIndex; i < children.length; i++) {
    var _ret = _loop2(i);

    switch (_ret) {
      case "continue":
        continue;

      case "break":
        break _loop;
    }
  }
}

function closeElement(stream, tag, callback) {
  if (tag !== null) {
    // void elements must not have closing tags
    stream.write("</".concat(tag, ">"));
  }

  stream.flush();
  callback();
}

function generateAttributes(params, _ref2) {
  var tag = _ref2.tag,
      log = _ref2.log,
      _idRegistry = _ref2._idRegistry;

  if (!params) {
    return "";
  }

  if (_idRegistry && params.id !== undefined) {
    var id = params.id;

    if (_idRegistry[id]) {
      log("error", "duplicate HTML element ID: ".concat(repr(params.id)));
    }

    _idRegistry[id] = true;
  }

  var attribs = Object.keys(params).reduce(function (memo, name) {
    var value = params[name];

    switch (value) {
      // blank attributes
      case null:
      case undefined:
        break;
      // boolean attributes (e.g. `<input … autofocus>`)

      case true:
        memo.push(name);
        break;

      case false:
        break;
      // regular attributes

      default:
        // cf. https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
        if (/ |"|'|>|'|\/|=/.test(name)) {
          reportAttribError("invalid HTML attribute name: ".concat(repr(name)), tag, log);
          break;
        }

        if (typeof value === "number") {
          value = value.toString();
        } else if (!value.substr) {
          reportAttribError("invalid value for HTML attribute `".concat(name, "`: ") + "".concat(repr(value), " (expected string)"), tag, log);
          break;
        }

        memo.push("".concat(name, "=\"").concat(htmlEncode(value, true), "\""));
    }

    return memo;
  }, []);
  return attribs.length === 0 ? "" : " ".concat(attribs.join(" "));
}

function reportAttribError(msg, tag, log) {
  log("error", "".concat(msg, " - did you perhaps intend to use `").concat(tag, "` as a macro?"));
}

function createElement(element, params) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }

  /* eslint-disable indent */
  return element.call ? element.apply(void 0, [params === null ? {} : params].concat(_toConsumableArray(flatCompact(children)))) : generateHTML.apply(void 0, [element, params].concat(children));
  /* eslint-enable indent */
} // a renderer typically provides the interface to the host environment
// it maps views' string identifiers to the corresponding macros and supports
// both HTML documents and fragments
// `log` is an optional logging function with the signature `(level, message)`
// (cf. `generateHTML`)

var Renderer =
/*#__PURE__*/
function () {
  function Renderer() {
    var _this = this;

    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
        _ref$doctype = _ref.doctype,
        doctype = _ref$doctype === void 0 ? "<!DOCTYPE html>" : _ref$doctype,
        log = _ref.log;

    _classCallCheck(this, Renderer);

    this.doctype = doctype;
    this.log = log;
    this._macroRegistry = {}; // bind methods for convenience

    ["registerView", "renderView"].forEach(function (meth) {
      _this[meth] = _this[meth].bind(_this);
    });
  }

  _createClass(Renderer, [{
    key: "registerView",
    value: function registerView(macro) {
      var name = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : macro.name;
      var replace = arguments.length > 2 ? arguments[2] : undefined;

      if (!name) {
        throw new Error("missing name for macro: `".concat(macro, "`"));
      }

      var macros = this._macroRegistry;

      if (macros[name] && !replace) {
        throw new Error("invalid macro name: `".concat(name, "` already registered"));
      }

      macros[name] = macro;
      return name; // primarily for debugging
    } // `view` is either a macro function or a string identifying a registered macro
    // `params` is a mutable key-value object which is passed to the respective macro
    // `stream` is a writable stream (cf. `generateHTML`)
    // `fragment` is a boolean determining whether to omit doctype and layout
    // `callback` is an optional function invoked upon conclusion - if provided,
    // this activates non-blocking rendering

  }, {
    key: "renderView",
    value: function renderView(view, params, stream) {
      var _this2 = this;

      var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
          fragment = _ref2.fragment;

      var callback = arguments.length > 4 ? arguments[4] : undefined;

      if (!fragment) {
        stream.writeln(this.doctype);
      }

      if (fragment) {
        if (!params) {
          params = {};
        }

        params._layout = false; // XXX: hacky? (e.g. might break due to immutability)
      } // resolve string identifier to corresponding macro


      var viewName = view && view.substr && view;
      var macro = viewName ? this._macroRegistry[viewName] : view;

      if (!macro) {
        throw new Error("unknown view macro: `".concat(view, "` is not registered"));
      } // augment logging with view context


      var log = this.log && function (level, message) {
        return _this2.log(level, "<".concat(viewName || macro.name, "> ").concat(message));
      };

      var element = createElement(macro, params);

      if (callback) {
        // non-blocking mode
        element(stream, {
          nonBlocking: true,
          log: log
        }, callback);
      } else {
        // blocking mode
        element(stream, {
          nonBlocking: false,
          log: log
        }, noop);
      }
    }
  }]);

  return Renderer;
}();

function safe(str) {
  return new HTMLString(str);
}

function ApplicationLayout(_ref) {
  var title = _ref.title,
      content = _ref.content;

  for (var _len = arguments.length, children = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    children[_key - 1] = arguments[_key];
  }

  return createElement("html", null, createElement("head", null, createElement("title", null, title)), createElement("body", null, content, children));
}

var demo_error = (function () {
  return createElement("div", null, createElement("h1", null, "This site contains an error"), createElement(BadJSXError, null));
});

var demo_index = (function (_ref) {
  var array = _ref.array;
  return createElement("span", null, createElement("h1", null, "Complate Rails Demo App"), createElement("h3", null, "Parameter ", createElement("em", null, "array")), createElement("code", null, array.join(', ')), createElement("h3", null, "Rails helpers"), createElement("tt", null, "rails.url_for()"), ": ", createElement("code", null, rails.url_for()), createElement("br", null), createElement("tt", null, "rails.form_authenticity_token()"), ": ", createElement("code", null, rails.form_authenticity_token()), createElement("br", null), createElement("tt", null, "rails.form_tag()"), ": ", createElement("code", null, rails.form_tag(rails.url_for())), createElement("h3", null, "Further Stuff"), createElement("a", {
    href: rails.streaming_url()
  }, "Streaming"), " (Make sure your server supports this...)");
});

var demo_streaming = (function (_ref) {
  var sleep = _ref.sleep;
  return createElement(ApplicationLayout, {
    title: "Streaming Demo Page"
  }, createElement("h1", null, "Some Streaming for you"), createElement("p", null, "Hope you're using puma..."), function (cb) {
    sleep();
    cb(createElement("span", null, "."));
  }, createElement("p", null, "We won't let you wait for too long."), function (cb) {
    sleep();
    cb(createElement("span", null, "."));
  }, createElement("p", null, "But let's see what comes next..."), function (cb) {
    sleep();
    cb(createElement("span", null, "."));
  }, createElement("p", null, "We're done."));
});

var renderer = new Renderer('<!DOCTYPE html>');
renderer.registerView(demo_error, 'demo_error');
renderer.registerView(demo_index, 'demo_index');
renderer.registerView(demo_streaming, 'demo_streaming');
renderer.registerView(ApplicationLayout, 'layouts_application');
var render = renderer.renderView.bind(renderer);

exports.render = render;
exports.safe = safe;

return exports;

}({}));
