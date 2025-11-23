/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

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

/***/ "./src/background-scripts/log-view-background-system.ts":
/*!**************************************************************!*\
  !*** ./src/background-scripts/log-view-background-system.ts ***!
  \**************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LogViewBackgroundSystem: () => (/* binding */ LogViewBackgroundSystem),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../models/messages/simplified-messages */ "./src/models/messages/simplified-messages.ts");
/* harmony import */ var _services_ml_settings_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../services/ml-settings-service */ "./src/services/ml-settings-service.ts");
/* harmony import */ var _utils_backend_api_wrapper__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/backend-api-wrapper */ "./src/utils/backend-api-wrapper.ts");
/* harmony import */ var _config_feature_toggles__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config/feature-toggles */ "./src/config/feature-toggles.ts");





// Log-View-Machine Background System
class LogViewBackgroundSystem {
    constructor() {
        this.messageHistory = [];
        this.activeTabs = new Map();
        this.extensionState = 'active';
        // Health monitoring for background router
        this.healthStatus = {
            status: 'healthy',
            lastHeartbeat: Date.now(),
            errorCount: 0,
            uptime: Date.now(),
            messageCount: 0,
            activeConnections: 0
        };
        console.log("🌊 Creating Log-View-Machine Background System...");
        // Initialize services
        this.mlService = new _services_ml_settings_service__WEBPACK_IMPORTED_MODULE_1__.MLSettingsService();
        this.sessionId = this.generateSessionId();
        this.backendRequestsEnabled = (0,_config_feature_toggles__WEBPACK_IMPORTED_MODULE_3__.getDefaultBackendRequestState)();
        (0,_utils_backend_api_wrapper__WEBPACK_IMPORTED_MODULE_2__.setBackendRequestOverride)(this.backendRequestsEnabled);
        // Initialize the system
        this.init();
        // Set up message listeners
        this.setupMessageListeners();
        // Start health monitoring
        this.startHealthMonitoring();
        console.log("🌊 Log-View-Machine Background System initialized successfully");
    }
    generateSessionId() {
        return `background-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    init() {
        // Set up Chrome extension event listeners
        this.setupChromeListeners();
        // Log system initialization
        this.logMessage('system-init', 'Background system initialized successfully');
    }
    setupChromeListeners() {
        // Handle keyboard shortcuts
        if (typeof chrome !== 'undefined' && chrome.commands) {
            chrome.commands.onCommand.addListener((command) => {
                this.handleKeyboardCommand(command);
            });
        }
        // Handle extension installation
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onInstalled.addListener((details) => {
                this.handleExtensionInstalled(details);
            });
            // Handle extension startup
            chrome.runtime.onStartup.addListener(() => {
                this.handleExtensionStartup();
            });
            // Handle tab updates
            if (chrome.tabs) {
                chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
                    this.handleTabUpdated(tabId, changeInfo, tab);
                });
                chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
                    this.handleTabRemoved(tabId, removeInfo);
                });
            }
        }
    }
    setupMessageListeners() {
        // Listen for messages from content scripts and popup
        if (typeof chrome !== 'undefined' && chrome.runtime) {
            chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
                this.handleRuntimeMessage(message, sender, sendResponse);
                return true; // Keep message channel open
            });
        }
    }
    handleKeyboardCommand(command) {
        console.log("🌊 Log-View-Machine: Background received command:", command);
        this.logMessage('keyboard-command', `Received command: ${command}`);
        switch (command) {
            case "_execute_action":
                // This opens the popup - handled automatically by Chrome
                this.logMessage('popup-open', 'Popup opened via keyboard shortcut');
                break;
            case "toggle-wave-reader":
                this.handleToggleWaveReader();
                break;
            default:
                this.logMessage('unknown-command', `Unknown command: ${command}`);
        }
    }
    handleExtensionInstalled(details) {
        console.log("🌊 Log-View-Machine: Extension installed:", details);
        this.logMessage('extension-installed', `Extension installed: ${details.reason}`);
        // Initialize ML service with default patterns
        this.initializeMLService();
        // Set up default extension state
        this.extensionState = 'active';
    }
    handleExtensionStartup() {
        console.log("🌊 Log-View-Machine: Extension started");
        this.logMessage('extension-startup', 'Extension started');
        // Initialize ML service
        this.initializeMLService();
        // Set up default extension state
        this.extensionState = 'active';
    }
    handleTabUpdated(tabId, changeInfo, tab) {
        if (changeInfo.status === 'complete' && tab.url) {
            // Check if the tab URL is accessible
            if (this.isUrlAccessible(tab.url)) {
                this.activeTabs.set(tabId, {
                    url: tab.url,
                    title: tab.title,
                    timestamp: Date.now()
                });
                this.logMessage('tab-updated', `Tab updated: ${tab.url}`, { tabId, url: tab.url });
            }
        }
    }
    handleTabRemoved(tabId, removeInfo) {
        this.activeTabs.delete(tabId);
        this.logMessage('tab-removed', `Tab removed`, { tabId });
    }
    handleToggleWaveReader() {
        console.log("🌊 Log-View-Machine: Toggle wave reader command received");
        this.logMessage('toggle-requested', 'Toggle wave reader requested');
        // Get the active tab and send toggle message to content script
        this.getActiveTab().then((tab) => {
            if (!tab) {
                this.logMessage('toggle-error', 'No active tab found for toggle command');
                return;
            }
            // Check if the tab URL is accessible
            if (!this.isUrlAccessible(tab.url)) {
                this.logMessage('toggle-skipped', `Skipping toggle for restricted URL: ${tab.url}`);
                return;
            }
            this.logMessage('toggle-sending', `Sending toggle command to tab: ${tab.url}`);
            // Send toggle message to content script via chrome.tabs.sendMessage
            this.injectToggleCommand(tab.id);
        }).catch((error) => {
            this.logMessage('toggle-error', `Error getting active tab: ${error.message}`);
        });
    }
    async getActiveTab() {
        if (typeof chrome === 'undefined' || !chrome.tabs) {
            throw new Error('Chrome tabs API not available');
        }
        const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
        if (!tabs || tabs.length === 0) {
            throw new Error('No active tabs found');
        }
        return tabs[0];
    }
    isUrlAccessible(url) {
        if (!url)
            return false;
        // Check if the URL is restricted
        return !(url.startsWith('chrome://') ||
            url.startsWith('chrome-extension://') ||
            url.startsWith('moz-extension://') ||
            url.startsWith('edge://') ||
            url.startsWith('about:'));
    }
    injectToggleCommand(tabId) {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            this.logMessage('toggle-error', 'Chrome scripting API not available');
            return;
        }
        chrome.scripting.executeScript({
            target: { tabId },
            func: (messageData) => {
                console.log("🌊 Log-View-Machine: Background script injecting toggle command to content script:", messageData);
                // Note: In service worker context, we use chrome.tabs.sendMessage instead of window.postMessage
                // This is handled by injectMessageToContentScript method
                chrome.tabs.sendMessage(tabId, {
                    source: 'wave-reader-extension',
                    message: messageData
                });
            },
            args: [{
                    from: 'background-script',
                    name: 'toggle-wave-reader',
                    timestamp: Date.now()
                }]
        }).then(() => {
            this.logMessage('toggle-injected', 'Toggle command injected successfully');
            // Send keyboard toggle message to popup state machine instead of direct toggle
            try {
                chrome.runtime.sendMessage({
                    from: 'background-script',
                    name: 'KEYBOARD_TOGGLE',
                    timestamp: Date.now(),
                    action: 'keyboard-toggle',
                    target: 'popup-state-machine'
                });
            }
            catch (error) {
                // Ignore errors
            }
        }).catch((error) => {
            this.logMessage('toggle-error', `Failed to inject toggle command: ${error.message}`);
        });
    }
    handleRuntimeMessage(message, sender, sendResponse) {
        console.log("BACKGROUND->RUNTIME: Received runtime message:", message);
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
            console.log("BACKGROUND->RUNTIME: Coalesced nested message:", normalizedMessage);
        }
        this.logMessage('runtime-message', `Received ${normalizedMessage.name} from ${normalizedMessage.from}`);
        // Create a proper message using our factory
        const properMessage = _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__.MessageFactory.createMessage(normalizedMessage.name, normalizedMessage.from, normalizedMessage);
        // Route the message through our message system
        const route = _models_messages_simplified_messages__WEBPACK_IMPORTED_MODULE_0__.MessageUtility.routeMessage(normalizedMessage.from, 'background-script', properMessage, this.sessionId);
        // Handle the message based on its type
        this.processRuntimeMessage(properMessage, route, sender, sendResponse);
    }
    processRuntimeMessage(message, route, sender, sendResponse) {
        const messageName = message?.name || message?.message?.name;
        try {
            switch (messageName) {
                case 'initialize':
                    console.log("BACKGROUND->POPUP: Processing initialize message");
                    this.handleInitialize(message, sender, sendResponse);
                    break;
                case 'selection-made':
                    this.handleSelectionMade(message, sender, sendResponse);
                    break;
                case 'ping':
                    console.log("BACKGROUND->CONTENT: Processing ping message");
                    this.handlePing(message, sender, sendResponse);
                    break;
                case 'health-check':
                    this.handleHealthCheck(message, sender, sendResponse);
                    break;
                case 'ml-recommendation-request':
                    this.handleMLRecommendationRequest(message, sender, sendResponse);
                    break;
                case 'settings-reset-request':
                    this.handleSettingsResetRequest(message, sender, sendResponse);
                    break;
                case 'analytics-event':
                    this.handleAnalyticsEvent(message, sender, sendResponse);
                    break;
                case 'extension-status-request':
                    this.handleExtensionStatusRequest(message, sender, sendResponse);
                    break;
                case 'start':
                    console.log("BACKGROUND->CONTENT: Processing start message");
                    this.handleStart(message, sender, sendResponse);
                    break;
                case 'stop':
                    console.log("BACKGROUND->CONTENT: Processing stop message");
                    this.handleStop(message, sender, sendResponse);
                    break;
                case 'toggle':
                    console.log("BACKGROUND->CONTENT: Processing toggle message");
                    this.handleToggle(message, sender, sendResponse);
                    break;
                case 'set-backend-toggle':
                    console.log('BACKGROUND->API: Updating backend toggle state');
                    this.handleBackendToggleUpdate(message, sender, sendResponse);
                    break;
                case 'backend-request':
                    console.log('BACKGROUND->API: Processing backend request');
                    this.handleBackendRequest(message, sender, sendResponse);
                    break;
                case 'graphql-request':
                    console.log('BACKGROUND->API: Processing GraphQL request');
                    this.handleGraphQLRequest(message, sender, sendResponse);
                    break;
                case 'LOOP_DETECTION_STATS':
                    console.log("BACKGROUND->LOOP: Processing loop detection stats");
                    this.handleLoopDetectionStats(message, sender, sendResponse);
                    break;
                default:
                    console.log(`🌊 Log-View-Machine: Unknown runtime message type: ${messageName}`);
                    this.logMessage('unknown-runtime-message', `Unknown message type: ${messageName}`);
                    sendResponse({ success: false, error: 'Unknown message type' });
            }
        }
        catch (error) {
            console.error(`🌊 Log-View-Machine: Error processing runtime message ${messageName}:`, error);
            this.logMessage('runtime-message-error', `Error processing ${messageName}: ${error?.message || 'Unknown error'}`);
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        }
    }
    handleInitialize(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling initialize message from popup");
        this.logMessage('initialize', 'Initialize request received from popup');
        // Increment active connections
        this.healthStatus.activeConnections++;
        // Send initialization response with session info
        sendResponse({
            success: true,
            sessionId: this.sessionId,
            extensionState: this.extensionState,
            healthStatus: {
                status: this.healthStatus.status,
                uptime: Date.now() - this.healthStatus.uptime,
                messageCount: this.healthStatus.messageCount,
                activeConnections: this.healthStatus.activeConnections
            },
            timestamp: Date.now()
        });
        console.log("🌊 Log-View-Machine: Initialize response sent, active connections:", this.healthStatus.activeConnections);
    }
    handleSelectionMade(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling selection-made message:", message.selector);
        this.logMessage('selection-made', `Selector selected: ${message.selector}`);
        // Forward the message to the popup
        this.forwardToPopup({
            from: 'background-script',
            name: 'selection-made',
            selector: message.selector,
            sessionId: this.sessionId
        });
        sendResponse({ success: true });
    }
    handlePing(message, sender, sendResponse) {
        console.log("BACKGROUND->CONTENT: Handling heartbeat ping message from popup");
        this.logMessage('ping-received', 'Heartbeat ping received from popup');
        // Extract current state from the message for comparison
        const currentState = message.currentState || {};
        // Get the active tab and send ping message to content script
        this.getActiveTab().then(async (tab) => {
            if (!tab || !this.isUrlAccessible(tab.url)) {
                this.logMessage('ping-skipped', 'Ping skipped for restricted URL');
                sendResponse({ success: false, error: 'URL not accessible' });
                return;
            }
            try {
                // Get current state from content script
                const contentState = await this.getContentScriptState(tab.id);
                // Compare states and prepare response with any updates
                const updates = {};
                let hasUpdates = false;
                if (contentState.going !== undefined && contentState.going !== currentState.going) {
                    updates.going = contentState.going;
                    hasUpdates = true;
                }
                if (contentState.selector && contentState.selector !== currentState.selector) {
                    updates.selector = contentState.selector;
                    hasUpdates = true;
                }
                // Update tab tracking
                this.activeTabs.set(tab.id, {
                    ...this.activeTabs.get(tab.id),
                    lastPing: Date.now(),
                    going: contentState.going,
                    selector: contentState.selector
                });
                this.logMessage('ping-processed', `Heartbeat processed - updates: ${hasUpdates}`);
                sendResponse({
                    success: true,
                    data: hasUpdates ? updates : {},
                    hasUpdates
                });
            }
            catch (error) {
                this.logMessage('ping-error', `Error processing heartbeat: ${error.message}`);
                sendResponse({ success: false, error: error.message });
            }
        }).catch((error) => {
            this.logMessage('ping-error', `Error handling ping: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        });
    }
    async getContentScriptState(tabId) {
        return new Promise((resolve, reject) => {
            if (typeof chrome === 'undefined' || !chrome.tabs) {
                reject(new Error('Chrome tabs API not available'));
                return;
            }
            // Send message to content script to get current state
            console.log("BACKGROUND->CONTENT: Sending get-status message to tab", tabId);
            chrome.tabs.sendMessage(tabId, {
                source: 'wave-reader-extension',
                message: {
                    from: 'background-script',
                    name: 'get-status',
                    timestamp: Date.now()
                }
            }, (response) => {
                console.log("CONTENT->BACKGROUND: Received get-status response:", response);
                if (chrome.runtime.lastError) {
                    reject(new Error(chrome.runtime.lastError.message));
                    return;
                }
                // Default state if no response
                const defaultState = {
                    going: false,
                    selector: null,
                    activeTab: tabId,
                    lastActivity: Date.now()
                };
                resolve(response || defaultState);
            });
        });
    }
    injectPingCommand(tabId) {
        if (typeof chrome === 'undefined' || !chrome.scripting) {
            this.logMessage('ping-error', 'Chrome scripting API not available');
            return;
        }
        chrome.scripting.executeScript({
            target: { tabId },
            func: (messageData) => {
                console.log("🌊 Log-View-Machine: Background script injecting ping command to content script:", messageData);
                // Note: In service worker context, we use chrome.tabs.sendMessage instead of window.postMessage
                // This is handled by injectMessageToContentScript method
                chrome.tabs.sendMessage(tabId, {
                    source: 'wave-reader-extension',
                    message: messageData
                });
            },
            args: [{
                    from: 'background-script',
                    name: 'ping',
                    timestamp: Date.now()
                }]
        }).then(() => {
            this.logMessage('ping-injected', 'Ping command injected successfully');
        }).catch((error) => {
            this.logMessage('ping-error', `Failed to inject ping command: ${error.message}`);
        });
    }
    handleHealthCheck(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling health check message");
        this.logMessage('health-check-requested', 'Health check requested');
        // Update health status
        this.healthStatus.lastHeartbeat = Date.now();
        this.healthStatus.activeConnections = this.activeTabs.size;
        // Prepare comprehensive health data for sync system
        const healthData = {
            success: true,
            status: this.healthStatus.status,
            uptime: Date.now() - this.healthStatus.uptime,
            messageCount: this.healthStatus.messageCount,
            activeConnections: this.healthStatus.activeConnections,
            sessionId: this.sessionId,
            lastHeartbeat: this.healthStatus.lastHeartbeat,
            errorCount: this.healthStatus.errorCount,
            // Additional sync data
            activeTabs: Array.from(this.activeTabs.entries()).map(([tabId, tabData]) => ({
                tabId,
                lastPing: tabData.lastPing || 0,
                going: tabData.going || false,
                selector: tabData.selector || null
            })),
            extensionState: this.extensionState
        };
        // Send comprehensive health status response
        sendResponse(healthData);
    }
    handleMLRecommendationRequest(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling ML recommendation request");
        this.logMessage('ml-request', 'ML recommendation requested');
        const { domain, path, selector } = message;
        this.mlService.getSettingsRecommendations(domain, path, selector)
            .then((recommendations) => {
            this.logMessage('ml-recommendations', `Generated ${recommendations.length} ML recommendations`);
            sendResponse({ success: true, recommendations });
        })
            .catch((error) => {
            this.logMessage('ml-error', `Error generating recommendations: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        });
    }
    handleSettingsResetRequest(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling settings reset request");
        this.logMessage('settings-reset-requested', 'Settings reset requested');
        try {
            const newDefaults = this.mlService.resetToNewDefaults();
            this.logMessage('settings-reset-completed', 'Settings reset to ML defaults completed');
            sendResponse({ success: true, newDefaults });
        }
        catch (error) {
            this.logMessage('settings-reset-error', `Error resetting settings: ${error?.message || 'Unknown error'}`);
            sendResponse({ success: false, error: error?.message || 'Unknown error' });
        }
    }
    handleAnalyticsEvent(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling analytics event");
        this.logMessage('analytics-event', `Analytics event: ${message.eventType}`);
        // Process analytics event
        this.processAnalyticsEvent(message);
        sendResponse({ success: true });
    }
    handleExtensionStatusRequest(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling extension status request");
        this.logMessage('status-requested', 'Extension status requested');
        const status = {
            extensionState: this.extensionState,
            activeTabsCount: this.activeTabs.size,
            sessionId: this.sessionId,
            timestamp: Date.now(),
            mlServiceStatus: 'active',
            messageHistoryLength: this.messageHistory.length
        };
        sendResponse({ success: true, status });
    }
    forwardToPopup(message) {
        if (typeof chrome === 'undefined' || !chrome.runtime) {
            this.logMessage('popup-forward-error', 'Chrome runtime not available');
            return;
        }
        try {
            chrome.runtime.sendMessage(message);
            this.logMessage('popup-forwarded', 'Message forwarded to popup successfully');
        }
        catch (error) {
            this.logMessage('popup-forward-error', `Popup not available: ${error?.message || 'Unknown error'}`);
        }
    }
    initializeMLService() {
        console.log("🌊 Log-View-Machine: Initializing ML service");
        this.logMessage('ml-service-init', 'ML service initialization started');
        // The ML service is already initialized in the constructor
        // This method can be used for additional setup if needed
        this.logMessage('ml-service-init', 'ML service initialization completed');
    }
    processAnalyticsEvent(event) {
        console.log("🌊 Log-View-Machine: Processing analytics event:", event);
        this.logMessage('analytics-processed', `Analytics event processed: ${event.eventType}`);
        // Process analytics data here
        // This could include sending to external analytics services, storing locally, etc.
    }
    performHealthCheck() {
        const healthStatus = {
            timestamp: Date.now(),
            sessionId: this.sessionId,
            extensionState: this.extensionState,
            activeTabsCount: this.activeTabs.size,
            mlService: !!this.mlService,
            messageHistoryLength: this.messageHistory.length,
            chromeApis: {
                runtime: typeof chrome !== 'undefined' && !!chrome.runtime,
                tabs: typeof chrome !== 'undefined' && !!chrome.tabs,
                scripting: typeof chrome !== 'undefined' && !!chrome.scripting,
                commands: typeof chrome !== 'undefined' && !!chrome.commands
            }
        };
        console.log("🌊 Log-View-Machine: Health check completed:", healthStatus);
        return healthStatus;
    }
    logMessage(type, message, data) {
        const logEntry = {
            timestamp: Date.now(),
            type,
            message,
            data,
            sessionId: this.sessionId,
            extensionState: this.extensionState
        };
        this.messageHistory.push(logEntry);
        // Keep only last 1000 messages
        if (this.messageHistory.length > 1000) {
            this.messageHistory = this.messageHistory.slice(-1000);
        }
        // Log to console in development
        console.log(`🌊 Log-View-Machine [${type}]:`, message, data || '');
    }
    async handleStart(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling start message:", message);
        this.logMessage('start-requested', 'Start wave reader requested');
        try {
            // Get active tab
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            // Check if the tab URL is accessible
            if (!this.isUrlAccessible(tab.url)) {
                throw new Error(`Cannot access restricted URL: ${tab.url}`);
            }
            // Send start message to content script via chrome.tabs.sendMessage
            console.log("BACKGROUND->CONTENT: Sending start message to tab", tab.id);
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'start',
                options: message.options,
                timestamp: Date.now()
            });
            // Update active tabs tracking
            this.activeTabs.set(tab.id, {
                ...this.activeTabs.get(tab.id),
                state: 'waving',
                startTime: Date.now(),
                options: message.options,
                going: true,
                lastActivity: Date.now()
            });
            this.logMessage('start-success', 'Wave reader started successfully');
            sendResponse({
                success: true,
                message: 'Wave reader started',
                data: {
                    going: true,
                    tabId: tab.id,
                    startTime: Date.now()
                }
            });
        }
        catch (error) {
            console.error('🌊 Log-View-Machine: Failed to start wave reader:', error);
            this.logMessage('start-error', `Failed to start: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        }
    }
    handleLoopDetectionStats(message, sender, sendResponse) {
        const { data } = message;
        const { timestamp, currentState, recentEvents, recentStates, eventFrequency, stateFrequency, source } = data;
        // Log detailed stats to background console
        console.log('🔄 LOOP-DETECTION-STATS:', {
            timestamp: new Date(timestamp).toISOString(),
            source,
            currentState,
            recentEvents,
            recentStates,
            eventFrequency,
            stateFrequency
        });
        // Check for suspicious patterns
        if (recentEvents > 10) {
            console.warn('🔄 HIGH EVENT FREQUENCY:', recentEvents, 'events in 10 seconds');
        }
        if (recentStates > 5) {
            console.warn('🔄 HIGH STATE FREQUENCY:', recentStates, 'state changes in 10 seconds');
        }
        // Check for specific event loops
        Object.entries(eventFrequency || {}).forEach(([event, count]) => {
            if (count > 5) {
                console.warn(`🔄 EVENT LOOP DETECTED: '${event}' fired ${count} times`);
            }
        });
        // Check for state loops
        Object.entries(stateFrequency || {}).forEach(([state, count]) => {
            if (count > 3) {
                console.warn(`🔄 STATE LOOP DETECTED: '${state}' visited ${count} times`);
            }
        });
        // Store stats for analysis
        this.logMessage('loop-detection-stats', `State: ${currentState}, Events: ${recentEvents}, States: ${recentStates}`);
        sendResponse({ success: true, received: true });
    }
    async handleStop(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling stop message:", message);
        this.logMessage('stop-requested', 'Stop wave reader requested');
        try {
            // Get active tab
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            // Send stop message to content script via chrome.tabs.sendMessage
            console.log("BACKGROUND->CONTENT: Sending stop message to tab", tab.id);
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'stop',
                timestamp: Date.now()
            });
            // Update active tabs tracking
            if (this.activeTabs.has(tab.id)) {
                const tabInfo = this.activeTabs.get(tab.id);
                tabInfo.state = 'stopped';
                tabInfo.stopTime = Date.now();
                tabInfo.going = false;
                tabInfo.lastActivity = Date.now();
                this.activeTabs.set(tab.id, tabInfo);
            }
            this.logMessage('stop-success', 'Wave reader stopped successfully');
            sendResponse({
                success: true,
                message: 'Wave reader stopped',
                data: {
                    going: false,
                    tabId: tab.id,
                    stopTime: Date.now()
                }
            });
        }
        catch (error) {
            console.error('🌊 Log-View-Machine: Failed to stop wave reader:', error);
            this.logMessage('stop-error', `Failed to stop: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        }
    }
    async handleToggle(message, sender, sendResponse) {
        console.log("🌊 Log-View-Machine: Handling toggle message:", message);
        this.logMessage('toggle-requested', 'Toggle wave reader requested');
        try {
            // Get active tab
            const tab = await this.getActiveTab();
            if (!tab) {
                throw new Error('No active tab found');
            }
            // Check if the tab URL is accessible
            if (!this.isUrlAccessible(tab.url)) {
                throw new Error(`Cannot access restricted URL: ${tab.url}`);
            }
            // Send toggle message to content script via chrome.tabs.sendMessage
            await this.injectMessageToContentScript(tab.id, {
                from: 'background-script',
                name: 'toggle',
                options: message.options,
                timestamp: Date.now()
            });
            this.logMessage('toggle-success', 'Wave reader toggle sent successfully');
            sendResponse({ success: true, message: 'Wave reader toggled' });
        }
        catch (error) {
            console.error('🌊 Log-View-Machine: Failed to toggle wave reader:', error);
            this.logMessage('toggle-error', `Failed to toggle: ${error.message}`);
            sendResponse({ success: false, error: error.message });
        }
    }
    async handleBackendRequest(message, sender, sendResponse) {
        try {
            const request = message?.request || {};
            const endpoint = request.endpoint;
            if (!endpoint) {
                sendResponse({ success: false, error: 'Missing backend endpoint' });
                return;
            }
            const response = await (0,_utils_backend_api_wrapper__WEBPACK_IMPORTED_MODULE_2__.safeFetch)(endpoint, request.options || {}, request.mockKey || 'default', { payload: request.payload });
            const backendDisabled = response.headers?.get?.('X-Backend-Disabled') === 'true';
            const data = await response.json();
            sendResponse({ success: true, data, backendDisabled });
        }
        catch (error) {
            console.error('🌊 Background API: Backend request failed', error);
            sendResponse({ success: false, error: error?.message || 'Backend request failed' });
        }
    }
    async handleGraphQLRequest(message, sender, sendResponse) {
        try {
            const request = message?.request || {};
            const endpoint = request.endpoint;
            const query = request.query;
            if (!endpoint || !query) {
                sendResponse({ success: false, error: 'Missing GraphQL endpoint or query' });
                return;
            }
            const result = await (0,_utils_backend_api_wrapper__WEBPACK_IMPORTED_MODULE_2__.safeGraphQLRequest)({
                endpoint,
                query,
                variables: request.variables || {},
                requestInit: request.options || {},
                mockKey: request.mockKey || 'graphql',
                context: request.context || {}
            });
            sendResponse({ success: true, data: result.data, errors: result.errors, backendDisabled: result.backendDisabled });
        }
        catch (error) {
            console.error('🌊 Background API: GraphQL request failed', error);
            sendResponse({ success: false, error: error?.message || 'GraphQL request failed' });
        }
    }
    handleBackendToggleUpdate(message, _sender, sendResponse) {
        const enabled = Boolean(message?.enabled);
        this.backendRequestsEnabled = enabled;
        (0,_utils_backend_api_wrapper__WEBPACK_IMPORTED_MODULE_2__.setBackendRequestOverride)(enabled);
        this.logMessage('backend-toggle-updated', `Backend requests ${enabled ? 'enabled' : 'disabled'}`);
        sendResponse({ success: true, enabled });
    }
    async injectMessageToContentScript(tabId, messageData) {
        // Use chrome.tabs.sendMessage directly from background script context
        // This is the correct way to send messages from background to content script
        try {
            await chrome.tabs.sendMessage(tabId, {
                source: 'wave-reader-extension',
                message: messageData
            });
        }
        catch (error) {
            // Tab might not have content script loaded, which is normal
            console.log('🌊 Background: Could not send message to tab:', tabId, error.message);
            throw error;
        }
    }
    // Public methods for external access
    getMessageHistory() {
        return [...this.messageHistory];
    }
    getExtensionState() {
        return this.extensionState;
    }
    getActiveTabsCount() {
        return this.activeTabs.size;
    }
    getSessionId() {
        return this.sessionId;
    }
    getHealthStatusLegacy() {
        return this.performHealthCheck();
    }
    destroy() {
        console.log("🌊 Log-View-Machine: Destroying background system");
        // Clean up
        this.activeTabs.clear();
        this.extensionState = 'inactive';
        this.logMessage('system-destroyed', 'Background system destroyed');
    }
    // Health monitoring methods for background router
    startHealthMonitoring() {
        console.log("🌊 Background Router: Starting health monitoring");
        // Ping health every 30 seconds
        setInterval(() => {
            this.updateHealthStatus();
        }, 30000);
        // Log health status every 5 minutes
        setInterval(() => {
            this.logHealthStatus();
        }, 300000);
    }
    updateHealthStatus() {
        this.healthStatus.lastHeartbeat = Date.now();
        // Check if system is responsive
        const timeSinceLastHeartbeat = Date.now() - this.healthStatus.lastHeartbeat;
        const errorRate = this.healthStatus.errorCount / Math.max(this.healthStatus.messageCount, 1);
        // Determine health status
        if (errorRate > 0.1 || timeSinceLastHeartbeat > 60000) {
            this.healthStatus.status = 'unhealthy';
        }
        else if (errorRate > 0.05 || timeSinceLastHeartbeat > 30000) {
            this.healthStatus.status = 'degraded';
        }
        else {
            this.healthStatus.status = 'healthy';
        }
        // Update active connections count
        this.healthStatus.activeConnections = this.activeTabs.size;
    }
    logHealthStatus() {
        const uptime = Date.now() - this.healthStatus.uptime;
        console.log(`🌊 Background Router Health:`, {
            status: this.healthStatus.status,
            uptime: `${Math.floor(uptime / 1000)}s`,
            messageCount: this.healthStatus.messageCount,
            errorCount: this.healthStatus.errorCount,
            activeConnections: this.healthStatus.activeConnections,
            lastHeartbeat: new Date(this.healthStatus.lastHeartbeat).toLocaleTimeString()
        });
    }
    getHealthStatus() {
        this.updateHealthStatus();
        return {
            ...this.healthStatus,
            uptime: Date.now() - this.healthStatus.uptime
        };
    }
    // Increment message count and track errors
    trackMessage(hasError = false) {
        this.healthStatus.messageCount++;
        if (hasError) {
            this.healthStatus.errorCount++;
        }
        this.healthStatus.lastHeartbeat = Date.now();
    }
}
// Initialize the system when the script loads
console.log("🌊 Log-View-Machine: Initializing background system...");
// Create the background system instance
const backgroundSystem = new LogViewBackgroundSystem();
// Export for testing
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (LogViewBackgroundSystem);


/***/ }),

/***/ "./src/config/feature-toggles.ts":
/*!***************************************!*\
  !*** ./src/config/feature-toggles.ts ***!
  \***************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   DEFAULT_TOGGLE_VALUES: () => (/* binding */ DEFAULT_TOGGLE_VALUES),
/* harmony export */   FEATURE_TOGGLES: () => (/* binding */ FEATURE_TOGGLES),
/* harmony export */   FeatureToggleService: () => (/* binding */ FeatureToggleService),
/* harmony export */   getBackendRequestStateSync: () => (/* binding */ getBackendRequestStateSync),
/* harmony export */   getDefaultBackendRequestState: () => (/* binding */ getDefaultBackendRequestState)
/* harmony export */ });
/**
 * Feature Toggles Configuration
 *
 * Manages feature flags using Unleash
 * Default values are for release builds (conservative/safe defaults)
 */
const FEATURE_TOGGLES = {
    // Backend API Integration
    ENABLE_BACKEND_API_REQUESTS: 'enable-backend-api-requests',
    // Premium Features
    ENABLE_PREMIUM_EDITOR: 'enable-premium-editor',
    ENABLE_MOD_MARKETPLACE: 'enable-mod-marketplace',
    // Token Economy
    ENABLE_TOKEN_SYSTEM: 'enable-token-system',
    ENABLE_DONATIONS: 'enable-donations',
    // Developer Features
    DEVELOPER_MODE: 'developer-mode',
};
const DEFAULT_TOGGLE_VALUES = {
    [FEATURE_TOGGLES.ENABLE_BACKEND_API_REQUESTS]: false, // Off by default for release
    [FEATURE_TOGGLES.ENABLE_PREMIUM_EDITOR]: false,
    [FEATURE_TOGGLES.ENABLE_MOD_MARKETPLACE]: false,
    [FEATURE_TOGGLES.ENABLE_TOKEN_SYSTEM]: false,
    [FEATURE_TOGGLES.ENABLE_DONATIONS]: false,
    [FEATURE_TOGGLES.DEVELOPER_MODE]: "development" === 'development',
};
/**
 * Feature Toggle Service
 * Wraps RobotCopy.isEnabled with typed toggle names
 */
class FeatureToggleService {
    constructor(robotCopy) {
        this.robotCopy = robotCopy ?? null;
        this.cache = new Map();
    }
    setRobotCopy(robotCopy) {
        this.robotCopy = robotCopy;
    }
    async isEnabled(toggle) {
        try {
            if (!this.robotCopy || typeof this.robotCopy.isEnabled !== 'function') {
                throw new Error('RobotCopy instance not available');
            }
            const toggleName = FEATURE_TOGGLES[toggle];
            const enabled = await this.robotCopy.isEnabled(toggleName);
            this.cache.set(toggle, Boolean(enabled));
            return enabled;
        }
        catch (error) {
            console.warn(`Feature toggle check failed for ${toggle}, using default`);
            const fallback = DEFAULT_TOGGLE_VALUES[FEATURE_TOGGLES[toggle]] ?? false;
            this.cache.set(toggle, fallback);
            return fallback;
        }
    }
    async canMakeBackendRequests() {
        return this.isEnabled('ENABLE_BACKEND_API_REQUESTS');
    }
    async isPremiumEditorEnabled() {
        return this.isEnabled('ENABLE_PREMIUM_EDITOR');
    }
    async isModMarketplaceEnabled() {
        return this.isEnabled('ENABLE_MOD_MARKETPLACE');
    }
    async isDeveloperMode() {
        return this.isEnabled('DEVELOPER_MODE');
    }
    getCachedToggleValue(toggle) {
        if (this.cache.has(toggle)) {
            return this.cache.get(toggle);
        }
        const fallback = DEFAULT_TOGGLE_VALUES[FEATURE_TOGGLES[toggle]] ?? false;
        this.cache.set(toggle, fallback);
        return fallback;
    }
    getCachedBackendRequestState() {
        return this.getCachedToggleValue('ENABLE_BACKEND_API_REQUESTS');
    }
}
const getDefaultBackendRequestState = () => {
    return DEFAULT_TOGGLE_VALUES[FEATURE_TOGGLES.ENABLE_BACKEND_API_REQUESTS];
};
const getBackendRequestStateSync = (service) => {
    if (service) {
        try {
            return service.getCachedBackendRequestState();
        }
        catch (error) {
            console.warn('Feature toggle sync lookup failed, using default backend state.', error);
        }
    }
    return getDefaultBackendRequestState();
};


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
const KeyChordDefaultFactory = () => ["w", "Shift"];
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



const defaultCssTemplate = (options) => `
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
// Direct positioning template - no keyframes, just direct transforms
const defaultCssMouseTemplate = (options) => `
${options.selector || '.wave-reader__text'} {
  font-size: ${options.text?.size || 'inherit'};
  transform: translateX(TRANSLATE_X%) rotateY(ROTATE_Ydeg);
  transition: transform ANIMATION_DURATIONs ease-out;
}
`;
const TRANSLATE_X = "TRANSLATE_X";
const ROTATE_Y = "ROTATE_Y";
const ANIMATION_DURATION = "ANIMATION_DURATION";
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
        this.cssTemplate = defaultCssTemplate(waveWithAttributes);
        this.cssMouseTemplate = defaultCssMouseTemplate(waveWithAttributes);
    }
    // Always regenerate CSS templates from current parameters
    update() {
        this.cssTemplate = defaultCssTemplate(this);
        this.cssMouseTemplate = defaultCssMouseTemplate(this);
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

/***/ "./src/utils/backend-api-wrapper.ts":
/*!******************************************!*\
  !*** ./src/utils/backend-api-wrapper.ts ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   getBackendRequestState: () => (/* binding */ getBackendRequestState),
/* harmony export */   performBackendRequest: () => (/* binding */ performBackendRequest),
/* harmony export */   registerBackendToggleService: () => (/* binding */ registerBackendToggleService),
/* harmony export */   safeFetch: () => (/* binding */ safeFetch),
/* harmony export */   safeGraphQLRequest: () => (/* binding */ safeGraphQLRequest),
/* harmony export */   setBackendRequestOverride: () => (/* binding */ setBackendRequestOverride)
/* harmony export */ });
/* harmony import */ var _config_feature_toggles__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../config/feature-toggles */ "./src/config/feature-toggles.ts");
/* harmony import */ var _mock_backend_responses__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mock-backend-responses */ "./src/utils/mock-backend-responses.ts");


