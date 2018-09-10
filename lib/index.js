'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.all = exports.use = exports.del = exports.put = exports.post = exports.get = exports.router = exports.Route = undefined;

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _toConsumableArray2 = require('babel-runtime/helpers/toConsumableArray');

var _toConsumableArray3 = _interopRequireDefault(_toConsumableArray2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _slicedToArray2 = require('babel-runtime/helpers/slicedToArray');

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _map = require('babel-runtime/core-js/map');

var _map2 = _interopRequireDefault(_map);

var _symbol = require('babel-runtime/core-js/symbol');

var _symbol2 = _interopRequireDefault(_symbol);

var _koaRouter = require('koa-router');

var _koaRouter2 = _interopRequireDefault(_koaRouter);

var _path = require('path');

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _glob = require('glob');

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var symbolPrefix = (0, _symbol2.default)('prefix');
var routerMap = new _map2.default();

var isArray = function isArray(c) {
  return _lodash2.default.isArray(c) ? c : [c];
};

var Route = exports.Route = function () {
  function Route(app, apiPath) {
    (0, _classCallCheck3.default)(this, Route);

    this.app = app;
    this.apiPath = apiPath;
    this.router = new _koaRouter2.default({
      prefix: '/api/v0'
    });
  }

  (0, _createClass3.default)(Route, [{
    key: 'init',
    value: function init() {
      _glob2.default.sync((0, _path.resolve)(this.apiPath, './**/*.js')).forEach(require);

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(routerMap), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _router;

          var _ref = _step.value;

          var _ref2 = (0, _slicedToArray3.default)(_ref, 2);

          var conf = _ref2[0];
          var controller = _ref2[1];

          var controllers = isArray(controller);
          var prefixPath = conf.target[symbolPrefix];
          var middlewares = conf.middlewares;
          if (prefixPath) prefixPath = normalizePath(prefixPath);
          var routerPath = prefixPath + conf.path;
          (_router = this.router)[conf.method].apply(_router, [routerPath].concat((0, _toConsumableArray3.default)(middlewares), (0, _toConsumableArray3.default)(controllers)));
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      this.app.use(this.router.routes());
      this.app.use(this.router.allowedMethods());
    }
  }]);
  return Route;
}();

var normalizePath = function normalizePath(path) {
  return path.startsWith('/') ? path : '/' + path;
};

var decorator = function decorator(conf) {
  for (var _len = arguments.length, middlewares = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    middlewares[_key - 1] = arguments[_key];
  }

  return function (target, key, descriptor) {

    conf.path = normalizePath(conf.path);

    routerMap.set((0, _assign2.default)({
      target: target,
      middlewares: middlewares
    }, conf), target[key]);
  };
};

var router = exports.router = function router(path) {
  return function (target) {
    return target.prototype[symbolPrefix] = path;
  };
};

var get = exports.get = function get(path) {
  for (var _len2 = arguments.length, middlewares = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
    middlewares[_key2 - 1] = arguments[_key2];
  }

  return decorator.apply(undefined, [{
    method: 'get',
    path: path
  }].concat(middlewares));
};

var post = exports.post = function post(path) {
  for (var _len3 = arguments.length, middlewares = Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    middlewares[_key3 - 1] = arguments[_key3];
  }

  return decorator.apply(undefined, [{
    method: 'post',
    path: path
  }].concat(middlewares));
};

var put = exports.put = function put(path) {
  for (var _len4 = arguments.length, middlewares = Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
    middlewares[_key4 - 1] = arguments[_key4];
  }

  return decorator.apply(undefined, [{
    method: 'put',
    path: path
  }].concat(middlewares));
};

var del = exports.del = function del(path) {
  for (var _len5 = arguments.length, middlewares = Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
    middlewares[_key5 - 1] = arguments[_key5];
  }

  return decorator.apply(undefined, [{
    method: 'del',
    path: path
  }].concat(middlewares));
};

var use = exports.use = function use(path) {
  for (var _len6 = arguments.length, middlewares = Array(_len6 > 1 ? _len6 - 1 : 0), _key6 = 1; _key6 < _len6; _key6++) {
    middlewares[_key6 - 1] = arguments[_key6];
  }

  return decorator.apply(undefined, [{
    method: 'use',
    path: path
  }].concat(middlewares));
};

var all = exports.all = function all(path) {
  for (var _len7 = arguments.length, middlewares = Array(_len7 > 1 ? _len7 - 1 : 0), _key7 = 1; _key7 < _len7; _key7++) {
    middlewares[_key7 - 1] = arguments[_key7];
  }

  return decorator.apply(undefined, [{
    method: 'all',
    path: path
  }].concat(middlewares));
};