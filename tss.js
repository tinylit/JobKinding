(function(window) {
  var arr = [];
  var push = arr.push;
  var slice = arr.slice;
  var splice = arr.splice;

  var class2type = {};
  var toString = class2type.toString;
  var hasOwn = class2type.hasOwnProperty;
  var defineProperty = class2type.defineProperty;

  var isArraylike = function(data) {
    var len, type;
    return !(!data || data.window === data) && ((len = data.length) && data.nodeType === 1 || ((type = jobKinding.type(data)) === "array") || type === "string" || (type !== "function") && (len === 0 || typeof len === "number" && len > 0 && (len - 1) in data));
  }
})(window);