let toggleService = null;
let backendOverride = null;
const registerBackendToggleService = (service) => {
    toggleService = service;
};
const setBackendRequestOverride = (enabled) => {
    backendOverride = enabled;
};
const isBackendEnabled = async () => {
    if (backendOverride !== null) {
        return backendOverride;
    }
    if (toggleService) {
        try {
            return await toggleService.canMakeBackendRequests();
        }
        catch (error) {
            console.warn('Failed to evaluate backend request toggle, using default.', error);
        }
    }
    return (0,_config_feature_toggles__WEBPACK_IMPORTED_MODULE_0__.getDefaultBackendRequestState)();
};
const createMockResponse = (key, context = {}) => {
    const { data } = (0,_mock_backend_responses__WEBPACK_IMPORTED_MODULE_1__.createMockBackendResult)(key, context);
    const headers = new Headers({
        'Content-Type': 'application/json',
        'X-Backend-Disabled': 'true'
    });
    return new Response(JSON.stringify(data), {
        status: 200,
        headers
    });
};
const safeFetch = async (input, init = {}, mockKey = 'default', context = {}) => {
    const enabled = await isBackendEnabled();
    if (enabled) {
        return fetch(input, init);
    }
    return createMockResponse(mockKey, {
        ...context,
        request: input,
        init
    });
};
const performBackendRequest = async ({ endpoint, options = {}, mockKey = 'default', payload, context = {} }) => {
    const effectiveMockKey = (0,_mock_backend_responses__WEBPACK_IMPORTED_MODULE_1__.resolveMockKeyForEndpoint)(endpoint, mockKey);
    const response = await safeFetch(endpoint, options, effectiveMockKey, {
        ...context,
        payload
    });
    const backendDisabled = response.headers?.get?.('X-Backend-Disabled') === 'true';
    const data = (await response.json());
    return {
        data,
        backendDisabled,
        response,
        mockKey: effectiveMockKey
    };
};
const safeGraphQLRequest = async ({ endpoint, query, variables = {}, requestInit = {}, mockKey = 'graphql', context = {} }) => {
    const body = JSON.stringify({ query, variables });
    const headers = {
        'Content-Type': 'application/json',
        ...(requestInit.headers || {})
    };
    const response = await safeFetch(endpoint, {
        method: 'POST',
        ...requestInit,
        headers,
        body
    }, mockKey, {
        ...context,
        payload: { query, variables }
    });
    const backendDisabled = response.headers.get('X-Backend-Disabled') === 'true';
    const json = await response.json();
    const data = json?.data ?? json;
    const errors = json?.errors;
    return {
        data,
        errors,
        backendDisabled
    };
};
const getBackendRequestState = async () => isBackendEnabled();


