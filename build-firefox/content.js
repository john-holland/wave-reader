/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "../log-view-machine/dist/index.esm.js":
/*!*********************************************!*\
  !*** ../log-view-machine/dist/index.esm.js ***!
  \*********************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
var react__WEBPACK_IMPORTED_MODULE_0___namespace_cache;
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ClientGenerator: () => (/* binding */ ClientGenerator),
/* harmony export */   DefaultStructuralConfig: () => (/* binding */ DefaultStructuralConfig),
/* harmony export */   EditorTomeConfig: () => (/* binding */ EditorTomeConfig),
/* harmony export */   ErrorBoundary: () => (/* binding */ ErrorBoundary),
/* harmony export */   FishBurgerTomeConfig: () => (/* binding */ FishBurgerTomeConfig),
/* harmony export */   HttpTomeAPI: () => (/* binding */ HttpTomeAPI),
/* harmony export */   LazyTomeManager: () => (/* binding */ LazyTomeManager),
/* harmony export */   MachineRouter: () => (/* binding */ MachineRouter),
/* harmony export */   ProxyMachineAdapter: () => (/* binding */ ProxyMachineAdapter),
/* harmony export */   RobotCopy: () => (/* binding */ RobotCopy),
/* harmony export */   Route: () => (/* binding */ Route),
/* harmony export */   RouteFallback: () => (/* binding */ RouteFallback),
/* harmony export */   StructuralRouter: () => (/* binding */ StructuralRouter),
/* harmony export */   StructuralSystem: () => (/* binding */ StructuralSystem),
/* harmony export */   StructuralTomeConnector: () => (/* binding */ StructuralTomeConnector),
/* harmony export */   TomeBase: () => (/* binding */ TomeBase),
/* harmony export */   TomeClient: () => (/* binding */ TomeClient),
/* harmony export */   TomeConnector: () => (/* binding */ TomeConnector),
/* harmony export */   TomeRenderer: () => (/* binding */ TomeRenderer),
/* harmony export */   Tracing: () => (/* binding */ Tracing),
/* harmony export */   ViewMachineAdapter: () => (/* binding */ ViewMachineAdapter),
/* harmony export */   ViewStack: () => (/* binding */ ViewStack),
/* harmony export */   ViewStateMachine: () => (/* binding */ ViewStateMachine),
/* harmony export */   createAssignAction: () => (/* binding */ createAssignAction),
/* harmony export */   createClientGenerator: () => (/* binding */ createClientGenerator),
/* harmony export */   createNamedAction: () => (/* binding */ createNamedAction),
/* harmony export */   createProxyRobotCopyStateMachine: () => (/* binding */ createProxyRobotCopyStateMachine),
/* harmony export */   createRobotCopy: () => (/* binding */ createRobotCopy),
/* harmony export */   createStructuralConfig: () => (/* binding */ createStructuralConfig),
/* harmony export */   createStructuralSystem: () => (/* binding */ createStructuralSystem),
/* harmony export */   createTomeClient: () => (/* binding */ createTomeClient),
/* harmony export */   createTomeConfig: () => (/* binding */ createTomeConfig),
/* harmony export */   createTomeConnector: () => (/* binding */ createTomeConnector),
/* harmony export */   createTracing: () => (/* binding */ createTracing),
/* harmony export */   createViewStateMachine: () => (/* binding */ createViewStateMachine),
/* harmony export */   useRouter: () => (/* binding */ useRouter),
/* harmony export */   useStructuralSystem: () => (/* binding */ useStructuralSystem),
/* harmony export */   useStructuralTomeConnector: () => (/* binding */ useStructuralTomeConnector),
/* harmony export */   useTomeRenderer: () => (/* binding */ useTomeRenderer)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js");
/* harmony import */ var _xstate_react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @xstate/react */ "../log-view-machine/node_modules/@xstate/react/es/useMachine.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/index.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/Machine.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/interpreter.js");
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");




function getDefaultExportFromNamespaceIfNotNamed(n) {
  return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}
var jsxRuntime = {
  exports: {}
};
var reactJsxRuntime_production_min = {};
var require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(/*#__PURE__*/ (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache || (react__WEBPACK_IMPORTED_MODULE_0___namespace_cache = __webpack_require__.t(react__WEBPACK_IMPORTED_MODULE_0__, 2))));

/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_production_min;
function requireReactJsxRuntime_production_min() {
  if (hasRequiredReactJsxRuntime_production_min) return reactJsxRuntime_production_min;
  hasRequiredReactJsxRuntime_production_min = 1;
  var f = require$$0,
    k = Symbol.for("react.element"),
    l = Symbol.for("react.fragment"),
    m = Object.prototype.hasOwnProperty,
    n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,
    p = {
      key: !0,
      ref: !0,
      __self: !0,
      __source: !0
    };
  function q(c, a, g) {
    var b,
      d = {},
      e = null,
      h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return {
      $$typeof: k,
      type: c,
      key: e,
      ref: h,
      props: d,
      _owner: n.current
    };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  return reactJsxRuntime_production_min;
}
var reactJsxRuntime_development = {};

/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var hasRequiredReactJsxRuntime_development;
function requireReactJsxRuntime_development() {
  if (hasRequiredReactJsxRuntime_development) return reactJsxRuntime_development;
  hasRequiredReactJsxRuntime_development = 1;
  if (true) {
    (function () {
      var React = require$$0;

      // ATTENTION
      // When adding new symbols to this file,
      // Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
      // The Symbol used to tag the ReactElement-like types.
      var REACT_ELEMENT_TYPE = Symbol.for('react.element');
      var REACT_PORTAL_TYPE = Symbol.for('react.portal');
      var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
      var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
      var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
      var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
      var REACT_CONTEXT_TYPE = Symbol.for('react.context');
      var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
      var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
      var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
      var REACT_MEMO_TYPE = Symbol.for('react.memo');
      var REACT_LAZY_TYPE = Symbol.for('react.lazy');
      var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
      var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
      var FAUX_ITERATOR_SYMBOL = '@@iterator';
      function getIteratorFn(maybeIterable) {
        if (maybeIterable === null || typeof maybeIterable !== 'object') {
          return null;
        }
        var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];
        if (typeof maybeIterator === 'function') {
          return maybeIterator;
        }
        return null;
      }
      var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
      function error(format) {
        {
          {
            for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
              args[_key2 - 1] = arguments[_key2];
            }
            printWarning('error', format, args);
          }
        }
      }
      function printWarning(level, format, args) {
        // When changing this logic, you might want to also
        // update consoleWithStackDev.www.js as well.
        {
          var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
          var stack = ReactDebugCurrentFrame.getStackAddendum();
          if (stack !== '') {
            format += '%s';
            args = args.concat([stack]);
          } // eslint-disable-next-line react-internal/safe-string-coercion

          var argsWithFormat = args.map(function (item) {
            return String(item);
          }); // Careful: RN currently depends on this prefix

          argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
          // breaks IE9: https://github.com/facebook/react/issues/13610
          // eslint-disable-next-line react-internal/no-production-logging

          Function.prototype.apply.call(console[level], console, argsWithFormat);
        }
      }

      // -----------------------------------------------------------------------------

      var enableScopeAPI = false; // Experimental Create Event Handle API.
      var enableCacheElement = false;
      var enableTransitionTracing = false; // No known bugs, but needs performance testing

      var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
      // stuff. Intended to enable React core members to more easily debug scheduling
      // issues in DEV builds.

      var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

      var REACT_MODULE_REFERENCE;
      {
        REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
      }
      function isValidElementType(type) {
        if (typeof type === 'string' || typeof type === 'function') {
          return true;
        } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).

        if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden || type === REACT_OFFSCREEN_TYPE || enableScopeAPI || enableCacheElement || enableTransitionTracing) {
          return true;
        }
        if (typeof type === 'object' && type !== null) {
          if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE ||
          // This needs to include all possible module reference object
          // types supported by any Flight configuration anywhere since
          // we don't know which Flight build this will end up being used
          // with.
          type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
            return true;
          }
        }
        return false;
      }
      function getWrappedName(outerType, innerType, wrapperName) {
        var displayName = outerType.displayName;
        if (displayName) {
          return displayName;
        }
        var functionName = innerType.displayName || innerType.name || '';
        return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
      } // Keep in sync with react-reconciler/getComponentNameFromFiber

      function getContextName(type) {
        return type.displayName || 'Context';
      } // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.

      function getComponentNameFromType(type) {
        if (type == null) {
          // Host root, text node or just invalid type.
          return null;
        }
        {
          if (typeof type.tag === 'number') {
            error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
          }
        }
        if (typeof type === 'function') {
          return type.displayName || type.name || null;
        }
        if (typeof type === 'string') {
          return type;
        }
        switch (type) {
          case REACT_FRAGMENT_TYPE:
            return 'Fragment';
          case REACT_PORTAL_TYPE:
            return 'Portal';
          case REACT_PROFILER_TYPE:
            return 'Profiler';
          case REACT_STRICT_MODE_TYPE:
            return 'StrictMode';
          case REACT_SUSPENSE_TYPE:
            return 'Suspense';
          case REACT_SUSPENSE_LIST_TYPE:
            return 'SuspenseList';
        }
        if (typeof type === 'object') {
          switch (type.$$typeof) {
            case REACT_CONTEXT_TYPE:
              var context = type;
              return getContextName(context) + '.Consumer';
            case REACT_PROVIDER_TYPE:
              var provider = type;
              return getContextName(provider._context) + '.Provider';
            case REACT_FORWARD_REF_TYPE:
              return getWrappedName(type, type.render, 'ForwardRef');
            case REACT_MEMO_TYPE:
              var outerName = type.displayName || null;
              if (outerName !== null) {
                return outerName;
              }
              return getComponentNameFromType(type.type) || 'Memo';
            case REACT_LAZY_TYPE:
              {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  return getComponentNameFromType(init(payload));
                } catch (x) {
                  return null;
                }
              }

            // eslint-disable-next-line no-fallthrough
          }
        }
        return null;
      }
      var assign = Object.assign;

      // Helpers to patch console.logs to avoid logging during side-effect free
      // replaying on render function. This currently only patches the object
      // lazily which won't cover if the log function was extracted eagerly.
      // We could also eagerly patch the method.
      var disabledDepth = 0;
      var prevLog;
      var prevInfo;
      var prevWarn;
      var prevError;
      var prevGroup;
      var prevGroupCollapsed;
      var prevGroupEnd;
      function disabledLog() {}
      disabledLog.__reactDisabledLog = true;
      function disableLogs() {
        {
          if (disabledDepth === 0) {
            /* eslint-disable react-internal/no-production-logging */
            prevLog = console.log;
            prevInfo = console.info;
            prevWarn = console.warn;
            prevError = console.error;
            prevGroup = console.group;
            prevGroupCollapsed = console.groupCollapsed;
            prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

            var props = {
              configurable: true,
              enumerable: true,
              value: disabledLog,
              writable: true
            }; // $FlowFixMe Flow thinks console is immutable.

            Object.defineProperties(console, {
              info: props,
              log: props,
              warn: props,
              error: props,
              group: props,
              groupCollapsed: props,
              groupEnd: props
            });
            /* eslint-enable react-internal/no-production-logging */
          }
          disabledDepth++;
        }
      }
      function reenableLogs() {
        {
          disabledDepth--;
          if (disabledDepth === 0) {
            /* eslint-disable react-internal/no-production-logging */
            var props = {
              configurable: true,
              enumerable: true,
              writable: true
            }; // $FlowFixMe Flow thinks console is immutable.

            Object.defineProperties(console, {
              log: assign({}, props, {
                value: prevLog
              }),
              info: assign({}, props, {
                value: prevInfo
              }),
              warn: assign({}, props, {
                value: prevWarn
              }),
              error: assign({}, props, {
                value: prevError
              }),
              group: assign({}, props, {
                value: prevGroup
              }),
              groupCollapsed: assign({}, props, {
                value: prevGroupCollapsed
              }),
              groupEnd: assign({}, props, {
                value: prevGroupEnd
              })
            });
            /* eslint-enable react-internal/no-production-logging */
          }
          if (disabledDepth < 0) {
            error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
          }
        }
      }
      var ReactCurrentDispatcher = ReactSharedInternals.ReactCurrentDispatcher;
      var prefix;
      function describeBuiltInComponentFrame(name, source, ownerFn) {
        {
          if (prefix === undefined) {
            // Extract the VM specific prefix used by each line.
            try {
              throw Error();
            } catch (x) {
              var match = x.stack.trim().match(/\n( *(at )?)/);
              prefix = match && match[1] || '';
            }
          } // We use the prefix to ensure our stacks line up with native stack frames.

          return '\n' + prefix + name;
        }
      }
      var reentry = false;
      var componentFrameCache;
      {
        var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
        componentFrameCache = new PossiblyWeakMap();
      }
      function describeNativeComponentFrame(fn, construct) {
        // If something asked for a stack inside a fake render, it should get ignored.
        if (!fn || reentry) {
          return '';
        }
        {
          var frame = componentFrameCache.get(fn);
          if (frame !== undefined) {
            return frame;
          }
        }
        var control;
        reentry = true;
        var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

        Error.prepareStackTrace = undefined;
        var previousDispatcher;
        {
          previousDispatcher = ReactCurrentDispatcher.current; // Set the dispatcher in DEV because this might be call in the render function
          // for warnings.

          ReactCurrentDispatcher.current = null;
          disableLogs();
        }
        try {
          // This should throw.
          if (construct) {
            // Something should be setting the props in the constructor.
            var Fake = function () {
              throw Error();
            }; // $FlowFixMe

            Object.defineProperty(Fake.prototype, 'props', {
              set: function () {
                // We use a throwing setter instead of frozen or non-writable props
                // because that won't throw in a non-strict mode function.
                throw Error();
              }
            });
            if (typeof Reflect === 'object' && Reflect.construct) {
              // We construct a different control for this case to include any extra
              // frames added by the construct call.
              try {
                Reflect.construct(Fake, []);
              } catch (x) {
                control = x;
              }
              Reflect.construct(fn, [], Fake);
            } else {
              try {
                Fake.call();
              } catch (x) {
                control = x;
              }
              fn.call(Fake.prototype);
            }
          } else {
            try {
              throw Error();
            } catch (x) {
              control = x;
            }
            fn();
          }
        } catch (sample) {
          // This is inlined manually because closure doesn't do it for us.
          if (sample && control && typeof sample.stack === 'string') {
            // This extracts the first frame from the sample that isn't also in the control.
            // Skipping one frame that we assume is the frame that calls the two.
            var sampleLines = sample.stack.split('\n');
            var controlLines = control.stack.split('\n');
            var s = sampleLines.length - 1;
            var c = controlLines.length - 1;
            while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
              // We expect at least one stack frame to be shared.
              // Typically this will be the root most one. However, stack frames may be
              // cut off due to maximum stack limits. In this case, one maybe cut off
              // earlier than the other. We assume that the sample is longer or the same
              // and there for cut off earlier. So we should find the root most frame in
              // the sample somewhere in the control.
              c--;
            }
            for (; s >= 1 && c >= 0; s--, c--) {
              // Next we find the first one that isn't the same which should be the
              // frame that called our sample function and the control.
              if (sampleLines[s] !== controlLines[c]) {
                // In V8, the first line is describing the message but other VMs don't.
                // If we're about to return the first line, and the control is also on the same
                // line, that's a pretty good indicator that our sample threw at same line as
                // the control. I.e. before we entered the sample frame. So we ignore this result.
                // This can happen if you passed a class to function component, or non-function.
                if (s !== 1 || c !== 1) {
                  do {
                    s--;
                    c--; // We may still have similar intermediate frames from the construct call.
                    // The next one that isn't the same should be our match though.

                    if (c < 0 || sampleLines[s] !== controlLines[c]) {
                      // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                      var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                      // but we have a user-provided "displayName"
                      // splice it in to make the stack more readable.

                      if (fn.displayName && _frame.includes('<anonymous>')) {
                        _frame = _frame.replace('<anonymous>', fn.displayName);
                      }
                      {
                        if (typeof fn === 'function') {
                          componentFrameCache.set(fn, _frame);
                        }
                      } // Return the line we found.

                      return _frame;
                    }
                  } while (s >= 1 && c >= 0);
                }
                break;
              }
            }
          }
        } finally {
          reentry = false;
          {
            ReactCurrentDispatcher.current = previousDispatcher;
            reenableLogs();
          }
          Error.prepareStackTrace = previousPrepareStackTrace;
        } // Fallback to just using the name if we couldn't make it throw.

        var name = fn ? fn.displayName || fn.name : '';
        var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';
        {
          if (typeof fn === 'function') {
            componentFrameCache.set(fn, syntheticFrame);
          }
        }
        return syntheticFrame;
      }
      function describeFunctionComponentFrame(fn, source, ownerFn) {
        {
          return describeNativeComponentFrame(fn, false);
        }
      }
      function shouldConstruct(Component) {
        var prototype = Component.prototype;
        return !!(prototype && prototype.isReactComponent);
      }
      function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {
        if (type == null) {
          return '';
        }
        if (typeof type === 'function') {
          {
            return describeNativeComponentFrame(type, shouldConstruct(type));
          }
        }
        if (typeof type === 'string') {
          return describeBuiltInComponentFrame(type);
        }
        switch (type) {
          case REACT_SUSPENSE_TYPE:
            return describeBuiltInComponentFrame('Suspense');
          case REACT_SUSPENSE_LIST_TYPE:
            return describeBuiltInComponentFrame('SuspenseList');
        }
        if (typeof type === 'object') {
          switch (type.$$typeof) {
            case REACT_FORWARD_REF_TYPE:
              return describeFunctionComponentFrame(type.render);
            case REACT_MEMO_TYPE:
              // Memo may contain any component type so we recursively resolve it.
              return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);
            case REACT_LAZY_TYPE:
              {
                var lazyComponent = type;
                var payload = lazyComponent._payload;
                var init = lazyComponent._init;
                try {
                  // Lazy may contain any component type so we recursively resolve it.
                  return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
                } catch (x) {}
              }
          }
        }
        return '';
      }
      var hasOwnProperty = Object.prototype.hasOwnProperty;
      var loggedTypeFailures = {};
      var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame.setExtraStackFrame(null);
          }
        }
      }
      function checkPropTypes(typeSpecs, values, location, componentName, element) {
        {
          // $FlowFixMe This is okay but Flow doesn't know it.
          var has = Function.call.bind(hasOwnProperty);
          for (var typeSpecName in typeSpecs) {
            if (has(typeSpecs, typeSpecName)) {
              var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
              // fail the render phase where it didn't fail before. So we log it.
              // After these have been cleaned up, we'll let them throw.

              try {
                // This is intentionally an invariant that gets caught. It's the same
                // behavior as without this statement except with a better message.
                if (typeof typeSpecs[typeSpecName] !== 'function') {
                  // eslint-disable-next-line react-internal/prod-error-codes
                  var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
                  err.name = 'Invariant Violation';
                  throw err;
                }
                error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
              } catch (ex) {
                error$1 = ex;
              }
              if (error$1 && !(error$1 instanceof Error)) {
                setCurrentlyValidatingElement(element);
                error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);
                setCurrentlyValidatingElement(null);
              }
              if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
                // Only monitor this failure once because there tends to be a lot of the
                // same error.
                loggedTypeFailures[error$1.message] = true;
                setCurrentlyValidatingElement(element);
                error('Failed %s type: %s', location, error$1.message);
                setCurrentlyValidatingElement(null);
              }
            }
          }
        }
      }
      var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

      function isArray(a) {
        return isArrayImpl(a);
      }

      /*
       * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
       * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
       *
       * The functions in this module will throw an easier-to-understand,
       * easier-to-debug exception with a clear errors message message explaining the
       * problem. (Instead of a confusing exception thrown inside the implementation
       * of the `value` object).
       */
      // $FlowFixMe only called in DEV, so void return is not possible.
      function typeName(value) {
        {
          // toStringTag is needed for namespaced types like Temporal.Instant
          var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
          var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
          return type;
        }
      } // $FlowFixMe only called in DEV, so void return is not possible.

      function willCoercionThrow(value) {
        {
          try {
            testStringCoercion(value);
            return false;
          } catch (e) {
            return true;
          }
        }
      }
      function testStringCoercion(value) {
        // If you ended up here by following an exception call stack, here's what's
        // happened: you supplied an object or symbol value to React (as a prop, key,
        // DOM attribute, CSS property, string ref, etc.) and when React tried to
        // coerce it to a string using `'' + value`, an exception was thrown.
        //
        // The most common types that will cause this exception are `Symbol` instances
        // and Temporal objects like `Temporal.Instant`. But any object that has a
        // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
        // exception. (Library authors do this to prevent users from using built-in
        // numeric operators like `+` or comparison operators like `>=` because custom
        // methods are needed to perform accurate arithmetic or comparison.)
        //
        // To fix the problem, coerce this object or symbol value to a string before
        // passing it to React. The most reliable way is usually `String(value)`.
        //
        // To find which value is throwing, check the browser or debugger console.
        // Before this exception was thrown, there should be `console.error` output
        // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
        // problem and how that type was used: key, atrribute, input value prop, etc.
        // In most cases, this console output also shows the component and its
        // ancestor components where the exception happened.
        //
        // eslint-disable-next-line react-internal/safe-string-coercion
        return '' + value;
      }
      function checkKeyStringCoercion(value) {
        {
          if (willCoercionThrow(value)) {
            error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));
            return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
          }
        }
      }
      var ReactCurrentOwner = ReactSharedInternals.ReactCurrentOwner;
      var RESERVED_PROPS = {
        key: true,
        ref: true,
        __self: true,
        __source: true
      };
      var specialPropKeyWarningShown;
      var specialPropRefWarningShown;
      var didWarnAboutStringRefs;
      {
        didWarnAboutStringRefs = {};
      }
      function hasValidRef(config) {
        {
          if (hasOwnProperty.call(config, 'ref')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.ref !== undefined;
      }
      function hasValidKey(config) {
        {
          if (hasOwnProperty.call(config, 'key')) {
            var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
            if (getter && getter.isReactWarning) {
              return false;
            }
          }
        }
        return config.key !== undefined;
      }
      function warnIfStringRefCannotBeAutoConverted(config, self) {
        {
          if (typeof config.ref === 'string' && ReactCurrentOwner.current && self && ReactCurrentOwner.current.stateNode !== self) {
            var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);
            if (!didWarnAboutStringRefs[componentName]) {
              error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', getComponentNameFromType(ReactCurrentOwner.current.type), config.ref);
              didWarnAboutStringRefs[componentName] = true;
            }
          }
        }
      }
      function defineKeyPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingKey = function () {
            if (!specialPropKeyWarningShown) {
              specialPropKeyWarningShown = true;
              error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
            }
          };
          warnAboutAccessingKey.isReactWarning = true;
          Object.defineProperty(props, 'key', {
            get: warnAboutAccessingKey,
            configurable: true
          });
        }
      }
      function defineRefPropWarningGetter(props, displayName) {
        {
          var warnAboutAccessingRef = function () {
            if (!specialPropRefWarningShown) {
              specialPropRefWarningShown = true;
              error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
            }
          };
          warnAboutAccessingRef.isReactWarning = true;
          Object.defineProperty(props, 'ref', {
            get: warnAboutAccessingRef,
            configurable: true
          });
        }
      }
      /**
       * Factory method to create a new React element. This no longer adheres to
       * the class pattern, so do not use new to call it. Also, instanceof check
       * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
       * if something is a React Element.
       *
       * @param {*} type
       * @param {*} props
       * @param {*} key
       * @param {string|object} ref
       * @param {*} owner
       * @param {*} self A *temporary* helper to detect places where `this` is
       * different from the `owner` when React.createElement is called, so that we
       * can warn. We want to get rid of owner and replace string `ref`s with arrow
       * functions, and as long as `this` and owner are the same, there will be no
       * change in behavior.
       * @param {*} source An annotation object (added by a transpiler or otherwise)
       * indicating filename, line number, and/or other information.
       * @internal
       */

      var ReactElement = function (type, key, ref, self, source, owner, props) {
        var element = {
          // This tag allows us to uniquely identify this as a React Element
          $$typeof: REACT_ELEMENT_TYPE,
          // Built-in properties that belong on the element
          type: type,
          key: key,
          ref: ref,
          props: props,
          // Record the component responsible for creating this element.
          _owner: owner
        };
        {
          // The validation flag is currently mutative. We put it on
          // an external backing store so that we can freeze the whole object.
          // This can be replaced with a WeakMap once they are implemented in
          // commonly used development environments.
          element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
          // the validation flag non-enumerable (where possible, which should
          // include every environment we run tests in), so the test framework
          // ignores it.

          Object.defineProperty(element._store, 'validated', {
            configurable: false,
            enumerable: false,
            writable: true,
            value: false
          }); // self and source are DEV only properties.

          Object.defineProperty(element, '_self', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: self
          }); // Two elements created in two different places should be considered
          // equal for testing purposes and therefore we hide it from enumeration.

          Object.defineProperty(element, '_source', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: source
          });
          if (Object.freeze) {
            Object.freeze(element.props);
            Object.freeze(element);
          }
        }
        return element;
      };
      /**
       * https://github.com/reactjs/rfcs/pull/107
       * @param {*} type
       * @param {object} props
       * @param {string} key
       */

      function jsxDEV(type, config, maybeKey, source, self) {
        {
          var propName; // Reserved names are extracted

          var props = {};
          var key = null;
          var ref = null; // Currently, key can be spread in as a prop. This causes a potential
          // issue if key is also explicitly declared (ie. <div {...props} key="Hi" />
          // or <div key="Hi" {...props} /> ). We want to deprecate key spread,
          // but as an intermediary step, we will use jsxDEV for everything except
          // <div {...props} key="Hi" />, because we aren't currently able to tell if
          // key is explicitly declared to be undefined or not.

          if (maybeKey !== undefined) {
            {
              checkKeyStringCoercion(maybeKey);
            }
            key = '' + maybeKey;
          }
          if (hasValidKey(config)) {
            {
              checkKeyStringCoercion(config.key);
            }
            key = '' + config.key;
          }
          if (hasValidRef(config)) {
            ref = config.ref;
            warnIfStringRefCannotBeAutoConverted(config, self);
          } // Remaining properties are added to a new props object

          for (propName in config) {
            if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
              props[propName] = config[propName];
            }
          } // Resolve default props

          if (type && type.defaultProps) {
            var defaultProps = type.defaultProps;
            for (propName in defaultProps) {
              if (props[propName] === undefined) {
                props[propName] = defaultProps[propName];
              }
            }
          }
          if (key || ref) {
            var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
            if (key) {
              defineKeyPropWarningGetter(props, displayName);
            }
            if (ref) {
              defineRefPropWarningGetter(props, displayName);
            }
          }
          return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
        }
      }
      var ReactCurrentOwner$1 = ReactSharedInternals.ReactCurrentOwner;
      var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;
      function setCurrentlyValidatingElement$1(element) {
        {
          if (element) {
            var owner = element._owner;
            var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
            ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
          } else {
            ReactDebugCurrentFrame$1.setExtraStackFrame(null);
          }
        }
      }
      var propTypesMisspellWarningShown;
      {
        propTypesMisspellWarningShown = false;
      }
      /**
       * Verifies the object is a ReactElement.
       * See https://reactjs.org/docs/react-api.html#isvalidelement
       * @param {?object} object
       * @return {boolean} True if `object` is a ReactElement.
       * @final
       */

      function isValidElement(object) {
        {
          return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
        }
      }
      function getDeclarationErrorAddendum() {
        {
          if (ReactCurrentOwner$1.current) {
            var name = getComponentNameFromType(ReactCurrentOwner$1.current.type);
            if (name) {
              return '\n\nCheck the render method of `' + name + '`.';
            }
          }
          return '';
        }
      }
      function getSourceInfoErrorAddendum(source) {
        {
          if (source !== undefined) {
            var fileName = source.fileName.replace(/^.*[\\\/]/, '');
            var lineNumber = source.lineNumber;
            return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
          }
          return '';
        }
      }
      /**
       * Warn if there's no key explicitly set on dynamic arrays of children or
       * object keys are not valid. This allows us to keep track of children between
       * updates.
       */

      var ownerHasKeyUseWarning = {};
      function getCurrentComponentErrorInfo(parentType) {
        {
          var info = getDeclarationErrorAddendum();
          if (!info) {
            var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
            if (parentName) {
              info = "\n\nCheck the top-level render call using <" + parentName + ">.";
            }
          }
          return info;
        }
      }
      /**
       * Warn if the element doesn't have an explicit key assigned to it.
       * This element is in an array. The array could grow and shrink or be
       * reordered. All children that haven't already been validated are required to
       * have a "key" property assigned to it. Error statuses are cached so a warning
       * will only be shown once.
       *
       * @internal
       * @param {ReactElement} element Element that requires a key.
       * @param {*} parentType element's parent's type.
       */

      function validateExplicitKey(element, parentType) {
        {
          if (!element._store || element._store.validated || element.key != null) {
            return;
          }
          element._store.validated = true;
          var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
          if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
            return;
          }
          ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
          // property, it may be the creator of the child that's responsible for
          // assigning it a key.

          var childOwner = '';
          if (element && element._owner && element._owner !== ReactCurrentOwner$1.current) {
            // Give the component that originally created this child.
            childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
          }
          setCurrentlyValidatingElement$1(element);
          error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);
          setCurrentlyValidatingElement$1(null);
        }
      }
      /**
       * Ensure that every element either is passed in a static location, in an
       * array with an explicit keys property defined, or in an object literal
       * with valid key property.
       *
       * @internal
       * @param {ReactNode} node Statically passed child of any type.
       * @param {*} parentType node's parent's type.
       */

      function validateChildKeys(node, parentType) {
        {
          if (typeof node !== 'object') {
            return;
          }
          if (isArray(node)) {
            for (var i = 0; i < node.length; i++) {
              var child = node[i];
              if (isValidElement(child)) {
                validateExplicitKey(child, parentType);
              }
            }
          } else if (isValidElement(node)) {
            // This element was passed in a valid location.
            if (node._store) {
              node._store.validated = true;
            }
          } else if (node) {
            var iteratorFn = getIteratorFn(node);
            if (typeof iteratorFn === 'function') {
              // Entry iterators used to provide implicit keys,
              // but now we print a separate warning for them later.
              if (iteratorFn !== node.entries) {
                var iterator = iteratorFn.call(node);
                var step;
                while (!(step = iterator.next()).done) {
                  if (isValidElement(step.value)) {
                    validateExplicitKey(step.value, parentType);
                  }
                }
              }
            }
          }
        }
      }
      /**
       * Given an element, validate that its props follow the propTypes definition,
       * provided by the type.
       *
       * @param {ReactElement} element
       */

      function validatePropTypes(element) {
        {
          var type = element.type;
          if (type === null || type === undefined || typeof type === 'string') {
            return;
          }
          var propTypes;
          if (typeof type === 'function') {
            propTypes = type.propTypes;
          } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE ||
          // Note: Memo only checks outer props here.
          // Inner props are checked in the reconciler.
          type.$$typeof === REACT_MEMO_TYPE)) {
            propTypes = type.propTypes;
          } else {
            return;
          }
          if (propTypes) {
            // Intentionally inside to avoid triggering lazy initializers:
            var name = getComponentNameFromType(type);
            checkPropTypes(propTypes, element.props, 'prop', name, element);
          } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
            propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

            var _name = getComponentNameFromType(type);
            error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
          }
          if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
            error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
          }
        }
      }
      /**
       * Given a fragment, validate that it can only be provided with fragment props
       * @param {ReactElement} fragment
       */

      function validateFragmentProps(fragment) {
        {
          var keys = Object.keys(fragment.props);
          for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (key !== 'children' && key !== 'key') {
              setCurrentlyValidatingElement$1(fragment);
              error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);
              setCurrentlyValidatingElement$1(null);
              break;
            }
          }
          if (fragment.ref !== null) {
            setCurrentlyValidatingElement$1(fragment);
            error('Invalid attribute `ref` supplied to `React.Fragment`.');
            setCurrentlyValidatingElement$1(null);
          }
        }
      }
      var didWarnAboutKeySpread = {};
      function jsxWithValidation(type, props, key, isStaticChildren, source, self) {
        {
          var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
          // succeed and there will likely be errors in render.

          if (!validType) {
            var info = '';
            if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
              info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
            }
            var sourceInfo = getSourceInfoErrorAddendum(source);
            if (sourceInfo) {
              info += sourceInfo;
            } else {
              info += getDeclarationErrorAddendum();
            }
            var typeString;
            if (type === null) {
              typeString = 'null';
            } else if (isArray(type)) {
              typeString = 'array';
            } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
              typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
              info = ' Did you accidentally export a JSX literal instead of a component?';
            } else {
              typeString = typeof type;
            }
            error('React.jsx: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
          }
          var element = jsxDEV(type, props, key, source, self); // The result can be nullish if a mock or a custom function is used.
          // TODO: Drop this when these are no longer allowed as the type argument.

          if (element == null) {
            return element;
          } // Skip key warning if the type isn't valid since our key validation logic
          // doesn't expect a non-string/function type and can throw confusing errors.
          // We don't want exception behavior to differ between dev and prod.
          // (Rendering will throw with a helpful message and as soon as the type is
          // fixed, the key warnings will appear.)

          if (validType) {
            var children = props.children;
            if (children !== undefined) {
              if (isStaticChildren) {
                if (isArray(children)) {
                  for (var i = 0; i < children.length; i++) {
                    validateChildKeys(children[i], type);
                  }
                  if (Object.freeze) {
                    Object.freeze(children);
                  }
                } else {
                  error('React.jsx: Static children should always be an array. ' + 'You are likely explicitly calling React.jsxs or React.jsxDEV. ' + 'Use the Babel transform instead.');
                }
              } else {
                validateChildKeys(children, type);
              }
            }
          }
          {
            if (hasOwnProperty.call(props, 'key')) {
              var componentName = getComponentNameFromType(type);
              var keys = Object.keys(props).filter(function (k) {
                return k !== 'key';
              });
              var beforeExample = keys.length > 0 ? '{key: someKey, ' + keys.join(': ..., ') + ': ...}' : '{key: someKey}';
              if (!didWarnAboutKeySpread[componentName + beforeExample]) {
                var afterExample = keys.length > 0 ? '{' + keys.join(': ..., ') + ': ...}' : '{}';
                error('A props object containing a "key" prop is being spread into JSX:\n' + '  let props = %s;\n' + '  <%s {...props} />\n' + 'React keys must be passed directly to JSX without using spread:\n' + '  let props = %s;\n' + '  <%s key={someKey} {...props} />', beforeExample, componentName, afterExample, componentName);
                didWarnAboutKeySpread[componentName + beforeExample] = true;
              }
            }
          }
          if (type === REACT_FRAGMENT_TYPE) {
            validateFragmentProps(element);
          } else {
            validatePropTypes(element);
          }
          return element;
        }
      } // These two functions exist to still get child warnings in dev
      // even with the prod transform. This means that jsxDEV is purely
      // opt-in behavior for better messages but that we won't stop
      // giving you warnings if you use production apis.

      function jsxWithValidationStatic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, true);
        }
      }
      function jsxWithValidationDynamic(type, props, key) {
        {
          return jsxWithValidation(type, props, key, false);
        }
      }
      var jsx = jsxWithValidationDynamic; // we may want to special case jsxs internally to take advantage of static children.
      // for now we can ship identical prod functions

      var jsxs = jsxWithValidationStatic;
      reactJsxRuntime_development.Fragment = REACT_FRAGMENT_TYPE;
      reactJsxRuntime_development.jsx = jsx;
      reactJsxRuntime_development.jsxs = jsxs;
    })();
  }
  return reactJsxRuntime_development;
}
if (false) // removed by dead control flow
{} else {
  jsxRuntime.exports = requireReactJsxRuntime_development();
}
var jsxRuntimeExports = jsxRuntime.exports;

/**
 * Helper function to create assign actions with better IDE support
 * @template TContext - The context type
 * @template TEvent - The event type
 * @param actionCreator - Function or object that creates the context update
 * @returns XState assign action
 *
 * @example
 * ```typescript
 * // Function-based assign
 * const addItem = createAssignAction<MyContext, AddItemEvent>((context, event) => ({
 *   items: [...context.items, event.payload]
 * }));
 *
 * // Object-based assign
 * const clearItems = createAssignAction<MyContext>({ items: [] });
 * ```
 */
function createAssignAction(actionCreator) {
  return (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)(actionCreator);
}
/**
 * Helper function to create named actions for better navigation
 * @template TContext - The context type
 * @template TEvent - The event type
 * @param name - The action name
 * @param action - The action implementation
 * @returns Named action object
 *
 * @example
 * ```typescript
 * const logAction = createNamedAction('logAction', (context, event) => {
 *   console.log('Action executed:', event.type);
 * });
 * ```
 */
function createNamedAction(name, action) {
  return {
    [name]: action
  };
}
class ViewStateMachine {
  constructor(config) {
    Object.defineProperty(this, "machine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "stateHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "serverStateHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "viewStack", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "renderContainer", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    }); // Container for wrapping rendered views
    Object.defineProperty(this, "logEntries", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "tomeConfig", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isTomeSynchronized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "subMachines", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    // Add RobotCopy support for incoming messages
    Object.defineProperty(this, "robotCopy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "incomingMessageHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    // Router support for inter-machine communication
    Object.defineProperty(this, "router", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "machineId", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "routedSend", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "parentMachine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    }); // Reference to parent machine for relative routing
    this.stateHandlers = new Map();
    this.tomeConfig = config.tomeConfig;
    this.machineId = config.machineId;
    // Set router if provided
    if (config.router) {
      this.setRouter(config.router);
    }
    // Create the XState machine
    const machineDefinition = (0,xstate__WEBPACK_IMPORTED_MODULE_3__.createMachine)({
      ...config.xstateConfig,
      predictableActionArguments: config.predictableActionArguments ?? true,
      // Default to true, but allow override
      on: {
        ...config.xstateConfig.on,
        // Add our custom events
        VIEW_ADDED: {
          actions: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)((context, event) => ({
            viewStack: [...(context.viewStack || []), event.payload]
          }))
        },
        VIEW_CLEARED: {
          actions: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)({
            viewStack: []
          })
        },
        LOG_ADDED: {
          actions: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)((context, event) => ({
            logEntries: [...(context.logEntries || []), event.payload]
          }))
        },
        // Sub-machine events
        SUB_MACHINE_CREATED: {
          actions: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)((context, event) => ({
            subMachines: {
              ...context.subMachines,
              [event.payload.id]: event.payload
            }
          }))
        },
        // RobotCopy incoming message events
        ROBOTCOPY_MESSAGE: {
          actions: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)((context, event) => ({
            robotCopyMessages: [...(context.robotCopyMessages || []), event.payload]
          }))
        }
      }
    }, {
      // Pass actions from config to options so XState can properly resolve them
      actions: config.xstateConfig.actions || {},
      // Wrap services to provide meta parameter with routedSend
      services: this.wrapServices(config.xstateConfig.services || {})
    });
    // Interpret the machine to create a service with send method
    this.machine = (0,xstate__WEBPACK_IMPORTED_MODULE_4__.interpret)(machineDefinition);
    // Register log state handlers if provided
    if (config.logStates) {
      Object.entries(config.logStates).forEach(([stateName, handler]) => {
        this.withState(stateName, handler);
      });
    }
    // Initialize sub-machines
    if (config.subMachines) {
      Object.entries(config.subMachines).forEach(([id, subConfig]) => {
        const subMachine = new ViewStateMachine(subConfig);
        this.subMachines.set(id, subMachine);
      });
    }
  }
  // Add RobotCopy support methods
  withRobotCopy(robotCopy) {
    this.robotCopy = robotCopy;
    this.setupRobotCopyIncomingHandling();
    return this;
  }
  setupRobotCopyIncomingHandling() {
    if (!this.robotCopy) return;
    // Listen for incoming messages from RobotCopy
    this.robotCopy.onResponse('default', response => {
      const {
        type,
        payload
      } = response;
      const handler = this.incomingMessageHandlers.get(type);
      if (handler) {
        handler(payload);
      } else {
        console.log('No handler found for incoming RobotCopy message type:', type);
      }
    });
  }
  registerRobotCopyHandler(eventType, handler) {
    this.incomingMessageHandlers.set(eventType, handler);
    return this;
  }
  handleRobotCopyMessage(message) {
    const {
      type,
      payload
    } = message;
    const handler = this.incomingMessageHandlers.get(type);
    if (handler) {
      handler(payload);
    }
  }
  // Fluent API methods
  /**
   * Register a state handler for the specified state
   * @param stateName - The name of the state to handle
   * @param handler - Function that handles the state logic
   * @returns This ViewStateMachine instance for method chaining
   *
   * @example
   * ```typescript
   * machine.withState('idle', async ({ state, model, log, view, transition }) => {
   *   await log('Entered idle state');
   *   view(<div>Idle UI</div>);
   * });
   * ```
   */
  withState(stateName, handler) {
    this.stateHandlers.set(stateName, handler);
    return this;
  }
  /**
   * Execute state handler with proper context
   * @param stateName - The name of the state to execute
   * @param context - The state context
   */
  async executeStateHandler(stateName, context) {
    const handler = this.stateHandlers.get(stateName);
    if (handler) {
      try {
        await handler(context);
      } catch (error) {
        console.error(`Error executing state handler for ${stateName}:`, error);
      }
    }
  }
  // Override for withState that registers message handlers
  withStateAndMessageHandler(stateName, handler, messageType, messageHandler) {
    this.stateHandlers.set(stateName, handler);
    // Register the message handler if RobotCopy is available
    if (this.robotCopy) {
      this.registerRobotCopyHandler(messageType, messageHandler);
    }
    return this;
  }
  withServerState(stateName, handler) {
    // This method is not directly implemented in the original class,
    // but the new_code suggests it should be added.
    // For now, we'll just add a placeholder.
    // In a real scenario, this would involve adding a new state handler type
    // or modifying the existing ones to support server-side rendering.
    // Since the new_code only provided the type, we'll just add a placeholder.
    // This will likely cause a type error until the actual implementation is added.
    // @ts-ignore // This is a placeholder, not a direct implementation
    this.serverStateHandlers.set(stateName, handler);
    return this;
  }
  // Sub-machine support
  withSubMachine(machineId, config) {
    const subMachine = new ViewStateMachine(config);
    this.subMachines.set(machineId, subMachine);
    return this;
  }
  getSubMachine(machineId) {
    return this.subMachines.get(machineId);
  }
  // Add missing method for StructuralTomeConnector compatibility
  subscribe(callback) {
    // Subscribe to state changes - the service must be started first
    if (this.machine && typeof this.machine.subscribe === 'function') {
      const subscription = this.machine.subscribe(callback);
      if (typeof subscription === 'function') {
        return subscription;
      }
      if (subscription && typeof subscription.unsubscribe === 'function') {
        return () => subscription.unsubscribe();
      }
    }
    // Fallback: create a simple subscription that calls the callback with current state
    const currentState = this.getState();
    callback(currentState);
    return () => {}; // Return empty unsubscribe function
  }
  // State context methods
  createStateContext(state, model) {
    return {
      state: state.value,
      model,
      transitions: state.history?.events || [],
      log: async (message, metadata) => {
        const logEntry = {
          id: Date.now().toString(),
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message,
          metadata: metadata || {}
        };
        this.logEntries.push(logEntry);
        this.machine.send({
          type: 'LOG_ADDED',
          payload: logEntry
        });
        console.log(`[${state.value}] ${message}`, metadata);
      },
      view: component => {
        if (!this.isTomeSynchronized && this.tomeConfig) {
          console.warn('Warning: view() called from Tome without synchronized ViewStateMachine. This may cause architectural issues.');
        }
        this.viewStack.push(component);
        this.machine.send({
          type: 'VIEW_ADDED',
          payload: component
        });
        return component;
      },
      clear: () => {
        this.viewStack = [];
        this.machine.send({
          type: 'VIEW_CLEARED'
        });
      },
      transition: to => {
        this.machine.send({
          type: 'TRANSITION',
          payload: {
            to
          }
        });
      },
      send: event => {
        this.machine.send(event);
      },
      on: (eventName, handler) => {
        // Register event handlers for state activations
        this.machine.on(eventName, handler);
      },
      // Sub-machine methods
      subMachine: (machineId, config) => {
        const subMachine = new ViewStateMachine(config);
        this.subMachines.set(machineId, subMachine);
        return subMachine;
      },
      getSubMachine: machineId => {
        return this.subMachines.get(machineId);
      },
      // GraphQL methods
      graphql: {
        query: async (query, variables) => {
          // This would integrate with a GraphQL client
          console.log('GraphQL Query:', query, variables);
          return {
            data: {
              query: 'mock-data'
            }
          };
        },
        mutation: async (mutation, variables) => {
          console.log('GraphQL Mutation:', mutation, variables);
          return {
            data: {
              mutation: 'mock-result'
            }
          };
        },
        subscription: async (subscription, variables) => {
          console.log('GraphQL Subscription:', subscription, variables);
          return {
            data: {
              subscription: 'mock-stream'
            }
          };
        }
      }
    };
  }
  // React hook for using the machine
  useViewStateMachine(initialModel) {
    const [state, send] = (0,_xstate_react__WEBPACK_IMPORTED_MODULE_1__.useMachine)(this.machine);
    const context = this.createStateContext(state, initialModel);
    // Execute state handler if exists
    react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
      this.executeStateHandler(state.value, context);
    }, [state.value]);
    return {
      state: state.value,
      context: state.context,
      send,
      logEntries: this.logEntries,
      viewStack: this.viewStack,
      subMachines: this.subMachines,
      // Expose fluent API methods
      log: context.log,
      view: context.view,
      clear: context.clear,
      transition: context.transition,
      subMachine: context.subMachine,
      getSubMachine: context.getSubMachine
    };
  }
  /**
   * Set the router for inter-machine communication
   * Creates a routedSend function for services to use
   */
  setRouter(router) {
    this.router = router;
    if (router) {
      this.routedSend = this.createRoutedSendForContext();
    }
  }
  /**
   * Create a routed send function that supports relative paths
   * This function is passed to services via the meta parameter
   */
  createRoutedSendForContext() {
    return async (target, event, payload) => {
      if (!this.router) {
        throw new Error('Router not available for this machine');
      }
      // Try relative resolution first (supports ., .., ./, ../)
      let machine = this.router.resolveRelative(target, this);
      // Fallback to absolute resolution
      if (!machine) {
        machine = this.router.resolve(target);
      }
      if (!machine) {
        throw new Error(`Machine ${target} not found via router`);
      }
      // Format event for XState: if payload provided, merge into event object
      const formattedEvent = payload ? {
        type: event,
        ...payload
      } : event;
      // Send the event to the resolved machine
      if (machine.send) {
        machine.send(formattedEvent);
        // Return a simple success response since XState send doesn't return a value
        return {
          success: true,
          event,
          target
        };
      }
      return {
        success: false,
        error: 'No send method'
      };
    };
  }
  /**
   * Wrap services to provide meta parameter with routedSend and other utilities
   */
  wrapServices(services) {
    const wrappedServices = {};
    for (const [serviceName, serviceImpl] of Object.entries(services)) {
      wrappedServices[serviceName] = async (context, event) => {
        const meta = {
          routedSend: this.routedSend,
          machineId: this.machineId,
          router: this.router,
          machine: this // Reference to current machine for relative routing
        };
        // Call original service with meta as third parameter
        return serviceImpl(context, event, meta);
      };
    }
    return wrappedServices;
  }
  // Event subscription methods for TomeConnector
  on(eventType, handler) {
    if (this.machine && typeof this.machine.on === 'function') {
      this.machine.on(eventType, handler);
    } else {
      console.warn('Machine not started or on method not available');
    }
  }
  // Direct send method for TomeConnector
  send(event, payload) {
    if (this.machine && typeof this.machine.send === 'function') {
      const formattedEvent = typeof event === 'string' ? payload ? {
        type: event,
        ...payload
      } : event : event;
      this.machine.send(formattedEvent);
    } else {
      console.warn('Machine not started or send method not available');
    }
  }
  // Start the machine service
  start() {
    if (this.machine && typeof this.machine.start === 'function') {
      this.machine.start();
    }
    return Promise.resolve();
  }
  // Get current state
  getState() {
    if (this.machine && typeof this.machine.getSnapshot === 'function') {
      return this.machine.getSnapshot();
    }
    return null;
  }
  // Stop the machine service
  stop() {
    if (this.machine && typeof this.machine.stop === 'function') {
      this.machine.stop();
    }
  }
  async executeServerState(stateName, model) {
    const handler = this.serverStateHandlers.get(stateName);
    if (handler) {
      const context = this.createServerStateContext(model);
      await handler(context);
      return context.renderedHtml || '';
    }
    return '';
  }
  createServerStateContext(model) {
    return {
      state: this.machine.initialState.value,
      model,
      transitions: [],
      log: async (message, metadata) => {
        const entry = {
          id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          level: 'INFO',
          message,
          metadata
        };
        this.logEntries.push(entry);
      },
      renderHtml: html => {
        return html;
      },
      clear: () => {
        // Server-side clear operation
      },
      transition: _to => {
        // Server-side transition
      },
      send: _event => {
        // Server-side event sending
      },
      on: (_eventName, _handler) => {
        // Server-side event handling
      },
      subMachine: (machineId, config) => {
        const subMachine = new ViewStateMachine(config);
        this.subMachines.set(machineId, subMachine);
        return subMachine;
      },
      getSubMachine: machineId => {
        return this.subMachines.get(machineId);
      },
      graphql: {
        query: async (_query, _variables) => {
          // Server-side GraphQL query
          return {};
        },
        mutation: async (_mutation, _variables) => {
          // Server-side GraphQL mutation
          return {};
        },
        subscription: async (_subscription, _variables) => {
          // Server-side GraphQL subscription
          return {};
        }
      },
      renderedHtml: ''
    };
  }
  // Compose with other ViewStateMachines
  compose(otherView) {
    // Merge state handlers
    otherView.stateHandlers.forEach((handler, stateName) => {
      this.stateHandlers.set(stateName, handler);
    });
    // Merge view stacks
    this.viewStack = [...this.viewStack, ...otherView.viewStack];
    // Merge sub-machines
    otherView.subMachines.forEach((subMachine, id) => {
      this.subMachines.set(id, subMachine);
    });
    return this;
  }
  // Synchronize with Tome
  synchronizeWithTome(tomeConfig) {
    this.tomeConfig = tomeConfig;
    this.isTomeSynchronized = true;
    return this;
  }
  /**
   * Set the render container for wrapping views
   * todo: consider using React.ComponentType<{ children?: React.ReactNode }>
   */
  setRenderContainer(container) {
    this.renderContainer = container;
    return this;
  }
  // Render the composed view
  render(model) {
    const composedView = jsxRuntimeExports.jsxs("div", {
      className: "composed-view",
      children: [this.viewStack.map((view, index) => jsxRuntimeExports.jsx("div", {
        className: "view-container",
        children: view
      }, index)), Array.from(this.subMachines.entries()).map(([id, subMachine]) => jsxRuntimeExports.jsx("div", {
        className: "sub-machine-container",
        children: subMachine.render(model)
      }, id))]
    });
    // If renderContainer is set, wrap the composed view
    if (this.renderContainer) {
      return react__WEBPACK_IMPORTED_MODULE_0__.createElement(this.renderContainer, {
        className: 'view-container'
      }, composedView);
    }
    return composedView;
  }
}
class ProxyMachine {
  constructor(robotCopy) {
    Object.defineProperty(this, "robotCopy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.robotCopy = robotCopy;
  }
  async send(event) {
    await this.robotCopy.sendMessage(event);
  }
}
class ProxyRobotCopyStateMachine extends ViewStateMachine {
  constructor(config) {
    super(config);
    Object.defineProperty(this, "proxyRobotCopy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "proxyIncomingMessageHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    this.proxyRobotCopy = config.robotCopy;
    // Initialize proxy machine for RobotCopy communication
    new ProxyMachine(this.proxyRobotCopy);
    // Set up incoming message handlers
    if (config.incomingMessageHandlers) {
      Object.entries(config.incomingMessageHandlers).forEach(([eventType, handler]) => {
        this.proxyIncomingMessageHandlers.set(eventType, handler);
      });
    }
    // Set up RobotCopy to handle incoming messages
    this.setupIncomingMessageHandling();
  }
  setupIncomingMessageHandling() {
    // Listen for incoming messages from RobotCopy
    this.proxyRobotCopy.onResponse('default', response => {
      const {
        type,
        payload
      } = response;
      const handler = this.proxyIncomingMessageHandlers.get(type);
      if (handler) {
        handler(payload);
      } else {
        console.log('No handler found for incoming message type:', type);
      }
    });
  }
  async send(event) {
    // Send outgoing message through RobotCopy
    await this.proxyRobotCopy.sendMessage(event);
  }
  // Add method to register incoming message handlers
  registerIncomingHandler(eventType, handler) {
    this.proxyIncomingMessageHandlers.set(eventType, handler);
  }
  // Add method to handle incoming messages manually
  handleIncomingMessage(message) {
    const {
      type,
      payload
    } = message;
    const handler = this.proxyIncomingMessageHandlers.get(type);
    if (handler) {
      handler(payload);
    }
  }
  render(_model) {
    throw new Error('ProxyStateMachine does not support rendering');
  }
  useViewStateMachine(_initialModel) {
    throw new Error('ProxyStateMachine does not support useViewStateMachine');
  }
  compose(_otherView) {
    throw new Error('ProxyStateMachine does not support compose');
  }
  synchronizeWithTome(_tomeConfig) {
    throw new Error('ProxyStateMachine does not support synchronizeWithTome');
  }
  withState(stateName, handler) {
    this.registerIncomingHandler(stateName, handler);
    return this;
  }
}
function createProxyRobotCopyStateMachine(config, predictableActionArguments) {
  const fullConfig = {
    ...config,
    ...(predictableActionArguments !== undefined && {
      predictableActionArguments
    })
  };
  return new ProxyRobotCopyStateMachine(fullConfig);
}
function createViewStateMachine(config, predictableActionArguments) {
  const fullConfig = {
    ...config,
    ...(predictableActionArguments !== undefined && {
      predictableActionArguments
    })
  };
  return new ViewStateMachine(fullConfig);
}

/**
 * ViewStack
 *
 * Manages a stack of React components for stateless rendering.
 * Supports clearing and composing views for the Tome architecture.
 */
class ViewStack {
  constructor() {
    Object.defineProperty(this, "stack", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: []
    });
    Object.defineProperty(this, "currentView", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: ''
    });
    Object.defineProperty(this, "lastViewCleared", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
  }
  /**
   * Append a new view to the stack
   */
  append(key, component) {
    this.stack.push({
      key,
      component,
      timestamp: Date.now()
    });
    this.currentView = key;
  }
  /**
   * Clear the entire view stack
   * Resets to empty state and updates lastViewCleared timestamp
   */
  clear() {
    this.stack = [];
    this.currentView = '';
    this.lastViewCleared = Date.now();
  }
  /**
   * Compose all views in the stack into a single React fragment
   */
  compose() {
    if (this.stack.length === 0) {
      return null;
    }
    if (this.stack.length === 1) {
      return this.stack[0].component;
    }
    // Compose multiple views with unique keys
    return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, ...this.stack.map((entry, index) => react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, {
      key: `${entry.key}-${entry.timestamp}-${index}`
    }, entry.component)));
  }
  /**
   * Get the current view key
   */
  getCurrentView() {
    return this.currentView;
  }
  /**
   * Get the timestamp of the last view clear operation
   */
  getLastViewCleared() {
    return this.lastViewCleared;
  }
  /**
   * Get the number of views in the stack
   */
  getStackSize() {
    return this.stack.length;
  }
  /**
   * Check if the stack is empty
   */
  isEmpty() {
    return this.stack.length === 0;
  }
  /**
   * Get a copy of the current stack (for debugging)
   */
  getStack() {
    return [...this.stack];
  }
}

/**
 * MachineRouter
 *
 * Handles routing messages between machines using path-based addressing
 */
class MachineRouter {
  constructor() {
    Object.defineProperty(this, "machines", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    // Router for managing hierarchical machine communication
  }
  /**
   * Register a machine with a path
   */
  register(path, machine) {
    this.machines.set(path, machine);
  }
  /**
   * Unregister a machine
   */
  unregister(path) {
    this.machines.delete(path);
  }
  /**
   * Resolve a path to a machine (absolute paths only)
   * For relative paths, use resolveRelative() with a context machine
   */
  resolve(path) {
    return this.machines.get(path) || undefined;
  }
  /**
   * Resolve hierarchical paths like "Parent.Child.GrandChild"
   */
  resolveHierarchical(path) {
    const parts = path.split('.');
    let current = this.machines.get(parts[0]);
    for (let i = 1; i < parts.length && current; i++) {
      // Try to get sub-machine
      if (current.subMachines && current.subMachines.get) {
        current = current.subMachines.get(parts[i]);
      } else if (current.router && current.router.machines) {
        current = current.router.machines.get(parts[i]);
      } else {
        return null;
      }
    }
    return current;
  }
  /**
   * Resolve relative paths from a context machine
   * Supports: '.', '..', './', '../', '../../', etc.
   */
  resolveRelative(path, contextMachine) {
    // Handle absolute paths (no . or ..)
    if (!path.startsWith('.')) {
      return this.resolveHierarchical(path);
    }
    // Handle current machine reference (.)
    if (path === '.') {
      return contextMachine;
    }
    // Handle parent machine reference (..)
    if (path === '..') {
      return contextMachine.parentMachine || null;
    }
    // Handle relative child (./ prefix)
    if (path.startsWith('./')) {
      const subPath = path.substring(2);
      return this.navigateFromMachine(contextMachine, subPath);
    }
    // Handle relative parent (../ prefix)
    if (path.startsWith('../')) {
      let remainingPath = path;
      let currentMachine = contextMachine;
      while (remainingPath.startsWith('../') || remainingPath.startsWith('..')) {
        remainingPath = remainingPath.startsWith('../') ? remainingPath.substring(3) : remainingPath.substring(2);
        if (currentMachine.parentMachine) {
          currentMachine = currentMachine.parentMachine;
        } else {
          console.warn(`🌊 TomeBase: No parent available for relative path: ${path} fall back to absolute resolution for: ${remainingPath}`);
          // No parent available, fall back to absolute resolution
          return remainingPath ? this.resolveHierarchical(remainingPath) : null;
        }
      }
      if (!remainingPath) {
        return currentMachine;
      }
      return this.navigateFromMachine(currentMachine, remainingPath);
    }
    return null;
  }
  /**
   * Navigate from a specific machine following a path
   * Supports '/', '.', and '..' as path separators
   */
  navigateFromMachine(machine, path) {
    if (!path) return machine;
    const parts = path.split('/');
    let current = machine;
    for (const part of parts) {
      if (!part || part === '.') {
        continue; // Empty or stay at current
      } else if (part === '..') {
        current = current.parentMachine;
        if (!current) return null;
      } else {
        // Navigate to sub-machine
        if (current.subMachines && current.subMachines.get) {
          current = current.subMachines.get(part);
        } else if (current.router && current.router.machines) {
          current = current.router.machines.get(part);
        } else {
          return null;
        }
        if (!current) return null;
      }
    }
    return current;
  }
  /**
   * Send a message to a machine at the specified path
   */
  send(path, event, data) {
    const machine = this.resolve(path);
    if (!machine) {
      console.warn(`🌊 TomeBase: Cannot resolve path "${path}"`);
      return Promise.resolve({
        success: false,
        error: `Path not found: ${path}`
      });
    }
    // If machine has a send method, use it
    if (machine.send && typeof machine.send === 'function') {
      try {
        const result = machine.send({
          type: event,
          ...data
        });
        return Promise.resolve(result);
      } catch (error) {
        console.error(`🌊 TomeBase: Error sending to "${path}":`, error);
        return Promise.resolve({
          success: false,
          error
        });
      }
    }
    console.warn(`🌊 TomeBase: Machine at "${path}" has no send method`);
    return Promise.resolve({
      success: false,
      error: 'No send method'
    });
  }
}
/**
 * TomeBase
 *
 * Base class for all Tome modules with observable pattern and view stack integration
 */
class TomeBase {
  constructor() {
    Object.defineProperty(this, "viewStack", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "viewKeyObservers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "currentViewKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "router", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "machine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "childTomes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.viewStack = new ViewStack();
    this.viewKeyObservers = new Set();
    this.currentViewKey = 'initial';
    this.router = new MachineRouter();
    this.machine = null;
    this.childTomes = new Map();
  }
  /**
   * Get the current view key
   */
  getViewKey() {
    return this.currentViewKey;
  }
  /**
   * Observe view key changes
   * Returns an unsubscribe function
   */
  observeViewKey(callback) {
    this.viewKeyObservers.add(callback);
    // Immediately call with current value
    callback(this.currentViewKey);
    // Return unsubscribe function
    return () => {
      this.viewKeyObservers.delete(callback);
    };
  }
  /**
   * Update the view key and notify observers
   */
  updateViewKey(newKey) {
    if (this.currentViewKey !== newKey) {
      this.currentViewKey = newKey;
      this.notifyViewKeyObservers();
    }
  }
  /**
   * Notify all view key observers
   */
  notifyViewKeyObservers() {
    this.viewKeyObservers.forEach(observer => {
      try {
        observer(this.currentViewKey);
      } catch (error) {
        console.error('🌊 TomeBase: Error in view key observer:', error);
      }
    });
  }
  /**
   * Clear the view stack
   */
  clear() {
    this.viewStack.clear();
    this.updateViewKey(`cleared-${Date.now()}`);
  }
  /**
   * Append a view to the stack
   */
  appendView(key, component) {
    this.viewStack.append(key, component);
    this.updateViewKey(key);
  }
  /**
   * Render the composed view from the view stack
   * Note: For ViewStateMachines, rendering is handled by the view() function in withState
   * This method returns the composed view stack for display
   */
  render() {
    // If we have a machine with a render method, use it
    if (this.machine && typeof this.machine.render === 'function') {
      return this.machine.render();
    }
    // Otherwise compose from view stack
    return this.viewStack.compose();
  }
  /**
   * Register a child tome
   */
  registerChild(path, tome) {
    this.childTomes.set(path, tome);
    this.router.register(path, tome);
    // Note: Parent-child relationships are handled via machine.parentMachine property
  }
  /**
   * Unregister a child tome
   */
  unregisterChild(path) {
    this.childTomes.delete(path);
    this.router.unregister(path);
  }
  /**
   * Send a message using hierarchical routing
   */
  send(path, event, data) {
    return this.router.send(path, event, data);
  }
  /**
   * Cleanup resources
   */
  cleanup() {
    this.viewKeyObservers.clear();
    this.viewStack.clear();
    this.childTomes.forEach(child => child.cleanup());
    this.childTomes.clear();
  }
  /**
   * Get debug information about the tome
   */
  getDebugInfo() {
    return {
      currentViewKey: this.currentViewKey,
      viewStackSize: this.viewStack.getStackSize(),
      observerCount: this.viewKeyObservers.size,
      childTomes: Array.from(this.childTomes.keys()),
      lastViewCleared: this.viewStack.getLastViewCleared()
    };
  }
}
class Tracing {
  constructor() {
    Object.defineProperty(this, "messageHistory", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "traceMap", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
  }
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  generateTraceId() {
    return `trace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  generateSpanId() {
    return `span_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  trackMessage(messageId, traceId, spanId, metadata) {
    const message = {
      messageId,
      traceId,
      spanId,
      timestamp: new Date().toISOString(),
      backend: metadata.backend || 'node',
      action: metadata.action || 'unknown',
      data: metadata.data
    };
    this.messageHistory.set(messageId, message);
    if (!this.traceMap.has(traceId)) {
      this.traceMap.set(traceId, []);
    }
    this.traceMap.get(traceId).push(messageId);
    return message;
  }
  getMessage(messageId) {
    return this.messageHistory.get(messageId);
  }
  getTraceMessages(traceId) {
    const messageIds = this.traceMap.get(traceId) || [];
    return messageIds.map(id => this.messageHistory.get(id)).filter(Boolean);
  }
  getFullTrace(traceId) {
    const messages = this.getTraceMessages(traceId);
    return {
      traceId,
      messages,
      startTime: messages[0]?.timestamp,
      endTime: messages[messages.length - 1]?.timestamp,
      backend: messages[0]?.backend
    };
  }
  getMessageHistory() {
    return Array.from(this.messageHistory.values());
  }
  getTraceIds() {
    return Array.from(this.traceMap.keys());
  }
  clearHistory() {
    this.messageHistory.clear();
    this.traceMap.clear();
  }
  // Create tracing headers for HTTP requests
  createTracingHeaders(traceId, spanId, messageId, enableDataDog = false) {
    const headers = {
      'x-trace-id': traceId,
      'x-span-id': spanId,
      'x-message-id': messageId
    };
    if (enableDataDog) {
      headers['x-datadog-trace-id'] = traceId;
      headers['x-datadog-parent-id'] = spanId;
      headers['x-datadog-sampling-priority'] = '1';
    }
    return headers;
  }
}
function createTracing() {
  return new Tracing();
}
class TomeConnector {
  constructor(robotCopy) {
    Object.defineProperty(this, "connections", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "robotCopy", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "connectionMetrics", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "healthCheckInterval", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isInitialized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    this.robotCopy = robotCopy;
    if (robotCopy) {
      this.initializeRobotCopyIntegration();
    }
  }
  async initializeRobotCopyIntegration() {
    if (!this.robotCopy || this.isInitialized) return;
    try {
      // Register TomeConnector with RobotCopy for monitoring
      this.robotCopy.registerMachine('tome-connector', this, {
        type: 'connector',
        capabilities: ['event-routing', 'state-sync', 'network-topology'],
        version: '1.0.0'
      });
      // Set up periodic health checks if enabled
      const enableHealthMonitoring = await this.robotCopy.isEnabled('enable-health-monitoring');
      if (enableHealthMonitoring) {
        this.startHealthMonitoring();
      }
      this.isInitialized = true;
      console.log('TomeConnector RobotCopy integration initialized successfully');
    } catch (error) {
      console.warn('Failed to initialize RobotCopy integration:', error);
    }
  }
  startHealthMonitoring() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.healthCheckInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }
  async performHealthCheck() {
    if (!this.robotCopy) return;
    try {
      const connections = this.getConnections();
      const healthStatus = {
        totalConnections: connections.length,
        activeConnections: connections.filter(conn => conn.sourceTome.getState() && conn.targetTome.getState()).length,
        degradedConnections: connections.filter(conn => conn.healthStatus === 'degraded').length,
        unhealthyConnections: connections.filter(conn => conn.healthStatus === 'unhealthy').length,
        timestamp: new Date().toISOString(),
        connectorId: this.robotCopy.generateMessageId()
      };
      // Send health status through RobotCopy
      await this.robotCopy.sendMessage('health-check', healthStatus);
      // Update connection health statuses
      connections.forEach(connection => {
        this.updateConnectionHealth(connection.id);
      });
    } catch (error) {
      console.warn('Health check failed:', error);
    }
  }
  updateConnectionHealth(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) return;
    try {
      const sourceState = connection.sourceTome.getState();
      const targetState = connection.targetTome.getState();
      if (!sourceState || !targetState) {
        connection.healthStatus = 'unhealthy';
      } else if (Date.now() - new Date(connection.lastActivity).getTime() > 60000) {
        connection.healthStatus = 'degraded';
      } else {
        connection.healthStatus = 'healthy';
      }
      connection.lastActivity = new Date().toISOString();
    } catch (error) {
      connection.healthStatus = 'unhealthy';
      connection.lastActivity = new Date().toISOString();
    }
  }
  // Connect two Tomes with bidirectional state and event flow
  async connect(sourceTome, targetTome, config = {}) {
    const connectionId = `connection_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    // Generate tracing context if RobotCopy is available
    let traceId;
    let spanId;
    if (this.robotCopy && config.enableTracing !== false) {
      traceId = config.customTraceId || this.robotCopy.generateTraceId();
      spanId = this.robotCopy.generateSpanId();
      // Track connection creation
      this.robotCopy.trackMessage(connectionId, traceId, spanId, {
        action: 'connection_created',
        data: {
          source: sourceTome.constructor.name,
          target: targetTome.constructor.name,
          config,
          timestamp: new Date().toISOString()
        }
      });
    }
    const connection = {
      id: connectionId,
      sourceTome,
      targetTome,
      eventMapping: new Map(Object.entries(config.eventMapping || {})),
      stateMapping: new Map(Object.entries(config.stateMapping || {})),
      bidirectional: config.bidirectional ?? true,
      filters: config.filters,
      transformers: config.transformers,
      traceId,
      spanId,
      createdAt: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      healthStatus: 'healthy'
    };
    this.connections.set(connectionId, connection);
    await this.setupConnection(connection);
    console.log(`Connected Tomes: ${sourceTome.constructor.name} <-> ${targetTome.constructor.name}`);
    return connectionId;
  }
  async setupConnection(connection) {
    const {
      sourceTome,
      targetTome,
      eventMapping,
      stateMapping,
      bidirectional,
      filters,
      transformers
    } = connection;
    // Forward events from source to target
    await this.setupEventForwarding(sourceTome, targetTome, eventMapping, 'forward', filters, transformers, connection);
    // Forward events from target to source (if bidirectional)
    if (bidirectional) {
      await this.setupEventForwarding(targetTome, sourceTome, this.reverseMap(eventMapping), 'backward', filters, transformers, connection);
    }
    // Forward state changes
    await this.setupStateForwarding(sourceTome, targetTome, stateMapping, 'forward', filters, transformers, connection);
    if (bidirectional) {
      await this.setupStateForwarding(targetTome, sourceTome, this.reverseMap(stateMapping), 'backward', filters, transformers, connection);
    }
  }
  async setupEventForwarding(sourceTome, targetTome, eventMapping, direction, filters, transformers, connection) {
    // Subscribe to source Tome's events
    sourceTome.on('event', async event => {
      // Check if event should be filtered
      if (filters?.events && !filters.events.includes(event.type)) {
        return;
      }
      // Check RobotCopy feature toggles for intelligent routing
      if (this.robotCopy) {
        try {
          const enableEventRouting = await this.robotCopy.isEnabled('enable-event-routing');
          if (!enableEventRouting) {
            console.log('Event routing disabled by feature toggle');
            return;
          }
        } catch (error) {
          console.warn('Failed to check event routing toggle:', error);
        }
      }
      // Transform event if transformer is provided
      let transformedEvent = event;
      if (transformers?.eventTransformer) {
        transformedEvent = transformers.eventTransformer(event, direction);
      }
      // Add RobotCopy tracing context if available
      if (this.robotCopy && connection) {
        const eventTraceId = this.robotCopy.generateTraceId();
        const eventSpanId = this.robotCopy.generateSpanId();
        transformedEvent = {
          ...transformedEvent,
          _traceId: eventTraceId,
          _spanId: eventSpanId,
          _connectionId: connection.id,
          _direction: direction,
          _timestamp: new Date().toISOString()
        };
        // Track the event
        this.robotCopy.trackMessage(`event_${event.type}_${Date.now()}`, eventTraceId, eventSpanId, {
          action: 'event_forwarded',
          data: {
            eventType: event.type,
            source: sourceTome.constructor.name,
            target: targetTome.constructor.name,
            direction,
            connectionId: connection.id
          }
        });
      }
      // Map event type if mapping exists
      const mappedEventType = eventMapping.get(transformedEvent.type) || transformedEvent.type;
      // Forward to target Tome
      targetTome.send({
        type: mappedEventType,
        ...transformedEvent,
        _forwarded: true,
        _direction: direction,
        _source: sourceTome.constructor.name
      });
      // Update connection activity
      if (connection) {
        connection.lastActivity = new Date().toISOString();
      }
    });
  }
  async setupStateForwarding(sourceTome, targetTome, stateMapping, direction, filters, transformers, connection) {
    // Subscribe to source Tome's state changes
    sourceTome.on('stateChange', async event => {
      const newState = event.newState || event.state;
      const oldState = event.oldState || event.previousState;
      // Check if state should be filtered
      if (filters?.states) {
        const hasRelevantState = filters.states.some(statePath => this.getStateValue(newState, statePath) !== this.getStateValue(oldState, statePath));
        if (!hasRelevantState) {
          return;
        }
      }
      // Check RobotCopy feature toggles for state synchronization
      if (this.robotCopy) {
        try {
          const enableStateSync = await this.robotCopy.isEnabled('enable-state-sync');
          if (!enableStateSync) {
            console.log('State synchronization disabled by feature toggle');
            return;
          }
        } catch (error) {
          console.warn('Failed to check state sync toggle:', error);
        }
      }
      // Transform state if transformer is provided
      let transformedState = newState;
      if (transformers?.stateTransformer) {
        transformedState = transformers.stateTransformer(newState, direction);
      }
      // Add RobotCopy backend-aware state transformation
      if (this.robotCopy) {
        try {
          const backendType = await this.robotCopy.getBackendType();
          transformedState = await this.transformStateForBackend(transformedState, backendType);
        } catch (error) {
          console.warn('Failed to transform state for backend:', error);
        }
      }
      // Map state paths and update target Tome's context
      const stateUpdates = {};
      stateMapping.forEach((targetPath, sourcePath) => {
        const sourceValue = this.getStateValue(transformedState, sourcePath);
        if (sourceValue !== undefined) {
          stateUpdates[targetPath] = sourceValue;
        }
      });
      // Update target Tome's context
      if (Object.keys(stateUpdates).length > 0) {
        const syncEvent = {
          type: 'SYNC_STATE',
          updates: stateUpdates,
          _forwarded: true,
          _direction: direction,
          _source: sourceTome.constructor.name
        };
        // Add RobotCopy tracing if available
        if (this.robotCopy && connection) {
          const stateTraceId = this.robotCopy.generateTraceId();
          const stateSpanId = this.robotCopy.generateSpanId();
          Object.assign(syncEvent, {
            _traceId: stateTraceId,
            _spanId: stateSpanId,
            _connectionId: connection.id,
            _timestamp: new Date().toISOString()
          });
          // Track the state sync
          this.robotCopy.trackMessage(`state_sync_${Date.now()}`, stateTraceId, stateSpanId, {
            action: 'state_synchronized',
            data: {
              updates: Object.keys(stateUpdates),
              source: sourceTome.constructor.name,
              target: targetTome.constructor.name,
              direction,
              connectionId: connection.id
            }
          });
        }
        targetTome.send(syncEvent);
      }
      // Update connection activity
      if (connection) {
        connection.lastActivity = new Date().toISOString();
      }
    });
  }
  async transformStateForBackend(state, backendType) {
    // Transform state based on backend capabilities
    switch (backendType) {
      case 'kotlin':
        // Kotlin backend might prefer different data structures
        return this.transformStateForKotlin(state);
      case 'node':
        // Node backend might prefer different data structures
        return this.transformStateForNode(state);
      default:
        return state;
    }
  }
  transformStateForKotlin(state) {
    // Transform state for Kotlin backend preferences
    // This could include type conversions, null handling, etc.
    return state;
  }
  transformStateForNode(state) {
    // Transform state for Node backend preferences
    // This could include different serialization, etc.
    return state;
  }
  getStateValue(state, path) {
    return path.split('.').reduce((obj, key) => obj?.[key], state);
  }
  reverseMap(map) {
    const reversed = new Map();
    map.forEach((value, key) => {
      reversed.set(value, key);
    });
    return reversed;
  }
  // Disconnect Tomes
  async disconnect(connectionId) {
    const connection = this.connections.get(connectionId);
    if (!connection) {
      return false;
    }
    // Track disconnection with RobotCopy if available
    if (this.robotCopy) {
      try {
        const traceId = this.robotCopy.generateTraceId();
        const spanId = this.robotCopy.generateSpanId();
        this.robotCopy.trackMessage(`disconnect_${connectionId}`, traceId, spanId, {
          action: 'connection_disconnected',
          data: {
            connectionId,
            source: connection.sourceTome.constructor.name,
            target: connection.targetTome.constructor.name,
            duration: Date.now() - new Date(connection.createdAt).getTime(),
            timestamp: new Date().toISOString()
          }
        });
      } catch (error) {
        console.warn('Failed to track disconnection:', error);
      }
    }
    // Clean up event listeners
    // Note: In a real implementation, you'd need to store and remove specific listeners
    this.connections.delete(connectionId);
    console.log(`Disconnected Tomes: ${connection.sourceTome.constructor.name} <-> ${connection.targetTome.constructor.name}`);
    return true;
  }
  // Get all connections
  getConnections() {
    return Array.from(this.connections.values());
  }
  // Get connections for a specific Tome
  getConnectionsForTome(tome) {
    return this.getConnections().filter(conn => conn.sourceTome === tome || conn.targetTome === tome);
  }
  // Create a network of connected Tomes
  async createNetwork(tomes, config = {}) {
    const connectionIds = [];
    for (let i = 0; i < tomes.length - 1; i++) {
      const connectionId = await this.connect(tomes[i], tomes[i + 1], config);
      connectionIds.push(connectionId);
    }
    // Connect last Tome back to first (ring topology)
    if (tomes.length > 2) {
      const ringConnectionId = await this.connect(tomes[tomes.length - 1], tomes[0], config);
      connectionIds.push(ringConnectionId);
    }
    return connectionIds;
  }
  // Create a hub-and-spoke network
  async createHubNetwork(hubTome, spokeTomes, config = {}) {
    const connectionIds = [];
    for (const spokeTome of spokeTomes) {
      const connectionId = await this.connect(hubTome, spokeTome, config);
      connectionIds.push(connectionId);
    }
    return connectionIds;
  }
  // Broadcast event to all connected Tomes
  async broadcastEvent(event, sourceTome) {
    const connections = this.getConnectionsForTome(sourceTome);
    // Add RobotCopy tracing if available
    if (this.robotCopy) {
      const traceId = this.robotCopy.generateTraceId();
      const spanId = this.robotCopy.generateSpanId();
      event = {
        ...event,
        _traceId: traceId,
        _spanId: spanId,
        _broadcasted: true,
        _timestamp: new Date().toISOString()
      };
      // Track the broadcast
      this.robotCopy.trackMessage(`broadcast_${event.type}_${Date.now()}`, traceId, spanId, {
        action: 'event_broadcasted',
        data: {
          eventType: event.type,
          source: sourceTome.constructor.name,
          targetCount: connections.length,
          timestamp: new Date().toISOString()
        }
      });
    }
    connections.forEach(connection => {
      const targetTome = connection.targetTome === sourceTome ? connection.sourceTome : connection.targetTome;
      targetTome.send({
        ...event,
        _source: sourceTome.constructor.name
      });
      // Update connection activity
      connection.lastActivity = new Date().toISOString();
    });
  }
  // Get network topology
  getNetworkTopology() {
    const topology = {
      nodes: new Set(),
      edges: []
    };
    this.getConnections().forEach(connection => {
      topology.nodes.add(connection.sourceTome.constructor.name);
      topology.nodes.add(connection.targetTome.constructor.name);
      topology.edges.push({
        from: connection.sourceTome.constructor.name,
        to: connection.targetTome.constructor.name,
        bidirectional: connection.bidirectional,
        id: connection.id,
        healthStatus: connection.healthStatus,
        createdAt: connection.createdAt,
        lastActivity: connection.lastActivity,
        traceId: connection.traceId
      });
    });
    return {
      nodes: Array.from(topology.nodes),
      edges: topology.edges,
      metrics: {
        totalConnections: this.connections.size,
        healthyConnections: this.getConnections().filter(c => c.healthStatus === 'healthy').length,
        degradedConnections: this.getConnections().filter(c => c.healthStatus === 'degraded').length,
        unhealthyConnections: this.getConnections().filter(c => c.healthStatus === 'unhealthy').length
      }
    };
  }
  // Validate network for potential issues (Turing completeness risks)
  async validateNetwork() {
    const warnings = [];
    const errors = [];
    const topology = this.getNetworkTopology();
    // Check for circular dependencies
    const visited = new Set();
    const recursionStack = new Set();
    const hasCycle = (node, parent) => {
      if (recursionStack.has(node)) {
        return true;
      }
      if (visited.has(node)) {
        return false;
      }
      visited.add(node);
      recursionStack.add(node);
      const edges = topology.edges.filter(edge => edge.from === node || edge.bidirectional && edge.to === node);
      for (const edge of edges) {
        const nextNode = edge.from === node ? edge.to : edge.from;
        if (nextNode !== parent && hasCycle(nextNode, node)) {
          return true;
        }
      }
      recursionStack.delete(node);
      return false;
    };
    // Check each node for cycles
    topology.nodes.forEach(node => {
      if (hasCycle(node)) {
        errors.push(`Circular dependency detected involving node: ${node}`);
      }
    });
    // Check for high fan-out (potential performance issues)
    const fanOutCounts = new Map();
    topology.edges.forEach(edge => {
      fanOutCounts.set(edge.from, (fanOutCounts.get(edge.from) || 0) + 1);
      if (edge.bidirectional) {
        fanOutCounts.set(edge.to, (fanOutCounts.get(edge.to) || 0) + 1);
      }
    });
    fanOutCounts.forEach((count, node) => {
      if (count > 10) {
        warnings.push(`High fan-out detected for node ${node}: ${count} connections`);
      }
    });
    // Check for event amplification (potential infinite loops)
    const eventCounts = new Map();
    this.getConnections().forEach(connection => {
      connection.eventMapping.forEach((targetEvent, sourceEvent) => {
        const key = `${sourceEvent}->${targetEvent}`;
        eventCounts.set(key, (eventCounts.get(key) || 0) + 1);
      });
    });
    eventCounts.forEach((count, eventPair) => {
      if (count > 5) {
        warnings.push(`Potential event amplification detected: ${eventPair} appears ${count} times`);
      }
    });
    // Check RobotCopy-specific validations if available
    if (this.robotCopy) {
      try {
        const enableAdvancedValidation = await this.robotCopy.isEnabled('enable-advanced-validation');
        if (enableAdvancedValidation) {
          // Add advanced validation logic here
          const advancedWarnings = await this.performAdvancedValidation();
          warnings.push(...advancedWarnings);
        }
      } catch (error) {
        console.warn('Failed to perform advanced validation:', error);
      }
    }
    return {
      warnings,
      errors
    };
  }
  async performAdvancedValidation() {
    const warnings = [];
    // Check for potential performance issues based on connection patterns
    const connections = this.getConnections();
    // Check for connections with high event frequency
    const highFrequencyConnections = connections.filter(conn => {
      const timeSinceCreation = Date.now() - new Date(conn.createdAt).getTime();
      const timeSinceLastActivity = Date.now() - new Date(conn.lastActivity).getTime();
      return timeSinceCreation > 60000 && timeSinceLastActivity < 1000; // High activity
    });
    if (highFrequencyConnections.length > 0) {
      warnings.push(`High frequency connections detected: ${highFrequencyConnections.length} connections showing high activity`);
    }
    return warnings;
  }
  // Get RobotCopy instance for external access
  getRobotCopy() {
    return this.robotCopy;
  }
  // Get connection metrics
  getConnectionMetrics() {
    return this.connectionMetrics;
  }
  // Cleanup method
  destroy() {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    // Disconnect all connections
    this.getConnections().forEach(connection => {
      this.disconnect(connection.id);
    });
    console.log('TomeConnector destroyed');
  }
}
function createTomeConnector(robotCopy) {
  return new TomeConnector(robotCopy);
}

// ViewStateMachine import removed as it's not used
class RobotCopy {
  constructor(config = {}) {
    Object.defineProperty(this, "config", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "tracing", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "unleashToggles", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "machines", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    // Response handling
    Object.defineProperty(this, "responseHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    this.config = {
      unleashUrl: 'http://localhost:4242/api',
      unleashClientKey: 'default:development.unleash-insecure-api-token',
      unleashAppName: 'fish-burger-frontend',
      unleashEnvironment: 'development',
      apiPath: '/api/',
      traceApiPath: '/api/trace/',
      messageApiPath: '/api/message/',
      kotlinBackendUrl: 'http://localhost:8080',
      nodeBackendUrl: 'http://localhost:3001',
      enableTracing: true,
      enableDataDog: true,
      ...config
    };
    this.tracing = createTracing();
    this.initializeUnleashToggles();
  }
  async initializeUnleashToggles() {
    // Simulate Unleash toggle initialization
    // In real implementation, this would fetch from Unleash API
    // Default to false for backend requests - should be overridden by app-specific toggle service
    this.unleashToggles.set('fish-burger-kotlin-backend', false);
    this.unleashToggles.set('fish-burger-node-backend', true);
    this.unleashToggles.set('enable-tracing', true);
    this.unleashToggles.set('enable-datadog', true);
    this.unleashToggles.set('enable-backend-api-requests', false);
  }
  async isEnabled(toggleName, _context = {}) {
    return this.unleashToggles.get(toggleName) || false;
  }
  async getBackendUrl() {
    const useKotlin = await this.isEnabled('fish-burger-kotlin-backend');
    return useKotlin ? this.config.kotlinBackendUrl : this.config.nodeBackendUrl;
  }
  async getBackendType() {
    const useKotlin = await this.isEnabled('fish-burger-kotlin-backend');
    return useKotlin ? 'kotlin' : 'node';
  }
  generateMessageId() {
    return this.tracing.generateMessageId();
  }
  generateTraceId() {
    return this.tracing.generateTraceId();
  }
  generateSpanId() {
    return this.tracing.generateSpanId();
  }
  trackMessage(messageId, traceId, spanId, metadata) {
    return this.tracing.trackMessage(messageId, traceId, spanId, metadata);
  }
  getMessage(messageId) {
    return this.tracing.getMessage(messageId);
  }
  getTraceMessages(traceId) {
    return this.tracing.getTraceMessages(traceId);
  }
  getFullTrace(traceId) {
    return this.tracing.getFullTrace(traceId);
  }
  async sendMessage(action, data = {}) {
    const messageId = this.generateMessageId();
    const traceId = this.generateTraceId();
    const spanId = this.generateSpanId();
    const backend = await this.getBackendType();
    const backendUrl = await this.getBackendUrl();
    const apiPath = this.config.apiPath;
    // Track the message
    this.trackMessage(messageId, traceId, spanId, {
      backend,
      action,
      data
    });
    const backendEnabled = await this.isEnabled('enable-backend-api-requests');
    if (!backendEnabled) {
      const mockResult = {
        success: true,
        messageId,
        traceId,
        spanId,
        data: {
          requestedAction: action,
          requestPayload: data
        },
        backendDisabled: true
      };
      this.trackMessage(`${messageId}_response`, traceId, spanId, {
        backend,
        action: `${action}_response`,
        data: mockResult,
        backendDisabled: true
      });
      return mockResult;
    }
    // Prepare headers for tracing
    const headers = {
      'Content-Type': 'application/json',
      ...this.tracing.createTracingHeaders(traceId, spanId, messageId, await this.isEnabled('enable-datadog'))
    };
    try {
      const response = await fetch(`${backendUrl}${apiPath}${action}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          ...data,
          messageId,
          traceId,
          spanId
        })
      });
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const result = await response.json();
      // Track the response
      this.trackMessage(`${messageId}_response`, traceId, spanId, {
        backend,
        action: `${action}_response`,
        data: result
      });
      return result;
    } catch (error) {
      // Track the error
      this.trackMessage(`${messageId}_error`, traceId, spanId, {
        backend,
        action: `${action}_error`,
        data: {
          error: error instanceof Error ? error.message : String(error)
        }
      });
      throw error;
    }
  }
  // Fish Burger example methods have been moved to:
  // example/node-example/src/fish-burger-robotcopy-extensions.js
  // This keeps the core RobotCopy class clean and app-agnostic
  async getTrace(traceId) {
    const backendUrl = await this.getBackendUrl();
    const traceApiPath = this.config.traceApiPath;
    const backendEnabled = await this.isEnabled('enable-backend-api-requests');
    if (!backendEnabled) {
      return {
        traceId,
        backendDisabled: true,
        messages: [],
        fetchedAt: new Date().toISOString()
      };
    }
    try {
      const response = await fetch(`${backendUrl}${traceApiPath}${traceId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to get trace ${traceId}:`, error);
      return this.getFullTrace(traceId);
    }
  }
  async getMessageFromBackend(messageId) {
    const backendUrl = await this.getBackendUrl();
    const messageApiPath = this.config.messageApiPath;
    try {
      const response = await fetch(`${backendUrl}${messageApiPath}${messageId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error(`Failed to get message ${messageId}:`, error);
      return this.getMessage(messageId);
    }
  }
  // Debugging and monitoring methods
  getMessageHistory() {
    return this.tracing.getMessageHistory();
  }
  getTraceIds() {
    return this.tracing.getTraceIds();
  }
  clearHistory() {
    this.tracing.clearHistory();
  }
  // Configuration methods
  updateConfig(newConfig) {
    this.config = {
      ...this.config,
      ...newConfig
    };
  }
  getConfig() {
    return {
      ...this.config
    };
  }
  onResponse(channel, handler) {
    // Store the handler for the specified channel
    this.responseHandlers.set(channel, handler);
    console.log(`Registered response handler for channel: ${channel}`);
  }
  // Method to trigger response handlers (for testing or manual triggering)
  triggerResponse(channel, response) {
    const handler = this.responseHandlers.get(channel);
    if (handler) {
      console.log(`Triggering response handler for channel: ${channel}`, response);
      handler(response);
    } else {
      console.warn(`No response handler found for channel: ${channel}`);
    }
  }
  // Method to remove response handlers
  removeResponseHandler(channel) {
    this.responseHandlers.delete(channel);
    console.log(`Removed response handler for channel: ${channel}`);
  }
  // Machine registration for state machines
  registerMachine(name, machine, config = {}) {
    console.log(`Registering machine: ${name}`, {
      config
    });
    // Store the machine registration for future use
    // This could be used for machine discovery, monitoring, etc.
    if (!this.machines) {
      this.machines = new Map();
    }
    this.machines.set(name, {
      machine,
      config,
      registeredAt: new Date().toISOString()
    });
  }
  // Get registered machines
  getRegisteredMachines() {
    return this.machines || new Map();
  }
  // Get a specific registered machine
  getRegisteredMachine(name) {
    return this.machines?.get(name);
  }
}
function createRobotCopy(config) {
  return new RobotCopy(config);
}
class ClientGenerator {
  constructor() {
    Object.defineProperty(this, "machines", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "configs", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
  }
  // Register a machine for discovery
  registerMachine(machineId, machine, config) {
    this.machines.set(machineId, machine);
    if (config) {
      this.configs.set(machineId, config);
    }
  }
  // Discover all registered machines
  discover() {
    const discovery = {
      machines: new Map(),
      states: new Map(),
      events: new Map(),
      actions: new Map(),
      services: new Map(),
      examples: [],
      documentation: ''
    };
    this.machines.forEach((machine, machineId) => {
      discovery.machines.set(machineId, machine);
      // Analyze machine structure
      const config = this.configs.get(machineId);
      if (config) {
        // Extract states, events, actions, services from XState config
        this.analyzeMachine(machine, machineId, discovery);
        // Add examples
        if (config.examples) {
          discovery.examples.push(...config.examples);
        }
      }
    });
    // Generate documentation
    discovery.documentation = this.generateDocumentation(discovery);
    return discovery;
  }
  analyzeMachine(_machine, machineId, discovery) {
    // This would analyze the XState machine configuration
    // For now, we'll create a basic structure
    discovery.states.set(machineId, ['idle', 'creating', 'success', 'error']);
    discovery.events.set(machineId, ['ADD_INGREDIENT', 'CREATE_BURGER', 'CONTINUE']);
    discovery.actions.set(machineId, ['addIngredient', 'setLoading', 'handleSuccess']);
    discovery.services.set(machineId, ['createBurgerService']);
  }
  generateDocumentation(discovery) {
    let doc = '# ViewStateMachine Discovery\n\n';
    discovery.machines.forEach((_machine, machineId) => {
      const config = this.configs.get(machineId);
      doc += `## ${machineId}\n\n`;
      if (config?.description) {
        doc += `${config.description}\n\n`;
      }
      const states = discovery.states.get(machineId) || [];
      const events = discovery.events.get(machineId) || [];
      const actions = discovery.actions.get(machineId) || [];
      const services = discovery.services.get(machineId) || [];
      doc += `### States\n`;
      states.forEach(state => {
        doc += `- \`${state}\`\n`;
      });
      doc += '\n';
      doc += `### Events\n`;
      events.forEach(event => {
        doc += `- \`${event}\`\n`;
      });
      doc += '\n';
      doc += `### Actions\n`;
      actions.forEach(action => {
        doc += `- \`${action}\`\n`;
      });
      doc += '\n';
      doc += `### Services\n`;
      services.forEach(service => {
        doc += `- \`${service}\`\n`;
      });
      doc += '\n';
    });
    return doc;
  }
  // Generate client code for a specific language
  generateClientCode(language, machineId) {
    const discovery = this.discover();
    switch (language) {
      case 'typescript':
        return this.generateTypeScriptClient(discovery, machineId);
      case 'javascript':
        return this.generateJavaScriptClient(discovery, machineId);
      case 'react':
        return this.generateReactClient(discovery, machineId);
      case 'kotlin':
        return this.generateKotlinClient(discovery, machineId);
      case 'java':
        return this.generateJavaClient(discovery, machineId);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }
  generateTypeScriptClient(discovery, machineId) {
    let code = '// Generated TypeScript client\n\n';
    if (machineId) {
      const machine = discovery.machines.get(machineId);
      if (machine) {
        code += `import { ViewStateMachine } from './ViewStateMachine';\n\n`;
        code += `export class ${machineId}Client {\n`;
        code += `  private machine: ViewStateMachine<any>;\n\n`;
        code += `  constructor() {\n`;
        code += `    // Initialize machine\n`;
        code += `  }\n\n`;
        code += `  // Client methods would be generated here\n`;
        code += `}\n`;
      }
    } else {
      // Generate for all machines
      discovery.machines.forEach((_machine, id) => {
        code += `export class ${id}Client {\n`;
        code += `  // Generated client for ${id}\n`;
        code += `}\n\n`;
      });
    }
    return code;
  }
  generateJavaScriptClient(discovery, machineId) {
    let code = '// Generated JavaScript client\n\n';
    if (machineId) {
      code += `class ${machineId}Client {\n`;
      code += `  constructor() {\n`;
      code += `    // Initialize client\n`;
      code += `  }\n\n`;
      code += `  // Client methods\n`;
      code += `}\n\n`;
      code += `module.exports = ${machineId}Client;\n`;
    } else {
      discovery.machines.forEach((_machine, id) => {
        code += `class ${id}Client {\n`;
        code += `  // Generated client for ${id}\n`;
        code += `}\n\n`;
      });
    }
    return code;
  }
  generateReactClient(discovery, machineId) {
    let code = '// Generated React client\n\n';
    code += `import React from 'react';\n`;
    code += `import { useViewStateMachine } from './ViewStateMachine';\n\n`;
    if (machineId) {
      code += `export const ${machineId}Component: React.FC = () => {\n`;
      code += `  const { state, send, log, view, clear } = useViewStateMachine({\n`;
      code += `    // Initial model\n`;
      code += `  });\n\n`;
      code += `  return (\n`;
      code += `    <div>\n`;
      code += `      {/* Generated UI */}\n`;
      code += `    </div>\n`;
      code += `  );\n`;
      code += `};\n`;
    } else {
      discovery.machines.forEach((_machine, id) => {
        code += `export const ${id}Component: React.FC = () => {\n`;
        code += `  // Generated component for ${id}\n`;
        code += `  return <div>${id} Component</div>;\n`;
        code += `};\n\n`;
      });
    }
    return code;
  }
  generateKotlinClient(discovery, machineId) {
    let code = '// Generated Kotlin client\n\n';
    if (machineId) {
      code += `class ${machineId}Client {\n`;
      code += `  private val machine: ViewStateMachine<*>? = null\n\n`;
      code += `  fun initialize() {\n`;
      code += `    // Initialize machine\n`;
      code += `  }\n\n`;
      code += `  // Client methods\n`;
      code += `}\n`;
    } else {
      discovery.machines.forEach((_machine, id) => {
        code += `class ${id}Client {\n`;
        code += `  // Generated client for ${id}\n`;
        code += `}\n\n`;
      });
    }
    return code;
  }
  generateJavaClient(discovery, machineId) {
    let code = '// Generated Java client\n\n';
    if (machineId) {
      code += `public class ${machineId}Client {\n`;
      code += `  private ViewStateMachine machine;\n\n`;
      code += `  public ${machineId}Client() {\n`;
      code += `    // Initialize machine\n`;
      code += `  }\n\n`;
      code += `  // Client methods\n`;
      code += `}\n`;
    } else {
      discovery.machines.forEach((_machine, id) => {
        code += `public class ${id}Client {\n`;
        code += `  // Generated client for ${id}\n`;
        code += `}\n\n`;
      });
    }
    return code;
  }
  // Generate integration examples
  generateIntegrationExamples() {
    return [{
      name: 'Basic Usage',
      description: 'How to create and use a ViewStateMachine',
      language: 'typescript',
      code: `
const machine = createViewStateMachine({
  machineId: 'my-machine',
  xstateConfig: { /* config */ }
})
.withState('idle', async ({ log, view }) => {
  await log('Entered idle state');
  return view(<div>Idle UI</div>);
});`
    }, {
      name: 'Sub-Machines',
      description: 'How to compose sub-machines',
      language: 'typescript',
      code: `
const parentMachine = createViewStateMachine({
  machineId: 'parent',
  xstateConfig: { /* config */ },
  subMachines: {
    child: { machineId: 'child', xstateConfig: { /* config */ } }
  }
})
.withSubMachine('child', childConfig);`
    }, {
      name: 'ClientGenerator Discovery',
      description: 'How to use ClientGenerator for automated discovery',
      language: 'typescript',
      code: `
const clientGenerator = new ClientGenerator();
clientGenerator.registerMachine('my-machine', machine, {
  description: 'My awesome machine',
  examples: [/* examples */]
});

const discovery = clientGenerator.discover();
const clientCode = clientGenerator.generateClientCode('typescript', 'my-machine');`
    }];
  }
}
// Helper function to create ClientGenerator
function createClientGenerator() {
  return new ClientGenerator();
}

/**
 * TomeClient - Browser-compatible client for TomeManager API
 *
 * This client implements the TomeManager interface but communicates with
 * server-side Tome functionality via HTTP API calls, avoiding the need
 * to bundle Express or other server dependencies in the browser.
 */
class TomeClient {
  constructor(api) {
    Object.defineProperty(this, "tomes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "api", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.api = api;
  }
  /**
   * Register a new Tome with the server
   */
  async registerTome(config) {
    console.log(`📚 [Client] Registering Tome: ${config.id}`);
    try {
      const response = await this.api.registerTome(config);
      // Create a client-side proxy for the tome instance
      const tomeInstance = this.createTomeInstanceProxy(response);
      this.tomes.set(config.id, tomeInstance);
      console.log(`📚 [Client] Successfully registered Tome: ${config.id}`);
      return tomeInstance;
    } catch (error) {
      console.error(`📚 [Client] Failed to register Tome ${config.id}:`, error);
      throw error;
    }
  }
  /**
   * Unregister a Tome from the server
   */
  async unregisterTome(id) {
    console.log(`📚 [Client] Unregistering Tome: ${id}`);
    try {
      await this.api.unregisterTome(id);
      this.tomes.delete(id);
      console.log(`📚 [Client] Successfully unregistered Tome: ${id}`);
    } catch (error) {
      console.error(`📚 [Client] Failed to unregister Tome ${id}:`, error);
      throw error;
    }
  }
  /**
   * Get a Tome instance (from cache or server)
   */
  getTome(id) {
    return this.tomes.get(id);
  }
  /**
   * Start a Tome on the server
   */
  async startTome(id) {
    console.log(`📚 [Client] Starting Tome: ${id}`);
    try {
      await this.api.startTome(id);
      console.log(`📚 [Client] Successfully started Tome: ${id}`);
    } catch (error) {
      console.error(`📚 [Client] Failed to start Tome ${id}:`, error);
      throw error;
    }
  }
  /**
   * Stop a Tome on the server
   */
  async stopTome(id) {
    console.log(`📚 [Client] Stopping Tome: ${id}`);
    try {
      await this.api.stopTome(id);
      console.log(`📚 [Client] Successfully stopped Tome: ${id}`);
    } catch (error) {
      console.error(`📚 [Client] Failed to stop Tome ${id}:`, error);
      throw error;
    }
  }
  /**
   * List all registered Tomes
   */
  listTomes() {
    return Array.from(this.tomes.keys());
  }
  /**
   * Create a client-side proxy for a Tome instance
   */
  createTomeInstanceProxy(response) {
    return {
      id: response.id,
      config: response.config,
      context: response.context,
      machines: response.machines,
      async start() {
        await this.api.startTome(response.id);
      },
      async stop() {
        await this.api.stopTome(response.id);
      },
      async sendMessage(machineId, event, data) {
        const request = {
          tomeId: response.id,
          machineId,
          event,
          data
        };
        const apiResponse = await this.sendTomeMessage(request);
        return apiResponse.result;
      },
      async getMachineState(machineId) {
        return await this.api.getTomeMachineState(response.id, machineId);
      },
      async getMachineContext(machineId) {
        return await this.api.getTomeMachineContext(response.id, machineId);
      },
      async getStatus() {
        return await this.api.getTomeStatus(response.id);
      }
    };
  }
  /**
   * Send a message to a Tome machine (convenience method)
   */
  async sendTomeMessage(request) {
    console.log(`📚 [Client] Sending message to Tome ${request.tomeId}, Machine ${request.machineId}: ${request.event}`);
    try {
      const result = await this.api.sendTomeMessage(request.tomeId, request.machineId, request.event, request.data);
      return {
        success: true,
        result
      };
    } catch (error) {
      console.error(`📚 [Client] Failed to send message:`, error);
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error)
      };
    }
  }
}
/**
 * HTTP implementation of TomeAPI
 */
class HttpTomeAPI {
  constructor(baseUrl = 'http://localhost:3000/api/tomes') {
    Object.defineProperty(this, "baseUrl", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.baseUrl = baseUrl;
  }
  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    return response.json();
  }
  async registerTome(config) {
    return this.request('/', {
      method: 'POST',
      body: JSON.stringify(config)
    });
  }
  async unregisterTome(id) {
    await this.request(`/${id}`, {
      method: 'DELETE'
    });
  }
  async getTome(id) {
    try {
      return await this.request(`/${id}`);
    } catch (error) {
      if (error instanceof Error && error.message.includes('404')) {
        return null;
      }
      throw error;
    }
  }
  async listTomes() {
    return this.request('/');
  }
  async startTome(id) {
    await this.request(`/${id}/start`, {
      method: 'POST'
    });
  }
  async stopTome(id) {
    await this.request(`/${id}/stop`, {
      method: 'POST'
    });
  }
  async getTomeStatus(id) {
    return this.request(`/${id}/status`);
  }
  async sendTomeMessage(tomeId, machineId, event, data) {
    return this.request(`/${tomeId}/machines/${machineId}/message`, {
      method: 'POST',
      body: JSON.stringify({
        event,
        data
      })
    });
  }
  async getTomeMachineState(tomeId, machineId) {
    return this.request(`/${tomeId}/machines/${machineId}/state`);
  }
  async getTomeMachineContext(tomeId, machineId) {
    return this.request(`/${tomeId}/machines/${machineId}/context`);
  }
}
/**
 * Factory function to create a TomeClient
 */
function createTomeClient(apiUrl) {
  const api = new HttpTomeAPI(apiUrl);
  return new TomeClient(api);
}

/**
 * ProxyMachineAdapter
 *
 * Adapter that wraps ProxyRobotCopyStateMachine to implement ISubMachine interface
 */
class ProxyMachineAdapter {
  constructor(machine) {
    Object.defineProperty(this, "machine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "startTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "errorCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "eventHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.machine = machine;
    this.startTime = Date.now();
    this.errorCount = 0;
    this.eventHandlers = new Map();
  }
  get machineId() {
    return this.machine.machineId || 'unknown-proxy';
  }
  get machineType() {
    return 'proxy';
  }
  getState() {
    return this.machine.getState?.() || {
      value: 'unknown'
    };
  }
  getContext() {
    return this.machine.getContext?.() || {};
  }
  isInState(stateName) {
    const state = this.getState();
    return state.value === stateName || state.matches?.(stateName) || false;
  }
  send(event) {
    try {
      this.machine.send?.(event);
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        event
      });
    }
  }
  canHandle(event) {
    // Check if the machine can handle this event based on current state
    const state = this.getState();
    const stateConfig = this.machine.getConfig?.()?.states?.[state.value];
    return stateConfig?.on?.[event] !== undefined;
  }
  async start() {
    try {
      await this.machine.start?.();
      this.emit('started', {
        machineId: this.machineId
      });
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'start'
      });
      throw error;
    }
  }
  async stop() {
    try {
      await this.machine.stop?.();
      this.emit('stopped', {
        machineId: this.machineId
      });
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'stop'
      });
      throw error;
    }
  }
  async pause() {
    // Proxy machines don't typically have pause functionality
    this.emit('paused', {
      machineId: this.machineId
    });
  }
  async resume() {
    // Proxy machines don't typically have resume functionality
    this.emit('resumed', {
      machineId: this.machineId
    });
  }
  async routeMessage(message) {
    try {
      // Route message through the proxy's robot copy functionality
      if (this.machine.robotCopy?.sendMessage) {
        return await this.machine.robotCopy.sendMessage(message);
      }
      return {
        success: false,
        error: 'No routing capability'
      };
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'routeMessage'
      });
      throw error;
    }
  }
  async sendToParent(message) {
    // Proxy machines typically send to parent through their robot copy
    return this.routeMessage(message);
  }
  async sendToChild(_machineId, _message) {
    // Proxy machines don't typically have children
    return {
      success: false,
      error: 'Proxy machines do not have children'
    };
  }
  async broadcast(message) {
    return this.routeMessage(message);
  }
  getConfig() {
    return this.machine.getConfig?.() || {};
  }
  updateConfig(config) {
    // Proxy machines typically don't support runtime config updates
    this.emit('configUpdateRequested', {
      config
    });
  }
  getHealth() {
    return {
      status: this.errorCount > 10 ? 'unhealthy' : this.errorCount > 5 ? 'degraded' : 'healthy',
      lastHeartbeat: Date.now(),
      errorCount: this.errorCount,
      uptime: Date.now() - this.startTime
    };
  }
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }
  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }
  subscribe(callback) {
    return this.machine.subscribe?.(callback) || {
      unsubscribe: () => {
        console.log('🌊 ProxyMachineAdapter: No subscription to unsubscribe from');
      }
    };
  }
}
/**
 * ViewMachineAdapter
 *
 * Adapter that wraps ViewStateMachine to implement ISubMachine interface
 */
class ViewMachineAdapter {
  constructor(machine) {
    Object.defineProperty(this, "machine", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "startTime", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "errorCount", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "eventHandlers", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    this.machine = machine;
    this.startTime = Date.now();
    this.errorCount = 0;
    this.eventHandlers = new Map();
  }
  get machineId() {
    return this.machine.machineId || 'unknown-view';
  }
  get machineType() {
    return 'view';
  }
  getState() {
    return this.machine.getState?.() || {
      value: 'unknown'
    };
  }
  getContext() {
    return this.machine.getContext?.() || {};
  }
  isInState(stateName) {
    const state = this.getState();
    return state.value === stateName || state.matches?.(stateName) || false;
  }
  send(event) {
    try {
      this.machine.send?.(event);
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        event
      });
    }
  }
  canHandle(event) {
    const state = this.getState();
    const stateConfig = this.machine.getConfig?.()?.states?.[state.value];
    return stateConfig?.on?.[event] !== undefined;
  }
  async start() {
    try {
      await this.machine.start?.();
      this.emit('started', {
        machineId: this.machineId
      });
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'start'
      });
      throw error;
    }
  }
  async stop() {
    try {
      await this.machine.stop?.();
      this.emit('stopped', {
        machineId: this.machineId
      });
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'stop'
      });
      throw error;
    }
  }
  async pause() {
    // View machines can be paused by stopping event processing
    this.emit('paused', {
      machineId: this.machineId
    });
  }
  async resume() {
    // View machines can be resumed by restarting event processing
    this.emit('resumed', {
      machineId: this.machineId
    });
  }
  async routeMessage(message) {
    try {
      // View machines route messages through their state machine
      this.send(message);
      return {
        success: true,
        message: 'Message routed to state machine'
      };
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'routeMessage'
      });
      throw error;
    }
  }
  async sendToParent(message) {
    // View machines can send messages to parent through extension messaging
    try {
      if (typeof window !== 'undefined' && window.chrome?.runtime) {
        return await window.chrome.runtime.sendMessage(message);
      }
      return {
        success: false,
        error: 'No parent communication available'
      };
    } catch (error) {
      this.errorCount++;
      this.emit('error', {
        error,
        action: 'sendToParent'
      });
      throw error;
    }
  }
  async sendToChild(_machineId, _message) {
    // View machines don't typically have children
    return {
      success: false,
      error: 'View machines do not have children'
    };
  }
  async broadcast(message) {
    // View machines can broadcast through extension messaging
    return this.sendToParent(message);
  }
  render() {
    // Delegate to the machine's render method if it exists
    return this.machine.render?.() || null;
  }
  getConfig() {
    return this.machine.getConfig?.() || {};
  }
  updateConfig(config) {
    // View machines can update their configuration
    this.emit('configUpdateRequested', {
      config
    });
  }
  getHealth() {
    return {
      status: this.errorCount > 10 ? 'unhealthy' : this.errorCount > 5 ? 'degraded' : 'healthy',
      lastHeartbeat: Date.now(),
      errorCount: this.errorCount,
      uptime: Date.now() - this.startTime
    };
  }
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event).add(handler);
  }
  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
  }
  emit(event, data) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in event handler for ${event}:`, error);
        }
      });
    }
  }
  subscribe(callback) {
    return this.machine.subscribe?.(callback) || {
      unsubscribe: () => {
        console.log('🌊 ViewMachineAdapter: No subscription to unsubscribe from');
      }
    };
  }
}
/**
 * LazyTomeManager - Only instantiated when needed
 */
class LazyTomeManager {
  constructor(tome) {
    Object.defineProperty(this, "tome", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "isInitialized", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: false
    });
    Object.defineProperty(this, "subTomes", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "eventListeners", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    Object.defineProperty(this, "renderKey", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: 0
    });
    this.tome = tome;
  }
  // Lazy initialization
  _ensureInitialized() {
    if (!this.isInitialized) {
      console.log('🌊 LazyTomeManager: Initializing for tome', this.tome.id);
      this.isInitialized = true;
      this.tome.isStarted = false;
      this.tome.isRegistered = false;
    }
  }
  // TomeManager methods
  registerTome(tome) {
    this._ensureInitialized();
    console.log('🌊 LazyTomeManager: Registering tome', tome.id);
    this.subTomes.set(tome.id, tome);
    return {
      success: true
    };
  }
  startTome(tomeId) {
    this._ensureInitialized();
    console.log('🌊 LazyTomeManager: Starting tome', tomeId);
    if (tomeId === this.tome.id) {
      this.tome.isStarted = true;
      // Start all sub-machines
      Object.values(this.tome.machines || {}).forEach(machine => {
        if (machine.start) {
          machine.start();
        }
      });
    } else {
      const subTome = this.subTomes.get(tomeId);
      if (subTome && subTome.start) {
        subTome.start();
      }
    }
    this.emit('tomeStarted', {
      tomeId
    });
    return {
      success: true
    };
  }
  stopTome(tomeId) {
    this._ensureInitialized();
    console.log('🌊 LazyTomeManager: Stopping tome', tomeId);
    if (tomeId === this.tome.id) {
      this.tome.isStarted = false;
      // Stop all sub-machines
      Object.values(this.tome.machines || {}).forEach(machine => {
        if (machine.stop) {
          machine.stop();
        }
      });
    } else {
      const subTome = this.subTomes.get(tomeId);
      if (subTome && subTome.stop) {
        subTome.stop();
      }
    }
    this.emit('tomeStopped', {
      tomeId
    });
    return {
      success: true
    };
  }
  getTome(tomeId) {
    this._ensureInitialized();
    console.log('🌊 LazyTomeManager: Getting tome', tomeId);
    if (tomeId === this.tome.id) {
      return this.tome;
    }
    return this.subTomes.get(tomeId) || null;
  }
  // Event system
  on(event, handler) {
    this._ensureInitialized();
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, new Set());
    }
    this.eventListeners.get(event).add(handler);
    return this;
  }
  off(event, handler) {
    this._ensureInitialized();
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.delete(handler);
    }
    return this;
  }
  emit(event, data) {
    this._ensureInitialized();
    const handlers = this.eventListeners.get(event);
    if (handlers) {
      handlers.forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`🌊 LazyTomeManager: Error in event handler for ${event}:`, error);
        }
      });
    }
    return this;
  }
  // Force re-render
  forceRender() {
    this._ensureInitialized();
    this.renderKey++;
    this.emit('render', {
      tomeId: this.tome.id,
      renderKey: this.renderKey
    });
    return this;
  }
  // Sub-machine management
  getSubMachine(machineId) {
    console.log('🌊 Tome: Getting sub-machine', machineId);
    return this.tome.machines?.[machineId] || null;
  }
  // State management
  getState() {
    const states = {};
    Object.entries(this.tome.machines || {}).forEach(([id, machine]) => {
      if (machine.getState) {
        states[id] = machine.getState();
      }
    });
    return {
      tomeId: this.tome.id,
      isStarted: this.tome.isStarted || false,
      isRegistered: this.tome.isRegistered || false,
      machines: states
    };
  }
  getContext() {
    const contexts = {};
    Object.entries(this.tome.machines || {}).forEach(([id, machine]) => {
      if (machine.getContext) {
        contexts[id] = machine.getContext();
      }
    });
    return {
      tomeId: this.tome.id,
      machines: contexts
    };
  }
  // Health monitoring
  getHealth() {
    const machineHealth = {};
    Object.entries(this.tome.machines || {}).forEach(([id, machine]) => {
      if (machine.getHealth) {
        machineHealth[id] = machine.getHealth();
      }
    });
    const overallStatus = Object.values(machineHealth).every(health => health && health.status === 'healthy') ? 'healthy' : 'degraded';
    return {
      status: overallStatus,
      tomeId: this.tome.id,
      isStarted: this.tome.isStarted || false,
      machines: machineHealth
    };
  }
  // Routing
  route(path, method, data) {
    console.log('🌊 Tome: Routing request', {
      path,
      method,
      tomeId: this.tome.id
    });
    if (!this.tome.routing || !this.tome.routing.routes) {
      return {
        success: false,
        error: 'No routing configured'
      };
    }
    // Find matching route
    const route = Object.values(this.tome.routing.routes).find(r => r.path === path && r.method === method);
    if (!route) {
      return {
        success: false,
        error: 'Route not found'
      };
    }
    // Execute route transformer
    if (route.transformers && route.transformers.input) {
      try {
        return route.transformers.input({
          context: this.getContext(),
          event: data,
          send: event => this.emit('route', event),
          log: (message, data) => console.log('🌊 Tome Route:', message, data),
          transition: state => console.log('🌊 Tome: Transitioning to', state),
          machine: this
        });
      } catch (error) {
        console.error('🌊 Tome: Route execution error', error);
        return {
          success: false,
          error: error.message
        };
      }
    }
    return {
      success: true
    };
  }
}

/**
 * Create a TomeConfig with routing support and lazy TomeManager
 */
function createTomeConfig(config) {
  // LazyTomeManager is now imported at the top of the file
  const tomeConfig = {
    id: config.id || 'default-tome',
    name: config.name || 'Default Tome',
    description: config.description || 'A configured tome with routing support',
    version: config.version || '1.0.0',
    machines: config.machines || {},
    routing: {
      basePath: config.routing?.basePath || '/api',
      routes: config.routing?.routes || {},
      middleware: config.routing?.middleware || [],
      cors: config.routing?.cors ?? true,
      rateLimit: config.routing?.rateLimit || {
        windowMs: 15 * 60 * 1000,
        // 15 minutes
        max: 100 // limit each IP to 100 requests per windowMs
      },
      authentication: config.routing?.authentication || {
        required: false
      }
    },
    context: config.context || {},
    dependencies: config.dependencies || [],
    plugins: config.plugins || [],
    graphql: {
      enabled: config.graphql?.enabled ?? true,
      schema: config.graphql?.schema,
      resolvers: config.graphql?.resolvers || {},
      subscriptions: config.graphql?.subscriptions ?? true
    },
    logging: {
      level: config.logging?.level || 'info',
      format: config.logging?.format || 'json',
      transports: config.logging?.transports || ['console']
    },
    persistence: {
      enabled: config.persistence?.enabled ?? false,
      type: config.persistence?.type || 'memory',
      config: config.persistence?.config || {}
    },
    monitoring: {
      enabled: config.monitoring?.enabled ?? true,
      metrics: config.monitoring?.metrics || ['requests', 'errors', 'performance'],
      tracing: config.monitoring?.tracing ?? true,
      healthChecks: config.monitoring?.healthChecks || ['/health']
    },
    render: config.render,
    renderContainer: config.renderContainer
  };
  let lazyTomeManager = null;
  return {
    ...tomeConfig,
    // Lazy TomeManager getter
    get tomeManager() {
      if (!lazyTomeManager) {
        lazyTomeManager = new LazyTomeManager(this);
      }
      return lazyTomeManager;
    },
    // TomeManager methods that delegate to lazy manager
    start() {
      return this.tomeManager.startTome(this.id);
    },
    stop() {
      return this.tomeManager.stopTome(this.id);
    },
    registerTome(tome) {
      return this.tomeManager.registerTome(tome);
    },
    startTome(tomeId) {
      return this.tomeManager.startTome(tomeId);
    },
    stopTome(tomeId) {
      return this.tomeManager.stopTome(tomeId);
    },
    getTome(tomeId) {
      return this.tomeManager.getTome(tomeId);
    },
    // Event system
    on(event, handler) {
      return this.tomeManager.on(event, handler);
    },
    off(event, handler) {
      return this.tomeManager.off(event, handler);
    },
    emit(event, data) {
      return this.tomeManager.emit(event, data);
    },
    // Force re-render
    forceRender() {
      return this.tomeManager.forceRender();
    },
    // Sub-machine management
    getSubMachine(machineId) {
      return this.tomeManager.getSubMachine(machineId);
    },
    // Subscription system
    subscribe(callback) {
      console.log('🌊 Tome: Subscribing to tome', this.id);
      if (typeof callback === 'function') {
        callback({
          type: 'tomeStarted',
          data: this
        });
      }
      return {
        unsubscribe: () => {
          console.log('🌊 Tome: Unsubscribing from tome', this.id);
        }
      };
    },
    // State management
    getState() {
      return this.tomeManager.getState();
    },
    getContext() {
      return this.tomeManager.getContext();
    },
    // Health monitoring
    getHealth() {
      return this.tomeManager.getHealth();
    },
    // Routing
    route(path, method, data) {
      return this.tomeManager.route(path, method, data);
    }
  };
}
/**
 * Example TomeConfig for Fish Burger system
 */
const FishBurgerTomeConfig = createTomeConfig({
  id: 'fish-burger-tome',
  name: 'Fish Burger System',
  description: 'Complete fish burger ordering and cooking system',
  version: '1.0.0',
  machines: {
    orderMachine: {
      id: 'order-machine',
      name: 'Order Management',
      description: 'Handles order creation and management',
      xstateConfig: {
        id: 'order-machine',
        initial: 'idle',
        states: {
          idle: {
            on: {
              CREATE_ORDER: 'processing'
            }
          },
          processing: {
            on: {
              COMPLETE_ORDER: 'completed'
            }
          },
          completed: {
            on: {
              RESET: 'idle'
            }
          }
        }
      }
    },
    cookingMachine: {
      id: 'cooking-machine',
      name: 'Cooking System',
      description: 'Manages the cooking process',
      xstateConfig: {
        id: 'cooking-machine',
        initial: 'idle',
        states: {
          idle: {
            on: {
              START_COOKING: 'cooking'
            }
          },
          cooking: {
            on: {
              COMPLETE_COOKING: 'completed'
            }
          },
          completed: {
            on: {
              RESET: 'idle'
            }
          }
        }
      }
    }
  },
  routing: {
    basePath: '/api/fish-burger',
    routes: {
      orderMachine: {
        path: '/orders',
        method: 'POST'
      },
      cookingMachine: {
        path: '/cooking',
        method: 'POST'
      }
    }
  },
  context: {
    baseUrl: 'http://localhost:3000',
    adminKey: typeof process !== 'undefined' && process.env?.ADMIN_KEY || 'admin123'
  }
});
/**
 * Example TomeConfig for Editor system
 */
const EditorTomeConfig = createTomeConfig({
  id: 'editor-tome',
  name: 'Component Editor System',
  description: 'Visual component editor with real-time preview',
  version: '1.0.0',
  machines: {
    editorMachine: {
      id: 'editor-machine',
      name: 'Component Editor',
      description: 'Main editor interface',
      xstateConfig: {
        id: 'editor-machine',
        initial: 'idle',
        states: {
          idle: {
            on: {
              LOAD_COMPONENT: 'editing'
            }
          },
          editing: {
            on: {
              SAVE: 'saving'
            }
          },
          saving: {
            on: {
              SAVE_SUCCESS: 'editing'
            }
          }
        }
      }
    },
    previewMachine: {
      id: 'preview-machine',
      name: 'Preview System',
      description: 'Real-time component preview',
      xstateConfig: {
        id: 'preview-machine',
        initial: 'idle',
        states: {
          idle: {
            on: {
              UPDATE_PREVIEW: 'updating'
            }
          },
          updating: {
            on: {
              PREVIEW_READY: 'ready'
            }
          },
          ready: {
            on: {
              UPDATE_PREVIEW: 'updating'
            }
          }
        }
      }
    }
  },
  routing: {
    basePath: '/api/editor',
    routes: {
      editorMachine: {
        path: '/components',
        method: 'POST'
      },
      previewMachine: {
        path: '/preview',
        method: 'POST'
      }
    }
  },
  context: {
    editorType: 'generic',
    previewMode: 'iframe'
  }
});

/**
 * Common tome rendering pattern that provides:
 * - View key subscription for React data pump
 * - Single point of truth via tome.render()
 * - Loading state fallback
 */
const useTomeRenderer = tome => {
  const isTomeBase = tome instanceof TomeBase;
  const [viewKey, setViewKey] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(isTomeBase ? tome.getViewKey() : 'initial');
  const [renderedView, setRenderedView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isTomeBase) {
      const unsubscribe = tome.observeViewKey(setViewKey);
      return unsubscribe;
    }
  }, [tome, isTomeBase]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (isTomeBase) {
      const view = tome.render() || null;
      setRenderedView(view);
    } else {
      // ViewStateMachine.render requires a model parameter
      // For now, render an empty view or handle differently
      setRenderedView(null);
    }
  }, [viewKey, tome, isTomeBase]);
  return renderedView || jsxRuntimeExports.jsx("div", {
    children: "Loading..."
  });
};
const TomeRenderer = ({
  tome,
  loadingComponent = jsxRuntimeExports.jsx("div", {
    children: "Loading..."
  }),
  children
}) => {
  const renderedView = useTomeRenderer(tome);
  if (children) {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
      children: children(renderedView)
    });
  }
  return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
    children: renderedView || loadingComponent
  });
};

/**
 * ErrorBoundary Component
 *
 * Catches React errors in child components and displays a fallback UI.
 * Can be used independently without GenericEditor dependencies.
 */
class ErrorBoundary extends react__WEBPACK_IMPORTED_MODULE_0__.Component {
  constructor(props) {
    super(props);
    Object.defineProperty(this, "handleRetry", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: () => {
        this.setState({
          hasError: false,
          error: undefined,
          errorInfo: undefined
        });
      }
    });
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError(error) {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }
  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.state.errorInfo, this.handleRetry);
      }
      // Default fallback UI
      return jsxRuntimeExports.jsxs("div", {
        style: {
          padding: '20px',
          margin: '20px',
          border: '2px solid #ff6b6b',
          borderRadius: '8px',
          backgroundColor: '#fff5f5'
        },
        children: [jsxRuntimeExports.jsx("h3", {
          style: {
            color: '#ff6b6b',
            marginTop: 0
          },
          children: "\u26A0\uFE0F Something went wrong"
        }), jsxRuntimeExports.jsx("p", {
          style: {
            color: '#333'
          },
          children: this.state.error.message || 'An unexpected error occurred'
        }), jsxRuntimeExports.jsx("button", {
          onClick: this.handleRetry,
          style: {
            padding: '8px 16px',
            backgroundColor: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          },
          children: "\uD83D\uDD04 Try Again"
        })]
      });
    }
    return this.props.children;
  }
}

// Structural system class
class StructuralSystem {
  // Component cache for future use
  // private _componentCache: Map<string, any> = new Map();
  constructor(config) {
    Object.defineProperty(this, "config", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: void 0
    });
    Object.defineProperty(this, "machines", {
      enumerable: true,
      configurable: true,
      writable: true,
      value: new Map()
    });
    this.config = config;
  }
  // Get the complete application structure
  getAppStructure() {
    return this.config.AppStructure;
  }
  // Get component-tome mapping
  getComponentTomeMapping() {
    return this.config.ComponentTomeMapping;
  }
  // Get routing configuration
  getRoutingConfig() {
    return this.config.RoutingConfig;
  }
  // Get tome configuration
  getTomeConfig() {
    return this.config.TomeConfig;
  }
  // Create a machine for a specific component
  createMachine(componentName, initialModel) {
    const mapping = this.config.ComponentTomeMapping[componentName];
    const tomeConfig = this.config.TomeConfig.tomes[`${componentName}-tome`];
    if (!mapping || !tomeConfig) {
      console.warn(`No configuration found for component: ${componentName}`);
      return null;
    }
    try {
      // Create machine configuration
      const machineConfig = {
        machineId: tomeConfig.machineId,
        xstateConfig: {
          id: tomeConfig.machineId,
          initial: 'idle',
          context: {
            model: initialModel || {},
            componentName,
            tomePath: mapping.tomePath,
            templatePath: mapping.templatePath
          },
          states: this.createStatesFromTome(tomeConfig),
          on: this.createEventsFromTome(tomeConfig)
        },
        tomeConfig: {
          ...tomeConfig,
          componentMapping: mapping
        }
      };
      const machine = new ViewStateMachine(machineConfig);
      this.machines.set(componentName, machine);
      return machine;
    } catch (error) {
      console.error(`Failed to create machine for ${componentName}:`, error);
      return null;
    }
  }
  // Get an existing machine
  getMachine(componentName) {
    return this.machines.get(componentName);
  }
  // Get all machines
  getAllMachines() {
    return this.machines;
  }
  // Find route by path
  findRoute(path) {
    const findRouteRecursive = (routes, targetPath) => {
      for (const route of routes) {
        if (route.path === targetPath) {
          return route;
        }
        if (route.children) {
          const found = findRouteRecursive(route.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };
    return findRouteRecursive(this.config.RoutingConfig.routes, path);
  }
  // Get navigation breadcrumbs for a path
  getBreadcrumbs(path) {
    const breadcrumbs = [];
    const pathParts = path.split('/').filter(Boolean);
    let currentPath = '';
    for (const part of pathParts) {
      currentPath += `/${part}`;
      const route = this.findRoute(currentPath);
      if (route && route.component) {
        const navItem = this.findNavigationItem(currentPath);
        if (navItem) {
          breadcrumbs.push(navItem);
        }
      }
    }
    return breadcrumbs;
  }
  // Find navigation item by path
  findNavigationItem(path) {
    const findInNavigation = (items, targetPath) => {
      for (const item of items) {
        if (item.path === targetPath) {
          return item;
        }
        if (item.children) {
          const found = findInNavigation(item.children, targetPath);
          if (found) return found;
        }
      }
      return null;
    };
    const primary = findInNavigation(this.config.RoutingConfig.navigation.primary, path);
    if (primary) return primary;
    if (this.config.RoutingConfig.navigation.secondary) {
      return findInNavigation(this.config.RoutingConfig.navigation.secondary, path);
    }
    return null;
  }
  // Validate the structural configuration
  validate() {
    const errors = [];
    // Validate component-tome mappings
    for (const [componentName, _mapping] of Object.entries(this.config.ComponentTomeMapping)) {
      if (!this.config.TomeConfig.tomes[`${componentName}-tome`]) {
        errors.push(`Component ${componentName} has no corresponding tome configuration`);
      }
    }
    // Validate routing
    for (const route of this.config.RoutingConfig.routes) {
      if (route.component && !this.config.ComponentTomeMapping[route.component]) {
        errors.push(`Route ${route.path} references unknown component: ${route.component}`);
      }
    }
    // Validate navigation
    const validateNavigation = items => {
      for (const item of items) {
        if (!this.findRoute(item.path)) {
          errors.push(`Navigation item ${item.id} references unknown route: ${item.path}`);
        }
        if (item.children) {
          validateNavigation(item.children);
        }
      }
    };
    validateNavigation(this.config.RoutingConfig.navigation.primary);
    if (this.config.RoutingConfig.navigation.secondary) {
      validateNavigation(this.config.RoutingConfig.navigation.secondary);
    }
    return {
      isValid: errors.length === 0,
      errors
    };
  }
  // Create XState states from tome configuration
  createStatesFromTome(tomeConfig) {
    const states = {};
    for (const state of tomeConfig.states) {
      states[state] = {
        on: {}
      };
    }
    return states;
  }
  // Create XState events from tome configuration
  createEventsFromTome(tomeConfig) {
    const events = {};
    for (const event of tomeConfig.events) {
      events[event] = {
        actions: (0,xstate__WEBPACK_IMPORTED_MODULE_2__.assign)((_context, event) => ({
          lastEvent: event.type,
          lastEventPayload: event.payload
        }))
      };
    }
    return events;
  }
}
// React hook for using the structural system
function useStructuralSystem(config) {
  const [system] = react__WEBPACK_IMPORTED_MODULE_0__.useState(() => new StructuralSystem(config));
  react__WEBPACK_IMPORTED_MODULE_0__.useEffect(() => {
    const validation = system.validate();
    if (!validation.isValid) {
      console.warn('Structural system validation errors:', validation.errors);
    }
  }, [system]);
  return system;
}
// Utility function to create a structural system
function createStructuralSystem(config) {
  return new StructuralSystem(config);
}
// Types are already exported above as interfaces

const RouterContext = (0,react__WEBPACK_IMPORTED_MODULE_0__.createContext)(null);
// Router hook
function useRouter() {
  const context = (0,react__WEBPACK_IMPORTED_MODULE_0__.useContext)(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a StructuralRouter');
  }
  return context;
}
// Main router component
const StructuralRouter = ({
  config,
  initialRoute = '/',
  onRouteChange,
  children
}) => {
  const [currentRoute, setCurrentRoute] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(initialRoute);
  const [routeHistory, setRouteHistory] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([initialRoute]);
  const [structuralSystem] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(() => new StructuralSystem(config));
  // Handle route changes
  const navigate = path => {
    const route = structuralSystem.findRoute(path);
    if (route) {
      setCurrentRoute(path);
      setRouteHistory(prev => [...prev, path]);
      onRouteChange?.(path);
    } else {
      console.warn(`Route not found: ${path}`);
    }
  };
  // Handle back navigation
  const goBack = () => {
    if (routeHistory.length > 1) {
      const newHistory = routeHistory.slice(0, -1);
      const previousRoute = newHistory[newHistory.length - 1];
      setCurrentRoute(previousRoute);
      setRouteHistory(newHistory);
      onRouteChange?.(previousRoute);
    }
  };
  // Get breadcrumbs for current route
  const breadcrumbs = structuralSystem.getBreadcrumbs(currentRoute);
  // Context value
  const contextValue = {
    currentRoute,
    navigate,
    goBack,
    breadcrumbs,
    structuralSystem
  };
  // Handle initial route validation
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const route = structuralSystem.findRoute(initialRoute);
    if (!route) {
      console.warn(`Initial route not found: ${initialRoute}`);
      // Try to find a valid default route
      const defaultRoute = config.RoutingConfig.routes.find(r => r.component)?.path;
      if (defaultRoute && defaultRoute !== initialRoute) {
        setCurrentRoute(defaultRoute);
        setRouteHistory([defaultRoute]);
        onRouteChange?.(defaultRoute);
      }
    }
  }, [initialRoute, structuralSystem, config.RoutingConfig.routes, onRouteChange]);
  return jsxRuntimeExports.jsx(RouterContext.Provider, {
    value: contextValue,
    children: jsxRuntimeExports.jsxs("div", {
      className: "structural-router",
      children: [jsxRuntimeExports.jsx(RouterHeader, {}), jsxRuntimeExports.jsxs("div", {
        className: "router-content",
        children: [jsxRuntimeExports.jsx(RouterSidebar, {}), jsxRuntimeExports.jsx(RouterMain, {
          children: children
        })]
      })]
    })
  });
};
// Router header component
const RouterHeader = () => {
  const {
    breadcrumbs,
    goBack
  } = useRouter();
  return jsxRuntimeExports.jsxs("header", {
    className: "router-header",
    children: [jsxRuntimeExports.jsxs("div", {
      className: "header-content",
      children: [jsxRuntimeExports.jsx("h1", {
        className: "router-title",
        children: "Log View Machine"
      }), jsxRuntimeExports.jsx("nav", {
        className: "breadcrumb-nav",
        children: breadcrumbs.map((item, index) => jsxRuntimeExports.jsxs("span", {
          className: "breadcrumb-item",
          children: [index > 0 && jsxRuntimeExports.jsx("span", {
            className: "breadcrumb-separator",
            children: "/"
          }), jsxRuntimeExports.jsx("span", {
            className: "breadcrumb-label",
            children: item.label
          })]
        }, item.id))
      })]
    }), jsxRuntimeExports.jsx("button", {
      className: "back-button",
      onClick: goBack,
      disabled: breadcrumbs.length <= 1,
      children: "\u2190 Back"
    })]
  });
};
// Router sidebar component
const RouterSidebar = () => {
  const {
    structuralSystem,
    navigate,
    currentRoute
  } = useRouter();
  const config = structuralSystem.getRoutingConfig();
  const renderNavigationItems = items => {
    return items.map(item => jsxRuntimeExports.jsxs("div", {
      className: "nav-item",
      children: [jsxRuntimeExports.jsxs("button", {
        className: `nav-button ${currentRoute === item.path ? 'active' : ''}`,
        onClick: () => navigate(item.path),
        children: [item.icon && jsxRuntimeExports.jsx("span", {
          className: "nav-icon",
          children: item.icon
        }), jsxRuntimeExports.jsx("span", {
          className: "nav-label",
          children: item.label
        })]
      }), item.children && jsxRuntimeExports.jsx("div", {
        className: "nav-children",
        children: renderNavigationItems(item.children)
      })]
    }, item.id));
  };
  return jsxRuntimeExports.jsxs("aside", {
    className: "router-sidebar",
    children: [jsxRuntimeExports.jsxs("nav", {
      className: "primary-navigation",
      children: [jsxRuntimeExports.jsx("h3", {
        className: "nav-section-title",
        children: "Primary"
      }), renderNavigationItems(config.navigation.primary)]
    }), config.navigation.secondary && jsxRuntimeExports.jsxs("nav", {
      className: "secondary-navigation",
      children: [jsxRuntimeExports.jsx("h3", {
        className: "nav-section-title",
        children: "Secondary"
      }), renderNavigationItems(config.navigation.secondary)]
    })]
  });
};
// Router main content area
const RouterMain = ({
  children
}) => {
  return jsxRuntimeExports.jsx("main", {
    className: "router-main",
    children: children
  });
};
const Route = ({
  path,
  component: Component,
  fallback: Fallback
}) => {
  const {
    currentRoute
  } = useRouter();
  // Handle exact route matches
  if (currentRoute === path) {
    return jsxRuntimeExports.jsx(Component, {});
  }
  // Handle wildcard routes (catch-all)
  if (path === '*' && Component) {
    return jsxRuntimeExports.jsx(Component, {});
  }
  // Handle fallback for unmatched routes
  if (Fallback && currentRoute !== path) {
    return jsxRuntimeExports.jsx(Fallback, {});
  }
  return null;
};
// Default fallback component
const RouteFallback = () => {
  const {
    currentRoute
  } = useRouter();
  return jsxRuntimeExports.jsxs("div", {
    className: "route-fallback",
    children: [jsxRuntimeExports.jsx("h2", {
      children: "Route Not Found"
    }), jsxRuntimeExports.jsxs("p", {
      children: ["The route \"", currentRoute, "\" could not be found."]
    })]
  });
};

// Main component
const StructuralTomeConnector = ({
  componentName,
  structuralSystem,
  initialModel = {},
  onStateChange,
  onLogEntry,
  onMachineCreated,
  children
}) => {
  const [state, setState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    machine: null,
    currentState: 'idle',
    model: initialModel,
    logEntries: [],
    isLoading: true,
    error: null
  });
  const machineRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const logEntriesRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)([]);
  // Get tome configuration and component mapping
  const tomeConfig = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return structuralSystem.getTomeConfig().tomes[`${componentName}-tome`];
  }, [componentName, structuralSystem]);
  const componentMapping = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return structuralSystem.getComponentTomeMapping()[componentName];
  }, [componentName, structuralSystem]);
  // Initialize the tome machine
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const initializeTome = async () => {
      try {
        setState(prev => ({
          ...prev,
          isLoading: true,
          error: null
        }));
        // Validate configuration
        if (!tomeConfig) {
          throw new Error(`No tome configuration found for component: ${componentName}`);
        }
        if (!componentMapping) {
          throw new Error(`No component mapping found for: ${componentName}`);
        }
        // Create or get the machine
        let machine = structuralSystem.getMachine(componentName) || null;
        if (!machine) {
          machine = structuralSystem.createMachine(componentName, initialModel);
          if (!machine) {
            throw new Error(`Failed to create machine for component: ${componentName}`);
          }
        }
        // Store machine reference
        machineRef.current = machine;
        onMachineCreated?.(machine);
        // Set up state change listener
        const unsubscribe = machine.subscribe(state => {
          const currentState = state.value || 'idle';
          const model = state.context?.model || initialModel;
          setState(prev => ({
            ...prev,
            currentState,
            model,
            isLoading: false
          }));
          onStateChange?.(currentState, model);
        });
        // Set up logging
        machine.on('LOG_ADDED', async entry => {
          const newEntry = {
            id: Date.now().toString(),
            timestamp: new Date().toISOString(),
            level: 'info',
            message: entry.message,
            metadata: entry.metadata
          };
          setState(prev => ({
            ...prev,
            logEntries: [...prev.logEntries, newEntry]
          }));
          logEntriesRef.current = [...logEntriesRef.current, newEntry];
          onLogEntry?.(newEntry);
        });
        // Initialize the machine
        await machine.start();
        setState(prev => ({
          ...prev,
          machine,
          isLoading: false
        }));
        return unsubscribe;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        setState(prev => ({
          ...prev,
          error: errorMessage,
          isLoading: false
        }));
        console.error(`Failed to initialize tome for ${componentName}:`, error);
      }
    };
    initializeTome();
  }, [componentName, structuralSystem, initialModel, onStateChange, onLogEntry, onMachineCreated]);
  // Send event to the machine
  const sendEvent = event => {
    if (machineRef.current) {
      machineRef.current.send(event);
    }
  };
  // Update the model
  const updateModel = updates => {
    if (machineRef.current) {
      const currentModel = machineRef.current.getState()?.context?.model || {};
      const newModel = {
        ...currentModel,
        ...updates
      };
      // Update the machine context
      machineRef.current.send({
        type: 'MODEL_UPDATE',
        payload: {
          model: newModel
        }
      });
    }
  };
  // Context value for children
  const contextValue = {
    machine: state.machine,
    currentState: state.currentState,
    model: state.model,
    logEntries: state.logEntries,
    isLoading: state.isLoading,
    error: state.error,
    sendEvent,
    updateModel,
    componentName,
    tomeConfig,
    componentMapping
  };
  // Render children
  if (typeof children === 'function') {
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, {
      children: children(contextValue)
    });
  }
  return jsxRuntimeExports.jsxs("div", {
    className: "structural-tome-connector",
    children: [jsxRuntimeExports.jsx(TomeHeader, {
      context: contextValue
    }), jsxRuntimeExports.jsx(TomeContent, {
      context: contextValue,
      children: children
    }), jsxRuntimeExports.jsx(TomeFooter, {
      context: contextValue
    })]
  });
};
// Tome header component
const TomeHeader = ({
  context
}) => {
  const {
    componentName,
    currentState,
    tomeConfig,
    error
  } = context;
  return jsxRuntimeExports.jsxs("header", {
    className: "tome-header",
    children: [jsxRuntimeExports.jsxs("div", {
      className: "tome-info",
      children: [jsxRuntimeExports.jsx("h3", {
        className: "tome-title",
        children: componentName
      }), tomeConfig && jsxRuntimeExports.jsx("p", {
        className: "tome-description",
        children: tomeConfig.description
      })]
    }), jsxRuntimeExports.jsxs("div", {
      className: "tome-status",
      children: [jsxRuntimeExports.jsx("span", {
        className: `state-indicator state-${currentState}`,
        children: currentState
      }), error && jsxRuntimeExports.jsx("span", {
        className: "error-indicator",
        title: error,
        children: "\u26A0\uFE0F"
      })]
    })]
  });
};
// Tome content component
const TomeContent = ({
  context,
  children
}) => {
  const {
    isLoading,
    error
  } = context;
  if (isLoading) {
    return jsxRuntimeExports.jsx("div", {
      className: "tome-content loading",
      children: jsxRuntimeExports.jsx("div", {
        className: "loading-spinner",
        children: "Loading..."
      })
    });
  }
  if (error) {
    return jsxRuntimeExports.jsx("div", {
      className: "tome-content error",
      children: jsxRuntimeExports.jsxs("div", {
        className: "error-message",
        children: [jsxRuntimeExports.jsx("h4", {
          children: "Error"
        }), jsxRuntimeExports.jsx("p", {
          children: error
        })]
      })
    });
  }
  return jsxRuntimeExports.jsx("div", {
    className: "tome-content",
    children: children
  });
};
// Tome footer component
const TomeFooter = ({
  context
}) => {
  const {
    logEntries,
    tomeConfig
  } = context;
  if (!tomeConfig || logEntries.length === 0) {
    return null;
  }
  return jsxRuntimeExports.jsx("footer", {
    className: "tome-footer",
    children: jsxRuntimeExports.jsxs("details", {
      className: "tome-logs",
      children: [jsxRuntimeExports.jsxs("summary", {
        children: ["Logs (", logEntries.length, ")"]
      }), jsxRuntimeExports.jsx("div", {
        className: "log-entries",
        children: logEntries.slice(-5).map(entry => jsxRuntimeExports.jsxs("div", {
          className: `log-entry log-${entry.level}`,
          children: [jsxRuntimeExports.jsx("span", {
            className: "log-timestamp",
            children: new Date(entry.timestamp).toLocaleTimeString()
          }), jsxRuntimeExports.jsx("span", {
            className: "log-message",
            children: entry.message
          }), entry.metadata && jsxRuntimeExports.jsx("span", {
            className: "log-metadata",
            children: JSON.stringify(entry.metadata)
          })]
        }, entry.id))
      })]
    })
  });
};
// Hook for using the tome connector
function useStructuralTomeConnector(componentName, structuralSystem) {
  const [context, setContext] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    machine: null,
    currentState: 'idle',
    model: {},
    logEntries: [],
    isLoading: true,
    error: null,
    sendEvent: () => {},
    updateModel: () => {},
    componentName,
    tomeConfig: null,
    componentMapping: null
  });
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const tomeConfig = structuralSystem.getTomeConfig().tomes[`${componentName}-tome`];
    const componentMapping = structuralSystem.getComponentTomeMapping()[componentName];
    setContext(prev => ({
      ...prev,
      tomeConfig,
      componentMapping
    }));
  }, [componentName, structuralSystem]);
  return context;
}

// Default application structure configuration
const DefaultStructuralConfig = {
  // Root application structure
  AppStructure: {
    id: 'log-view-machine-app',
    name: 'Log View Machine Application',
    type: 'application',
    routing: {
      path: '/'
    }
  },
  // Component to Tome mapping
  ComponentTomeMapping: {
    'dashboard': {
      componentPath: 'src/components/Dashboard.tsx',
      tomePath: 'src/component-middleware/dashboard/DashboardTomes.tsx',
      templatePath: 'src/component-middleware/dashboard/templates/dashboard-component/'
    },
    'log-viewer': {
      componentPath: 'src/components/LogViewer.tsx',
      tomePath: 'src/component-middleware/log-viewer/LogViewerTomes.tsx',
      templatePath: 'src/component-middleware/log-viewer/templates/log-viewer-component/'
    },
    'state-machine': {
      componentPath: 'src/components/StateMachine.tsx',
      tomePath: 'src/component-middleware/state-machine/StateMachineTomes.tsx',
      templatePath: 'src/component-middleware/state-machine/templates/state-machine-component/'
    },
    'tome-manager': {
      componentPath: 'src/components/TomeManager.tsx',
      tomePath: 'src/component-middleware/tome-manager/TomeManagerTomes.tsx',
      templatePath: 'src/component-middleware/tome-manager/templates/tome-manager-component/'
    },
    'settings': {
      componentPath: 'src/components/Settings.tsx',
      tomePath: 'src/component-middleware/settings/SettingsTomes.tsx',
      templatePath: 'src/component-middleware/settings/templates/settings-component/'
    },
    // Add missing component mappings for the editor
    'app': {
      componentPath: 'src/App.tsx',
      tomePath: 'src/core/AppTome.tsx',
      templatePath: 'src/templates/app-component/'
    },
    'WaveTabs': {
      componentPath: 'src/components/WaveTabs.tsx',
      tomePath: 'src/component-middleware/wave-tabs/WaveTabsTomes.tsx',
      templatePath: 'src/component-middleware/wave-tabs/templates/wave-tabs-component/'
    },
    'SelectorInput': {
      componentPath: 'src/components/SelectorInput.tsx',
      tomePath: 'src/component-middleware/selector-input/SelectorInputTomes.tsx',
      templatePath: 'src/component-middleware/selector-input/templates/selector-input-component/'
    },
    'About': {
      componentPath: 'src/components/About.tsx',
      tomePath: 'src/component-middleware/about/AboutTomes.tsx',
      templatePath: 'src/component-middleware/about/templates/about-component/'
    }
  },
  // Routing configuration
  RoutingConfig: {
    routes: [{
      path: '/',
      redirect: '/dashboard'
    }, {
      path: '/dashboard',
      component: 'dashboard'
    }, {
      path: '/log-viewer',
      component: 'log-viewer'
    }, {
      path: '/state-machine',
      component: 'state-machine'
    }, {
      path: '/tome-manager',
      component: 'tome-manager'
    }, {
      path: '/settings',
      component: 'settings'
    },
    // Add routes for editor components
    {
      path: '/app',
      component: 'app'
    }, {
      path: '/wave-tabs',
      component: 'WaveTabs'
    }, {
      path: '/selector-input',
      component: 'SelectorInput'
    }, {
      path: '/about',
      component: 'About'
    }],
    navigation: {
      primary: [{
        id: 'dashboard',
        label: 'Dashboard',
        path: '/dashboard',
        icon: '📊'
      }, {
        id: 'log-viewer',
        label: 'Log Viewer',
        path: '/log-viewer',
        icon: '📋'
      }, {
        id: 'state-machine',
        label: 'State Machine',
        path: '/state-machine',
        icon: '⚙️'
      }, {
        id: 'tome-manager',
        label: 'Tome Manager',
        path: '/tome-manager',
        icon: '📚'
      }, {
        id: 'WaveTabs',
        label: 'Wave Tabs',
        path: '/wave-tabs',
        icon: '🌊'
      }, {
        id: 'SelectorInput',
        label: 'Selector Input',
        path: '/selector-input',
        icon: '🎯'
      }],
      secondary: [{
        id: 'settings',
        label: 'Settings',
        path: '/settings',
        icon: '⚙️'
      }, {
        id: 'About',
        label: 'About',
        path: '/about',
        icon: 'ℹ️'
      }]
    }
  },
  // Tome configuration
  TomeConfig: {
    tomes: {
      'dashboard-tome': {
        machineId: 'dashboard',
        description: 'Main dashboard with overview and navigation',
        states: ['idle', 'loading', 'loaded', 'error'],
        events: ['LOAD', 'REFRESH', 'ERROR', 'CLEAR']
      },
      'log-viewer-tome': {
        machineId: 'log-viewer',
        description: 'Log viewing and analysis functionality',
        states: ['idle', 'loading', 'viewing', 'filtering', 'exporting', 'error'],
        events: ['LOAD_LOGS', 'FILTER', 'EXPORT', 'CLEAR', 'ERROR']
      },
      'state-machine-tome': {
        machineId: 'state-machine',
        description: 'State machine visualization and management',
        states: ['idle', 'loading', 'visualizing', 'editing', 'saving', 'error'],
        events: ['LOAD_MACHINE', 'VISUALIZE', 'EDIT', 'SAVE', 'ERROR']
      },
      'tome-manager-tome': {
        machineId: 'tome-manager',
        description: 'Tome lifecycle and configuration management',
        states: ['idle', 'loading', 'managing', 'creating', 'editing', 'deleting', 'error'],
        events: ['LOAD_TOMES', 'CREATE', 'EDIT', 'DELETE', 'SAVE', 'ERROR']
      },
      'settings-tome': {
        machineId: 'settings',
        description: 'Application settings and configuration',
        states: ['idle', 'loading', 'editing', 'saving', 'resetting', 'error'],
        events: ['LOAD_SETTINGS', 'EDIT', 'SAVE', 'RESET', 'ERROR']
      },
      // Add missing tome configurations for the editor
      'app-tome': {
        machineId: 'app',
        description: 'Main application state management',
        states: ['idle', 'initializing', 'ready', 'navigating', 'error'],
        events: ['INITIALIZE', 'NAVIGATE', 'TAB_CHANGE', 'ERROR']
      },
      'WaveTabs-tome': {
        machineId: 'WaveTabs',
        description: 'Wave tabs navigation state management',
        states: ['idle', 'active', 'navigating', 'error'],
        events: ['TAB_SELECT', 'TAB_ADD', 'TAB_REMOVE', 'ERROR']
      },
      'SelectorInput-tome': {
        machineId: 'SelectorInput',
        description: 'Selector input state management',
        states: ['idle', 'inputting', 'validating', 'saving', 'error'],
        events: ['INPUT_CHANGE', 'VALIDATE', 'SAVE', 'CLEAR', 'ERROR']
      },
      'About-tome': {
        machineId: 'About',
        description: 'About component state management',
        states: ['idle', 'expanded', 'help', 'error'],
        events: ['EXPAND', 'SHOW_HELP', 'COLLAPSE', 'ERROR']
      }
    },
    machineStates: {
      'dashboard': {
        idle: {
          description: 'Dashboard is ready for interaction',
          actions: ['initialize', 'setupEventListeners']
        },
        loading: {
          description: 'Loading dashboard data',
          actions: ['fetchData', 'showLoadingState']
        },
        loaded: {
          description: 'Dashboard data is loaded and ready',
          actions: ['renderDashboard', 'setupInteractions']
        },
        error: {
          description: 'Error occurred while loading dashboard',
          actions: ['showError', 'provideRetryOption']
        }
      },
      'log-viewer': {
        idle: {
          description: 'Log viewer is ready',
          actions: ['initialize', 'setupLogSources']
        },
        loading: {
          description: 'Loading log data',
          actions: ['fetchLogs', 'parseLogs', 'showProgress']
        },
        viewing: {
          description: 'Displaying logs for viewing',
          actions: ['renderLogs', 'setupFilters', 'enableSearch']
        },
        filtering: {
          description: 'Applying filters to logs',
          actions: ['applyFilters', 'updateView', 'showFilterCount']
        }
      },
      // Add missing machine states for the editor components
      'app': {
        idle: {
          description: 'Application is ready for initialization',
          actions: ['setup', 'prepare']
        },
        initializing: {
          description: 'Application is initializing',
          actions: ['loadConfig', 'setupMachines', 'prepareUI']
        },
        ready: {
          description: 'Application is ready for use',
          actions: ['enableNavigation', 'setupEventHandlers']
        },
        navigating: {
          description: 'Application is navigating between routes',
          actions: ['updateRoute', 'updateContext']
        },
        error: {
          description: 'Application encountered an error',
          actions: ['showError', 'provideRecovery']
        }
      },
      'wave-tabs': {
        idle: {
          description: 'Wave tabs are ready',
          actions: ['setup', 'prepare']
        },
        active: {
          description: 'Wave tabs are active and navigable',
          actions: ['enableNavigation', 'setupTabHandlers']
        },
        navigating: {
          description: 'Wave tabs are navigating between tabs',
          actions: ['updateActiveTab', 'updateHistory']
        },
        error: {
          description: 'Wave tabs encountered an error',
          actions: ['showError', 'provideRecovery']
        }
      },
      'selector-input': {
        idle: {
          description: 'Selector input is ready',
          actions: ['setup', 'prepare']
        },
        inputting: {
          description: 'User is entering input',
          actions: ['captureInput', 'validateFormat']
        },
        validating: {
          description: 'Input is being validated',
          actions: ['checkSyntax', 'verifyRules']
        },
        saving: {
          description: 'Input is being saved',
          actions: ['persistData', 'updateState']
        },
        error: {
          description: 'Selector input encountered an error',
          actions: ['showError', 'provideRecovery']
        }
      },
      'about': {
        idle: {
          description: 'About component is ready',
          actions: ['setup', 'prepare']
        },
        expanded: {
          description: 'About information is expanded',
          actions: ['showDetails', 'enableInteractions']
        },
        help: {
          description: 'Help information is displayed',
          actions: ['showHelp', 'enableNavigation']
        },
        error: {
          description: 'About component encountered an error',
          actions: ['showError', 'provideRecovery']
        }
      }
    }
  }
};
// Utility function to create a custom structural config
function createStructuralConfig(overrides = {}) {
  return {
    ...DefaultStructuralConfig,
    ...overrides,
    ComponentTomeMapping: {
      ...DefaultStructuralConfig.ComponentTomeMapping,
      ...overrides.ComponentTomeMapping
    },
    RoutingConfig: {
      ...DefaultStructuralConfig.RoutingConfig,
      ...overrides.RoutingConfig,
      routes: [...(overrides.RoutingConfig?.routes || DefaultStructuralConfig.RoutingConfig.routes)],
      navigation: {
        ...DefaultStructuralConfig.RoutingConfig.navigation,
        ...overrides.RoutingConfig?.navigation,
        primary: [...(overrides.RoutingConfig?.navigation?.primary || DefaultStructuralConfig.RoutingConfig.navigation.primary)],
        secondary: [...(overrides.RoutingConfig?.navigation?.secondary || DefaultStructuralConfig.RoutingConfig.navigation.secondary || [])]
      }
    },
    TomeConfig: {
      ...DefaultStructuralConfig.TomeConfig,
      ...overrides.TomeConfig,
      tomes: {
        ...DefaultStructuralConfig.TomeConfig.tomes,
        ...overrides.TomeConfig?.tomes
      },
      machineStates: {
        ...DefaultStructuralConfig.TomeConfig.machineStates,
        ...overrides.TomeConfig?.machineStates
      }
    }
  };
}


/***/ }),

/***/ "../log-view-machine/node_modules/@xstate/react/es/useConstant.js":
/*!************************************************************************!*\
  !*** ../log-view-machine/node_modules/@xstate/react/es/useConstant.js ***!
  \************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useConstant)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function useConstant(fn) {
    var ref = react__WEBPACK_IMPORTED_MODULE_0__.useRef();
    if (!ref.current) {
        ref.current = { v: fn() };
    }
    return ref.current.v;
}


/***/ }),

/***/ "../log-view-machine/node_modules/@xstate/react/es/useInterpret.js":
/*!*************************************************************************!*\
  !*** ../log-view-machine/node_modules/@xstate/react/es/useInterpret.js ***!
  \*************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useIdleInterpreter: () => (/* binding */ useIdleInterpreter),
/* harmony export */   useInterpret: () => (/* binding */ useInterpret)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! use-isomorphic-layout-effect */ "../log-view-machine/node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/interpreter.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/State.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/utils.js");
/* harmony import */ var _useConstant__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./useConstant */ "../log-view-machine/node_modules/@xstate/react/es/useConstant.js");
var __assign = (undefined && undefined.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};




function useIdleInterpreter(getMachine, options) {
    var machine = (0,_useConstant__WEBPACK_IMPORTED_MODULE_5__["default"])(function () {
        return typeof getMachine === 'function' ? getMachine() : getMachine;
    });
    if ( true &&
        typeof getMachine !== 'function') {
        var _a = __read((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(machine), 1), initialMachine = _a[0];
        if (getMachine !== initialMachine) {
            console.warn('Machine given to `useMachine` has changed between renders. This is not supported and might lead to unexpected results.\n' +
                'Please make sure that you pass the same Machine as argument each time.');
        }
    }
    var context = options.context, guards = options.guards, actions = options.actions, activities = options.activities, services = options.services, delays = options.delays, rehydratedState = options.state, interpreterOptions = __rest(options, ["context", "guards", "actions", "activities", "services", "delays", "state"]);
    var service = (0,_useConstant__WEBPACK_IMPORTED_MODULE_5__["default"])(function () {
        var machineConfig = {
            context: context,
            guards: guards,
            actions: actions,
            activities: activities,
            services: services,
            delays: delays
        };
        var machineWithConfig = machine.withConfig(machineConfig, function () { return (__assign(__assign({}, machine.context), context)); });
        return (0,xstate__WEBPACK_IMPORTED_MODULE_2__.interpret)(machineWithConfig, interpreterOptions);
    });
    // Make sure options are kept updated when they change.
    // This mutation assignment is safe because the service instance is only used
    // in one place -- this hook's caller.
    (0,use_isomorphic_layout_effect__WEBPACK_IMPORTED_MODULE_1__["default"])(function () {
        Object.assign(service.machine.options.actions, actions);
        Object.assign(service.machine.options.guards, guards);
        Object.assign(service.machine.options.activities, activities);
        Object.assign(service.machine.options.services, services);
        Object.assign(service.machine.options.delays, delays);
    }, [actions, guards, activities, services, delays]);
    return service;
}
function useInterpret(getMachine) {
    var _a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _a[_i - 1] = arguments[_i];
    }
    var _b = __read(_a, 2), _c = _b[0], options = _c === void 0 ? {} : _c, observerOrListener = _b[1];
    var service = useIdleInterpreter(getMachine, options);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        if (!observerOrListener) {
            return;
        }
        var sub = service.subscribe((0,xstate__WEBPACK_IMPORTED_MODULE_4__.toObserver)(observerOrListener));
        return function () {
            sub.unsubscribe();
        };
    }, [observerOrListener]);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var rehydratedState = options.state;
        service.start(rehydratedState ? xstate__WEBPACK_IMPORTED_MODULE_3__.State.create(rehydratedState) : undefined);
        return function () {
            service.stop();
            service.status = xstate__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus.NotStarted;
        };
    }, []);
    return service;
}


/***/ }),

/***/ "../log-view-machine/node_modules/@xstate/react/es/useMachine.js":
/*!***********************************************************************!*\
  !*** ../log-view-machine/node_modules/@xstate/react/es/useMachine.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMachine: () => (/* binding */ useMachine)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var use_sync_external_store_shim_with_selector__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! use-sync-external-store/shim/with-selector */ "../log-view-machine/node_modules/use-sync-external-store/shim/with-selector.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/interpreter.js");
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/State.js");
/* harmony import */ var _useInterpret__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./useInterpret */ "../log-view-machine/node_modules/@xstate/react/es/useInterpret.js");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./utils */ "../log-view-machine/node_modules/@xstate/react/es/utils.js");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};





function identity(a) {
    return a;
}
function useMachine(getMachine) {
    var _a = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        _a[_i - 1] = arguments[_i];
    }
    var _b = __read(_a, 1), _c = _b[0], options = _c === void 0 ? {} : _c;
    // using `useIdleInterpreter` allows us to subscribe to the service *before* we start it
    // so we don't miss any notifications
    var service = (0,_useInterpret__WEBPACK_IMPORTED_MODULE_4__.useIdleInterpreter)(getMachine, options);
    var getSnapshot = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function () {
        if (service.status === xstate__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus.NotStarted) {
            return (options.state
                ? xstate__WEBPACK_IMPORTED_MODULE_3__.State.create(options.state)
                : service.machine.initialState);
        }
        return service.getSnapshot();
    }, [service]);
    var isEqual = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (prevState, nextState) {
        return (0,_utils__WEBPACK_IMPORTED_MODULE_5__.isInterpreterStateEqual)(service, prevState, nextState);
    }, [service]);
    var subscribe = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(function (handleStoreChange) {
        var unsubscribe = service.subscribe(handleStoreChange).unsubscribe;
        return unsubscribe;
    }, [service]);
    var storeSnapshot = (0,use_sync_external_store_shim_with_selector__WEBPACK_IMPORTED_MODULE_1__.useSyncExternalStoreWithSelector)(subscribe, getSnapshot, getSnapshot, identity, isEqual);
    (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(function () {
        var rehydratedState = options.state;
        service.start(rehydratedState ? xstate__WEBPACK_IMPORTED_MODULE_3__.State.create(rehydratedState) : undefined);
        return function () {
            service.stop();
            service.status = xstate__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus.NotStarted;
        };
    }, []);
    return [storeSnapshot, service.send, service];
}


/***/ }),

/***/ "../log-view-machine/node_modules/@xstate/react/es/utils.js":
/*!******************************************************************!*\
  !*** ../log-view-machine/node_modules/@xstate/react/es/utils.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getServiceSnapshot: () => (/* binding */ getServiceSnapshot),
/* harmony export */   isInterpreterStateEqual: () => (/* binding */ isInterpreterStateEqual),
/* harmony export */   isService: () => (/* binding */ isService),
/* harmony export */   partition: () => (/* binding */ partition),
/* harmony export */   shallowEqual: () => (/* binding */ shallowEqual)
/* harmony export */ });
/* harmony import */ var xstate__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! xstate */ "../log-view-machine/node_modules/xstate/es/interpreter.js");
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};

function partition(items, predicate) {
    var e_1, _a;
    var _b = __read([[], []], 2), truthy = _b[0], falsy = _b[1];
    try {
        for (var items_1 = __values(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
            var item = items_1_1.value;
            if (predicate(item)) {
                truthy.push(item);
            }
            else {
                falsy.push(item);
            }
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return [truthy, falsy];
}
function getServiceSnapshot(service) {
    return service.status !== 0
        ? service.getSnapshot()
        : service.machine.initialState;
}
// From https://github.com/reduxjs/react-redux/blob/master/src/utils/shallowEqual.ts
function is(x, y) {
    if (x === y) {
        return x !== 0 || y !== 0 || 1 / x === 1 / y;
    }
    else {
        return x !== x && y !== y;
    }
}
function shallowEqual(objA, objB) {
    if (is(objA, objB))
        return true;
    if (typeof objA !== 'object' ||
        objA === null ||
        typeof objB !== 'object' ||
        objB === null) {
        return false;
    }
    var keysA = Object.keys(objA);
    var keysB = Object.keys(objB);
    if (keysA.length !== keysB.length)
        return false;
    for (var i = 0; i < keysA.length; i++) {
        if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
            !is(objA[keysA[i]], objB[keysA[i]])) {
            return false;
        }
    }
    return true;
}
function isService(actor) {
    return 'state' in actor && 'machine' in actor;
}
function isInterpreterStateEqual(service, prevState, nextState) {
    if (service.status === xstate__WEBPACK_IMPORTED_MODULE_0__.InterpreterStatus.NotStarted) {
        return true;
    }
    // Only change the current state if:
    // - the incoming state is the "live" initial state (since it might have new actors)
    // - OR the incoming state actually changed.
    //
    // The "live" initial state will have .changed === undefined.
    var initialStateChanged = nextState.changed === undefined &&
        (Object.keys(nextState.children).length > 0 ||
            typeof prevState.changed === 'boolean');
    return !(nextState.changed || initialStateChanged);
}


/***/ }),

/***/ "../log-view-machine/node_modules/react/cjs/react.development.js":
/*!***********************************************************************!*\
  !*** ../log-view-machine/node_modules/react/cjs/react.development.js ***!
  \***********************************************************************/
/***/ ((module, exports, __webpack_require__) => {

"use strict";
/* module decorator */ module = __webpack_require__.nmd(module);
/**
 * @license React
 * react.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (true) {
  (function() {

          'use strict';

/* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(new Error());
}
          var ReactVersion = '18.3.1';

// ATTENTION
// When adding new symbols to this file,
// Please consider also adding to 'react-devtools-shared/src/backend/ReactSymbols'
// The Symbol used to tag the ReactElement-like types.
var REACT_ELEMENT_TYPE = Symbol.for('react.element');
var REACT_PORTAL_TYPE = Symbol.for('react.portal');
var REACT_FRAGMENT_TYPE = Symbol.for('react.fragment');
var REACT_STRICT_MODE_TYPE = Symbol.for('react.strict_mode');
var REACT_PROFILER_TYPE = Symbol.for('react.profiler');
var REACT_PROVIDER_TYPE = Symbol.for('react.provider');
var REACT_CONTEXT_TYPE = Symbol.for('react.context');
var REACT_FORWARD_REF_TYPE = Symbol.for('react.forward_ref');
var REACT_SUSPENSE_TYPE = Symbol.for('react.suspense');
var REACT_SUSPENSE_LIST_TYPE = Symbol.for('react.suspense_list');
var REACT_MEMO_TYPE = Symbol.for('react.memo');
var REACT_LAZY_TYPE = Symbol.for('react.lazy');
var REACT_OFFSCREEN_TYPE = Symbol.for('react.offscreen');
var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator';
function getIteratorFn(maybeIterable) {
  if (maybeIterable === null || typeof maybeIterable !== 'object') {
    return null;
  }

  var maybeIterator = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL];

  if (typeof maybeIterator === 'function') {
    return maybeIterator;
  }

  return null;
}

/**
 * Keeps track of the current dispatcher.
 */
var ReactCurrentDispatcher = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

/**
 * Keeps track of the current batch's configuration such as how long an update
 * should suspend for if it needs to.
 */
var ReactCurrentBatchConfig = {
  transition: null
};

var ReactCurrentActQueue = {
  current: null,
  // Used to reproduce behavior of `batchedUpdates` in legacy mode.
  isBatchingLegacy: false,
  didScheduleLegacyUpdate: false
};

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var ReactDebugCurrentFrame = {};
var currentExtraStackFrame = null;
function setExtraStackFrame(stack) {
  {
    currentExtraStackFrame = stack;
  }
}

{
  ReactDebugCurrentFrame.setExtraStackFrame = function (stack) {
    {
      currentExtraStackFrame = stack;
    }
  }; // Stack implementation injected by the current renderer.


  ReactDebugCurrentFrame.getCurrentStack = null;

  ReactDebugCurrentFrame.getStackAddendum = function () {
    var stack = ''; // Add an extra top frame while an element is being validated

    if (currentExtraStackFrame) {
      stack += currentExtraStackFrame;
    } // Delegate to the injected renderer-specific implementation


    var impl = ReactDebugCurrentFrame.getCurrentStack;

    if (impl) {
      stack += impl() || '';
    }

    return stack;
  };
}

// -----------------------------------------------------------------------------

var enableScopeAPI = false; // Experimental Create Event Handle API.
var enableCacheElement = false;
var enableTransitionTracing = false; // No known bugs, but needs performance testing

var enableLegacyHidden = false; // Enables unstable_avoidThisFallback feature in Fiber
// stuff. Intended to enable React core members to more easily debug scheduling
// issues in DEV builds.

var enableDebugTracing = false; // Track which Fiber(s) schedule render work.

var ReactSharedInternals = {
  ReactCurrentDispatcher: ReactCurrentDispatcher,
  ReactCurrentBatchConfig: ReactCurrentBatchConfig,
  ReactCurrentOwner: ReactCurrentOwner
};

{
  ReactSharedInternals.ReactDebugCurrentFrame = ReactDebugCurrentFrame;
  ReactSharedInternals.ReactCurrentActQueue = ReactCurrentActQueue;
}

// by calls to these methods by a Babel plugin.
//
// In PROD (or in packages without access to React internals),
// they are left as they are instead.

function warn(format) {
  {
    {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      printWarning('warn', format, args);
    }
  }
}
function error(format) {
  {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }
}

function printWarning(level, format, args) {
  // When changing this logic, you might want to also
  // update consoleWithStackDev.www.js as well.
  {
    var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
    var stack = ReactDebugCurrentFrame.getStackAddendum();

    if (stack !== '') {
      format += '%s';
      args = args.concat([stack]);
    } // eslint-disable-next-line react-internal/safe-string-coercion


    var argsWithFormat = args.map(function (item) {
      return String(item);
    }); // Careful: RN currently depends on this prefix

    argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
    // breaks IE9: https://github.com/facebook/react/issues/13610
    // eslint-disable-next-line react-internal/no-production-logging

    Function.prototype.apply.call(console[level], console, argsWithFormat);
  }
}

var didWarnStateUpdateForUnmountedComponent = {};

function warnNoop(publicInstance, callerName) {
  {
    var _constructor = publicInstance.constructor;
    var componentName = _constructor && (_constructor.displayName || _constructor.name) || 'ReactClass';
    var warningKey = componentName + "." + callerName;

    if (didWarnStateUpdateForUnmountedComponent[warningKey]) {
      return;
    }

    error("Can't call %s on a component that is not yet mounted. " + 'This is a no-op, but it might indicate a bug in your application. ' + 'Instead, assign to `this.state` directly or define a `state = {};` ' + 'class property with the desired state in the %s component.', callerName, componentName);

    didWarnStateUpdateForUnmountedComponent[warningKey] = true;
  }
}
/**
 * This is the abstract API for an update queue.
 */


var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} callerName name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var assign = Object.assign;

var emptyObject = {};

{
  Object.freeze(emptyObject);
}
/**
 * Base class helpers for the updating state of a component.
 */


function Component(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject; // We initialize the default updater but the real one gets injected by the
  // renderer.

  this.updater = updater || ReactNoopUpdateQueue;
}

Component.prototype.isReactComponent = {};
/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */

Component.prototype.setState = function (partialState, callback) {
  if (typeof partialState !== 'object' && typeof partialState !== 'function' && partialState != null) {
    throw new Error('setState(...): takes an object of state variables to update or a ' + 'function which returns an object of state variables.');
  }

  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};
/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */


Component.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};
/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */


{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };

  var defineDeprecationWarning = function (methodName, info) {
    Object.defineProperty(Component.prototype, methodName, {
      get: function () {
        warn('%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);

        return undefined;
      }
    });
  };

  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

function ComponentDummy() {}

ComponentDummy.prototype = Component.prototype;
/**
 * Convenience component with default shallow equality check for sCU.
 */

function PureComponent(props, context, updater) {
  this.props = props;
  this.context = context; // If a component has string refs, we will assign a different object later.

  this.refs = emptyObject;
  this.updater = updater || ReactNoopUpdateQueue;
}

var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
pureComponentPrototype.constructor = PureComponent; // Avoid an extra prototype jump for these methods.

assign(pureComponentPrototype, Component.prototype);
pureComponentPrototype.isPureReactComponent = true;

// an immutable object with a single mutable value
function createRef() {
  var refObject = {
    current: null
  };

  {
    Object.seal(refObject);
  }

  return refObject;
}

var isArrayImpl = Array.isArray; // eslint-disable-next-line no-redeclare

function isArray(a) {
  return isArrayImpl(a);
}

/*
 * The `'' + value` pattern (used in in perf-sensitive code) throws for Symbol
 * and Temporal.* types. See https://github.com/facebook/react/pull/22064.
 *
 * The functions in this module will throw an easier-to-understand,
 * easier-to-debug exception with a clear errors message message explaining the
 * problem. (Instead of a confusing exception thrown inside the implementation
 * of the `value` object).
 */
// $FlowFixMe only called in DEV, so void return is not possible.
function typeName(value) {
  {
    // toStringTag is needed for namespaced types like Temporal.Instant
    var hasToStringTag = typeof Symbol === 'function' && Symbol.toStringTag;
    var type = hasToStringTag && value[Symbol.toStringTag] || value.constructor.name || 'Object';
    return type;
  }
} // $FlowFixMe only called in DEV, so void return is not possible.


function willCoercionThrow(value) {
  {
    try {
      testStringCoercion(value);
      return false;
    } catch (e) {
      return true;
    }
  }
}

function testStringCoercion(value) {
  // If you ended up here by following an exception call stack, here's what's
  // happened: you supplied an object or symbol value to React (as a prop, key,
  // DOM attribute, CSS property, string ref, etc.) and when React tried to
  // coerce it to a string using `'' + value`, an exception was thrown.
  //
  // The most common types that will cause this exception are `Symbol` instances
  // and Temporal objects like `Temporal.Instant`. But any object that has a
  // `valueOf` or `[Symbol.toPrimitive]` method that throws will also cause this
  // exception. (Library authors do this to prevent users from using built-in
  // numeric operators like `+` or comparison operators like `>=` because custom
  // methods are needed to perform accurate arithmetic or comparison.)
  //
  // To fix the problem, coerce this object or symbol value to a string before
  // passing it to React. The most reliable way is usually `String(value)`.
  //
  // To find which value is throwing, check the browser or debugger console.
  // Before this exception was thrown, there should be `console.error` output
  // that shows the type (Symbol, Temporal.PlainDate, etc.) that caused the
  // problem and how that type was used: key, atrribute, input value prop, etc.
  // In most cases, this console output also shows the component and its
  // ancestor components where the exception happened.
  //
  // eslint-disable-next-line react-internal/safe-string-coercion
  return '' + value;
}
function checkKeyStringCoercion(value) {
  {
    if (willCoercionThrow(value)) {
      error('The provided key is an unsupported type %s.' + ' This value must be coerced to a string before before using it here.', typeName(value));

      return testStringCoercion(value); // throw (to help callers find troubleshooting comments)
    }
  }
}

function getWrappedName(outerType, innerType, wrapperName) {
  var displayName = outerType.displayName;

  if (displayName) {
    return displayName;
  }

  var functionName = innerType.displayName || innerType.name || '';
  return functionName !== '' ? wrapperName + "(" + functionName + ")" : wrapperName;
} // Keep in sync with react-reconciler/getComponentNameFromFiber


function getContextName(type) {
  return type.displayName || 'Context';
} // Note that the reconciler package should generally prefer to use getComponentNameFromFiber() instead.


function getComponentNameFromType(type) {
  if (type == null) {
    // Host root, text node or just invalid type.
    return null;
  }

  {
    if (typeof type.tag === 'number') {
      error('Received an unexpected object in getComponentNameFromType(). ' + 'This is likely a bug in React. Please file an issue.');
    }
  }

  if (typeof type === 'function') {
    return type.displayName || type.name || null;
  }

  if (typeof type === 'string') {
    return type;
  }

  switch (type) {
    case REACT_FRAGMENT_TYPE:
      return 'Fragment';

    case REACT_PORTAL_TYPE:
      return 'Portal';

    case REACT_PROFILER_TYPE:
      return 'Profiler';

    case REACT_STRICT_MODE_TYPE:
      return 'StrictMode';

    case REACT_SUSPENSE_TYPE:
      return 'Suspense';

    case REACT_SUSPENSE_LIST_TYPE:
      return 'SuspenseList';

  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_CONTEXT_TYPE:
        var context = type;
        return getContextName(context) + '.Consumer';

      case REACT_PROVIDER_TYPE:
        var provider = type;
        return getContextName(provider._context) + '.Provider';

      case REACT_FORWARD_REF_TYPE:
        return getWrappedName(type, type.render, 'ForwardRef');

      case REACT_MEMO_TYPE:
        var outerName = type.displayName || null;

        if (outerName !== null) {
          return outerName;
        }

        return getComponentNameFromType(type.type) || 'Memo';

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            return getComponentNameFromType(init(payload));
          } catch (x) {
            return null;
          }
        }

      // eslint-disable-next-line no-fallthrough
    }
  }

  return null;
}

var hasOwnProperty = Object.prototype.hasOwnProperty;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};
var specialPropKeyWarningShown, specialPropRefWarningShown, didWarnAboutStringRefs;

{
  didWarnAboutStringRefs = {};
}

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;

      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }

  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    {
      if (!specialPropKeyWarningShown) {
        specialPropKeyWarningShown = true;

        error('%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    }
  };

  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    {
      if (!specialPropRefWarningShown) {
        specialPropRefWarningShown = true;

        error('%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://reactjs.org/link/special-props)', displayName);
      }
    }
  };

  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

function warnIfStringRefCannotBeAutoConverted(config) {
  {
    if (typeof config.ref === 'string' && ReactCurrentOwner.current && config.__self && ReactCurrentOwner.current.stateNode !== config.__self) {
      var componentName = getComponentNameFromType(ReactCurrentOwner.current.type);

      if (!didWarnAboutStringRefs[componentName]) {
        error('Component "%s" contains the string ref "%s". ' + 'Support for string refs will be removed in a future major release. ' + 'This case cannot be automatically converted to an arrow function. ' + 'We ask you to manually fix this case by using useRef() or createRef() instead. ' + 'Learn more about using refs safely here: ' + 'https://reactjs.org/link/strict-mode-string-ref', componentName, config.ref);

        didWarnAboutStringRefs[componentName] = true;
      }
    }
  }
}
/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, instanceof check
 * will not work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} props
 * @param {*} key
 * @param {string|object} ref
 * @param {*} owner
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @internal
 */


var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allows us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,
    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,
    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {}; // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.

    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    }); // self and source are DEV only properties.

    Object.defineProperty(element, '_self', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: self
    }); // Two elements created in two different places should be considered
    // equal for testing purposes and therefore we hide it from enumeration.

    Object.defineProperty(element, '_source', {
      configurable: false,
      enumerable: false,
      writable: false,
      value: source
    });

    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};
/**
 * Create and return a new ReactElement of the given type.
 * See https://reactjs.org/docs/react-api.html#createelement
 */

function createElement(type, config, children) {
  var propName; // Reserved names are extracted

  var props = {};
  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;

      {
        warnIfStringRefCannotBeAutoConverted(config);
      }
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source; // Remaining properties are added to a new props object

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }

    props.children = childArray;
  } // Resolve default props


  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;

    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }

  {
    if (key || ref) {
      var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;

      if (key) {
        defineKeyPropWarningGetter(props, displayName);
      }

      if (ref) {
        defineRefPropWarningGetter(props, displayName);
      }
    }
  }

  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
}
function cloneAndReplaceKey(oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);
  return newElement;
}
/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://reactjs.org/docs/react-api.html#cloneelement
 */

function cloneElement(element, config, children) {
  if (element === null || element === undefined) {
    throw new Error("React.cloneElement(...): The argument must be a React element, but you passed " + element + ".");
  }

  var propName; // Original props are copied

  var props = assign({}, element.props); // Reserved names are extracted

  var key = element.key;
  var ref = element.ref; // Self is preserved since the owner is preserved.

  var self = element._self; // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.

  var source = element._source; // Owner will be preserved, unless ref is overridden

  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }

    if (hasValidKey(config)) {
      {
        checkKeyStringCoercion(config.key);
      }

      key = '' + config.key;
    } // Remaining properties override existing props


    var defaultProps;

    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }

    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  } // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.


  var childrenLength = arguments.length - 2;

  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);

    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }

    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
}
/**
 * Verifies the object is a ReactElement.
 * See https://reactjs.org/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a ReactElement.
 * @final
 */

function isValidElement(object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';
/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = key.replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });
  return '$' + escapedString;
}
/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */


var didWarnAboutMaps = false;
var userProvidedKeyEscapeRegex = /\/+/g;

function escapeUserProvidedKey(text) {
  return text.replace(userProvidedKeyEscapeRegex, '$&/');
}
/**
 * Generate a key string that identifies a element within a set.
 *
 * @param {*} element A element that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */


function getElementKey(element, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof element === 'object' && element !== null && element.key != null) {
    // Explicit key
    {
      checkKeyStringCoercion(element.key);
    }

    return escape('' + element.key);
  } // Implicit key determined by the index in the set


  return index.toString(36);
}

function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  var invokeCallback = false;

  if (children === null) {
    invokeCallback = true;
  } else {
    switch (type) {
      case 'string':
      case 'number':
        invokeCallback = true;
        break;

      case 'object':
        switch (children.$$typeof) {
          case REACT_ELEMENT_TYPE:
          case REACT_PORTAL_TYPE:
            invokeCallback = true;
        }

    }
  }

  if (invokeCallback) {
    var _child = children;
    var mappedChild = callback(_child); // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows:

    var childKey = nameSoFar === '' ? SEPARATOR + getElementKey(_child, 0) : nameSoFar;

    if (isArray(mappedChild)) {
      var escapedChildKey = '';

      if (childKey != null) {
        escapedChildKey = escapeUserProvidedKey(childKey) + '/';
      }

      mapIntoArray(mappedChild, array, escapedChildKey, '', function (c) {
        return c;
      });
    } else if (mappedChild != null) {
      if (isValidElement(mappedChild)) {
        {
          // The `if` statement here prevents auto-disabling of the safe
          // coercion ESLint rule, so we must manually disable it below.
          // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
          if (mappedChild.key && (!_child || _child.key !== mappedChild.key)) {
            checkKeyStringCoercion(mappedChild.key);
          }
        }

        mappedChild = cloneAndReplaceKey(mappedChild, // Keep both the (mapped) and old keys if they differ, just as
        // traverseAllChildren used to do for objects as children
        escapedPrefix + ( // $FlowFixMe Flow incorrectly thinks React.Portal doesn't have a key
        mappedChild.key && (!_child || _child.key !== mappedChild.key) ? // $FlowFixMe Flow incorrectly thinks existing element's key can be a number
        // eslint-disable-next-line react-internal/safe-string-coercion
        escapeUserProvidedKey('' + mappedChild.key) + '/' : '') + childKey);
      }

      array.push(mappedChild);
    }

    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.

  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getElementKey(child, i);
      subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
    }
  } else {
    var iteratorFn = getIteratorFn(children);

    if (typeof iteratorFn === 'function') {
      var iterableChildren = children;

      {
        // Warn about using Maps as children
        if (iteratorFn === iterableChildren.entries) {
          if (!didWarnAboutMaps) {
            warn('Using Maps as children is not supported. ' + 'Use an array of keyed ReactElements instead.');
          }

          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(iterableChildren);
      var step;
      var ii = 0;

      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getElementKey(child, ii++);
        subtreeCount += mapIntoArray(child, array, escapedPrefix, nextName, callback);
      }
    } else if (type === 'object') {
      // eslint-disable-next-line react-internal/safe-string-coercion
      var childrenString = String(children);
      throw new Error("Objects are not valid as a React child (found: " + (childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString) + "). " + 'If you meant to render a collection of children, use an array ' + 'instead.');
    }
  }

  return subtreeCount;
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenmap
 *
 * The provided mapFunction(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }

  var result = [];
  var count = 0;
  mapIntoArray(children, result, '', '', function (child) {
    return func.call(context, child, count++);
  });
  return result;
}
/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrencount
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */


function countChildren(children) {
  var n = 0;
  mapChildren(children, function () {
    n++; // Don't return anything
  });
  return n;
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenforeach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  mapChildren(children, function () {
    forEachFunc.apply(this, arguments); // Don't return anything.
  }, forEachContext);
}
/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrentoarray
 */


function toArray(children) {
  return mapChildren(children, function (child) {
    return child;
  }) || [];
}
/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://reactjs.org/docs/react-api.html#reactchildrenonly
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */


function onlyChild(children) {
  if (!isValidElement(children)) {
    throw new Error('React.Children.only expected to receive a single React element child.');
  }

  return children;
}

function createContext(defaultValue) {
  // TODO: Second argument used to be an optional `calculateChangedBits`
  // function. Warn to reserve for future use?
  var context = {
    $$typeof: REACT_CONTEXT_TYPE,
    // As a workaround to support multiple concurrent renderers, we categorize
    // some renderers as primary and others as secondary. We only expect
    // there to be two concurrent renderers at most: React Native (primary) and
    // Fabric (secondary); React DOM (primary) and React ART (secondary).
    // Secondary renderers store their context values on separate fields.
    _currentValue: defaultValue,
    _currentValue2: defaultValue,
    // Used to track how many concurrent renderers this context currently
    // supports within in a single renderer. Such as parallel server rendering.
    _threadCount: 0,
    // These are circular
    Provider: null,
    Consumer: null,
    // Add these to use same hidden class in VM as ServerContext
    _defaultValue: null,
    _globalName: null
  };
  context.Provider = {
    $$typeof: REACT_PROVIDER_TYPE,
    _context: context
  };
  var hasWarnedAboutUsingNestedContextConsumers = false;
  var hasWarnedAboutUsingConsumerProvider = false;
  var hasWarnedAboutDisplayNameOnConsumer = false;

  {
    // A separate object, but proxies back to the original context object for
    // backwards compatibility. It has a different $$typeof, so we can properly
    // warn for the incorrect usage of Context as a Consumer.
    var Consumer = {
      $$typeof: REACT_CONTEXT_TYPE,
      _context: context
    }; // $FlowFixMe: Flow complains about not setting a value, which is intentional here

    Object.defineProperties(Consumer, {
      Provider: {
        get: function () {
          if (!hasWarnedAboutUsingConsumerProvider) {
            hasWarnedAboutUsingConsumerProvider = true;

            error('Rendering <Context.Consumer.Provider> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Provider> instead?');
          }

          return context.Provider;
        },
        set: function (_Provider) {
          context.Provider = _Provider;
        }
      },
      _currentValue: {
        get: function () {
          return context._currentValue;
        },
        set: function (_currentValue) {
          context._currentValue = _currentValue;
        }
      },
      _currentValue2: {
        get: function () {
          return context._currentValue2;
        },
        set: function (_currentValue2) {
          context._currentValue2 = _currentValue2;
        }
      },
      _threadCount: {
        get: function () {
          return context._threadCount;
        },
        set: function (_threadCount) {
          context._threadCount = _threadCount;
        }
      },
      Consumer: {
        get: function () {
          if (!hasWarnedAboutUsingNestedContextConsumers) {
            hasWarnedAboutUsingNestedContextConsumers = true;

            error('Rendering <Context.Consumer.Consumer> is not supported and will be removed in ' + 'a future major release. Did you mean to render <Context.Consumer> instead?');
          }

          return context.Consumer;
        }
      },
      displayName: {
        get: function () {
          return context.displayName;
        },
        set: function (displayName) {
          if (!hasWarnedAboutDisplayNameOnConsumer) {
            warn('Setting `displayName` on Context.Consumer has no effect. ' + "You should set it directly on the context with Context.displayName = '%s'.", displayName);

            hasWarnedAboutDisplayNameOnConsumer = true;
          }
        }
      }
    }); // $FlowFixMe: Flow complains about missing properties because it doesn't understand defineProperty

    context.Consumer = Consumer;
  }

  {
    context._currentRenderer = null;
    context._currentRenderer2 = null;
  }

  return context;
}

var Uninitialized = -1;
var Pending = 0;
var Resolved = 1;
var Rejected = 2;

function lazyInitializer(payload) {
  if (payload._status === Uninitialized) {
    var ctor = payload._result;
    var thenable = ctor(); // Transition to the next state.
    // This might throw either because it's missing or throws. If so, we treat it
    // as still uninitialized and try again next time. Which is the same as what
    // happens if the ctor or any wrappers processing the ctor throws. This might
    // end up fixing it if the resolution was a concurrency bug.

    thenable.then(function (moduleObject) {
      if (payload._status === Pending || payload._status === Uninitialized) {
        // Transition to the next state.
        var resolved = payload;
        resolved._status = Resolved;
        resolved._result = moduleObject;
      }
    }, function (error) {
      if (payload._status === Pending || payload._status === Uninitialized) {
        // Transition to the next state.
        var rejected = payload;
        rejected._status = Rejected;
        rejected._result = error;
      }
    });

    if (payload._status === Uninitialized) {
      // In case, we're still uninitialized, then we're waiting for the thenable
      // to resolve. Set it as pending in the meantime.
      var pending = payload;
      pending._status = Pending;
      pending._result = thenable;
    }
  }

  if (payload._status === Resolved) {
    var moduleObject = payload._result;

    {
      if (moduleObject === undefined) {
        error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
        'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))\n\n" + 'Did you accidentally put curly braces around the import?', moduleObject);
      }
    }

    {
      if (!('default' in moduleObject)) {
        error('lazy: Expected the result of a dynamic imp' + 'ort() call. ' + 'Instead received: %s\n\nYour code should look like: \n  ' + // Break up imports to avoid accidentally parsing them as dependencies.
        'const MyComponent = lazy(() => imp' + "ort('./MyComponent'))", moduleObject);
      }
    }

    return moduleObject.default;
  } else {
    throw payload._result;
  }
}

function lazy(ctor) {
  var payload = {
    // We use these fields to store the result.
    _status: Uninitialized,
    _result: ctor
  };
  var lazyType = {
    $$typeof: REACT_LAZY_TYPE,
    _payload: payload,
    _init: lazyInitializer
  };

  {
    // In production, this would just set it on the object.
    var defaultProps;
    var propTypes; // $FlowFixMe

    Object.defineProperties(lazyType, {
      defaultProps: {
        configurable: true,
        get: function () {
          return defaultProps;
        },
        set: function (newDefaultProps) {
          error('React.lazy(...): It is not supported to assign `defaultProps` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          defaultProps = newDefaultProps; // Match production behavior more closely:
          // $FlowFixMe

          Object.defineProperty(lazyType, 'defaultProps', {
            enumerable: true
          });
        }
      },
      propTypes: {
        configurable: true,
        get: function () {
          return propTypes;
        },
        set: function (newPropTypes) {
          error('React.lazy(...): It is not supported to assign `propTypes` to ' + 'a lazy component import. Either specify them where the component ' + 'is defined, or create a wrapping component around it.');

          propTypes = newPropTypes; // Match production behavior more closely:
          // $FlowFixMe

          Object.defineProperty(lazyType, 'propTypes', {
            enumerable: true
          });
        }
      }
    });
  }

  return lazyType;
}

function forwardRef(render) {
  {
    if (render != null && render.$$typeof === REACT_MEMO_TYPE) {
      error('forwardRef requires a render function but received a `memo` ' + 'component. Instead of forwardRef(memo(...)), use ' + 'memo(forwardRef(...)).');
    } else if (typeof render !== 'function') {
      error('forwardRef requires a render function but was given %s.', render === null ? 'null' : typeof render);
    } else {
      if (render.length !== 0 && render.length !== 2) {
        error('forwardRef render functions accept exactly two parameters: props and ref. %s', render.length === 1 ? 'Did you forget to use the ref parameter?' : 'Any additional parameter will be undefined.');
      }
    }

    if (render != null) {
      if (render.defaultProps != null || render.propTypes != null) {
        error('forwardRef render functions do not support propTypes or defaultProps. ' + 'Did you accidentally pass a React component?');
      }
    }
  }

  var elementType = {
    $$typeof: REACT_FORWARD_REF_TYPE,
    render: render
  };

  {
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name; // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.forwardRef((props, ref) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.

        if (!render.name && !render.displayName) {
          render.displayName = name;
        }
      }
    });
  }

  return elementType;
}

var REACT_MODULE_REFERENCE;

{
  REACT_MODULE_REFERENCE = Symbol.for('react.module.reference');
}

function isValidElementType(type) {
  if (typeof type === 'string' || typeof type === 'function') {
    return true;
  } // Note: typeof might be other than 'symbol' or 'number' (e.g. if it's a polyfill).


  if (type === REACT_FRAGMENT_TYPE || type === REACT_PROFILER_TYPE || enableDebugTracing  || type === REACT_STRICT_MODE_TYPE || type === REACT_SUSPENSE_TYPE || type === REACT_SUSPENSE_LIST_TYPE || enableLegacyHidden  || type === REACT_OFFSCREEN_TYPE || enableScopeAPI  || enableCacheElement  || enableTransitionTracing ) {
    return true;
  }

  if (typeof type === 'object' && type !== null) {
    if (type.$$typeof === REACT_LAZY_TYPE || type.$$typeof === REACT_MEMO_TYPE || type.$$typeof === REACT_PROVIDER_TYPE || type.$$typeof === REACT_CONTEXT_TYPE || type.$$typeof === REACT_FORWARD_REF_TYPE || // This needs to include all possible module reference object
    // types supported by any Flight configuration anywhere since
    // we don't know which Flight build this will end up being used
    // with.
    type.$$typeof === REACT_MODULE_REFERENCE || type.getModuleId !== undefined) {
      return true;
    }
  }

  return false;
}

function memo(type, compare) {
  {
    if (!isValidElementType(type)) {
      error('memo: The first argument must be a component. Instead ' + 'received: %s', type === null ? 'null' : typeof type);
    }
  }

  var elementType = {
    $$typeof: REACT_MEMO_TYPE,
    type: type,
    compare: compare === undefined ? null : compare
  };

  {
    var ownName;
    Object.defineProperty(elementType, 'displayName', {
      enumerable: false,
      configurable: true,
      get: function () {
        return ownName;
      },
      set: function (name) {
        ownName = name; // The inner component shouldn't inherit this display name in most cases,
        // because the component may be used elsewhere.
        // But it's nice for anonymous functions to inherit the name,
        // so that our component-stack generation logic will display their frames.
        // An anonymous function generally suggests a pattern like:
        //   React.memo((props) => {...});
        // This kind of inner function is not used elsewhere so the side effect is okay.

        if (!type.name && !type.displayName) {
          type.displayName = name;
        }
      }
    });
  }

  return elementType;
}

function resolveDispatcher() {
  var dispatcher = ReactCurrentDispatcher.current;

  {
    if (dispatcher === null) {
      error('Invalid hook call. Hooks can only be called inside of the body of a function component. This could happen for' + ' one of the following reasons:\n' + '1. You might have mismatching versions of React and the renderer (such as React DOM)\n' + '2. You might be breaking the Rules of Hooks\n' + '3. You might have more than one copy of React in the same app\n' + 'See https://reactjs.org/link/invalid-hook-call for tips about how to debug and fix this problem.');
    }
  } // Will result in a null access error if accessed outside render phase. We
  // intentionally don't throw our own error because this is in a hot path.
  // Also helps ensure this is inlined.


  return dispatcher;
}
function useContext(Context) {
  var dispatcher = resolveDispatcher();

  {
    // TODO: add a more generic warning for invalid values.
    if (Context._context !== undefined) {
      var realContext = Context._context; // Don't deduplicate because this legitimately causes bugs
      // and nobody should be using this in existing code.

      if (realContext.Consumer === Context) {
        error('Calling useContext(Context.Consumer) is not supported, may cause bugs, and will be ' + 'removed in a future major release. Did you mean to call useContext(Context) instead?');
      } else if (realContext.Provider === Context) {
        error('Calling useContext(Context.Provider) is not supported. ' + 'Did you mean to call useContext(Context) instead?');
      }
    }
  }

  return dispatcher.useContext(Context);
}
function useState(initialState) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useState(initialState);
}
function useReducer(reducer, initialArg, init) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useReducer(reducer, initialArg, init);
}
function useRef(initialValue) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useRef(initialValue);
}
function useEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useEffect(create, deps);
}
function useInsertionEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useInsertionEffect(create, deps);
}
function useLayoutEffect(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useLayoutEffect(create, deps);
}
function useCallback(callback, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useCallback(callback, deps);
}
function useMemo(create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useMemo(create, deps);
}
function useImperativeHandle(ref, create, deps) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useImperativeHandle(ref, create, deps);
}
function useDebugValue(value, formatterFn) {
  {
    var dispatcher = resolveDispatcher();
    return dispatcher.useDebugValue(value, formatterFn);
  }
}
function useTransition() {
  var dispatcher = resolveDispatcher();
  return dispatcher.useTransition();
}
function useDeferredValue(value) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useDeferredValue(value);
}
function useId() {
  var dispatcher = resolveDispatcher();
  return dispatcher.useId();
}
function useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot) {
  var dispatcher = resolveDispatcher();
  return dispatcher.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Helpers to patch console.logs to avoid logging during side-effect free
// replaying on render function. This currently only patches the object
// lazily which won't cover if the log function was extracted eagerly.
// We could also eagerly patch the method.
var disabledDepth = 0;
var prevLog;
var prevInfo;
var prevWarn;
var prevError;
var prevGroup;
var prevGroupCollapsed;
var prevGroupEnd;

function disabledLog() {}

disabledLog.__reactDisabledLog = true;
function disableLogs() {
  {
    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      prevLog = console.log;
      prevInfo = console.info;
      prevWarn = console.warn;
      prevError = console.error;
      prevGroup = console.group;
      prevGroupCollapsed = console.groupCollapsed;
      prevGroupEnd = console.groupEnd; // https://github.com/facebook/react/issues/19099

      var props = {
        configurable: true,
        enumerable: true,
        value: disabledLog,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        info: props,
        log: props,
        warn: props,
        error: props,
        group: props,
        groupCollapsed: props,
        groupEnd: props
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    disabledDepth++;
  }
}
function reenableLogs() {
  {
    disabledDepth--;

    if (disabledDepth === 0) {
      /* eslint-disable react-internal/no-production-logging */
      var props = {
        configurable: true,
        enumerable: true,
        writable: true
      }; // $FlowFixMe Flow thinks console is immutable.

      Object.defineProperties(console, {
        log: assign({}, props, {
          value: prevLog
        }),
        info: assign({}, props, {
          value: prevInfo
        }),
        warn: assign({}, props, {
          value: prevWarn
        }),
        error: assign({}, props, {
          value: prevError
        }),
        group: assign({}, props, {
          value: prevGroup
        }),
        groupCollapsed: assign({}, props, {
          value: prevGroupCollapsed
        }),
        groupEnd: assign({}, props, {
          value: prevGroupEnd
        })
      });
      /* eslint-enable react-internal/no-production-logging */
    }

    if (disabledDepth < 0) {
      error('disabledDepth fell below zero. ' + 'This is a bug in React. Please file an issue.');
    }
  }
}

var ReactCurrentDispatcher$1 = ReactSharedInternals.ReactCurrentDispatcher;
var prefix;
function describeBuiltInComponentFrame(name, source, ownerFn) {
  {
    if (prefix === undefined) {
      // Extract the VM specific prefix used by each line.
      try {
        throw Error();
      } catch (x) {
        var match = x.stack.trim().match(/\n( *(at )?)/);
        prefix = match && match[1] || '';
      }
    } // We use the prefix to ensure our stacks line up with native stack frames.


    return '\n' + prefix + name;
  }
}
var reentry = false;
var componentFrameCache;

{
  var PossiblyWeakMap = typeof WeakMap === 'function' ? WeakMap : Map;
  componentFrameCache = new PossiblyWeakMap();
}

function describeNativeComponentFrame(fn, construct) {
  // If something asked for a stack inside a fake render, it should get ignored.
  if ( !fn || reentry) {
    return '';
  }

  {
    var frame = componentFrameCache.get(fn);

    if (frame !== undefined) {
      return frame;
    }
  }

  var control;
  reentry = true;
  var previousPrepareStackTrace = Error.prepareStackTrace; // $FlowFixMe It does accept undefined.

  Error.prepareStackTrace = undefined;
  var previousDispatcher;

  {
    previousDispatcher = ReactCurrentDispatcher$1.current; // Set the dispatcher in DEV because this might be call in the render function
    // for warnings.

    ReactCurrentDispatcher$1.current = null;
    disableLogs();
  }

  try {
    // This should throw.
    if (construct) {
      // Something should be setting the props in the constructor.
      var Fake = function () {
        throw Error();
      }; // $FlowFixMe


      Object.defineProperty(Fake.prototype, 'props', {
        set: function () {
          // We use a throwing setter instead of frozen or non-writable props
          // because that won't throw in a non-strict mode function.
          throw Error();
        }
      });

      if (typeof Reflect === 'object' && Reflect.construct) {
        // We construct a different control for this case to include any extra
        // frames added by the construct call.
        try {
          Reflect.construct(Fake, []);
        } catch (x) {
          control = x;
        }

        Reflect.construct(fn, [], Fake);
      } else {
        try {
          Fake.call();
        } catch (x) {
          control = x;
        }

        fn.call(Fake.prototype);
      }
    } else {
      try {
        throw Error();
      } catch (x) {
        control = x;
      }

      fn();
    }
  } catch (sample) {
    // This is inlined manually because closure doesn't do it for us.
    if (sample && control && typeof sample.stack === 'string') {
      // This extracts the first frame from the sample that isn't also in the control.
      // Skipping one frame that we assume is the frame that calls the two.
      var sampleLines = sample.stack.split('\n');
      var controlLines = control.stack.split('\n');
      var s = sampleLines.length - 1;
      var c = controlLines.length - 1;

      while (s >= 1 && c >= 0 && sampleLines[s] !== controlLines[c]) {
        // We expect at least one stack frame to be shared.
        // Typically this will be the root most one. However, stack frames may be
        // cut off due to maximum stack limits. In this case, one maybe cut off
        // earlier than the other. We assume that the sample is longer or the same
        // and there for cut off earlier. So we should find the root most frame in
        // the sample somewhere in the control.
        c--;
      }

      for (; s >= 1 && c >= 0; s--, c--) {
        // Next we find the first one that isn't the same which should be the
        // frame that called our sample function and the control.
        if (sampleLines[s] !== controlLines[c]) {
          // In V8, the first line is describing the message but other VMs don't.
          // If we're about to return the first line, and the control is also on the same
          // line, that's a pretty good indicator that our sample threw at same line as
          // the control. I.e. before we entered the sample frame. So we ignore this result.
          // This can happen if you passed a class to function component, or non-function.
          if (s !== 1 || c !== 1) {
            do {
              s--;
              c--; // We may still have similar intermediate frames from the construct call.
              // The next one that isn't the same should be our match though.

              if (c < 0 || sampleLines[s] !== controlLines[c]) {
                // V8 adds a "new" prefix for native classes. Let's remove it to make it prettier.
                var _frame = '\n' + sampleLines[s].replace(' at new ', ' at '); // If our component frame is labeled "<anonymous>"
                // but we have a user-provided "displayName"
                // splice it in to make the stack more readable.


                if (fn.displayName && _frame.includes('<anonymous>')) {
                  _frame = _frame.replace('<anonymous>', fn.displayName);
                }

                {
                  if (typeof fn === 'function') {
                    componentFrameCache.set(fn, _frame);
                  }
                } // Return the line we found.


                return _frame;
              }
            } while (s >= 1 && c >= 0);
          }

          break;
        }
      }
    }
  } finally {
    reentry = false;

    {
      ReactCurrentDispatcher$1.current = previousDispatcher;
      reenableLogs();
    }

    Error.prepareStackTrace = previousPrepareStackTrace;
  } // Fallback to just using the name if we couldn't make it throw.


  var name = fn ? fn.displayName || fn.name : '';
  var syntheticFrame = name ? describeBuiltInComponentFrame(name) : '';

  {
    if (typeof fn === 'function') {
      componentFrameCache.set(fn, syntheticFrame);
    }
  }

  return syntheticFrame;
}
function describeFunctionComponentFrame(fn, source, ownerFn) {
  {
    return describeNativeComponentFrame(fn, false);
  }
}

function shouldConstruct(Component) {
  var prototype = Component.prototype;
  return !!(prototype && prototype.isReactComponent);
}

function describeUnknownElementTypeFrameInDEV(type, source, ownerFn) {

  if (type == null) {
    return '';
  }

  if (typeof type === 'function') {
    {
      return describeNativeComponentFrame(type, shouldConstruct(type));
    }
  }

  if (typeof type === 'string') {
    return describeBuiltInComponentFrame(type);
  }

  switch (type) {
    case REACT_SUSPENSE_TYPE:
      return describeBuiltInComponentFrame('Suspense');

    case REACT_SUSPENSE_LIST_TYPE:
      return describeBuiltInComponentFrame('SuspenseList');
  }

  if (typeof type === 'object') {
    switch (type.$$typeof) {
      case REACT_FORWARD_REF_TYPE:
        return describeFunctionComponentFrame(type.render);

      case REACT_MEMO_TYPE:
        // Memo may contain any component type so we recursively resolve it.
        return describeUnknownElementTypeFrameInDEV(type.type, source, ownerFn);

      case REACT_LAZY_TYPE:
        {
          var lazyComponent = type;
          var payload = lazyComponent._payload;
          var init = lazyComponent._init;

          try {
            // Lazy may contain any component type so we recursively resolve it.
            return describeUnknownElementTypeFrameInDEV(init(payload), source, ownerFn);
          } catch (x) {}
        }
    }
  }

  return '';
}

var loggedTypeFailures = {};
var ReactDebugCurrentFrame$1 = ReactSharedInternals.ReactDebugCurrentFrame;

function setCurrentlyValidatingElement(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      ReactDebugCurrentFrame$1.setExtraStackFrame(stack);
    } else {
      ReactDebugCurrentFrame$1.setExtraStackFrame(null);
    }
  }
}

function checkPropTypes(typeSpecs, values, location, componentName, element) {
  {
    // $FlowFixMe This is okay but Flow doesn't know it.
    var has = Function.call.bind(hasOwnProperty);

    for (var typeSpecName in typeSpecs) {
      if (has(typeSpecs, typeSpecName)) {
        var error$1 = void 0; // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.

        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          if (typeof typeSpecs[typeSpecName] !== 'function') {
            // eslint-disable-next-line react-internal/prod-error-codes
            var err = Error((componentName || 'React class') + ': ' + location + ' type `' + typeSpecName + '` is invalid; ' + 'it must be a function, usually from the `prop-types` package, but received `' + typeof typeSpecs[typeSpecName] + '`.' + 'This often happens because of typos such as `PropTypes.function` instead of `PropTypes.func`.');
            err.name = 'Invariant Violation';
            throw err;
          }

          error$1 = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED');
        } catch (ex) {
          error$1 = ex;
        }

        if (error$1 && !(error$1 instanceof Error)) {
          setCurrentlyValidatingElement(element);

          error('%s: type specification of %s' + ' `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error$1);

          setCurrentlyValidatingElement(null);
        }

        if (error$1 instanceof Error && !(error$1.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error$1.message] = true;
          setCurrentlyValidatingElement(element);

          error('Failed %s type: %s', location, error$1.message);

          setCurrentlyValidatingElement(null);
        }
      }
    }
  }
}

function setCurrentlyValidatingElement$1(element) {
  {
    if (element) {
      var owner = element._owner;
      var stack = describeUnknownElementTypeFrameInDEV(element.type, element._source, owner ? owner.type : null);
      setExtraStackFrame(stack);
    } else {
      setExtraStackFrame(null);
    }
  }
}

var propTypesMisspellWarningShown;

{
  propTypesMisspellWarningShown = false;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = getComponentNameFromType(ReactCurrentOwner.current.type);

    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }

  return '';
}

function getSourceInfoErrorAddendum(source) {
  if (source !== undefined) {
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }

  return '';
}

function getSourceInfoErrorAddendumForProps(elementProps) {
  if (elementProps !== null && elementProps !== undefined) {
    return getSourceInfoErrorAddendum(elementProps.__source);
  }

  return '';
}
/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */


var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;

    if (parentName) {
      info = "\n\nCheck the top-level render call using <" + parentName + ">.";
    }
  }

  return info;
}
/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */


function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }

  element._store.validated = true;
  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);

  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }

  ownerHasKeyUseWarning[currentComponentErrorInfo] = true; // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.

  var childOwner = '';

  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = " It was passed a child from " + getComponentNameFromType(element._owner.type) + ".";
  }

  {
    setCurrentlyValidatingElement$1(element);

    error('Each child in a list should have a unique "key" prop.' + '%s%s See https://reactjs.org/link/warning-keys for more information.', currentComponentErrorInfo, childOwner);

    setCurrentlyValidatingElement$1(null);
  }
}
/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */


function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }

  if (isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];

      if (isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);

    if (typeof iteratorFn === 'function') {
      // Entry iterators used to provide implicit keys,
      // but now we print a separate warning for them later.
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;

        while (!(step = iterator.next()).done) {
          if (isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}
/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */


function validatePropTypes(element) {
  {
    var type = element.type;

    if (type === null || type === undefined || typeof type === 'string') {
      return;
    }

    var propTypes;

    if (typeof type === 'function') {
      propTypes = type.propTypes;
    } else if (typeof type === 'object' && (type.$$typeof === REACT_FORWARD_REF_TYPE || // Note: Memo only checks outer props here.
    // Inner props are checked in the reconciler.
    type.$$typeof === REACT_MEMO_TYPE)) {
      propTypes = type.propTypes;
    } else {
      return;
    }

    if (propTypes) {
      // Intentionally inside to avoid triggering lazy initializers:
      var name = getComponentNameFromType(type);
      checkPropTypes(propTypes, element.props, 'prop', name, element);
    } else if (type.PropTypes !== undefined && !propTypesMisspellWarningShown) {
      propTypesMisspellWarningShown = true; // Intentionally inside to avoid triggering lazy initializers:

      var _name = getComponentNameFromType(type);

      error('Component %s declared `PropTypes` instead of `propTypes`. Did you misspell the property assignment?', _name || 'Unknown');
    }

    if (typeof type.getDefaultProps === 'function' && !type.getDefaultProps.isReactClassApproved) {
      error('getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
    }
  }
}
/**
 * Given a fragment, validate that it can only be provided with fragment props
 * @param {ReactElement} fragment
 */


function validateFragmentProps(fragment) {
  {
    var keys = Object.keys(fragment.props);

    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];

      if (key !== 'children' && key !== 'key') {
        setCurrentlyValidatingElement$1(fragment);

        error('Invalid prop `%s` supplied to `React.Fragment`. ' + 'React.Fragment can only have `key` and `children` props.', key);

        setCurrentlyValidatingElement$1(null);
        break;
      }
    }

    if (fragment.ref !== null) {
      setCurrentlyValidatingElement$1(fragment);

      error('Invalid attribute `ref` supplied to `React.Fragment`.');

      setCurrentlyValidatingElement$1(null);
    }
  }
}
function createElementWithValidation(type, props, children) {
  var validType = isValidElementType(type); // We warn in this case but don't throw. We expect the element creation to
  // succeed and there will likely be errors in render.

  if (!validType) {
    var info = '';

    if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
      info += ' You likely forgot to export your component from the file ' + "it's defined in, or you might have mixed up default and named imports.";
    }

    var sourceInfo = getSourceInfoErrorAddendumForProps(props);

    if (sourceInfo) {
      info += sourceInfo;
    } else {
      info += getDeclarationErrorAddendum();
    }

    var typeString;

    if (type === null) {
      typeString = 'null';
    } else if (isArray(type)) {
      typeString = 'array';
    } else if (type !== undefined && type.$$typeof === REACT_ELEMENT_TYPE) {
      typeString = "<" + (getComponentNameFromType(type.type) || 'Unknown') + " />";
      info = ' Did you accidentally export a JSX literal instead of a component?';
    } else {
      typeString = typeof type;
    }

    {
      error('React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', typeString, info);
    }
  }

  var element = createElement.apply(this, arguments); // The result can be nullish if a mock or a custom function is used.
  // TODO: Drop this when these are no longer allowed as the type argument.

  if (element == null) {
    return element;
  } // Skip key warning if the type isn't valid since our key validation logic
  // doesn't expect a non-string/function type and can throw confusing errors.
  // We don't want exception behavior to differ between dev and prod.
  // (Rendering will throw with a helpful message and as soon as the type is
  // fixed, the key warnings will appear.)


  if (validType) {
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], type);
    }
  }

  if (type === REACT_FRAGMENT_TYPE) {
    validateFragmentProps(element);
  } else {
    validatePropTypes(element);
  }

  return element;
}
var didWarnAboutDeprecatedCreateFactory = false;
function createFactoryWithValidation(type) {
  var validatedFactory = createElementWithValidation.bind(null, type);
  validatedFactory.type = type;

  {
    if (!didWarnAboutDeprecatedCreateFactory) {
      didWarnAboutDeprecatedCreateFactory = true;

      warn('React.createFactory() is deprecated and will be removed in ' + 'a future major release. Consider using JSX ' + 'or use React.createElement() directly instead.');
    } // Legacy hook: remove it


    Object.defineProperty(validatedFactory, 'type', {
      enumerable: false,
      get: function () {
        warn('Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');

        Object.defineProperty(this, 'type', {
          value: type
        });
        return type;
      }
    });
  }

  return validatedFactory;
}
function cloneElementWithValidation(element, props, children) {
  var newElement = cloneElement.apply(this, arguments);

  for (var i = 2; i < arguments.length; i++) {
    validateChildKeys(arguments[i], newElement.type);
  }

  validatePropTypes(newElement);
  return newElement;
}

function startTransition(scope, options) {
  var prevTransition = ReactCurrentBatchConfig.transition;
  ReactCurrentBatchConfig.transition = {};
  var currentTransition = ReactCurrentBatchConfig.transition;

  {
    ReactCurrentBatchConfig.transition._updatedFibers = new Set();
  }

  try {
    scope();
  } finally {
    ReactCurrentBatchConfig.transition = prevTransition;

    {
      if (prevTransition === null && currentTransition._updatedFibers) {
        var updatedFibersCount = currentTransition._updatedFibers.size;

        if (updatedFibersCount > 10) {
          warn('Detected a large number of updates inside startTransition. ' + 'If this is due to a subscription please re-write it to use React provided hooks. ' + 'Otherwise concurrent mode guarantees are off the table.');
        }

        currentTransition._updatedFibers.clear();
      }
    }
  }
}

var didWarnAboutMessageChannel = false;
var enqueueTaskImpl = null;
function enqueueTask(task) {
  if (enqueueTaskImpl === null) {
    try {
      // read require off the module object to get around the bundlers.
      // we don't want them to detect a require and bundle a Node polyfill.
      var requireString = ('require' + Math.random()).slice(0, 7);
      var nodeRequire = module && module[requireString]; // assuming we're in node, let's try to get node's
      // version of setImmediate, bypassing fake timers if any.

      enqueueTaskImpl = nodeRequire.call(module, 'timers').setImmediate;
    } catch (_err) {
      // we're in a browser
      // we can't use regular timers because they may still be faked
      // so we try MessageChannel+postMessage instead
      enqueueTaskImpl = function (callback) {
        {
          if (didWarnAboutMessageChannel === false) {
            didWarnAboutMessageChannel = true;

            if (typeof MessageChannel === 'undefined') {
              error('This browser does not have a MessageChannel implementation, ' + 'so enqueuing tasks via await act(async () => ...) will fail. ' + 'Please file an issue at https://github.com/facebook/react/issues ' + 'if you encounter this warning.');
            }
          }
        }

        var channel = new MessageChannel();
        channel.port1.onmessage = callback;
        channel.port2.postMessage(undefined);
      };
    }
  }

  return enqueueTaskImpl(task);
}

var actScopeDepth = 0;
var didWarnNoAwaitAct = false;
function act(callback) {
  {
    // `act` calls can be nested, so we track the depth. This represents the
    // number of `act` scopes on the stack.
    var prevActScopeDepth = actScopeDepth;
    actScopeDepth++;

    if (ReactCurrentActQueue.current === null) {
      // This is the outermost `act` scope. Initialize the queue. The reconciler
      // will detect the queue and use it instead of Scheduler.
      ReactCurrentActQueue.current = [];
    }

    var prevIsBatchingLegacy = ReactCurrentActQueue.isBatchingLegacy;
    var result;

    try {
      // Used to reproduce behavior of `batchedUpdates` in legacy mode. Only
      // set to `true` while the given callback is executed, not for updates
      // triggered during an async event, because this is how the legacy
      // implementation of `act` behaved.
      ReactCurrentActQueue.isBatchingLegacy = true;
      result = callback(); // Replicate behavior of original `act` implementation in legacy mode,
      // which flushed updates immediately after the scope function exits, even
      // if it's an async function.

      if (!prevIsBatchingLegacy && ReactCurrentActQueue.didScheduleLegacyUpdate) {
        var queue = ReactCurrentActQueue.current;

        if (queue !== null) {
          ReactCurrentActQueue.didScheduleLegacyUpdate = false;
          flushActQueue(queue);
        }
      }
    } catch (error) {
      popActScope(prevActScopeDepth);
      throw error;
    } finally {
      ReactCurrentActQueue.isBatchingLegacy = prevIsBatchingLegacy;
    }

    if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
      var thenableResult = result; // The callback is an async function (i.e. returned a promise). Wait
      // for it to resolve before exiting the current scope.

      var wasAwaited = false;
      var thenable = {
        then: function (resolve, reject) {
          wasAwaited = true;
          thenableResult.then(function (returnValue) {
            popActScope(prevActScopeDepth);

            if (actScopeDepth === 0) {
              // We've exited the outermost act scope. Recursively flush the
              // queue until there's no remaining work.
              recursivelyFlushAsyncActWork(returnValue, resolve, reject);
            } else {
              resolve(returnValue);
            }
          }, function (error) {
            // The callback threw an error.
            popActScope(prevActScopeDepth);
            reject(error);
          });
        }
      };

      {
        if (!didWarnNoAwaitAct && typeof Promise !== 'undefined') {
          // eslint-disable-next-line no-undef
          Promise.resolve().then(function () {}).then(function () {
            if (!wasAwaited) {
              didWarnNoAwaitAct = true;

              error('You called act(async () => ...) without await. ' + 'This could lead to unexpected testing behaviour, ' + 'interleaving multiple act calls and mixing their ' + 'scopes. ' + 'You should - await act(async () => ...);');
            }
          });
        }
      }

      return thenable;
    } else {
      var returnValue = result; // The callback is not an async function. Exit the current scope
      // immediately, without awaiting.

      popActScope(prevActScopeDepth);

      if (actScopeDepth === 0) {
        // Exiting the outermost act scope. Flush the queue.
        var _queue = ReactCurrentActQueue.current;

        if (_queue !== null) {
          flushActQueue(_queue);
          ReactCurrentActQueue.current = null;
        } // Return a thenable. If the user awaits it, we'll flush again in
        // case additional work was scheduled by a microtask.


        var _thenable = {
          then: function (resolve, reject) {
            // Confirm we haven't re-entered another `act` scope, in case
            // the user does something weird like await the thenable
            // multiple times.
            if (ReactCurrentActQueue.current === null) {
              // Recursively flush the queue until there's no remaining work.
              ReactCurrentActQueue.current = [];
              recursivelyFlushAsyncActWork(returnValue, resolve, reject);
            } else {
              resolve(returnValue);
            }
          }
        };
        return _thenable;
      } else {
        // Since we're inside a nested `act` scope, the returned thenable
        // immediately resolves. The outer scope will flush the queue.
        var _thenable2 = {
          then: function (resolve, reject) {
            resolve(returnValue);
          }
        };
        return _thenable2;
      }
    }
  }
}

function popActScope(prevActScopeDepth) {
  {
    if (prevActScopeDepth !== actScopeDepth - 1) {
      error('You seem to have overlapping act() calls, this is not supported. ' + 'Be sure to await previous act() calls before making a new one. ');
    }

    actScopeDepth = prevActScopeDepth;
  }
}

function recursivelyFlushAsyncActWork(returnValue, resolve, reject) {
  {
    var queue = ReactCurrentActQueue.current;

    if (queue !== null) {
      try {
        flushActQueue(queue);
        enqueueTask(function () {
          if (queue.length === 0) {
            // No additional work was scheduled. Finish.
            ReactCurrentActQueue.current = null;
            resolve(returnValue);
          } else {
            // Keep flushing work until there's none left.
            recursivelyFlushAsyncActWork(returnValue, resolve, reject);
          }
        });
      } catch (error) {
        reject(error);
      }
    } else {
      resolve(returnValue);
    }
  }
}

var isFlushing = false;

function flushActQueue(queue) {
  {
    if (!isFlushing) {
      // Prevent re-entrance.
      isFlushing = true;
      var i = 0;

      try {
        for (; i < queue.length; i++) {
          var callback = queue[i];

          do {
            callback = callback(true);
          } while (callback !== null);
        }

        queue.length = 0;
      } catch (error) {
        // If something throws, leave the remaining callbacks on the queue.
        queue = queue.slice(i + 1);
        throw error;
      } finally {
        isFlushing = false;
      }
    }
  }
}

var createElement$1 =  createElementWithValidation ;
var cloneElement$1 =  cloneElementWithValidation ;
var createFactory =  createFactoryWithValidation ;
var Children = {
  map: mapChildren,
  forEach: forEachChildren,
  count: countChildren,
  toArray: toArray,
  only: onlyChild
};

exports.Children = Children;
exports.Component = Component;
exports.Fragment = REACT_FRAGMENT_TYPE;
exports.Profiler = REACT_PROFILER_TYPE;
exports.PureComponent = PureComponent;
exports.StrictMode = REACT_STRICT_MODE_TYPE;
exports.Suspense = REACT_SUSPENSE_TYPE;
exports.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED = ReactSharedInternals;
exports.act = act;
exports.cloneElement = cloneElement$1;
exports.createContext = createContext;
exports.createElement = createElement$1;
exports.createFactory = createFactory;
exports.createRef = createRef;
exports.forwardRef = forwardRef;
exports.isValidElement = isValidElement;
exports.lazy = lazy;
exports.memo = memo;
exports.startTransition = startTransition;
exports.unstable_act = act;
exports.useCallback = useCallback;
exports.useContext = useContext;
exports.useDebugValue = useDebugValue;
exports.useDeferredValue = useDeferredValue;
exports.useEffect = useEffect;
exports.useId = useId;
exports.useImperativeHandle = useImperativeHandle;
exports.useInsertionEffect = useInsertionEffect;
exports.useLayoutEffect = useLayoutEffect;
exports.useMemo = useMemo;
exports.useReducer = useReducer;
exports.useRef = useRef;
exports.useState = useState;
exports.useSyncExternalStore = useSyncExternalStore;
exports.useTransition = useTransition;
exports.version = ReactVersion;
          /* global __REACT_DEVTOOLS_GLOBAL_HOOK__ */
if (
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
  typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop ===
    'function'
) {
  __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(new Error());
}
        
  })();
}


/***/ }),

/***/ "../log-view-machine/node_modules/react/index.js":
/*!*******************************************************!*\
  !*** ../log-view-machine/node_modules/react/index.js ***!
  \*******************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ./cjs/react.development.js */ "../log-view-machine/node_modules/react/cjs/react.development.js");
}


/***/ }),

/***/ "../log-view-machine/node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js":
/*!**********************************************************************************************************************!*\
  !*** ../log-view-machine/node_modules/use-isomorphic-layout-effect/dist/use-isomorphic-layout-effect.browser.esm.js ***!
  \**********************************************************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ index)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);


var index = react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect ;




/***/ }),

/***/ "../log-view-machine/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js":
/*!****************************************************************************************************************!*\
  !*** ../log-view-machine/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js ***!
  \****************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/**
 * @license React
 * use-sync-external-store-shim.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 true &&
  (function () {
    function is(x, y) {
      return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
    }
    function useSyncExternalStore$2(subscribe, getSnapshot) {
      didWarnOld18Alpha ||
        void 0 === React.startTransition ||
        ((didWarnOld18Alpha = !0),
        console.error(
          "You are using an outdated, pre-release alpha of React 18 that does not support useSyncExternalStore. The use-sync-external-store shim will not work correctly. Upgrade to a newer pre-release."
        ));
      var value = getSnapshot();
      if (!didWarnUncachedGetSnapshot) {
        var cachedValue = getSnapshot();
        objectIs(value, cachedValue) ||
          (console.error(
            "The result of getSnapshot should be cached to avoid an infinite loop"
          ),
          (didWarnUncachedGetSnapshot = !0));
      }
      cachedValue = useState({
        inst: { value: value, getSnapshot: getSnapshot }
      });
      var inst = cachedValue[0].inst,
        forceUpdate = cachedValue[1];
      useLayoutEffect(
        function () {
          inst.value = value;
          inst.getSnapshot = getSnapshot;
          checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
        },
        [subscribe, value, getSnapshot]
      );
      useEffect(
        function () {
          checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
          return subscribe(function () {
            checkIfSnapshotChanged(inst) && forceUpdate({ inst: inst });
          });
        },
        [subscribe]
      );
      useDebugValue(value);
      return value;
    }
    function checkIfSnapshotChanged(inst) {
      var latestGetSnapshot = inst.getSnapshot;
      inst = inst.value;
      try {
        var nextValue = latestGetSnapshot();
        return !objectIs(inst, nextValue);
      } catch (error) {
        return !0;
      }
    }
    function useSyncExternalStore$1(subscribe, getSnapshot) {
      return getSnapshot();
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js"),
      objectIs = "function" === typeof Object.is ? Object.is : is,
      useState = React.useState,
      useEffect = React.useEffect,
      useLayoutEffect = React.useLayoutEffect,
      useDebugValue = React.useDebugValue,
      didWarnOld18Alpha = !1,
      didWarnUncachedGetSnapshot = !1,
      shim =
        "undefined" === typeof window ||
        "undefined" === typeof window.document ||
        "undefined" === typeof window.document.createElement
          ? useSyncExternalStore$1
          : useSyncExternalStore$2;
    exports.useSyncExternalStore =
      void 0 !== React.useSyncExternalStore ? React.useSyncExternalStore : shim;
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();


/***/ }),

/***/ "../log-view-machine/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js":
/*!******************************************************************************************************************************!*\
  !*** ../log-view-machine/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js ***!
  \******************************************************************************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";
/**
 * @license React
 * use-sync-external-store-shim/with-selector.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */


 true &&
  (function () {
    function is(x, y) {
      return (x === y && (0 !== x || 1 / x === 1 / y)) || (x !== x && y !== y);
    }
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStart(Error());
    var React = __webpack_require__(/*! react */ "../log-view-machine/node_modules/react/index.js"),
      shim = __webpack_require__(/*! use-sync-external-store/shim */ "../log-view-machine/node_modules/use-sync-external-store/shim/index.js"),
      objectIs = "function" === typeof Object.is ? Object.is : is,
      useSyncExternalStore = shim.useSyncExternalStore,
      useRef = React.useRef,
      useEffect = React.useEffect,
      useMemo = React.useMemo,
      useDebugValue = React.useDebugValue;
    exports.useSyncExternalStoreWithSelector = function (
      subscribe,
      getSnapshot,
      getServerSnapshot,
      selector,
      isEqual
    ) {
      var instRef = useRef(null);
      if (null === instRef.current) {
        var inst = { hasValue: !1, value: null };
        instRef.current = inst;
      } else inst = instRef.current;
      instRef = useMemo(
        function () {
          function memoizedSelector(nextSnapshot) {
            if (!hasMemo) {
              hasMemo = !0;
              memoizedSnapshot = nextSnapshot;
              nextSnapshot = selector(nextSnapshot);
              if (void 0 !== isEqual && inst.hasValue) {
                var currentSelection = inst.value;
                if (isEqual(currentSelection, nextSnapshot))
                  return (memoizedSelection = currentSelection);
              }
              return (memoizedSelection = nextSnapshot);
            }
            currentSelection = memoizedSelection;
            if (objectIs(memoizedSnapshot, nextSnapshot))
              return currentSelection;
            var nextSelection = selector(nextSnapshot);
            if (void 0 !== isEqual && isEqual(currentSelection, nextSelection))
              return (memoizedSnapshot = nextSnapshot), currentSelection;
            memoizedSnapshot = nextSnapshot;
            return (memoizedSelection = nextSelection);
          }
          var hasMemo = !1,
            memoizedSnapshot,
            memoizedSelection,
            maybeGetServerSnapshot =
              void 0 === getServerSnapshot ? null : getServerSnapshot;
          return [
            function () {
              return memoizedSelector(getSnapshot());
            },
            null === maybeGetServerSnapshot
              ? void 0
              : function () {
                  return memoizedSelector(maybeGetServerSnapshot());
                }
          ];
        },
        [getSnapshot, getServerSnapshot, selector, isEqual]
      );
      var value = useSyncExternalStore(subscribe, instRef[0], instRef[1]);
      useEffect(
        function () {
          inst.hasValue = !0;
          inst.value = value;
        },
        [value]
      );
      useDebugValue(value);
      return value;
    };
    "undefined" !== typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ &&
      "function" ===
        typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop &&
      __REACT_DEVTOOLS_GLOBAL_HOOK__.registerInternalModuleStop(Error());
  })();


/***/ }),

/***/ "../log-view-machine/node_modules/use-sync-external-store/shim/index.js":
/*!******************************************************************************!*\
  !*** ../log-view-machine/node_modules/use-sync-external-store/shim/index.js ***!
  \******************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim.development.js */ "../log-view-machine/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim.development.js");
}


/***/ }),

/***/ "../log-view-machine/node_modules/use-sync-external-store/shim/with-selector.js":
/*!**************************************************************************************!*\
  !*** ../log-view-machine/node_modules/use-sync-external-store/shim/with-selector.js ***!
  \**************************************************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";


if (false) // removed by dead control flow
{} else {
  module.exports = __webpack_require__(/*! ../cjs/use-sync-external-store-shim/with-selector.development.js */ "../log-view-machine/node_modules/use-sync-external-store/cjs/use-sync-external-store-shim/with-selector.development.js");
}


/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/Actor.js":
/*!***********************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/Actor.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDeferredActor: () => (/* binding */ createDeferredActor),
/* harmony export */   createInvocableActor: () => (/* binding */ createInvocableActor),
/* harmony export */   createNullActor: () => (/* binding */ createNullActor),
/* harmony export */   isActor: () => (/* binding */ isActor),
/* harmony export */   isSpawnedActor: () => (/* binding */ isSpawnedActor),
/* harmony export */   toActorRef: () => (/* binding */ toActorRef)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./serviceScope.js */ "../log-view-machine/node_modules/xstate/es/serviceScope.js");




function createNullActor(id) {
  var _a;

  return _a = {
    id: id,
    send: function () {
      return void 0;
    },
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    getSnapshot: function () {
      return undefined;
    },
    toJSON: function () {
      return {
        id: id
      };
    }
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_1__.symbolObservable] = function () {
    return this;
  }, _a;
}
/**
 * Creates a deferred actor that is able to be invoked given the provided
 * invocation information in its `.meta` value.
 *
 * @param invokeDefinition The meta information needed to invoke the actor.
 */

function createInvocableActor(invokeDefinition, machine, context, _event) {
  var _a;

  var invokeSrc = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toInvokeSource)(invokeDefinition.src);
  var serviceCreator = (_a = machine === null || machine === void 0 ? void 0 : machine.options.services) === null || _a === void 0 ? void 0 : _a[invokeSrc.type];
  var resolvedData = invokeDefinition.data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapContext)(invokeDefinition.data, context, _event) : undefined;
  var tempActor = serviceCreator ? createDeferredActor(serviceCreator, invokeDefinition.id, resolvedData) : createNullActor(invokeDefinition.id); // @ts-ignore

  tempActor.meta = invokeDefinition;
  return tempActor;
}
function createDeferredActor(entity, id, data) {
  var tempActor = createNullActor(id); // @ts-ignore

  tempActor.deferred = true;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isMachine)(entity)) {
    // "mute" the existing service scope so potential spawned actors within the `.initialState` stay deferred here
    var initialState_1 = tempActor.state = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_2__.provide)(undefined, function () {
      return (data ? entity.withContext(data) : entity).initialState;
    });

    tempActor.getSnapshot = function () {
      return initialState_1;
    };
  }

  return tempActor;
}
function isActor(item) {
  try {
    return typeof item.send === 'function';
  } catch (e) {
    return false;
  }
}
function isSpawnedActor(item) {
  return isActor(item) && 'id' in item;
} // TODO: refactor the return type, this could be written in a better way but it's best to avoid unneccessary breaking changes now

function toActorRef(actorRefLike) {
  var _a;

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((_a = {
    subscribe: function () {
      return {
        unsubscribe: function () {
          return void 0;
        }
      };
    },
    id: 'anonymous',
    getSnapshot: function () {
      return undefined;
    }
  }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_1__.symbolObservable] = function () {
    return this;
  }, _a), actorRefLike);
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/Machine.js":
/*!*************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/Machine.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Machine: () => (/* binding */ Machine),
/* harmony export */   createMachine: () => (/* binding */ createMachine)
/* harmony export */ });
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./StateNode.js */ "../log-view-machine/node_modules/xstate/es/StateNode.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");



var warned = false;
function Machine(config, options, initialContext) {
  if (initialContext === void 0) {
    initialContext = config.context;
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__.StateNode(config, options, initialContext);
}
function createMachine(config, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_1__.IS_PRODUCTION && !('predictableActionArguments' in config) && !warned) {
    warned = true;
    console.warn('It is highly recommended to set `predictableActionArguments` to `true` when using `createMachine`. https://xstate.js.org/docs/guides/actions.html');
  }

  return new _StateNode_js__WEBPACK_IMPORTED_MODULE_0__.StateNode(config, options);
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/State.js":
/*!***********************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/State.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   State: () => (/* binding */ State),
/* harmony export */   bindActionToState: () => (/* binding */ bindActionToState),
/* harmony export */   isState: () => (/* binding */ isState),
/* harmony export */   isStateConfig: () => (/* binding */ isStateConfig),
/* harmony export */   stateValuesEqual: () => (/* binding */ stateValuesEqual)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./constants.js */ "../log-view-machine/node_modules/xstate/es/constants.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./stateUtils.js */ "../log-view-machine/node_modules/xstate/es/stateUtils.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions.js */ "../log-view-machine/node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");







function stateValuesEqual(a, b) {
  if (a === b) {
    return true;
  }

  if (a === undefined || b === undefined) {
    return false;
  }

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(a) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(b)) {
    return a === b;
  }

  var aKeys = Object.keys(a);
  var bKeys = Object.keys(b);
  return aKeys.length === bKeys.length && aKeys.every(function (key) {
    return stateValuesEqual(a[key], b[key]);
  });
}
function isStateConfig(state) {
  if (typeof state !== 'object' || state === null) {
    return false;
  }

  return 'value' in state && '_event' in state;
}
/**
 * @deprecated Use `isStateConfig(object)` or `state instanceof State` instead.
 */

var isState = isStateConfig;
function bindActionToState(action, state) {
  var exec = action.exec;

  var boundAction = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, action), {
    exec: exec !== undefined ? function () {
      return exec(state.context, state.event, {
        action: action,
        state: state,
        _event: state._event
      });
    } : undefined
  });

  return boundAction;
}

var State =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new State instance.
   * @param value The state value
   * @param context The extended state
   * @param historyValue The tree representing historical values of the state nodes
   * @param history The previous state
   * @param actions An array of action objects to execute as side-effects
   * @param activities A mapping of activities and whether they are started (`true`) or stopped (`false`).
   * @param meta
   * @param events Internal event queue. Should be empty with run-to-completion semantics.
   * @param configuration
   */
  function State(config) {
    var _this = this;

    var _a;

    this.actions = [];
    this.activities = _constants_js__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ACTIVITY_MAP;
    this.meta = {};
    this.events = [];
    this.value = config.value;
    this.context = config.context;
    this._event = config._event;
    this._sessionid = config._sessionid;
    this.event = this._event.data;
    this.historyValue = config.historyValue;
    this.history = config.history;
    this.actions = config.actions || [];
    this.activities = config.activities || _constants_js__WEBPACK_IMPORTED_MODULE_1__.EMPTY_ACTIVITY_MAP;
    this.meta = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__.getMeta)(config.configuration);
    this.events = config.events || [];
    this.matches = this.matches.bind(this);
    this.toStrings = this.toStrings.bind(this);
    this.configuration = config.configuration;
    this.transitions = config.transitions;
    this.children = config.children;
    this.done = !!config.done;
    this.tags = (_a = Array.isArray(config.tags) ? new Set(config.tags) : config.tags) !== null && _a !== void 0 ? _a : new Set();
    this.machine = config.machine;
    Object.defineProperty(this, 'nextEvents', {
      get: function () {
        return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_3__.nextEvents)(_this.configuration);
      }
    });
  }
  /**
   * Creates a new State instance for the given `stateValue` and `context`.
   * @param stateValue
   * @param context
   */


  State.from = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (stateValue.context !== context) {
        return new State({
          value: stateValue.value,
          context: context,
          _event: stateValue._event,
          _sessionid: null,
          historyValue: stateValue.historyValue,
          history: stateValue.history,
          actions: [],
          activities: stateValue.activities,
          meta: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {}
        });
      }

      return stateValue;
    }

    var _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
    return new State({
      value: stateValue,
      context: context,
      _event: _event,
      _sessionid: null,
      historyValue: undefined,
      history: undefined,
      actions: [],
      activities: undefined,
      meta: undefined,
      events: [],
      configuration: [],
      transitions: [],
      children: {}
    });
  };
  /**
   * Creates a new State instance for the given `config`.
   * @param config The state config
   */


  State.create = function (config) {
    return new State(config);
  };
  /**
   * Creates a new `State` instance for the given `stateValue` and `context` with no actions (side-effects).
   * @param stateValue
   * @param context
   */


  State.inert = function (stateValue, context) {
    if (stateValue instanceof State) {
      if (!stateValue.actions.length) {
        return stateValue;
      }

      var _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
      return new State({
        value: stateValue.value,
        context: context,
        _event: _event,
        _sessionid: null,
        historyValue: stateValue.historyValue,
        history: stateValue.history,
        activities: stateValue.activities,
        configuration: stateValue.configuration,
        transitions: [],
        children: {}
      });
    }

    return State.from(stateValue, context);
  };
  /**
   * Returns an array of all the string leaf state node paths.
   * @param stateValue
   * @param delimiter The character(s) that separate each subpath in the string state node path.
   */


  State.prototype.toStrings = function (stateValue, delimiter) {
    var _this = this;

    if (stateValue === void 0) {
      stateValue = this.value;
    }

    if (delimiter === void 0) {
      delimiter = '.';
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.isString)(stateValue)) {
      return [stateValue];
    }

    var valueKeys = Object.keys(stateValue);
    return valueKeys.concat.apply(valueKeys, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(valueKeys.map(function (key) {
      return _this.toStrings(stateValue[key], delimiter).map(function (s) {
        return key + delimiter + s;
      });
    })), false));
  };

  State.prototype.toJSON = function () {
    var _a = this;
        _a.configuration;
        _a.transitions;
        var tags = _a.tags;
        _a.machine;
        var jsonValues = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__rest)(_a, ["configuration", "transitions", "tags", "machine"]);

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, jsonValues), {
      tags: Array.from(tags)
    });
  };

  State.prototype.matches = function (parentStateValue) {
    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.matchesState)(parentStateValue, this.value);
  };
  /**
   * Whether the current state configuration has a state node with the specified `tag`.
   * @param tag
   */


  State.prototype.hasTag = function (tag) {
    return this.tags.has(tag);
  };
  /**
   * Determines whether sending the `event` will cause a non-forbidden transition
   * to be selected, even if the transitions have no actions nor
   * change the state value.
   *
   * @param event The event to test
   * @returns Whether the event will cause a transition
   */


  State.prototype.can = function (event) {
    var _a;

    if (_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.warn)(!!this.machine, "state.can(...) used outside of a machine-created State object; this will always return false.");
    }

    var transitionData = (_a = this.machine) === null || _a === void 0 ? void 0 : _a.getTransitionData(this, event);
    return !!(transitionData === null || transitionData === void 0 ? void 0 : transitionData.transitions.length) && // Check that at least one transition is not forbidden
    transitionData.transitions.some(function (t) {
      return t.target !== undefined || t.actions.length;
    });
  };

  return State;
}();




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/StateNode.js":
/*!***************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/StateNode.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   StateNode: () => (/* binding */ StateNode)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./State.js */ "../log-view-machine/node_modules/xstate/es/State.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actionTypes.js */ "../log-view-machine/node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions.js */ "../log-view-machine/node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants.js */ "../log-view-machine/node_modules/xstate/es/constants.js");
/* harmony import */ var _stateUtils_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./stateUtils.js */ "../log-view-machine/node_modules/xstate/es/stateUtils.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Actor.js */ "../log-view-machine/node_modules/xstate/es/Actor.js");
/* harmony import */ var _invokeUtils_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./invokeUtils.js */ "../log-view-machine/node_modules/xstate/es/invokeUtils.js");











var NULL_EVENT = '';
var STATE_IDENTIFIER = '#';
var WILDCARD = '*';
var EMPTY_OBJECT = {};

var isStateId = function (str) {
  return str[0] === STATE_IDENTIFIER;
};

var createDefaultOptions = function () {
  return {
    actions: {},
    guards: {},
    services: {},
    activities: {},
    delays: {}
  };
};

var validateArrayifiedTransitions = function (stateNode, event, transitions) {
  var hasNonLastUnguardedTarget = transitions.slice(0, -1).some(function (transition) {
    return !('cond' in transition) && !('in' in transition) && ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(transition.target) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isMachine)(transition.target));
  });
  var eventText = event === NULL_EVENT ? 'the transient event' : "event '".concat(event, "'");
  (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(!hasNonLastUnguardedTarget, "One or more transitions for ".concat(eventText, " on state '").concat(stateNode.id, "' are unreachable. ") + "Make sure that the default transition is the last one defined.");
};

var StateNode =
/*#__PURE__*/

/** @class */
function () {
  function StateNode(
  /**
   * The raw config used to create the machine.
   */
  config, options,
  /**
   * The initial extended state
   */
  _context, // TODO: this is unsafe, but we're removing it in v5 anyway
  _stateInfo) {
    if (_context === void 0) {
      _context = 'context' in config ? config.context : undefined;
    }

    var _this = this;

    var _a;

    this.config = config;
    this._context = _context;
    /**
     * The order this state node appears. Corresponds to the implicit SCXML document order.
     */

    this.order = -1;
    this.__xstatenode = true;
    this.__cache = {
      events: undefined,
      relativeValue: new Map(),
      initialStateValue: undefined,
      initialState: undefined,
      on: undefined,
      transitions: undefined,
      candidates: {},
      delayedTransitions: undefined
    };
    this.idMap = {};
    this.tags = [];
    this.options = Object.assign(createDefaultOptions(), options);
    this.parent = _stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.parent;
    this.key = this.config.key || (_stateInfo === null || _stateInfo === void 0 ? void 0 : _stateInfo.key) || this.config.id || '(machine)';
    this.machine = this.parent ? this.parent.machine : this;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.delimiter = this.config.delimiter || (this.parent ? this.parent.delimiter : _constants_js__WEBPACK_IMPORTED_MODULE_6__.STATE_DELIMITER);
    this.id = this.config.id || (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([this.machine.key], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(this.path), false).join(this.delimiter);
    this.version = this.parent ? this.parent.version : this.config.version;
    this.type = this.config.type || (this.config.parallel ? 'parallel' : this.config.states && Object.keys(this.config.states).length ? 'compound' : this.config.history ? 'history' : 'atomic');
    this.schema = this.parent ? this.machine.schema : (_a = this.config.schema) !== null && _a !== void 0 ? _a : {};
    this.description = this.config.description;

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(!('parallel' in this.config), "The \"parallel\" property is deprecated and will be removed in version 4.1. ".concat(this.config.parallel ? "Replace with `type: 'parallel'`" : "Use `type: '".concat(this.type, "'`"), " in the config for state node '").concat(this.id, "' instead."));
    }

    this.initial = this.config.initial;
    this.states = this.config.states ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapValues)(this.config.states, function (stateConfig, key) {
      var _a;

      var stateNode = new StateNode(stateConfig, {}, undefined, {
        parent: _this,
        key: key
      });
      Object.assign(_this.idMap, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((_a = {}, _a[stateNode.id] = stateNode, _a), stateNode.idMap));
      return stateNode;
    }) : EMPTY_OBJECT; // Document order

    var order = 0;

    function dfs(stateNode) {
      var e_1, _a;

      stateNode.order = order++;

      try {
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getAllChildren)(stateNode)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var child = _c.value;
          dfs(child);
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    }

    dfs(this); // History config

    this.history = this.config.history === true ? 'shallow' : this.config.history || false;
    this._transient = !!this.config.always || (!this.config.on ? false : Array.isArray(this.config.on) ? this.config.on.some(function (_a) {
      var event = _a.event;
      return event === NULL_EVENT;
    }) : NULL_EVENT in this.config.on);
    this.strict = !!this.config.strict; // TODO: deprecate (entry)

    this.onEntry = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(this.config.entry || this.config.onEntry).map(function (action) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObject)(action);
    }); // TODO: deprecate (exit)

    this.onExit = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(this.config.exit || this.config.onExit).map(function (action) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObject)(action);
    });
    this.meta = this.config.meta;
    this.doneData = this.type === 'final' ? this.config.data : undefined;
    this.invoke = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(this.config.invoke).map(function (invokeConfig, i) {
      var _a, _b;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isMachine)(invokeConfig)) {
        var invokeId = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((_a = {}, _a[invokeId] = invokeConfig, _a), _this.machine.options.services);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_9__.toInvokeDefinition)({
          src: invokeId,
          id: invokeId
        });
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createInvokeId)(_this.id, i);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_9__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, invokeConfig), {
          id: invokeId,
          src: invokeConfig.src
        }));
      } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isMachine)(invokeConfig.src) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(invokeConfig.src)) {
        var invokeId = invokeConfig.id || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createInvokeId)(_this.id, i);
        _this.machine.options.services = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((_b = {}, _b[invokeId] = invokeConfig.src, _b), _this.machine.options.services);
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_9__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
          id: invokeId
        }, invokeConfig), {
          src: invokeId
        }));
      } else {
        var invokeSource = invokeConfig.src;
        return (0,_invokeUtils_js__WEBPACK_IMPORTED_MODULE_9__.toInvokeDefinition)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
          id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.createInvokeId)(_this.id, i)
        }, invokeConfig), {
          src: invokeSource
        }));
      }
    });
    this.activities = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(this.config.activities).concat(this.invoke).map(function (activity) {
      return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActivityDefinition)(activity);
    });
    this.transition = this.transition.bind(this);
    this.tags = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(this.config.tags); // TODO: this is the real fix for initialization once
    // state node getters are deprecated
    // if (!this.parent) {
    //   this._init();
    // }
  }

  StateNode.prototype._init = function () {
    if (this.__cache.transitions) {
      return;
    }

    (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getAllStateNodes)(this).forEach(function (stateNode) {
      return stateNode.on;
    });
  };
  /**
   * Clones this state machine with custom options and context.
   *
   * @param options Options (actions, guards, activities, services) to recursively merge with the existing options.
   * @param context Custom context (will override predefined context)
   */


  StateNode.prototype.withConfig = function (options, context) {
    var _a = this.options,
        actions = _a.actions,
        activities = _a.activities,
        guards = _a.guards,
        services = _a.services,
        delays = _a.delays;
    return new StateNode(this.config, {
      actions: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, actions), options.actions),
      activities: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, activities), options.activities),
      guards: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, guards), options.guards),
      services: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, services), options.services),
      delays: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, delays), options.delays)
    }, context !== null && context !== void 0 ? context : this.context);
  };
  /**
   * Clones this state machine with custom context.
   *
   * @param context Custom context (will override predefined context, not recursive)
   */


  StateNode.prototype.withContext = function (context) {
    return new StateNode(this.config, this.options, context);
  };

  Object.defineProperty(StateNode.prototype, "context", {
    get: function () {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(this._context) ? this._context() : this._context;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "definition", {
    /**
     * The well-structured state node definition.
     */
    get: function () {
      return {
        id: this.id,
        key: this.key,
        version: this.version,
        context: this.context,
        type: this.type,
        initial: this.initial,
        history: this.history,
        states: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapValues)(this.states, function (state) {
          return state.definition;
        }),
        on: this.on,
        transitions: this.transitions,
        entry: this.onEntry,
        exit: this.onExit,
        activities: this.activities || [],
        meta: this.meta,
        order: this.order || -1,
        data: this.doneData,
        invoke: this.invoke,
        description: this.description,
        tags: this.tags
      };
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.toJSON = function () {
    return this.definition;
  };

  Object.defineProperty(StateNode.prototype, "on", {
    /**
     * The mapping of events to transitions.
     */
    get: function () {
      if (this.__cache.on) {
        return this.__cache.on;
      }

      var transitions = this.transitions;
      return this.__cache.on = transitions.reduce(function (map, transition) {
        map[transition.eventType] = map[transition.eventType] || [];
        map[transition.eventType].push(transition);
        return map;
      }, {});
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "after", {
    get: function () {
      return this.__cache.delayedTransitions || (this.__cache.delayedTransitions = this.getDelayedTransitions(), this.__cache.delayedTransitions);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "transitions", {
    /**
     * All the transitions that can be taken from this state node.
     */
    get: function () {
      return this.__cache.transitions || (this.__cache.transitions = this.formatTransitions(), this.__cache.transitions);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getCandidates = function (eventName) {
    if (this.__cache.candidates[eventName]) {
      return this.__cache.candidates[eventName];
    }

    var transient = eventName === NULL_EVENT;
    var candidates = this.transitions.filter(function (transition) {
      var sameEventType = transition.eventType === eventName; // null events should only match against eventless transitions

      return transient ? sameEventType : sameEventType || transition.eventType === WILDCARD;
    });
    this.__cache.candidates[eventName] = candidates;
    return candidates;
  };
  /**
   * All delayed transitions from the config.
   */


  StateNode.prototype.getDelayedTransitions = function () {
    var _this = this;

    var afterConfig = this.config.after;

    if (!afterConfig) {
      return [];
    }

    var mutateEntryExit = function (delay, i) {
      var delayRef = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isFunction)(delay) ? "".concat(_this.id, ":delay[").concat(i, "]") : delay;
      var eventType = (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.after)(delayRef, _this.id);

      _this.onEntry.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.send)(eventType, {
        delay: delay
      }));

      _this.onExit.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.cancel)(eventType));

      return eventType;
    };

    var delayedTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isArray)(afterConfig) ? afterConfig.map(function (transition, i) {
      var eventType = mutateEntryExit(transition.delay, i);
      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, transition), {
        event: eventType
      });
    }) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(Object.keys(afterConfig).map(function (delay, i) {
      var configTransition = afterConfig[delay];
      var resolvedTransition = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(configTransition) ? {
        target: configTransition
      } : configTransition;
      var resolvedDelay = !isNaN(+delay) ? +delay : delay;
      var eventType = mutateEntryExit(resolvedDelay, i);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(resolvedTransition).map(function (transition) {
        return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, transition), {
          event: eventType,
          delay: resolvedDelay
        });
      });
    }));
    return delayedTransitions.map(function (delayedTransition) {
      var delay = delayedTransition.delay;
      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, _this.formatTransition(delayedTransition)), {
        delay: delay
      });
    });
  };
  /**
   * Returns the state nodes represented by the current state value.
   *
   * @param state The state value or State instance
   */


  StateNode.prototype.getStateNodes = function (state) {
    var _a;

    var _this = this;

    if (!state) {
      return [];
    }

    var stateValue = state instanceof _State_js__WEBPACK_IMPORTED_MODULE_2__.State ? state.value : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStateValue)(state, this.delimiter);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(stateValue)) {
      var initialStateValue = this.getStateNode(stateValue).initial;
      return initialStateValue !== undefined ? this.getStateNodes((_a = {}, _a[stateValue] = initialStateValue, _a)) : [this, this.states[stateValue]];
    }

    var subStateKeys = Object.keys(stateValue);
    var subStateNodes = [this];
    subStateNodes.push.apply(subStateNodes, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(subStateKeys.map(function (subStateKey) {
      return _this.getStateNode(subStateKey).getStateNodes(stateValue[subStateKey]);
    }))), false));
    return subStateNodes;
  };
  /**
   * Returns `true` if this state node explicitly handles the given event.
   *
   * @param event The event in question
   */


  StateNode.prototype.handles = function (event) {
    var eventType = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.getEventType)(event);
    return this.events.includes(eventType);
  };
  /**
   * Resolves the given `state` to a new `State` instance relative to this machine.
   *
   * This ensures that `.events` and `.nextEvents` represent the correct values.
   *
   * @param state The state to resolve
   */


  StateNode.prototype.resolveState = function (state) {
    var stateFromConfig = state instanceof _State_js__WEBPACK_IMPORTED_MODULE_2__.State ? state : _State_js__WEBPACK_IMPORTED_MODULE_2__.State.create(state);
    var configuration = Array.from((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getConfiguration)([], this.getStateNodes(stateFromConfig.value)));
    return new _State_js__WEBPACK_IMPORTED_MODULE_2__.State((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, stateFromConfig), {
      value: this.resolve(stateFromConfig.value),
      configuration: configuration,
      done: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.isInFinalState)(configuration, this),
      tags: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getTagsFromConfiguration)(configuration),
      machine: this.machine
    }));
  };

  StateNode.prototype.transitionLeafNode = function (stateValue, state, _event) {
    var stateNode = this.getStateNode(stateValue);
    var next = stateNode.next(state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionCompoundNode = function (stateValue, state, _event) {
    var subStateKeys = Object.keys(stateValue);
    var stateNode = this.getStateNode(subStateKeys[0]);

    var next = stateNode._transition(stateValue[subStateKeys[0]], state, _event);

    if (!next || !next.transitions.length) {
      return this.next(state, _event);
    }

    return next;
  };

  StateNode.prototype.transitionParallelNode = function (stateValue, state, _event) {
    var e_2, _a;

    var transitionMap = {};

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(stateValue)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var subStateKey = _c.value;
        var subStateValue = stateValue[subStateKey];

        if (!subStateValue) {
          continue;
        }

        var subStateNode = this.getStateNode(subStateKey);

        var next = subStateNode._transition(subStateValue, state, _event);

        if (next) {
          transitionMap[subStateKey] = next;
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    var stateTransitions = Object.keys(transitionMap).map(function (key) {
      return transitionMap[key];
    });
    var enabledTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(stateTransitions.map(function (st) {
      return st.transitions;
    }));
    var willTransition = stateTransitions.some(function (st) {
      return st.transitions.length > 0;
    });

    if (!willTransition) {
      return this.next(state, _event);
    }

    var configuration = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(Object.keys(transitionMap).map(function (key) {
      return transitionMap[key].configuration;
    }));
    return {
      transitions: enabledTransitions,
      exitSet: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(stateTransitions.map(function (t) {
        return t.exitSet;
      })),
      configuration: configuration,
      source: state,
      actions: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(Object.keys(transitionMap).map(function (key) {
        return transitionMap[key].actions;
      }))
    };
  };

  StateNode.prototype._transition = function (stateValue, state, _event) {
    // leaf node
    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(stateValue)) {
      return this.transitionLeafNode(stateValue, state, _event);
    } // hierarchical node


    if (Object.keys(stateValue).length === 1) {
      return this.transitionCompoundNode(stateValue, state, _event);
    } // orthogonal node


    return this.transitionParallelNode(stateValue, state, _event);
  };

  StateNode.prototype.getTransitionData = function (state, event) {
    return this._transition(state.value, state, (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)(event));
  };

  StateNode.prototype.next = function (state, _event) {
    var e_3, _a;

    var _this = this;

    var eventName = _event.name;
    var actions = [];
    var nextStateNodes = [];
    var selectedTransition;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.getCandidates(eventName)), _c = _b.next(); !_c.done; _c = _b.next()) {
        var candidate = _c.value;
        var cond = candidate.cond,
            stateIn = candidate.in;
        var resolvedContext = state.context;
        var isInState = stateIn ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(stateIn) && isStateId(stateIn) ? // Check if in state by ID
        state.matches((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStateValue)(this.getStateNodeById(stateIn).path, this.delimiter)) : // Check if in state by relative grandparent
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.matchesState)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStateValue)(stateIn, this.delimiter), (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.path)(this.path.slice(0, -2))(state.value)) : true;
        var guardPassed = false;

        try {
          guardPassed = !cond || (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.evaluateGuard)(this.machine, cond, resolvedContext, _event, state);
        } catch (err) {
          throw new Error("Unable to evaluate guard '".concat(cond.name || cond.type, "' in transition for event '").concat(eventName, "' in state node '").concat(this.id, "':\n").concat(err.message));
        }

        if (guardPassed && isInState) {
          if (candidate.target !== undefined) {
            nextStateNodes = candidate.target;
          }

          actions.push.apply(actions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(candidate.actions), false));
          selectedTransition = candidate;
          break;
        }
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    if (!selectedTransition) {
      return undefined;
    }

    if (!nextStateNodes.length) {
      return {
        transitions: [selectedTransition],
        exitSet: [],
        configuration: state.value ? [this] : [],
        source: state,
        actions: actions
      };
    }

    var allNextStateNodes = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(nextStateNodes.map(function (stateNode) {
      return _this.getRelativeStateNodes(stateNode, state.historyValue);
    }));
    var isInternal = !!selectedTransition.internal;
    return {
      transitions: [selectedTransition],
      exitSet: isInternal ? [] : (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(nextStateNodes.map(function (targetNode) {
        return _this.getPotentiallyReenteringNodes(targetNode);
      })),
      configuration: allNextStateNodes,
      source: state,
      actions: actions
    };
  }; // even though the name of this function mentions reentry nodes
  // we are pushing its result into `exitSet`
  // that's because what we exit might be reentered (it's an invariant of reentrancy)


  StateNode.prototype.getPotentiallyReenteringNodes = function (targetNode) {
    if (this.order < targetNode.order) {
      return [this];
    }

    var nodes = [];
    var marker = this;
    var possibleAncestor = targetNode;

    while (marker && marker !== possibleAncestor) {
      nodes.push(marker);
      marker = marker.parent;
    }

    if (marker !== possibleAncestor) {
      // we never got to `possibleAncestor`, therefore the initial `marker` "escapes" it
      // it's in a different part of the tree so no states will be reentered for such an external transition
      return [];
    }

    nodes.push(possibleAncestor);
    return nodes;
  };

  StateNode.prototype.getActions = function (resolvedConfig, isDone, transition, currentContext, _event, prevState, predictableExec) {
    var e_4, _a, e_5, _b;

    var _this = this;

    var prevConfig = prevState ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getConfiguration)([], this.getStateNodes(prevState.value)) : [];
    var entrySet = new Set();

    try {
      for (var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Array.from(resolvedConfig).sort(function (a, b) {
        return a.order - b.order;
      })), _d = _c.next(); !_d.done; _d = _c.next()) {
        var sn = _d.value;

        if (!(0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.has)(prevConfig, sn) || (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.has)(transition.exitSet, sn) || sn.parent && entrySet.has(sn.parent)) {
          entrySet.add(sn);
        }
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    try {
      for (var prevConfig_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(prevConfig), prevConfig_1_1 = prevConfig_1.next(); !prevConfig_1_1.done; prevConfig_1_1 = prevConfig_1.next()) {
        var sn = prevConfig_1_1.value;

        if (!(0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.has)(resolvedConfig, sn) || (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.has)(transition.exitSet, sn.parent)) {
          transition.exitSet.push(sn);
        }
      }
    } catch (e_5_1) {
      e_5 = {
        error: e_5_1
      };
    } finally {
      try {
        if (prevConfig_1_1 && !prevConfig_1_1.done && (_b = prevConfig_1.return)) _b.call(prevConfig_1);
      } finally {
        if (e_5) throw e_5.error;
      }
    }

    transition.exitSet.sort(function (a, b) {
      return b.order - a.order;
    });
    var entryStates = Array.from(entrySet).sort(function (a, b) {
      return a.order - b.order;
    });
    var exitStates = new Set(transition.exitSet);
    var doneEvents = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(entryStates.map(function (sn) {
      var events = [];

      if (sn.type !== 'final') {
        return events;
      }

      var parent = sn.parent;

      if (!parent.parent) {
        return events;
      }

      events.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.done)(sn.id, sn.doneData), // TODO: deprecate - final states should not emit done events for their own state.
      (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.done)(parent.id, sn.doneData ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapContext)(sn.doneData, currentContext, _event) : undefined));
      var grandparent = parent.parent;

      if (grandparent.type === 'parallel') {
        if ((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getChildren)(grandparent).every(function (parentNode) {
          return (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.isInFinalState)(transition.configuration, parentNode);
        })) {
          events.push((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.done)(grandparent.id));
        }
      }

      return events;
    }));
    var entryActions = entryStates.map(function (stateNode) {
      var entryActions = stateNode.onEntry;
      var invokeActions = stateNode.activities.map(function (activity) {
        return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.start)(activity);
      });
      return {
        type: 'entry',
        actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObjects)(predictableExec ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(entryActions), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(invokeActions), false) : (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(invokeActions), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(entryActions), false), _this.machine.options.actions)
      };
    }).concat({
      type: 'state_done',
      actions: doneEvents.map(function (event) {
        return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.raise)(event);
      })
    });
    var exitActions = Array.from(exitStates).map(function (stateNode) {
      return {
        type: 'exit',
        actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObjects)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(stateNode.onExit), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(stateNode.activities.map(function (activity) {
          return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.stop)(activity);
        })), false), _this.machine.options.actions)
      };
    });
    var actions = exitActions.concat({
      type: 'transition',
      actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObjects)(transition.actions, this.machine.options.actions)
    }).concat(entryActions);

    if (isDone) {
      var stopActions = (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObjects)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(resolvedConfig), false).sort(function (a, b) {
        return b.order - a.order;
      }).map(function (stateNode) {
        return stateNode.onExit;
      })), this.machine.options.actions).filter(function (action) {
        return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isRaisableAction)(action);
      });
      return actions.concat({
        type: 'stop',
        actions: stopActions
      });
    }

    return actions;
  };
  /**
   * Determines the next state given the current `state` and sent `event`.
   *
   * @param state The current State instance or state value
   * @param event The event that was sent at the current state
   * @param context The current context (extended state) of the current state
   */


  StateNode.prototype.transition = function (state, event, context, exec) {
    if (state === void 0) {
      state = this.initialState;
    }

    var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toSCXMLEvent)(event);

    var currentState;

    if (state instanceof _State_js__WEBPACK_IMPORTED_MODULE_2__.State) {
      currentState = context === undefined ? state : this.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_2__.State.from(state, context));
    } else {
      var resolvedStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(state) ? this.resolve((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.pathToStateValue)(this.getResolvedPath(state))) : this.resolve(state);
      var resolvedContext = context !== null && context !== void 0 ? context : this.machine.context;
      currentState = this.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_2__.State.from(resolvedStateValue, resolvedContext));
    }

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION && _event.name === WILDCARD) {
      throw new Error("An event cannot have the wildcard type ('".concat(WILDCARD, "')"));
    }

    if (this.strict) {
      if (!this.events.includes(_event.name) && !(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isBuiltInEvent)(_event.name)) {
        throw new Error("Machine '".concat(this.id, "' does not accept event '").concat(_event.name, "'"));
      }
    }

    var stateTransition = this._transition(currentState.value, currentState, _event) || {
      transitions: [],
      configuration: [],
      exitSet: [],
      source: currentState,
      actions: []
    };
    var prevConfig = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getConfiguration)([], this.getStateNodes(currentState.value));
    var resolvedConfig = stateTransition.configuration.length ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getConfiguration)(prevConfig, stateTransition.configuration) : prevConfig;
    stateTransition.configuration = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(resolvedConfig), false);
    return this.resolveTransition(stateTransition, currentState, currentState.context, exec, _event);
  };

  StateNode.prototype.resolveRaisedTransition = function (state, _event, originalEvent, predictableExec) {
    var _a;

    var currentActions = state.actions;
    state = this.transition(state, _event, undefined, predictableExec); // Save original event to state
    // TODO: this should be the raised event! Delete in V5 (breaking)

    state._event = originalEvent;
    state.event = originalEvent.data;

    (_a = state.actions).unshift.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(currentActions), false));

    return state;
  };

  StateNode.prototype.resolveTransition = function (stateTransition, currentState, context, predictableExec, _event) {
    var e_6, _a, e_7, _b;

    var _this = this;

    if (_event === void 0) {
      _event = _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent;
    }

    var configuration = stateTransition.configuration; // Transition will "apply" if:
    // - this is the initial state (there is no current state)
    // - OR there are transitions

    var willTransition = !currentState || stateTransition.transitions.length > 0;
    var resolvedConfiguration = willTransition ? stateTransition.configuration : currentState ? currentState.configuration : [];
    var isDone = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.isInFinalState)(resolvedConfiguration, this);
    var resolvedStateValue = willTransition ? (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getValue)(this.machine, configuration) : undefined;
    var historyValue = currentState ? currentState.historyValue ? currentState.historyValue : stateTransition.source ? this.machine.historyValue(currentState.value) : undefined : undefined;
    var actionBlocks = this.getActions(new Set(resolvedConfiguration), isDone, stateTransition, context, _event, currentState, predictableExec);
    var activities = currentState ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, currentState.activities) : {};

    try {
      for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
        var block = actionBlocks_1_1.value;

        try {
          for (var _c = (e_7 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(block.actions)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var action = _d.value;

            if (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.start) {
              activities[action.activity.id || action.activity.type] = action;
            } else if (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.stop) {
              activities[action.activity.id || action.activity.type] = false;
            }
          }
        } catch (e_7_1) {
          e_7 = {
            error: e_7_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
          } finally {
            if (e_7) throw e_7.error;
          }
        }
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    var _e = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.resolveActions)(this, currentState, context, _event, actionBlocks, predictableExec, this.machine.config.predictableActionArguments || this.machine.config.preserveActionOrder), 2),
        resolvedActions = _e[0],
        updatedContext = _e[1];

    var _f = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.partition)(resolvedActions, _utils_js__WEBPACK_IMPORTED_MODULE_1__.isRaisableAction), 2),
        raisedEvents = _f[0],
        nonRaisedActions = _f[1];

    var invokeActions = resolvedActions.filter(function (action) {
      var _a;

      return action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.start && ((_a = action.activity) === null || _a === void 0 ? void 0 : _a.type) === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.invoke;
    });
    var children = invokeActions.reduce(function (acc, action) {
      acc[action.activity.id] = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_8__.createInvocableActor)(action.activity, _this.machine, updatedContext, _event);
      return acc;
    }, currentState ? (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, currentState.children) : {});
    var nextState = new _State_js__WEBPACK_IMPORTED_MODULE_2__.State({
      value: resolvedStateValue || currentState.value,
      context: updatedContext,
      _event: _event,
      // Persist _sessionid between states
      _sessionid: currentState ? currentState._sessionid : null,
      historyValue: resolvedStateValue ? historyValue ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.updateHistoryValue)(historyValue, resolvedStateValue) : undefined : currentState ? currentState.historyValue : undefined,
      history: !resolvedStateValue || stateTransition.source ? currentState : undefined,
      actions: resolvedStateValue ? nonRaisedActions : [],
      activities: resolvedStateValue ? activities : currentState ? currentState.activities : {},
      events: [],
      configuration: resolvedConfiguration,
      transitions: stateTransition.transitions,
      children: children,
      done: isDone,
      tags: (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.getTagsFromConfiguration)(resolvedConfiguration),
      machine: this
    });
    var didUpdateContext = context !== updatedContext;
    nextState.changed = _event.name === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.update || didUpdateContext; // Dispose of penultimate histories to prevent memory leaks

    var history = nextState.history;

    if (history) {
      delete history.history;
    } // There are transient transitions if the machine is not in a final state
    // and if some of the state nodes have transient ("always") transitions.


    var hasAlwaysTransitions = !isDone && (this._transient || configuration.some(function (stateNode) {
      return stateNode._transient;
    })); // If there are no enabled transitions, check if there are transient transitions.
    // If there are transient transitions, continue checking for more transitions
    // because an transient transition should be triggered even if there are no
    // enabled transitions.
    //
    // If we're already working on an transient transition then stop to prevent an infinite loop.
    //
    // Otherwise, if there are no enabled nor transient transitions, we are done.

    if (!willTransition && (!hasAlwaysTransitions || _event.name === NULL_EVENT)) {
      return nextState;
    }

    var maybeNextState = nextState;

    if (!isDone) {
      if (hasAlwaysTransitions) {
        maybeNextState = this.resolveRaisedTransition(maybeNextState, {
          type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.nullEvent
        }, _event, predictableExec);
      }

      while (raisedEvents.length) {
        var raisedEvent = raisedEvents.shift();
        maybeNextState = this.resolveRaisedTransition(maybeNextState, raisedEvent._event, _event, predictableExec);
      }
    } // Detect if state changed


    var changed = maybeNextState.changed || (history ? !!maybeNextState.actions.length || didUpdateContext || typeof history.value !== typeof maybeNextState.value || !(0,_State_js__WEBPACK_IMPORTED_MODULE_2__.stateValuesEqual)(maybeNextState.value, history.value) : undefined);
    maybeNextState.changed = changed; // Preserve original history after raised events

    maybeNextState.history = history;
    return maybeNextState;
  };
  /**
   * Returns the child state node from its relative `stateKey`, or throws.
   */


  StateNode.prototype.getStateNode = function (stateKey) {
    if (isStateId(stateKey)) {
      return this.machine.getStateNodeById(stateKey);
    }

    if (!this.states) {
      throw new Error("Unable to retrieve child state '".concat(stateKey, "' from '").concat(this.id, "'; no child states exist."));
    }

    var result = this.states[stateKey];

    if (!result) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return result;
  };
  /**
   * Returns the state node with the given `stateId`, or throws.
   *
   * @param stateId The state ID. The prefix "#" is removed.
   */


  StateNode.prototype.getStateNodeById = function (stateId) {
    var resolvedStateId = isStateId(stateId) ? stateId.slice(STATE_IDENTIFIER.length) : stateId;

    if (resolvedStateId === this.id) {
      return this;
    }

    var stateNode = this.machine.idMap[resolvedStateId];

    if (!stateNode) {
      throw new Error("Child state node '#".concat(resolvedStateId, "' does not exist on machine '").concat(this.id, "'"));
    }

    return stateNode;
  };
  /**
   * Returns the relative state node from the given `statePath`, or throws.
   *
   * @param statePath The string or string array relative path to the state node.
   */


  StateNode.prototype.getStateNodeByPath = function (statePath) {
    if (typeof statePath === 'string' && isStateId(statePath)) {
      try {
        return this.getStateNodeById(statePath.slice(1));
      } catch (e) {// try individual paths
        // throw e;
      }
    }

    var arrayStatePath = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStatePath)(statePath, this.delimiter).slice();
    var currentStateNode = this;

    while (arrayStatePath.length) {
      var key = arrayStatePath.shift();

      if (!key.length) {
        break;
      }

      currentStateNode = currentStateNode.getStateNode(key);
    }

    return currentStateNode;
  };
  /**
   * Resolves a partial state value with its full representation in this machine.
   *
   * @param stateValue The partial state value to resolve.
   */


  StateNode.prototype.resolve = function (stateValue) {
    var _a;

    var _this = this;

    if (!stateValue) {
      return this.initialStateValue || EMPTY_OBJECT; // TODO: type-specific properties
    }

    switch (this.type) {
      case 'parallel':
        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapValues)(this.initialStateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(stateValue[subStateKey] || subStateValue) : EMPTY_OBJECT;
        });

      case 'compound':
        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(stateValue)) {
          var subStateNode = this.getStateNode(stateValue);

          if (subStateNode.type === 'parallel' || subStateNode.type === 'compound') {
            return _a = {}, _a[stateValue] = subStateNode.initialStateValue, _a;
          }

          return stateValue;
        }

        if (!Object.keys(stateValue).length) {
          return this.initialStateValue || {};
        }

        return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapValues)(stateValue, function (subStateValue, subStateKey) {
          return subStateValue ? _this.getStateNode(subStateKey).resolve(subStateValue) : EMPTY_OBJECT;
        });

      default:
        return stateValue || EMPTY_OBJECT;
    }
  };

  StateNode.prototype.getResolvedPath = function (stateIdentifier) {
    if (isStateId(stateIdentifier)) {
      var stateNode = this.machine.idMap[stateIdentifier.slice(STATE_IDENTIFIER.length)];

      if (!stateNode) {
        throw new Error("Unable to find state node '".concat(stateIdentifier, "'"));
      }

      return stateNode.path;
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStatePath)(stateIdentifier, this.delimiter);
  };

  Object.defineProperty(StateNode.prototype, "initialStateValue", {
    get: function () {
      var _a;

      if (this.__cache.initialStateValue) {
        return this.__cache.initialStateValue;
      }

      var initialStateValue;

      if (this.type === 'parallel') {
        initialStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapFilterValues)(this.states, function (state) {
          return state.initialStateValue || EMPTY_OBJECT;
        }, function (stateNode) {
          return !(stateNode.type === 'history');
        });
      } else if (this.initial !== undefined) {
        if (!this.states[this.initial]) {
          throw new Error("Initial state '".concat(this.initial, "' not found on '").concat(this.key, "'"));
        }

        initialStateValue = (0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.isLeafNode)(this.states[this.initial]) ? this.initial : (_a = {}, _a[this.initial] = this.states[this.initial].initialStateValue, _a);
      } else {
        // The finite state value of a machine without child states is just an empty object
        initialStateValue = {};
      }

      this.__cache.initialStateValue = initialStateValue;
      return this.__cache.initialStateValue;
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.getInitialState = function (stateValue, context) {
    this._init(); // TODO: this should be in the constructor (see note in constructor)


    var configuration = this.getStateNodes(stateValue);
    return this.resolveTransition({
      configuration: configuration,
      exitSet: [],
      transitions: [],
      source: undefined,
      actions: []
    }, undefined, context !== null && context !== void 0 ? context : this.machine.context, undefined);
  };

  Object.defineProperty(StateNode.prototype, "initialState", {
    /**
     * The initial State instance, which includes all actions to be executed from
     * entering the initial state.
     */
    get: function () {
      var initialStateValue = this.initialStateValue;

      if (!initialStateValue) {
        throw new Error("Cannot retrieve initial state from simple state '".concat(this.id, "'."));
      }

      return this.getInitialState(initialStateValue);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "target", {
    /**
     * The target state value of the history state node, if it exists. This represents the
     * default state value to transition to if no history value exists yet.
     */
    get: function () {
      var target;

      if (this.type === 'history') {
        var historyConfig = this.config;

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(historyConfig.target)) {
          target = isStateId(historyConfig.target) ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.pathToStateValue)(this.machine.getStateNodeById(historyConfig.target).path.slice(this.path.length - 1)) : historyConfig.target;
        } else {
          target = historyConfig.target;
        }
      }

      return target;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Returns the leaf nodes from a state path relative to this state node.
   *
   * @param relativeStateId The relative state path to retrieve the state nodes
   * @param history The previous state to retrieve history
   * @param resolve Whether state nodes should resolve to initial child state nodes
   */

  StateNode.prototype.getRelativeStateNodes = function (relativeStateId, historyValue, resolve) {
    if (resolve === void 0) {
      resolve = true;
    }

    return resolve ? relativeStateId.type === 'history' ? relativeStateId.resolveHistory(historyValue) : relativeStateId.initialStateNodes : [relativeStateId];
  };

  Object.defineProperty(StateNode.prototype, "initialStateNodes", {
    get: function () {
      var _this = this;

      if ((0,_stateUtils_js__WEBPACK_IMPORTED_MODULE_7__.isLeafNode)(this)) {
        return [this];
      } // Case when state node is compound but no initial state is defined


      if (this.type === 'compound' && !this.initial) {
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(false, "Compound state node '".concat(this.id, "' has no initial state."));
        }

        return [this];
      }

      var initialStateNodePaths = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStatePaths)(this.initialStateValue);
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(initialStateNodePaths.map(function (initialPath) {
        return _this.getFromRelativePath(initialPath);
      }));
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Retrieves state nodes from a relative path to this state node.
   *
   * @param relativePath The relative path from this state node
   * @param historyValue
   */

  StateNode.prototype.getFromRelativePath = function (relativePath) {
    if (!relativePath.length) {
      return [this];
    }

    var _a = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(relativePath),
        stateKey = _a[0],
        childStatePath = _a.slice(1);

    if (!this.states) {
      throw new Error("Cannot retrieve subPath '".concat(stateKey, "' from node with no states"));
    }

    var childStateNode = this.getStateNode(stateKey);

    if (childStateNode.type === 'history') {
      return childStateNode.resolveHistory();
    }

    if (!this.states[stateKey]) {
      throw new Error("Child state '".concat(stateKey, "' does not exist on '").concat(this.id, "'"));
    }

    return this.states[stateKey].getFromRelativePath(childStatePath);
  };

  StateNode.prototype.historyValue = function (relativeStateValue) {
    if (!Object.keys(this.states).length) {
      return undefined;
    }

    return {
      current: relativeStateValue || this.initialStateValue,
      states: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.mapFilterValues)(this.states, function (stateNode, key) {
        if (!relativeStateValue) {
          return stateNode.historyValue();
        }

        var subStateValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(relativeStateValue) ? undefined : relativeStateValue[key];
        return stateNode.historyValue(subStateValue || stateNode.initialStateValue);
      }, function (stateNode) {
        return !stateNode.history;
      })
    };
  };
  /**
   * Resolves to the historical value(s) of the parent state node,
   * represented by state nodes.
   *
   * @param historyValue
   */


  StateNode.prototype.resolveHistory = function (historyValue) {
    var _this = this;

    if (this.type !== 'history') {
      return [this];
    }

    var parent = this.parent;

    if (!historyValue) {
      var historyTarget = this.target;
      return historyTarget ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStatePaths)(historyTarget).map(function (relativeChildPath) {
        return parent.getFromRelativePath(relativeChildPath);
      })) : parent.initialStateNodes;
    }

    var subHistoryValue = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.nestedPath)(parent.path, 'states')(historyValue).current;

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(subHistoryValue)) {
      return [parent.getStateNode(subHistoryValue)];
    }

    return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toStatePaths)(subHistoryValue).map(function (subStatePath) {
      return _this.history === 'deep' ? parent.getFromRelativePath(subStatePath) : [parent.states[subStatePath[0]]];
    }));
  };

  Object.defineProperty(StateNode.prototype, "stateIds", {
    /**
     * All the state node IDs of this state node and its descendant state nodes.
     */
    get: function () {
      var _this = this;

      var childStateIds = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(Object.keys(this.states).map(function (stateKey) {
        return _this.states[stateKey].stateIds;
      }));
      return [this.id].concat(childStateIds);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "events", {
    /**
     * All the event types accepted by this state node and its descendants.
     */
    get: function () {
      var e_8, _a, e_9, _b;

      if (this.__cache.events) {
        return this.__cache.events;
      }

      var states = this.states;
      var events = new Set(this.ownEvents);

      if (states) {
        try {
          for (var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(states)), _d = _c.next(); !_d.done; _d = _c.next()) {
            var stateId = _d.value;
            var state = states[stateId];

            if (state.states) {
              try {
                for (var _e = (e_9 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(state.events)), _f = _e.next(); !_f.done; _f = _e.next()) {
                  var event_1 = _f.value;
                  events.add("".concat(event_1));
                }
              } catch (e_9_1) {
                e_9 = {
                  error: e_9_1
                };
              } finally {
                try {
                  if (_f && !_f.done && (_b = _e.return)) _b.call(_e);
                } finally {
                  if (e_9) throw e_9.error;
                }
              }
            }
          }
        } catch (e_8_1) {
          e_8 = {
            error: e_8_1
          };
        } finally {
          try {
            if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
          } finally {
            if (e_8) throw e_8.error;
          }
        }
      }

      return this.__cache.events = Array.from(events);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(StateNode.prototype, "ownEvents", {
    /**
     * All the events that have transitions directly from this state node.
     *
     * Excludes any inert events.
     */
    get: function () {
      var events = new Set(this.transitions.filter(function (transition) {
        return !(!transition.target && !transition.actions.length && transition.internal);
      }).map(function (transition) {
        return transition.eventType;
      }));
      return Array.from(events);
    },
    enumerable: false,
    configurable: true
  });

  StateNode.prototype.resolveTarget = function (_target) {
    var _this = this;

    if (_target === undefined) {
      // an undefined target signals that the state node should not transition from that state when receiving that event
      return undefined;
    }

    return _target.map(function (target) {
      if (!(0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(target)) {
        return target;
      }

      var isInternalTarget = target[0] === _this.delimiter; // If internal target is defined on machine,
      // do not include machine key on target

      if (isInternalTarget && !_this.parent) {
        return _this.getStateNodeByPath(target.slice(1));
      }

      var resolvedTarget = isInternalTarget ? _this.key + target : target;

      if (_this.parent) {
        try {
          var targetStateNode = _this.parent.getStateNodeByPath(resolvedTarget);

          return targetStateNode;
        } catch (err) {
          throw new Error("Invalid transition definition for state node '".concat(_this.id, "':\n").concat(err.message));
        }
      } else {
        return _this.getStateNodeByPath(resolvedTarget);
      }
    });
  };

  StateNode.prototype.formatTransition = function (transitionConfig) {
    var _this = this;

    var normalizedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.normalizeTarget)(transitionConfig.target);
    var internal = 'internal' in transitionConfig ? transitionConfig.internal : normalizedTarget ? normalizedTarget.some(function (_target) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.isString)(_target) && _target[0] === _this.delimiter;
    }) : true;
    var guards = this.machine.options.guards;
    var target = this.resolveTarget(normalizedTarget);

    var transition = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, transitionConfig), {
      actions: (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObjects)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(transitionConfig.actions)),
      cond: (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toGuard)(transitionConfig.cond, guards),
      target: target,
      source: this,
      internal: internal,
      eventType: transitionConfig.event,
      toJSON: function () {
        return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, transition), {
          target: transition.target ? transition.target.map(function (t) {
            return "#".concat(t.id);
          }) : undefined,
          source: "#".concat(_this.id)
        });
      }
    });

    return transition;
  };

  StateNode.prototype.formatTransitions = function () {
    var e_10, _a;

    var _this = this;

    var onConfig;

    if (!this.config.on) {
      onConfig = [];
    } else if (Array.isArray(this.config.on)) {
      onConfig = this.config.on;
    } else {
      var _b = this.config.on,
          _c = WILDCARD,
          _d = _b[_c],
          wildcardConfigs = _d === void 0 ? [] : _d,
          strictTransitionConfigs_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__rest)(_b, [typeof _c === "symbol" ? _c : _c + ""]);

      onConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(Object.keys(strictTransitionConfigs_1).map(function (key) {
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION && key === NULL_EVENT) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(false, "Empty string transition configs (e.g., `{ on: { '': ... }}`) for transient transitions are deprecated. Specify the transition in the `{ always: ... }` property instead. " + "Please check the `on` configuration for \"#".concat(_this.id, "\"."));
        }

        var transitionConfigArray = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toTransitionConfigArray)(key, strictTransitionConfigs_1[key]);

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
          validateArrayifiedTransitions(_this, key, transitionConfigArray);
        }

        return transitionConfigArray;
      }).concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toTransitionConfigArray)(WILDCARD, wildcardConfigs)));
    }

    var eventlessConfig = this.config.always ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toTransitionConfigArray)('', this.config.always) : [];
    var doneConfig = this.config.onDone ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.done)(this.id)), this.config.onDone) : [];

    if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.warn)(!(this.config.onDone && !this.parent), "Root nodes cannot have an \".onDone\" transition. Please check the config of \"".concat(this.id, "\"."));
    }

    var invokeConfig = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(this.invoke.map(function (invokeDef) {
      var settleTransitions = [];

      if (invokeDef.onDone) {
        settleTransitions.push.apply(settleTransitions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.doneInvoke)(invokeDef.id)), invokeDef.onDone)), false));
      }

      if (invokeDef.onError) {
        settleTransitions.push.apply(settleTransitions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toTransitionConfigArray)(String((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.error)(invokeDef.id)), invokeDef.onError)), false));
      }

      return settleTransitions;
    }));
    var delayedTransitions = this.after;
    var formattedTransitions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(doneConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(invokeConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(onConfig), false), (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(eventlessConfig), false).map(function (transitionConfig) {
      return (0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.toArray)(transitionConfig).map(function (transition) {
        return _this.formatTransition(transition);
      });
    }));

    try {
      for (var delayedTransitions_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(delayedTransitions), delayedTransitions_1_1 = delayedTransitions_1.next(); !delayedTransitions_1_1.done; delayedTransitions_1_1 = delayedTransitions_1.next()) {
        var delayedTransition = delayedTransitions_1_1.value;
        formattedTransitions.push(delayedTransition);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (delayedTransitions_1_1 && !delayedTransitions_1_1.done && (_a = delayedTransitions_1.return)) _a.call(delayedTransitions_1);
      } finally {
        if (e_10) throw e_10.error;
      }
    }

    return formattedTransitions;
  };

  return StateNode;
}();




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js":
/*!*********************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js ***!
  \*********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __values: () => (/* binding */ __values)
/* harmony export */ });
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

function __spreadArray(to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/actionTypes.js":
/*!*****************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/actionTypes.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   after: () => (/* binding */ after),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   doneState: () => (/* binding */ doneState),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   errorExecution: () => (/* binding */ errorExecution),
/* harmony export */   errorPlatform: () => (/* binding */ errorPlatform),
/* harmony export */   init: () => (/* binding */ init),
/* harmony export */   invoke: () => (/* binding */ invoke),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   nullEvent: () => (/* binding */ nullEvent),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   update: () => (/* binding */ update)
/* harmony export */ });
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./types.js */ "../log-view-machine/node_modules/xstate/es/types.js");


var start = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Start;
var stop = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Stop;
var raise = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Raise;
var send = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Send;
var cancel = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Cancel;
var nullEvent = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.NullEvent;
var assign = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Assign;
var after = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.After;
var doneState = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.DoneState;
var log = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Log;
var init = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Init;
var invoke = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Invoke;
var errorExecution = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorExecution;
var errorPlatform = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorPlatform;
var error = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.ErrorCustom;
var update = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Update;
var choose = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Choose;
var pure = _types_js__WEBPACK_IMPORTED_MODULE_0__.ActionTypes.Pure;




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/actions.js":
/*!*************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/actions.js ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   actionTypes: () => (/* reexport module object */ _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__),
/* harmony export */   after: () => (/* binding */ after),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   done: () => (/* binding */ done),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   error: () => (/* binding */ error),
/* harmony export */   escalate: () => (/* binding */ escalate),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   getActionFunction: () => (/* binding */ getActionFunction),
/* harmony export */   initEvent: () => (/* binding */ initEvent),
/* harmony export */   isActionObject: () => (/* binding */ isActionObject),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   resolveActions: () => (/* binding */ resolveActions),
/* harmony export */   resolveLog: () => (/* binding */ resolveLog),
/* harmony export */   resolveRaise: () => (/* binding */ resolveRaise),
/* harmony export */   resolveSend: () => (/* binding */ resolveSend),
/* harmony export */   resolveStop: () => (/* binding */ resolveStop),
/* harmony export */   respond: () => (/* binding */ respond),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   start: () => (/* binding */ start),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   toActionObject: () => (/* binding */ toActionObject),
/* harmony export */   toActionObjects: () => (/* binding */ toActionObjects),
/* harmony export */   toActivityDefinition: () => (/* binding */ toActivityDefinition)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "../log-view-machine/node_modules/xstate/es/types.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actionTypes.js */ "../log-view-machine/node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");








var initEvent = /*#__PURE__*/(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toSCXMLEvent)({
  type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.init
});
function getActionFunction(actionType, actionFunctionMap) {
  return actionFunctionMap ? actionFunctionMap[actionType] || undefined : undefined;
}
function toActionObject(action, actionFunctionMap) {
  var actionObject;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isString)(action) || typeof action === 'number') {
    var exec = getActionFunction(action, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(exec)) {
      actionObject = {
        type: action,
        exec: exec
      };
    } else if (exec) {
      actionObject = exec;
    } else {
      actionObject = {
        type: action,
        exec: undefined
      };
    }
  } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action)) {
    actionObject = {
      // Convert action to string if unnamed
      type: action.name || action.toString(),
      exec: action
    };
  } else {
    var exec = getActionFunction(action.type, actionFunctionMap);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(exec)) {
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, action), {
        exec: exec
      });
    } else if (exec) {
      var actionType = exec.type || action.type;
      actionObject = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, exec), action), {
        type: actionType
      });
    } else {
      actionObject = action;
    }
  }

  return actionObject;
}
var toActionObjects = function (action, actionFunctionMap) {
  if (!action) {
    return [];
  }

  var actions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isArray)(action) ? action : [action];
  return actions.map(function (subAction) {
    return toActionObject(subAction, actionFunctionMap);
  });
};
function toActivityDefinition(action) {
  var actionObject = toActionObject(action);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
    id: (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isString)(action) ? action : actionObject.id
  }, actionObject), {
    type: actionObject.type
  });
}
/**
 * Raises an event. This places the event in the internal event queue, so that
 * the event is immediately consumed by the machine in the current step.
 *
 * @param eventType The event to raise.
 */

function raise(event, options) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.raise,
    event: typeof event === 'function' ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toEventObject)(event),
    delay: options ? options.delay : undefined,
    id: options === null || options === void 0 ? void 0 : options.id
  };
}
function resolveRaise(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  };
  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, action), {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.raise,
    _event: resolvedEvent,
    delay: resolvedDelay
  });
}
/**
 * Sends an event. This returns an action that will be read by an interpreter to
 * send the event in the next step, after the current step is finished executing.
 *
 * @deprecated Use the `sendTo(...)` action creator instead.
 *
 * @param event The event to send.
 * @param options Options to pass into the send event:
 *  - `id` - The unique send event identifier (used with `cancel()`).
 *  - `delay` - The number of milliseconds to delay the sending of the event.
 *  - `to` - The target of this event (by default, the machine the event was sent from).
 */

function send(event, options) {
  return {
    to: options ? options.to : undefined,
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.send,
    event: (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(event) ? event : (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toEventObject)(event),
    delay: options ? options.delay : undefined,
    // TODO: don't auto-generate IDs here like that
    // there is too big chance of the ID collision
    id: options && options.id !== undefined ? options.id : (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(event) ? event.name : (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.getEventType)(event)
  };
}
function resolveSend(action, ctx, _event, delaysMap) {
  var meta = {
    _event: _event
  }; // TODO: helper function for resolving Expr

  var resolvedEvent = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action.event) ? action.event(ctx, _event.data, meta) : action.event);
  var resolvedDelay;

  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isString)(action.delay)) {
    var configDelay = delaysMap && delaysMap[action.delay];
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(configDelay) ? configDelay(ctx, _event.data, meta) : configDelay;
  } else {
    resolvedDelay = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action.delay) ? action.delay(ctx, _event.data, meta) : action.delay;
  }

  var resolvedTarget = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action.to) ? action.to(ctx, _event.data, meta) : action.to;
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, action), {
    to: resolvedTarget,
    _event: resolvedEvent,
    event: resolvedEvent.data,
    delay: resolvedDelay
  });
}
/**
 * Sends an event to this machine's parent.
 *
 * @param event The event to send to the parent machine.
 * @param options Options to pass into the send event.
 */

function sendParent(event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_1__.SpecialTargets.Parent
  }));
}
/**
 * Sends an event to an actor.
 *
 * @param actor The `ActorRef` to send the event to.
 * @param event The event to send, or an expression that evaluates to the event to send
 * @param options Send action options
 * @returns An XState send action object
 */

function sendTo(actor, event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options), {
    to: actor
  }));
}
/**
 * Sends an update event to this machine's parent.
 */

function sendUpdate() {
  return sendParent(_actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.update);
}
/**
 * Sends an event back to the sender of the original event.
 *
 * @param event The event to send back to the sender
 * @param options Options to pass into the send event
 */

function respond(event, options) {
  return send(event, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options), {
    to: function (_, __, _a) {
      var _event = _a._event;
      return _event.origin; // TODO: handle when _event.origin is undefined
    }
  }));
}

var defaultLogExpr = function (context, event) {
  return {
    context: context,
    event: event
  };
};
/**
 *
 * @param expr The expression function to evaluate which will be logged.
 *  Takes in 2 arguments:
 *  - `ctx` - the current state context
 *  - `event` - the event that caused this action to be executed.
 * @param label The label to give to the logged expression.
 */


function log(expr, label) {
  if (expr === void 0) {
    expr = defaultLogExpr;
  }

  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.log,
    label: label,
    expr: expr
  };
}
var resolveLog = function (action, ctx, _event) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, action), {
    value: (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isString)(action.expr) ? action.expr : action.expr(ctx, _event.data, {
      _event: _event
    })
  });
};
/**
 * Cancels an in-flight `send(...)` action. A canceled sent action will not
 * be executed, nor will its event be sent, unless it has already been sent
 * (e.g., if `cancel(...)` is called after the `send(...)` action's `delay`).
 *
 * @param sendId The `id` of the `send(...)` action to cancel.
 */

var cancel = function (sendId) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.cancel,
    sendId: sendId
  };
};
/**
 * Starts an activity.
 *
 * @param activity The activity to start.
 */

function start(activity) {
  var activityDef = toActivityDefinition(activity);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.Start,
    activity: activityDef,
    exec: undefined
  };
}
/**
 * Stops an activity.
 *
 * @param actorRef The activity to stop.
 */

function stop(actorRef) {
  var activity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(actorRef) ? actorRef : toActivityDefinition(actorRef);
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.Stop,
    activity: activity,
    exec: undefined
  };
}
function resolveStop(action, context, _event) {
  var actorRefOrString = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(action.activity) ? action.activity(context, _event.data) : action.activity;
  var resolvedActorRef = typeof actorRefOrString === 'string' ? {
    id: actorRefOrString
  } : actorRefOrString;
  var actionObject = {
    type: _types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.Stop,
    activity: resolvedActorRef
  };
  return actionObject;
}
/**
 * Updates the current context of the machine.
 *
 * @param assignment An object that represents the partial context to update.
 */

var assign = function (assignment) {
  return {
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.assign,
    assignment: assignment
  };
};
function isActionObject(action) {
  return typeof action === 'object' && 'type' in action;
}
/**
 * Returns an event type that represents an implicit event that
 * is sent after the specified `delay`.
 *
 * @param delayRef The delay in milliseconds
 * @param id The state node ID where this event is handled
 */

function after(delayRef, id) {
  var idSuffix = id ? "#".concat(id) : '';
  return "".concat(_types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.After, "(").concat(delayRef, ")").concat(idSuffix);
}
/**
 * Returns an event that represents that a final state node
 * has been reached in the parent state node.
 *
 * @param id The final state node's parent state node `id`
 * @param data The data to pass into the event
 */

function done(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.DoneState, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
/**
 * Returns an event that represents that an invoked service has terminated.
 *
 * An invoked service is terminated when it has reached a top-level final state node,
 * but not when it is canceled.
 *
 * @param id The final state node ID
 * @param data The data to pass into the event
 */

function doneInvoke(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.DoneInvoke, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
function error(id, data) {
  var type = "".concat(_types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.ErrorPlatform, ".").concat(id);
  var eventObject = {
    type: type,
    data: data
  };

  eventObject.toString = function () {
    return type;
  };

  return eventObject;
}
function pure(getActions) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.Pure,
    get: getActions
  };
}
/**
 * Forwards (sends) an event to a specified service.
 *
 * @param target The target service to forward the event to.
 * @param options Options to pass into the send action creator.
 */

function forwardTo(target, options) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION && (!target || typeof target === 'function')) {
    var originalTarget_1 = target;

    target = function () {
      var args = [];

      for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
      }

      var resolvedTarget = typeof originalTarget_1 === 'function' ? originalTarget_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(args), false)) : originalTarget_1;

      if (!resolvedTarget) {
        throw new Error("Attempted to forward event to undefined actor. This risks an infinite loop in the sender.");
      }

      return resolvedTarget;
    };
  }

  return send(function (_, event) {
    return event;
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options), {
    to: target
  }));
}
/**
 * Escalates an error by sending it as an event to this machine's parent.
 *
 * @param errorData The error data to send, or the expression function that
 * takes in the `context`, `event`, and `meta`, and returns the error data to send.
 * @param options Options to pass into the send action creator.
 */

function escalate(errorData, options) {
  return sendParent(function (context, event, meta) {
    return {
      type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.error,
      data: (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isFunction)(errorData) ? errorData(context, event, meta) : errorData
    };
  }, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options), {
    to: _types_js__WEBPACK_IMPORTED_MODULE_1__.SpecialTargets.Parent
  }));
}
function choose(conds) {
  return {
    type: _types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.Choose,
    conds: conds
  };
}

var pluckAssigns = function (actionBlocks) {
  var e_1, _a;

  var assignActions = [];

  try {
    for (var actionBlocks_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(actionBlocks), actionBlocks_1_1 = actionBlocks_1.next(); !actionBlocks_1_1.done; actionBlocks_1_1 = actionBlocks_1.next()) {
      var block = actionBlocks_1_1.value;
      var i = 0;

      while (i < block.actions.length) {
        if (block.actions[i].type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.assign) {
          assignActions.push(block.actions[i]);
          block.actions.splice(i, 1);
          continue;
        }

        i++;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (actionBlocks_1_1 && !actionBlocks_1_1.done && (_a = actionBlocks_1.return)) _a.call(actionBlocks_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return assignActions;
};

function resolveActions(machine, currentState, currentContext, _event, actionBlocks, predictableExec, preserveActionOrder) {
  if (preserveActionOrder === void 0) {
    preserveActionOrder = false;
  }

  var assignActions = preserveActionOrder ? [] : pluckAssigns(actionBlocks);
  var updatedContext = assignActions.length ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.updateContext)(currentContext, _event, assignActions, currentState) : currentContext;
  var preservedContexts = preserveActionOrder ? [currentContext] : undefined;
  var deferredToBlockEnd = [];

  function handleAction(blockType, actionObject) {
    var _a;

    switch (actionObject.type) {
      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.raise:
        {
          var raisedAction = resolveRaise(actionObject, updatedContext, _event, machine.options.delays);

          if (predictableExec && typeof raisedAction.delay === 'number') {
            predictableExec(raisedAction, updatedContext, _event);
          }

          return raisedAction;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.send:
        var sendAction = resolveSend(actionObject, updatedContext, _event, machine.options.delays); // TODO: fix ActionTypes.Init

        if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION) {
          var configuredDelay = actionObject.delay; // warn after resolving as we can create better contextual message here

          (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.warn)(!(0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.isString)(configuredDelay) || typeof sendAction.delay === 'number', // tslint:disable-next-line:max-line-length
          "No delay reference for delay expression '".concat(configuredDelay, "' was found on machine '").concat(machine.id, "'"));
        }

        if (predictableExec && sendAction.to !== _types_js__WEBPACK_IMPORTED_MODULE_1__.SpecialTargets.Internal) {
          if (blockType === 'entry') {
            deferredToBlockEnd.push(sendAction);
          } else {
            predictableExec(sendAction, updatedContext, _event);
          }
        }

        return sendAction;

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.log:
        {
          var resolved = resolveLog(actionObject, updatedContext, _event);
          predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, updatedContext, _event);
          return resolved;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.choose:
        {
          var chooseAction = actionObject;
          var matchedActions = (_a = chooseAction.conds.find(function (condition) {
            var guard = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toGuard)(condition.cond, machine.options.guards);
            return !guard || (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.evaluateGuard)(machine, guard, updatedContext, _event, !predictableExec ? currentState : undefined);
          })) === null || _a === void 0 ? void 0 : _a.actions;

          if (!matchedActions) {
            return [];
          }

          var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toArray)(matchedActions), machine.options.actions)
          }], predictableExec, preserveActionOrder), 2),
              resolvedActionsFromChoose = _b[0],
              resolvedContextFromChoose = _b[1];

          updatedContext = resolvedContextFromChoose;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromChoose;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.pure:
        {
          var matchedActions = actionObject.get(updatedContext, _event.data);

          if (!matchedActions) {
            return [];
          }

          var _c = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(resolveActions(machine, currentState, updatedContext, _event, [{
            type: blockType,
            actions: toActionObjects((0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.toArray)(matchedActions), machine.options.actions)
          }], predictableExec, preserveActionOrder), 2),
              resolvedActionsFromPure = _c[0],
              resolvedContext = _c[1];

          updatedContext = resolvedContext;
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          return resolvedActionsFromPure;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.stop:
        {
          var resolved = resolveStop(actionObject, updatedContext, _event);
          predictableExec === null || predictableExec === void 0 ? void 0 : predictableExec(resolved, currentContext, _event);
          return resolved;
        }

      case _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.assign:
        {
          updatedContext = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.updateContext)(updatedContext, _event, [actionObject], !predictableExec ? currentState : undefined);
          preservedContexts === null || preservedContexts === void 0 ? void 0 : preservedContexts.push(updatedContext);
          break;
        }

      default:
        var resolvedActionObject = toActionObject(actionObject, machine.options.actions);
        var exec_1 = resolvedActionObject.exec;

        if (predictableExec) {
          predictableExec(resolvedActionObject, updatedContext, _event);
        } else if (exec_1 && preservedContexts) {
          var contextIndex_1 = preservedContexts.length - 1;

          var wrapped = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, resolvedActionObject), {
            exec: function (_ctx) {
              var args = [];

              for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
              }

              exec_1.apply(void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([preservedContexts[contextIndex_1]], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(args), false));
            }
          });

          resolvedActionObject = wrapped;
        }

        return resolvedActionObject;
    }
  }

  function processBlock(block) {
    var e_2, _a;

    var resolvedActions = [];

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(block.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        var resolved = handleAction(block.type, action);

        if (resolved) {
          resolvedActions = resolvedActions.concat(resolved);
        }
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    deferredToBlockEnd.forEach(function (action) {
      predictableExec(action, updatedContext, _event);
    });
    deferredToBlockEnd.length = 0;
    return resolvedActions;
  }

  var resolvedActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_3__.flatten)(actionBlocks.map(processBlock));
  return [resolvedActions, updatedContext];
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/behaviors.js":
/*!***************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/behaviors.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   fromPromise: () => (/* binding */ fromPromise),
/* harmony export */   fromReducer: () => (/* binding */ fromReducer),
/* harmony export */   spawnBehavior: () => (/* binding */ spawnBehavior)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "../log-view-machine/node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "../log-view-machine/node_modules/xstate/es/Actor.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");




/**
 * Returns an actor behavior from a reducer and its initial state.
 *
 * @param transition The pure reducer that returns the next state given the current state and event.
 * @param initialState The initial state of the reducer.
 * @returns An actor behavior
 */

function fromReducer(transition, initialState) {
  return {
    transition: transition,
    initialState: initialState
  };
}
function fromPromise(promiseFn) {
  var initialState = {
    error: undefined,
    data: undefined,
    status: 'pending'
  };
  return {
    transition: function (state, event, _a) {
      var parent = _a.parent,
          id = _a.id,
          observers = _a.observers;

      switch (event.type) {
        case 'fulfill':
          parent === null || parent === void 0 ? void 0 : parent.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke)(id, event.data));
          return {
            error: undefined,
            data: event.data,
            status: 'fulfilled'
          };

        case 'reject':
          parent === null || parent === void 0 ? void 0 : parent.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_0__.error)(id, event.error));
          observers.forEach(function (observer) {
            observer.error(event.error);
          });
          return {
            error: event.error,
            data: undefined,
            status: 'rejected'
          };

        default:
          return state;
      }
    },
    initialState: initialState,
    start: function (_a) {
      var self = _a.self;
      promiseFn().then(function (data) {
        self.send({
          type: 'fulfill',
          data: data
        });
      }, function (reason) {
        self.send({
          type: 'reject',
          error: reason
        });
      });
      return initialState;
    }
  };
}
function spawnBehavior(behavior, options) {
  if (options === void 0) {
    options = {};
  }

  var state = behavior.initialState;
  var observers = new Set();
  var mailbox = [];
  var flushing = false;

  var flush = function () {
    if (flushing) {
      return;
    }

    flushing = true;

    while (mailbox.length > 0) {
      var event_1 = mailbox.shift();
      state = behavior.transition(state, event_1, actorCtx);
      observers.forEach(function (observer) {
        return observer.next(state);
      });
    }

    flushing = false;
  };

  var actor = (0,_Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef)({
    id: options.id,
    send: function (event) {
      mailbox.push(event);
      flush();
    },
    getSnapshot: function () {
      return state;
    },
    subscribe: function (next, handleError, complete) {
      var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_2__.toObserver)(next, handleError, complete);
      observers.add(observer);
      observer.next(state);
      return {
        unsubscribe: function () {
          observers.delete(observer);
        }
      };
    }
  });
  var actorCtx = {
    parent: options.parent,
    self: actor,
    id: options.id || 'anonymous',
    observers: observers
  };
  state = behavior.start ? behavior.start(actorCtx) : state;
  return actor;
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/constants.js":
/*!***************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/constants.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_GUARD_TYPE: () => (/* binding */ DEFAULT_GUARD_TYPE),
/* harmony export */   EMPTY_ACTIVITY_MAP: () => (/* binding */ EMPTY_ACTIVITY_MAP),
/* harmony export */   STATE_DELIMITER: () => (/* binding */ STATE_DELIMITER),
/* harmony export */   TARGETLESS_KEY: () => (/* binding */ TARGETLESS_KEY)
/* harmony export */ });
var STATE_DELIMITER = '.';
var EMPTY_ACTIVITY_MAP = {};
var DEFAULT_GUARD_TYPE = 'xstate.guard';
var TARGETLESS_KEY = '';




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/devTools.js":
/*!**************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/devTools.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getGlobal: () => (/* binding */ getGlobal),
/* harmony export */   registerService: () => (/* binding */ registerService)
/* harmony export */ });
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");


function getGlobal() {
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }

  if (!_environment_js__WEBPACK_IMPORTED_MODULE_0__.IS_PRODUCTION) {
    console.warn('XState could not find a global object in this environment. Please let the maintainers know and raise an issue here: https://github.com/statelyai/xstate/issues');
  }
}

function getDevTools() {
  var global = getGlobal();

  if (global && '__xstate__' in global) {
    return global.__xstate__;
  }

  return undefined;
}

function registerService(service) {
  if (!getGlobal()) {
    return;
  }

  var devTools = getDevTools();

  if (devTools) {
    devTools.register(service);
  }
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/environment.js":
/*!*****************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/environment.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   IS_PRODUCTION: () => (/* binding */ IS_PRODUCTION)
/* harmony export */ });
var IS_PRODUCTION = "development" === 'production';




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/index.js":
/*!***********************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/index.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.ActionTypes),
/* harmony export */   Interpreter: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.Interpreter),
/* harmony export */   InterpreterStatus: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.InterpreterStatus),
/* harmony export */   Machine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.Machine),
/* harmony export */   SpecialTargets: () => (/* reexport safe */ _types_js__WEBPACK_IMPORTED_MODULE_10__.SpecialTargets),
/* harmony export */   State: () => (/* reexport safe */ _State_js__WEBPACK_IMPORTED_MODULE_7__.State),
/* harmony export */   StateNode: () => (/* reexport safe */ _StateNode_js__WEBPACK_IMPORTED_MODULE_8__.StateNode),
/* harmony export */   actions: () => (/* reexport module object */ _actions_js__WEBPACK_IMPORTED_MODULE_0__),
/* harmony export */   assign: () => (/* binding */ assign),
/* harmony export */   cancel: () => (/* binding */ cancel),
/* harmony export */   choose: () => (/* binding */ choose),
/* harmony export */   createMachine: () => (/* reexport safe */ _Machine_js__WEBPACK_IMPORTED_MODULE_3__.createMachine),
/* harmony export */   createSchema: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.createSchema),
/* harmony export */   doneInvoke: () => (/* binding */ doneInvoke),
/* harmony export */   forwardTo: () => (/* binding */ forwardTo),
/* harmony export */   interpret: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.interpret),
/* harmony export */   log: () => (/* binding */ log),
/* harmony export */   mapState: () => (/* reexport safe */ _mapState_js__WEBPACK_IMPORTED_MODULE_4__.mapState),
/* harmony export */   matchState: () => (/* reexport safe */ _match_js__WEBPACK_IMPORTED_MODULE_5__.matchState),
/* harmony export */   matchesState: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.matchesState),
/* harmony export */   pure: () => (/* binding */ pure),
/* harmony export */   raise: () => (/* binding */ raise),
/* harmony export */   send: () => (/* binding */ send),
/* harmony export */   sendParent: () => (/* binding */ sendParent),
/* harmony export */   sendTo: () => (/* binding */ sendTo),
/* harmony export */   sendUpdate: () => (/* binding */ sendUpdate),
/* harmony export */   spawn: () => (/* reexport safe */ _interpreter_js__WEBPACK_IMPORTED_MODULE_2__.spawn),
/* harmony export */   spawnBehavior: () => (/* reexport safe */ _behaviors_js__WEBPACK_IMPORTED_MODULE_9__.spawnBehavior),
/* harmony export */   stop: () => (/* binding */ stop),
/* harmony export */   t: () => (/* reexport safe */ _schema_js__WEBPACK_IMPORTED_MODULE_6__.t),
/* harmony export */   toActorRef: () => (/* reexport safe */ _Actor_js__WEBPACK_IMPORTED_MODULE_1__.toActorRef),
/* harmony export */   toEventObject: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toEventObject),
/* harmony export */   toObserver: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toObserver),
/* harmony export */   toSCXMLEvent: () => (/* reexport safe */ _utils_js__WEBPACK_IMPORTED_MODULE_11__.toSCXMLEvent)
/* harmony export */ });
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./actions.js */ "../log-view-machine/node_modules/xstate/es/actions.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Actor.js */ "../log-view-machine/node_modules/xstate/es/Actor.js");
/* harmony import */ var _interpreter_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./interpreter.js */ "../log-view-machine/node_modules/xstate/es/interpreter.js");
/* harmony import */ var _Machine_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./Machine.js */ "../log-view-machine/node_modules/xstate/es/Machine.js");
/* harmony import */ var _mapState_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./mapState.js */ "../log-view-machine/node_modules/xstate/es/mapState.js");
/* harmony import */ var _match_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./match.js */ "../log-view-machine/node_modules/xstate/es/match.js");
/* harmony import */ var _schema_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./schema.js */ "../log-view-machine/node_modules/xstate/es/schema.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./State.js */ "../log-view-machine/node_modules/xstate/es/State.js");
/* harmony import */ var _StateNode_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./StateNode.js */ "../log-view-machine/node_modules/xstate/es/StateNode.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./behaviors.js */ "../log-view-machine/node_modules/xstate/es/behaviors.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./types.js */ "../log-view-machine/node_modules/xstate/es/types.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");















var assign = _actions_js__WEBPACK_IMPORTED_MODULE_0__.assign,
    cancel = _actions_js__WEBPACK_IMPORTED_MODULE_0__.cancel,
    send = _actions_js__WEBPACK_IMPORTED_MODULE_0__.send,
    sendTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendTo,
    sendParent = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendParent,
    sendUpdate = _actions_js__WEBPACK_IMPORTED_MODULE_0__.sendUpdate,
    forwardTo = _actions_js__WEBPACK_IMPORTED_MODULE_0__.forwardTo,
    doneInvoke = _actions_js__WEBPACK_IMPORTED_MODULE_0__.doneInvoke,
    raise = _actions_js__WEBPACK_IMPORTED_MODULE_0__.raise,
    log = _actions_js__WEBPACK_IMPORTED_MODULE_0__.log,
    pure = _actions_js__WEBPACK_IMPORTED_MODULE_0__.pure,
    choose = _actions_js__WEBPACK_IMPORTED_MODULE_0__.choose,
    stop = _actions_js__WEBPACK_IMPORTED_MODULE_0__.stop;




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/interpreter.js":
/*!*****************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/interpreter.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Interpreter: () => (/* binding */ Interpreter),
/* harmony export */   InterpreterStatus: () => (/* binding */ InterpreterStatus),
/* harmony export */   interpret: () => (/* binding */ interpret),
/* harmony export */   spawn: () => (/* binding */ spawn)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "../log-view-machine/node_modules/xstate/es/types.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./State.js */ "../log-view-machine/node_modules/xstate/es/State.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./actionTypes.js */ "../log-view-machine/node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _actions_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./actions.js */ "../log-view-machine/node_modules/xstate/es/actions.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");
/* harmony import */ var _scheduler_js__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduler.js */ "../log-view-machine/node_modules/xstate/es/scheduler.js");
/* harmony import */ var _Actor_js__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./Actor.js */ "../log-view-machine/node_modules/xstate/es/Actor.js");
/* harmony import */ var _registry_js__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./registry.js */ "../log-view-machine/node_modules/xstate/es/registry.js");
/* harmony import */ var _devTools_js__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./devTools.js */ "../log-view-machine/node_modules/xstate/es/devTools.js");
/* harmony import */ var _serviceScope_js__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./serviceScope.js */ "../log-view-machine/node_modules/xstate/es/serviceScope.js");
/* harmony import */ var _behaviors_js__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./behaviors.js */ "../log-view-machine/node_modules/xstate/es/behaviors.js");














var DEFAULT_SPAWN_OPTIONS = {
  sync: false,
  autoForward: false
};
var InterpreterStatus;

(function (InterpreterStatus) {
  InterpreterStatus[InterpreterStatus["NotStarted"] = 0] = "NotStarted";
  InterpreterStatus[InterpreterStatus["Running"] = 1] = "Running";
  InterpreterStatus[InterpreterStatus["Stopped"] = 2] = "Stopped";
})(InterpreterStatus || (InterpreterStatus = {}));

var Interpreter =
/*#__PURE__*/

/** @class */
function () {
  /**
   * Creates a new Interpreter instance (i.e., service) for the given machine with the provided options, if any.
   *
   * @param machine The machine to be interpreted
   * @param options Interpreter options
   */
  function Interpreter(machine, options) {
    if (options === void 0) {
      options = Interpreter.defaultOptions;
    }

    var _this = this;

    this.machine = machine;
    this.delayedEventsMap = {};
    this.listeners = new Set();
    this.contextListeners = new Set();
    this.stopListeners = new Set();
    this.doneListeners = new Set();
    this.eventListeners = new Set();
    this.sendListeners = new Set();
    /**
     * Whether the service is started.
     */

    this.initialized = false;
    this.status = InterpreterStatus.NotStarted;
    this.children = new Map();
    this.forwardTo = new Set();
    this._outgoingQueue = [];
    /**
     * Alias for Interpreter.prototype.start
     */

    this.init = this.start;
    /**
     * Sends an event to the running interpreter to trigger a transition.
     *
     * An array of events (batched) can be sent as well, which will send all
     * batched events to the running interpreter. The listeners will be
     * notified only **once** when all events are processed.
     *
     * @param event The event(s) to send
     */

    this.send = function (event, payload) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isArray)(event)) {
        _this.batch(event);

        return _this.state;
      }

      var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toEventObject)(event, payload));

      if (_this.status === InterpreterStatus.Stopped) {
        // do nothing
        if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(false, "Event \"".concat(_event.name, "\" was sent to stopped service \"").concat(_this.machine.id, "\". This service has already reached its final state, and will not transition.\nEvent: ").concat(JSON.stringify(_event.data)));
        }

        return _this.state;
      }

      if (_this.status !== InterpreterStatus.Running && !_this.options.deferEvents) {
        throw new Error("Event \"".concat(_event.name, "\" was sent to uninitialized service \"").concat(_this.machine.id // tslint:disable-next-line:max-line-length
        , "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options.\nEvent: ").concat(JSON.stringify(_event.data)));
      }

      _this.scheduler.schedule(function () {
        // Forward copy of event to child actors
        _this.forward(_event);

        var nextState = _this._nextState(_event);

        _this.update(nextState, _event);
      });

      return _this._state; // TODO: deprecate (should return void)
      // tslint:disable-next-line:semicolon
    };

    this.sendTo = function (event, to, immediate) {
      var isParent = _this.parent && (to === _types_js__WEBPACK_IMPORTED_MODULE_1__.SpecialTargets.Parent || _this.parent.id === to);
      var target = isParent ? _this.parent : (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isString)(to) ? to === _types_js__WEBPACK_IMPORTED_MODULE_1__.SpecialTargets.Internal ? _this : _this.children.get(to) || _registry_js__WEBPACK_IMPORTED_MODULE_9__.registry.get(to) : (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isActor)(to) ? to : undefined;

      if (!target) {
        if (!isParent) {
          throw new Error("Unable to send event to child '".concat(to, "' from service '").concat(_this.id, "'."));
        } // tslint:disable-next-line:no-console


        if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(false, "Service '".concat(_this.id, "' has no parent: unable to send event ").concat(event.type));
        }

        return;
      }

      if ('machine' in target) {
        // perhaps those events should be rejected in the parent
        // but atm it doesn't have easy access to all of the information that is required to do it reliably
        if (_this.status !== InterpreterStatus.Stopped || _this.parent !== target || // we need to send events to the parent from exit handlers of a machine that reached its final state
        _this.state.done) {
          // Send SCXML events to machines
          var scxmlEvent = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, event), {
            name: event.name === _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.error ? "".concat((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.error)(_this.id)) : event.name,
            origin: _this.sessionId
          });

          if (!immediate && _this.machine.config.predictableActionArguments) {
            _this._outgoingQueue.push([target, scxmlEvent]);
          } else {
            target.send(scxmlEvent);
          }
        }
      } else {
        // Send normal events to other targets
        if (!immediate && _this.machine.config.predictableActionArguments) {
          _this._outgoingQueue.push([target, event.data]);
        } else {
          target.send(event.data);
        }
      }
    };

    this._exec = function (action, context, _event, actionFunctionMap) {
      if (actionFunctionMap === void 0) {
        actionFunctionMap = _this.machine.options.actions;
      }

      var actionOrExec = action.exec || (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.getActionFunction)(action.type, actionFunctionMap);
      var exec = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(actionOrExec) ? actionOrExec : actionOrExec ? actionOrExec.exec : action.exec;

      if (exec) {
        try {
          return exec(context, _event.data, !_this.machine.config.predictableActionArguments ? {
            action: action,
            state: _this.state,
            _event: _event
          } : {
            action: action,
            _event: _event
          });
        } catch (err) {
          if (_this.parent) {
            _this.parent.send({
              type: 'xstate.error',
              data: err
            });
          }

          throw err;
        }
      }

      switch (action.type) {
        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.raise:
          {
            // if raise action reached the interpreter then it's a delayed one
            var sendAction_1 = action;

            _this.defer(sendAction_1);

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.send:
          var sendAction = action;

          if (typeof sendAction.delay === 'number') {
            _this.defer(sendAction);

            return;
          } else {
            if (sendAction.to) {
              _this.sendTo(sendAction._event, sendAction.to, _event === _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent);
            } else {
              _this.send(sendAction._event);
            }
          }

          break;

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.cancel:
          _this.cancel(action.sendId);

          break;

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.start:
          {
            if (_this.status !== InterpreterStatus.Running) {
              return;
            }

            var activity = action.activity; // If the activity will be stopped right after it's started
            // (such as in transient states)
            // don't bother starting the activity.

            if ( // in v4 with `predictableActionArguments` invokes are called eagerly when the `this.state` still points to the previous state
            !_this.machine.config.predictableActionArguments && !_this.state.activities[activity.id || activity.type]) {
              break;
            } // Invoked services


            if (activity.type === _types_js__WEBPACK_IMPORTED_MODULE_1__.ActionTypes.Invoke) {
              var invokeSource = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toInvokeSource)(activity.src);
              var serviceCreator = _this.machine.options.services ? _this.machine.options.services[invokeSource.type] : undefined;
              var id = activity.id,
                  data = activity.data;

              if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
                (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(!('forward' in activity), // tslint:disable-next-line:max-line-length
                "`forward` property is deprecated (found in invocation of '".concat(activity.src, "' in in machine '").concat(_this.machine.id, "'). ") + "Please use `autoForward` instead.");
              }

              var autoForward = 'autoForward' in activity ? activity.autoForward : !!activity.forward;

              if (!serviceCreator) {
                // tslint:disable-next-line:no-console
                if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
                  (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(false, "No service found for invocation '".concat(activity.src, "' in machine '").concat(_this.machine.id, "'."));
                }

                return;
              }

              var resolvedData = data ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.mapContext)(data, context, _event) : undefined;

              if (typeof serviceCreator === 'string') {
                // TODO: warn
                return;
              }

              var source = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(serviceCreator) ? serviceCreator(context, _event.data, {
                data: resolvedData,
                src: invokeSource,
                meta: activity.meta
              }) : serviceCreator;

              if (!source) {
                // TODO: warn?
                return;
              }

              var options = void 0;

              if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isMachine)(source)) {
                source = resolvedData ? source.withContext(resolvedData) : source;
                options = {
                  autoForward: autoForward
                };
              }

              _this.spawn(source, id, options);
            } else {
              _this.spawnActivity(activity);
            }

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.stop:
          {
            _this.stopChild(action.activity.id);

            break;
          }

        case _actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.log:
          var _a = action,
              label = _a.label,
              value = _a.value;

          if (label) {
            _this.logger(label, value);
          } else {
            _this.logger(value);
          }

          break;

        default:
          if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
            (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(false, "No implementation found for action type '".concat(action.type, "'"));
          }

          break;
      }
    };

    var resolvedOptions = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, Interpreter.defaultOptions), options);

    var clock = resolvedOptions.clock,
        logger = resolvedOptions.logger,
        parent = resolvedOptions.parent,
        id = resolvedOptions.id;
    var resolvedId = id !== undefined ? id : machine.id;
    this.id = resolvedId;
    this.logger = logger;
    this.clock = clock;
    this.parent = parent;
    this.options = resolvedOptions;
    this.scheduler = new _scheduler_js__WEBPACK_IMPORTED_MODULE_7__.Scheduler({
      deferEvents: this.options.deferEvents
    });
    this.sessionId = _registry_js__WEBPACK_IMPORTED_MODULE_9__.registry.bookId();
  }

  Object.defineProperty(Interpreter.prototype, "initialState", {
    get: function () {
      var _this = this;

      if (this._initialState) {
        return this._initialState;
      }

      return (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_11__.provide)(this, function () {
        _this._initialState = _this.machine.initialState;
        return _this._initialState;
      });
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Interpreter.prototype, "state", {
    /**
     * @deprecated Use `.getSnapshot()` instead.
     */
    get: function () {
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(this.status !== InterpreterStatus.NotStarted, "Attempted to read state from uninitialized service '".concat(this.id, "'. Make sure the service is started first."));
      }

      return this._state;
    },
    enumerable: false,
    configurable: true
  });
  /**
   * Executes the actions of the given state, with that state's `context` and `event`.
   *
   * @param state The state whose actions will be executed
   * @param actionsConfig The action implementations to use
   */

  Interpreter.prototype.execute = function (state, actionsConfig) {
    var e_1, _a;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(state.actions), _c = _b.next(); !_c.done; _c = _b.next()) {
        var action = _c.value;
        this.exec(action, state, actionsConfig);
      }
    } catch (e_1_1) {
      e_1 = {
        error: e_1_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_1) throw e_1.error;
      }
    }
  };

  Interpreter.prototype.update = function (state, _event) {
    var e_2, _a, e_3, _b, e_4, _c, e_5, _d;

    var _this = this; // Attach session ID to state


    state._sessionid = this.sessionId; // Update state

    this._state = state; // Execute actions

    if ((!this.machine.config.predictableActionArguments || // this is currently required to execute initial actions as the `initialState` gets cached
    // we can't just recompute it (and execute actions while doing so) because we try to preserve identity of actors created within initial assigns
    _event === _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent) && this.options.execute) {
      this.execute(this.state);
    } else {
      var item = void 0;

      while (item = this._outgoingQueue.shift()) {
        item[0].send(item[1]);
      }
    } // Update children


    this.children.forEach(function (child) {
      _this.state.children[child.id] = child;
    }); // Dev tools

    if (this.devTools) {
      this.devTools.send(_event.data, state);
    } // Execute listeners


    if (state.event) {
      try {
        for (var _e = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.eventListeners), _f = _e.next(); !_f.done; _f = _e.next()) {
          var listener = _f.value;
          listener(state.event);
        }
      } catch (e_2_1) {
        e_2 = {
          error: e_2_1
        };
      } finally {
        try {
          if (_f && !_f.done && (_a = _e.return)) _a.call(_e);
        } finally {
          if (e_2) throw e_2.error;
        }
      }
    }

    try {
      for (var _g = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.listeners), _h = _g.next(); !_h.done; _h = _g.next()) {
        var listener = _h.value;
        listener(state, state.event);
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    try {
      for (var _j = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.contextListeners), _k = _j.next(); !_k.done; _k = _j.next()) {
        var contextListener = _k.value;
        contextListener(this.state.context, this.state.history ? this.state.history.context : undefined);
      }
    } catch (e_4_1) {
      e_4 = {
        error: e_4_1
      };
    } finally {
      try {
        if (_k && !_k.done && (_c = _j.return)) _c.call(_j);
      } finally {
        if (e_4) throw e_4.error;
      }
    }

    if (this.state.done) {
      // get final child state node
      var finalChildStateNode = state.configuration.find(function (sn) {
        return sn.type === 'final' && sn.parent === _this.machine;
      });
      var doneData = finalChildStateNode && finalChildStateNode.doneData ? (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.mapContext)(finalChildStateNode.doneData, state.context, _event) : undefined;
      this._doneEvent = (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.doneInvoke)(this.id, doneData);

      try {
        for (var _l = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.doneListeners), _m = _l.next(); !_m.done; _m = _l.next()) {
          var listener = _m.value;
          listener(this._doneEvent);
        }
      } catch (e_5_1) {
        e_5 = {
          error: e_5_1
        };
      } finally {
        try {
          if (_m && !_m.done && (_d = _l.return)) _d.call(_l);
        } finally {
          if (e_5) throw e_5.error;
        }
      }

      this._stop();

      this._stopChildren();

      _registry_js__WEBPACK_IMPORTED_MODULE_9__.registry.free(this.sessionId);
    }
  };
  /*
   * Adds a listener that is notified whenever a state transition happens. The listener is called with
   * the next state and the event object that caused the state transition.
   *
   * @param listener The state listener
   */


  Interpreter.prototype.onTransition = function (listener) {
    this.listeners.add(listener); // Send current state to listener

    if (this.status === InterpreterStatus.Running) {
      listener(this.state, this.state.event);
    }

    return this;
  };

  Interpreter.prototype.subscribe = function (nextListenerOrObserver, _, // TODO: error listener
  completeListener) {
    var _this = this;

    var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toObserver)(nextListenerOrObserver, _, completeListener);
    this.listeners.add(observer.next); // Send current state to listener

    if (this.status !== InterpreterStatus.NotStarted) {
      observer.next(this.state);
    }

    var completeOnce = function () {
      _this.doneListeners.delete(completeOnce);

      _this.stopListeners.delete(completeOnce);

      observer.complete();
    };

    if (this.status === InterpreterStatus.Stopped) {
      observer.complete();
    } else {
      this.onDone(completeOnce);
      this.onStop(completeOnce);
    }

    return {
      unsubscribe: function () {
        _this.listeners.delete(observer.next);

        _this.doneListeners.delete(completeOnce);

        _this.stopListeners.delete(completeOnce);
      }
    };
  };
  /**
   * Adds an event listener that is notified whenever an event is sent to the running interpreter.
   * @param listener The event listener
   */


  Interpreter.prototype.onEvent = function (listener) {
    this.eventListeners.add(listener);
    return this;
  };
  /**
   * Adds an event listener that is notified whenever a `send` event occurs.
   * @param listener The event listener
   */


  Interpreter.prototype.onSend = function (listener) {
    this.sendListeners.add(listener);
    return this;
  };
  /**
   * Adds a context listener that is notified whenever the state context changes.
   * @param listener The context listener
   */


  Interpreter.prototype.onChange = function (listener) {
    this.contextListeners.add(listener);
    return this;
  };
  /**
   * Adds a listener that is notified when the machine is stopped.
   * @param listener The listener
   */


  Interpreter.prototype.onStop = function (listener) {
    this.stopListeners.add(listener);
    return this;
  };
  /**
   * Adds a state listener that is notified when the statechart has reached its final state.
   * @param listener The state listener
   */


  Interpreter.prototype.onDone = function (listener) {
    if (this.status === InterpreterStatus.Stopped && this._doneEvent) {
      listener(this._doneEvent);
    } else {
      this.doneListeners.add(listener);
    }

    return this;
  };
  /**
   * Removes a listener.
   * @param listener The listener to remove
   */


  Interpreter.prototype.off = function (listener) {
    this.listeners.delete(listener);
    this.eventListeners.delete(listener);
    this.sendListeners.delete(listener);
    this.stopListeners.delete(listener);
    this.doneListeners.delete(listener);
    this.contextListeners.delete(listener);
    return this;
  };
  /**
   * Starts the interpreter from the given state, or the initial state.
   * @param initialState The state to start the statechart from
   */


  Interpreter.prototype.start = function (initialState) {
    var _this = this;

    if (this.status === InterpreterStatus.Running) {
      // Do not restart the service if it is already started
      return this;
    } // yes, it's a hack but we need the related cache to be populated for some things to work (like delayed transitions)
    // this is usually called by `machine.getInitialState` but if we rehydrate from a state we might bypass this call
    // we also don't want to call this method here as it resolves the full initial state which might involve calling assign actions
    // and that could potentially lead to some unwanted side-effects (even such as creating some rogue actors)


    this.machine._init();

    _registry_js__WEBPACK_IMPORTED_MODULE_9__.registry.register(this.sessionId, this);
    this.initialized = true;
    this.status = InterpreterStatus.Running;
    var resolvedState = initialState === undefined ? this.initialState : (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_11__.provide)(this, function () {
      return (0,_State_js__WEBPACK_IMPORTED_MODULE_2__.isStateConfig)(initialState) ? _this.machine.resolveState(initialState) : _this.machine.resolveState(_State_js__WEBPACK_IMPORTED_MODULE_2__.State.from(initialState, _this.machine.context));
    });

    if (this.options.devTools) {
      this.attachDev();
    }

    this.scheduler.initialize(function () {
      _this.update(resolvedState, _actions_js__WEBPACK_IMPORTED_MODULE_4__.initEvent);
    });
    return this;
  };

  Interpreter.prototype._stopChildren = function () {
    // TODO: think about converting those to actions
    this.children.forEach(function (child) {
      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(child.stop)) {
        child.stop();
      }
    });
    this.children.clear();
  };

  Interpreter.prototype._stop = function () {
    var e_6, _a, e_7, _b, e_8, _c, e_9, _d, e_10, _e;

    try {
      for (var _f = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.listeners), _g = _f.next(); !_g.done; _g = _f.next()) {
        var listener = _g.value;
        this.listeners.delete(listener);
      }
    } catch (e_6_1) {
      e_6 = {
        error: e_6_1
      };
    } finally {
      try {
        if (_g && !_g.done && (_a = _f.return)) _a.call(_f);
      } finally {
        if (e_6) throw e_6.error;
      }
    }

    try {
      for (var _h = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.stopListeners), _j = _h.next(); !_j.done; _j = _h.next()) {
        var listener = _j.value; // call listener, then remove

        listener();
        this.stopListeners.delete(listener);
      }
    } catch (e_7_1) {
      e_7 = {
        error: e_7_1
      };
    } finally {
      try {
        if (_j && !_j.done && (_b = _h.return)) _b.call(_h);
      } finally {
        if (e_7) throw e_7.error;
      }
    }

    try {
      for (var _k = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.contextListeners), _l = _k.next(); !_l.done; _l = _k.next()) {
        var listener = _l.value;
        this.contextListeners.delete(listener);
      }
    } catch (e_8_1) {
      e_8 = {
        error: e_8_1
      };
    } finally {
      try {
        if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
      } finally {
        if (e_8) throw e_8.error;
      }
    }

    try {
      for (var _m = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.doneListeners), _o = _m.next(); !_o.done; _o = _m.next()) {
        var listener = _o.value;
        this.doneListeners.delete(listener);
      }
    } catch (e_9_1) {
      e_9 = {
        error: e_9_1
      };
    } finally {
      try {
        if (_o && !_o.done && (_d = _m.return)) _d.call(_m);
      } finally {
        if (e_9) throw e_9.error;
      }
    }

    if (!this.initialized) {
      // Interpreter already stopped; do nothing
      return this;
    }

    this.initialized = false;
    this.status = InterpreterStatus.Stopped;
    this._initialState = undefined;

    try {
      // we are going to stop within the current sync frame
      // so we can safely just cancel this here as nothing async should be fired anyway
      for (var _p = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(this.delayedEventsMap)), _q = _p.next(); !_q.done; _q = _p.next()) {
        var key = _q.value;
        this.clock.clearTimeout(this.delayedEventsMap[key]);
      }
    } catch (e_10_1) {
      e_10 = {
        error: e_10_1
      };
    } finally {
      try {
        if (_q && !_q.done && (_e = _p.return)) _e.call(_p);
      } finally {
        if (e_10) throw e_10.error;
      }
    } // clear everything that might be enqueued


    this.scheduler.clear();
    this.scheduler = new _scheduler_js__WEBPACK_IMPORTED_MODULE_7__.Scheduler({
      deferEvents: this.options.deferEvents
    });
  };
  /**
   * Stops the interpreter and unsubscribe all listeners.
   *
   * This will also notify the `onStop` listeners.
   */


  Interpreter.prototype.stop = function () {
    // TODO: add warning for stopping non-root interpreters
    var _this = this; // grab the current scheduler as it will be replaced in _stop


    var scheduler = this.scheduler;

    this._stop(); // let what is currently processed to be finished


    scheduler.schedule(function () {
      var _a;

      if ((_a = _this._state) === null || _a === void 0 ? void 0 : _a.done) {
        return;
      } // it feels weird to handle this here but we need to handle this even slightly "out of band"


      var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)({
        type: 'xstate.stop'
      });

      var nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_11__.provide)(_this, function () {
        var exitActions = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(_this.state.configuration), false).sort(function (a, b) {
          return b.order - a.order;
        }).map(function (stateNode) {
          return (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.toActionObjects)(stateNode.onExit, _this.machine.options.actions);
        }));

        var _a = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.resolveActions)(_this.machine, _this.state, _this.state.context, _event, [{
          type: 'exit',
          actions: exitActions
        }], _this.machine.config.predictableActionArguments ? _this._exec : undefined, _this.machine.config.predictableActionArguments || _this.machine.config.preserveActionOrder), 2),
            resolvedActions = _a[0],
            updatedContext = _a[1];

        var newState = new _State_js__WEBPACK_IMPORTED_MODULE_2__.State({
          value: _this.state.value,
          context: updatedContext,
          _event: _event,
          _sessionid: _this.sessionId,
          historyValue: undefined,
          history: _this.state,
          actions: resolvedActions.filter(function (action) {
            return !(0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isRaisableAction)(action);
          }),
          activities: {},
          events: [],
          configuration: [],
          transitions: [],
          children: {},
          done: _this.state.done,
          tags: _this.state.tags,
          machine: _this.machine
        });
        newState.changed = true;
        return newState;
      });

      _this.update(nextState, _event);

      _this._stopChildren();

      _registry_js__WEBPACK_IMPORTED_MODULE_9__.registry.free(_this.sessionId);
    });
    return this;
  };

  Interpreter.prototype.batch = function (events) {
    var _this = this;

    if (this.status === InterpreterStatus.NotStarted && this.options.deferEvents) {
      // tslint:disable-next-line:no-console
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(false, "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\" and are deferred. Make sure .start() is called for this service.\nEvent: ").concat(JSON.stringify(event)));
      }
    } else if (this.status !== InterpreterStatus.Running) {
      throw new Error( // tslint:disable-next-line:max-line-length
      "".concat(events.length, " event(s) were sent to uninitialized service \"").concat(this.machine.id, "\". Make sure .start() is called for this service, or set { deferEvents: true } in the service options."));
    }

    if (!events.length) {
      return;
    }

    var exec = !!this.machine.config.predictableActionArguments && this._exec;
    this.scheduler.schedule(function () {
      var e_11, _a;

      var nextState = _this.state;
      var batchChanged = false;
      var batchedActions = [];

      var _loop_1 = function (event_1) {
        var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(event_1);

        _this.forward(_event);

        nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_11__.provide)(_this, function () {
          return _this.machine.transition(nextState, _event, undefined, exec || undefined);
        });
        batchedActions.push.apply(batchedActions, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(_this.machine.config.predictableActionArguments ? nextState.actions : nextState.actions.map(function (a) {
          return (0,_State_js__WEBPACK_IMPORTED_MODULE_2__.bindActionToState)(a, nextState);
        })), false));
        batchChanged = batchChanged || !!nextState.changed;
      };

      try {
        for (var events_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(events), events_1_1 = events_1.next(); !events_1_1.done; events_1_1 = events_1.next()) {
          var event_1 = events_1_1.value;

          _loop_1(event_1);
        }
      } catch (e_11_1) {
        e_11 = {
          error: e_11_1
        };
      } finally {
        try {
          if (events_1_1 && !events_1_1.done && (_a = events_1.return)) _a.call(events_1);
        } finally {
          if (e_11) throw e_11.error;
        }
      }

      nextState.changed = batchChanged;
      nextState.actions = batchedActions;

      _this.update(nextState, (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(events[events.length - 1]));
    });
  };
  /**
   * Returns a send function bound to this interpreter instance.
   *
   * @param event The event to be sent by the sender.
   */


  Interpreter.prototype.sender = function (event) {
    return this.send.bind(this, event);
  };

  Interpreter.prototype._nextState = function (event, exec) {
    var _this = this;

    if (exec === void 0) {
      exec = !!this.machine.config.predictableActionArguments && this._exec;
    }

    var _event = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(event);

    if (_event.name.indexOf(_actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.errorPlatform) === 0 && !this.state.nextEvents.some(function (nextEvent) {
      return nextEvent.indexOf(_actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.errorPlatform) === 0;
    })) {
      throw _event.data.data;
    }

    var nextState = (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_11__.provide)(this, function () {
      return _this.machine.transition(_this.state, _event, undefined, exec || undefined);
    });
    return nextState;
  };
  /**
   * Returns the next state given the interpreter's current state and the event.
   *
   * This is a pure method that does _not_ update the interpreter's state.
   *
   * @param event The event to determine the next state
   */


  Interpreter.prototype.nextState = function (event) {
    return this._nextState(event, false);
  };

  Interpreter.prototype.forward = function (event) {
    var e_12, _a;

    try {
      for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(this.forwardTo), _c = _b.next(); !_c.done; _c = _b.next()) {
        var id = _c.value;
        var child = this.children.get(id);

        if (!child) {
          throw new Error("Unable to forward event '".concat(event, "' from interpreter '").concat(this.id, "' to nonexistant child '").concat(id, "'."));
        }

        child.send(event);
      }
    } catch (e_12_1) {
      e_12 = {
        error: e_12_1
      };
    } finally {
      try {
        if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
      } finally {
        if (e_12) throw e_12.error;
      }
    }
  };

  Interpreter.prototype.defer = function (sendAction) {
    var _this = this;

    var timerId = this.clock.setTimeout(function () {
      if ('to' in sendAction && sendAction.to) {
        _this.sendTo(sendAction._event, sendAction.to, true);
      } else {
        _this.send(sendAction._event);
      }
    }, sendAction.delay);

    if (sendAction.id) {
      this.delayedEventsMap[sendAction.id] = timerId;
    }
  };

  Interpreter.prototype.cancel = function (sendId) {
    this.clock.clearTimeout(this.delayedEventsMap[sendId]);
    delete this.delayedEventsMap[sendId];
  };

  Interpreter.prototype.exec = function (action, state, actionFunctionMap) {
    if (actionFunctionMap === void 0) {
      actionFunctionMap = this.machine.options.actions;
    }

    this._exec(action, state.context, state._event, actionFunctionMap);
  };

  Interpreter.prototype.removeChild = function (childId) {
    var _a;

    this.children.delete(childId);
    this.forwardTo.delete(childId); // this.state might not exist at the time this is called,
    // such as when a child is added then removed while initializing the state

    (_a = this.state) === null || _a === void 0 ? true : delete _a.children[childId];
  };

  Interpreter.prototype.stopChild = function (childId) {
    var child = this.children.get(childId);

    if (!child) {
      return;
    }

    this.removeChild(childId);

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(child.stop)) {
      child.stop();
    }
  };

  Interpreter.prototype.spawn = function (entity, name, options) {
    if (this.status !== InterpreterStatus.Running) {
      return (0,_Actor_js__WEBPACK_IMPORTED_MODULE_8__.createDeferredActor)(entity, name);
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isPromiseLike)(entity)) {
      return this.spawnPromise(Promise.resolve(entity), name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(entity)) {
      return this.spawnCallback(entity, name);
    } else if ((0,_Actor_js__WEBPACK_IMPORTED_MODULE_8__.isSpawnedActor)(entity)) {
      return this.spawnActor(entity, name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isObservable)(entity)) {
      return this.spawnObservable(entity, name);
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isMachine)(entity)) {
      return this.spawnMachine(entity, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, options), {
        id: name
      }));
    } else if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isBehavior)(entity)) {
      return this.spawnBehavior(entity, name);
    } else {
      throw new Error("Unable to spawn entity \"".concat(name, "\" of type \"").concat(typeof entity, "\"."));
    }
  };

  Interpreter.prototype.spawnMachine = function (machine, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var childService = new Interpreter(machine, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, this.options), {
      parent: this,
      id: options.id || machine.id
    }));

    var resolvedOptions = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, DEFAULT_SPAWN_OPTIONS), options);

    if (resolvedOptions.sync) {
      childService.onTransition(function (state) {
        _this.send(_actionTypes_js__WEBPACK_IMPORTED_MODULE_3__.update, {
          state: state,
          id: childService.id
        });
      });
    }

    var actor = childService;
    this.children.set(childService.id, actor);

    if (resolvedOptions.autoForward) {
      this.forwardTo.add(childService.id);
    }

    childService.onDone(function (doneEvent) {
      _this.removeChild(childService.id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(doneEvent, {
        origin: childService.id
      }));
    }).start();
    return actor;
  };

  Interpreter.prototype.spawnBehavior = function (behavior, id) {
    var actorRef = (0,_behaviors_js__WEBPACK_IMPORTED_MODULE_12__.spawnBehavior)(behavior, {
      id: id,
      parent: this
    });
    this.children.set(id, actorRef);
    return actorRef;
  };

  Interpreter.prototype.spawnPromise = function (promise, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var resolvedData;
    promise.then(function (response) {
      if (!canceled) {
        resolvedData = response;

        _this.removeChild(id);

        _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.doneInvoke)(id, response), {
          origin: id
        }));
      }
    }, function (errorData) {
      if (!canceled) {
        _this.removeChild(id);

        var errorEvent = (0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.error)(id, errorData);

        try {
          // Send "error.platform.id" to this (parent).
          _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(errorEvent, {
            origin: id
          }));
        } catch (error) {
          (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.reportUnhandledExceptionOnInvocation)(errorData, error, id);

          if (_this.devTools) {
            _this.devTools.send(errorEvent, _this.state);
          }

          if (_this.machine.strict) {
            // it would be better to always stop the state machine if unhandled
            // exception/promise rejection happens but because we don't want to
            // break existing code so enforce it on strict mode only especially so
            // because documentation says that onError is optional
            _this.stop();
          }
        }
      }
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toObserver)(next, handleError, complete);
        var unsubscribed = false;
        promise.then(function (response) {
          if (unsubscribed) {
            return;
          }

          observer.next(response);

          if (unsubscribed) {
            return;
          }

          observer.complete();
        }, function (err) {
          if (unsubscribed) {
            return;
          }

          observer.error(err);
        });
        return {
          unsubscribe: function () {
            return unsubscribed = true;
          }
        };
      },
      stop: function () {
        canceled = true;
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return resolvedData;
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_6__.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnCallback = function (callback, id) {
    var _a;

    var _this = this;

    var canceled = false;
    var receivers = new Set();
    var listeners = new Set();
    var emitted;

    var receive = function (e) {
      emitted = e;
      listeners.forEach(function (listener) {
        return listener(e);
      });

      if (canceled) {
        return;
      }

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(e, {
        origin: id
      }));
    };

    var callbackStop;

    try {
      callbackStop = callback(receive, function (newListener) {
        receivers.add(newListener);
      });
    } catch (err) {
      this.send((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.error)(id, err));
    }

    if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isPromiseLike)(callbackStop)) {
      // it turned out to be an async function, can't reliably check this before calling `callback`
      // because transpiled async functions are not recognizable
      return this.spawnPromise(callbackStop, id);
    }

    var actor = (_a = {
      id: id,
      send: function (event) {
        return receivers.forEach(function (receiver) {
          return receiver(event);
        });
      },
      subscribe: function (next) {
        var observer = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toObserver)(next);
        listeners.add(observer.next);
        return {
          unsubscribe: function () {
            listeners.delete(observer.next);
          }
        };
      },
      stop: function () {
        canceled = true;

        if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(callbackStop)) {
          callbackStop();
        }
      },
      toJSON: function () {
        return {
          id: id
        };
      },
      getSnapshot: function () {
        return emitted;
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_6__.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnObservable = function (source, id) {
    var _a;

    var _this = this;

    var emitted;
    var subscription = source.subscribe(function (value) {
      emitted = value;

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)(value, {
        origin: id
      }));
    }, function (err) {
      _this.removeChild(id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.error)(id, err), {
        origin: id
      }));
    }, function () {
      _this.removeChild(id);

      _this.send((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.toSCXMLEvent)((0,_actions_js__WEBPACK_IMPORTED_MODULE_4__.doneInvoke)(id), {
        origin: id
      }));
    });
    var actor = (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function (next, handleError, complete) {
        return source.subscribe(next, handleError, complete);
      },
      stop: function () {
        return subscription.unsubscribe();
      },
      getSnapshot: function () {
        return emitted;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_6__.symbolObservable] = function () {
      return this;
    }, _a);
    this.children.set(id, actor);
    return actor;
  };

  Interpreter.prototype.spawnActor = function (actor, name) {
    this.children.set(name, actor);
    return actor;
  };

  Interpreter.prototype.spawnActivity = function (activity) {
    var implementation = this.machine.options && this.machine.options.activities ? this.machine.options.activities[activity.type] : undefined;

    if (!implementation) {
      if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
        (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(false, "No implementation found for activity '".concat(activity.type, "'"));
      } // tslint:disable-next-line:no-console


      return;
    } // Start implementation


    var dispose = implementation(this.state.context, activity);
    this.spawnEffect(activity.id, dispose);
  };

  Interpreter.prototype.spawnEffect = function (id, dispose) {
    var _a;

    this.children.set(id, (_a = {
      id: id,
      send: function () {
        return void 0;
      },
      subscribe: function () {
        return {
          unsubscribe: function () {
            return void 0;
          }
        };
      },
      stop: dispose || undefined,
      getSnapshot: function () {
        return undefined;
      },
      toJSON: function () {
        return {
          id: id
        };
      }
    }, _a[_utils_js__WEBPACK_IMPORTED_MODULE_6__.symbolObservable] = function () {
      return this;
    }, _a));
  };

  Interpreter.prototype.attachDev = function () {
    var global = (0,_devTools_js__WEBPACK_IMPORTED_MODULE_10__.getGlobal)();

    if (this.options.devTools && global) {
      if (global.__REDUX_DEVTOOLS_EXTENSION__) {
        var devToolsOptions = typeof this.options.devTools === 'object' ? this.options.devTools : undefined;
        this.devTools = global.__REDUX_DEVTOOLS_EXTENSION__.connect((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
          name: this.id,
          autoPause: true,
          stateSanitizer: function (state) {
            return {
              value: state.value,
              context: state.context,
              actions: state.actions
            };
          }
        }, devToolsOptions), {
          features: (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
            jump: false,
            skip: false
          }, devToolsOptions ? devToolsOptions.features : undefined)
        }), this.machine);
        this.devTools.init(this.state);
      } // add XState-specific dev tooling hook


      (0,_devTools_js__WEBPACK_IMPORTED_MODULE_10__.registerService)(this);
    }
  };

  Interpreter.prototype.toJSON = function () {
    return {
      id: this.id
    };
  };

  Interpreter.prototype[_utils_js__WEBPACK_IMPORTED_MODULE_6__.symbolObservable] = function () {
    return this;
  };

  Interpreter.prototype.getSnapshot = function () {
    if (this.status === InterpreterStatus.NotStarted) {
      return this.initialState;
    }

    return this._state;
  };
  /**
   * The default interpreter options:
   *
   * - `clock` uses the global `setTimeout` and `clearTimeout` functions
   * - `logger` uses the global `console.log()` method
   */


  Interpreter.defaultOptions = {
    execute: true,
    deferEvents: true,
    clock: {
      setTimeout: function (fn, ms) {
        return setTimeout(fn, ms);
      },
      clearTimeout: function (id) {
        return clearTimeout(id);
      }
    },
    logger: /*#__PURE__*/console.log.bind(console),
    devTools: false
  };
  Interpreter.interpret = interpret;
  return Interpreter;
}();

var resolveSpawnOptions = function (nameOrOptions) {
  if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isString)(nameOrOptions)) {
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
      name: nameOrOptions
    });
  }

  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, DEFAULT_SPAWN_OPTIONS), {
    name: (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.uniqueId)()
  }), nameOrOptions);
};

function spawn(entity, nameOrOptions) {
  var resolvedOptions = resolveSpawnOptions(nameOrOptions);
  return (0,_serviceScope_js__WEBPACK_IMPORTED_MODULE_11__.consume)(function (service) {
    if (!_environment_js__WEBPACK_IMPORTED_MODULE_5__.IS_PRODUCTION) {
      var isLazyEntity = (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isMachine)(entity) || (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isFunction)(entity);
      (0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.warn)(!!service || isLazyEntity, "Attempted to spawn an Actor (ID: \"".concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_6__.isMachine)(entity) ? entity.id : 'undefined', "\") outside of a service. This will have no effect."));
    }

    if (service) {
      return service.spawn(entity, resolvedOptions.name, resolvedOptions);
    } else {
      return (0,_Actor_js__WEBPACK_IMPORTED_MODULE_8__.createDeferredActor)(entity, resolvedOptions.name);
    }
  });
}
/**
 * Creates a new Interpreter instance for the given machine with the provided options, if any.
 *
 * @param machine The machine to interpret
 * @param options Interpreter options
 */

function interpret(machine, options) {
  var interpreter = new Interpreter(machine, options);
  return interpreter;
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/invokeUtils.js":
/*!*****************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/invokeUtils.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   toInvokeDefinition: () => (/* binding */ toInvokeDefinition),
/* harmony export */   toInvokeSource: () => (/* binding */ toInvokeSource)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./actionTypes.js */ "../log-view-machine/node_modules/xstate/es/actionTypes.js");






function toInvokeSource(src) {
  if (typeof src === 'string') {
    var simpleSrc = {
      type: src
    };

    simpleSrc.toString = function () {
      return src;
    }; // v4 compat - TODO: remove in v5


    return simpleSrc;
  }

  return src;
}
function toInvokeDefinition(invokeConfig) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
    type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__.invoke
  }, invokeConfig), {
    toJSON: function () {
      invokeConfig.onDone;
          invokeConfig.onError;
          var invokeDef = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__rest)(invokeConfig, ["onDone", "onError"]);

      return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, invokeDef), {
        type: _actionTypes_js__WEBPACK_IMPORTED_MODULE_1__.invoke,
        src: toInvokeSource(invokeConfig.src)
      });
    }
  });
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/mapState.js":
/*!**************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/mapState.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   mapState: () => (/* binding */ mapState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");



function mapState(stateMap, stateId) {
  var e_1, _a;

  var foundStateId;

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(stateMap)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var mappedStateId = _c.value;

      if ((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.matchesState)(mappedStateId, stateId) && (!foundStateId || stateId.length > foundStateId.length)) {
        foundStateId = mappedStateId;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return stateMap[foundStateId];
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/match.js":
/*!***********************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/match.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   matchState: () => (/* binding */ matchState)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _State_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./State.js */ "../log-view-machine/node_modules/xstate/es/State.js");



function matchState(state, patterns, defaultValue) {
  var e_1, _a;

  var resolvedState = _State_js__WEBPACK_IMPORTED_MODULE_1__.State.from(state, state instanceof _State_js__WEBPACK_IMPORTED_MODULE_1__.State ? state.context : undefined);

  try {
    for (var patterns_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(patterns), patterns_1_1 = patterns_1.next(); !patterns_1_1.done; patterns_1_1 = patterns_1.next()) {
      var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(patterns_1_1.value, 2),
          stateValue = _b[0],
          getValue = _b[1];

      if (resolvedState.matches(stateValue)) {
        return getValue(resolvedState);
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (patterns_1_1 && !patterns_1_1.done && (_a = patterns_1.return)) _a.call(patterns_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return defaultValue(resolvedState);
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/registry.js":
/*!**************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/registry.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   registry: () => (/* binding */ registry)
/* harmony export */ });
var children = /*#__PURE__*/new Map();
var sessionIdIndex = 0;
var registry = {
  bookId: function () {
    return "x:".concat(sessionIdIndex++);
  },
  register: function (id, actor) {
    children.set(id, actor);
    return id;
  },
  get: function (id) {
    return children.get(id);
  },
  free: function (id) {
    children.delete(id);
  }
};




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/scheduler.js":
/*!***************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/scheduler.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Scheduler: () => (/* binding */ Scheduler)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");


var defaultOptions = {
  deferEvents: false
};

var Scheduler =
/*#__PURE__*/

/** @class */
function () {
  function Scheduler(options) {
    this.processingEvent = false;
    this.queue = [];
    this.initialized = false;
    this.options = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, defaultOptions), options);
  }

  Scheduler.prototype.initialize = function (callback) {
    this.initialized = true;

    if (callback) {
      if (!this.options.deferEvents) {
        this.schedule(callback);
        return;
      }

      this.process(callback);
    }

    this.flushEvents();
  };

  Scheduler.prototype.schedule = function (task) {
    if (!this.initialized || this.processingEvent) {
      this.queue.push(task);
      return;
    }

    if (this.queue.length !== 0) {
      throw new Error('Event queue should be empty when it is not processing events');
    }

    this.process(task);
    this.flushEvents();
  };

  Scheduler.prototype.clear = function () {
    this.queue = [];
  };

  Scheduler.prototype.flushEvents = function () {
    var nextCallback = this.queue.shift();

    while (nextCallback) {
      this.process(nextCallback);
      nextCallback = this.queue.shift();
    }
  };

  Scheduler.prototype.process = function (callback) {
    this.processingEvent = true;

    try {
      callback();
    } catch (e) {
      // there is no use to keep the future events
      // as the situation is not anymore the same
      this.clear();
      throw e;
    } finally {
      this.processingEvent = false;
    }
  };

  return Scheduler;
}();




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/schema.js":
/*!************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/schema.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createSchema: () => (/* binding */ createSchema),
/* harmony export */   t: () => (/* binding */ t)
/* harmony export */ });
function createSchema(schema) {
  return schema;
}
var t = createSchema;




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/serviceScope.js":
/*!******************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/serviceScope.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   consume: () => (/* binding */ consume),
/* harmony export */   provide: () => (/* binding */ provide)
/* harmony export */ });
/**
 * Maintains a stack of the current service in scope.
 * This is used to provide the correct service to spawn().
 */
var serviceStack = [];
var provide = function (service, fn) {
  serviceStack.push(service);
  var result = fn(service);
  serviceStack.pop();
  return result;
};
var consume = function (fn) {
  return fn(serviceStack[serviceStack.length - 1]);
};




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/stateUtils.js":
/*!****************************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/stateUtils.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getAdjList: () => (/* binding */ getAdjList),
/* harmony export */   getAllChildren: () => (/* binding */ getAllChildren),
/* harmony export */   getAllStateNodes: () => (/* binding */ getAllStateNodes),
/* harmony export */   getChildren: () => (/* binding */ getChildren),
/* harmony export */   getConfiguration: () => (/* binding */ getConfiguration),
/* harmony export */   getMeta: () => (/* binding */ getMeta),
/* harmony export */   getTagsFromConfiguration: () => (/* binding */ getTagsFromConfiguration),
/* harmony export */   getValue: () => (/* binding */ getValue),
/* harmony export */   has: () => (/* binding */ has),
/* harmony export */   isInFinalState: () => (/* binding */ isInFinalState),
/* harmony export */   isLeafNode: () => (/* binding */ isLeafNode),
/* harmony export */   nextEvents: () => (/* binding */ nextEvents)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _utils_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./utils.js */ "../log-view-machine/node_modules/xstate/es/utils.js");



var isLeafNode = function (stateNode) {
  return stateNode.type === 'atomic' || stateNode.type === 'final';
};
function getAllChildren(stateNode) {
  return Object.keys(stateNode.states).map(function (key) {
    return stateNode.states[key];
  });
}
function getChildren(stateNode) {
  return getAllChildren(stateNode).filter(function (sn) {
    return sn.type !== 'history';
  });
}
function getAllStateNodes(stateNode) {
  var stateNodes = [stateNode];

  if (isLeafNode(stateNode)) {
    return stateNodes;
  }

  return stateNodes.concat((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(getChildren(stateNode).map(getAllStateNodes)));
}
function getConfiguration(prevStateNodes, stateNodes) {
  var e_1, _a, e_2, _b, e_3, _c, e_4, _d;

  var prevConfiguration = new Set(prevStateNodes);
  var prevAdjList = getAdjList(prevConfiguration);
  var configuration = new Set(stateNodes);

  try {
    // add all ancestors
    for (var configuration_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(configuration), configuration_1_1 = configuration_1.next(); !configuration_1_1.done; configuration_1_1 = configuration_1.next()) {
      var s = configuration_1_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (configuration_1_1 && !configuration_1_1.done && (_a = configuration_1.return)) _a.call(configuration_1);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  var adjList = getAdjList(configuration);

  try {
    // add descendants
    for (var configuration_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(configuration), configuration_2_1 = configuration_2.next(); !configuration_2_1.done; configuration_2_1 = configuration_2.next()) {
      var s = configuration_2_1.value; // if previously active, add existing child nodes

      if (s.type === 'compound' && (!adjList.get(s) || !adjList.get(s).length)) {
        if (prevAdjList.get(s)) {
          prevAdjList.get(s).forEach(function (sn) {
            return configuration.add(sn);
          });
        } else {
          s.initialStateNodes.forEach(function (sn) {
            return configuration.add(sn);
          });
        }
      } else {
        if (s.type === 'parallel') {
          try {
            for (var _e = (e_3 = void 0, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(getChildren(s))), _f = _e.next(); !_f.done; _f = _e.next()) {
              var child = _f.value;

              if (!configuration.has(child)) {
                configuration.add(child);

                if (prevAdjList.get(child)) {
                  prevAdjList.get(child).forEach(function (sn) {
                    return configuration.add(sn);
                  });
                } else {
                  child.initialStateNodes.forEach(function (sn) {
                    return configuration.add(sn);
                  });
                }
              }
            }
          } catch (e_3_1) {
            e_3 = {
              error: e_3_1
            };
          } finally {
            try {
              if (_f && !_f.done && (_c = _e.return)) _c.call(_e);
            } finally {
              if (e_3) throw e_3.error;
            }
          }
        }
      }
    }
  } catch (e_2_1) {
    e_2 = {
      error: e_2_1
    };
  } finally {
    try {
      if (configuration_2_1 && !configuration_2_1.done && (_b = configuration_2.return)) _b.call(configuration_2);
    } finally {
      if (e_2) throw e_2.error;
    }
  }

  try {
    // add all ancestors
    for (var configuration_3 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(configuration), configuration_3_1 = configuration_3.next(); !configuration_3_1.done; configuration_3_1 = configuration_3.next()) {
      var s = configuration_3_1.value;
      var m = s.parent;

      while (m && !configuration.has(m)) {
        configuration.add(m);
        m = m.parent;
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (configuration_3_1 && !configuration_3_1.done && (_d = configuration_3.return)) _d.call(configuration_3);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return configuration;
}

function getValueFromAdj(baseNode, adjList) {
  var childStateNodes = adjList.get(baseNode);

  if (!childStateNodes) {
    return {}; // todo: fix?
  }

  if (baseNode.type === 'compound') {
    var childStateNode = childStateNodes[0];

    if (childStateNode) {
      if (isLeafNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }

  var stateValue = {};
  childStateNodes.forEach(function (csn) {
    stateValue[csn.key] = getValueFromAdj(csn, adjList);
  });
  return stateValue;
}

function getAdjList(configuration) {
  var e_5, _a;

  var adjList = new Map();

  try {
    for (var configuration_4 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(configuration), configuration_4_1 = configuration_4.next(); !configuration_4_1.done; configuration_4_1 = configuration_4.next()) {
      var s = configuration_4_1.value;

      if (!adjList.has(s)) {
        adjList.set(s, []);
      }

      if (s.parent) {
        if (!adjList.has(s.parent)) {
          adjList.set(s.parent, []);
        }

        adjList.get(s.parent).push(s);
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (configuration_4_1 && !configuration_4_1.done && (_a = configuration_4.return)) _a.call(configuration_4);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return adjList;
}
function getValue(rootNode, configuration) {
  var config = getConfiguration([rootNode], configuration);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function has(iterable, item) {
  if (Array.isArray(iterable)) {
    return iterable.some(function (member) {
      return member === item;
    });
  }

  if (iterable instanceof Set) {
    return iterable.has(item);
  }

  return false; // TODO: fix
}
function nextEvents(configuration) {
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(configuration.map(function (sn) {
    return sn.ownEvents;
  })), false)))), false);
}
function isInFinalState(configuration, stateNode) {
  if (stateNode.type === 'compound') {
    return getChildren(stateNode).some(function (s) {
      return s.type === 'final' && has(configuration, s);
    });
  }

  if (stateNode.type === 'parallel') {
    return getChildren(stateNode).every(function (sn) {
      return isInFinalState(configuration, sn);
    });
  }

  return false;
}
function getMeta(configuration) {
  if (configuration === void 0) {
    configuration = [];
  }

  return configuration.reduce(function (acc, stateNode) {
    if (stateNode.meta !== undefined) {
      acc[stateNode.id] = stateNode.meta;
    }

    return acc;
  }, {});
}
function getTagsFromConfiguration(configuration) {
  return new Set((0,_utils_js__WEBPACK_IMPORTED_MODULE_1__.flatten)(configuration.map(function (sn) {
    return sn.tags;
  })));
}




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/types.js":
/*!***********************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/types.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ActionTypes: () => (/* binding */ ActionTypes),
/* harmony export */   SpecialTargets: () => (/* binding */ SpecialTargets)
/* harmony export */ });
var ActionTypes;

(function (ActionTypes) {
  ActionTypes["Start"] = "xstate.start";
  ActionTypes["Stop"] = "xstate.stop";
  ActionTypes["Raise"] = "xstate.raise";
  ActionTypes["Send"] = "xstate.send";
  ActionTypes["Cancel"] = "xstate.cancel";
  ActionTypes["NullEvent"] = "";
  ActionTypes["Assign"] = "xstate.assign";
  ActionTypes["After"] = "xstate.after";
  ActionTypes["DoneState"] = "done.state";
  ActionTypes["DoneInvoke"] = "done.invoke";
  ActionTypes["Log"] = "xstate.log";
  ActionTypes["Init"] = "xstate.init";
  ActionTypes["Invoke"] = "xstate.invoke";
  ActionTypes["ErrorExecution"] = "error.execution";
  ActionTypes["ErrorCommunication"] = "error.communication";
  ActionTypes["ErrorPlatform"] = "error.platform";
  ActionTypes["ErrorCustom"] = "xstate.error";
  ActionTypes["Update"] = "xstate.update";
  ActionTypes["Pure"] = "xstate.pure";
  ActionTypes["Choose"] = "xstate.choose";
})(ActionTypes || (ActionTypes = {}));

var SpecialTargets;

(function (SpecialTargets) {
  SpecialTargets["Parent"] = "#_parent";
  SpecialTargets["Internal"] = "#_internal";
})(SpecialTargets || (SpecialTargets = {}));




/***/ }),

/***/ "../log-view-machine/node_modules/xstate/es/utils.js":
/*!***********************************************************!*\
  !*** ../log-view-machine/node_modules/xstate/es/utils.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createInvokeId: () => (/* binding */ createInvokeId),
/* harmony export */   evaluateGuard: () => (/* binding */ evaluateGuard),
/* harmony export */   flatten: () => (/* binding */ flatten),
/* harmony export */   getActionType: () => (/* binding */ getActionType),
/* harmony export */   getEventType: () => (/* binding */ getEventType),
/* harmony export */   interopSymbols: () => (/* binding */ interopSymbols),
/* harmony export */   isActor: () => (/* binding */ isActor),
/* harmony export */   isArray: () => (/* binding */ isArray),
/* harmony export */   isBehavior: () => (/* binding */ isBehavior),
/* harmony export */   isBuiltInEvent: () => (/* binding */ isBuiltInEvent),
/* harmony export */   isFunction: () => (/* binding */ isFunction),
/* harmony export */   isMachine: () => (/* binding */ isMachine),
/* harmony export */   isObservable: () => (/* binding */ isObservable),
/* harmony export */   isPromiseLike: () => (/* binding */ isPromiseLike),
/* harmony export */   isRaisableAction: () => (/* binding */ isRaisableAction),
/* harmony export */   isStateLike: () => (/* binding */ isStateLike),
/* harmony export */   isString: () => (/* binding */ isString),
/* harmony export */   keys: () => (/* binding */ keys),
/* harmony export */   mapContext: () => (/* binding */ mapContext),
/* harmony export */   mapFilterValues: () => (/* binding */ mapFilterValues),
/* harmony export */   mapValues: () => (/* binding */ mapValues),
/* harmony export */   matchesState: () => (/* binding */ matchesState),
/* harmony export */   nestedPath: () => (/* binding */ nestedPath),
/* harmony export */   normalizeTarget: () => (/* binding */ normalizeTarget),
/* harmony export */   partition: () => (/* binding */ partition),
/* harmony export */   path: () => (/* binding */ path),
/* harmony export */   pathToStateValue: () => (/* binding */ pathToStateValue),
/* harmony export */   pathsToStateValue: () => (/* binding */ pathsToStateValue),
/* harmony export */   reportUnhandledExceptionOnInvocation: () => (/* binding */ reportUnhandledExceptionOnInvocation),
/* harmony export */   symbolObservable: () => (/* binding */ symbolObservable),
/* harmony export */   toArray: () => (/* binding */ toArray),
/* harmony export */   toArrayStrict: () => (/* binding */ toArrayStrict),
/* harmony export */   toEventObject: () => (/* binding */ toEventObject),
/* harmony export */   toGuard: () => (/* binding */ toGuard),
/* harmony export */   toInvokeSource: () => (/* binding */ toInvokeSource),
/* harmony export */   toObserver: () => (/* binding */ toObserver),
/* harmony export */   toSCXMLEvent: () => (/* binding */ toSCXMLEvent),
/* harmony export */   toStatePath: () => (/* binding */ toStatePath),
/* harmony export */   toStatePaths: () => (/* binding */ toStatePaths),
/* harmony export */   toStateValue: () => (/* binding */ toStateValue),
/* harmony export */   toTransitionConfigArray: () => (/* binding */ toTransitionConfigArray),
/* harmony export */   uniqueId: () => (/* binding */ uniqueId),
/* harmony export */   updateContext: () => (/* binding */ updateContext),
/* harmony export */   updateHistoryStates: () => (/* binding */ updateHistoryStates),
/* harmony export */   updateHistoryValue: () => (/* binding */ updateHistoryValue),
/* harmony export */   warn: () => (/* binding */ warn)
/* harmony export */ });
/* harmony import */ var _virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./_virtual/_tslib.js */ "../log-view-machine/node_modules/xstate/es/_virtual/_tslib.js");
/* harmony import */ var _types_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./types.js */ "../log-view-machine/node_modules/xstate/es/types.js");
/* harmony import */ var _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./actionTypes.js */ "../log-view-machine/node_modules/xstate/es/actionTypes.js");
/* harmony import */ var _constants_js__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./constants.js */ "../log-view-machine/node_modules/xstate/es/constants.js");
/* harmony import */ var _environment_js__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./environment.js */ "../log-view-machine/node_modules/xstate/es/environment.js");






var _a;
function keys(value) {
  return Object.keys(value);
}
function matchesState(parentStateId, childStateId, delimiter) {
  if (delimiter === void 0) {
    delimiter = _constants_js__WEBPACK_IMPORTED_MODULE_3__.STATE_DELIMITER;
  }

  var parentStateValue = toStateValue(parentStateId, delimiter);
  var childStateValue = toStateValue(childStateId, delimiter);

  if (isString(childStateValue)) {
    if (isString(parentStateValue)) {
      return childStateValue === parentStateValue;
    } // Parent more specific than child


    return false;
  }

  if (isString(parentStateValue)) {
    return parentStateValue in childStateValue;
  }

  return Object.keys(parentStateValue).every(function (key) {
    if (!(key in childStateValue)) {
      return false;
    }

    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function getEventType(event) {
  try {
    return isString(event) || typeof event === 'number' ? "".concat(event) : event.type;
  } catch (e) {
    throw new Error('Events must be strings or objects with a string event.type property.');
  }
}
function getActionType(action) {
  try {
    return isString(action) || typeof action === 'number' ? "".concat(action) : isFunction(action) ? action.name : action.type;
  } catch (e) {
    throw new Error('Actions must be strings or objects with a string action.type property.');
  }
}
function toStatePath(stateId, delimiter) {
  try {
    if (isArray(stateId)) {
      return stateId;
    }

    return stateId.toString().split(delimiter);
  } catch (e) {
    throw new Error("'".concat(stateId, "' is not a valid state path."));
  }
}
function isStateLike(state) {
  return typeof state === 'object' && 'value' in state && 'context' in state && 'event' in state && '_event' in state;
}
function toStateValue(stateValue, delimiter) {
  if (isStateLike(stateValue)) {
    return stateValue.value;
  }

  if (isArray(stateValue)) {
    return pathToStateValue(stateValue);
  }

  if (typeof stateValue !== 'string') {
    return stateValue;
  }

  var statePath = toStatePath(stateValue, delimiter);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }

  var value = {};
  var marker = value;

  for (var i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      marker[statePath[i]] = {};
      marker = marker[statePath[i]];
    }
  }

  return value;
}
function mapValues(collection, iteratee) {
  var result = {};
  var collectionKeys = Object.keys(collection);

  for (var i = 0; i < collectionKeys.length; i++) {
    var key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }

  return result;
}
function mapFilterValues(collection, iteratee, predicate) {
  var e_1, _a;

  var result = {};

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(collection)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var item = collection[key];

      if (!predicate(item)) {
        continue;
      }

      result[key] = iteratee(item, key, collection);
    }
  } catch (e_1_1) {
    e_1 = {
      error: e_1_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_1) throw e_1.error;
    }
  }

  return result;
}
/**
 * Retrieves a value at the given path.
 * @param props The deep path to the prop of the desired value
 */

var path = function (props) {
  return function (object) {
    var e_2, _a;

    var result = object;

    try {
      for (var props_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(props), props_1_1 = props_1.next(); !props_1_1.done; props_1_1 = props_1.next()) {
        var prop = props_1_1.value;
        result = result[prop];
      }
    } catch (e_2_1) {
      e_2 = {
        error: e_2_1
      };
    } finally {
      try {
        if (props_1_1 && !props_1_1.done && (_a = props_1.return)) _a.call(props_1);
      } finally {
        if (e_2) throw e_2.error;
      }
    }

    return result;
  };
};
/**
 * Retrieves a value at the given path via the nested accessor prop.
 * @param props The deep path to the prop of the desired value
 */

function nestedPath(props, accessorProp) {
  return function (object) {
    var e_3, _a;

    var result = object;

    try {
      for (var props_2 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(props), props_2_1 = props_2.next(); !props_2_1.done; props_2_1 = props_2.next()) {
        var prop = props_2_1.value;
        result = result[accessorProp][prop];
      }
    } catch (e_3_1) {
      e_3 = {
        error: e_3_1
      };
    } finally {
      try {
        if (props_2_1 && !props_2_1.done && (_a = props_2.return)) _a.call(props_2);
      } finally {
        if (e_3) throw e_3.error;
      }
    }

    return result;
  };
}
function toStatePaths(stateValue) {
  if (!stateValue) {
    return [[]];
  }

  if (isString(stateValue)) {
    return [[stateValue]];
  }

  var result = flatten(Object.keys(stateValue).map(function (key) {
    var subStateValue = stateValue[key];

    if (typeof subStateValue !== 'string' && (!subStateValue || !Object.keys(subStateValue).length)) {
      return [[key]];
    }

    return toStatePaths(stateValue[key]).map(function (subPath) {
      return [key].concat(subPath);
    });
  }));
  return result;
}
function pathsToStateValue(paths) {
  var e_4, _a;

  var result = {};

  if (paths && paths.length === 1 && paths[0].length === 1) {
    return paths[0][0];
  }

  try {
    for (var paths_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
      var currentPath = paths_1_1.value;
      var marker = result; // tslint:disable-next-line:prefer-for-of

      for (var i = 0; i < currentPath.length; i++) {
        var subPath = currentPath[i];

        if (i === currentPath.length - 2) {
          marker[subPath] = currentPath[i + 1];
          break;
        }

        marker[subPath] = marker[subPath] || {};
        marker = marker[subPath];
      }
    }
  } catch (e_4_1) {
    e_4 = {
      error: e_4_1
    };
  } finally {
    try {
      if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
    } finally {
      if (e_4) throw e_4.error;
    }
  }

  return result;
}
function flatten(array) {
  var _a;

  return (_a = []).concat.apply(_a, (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)(array), false));
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }

  return [value];
}
function toArray(value) {
  if (value === undefined) {
    return [];
  }

  return toArrayStrict(value);
}
function mapContext(mapper, context, _event) {
  var e_5, _a;

  if (isFunction(mapper)) {
    return mapper(context, _event.data);
  }

  var result = {};

  try {
    for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(mapper)), _c = _b.next(); !_c.done; _c = _b.next()) {
      var key = _c.value;
      var subMapper = mapper[key];

      if (isFunction(subMapper)) {
        result[key] = subMapper(context, _event.data);
      } else {
        result[key] = subMapper;
      }
    }
  } catch (e_5_1) {
    e_5 = {
      error: e_5_1
    };
  } finally {
    try {
      if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
    } finally {
      if (e_5) throw e_5.error;
    }
  }

  return result;
}
function isBuiltInEvent(eventType) {
  return /^(done|error)\./.test(eventType);
}
function isPromiseLike(value) {
  if (value instanceof Promise) {
    return true;
  } // Check if shape matches the Promise/A+ specification for a "thenable".


  if (value !== null && (isFunction(value) || typeof value === 'object') && isFunction(value.then)) {
    return true;
  }

  return false;
}
function isBehavior(value) {
  return value !== null && typeof value === 'object' && 'transition' in value && typeof value.transition === 'function';
}
function partition(items, predicate) {
  var e_6, _a;

  var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__read)([[], []], 2),
      truthy = _b[0],
      falsy = _b[1];

  try {
    for (var items_1 = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(items), items_1_1 = items_1.next(); !items_1_1.done; items_1_1 = items_1.next()) {
      var item = items_1_1.value;

      if (predicate(item)) {
        truthy.push(item);
      } else {
        falsy.push(item);
      }
    }
  } catch (e_6_1) {
    e_6 = {
      error: e_6_1
    };
  } finally {
    try {
      if (items_1_1 && !items_1_1.done && (_a = items_1.return)) _a.call(items_1);
    } finally {
      if (e_6) throw e_6.error;
    }
  }

  return [truthy, falsy];
}
function updateHistoryStates(hist, stateValue) {
  return mapValues(hist.states, function (subHist, key) {
    if (!subHist) {
      return undefined;
    }

    var subStateValue = (isString(stateValue) ? undefined : stateValue[key]) || (subHist ? subHist.current : undefined);

    if (!subStateValue) {
      return undefined;
    }

    return {
      current: subStateValue,
      states: updateHistoryStates(subHist, subStateValue)
    };
  });
}
function updateHistoryValue(hist, stateValue) {
  return {
    current: stateValue,
    states: updateHistoryStates(hist, stateValue)
  };
}
function updateContext(context, _event, assignActions, state) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION) {
    warn(!!context, 'Attempting to update undefined context');
  }

  var updatedContext = context ? assignActions.reduce(function (acc, assignAction) {
    var e_7, _a;

    var assignment = assignAction.assignment;
    var meta = {
      state: state,
      action: assignAction,
      _event: _event
    };
    var partialUpdate = {};

    if (isFunction(assignment)) {
      partialUpdate = assignment(acc, _event.data, meta);
    } else {
      try {
        for (var _b = (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__values)(Object.keys(assignment)), _c = _b.next(); !_c.done; _c = _b.next()) {
          var key = _c.value;
          var propAssignment = assignment[key];
          partialUpdate[key] = isFunction(propAssignment) ? propAssignment(acc, _event.data, meta) : propAssignment;
        }
      } catch (e_7_1) {
        e_7 = {
          error: e_7_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        } finally {
          if (e_7) throw e_7.error;
        }
      }
    }

    return Object.assign({}, acc, partialUpdate);
  }, context) : context;
  return updatedContext;
} // tslint:disable-next-line:no-empty

var warn = function () {};

if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION) {
  warn = function (condition, message) {
    var error = condition instanceof Error ? condition : undefined;

    if (!error && condition) {
      return;
    }

    if (console !== undefined) {
      var args = ["Warning: ".concat(message)];

      if (error) {
        args.push(error);
      } // tslint:disable-next-line:no-console


      console.warn.apply(console, args);
    }
  };
}
function isArray(value) {
  return Array.isArray(value);
} // tslint:disable-next-line:ban-types

function isFunction(value) {
  return typeof value === 'function';
}
function isString(value) {
  return typeof value === 'string';
}
function toGuard(condition, guardMap) {
  if (!condition) {
    return undefined;
  }

  if (isString(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_GUARD_TYPE,
      name: condition,
      predicate: guardMap ? guardMap[condition] : undefined
    };
  }

  if (isFunction(condition)) {
    return {
      type: _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_GUARD_TYPE,
      name: condition.name,
      predicate: condition
    };
  }

  return condition;
}
function isObservable(value) {
  try {
    return 'subscribe' in value && isFunction(value.subscribe);
  } catch (e) {
    return false;
  }
}
var symbolObservable = /*#__PURE__*/function () {
  return typeof Symbol === 'function' && Symbol.observable || '@@observable';
}(); // TODO: to be removed in v5, left it out just to minimize the scope of the change and maintain compatibility with older versions of integration paackages

var interopSymbols = (_a = {}, _a[symbolObservable] = function () {
  return this;
}, _a[Symbol.observable] = function () {
  return this;
}, _a);
function isMachine(value) {
  return !!value && '__xstatenode' in value;
}
function isActor(value) {
  return !!value && typeof value.send === 'function';
}
var uniqueId = /*#__PURE__*/function () {
  var currentId = 0;
  return function () {
    currentId++;
    return currentId.toString(16);
  };
}();
function toEventObject(event, payload // id?: TEvent['type']
) {
  if (isString(event) || typeof event === 'number') {
    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
      type: event
    }, payload);
  }

  return event;
}
function toSCXMLEvent(event, scxmlEvent) {
  if (!isString(event) && '$$type' in event && event.$$type === 'scxml') {
    return event;
  }

  var eventObject = toEventObject(event);
  return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({
    name: eventObject.type,
    data: eventObject,
    $$type: 'scxml',
    type: 'external'
  }, scxmlEvent);
}
function toTransitionConfigArray(event, configLike) {
  var transitions = toArrayStrict(configLike).map(function (transitionLike) {
    if (typeof transitionLike === 'undefined' || typeof transitionLike === 'string' || isMachine(transitionLike)) {
      return {
        target: transitionLike,
        event: event
      };
    }

    return (0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)((0,_virtual_tslib_js__WEBPACK_IMPORTED_MODULE_0__.__assign)({}, transitionLike), {
      event: event
    });
  });
  return transitions;
}
function normalizeTarget(target) {
  if (target === undefined || target === _constants_js__WEBPACK_IMPORTED_MODULE_3__.TARGETLESS_KEY) {
    return undefined;
  }

  return toArray(target);
}
function reportUnhandledExceptionOnInvocation(originalError, currentError, id) {
  if (!_environment_js__WEBPACK_IMPORTED_MODULE_4__.IS_PRODUCTION) {
    var originalStackTrace = originalError.stack ? " Stacktrace was '".concat(originalError.stack, "'") : '';

    if (originalError === currentError) {
      // tslint:disable-next-line:no-console
      console.error("Missing onError handler for invocation '".concat(id, "', error was '").concat(originalError, "'.").concat(originalStackTrace));
    } else {
      var stackTrace = currentError.stack ? " Stacktrace was '".concat(currentError.stack, "'") : ''; // tslint:disable-next-line:no-console

      console.error("Missing onError handler and/or unhandled exception/promise rejection for invocation '".concat(id, "'. ") + "Original error: '".concat(originalError, "'. ").concat(originalStackTrace, " Current error is '").concat(currentError, "'.").concat(stackTrace));
    }
  }
}
function evaluateGuard(machine, guard, context, _event, state) {
  var guards = machine.options.guards;
  var guardMeta = {
    state: state,
    cond: guard,
    _event: _event
  }; // TODO: do not hardcode!

  if (guard.type === _constants_js__WEBPACK_IMPORTED_MODULE_3__.DEFAULT_GUARD_TYPE) {
    return ((guards === null || guards === void 0 ? void 0 : guards[guard.name]) || guard.predicate)(context, _event.data, guardMeta);
  }

  var condFn = guards === null || guards === void 0 ? void 0 : guards[guard.type];

  if (!condFn) {
    throw new Error("Guard '".concat(guard.type, "' is not implemented on machine '").concat(machine.id, "'."));
  }

  return condFn(context, _event.data, guardMeta);
}
function toInvokeSource(src) {
  if (typeof src === 'string') {
    return {
      type: src
    };
  }

  return src;
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  var noop = function () {};

  var isObserver = typeof nextHandler === 'object';
  var self = isObserver ? nextHandler : null;
  return {
    next: ((isObserver ? nextHandler.next : nextHandler) || noop).bind(self),
    error: ((isObserver ? nextHandler.error : errorHandler) || noop).bind(self),
    complete: ((isObserver ? nextHandler.complete : completionHandler) || noop).bind(self)
  };
}
function createInvokeId(stateNodeId, index) {
  return "".concat(stateNodeId, ":invocation[").concat(index, "]");
}
function isRaisableAction(action) {
  return (action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.raise || action.type === _actionTypes_js__WEBPACK_IMPORTED_MODULE_2__.send && action.to === _types_js__WEBPACK_IMPORTED_MODULE_1__.SpecialTargets.Internal) && typeof action.delay !== 'number';
}




/***/ }),

/***/ "./node_modules/process/browser.js":
/*!*****************************************!*\
  !*** ./node_modules/process/browser.js ***!
  \*****************************************/
/***/ ((module) => {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),

/***/ "./node_modules/regenerator-runtime/runtime.js":
/*!*****************************************************!*\
  !*** ./node_modules/regenerator-runtime/runtime.js ***!
  \*****************************************************/
/***/ ((module) => {

/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var defineProperty = Object.defineProperty || function (obj, key, desc) { obj[key] = desc.value; };
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    defineProperty(generator, "_invoke", { value: makeInvokeMethod(innerFn, self, context) });

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  defineProperty(Gp, "constructor", { value: GeneratorFunctionPrototype, configurable: true });
  defineProperty(
    GeneratorFunctionPrototype,
    "constructor",
    { value: GeneratorFunction, configurable: true }
  );
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    defineProperty(this, "_invoke", { value: enqueue });
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var methodName = context.method;
    var method = delegate.iterator[methodName];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method, or a missing .next mehtod, always terminate the
      // yield* loop.
      context.delegate = null;

      // Note: ["return"] must be used for ES3 parsing compatibility.
      if (methodName === "throw" && delegate.iterator["return"]) {
        // If the delegate iterator has a return method, give it a
        // chance to clean up.
        context.method = "return";
        context.arg = undefined;
        maybeInvokeDelegate(delegate, context);

        if (context.method === "throw") {
          // If maybeInvokeDelegate(context) changed context.method from
          // "return" to "throw", let that override the TypeError below.
          return ContinueSentinel;
        }
      }
      if (methodName !== "return") {
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a '" + methodName + "' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(val) {
    var object = Object(val);
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   true ? module.exports : 0
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}


/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/NotificationFactories.js":
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/NotificationFactories.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   COMPLETE_NOTIFICATION: () => (/* binding */ COMPLETE_NOTIFICATION),
/* harmony export */   createNotification: () => (/* binding */ createNotification),
/* harmony export */   errorNotification: () => (/* binding */ errorNotification),
/* harmony export */   nextNotification: () => (/* binding */ nextNotification)
/* harmony export */ });
var COMPLETE_NOTIFICATION = (function () { return createNotification('C', undefined, undefined); })();
function errorNotification(error) {
    return createNotification('E', undefined, error);
}
function nextNotification(value) {
    return createNotification('N', value, undefined);
}
function createNotification(kind, value, error) {
    return {
        kind: kind,
        value: value,
        error: error,
    };
}
//# sourceMappingURL=NotificationFactories.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Observable.js":
/*!************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Observable.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   Observable: () => (/* binding */ Observable)
/* harmony export */ });
/* harmony import */ var _Subscriber__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Subscriber */ "./node_modules/rxjs/dist/esm5/internal/Subscriber.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _symbol_observable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./symbol/observable */ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js");
/* harmony import */ var _util_pipe__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/pipe */ "./node_modules/rxjs/dist/esm5/internal/util/pipe.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./config */ "./node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_errorContext__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./util/errorContext */ "./node_modules/rxjs/dist/esm5/internal/util/errorContext.js");







var Observable = (function () {
    function Observable(subscribe) {
        if (subscribe) {
            this._subscribe = subscribe;
        }
    }
    Observable.prototype.lift = function (operator) {
        var observable = new Observable();
        observable.source = this;
        observable.operator = operator;
        return observable;
    };
    Observable.prototype.subscribe = function (observerOrNext, error, complete) {
        var _this = this;
        var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new _Subscriber__WEBPACK_IMPORTED_MODULE_0__.SafeSubscriber(observerOrNext, error, complete);
        (0,_util_errorContext__WEBPACK_IMPORTED_MODULE_6__.errorContext)(function () {
            var _a = _this, operator = _a.operator, source = _a.source;
            subscriber.add(operator
                ?
                    operator.call(subscriber, source)
                : source
                    ?
                        _this._subscribe(subscriber)
                    :
                        _this._trySubscribe(subscriber));
        });
        return subscriber;
    };
    Observable.prototype._trySubscribe = function (sink) {
        try {
            return this._subscribe(sink);
        }
        catch (err) {
            sink.error(err);
        }
    };
    Observable.prototype.forEach = function (next, promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var subscriber = new _Subscriber__WEBPACK_IMPORTED_MODULE_0__.SafeSubscriber({
                next: function (value) {
                    try {
                        next(value);
                    }
                    catch (err) {
                        reject(err);
                        subscriber.unsubscribe();
                    }
                },
                error: reject,
                complete: resolve,
            });
            _this.subscribe(subscriber);
        });
    };
    Observable.prototype._subscribe = function (subscriber) {
        var _a;
        return (_a = this.source) === null || _a === void 0 ? void 0 : _a.subscribe(subscriber);
    };
    Observable.prototype[_symbol_observable__WEBPACK_IMPORTED_MODULE_2__.observable] = function () {
        return this;
    };
    Observable.prototype.pipe = function () {
        var operations = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            operations[_i] = arguments[_i];
        }
        return (0,_util_pipe__WEBPACK_IMPORTED_MODULE_3__.pipeFromArray)(operations)(this);
    };
    Observable.prototype.toPromise = function (promiseCtor) {
        var _this = this;
        promiseCtor = getPromiseCtor(promiseCtor);
        return new promiseCtor(function (resolve, reject) {
            var value;
            _this.subscribe(function (x) { return (value = x); }, function (err) { return reject(err); }, function () { return resolve(value); });
        });
    };
    Observable.create = function (subscribe) {
        return new Observable(subscribe);
    };
    return Observable;
}());

function getPromiseCtor(promiseCtor) {
    var _a;
    return (_a = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : _config__WEBPACK_IMPORTED_MODULE_4__.config.Promise) !== null && _a !== void 0 ? _a : Promise;
}
function isObserver(value) {
    return value && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_5__.isFunction)(value.next) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_5__.isFunction)(value.error) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_5__.isFunction)(value.complete);
}
function isSubscriber(value) {
    return (value && value instanceof _Subscriber__WEBPACK_IMPORTED_MODULE_0__.Subscriber) || (isObserver(value) && (0,_Subscription__WEBPACK_IMPORTED_MODULE_1__.isSubscription)(value));
}
//# sourceMappingURL=Observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Subscriber.js":
/*!************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Subscriber.js ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_OBSERVER: () => (/* binding */ EMPTY_OBSERVER),
/* harmony export */   SafeSubscriber: () => (/* binding */ SafeSubscriber),
/* harmony export */   Subscriber: () => (/* binding */ Subscriber)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _Subscription__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./Subscription */ "./node_modules/rxjs/dist/esm5/internal/Subscription.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./config */ "./node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./util/reportUnhandledError */ "./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js");
/* harmony import */ var _util_noop__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./util/noop */ "./node_modules/rxjs/dist/esm5/internal/util/noop.js");
/* harmony import */ var _NotificationFactories__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./NotificationFactories */ "./node_modules/rxjs/dist/esm5/internal/NotificationFactories.js");
/* harmony import */ var _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./scheduler/timeoutProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js");
/* harmony import */ var _util_errorContext__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./util/errorContext */ "./node_modules/rxjs/dist/esm5/internal/util/errorContext.js");









var Subscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(Subscriber, _super);
    function Subscriber(destination) {
        var _this = _super.call(this) || this;
        _this.isStopped = false;
        if (destination) {
            _this.destination = destination;
            if ((0,_Subscription__WEBPACK_IMPORTED_MODULE_2__.isSubscription)(destination)) {
                destination.add(_this);
            }
        }
        else {
            _this.destination = EMPTY_OBSERVER;
        }
        return _this;
    }
    Subscriber.create = function (next, error, complete) {
        return new SafeSubscriber(next, error, complete);
    };
    Subscriber.prototype.next = function (value) {
        if (this.isStopped) {
            handleStoppedNotification((0,_NotificationFactories__WEBPACK_IMPORTED_MODULE_6__.nextNotification)(value), this);
        }
        else {
            this._next(value);
        }
    };
    Subscriber.prototype.error = function (err) {
        if (this.isStopped) {
            handleStoppedNotification((0,_NotificationFactories__WEBPACK_IMPORTED_MODULE_6__.errorNotification)(err), this);
        }
        else {
            this.isStopped = true;
            this._error(err);
        }
    };
    Subscriber.prototype.complete = function () {
        if (this.isStopped) {
            handleStoppedNotification(_NotificationFactories__WEBPACK_IMPORTED_MODULE_6__.COMPLETE_NOTIFICATION, this);
        }
        else {
            this.isStopped = true;
            this._complete();
        }
    };
    Subscriber.prototype.unsubscribe = function () {
        if (!this.closed) {
            this.isStopped = true;
            _super.prototype.unsubscribe.call(this);
            this.destination = null;
        }
    };
    Subscriber.prototype._next = function (value) {
        this.destination.next(value);
    };
    Subscriber.prototype._error = function (err) {
        try {
            this.destination.error(err);
        }
        finally {
            this.unsubscribe();
        }
    };
    Subscriber.prototype._complete = function () {
        try {
            this.destination.complete();
        }
        finally {
            this.unsubscribe();
        }
    };
    return Subscriber;
}(_Subscription__WEBPACK_IMPORTED_MODULE_2__.Subscription));

var _bind = Function.prototype.bind;
function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
}
var ConsumerObserver = (function () {
    function ConsumerObserver(partialObserver) {
        this.partialObserver = partialObserver;
    }
    ConsumerObserver.prototype.next = function (value) {
        var partialObserver = this.partialObserver;
        if (partialObserver.next) {
            try {
                partialObserver.next(value);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    ConsumerObserver.prototype.error = function (err) {
        var partialObserver = this.partialObserver;
        if (partialObserver.error) {
            try {
                partialObserver.error(err);
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
        else {
            handleUnhandledError(err);
        }
    };
    ConsumerObserver.prototype.complete = function () {
        var partialObserver = this.partialObserver;
        if (partialObserver.complete) {
            try {
                partialObserver.complete();
            }
            catch (error) {
                handleUnhandledError(error);
            }
        }
    };
    return ConsumerObserver;
}());
var SafeSubscriber = (function (_super) {
    (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__extends)(SafeSubscriber, _super);
    function SafeSubscriber(observerOrNext, error, complete) {
        var _this = _super.call(this) || this;
        var partialObserver;
        if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(observerOrNext) || !observerOrNext) {
            partialObserver = {
                next: (observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : undefined),
                error: error !== null && error !== void 0 ? error : undefined,
                complete: complete !== null && complete !== void 0 ? complete : undefined,
            };
        }
        else {
            var context_1;
            if (_this && _config__WEBPACK_IMPORTED_MODULE_3__.config.useDeprecatedNextContext) {
                context_1 = Object.create(observerOrNext);
                context_1.unsubscribe = function () { return _this.unsubscribe(); };
                partialObserver = {
                    next: observerOrNext.next && bind(observerOrNext.next, context_1),
                    error: observerOrNext.error && bind(observerOrNext.error, context_1),
                    complete: observerOrNext.complete && bind(observerOrNext.complete, context_1),
                };
            }
            else {
                partialObserver = observerOrNext;
            }
        }
        _this.destination = new ConsumerObserver(partialObserver);
        return _this;
    }
    return SafeSubscriber;
}(Subscriber));

function handleUnhandledError(error) {
    if (_config__WEBPACK_IMPORTED_MODULE_3__.config.useDeprecatedSynchronousErrorHandling) {
        (0,_util_errorContext__WEBPACK_IMPORTED_MODULE_8__.captureError)(error);
    }
    else {
        (0,_util_reportUnhandledError__WEBPACK_IMPORTED_MODULE_4__.reportUnhandledError)(error);
    }
}
function defaultErrorHandler(err) {
    throw err;
}
function handleStoppedNotification(notification, subscriber) {
    var onStoppedNotification = _config__WEBPACK_IMPORTED_MODULE_3__.config.onStoppedNotification;
    onStoppedNotification && _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_7__.timeoutProvider.setTimeout(function () { return onStoppedNotification(notification, subscriber); });
}
var EMPTY_OBSERVER = {
    closed: true,
    next: _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop,
    error: defaultErrorHandler,
    complete: _util_noop__WEBPACK_IMPORTED_MODULE_5__.noop,
};
//# sourceMappingURL=Subscriber.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/Subscription.js":
/*!**************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/Subscription.js ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   EMPTY_SUBSCRIPTION: () => (/* binding */ EMPTY_SUBSCRIPTION),
/* harmony export */   Subscription: () => (/* binding */ Subscription),
/* harmony export */   isSubscription: () => (/* binding */ isSubscription)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");
/* harmony import */ var _util_isFunction__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./util/isFunction */ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js");
/* harmony import */ var _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./util/UnsubscriptionError */ "./node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js");
/* harmony import */ var _util_arrRemove__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./util/arrRemove */ "./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js");




var Subscription = (function () {
    function Subscription(initialTeardown) {
        this.initialTeardown = initialTeardown;
        this.closed = false;
        this._parentage = null;
        this._finalizers = null;
    }
    Subscription.prototype.unsubscribe = function () {
        var e_1, _a, e_2, _b;
        var errors;
        if (!this.closed) {
            this.closed = true;
            var _parentage = this._parentage;
            if (_parentage) {
                this._parentage = null;
                if (Array.isArray(_parentage)) {
                    try {
                        for (var _parentage_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                            var parent_1 = _parentage_1_1.value;
                            parent_1.remove(this);
                        }
                    }
                    catch (e_1_1) { e_1 = { error: e_1_1 }; }
                    finally {
                        try {
                            if (_parentage_1_1 && !_parentage_1_1.done && (_a = _parentage_1.return)) _a.call(_parentage_1);
                        }
                        finally { if (e_1) throw e_1.error; }
                    }
                }
                else {
                    _parentage.remove(this);
                }
            }
            var initialFinalizer = this.initialTeardown;
            if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(initialFinalizer)) {
                try {
                    initialFinalizer();
                }
                catch (e) {
                    errors = e instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError ? e.errors : [e];
                }
            }
            var _finalizers = this._finalizers;
            if (_finalizers) {
                this._finalizers = null;
                try {
                    for (var _finalizers_1 = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__values)(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
                        var finalizer = _finalizers_1_1.value;
                        try {
                            execFinalizer(finalizer);
                        }
                        catch (err) {
                            errors = errors !== null && errors !== void 0 ? errors : [];
                            if (err instanceof _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError) {
                                errors = (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)((0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(errors)), (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(err.errors));
                            }
                            else {
                                errors.push(err);
                            }
                        }
                    }
                }
                catch (e_2_1) { e_2 = { error: e_2_1 }; }
                finally {
                    try {
                        if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
                    }
                    finally { if (e_2) throw e_2.error; }
                }
            }
            if (errors) {
                throw new _util_UnsubscriptionError__WEBPACK_IMPORTED_MODULE_2__.UnsubscriptionError(errors);
            }
        }
    };
    Subscription.prototype.add = function (teardown) {
        var _a;
        if (teardown && teardown !== this) {
            if (this.closed) {
                execFinalizer(teardown);
            }
            else {
                if (teardown instanceof Subscription) {
                    if (teardown.closed || teardown._hasParent(this)) {
                        return;
                    }
                    teardown._addParent(this);
                }
                (this._finalizers = (_a = this._finalizers) !== null && _a !== void 0 ? _a : []).push(teardown);
            }
        }
    };
    Subscription.prototype._hasParent = function (parent) {
        var _parentage = this._parentage;
        return _parentage === parent || (Array.isArray(_parentage) && _parentage.includes(parent));
    };
    Subscription.prototype._addParent = function (parent) {
        var _parentage = this._parentage;
        this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription.prototype._removeParent = function (parent) {
        var _parentage = this._parentage;
        if (_parentage === parent) {
            this._parentage = null;
        }
        else if (Array.isArray(_parentage)) {
            (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(_parentage, parent);
        }
    };
    Subscription.prototype.remove = function (teardown) {
        var _finalizers = this._finalizers;
        _finalizers && (0,_util_arrRemove__WEBPACK_IMPORTED_MODULE_3__.arrRemove)(_finalizers, teardown);
        if (teardown instanceof Subscription) {
            teardown._removeParent(this);
        }
    };
    Subscription.EMPTY = (function () {
        var empty = new Subscription();
        empty.closed = true;
        return empty;
    })();
    return Subscription;
}());

var EMPTY_SUBSCRIPTION = Subscription.EMPTY;
function isSubscription(value) {
    return (value instanceof Subscription ||
        (value && 'closed' in value && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.remove) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.add) && (0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(value.unsubscribe)));
}
function execFinalizer(finalizer) {
    if ((0,_util_isFunction__WEBPACK_IMPORTED_MODULE_1__.isFunction)(finalizer)) {
        finalizer();
    }
    else {
        finalizer.unsubscribe();
    }
}
//# sourceMappingURL=Subscription.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/config.js":
/*!********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/config.js ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config)
/* harmony export */ });
var config = {
    onUnhandledError: null,
    onStoppedNotification: null,
    Promise: undefined,
    useDeprecatedSynchronousErrorHandling: false,
    useDeprecatedNextContext: false,
};
//# sourceMappingURL=config.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   timeoutProvider: () => (/* binding */ timeoutProvider)
/* harmony export */ });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "./node_modules/tslib/tslib.es6.mjs");

var timeoutProvider = {
    setTimeout: function (handler, timeout) {
        var args = [];
        for (var _i = 2; _i < arguments.length; _i++) {
            args[_i - 2] = arguments[_i];
        }
        var delegate = timeoutProvider.delegate;
        if (delegate === null || delegate === void 0 ? void 0 : delegate.setTimeout) {
            return delegate.setTimeout.apply(delegate, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([handler, timeout], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
        }
        return setTimeout.apply(void 0, (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__spreadArray)([handler, timeout], (0,tslib__WEBPACK_IMPORTED_MODULE_0__.__read)(args)));
    },
    clearTimeout: function (handle) {
        var delegate = timeoutProvider.delegate;
        return ((delegate === null || delegate === void 0 ? void 0 : delegate.clearTimeout) || clearTimeout)(handle);
    },
    delegate: undefined,
};
//# sourceMappingURL=timeoutProvider.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/symbol/observable.js":
/*!*******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/symbol/observable.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   observable: () => (/* binding */ observable)
/* harmony export */ });
var observable = (function () { return (typeof Symbol === 'function' && Symbol.observable) || '@@observable'; })();
//# sourceMappingURL=observable.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js":
/*!**************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/UnsubscriptionError.js ***!
  \**************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   UnsubscriptionError: () => (/* binding */ UnsubscriptionError)
/* harmony export */ });
/* harmony import */ var _createErrorClass__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./createErrorClass */ "./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js");

var UnsubscriptionError = (0,_createErrorClass__WEBPACK_IMPORTED_MODULE_0__.createErrorClass)(function (_super) {
    return function UnsubscriptionErrorImpl(errors) {
        _super(this);
        this.message = errors
            ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function (err, i) { return i + 1 + ") " + err.toString(); }).join('\n  ')
            : '';
        this.name = 'UnsubscriptionError';
        this.errors = errors;
    };
});
//# sourceMappingURL=UnsubscriptionError.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js":
/*!****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/arrRemove.js ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrRemove: () => (/* binding */ arrRemove)
/* harmony export */ });
function arrRemove(arr, item) {
    if (arr) {
        var index = arr.indexOf(item);
        0 <= index && arr.splice(index, 1);
    }
}
//# sourceMappingURL=arrRemove.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js":
/*!***********************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/createErrorClass.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createErrorClass: () => (/* binding */ createErrorClass)
/* harmony export */ });
function createErrorClass(createImpl) {
    var _super = function (instance) {
        Error.call(instance);
        instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
}
//# sourceMappingURL=createErrorClass.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/errorContext.js":
/*!*******************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/errorContext.js ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   captureError: () => (/* binding */ captureError),
/* harmony export */   errorContext: () => (/* binding */ errorContext)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./node_modules/rxjs/dist/esm5/internal/config.js");

var context = null;
function errorContext(cb) {
    if (_config__WEBPACK_IMPORTED_MODULE_0__.config.useDeprecatedSynchronousErrorHandling) {
        var isRoot = !context;
        if (isRoot) {
            context = { errorThrown: false, error: null };
        }
        cb();
        if (isRoot) {
            var _a = context, errorThrown = _a.errorThrown, error = _a.error;
            context = null;
            if (errorThrown) {
                throw error;
            }
        }
    }
    else {
        cb();
    }
}
function captureError(err) {
    if (_config__WEBPACK_IMPORTED_MODULE_0__.config.useDeprecatedSynchronousErrorHandling && context) {
        context.errorThrown = true;
        context.error = err;
    }
}
//# sourceMappingURL=errorContext.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/identity.js":
/*!***************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/identity.js ***!
  \***************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   identity: () => (/* binding */ identity)
/* harmony export */ });
function identity(x) {
    return x;
}
//# sourceMappingURL=identity.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/isFunction.js":
/*!*****************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/isFunction.js ***!
  \*****************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   isFunction: () => (/* binding */ isFunction)
/* harmony export */ });
function isFunction(value) {
    return typeof value === 'function';
}
//# sourceMappingURL=isFunction.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/noop.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/noop.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   noop: () => (/* binding */ noop)
/* harmony export */ });
function noop() { }
//# sourceMappingURL=noop.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/pipe.js":
/*!***********************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/pipe.js ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   pipe: () => (/* binding */ pipe),
/* harmony export */   pipeFromArray: () => (/* binding */ pipeFromArray)
/* harmony export */ });
/* harmony import */ var _identity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./identity */ "./node_modules/rxjs/dist/esm5/internal/util/identity.js");

function pipe() {
    var fns = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        fns[_i] = arguments[_i];
    }
    return pipeFromArray(fns);
}
function pipeFromArray(fns) {
    if (fns.length === 0) {
        return _identity__WEBPACK_IMPORTED_MODULE_0__.identity;
    }
    if (fns.length === 1) {
        return fns[0];
    }
    return function piped(input) {
        return fns.reduce(function (prev, fn) { return fn(prev); }, input);
    };
}
//# sourceMappingURL=pipe.js.map

/***/ }),

/***/ "./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js":
/*!***************************************************************************!*\
  !*** ./node_modules/rxjs/dist/esm5/internal/util/reportUnhandledError.js ***!
  \***************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   reportUnhandledError: () => (/* binding */ reportUnhandledError)
/* harmony export */ });
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config */ "./node_modules/rxjs/dist/esm5/internal/config.js");
/* harmony import */ var _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../scheduler/timeoutProvider */ "./node_modules/rxjs/dist/esm5/internal/scheduler/timeoutProvider.js");


function reportUnhandledError(err) {
    _scheduler_timeoutProvider__WEBPACK_IMPORTED_MODULE_1__.timeoutProvider.setTimeout(function () {
        var onUnhandledError = _config__WEBPACK_IMPORTED_MODULE_0__.config.onUnhandledError;
        if (onUnhandledError) {
            onUnhandledError(err);
        }
        else {
            throw err;
        }
    });
}
//# sourceMappingURL=reportUnhandledError.js.map

/***/ }),

/***/ "./node_modules/tinycolor2/esm/tinycolor.js":
/*!**************************************************!*\
  !*** ./node_modules/tinycolor2/esm/tinycolor.js ***!
  \**************************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ tinycolor)
/* harmony export */ });
// This file is autogenerated. It's used to publish ESM to npm.
function _typeof(obj) {
  "@babel/helpers - typeof";

  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  }, _typeof(obj);
}

// https://github.com/bgrins/TinyColor
// Brian Grinstead, MIT License

var trimLeft = /^\s+/;
var trimRight = /\s+$/;
function tinycolor(color, opts) {
  color = color ? color : "";
  opts = opts || {};

  // If input is already a tinycolor, return itself
  if (color instanceof tinycolor) {
    return color;
  }
  // If we are called as a function, call using new instead
  if (!(this instanceof tinycolor)) {
    return new tinycolor(color, opts);
  }
  var rgb = inputToRGB(color);
  this._originalInput = color, this._r = rgb.r, this._g = rgb.g, this._b = rgb.b, this._a = rgb.a, this._roundA = Math.round(100 * this._a) / 100, this._format = opts.format || rgb.format;
  this._gradientType = opts.gradientType;

  // Don't let the range of [0,255] come back in [0,1].
  // Potentially lose a little bit of precision here, but will fix issues where
  // .5 gets interpreted as half of the total, instead of half of 1
  // If it was supposed to be 128, this was already taken care of by `inputToRgb`
  if (this._r < 1) this._r = Math.round(this._r);
  if (this._g < 1) this._g = Math.round(this._g);
  if (this._b < 1) this._b = Math.round(this._b);
  this._ok = rgb.ok;
}
tinycolor.prototype = {
  isDark: function isDark() {
    return this.getBrightness() < 128;
  },
  isLight: function isLight() {
    return !this.isDark();
  },
  isValid: function isValid() {
    return this._ok;
  },
  getOriginalInput: function getOriginalInput() {
    return this._originalInput;
  },
  getFormat: function getFormat() {
    return this._format;
  },
  getAlpha: function getAlpha() {
    return this._a;
  },
  getBrightness: function getBrightness() {
    //http://www.w3.org/TR/AERT#color-contrast
    var rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  },
  getLuminance: function getLuminance() {
    //http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    var rgb = this.toRgb();
    var RsRGB, GsRGB, BsRGB, R, G, B;
    RsRGB = rgb.r / 255;
    GsRGB = rgb.g / 255;
    BsRGB = rgb.b / 255;
    if (RsRGB <= 0.03928) R = RsRGB / 12.92;else R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    if (GsRGB <= 0.03928) G = GsRGB / 12.92;else G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    if (BsRGB <= 0.03928) B = BsRGB / 12.92;else B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  },
  setAlpha: function setAlpha(value) {
    this._a = boundAlpha(value);
    this._roundA = Math.round(100 * this._a) / 100;
    return this;
  },
  toHsv: function toHsv() {
    var hsv = rgbToHsv(this._r, this._g, this._b);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v,
      a: this._a
    };
  },
  toHsvString: function toHsvString() {
    var hsv = rgbToHsv(this._r, this._g, this._b);
    var h = Math.round(hsv.h * 360),
      s = Math.round(hsv.s * 100),
      v = Math.round(hsv.v * 100);
    return this._a == 1 ? "hsv(" + h + ", " + s + "%, " + v + "%)" : "hsva(" + h + ", " + s + "%, " + v + "%, " + this._roundA + ")";
  },
  toHsl: function toHsl() {
    var hsl = rgbToHsl(this._r, this._g, this._b);
    return {
      h: hsl.h * 360,
      s: hsl.s,
      l: hsl.l,
      a: this._a
    };
  },
  toHslString: function toHslString() {
    var hsl = rgbToHsl(this._r, this._g, this._b);
    var h = Math.round(hsl.h * 360),
      s = Math.round(hsl.s * 100),
      l = Math.round(hsl.l * 100);
    return this._a == 1 ? "hsl(" + h + ", " + s + "%, " + l + "%)" : "hsla(" + h + ", " + s + "%, " + l + "%, " + this._roundA + ")";
  },
  toHex: function toHex(allow3Char) {
    return rgbToHex(this._r, this._g, this._b, allow3Char);
  },
  toHexString: function toHexString(allow3Char) {
    return "#" + this.toHex(allow3Char);
  },
  toHex8: function toHex8(allow4Char) {
    return rgbaToHex(this._r, this._g, this._b, this._a, allow4Char);
  },
  toHex8String: function toHex8String(allow4Char) {
    return "#" + this.toHex8(allow4Char);
  },
  toRgb: function toRgb() {
    return {
      r: Math.round(this._r),
      g: Math.round(this._g),
      b: Math.round(this._b),
      a: this._a
    };
  },
  toRgbString: function toRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ")" : "rgba(" + Math.round(this._r) + ", " + Math.round(this._g) + ", " + Math.round(this._b) + ", " + this._roundA + ")";
  },
  toPercentageRgb: function toPercentageRgb() {
    return {
      r: Math.round(bound01(this._r, 255) * 100) + "%",
      g: Math.round(bound01(this._g, 255) * 100) + "%",
      b: Math.round(bound01(this._b, 255) * 100) + "%",
      a: this._a
    };
  },
  toPercentageRgbString: function toPercentageRgbString() {
    return this._a == 1 ? "rgb(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%)" : "rgba(" + Math.round(bound01(this._r, 255) * 100) + "%, " + Math.round(bound01(this._g, 255) * 100) + "%, " + Math.round(bound01(this._b, 255) * 100) + "%, " + this._roundA + ")";
  },
  toName: function toName() {
    if (this._a === 0) {
      return "transparent";
    }
    if (this._a < 1) {
      return false;
    }
    return hexNames[rgbToHex(this._r, this._g, this._b, true)] || false;
  },
  toFilter: function toFilter(secondColor) {
    var hex8String = "#" + rgbaToArgbHex(this._r, this._g, this._b, this._a);
    var secondHex8String = hex8String;
    var gradientType = this._gradientType ? "GradientType = 1, " : "";
    if (secondColor) {
      var s = tinycolor(secondColor);
      secondHex8String = "#" + rgbaToArgbHex(s._r, s._g, s._b, s._a);
    }
    return "progid:DXImageTransform.Microsoft.gradient(" + gradientType + "startColorstr=" + hex8String + ",endColorstr=" + secondHex8String + ")";
  },
  toString: function toString(format) {
    var formatSet = !!format;
    format = format || this._format;
    var formattedString = false;
    var hasAlpha = this._a < 1 && this._a >= 0;
    var needsAlphaFormat = !formatSet && hasAlpha && (format === "hex" || format === "hex6" || format === "hex3" || format === "hex4" || format === "hex8" || format === "name");
    if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === "name" && this._a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === "rgb") {
      formattedString = this.toRgbString();
    }
    if (format === "prgb") {
      formattedString = this.toPercentageRgbString();
    }
    if (format === "hex" || format === "hex6") {
      formattedString = this.toHexString();
    }
    if (format === "hex3") {
      formattedString = this.toHexString(true);
    }
    if (format === "hex4") {
      formattedString = this.toHex8String(true);
    }
    if (format === "hex8") {
      formattedString = this.toHex8String();
    }
    if (format === "name") {
      formattedString = this.toName();
    }
    if (format === "hsl") {
      formattedString = this.toHslString();
    }
    if (format === "hsv") {
      formattedString = this.toHsvString();
    }
    return formattedString || this.toHexString();
  },
  clone: function clone() {
    return tinycolor(this.toString());
  },
  _applyModification: function _applyModification(fn, args) {
    var color = fn.apply(null, [this].concat([].slice.call(args)));
    this._r = color._r;
    this._g = color._g;
    this._b = color._b;
    this.setAlpha(color._a);
    return this;
  },
  lighten: function lighten() {
    return this._applyModification(_lighten, arguments);
  },
  brighten: function brighten() {
    return this._applyModification(_brighten, arguments);
  },
  darken: function darken() {
    return this._applyModification(_darken, arguments);
  },
  desaturate: function desaturate() {
    return this._applyModification(_desaturate, arguments);
  },
  saturate: function saturate() {
    return this._applyModification(_saturate, arguments);
  },
  greyscale: function greyscale() {
    return this._applyModification(_greyscale, arguments);
  },
  spin: function spin() {
    return this._applyModification(_spin, arguments);
  },
  _applyCombination: function _applyCombination(fn, args) {
    return fn.apply(null, [this].concat([].slice.call(args)));
  },
  analogous: function analogous() {
    return this._applyCombination(_analogous, arguments);
  },
  complement: function complement() {
    return this._applyCombination(_complement, arguments);
  },
  monochromatic: function monochromatic() {
    return this._applyCombination(_monochromatic, arguments);
  },
  splitcomplement: function splitcomplement() {
    return this._applyCombination(_splitcomplement, arguments);
  },
  // Disabled until https://github.com/bgrins/TinyColor/issues/254
  // polyad: function (number) {
  //   return this._applyCombination(polyad, [number]);
  // },
  triad: function triad() {
    return this._applyCombination(polyad, [3]);
  },
  tetrad: function tetrad() {
    return this._applyCombination(polyad, [4]);
  }
};

// If input is an object, force 1 into "1.0" to handle ratios properly
// String input requires "1.0" as input, so 1 will be treated as 1
tinycolor.fromRatio = function (color, opts) {
  if (_typeof(color) == "object") {
    var newColor = {};
    for (var i in color) {
      if (color.hasOwnProperty(i)) {
        if (i === "a") {
          newColor[i] = color[i];
        } else {
          newColor[i] = convertToPercentage(color[i]);
        }
      }
    }
    color = newColor;
  }
  return tinycolor(color, opts);
};

// Given a string or object, convert that input to RGB
// Possible string inputs:
//
//     "red"
//     "#f00" or "f00"
//     "#ff0000" or "ff0000"
//     "#ff000000" or "ff000000"
//     "rgb 255 0 0" or "rgb (255, 0, 0)"
//     "rgb 1.0 0 0" or "rgb (1, 0, 0)"
//     "rgba (255, 0, 0, 1)" or "rgba 255, 0, 0, 1"
//     "rgba (1.0, 0, 0, 1)" or "rgba 1.0, 0, 0, 1"
//     "hsl(0, 100%, 50%)" or "hsl 0 100% 50%"
//     "hsla(0, 100%, 50%, 1)" or "hsla 0 100% 50%, 1"
//     "hsv(0, 100%, 100%)" or "hsv 0 100% 100%"
//
function inputToRGB(color) {
  var rgb = {
    r: 0,
    g: 0,
    b: 0
  };
  var a = 1;
  var s = null;
  var v = null;
  var l = null;
  var ok = false;
  var format = false;
  if (typeof color == "string") {
    color = stringInputToObject(color);
  }
  if (_typeof(color) == "object") {
    if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
      rgb = rgbToRgb(color.r, color.g, color.b);
      ok = true;
      format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
      s = convertToPercentage(color.s);
      v = convertToPercentage(color.v);
      rgb = hsvToRgb(color.h, s, v);
      ok = true;
      format = "hsv";
    } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
      s = convertToPercentage(color.s);
      l = convertToPercentage(color.l);
      rgb = hslToRgb(color.h, s, l);
      ok = true;
      format = "hsl";
    }
    if (color.hasOwnProperty("a")) {
      a = color.a;
    }
  }
  a = boundAlpha(a);
  return {
    ok: ok,
    format: color.format || format,
    r: Math.min(255, Math.max(rgb.r, 0)),
    g: Math.min(255, Math.max(rgb.g, 0)),
    b: Math.min(255, Math.max(rgb.b, 0)),
    a: a
  };
}

// Conversion Functions
// --------------------

// `rgbToHsl`, `rgbToHsv`, `hslToRgb`, `hsvToRgb` modified from:
// <http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript>

// `rgbToRgb`
// Handle bounds / percentage checking to conform to CSS color spec
// <http://www.w3.org/TR/css3-color/>
// *Assumes:* r, g, b in [0, 255] or [0, 1]
// *Returns:* { r, g, b } in [0, 255]
function rgbToRgb(r, g, b) {
  return {
    r: bound01(r, 255) * 255,
    g: bound01(g, 255) * 255,
    b: bound01(b, 255) * 255
  };
}

// `rgbToHsl`
// Converts an RGB color value to HSL.
// *Assumes:* r, g, and b are contained in [0, 255] or [0, 1]
// *Returns:* { h, s, l } in [0,1]
function rgbToHsl(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    var d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    l: l
  };
}

// `hslToRgb`
// Converts an HSL color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and l are contained [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hslToRgb(h, s, l) {
  var r, g, b;
  h = bound01(h, 360);
  s = bound01(s, 100);
  l = bound01(l, 100);
  function hue2rgb(p, q, t) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  }
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    var p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}

// `rgbToHsv`
// Converts an RGB color value to HSV
// *Assumes:* r, g, and b are contained in the set [0, 255] or [0, 1]
// *Returns:* { h, s, v } in [0,1]
function rgbToHsv(r, g, b) {
  r = bound01(r, 255);
  g = bound01(g, 255);
  b = bound01(b, 255);
  var max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  var h,
    s,
    v = max;
  var d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max == min) {
    h = 0; // achromatic
  } else {
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }
  return {
    h: h,
    s: s,
    v: v
  };
}

// `hsvToRgb`
// Converts an HSV color value to RGB.
// *Assumes:* h is contained in [0, 1] or [0, 360] and s and v are contained in [0, 1] or [0, 100]
// *Returns:* { r, g, b } in the set [0, 255]
function hsvToRgb(h, s, v) {
  h = bound01(h, 360) * 6;
  s = bound01(s, 100);
  v = bound01(v, 100);
  var i = Math.floor(h),
    f = h - i,
    p = v * (1 - s),
    q = v * (1 - f * s),
    t = v * (1 - (1 - f) * s),
    mod = i % 6,
    r = [v, q, p, p, t, v][mod],
    g = [t, v, v, q, p, p][mod],
    b = [p, p, t, v, v, q][mod];
  return {
    r: r * 255,
    g: g * 255,
    b: b * 255
  };
}

// `rgbToHex`
// Converts an RGB color to hex
// Assumes r, g, and b are contained in the set [0, 255]
// Returns a 3 or 6 character hex
function rgbToHex(r, g, b, allow3Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];

  // Return a 3 character hex if possible
  if (allow3Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0);
  }
  return hex.join("");
}

// `rgbaToHex`
// Converts an RGBA color plus alpha transparency to hex
// Assumes r, g, b are contained in the set [0, 255] and
// a in [0, 1]. Returns a 4 or 8 character rgba hex
function rgbaToHex(r, g, b, a, allow4Char) {
  var hex = [pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16)), pad2(convertDecimalToHex(a))];

  // Return a 4 character hex if possible
  if (allow4Char && hex[0].charAt(0) == hex[0].charAt(1) && hex[1].charAt(0) == hex[1].charAt(1) && hex[2].charAt(0) == hex[2].charAt(1) && hex[3].charAt(0) == hex[3].charAt(1)) {
    return hex[0].charAt(0) + hex[1].charAt(0) + hex[2].charAt(0) + hex[3].charAt(0);
  }
  return hex.join("");
}

// `rgbaToArgbHex`
// Converts an RGBA color to an ARGB Hex8 string
// Rarely used, but required for "toFilter()"
function rgbaToArgbHex(r, g, b, a) {
  var hex = [pad2(convertDecimalToHex(a)), pad2(Math.round(r).toString(16)), pad2(Math.round(g).toString(16)), pad2(Math.round(b).toString(16))];
  return hex.join("");
}

// `equals`
// Can be called with any tinycolor input
tinycolor.equals = function (color1, color2) {
  if (!color1 || !color2) return false;
  return tinycolor(color1).toRgbString() == tinycolor(color2).toRgbString();
};
tinycolor.random = function () {
  return tinycolor.fromRatio({
    r: Math.random(),
    g: Math.random(),
    b: Math.random()
  });
};

// Modification Functions
// ----------------------
// Thanks to less.js for some of the basics here
// <https://github.com/cloudhead/less.js/blob/master/lib/less/functions.js>

function _desaturate(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.s -= amount / 100;
  hsl.s = clamp01(hsl.s);
  return tinycolor(hsl);
}
function _saturate(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.s += amount / 100;
  hsl.s = clamp01(hsl.s);
  return tinycolor(hsl);
}
function _greyscale(color) {
  return tinycolor(color).desaturate(100);
}
function _lighten(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.l += amount / 100;
  hsl.l = clamp01(hsl.l);
  return tinycolor(hsl);
}
function _brighten(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var rgb = tinycolor(color).toRgb();
  rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
  rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
  rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
  return tinycolor(rgb);
}
function _darken(color, amount) {
  amount = amount === 0 ? 0 : amount || 10;
  var hsl = tinycolor(color).toHsl();
  hsl.l -= amount / 100;
  hsl.l = clamp01(hsl.l);
  return tinycolor(hsl);
}

// Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
// Values outside of this range will be wrapped into this range.
function _spin(color, amount) {
  var hsl = tinycolor(color).toHsl();
  var hue = (hsl.h + amount) % 360;
  hsl.h = hue < 0 ? 360 + hue : hue;
  return tinycolor(hsl);
}

// Combination Functions
// ---------------------
// Thanks to jQuery xColor for some of the ideas behind these
// <https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js>

function _complement(color) {
  var hsl = tinycolor(color).toHsl();
  hsl.h = (hsl.h + 180) % 360;
  return tinycolor(hsl);
}
function polyad(color, number) {
  if (isNaN(number) || number <= 0) {
    throw new Error("Argument to polyad must be a positive number");
  }
  var hsl = tinycolor(color).toHsl();
  var result = [tinycolor(color)];
  var step = 360 / number;
  for (var i = 1; i < number; i++) {
    result.push(tinycolor({
      h: (hsl.h + i * step) % 360,
      s: hsl.s,
      l: hsl.l
    }));
  }
  return result;
}
function _splitcomplement(color) {
  var hsl = tinycolor(color).toHsl();
  var h = hsl.h;
  return [tinycolor(color), tinycolor({
    h: (h + 72) % 360,
    s: hsl.s,
    l: hsl.l
  }), tinycolor({
    h: (h + 216) % 360,
    s: hsl.s,
    l: hsl.l
  })];
}
function _analogous(color, results, slices) {
  results = results || 6;
  slices = slices || 30;
  var hsl = tinycolor(color).toHsl();
  var part = 360 / slices;
  var ret = [tinycolor(color)];
  for (hsl.h = (hsl.h - (part * results >> 1) + 720) % 360; --results;) {
    hsl.h = (hsl.h + part) % 360;
    ret.push(tinycolor(hsl));
  }
  return ret;
}
function _monochromatic(color, results) {
  results = results || 6;
  var hsv = tinycolor(color).toHsv();
  var h = hsv.h,
    s = hsv.s,
    v = hsv.v;
  var ret = [];
  var modification = 1 / results;
  while (results--) {
    ret.push(tinycolor({
      h: h,
      s: s,
      v: v
    }));
    v = (v + modification) % 1;
  }
  return ret;
}

// Utility Functions
// ---------------------

tinycolor.mix = function (color1, color2, amount) {
  amount = amount === 0 ? 0 : amount || 50;
  var rgb1 = tinycolor(color1).toRgb();
  var rgb2 = tinycolor(color2).toRgb();
  var p = amount / 100;
  var rgba = {
    r: (rgb2.r - rgb1.r) * p + rgb1.r,
    g: (rgb2.g - rgb1.g) * p + rgb1.g,
    b: (rgb2.b - rgb1.b) * p + rgb1.b,
    a: (rgb2.a - rgb1.a) * p + rgb1.a
  };
  return tinycolor(rgba);
};

// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

// `contrast`
// Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
tinycolor.readability = function (color1, color2) {
  var c1 = tinycolor(color1);
  var c2 = tinycolor(color2);
  return (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) / (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05);
};

// `isReadable`
// Ensure that foreground and background color combinations meet WCAG2 guidelines.
// The third argument is an optional Object.
//      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
//      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
// If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.

// *Example*
//    tinycolor.isReadable("#000", "#111") => false
//    tinycolor.isReadable("#000", "#111",{level:"AA",size:"large"}) => false
tinycolor.isReadable = function (color1, color2, wcag2) {
  var readability = tinycolor.readability(color1, color2);
  var wcag2Parms, out;
  out = false;
  wcag2Parms = validateWCAG2Parms(wcag2);
  switch (wcag2Parms.level + wcag2Parms.size) {
    case "AAsmall":
    case "AAAlarge":
      out = readability >= 4.5;
      break;
    case "AAlarge":
      out = readability >= 3;
      break;
    case "AAAsmall":
      out = readability >= 7;
      break;
  }
  return out;
};

// `mostReadable`
// Given a base color and a list of possible foreground or background
// colors for that base, returns the most readable color.
// Optionally returns Black or White if the most readable color is unreadable.
// *Example*
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:false}).toHexString(); // "#112255"
//    tinycolor.mostReadable(tinycolor.mostReadable("#123", ["#124", "#125"],{includeFallbackColors:true}).toHexString();  // "#ffffff"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"large"}).toHexString(); // "#faf3f3"
//    tinycolor.mostReadable("#a8015a", ["#faf3f3"],{includeFallbackColors:true,level:"AAA",size:"small"}).toHexString(); // "#ffffff"
tinycolor.mostReadable = function (baseColor, colorList, args) {
  var bestColor = null;
  var bestScore = 0;
  var readability;
  var includeFallbackColors, level, size;
  args = args || {};
  includeFallbackColors = args.includeFallbackColors;
  level = args.level;
  size = args.size;
  for (var i = 0; i < colorList.length; i++) {
    readability = tinycolor.readability(baseColor, colorList[i]);
    if (readability > bestScore) {
      bestScore = readability;
      bestColor = tinycolor(colorList[i]);
    }
  }
  if (tinycolor.isReadable(baseColor, bestColor, {
    level: level,
    size: size
  }) || !includeFallbackColors) {
    return bestColor;
  } else {
    args.includeFallbackColors = false;
    return tinycolor.mostReadable(baseColor, ["#fff", "#000"], args);
  }
};

// Big List of Colors
// ------------------
// <https://www.w3.org/TR/css-color-4/#named-colors>
var names = tinycolor.names = {
  aliceblue: "f0f8ff",
  antiquewhite: "faebd7",
  aqua: "0ff",
  aquamarine: "7fffd4",
  azure: "f0ffff",
  beige: "f5f5dc",
  bisque: "ffe4c4",
  black: "000",
  blanchedalmond: "ffebcd",
  blue: "00f",
  blueviolet: "8a2be2",
  brown: "a52a2a",
  burlywood: "deb887",
  burntsienna: "ea7e5d",
  cadetblue: "5f9ea0",
  chartreuse: "7fff00",
  chocolate: "d2691e",
  coral: "ff7f50",
  cornflowerblue: "6495ed",
  cornsilk: "fff8dc",
  crimson: "dc143c",
  cyan: "0ff",
  darkblue: "00008b",
  darkcyan: "008b8b",
  darkgoldenrod: "b8860b",
  darkgray: "a9a9a9",
  darkgreen: "006400",
  darkgrey: "a9a9a9",
  darkkhaki: "bdb76b",
  darkmagenta: "8b008b",
  darkolivegreen: "556b2f",
  darkorange: "ff8c00",
  darkorchid: "9932cc",
  darkred: "8b0000",
  darksalmon: "e9967a",
  darkseagreen: "8fbc8f",
  darkslateblue: "483d8b",
  darkslategray: "2f4f4f",
  darkslategrey: "2f4f4f",
  darkturquoise: "00ced1",
  darkviolet: "9400d3",
  deeppink: "ff1493",
  deepskyblue: "00bfff",
  dimgray: "696969",
  dimgrey: "696969",
  dodgerblue: "1e90ff",
  firebrick: "b22222",
  floralwhite: "fffaf0",
  forestgreen: "228b22",
  fuchsia: "f0f",
  gainsboro: "dcdcdc",
  ghostwhite: "f8f8ff",
  gold: "ffd700",
  goldenrod: "daa520",
  gray: "808080",
  green: "008000",
  greenyellow: "adff2f",
  grey: "808080",
  honeydew: "f0fff0",
  hotpink: "ff69b4",
  indianred: "cd5c5c",
  indigo: "4b0082",
  ivory: "fffff0",
  khaki: "f0e68c",
  lavender: "e6e6fa",
  lavenderblush: "fff0f5",
  lawngreen: "7cfc00",
  lemonchiffon: "fffacd",
  lightblue: "add8e6",
  lightcoral: "f08080",
  lightcyan: "e0ffff",
  lightgoldenrodyellow: "fafad2",
  lightgray: "d3d3d3",
  lightgreen: "90ee90",
  lightgrey: "d3d3d3",
  lightpink: "ffb6c1",
  lightsalmon: "ffa07a",
  lightseagreen: "20b2aa",
  lightskyblue: "87cefa",
  lightslategray: "789",
  lightslategrey: "789",
  lightsteelblue: "b0c4de",
  lightyellow: "ffffe0",
  lime: "0f0",
  limegreen: "32cd32",
  linen: "faf0e6",
  magenta: "f0f",
  maroon: "800000",
  mediumaquamarine: "66cdaa",
  mediumblue: "0000cd",
  mediumorchid: "ba55d3",
  mediumpurple: "9370db",
  mediumseagreen: "3cb371",
  mediumslateblue: "7b68ee",
  mediumspringgreen: "00fa9a",
  mediumturquoise: "48d1cc",
  mediumvioletred: "c71585",
  midnightblue: "191970",
  mintcream: "f5fffa",
  mistyrose: "ffe4e1",
  moccasin: "ffe4b5",
  navajowhite: "ffdead",
  navy: "000080",
  oldlace: "fdf5e6",
  olive: "808000",
  olivedrab: "6b8e23",
  orange: "ffa500",
  orangered: "ff4500",
  orchid: "da70d6",
  palegoldenrod: "eee8aa",
  palegreen: "98fb98",
  paleturquoise: "afeeee",
  palevioletred: "db7093",
  papayawhip: "ffefd5",
  peachpuff: "ffdab9",
  peru: "cd853f",
  pink: "ffc0cb",
  plum: "dda0dd",
  powderblue: "b0e0e6",
  purple: "800080",
  rebeccapurple: "663399",
  red: "f00",
  rosybrown: "bc8f8f",
  royalblue: "4169e1",
  saddlebrown: "8b4513",
  salmon: "fa8072",
  sandybrown: "f4a460",
  seagreen: "2e8b57",
  seashell: "fff5ee",
  sienna: "a0522d",
  silver: "c0c0c0",
  skyblue: "87ceeb",
  slateblue: "6a5acd",
  slategray: "708090",
  slategrey: "708090",
  snow: "fffafa",
  springgreen: "00ff7f",
  steelblue: "4682b4",
  tan: "d2b48c",
  teal: "008080",
  thistle: "d8bfd8",
  tomato: "ff6347",
  turquoise: "40e0d0",
  violet: "ee82ee",
  wheat: "f5deb3",
  white: "fff",
  whitesmoke: "f5f5f5",
  yellow: "ff0",
  yellowgreen: "9acd32"
};

// Make it easy to access colors via `hexNames[hex]`
var hexNames = tinycolor.hexNames = flip(names);

// Utilities
// ---------

// `{ 'name1': 'val1' }` becomes `{ 'val1': 'name1' }`
function flip(o) {
  var flipped = {};
  for (var i in o) {
    if (o.hasOwnProperty(i)) {
      flipped[o[i]] = i;
    }
  }
  return flipped;
}

// Return a valid alpha value [0,1] with all invalid values being set to 1
function boundAlpha(a) {
  a = parseFloat(a);
  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }
  return a;
}

// Take input from [0, n] and return it as [0, 1]
function bound01(n, max) {
  if (isOnePointZero(n)) n = "100%";
  var processPercent = isPercentage(n);
  n = Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(n * max, 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  return n % max / parseFloat(max);
}

// Force a number between 0 and 1
function clamp01(val) {
  return Math.min(1, Math.max(0, val));
}

// Parse a base-16 hex value into a base-10 integer
function parseIntFromHex(val) {
  return parseInt(val, 16);
}

// Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
// <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
function isOnePointZero(n) {
  return typeof n == "string" && n.indexOf(".") != -1 && parseFloat(n) === 1;
}

// Check to see if string passed in is a percentage
function isPercentage(n) {
  return typeof n === "string" && n.indexOf("%") != -1;
}

// Force a hex value to have 2 characters
function pad2(c) {
  return c.length == 1 ? "0" + c : "" + c;
}

// Replace a decimal with it's percentage value
function convertToPercentage(n) {
  if (n <= 1) {
    n = n * 100 + "%";
  }
  return n;
}

// Converts a decimal to a hex value
function convertDecimalToHex(d) {
  return Math.round(parseFloat(d) * 255).toString(16);
}
// Converts a hex value to a decimal
function convertHexToDecimal(h) {
  return parseIntFromHex(h) / 255;
}
var matchers = function () {
  // <http://www.w3.org/TR/css3-values/#integers>
  var CSS_INTEGER = "[-\\+]?\\d+%?";

  // <http://www.w3.org/TR/css3-values/#number-value>
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";

  // Allow positive/negative integer/number.  Don't capture the either/or, just the entire outcome.
  var CSS_UNIT = "(?:" + CSS_NUMBER + ")|(?:" + CSS_INTEGER + ")";

  // Actual matching.
  // Parentheses and commas are optional, but not required.
  // Whitespace can take the place of commas or opening paren
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")[,|\\s]+(" + CSS_UNIT + ")\\s*\\)?";
  return {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
}();

// `isValidCSSUnit`
// Take in a single string / number and check to see if it looks like a CSS unit
// (see `matchers` above for definition).
function isValidCSSUnit(color) {
  return !!matchers.CSS_UNIT.exec(color);
}

// `stringInputToObject`
// Permissive string parsing.  Take in a number of formats, and output an object
// based on detected format.  Returns `{ r, g, b }` or `{ h, s, l }` or `{ h, s, v}`
function stringInputToObject(color) {
  color = color.replace(trimLeft, "").replace(trimRight, "").toLowerCase();
  var named = false;
  if (names[color]) {
    color = names[color];
    named = true;
  } else if (color == "transparent") {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0,
      format: "name"
    };
  }

  // Try to match string input using regular expressions.
  // Keep most of the number bounding out of this function - don't worry about [0,1] or [0,100] or [0,360]
  // Just return an object and let the conversion functions handle that.
  // This way the result will be the same whether the tinycolor is initialized with string or object.
  var match;
  if (match = matchers.rgb.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3]
    };
  }
  if (match = matchers.rgba.exec(color)) {
    return {
      r: match[1],
      g: match[2],
      b: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hsl.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3]
    };
  }
  if (match = matchers.hsla.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      l: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hsv.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3]
    };
  }
  if (match = matchers.hsva.exec(color)) {
    return {
      h: match[1],
      s: match[2],
      v: match[3],
      a: match[4]
    };
  }
  if (match = matchers.hex8.exec(color)) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      a: convertHexToDecimal(match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers.hex6.exec(color)) {
    return {
      r: parseIntFromHex(match[1]),
      g: parseIntFromHex(match[2]),
      b: parseIntFromHex(match[3]),
      format: named ? "name" : "hex"
    };
  }
  if (match = matchers.hex4.exec(color)) {
    return {
      r: parseIntFromHex(match[1] + "" + match[1]),
      g: parseIntFromHex(match[2] + "" + match[2]),
      b: parseIntFromHex(match[3] + "" + match[3]),
      a: convertHexToDecimal(match[4] + "" + match[4]),
      format: named ? "name" : "hex8"
    };
  }
  if (match = matchers.hex3.exec(color)) {
    return {
      r: parseIntFromHex(match[1] + "" + match[1]),
      g: parseIntFromHex(match[2] + "" + match[2]),
      b: parseIntFromHex(match[3] + "" + match[3]),
      format: named ? "name" : "hex"
    };
  }
  return false;
}
function validateWCAG2Parms(parms) {
  // return valid WCAG2 parms for isReadable.
  // If input parms are invalid, return {"level":"AA", "size":"small"}
  var level, size;
  parms = parms || {
    level: "AA",
    size: "small"
  };
  level = (parms.level || "AA").toUpperCase();
  size = (parms.size || "small").toLowerCase();
  if (level !== "AA" && level !== "AAA") {
    level = "AA";
  }
  if (size !== "small" && size !== "large") {
    size = "small";
  }
  return {
    level: level,
    size: size
  };
}




/***/ }),

/***/ "./node_modules/tslib/tslib.es6.mjs":
/*!******************************************!*\
  !*** ./node_modules/tslib/tslib.es6.mjs ***!
  \******************************************/
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   __addDisposableResource: () => (/* binding */ __addDisposableResource),
/* harmony export */   __assign: () => (/* binding */ __assign),
/* harmony export */   __asyncDelegator: () => (/* binding */ __asyncDelegator),
/* harmony export */   __asyncGenerator: () => (/* binding */ __asyncGenerator),
/* harmony export */   __asyncValues: () => (/* binding */ __asyncValues),
/* harmony export */   __await: () => (/* binding */ __await),
/* harmony export */   __awaiter: () => (/* binding */ __awaiter),
/* harmony export */   __classPrivateFieldGet: () => (/* binding */ __classPrivateFieldGet),
/* harmony export */   __classPrivateFieldIn: () => (/* binding */ __classPrivateFieldIn),
/* harmony export */   __classPrivateFieldSet: () => (/* binding */ __classPrivateFieldSet),
/* harmony export */   __createBinding: () => (/* binding */ __createBinding),
/* harmony export */   __decorate: () => (/* binding */ __decorate),
/* harmony export */   __disposeResources: () => (/* binding */ __disposeResources),
/* harmony export */   __esDecorate: () => (/* binding */ __esDecorate),
/* harmony export */   __exportStar: () => (/* binding */ __exportStar),
/* harmony export */   __extends: () => (/* binding */ __extends),
/* harmony export */   __generator: () => (/* binding */ __generator),
/* harmony export */   __importDefault: () => (/* binding */ __importDefault),
/* harmony export */   __importStar: () => (/* binding */ __importStar),
/* harmony export */   __makeTemplateObject: () => (/* binding */ __makeTemplateObject),
/* harmony export */   __metadata: () => (/* binding */ __metadata),
/* harmony export */   __param: () => (/* binding */ __param),
/* harmony export */   __propKey: () => (/* binding */ __propKey),
/* harmony export */   __read: () => (/* binding */ __read),
/* harmony export */   __rest: () => (/* binding */ __rest),
/* harmony export */   __rewriteRelativeImportExtension: () => (/* binding */ __rewriteRelativeImportExtension),
/* harmony export */   __runInitializers: () => (/* binding */ __runInitializers),
/* harmony export */   __setFunctionName: () => (/* binding */ __setFunctionName),
/* harmony export */   __spread: () => (/* binding */ __spread),
/* harmony export */   __spreadArray: () => (/* binding */ __spreadArray),
/* harmony export */   __spreadArrays: () => (/* binding */ __spreadArrays),
/* harmony export */   __values: () => (/* binding */ __values),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol, Iterator */

var extendStatics = function(d, b) {
  extendStatics = Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
      function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
  return extendStatics(d, b);
};

function __extends(d, b) {
  if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
  extendStatics(d, b);
  function __() { this.constructor = d; }
  d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
}

var __assign = function() {
  __assign = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
      return t;
  }
  return __assign.apply(this, arguments);
}

function __rest(s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
      t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
          if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
              t[p[i]] = s[p[i]];
      }
  return t;
}

function __decorate(decorators, target, key, desc) {
  var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
  else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
}

function __param(paramIndex, decorator) {
  return function (target, key) { decorator(target, key, paramIndex); }
}

function __esDecorate(ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
  function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
  var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
  var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
  var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
  var _, done = false;
  for (var i = decorators.length - 1; i >= 0; i--) {
      var context = {};
      for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
      for (var p in contextIn.access) context.access[p] = contextIn.access[p];
      context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
      var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
      if (kind === "accessor") {
          if (result === void 0) continue;
          if (result === null || typeof result !== "object") throw new TypeError("Object expected");
          if (_ = accept(result.get)) descriptor.get = _;
          if (_ = accept(result.set)) descriptor.set = _;
          if (_ = accept(result.init)) initializers.unshift(_);
      }
      else if (_ = accept(result)) {
          if (kind === "field") initializers.unshift(_);
          else descriptor[key] = _;
      }
  }
  if (target) Object.defineProperty(target, contextIn.name, descriptor);
  done = true;
};

function __runInitializers(thisArg, initializers, value) {
  var useValue = arguments.length > 2;
  for (var i = 0; i < initializers.length; i++) {
      value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
  }
  return useValue ? value : void 0;
};

function __propKey(x) {
  return typeof x === "symbol" ? x : "".concat(x);
};

function __setFunctionName(f, name, prefix) {
  if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
  return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};

function __metadata(metadataKey, metadataValue) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
}

function __awaiter(thisArg, _arguments, P, generator) {
  function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
  return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
      function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
      function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
}

function __generator(thisArg, body) {
  var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
  return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
  function verb(n) { return function (v) { return step([n, v]); }; }
  function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
          if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
          if (y = 0, t) op = [op[0] & 2, t.value];
          switch (op[0]) {
              case 0: case 1: t = op; break;
              case 4: _.label++; return { value: op[1], done: false };
              case 5: _.label++; y = op[1]; op = [0]; continue;
              case 7: op = _.ops.pop(); _.trys.pop(); continue;
              default:
                  if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                  if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                  if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                  if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                  if (t[2]) _.ops.pop();
                  _.trys.pop(); continue;
          }
          op = body.call(thisArg, _);
      } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
      if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
  }
}

var __createBinding = Object.create ? (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  var desc = Object.getOwnPropertyDescriptor(m, k);
  if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
  }
  Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

function __exportStar(m, o) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p)) __createBinding(o, m, p);
}

function __values(o) {
  var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
  if (m) return m.call(o);
  if (o && typeof o.length === "number") return {
      next: function () {
          if (o && i >= o.length) o = void 0;
          return { value: o && o[i++], done: !o };
      }
  };
  throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}

function __read(o, n) {
  var m = typeof Symbol === "function" && o[Symbol.iterator];
  if (!m) return o;
  var i = m.call(o), r, ar = [], e;
  try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
  }
  catch (error) { e = { error: error }; }
  finally {
      try {
          if (r && !r.done && (m = i["return"])) m.call(i);
      }
      finally { if (e) throw e.error; }
  }
  return ar;
}

/** @deprecated */
function __spread() {
  for (var ar = [], i = 0; i < arguments.length; i++)
      ar = ar.concat(__read(arguments[i]));
  return ar;
}

/** @deprecated */
function __spreadArrays() {
  for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
  for (var r = Array(s), k = 0, i = 0; i < il; i++)
      for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
          r[k] = a[j];
  return r;
}

function __spreadArray(to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
      }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
}

function __await(v) {
  return this instanceof __await ? (this.v = v, this) : new __await(v);
}

function __asyncGenerator(thisArg, _arguments, generator) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var g = generator.apply(thisArg, _arguments || []), i, q = [];
  return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function () { return this; }, i;
  function awaitReturn(f) { return function (v) { return Promise.resolve(v).then(f, reject); }; }
  function verb(n, f) { if (g[n]) { i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; if (f) i[n] = f(i[n]); } }
  function resume(n, v) { try { step(g[n](v)); } catch (e) { settle(q[0][3], e); } }
  function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
  function fulfill(value) { resume("next", value); }
  function reject(value) { resume("throw", value); }
  function settle(f, v) { if (f(v), q.shift(), q.length) resume(q[0][0], q[0][1]); }
}

function __asyncDelegator(o) {
  var i, p;
  return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
  function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: false } : f ? f(v) : v; } : f; }
}

function __asyncValues(o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator], i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
  function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
  function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
}

function __makeTemplateObject(cooked, raw) {
  if (Object.defineProperty) { Object.defineProperty(cooked, "raw", { value: raw }); } else { cooked.raw = raw; }
  return cooked;
};

var __setModuleDefault = Object.create ? (function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
  o["default"] = v;
};

var ownKeys = function(o) {
  ownKeys = Object.getOwnPropertyNames || function (o) {
    var ar = [];
    for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
    return ar;
  };
  return ownKeys(o);
};

function __importStar(mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
  __setModuleDefault(result, mod);
  return result;
}

function __importDefault(mod) {
  return (mod && mod.__esModule) ? mod : { default: mod };
}

function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m") throw new TypeError("Private method is not writable");
  if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

function __classPrivateFieldIn(state, receiver) {
  if (receiver === null || (typeof receiver !== "object" && typeof receiver !== "function")) throw new TypeError("Cannot use 'in' operator on non-object");
  return typeof state === "function" ? receiver === state : state.has(receiver);
}

function __addDisposableResource(env, value, async) {
  if (value !== null && value !== void 0) {
    if (typeof value !== "object" && typeof value !== "function") throw new TypeError("Object expected.");
    var dispose, inner;
    if (async) {
      if (!Symbol.asyncDispose) throw new TypeError("Symbol.asyncDispose is not defined.");
      dispose = value[Symbol.asyncDispose];
    }
    if (dispose === void 0) {
      if (!Symbol.dispose) throw new TypeError("Symbol.dispose is not defined.");
      dispose = value[Symbol.dispose];
      if (async) inner = dispose;
    }
    if (typeof dispose !== "function") throw new TypeError("Object not disposable.");
    if (inner) dispose = function() { try { inner.call(this); } catch (e) { return Promise.reject(e); } };
    env.stack.push({ value: value, dispose: dispose, async: async });
  }
  else if (async) {
    env.stack.push({ async: true });
  }
  return value;
}

var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
  var e = new Error(message);
  return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

function __disposeResources(env) {
  function fail(e) {
    env.error = env.hasError ? new _SuppressedError(e, env.error, "An error was suppressed during disposal.") : e;
    env.hasError = true;
  }
  var r, s = 0;
  function next() {
    while (r = env.stack.pop()) {
      try {
        if (!r.async && s === 1) return s = 0, env.stack.push(r), Promise.resolve().then(next);
        if (r.dispose) {
          var result = r.dispose.call(r.value);
          if (r.async) return s |= 2, Promise.resolve(result).then(next, function(e) { fail(e); return next(); });
        }
        else s |= 1;
      }
      catch (e) {
        fail(e);
      }
    }
    if (s === 1) return env.hasError ? Promise.reject(env.error) : Promise.resolve();
    if (env.hasError) throw env.error;
  }
  return next();
}

function __rewriteRelativeImportExtension(path, preserveJsx) {
  if (typeof path === "string" && /^\.\.?\//.test(path)) {
      return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
          return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
      });
  }
  return path;
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ({
  __extends,
  __assign,
  __rest,
  __decorate,
  __param,
  __esDecorate,
  __runInitializers,
  __propKey,
  __setFunctionName,
  __metadata,
  __awaiter,
  __generator,
  __createBinding,
  __exportStar,
  __values,
  __read,
  __spread,
  __spreadArrays,
  __spreadArray,
  __await,
  __asyncGenerator,
  __asyncDelegator,
  __asyncValues,
  __makeTemplateObject,
  __importStar,
  __importDefault,
  __classPrivateFieldGet,
  __classPrivateFieldSet,
  __classPrivateFieldIn,
  __addDisposableResource,
  __disposeResources,
  __rewriteRelativeImportExtension,
});


/***/ }),

/***/ "./src/components/util/user-input.ts":
/*!*******************************************!*\
  !*** ./src/components/util/user-input.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   FollowKeyChordObserver: () => (/* binding */ FollowKeyChordObserver),
/* harmony export */   WindowKeyDownKey: () => (/* binding */ WindowKeyDownKey),
/* harmony export */   compareKeyChords: () => (/* binding */ compareKeyChords),
/* harmony export */   filterAndNormalizeKeyChord: () => (/* binding */ filterAndNormalizeKeyChord),
/* harmony export */   normalizeKey: () => (/* binding */ normalizeKey),
/* harmony export */   sortKeyChord: () => (/* binding */ sortKeyChord)
/* harmony export */ });
/* harmony import */ var rxjs__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! rxjs */ "./node_modules/rxjs/dist/esm5/internal/Observable.js");

/**
 * Check if the event target is within an input-selector field or is an editable element
 * @param event - The keyboard event to check
 * @returns true if target is an input-selector field or editable element
 */
function isInputSelectorField(event) {
    const target = event.target;
    if (!target)
        return false;
    // Check if target is an input or textarea element
    const tagName = target.tagName?.toLowerCase();
    if (tagName === 'input' || tagName === 'textarea') {
        return true;
    }
    // Check if target has contenteditable attribute
    if (target.hasAttribute?.('contenteditable') && target.getAttribute('contenteditable') !== 'false') {
        return true;
    }
    // Check for input-selector specific IDs
    if (target.id === 'selectorInput' || target.id === 'selector-text-input') {
        return true;
    }
    // Check for input-selector specific classes
    if (target.classList?.contains('selector-text-input')) {
        return true;
    }
    // Check if target is within an element with selector-input classes
    let current = target;
    while (current) {
        if (current.classList?.contains('selector-input-editing') ||
            current.classList?.contains('selector-input-section')) {
            return true;
        }
        current = current.parentElement;
    }
    return false;
}
/**
 * a keydown event listener returning an [Observable<string>] of [event.key]
 * @param listenerReturn probably YAGNI but a function to return the closure scoped event listener \
 *    so you can extract the listener from the listenerReturn lambda and call [window.removeEventListener()] \
 *    maybe just return a [Pair<>] idk
 * @param preventDefault calls event.preventDefault() optionally a key is detected, useful for scanning, bad for shortcuts
 */
const WindowKeyDownKey = (listenerReturn, preventDefault = true) => {
    return new rxjs__WEBPACK_IMPORTED_MODULE_0__.Observable((subscriber) => {
        const listener = (event) => {
            if (event.defaultPrevented) {
                return; // Should do nothing if the default action has been cancelled
            }
            if (event.key) {
                // Skip preventDefault if target is an input-selector field
                // This allows normal typing in input fields
                if (isInputSelectorField(event)) {
                    // Emit the key but don't prevent default - allow normal typing
                    subscriber.next(event.key);
                    return;
                }
                // Handle the event with KeyboardEvent.key
                subscriber.next(event.key);
                if (preventDefault)
                    event.preventDefault();
            }
        };
        listenerReturn(listener);
        window.addEventListener("keydown", listener, true);
    });
};
/**
 * Normalize a key name to a standard format
 * @param key - The key name from event.key
 * @returns Normalized key name or null if invalid
 */
function normalizeKey(key) {
    if (!key)
        return null;
    // Filter out invalid keys
    const invalidKeys = ['Dead', 'Unidentified'];
    if (invalidKeys.includes(key)) {
        return null;
    }
    // Normalize modifier keys
    const normalized = key.trim();
    // Map common variations to standard names
    const keyMap = {
        'Control': 'Ctrl',
        'Meta': 'Meta', // Keep Meta as is, but we'll filter it if it appears alone
        'Shift': 'Shift',
        'Alt': 'Alt',
        'AltGraph': 'Alt',
    };
    // Check if it's a known modifier key mapping
    const mapped = keyMap[normalized];
    if (mapped) {
        return mapped;
    }
    // Return the key as-is (capitalized first letter for consistency)
    return normalized.length > 0
        ? normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase()
        : normalized;
}
/**
 * Filter and normalize a keychord, removing invalid keys
 * @param keyChord - The keychord to filter and normalize
 * @returns Filtered and normalized keychord
 */
function filterAndNormalizeKeyChord(keyChord) {
    return keyChord
        .map(key => normalizeKey(key))
        .filter((key) => key !== null && key !== undefined);
}
/**
 * Sort and normalize a keychord for comparison
 * Modifier keys come first, then regular keys, both sorted alphabetically
 * @param keyChord - The keychord to sort
 * @returns Sorted and normalized keychord
 */
function sortKeyChord(keyChord) {
    const normalized = filterAndNormalizeKeyChord(keyChord);
    // Define modifier key order (alphabetical within modifiers)
    const modifierKeys = ['Alt', 'Ctrl', 'Meta', 'Shift'];
    const isModifier = (key) => modifierKeys.includes(key);
    // Separate modifiers and regular keys
    const modifiers = normalized.filter(isModifier).sort();
    const regularKeys = normalized.filter(key => !isModifier(key)).sort();
    // Return modifiers first, then regular keys
    return [...modifiers, ...regularKeys];
}
/**
 * Compare two keychords for equality (order-independent, normalized)
 * @param chord1 - First keychord
 * @param chord2 - Second keychord
 * @returns True if keychords match
 */
function compareKeyChords(chord1, chord2) {
    const sorted1 = sortKeyChord(chord1);
    const sorted2 = sortKeyChord(chord2);
    if (sorted1.length !== sorted2.length) {
        return false;
    }
    return sorted1.every((key, index) => key.toLowerCase() === sorted2[index].toLowerCase());
}
/**
 * Observes keyboard key events and returns an Observable that calls next(true) if the shortcut is matched
 * Calls, next(false) if not
 * @param shortcut
 * @param keysObservable
 * @param stop
 * @constructor
 */
const FollowKeyChordObserver = (shortcut, keysObservable, stop) => {
    return new rxjs__WEBPACK_IMPORTED_MODULE_0__.Observable((subscriber) => {
        let typed = [];
        let complete = false;
        // Normalize and sort the target shortcut once
        const normalizedShortcut = sortKeyChord(shortcut);
        keysObservable.subscribe((key) => {
            if (stop()) {
                if (!complete) {
                    complete = true;
                    subscriber.complete();
                }
                return;
            }
            // Normalize and filter the incoming key
            const normalizedKey = normalizeKey(key);
            // Skip invalid keys (like "Dead", "Unidentified")
            if (!normalizedKey) {
                subscriber.next(false);
                return;
            }
            // typed.unshift(key);
            // todo: review: should shift, meta, and control reduce to 1 and stick until keyup?
            //        so you can hold shift, and toggle with 'w'
            typed = [normalizedKey].concat(typed).slice(0, shortcut.length);
            // Compare using normalized, sorted keychords
            const matches = compareKeyChords(typed, normalizedShortcut);
            if (matches) {
                subscriber.next(true);
            }
            else {
                subscriber.next(false);
            }
        });
    });
};


/***/ }),

/***/ "./src/content-scripts/log-view-content-system-integrated.ts":
/*!*******************************************************************!*\
  !*** ./src/content-scripts/log-view-content-system-integrated.ts ***!
  \*******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogViewContentSystemIntegrated: () => (/* binding */ LogViewContentSystemIntegrated),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _log_view_content_system_tome__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./log-view-content-system-tome */ "./src/content-scripts/log-view-content-system-tome.ts");
/* harmony import */ var _log_view_shadow_system_tome__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./log-view-shadow-system-tome */ "./src/content-scripts/log-view-shadow-system-tome.ts");
/* harmony import */ var _services_content_system_dom_service__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../services/content-system-dom-service */ "./src/services/content-system-dom-service.ts");
/* harmony import */ var _services_content_system_message_service__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../services/content-system-message-service */ "./src/services/content-system-message-service.ts");
/* harmony import */ var _services_ml_settings_service__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../services/ml-settings-service */ "./src/services/ml-settings-service.ts");
/* harmony import */ var _services_selector_hierarchy__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../services/selector-hierarchy */ "./src/services/selector-hierarchy.ts");
/* harmony import */ var _services_simple_color_service__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../services/simple-color-service */ "./src/services/simple-color-service.ts");
/* harmony import */ var _services_keychord_content_integration__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../services/keychord-content-integration */ "./src/services/keychord-content-integration.ts");








/**
 * Integrated Content System with Proxy State Machine
 *
 * This system integrates the main content system with the shadow system proxy,
 * providing a unified message routing architecture that can connect Tomes structurally.
 */
class LogViewContentSystemIntegrated {
    constructor() {
        this.going = false;
        this.lastSyncedGoingState = null; // Track last synced state to avoid spam
        this.messageHistory = [];
        this.proxyState = 'idle';
        console.log("🌊 Creating Log-View-Machine Integrated Content System...");
        // Generate session ID first
        this.sessionId = `integrated-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        // Initialize services
        this.colorService = new _services_simple_color_service__WEBPACK_IMPORTED_MODULE_6__.SimpleColorServiceAdapter();
        this.selectorService = new _services_selector_hierarchy__WEBPACK_IMPORTED_MODULE_5__.SelectorHierarchy(this.colorService);
        this.mlService = new _services_ml_settings_service__WEBPACK_IMPORTED_MODULE_4__.MLSettingsService();
        this.domService = new _services_content_system_dom_service__WEBPACK_IMPORTED_MODULE_2__.ContentSystemDOMService();
        this.messageService = new _services_content_system_message_service__WEBPACK_IMPORTED_MODULE_3__.ContentSystemMessageService(this.sessionId);
        // Initialize Tomes by calling create() to get actual instances
        this.contentTome = _log_view_content_system_tome__WEBPACK_IMPORTED_MODULE_0__.LogViewContentSystemTomes.create({});
        this.shadowTome = _log_view_shadow_system_tome__WEBPACK_IMPORTED_MODULE_1__.LogViewShadowSystemTomes.create({});
        // Start the Tomes
        this.contentTome.start();
        this.shadowTome.start();
        // Initialize the system
        this.init();
        // Set up message listeners
        this.setupMessageListeners();
        console.log("🌊 Log-View-Machine Integrated Content System initialized successfully");
    }
    init() {
        // Wait for document.body to be available
        if (!document.body) {
            setTimeout(() => this.init(), 100);
            return;
        }
        // Initialize DOM service
        this.domService.initialize();
        // Set up message routing
        this.setupMessageRouting();
        // Initialize keyboard shortcut service
        this.setupKeyboardShortcuts();
        // Log system initialization
        this.logMessage('system-init', 'Integrated content system initialized successfully');
    }
    async setupKeyboardShortcuts() {
        console.log('⌨️ Integrated System: Setting up keyboard shortcuts');
        // Initialize KeyChordService with toggle callback that uses integrated system's handleToggle
        await (0,_services_keychord_content_integration__WEBPACK_IMPORTED_MODULE_7__.initializeKeyChordService)(() => {
            console.log('⌨️ Integrated System: Keyboard shortcut triggered, calling handleToggle');
            // Use the integrated system's toggle handler which properly routes to start/stop
            this.handleToggle({
                name: 'toggle',
                from: 'keyboard-shortcut',
                timestamp: Date.now(),
                options: this.latestOptions // Include current options if available
            });
        });
    }
    setupMessageRouting() {
        // Set up routing between content and shadow Tomes
        this.contentTome.subscribe((state) => {
            console.log("🌊 Integrated System: Content Tome state changed", state);
            this.handleContentTomeStateChange(state);
        });
        this.shadowTome.subscribe((state) => {
            console.log("🌊 Integrated System: Shadow Tome state changed", state);
            this.handleShadowTomeStateChange(state);
        });
    }
    setupMessageListeners() {
        // Listen for messages from the popup and background
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleRuntimeMessage(message, sender, sendResponse);
                return true; // Keep message channel open
            });
        }
        // Listen for window.postMessage from background script
        window.addEventListener('message', (event) => {
            if (event.data?.source === 'wave-reader-extension') {
                this.handleWindowMessage(event.data.message);
            }
        });
    }
    handleRuntimeMessage(message, sender, sendResponse) {
        console.log("🌊 Integrated System: Handling runtime message", message);
        // Coalesce nested message objects - check if message has an embedded message property
        let normalizedMessage = message;
        if (message && typeof message === 'object' && message.message && typeof message.message === 'object') {
            // Extract the inner message and merge with outer properties (like source)
            normalizedMessage = {
                ...message.message,
                // Preserve outer properties like source if they exist and aren't in inner message
                source: message.source || message.message.source,
                from: message.from || message.message.from || message.source
            };
            console.log("🌊 Integrated System: Coalesced nested message:", normalizedMessage);
        }
        // Normalize message name: handle both 'type' and 'name' fields, and convert to lowercase
        if (!normalizedMessage.name && normalizedMessage.type) {
            normalizedMessage.name = normalizedMessage.type.toLowerCase();
        }
        else if (normalizedMessage.name && typeof normalizedMessage.name === 'string') {
            normalizedMessage.name = normalizedMessage.name.toLowerCase();
        }
        // Ensure 'from' field is set
        if (!normalizedMessage.from) {
            normalizedMessage.from = normalizedMessage.source || sender?.id ? 'background' : 'unknown';
        }
        console.log("🌊 Integrated System: Normalized message name:", normalizedMessage.name, "from:", normalizedMessage.from);
        try {
            switch (normalizedMessage.name) {
                case 'start':
                    this.handleStart(normalizedMessage).then(() => {
                        sendResponse({ success: true, state: this.proxyState });
                    }).catch((error) => {
                        console.error("🌊 Integrated System: Error in handleStart", error);
                        sendResponse({ success: false, error: error.message });
                    });
                    break;
                case 'stop':
                    try {
                        this.handleStop(normalizedMessage);
                        sendResponse({ success: true, state: this.proxyState });
                    }
                    catch (error) {
                        console.error("🌊 Integrated System: Error in handleStop", error);
                        sendResponse({ success: false, error: error.message });
                    }
                    break;
                case 'toggle':
                case 'toggle-wave-reader':
                    try {
                        this.handleToggle(normalizedMessage);
                        sendResponse({ success: true, state: this.proxyState });
                    }
                    catch (error) {
                        console.error("🌊 Integrated System: Error in handleToggle", error);
                        sendResponse({ success: false, error: error.message });
                    }
                    break;
                case 'ping':
                    this.handlePing(normalizedMessage);
                    sendResponse({ success: true, state: this.proxyState });
                    break;
                case 'get-status':
                    this.handleGetStatus(normalizedMessage);
                    sendResponse({ success: true, status: this.getCurrentState() });
                    break;
                default:
                    console.log("🌊 Integrated System: Unknown runtime message type:", normalizedMessage.name);
                    sendResponse({ success: false, error: 'Unknown message type' });
            }
        }
        catch (error) {
            console.error("🌊 Integrated System: Error handling runtime message:", error);
            sendResponse({ success: false, error: error.message });
        }
    }
    handleWindowMessage(message) {
        console.log("🌊 Integrated System: Handling window message", message);
        // Coalesce nested message objects - check if message has an embedded message property
        let normalizedMessage = message;
        if (message && typeof message === 'object' && message.message && typeof message.message === 'object') {
            // Extract the inner message and merge with outer properties (like source)
            normalizedMessage = {
                ...message.message,
                // Preserve outer properties like source if they exist and aren't in inner message
                source: message.source || message.message.source,
                from: message.from || message.message.from || message.source
            };
            console.log("🌊 Integrated System: Coalesced nested window message:", normalizedMessage);
        }
        try {
            switch (normalizedMessage.name) {
                case 'start':
                    this.handleStart(normalizedMessage).catch((error) => {
                        console.error("🌊 Integrated System: Error in handleStart (window)", error);
                    });
                    break;
                case 'stop':
                    this.handleStop(normalizedMessage);
                    break;
                case 'toggle':
                case 'toggle-wave-reader':
                    this.handleToggle(normalizedMessage);
                    break;
                case 'ping':
                    this.handlePing(normalizedMessage);
                    break;
                default:
                    console.log("🌊 Integrated System: Unknown window message type:", normalizedMessage.name);
            }
        }
        catch (error) {
            console.error("🌊 Integrated System: Error handling window message:", error);
        }
    }
    async handleStart(message) {
        console.log("🌊 Integrated System: Handling start message", {
            message,
            hasOptions: !!message.options
        });
        this.going = true;
        // Extract options from the start message
        if (message.options) {
            this.latestOptions = message.options;
            console.log("🌊 Integrated System: Options extracted and set", {
                latestOptions: this.latestOptions,
                hasWave: !!this.latestOptions?.wave
            });
        }
        else {
            console.warn("🌊 Integrated System: No options found in start message, loading defaults");
            this.messageService.logMessage('start-warning', 'No options in start message, using defaults');
            // Load default options if none provided
            try {
                const Options = (await Promise.resolve(/*! import() */).then(__webpack_require__.bind(__webpack_require__, /*! ../models/options */ "./src/models/options.ts"))).default;
                this.latestOptions = Options.getDefaultOptions();
                console.log("🌊 Integrated System: Using default options", this.latestOptions);
            }
            catch (error) {
                console.error("🌊 Integrated System: Failed to load default options", error);
                // Try to load from Chrome storage as fallback
                if (typeof chrome !== 'undefined' && chrome.storage) {
                    try {
                        const result = await chrome.storage.local.get(['waveReaderSettings']);
                        if (result.waveReaderSettings) {
                            this.latestOptions = result.waveReaderSettings;
                            console.log("🌊 Integrated System: Loaded options from Chrome storage", this.latestOptions);
                        }
                    }
                    catch (storageError) {
                        console.error("🌊 Integrated System: Failed to load from storage", storageError);
                    }
                }
            }
        }
        // Route message to both Tomes
        this.routeMessageToTomes('start', message);
        // Apply wave animation
        this.applyWaveAnimation();
        // Update proxy state
        this.updateProxyState();
        // Sync state with background script
        this.syncGoingStateWithBackground();
        this.messageService.logMessage('start', 'Integrated system started');
        this.logMessage('start', 'Integrated system started');
    }
    handleStop(message) {
        console.log("🌊 Integrated System: Handling stop message");
        this.going = false;
        // Route message to both Tomes
        this.routeMessageToTomes('stop', message);
        // Remove wave animation
        this.removeWaveAnimation();
        // Update proxy state
        this.updateProxyState();
        // Sync state with background script
        this.syncGoingStateWithBackground();
        this.messageService.logMessage('stop', 'Integrated system stopped');
        this.logMessage('stop', 'Integrated system stopped');
    }
    handleToggle(message) {
        console.log("🌊 Integrated System: Handling toggle message");
        if (this.going) {
            this.handleStop(message);
        }
        else {
            this.handleStart(message);
        }
    }
    handlePing(message) {
        console.log("🌊 Integrated System: Handling ping message");
        // Route ping to both Tomes
        this.routeMessageToTomes('ping', message);
        // Send pong response
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.sendMessage({
                from: 'integrated-content-system',
                name: 'pong',
                timestamp: Date.now(),
                sessionId: this.sessionId,
                proxyState: this.proxyState
            });
        }
        this.messageService.logMessage('ping', 'Ping responded with pong');
        this.logMessage('ping', 'Ping responded with pong');
    }
    handleGetStatus(message) {
        console.log("🌊 Integrated System: Handling get-status message");
        this.logMessage('status-requested', 'Status requested from integrated system');
    }
    routeMessageToTomes(messageName, messageData) {
        console.log("🌊 Integrated System: Routing message to Tomes", { messageName, messageData });
        try {
            // Send to content Tome
            this.contentTome.send(messageName, messageData);
            // Send to shadow Tome
            this.shadowTome.send(messageName, messageData);
            console.log("🌊 Integrated System: Message routed to both Tomes successfully");
        }
        catch (error) {
            console.error("🌊 Integrated System: Error routing message to Tomes:", error);
        }
    }
    handleContentTomeStateChange(state) {
        console.log("🌊 Integrated System: Content Tome state changed", state);
        // Handle content Tome state changes
        if (state.value === 'active') {
            console.log("🌊 Integrated System: Content Tome is now active");
        }
        // Update proxy state
        this.updateProxyState();
    }
    handleShadowTomeStateChange(state) {
        console.log("🌊 Integrated System: Shadow Tome state changed", state);
        // Handle shadow Tome state changes
        if (state.value === 'waving') {
            console.log("🌊 Integrated System: Shadow Tome is now waving");
        }
        // Update proxy state
        this.updateProxyState();
    }
    updateProxyState() {
        const contentState = this.contentTome.getState().value;
        const shadowState = this.shadowTome.getState().value;
        if (contentState === 'active' && shadowState === 'waving') {
            this.proxyState = 'both-active';
        }
        else if (contentState === 'active') {
            this.proxyState = 'active';
        }
        else if (shadowState === 'waving') {
            this.proxyState = 'shadow-active';
        }
        else {
            this.proxyState = 'idle';
        }
        console.log("🌊 Integrated System: Proxy state updated", {
            proxyState: this.proxyState,
            contentState,
            shadowState
        });
    }
    syncGoingStateWithBackground() {
        // Only sync if the state has actually changed to reduce spam
        if (this.going === this.lastSyncedGoingState) {
            return;
        }
        console.log("🌊 Integrated System: Syncing going state with background", { going: this.going });
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            try {
                chrome.runtime.sendMessage({
                    from: 'integrated-content-system',
                    name: 'update-going-state',
                    going: this.going,
                    timestamp: Date.now(),
                    sessionId: this.sessionId
                }, (response) => {
                    // Check for extension context invalidation or other errors
                    if (chrome.runtime.lastError) {
                        const errorMessage = chrome.runtime.lastError.message || '';
                        // Extension context invalidated is a common development-time error
                        // when the extension is reloaded while pages are still open
                        if (errorMessage.includes('Extension context invalidated') ||
                            errorMessage.includes('message port closed')) {
                            console.warn("🌊 Integrated System: Extension context invalidated (extension was reloaded). This is normal during development.");
                        }
                        else {
                            console.warn("🌊 Integrated System: Failed to sync going state with background:", errorMessage);
                        }
                    }
                    else {
                        // Only update lastSyncedGoingState on successful send
                        this.lastSyncedGoingState = this.going;
                    }
                });
            }
            catch (error) {
                // Handle cases where chrome.runtime might throw synchronously
                const errorMessage = error?.message || String(error);
                if (errorMessage.includes('Extension context invalidated') ||
                    errorMessage.includes('message port closed')) {
                    console.warn("🌊 Integrated System: Extension context invalidated (extension was reloaded). This is normal during development.");
                }
                else {
                    console.warn("🌊 Integrated System: Error syncing going state with background:", errorMessage);
                }
            }
        }
    }
    applyWaveAnimation() {
        console.log("🌊 Integrated System: Applying wave animation", {
            hasOptions: !!this.latestOptions,
            hasWave: !!this.latestOptions?.wave,
            wave: this.latestOptions?.wave
        });
        if (!this.latestOptions?.wave) {
            console.warn("🌊 Integrated System: No wave options available for animation");
            this.messageService.logMessage('wave-animation-failed', 'No wave options available');
            return;
        }
        const wave = this.latestOptions.wave;
        const css = wave.cssTemplate;
        console.log("🌊 Integrated System: Wave CSS template", {
            css,
            cssLength: css ? css.length : 0,
            cssPreview: css ? css.substring(0, 200) + '...' : 'NO_CSS'
        });
        if (css) {
            console.log("🌊 Integrated System: Calling DOM service to apply CSS animation...");
            this.domService.applyWaveAnimation(css);
            this.messageService.logMessage('wave-animation-applied', 'Wave animation applied');
            console.log("🌊 Integrated System: Wave animation CSS applied to DOM");
        }
        else {
            console.warn("🌊 Integrated System: No CSS template available in wave");
            this.messageService.logMessage('wave-animation-failed', 'No CSS template available');
        }
    }
    removeWaveAnimation() {
        console.log("🌊 Integrated System: Removing wave animation");
        this.domService.removeWaveAnimation();
        this.messageService.logMessage('wave-animation-removed', 'Wave animation removed');
    }
    logMessage(type, message, data) {
        const logEntry = {
            type,
            message,
            data,
            timestamp: Date.now(),
            sessionId: this.sessionId,
            url: window.location.href,
            proxyState: this.proxyState,
            contentState: this.contentTome.getState().value,
            shadowState: this.shadowTome.getState().value
        };
        this.messageHistory.push(logEntry);
        console.log(`🌊 Integrated System [${type}]:`, message, data);
    }
    // Public methods for external access
    getCurrentState() {
        return {
            proxyState: this.proxyState,
            contentState: this.contentTome.getState().value,
            shadowState: this.shadowTome.getState().value,
            going: this.going
        };
    }
    getSessionId() {
        return this.sessionId;
    }
    getMessageHistory() {
        return this.messageHistory;
    }
    isActive() {
        return this.going;
    }
    getTomeStates() {
        return {
            content: this.contentTome.getState(),
            shadow: this.shadowTome.getState()
        };
    }
    destroy() {
        console.log("🌊 Integrated System: Destroying system...");
        // Clean up keyboard shortcuts
        (0,_services_keychord_content_integration__WEBPACK_IMPORTED_MODULE_7__.cleanupKeyChordService)();
        // Clean up Tomes
        if (this.contentTome) {
            this.contentTome.stop();
        }
        if (this.shadowTome) {
            this.shadowTome.stop();
        }
        // Clean up services
        this.domService.cleanup();
        this.logMessage('system-destroyed', 'Integrated system destroyed');
    }
}
// Initialize the integrated system when the script loads
console.log("🌊 Log-View-Machine: Initializing integrated content system...");
// Wait for DOM to be ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new LogViewContentSystemIntegrated();
    });
}
else {
    new LogViewContentSystemIntegrated();
}
// Export for testing
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LogViewContentSystemIntegrated);


/***/ }),

/***/ "./src/content-scripts/log-view-content-system-tome.ts":
/*!*************************************************************!*\
  !*** ./src/content-scripts/log-view-content-system-tome.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogViewContentSystemTomes: () => (/* binding */ LogViewContentSystemTomes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var log_view_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! log-view-machine */ "../log-view-machine/dist/index.esm.js");
/* harmony import */ var _types_tome_metadata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/tome-metadata */ "./src/types/tome-metadata.ts");


// Tome configuration
const tomeConfig = {
    machineId: 'log-view-content-system',
    xstateConfig: {
        id: 'log-view-content-system',
        initial: 'idle',
        context: {
            model: {}
        },
        states: {
            idle: {
                on: {
                    INITIALIZE: { target: 'initializing', actions: ['initializeSystem'] },
                    START: { target: 'starting', actions: ['prepareStart'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            initializing: {
                on: {
                    INITIALIZATION_COMPLETE: { target: 'ready', actions: ['markInitialized'] },
                    INITIALIZATION_FAILED: { target: 'error', actions: ['handleInitError'] }
                }
            },
            ready: {
                on: {
                    START: { target: 'starting', actions: ['prepareStart'] },
                    STOP: { target: 'stopping', actions: ['prepareStop'] },
                    TOGGLE: { target: 'toggling', actions: ['prepareToggle'] },
                    'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] },
                    'ML-RECOMMENDATION': { target: 'processing-ml', actions: ['processMLRecommendation'] },
                    'WAVE-READER-START': { target: 'component-initializing', actions: ['initializeComponents'] },
                    'WAVE-READER-STOP': { target: 'component-cleaning', actions: ['cleanupComponents'] },
                    ERROR: { target: 'error', actions: ['handleError'] }
                }
            },
            starting: {
                on: {
                    START_COMPLETE: { target: 'waving', actions: ['startWaveAnimation'] },
                    START_FAILED: { target: 'error', actions: ['handleStartError'] }
                }
            },
            waving: {
                on: {
                    STOP: { target: 'stopping', actions: ['prepareStop'] },
                    TOGGLE: { target: 'stopping', actions: ['prepareStop'] },
                    'SELECTION-MADE': { target: 'selection-mode', actions: ['showSelectorUI'] },
                    'WAVE-ERROR': { target: 'error', actions: ['handleWaveError'] },
                    'WAVE-READER-STOP': { target: 'component-cleaning', actions: ['cleanupComponents'] }
                }
            },
            stopping: {
                on: {
                    STOP_COMPLETE: { target: 'ready', actions: ['stopWaveAnimation'] },
                    STOP_FAILED: { target: 'error', actions: ['handleStopError'] }
                }
            },
            toggling: {
                on: {
                    TOGGLE_COMPLETE: { target: 'ready', actions: ['completeToggle'] }
                }
            },
            'selection-mode': {
                on: {
                    'SELECTION-MADE': { target: 'ready', actions: ['showSelectorUI', 'disableSelectionMode'] },
                    'END-SELECTION': { target: 'ready', actions: ['disableSelectionMode'] },
                    CANCEL: { target: 'ready', actions: ['cancelSelection', 'disableSelectionMode'] }
                }
            },
            'processing-ml': {
                on: {
                    'ML-PROCESSED': { target: 'ready', actions: ['updateMLRecommendation'] },
                    'ML-FAILED': { target: 'error', actions: ['handleMLError'] }
                }
            },
            'component-initializing': {
                on: {
                    'COMPONENTS-READY': { target: 'ready', actions: ['markComponentsReady'] },
                    'COMPONENTS-FAILED': { target: 'error', actions: ['handleComponentError'] }
                }
            },
            'component-cleaning': {
                on: {
                    'COMPONENTS-CLEANED': { target: 'ready', actions: ['markComponentsCleaned'] },
                    'COMPONENTS-CLEANUP-FAILED': { target: 'error', actions: ['handleCleanupError'] }
                }
            },
            error: {
                on: {
                    RESET: { target: 'idle', actions: ['resetToIdle'] },
                    RETRY: { target: 'ready', actions: ['retryOperation'] }
                }
            }
        }
    }
};
// Log states for view rendering
const logStates = {
    idle: async (context) => {
        await context.log('Content system in idle state - ready for initialization');
        return context.view(renderIdleView(context));
    },
    initializing: async (context) => {
        await context.log('Content system initializing - setting up DOM and services');
        return context.view(renderInitializingView(context));
    },
    ready: async (context) => {
        await context.log('Content system ready - wave reader available');
        return context.view(renderReadyView(context));
    },
    starting: async (context) => {
        await context.log('Content system starting - preparing wave animation');
        return context.view(renderStartingView(context));
    },
    waving: async (context) => {
        await context.log('Content system waving - animation active');
        return context.view(renderWavingView(context));
    },
    stopping: async (context) => {
        await context.log('Content system stopping - cleaning up animation');
        return context.view(renderStoppingView(context));
    },
    toggling: async (context) => {
        await context.log('Content system toggling - switching states');
        return context.view(renderTogglingView(context));
    },
    'selection-mode': async (context) => {
        await context.log('Content system in selection mode - choose elements');
        return context.view(renderSelectionModeView(context));
    },
    'processing-ml': async (context) => {
        await context.log('Content system processing ML recommendation');
        return context.view(renderProcessingMLView(context));
    },
    'component-initializing': async (context) => {
        await context.log('Content system initializing components');
        return context.view(renderComponentInitializingView(context));
    },
    'component-cleaning': async (context) => {
        await context.log('Content system cleaning up components');
        return context.view(renderComponentCleaningView(context));
    },
    error: async (context) => {
        await context.log('Content system error - needs attention');
        return context.view(renderErrorView(context));
    }
};
// Create function for the Tome
const createTome = (initialModel = {}) => {
    const defaultModel = {
        // System state
        isActive: false,
        currentState: 'idle',
        going: false,
        latestOptions: null,
        // DOM state
        shadowDOM: {
            isInitialized: false,
            containerId: null,
            shadowRoot: null
        },
        // Wave animation state
        waveAnimation: {
            isActive: false,
            options: null,
            cssTemplate: null,
            lastApplied: null
        },
        // Selector UI state
        selectorUI: {
            isVisible: false,
            currentSelector: null,
            selectorMode: false
        },
        // Services state
        services: {
            hierarchySelector: {
                isInitialized: false,
                currentSelector: null
            },
            mlService: {
                isInitialized: false,
                lastRecommendation: null
            },
            colorService: {
                isInitialized: false
            }
        },
        // Message system
        messageSystem: {
            messageHistory: [],
            lastMessage: null,
            messageQueue: []
        },
        // Session and metadata
        sessionId: `content-system-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        stateHistory: [],
        error: null,
        timestamp: Date.now()
    };
    return (0,log_view_machine__WEBPACK_IMPORTED_MODULE_0__.createViewStateMachine)({
        machineId: tomeConfig.machineId,
        xstateConfig: {
            ...tomeConfig.xstateConfig,
            context: {
                ...tomeConfig.xstateConfig.context,
                model: { ...defaultModel, ...initialModel }
            }
        },
        logStates
    });
};
// Create the Tome with metadata using the spread operator
const LogViewContentSystemTomes = (0,_types_tome_metadata__WEBPACK_IMPORTED_MODULE_1__.createComponentTomeWithMetadata)({
    // Spread the metadata header
    id: 'log-view-content-system-tome',
    name: 'Log-View-Machine Content System Tome',
    description: 'State management for content system with wave animations and DOM interactions',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    // Component-specific metadata
    componentType: 'system',
    author: 'Wave Reader Team',
    createdAt: '2024-01-01',
    lastModified: new Date().toISOString().split('T')[0],
    tags: ['content-system', 'wave-animation', 'dom-management', 'state-management'],
    priority: 'high',
    stability: 'stable',
    // Performance metadata
    performance: {
        memoryUsage: 2.5,
        initTime: 150,
        supportsLazyLoading: true
    },
    // Security metadata
    security: {
        requiresElevatedPermissions: false,
        handlesSensitiveData: false,
        level: 'low'
    },
    // Testing metadata
    testing: {
        coverage: 85,
        hasUnitTests: true,
        hasIntegrationTests: true,
        testSuite: 'src/test/content-scripts/'
    },
    // Deployment metadata
    deployment: {
        enabledByDefault: true,
        canBeDisabled: false,
        supportsHotReload: true,
        environments: ['development', 'staging', 'production']
    },
    // Service-specific metadata
    service: {
        category: 'integration',
        isStateful: true,
        isPersistent: true,
        lifecycle: 'singleton'
    },
    // Custom metadata
    custom: {
        waveAnimationSupport: true,
        shadowDOMSupport: true,
        messageRouting: true,
        mlIntegration: true
    }
}, tomeConfig, createTome);
// View rendering functions
function renderIdleView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemStatus',
        props: {
            status: 'idle',
            message: 'Content system idle - ready for initialization',
            systems: {
                content: model.isActive,
                shadow: model.shadowDOM.isInitialized,
                services: model.services
            }
        },
        priority: 1,
        timestamp: model.timestamp
    };
}
function renderInitializingView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemInitializing',
        props: {
            status: 'initializing',
            message: 'Setting up DOM and services',
            progress: {
                shadowDOM: model.shadowDOM.isInitialized,
                services: Object.values(model.services).some((s) => s.isInitialized)
            }
        },
        priority: 2,
        timestamp: model.timestamp
    };
}
function renderReadyView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemReady',
        props: {
            status: 'ready',
            message: 'Wave reader ready for operation',
            waveAnimation: model.waveAnimation,
            selectorUI: model.selectorUI,
            going: model.going
        },
        priority: 2,
        timestamp: model.timestamp
    };
}
function renderStartingView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemStarting',
        props: {
            status: 'starting',
            message: 'Preparing wave animation',
            options: model.latestOptions
        },
        priority: 3,
        timestamp: model.timestamp
    };
}
function renderWavingView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemWaving',
        props: {
            status: 'waving',
            message: 'Wave animation active',
            waveAnimation: model.waveAnimation,
            options: model.latestOptions
        },
        priority: 4,
        timestamp: model.timestamp
    };
}
function renderStoppingView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemStopping',
        props: {
            status: 'stopping',
            message: 'Cleaning up wave animation'
        },
        priority: 3,
        timestamp: model.timestamp
    };
}
function renderTogglingView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemToggling',
        props: {
            status: 'toggling',
            message: 'Switching system states'
        },
        priority: 2,
        timestamp: model.timestamp
    };
}
function renderSelectionModeView(context) {
    const { model } = context;
    return {
        type: 'overlay',
        component: 'ContentSystemSelectionMode',
        props: {
            status: 'selection-mode',
            message: 'Choose elements to read',
            selectorUI: model.selectorUI
        },
        priority: 5,
        timestamp: model.timestamp
    };
}
function renderProcessingMLView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemProcessingML',
        props: {
            status: 'processing-ml',
            message: 'Processing ML recommendation',
            mlService: model.services.mlService
        },
        priority: 3,
        timestamp: model.timestamp
    };
}
function renderComponentInitializingView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemComponentInitializing',
        props: {
            status: 'component-initializing',
            message: 'Initializing wave reader components',
            services: model.services
        },
        priority: 3,
        timestamp: model.timestamp
    };
}
function renderComponentCleaningView(context) {
    const { model } = context;
    return {
        type: 'content',
        component: 'ContentSystemComponentCleaning',
        props: {
            status: 'component-cleaning',
            message: 'Cleaning up wave reader components'
        },
        priority: 3,
        timestamp: model.timestamp
    };
}
function renderErrorView(context) {
    const { model } = context;
    return {
        type: 'notification',
        component: 'ContentSystemError',
        props: {
            status: 'error',
            message: 'Content system error - check logs',
            error: model.error || 'Unknown error'
        },
        priority: 6,
        timestamp: model.timestamp
    };
}
// Export for testing
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LogViewContentSystemTomes);


/***/ }),

/***/ "./src/content-scripts/log-view-shadow-system-tome.ts":
/*!************************************************************!*\
  !*** ./src/content-scripts/log-view-shadow-system-tome.ts ***!
  \************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogViewShadowSystemTomes: () => (/* binding */ LogViewShadowSystemTomes),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var log_view_machine__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! log-view-machine */ "../log-view-machine/dist/index.esm.js");
/* harmony import */ var _types_tome_metadata__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../types/tome-metadata */ "./src/types/tome-metadata.ts");


// Shadow System States
const shadowStates = {
    base: {
        on: {
            start: 'waving',
            stop: 'stopped',
            toggle: 'toggling',
            'mouse-move': 'tracking',
            'selection-mode': 'selecting'
        }
    },
    waving: {
        on: {
            stop: 'stopped',
            'mouse-move': 'tracking',
            'selection-mode': 'selecting'
        }
    },
    stopped: {
        on: {
            start: 'waving',
            toggle: 'toggling',
            'selection-mode': 'selecting'
        }
    },
    tracking: {
        on: {
            'mouse-stop': 'waving',
            stop: 'stopped',
            'selection-mode': 'selecting'
        }
    },
    selecting: {
        on: {
            'selection-made': 'waving',
            cancel: 'waving'
        }
    },
    toggling: {
        on: {
            'toggle-complete': 'waving'
        }
    }
};
// Shadow System Tome Configuration
const tomeConfig = {
    machineId: 'shadow-system-tome',
    xstateConfig: {
        id: 'shadow-system-tome',
        initial: 'base',
        states: shadowStates,
        context: {
            shadowRoot: null,
            shadowStyleElement: null,
            selectorUiRoot: null,
            going: false,
            latestOptions: null,
            mouseX: 0,
            mouseY: 0,
            mouseFollowInterval: null,
            lastCss: '',
            lastMouseX: 0,
            lastMouseY: 0,
            lastMouseTime: Date.now(),
            currentAnimationDuration: null,
            sessionId: '',
            messageHistory: []
        }
    }
};
// Shadow System Tome Creation Function
const createShadowSystemTome = (initialModel = {}) => {
    const model = {
        shadowRoot: null,
        shadowStyleElement: null,
        selectorUiRoot: null,
        going: false,
        latestOptions: null,
        mouseX: 0,
        mouseY: 0,
        mouseFollowInterval: null,
        lastCss: '',
        lastMouseX: 0,
        lastMouseY: 0,
        lastMouseTime: Date.now(),
        currentAnimationDuration: null,
        sessionId: `shadow-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        messageHistory: [],
        ...initialModel
    };
    return (0,log_view_machine__WEBPACK_IMPORTED_MODULE_0__.createViewStateMachine)(tomeConfig);
};
// Shadow System Tome with Metadata
const LogViewShadowSystemTomes = (0,_types_tome_metadata__WEBPACK_IMPORTED_MODULE_1__.createComponentTomeWithMetadata)({
    id: 'log-view-shadow-system-tome',
    name: 'Log-View-Machine Shadow System Tome',
    description: 'State management for shadow DOM system with mouse tracking and wave animations',
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    componentType: 'system',
    author: 'Wave Reader Team',
    createdAt: '2024-01-01',
    lastModified: new Date().toISOString().split('T')[0],
    tags: ['shadow-dom', 'mouse-tracking', 'wave-animation', 'state-management'],
    priority: 'high',
    stability: 'stable',
    performance: {
        memoryUsage: 1024,
        initTime: 100,
        supportsLazyLoading: true
    },
    security: {
        requiresElevatedPermissions: false,
        handlesSensitiveData: false,
        level: 'low'
    },
    testing: {
        coverage: 90,
        hasUnitTests: true,
        hasIntegrationTests: true,
        testSuite: 'jest'
    },
    deployment: {
        enabledByDefault: true,
        canBeDisabled: true,
        supportsHotReload: true,
        environments: ['development', 'production']
    },
    service: {
        category: 'integration',
        isStateful: true,
        isPersistent: true,
        lifecycle: 'singleton'
    },
    custom: {
        shadowDomEnabled: true,
        mouseTrackingEnabled: true,
        waveAnimationEnabled: true,
        selectorHierarchyEnabled: true
    }
}, tomeConfig, createShadowSystemTome);
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LogViewShadowSystemTomes);


/***/ }),

/***/ "./src/models/defaults.ts":
/*!********************************!*\
  !*** ./src/models/defaults.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   GoingDefault: () => (/* binding */ GoingDefault),
/* harmony export */   KeyChordDefaultFactory: () => (/* binding */ KeyChordDefaultFactory),
/* harmony export */   SelectorDefault: () => (/* binding */ SelectorDefault),
/* harmony export */   SelectorsDefaultFactory: () => (/* binding */ SelectorsDefaultFactory),
/* harmony export */   ShowNotificationsDefault: () => (/* binding */ ShowNotificationsDefault),
/* harmony export */   WaveAnimationControl: () => (/* binding */ WaveAnimationControl),
/* harmony export */   WaveAnimationControlDefault: () => (/* binding */ WaveAnimationControlDefault),
/* harmony export */   WaveDefaultFactory: () => (/* binding */ WaveDefaultFactory),
/* harmony export */   WindowDocumentWidth: () => (/* binding */ WindowDocumentWidth)
/* harmony export */ });
/* harmony import */ var _wave__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./wave */ "./src/models/wave.ts");

var WaveAnimationControl;
(function (WaveAnimationControl) {
    WaveAnimationControl[WaveAnimationControl["CSS"] = 0] = "CSS";
    WaveAnimationControl[WaveAnimationControl["MOUSE"] = 1] = "MOUSE";
})(WaveAnimationControl || (WaveAnimationControl = {}));
const KeyChordDefaultFactory = () => ["f", "Shift"];
const WaveAnimationControlDefault = WaveAnimationControl.CSS;
const ShowNotificationsDefault = true;
const GoingDefault = false;
const WaveDefaultFactory = () => _wave__WEBPACK_IMPORTED_MODULE_0__["default"].getDefaultWave();
const SelectorDefault = "*"; /* "p,h2,h3,h4,h5,h6,h7,h8,article,section,aside,figcaption,pre,div" */
const SelectorsDefaultFactory = () => [SelectorDefault];
const WindowDocumentWidth = 600;


/***/ }),

/***/ "./src/models/message.ts":
/*!*******************************!*\
  !*** ./src/models/message.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Message)
/* harmony export */ });
/* harmony import */ var _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/attribute-constructor */ "./src/util/attribute-constructor.ts");

class Message extends _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(name, from, attributes, requireAllAssigned = true, clientId = undefined) {
        super(attributes, requireAllAssigned);
        this.name = name;
        this.from = from;
        this.clientId = clientId;
    }
    /**
     * Returns clientId
     */
    getFrom() {
        return this.from;
    }
    getName() {
        return this.name;
    }
    getClientId() {
        if (!this.clientId)
            console.log("clientId is missing from message: " + this.name + ", from, " + this.from);
        return this.clientId || "no-id";
    }
}


/***/ }),

/***/ "./src/models/messages/simplified-messages.ts":
/*!****************************************************!*\
  !*** ./src/models/messages/simplified-messages.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   InitializeMessage: () => (/* binding */ InitializeMessage),
/* harmony export */   MLRecommendationMessage: () => (/* binding */ MLRecommendationMessage),
/* harmony export */   MessageFactory: () => (/* binding */ MessageFactory),
/* harmony export */   MessageUtility: () => (/* binding */ MessageUtility),
/* harmony export */   PingMessage: () => (/* binding */ PingMessage),
/* harmony export */   PongMessage: () => (/* binding */ PongMessage),
/* harmony export */   SelectionMadeMessage: () => (/* binding */ SelectionMadeMessage),
/* harmony export */   StartMessage: () => (/* binding */ StartMessage),
/* harmony export */   StopMessage: () => (/* binding */ StopMessage),
/* harmony export */   ToggleMessage: () => (/* binding */ ToggleMessage)
/* harmony export */ });
/* harmony import */ var _message__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../message */ "./src/models/message.ts");
/* harmony import */ var _options__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../options */ "./src/models/options.ts");


// Simplified message system for the new Tome-based architecture
class StartMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {
        options: new _options__WEBPACK_IMPORTED_MODULE_1__["default"]()
    }) {
        super('start', 'popup', attributes);
    }
}
class StopMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('stop', 'popup', attributes);
    }
}
class ToggleMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('toggle', 'popup', attributes);
    }
}
class PingMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('ping', 'system', attributes);
    }
}
class PongMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('pong', 'system', attributes);
    }
}
class InitializeMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('initialize', 'popup', attributes);
    }
}
class SelectionMadeMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('selection-made', 'content', attributes);
    }
}
class MLRecommendationMessage extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super('ml-recommendation', 'system', attributes);
    }
}
// Message factory for creating messages
class MessageFactory {
    static createMessage(name, from, data = {}) {
        switch (name) {
            case 'start':
                return new StartMessage(data);
            case 'stop':
                return new StopMessage(data);
            case 'toggle':
                return new ToggleMessage(data);
            case 'ping':
                return new PingMessage(data);
            case 'pong':
                return new PongMessage(data);
            case 'initialize':
                return new InitializeMessage(data);
            case 'selection-made':
                return new SelectionMadeMessage(data);
            case 'ml-recommendation':
                return new MLRecommendationMessage(data);
            default:
                // Create a generic message for unknown types
                const genericMessage = new (class extends _message__WEBPACK_IMPORTED_MODULE_0__["default"] {
                    constructor(name, from, data) {
                        super(name, from, data);
                    }
                })(name, from, data);
                return genericMessage;
        }
    }
}
// Simple message utility for routing
class MessageUtility {
    static routeMessage(from, to, message, sessionId) {
        return {
            from,
            to,
            message,
            sessionId,
            timestamp: Date.now()
        };
    }
}


/***/ }),

/***/ "./src/models/options.ts":
/*!*******************************!*\
  !*** ./src/models/options.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DeepEquals: () => (/* binding */ DeepEquals),
/* harmony export */   WaveToggleConfig: () => (/* binding */ WaveToggleConfig),
/* harmony export */   "default": () => (/* binding */ Options)
/* harmony export */ });
/* harmony import */ var _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/attribute-constructor */ "./src/util/attribute-constructor.ts");
/* harmony import */ var _wave__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./wave */ "./src/models/wave.ts");
/* harmony import */ var _defaults__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaults */ "./src/models/defaults.ts");



// Removed state dependency - using simplified approach
class WaveToggleConfig extends _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {}) {
        super(attributes);
        // a 1-4ish length array of keys
        this.keyChord = (0,_defaults__WEBPACK_IMPORTED_MODULE_2__.KeyChordDefaultFactory)();
        this.keyChord = attributes.keyChord || this.keyChord;
    }
    static getDefaultConfig() {
        return new WaveToggleConfig();
    }
}
const DeepEquals = (a, b) => {
    if (typeof a !== 'object' && a === b) {
        return true;
    }
    const aString = JSON.stringify(a);
    const bString = JSON.stringify(b);
    const aObj = JSON.parse(aString);
    const bObj = JSON.parse(bString);
    if (typeof a !== typeof b) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        return false;
    }
    if ((typeof a === "boolean" || typeof a === "number" || typeof a === "string") && a !== b) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        return false;
    }
    if (Array.isArray(aObj) && ((Array.isArray(aObj) != Array.isArray(bObj))
        || Object.keys(aObj).find(prop => !(prop in bObj)) ||
        Object.keys(bObj).find(prop => !(prop in aObj)))) {
        console.log("array mismatch for property: aString: " + aString + ", bString: " + bString);
        return false;
    }
    for (const prop in aObj) {
        if (Array.isArray(aObj[prop]) || Array.isArray(bObj[prop])) {
            if (aObj[prop].find((ap, i) => Array.isArray(bObj[prop]) && !Object.is(ap, bObj[prop][i]))) {
                console.log(" array mismatch for property: " + prop);
                return false;
            }
        }
        else {
            if (!DeepEquals(aObj[prop], bObj[prop])) {
                console.log(" array mismatch for property: " + prop);
                return false;
            }
        }
    }
    return true;
};
class Options extends _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(props = {}) {
        super(undefined);
        this.defaultSettings = false;
        // Removed state dependency - using simplified approach
        this.state = undefined;
        this.showNotifications = _defaults__WEBPACK_IMPORTED_MODULE_2__.ShowNotificationsDefault;
        this.going = _defaults__WEBPACK_IMPORTED_MODULE_2__.GoingDefault;
        this.waveAnimationControl = _defaults__WEBPACK_IMPORTED_MODULE_2__.WaveAnimationControlDefault;
        this.wave = (0,_defaults__WEBPACK_IMPORTED_MODULE_2__.WaveDefaultFactory)();
        this.toggleKeys = WaveToggleConfig.getDefaultConfig();
        this.selectors = (0,_defaults__WEBPACK_IMPORTED_MODULE_2__.SelectorsDefaultFactory)();
        this.domainPathSettings = new Map();
        // typescript auto-fills defaults here, if this is the desired behavior
        super.assign(props);
        // rehydrate the wave property as it surprisingly loses type after deserialization
        this.wave = new _wave__WEBPACK_IMPORTED_MODULE_1__["default"](this.wave);
    }
    static getDefaultOptions() {
        return new Options();
    }
    static OptionsEqual(a, b) {
        return DeepEquals(a, b);
    }
    /**
     * Get or create domain/path-specific settings
     */
    getDomainPathSettings(domain, path) {
        const key = this.generateDomainPathKey(domain, path);
        const existing = this.domainPathSettings.get(key);
        if (existing) {
            // Increment usage count
            existing.usageCount++;
            existing.lastUpdated = Date.now();
            return existing.settings;
        }
        // Return default settings if none exist
        return {};
    }
    /**
     * Set domain/path-specific settings
     */
    setDomainPathSettings(domain, path, settings) {
        const key = this.generateDomainPathKey(domain, path);
        const existing = this.domainPathSettings.get(key);
        if (existing) {
            // Update existing settings
            existing.settings = { ...existing.settings, ...settings };
            existing.lastUpdated = Date.now();
            existing.usageCount++;
        }
        else {
            // Create new domain/path settings
            this.domainPathSettings.set(key, {
                domain,
                path,
                settings: { ...settings },
                lastUpdated: Date.now(),
                usageCount: 1,
                userRating: 5 // Default high rating for new settings
            });
        }
    }
    /**
     * Generate a unique key for domain/path combination
     */
    generateDomainPathKey(domain, path) {
        return `${domain}${path}`;
    }
    /**
     * Get all domain/path settings
     */
    getAllDomainPathSettings() {
        return Array.from(this.domainPathSettings.values());
    }
    /**
     * Remove domain/path settings
     */
    removeDomainPathSettings(domain, path) {
        const key = this.generateDomainPathKey(domain, path);
        return this.domainPathSettings.delete(key);
    }
    /**
     * Update user rating for domain/path settings
     */
    updateDomainPathRating(domain, path, rating) {
        const key = this.generateDomainPathKey(domain, path);
        const existing = this.domainPathSettings.get(key);
        if (existing) {
            existing.userRating = Math.max(1, Math.min(5, rating)); // Clamp between 1-5
            existing.lastUpdated = Date.now();
        }
    }
}


/***/ }),

/***/ "./src/models/text.ts":
/*!****************************!*\
  !*** ./src/models/text.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Text)
/* harmony export */ });
/* harmony import */ var _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../util/attribute-constructor */ "./src/util/attribute-constructor.ts");

class Text extends _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_0__["default"] {
    constructor(attributes = {
        size: 'initial',
        color: 'initial'
    }) {
        super(attributes);
        this.assign(attributes);
    }
}


/***/ }),

/***/ "./src/models/wave.ts":
/*!****************************!*\
  !*** ./src/models/wave.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Wave),
/* harmony export */   defaultCssMouseTemplate: () => (/* binding */ defaultCssMouseTemplate),
/* harmony export */   defaultCssTemplate: () => (/* binding */ defaultCssTemplate),
/* harmony export */   replaceAnimationVariables: () => (/* binding */ replaceAnimationVariables),
/* harmony export */   replaceAnimationVariablesWithDuration: () => (/* binding */ replaceAnimationVariablesWithDuration)
/* harmony export */ });
/* harmony import */ var _models_text__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/text */ "./src/models/text.ts");
/* harmony import */ var _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../util/attribute-constructor */ "./src/util/attribute-constructor.ts");
/* harmony import */ var _defaults__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./defaults */ "./src/models/defaults.ts");



const defaultCssTemplate = (options, cssGenerationMode = 'hardcoded') => {
    const mode = cssGenerationMode || 'hardcoded';
    if (mode === 'template') {
        // Template mode: Use TEMPLATE variables that get replaced at runtime
        return `
@-webkit-keyframes wobble {
  0% { transform: translateX(0%); rotateY(0deg); }
  25% { transform: translateX(TRANSLATE_X_MIN%) rotateY(ROTATE_Y_MINdeg); }
  50% { transform: translateX(0%); rotateY(ROTATE_Y_MAXdeg); }
  75% { transform: translateX(TRANSLATE_X_MAX%) rotateY(ROTATE_Y_MINdeg); }
  100% { transform: translateX(0%); rotateY(0deg); }
}

${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: ${options.waveSpeed}s;
  animation-duration: ${options.waveSpeed}s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
`;
    }
    else {
        // Hardcoded mode: Use actual values (current behavior)
        return `
@-webkit-keyframes wobble {
  0% { transform: translateX(0%); rotateY(0deg); }
  25% { transform: translateX(${options.axisTranslateAmountXMin}%); rotateY(${options.axisRotationAmountYMin}deg); }
  50% { transform: translateX(0%); rotateY(${options.axisRotationAmountYMax}deg); }
  75% { transform: translateX(${options.axisTranslateAmountXMax}%); rotateY(${options.axisRotationAmountYMin}deg); }
  100% { transform: translateX(0%); rotateY(0deg); }
}

${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  -webkit-animation-name: wobble;
  animation-name: wobble;
  -webkit-animation-duration: ${options.waveSpeed}s;
  animation-duration: ${options.waveSpeed}s;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  animation-iteration-count: infinite;
}
`;
    }
};
// Direct positioning template - no keyframes, just direct transforms
const defaultCssMouseTemplate = (options, cssGenerationMode = 'template') => {
    const mode = cssGenerationMode || 'template';
    if (mode === 'template') {
        // Template mode: Use TEMPLATE variables (current behavior)
        return `
${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  transform: translateX(TRANSLATE_X%) rotateY(ROTATE_Ydeg);
  transition: transform ANIMATION_DURATIONs ease-out;
}
`;
    }
    else {
        // Hardcoded mode: Use actual values (for consistency with CSS template)
        // Note: For mouse template, hardcoded mode is less useful since values change dynamically,
        // but we provide it for consistency
        return `
${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  transform: translateX(0%) rotateY(0deg);
  transition: transform ${options.waveSpeed || 2}s ease-out;
}
`;
    }
};
const TRANSLATE_X = "TRANSLATE_X";
const ROTATE_Y = "ROTATE_Y";
const ANIMATION_DURATION = "ANIMATION_DURATION";
const TRANSLATE_X_MIN = "TRANSLATE_X_MIN";
const TRANSLATE_X_MAX = "TRANSLATE_X_MAX";
const ROTATE_Y_MIN = "ROTATE_Y_MIN";
const ROTATE_Y_MAX = "ROTATE_Y_MAX";
const replaceAnimationVariables = (wave, translateX, rotateY) => {
    return (wave.cssMouseTemplate || "")
        .replaceAll(TRANSLATE_X, translateX)
        .replaceAll(ROTATE_Y, rotateY);
};
const replaceAnimationVariablesWithDuration = (wave, translateX, rotateY, duration) => {
    let css = wave.cssMouseTemplate || "";
    css = css.replaceAll(TRANSLATE_X, translateX);
    css = css.replaceAll(ROTATE_Y, rotateY);
    css = css.replaceAll(ANIMATION_DURATION, duration.toString());
    return css;
};
var WaveShape;
(function (WaveShape) {
    WaveShape[WaveShape["AUTO"] = 0] = "AUTO";
    WaveShape[WaveShape["F_SHAPED"] = 1] = "F_SHAPED";
    WaveShape[WaveShape["LAYER_CAKE"] = 2] = "LAYER_CAKE";
    WaveShape[WaveShape["F_SHAPED_STOP"] = 3] = "F_SHAPED_STOP"; // the f-shaped wave, but stops horizontally at each horizontal page break, animating,
    // offset each stop by a small degree, slightly more exagerated maybe but could really help those that spend a lot of
    // their time scanning losely collected pages like personal shoppers, or people addicted to pinterest etc
    // todo: perhaps a WaveRecommendationService, as we could pass in the result from the user selector choice,
    //  then suggest a preset or a custom
    // todo: research whether or not, layer cake or f-shaped scanning is:
    //  - user preference (nurture)
    //  - innate brain stuff (nature)
    //  - a combination (both)
    //  hypothesis: combination, based on the alignment of the page - more grid like, layer cake, more article like, f-shaped
    //   https://www.nngroup.com/articles/layer-cake-pattern-scanning/
    //  theory: the more evenly spaced the page, the more we should apply swirl animation to each stop
    //       similar to the needleman-wunsch algorithm, we want to calculate a spread from expected average position
    //  theory: (of my own behavior), spread(set, h, w, n, count) = <set[n].x - n * w/count, set[n].y - n * h/count>
    //       if the avg sum of widths for horizontal and vertical is less than 1 standard deviation for each axis
    //          then we have relatively evenly spread grid, and should use layer cake pattern for this selection
    //       if the avg width sum of widths for horizontal and vertical is greater than 1 standard deviation for each axis
    //          then we have an oblong shaped article, and should use an F-shaped pattern
    //       todo: research:
    //          if we choose layer-cake, we should check to see if each horizontal stop resembles an F-shaped, or layer cake pattern
    //             then if we're still layer-caked, we stay with swirl, if not, we use hybrid or combination
})(WaveShape || (WaveShape = {}));
class Wave extends _util_attribute_constructor__WEBPACK_IMPORTED_MODULE_1__["default"] {
    constructor(attributes = Wave.getDefaultWave()) {
        super(attributes);
        this.text = new _models_text__WEBPACK_IMPORTED_MODULE_0__["default"]();
        this.shape = WaveShape.F_SHAPED;
        // Always generate CSS templates from current parameters (shader-like approach)
        // Use the attributes directly to ensure we have the correct values
        const waveWithAttributes = { ...this, ...attributes };
        const cssGenerationMode = attributes.cssGenerationMode || 'hardcoded';
        this.cssGenerationMode = cssGenerationMode;
        this.cssTemplate = defaultCssTemplate(waveWithAttributes, cssGenerationMode);
        this.cssMouseTemplate = defaultCssMouseTemplate(waveWithAttributes, cssGenerationMode);
    }
    // Always regenerate CSS templates from current parameters
    update() {
        const cssGenerationMode = this.cssGenerationMode || 'hardcoded';
        this.cssTemplate = defaultCssTemplate(this, cssGenerationMode);
        this.cssMouseTemplate = defaultCssMouseTemplate(this, cssGenerationMode);
        return this;
    }
    static getDefaultWave() {
        return new Wave({
            selector: _defaults__WEBPACK_IMPORTED_MODULE_2__.SelectorDefault,
            waveSpeed: 4,
            shape: WaveShape.F_SHAPED,
            axisTranslateAmountXMax: 0,
            axisTranslateAmountXMin: -1,
            axisRotationAmountYMin: -2,
            axisRotationAmountYMax: 2,
            mouseFollowInterval: 100,
            text: new _models_text__WEBPACK_IMPORTED_MODULE_0__["default"]({
                size: 'initial',
                color: 'initial'
            })
        });
    }
}


/***/ }),

/***/ "./src/services/content-system-dom-service.ts":
/*!****************************************************!*\
  !*** ./src/services/content-system-dom-service.ts ***!
  \****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentSystemDOMService: () => (/* binding */ ContentSystemDOMService),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/**
 * Content System DOM Service
 *
 * Manages DOM operations for the content system including:
 * - Shadow DOM creation and management
 * - Style element management
 * - DOM cleanup and disposal
 */
class ContentSystemDOMService {
    constructor() {
        this.isInitialized = false;
        this.state = {
            shadowRoot: null,
            shadowStyleElement: null,
            mainDocumentStyleElement: null,
            selectorUiRoot: null,
            containerId: `wave-reader-log-view-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
    }
    /**
     * Initialize the DOM service and create necessary elements
     */
    initialize() {
        if (this.isInitialized) {
            console.warn("🌊 ContentSystemDOMService: Already initialized");
            return this.state;
        }
        try {
            // Create shadow DOM container
            const container = this.createShadowContainer();
            // Create style elements
            this.createStyleElements();
            // Create selector UI root
            this.createSelectorUIRoot();
            this.isInitialized = true;
            console.log("🌊 ContentSystemDOMService: Initialized successfully");
            return this.state;
        }
        catch (error) {
            console.error("🌊 ContentSystemDOMService: Initialization failed:", error);
            throw error;
        }
    }
    /**
     * Create the shadow DOM container
     */
    createShadowContainer() {
        const container = document.createElement('div');
        container.id = this.state.containerId;
        container.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 0;
      height: 0;
      pointer-events: none;
      z-index: 2147483647;
    `;
        document.body.appendChild(container);
        this.state.shadowRoot = container.attachShadow({ mode: 'open' });
        if (!this.state.shadowRoot) {
            throw new Error("Failed to create shadow root");
        }
        return container;
    }
    /**
     * Create style elements for shadow and main document
     */
    createStyleElements() {
        // Shadow DOM styles
        this.state.shadowStyleElement = document.createElement('style');
        this.state.shadowStyleElement.textContent = this.getDefaultShadowStyles();
        this.state.shadowRoot.appendChild(this.state.shadowStyleElement);
        // Main document styles
        this.state.mainDocumentStyleElement = document.createElement('style');
        this.state.mainDocumentStyleElement.id = `wave-reader-log-view-styles-${this.state.containerId}`;
        this.state.mainDocumentStyleElement.textContent = this.getDefaultMainStyles();
        document.head.appendChild(this.state.mainDocumentStyleElement);
    }
    /**
     * Create selector UI root element
     */
    createSelectorUIRoot() {
        this.state.selectorUiRoot = document.createElement('div');
        this.state.selectorUiRoot.id = `wave-reader-selector-ui-${this.state.containerId}`;
        this.state.selectorUiRoot.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px;
      border-radius: 5px;
      font-size: 12px;
      z-index: 2147483646;
      display: none;
    `;
        document.body.appendChild(this.state.selectorUiRoot);
    }
    /**
     * Get default shadow DOM styles
     */
    getDefaultShadowStyles() {
        return `
      .wave-reader__text {
        font-size: initial;
        font-family: inherit;
        line-height: inherit;
        color: inherit;
        background: inherit;
        border: inherit;
        padding: inherit;
        margin: inherit;
        text-decoration: inherit;
        font-weight: inherit;
        font-style: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        word-spacing: inherit;
        white-space: inherit;
        vertical-align: inherit;
        text-align: inherit;
        text-indent: inherit;
        text-shadow: inherit;
        box-shadow: inherit;
        transform: inherit;
        transition: inherit;
        animation: inherit;
        filter: inherit;
        backdrop-filter: inherit;
        perspective: inherit;
        perspective-origin: inherit;
        transform-style: inherit;
        backface-visibility: inherit;
        transform-origin: inherit;
        transition-property: inherit;
        transition-duration: inherit;
        transition-timing-function: inherit;
        transition-delay: inherit;
        animation-name: inherit;
        animation-duration: inherit;
        animation-timing-function: inherit;
        animation-delay: inherit;
        animation-iteration-count: inherit;
        animation-direction: inherit;
        animation-fill-mode: inherit;
        animation-play-state: inherit;
      }
    `;
    }
    /**
     * Get default main document styles
     */
    getDefaultMainStyles() {
        return `
      /* Wave reader main document styles */
      .wave-reader__text {
        /* Animation will be injected here */
      }
    `;
    }
    /**
     * Apply wave animation styles to main document
     */
    applyWaveAnimation(cssTemplate) {
        console.log("🌊 ContentSystemDOMService: applyWaveAnimation called with CSS template", {
            hasCssTemplate: !!cssTemplate,
            cssLength: cssTemplate ? cssTemplate.length : 0,
            cssPreview: cssTemplate ? cssTemplate.substring(0, 200) + '...' : 'NO_CSS',
            hasMainDocumentStyleElement: !!this.state.mainDocumentStyleElement,
            stateKeys: Object.keys(this.state)
        });
        if (!this.state.mainDocumentStyleElement) {
            console.warn("🌊 ContentSystemDOMService: Main document style element not available");
            return;
        }
        try {
            console.log("🌊 ContentSystemDOMService: Setting style element textContent...");
            this.state.mainDocumentStyleElement.textContent = cssTemplate;
            console.log("🌊 ContentSystemDOMService: Wave animation styles applied successfully");
            console.log("🌊 ContentSystemDOMService: Style element now contains:", {
                textContentLength: this.state.mainDocumentStyleElement.textContent?.length || 0,
                textContentPreview: this.state.mainDocumentStyleElement.textContent?.substring(0, 200) + '...' || 0
            });
        }
        catch (error) {
            console.error("🌊 ContentSystemDOMService: Failed to apply wave animation:", error);
            throw error;
        }
    }
    /**
     * Remove wave animation styles
     */
    removeWaveAnimation() {
        if (this.state.mainDocumentStyleElement) {
            this.state.mainDocumentStyleElement.textContent = this.getDefaultMainStyles();
            console.log("🌊 ContentSystemDOMService: Wave animation styles removed");
        }
    }
    /**
     * Apply styles to shadow DOM
     */
    applyShadowStyles(styles) {
        if (!this.state.shadowStyleElement) {
            console.warn("🌊 ContentSystemDOMService: Shadow style element not available");
            return;
        }
        try {
            this.state.shadowStyleElement.textContent = this.getDefaultShadowStyles() + styles;
            console.log("🌊 ContentSystemDOMService: Shadow styles applied");
        }
        catch (error) {
            console.error("🌊 ContentSystemDOMService: Failed to apply shadow styles:", error);
            throw error;
        }
    }
    /**
     * Show selector UI with message
     */
    showSelectorUI(message) {
        if (!this.state.selectorUiRoot) {
            console.warn("🌊 ContentSystemDOMService: Selector UI root not available");
            return;
        }
        try {
            this.state.selectorUiRoot.innerHTML = `<div>${message}</div>`;
            this.state.selectorUiRoot.style.display = 'block';
            console.log("🌊 ContentSystemDOMService: Selector UI shown");
        }
        catch (error) {
            console.error("🌊 ContentSystemDOMService: Failed to show selector UI:", error);
            throw error;
        }
    }
    /**
     * Hide selector UI
     */
    hideSelectorUI() {
        if (this.state.selectorUiRoot) {
            this.state.selectorUiRoot.style.display = 'none';
            console.log("🌊 ContentSystemDOMService: Selector UI hidden");
        }
    }
    /**
     * Get current DOM state
     */
    getState() {
        return { ...this.state };
    }
    /**
     * Check if service is initialized
     */
    getInitialized() {
        return this.isInitialized;
    }
    /**
     * Clean up DOM elements
     */
    cleanup() {
        try {
            // Remove selector UI
            if (this.state.selectorUiRoot) {
                this.state.selectorUiRoot.remove();
                this.state.selectorUiRoot = null;
            }
            // Remove main document styles
            if (this.state.mainDocumentStyleElement) {
                this.state.mainDocumentStyleElement.remove();
                this.state.mainDocumentStyleElement = null;
            }
            // Remove shadow container (this removes shadow root and styles)
            if (this.state.shadowRoot?.host) {
                this.state.shadowRoot.host.remove();
                this.state.shadowRoot = null;
            }
            this.isInitialized = false;
            console.log("🌊 ContentSystemDOMService: Cleanup completed");
        }
        catch (error) {
            console.error("🌊 ContentSystemDOMService: Cleanup failed:", error);
            throw error;
        }
    }
    /**
     * Reset service to initial state
     */
    reset() {
        this.cleanup();
        this.state = {
            shadowRoot: null,
            shadowStyleElement: null,
            mainDocumentStyleElement: null,
            selectorUiRoot: null,
            containerId: `wave-reader-log-view-container-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
        };
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentSystemDOMService);


/***/ }),

/***/ "./src/services/content-system-message-service.ts":
/*!********************************************************!*\
  !*** ./src/services/content-system-message-service.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ContentSystemMessageService: () => (/* binding */ ContentSystemMessageService),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/messages/simplified-messages */ "./src/models/messages/simplified-messages.ts");
/**
 * Content System Message Service
 *
 * Manages message handling for the content system including:
 * - Message routing between popup, background, and content scripts
 * - Message validation and transformation
 * - Message history and logging
 */


class ContentSystemMessageService {
    constructor(sessionId) {
        this.messageHistory = [];
        this.messageHandlers = new Map();
        this.isInitialized = false;
        this.sessionId = sessionId;
    }
    /**
     * Initialize the message service
     */
    initialize() {
        if (this.isInitialized) {
            console.warn("🌊 ContentSystemMessageService: Already initialized");
            return;
        }
        try {
            this.setupMessageListeners();
            this.isInitialized = true;
            console.log("🌊 ContentSystemMessageService: Initialized successfully");
        }
        catch (error) {
            console.error("🌊 ContentSystemMessageService: Initialization failed:", error);
            throw error;
        }
    }
    /**
     * Set up message listeners for extension and popup messages
     */
    setupMessageListeners() {
        // Listen for messages from the extension
        window.addEventListener('message', (event) => {
            if (event.source !== window)
                return;
            if (event.data?.source !== 'wave-reader-extension')
                return;
            const messageData = event.data.message;
            this.handleExtensionMessage(messageData);
        });
        // Listen for messages from the popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handlePopupMessage(message, sender, sendResponse);
                return true; // Keep message channel open
            });
        }
    }
    /**
     * Handle extension messages
     */
    handleExtensionMessage(messageData) {
        console.log("🌊 ContentSystemMessageService: Received extension message:", messageData);
        try {
            // Create a proper message using our factory
            const message = _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__.MessageFactory.createMessage(messageData.name, messageData.from, messageData);
            // Log the message
            this.logMessage('extension-message', `Received ${messageData.name} from ${messageData.from}`);
            // Route the message through our message system
            const route = _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__.MessageUtility.routeMessage(messageData.from, 'content-script', message, this.sessionId);
            // Process the message
            this.processMessage(message, route);
        }
        catch (error) {
            console.error("🌊 ContentSystemMessageService: Error handling extension message:", error);
            this.logMessage('message-error', `Error handling extension message: ${error}`);
        }
    }
    /**
     * Handle popup messages
     */
    handlePopupMessage(message, sender, sendResponse) {
        console.log("🌊 ContentSystemMessageService: Received popup message:", message);
        try {
            // Create a proper message using our factory
            const popupMessage = _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__.MessageFactory.createMessage(message.name, message.from, message);
            // Log the message
            this.logMessage('popup-message', `Received ${message.name} from popup`);
            // Route the message through our message system
            const route = _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__.MessageUtility.routeMessage('popup', 'content-script', popupMessage, this.sessionId);
            // Process the message
            this.processMessage(popupMessage, route);
            // Send response back to popup
            sendResponse({ success: true, sessionId: this.sessionId });
        }
        catch (error) {
            console.error("🌊 ContentSystemMessageService: Error handling popup message:", error);
            this.logMessage('message-error', `Error handling popup message: ${error}`);
            sendResponse({ success: false, error: error instanceof Error ? error.message : String(error) });
        }
    }
    /**
     * Process a message using registered handlers
     */
    processMessage(message, route) {
        const messageName = message.name;
        try {
            // Find and execute the appropriate handler
            const handler = this.messageHandlers.get(messageName);
            if (handler) {
                handler.handler(message, route);
            }
            else {
                console.log(`🌊 ContentSystemMessageService: No handler found for message type: ${messageName}`);
                this.logMessage('unknown-message', `Unknown message type: ${messageName}`);
            }
        }
        catch (error) {
            console.error(`🌊 ContentSystemMessageService: Error processing message ${messageName}:`, error);
            this.logMessage('message-error', `Error processing ${messageName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    /**
     * Register a message handler
     */
    registerHandler(handler) {
        if (this.messageHandlers.has(handler.name)) {
            console.warn(`🌊 ContentSystemMessageService: Handler for ${handler.name} already exists, overwriting`);
        }
        this.messageHandlers.set(handler.name, handler);
        console.log(`🌊 ContentSystemMessageService: Registered handler for ${handler.name}`);
    }
    /**
     * Unregister a message handler
     */
    unregisterHandler(name) {
        const removed = this.messageHandlers.delete(name);
        if (removed) {
            console.log(`🌊 ContentSystemMessageService: Unregistered handler for ${name}`);
        }
        else {
            console.warn(`🌊 ContentSystemMessageService: No handler found for ${name}`);
        }
        return removed;
    }
    /**
     * Get all registered handlers
     */
    getHandlers() {
        return new Map(this.messageHandlers);
    }
    /**
     * Check if a handler exists for a message type
     */
    hasHandler(name) {
        return this.messageHandlers.has(name);
    }
    /**
     * Send a message to the tome system
     */
    sendToTome(message, tome) {
        // Map message names to tome events
        const messageToTomeEvent = {
            'start': 'START',
            'stop': 'STOP',
            'toggle-wave-reader': 'TOGGLE',
            'selection-made': 'SELECTION-MADE',
            'ml-recommendation': 'ML-RECOMMENDATION',
            'settings-reset': 'SETTINGS-RESET',
            'wave-reader-start': 'WAVE-READER-START',
            'wave-reader-stop': 'WAVE-READER-STOP',
            'analytics': 'ANALYTICS',
            'health-check': 'HEALTH-CHECK'
        };
        const tomeEvent = messageToTomeEvent[message.name];
        if (tomeEvent && tome) {
            tome.send({ type: tomeEvent, payload: message }).then(() => {
                console.log(`🌊 ContentSystemMessageService: Tome received event: ${tomeEvent}`);
            }).catch((error) => {
                console.error(`🌊 ContentSystemMessageService: Tome event failed: ${tomeEvent}`, error);
            });
        }
    }
    /**
     * Log a message to the history
     */
    logMessage(type, message, data, state) {
        const logEntry = {
            timestamp: Date.now(),
            type,
            message,
            data,
            sessionId: this.sessionId,
            url: window.location.href,
            state
        };
        this.messageHistory.push(logEntry);
        // Keep only last 1000 messages
        if (this.messageHistory.length > 1000) {
            this.messageHistory = this.messageHistory.slice(-1000);
        }
        // Log to console in development
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.log(`🌊 ContentSystemMessageService [${type}]:`, message, data || '');
        }
    }
    /**
     * Get message history
     */
    getMessageHistory() {
        return [...this.messageHistory];
    }
    /**
     * Get message history by type
     */
    getMessageHistoryByType(type) {
        return this.messageHistory.filter(entry => entry.type === type);
    }
    /**
     * Clear message history
     */
    clearMessageHistory() {
        this.messageHistory = [];
        console.log("🌊 ContentSystemMessageService: Message history cleared");
    }
    /**
     * Get session ID
     */
    getSessionId() {
        return this.sessionId;
    }
    /**
     * Check if service is initialized
     */
    getInitialized() {
        return this.isInitialized;
    }
    /**
     * Clean up the message service
     */
    cleanup() {
        try {
            // Remove event listeners
            window.removeEventListener('message', this.handleExtensionMessage.bind(this));
            if (typeof chrome !== 'undefined' && chrome.runtime) {
                chrome.runtime.onMessage.removeListener(this.handlePopupMessage.bind(this));
            }
            // Clear handlers and history
            this.messageHandlers.clear();
            this.messageHistory = [];
            this.isInitialized = false;
            console.log("🌊 ContentSystemMessageService: Cleanup completed");
        }
        catch (error) {
            console.error("🌊 ContentSystemMessageService: Cleanup failed:", error);
            throw error;
        }
    }
    /**
     * Reset service to initial state
     */
    reset() {
        this.cleanup();
        this.sessionId = `content-system-message-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ContentSystemMessageService);


/***/ }),

/***/ "./src/services/keychord-content-integration.ts":
/*!******************************************************!*\
  !*** ./src/services/keychord-content-integration.ts ***!
  \******************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   cleanupKeyChordService: () => (/* binding */ cleanupKeyChordService),
/* harmony export */   getCurrentKeyChord: () => (/* binding */ getCurrentKeyChord),
/* harmony export */   initializeKeyChordService: () => (/* binding */ initializeKeyChordService),
/* harmony export */   isKeyChordServiceActive: () => (/* binding */ isKeyChordServiceActive),
/* harmony export */   setToggleCallback: () => (/* binding */ setToggleCallback)
/* harmony export */ });
/* harmony import */ var _keychord_service__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./keychord-service */ "./src/services/keychord-service.ts");

/**
 * KeyChord Content Integration
 *
 * Sets up keyboard shortcuts for content scripts
 * Integrates with content system tomes to handle toggle actions
 */
let keyChordService = null;
let settingsCleanup = null;
/**
 * Initialize keyboard shortcut service for content scripts
 *
 * @param onToggle - Optional callback when toggle shortcut is pressed
 *                   If not provided, sends message to background script
 */
async function initializeKeyChordService(onToggle) {
    console.log('⌨️ KeyChordContentIntegration: Initializing keyboard shortcut service');
    // Stop existing service if any
    if (keyChordService) {
        cleanupKeyChordService();
    }
    // Load key chord from storage
    const keyChord = await _keychord_service__WEBPACK_IMPORTED_MODULE_0__.KeyChordService.loadKeyChordFromStorage();
    // Create service
    keyChordService = new _keychord_service__WEBPACK_IMPORTED_MODULE_0__.KeyChordService(keyChord, onToggle || (() => {
        // Default: send toggle message to background
        sendToggleToBackground();
    }));
    // Start the service
    keyChordService.start();
    // Set up settings change listener
    settingsCleanup = _keychord_service__WEBPACK_IMPORTED_MODULE_0__.KeyChordService.setupSettingsListener((newKeyChord) => {
        console.log('⌨️ KeyChordContentIntegration: Settings changed, updating keyboard shortcut');
        if (keyChordService) {
            keyChordService.updateKeyChord(newKeyChord);
        }
    });
    console.log('⌨️ KeyChordContentIntegration: Keyboard shortcut service initialized with:', keyChord.join(' + '));
}
/**
 * Send toggle message to background script
 */
async function sendToggleToBackground() {
    if (typeof chrome === 'undefined' || !chrome.runtime) {
        console.warn('⌨️ KeyChordContentIntegration: Chrome runtime not available');
        return;
    }
    try {
        const response = await chrome.runtime.sendMessage({
            name: 'toggle',
            from: 'content-script',
            source: 'keychord-service',
            timestamp: Date.now()
        });
        console.log('⌨️ KeyChordContentIntegration: Toggle message sent to background, response:', response);
    }
    catch (error) {
        console.error('⌨️ KeyChordContentIntegration: Failed to send toggle message:', error);
    }
}
/**
 * Update the toggle callback
 */
function setToggleCallback(onToggle) {
    if (keyChordService) {
        keyChordService.setOnToggle(onToggle);
    }
}
/**
 * Cleanup keyboard shortcut service
 */
function cleanupKeyChordService() {
    console.log('⌨️ KeyChordContentIntegration: Cleaning up keyboard shortcut service');
    if (keyChordService) {
        keyChordService.cleanup();
        keyChordService = null;
    }
    if (settingsCleanup) {
        settingsCleanup();
        settingsCleanup = null;
    }
}
/**
 * Get current key chord
 */
function getCurrentKeyChord() {
    if (keyChordService) {
        return keyChordService.getCurrentKeyChord();
    }
    return ['Ctrl', 'Shift', 'W'];
}
/**
 * Check if service is active
 */
function isKeyChordServiceActive() {
    return keyChordService?.getIsActive() || false;
}


/***/ }),

/***/ "./src/services/keychord-service.ts":
/*!******************************************!*\
  !*** ./src/services/keychord-service.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   KeyChordService: () => (/* binding */ KeyChordService)
/* harmony export */ });
/* harmony import */ var _components_util_user_input__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../components/util/user-input */ "./src/components/util/user-input.ts");

/**
 * KeyChord Service
 *
 * Manages keyboard shortcut detection using KeyChord pattern
 * Listens for keyboard events and triggers toggle when shortcut is pressed
 * Can be updated with new shortcuts from settings
 */
class KeyChordService {
    constructor(initialKeyChord = ['Shift', 'F'], onToggleCallback) {
        this.subscription = null;
        this.listener = null;
        this.currentKeyChord = [];
        this.isActive = false;
        this.onToggle = null;
        this.debounceId = undefined;
        this.activeKeys = new Set();
        this.keyupListener = null;
        this.blurListener = null;
        // Normalize the keychord when setting it
        this.currentKeyChord = (0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.sortKeyChord)(initialKeyChord);
        this.onToggle = onToggleCallback || null;
    }
    /**
     * Start listening for keyboard shortcuts
     */
    start() {
        if (this.isActive) {
            console.warn('⌨️ KeyChordService: Already active, stopping first');
            this.stop();
        }
        console.log('⌨️ KeyChordService: Starting keyboard shortcut listener for:', this.currentKeyChord.join(' + '));
        this.isActive = true;
        this.resetActiveKeys();
        let keysSubscription = null;
        // Create keyboard observer
        // WindowKeyDownKey attaches its own listener, but we need to intercept events first
        // So we'll attach our listener directly and manually call WindowKeyDownKey's listener when needed
        let internalListener = null;
        // Create our wrapper listener that handles keychord matching synchronously
        // This will be attached directly to window
        this.listener = (event) => {
            // Skip if event is already prevented
            if (event.defaultPrevented) {
                if (internalListener)
                    internalListener(event);
                return;
            }
            // Skip if in input-selector field
            if (this.isInputSelectorField(event)) {
                if (internalListener)
                    internalListener(event);
                return;
            }
            // Normalize and filter the incoming key
            const normalizedKey = (0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.normalizeKey)(event.key);
            // Skip invalid keys (like "Dead", "Unidentified")
            if (!normalizedKey) {
                if (internalListener)
                    internalListener(event);
                return;
            }
            // Filter out Meta if it's not part of the target keychord
            // (Some browsers emit Meta unexpectedly when only modifier keys are pressed)
            if (normalizedKey === 'Meta' && !this.currentKeyChord.includes('Meta')) {
                if (internalListener)
                    internalListener(event);
                return;
            }
            if (event.repeat && this.activeKeys.has(normalizedKey)) {
                if (internalListener)
                    internalListener(event);
                return;
            }
            this.activeKeys.add(normalizedKey);
            this.scheduleActiveKeysReset();
            const isCompleted = this.isActiveKeyChordMatch();
            // Handle keychord match synchronously on keydown
            if (isCompleted) {
                // Prevent default synchronously when keychord matches
                event.preventDefault();
                event.stopPropagation();
                console.log('⌨️ KeyChordService: Shortcut matched!', this.currentKeyChord.join(' + '));
                this.handleToggle();
                this.resetActiveKeys();
                // Don't call internalListener for matched shortcuts to avoid emitting the key
                return;
            }
            // If keychord not completed, emit the key normally through the internal listener
            if (internalListener)
                internalListener(event);
        };
        // Attach our listener directly to window (capture phase, runs first)
        window.addEventListener('keydown', this.listener, true);
        this.keyupListener = (event) => {
            const normalizedKey = (0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.normalizeKey)(event.key);
            if (!normalizedKey) {
                return;
            }
            if (this.activeKeys.has(normalizedKey)) {
                this.activeKeys.delete(normalizedKey);
            }
        };
        window.addEventListener('keyup', this.keyupListener, true);
        this.blurListener = () => {
            this.resetActiveKeys();
        };
        window.addEventListener('blur', this.blurListener, true);
        // Create the observable - it will create and attach its own listener
        // Our listener runs first (capture phase), so we intercept events before WindowKeyDownKey's listener
        const keysObservable = (0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.WindowKeyDownKey)((listenerFn) => {
            // Store the internal listener that WindowKeyDownKey creates
            // We'll call it from our listener when the keychord doesn't match
            internalListener = listenerFn;
        }, false // Don't prevent default here - we handle it manually when keychord matches
        );
        // Store keys subscription for cleanup - we track keys in the listener above
        // The observable subscription is needed to keep the listener active
        keysSubscription = keysObservable.subscribe({
            next: (key) => {
                // Keys are processed synchronously in the listener above
                // This subscription keeps the observable active
            },
            error: (error) => {
                console.error('⌨️ KeyChordService: Error in keys observable:', error);
            },
            complete: () => {
                console.log('⌨️ KeyChordService: Keys observable completed');
            }
        });
        // Store the keys subscription as the main subscription for cleanup
        this.subscription = keysSubscription;
    }
    /**
     * Check if the event target is within an input-selector field or is an editable element
     * @param event - The keyboard event to check
     * @returns true if target is an input-selector field or editable element
     */
    isInputSelectorField(event) {
        const target = event.target;
        if (!target)
            return false;
        // Check if target is an input or textarea element
        const tagName = target.tagName?.toLowerCase();
        if (tagName === 'input' || tagName === 'textarea') {
            return true;
        }
        // Check if target has contenteditable attribute
        if (target.hasAttribute?.('contenteditable') && target.getAttribute('contenteditable') !== 'false') {
            return true;
        }
        // Check for input-selector specific IDs
        if (target.id === 'selectorInput' || target.id === 'selector-text-input') {
            return true;
        }
        // Check for input-selector specific classes
        if (target.classList?.contains('selector-text-input')) {
            return true;
        }
        // Check if target is within an element with selector-input classes
        let current = target;
        while (current) {
            if (current.classList?.contains('selector-input-editing') ||
                current.classList?.contains('selector-input-section')) {
                return true;
            }
            current = current.parentElement;
        }
        return false;
    }
    scheduleActiveKeysReset() {
        if (this.debounceId) {
            clearTimeout(this.debounceId);
        }
        this.debounceId = setTimeout(() => {
            this.resetActiveKeys();
        }, 5000);
    }
    resetActiveKeys() {
        this.activeKeys.clear();
        if (this.debounceId) {
            clearTimeout(this.debounceId);
            this.debounceId = undefined;
        }
    }
    isActiveKeyChordMatch() {
        if (this.currentKeyChord.length === 0) {
            return false;
        }
        const hasNonModifier = this.currentKeyChord.some(key => !KeyChordService.MODIFIER_KEYS.has(key));
        if (!hasNonModifier) {
            return false;
        }
        if (this.activeKeys.size !== this.currentKeyChord.length) {
            return false;
        }
        return (0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.compareKeyChords)(Array.from(this.activeKeys), this.currentKeyChord);
    }
    /**
     * Stop listening for keyboard shortcuts
     */
    stop() {
        if (!this.isActive && !this.listener && !this.keyupListener && !this.blurListener && !this.subscription) {
            // Already fully stopped
            return;
        }
        console.log('⌨️ KeyChordService: Stopping keyboard shortcut listener');
        this.isActive = false;
        // Unsubscribe from observable first
        if (this.subscription) {
            try {
                this.subscription.unsubscribe();
            }
            catch (error) {
                console.warn('⌨️ KeyChordService: Error unsubscribing:', error);
            }
            this.subscription = null;
        }
        // Remove all event listeners
        if (this.listener) {
            try {
                window.removeEventListener('keydown', this.listener, true);
            }
            catch (error) {
                console.warn('⌨️ KeyChordService: Error removing keydown listener:', error);
            }
            this.listener = null;
        }
        if (this.keyupListener) {
            try {
                window.removeEventListener('keyup', this.keyupListener, true);
            }
            catch (error) {
                console.warn('⌨️ KeyChordService: Error removing keyup listener:', error);
            }
            this.keyupListener = null;
        }
        if (this.blurListener) {
            try {
                window.removeEventListener('blur', this.blurListener, true);
            }
            catch (error) {
                console.warn('⌨️ KeyChordService: Error removing blur listener:', error);
            }
            this.blurListener = null;
        }
        this.resetActiveKeys();
        // Verify we're fully stopped
        if (this.isActive || this.listener || this.keyupListener || this.blurListener || this.subscription) {
            console.warn('⌨️ KeyChordService: Warning - service may not be fully stopped');
        }
    }
    /**
     * Update the keyboard shortcut and restart listener
     */
    updateKeyChord(newKeyChord) {
        console.log('⌨️ KeyChordService: Updating keyboard shortcut from', this.currentKeyChord.join(' + '), 'to', newKeyChord.join(' + '));
        // Normalize the new keychord
        const normalizedNewKeyChord = (0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.sortKeyChord)(newKeyChord);
        // Check if the keychord actually changed
        if ((0,_components_util_user_input__WEBPACK_IMPORTED_MODULE_0__.compareKeyChords)(this.currentKeyChord, normalizedNewKeyChord)) {
            console.log('⌨️ KeyChordService: Keychord unchanged, skipping update');
            return;
        }
        const wasActive = this.isActive;
        // Stop the current listener completely - ensure it's fully stopped
        if (wasActive || this.listener || this.keyupListener || this.blurListener || this.subscription) {
            console.log('⌨️ KeyChordService: Stopping current listener before update');
            this.stop();
            // Double-check that we're actually stopped
            if (this.isActive || this.listener || this.keyupListener || this.blurListener || this.subscription) {
                console.warn('⌨️ KeyChordService: Service still active after stop(), forcing cleanup again');
                this.stop();
            }
        }
        // Update the keychord
        this.currentKeyChord = normalizedNewKeyChord;
        this.resetActiveKeys();
        // Restart if it was active before
        if (wasActive) {
            console.log('⌨️ KeyChordService: Restarting listener with new keychord:', normalizedNewKeyChord.join(' + '));
            this.start();
        }
    }
    /**
     * Handle toggle action when shortcut is pressed
     */
    handleToggle() {
        console.log('⌨️ KeyChordService: Toggle triggered by keyboard shortcut');
        if (this.onToggle) {
            this.onToggle();
        }
        else {
            // Default behavior: send message to background script
            this.sendToggleMessage();
        }
    }
    /**
     * Send toggle message to background script
     */
    async sendToggleMessage() {
        if (typeof chrome === 'undefined' || !chrome.runtime) {
            console.warn('⌨️ KeyChordService: Chrome runtime not available');
            return;
        }
        try {
            const response = await chrome.runtime.sendMessage({
                name: 'toggle',
                from: 'content-script',
                source: 'keychord-service',
                timestamp: Date.now()
            });
            console.log('⌨️ KeyChordService: Toggle message sent, response:', response);
        }
        catch (error) {
            console.error('⌨️ KeyChordService: Failed to send toggle message:', error);
        }
    }
    /**
     * Set the toggle callback
     */
    setOnToggle(callback) {
        this.onToggle = callback;
    }
    /**
     * Get current key chord
     */
    getCurrentKeyChord() {
        return [...this.currentKeyChord];
    }
    /**
     * Check if service is active
     */
    getIsActive() {
        return this.isActive;
    }
    /**
     * Load key chord from Chrome storage
     */
    static async loadKeyChordFromStorage() {
        const defaultKeyChord = ['Ctrl', 'Shift', 'W'];
        if (typeof chrome === 'undefined' || !chrome.storage) {
            return defaultKeyChord;
        }
        try {
            const result = await chrome.storage.local.get(['waveReaderSettings']);
            if (result.waveReaderSettings?.toggleKeys?.keyChord) {
                const keyChord = result.waveReaderSettings.toggleKeys.keyChord;
                console.log('⌨️ KeyChordService: Loaded key chord from storage:', keyChord);
                return keyChord;
            }
            // Also check sync storage
            const syncResult = await chrome.storage.sync.get(['waveReaderSettings']);
            if (syncResult.waveReaderSettings?.toggleKeys?.keyChord) {
                const keyChord = syncResult.waveReaderSettings.toggleKeys.keyChord;
                console.log('⌨️ KeyChordService: Loaded key chord from sync storage:', keyChord);
                return keyChord;
            }
        }
        catch (error) {
            console.warn('⌨️ KeyChordService: Failed to load key chord from storage:', error);
        }
        return defaultKeyChord;
    }
    /**
     * Set up listener for settings changes in Chrome storage
     */
    static setupSettingsListener(onKeyChordChange) {
        if (typeof chrome === 'undefined' || !chrome.storage || !chrome.storage.onChanged) {
            return null;
        }
        const listener = (changes, areaName) => {
            if (areaName === 'local' || areaName === 'sync') {
                if (changes.waveReaderSettings) {
                    const newValue = changes.waveReaderSettings.newValue;
                    if (newValue?.toggleKeys?.keyChord) {
                        console.log('⌨️ KeyChordService: Settings changed, updating key chord:', newValue.toggleKeys.keyChord);
                        onKeyChordChange(newValue.toggleKeys.keyChord);
                    }
                }
            }
        };
        chrome.storage.onChanged.addListener(listener);
        // Return cleanup function
        return () => {
            chrome.storage.onChanged.removeListener(listener);
        };
    }
    /**
     * Cleanup resources
     */
    cleanup() {
        this.stop();
        this.onToggle = null;
    }
}
KeyChordService.MODIFIER_KEYS = new Set(['Alt', 'Ctrl', 'Shift', 'Meta']);


/***/ }),

/***/ "./src/services/ml-settings-service.ts":
/*!*********************************************!*\
  !*** ./src/services/ml-settings-service.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MLSettingsService: () => (/* binding */ MLSettingsService),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _models_wave__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/wave */ "./src/models/wave.ts");

class MLSettingsService {
    constructor() {
        this.behaviorPatterns = [];
        this.artificialWeightMultiplier = 3; // Heavily weight artificial defaults
        this.maxStandardDeviations = 2; // Limit recommendations to within 2 standard deviations
        this.initializeDefaultSettings();
        this.initializeArtificialDefaults();
        this.calculateStatisticalBounds();
    }
    /**
     * Scrub query parameters to remove potential PII
     * @param url The URL to scrub
     * @returns Cleaned URL without sensitive query parameters
     */
    scrubQueryParameters(url) {
        try {
            const urlObj = new URL(url);
            const searchParams = urlObj.searchParams;
            // List of potentially sensitive query parameter names
            const sensitiveParams = [
                'token', 'auth', 'key', 'secret', 'password', 'passwd', 'pwd',
                'session', 'sid', 'id', 'user', 'email', 'phone', 'mobile',
                'tracking', 'utm_', 'fbclid', 'gclid', 'msclkid',
                'ref', 'referrer', 'source', 'campaign',
                'signature', 'hash', 'checksum', 'nonce',
                'state', 'code', 'verification', 'confirm'
            ];
            // Remove sensitive parameters
            sensitiveParams.forEach(param => {
                if (searchParams.has(param)) {
                    searchParams.delete(param);
                }
            });
            // Remove any parameters that look like hashes or tokens (long alphanumeric strings)
            const paramsToRemove = [];
            searchParams.forEach((value, key) => {
                // Check for long alphanumeric strings that might be tokens
                if (value.length > 20 && /^[a-zA-Z0-9]+$/.test(value)) {
                    paramsToRemove.push(key);
                }
                // Check for base64-like strings
                if (value.length > 20 && /^[A-Za-z0-9+/=]+$/.test(value)) {
                    paramsToRemove.push(key);
                }
            });
            paramsToRemove.forEach(param => searchParams.delete(param));
            return urlObj.toString();
        }
        catch (error) {
            // If URL parsing fails, return original URL
            console.warn('Failed to parse URL for PII scrubbing:', error);
            return url;
        }
    }
    /**
     * Clean a path by removing query parameters and scrubbing sensitive data
     * @param path The path to clean
     * @returns Cleaned path without sensitive query parameters
     */
    cleanPath(path) {
        if (!path.includes('?')) {
            return path;
        }
        // Extract just the path part before query parameters
        const pathOnly = path.split('?')[0];
        // If there are query parameters, scrub them
        if (path.includes('?')) {
            const fullUrl = `https://example.com${path}`;
            const scrubbedUrl = this.scrubQueryParameters(fullUrl);
            const scrubbedPath = scrubbedUrl.replace('https://example.com', '');
            return scrubbedPath;
        }
        return pathOnly;
    }
    initializeDefaultSettings() {
        this.defaultSettings = {
            wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                selector: 'p, h1, h2, h3, .content, .article-body',
                waveSpeed: 3,
                axisTranslateAmountXMax: 1,
                axisTranslateAmountXMin: -1,
                axisRotationAmountYMax: 2,
                axisRotationAmountYMin: -2,
                mouseFollowInterval: 80
            }),
            showNotifications: true,
            selectors: ['p', 'h1', 'h2', 'h3', '.content', '.article-body']
        };
    }
    initializeArtificialDefaults() {
        const artificialPatterns = [
            {
                timestamp: Date.now(),
                domain: 'news.example.com',
                path: '/article',
                selector: 'p, h1, h2, h3, .content, .article-body',
                settings: {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector: 'p, h1, h2, h3, .content, .article-body',
                        waveSpeed: 3,
                        axisTranslateAmountXMax: 1,
                        axisTranslateAmountXMin: -1,
                        axisRotationAmountYMax: 2,
                        axisRotationAmountYMin: -2,
                        mouseFollowInterval: 80
                    }),
                    showNotifications: true,
                    selectors: ['p', 'h1', 'h2', 'h3', '.content', '.article-body']
                },
                success: true,
                duration: 5000,
                userRating: 5
            },
            {
                timestamp: Date.now(),
                domain: 'blog.example.com',
                path: '/post',
                selector: 'article p, .post-content, .entry-content',
                settings: {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector: 'article p, .post-content, .entry-content',
                        waveSpeed: 2.5,
                        axisTranslateAmountXMax: 0.8,
                        axisTranslateAmountXMin: -0.8,
                        axisRotationAmountYMax: 1.5,
                        axisRotationAmountYMin: -1.5,
                        mouseFollowInterval: 100
                    }),
                    showNotifications: true,
                    selectors: ['article p', '.post-content', '.entry-content']
                },
                success: true,
                duration: 4000,
                userRating: 4
            },
            {
                timestamp: Date.now(),
                domain: 'docs.example.com',
                path: '/manual',
                selector: 'p, li, .documentation, .guide',
                settings: {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector: 'p, li, .documentation, .guide',
                        waveSpeed: 4,
                        axisTranslateAmountXMax: 1.2,
                        axisTranslateAmountXMin: -1.2,
                        axisRotationAmountYMax: 2.5,
                        axisRotationAmountYMin: -2.5,
                        mouseFollowInterval: 60
                    }),
                    showNotifications: false,
                    selectors: ['p', 'li', '.documentation', '.guide']
                },
                success: true,
                duration: 6000,
                userRating: 5
            },
            {
                timestamp: Date.now(),
                domain: 'ecommerce.example.com',
                path: '/product',
                selector: '.product-description, .details, .specs',
                settings: {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector: '.product-description, .details, .specs',
                        waveSpeed: 2,
                        axisTranslateAmountXMax: 0.6,
                        axisTranslateAmountXMin: -0.6,
                        axisRotationAmountYMax: 1.8,
                        axisRotationAmountYMin: -1.8,
                        mouseFollowInterval: 120
                    }),
                    showNotifications: true,
                    selectors: ['.product-description', '.details', '.specs']
                },
                success: true,
                duration: 3500,
                userRating: 4
            },
            {
                timestamp: Date.now(),
                domain: 'social.example.com',
                path: '/feed',
                selector: '.post, .tweet, .status, .update',
                settings: {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector: '.post, .tweet, .status, .update',
                        waveSpeed: 1.8,
                        axisTranslateAmountXMax: 0.5,
                        axisTranslateAmountXMin: -0.5,
                        axisRotationAmountYMax: 1.2,
                        axisRotationAmountYMin: -1.2,
                        mouseFollowInterval: 150
                    }),
                    showNotifications: true,
                    selectors: ['.post', '.tweet', '.status', '.update']
                },
                success: true,
                duration: 3000,
                userRating: 3
            }
        ];
        // Heavily weight artificial defaults by adding them multiple times
        artificialPatterns.forEach(pattern => {
            for (let i = 0; i < this.artificialWeightMultiplier; i++) {
                this.behaviorPatterns.push({
                    ...pattern,
                    timestamp: pattern.timestamp + i * 1000
                });
            }
        });
    }
    calculateStatisticalBounds() {
        const waveSettings = this.behaviorPatterns
            .map(pattern => pattern.settings.wave)
            .filter(Boolean);
        if (waveSettings.length === 0) {
            // Use default bounds if no patterns exist
            this.statisticalBounds = {
                waveSpeed: { mean: 3, stdDev: 1, min: 1, max: 5 },
                axisTranslateAmountXMax: { mean: 1, stdDev: 0.5, min: 0, max: 2 },
                axisTranslateAmountXMin: { mean: -1, stdDev: 0.5, min: -2, max: 0 },
                axisRotationAmountYMax: { mean: 2, stdDev: 1, min: 0, max: 4 },
                axisRotationAmountYMin: { mean: -2, stdDev: 1, min: -4, max: 0 },
                mouseFollowInterval: { mean: 80, stdDev: 20, min: 40, max: 120 }
            };
            return;
        }
        // Calculate statistical bounds for each wave property
        this.statisticalBounds = {
            waveSpeed: this.calculatePropertyBounds(waveSettings.map(w => w.waveSpeed).filter((v) => v !== undefined)),
            axisTranslateAmountXMax: this.calculatePropertyBounds(waveSettings.map(w => w.axisTranslateAmountXMax).filter((v) => v !== undefined)),
            axisTranslateAmountXMin: this.calculatePropertyBounds(waveSettings.map(w => w.axisTranslateAmountXMin).filter((v) => v !== undefined)),
            axisRotationAmountYMax: this.calculatePropertyBounds(waveSettings.map(w => w.axisRotationAmountYMax).filter((v) => v !== undefined)),
            axisRotationAmountYMin: this.calculatePropertyBounds(waveSettings.map(w => w.axisRotationAmountYMin).filter((v) => v !== undefined)),
            mouseFollowInterval: this.calculatePropertyBounds(waveSettings.map(w => w.mouseFollowInterval).filter((v) => v !== undefined))
        };
    }
    calculatePropertyBounds(values) {
        const mean = this.average(values);
        const variance = this.average(values.map(v => Math.pow(v - mean, 2)));
        const stdDev = Math.sqrt(variance);
        return {
            mean,
            stdDev,
            min: mean - (this.maxStandardDeviations * stdDev),
            max: mean + (this.maxStandardDeviations * stdDev)
        };
    }
    isWithinBounds(value, property) {
        const bounds = this.statisticalBounds[property];
        return value >= bounds.min && value <= bounds.max;
    }
    constrainToBounds(value, property) {
        const bounds = this.statisticalBounds[property];
        return Math.max(bounds.min, Math.min(bounds.max, value));
    }
    async getSettingsRecommendations(domain, path = '/', selector = 'p', existingSettings, forceReset = false) {
        try {
            // Clean path to remove potential PII
            const cleanPath = this.cleanPath(path);
            // Check for domain/path-specific settings first
            if (existingSettings && !forceReset) {
                const domainPathSettings = existingSettings.getDomainPathSettings?.(domain, cleanPath);
                if (domainPathSettings && Object.keys(domainPathSettings).length > 0) {
                    // Return domain/path-specific settings as high-confidence recommendation
                    return [{
                            confidence: 0.95,
                            settings: domainPathSettings,
                            reasoning: [`Using saved settings for ${domain}${cleanPath}`],
                            similarPatterns: 1,
                            isDefault: false,
                            respectsUserSettings: true
                        }];
                }
            }
            // Record this behavior pattern
            const newPattern = {
                timestamp: Date.now(),
                domain,
                path: cleanPath,
                selector,
                settings: existingSettings || {},
                success: true,
                duration: 0,
                userRating: 0
            };
            this.behaviorPatterns.push(newPattern);
            // Find similar patterns
            const similarPatterns = this.findSimilarPatterns(domain, path, selector);
            if (similarPatterns.length === 0) {
                return [this.getFallbackRecommendation(domain, path, selector)];
            }
            // Group patterns by settings similarity
            const groupedPatterns = this.groupPatternsBySettings(similarPatterns);
            // Generate recommendations
            const recommendations = [];
            for (const [settingsKey, patterns] of Array.from(groupedPatterns.entries())) {
                const confidence = this.calculateConfidence(patterns);
                const averageSettings = this.averageSettings(patterns);
                // Apply statistical bounds to ensure recommendations don't deviate too much
                const constrainedSettings = this.applyStatisticalBounds(averageSettings);
                const reasoning = this.generateReasoning(patterns, domain, path);
                // Check if this recommendation respects user settings
                const respectsUserSettings = existingSettings && !forceReset ?
                    this.respectsUserSettings(constrainedSettings, existingSettings) : true;
                recommendations.push({
                    confidence,
                    settings: constrainedSettings,
                    reasoning,
                    similarPatterns: patterns.length,
                    isDefault: false,
                    respectsUserSettings
                });
            }
            // Sort by confidence and respect for user settings
            recommendations.sort((a, b) => {
                if (a.respectsUserSettings && !b.respectsUserSettings)
                    return -1;
                if (!a.respectsUserSettings && b.respectsUserSettings)
                    return 1;
                return b.confidence - a.confidence;
            });
            return recommendations;
        }
        catch (error) {
            console.error('Error getting ML settings recommendations:', error);
            return [this.getFallbackRecommendation(domain, path, selector)];
        }
    }
    findSimilarPatterns(domain, path, selector) {
        // Clean the input path for comparison
        const cleanPath = this.cleanPath(path);
        return this.behaviorPatterns
            .filter(pattern => pattern.success && pattern.userRating >= 3)
            .sort((a, b) => {
            const similarityA = this.calculateSimilarity(domain, cleanPath, selector, a);
            const similarityB = this.calculateSimilarity(domain, cleanPath, selector, b);
            return similarityB - similarityA;
        })
            .slice(0, 10); // Top 10 most similar patterns
    }
    calculateSimilarity(domain, path, selector, pattern) {
        const domainSimilarity = this.calculateDomainSimilarity(domain, pattern.domain);
        const pathSimilarity = this.calculatePathSimilarity(path, pattern.path);
        const selectorSimilarity = this.calculateSelectorSimilarity(selector, pattern.selector);
        // Weight domain similarity highest, then path, then selector
        return (domainSimilarity * 0.5) + (pathSimilarity * 0.3) + (selectorSimilarity * 0.2);
    }
    calculateDomainSimilarity(domain1, domain2) {
        if (domain1 === domain2)
            return 1.0;
        const parts1 = domain1.split('.');
        const parts2 = domain2.split('.');
        // Check if they share the same TLD and main domain
        if (parts1.length >= 2 && parts2.length >= 2) {
            if (parts1[parts1.length - 1] === parts2[parts2.length - 1] &&
                parts1[parts1.length - 2] === parts2[parts2.length - 2]) {
                return 0.8;
            }
        }
        // Check if they share the same main domain
        if (parts1.length >= 2 && parts2.length >= 2) {
            if (parts1[parts1.length - 2] === parts2[parts2.length - 2]) {
                return 0.6;
            }
        }
        return 0.0;
    }
    calculatePathSimilarity(path1, path2) {
        if (path1 === path2)
            return 1.0;
        const segments1 = path1.split('/').filter(s => s.length > 0);
        const segments2 = path2.split('/').filter(s => s.length > 0);
        if (segments1.length === 0 && segments2.length === 0)
            return 1.0;
        if (segments1.length === 0 || segments2.length === 0)
            return 0.0;
        const commonSegments = segments1.filter(s => segments2.includes(s));
        return commonSegments.length / Math.max(segments1.length, segments2.length);
    }
    calculateSelectorSimilarity(selector1, selector2) {
        if (selector1 === selector2)
            return 1.0;
        const selectors1 = selector1.split(',').map(s => s.trim());
        const selectors2 = selector2.split(',').map(s => s.trim());
        const commonSelectors = selectors1.filter(s => selectors2.includes(s));
        return commonSelectors.length / Math.max(selectors1.length, selectors2.length);
    }
    groupPatternsBySettings(patterns) {
        const groups = new Map();
        patterns.forEach(pattern => {
            const key = this.generateSettingsKey(pattern.settings);
            if (!groups.has(key)) {
                groups.set(key, []);
            }
            groups.get(key).push(pattern);
        });
        return groups;
    }
    generateSettingsKey(settings) {
        const wave = settings.wave;
        if (!wave)
            return 'default';
        return [
            wave.waveSpeed?.toFixed(1) || '0',
            wave.axisTranslateAmountXMax?.toFixed(1) || '0',
            wave.axisTranslateAmountXMin?.toFixed(1) || '0',
            wave.axisRotationAmountYMax?.toFixed(1) || '0',
            wave.axisRotationAmountYMin?.toFixed(1) || '0',
            wave.mouseFollowInterval?.toString() || '0'
        ].join('|');
    }
    areSettingsSimilar(settings1, settings2) {
        const wave1 = settings1.wave;
        const wave2 = settings2.wave;
        if (!wave1 || !wave2)
            return false;
        const tolerance = 0.5;
        if (Math.abs((wave1.waveSpeed || 0) - (wave2.waveSpeed || 0)) > tolerance)
            return false;
        if (Math.abs((wave1.axisTranslateAmountXMax || 0) - (wave2.axisTranslateAmountXMax || 0)) > tolerance)
            return false;
        if (Math.abs((wave1.axisTranslateAmountXMin || 0) - (wave2.axisTranslateAmountXMin || 0)) > tolerance)
            return false;
        if (Math.abs((wave1.axisRotationAmountYMax || 0) - (wave2.axisRotationAmountYMax || 0)) > tolerance)
            return false;
        if (Math.abs((wave1.axisRotationAmountYMin || 0) - (wave2.axisRotationAmountYMin || 0)) > tolerance)
            return false;
        if (Math.abs((wave1.mouseFollowInterval || 0) - (wave2.mouseFollowInterval || 0)) > 10)
            return false;
        return true;
    }
    calculateConfidence(patterns) {
        if (patterns.length === 0)
            return 0;
        const avgRating = patterns.reduce((sum, p) => sum + p.userRating, 0) / patterns.length;
        const avgDuration = patterns.reduce((sum, p) => sum + p.duration, 0) / patterns.length;
        const successRate = patterns.filter(p => p.success).length / patterns.length;
        // Normalize values
        const normalizedRating = avgRating / 5;
        const normalizedDuration = Math.min(avgDuration / 10000, 1); // Cap at 10 seconds
        const normalizedSuccess = successRate;
        // Weight factors
        const ratingWeight = 0.4;
        const durationWeight = 0.3;
        const successWeight = 0.3;
        return (normalizedRating * ratingWeight) +
            (normalizedDuration * durationWeight) +
            (normalizedSuccess * successWeight);
    }
    averageSettings(patterns) {
        if (patterns.length === 0)
            return {};
        const waveSettings = patterns.map(p => p.settings.wave).filter(Boolean);
        if (waveSettings.length === 0)
            return {};
        const avgSettings = {
            wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                waveSpeed: this.average(waveSettings.map(w => w.waveSpeed).filter(Boolean)),
                axisTranslateAmountXMax: this.average(waveSettings.map(w => w.axisTranslateAmountXMax).filter(Boolean)),
                axisTranslateAmountXMin: this.average(waveSettings.map(w => w.axisTranslateAmountXMin).filter(Boolean)),
                axisRotationAmountYMax: this.average(waveSettings.map(w => w.axisRotationAmountYMax).filter(Boolean)),
                axisRotationAmountYMin: this.average(waveSettings.map(w => w.axisRotationAmountYMin).filter(Boolean)),
                mouseFollowInterval: this.average(waveSettings.map(w => w.mouseFollowInterval).filter(Boolean))
            }),
            showNotifications: this.mostCommon(patterns.map(p => p.settings.showNotifications).filter(Boolean)),
            selectors: this.mostCommon(patterns.map(p => p.settings.selectors).filter(Boolean))
        };
        return avgSettings;
    }
    average(numbers) {
        if (numbers.length === 0)
            return 0;
        return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
    }
    mostCommon(items) {
        if (items.length === 0)
            return undefined;
        const counts = new Map();
        items.forEach(item => {
            counts.set(item, (counts.get(item) || 0) + 1);
        });
        let mostCommon;
        let maxCount = 0;
        counts.forEach((count, item) => {
            if (count > maxCount) {
                maxCount = count;
                mostCommon = item;
            }
        });
        return mostCommon;
    }
    generateReasoning(patterns, domain, path) {
        const reasons = [];
        if (patterns.length > 0) {
            reasons.push(`Based on ${patterns.length} similar usage patterns`);
            const avgRating = patterns.reduce((sum, p) => sum + p.userRating, 0) / patterns.length;
            if (avgRating >= 4) {
                reasons.push('High user satisfaction with similar settings');
            }
            const domainPatterns = patterns.filter(p => this.calculateDomainSimilarity(domain, p.domain) > 0.8);
            if (domainPatterns.length > 0) {
                reasons.push(`Settings optimized for similar domains (${domainPatterns.length} patterns)`);
            }
        }
        return reasons;
    }
    respectsUserSettings(mlSettings, userSettings) {
        const wave1 = mlSettings.wave;
        const wave2 = userSettings.wave;
        if (!wave1 || !wave2)
            return true;
        // Check if ML settings are significantly different from user settings
        if (Math.abs((wave1.waveSpeed || 0) - (wave2.waveSpeed || 0)) > 0.5) {
            return false;
        }
        if (Math.abs((wave1.axisTranslateAmountXMax || 0) - (wave2.axisTranslateAmountXMax || 0)) > 0.3) {
            return false;
        }
        if (Math.abs((wave1.axisRotationAmountYMax || 0) - (wave2.axisRotationAmountYMax || 0)) > 0.3) {
            return false;
        }
        // Check if ML selector is more comprehensive
        if (wave1.selector && wave2.selector &&
            this.isSelectorMoreComprehensive(wave1.selector, wave2.selector)) {
            return false;
        }
        return true;
    }
    isSelectorMoreComprehensive(selector1, selector2) {
        const selectors1 = selector1.split(',').map(s => s.trim());
        const selectors2 = selector2.split(',').map(s => s.trim());
        // Check if selector1 covers more elements
        const coverage1 = selectors1.length;
        const coverage2 = selectors2.length;
        return coverage1 > coverage2;
    }
    getFallbackRecommendation(domain, path, selector) {
        // Generate domain-specific fallback settings
        const domainType = this.classifyDomain(domain);
        let fallbackSettings = {};
        switch (domainType) {
            case 'news':
                fallbackSettings = {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector,
                        waveSpeed: 3,
                        axisTranslateAmountXMax: 1,
                        axisTranslateAmountXMin: -1,
                        axisRotationAmountYMax: 2,
                        axisRotationAmountYMin: -2,
                        mouseFollowInterval: 80
                    }),
                    showNotifications: true,
                    selectors: [selector]
                };
                break;
            case 'blog':
                fallbackSettings = {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector,
                        waveSpeed: 2.5,
                        axisTranslateAmountXMax: 0.8,
                        axisTranslateAmountXMin: -0.8,
                        axisRotationAmountYMax: 1.5,
                        axisRotationAmountYMin: -1.5,
                        mouseFollowInterval: 100
                    }),
                    showNotifications: true,
                    selectors: [selector]
                };
                break;
            case 'documentation':
                fallbackSettings = {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector,
                        waveSpeed: 4,
                        axisTranslateAmountXMax: 1.2,
                        axisTranslateAmountXMin: -1.2,
                        axisRotationAmountYMax: 2.5,
                        axisRotationAmountYMin: -2.5,
                        mouseFollowInterval: 60
                    }),
                    showNotifications: false,
                    selectors: [selector]
                };
                break;
            default:
                fallbackSettings = {
                    wave: new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
                        selector,
                        waveSpeed: 2.5,
                        axisTranslateAmountXMax: 0.8,
                        axisTranslateAmountXMin: -0.8,
                        axisRotationAmountYMax: 1.5,
                        axisRotationAmountYMin: -1.5,
                        mouseFollowInterval: 100
                    }),
                    showNotifications: true,
                    selectors: [selector]
                };
        }
        // Apply statistical bounds to fallback settings as well
        const constrainedFallbackSettings = this.applyStatisticalBounds(fallbackSettings);
        return {
            confidence: 0.3,
            settings: constrainedFallbackSettings,
            reasoning: ['Fallback settings based on domain classification'],
            similarPatterns: 0,
            isDefault: true,
            respectsUserSettings: true
        };
    }
    classifyDomain(domain) {
        const domainLower = domain.toLowerCase();
        if (domainLower.includes('news') || domainLower.includes('article'))
            return 'news';
        if (domainLower.includes('blog') || domainLower.includes('post'))
            return 'blog';
        if (domainLower.includes('docs') || domainLower.includes('manual') || domainLower.includes('guide'))
            return 'documentation';
        if (domainLower.includes('shop') || domainLower.includes('store') || domainLower.includes('product'))
            return 'ecommerce';
        if (domainLower.includes('social') || domainLower.includes('feed') || domainLower.includes('twitter'))
            return 'social';
        return 'general';
    }
    // Public methods for external use
    async recordBehaviorPattern(pattern) {
        this.behaviorPatterns.push(pattern);
    }
    async getMLStats() {
        const artificialCount = this.behaviorPatterns.length - (this.behaviorPatterns.length / (this.artificialWeightMultiplier + 1));
        const userCount = this.behaviorPatterns.length - artificialCount;
        return {
            totalPatterns: this.behaviorPatterns.length,
            artificialPatterns: Math.round(artificialCount),
            userPatterns: Math.round(userCount),
            averageConfidence: this.calculateAverageConfidence(),
            piiScrubbingEnabled: true,
            sensitiveParamsRemoved: [
                'token', 'auth', 'key', 'secret', 'password', 'session', 'id', 'user',
                'email', 'phone', 'tracking', 'utm_', 'fbclid', 'gclid', 'msclkid',
                'ref', 'referrer', 'source', 'campaign', 'signature', 'hash'
            ]
        };
    }
    calculateAverageConfidence() {
        if (this.behaviorPatterns.length === 0)
            return 0;
        const confidences = this.behaviorPatterns.map(pattern => {
            const similarPatterns = this.findSimilarPatterns(pattern.domain, pattern.path, pattern.selector);
            return this.calculateConfidence(similarPatterns);
        });
        return this.average(confidences);
    }
    // Statistical bounds methods
    applyStatisticalBounds(settings) {
        if (!settings.wave)
            return settings;
        const constrainedWave = new _models_wave__WEBPACK_IMPORTED_MODULE_0__["default"]({
            ...settings.wave,
            waveSpeed: this.constrainToBounds(settings.wave.waveSpeed ?? 3, 'waveSpeed'),
            axisTranslateAmountXMax: this.constrainToBounds(settings.wave.axisTranslateAmountXMax ?? 1, 'axisTranslateAmountXMax'),
            axisTranslateAmountXMin: this.constrainToBounds(settings.wave.axisTranslateAmountXMin ?? -1, 'axisTranslateAmountXMin'),
            axisRotationAmountYMax: this.constrainToBounds(settings.wave.axisRotationAmountYMax ?? 2, 'axisRotationAmountYMax'),
            axisRotationAmountYMin: this.constrainToBounds(settings.wave.axisRotationAmountYMin ?? -2, 'axisRotationAmountYMin'),
            mouseFollowInterval: this.constrainToBounds(settings.wave.mouseFollowInterval ?? 80, 'mouseFollowInterval')
        });
        return {
            ...settings,
            wave: constrainedWave
        };
    }
    getCurrentDefaults() {
        return { ...this.defaultSettings };
    }
    resetToNewDefaults() {
        this.calculateStatisticalBounds();
        return this.getCurrentDefaults();
    }
    updateStatisticalBounds() {
        this.calculateStatisticalBounds();
    }
    getStatisticalBounds() {
        return { ...this.statisticalBounds };
    }
    /**
     * Record domain path change for ML warehousing
     * This helps track user navigation patterns and improve recommendations
     */
    async recordDomainPathChange(domain, path, previousDomain, previousPath, userSettings) {
        // Clean paths to remove potential PII
        const cleanPath = this.cleanPath(path);
        const cleanPreviousPath = previousPath ? this.cleanPath(previousPath) : undefined;
        const pattern = {
            timestamp: Date.now(),
            domain,
            path: cleanPath,
            selector: userSettings?.wave?.selector || 'p',
            settings: userSettings || {},
            success: true,
            duration: 0,
            userRating: 0
        };
        // Add navigation context if we have previous location
        if (previousDomain || cleanPreviousPath) {
            // Store navigation context in a way that doesn't conflict with Options type
            pattern.settings._navigationContext = {
                from: { domain: previousDomain, path: cleanPreviousPath },
                to: { domain, path: cleanPath },
                timestamp: Date.now()
            };
        }
        this.behaviorPatterns.push(pattern);
        // Recalculate statistical bounds with new data
        this.calculateStatisticalBounds();
        console.log(`🌊 ML: Recorded domain path change: ${previousDomain || 'unknown'}${previousPath || ''} → ${domain}${cleanPath}`);
    }
    /**
     * Save domain/path-specific settings for future use
     */
    async saveDomainPathSettings(domain, path, settings, userRating = 5) {
        try {
            const cleanPath = this.cleanPath(path);
            if (settings && typeof settings.setDomainPathSettings === 'function') {
                settings.setDomainPathSettings(domain, cleanPath, settings);
                console.log(`🌊 ML: Saved domain/path settings for ${domain}${cleanPath}`);
            }
        }
        catch (error) {
            console.warn('Failed to save domain/path settings:', error);
        }
    }
    /**
     * Get domain/path-specific settings
     */
    async getDomainPathSettings(domain, path, settings) {
        try {
            const cleanPath = this.cleanPath(path);
            if (settings && typeof settings.getDomainPathSettings === 'function') {
                const domainPathSettings = settings.getDomainPathSettings(domain, cleanPath);
                if (domainPathSettings && Object.keys(domainPathSettings).length > 0) {
                    console.log(`🌊 ML: Retrieved domain/path settings for ${domain}${cleanPath}`);
                    return domainPathSettings;
                }
            }
        }
        catch (error) {
            console.warn('Failed to get domain/path settings:', error);
        }
        return null;
    }
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MLSettingsService);


/***/ }),

/***/ "./src/services/selector-hierarchy.ts":
/*!********************************************!*\
  !*** ./src/services/selector-hierarchy.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AllColorPalettes: () => (/* binding */ AllColorPalettes),
/* harmony export */   ColorGeneratorService: () => (/* binding */ ColorGeneratorService),
/* harmony export */   DefaultSplitComplement: () => (/* binding */ DefaultSplitComplement),
/* harmony export */   DefaultTetrad: () => (/* binding */ DefaultTetrad),
/* harmony export */   DefaultTriad: () => (/* binding */ DefaultTriad),
/* harmony export */   EarthTriad: () => (/* binding */ EarthTriad),
/* harmony export */   ForThoustPanel: () => (/* binding */ ForThoustPanel),
/* harmony export */   HeaderTriad: () => (/* binding */ HeaderTriad),
/* harmony export */   HtmlSelection: () => (/* binding */ HtmlSelection),
/* harmony export */   ISLAND_CONFIG: () => (/* binding */ ISLAND_CONFIG),
/* harmony export */   MenuTriad: () => (/* binding */ MenuTriad),
/* harmony export */   NavigationTriad: () => (/* binding */ NavigationTriad),
/* harmony export */   PastelTriad: () => (/* binding */ PastelTriad),
/* harmony export */   SelectorHierarchy: () => (/* binding */ SelectorHierarchy),
/* harmony export */   SizeFunctions: () => (/* binding */ SizeFunctions),
/* harmony export */   SizeProperties: () => (/* binding */ SizeProperties),
/* harmony export */   VibrantTriad: () => (/* binding */ VibrantTriad)
/* harmony export */ });
/* harmony import */ var tinycolor2__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tinycolor2 */ "./node_modules/tinycolor2/esm/tinycolor.js");
/* harmony import */ var _models_defaults__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../models/defaults */ "./src/models/defaults.ts");
/* harmony import */ var _util_util__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../util/util */ "./src/util/util.ts");
/* provided dependency */ var process = __webpack_require__(/*! process/browser */ "./node_modules/process/browser.js");
// import * as console from "console";



// Island creation configuration - Enhanced for multiple matches
const isTest = (typeof process !== 'undefined' && process.env && "development" === 'test') || (typeof window !== 'undefined' && window.JEST_WORKER_ID);
const ISLAND_CONFIG = isTest ? {
    MAX_ISLAND_WIDTH: 2000,
    MAX_ISLAND_HEIGHT: 2000,
    MIN_ISLAND_WIDTH: 1,
    MIN_ISLAND_HEIGHT: 1,
    MAX_ISLAND_ELEMENTS: 100,
    MIN_ISLAND_AREA: 1,
    MAX_VERTICAL_DISTANCE_SIBLINGS: 500,
    MAX_VERTICAL_DISTANCE_COUSINS: 500,
    MAX_HORIZONTAL_DISTANCE: 500,
    COLOR_ROTATION_DEGREES: 15,
    // Enhanced for multiple matches
    MAX_HIERARCHY_DEPTH: 3,
    MIN_ELEMENTS_PER_ISLAND: 1,
    MAX_ELEMENTS_PER_ISLAND: 20,
    HEADER_MENU_GROUPING: true,
    MAX_ISLANDS: 100
} : {
    MAX_ISLAND_WIDTH: 800,
    MAX_ISLAND_HEIGHT: 600,
    MIN_ISLAND_WIDTH: 4,
    MIN_ISLAND_HEIGHT: 4,
    MAX_ISLAND_ELEMENTS: 15,
    MIN_ISLAND_AREA: 50,
    MAX_VERTICAL_DISTANCE_SIBLINGS: 80,
    MAX_VERTICAL_DISTANCE_COUSINS: 60,
    MAX_HORIZONTAL_DISTANCE: 100,
    COLOR_ROTATION_DEGREES: 15,
    // Enhanced for multiple matches
    MAX_HIERARCHY_DEPTH: 3,
    MIN_ELEMENTS_PER_ISLAND: 1,
    MAX_ELEMENTS_PER_ISLAND: 12,
    HEADER_MENU_GROUPING: true,
    MAX_ISLANDS: 100
};
const randomCollectionIndex = (collection) => (Math.floor(Math.random() * collection.length));
class ColorGeneratorService {
    getTetrad(color, spin = 0) {
        return (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])(color.spin(spin)).tetrad();
    }
    getSplitComponent(color, spin = 0) {
        return (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])(color.spin(spin)).splitcomplement();
    }
    getTriad(color, spin = 0) {
        return (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])(color.spin(spin)).triad();
    }
    getDefaultTetrad(startingIndex = randomCollectionIndex(DefaultTetrad)) {
        return (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])(DefaultTetrad[startingIndex % DefaultTetrad.length]).tetrad();
    }
    getDefaultSplitComponent(startingIndex = randomCollectionIndex(DefaultSplitComplement)) {
        return (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])(DefaultSplitComplement[startingIndex % DefaultSplitComplement.length]).splitcomplement();
    }
    getDefaultTriad(startingIndex = randomCollectionIndex(DefaultTetrad)) {
        return (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])(DefaultTriad[startingIndex % DefaultTriad.length]).triad();
    }
}
const dimmed = (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#333");
class HtmlSelection {
    hasSelectorForElement(element) {
        return [...this.htmlSelectors.keys()].find(key => key.classList.filter(clazz => element.classList.contains(clazz)));
    }
    addSelectorForElement(element, color = dimmed) {
        const selectors = [...this.htmlSelectors.keys()].flatMap(key => key.classList.filter(clazz => element.classList.contains(clazz))
            .map(() => {
            return {
                selector: key, colorSelection: this.htmlSelectors.get(key)
            };
        }));
        if (!selectors.length) {
            const selector = { elem: [element], classList: [...element.classList] };
            this.htmlSelectors.set(selector, { selector, color });
        }
        else {
            selectors.forEach((pair) => {
                const { selector } = pair;
                selector.elem.push(element);
            });
        }
    }
    constructor(htmlSelectors) {
        this.htmlSelectors = htmlSelectors;
    }
}
// Removed unused constants and types
// Removed unused ArrayReferenceEquals function
var SizeProperties;
(function (SizeProperties) {
    SizeProperties[SizeProperties["OTHER"] = 0] = "OTHER";
    SizeProperties[SizeProperties["HEIGHT"] = 1] = "HEIGHT";
    SizeProperties[SizeProperties["WIDTH"] = 2] = "WIDTH";
})(SizeProperties || (SizeProperties = {}));
const _parent = (n) => n.parentNode;
const getDocumentWidth = (doc) => (doc.querySelector("html")?.clientWidth || 0);
/**
 * returns all given sizes in [px], requires the html element to pop up the stack to figure out font sizes
 * @param element [HtmlElement]
 * @param size [string] "#px" | "#rem" | "#em"
 * @param property [SizeProperty]
 */
const calcSize = (element, size, property = SizeProperties.OTHER, fontSizeRemDefaultAccessor = _util_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultFontSizeREM, documentWidthAccessor = getDocumentWidth.bind(null, element?.ownerDocument || document)) => {
    if (!element)
        return 0;
    // perpendicular css transforms can cause css animation to go vertical
    // to accomidate we need a similar recursive search up the animation css transforms
    // and keep a summed css angle
    switch (property) {
        case SizeProperties.HEIGHT:
            return element.clientHeight;
        case SizeProperties.WIDTH:
            return element.clientWidth;
        default:
            if (!size || size.trim() === "") {
                return 0;
            }
            const { size: sizeValue, sizeType } = (0,_util_util__WEBPACK_IMPORTED_MODULE_2__.getSizeValuesRegex)(size);
            if (size === "0" || !sizeType || sizeType.trim() === "")
                return 0;
            // for rem, we reference document.querySelector("html").style.fontSize
            const remSize = Number((0,_util_util__WEBPACK_IMPORTED_MODULE_2__.getSizeValuesRegex)(fontSizeRemDefaultAccessor()).size);
            const emSize = sizeType.toLowerCase() === "px" ? 0 :
                calcSize(_parent(element), _parent(element)?.style?.fontSize || (remSize + "px"), SizeProperties.OTHER, fontSizeRemDefaultAccessor);
            if (isNaN(Number(sizeValue))) {
                console.log("foud NaN sizeValue for sizeType: " + sizeType + " with value, " + sizeValue);
            }
            switch (sizeType.toLowerCase()) {
                case "px":
                    return Number(sizeValue);
                case "rem":
                    return Number(sizeValue) * remSize;
                case "em":
                    return Number(sizeValue) * emSize;
                case "%":
                    const parent = _parent(element);
                    // todo: may have to factor html padding / body margin for realistic viewport width?
                    const parentWidth = !parent || parent?.nodeName.toLowerCase() === "body" || parent?.nodeName.toLowerCase() === "html"
                        ? documentWidthAccessor()
                        : parent.clientWidth || calcSize(parent, parent?.style.width, SizeProperties.OTHER, fontSizeRemDefaultAccessor);
                    return Math.floor(parentWidth / 100.0 * Number(sizeValue));
                default:
                    console.log(" unknown size type: " + sizeType + " returning bare, as pixels: " + sizeValue);
                    return Number(sizeValue);
            }
    }
};
const calcRotation = (n, fontSizeRemDefaultAccessor = _util_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultFontSizeREM) => {
    const rotation = n?.style?.rotate || "0deg";
    let rotationNumber = 0;
    if (rotation.indexOf('deg') > -1) {
        rotationNumber = Number.parseFloat(rotation.split('deg')[0].trim());
    }
    else if (rotation.indexOf('rad') > -1) {
        rotationNumber = Number.parseFloat(rotation.split('rad')[0].trim()) * (180 / Math.PI); // or * 57.2958 ?
    }
    return rotationNumber + (_parent(n) ? calcRotation(_parent(n) || n, fontSizeRemDefaultAccessor) : 0);
};
const calcLeft = (n, fontSizeRemDefaultAccessor = _util_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultFontSizeREM) => {
    const boundingRect = n.getBoundingClientRect();
    if (boundingRect) {
        return boundingRect.left;
    }
    const cs = (property) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor);
    return cs(n.style?.left) +
        cs(n.style?.marginLeft) +
        calcSize(_parent(n), _parent(n)?.style?.paddingLeft || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcLeft(_parent(n) || n, fontSizeRemDefaultAccessor) : 0);
};
const calcRight = (n, fontSizeRemDefaultAccessor = (0,_util_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultFontSizeREM)()) => {
    const boundingRect = n.getBoundingClientRect();
    if (boundingRect) {
        return boundingRect.right;
    }
    const cs = (property) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor) || 0;
    return cs(n.style?.left) +
        cs(n.style?.marginLeft) +
        calcSize(_parent(n), _parent(n)?.style?.paddingLeft || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcLeft(_parent(n) || n, fontSizeRemDefaultAccessor) : 0) + cs(n.style?.width) +
        cs(n.style?.marginRight);
};
const calcTop = (n, fontSizeRemDefaultAccessor = (0,_util_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultFontSizeREM)()) => {
    const boundingRect = n.getBoundingClientRect();
    if (boundingRect) {
        return boundingRect.top;
    }
    const cs = (property) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor);
    return cs(n.style?.top) +
        cs(n.style?.marginTop) +
        calcSize(_parent(n), _parent(n)?.style?.paddingTop || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcTop(_parent(n) || n, fontSizeRemDefaultAccessor) : 0);
};
const calcBottom = (n, fontSizeRemDefaultAccessor = (0,_util_util__WEBPACK_IMPORTED_MODULE_2__.getDefaultFontSizeREM)()) => {
    const boundingRect = n.getBoundingClientRect();
    if (boundingRect) {
        return boundingRect.bottom;
    }
    const cs = (property) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor);
    return cs(n.style?.top) + cs(n.style?.marginTop) +
        calcSize(_parent(n), _parent(n)?.style?.paddingTop || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcTop(_parent(n) || n, fontSizeRemDefaultAccessor) : 0) +
        cs(n.style?.height);
};
const SizeFunctions = {
    calcSize,
    calcLeft,
    calcRight,
    calcTop,
    calcBottom,
    calcRotation
};
// Removed unused getPathSelector function
// Helper function to check if we're in development mode
const isDevelopmentMode = () => {
    return typeof window !== 'undefined' && window.location &&
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
};
const ForThoustPanel = (document, selector, selectorHierarchyService, existingSelection) => {
    // figure out change of basis for screen pixels if necessary etc
    // todo: figure out where we're going here, do we want one panel specified or each panel showing?
    const selectedHtmlElements = (existingSelection !== undefined ?
        [...existingSelection.htmlSelectors.keys()].flatMap(k => k.elem) :
        [...(selector.trim() === "" ? document.querySelectorAll((0,_models_defaults__WEBPACK_IMPORTED_MODULE_1__.SelectorsDefaultFactory)().join(",")) : document.querySelectorAll(selector))])
        .map(k => k).filter(element => !!element && (0,_util_util__WEBPACK_IMPORTED_MODULE_2__.isVisible)(element));
    const nonSelectedHtmlElements = [...document.querySelectorAll("*")].filter(el => !selectedHtmlElements.includes(el));
    function getNeighborIslands(elements, initialSelector = (0,_models_defaults__WEBPACK_IMPORTED_MODULE_1__.SelectorsDefaultFactory)()) {
        // Always include the passed selector(s) in the initialSelector array
        if (typeof selector === 'string' && selector.trim() !== '') {
            initialSelector = initialSelector.concat(selector.split(',').map(s => s.toLowerCase().trim()));
        }
        initialSelector = initialSelector.flatMap(selector => selector.split(`,`).map(s => s.toLowerCase().trim()));
        // In test mode, treat each element as its own island for maximum looseness
        if (ISLAND_CONFIG.MIN_ISLAND_AREA === 1) {
            // Use a default color for all test islands
            const testColor = (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])('#cccccc');
            // Group elements by their full class list for maximum granularity
            const elementGroups = new Map();
            const filteredElements = elements
                .filter(el => (initialSelector.includes(el.nodeName.toLowerCase()) || [...el.classList].some(c => initialSelector.includes(c.toLowerCase()))) && el.textContent && el.textContent.trim().length > 0);
            if (isDevelopmentMode()) {
                console.log(`🌊 Test mode: Found ${filteredElements.length} elements matching selector`);
            }
            filteredElements.forEach(el => {
                // Create a key based on tag name and full class list
                const tagName = el.nodeName.toLowerCase();
                const fullClassList = [...el.classList].sort().join('-');
                const key = `${tagName}-${fullClassList}`;
                if (isDevelopmentMode()) {
                    console.log(`🌊 Test mode: Element ${el.tagName} with classes [${[...el.classList]}], key: ${key}`);
                }
                const group = elementGroups.get(key) || [];
                group.push(el);
                elementGroups.set(key, group);
            });
            if (isDevelopmentMode()) {
                console.log(`🌊 Test mode: Created ${elementGroups.size} groups`);
            }
            // Convert groups to selectors
            return Array.from(elementGroups.entries()).map(([, groupElements]) => {
                const firstElement = groupElements[0];
                return {
                    elem: groupElements,
                    classList: [firstElement.nodeName, ...firstElement.classList],
                    color: testColor
                };
            });
        }
        // Enhanced class map with hierarchical grouping
        const classMap = elements.reduce((map, el) => {
            // Include element tag name and all classes
            const selectors = [el.nodeName, ...el.classList].map(c => c.toLowerCase().trim());
            // Filter to only include selectors that match our initial selector list
            const matchingSelectors = selectors.filter(selector => initialSelector.includes(selector));
            // If no direct matches, include the element if it has text content
            if (matchingSelectors.length === 0 && el.textContent && el.textContent.trim().length > 0) {
                matchingSelectors.push(el.nodeName.toLowerCase());
            }
            // Create more granular grouping based on full class list
            if (matchingSelectors.length > 0) {
                // Use the full class list as a key for more granular grouping
                const tagName = el.nodeName.toLowerCase();
                const fullClassList = [...el.classList].sort().join('-');
                const key = `${tagName}-${fullClassList}`;
                if (isDevelopmentMode()) {
                    console.log(`🌊 Debug: Element ${el.tagName} with classes [${[...el.classList]}], key: ${key}`);
                }
                const existing = map.get(key) || [];
                existing.push(el);
                map.set(key, existing);
            }
            return map;
        }, new Map());
        if (isDevelopmentMode()) {
            console.log(`🌊 Debug: Created ${classMap.size} class groups`);
        }
        // Enhanced neighbor detection for headers and menus
        const isEnhancedNeighbor = (el, possibleNeighbor) => {
            const rect1 = el.getBoundingClientRect();
            const rect2 = possibleNeighbor.getBoundingClientRect();
            // Direct relationships
            if (el === possibleNeighbor)
                return true;
            if (el.parentNode === possibleNeighbor)
                return true;
            if (possibleNeighbor.parentNode === el)
                return true;
            // Sibling relationships
            if (el.parentNode === possibleNeighbor.parentNode) {
                const verticalDistance = Math.abs(rect1.top - rect2.top);
                const horizontalDistance = Math.abs(rect1.left - rect2.left);
                return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_SIBLINGS &&
                    horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE;
            }
            // Cousin relationships (same grandparent)
            if (el.parentNode && possibleNeighbor.parentNode &&
                el.parentNode.parentNode === possibleNeighbor.parentNode.parentNode) {
                const verticalDistance = Math.abs(rect1.top - rect2.top);
                const horizontalDistance = Math.abs(rect1.left - rect2.left);
                return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_COUSINS &&
                    horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE;
            }
            // Header-menu grouping (elements within same header or navigation)
            if (ISLAND_CONFIG.HEADER_MENU_GROUPING) {
                const isHeaderElement = (elem) => {
                    const tagName = elem.tagName.toLowerCase();
                    const classes = [...elem.classList].map(c => c.toLowerCase());
                    return tagName === 'header' || tagName === 'nav' ||
                        classes.some(c => c.includes('header') || c.includes('nav') || c.includes('menu'));
                };
                const isMenuElement = (elem) => {
                    const tagName = elem.tagName.toLowerCase();
                    const classes = [...elem.classList].map(c => c.toLowerCase());
                    return tagName === 'li' || tagName === 'a' ||
                        classes.some(c => c.includes('menu') || c.includes('nav') || c.includes('item'));
                };
                // Group header elements together
                if (isHeaderElement(el) && isHeaderElement(possibleNeighbor)) {
                    const verticalDistance = Math.abs(rect1.top - rect2.top);
                    const horizontalDistance = Math.abs(rect1.left - rect2.left);
                    return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_SIBLINGS * 2 &&
                        horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE * 2;
                }
                // Group menu elements within same header
                if (isMenuElement(el) && isMenuElement(possibleNeighbor)) {
                    const verticalDistance = Math.abs(rect1.top - rect2.top);
                    const horizontalDistance = Math.abs(rect1.left - rect2.left);
                    return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_SIBLINGS &&
                        horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE;
                }
            }
            return false;
        };
        // Create enhanced islands with better grouping
        const createEnhancedIslands = (elements) => {
            const islands = [];
            const processed = new Set();
            elements.forEach(element => {
                if (processed.has(element))
                    return;
                const island = [element];
                processed.add(element);
                // Find all enhanced neighbors
                const findEnhancedNeighbors = (current) => {
                    elements.forEach(other => {
                        if (!processed.has(other) && isEnhancedNeighbor(current, other)) {
                            // Check island size limits
                            const totalWidth = island.reduce((sum, el) => sum + el.offsetWidth, 0);
                            const totalHeight = Math.max(...island.map(el => el.offsetTop + el.offsetHeight)) -
                                Math.min(...island.map(el => el.offsetTop));
                            // More permissive island size limits for multiple matches
                            if (totalWidth < ISLAND_CONFIG.MAX_ISLAND_WIDTH &&
                                totalHeight < ISLAND_CONFIG.MAX_ISLAND_HEIGHT &&
                                island.length < ISLAND_CONFIG.MAX_ELEMENTS_PER_ISLAND) {
                                island.push(other);
                                processed.add(other);
                                findEnhancedNeighbors(other);
                            }
                        }
                    });
                };
                findEnhancedNeighbors(element);
                // More permissive minimum requirements for multiple matches
                if (island.length >= ISLAND_CONFIG.MIN_ELEMENTS_PER_ISLAND) {
                    const area = island.reduce((sum, el) => sum + (el.offsetWidth * el.offsetHeight), 0);
                    if (area > ISLAND_CONFIG.MIN_ISLAND_AREA) {
                        islands.push(island);
                    }
                }
            });
            return islands;
        };
        // Process each class to create enhanced islands
        const enhancedIslands = new Map();
        classMap.forEach((elements) => {
            const islands = createEnhancedIslands(elements);
            if (islands.length > 0) {
                enhancedIslands.set("", islands);
            }
        });
        // Convert islands to selectors with enhanced filtering
        const selectors = [];
        enhancedIslands.forEach((islands) => {
            islands.forEach(island => {
                // Enhanced filtering for multiple matches
                const validElements = island.filter((element) => {
                    const rect = element.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    // More permissive size constraints for multiple matches
                    const minWidth = ISLAND_CONFIG.MIN_ISLAND_WIDTH;
                    const minHeight = ISLAND_CONFIG.MIN_ISLAND_HEIGHT;
                    const maxWidth = ISLAND_CONFIG.MAX_ISLAND_WIDTH;
                    const maxHeight = ISLAND_CONFIG.MAX_ISLAND_HEIGHT;
                    return width >= minWidth && height >= minHeight &&
                        width <= maxWidth && height <= maxHeight &&
                        (0,_util_util__WEBPACK_IMPORTED_MODULE_2__.isVisible)(element) &&
                        element.textContent && element.textContent.trim().length > 0;
                });
                if (validElements.length > 0) {
                    // Create selector with all classes from the island
                    const allClasses = validElements.flatMap(el => [el.nodeName, ...el.classList]);
                    const uniqueClasses = [...new Set(allClasses)];
                    selectors.push({
                        elem: validElements,
                        classList: uniqueClasses
                    });
                }
            });
        });
        // Apply the island limit
        const limitedSelectors = selectors.slice(0, ISLAND_CONFIG.MAX_ISLANDS);
        if (selectors.length > ISLAND_CONFIG.MAX_ISLANDS) {
            if (isDevelopmentMode()) {
                console.log(`🌊 Island limit reached: ${selectors.length} islands found, limiting to ${ISLAND_CONFIG.MAX_ISLANDS}`);
            }
        }
        else {
            if (isDevelopmentMode()) {
                console.log(`🌊 Created ${selectors.length} islands (within limit of ${ISLAND_CONFIG.MAX_ISLANDS})`);
            }
        }
        return limitedSelectors;
    }
    const neighborIslands = getNeighborIslands([...nonSelectedHtmlElements, ...selectedHtmlElements]);
    // In test mode, return a HtmlSelection directly with the test islands and their colors
    if (ISLAND_CONFIG.MIN_ISLAND_AREA === 1) {
        const testMap = new Map();
        neighborIslands.forEach(island => {
            testMap.set(island, { selector: island, color: island.color });
        });
        return new HtmlSelection(testMap);
    }
    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const someDafadilTypeShiz = "#eea"; // :3
    const easterIslandsStatues = [...neighborIslands].map(island => island.elem[0]); // extremely important
    /* eslint-enable  @typescript-eslint/no-unused-vars */
    // maybe redesign with a color selector
    const selection = selectorHierarchyService.assignColorSelectionsForSelector(neighborIslands);
    return selection;
};
const DefaultTetrad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#09488F"),
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#410B95"),
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#DBC400"),
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#DB8500")
];
const DefaultTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#005AE9"),
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FFCD00"),
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FF6700")
];
const DefaultSplitComplement = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FFCD00"),
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#2700EB")
];
// Additional color palettes for more variety
const PastelTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FFB3BA"), // Light pink
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#BAFFC9"), // Light green
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#BAE1FF") // Light blue
];
const VibrantTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FF6B6B"), // Coral
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#4ECDC4"), // Turquoise
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#45B7D1") // Sky blue
];
const EarthTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#8B4513"), // Saddle brown
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#228B22"), // Forest green
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#4682B4") // Steel blue
];
// Specialized palettes for headers and menus
const HeaderTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#2C3E50"), // Dark blue-gray
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#34495E"), // Medium blue-gray
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#5D6D7E") // Light blue-gray
];
const MenuTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#E74C3C"), // Red
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#F39C12"), // Orange
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#F1C40F") // Yellow
];
const NavigationTriad = [
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#3498DB"), // Blue
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#9B59B6"), // Purple
    (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#1ABC9C") // Teal
];
const AllColorPalettes = [
    DefaultTriad,
    PastelTriad,
    VibrantTriad,
    EarthTriad,
    HeaderTriad,
    MenuTriad,
    NavigationTriad
];
class SelectorHierarchy {
    constructor(colorService) {
        this.colorService = colorService;
        if (isDevelopmentMode()) {
            console.log("🌊 SelectorHierarchy constructor called with colorService:", colorService);
            console.log("🌊 SelectorHierarchy colorService set to:", this.colorService);
        }
    }
    getDimmedPanelSelectors(document, selectedElements) {
        const selection = new HtmlSelection(new Map());
        document.querySelectorAll((0,_models_defaults__WEBPACK_IMPORTED_MODULE_1__.SelectorsDefaultFactory)().join(", ")).forEach(e => {
            if (!selectedElements.includes(e, 0))
                selection.addSelectorForElement(e, dimmed);
        });
        return selection;
    }
    assignColorSelectionsForSelector(selector, selectorsGenerator) {
        const selectorsMap = new Map();
        // Use the provided generator or default to this.defaultSelectorGenerator with proper binding
        const generator = selectorsGenerator || this.defaultSelectorGenerator.bind(this);
        selector.forEach((selector, i) => {
            return selectorsMap.set(selector, generator(selector, i));
        });
        return new HtmlSelection(selectorsMap);
    }
    defaultSelectorGenerator(selector, i) {
        if (isDevelopmentMode()) {
            console.log("🌊 defaultSelectorGenerator called with selector:", selector, "index:", i);
            console.log("🌊 this.colorService:", this.colorService);
        }
        // Check if colorService is available
        if (!this.colorService) {
            console.error("🌊 ERROR: colorService is null/undefined in defaultSelectorGenerator");
            // Fallback to a default color
            return {
                selector,
                color: (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FF0000") // Red fallback
            };
        }
        // Enhanced color generation for multiple matches with intelligent palette selection
        const isHeaderElement = (elem) => {
            const tagName = elem.tagName.toLowerCase();
            const classes = [...elem.classList].map(c => c.toLowerCase());
            return tagName === 'header' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' ||
                classes.some(c => c.includes('header') || c.includes('title'));
        };
        const isMenuElement = (elem) => {
            const tagName = elem.tagName.toLowerCase();
            const classes = [...elem.classList].map(c => c.toLowerCase());
            return tagName === 'li' || tagName === 'a' ||
                classes.some(c => c.includes('menu') || c.includes('nav') || c.includes('item'));
        };
        const isNavigationElement = (elem) => {
            const tagName = elem.tagName.toLowerCase();
            const classes = [...elem.classList].map(c => c.toLowerCase());
            return tagName === 'nav' || classes.some(c => c.includes('navigation') || c.includes('nav'));
        };
        // Determine element type for intelligent color selection
        let paletteIndex = i % AllColorPalettes.length;
        let baseColor = AllColorPalettes[paletteIndex][i % 3];
        // Check if this selector contains header, menu, or navigation elements
        const hasHeaderElements = selector.elem.some(isHeaderElement);
        const hasMenuElements = selector.elem.some(isMenuElement);
        const hasNavigationElements = selector.elem.some(isNavigationElement);
        if (hasHeaderElements) {
            // Use header-specific palette
            paletteIndex = 4; // HeaderTriad index
            baseColor = HeaderTriad[i % 3];
        }
        else if (hasMenuElements) {
            // Use menu-specific palette
            paletteIndex = 5; // MenuTriad index
            baseColor = MenuTriad[i % 3];
        }
        else if (hasNavigationElements) {
            // Use navigation-specific palette
            paletteIndex = 6; // NavigationTriad index
            baseColor = NavigationTriad[i % 3];
        }
        try {
            // Generate a triad for this specific island with enhanced rotation
            const triad = this.colorService.getTriad(baseColor, i * ISLAND_CONFIG.COLOR_ROTATION_DEGREES);
            // Use different colors from the triad for variety
            const colorIndex = Math.floor(i / AllColorPalettes.length) % 3;
            const color = triad[colorIndex];
            // Log for debugging only in development
            if (isDevelopmentMode()) {
                const elementType = hasHeaderElements ? 'header' : hasMenuElements ? 'menu' : hasNavigationElements ? 'navigation' : 'general';
                console.log(`🌊 Island ${i}: Type ${elementType}, palette ${paletteIndex}, color ${color.toHexString()} from base ${baseColor.toHexString()}, triad index ${colorIndex}`);
            }
            return {
                selector,
                color: color
            };
        }
        catch (error) {
            console.error("🌊 Error in defaultSelectorGenerator:", error);
            // Fallback to a default color
            return {
                selector,
                color: (0,tinycolor2__WEBPACK_IMPORTED_MODULE_0__["default"])("#FF0000") // Red fallback
            };
        }
    }
}
// "#eeeeaa"
// "#aaeeee"
// "#eeaaee"


/***/ }),

/***/ "./src/services/simple-color-service.ts":
/*!**********************************************!*\
  !*** ./src/services/simple-color-service.ts ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   SimpleColorGeneratorService: () => (/* binding */ SimpleColorGeneratorService),
/* harmony export */   SimpleColorServiceAdapter: () => (/* binding */ SimpleColorServiceAdapter)
/* harmony export */ });
// Simple color service that works in Shadow DOM contexts
// No external dependencies, just basic color generation
// Predefined color palettes
const DEFAULT_COLORS = [
    { hex: '#FF6B6B', rgb: { r: 255, g: 107, b: 107 }, hsl: { h: 0, s: 100, l: 71 } },
    { hex: '#4ECDC4', rgb: { r: 78, g: 205, b: 196 }, hsl: { h: 175, s: 47, l: 55 } },
    { hex: '#45B7D1', rgb: { r: 69, g: 183, b: 209 }, hsl: { h: 194, s: 55, l: 55 } },
    { hex: '#96CEB4', rgb: { r: 150, g: 206, b: 180 }, hsl: { h: 150, s: 39, l: 70 } },
    { hex: '#FFEAA7', rgb: { r: 255, g: 234, b: 167 }, hsl: { h: 48, s: 100, l: 83 } },
    { hex: '#DDA0DD', rgb: { r: 221, g: 160, b: 221 }, hsl: { h: 300, s: 47, l: 75 } },
    { hex: '#98D8C8', rgb: { r: 152, g: 216, b: 200 }, hsl: { h: 165, s: 44, l: 72 } },
    { hex: '#F7DC6F', rgb: { r: 247, g: 220, b: 111 }, hsl: { h: 49, s: 90, l: 70 } }
];
// Simple color utilities
const rgbToHsl = (r, g, b) => {
    r /= 255;
    g /= 255;
    b /= 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0;
    const l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
};
const hslToRgb = (h, s, l) => {
    h /= 360;
    s /= 100;
    l /= 100;
    const hue2rgb = (p, q, t) => {
        if (t < 0)
            t += 1;
        if (t > 1)
            t -= 1;
        if (t < 1 / 6)
            return p + (q - p) * 6 * t;
        if (t < 1 / 2)
            return q;
        if (t < 2 / 3)
            return p + (q - p) * (2 / 3 - t) * 6;
        return p;
    };
    let r, g, b;
    if (s === 0) {
        r = g = b = l;
    }
    else {
        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    };
};
const rgbToHex = (r, g, b) => {
    return '#' + [r, g, b].map(x => {
        const hex = x.toString(16);
        return hex.length === 1 ? '0' + hex : hex;
    }).join('');
};
const spinHue = (color, degrees) => {
    const newH = (color.hsl.h + degrees) % 360;
    const rgb = hslToRgb(newH, color.hsl.s, color.hsl.l);
    return {
        hex: rgbToHex(rgb.r, rgb.g, rgb.b),
        rgb,
        hsl: { h: newH, s: color.hsl.s, l: color.hsl.l }
    };
};
class SimpleColorGeneratorService {
    getTriad(color, spin = 0) {
        const baseColor = spinHue(color, spin);
        return [
            baseColor,
            spinHue(baseColor, 120),
            spinHue(baseColor, 240)
        ];
    }
    getSplitComponent(color, spin = 0) {
        const baseColor = spinHue(color, spin);
        return [
            baseColor,
            spinHue(baseColor, 150),
            spinHue(baseColor, 210)
        ];
    }
    getTetrad(color, spin = 0) {
        const baseColor = spinHue(color, spin);
        return [
            baseColor,
            spinHue(baseColor, 90),
            spinHue(baseColor, 180),
            spinHue(baseColor, 270)
        ];
    }
    getDefaultTriad(startingIndex = Math.floor(Math.random() * DEFAULT_COLORS.length)) {
        const baseColor = DEFAULT_COLORS[startingIndex % DEFAULT_COLORS.length];
        return this.getTriad(baseColor);
    }
    getDefaultSplitComponent(startingIndex = Math.floor(Math.random() * DEFAULT_COLORS.length)) {
        const baseColor = DEFAULT_COLORS[startingIndex % DEFAULT_COLORS.length];
        return this.getSplitComponent(baseColor);
    }
    getDefaultTetrad(startingIndex = Math.floor(Math.random() * DEFAULT_COLORS.length)) {
        const baseColor = DEFAULT_COLORS[startingIndex % DEFAULT_COLORS.length];
        return this.getTetrad(baseColor);
    }
}
// Compatibility adapter for existing SelectorHierarchy interface
class SimpleColorServiceAdapter {
    constructor() {
        this.simpleService = new SimpleColorGeneratorService();
    }
    // Create a mock tinycolor instance that works with the existing interface
    createMockTinyColor(color) {
        return {
            spin: (degrees) => {
                const spunColor = spinHue(color, degrees);
                return this.createMockTinyColor(spunColor);
            },
            triad: () => {
                const triad = this.simpleService.getTriad(color);
                return triad.map(c => this.createMockTinyColor(c));
            },
            splitcomplement: () => {
                const split = this.simpleService.getSplitComponent(color);
                return split.map(c => this.createMockTinyColor(c));
            },
            tetrad: () => {
                const tetrad = this.simpleService.getTetrad(color);
                return tetrad.map(c => this.createMockTinyColor(c));
            },
            toHexString: () => color.hex,
            toRgbString: () => `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
            toHslString: () => `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`
        };
    }
    getTriad(color, spin = 0) {
        const simpleColor = this.tinyColorToSimpleColor(color);
        const triad = this.simpleService.getTriad(simpleColor, spin);
        return triad.map(c => this.createMockTinyColor(c));
    }
    getSplitComponent(color, spin = 0) {
        const simpleColor = this.tinyColorToSimpleColor(color);
        const split = this.simpleService.getSplitComponent(simpleColor, spin);
        return split.map(c => this.createMockTinyColor(c));
    }
    getTetrad(color, spin = 0) {
        const simpleColor = this.tinyColorToSimpleColor(color);
        const tetrad = this.simpleService.getTetrad(simpleColor, spin);
        return tetrad.map(c => this.createMockTinyColor(c));
    }
    getDefaultTriad(startingIndex) {
        const triad = this.simpleService.getDefaultTriad(startingIndex);
        return triad.map(c => this.createMockTinyColor(c));
    }
    getDefaultSplitComponent(startingIndex) {
        const split = this.simpleService.getDefaultSplitComponent(startingIndex);
        return split.map(c => this.createMockTinyColor(c));
    }
    getDefaultTetrad(startingIndex) {
        const tetrad = this.simpleService.getDefaultTetrad(startingIndex);
        return tetrad.map(c => this.createMockTinyColor(c));
    }
    tinyColorToSimpleColor(color) {
        // If it's already a SimpleColor, return it
        if (color && color.hex && color.rgb && color.hsl) {
            return color;
        }
        // If it's a tinycolor instance, extract the color
        if (color && color.toHexString) {
            const hex = color.toHexString();
            // Parse hex to RGB
            const r = parseInt(hex.slice(1, 3), 16);
            const g = parseInt(hex.slice(3, 5), 16);
            const b = parseInt(hex.slice(5, 7), 16);
            const hsl = rgbToHsl(r, g, b);
            return { hex, rgb: { r, g, b }, hsl };
        }
        // If it's a string (hex color), parse it
        if (typeof color === 'string' && color.startsWith('#')) {
            const r = parseInt(color.slice(1, 3), 16);
            const g = parseInt(color.slice(3, 5), 16);
            const b = parseInt(color.slice(5, 7), 16);
            const hsl = rgbToHsl(r, g, b);
            return { hex: color, rgb: { r, g, b }, hsl };
        }
        // Default fallback
        console.warn('🌊 Color conversion failed, using default color:', color);
        return DEFAULT_COLORS[0];
    }
}


/***/ }),

/***/ "./src/types/tome-metadata.ts":
/*!************************************!*\
  !*** ./src/types/tome-metadata.ts ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_TOME_METADATA: () => (/* binding */ DEFAULT_TOME_METADATA),
/* harmony export */   createComponentTomeWithMetadata: () => (/* binding */ createComponentTomeWithMetadata),
/* harmony export */   createSystemTomeWithMetadata: () => (/* binding */ createSystemTomeWithMetadata),
/* harmony export */   createTomeWithMetadata: () => (/* binding */ createTomeWithMetadata)
/* harmony export */ });
/**
 * Tome Metadata Types
 *
 * Defines the standard metadata structure for all Tomes in the Wave Reader extension.
 * This provides type safety and consistency across all Tome implementations.
 */
/**
 * Default metadata values for common Tome properties
 */
const DEFAULT_TOME_METADATA = {
    version: '1.0.0',
    dependencies: ['log-view-machine'],
    priority: 'normal',
    stability: 'stable',
    configSchemaVersion: '1.0',
    license: 'MIT',
    performance: {
        supportsLazyLoading: true
    },
    security: {
        requiresElevatedPermissions: false,
        handlesSensitiveData: false,
        level: 'low'
    },
    testing: {
        hasUnitTests: false,
        hasIntegrationTests: false
    },
    deployment: {
        enabledByDefault: true,
        canBeDisabled: true,
        supportsHotReload: false,
        environments: ['development', 'staging', 'production']
    }
};
/**
 * Helper function to create a Tome with default metadata
 */
function createTomeWithMetadata(metadata, config, createFn) {
    return {
        ...DEFAULT_TOME_METADATA,
        ...metadata,
        config,
        create: createFn
    };
}
/**
 * Helper function to create a Component Tome with default metadata
 */
function createComponentTomeWithMetadata(metadata, config, createFn) {
    return {
        ...DEFAULT_TOME_METADATA,
        componentType: 'ui',
        ...metadata,
        config,
        create: createFn
    };
}
/**
 * Helper function to create a System Tome with default metadata
 */
function createSystemTomeWithMetadata(metadata, config, createFn) {
    return {
        ...DEFAULT_TOME_METADATA,
        systemType: 'core',
        ...metadata,
        config,
        create: createFn
    };
}


/***/ }),

/***/ "./src/util/attribute-constructor.ts":
/*!*******************************************!*\
  !*** ./src/util/attribute-constructor.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AttributeConstructor)
/* harmony export */ });
class AttributeConstructor {
    constructor(attributes, requireAllAssigned = false) {
        this.assign(attributes, requireAllAssigned);
    }
    assign(attributes, requireAllAssigned = false) {
        if (attributes) {
            if (requireAllAssigned && !new Array(...Object.keys(attributes)).every(k => attributes[k] !== undefined)) {
                throw new Error('if [requireAllAssigned == true], a message must contain properties with no undefined values!');
            }
            Object.assign(this, attributes);
        }
    }
}


/***/ }),

/***/ "./src/util/util.ts":
/*!**************************!*\
  !*** ./src/util/util.ts ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   currentTab: () => (/* binding */ currentTab),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   getDefaultFontSizeREM: () => (/* binding */ getDefaultFontSizeREM),
/* harmony export */   getSizeValuesRegex: () => (/* binding */ getSizeValuesRegex),
/* harmony export */   guardLastError: () => (/* binding */ guardLastError),
/* harmony export */   isVisible: () => (/* binding */ isVisible)
/* harmony export */ });
/**
 *
 * @returns {boolean} true if lastError
 */
const guardLastError = () => {
    if (chrome.runtime.lastError) {
        console.log(chrome.runtime.lastError);
        console.log(new Error().stack);
        return chrome.runtime.lastError;
    }
    return false;
};
const currentTab = () => {
    return new Promise((resolve, reject) => {
        chrome.tabs.query({ active: true, currentWindow: true }).then((tabs) => {
            resolve(tabs);
        }).catch(e => {
            console.log('error getting current tab: ', e);
            reject(e);
        });
    });
};
/* eslint-disable  @typescript-eslint/no-unused-vars */
const p = (promiseFn = (resolve = () => { }, reject = (reason) => { }) => { }) => {
    return new Promise(promiseFn);
};
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (p);
const getSizeValuesRegex = (sizeValue) => {
    const regex = new RegExp("([0-9]+)([a-zA-Z]+|%)", "ig");
    const result = regex.exec(sizeValue);
    if (!result)
        return {
            size: "0",
            sizeType: undefined
        };
    const [s, value, valueType, ...rest] = [...result.values()];
    return {
        size: value,
        sizeType: valueType
    };
};
const windowDefault = (typeof window !== 'undefined' && window) || undefined;
const getDefaultFontSizeREM = (_window = windowDefault) => _window.getComputedStyle(_window.document.documentElement).getPropertyValue('font-size');
// credit: @marc_s https://stackoverflow.com/q/66070706
const isVisible = (element) => {
    if (element instanceof Text)
        return true;
    if (element instanceof Comment)
        return false;
    if (!(element instanceof Element))
        throw Error("isVisible(): argument is not an element");
    // for real elements, the second argument is omitted (or null)
    // for pseudo-elements, the second argument is a string specifying the pseudo-element to match.
    const style = window.getComputedStyle(element, null);
    // if element has size 0
    if (element.offsetWidth === 0 || element.offsetHeight === 0) {
        // only on 'visible', content does appear outside of the element's box
        if (style.overflow !== 'visible') {
            return false;
        }
        else {
            for (const child of element.childNodes) {
                if (isVisible(child))
                    return true;
            }
            return false;
        }
    }
    // if css display property is used
    if (style.display === 'none')
        return false;
    // if css visibility property is used
    if (style.visibility !== 'visible')
        return false;
    // if css opacity property is used
    if (parseFloat(style.opacity) === 0)
        return false;
    // this method does not work for elements with "position: fixed;"
    if (style.position !== 'fixed') {
        if (element.offsetParent === null)
            return false;
    }
    return true;
};


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/create fake namespace object */
/******/ 	(() => {
/******/ 		var getProto = Object.getPrototypeOf ? (obj) => (Object.getPrototypeOf(obj)) : (obj) => (obj.__proto__);
/******/ 		var leafPrototypes;
/******/ 		// create a fake namespace object
/******/ 		// mode & 1: value is a module id, require it
/******/ 		// mode & 2: merge all properties of value into the ns
/******/ 		// mode & 4: return value when already ns object
/******/ 		// mode & 16: return value when it's Promise-like
/******/ 		// mode & 8|1: behave like require
/******/ 		__webpack_require__.t = function(value, mode) {
/******/ 			if(mode & 1) value = this(value);
/******/ 			if(mode & 8) return value;
/******/ 			if(typeof value === 'object' && value) {
/******/ 				if((mode & 4) && value.__esModule) return value;
/******/ 				if((mode & 16) && typeof value.then === 'function') return value;
/******/ 			}
/******/ 			var ns = Object.create(null);
/******/ 			__webpack_require__.r(ns);
/******/ 			var def = {};
/******/ 			leafPrototypes = leafPrototypes || [null, getProto({}), getProto([]), getProto(getProto)];
/******/ 			for(var current = mode & 2 && value; (typeof current == 'object' || typeof current == 'function') && !~leafPrototypes.indexOf(current); current = getProto(current)) {
/******/ 				Object.getOwnPropertyNames(current).forEach((key) => (def[key] = () => (value[key])));
/******/ 			}
/******/ 			def['default'] = () => (value);
/******/ 			__webpack_require__.d(ns, def);
/******/ 			return ns;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!***************************!*\
  !*** ./static/content.js ***!
  \***************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_content_scripts_log_view_content_system_integrated__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/content-scripts/log-view-content-system-integrated */ "./src/content-scripts/log-view-content-system-integrated.ts");


// Import our new integrated content system

console.log("🌊 Wave Reader content script is loading on:", window.location.href);

// Initialize the integrated content system
var integratedSystem = new _src_content_scripts_log_view_content_system_integrated__WEBPACK_IMPORTED_MODULE_1__["default"]();

// Expose to window object for debugging
window.waveReaderIntegrated = integratedSystem;
console.log("🌊 Wave Reader content script loaded successfully using integrated system");
})();

/******/ })()
;
//# sourceMappingURL=content.js.map