/***/ }),

/***/ "./src/utils/mock-backend-responses.ts":
/*!*********************************************!*\
  !*** ./src/utils/mock-backend-responses.ts ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createMockBackendResult: () => (/* binding */ createMockBackendResult),
/* harmony export */   getMockBackendData: () => (/* binding */ getMockBackendData),
/* harmony export */   resolveMockKeyForEndpoint: () => (/* binding */ resolveMockKeyForEndpoint)
/* harmony export */ });
const now = () => new Date().toISOString();
const mockGenerators = {
    'wave/start': (context) => ({
        success: true,
        message: 'Wave reader started (mock)',
        selector: context.payload?.selector ?? 'p',
        options: context.payload?.options ?? {},
        timestamp: now(),
        mocked: true
    }),
    'wave/stop': () => ({
        success: true,
        message: 'Wave reader stopped (mock)',
        timestamp: now(),
        mocked: true
    }),
    'wave/status': () => ({
        success: true,
        status: 'stopped',
        going: false,
        timestamp: now(),
        mocked: true
    }),
    'wave/health': () => ({
        success: true,
        status: 'healthy',
        timestamp: now(),
        mocked: true
    }),
    'ml/recommendations': (context) => ({
        success: true,
        recommendations: [
            {
                confidence: 0.92,
                selector: context.payload?.selector ?? 'p',
                settings: context.payload?.settings ?? {},
                reasoning: ['Mocked ML recommendation']
            }
        ],
        timestamp: now(),
        mocked: true
    }),
    'ml/stats': () => ({
        success: true,
        patterns: 0,
        averageConfidence: 0,
        domainCoverage: [],
        timestamp: now(),
        mocked: true
    }),
    graphql: () => ({
        data: {},
        errors: [],
        mocked: true
    }),
    default: () => ({
        success: true,
        mocked: true,
        timestamp: now()
    })
};
const normalizeKey = (key) => key.replace(/^\/+|\/+$|\s+/g, '').toLowerCase();
function resolveMockKeyForEndpoint(endpoint, explicit) {
    if (explicit) {
        return explicit;
    }
    try {
        const url = new URL(endpoint, 'http://localhost');
        const path = url.pathname.replace(/^\//, '');
        if (path.startsWith('api/wave-reader/start')) {
            return 'wave/start';
        }
        if (path.startsWith('api/wave-reader/stop')) {
            return 'wave/stop';
        }
        if (path.startsWith('api/wave-reader/status')) {
            return 'wave/status';
        }
        if (path.startsWith('api/wave-reader/health')) {
            return 'wave/health';
        }
        if (path.startsWith('api/ml/recommendations')) {
            return 'ml/recommendations';
        }
        if (path.startsWith('api/ml/stats')) {
            return 'ml/stats';
        }
        return 'default';
    }
    catch (error) {
        console.warn('Failed to resolve mock key for endpoint, defaulting to mock "default"', error);
        return 'default';
    }
}
function getMockBackendData(key, context = {}) {
    const generator = mockGenerators[normalizeKey(key)] || mockGenerators.default;
    return generator(context);
}
function createMockBackendResult(key, context = {}) {
    const resolvedKey = normalizeKey(key);
    const data = getMockBackendData(resolvedKey, context);
    return {
        data,
        backendDisabled: true,
        metadata: {
            key: resolvedKey,
            generatedAt: now()
        }
    };
}


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
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
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
/************************************************************************/
var __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be in strict mode.
(() => {
"use strict";
/*!******************************!*\
  !*** ./static/background.js ***!
  \******************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! regenerator-runtime/runtime */ "./node_modules/regenerator-runtime/runtime.js");
/* harmony import */ var regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(regenerator_runtime_runtime__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _src_background_scripts_log_view_background_system__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../src/background-scripts/log-view-background-system */ "./src/background-scripts/log-view-background-system.ts");


// Import our background system

console.log("🌊 Wave Reader background script is loading...");

// Initialize the background system
var backgroundSystem = new _src_background_scripts_log_view_background_system__WEBPACK_IMPORTED_MODULE_1__["default"]();

// Expose to global scope for debugging (service worker context)
// Note: In service worker, we can't use window, but we can use self
if (typeof self !== 'undefined') {
  self.waveReaderBackground = backgroundSystem;
} else if (typeof globalThis !== 'undefined') {
  globalThis.waveReaderBackground = backgroundSystem;
}
console.log("🌊 Wave Reader background script loaded successfully");
})();

/******/ })()
;
//# sourceMappingURL=background.js.map