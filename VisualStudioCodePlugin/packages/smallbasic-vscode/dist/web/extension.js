"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// ../../node_modules/base64-js/index.js
var require_base64_js = __commonJS({
  "../../node_modules/base64-js/index.js"(exports) {
    "use strict";
    init_polyfills();
    exports.byteLength = byteLength;
    exports.toByteArray = toByteArray;
    exports.fromByteArray = fromByteArray;
    var lookup = [];
    var revLookup = [];
    var Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    for (i = 0, len = code.length; i < len; ++i) {
      lookup[i] = code[i];
      revLookup[code.charCodeAt(i)] = i;
    }
    var i;
    var len;
    revLookup["-".charCodeAt(0)] = 62;
    revLookup["_".charCodeAt(0)] = 63;
    function getLens(b64) {
      var len2 = b64.length;
      if (len2 % 4 > 0) {
        throw new Error("Invalid string. Length must be a multiple of 4");
      }
      var validLen = b64.indexOf("=");
      if (validLen === -1) validLen = len2;
      var placeHoldersLen = validLen === len2 ? 0 : 4 - validLen % 4;
      return [validLen, placeHoldersLen];
    }
    function byteLength(b64) {
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function _byteLength(b64, validLen, placeHoldersLen) {
      return (validLen + placeHoldersLen) * 3 / 4 - placeHoldersLen;
    }
    function toByteArray(b64) {
      var tmp;
      var lens = getLens(b64);
      var validLen = lens[0];
      var placeHoldersLen = lens[1];
      var arr = new Arr(_byteLength(b64, validLen, placeHoldersLen));
      var curByte = 0;
      var len2 = placeHoldersLen > 0 ? validLen - 4 : validLen;
      var i2;
      for (i2 = 0; i2 < len2; i2 += 4) {
        tmp = revLookup[b64.charCodeAt(i2)] << 18 | revLookup[b64.charCodeAt(i2 + 1)] << 12 | revLookup[b64.charCodeAt(i2 + 2)] << 6 | revLookup[b64.charCodeAt(i2 + 3)];
        arr[curByte++] = tmp >> 16 & 255;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 2) {
        tmp = revLookup[b64.charCodeAt(i2)] << 2 | revLookup[b64.charCodeAt(i2 + 1)] >> 4;
        arr[curByte++] = tmp & 255;
      }
      if (placeHoldersLen === 1) {
        tmp = revLookup[b64.charCodeAt(i2)] << 10 | revLookup[b64.charCodeAt(i2 + 1)] << 4 | revLookup[b64.charCodeAt(i2 + 2)] >> 2;
        arr[curByte++] = tmp >> 8 & 255;
        arr[curByte++] = tmp & 255;
      }
      return arr;
    }
    function tripletToBase64(num) {
      return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
    }
    function encodeChunk(uint8, start, end) {
      var tmp;
      var output = [];
      for (var i2 = start; i2 < end; i2 += 3) {
        tmp = (uint8[i2] << 16 & 16711680) + (uint8[i2 + 1] << 8 & 65280) + (uint8[i2 + 2] & 255);
        output.push(tripletToBase64(tmp));
      }
      return output.join("");
    }
    function fromByteArray(uint8) {
      var tmp;
      var len2 = uint8.length;
      var extraBytes = len2 % 3;
      var parts = [];
      var maxChunkLength = 16383;
      for (var i2 = 0, len22 = len2 - extraBytes; i2 < len22; i2 += maxChunkLength) {
        parts.push(encodeChunk(uint8, i2, i2 + maxChunkLength > len22 ? len22 : i2 + maxChunkLength));
      }
      if (extraBytes === 1) {
        tmp = uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 2] + lookup[tmp << 4 & 63] + "=="
        );
      } else if (extraBytes === 2) {
        tmp = (uint8[len2 - 2] << 8) + uint8[len2 - 1];
        parts.push(
          lookup[tmp >> 10] + lookup[tmp >> 4 & 63] + lookup[tmp << 2 & 63] + "="
        );
      }
      return parts.join("");
    }
  }
});

// ../../node_modules/ieee754/index.js
var require_ieee754 = __commonJS({
  "../../node_modules/ieee754/index.js"(exports) {
    "use strict";
    init_polyfills();
    exports.read = function(buffer, offset, isLE, mLen, nBytes) {
      var e, m;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var nBits = -7;
      var i = isLE ? nBytes - 1 : 0;
      var d = isLE ? -1 : 1;
      var s = buffer[offset + i];
      i += d;
      e = s & (1 << -nBits) - 1;
      s >>= -nBits;
      nBits += eLen;
      for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      m = e & (1 << -nBits) - 1;
      e >>= -nBits;
      nBits += mLen;
      for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
      }
      if (e === 0) {
        e = 1 - eBias;
      } else if (e === eMax) {
        return m ? NaN : (s ? -1 : 1) * Infinity;
      } else {
        m = m + Math.pow(2, mLen);
        e = e - eBias;
      }
      return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
    };
    exports.write = function(buffer, value, offset, isLE, mLen, nBytes) {
      var e, m, c;
      var eLen = nBytes * 8 - mLen - 1;
      var eMax = (1 << eLen) - 1;
      var eBias = eMax >> 1;
      var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
      var i = isLE ? 0 : nBytes - 1;
      var d = isLE ? 1 : -1;
      var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
      value = Math.abs(value);
      if (isNaN(value) || value === Infinity) {
        m = isNaN(value) ? 1 : 0;
        e = eMax;
      } else {
        e = Math.floor(Math.log(value) / Math.LN2);
        if (value * (c = Math.pow(2, -e)) < 1) {
          e--;
          c *= 2;
        }
        if (e + eBias >= 1) {
          value += rt / c;
        } else {
          value += rt * Math.pow(2, 1 - eBias);
        }
        if (value * c >= 2) {
          e++;
          c /= 2;
        }
        if (e + eBias >= eMax) {
          m = 0;
          e = eMax;
        } else if (e + eBias >= 1) {
          m = (value * c - 1) * Math.pow(2, mLen);
          e = e + eBias;
        } else {
          m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
          e = 0;
        }
      }
      for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
      }
      e = e << mLen | m;
      eLen += mLen;
      for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
      }
      buffer[offset + i - d] |= s * 128;
    };
  }
});

// ../../node_modules/buffer/index.js
var require_buffer = __commonJS({
  "../../node_modules/buffer/index.js"(exports) {
    "use strict";
    init_polyfills();
    var base64 = require_base64_js();
    var ieee754 = require_ieee754();
    var customInspectSymbol = typeof Symbol === "function" && typeof Symbol["for"] === "function" ? Symbol["for"]("nodejs.util.inspect.custom") : null;
    exports.Buffer = Buffer3;
    exports.SlowBuffer = SlowBuffer;
    exports.INSPECT_MAX_BYTES = 50;
    var K_MAX_LENGTH = 2147483647;
    exports.kMaxLength = K_MAX_LENGTH;
    Buffer3.TYPED_ARRAY_SUPPORT = typedArraySupport();
    if (!Buffer3.TYPED_ARRAY_SUPPORT && typeof console !== "undefined" && typeof console.error === "function") {
      console.error(
        "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
      );
    }
    function typedArraySupport() {
      try {
        const arr = new Uint8Array(1);
        const proto = { foo: function() {
          return 42;
        } };
        Object.setPrototypeOf(proto, Uint8Array.prototype);
        Object.setPrototypeOf(arr, proto);
        return arr.foo() === 42;
      } catch (e) {
        return false;
      }
    }
    Object.defineProperty(Buffer3.prototype, "parent", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.buffer;
      }
    });
    Object.defineProperty(Buffer3.prototype, "offset", {
      enumerable: true,
      get: function() {
        if (!Buffer3.isBuffer(this)) return void 0;
        return this.byteOffset;
      }
    });
    function createBuffer(length) {
      if (length > K_MAX_LENGTH) {
        throw new RangeError('The value "' + length + '" is invalid for option "size"');
      }
      const buf = new Uint8Array(length);
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function Buffer3(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        if (typeof encodingOrOffset === "string") {
          throw new TypeError(
            'The "string" argument must be of type string. Received type number'
          );
        }
        return allocUnsafe(arg);
      }
      return from(arg, encodingOrOffset, length);
    }
    Buffer3.poolSize = 8192;
    function from(value, encodingOrOffset, length) {
      if (typeof value === "string") {
        return fromString(value, encodingOrOffset);
      }
      if (ArrayBuffer.isView(value)) {
        return fromArrayView(value);
      }
      if (value == null) {
        throw new TypeError(
          "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
        );
      }
      if (isInstance(value, ArrayBuffer) || value && isInstance(value.buffer, ArrayBuffer)) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof SharedArrayBuffer !== "undefined" && (isInstance(value, SharedArrayBuffer) || value && isInstance(value.buffer, SharedArrayBuffer))) {
        return fromArrayBuffer(value, encodingOrOffset, length);
      }
      if (typeof value === "number") {
        throw new TypeError(
          'The "value" argument must not be of type number. Received type number'
        );
      }
      const valueOf = value.valueOf && value.valueOf();
      if (valueOf != null && valueOf !== value) {
        return Buffer3.from(valueOf, encodingOrOffset, length);
      }
      const b = fromObject(value);
      if (b) return b;
      if (typeof Symbol !== "undefined" && Symbol.toPrimitive != null && typeof value[Symbol.toPrimitive] === "function") {
        return Buffer3.from(value[Symbol.toPrimitive]("string"), encodingOrOffset, length);
      }
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value
      );
    }
    Buffer3.from = function(value, encodingOrOffset, length) {
      return from(value, encodingOrOffset, length);
    };
    Object.setPrototypeOf(Buffer3.prototype, Uint8Array.prototype);
    Object.setPrototypeOf(Buffer3, Uint8Array);
    function assertSize(size) {
      if (typeof size !== "number") {
        throw new TypeError('"size" argument must be of type number');
      } else if (size < 0) {
        throw new RangeError('The value "' + size + '" is invalid for option "size"');
      }
    }
    function alloc(size, fill, encoding) {
      assertSize(size);
      if (size <= 0) {
        return createBuffer(size);
      }
      if (fill !== void 0) {
        return typeof encoding === "string" ? createBuffer(size).fill(fill, encoding) : createBuffer(size).fill(fill);
      }
      return createBuffer(size);
    }
    Buffer3.alloc = function(size, fill, encoding) {
      return alloc(size, fill, encoding);
    };
    function allocUnsafe(size) {
      assertSize(size);
      return createBuffer(size < 0 ? 0 : checked(size) | 0);
    }
    Buffer3.allocUnsafe = function(size) {
      return allocUnsafe(size);
    };
    Buffer3.allocUnsafeSlow = function(size) {
      return allocUnsafe(size);
    };
    function fromString(string, encoding) {
      if (typeof encoding !== "string" || encoding === "") {
        encoding = "utf8";
      }
      if (!Buffer3.isEncoding(encoding)) {
        throw new TypeError("Unknown encoding: " + encoding);
      }
      const length = byteLength(string, encoding) | 0;
      let buf = createBuffer(length);
      const actual = buf.write(string, encoding);
      if (actual !== length) {
        buf = buf.slice(0, actual);
      }
      return buf;
    }
    function fromArrayLike(array) {
      const length = array.length < 0 ? 0 : checked(array.length) | 0;
      const buf = createBuffer(length);
      for (let i = 0; i < length; i += 1) {
        buf[i] = array[i] & 255;
      }
      return buf;
    }
    function fromArrayView(arrayView) {
      if (isInstance(arrayView, Uint8Array)) {
        const copy = new Uint8Array(arrayView);
        return fromArrayBuffer(copy.buffer, copy.byteOffset, copy.byteLength);
      }
      return fromArrayLike(arrayView);
    }
    function fromArrayBuffer(array, byteOffset, length) {
      if (byteOffset < 0 || array.byteLength < byteOffset) {
        throw new RangeError('"offset" is outside of buffer bounds');
      }
      if (array.byteLength < byteOffset + (length || 0)) {
        throw new RangeError('"length" is outside of buffer bounds');
      }
      let buf;
      if (byteOffset === void 0 && length === void 0) {
        buf = new Uint8Array(array);
      } else if (length === void 0) {
        buf = new Uint8Array(array, byteOffset);
      } else {
        buf = new Uint8Array(array, byteOffset, length);
      }
      Object.setPrototypeOf(buf, Buffer3.prototype);
      return buf;
    }
    function fromObject(obj) {
      if (Buffer3.isBuffer(obj)) {
        const len = checked(obj.length) | 0;
        const buf = createBuffer(len);
        if (buf.length === 0) {
          return buf;
        }
        obj.copy(buf, 0, 0, len);
        return buf;
      }
      if (obj.length !== void 0) {
        if (typeof obj.length !== "number" || numberIsNaN(obj.length)) {
          return createBuffer(0);
        }
        return fromArrayLike(obj);
      }
      if (obj.type === "Buffer" && Array.isArray(obj.data)) {
        return fromArrayLike(obj.data);
      }
    }
    function checked(length) {
      if (length >= K_MAX_LENGTH) {
        throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + K_MAX_LENGTH.toString(16) + " bytes");
      }
      return length | 0;
    }
    function SlowBuffer(length) {
      if (+length != length) {
        length = 0;
      }
      return Buffer3.alloc(+length);
    }
    Buffer3.isBuffer = function isBuffer(b) {
      return b != null && b._isBuffer === true && b !== Buffer3.prototype;
    };
    Buffer3.compare = function compare(a, b) {
      if (isInstance(a, Uint8Array)) a = Buffer3.from(a, a.offset, a.byteLength);
      if (isInstance(b, Uint8Array)) b = Buffer3.from(b, b.offset, b.byteLength);
      if (!Buffer3.isBuffer(a) || !Buffer3.isBuffer(b)) {
        throw new TypeError(
          'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
        );
      }
      if (a === b) return 0;
      let x = a.length;
      let y = b.length;
      for (let i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    Buffer3.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer3.concat = function concat(list, length) {
      if (!Array.isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer3.alloc(0);
      }
      let i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      const buffer = Buffer3.allocUnsafe(length);
      let pos = 0;
      for (i = 0; i < list.length; ++i) {
        let buf = list[i];
        if (isInstance(buf, Uint8Array)) {
          if (pos + buf.length > buffer.length) {
            if (!Buffer3.isBuffer(buf)) buf = Buffer3.from(buf);
            buf.copy(buffer, pos);
          } else {
            Uint8Array.prototype.set.call(
              buffer,
              buf,
              pos
            );
          }
        } else if (!Buffer3.isBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        } else {
          buf.copy(buffer, pos);
        }
        pos += buf.length;
      }
      return buffer;
    };
    function byteLength(string, encoding) {
      if (Buffer3.isBuffer(string)) {
        return string.length;
      }
      if (ArrayBuffer.isView(string) || isInstance(string, ArrayBuffer)) {
        return string.byteLength;
      }
      if (typeof string !== "string") {
        throw new TypeError(
          'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' + typeof string
        );
      }
      const len = string.length;
      const mustMatch = arguments.length > 2 && arguments[2] === true;
      if (!mustMatch && len === 0) return 0;
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "ascii":
          case "latin1":
          case "binary":
            return len;
          case "utf8":
          case "utf-8":
            return utf8ToBytes(string).length;
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return len * 2;
          case "hex":
            return len >>> 1;
          case "base64":
            return base64ToBytes(string).length;
          default:
            if (loweredCase) {
              return mustMatch ? -1 : utf8ToBytes(string).length;
            }
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.byteLength = byteLength;
    function slowToString(encoding, start, end) {
      let loweredCase = false;
      if (start === void 0 || start < 0) {
        start = 0;
      }
      if (start > this.length) {
        return "";
      }
      if (end === void 0 || end > this.length) {
        end = this.length;
      }
      if (end <= 0) {
        return "";
      }
      end >>>= 0;
      start >>>= 0;
      if (end <= start) {
        return "";
      }
      if (!encoding) encoding = "utf8";
      while (true) {
        switch (encoding) {
          case "hex":
            return hexSlice(this, start, end);
          case "utf8":
          case "utf-8":
            return utf8Slice(this, start, end);
          case "ascii":
            return asciiSlice(this, start, end);
          case "latin1":
          case "binary":
            return latin1Slice(this, start, end);
          case "base64":
            return base64Slice(this, start, end);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return utf16leSlice(this, start, end);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = (encoding + "").toLowerCase();
            loweredCase = true;
        }
      }
    }
    Buffer3.prototype._isBuffer = true;
    function swap(b, n, m) {
      const i = b[n];
      b[n] = b[m];
      b[m] = i;
    }
    Buffer3.prototype.swap16 = function swap16() {
      const len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (let i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer3.prototype.swap32 = function swap32() {
      const len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (let i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer3.prototype.swap64 = function swap64() {
      const len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (let i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer3.prototype.toString = function toString() {
      const length = this.length;
      if (length === 0) return "";
      if (arguments.length === 0) return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer3.prototype.toLocaleString = Buffer3.prototype.toString;
    Buffer3.prototype.equals = function equals(b) {
      if (!Buffer3.isBuffer(b)) throw new TypeError("Argument must be a Buffer");
      if (this === b) return true;
      return Buffer3.compare(this, b) === 0;
    };
    Buffer3.prototype.inspect = function inspect() {
      let str = "";
      const max = exports.INSPECT_MAX_BYTES;
      str = this.toString("hex", 0, max).replace(/(.{2})/g, "$1 ").trim();
      if (this.length > max) str += " ... ";
      return "<Buffer " + str + ">";
    };
    if (customInspectSymbol) {
      Buffer3.prototype[customInspectSymbol] = Buffer3.prototype.inspect;
    }
    Buffer3.prototype.compare = function compare(target, start, end, thisStart, thisEnd) {
      if (isInstance(target, Uint8Array)) {
        target = Buffer3.from(target, target.offset, target.byteLength);
      }
      if (!Buffer3.isBuffer(target)) {
        throw new TypeError(
          'The "target" argument must be one of type Buffer or Uint8Array. Received type ' + typeof target
        );
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target) return 0;
      let x = thisEnd - thisStart;
      let y = end - start;
      const len = Math.min(x, y);
      const thisCopy = this.slice(thisStart, thisEnd);
      const targetCopy = target.slice(start, end);
      for (let i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y) return -1;
      if (y < x) return 1;
      return 0;
    };
    function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
      if (buffer.length === 0) return -1;
      if (typeof byteOffset === "string") {
        encoding = byteOffset;
        byteOffset = 0;
      } else if (byteOffset > 2147483647) {
        byteOffset = 2147483647;
      } else if (byteOffset < -2147483648) {
        byteOffset = -2147483648;
      }
      byteOffset = +byteOffset;
      if (numberIsNaN(byteOffset)) {
        byteOffset = dir ? 0 : buffer.length - 1;
      }
      if (byteOffset < 0) byteOffset = buffer.length + byteOffset;
      if (byteOffset >= buffer.length) {
        if (dir) return -1;
        else byteOffset = buffer.length - 1;
      } else if (byteOffset < 0) {
        if (dir) byteOffset = 0;
        else return -1;
      }
      if (typeof val === "string") {
        val = Buffer3.from(val, encoding);
      }
      if (Buffer3.isBuffer(val)) {
        if (val.length === 0) {
          return -1;
        }
        return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
      } else if (typeof val === "number") {
        val = val & 255;
        if (typeof Uint8Array.prototype.indexOf === "function") {
          if (dir) {
            return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
          } else {
            return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
          }
        }
        return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
      }
      throw new TypeError("val must be string, number or Buffer");
    }
    function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
      let indexSize = 1;
      let arrLength = arr.length;
      let valLength = val.length;
      if (encoding !== void 0) {
        encoding = String(encoding).toLowerCase();
        if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
          if (arr.length < 2 || val.length < 2) {
            return -1;
          }
          indexSize = 2;
          arrLength /= 2;
          valLength /= 2;
          byteOffset /= 2;
        }
      }
      function read(buf, i2) {
        if (indexSize === 1) {
          return buf[i2];
        } else {
          return buf.readUInt16BE(i2 * indexSize);
        }
      }
      let i;
      if (dir) {
        let foundIndex = -1;
        for (i = byteOffset; i < arrLength; i++) {
          if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
            if (foundIndex === -1) foundIndex = i;
            if (i - foundIndex + 1 === valLength) return foundIndex * indexSize;
          } else {
            if (foundIndex !== -1) i -= i - foundIndex;
            foundIndex = -1;
          }
        }
      } else {
        if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength;
        for (i = byteOffset; i >= 0; i--) {
          let found = true;
          for (let j = 0; j < valLength; j++) {
            if (read(arr, i + j) !== read(val, j)) {
              found = false;
              break;
            }
          }
          if (found) return i;
        }
      }
      return -1;
    }
    Buffer3.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer3.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer3.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    function hexWrite(buf, string, offset, length) {
      offset = Number(offset) || 0;
      const remaining = buf.length - offset;
      if (!length) {
        length = remaining;
      } else {
        length = Number(length);
        if (length > remaining) {
          length = remaining;
        }
      }
      const strLen = string.length;
      if (length > strLen / 2) {
        length = strLen / 2;
      }
      let i;
      for (i = 0; i < length; ++i) {
        const parsed = parseInt(string.substr(i * 2, 2), 16);
        if (numberIsNaN(parsed)) return i;
        buf[offset + i] = parsed;
      }
      return i;
    }
    function utf8Write(buf, string, offset, length) {
      return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
    }
    function asciiWrite(buf, string, offset, length) {
      return blitBuffer(asciiToBytes(string), buf, offset, length);
    }
    function base64Write(buf, string, offset, length) {
      return blitBuffer(base64ToBytes(string), buf, offset, length);
    }
    function ucs2Write(buf, string, offset, length) {
      return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
    }
    Buffer3.prototype.write = function write(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset >>> 0;
        if (isFinite(length)) {
          length = length >>> 0;
          if (encoding === void 0) encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      const remaining = this.length - offset;
      if (length === void 0 || length > remaining) length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding) encoding = "utf8";
      let loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
          case "latin1":
          case "binary":
            return asciiWrite(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase) throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer3.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    function base64Slice(buf, start, end) {
      if (start === 0 && end === buf.length) {
        return base64.fromByteArray(buf);
      } else {
        return base64.fromByteArray(buf.slice(start, end));
      }
    }
    function utf8Slice(buf, start, end) {
      end = Math.min(buf.length, end);
      const res = [];
      let i = start;
      while (i < end) {
        const firstByte = buf[i];
        let codePoint = null;
        let bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
        if (i + bytesPerSequence <= end) {
          let secondByte, thirdByte, fourthByte, tempCodePoint;
          switch (bytesPerSequence) {
            case 1:
              if (firstByte < 128) {
                codePoint = firstByte;
              }
              break;
            case 2:
              secondByte = buf[i + 1];
              if ((secondByte & 192) === 128) {
                tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
                if (tempCodePoint > 127) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 3:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
                if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
                  codePoint = tempCodePoint;
                }
              }
              break;
            case 4:
              secondByte = buf[i + 1];
              thirdByte = buf[i + 2];
              fourthByte = buf[i + 3];
              if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
                tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
                if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
                  codePoint = tempCodePoint;
                }
              }
          }
        }
        if (codePoint === null) {
          codePoint = 65533;
          bytesPerSequence = 1;
        } else if (codePoint > 65535) {
          codePoint -= 65536;
          res.push(codePoint >>> 10 & 1023 | 55296);
          codePoint = 56320 | codePoint & 1023;
        }
        res.push(codePoint);
        i += bytesPerSequence;
      }
      return decodeCodePointsArray(res);
    }
    var MAX_ARGUMENTS_LENGTH = 4096;
    function decodeCodePointsArray(codePoints) {
      const len = codePoints.length;
      if (len <= MAX_ARGUMENTS_LENGTH) {
        return String.fromCharCode.apply(String, codePoints);
      }
      let res = "";
      let i = 0;
      while (i < len) {
        res += String.fromCharCode.apply(
          String,
          codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
        );
      }
      return res;
    }
    function asciiSlice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i] & 127);
      }
      return ret;
    }
    function latin1Slice(buf, start, end) {
      let ret = "";
      end = Math.min(buf.length, end);
      for (let i = start; i < end; ++i) {
        ret += String.fromCharCode(buf[i]);
      }
      return ret;
    }
    function hexSlice(buf, start, end) {
      const len = buf.length;
      if (!start || start < 0) start = 0;
      if (!end || end < 0 || end > len) end = len;
      let out = "";
      for (let i = start; i < end; ++i) {
        out += hexSliceLookupTable[buf[i]];
      }
      return out;
    }
    function utf16leSlice(buf, start, end) {
      const bytes = buf.slice(start, end);
      let res = "";
      for (let i = 0; i < bytes.length - 1; i += 2) {
        res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
      }
      return res;
    }
    Buffer3.prototype.slice = function slice(start, end) {
      const len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0) start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0) end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start) end = start;
      const newBuf = this.subarray(start, end);
      Object.setPrototypeOf(newBuf, Buffer3.prototype);
      return newBuf;
    };
    function checkOffset(offset, ext, length) {
      if (offset % 1 !== 0 || offset < 0) throw new RangeError("offset is not uint");
      if (offset + ext > length) throw new RangeError("Trying to access beyond buffer length");
    }
    Buffer3.prototype.readUintLE = Buffer3.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUintBE = Buffer3.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      let val = this[offset + --byteLength2];
      let mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer3.prototype.readUint8 = Buffer3.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer3.prototype.readUint16LE = Buffer3.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer3.prototype.readUint16BE = Buffer3.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer3.prototype.readUint32LE = Buffer3.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer3.prototype.readUint32BE = Buffer3.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer3.prototype.readBigUInt64LE = defineBigIntMethod(function readBigUInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const lo = first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24;
      const hi = this[++offset] + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + last * 2 ** 24;
      return BigInt(lo) + (BigInt(hi) << BigInt(32));
    });
    Buffer3.prototype.readBigUInt64BE = defineBigIntMethod(function readBigUInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const hi = first * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      const lo = this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last;
      return (BigInt(hi) << BigInt(32)) + BigInt(lo);
    });
    Buffer3.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let val = this[offset];
      let mul = 1;
      let i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) checkOffset(offset, byteLength2, this.length);
      let i = byteLength2;
      let mul = 1;
      let val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul) val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer3.prototype.readInt8 = function readInt8(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128)) return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer3.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 2, this.length);
      const val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer3.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer3.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer3.prototype.readBigInt64LE = defineBigIntMethod(function readBigInt64LE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = this[offset + 4] + this[offset + 5] * 2 ** 8 + this[offset + 6] * 2 ** 16 + (last << 24);
      return (BigInt(val) << BigInt(32)) + BigInt(first + this[++offset] * 2 ** 8 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 24);
    });
    Buffer3.prototype.readBigInt64BE = defineBigIntMethod(function readBigInt64BE(offset) {
      offset = offset >>> 0;
      validateNumber(offset, "offset");
      const first = this[offset];
      const last = this[offset + 7];
      if (first === void 0 || last === void 0) {
        boundsError(offset, this.length - 8);
      }
      const val = (first << 24) + // Overflow
      this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + this[++offset];
      return (BigInt(val) << BigInt(32)) + BigInt(this[++offset] * 2 ** 24 + this[++offset] * 2 ** 16 + this[++offset] * 2 ** 8 + last);
    });
    Buffer3.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, true, 23, 4);
    };
    Buffer3.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 4, this.length);
      return ieee754.read(this, offset, false, 23, 4);
    };
    Buffer3.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, true, 52, 8);
    };
    Buffer3.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      offset = offset >>> 0;
      if (!noAssert) checkOffset(offset, 8, this.length);
      return ieee754.read(this, offset, false, 52, 8);
    };
    function checkInt(buf, value, offset, ext, max, min) {
      if (!Buffer3.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance');
      if (value > max || value < min) throw new RangeError('"value" argument is out of bounds');
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
    }
    Buffer3.prototype.writeUintLE = Buffer3.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let mul = 1;
      let i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUintBE = Buffer3.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      byteLength2 = byteLength2 >>> 0;
      if (!noAssert) {
        const maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeUint8 = Buffer3.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 255, 0);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeUint16LE = Buffer3.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeUint16BE = Buffer3.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 65535, 0);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeUint32LE = Buffer3.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset + 3] = value >>> 24;
      this[offset + 2] = value >>> 16;
      this[offset + 1] = value >>> 8;
      this[offset] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeUint32BE = Buffer3.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 4294967295, 0);
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    function wrtBigUInt64LE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      lo = lo >> 8;
      buf[offset++] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      hi = hi >> 8;
      buf[offset++] = hi;
      return offset;
    }
    function wrtBigUInt64BE(buf, value, offset, min, max) {
      checkIntBI(value, min, max, buf, offset, 7);
      let lo = Number(value & BigInt(4294967295));
      buf[offset + 7] = lo;
      lo = lo >> 8;
      buf[offset + 6] = lo;
      lo = lo >> 8;
      buf[offset + 5] = lo;
      lo = lo >> 8;
      buf[offset + 4] = lo;
      let hi = Number(value >> BigInt(32) & BigInt(4294967295));
      buf[offset + 3] = hi;
      hi = hi >> 8;
      buf[offset + 2] = hi;
      hi = hi >> 8;
      buf[offset + 1] = hi;
      hi = hi >> 8;
      buf[offset] = hi;
      return offset + 8;
    }
    Buffer3.prototype.writeBigUInt64LE = defineBigIntMethod(function writeBigUInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeBigUInt64BE = defineBigIntMethod(function writeBigUInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, BigInt(0), BigInt("0xffffffffffffffff"));
    });
    Buffer3.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = 0;
      let mul = 1;
      let sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        const limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      let i = byteLength2 - 1;
      let mul = 1;
      let sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer3.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 1, 127, -128);
      if (value < 0) value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer3.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      return offset + 2;
    };
    Buffer3.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 2, 32767, -32768);
      this[offset] = value >>> 8;
      this[offset + 1] = value & 255;
      return offset + 2;
    };
    Buffer3.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      this[offset] = value & 255;
      this[offset + 1] = value >>> 8;
      this[offset + 2] = value >>> 16;
      this[offset + 3] = value >>> 24;
      return offset + 4;
    };
    Buffer3.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0) value = 4294967295 + value + 1;
      this[offset] = value >>> 24;
      this[offset + 1] = value >>> 16;
      this[offset + 2] = value >>> 8;
      this[offset + 3] = value & 255;
      return offset + 4;
    };
    Buffer3.prototype.writeBigInt64LE = defineBigIntMethod(function writeBigInt64LE(value, offset = 0) {
      return wrtBigUInt64LE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    Buffer3.prototype.writeBigInt64BE = defineBigIntMethod(function writeBigInt64BE(value, offset = 0) {
      return wrtBigUInt64BE(this, value, offset, -BigInt("0x8000000000000000"), BigInt("0x7fffffffffffffff"));
    });
    function checkIEEE754(buf, value, offset, ext, max, min) {
      if (offset + ext > buf.length) throw new RangeError("Index out of range");
      if (offset < 0) throw new RangeError("Index out of range");
    }
    function writeFloat(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 4, 34028234663852886e22, -34028234663852886e22);
      }
      ieee754.write(buf, value, offset, littleEndian, 23, 4);
      return offset + 4;
    }
    Buffer3.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    function writeDouble(buf, value, offset, littleEndian, noAssert) {
      value = +value;
      offset = offset >>> 0;
      if (!noAssert) {
        checkIEEE754(buf, value, offset, 8, 17976931348623157e292, -17976931348623157e292);
      }
      ieee754.write(buf, value, offset, littleEndian, 52, 8);
      return offset + 8;
    }
    Buffer3.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer3.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer3.prototype.copy = function copy(target, targetStart, start, end) {
      if (!Buffer3.isBuffer(target)) throw new TypeError("argument should be a Buffer");
      if (!start) start = 0;
      if (!end && end !== 0) end = this.length;
      if (targetStart >= target.length) targetStart = target.length;
      if (!targetStart) targetStart = 0;
      if (end > 0 && end < start) end = start;
      if (end === start) return 0;
      if (target.length === 0 || this.length === 0) return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length) throw new RangeError("Index out of range");
      if (end < 0) throw new RangeError("sourceEnd out of bounds");
      if (end > this.length) end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      const len = end - start;
      if (this === target && typeof Uint8Array.prototype.copyWithin === "function") {
        this.copyWithin(targetStart, start, end);
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, end),
          targetStart
        );
      }
      return len;
    };
    Buffer3.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer3.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
        if (val.length === 1) {
          const code = val.charCodeAt(0);
          if (encoding === "utf8" && code < 128 || encoding === "latin1") {
            val = code;
          }
        }
      } else if (typeof val === "number") {
        val = val & 255;
      } else if (typeof val === "boolean") {
        val = Number(val);
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val) val = 0;
      let i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        const bytes = Buffer3.isBuffer(val) ? val : Buffer3.from(val, encoding);
        const len = bytes.length;
        if (len === 0) {
          throw new TypeError('The value "' + val + '" is invalid for argument "value"');
        }
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    var errors = {};
    function E(sym, getMessage, Base) {
      errors[sym] = class NodeError extends Base {
        constructor() {
          super();
          Object.defineProperty(this, "message", {
            value: getMessage.apply(this, arguments),
            writable: true,
            configurable: true
          });
          this.name = `${this.name} [${sym}]`;
          this.stack;
          delete this.name;
        }
        get code() {
          return sym;
        }
        set code(value) {
          Object.defineProperty(this, "code", {
            configurable: true,
            enumerable: true,
            value,
            writable: true
          });
        }
        toString() {
          return `${this.name} [${sym}]: ${this.message}`;
        }
      };
    }
    E(
      "ERR_BUFFER_OUT_OF_BOUNDS",
      function(name) {
        if (name) {
          return `${name} is outside of buffer bounds`;
        }
        return "Attempt to access memory outside buffer bounds";
      },
      RangeError
    );
    E(
      "ERR_INVALID_ARG_TYPE",
      function(name, actual) {
        return `The "${name}" argument must be of type number. Received type ${typeof actual}`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      function(str, range, input) {
        let msg = `The value of "${str}" is out of range.`;
        let received = input;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > BigInt(2) ** BigInt(32) || input < -(BigInt(2) ** BigInt(32))) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        }
        msg += ` It must be ${range}. Received ${received}`;
        return msg;
      },
      RangeError
    );
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function checkBounds(buf, offset, byteLength2) {
      validateNumber(offset, "offset");
      if (buf[offset] === void 0 || buf[offset + byteLength2] === void 0) {
        boundsError(offset, buf.length - (byteLength2 + 1));
      }
    }
    function checkIntBI(value, min, max, buf, offset, byteLength2) {
      if (value > max || value < min) {
        const n = typeof min === "bigint" ? "n" : "";
        let range;
        if (byteLength2 > 3) {
          if (min === 0 || min === BigInt(0)) {
            range = `>= 0${n} and < 2${n} ** ${(byteLength2 + 1) * 8}${n}`;
          } else {
            range = `>= -(2${n} ** ${(byteLength2 + 1) * 8 - 1}${n}) and < 2 ** ${(byteLength2 + 1) * 8 - 1}${n}`;
          }
        } else {
          range = `>= ${min}${n} and <= ${max}${n}`;
        }
        throw new errors.ERR_OUT_OF_RANGE("value", range, value);
      }
      checkBounds(buf, offset, byteLength2);
    }
    function validateNumber(value, name) {
      if (typeof value !== "number") {
        throw new errors.ERR_INVALID_ARG_TYPE(name, "number", value);
      }
    }
    function boundsError(value, length, type) {
      if (Math.floor(value) !== value) {
        validateNumber(value, type);
        throw new errors.ERR_OUT_OF_RANGE(type || "offset", "an integer", value);
      }
      if (length < 0) {
        throw new errors.ERR_BUFFER_OUT_OF_BOUNDS();
      }
      throw new errors.ERR_OUT_OF_RANGE(
        type || "offset",
        `>= ${type ? 1 : 0} and <= ${length}`,
        value
      );
    }
    var INVALID_BASE64_RE = /[^+/0-9A-Za-z-_]/g;
    function base64clean(str) {
      str = str.split("=")[0];
      str = str.trim().replace(INVALID_BASE64_RE, "");
      if (str.length < 2) return "";
      while (str.length % 4 !== 0) {
        str = str + "=";
      }
      return str;
    }
    function utf8ToBytes(string, units) {
      units = units || Infinity;
      let codePoint;
      const length = string.length;
      let leadSurrogate = null;
      const bytes = [];
      for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i);
        if (codePoint > 55295 && codePoint < 57344) {
          if (!leadSurrogate) {
            if (codePoint > 56319) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            } else if (i + 1 === length) {
              if ((units -= 3) > -1) bytes.push(239, 191, 189);
              continue;
            }
            leadSurrogate = codePoint;
            continue;
          }
          if (codePoint < 56320) {
            if ((units -= 3) > -1) bytes.push(239, 191, 189);
            leadSurrogate = codePoint;
            continue;
          }
          codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
        } else if (leadSurrogate) {
          if ((units -= 3) > -1) bytes.push(239, 191, 189);
        }
        leadSurrogate = null;
        if (codePoint < 128) {
          if ((units -= 1) < 0) break;
          bytes.push(codePoint);
        } else if (codePoint < 2048) {
          if ((units -= 2) < 0) break;
          bytes.push(
            codePoint >> 6 | 192,
            codePoint & 63 | 128
          );
        } else if (codePoint < 65536) {
          if ((units -= 3) < 0) break;
          bytes.push(
            codePoint >> 12 | 224,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else if (codePoint < 1114112) {
          if ((units -= 4) < 0) break;
          bytes.push(
            codePoint >> 18 | 240,
            codePoint >> 12 & 63 | 128,
            codePoint >> 6 & 63 | 128,
            codePoint & 63 | 128
          );
        } else {
          throw new Error("Invalid code point");
        }
      }
      return bytes;
    }
    function asciiToBytes(str) {
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        byteArray.push(str.charCodeAt(i) & 255);
      }
      return byteArray;
    }
    function utf16leToBytes(str, units) {
      let c, hi, lo;
      const byteArray = [];
      for (let i = 0; i < str.length; ++i) {
        if ((units -= 2) < 0) break;
        c = str.charCodeAt(i);
        hi = c >> 8;
        lo = c % 256;
        byteArray.push(lo);
        byteArray.push(hi);
      }
      return byteArray;
    }
    function base64ToBytes(str) {
      return base64.toByteArray(base64clean(str));
    }
    function blitBuffer(src, dst, offset, length) {
      let i;
      for (i = 0; i < length; ++i) {
        if (i + offset >= dst.length || i >= src.length) break;
        dst[i + offset] = src[i];
      }
      return i;
    }
    function isInstance(obj, type) {
      return obj instanceof type || obj != null && obj.constructor != null && obj.constructor.name != null && obj.constructor.name === type.name;
    }
    function numberIsNaN(obj) {
      return obj !== obj;
    }
    var hexSliceLookupTable = (function() {
      const alphabet = "0123456789abcdef";
      const table = new Array(256);
      for (let i = 0; i < 16; ++i) {
        const i16 = i * 16;
        for (let j = 0; j < 16; ++j) {
          table[i16 + j] = alphabet[i] + alphabet[j];
        }
      }
      return table;
    })();
    function defineBigIntMethod(fn) {
      return typeof BigInt === "undefined" ? BufferBigIntNotDefined : fn;
    }
    function BufferBigIntNotDefined() {
      throw new Error("BigInt not supported");
    }
  }
});

// ../../node_modules/process/browser.js
var require_browser = __commonJS({
  "../../node_modules/process/browser.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var process2 = module2.exports = {};
    var cachedSetTimeout;
    var cachedClearTimeout;
    function defaultSetTimout() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        if (typeof setTimeout === "function") {
          cachedSetTimeout = setTimeout;
        } else {
          cachedSetTimeout = defaultSetTimout;
        }
      } catch (e) {
        cachedSetTimeout = defaultSetTimout;
      }
      try {
        if (typeof clearTimeout === "function") {
          cachedClearTimeout = clearTimeout;
        } else {
          cachedClearTimeout = defaultClearTimeout;
        }
      } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
      }
    })();
    function runTimeout(fun) {
      if (cachedSetTimeout === setTimeout) {
        return setTimeout(fun, 0);
      }
      if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout.call(null, fun, 0);
        } catch (e2) {
          return cachedSetTimeout.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout(marker) {
      if (cachedClearTimeout === clearTimeout) {
        return clearTimeout(marker);
      }
      if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout(marker);
      } catch (e) {
        try {
          return cachedClearTimeout.call(null, marker);
        } catch (e2) {
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
      while (len) {
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
    process2.nextTick = function(fun) {
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
    function Item(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process2.title = "browser";
    process2.browser = true;
    process2.env = {};
    process2.argv = [];
    process2.version = "";
    process2.versions = {};
    function noop() {
    }
    process2.on = noop;
    process2.addListener = noop;
    process2.once = noop;
    process2.off = noop;
    process2.removeListener = noop;
    process2.removeAllListeners = noop;
    process2.emit = noop;
    process2.prependListener = noop;
    process2.prependOnceListener = noop;
    process2.listeners = function(name) {
      return [];
    };
    process2.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process2.cwd = function() {
      return "/";
    };
    process2.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process2.umask = function() {
      return 0;
    };
  }
});

// src/web/polyfills.ts
var import_buffer, import_process;
var init_polyfills = __esm({
  "src/web/polyfills.ts"() {
    "use strict";
    import_buffer = __toESM(require_buffer());
    import_process = __toESM(require_browser());
  }
});

// ../../node_modules/pubsub-js/src/pubsub.js
var require_pubsub = __commonJS({
  "../../node_modules/pubsub-js/src/pubsub.js"(exports, module2) {
    "use strict";
    init_polyfills();
    (function(root, factory) {
      "use strict";
      var PubSub2 = {};
      if (root.PubSub) {
        PubSub2 = root.PubSub;
        console.warn("PubSub already loaded, using existing version");
      } else {
        root.PubSub = PubSub2;
        factory(PubSub2);
      }
      if (typeof exports === "object") {
        if (module2 !== void 0 && module2.exports) {
          exports = module2.exports = PubSub2;
        }
        exports.PubSub = PubSub2;
        module2.exports = exports = PubSub2;
      } else if (typeof define === "function" && define.amd) {
        define(function() {
          return PubSub2;
        });
      }
    })(typeof window === "object" && window || exports || global, function(PubSub2) {
      "use strict";
      var messages = {}, lastUid = -1, ALL_SUBSCRIBING_MSG = "*";
      function hasKeys(obj) {
        var key;
        for (key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return true;
          }
        }
        return false;
      }
      function throwException(ex) {
        return function reThrowException() {
          throw ex;
        };
      }
      function callSubscriberWithDelayedExceptions(subscriber, message, data) {
        try {
          subscriber(message, data);
        } catch (ex) {
          setTimeout(throwException(ex), 0);
        }
      }
      function callSubscriberWithImmediateExceptions(subscriber, message, data) {
        subscriber(message, data);
      }
      function deliverMessage(originalMessage, matchedMessage, data, immediateExceptions) {
        var subscribers = messages[matchedMessage], callSubscriber = immediateExceptions ? callSubscriberWithImmediateExceptions : callSubscriberWithDelayedExceptions, s;
        if (!Object.prototype.hasOwnProperty.call(messages, matchedMessage)) {
          return;
        }
        for (s in subscribers) {
          if (Object.prototype.hasOwnProperty.call(subscribers, s)) {
            callSubscriber(subscribers[s], originalMessage, data);
          }
        }
      }
      function createDeliveryFunction(message, data, immediateExceptions) {
        return function deliverNamespaced() {
          var topic = String(message), position = topic.lastIndexOf(".");
          deliverMessage(message, message, data, immediateExceptions);
          while (position !== -1) {
            topic = topic.substr(0, position);
            position = topic.lastIndexOf(".");
            deliverMessage(message, topic, data, immediateExceptions);
          }
          deliverMessage(message, ALL_SUBSCRIBING_MSG, data, immediateExceptions);
        };
      }
      function hasDirectSubscribersFor(message) {
        var topic = String(message), found = Boolean(Object.prototype.hasOwnProperty.call(messages, topic) && hasKeys(messages[topic]));
        return found;
      }
      function messageHasSubscribers(message) {
        var topic = String(message), found = hasDirectSubscribersFor(topic) || hasDirectSubscribersFor(ALL_SUBSCRIBING_MSG), position = topic.lastIndexOf(".");
        while (!found && position !== -1) {
          topic = topic.substr(0, position);
          position = topic.lastIndexOf(".");
          found = hasDirectSubscribersFor(topic);
        }
        return found;
      }
      function publish2(message, data, sync, immediateExceptions) {
        message = typeof message === "symbol" ? message.toString() : message;
        var deliver = createDeliveryFunction(message, data, immediateExceptions), hasSubscribers = messageHasSubscribers(message);
        if (!hasSubscribers) {
          return false;
        }
        if (sync === true) {
          deliver();
        } else {
          setTimeout(deliver, 0);
        }
        return true;
      }
      PubSub2.publish = function(message, data) {
        return publish2(message, data, false, PubSub2.immediateExceptions);
      };
      PubSub2.publishSync = function(message, data) {
        return publish2(message, data, true, PubSub2.immediateExceptions);
      };
      PubSub2.subscribe = function(message, func) {
        if (typeof func !== "function") {
          return false;
        }
        message = typeof message === "symbol" ? message.toString() : message;
        if (!Object.prototype.hasOwnProperty.call(messages, message)) {
          messages[message] = {};
        }
        var token = "uid_" + String(++lastUid);
        messages[message][token] = func;
        return token;
      };
      PubSub2.subscribeAll = function(func) {
        return PubSub2.subscribe(ALL_SUBSCRIBING_MSG, func);
      };
      PubSub2.subscribeOnce = function(message, func) {
        var token = PubSub2.subscribe(message, function() {
          PubSub2.unsubscribe(token);
          func.apply(this, arguments);
        });
        return PubSub2;
      };
      PubSub2.clearAllSubscriptions = function clearAllSubscriptions() {
        messages = {};
      };
      PubSub2.clearSubscriptions = function clearSubscriptions(topic) {
        var m;
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
            delete messages[m];
          }
        }
      };
      PubSub2.countSubscriptions = function countSubscriptions(topic) {
        var m;
        var token;
        var count = 0;
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
            for (token in messages[m]) {
              count++;
            }
            break;
          }
        }
        return count;
      };
      PubSub2.getSubscriptions = function getSubscriptions(topic) {
        var m;
        var list = [];
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m) && m.indexOf(topic) === 0) {
            list.push(m);
          }
        }
        return list;
      };
      PubSub2.unsubscribe = function(value) {
        var descendantTopicExists = function(topic) {
          var m2;
          for (m2 in messages) {
            if (Object.prototype.hasOwnProperty.call(messages, m2) && m2.indexOf(topic) === 0) {
              return true;
            }
          }
          return false;
        }, isTopic = typeof value === "string" && (Object.prototype.hasOwnProperty.call(messages, value) || descendantTopicExists(value)), isToken = !isTopic && typeof value === "string", isFunction = typeof value === "function", result = false, m, message, t;
        if (isTopic) {
          PubSub2.clearSubscriptions(value);
          return;
        }
        for (m in messages) {
          if (Object.prototype.hasOwnProperty.call(messages, m)) {
            message = messages[m];
            if (isToken && message[value]) {
              delete message[value];
              result = value;
              break;
            }
            if (isFunction) {
              for (t in message) {
                if (Object.prototype.hasOwnProperty.call(message, t) && message[t] === value) {
                  delete message[t];
                  result = true;
                }
              }
            }
          }
        }
        return result;
      };
    });
  }
});

// ../../node_modules/events/events.js
var require_events = __commonJS({
  "../../node_modules/events/events.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var R = typeof Reflect === "object" ? Reflect : null;
    var ReflectApply = R && typeof R.apply === "function" ? R.apply : function ReflectApply2(target, receiver, args) {
      return Function.prototype.apply.call(target, receiver, args);
    };
    var ReflectOwnKeys;
    if (R && typeof R.ownKeys === "function") {
      ReflectOwnKeys = R.ownKeys;
    } else if (Object.getOwnPropertySymbols) {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target).concat(Object.getOwnPropertySymbols(target));
      };
    } else {
      ReflectOwnKeys = function ReflectOwnKeys2(target) {
        return Object.getOwnPropertyNames(target);
      };
    }
    function ProcessEmitWarning(warning) {
      if (console && console.warn) console.warn(warning);
    }
    var NumberIsNaN = Number.isNaN || function NumberIsNaN2(value) {
      return value !== value;
    };
    function EventEmitter2() {
      EventEmitter2.init.call(this);
    }
    module2.exports = EventEmitter2;
    module2.exports.once = once;
    EventEmitter2.EventEmitter = EventEmitter2;
    EventEmitter2.prototype._events = void 0;
    EventEmitter2.prototype._eventsCount = 0;
    EventEmitter2.prototype._maxListeners = void 0;
    var defaultMaxListeners = 10;
    function checkListener(listener) {
      if (typeof listener !== "function") {
        throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
      }
    }
    Object.defineProperty(EventEmitter2, "defaultMaxListeners", {
      enumerable: true,
      get: function() {
        return defaultMaxListeners;
      },
      set: function(arg) {
        if (typeof arg !== "number" || arg < 0 || NumberIsNaN(arg)) {
          throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + ".");
        }
        defaultMaxListeners = arg;
      }
    });
    EventEmitter2.init = function() {
      if (this._events === void 0 || this._events === Object.getPrototypeOf(this)._events) {
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter2.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || NumberIsNaN(n)) {
        throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + ".");
      }
      this._maxListeners = n;
      return this;
    };
    function _getMaxListeners(that) {
      if (that._maxListeners === void 0)
        return EventEmitter2.defaultMaxListeners;
      return that._maxListeners;
    }
    EventEmitter2.prototype.getMaxListeners = function getMaxListeners() {
      return _getMaxListeners(this);
    };
    EventEmitter2.prototype.emit = function emit(type) {
      var args = [];
      for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
      var doError = type === "error";
      var events = this._events;
      if (events !== void 0)
        doError = doError && events.error === void 0;
      else if (!doError)
        return false;
      if (doError) {
        var er;
        if (args.length > 0)
          er = args[0];
        if (er instanceof Error) {
          throw er;
        }
        var err = new Error("Unhandled error." + (er ? " (" + er.message + ")" : ""));
        err.context = er;
        throw err;
      }
      var handler = events[type];
      if (handler === void 0)
        return false;
      if (typeof handler === "function") {
        ReflectApply(handler, this, args);
      } else {
        var len = handler.length;
        var listeners = arrayClone(handler, len);
        for (var i = 0; i < len; ++i)
          ReflectApply(listeners[i], this, args);
      }
      return true;
    };
    function _addListener(target, type, listener, prepend) {
      var m;
      var events;
      var existing;
      checkListener(listener);
      events = target._events;
      if (events === void 0) {
        events = target._events = /* @__PURE__ */ Object.create(null);
        target._eventsCount = 0;
      } else {
        if (events.newListener !== void 0) {
          target.emit(
            "newListener",
            type,
            listener.listener ? listener.listener : listener
          );
          events = target._events;
        }
        existing = events[type];
      }
      if (existing === void 0) {
        existing = events[type] = listener;
        ++target._eventsCount;
      } else {
        if (typeof existing === "function") {
          existing = events[type] = prepend ? [listener, existing] : [existing, listener];
        } else if (prepend) {
          existing.unshift(listener);
        } else {
          existing.push(listener);
        }
        m = _getMaxListeners(target);
        if (m > 0 && existing.length > m && !existing.warned) {
          existing.warned = true;
          var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + String(type) + " listeners added. Use emitter.setMaxListeners() to increase limit");
          w.name = "MaxListenersExceededWarning";
          w.emitter = target;
          w.type = type;
          w.count = existing.length;
          ProcessEmitWarning(w);
        }
      }
      return target;
    }
    EventEmitter2.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter2.prototype.on = EventEmitter2.prototype.addListener;
    EventEmitter2.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    function onceWrapper() {
      if (!this.fired) {
        this.target.removeListener(this.type, this.wrapFn);
        this.fired = true;
        if (arguments.length === 0)
          return this.listener.call(this.target);
        return this.listener.apply(this.target, arguments);
      }
    }
    function _onceWrap(target, type, listener) {
      var state = { fired: false, wrapFn: void 0, target, type, listener };
      var wrapped = onceWrapper.bind(state);
      wrapped.listener = listener;
      state.wrapFn = wrapped;
      return wrapped;
    }
    EventEmitter2.prototype.once = function once2(type, listener) {
      checkListener(listener);
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      checkListener(listener);
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter2.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      checkListener(listener);
      events = this._events;
      if (events === void 0)
        return this;
      list = events[type];
      if (list === void 0)
        return this;
      if (list === listener || list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = /* @__PURE__ */ Object.create(null);
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length - 1; i >= 0; i--) {
          if (list[i] === listener || list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (position === 0)
          list.shift();
        else {
          spliceOne(list, position);
        }
        if (list.length === 1)
          events[type] = list[0];
        if (events.removeListener !== void 0)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners, events, i;
      events = this._events;
      if (events === void 0)
        return this;
      if (events.removeListener === void 0) {
        if (arguments.length === 0) {
          this._events = /* @__PURE__ */ Object.create(null);
          this._eventsCount = 0;
        } else if (events[type] !== void 0) {
          if (--this._eventsCount === 0)
            this._events = /* @__PURE__ */ Object.create(null);
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys = Object.keys(events);
        var key;
        for (i = 0; i < keys.length; ++i) {
          key = keys[i];
          if (key === "removeListener") continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = /* @__PURE__ */ Object.create(null);
        this._eventsCount = 0;
        return this;
      }
      listeners = events[type];
      if (typeof listeners === "function") {
        this.removeListener(type, listeners);
      } else if (listeners !== void 0) {
        for (i = listeners.length - 1; i >= 0; i--) {
          this.removeListener(type, listeners[i]);
        }
      }
      return this;
    };
    function _listeners(target, type, unwrap) {
      var events = target._events;
      if (events === void 0)
        return [];
      var evlistener = events[type];
      if (evlistener === void 0)
        return [];
      if (typeof evlistener === "function")
        return unwrap ? [evlistener.listener || evlistener] : [evlistener];
      return unwrap ? unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    }
    EventEmitter2.prototype.listeners = function listeners(type) {
      return _listeners(this, type, true);
    };
    EventEmitter2.prototype.rawListeners = function rawListeners(type) {
      return _listeners(this, type, false);
    };
    EventEmitter2.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter2.prototype.listenerCount = listenerCount;
    function listenerCount(type) {
      var events = this._events;
      if (events !== void 0) {
        var evlistener = events[type];
        if (typeof evlistener === "function") {
          return 1;
        } else if (evlistener !== void 0) {
          return evlistener.length;
        }
      }
      return 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    };
    function arrayClone(arr, n) {
      var copy = new Array(n);
      for (var i = 0; i < n; ++i)
        copy[i] = arr[i];
      return copy;
    }
    function spliceOne(list, index) {
      for (; index + 1 < list.length; index++)
        list[index] = list[index + 1];
      list.pop();
    }
    function unwrapListeners(arr) {
      var ret = new Array(arr.length);
      for (var i = 0; i < ret.length; ++i) {
        ret[i] = arr[i].listener || arr[i];
      }
      return ret;
    }
    function once(emitter, name) {
      return new Promise(function(resolve, reject) {
        function errorListener(err) {
          emitter.removeListener(name, resolver);
          reject(err);
        }
        function resolver() {
          if (typeof emitter.removeListener === "function") {
            emitter.removeListener("error", errorListener);
          }
          resolve([].slice.call(arguments));
        }
        ;
        eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
        if (name !== "error") {
          addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
        }
      });
    }
    function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
      if (typeof emitter.on === "function") {
        eventTargetAgnosticAddListener(emitter, "error", handler, flags);
      }
    }
    function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
      if (typeof emitter.on === "function") {
        if (flags.once) {
          emitter.once(name, listener);
        } else {
          emitter.on(name, listener);
        }
      } else if (typeof emitter.addEventListener === "function") {
        emitter.addEventListener(name, function wrapListener(arg) {
          if (flags.once) {
            emitter.removeEventListener(name, wrapListener);
          }
          listener(arg);
        });
      } else {
        throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
      }
    }
  }
});

// ../../node_modules/@vscode/debugadapter/lib/messages.js
var require_messages = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/messages.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Event = exports.Response = exports.Message = void 0;
    var Message = class {
      constructor(type) {
        this.seq = 0;
        this.type = type;
      }
    };
    exports.Message = Message;
    var Response = class extends Message {
      constructor(request, message) {
        super("response");
        this.request_seq = request.seq;
        this.command = request.command;
        if (message) {
          this.success = false;
          this.message = message;
        } else {
          this.success = true;
        }
      }
    };
    exports.Response = Response;
    var Event = class extends Message {
      constructor(event, body) {
        super("event");
        this.event = event;
        if (body) {
          this.body = body;
        }
      }
    };
    exports.Event = Event;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/protocol.js
var require_protocol = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/protocol.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ProtocolServer = void 0;
    var ee = require_events();
    var messages_1 = require_messages();
    var Emitter = class {
      get event() {
        if (!this._event) {
          this._event = (listener, thisArg) => {
            this._listener = listener;
            this._this = thisArg;
            let result;
            result = {
              dispose: () => {
                this._listener = void 0;
                this._this = void 0;
              }
            };
            return result;
          };
        }
        return this._event;
      }
      fire(event) {
        if (this._listener) {
          try {
            this._listener.call(this._this, event);
          } catch (e) {
          }
        }
      }
      hasListener() {
        return !!this._listener;
      }
      dispose() {
        this._listener = void 0;
        this._this = void 0;
      }
    };
    var ProtocolServer = class _ProtocolServer extends ee.EventEmitter {
      constructor() {
        super();
        this._sendMessage = new Emitter();
        this._sequence = 1;
        this._pendingRequests = /* @__PURE__ */ new Map();
        this.onDidSendMessage = this._sendMessage.event;
      }
      // ---- implements vscode.Debugadapter interface ---------------------------
      dispose() {
      }
      handleMessage(msg) {
        if (msg.type === "request") {
          this.dispatchRequest(msg);
        } else if (msg.type === "response") {
          const response = msg;
          const clb = this._pendingRequests.get(response.request_seq);
          if (clb) {
            this._pendingRequests.delete(response.request_seq);
            clb(response);
          }
        }
      }
      _isRunningInline() {
        return this._sendMessage && this._sendMessage.hasListener();
      }
      //--------------------------------------------------------------------------
      start(inStream, outStream) {
        this._writableStream = outStream;
        this._rawData = import_buffer.Buffer.alloc(0);
        inStream.on("data", (data) => this._handleData(data));
        inStream.on("close", () => {
          this._emitEvent(new messages_1.Event("close"));
        });
        inStream.on("error", (error) => {
          this._emitEvent(new messages_1.Event("error", "inStream error: " + (error && error.message)));
        });
        outStream.on("error", (error) => {
          this._emitEvent(new messages_1.Event("error", "outStream error: " + (error && error.message)));
        });
        inStream.resume();
      }
      stop() {
        if (this._writableStream) {
          this._writableStream.end();
        }
      }
      sendEvent(event) {
        this._send("event", event);
      }
      sendResponse(response) {
        if (response.seq > 0) {
          console.error(`attempt to send more than one response for command ${response.command}`);
        } else {
          this._send("response", response);
        }
      }
      sendRequest(command, args, timeout, cb) {
        const request = {
          command
        };
        if (args && Object.keys(args).length > 0) {
          request.arguments = args;
        }
        this._send("request", request);
        if (cb) {
          this._pendingRequests.set(request.seq, cb);
          const timer = setTimeout(() => {
            clearTimeout(timer);
            const clb = this._pendingRequests.get(request.seq);
            if (clb) {
              this._pendingRequests.delete(request.seq);
              clb(new messages_1.Response(request, "timeout"));
            }
          }, timeout);
        }
      }
      // ---- protected ----------------------------------------------------------
      dispatchRequest(request) {
      }
      // ---- private ------------------------------------------------------------
      _emitEvent(event) {
        this.emit(event.event, event);
      }
      _send(typ, message) {
        message.type = typ;
        message.seq = this._sequence++;
        if (this._writableStream) {
          const json = JSON.stringify(message);
          this._writableStream.write(`Content-Length: ${import_buffer.Buffer.byteLength(json, "utf8")}\r
\r
${json}`, "utf8");
        }
        this._sendMessage.fire(message);
      }
      _handleData(data) {
        this._rawData = import_buffer.Buffer.concat([this._rawData, data]);
        while (true) {
          if (this._contentLength >= 0) {
            if (this._rawData.length >= this._contentLength) {
              const message = this._rawData.toString("utf8", 0, this._contentLength);
              this._rawData = this._rawData.slice(this._contentLength);
              this._contentLength = -1;
              if (message.length > 0) {
                try {
                  let msg = JSON.parse(message);
                  this.handleMessage(msg);
                } catch (e) {
                  this._emitEvent(new messages_1.Event("error", "Error handling data: " + (e && e.message)));
                }
              }
              continue;
            }
          } else {
            const idx = this._rawData.indexOf(_ProtocolServer.TWO_CRLF);
            if (idx !== -1) {
              const header = this._rawData.toString("utf8", 0, idx);
              const lines = header.split("\r\n");
              for (let i = 0; i < lines.length; i++) {
                const pair = lines[i].split(/: +/);
                if (pair[0] == "Content-Length") {
                  this._contentLength = +pair[1];
                }
              }
              this._rawData = this._rawData.slice(idx + _ProtocolServer.TWO_CRLF.length);
              continue;
            }
          }
          break;
        }
      }
    };
    exports.ProtocolServer = ProtocolServer;
    ProtocolServer.TWO_CRLF = "\r\n\r\n";
  }
});

// ../../node_modules/@vscode/debugadapter/lib/web/runDebugAdapterStub.js
var require_runDebugAdapterStub = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/web/runDebugAdapterStub.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.runDebugAdapter = void 0;
    function runDebugAdapter() {
    }
    exports.runDebugAdapter = runDebugAdapter;
  }
});

// ../../node_modules/punycode/punycode.js
var require_punycode = __commonJS({
  "../../node_modules/punycode/punycode.js"(exports, module2) {
    "use strict";
    init_polyfills();
    (function(root) {
      var freeExports = typeof exports == "object" && exports && !exports.nodeType && exports;
      var freeModule = typeof module2 == "object" && module2 && !module2.nodeType && module2;
      var freeGlobal = typeof global == "object" && global;
      if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal || freeGlobal.self === freeGlobal) {
        root = freeGlobal;
      }
      var punycode, maxInt = 2147483647, base = 36, tMin = 1, tMax = 26, skew = 38, damp = 700, initialBias = 72, initialN = 128, delimiter = "-", regexPunycode = /^xn--/, regexNonASCII = /[^\x20-\x7E]/, regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, errors = {
        "overflow": "Overflow: input needs wider integers to process",
        "not-basic": "Illegal input >= 0x80 (not a basic code point)",
        "invalid-input": "Invalid input"
      }, baseMinusTMin = base - tMin, floor = Math.floor, stringFromCharCode = String.fromCharCode, key;
      function error(type) {
        throw new RangeError(errors[type]);
      }
      function map(array, fn) {
        var length = array.length;
        var result = [];
        while (length--) {
          result[length] = fn(array[length]);
        }
        return result;
      }
      function mapDomain(string, fn) {
        var parts = string.split("@");
        var result = "";
        if (parts.length > 1) {
          result = parts[0] + "@";
          string = parts[1];
        }
        string = string.replace(regexSeparators, ".");
        var labels = string.split(".");
        var encoded = map(labels, fn).join(".");
        return result + encoded;
      }
      function ucs2decode(string) {
        var output = [], counter = 0, length = string.length, value, extra;
        while (counter < length) {
          value = string.charCodeAt(counter++);
          if (value >= 55296 && value <= 56319 && counter < length) {
            extra = string.charCodeAt(counter++);
            if ((extra & 64512) == 56320) {
              output.push(((value & 1023) << 10) + (extra & 1023) + 65536);
            } else {
              output.push(value);
              counter--;
            }
          } else {
            output.push(value);
          }
        }
        return output;
      }
      function ucs2encode(array) {
        return map(array, function(value) {
          var output = "";
          if (value > 65535) {
            value -= 65536;
            output += stringFromCharCode(value >>> 10 & 1023 | 55296);
            value = 56320 | value & 1023;
          }
          output += stringFromCharCode(value);
          return output;
        }).join("");
      }
      function basicToDigit(codePoint) {
        if (codePoint - 48 < 10) {
          return codePoint - 22;
        }
        if (codePoint - 65 < 26) {
          return codePoint - 65;
        }
        if (codePoint - 97 < 26) {
          return codePoint - 97;
        }
        return base;
      }
      function digitToBasic(digit, flag) {
        return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
      }
      function adapt(delta, numPoints, firstTime) {
        var k = 0;
        delta = firstTime ? floor(delta / damp) : delta >> 1;
        delta += floor(delta / numPoints);
        for (; delta > baseMinusTMin * tMax >> 1; k += base) {
          delta = floor(delta / baseMinusTMin);
        }
        return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
      }
      function decode(input) {
        var output = [], inputLength = input.length, out, i = 0, n = initialN, bias = initialBias, basic, j, index, oldi, w, k, digit, t, baseMinusT;
        basic = input.lastIndexOf(delimiter);
        if (basic < 0) {
          basic = 0;
        }
        for (j = 0; j < basic; ++j) {
          if (input.charCodeAt(j) >= 128) {
            error("not-basic");
          }
          output.push(input.charCodeAt(j));
        }
        for (index = basic > 0 ? basic + 1 : 0; index < inputLength; ) {
          for (oldi = i, w = 1, k = base; ; k += base) {
            if (index >= inputLength) {
              error("invalid-input");
            }
            digit = basicToDigit(input.charCodeAt(index++));
            if (digit >= base || digit > floor((maxInt - i) / w)) {
              error("overflow");
            }
            i += digit * w;
            t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
            if (digit < t) {
              break;
            }
            baseMinusT = base - t;
            if (w > floor(maxInt / baseMinusT)) {
              error("overflow");
            }
            w *= baseMinusT;
          }
          out = output.length + 1;
          bias = adapt(i - oldi, out, oldi == 0);
          if (floor(i / out) > maxInt - n) {
            error("overflow");
          }
          n += floor(i / out);
          i %= out;
          output.splice(i++, 0, n);
        }
        return ucs2encode(output);
      }
      function encode(input) {
        var n, delta, handledCPCount, basicLength, bias, j, m, q, k, t, currentValue, output = [], inputLength, handledCPCountPlusOne, baseMinusT, qMinusT;
        input = ucs2decode(input);
        inputLength = input.length;
        n = initialN;
        delta = 0;
        bias = initialBias;
        for (j = 0; j < inputLength; ++j) {
          currentValue = input[j];
          if (currentValue < 128) {
            output.push(stringFromCharCode(currentValue));
          }
        }
        handledCPCount = basicLength = output.length;
        if (basicLength) {
          output.push(delimiter);
        }
        while (handledCPCount < inputLength) {
          for (m = maxInt, j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue >= n && currentValue < m) {
              m = currentValue;
            }
          }
          handledCPCountPlusOne = handledCPCount + 1;
          if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
            error("overflow");
          }
          delta += (m - n) * handledCPCountPlusOne;
          n = m;
          for (j = 0; j < inputLength; ++j) {
            currentValue = input[j];
            if (currentValue < n && ++delta > maxInt) {
              error("overflow");
            }
            if (currentValue == n) {
              for (q = delta, k = base; ; k += base) {
                t = k <= bias ? tMin : k >= bias + tMax ? tMax : k - bias;
                if (q < t) {
                  break;
                }
                qMinusT = q - t;
                baseMinusT = base - t;
                output.push(
                  stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
                );
                q = floor(qMinusT / baseMinusT);
              }
              output.push(stringFromCharCode(digitToBasic(q, 0)));
              bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
              delta = 0;
              ++handledCPCount;
            }
          }
          ++delta;
          ++n;
        }
        return output.join("");
      }
      function toUnicode(input) {
        return mapDomain(input, function(string) {
          return regexPunycode.test(string) ? decode(string.slice(4).toLowerCase()) : string;
        });
      }
      function toASCII(input) {
        return mapDomain(input, function(string) {
          return regexNonASCII.test(string) ? "xn--" + encode(string) : string;
        });
      }
      punycode = {
        /**
         * A string representing the current Punycode.js version number.
         * @memberOf punycode
         * @type String
         */
        "version": "1.4.1",
        /**
         * An object of methods to convert from JavaScript's internal character
         * representation (UCS-2) to Unicode code points, and back.
         * @see <https://mathiasbynens.be/notes/javascript-encoding>
         * @memberOf punycode
         * @type Object
         */
        "ucs2": {
          "decode": ucs2decode,
          "encode": ucs2encode
        },
        "decode": decode,
        "encode": encode,
        "toASCII": toASCII,
        "toUnicode": toUnicode
      };
      if (typeof define == "function" && typeof define.amd == "object" && define.amd) {
        define("punycode", function() {
          return punycode;
        });
      } else if (freeExports && freeModule) {
        if (module2.exports == freeExports) {
          freeModule.exports = punycode;
        } else {
          for (key in punycode) {
            punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
          }
        }
      } else {
        root.punycode = punycode;
      }
    })(exports);
  }
});

// ../../node_modules/es-errors/type.js
var require_type = __commonJS({
  "../../node_modules/es-errors/type.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = TypeError;
  }
});

// (disabled):../../node_modules/object-inspect/util.inspect
var require_util = __commonJS({
  "(disabled):../../node_modules/object-inspect/util.inspect"() {
    "use strict";
    init_polyfills();
  }
});

// ../../node_modules/object-inspect/index.js
var require_object_inspect = __commonJS({
  "../../node_modules/object-inspect/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var hasMap = typeof Map === "function" && Map.prototype;
    var mapSizeDescriptor = Object.getOwnPropertyDescriptor && hasMap ? Object.getOwnPropertyDescriptor(Map.prototype, "size") : null;
    var mapSize = hasMap && mapSizeDescriptor && typeof mapSizeDescriptor.get === "function" ? mapSizeDescriptor.get : null;
    var mapForEach = hasMap && Map.prototype.forEach;
    var hasSet = typeof Set === "function" && Set.prototype;
    var setSizeDescriptor = Object.getOwnPropertyDescriptor && hasSet ? Object.getOwnPropertyDescriptor(Set.prototype, "size") : null;
    var setSize = hasSet && setSizeDescriptor && typeof setSizeDescriptor.get === "function" ? setSizeDescriptor.get : null;
    var setForEach = hasSet && Set.prototype.forEach;
    var hasWeakMap = typeof WeakMap === "function" && WeakMap.prototype;
    var weakMapHas = hasWeakMap ? WeakMap.prototype.has : null;
    var hasWeakSet = typeof WeakSet === "function" && WeakSet.prototype;
    var weakSetHas = hasWeakSet ? WeakSet.prototype.has : null;
    var hasWeakRef = typeof WeakRef === "function" && WeakRef.prototype;
    var weakRefDeref = hasWeakRef ? WeakRef.prototype.deref : null;
    var booleanValueOf = Boolean.prototype.valueOf;
    var objectToString = Object.prototype.toString;
    var functionToString = Function.prototype.toString;
    var $match = String.prototype.match;
    var $slice = String.prototype.slice;
    var $replace = String.prototype.replace;
    var $toUpperCase = String.prototype.toUpperCase;
    var $toLowerCase = String.prototype.toLowerCase;
    var $test = RegExp.prototype.test;
    var $concat = Array.prototype.concat;
    var $join = Array.prototype.join;
    var $arrSlice = Array.prototype.slice;
    var $floor = Math.floor;
    var bigIntValueOf = typeof BigInt === "function" ? BigInt.prototype.valueOf : null;
    var gOPS = Object.getOwnPropertySymbols;
    var symToString = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? Symbol.prototype.toString : null;
    var hasShammedSymbols = typeof Symbol === "function" && typeof Symbol.iterator === "object";
    var toStringTag = typeof Symbol === "function" && Symbol.toStringTag && (typeof Symbol.toStringTag === hasShammedSymbols ? "object" : "symbol") ? Symbol.toStringTag : null;
    var isEnumerable = Object.prototype.propertyIsEnumerable;
    var gPO = (typeof Reflect === "function" ? Reflect.getPrototypeOf : Object.getPrototypeOf) || ([].__proto__ === Array.prototype ? function(O) {
      return O.__proto__;
    } : null);
    function addNumericSeparator(num, str) {
      if (num === Infinity || num === -Infinity || num !== num || num && num > -1e3 && num < 1e3 || $test.call(/e/, str)) {
        return str;
      }
      var sepRegex = /[0-9](?=(?:[0-9]{3})+(?![0-9]))/g;
      if (typeof num === "number") {
        var int = num < 0 ? -$floor(-num) : $floor(num);
        if (int !== num) {
          var intStr = String(int);
          var dec = $slice.call(str, intStr.length + 1);
          return $replace.call(intStr, sepRegex, "$&_") + "." + $replace.call($replace.call(dec, /([0-9]{3})/g, "$&_"), /_$/, "");
        }
      }
      return $replace.call(str, sepRegex, "$&_");
    }
    var utilInspect = require_util();
    var inspectCustom = utilInspect.custom;
    var inspectSymbol = isSymbol(inspectCustom) ? inspectCustom : null;
    var quotes = {
      __proto__: null,
      "double": '"',
      single: "'"
    };
    var quoteREs = {
      __proto__: null,
      "double": /(["\\])/g,
      single: /(['\\])/g
    };
    module2.exports = function inspect_(obj, options, depth, seen) {
      var opts = options || {};
      if (has(opts, "quoteStyle") && !has(quotes, opts.quoteStyle)) {
        throw new TypeError('option "quoteStyle" must be "single" or "double"');
      }
      if (has(opts, "maxStringLength") && (typeof opts.maxStringLength === "number" ? opts.maxStringLength < 0 && opts.maxStringLength !== Infinity : opts.maxStringLength !== null)) {
        throw new TypeError('option "maxStringLength", if provided, must be a positive integer, Infinity, or `null`');
      }
      var customInspect = has(opts, "customInspect") ? opts.customInspect : true;
      if (typeof customInspect !== "boolean" && customInspect !== "symbol") {
        throw new TypeError("option \"customInspect\", if provided, must be `true`, `false`, or `'symbol'`");
      }
      if (has(opts, "indent") && opts.indent !== null && opts.indent !== "	" && !(parseInt(opts.indent, 10) === opts.indent && opts.indent > 0)) {
        throw new TypeError('option "indent" must be "\\t", an integer > 0, or `null`');
      }
      if (has(opts, "numericSeparator") && typeof opts.numericSeparator !== "boolean") {
        throw new TypeError('option "numericSeparator", if provided, must be `true` or `false`');
      }
      var numericSeparator = opts.numericSeparator;
      if (typeof obj === "undefined") {
        return "undefined";
      }
      if (obj === null) {
        return "null";
      }
      if (typeof obj === "boolean") {
        return obj ? "true" : "false";
      }
      if (typeof obj === "string") {
        return inspectString(obj, opts);
      }
      if (typeof obj === "number") {
        if (obj === 0) {
          return Infinity / obj > 0 ? "0" : "-0";
        }
        var str = String(obj);
        return numericSeparator ? addNumericSeparator(obj, str) : str;
      }
      if (typeof obj === "bigint") {
        var bigIntStr = String(obj) + "n";
        return numericSeparator ? addNumericSeparator(obj, bigIntStr) : bigIntStr;
      }
      var maxDepth = typeof opts.depth === "undefined" ? 5 : opts.depth;
      if (typeof depth === "undefined") {
        depth = 0;
      }
      if (depth >= maxDepth && maxDepth > 0 && typeof obj === "object") {
        return isArray(obj) ? "[Array]" : "[Object]";
      }
      var indent = getIndent(opts, depth);
      if (typeof seen === "undefined") {
        seen = [];
      } else if (indexOf(seen, obj) >= 0) {
        return "[Circular]";
      }
      function inspect(value, from, noIndent) {
        if (from) {
          seen = $arrSlice.call(seen);
          seen.push(from);
        }
        if (noIndent) {
          var newOpts = {
            depth: opts.depth
          };
          if (has(opts, "quoteStyle")) {
            newOpts.quoteStyle = opts.quoteStyle;
          }
          return inspect_(value, newOpts, depth + 1, seen);
        }
        return inspect_(value, opts, depth + 1, seen);
      }
      if (typeof obj === "function" && !isRegExp(obj)) {
        var name = nameOf(obj);
        var keys = arrObjKeys(obj, inspect);
        return "[Function" + (name ? ": " + name : " (anonymous)") + "]" + (keys.length > 0 ? " { " + $join.call(keys, ", ") + " }" : "");
      }
      if (isSymbol(obj)) {
        var symString = hasShammedSymbols ? $replace.call(String(obj), /^(Symbol\(.*\))_[^)]*$/, "$1") : symToString.call(obj);
        return typeof obj === "object" && !hasShammedSymbols ? markBoxed(symString) : symString;
      }
      if (isElement(obj)) {
        var s = "<" + $toLowerCase.call(String(obj.nodeName));
        var attrs = obj.attributes || [];
        for (var i = 0; i < attrs.length; i++) {
          s += " " + attrs[i].name + "=" + wrapQuotes(quote(attrs[i].value), "double", opts);
        }
        s += ">";
        if (obj.childNodes && obj.childNodes.length) {
          s += "...";
        }
        s += "</" + $toLowerCase.call(String(obj.nodeName)) + ">";
        return s;
      }
      if (isArray(obj)) {
        if (obj.length === 0) {
          return "[]";
        }
        var xs = arrObjKeys(obj, inspect);
        if (indent && !singleLineValues(xs)) {
          return "[" + indentedJoin(xs, indent) + "]";
        }
        return "[ " + $join.call(xs, ", ") + " ]";
      }
      if (isError(obj)) {
        var parts = arrObjKeys(obj, inspect);
        if (!("cause" in Error.prototype) && "cause" in obj && !isEnumerable.call(obj, "cause")) {
          return "{ [" + String(obj) + "] " + $join.call($concat.call("[cause]: " + inspect(obj.cause), parts), ", ") + " }";
        }
        if (parts.length === 0) {
          return "[" + String(obj) + "]";
        }
        return "{ [" + String(obj) + "] " + $join.call(parts, ", ") + " }";
      }
      if (typeof obj === "object" && customInspect) {
        if (inspectSymbol && typeof obj[inspectSymbol] === "function" && utilInspect) {
          return utilInspect(obj, { depth: maxDepth - depth });
        } else if (customInspect !== "symbol" && typeof obj.inspect === "function") {
          return obj.inspect();
        }
      }
      if (isMap(obj)) {
        var mapParts = [];
        if (mapForEach) {
          mapForEach.call(obj, function(value, key) {
            mapParts.push(inspect(key, obj, true) + " => " + inspect(value, obj));
          });
        }
        return collectionOf("Map", mapSize.call(obj), mapParts, indent);
      }
      if (isSet(obj)) {
        var setParts = [];
        if (setForEach) {
          setForEach.call(obj, function(value) {
            setParts.push(inspect(value, obj));
          });
        }
        return collectionOf("Set", setSize.call(obj), setParts, indent);
      }
      if (isWeakMap(obj)) {
        return weakCollectionOf("WeakMap");
      }
      if (isWeakSet(obj)) {
        return weakCollectionOf("WeakSet");
      }
      if (isWeakRef(obj)) {
        return weakCollectionOf("WeakRef");
      }
      if (isNumber(obj)) {
        return markBoxed(inspect(Number(obj)));
      }
      if (isBigInt(obj)) {
        return markBoxed(inspect(bigIntValueOf.call(obj)));
      }
      if (isBoolean(obj)) {
        return markBoxed(booleanValueOf.call(obj));
      }
      if (isString(obj)) {
        return markBoxed(inspect(String(obj)));
      }
      if (typeof window !== "undefined" && obj === window) {
        return "{ [object Window] }";
      }
      if (typeof globalThis !== "undefined" && obj === globalThis || typeof global !== "undefined" && obj === global) {
        return "{ [object globalThis] }";
      }
      if (!isDate(obj) && !isRegExp(obj)) {
        var ys = arrObjKeys(obj, inspect);
        var isPlainObject = gPO ? gPO(obj) === Object.prototype : obj instanceof Object || obj.constructor === Object;
        var protoTag = obj instanceof Object ? "" : "null prototype";
        var stringTag = !isPlainObject && toStringTag && Object(obj) === obj && toStringTag in obj ? $slice.call(toStr(obj), 8, -1) : protoTag ? "Object" : "";
        var constructorTag = isPlainObject || typeof obj.constructor !== "function" ? "" : obj.constructor.name ? obj.constructor.name + " " : "";
        var tag = constructorTag + (stringTag || protoTag ? "[" + $join.call($concat.call([], stringTag || [], protoTag || []), ": ") + "] " : "");
        if (ys.length === 0) {
          return tag + "{}";
        }
        if (indent) {
          return tag + "{" + indentedJoin(ys, indent) + "}";
        }
        return tag + "{ " + $join.call(ys, ", ") + " }";
      }
      return String(obj);
    };
    function wrapQuotes(s, defaultStyle, opts) {
      var style = opts.quoteStyle || defaultStyle;
      var quoteChar = quotes[style];
      return quoteChar + s + quoteChar;
    }
    function quote(s) {
      return $replace.call(String(s), /"/g, "&quot;");
    }
    function canTrustToString(obj) {
      return !toStringTag || !(typeof obj === "object" && (toStringTag in obj || typeof obj[toStringTag] !== "undefined"));
    }
    function isArray(obj) {
      return toStr(obj) === "[object Array]" && canTrustToString(obj);
    }
    function isDate(obj) {
      return toStr(obj) === "[object Date]" && canTrustToString(obj);
    }
    function isRegExp(obj) {
      return toStr(obj) === "[object RegExp]" && canTrustToString(obj);
    }
    function isError(obj) {
      return toStr(obj) === "[object Error]" && canTrustToString(obj);
    }
    function isString(obj) {
      return toStr(obj) === "[object String]" && canTrustToString(obj);
    }
    function isNumber(obj) {
      return toStr(obj) === "[object Number]" && canTrustToString(obj);
    }
    function isBoolean(obj) {
      return toStr(obj) === "[object Boolean]" && canTrustToString(obj);
    }
    function isSymbol(obj) {
      if (hasShammedSymbols) {
        return obj && typeof obj === "object" && obj instanceof Symbol;
      }
      if (typeof obj === "symbol") {
        return true;
      }
      if (!obj || typeof obj !== "object" || !symToString) {
        return false;
      }
      try {
        symToString.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isBigInt(obj) {
      if (!obj || typeof obj !== "object" || !bigIntValueOf) {
        return false;
      }
      try {
        bigIntValueOf.call(obj);
        return true;
      } catch (e) {
      }
      return false;
    }
    var hasOwn = Object.prototype.hasOwnProperty || function(key) {
      return key in this;
    };
    function has(obj, key) {
      return hasOwn.call(obj, key);
    }
    function toStr(obj) {
      return objectToString.call(obj);
    }
    function nameOf(f) {
      if (f.name) {
        return f.name;
      }
      var m = $match.call(functionToString.call(f), /^function\s*([\w$]+)/);
      if (m) {
        return m[1];
      }
      return null;
    }
    function indexOf(xs, x) {
      if (xs.indexOf) {
        return xs.indexOf(x);
      }
      for (var i = 0, l = xs.length; i < l; i++) {
        if (xs[i] === x) {
          return i;
        }
      }
      return -1;
    }
    function isMap(x) {
      if (!mapSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        mapSize.call(x);
        try {
          setSize.call(x);
        } catch (s) {
          return true;
        }
        return x instanceof Map;
      } catch (e) {
      }
      return false;
    }
    function isWeakMap(x) {
      if (!weakMapHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakMapHas.call(x, weakMapHas);
        try {
          weakSetHas.call(x, weakSetHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakMap;
      } catch (e) {
      }
      return false;
    }
    function isWeakRef(x) {
      if (!weakRefDeref || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakRefDeref.call(x);
        return true;
      } catch (e) {
      }
      return false;
    }
    function isSet(x) {
      if (!setSize || !x || typeof x !== "object") {
        return false;
      }
      try {
        setSize.call(x);
        try {
          mapSize.call(x);
        } catch (m) {
          return true;
        }
        return x instanceof Set;
      } catch (e) {
      }
      return false;
    }
    function isWeakSet(x) {
      if (!weakSetHas || !x || typeof x !== "object") {
        return false;
      }
      try {
        weakSetHas.call(x, weakSetHas);
        try {
          weakMapHas.call(x, weakMapHas);
        } catch (s) {
          return true;
        }
        return x instanceof WeakSet;
      } catch (e) {
      }
      return false;
    }
    function isElement(x) {
      if (!x || typeof x !== "object") {
        return false;
      }
      if (typeof HTMLElement !== "undefined" && x instanceof HTMLElement) {
        return true;
      }
      return typeof x.nodeName === "string" && typeof x.getAttribute === "function";
    }
    function inspectString(str, opts) {
      if (str.length > opts.maxStringLength) {
        var remaining = str.length - opts.maxStringLength;
        var trailer = "... " + remaining + " more character" + (remaining > 1 ? "s" : "");
        return inspectString($slice.call(str, 0, opts.maxStringLength), opts) + trailer;
      }
      var quoteRE = quoteREs[opts.quoteStyle || "single"];
      quoteRE.lastIndex = 0;
      var s = $replace.call($replace.call(str, quoteRE, "\\$1"), /[\x00-\x1f]/g, lowbyte);
      return wrapQuotes(s, "single", opts);
    }
    function lowbyte(c) {
      var n = c.charCodeAt(0);
      var x = {
        8: "b",
        9: "t",
        10: "n",
        12: "f",
        13: "r"
      }[n];
      if (x) {
        return "\\" + x;
      }
      return "\\x" + (n < 16 ? "0" : "") + $toUpperCase.call(n.toString(16));
    }
    function markBoxed(str) {
      return "Object(" + str + ")";
    }
    function weakCollectionOf(type) {
      return type + " { ? }";
    }
    function collectionOf(type, size, entries, indent) {
      var joinedEntries = indent ? indentedJoin(entries, indent) : $join.call(entries, ", ");
      return type + " (" + size + ") {" + joinedEntries + "}";
    }
    function singleLineValues(xs) {
      for (var i = 0; i < xs.length; i++) {
        if (indexOf(xs[i], "\n") >= 0) {
          return false;
        }
      }
      return true;
    }
    function getIndent(opts, depth) {
      var baseIndent;
      if (opts.indent === "	") {
        baseIndent = "	";
      } else if (typeof opts.indent === "number" && opts.indent > 0) {
        baseIndent = $join.call(Array(opts.indent + 1), " ");
      } else {
        return null;
      }
      return {
        base: baseIndent,
        prev: $join.call(Array(depth + 1), baseIndent)
      };
    }
    function indentedJoin(xs, indent) {
      if (xs.length === 0) {
        return "";
      }
      var lineJoiner = "\n" + indent.prev + indent.base;
      return lineJoiner + $join.call(xs, "," + lineJoiner) + "\n" + indent.prev;
    }
    function arrObjKeys(obj, inspect) {
      var isArr = isArray(obj);
      var xs = [];
      if (isArr) {
        xs.length = obj.length;
        for (var i = 0; i < obj.length; i++) {
          xs[i] = has(obj, i) ? inspect(obj[i], obj) : "";
        }
      }
      var syms = typeof gOPS === "function" ? gOPS(obj) : [];
      var symMap;
      if (hasShammedSymbols) {
        symMap = {};
        for (var k = 0; k < syms.length; k++) {
          symMap["$" + syms[k]] = syms[k];
        }
      }
      for (var key in obj) {
        if (!has(obj, key)) {
          continue;
        }
        if (isArr && String(Number(key)) === key && key < obj.length) {
          continue;
        }
        if (hasShammedSymbols && symMap["$" + key] instanceof Symbol) {
          continue;
        } else if ($test.call(/[^\w$]/, key)) {
          xs.push(inspect(key, obj) + ": " + inspect(obj[key], obj));
        } else {
          xs.push(key + ": " + inspect(obj[key], obj));
        }
      }
      if (typeof gOPS === "function") {
        for (var j = 0; j < syms.length; j++) {
          if (isEnumerable.call(obj, syms[j])) {
            xs.push("[" + inspect(syms[j]) + "]: " + inspect(obj[syms[j]], obj));
          }
        }
      }
      return xs;
    }
  }
});

// ../../node_modules/side-channel-list/index.js
var require_side_channel_list = __commonJS({
  "../../node_modules/side-channel-list/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var listGetNode = function(list, key, isDelete) {
      var prev = list;
      var curr;
      for (; (curr = prev.next) != null; prev = curr) {
        if (curr.key === key) {
          prev.next = curr.next;
          if (!isDelete) {
            curr.next = /** @type {NonNullable<typeof list.next>} */
            list.next;
            list.next = curr;
          }
          return curr;
        }
      }
    };
    var listGet = function(objects, key) {
      if (!objects) {
        return void 0;
      }
      var node = listGetNode(objects, key);
      return node && node.value;
    };
    var listSet = function(objects, key, value) {
      var node = listGetNode(objects, key);
      if (node) {
        node.value = value;
      } else {
        objects.next = /** @type {import('./list.d.ts').ListNode<typeof value, typeof key>} */
        {
          // eslint-disable-line no-param-reassign, no-extra-parens
          key,
          next: objects.next,
          value
        };
      }
    };
    var listHas = function(objects, key) {
      if (!objects) {
        return false;
      }
      return !!listGetNode(objects, key);
    };
    var listDelete = function(objects, key) {
      if (objects) {
        return listGetNode(objects, key, true);
      }
    };
    module2.exports = function getSideChannelList() {
      var $o;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          var deletedNode = listDelete($o, key);
          if (deletedNode && $o && !$o.next) {
            $o = void 0;
          }
          return !!deletedNode;
        },
        get: function(key) {
          return listGet($o, key);
        },
        has: function(key) {
          return listHas($o, key);
        },
        set: function(key, value) {
          if (!$o) {
            $o = {
              next: void 0
            };
          }
          listSet(
            /** @type {NonNullable<typeof $o>} */
            $o,
            key,
            value
          );
        }
      };
      return channel;
    };
  }
});

// ../../node_modules/es-object-atoms/index.js
var require_es_object_atoms = __commonJS({
  "../../node_modules/es-object-atoms/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Object;
  }
});

// ../../node_modules/es-errors/index.js
var require_es_errors = __commonJS({
  "../../node_modules/es-errors/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Error;
  }
});

// ../../node_modules/es-errors/eval.js
var require_eval = __commonJS({
  "../../node_modules/es-errors/eval.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = EvalError;
  }
});

// ../../node_modules/es-errors/range.js
var require_range = __commonJS({
  "../../node_modules/es-errors/range.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = RangeError;
  }
});

// ../../node_modules/es-errors/ref.js
var require_ref = __commonJS({
  "../../node_modules/es-errors/ref.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = ReferenceError;
  }
});

// ../../node_modules/es-errors/syntax.js
var require_syntax = __commonJS({
  "../../node_modules/es-errors/syntax.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = SyntaxError;
  }
});

// ../../node_modules/es-errors/uri.js
var require_uri = __commonJS({
  "../../node_modules/es-errors/uri.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = URIError;
  }
});

// ../../node_modules/math-intrinsics/abs.js
var require_abs = __commonJS({
  "../../node_modules/math-intrinsics/abs.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Math.abs;
  }
});

// ../../node_modules/math-intrinsics/floor.js
var require_floor = __commonJS({
  "../../node_modules/math-intrinsics/floor.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Math.floor;
  }
});

// ../../node_modules/math-intrinsics/max.js
var require_max = __commonJS({
  "../../node_modules/math-intrinsics/max.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Math.max;
  }
});

// ../../node_modules/math-intrinsics/min.js
var require_min = __commonJS({
  "../../node_modules/math-intrinsics/min.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Math.min;
  }
});

// ../../node_modules/math-intrinsics/pow.js
var require_pow = __commonJS({
  "../../node_modules/math-intrinsics/pow.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Math.pow;
  }
});

// ../../node_modules/math-intrinsics/round.js
var require_round = __commonJS({
  "../../node_modules/math-intrinsics/round.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Math.round;
  }
});

// ../../node_modules/math-intrinsics/isNaN.js
var require_isNaN = __commonJS({
  "../../node_modules/math-intrinsics/isNaN.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Number.isNaN || function isNaN2(a) {
      return a !== a;
    };
  }
});

// ../../node_modules/math-intrinsics/sign.js
var require_sign = __commonJS({
  "../../node_modules/math-intrinsics/sign.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var $isNaN = require_isNaN();
    module2.exports = function sign(number) {
      if ($isNaN(number) || number === 0) {
        return number;
      }
      return number < 0 ? -1 : 1;
    };
  }
});

// ../../node_modules/gopd/gOPD.js
var require_gOPD = __commonJS({
  "../../node_modules/gopd/gOPD.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Object.getOwnPropertyDescriptor;
  }
});

// ../../node_modules/gopd/index.js
var require_gopd = __commonJS({
  "../../node_modules/gopd/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var $gOPD = require_gOPD();
    if ($gOPD) {
      try {
        $gOPD([], "length");
      } catch (e) {
        $gOPD = null;
      }
    }
    module2.exports = $gOPD;
  }
});

// ../../node_modules/es-define-property/index.js
var require_es_define_property = __commonJS({
  "../../node_modules/es-define-property/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var $defineProperty = Object.defineProperty || false;
    if ($defineProperty) {
      try {
        $defineProperty({}, "a", { value: 1 });
      } catch (e) {
        $defineProperty = false;
      }
    }
    module2.exports = $defineProperty;
  }
});

// ../../node_modules/has-symbols/shams.js
var require_shams = __commonJS({
  "../../node_modules/has-symbols/shams.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = function hasSymbols() {
      if (typeof Symbol !== "function" || typeof Object.getOwnPropertySymbols !== "function") {
        return false;
      }
      if (typeof Symbol.iterator === "symbol") {
        return true;
      }
      var obj = {};
      var sym = /* @__PURE__ */ Symbol("test");
      var symObj = Object(sym);
      if (typeof sym === "string") {
        return false;
      }
      if (Object.prototype.toString.call(sym) !== "[object Symbol]") {
        return false;
      }
      if (Object.prototype.toString.call(symObj) !== "[object Symbol]") {
        return false;
      }
      var symVal = 42;
      obj[sym] = symVal;
      for (var _ in obj) {
        return false;
      }
      if (typeof Object.keys === "function" && Object.keys(obj).length !== 0) {
        return false;
      }
      if (typeof Object.getOwnPropertyNames === "function" && Object.getOwnPropertyNames(obj).length !== 0) {
        return false;
      }
      var syms = Object.getOwnPropertySymbols(obj);
      if (syms.length !== 1 || syms[0] !== sym) {
        return false;
      }
      if (!Object.prototype.propertyIsEnumerable.call(obj, sym)) {
        return false;
      }
      if (typeof Object.getOwnPropertyDescriptor === "function") {
        var descriptor = (
          /** @type {PropertyDescriptor} */
          Object.getOwnPropertyDescriptor(obj, sym)
        );
        if (descriptor.value !== symVal || descriptor.enumerable !== true) {
          return false;
        }
      }
      return true;
    };
  }
});

// ../../node_modules/has-symbols/index.js
var require_has_symbols = __commonJS({
  "../../node_modules/has-symbols/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var origSymbol = typeof Symbol !== "undefined" && Symbol;
    var hasSymbolSham = require_shams();
    module2.exports = function hasNativeSymbols() {
      if (typeof origSymbol !== "function") {
        return false;
      }
      if (typeof Symbol !== "function") {
        return false;
      }
      if (typeof origSymbol("foo") !== "symbol") {
        return false;
      }
      if (typeof /* @__PURE__ */ Symbol("bar") !== "symbol") {
        return false;
      }
      return hasSymbolSham();
    };
  }
});

// ../../node_modules/get-proto/Reflect.getPrototypeOf.js
var require_Reflect_getPrototypeOf = __commonJS({
  "../../node_modules/get-proto/Reflect.getPrototypeOf.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = typeof Reflect !== "undefined" && Reflect.getPrototypeOf || null;
  }
});

// ../../node_modules/get-proto/Object.getPrototypeOf.js
var require_Object_getPrototypeOf = __commonJS({
  "../../node_modules/get-proto/Object.getPrototypeOf.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var $Object = require_es_object_atoms();
    module2.exports = $Object.getPrototypeOf || null;
  }
});

// ../../node_modules/function-bind/implementation.js
var require_implementation = __commonJS({
  "../../node_modules/function-bind/implementation.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var ERROR_MESSAGE = "Function.prototype.bind called on incompatible ";
    var toStr = Object.prototype.toString;
    var max = Math.max;
    var funcType = "[object Function]";
    var concatty = function concatty2(a, b) {
      var arr = [];
      for (var i = 0; i < a.length; i += 1) {
        arr[i] = a[i];
      }
      for (var j = 0; j < b.length; j += 1) {
        arr[j + a.length] = b[j];
      }
      return arr;
    };
    var slicy = function slicy2(arrLike, offset) {
      var arr = [];
      for (var i = offset || 0, j = 0; i < arrLike.length; i += 1, j += 1) {
        arr[j] = arrLike[i];
      }
      return arr;
    };
    var joiny = function(arr, joiner) {
      var str = "";
      for (var i = 0; i < arr.length; i += 1) {
        str += arr[i];
        if (i + 1 < arr.length) {
          str += joiner;
        }
      }
      return str;
    };
    module2.exports = function bind(that) {
      var target = this;
      if (typeof target !== "function" || toStr.apply(target) !== funcType) {
        throw new TypeError(ERROR_MESSAGE + target);
      }
      var args = slicy(arguments, 1);
      var bound;
      var binder = function() {
        if (this instanceof bound) {
          var result = target.apply(
            this,
            concatty(args, arguments)
          );
          if (Object(result) === result) {
            return result;
          }
          return this;
        }
        return target.apply(
          that,
          concatty(args, arguments)
        );
      };
      var boundLength = max(0, target.length - args.length);
      var boundArgs = [];
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = "$" + i;
      }
      bound = Function("binder", "return function (" + joiny(boundArgs, ",") + "){ return binder.apply(this,arguments); }")(binder);
      if (target.prototype) {
        var Empty = function Empty2() {
        };
        Empty.prototype = target.prototype;
        bound.prototype = new Empty();
        Empty.prototype = null;
      }
      return bound;
    };
  }
});

// ../../node_modules/function-bind/index.js
var require_function_bind = __commonJS({
  "../../node_modules/function-bind/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var implementation = require_implementation();
    module2.exports = Function.prototype.bind || implementation;
  }
});

// ../../node_modules/call-bind-apply-helpers/functionCall.js
var require_functionCall = __commonJS({
  "../../node_modules/call-bind-apply-helpers/functionCall.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Function.prototype.call;
  }
});

// ../../node_modules/call-bind-apply-helpers/functionApply.js
var require_functionApply = __commonJS({
  "../../node_modules/call-bind-apply-helpers/functionApply.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = Function.prototype.apply;
  }
});

// ../../node_modules/call-bind-apply-helpers/reflectApply.js
var require_reflectApply = __commonJS({
  "../../node_modules/call-bind-apply-helpers/reflectApply.js"(exports, module2) {
    "use strict";
    init_polyfills();
    module2.exports = typeof Reflect !== "undefined" && Reflect && Reflect.apply;
  }
});

// ../../node_modules/call-bind-apply-helpers/actualApply.js
var require_actualApply = __commonJS({
  "../../node_modules/call-bind-apply-helpers/actualApply.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var bind = require_function_bind();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var $reflectApply = require_reflectApply();
    module2.exports = $reflectApply || bind.call($call, $apply);
  }
});

// ../../node_modules/call-bind-apply-helpers/index.js
var require_call_bind_apply_helpers = __commonJS({
  "../../node_modules/call-bind-apply-helpers/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var bind = require_function_bind();
    var $TypeError = require_type();
    var $call = require_functionCall();
    var $actualApply = require_actualApply();
    module2.exports = function callBindBasic(args) {
      if (args.length < 1 || typeof args[0] !== "function") {
        throw new $TypeError("a function is required");
      }
      return $actualApply(bind, $call, args);
    };
  }
});

// ../../node_modules/dunder-proto/get.js
var require_get = __commonJS({
  "../../node_modules/dunder-proto/get.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var callBind = require_call_bind_apply_helpers();
    var gOPD = require_gopd();
    var hasProtoAccessor;
    try {
      hasProtoAccessor = /** @type {{ __proto__?: typeof Array.prototype }} */
      [].__proto__ === Array.prototype;
    } catch (e) {
      if (!e || typeof e !== "object" || !("code" in e) || e.code !== "ERR_PROTO_ACCESS") {
        throw e;
      }
    }
    var desc = !!hasProtoAccessor && gOPD && gOPD(
      Object.prototype,
      /** @type {keyof typeof Object.prototype} */
      "__proto__"
    );
    var $Object = Object;
    var $getPrototypeOf = $Object.getPrototypeOf;
    module2.exports = desc && typeof desc.get === "function" ? callBind([desc.get]) : typeof $getPrototypeOf === "function" ? (
      /** @type {import('./get')} */
      function getDunder(value) {
        return $getPrototypeOf(value == null ? value : $Object(value));
      }
    ) : false;
  }
});

// ../../node_modules/get-proto/index.js
var require_get_proto = __commonJS({
  "../../node_modules/get-proto/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var reflectGetProto = require_Reflect_getPrototypeOf();
    var originalGetProto = require_Object_getPrototypeOf();
    var getDunderProto = require_get();
    module2.exports = reflectGetProto ? function getProto(O) {
      return reflectGetProto(O);
    } : originalGetProto ? function getProto(O) {
      if (!O || typeof O !== "object" && typeof O !== "function") {
        throw new TypeError("getProto: not an object");
      }
      return originalGetProto(O);
    } : getDunderProto ? function getProto(O) {
      return getDunderProto(O);
    } : null;
  }
});

// ../../node_modules/hasown/index.js
var require_hasown = __commonJS({
  "../../node_modules/hasown/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var call = Function.prototype.call;
    var $hasOwn = Object.prototype.hasOwnProperty;
    var bind = require_function_bind();
    module2.exports = bind.call(call, $hasOwn);
  }
});

// ../../node_modules/get-intrinsic/index.js
var require_get_intrinsic = __commonJS({
  "../../node_modules/get-intrinsic/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var undefined2;
    var $Object = require_es_object_atoms();
    var $Error = require_es_errors();
    var $EvalError = require_eval();
    var $RangeError = require_range();
    var $ReferenceError = require_ref();
    var $SyntaxError = require_syntax();
    var $TypeError = require_type();
    var $URIError = require_uri();
    var abs = require_abs();
    var floor = require_floor();
    var max = require_max();
    var min = require_min();
    var pow = require_pow();
    var round = require_round();
    var sign = require_sign();
    var $Function = Function;
    var getEvalledConstructor = function(expressionSyntax) {
      try {
        return $Function('"use strict"; return (' + expressionSyntax + ").constructor;")();
      } catch (e) {
      }
    };
    var $gOPD = require_gopd();
    var $defineProperty = require_es_define_property();
    var throwTypeError = function() {
      throw new $TypeError();
    };
    var ThrowTypeError = $gOPD ? (function() {
      try {
        arguments.callee;
        return throwTypeError;
      } catch (calleeThrows) {
        try {
          return $gOPD(arguments, "callee").get;
        } catch (gOPDthrows) {
          return throwTypeError;
        }
      }
    })() : throwTypeError;
    var hasSymbols = require_has_symbols()();
    var getProto = require_get_proto();
    var $ObjectGPO = require_Object_getPrototypeOf();
    var $ReflectGPO = require_Reflect_getPrototypeOf();
    var $apply = require_functionApply();
    var $call = require_functionCall();
    var needsEval = {};
    var TypedArray = typeof Uint8Array === "undefined" || !getProto ? undefined2 : getProto(Uint8Array);
    var INTRINSICS = {
      __proto__: null,
      "%AggregateError%": typeof AggregateError === "undefined" ? undefined2 : AggregateError,
      "%Array%": Array,
      "%ArrayBuffer%": typeof ArrayBuffer === "undefined" ? undefined2 : ArrayBuffer,
      "%ArrayIteratorPrototype%": hasSymbols && getProto ? getProto([][Symbol.iterator]()) : undefined2,
      "%AsyncFromSyncIteratorPrototype%": undefined2,
      "%AsyncFunction%": needsEval,
      "%AsyncGenerator%": needsEval,
      "%AsyncGeneratorFunction%": needsEval,
      "%AsyncIteratorPrototype%": needsEval,
      "%Atomics%": typeof Atomics === "undefined" ? undefined2 : Atomics,
      "%BigInt%": typeof BigInt === "undefined" ? undefined2 : BigInt,
      "%BigInt64Array%": typeof BigInt64Array === "undefined" ? undefined2 : BigInt64Array,
      "%BigUint64Array%": typeof BigUint64Array === "undefined" ? undefined2 : BigUint64Array,
      "%Boolean%": Boolean,
      "%DataView%": typeof DataView === "undefined" ? undefined2 : DataView,
      "%Date%": Date,
      "%decodeURI%": decodeURI,
      "%decodeURIComponent%": decodeURIComponent,
      "%encodeURI%": encodeURI,
      "%encodeURIComponent%": encodeURIComponent,
      "%Error%": $Error,
      "%eval%": eval,
      // eslint-disable-line no-eval
      "%EvalError%": $EvalError,
      "%Float16Array%": typeof Float16Array === "undefined" ? undefined2 : Float16Array,
      "%Float32Array%": typeof Float32Array === "undefined" ? undefined2 : Float32Array,
      "%Float64Array%": typeof Float64Array === "undefined" ? undefined2 : Float64Array,
      "%FinalizationRegistry%": typeof FinalizationRegistry === "undefined" ? undefined2 : FinalizationRegistry,
      "%Function%": $Function,
      "%GeneratorFunction%": needsEval,
      "%Int8Array%": typeof Int8Array === "undefined" ? undefined2 : Int8Array,
      "%Int16Array%": typeof Int16Array === "undefined" ? undefined2 : Int16Array,
      "%Int32Array%": typeof Int32Array === "undefined" ? undefined2 : Int32Array,
      "%isFinite%": isFinite,
      "%isNaN%": isNaN,
      "%IteratorPrototype%": hasSymbols && getProto ? getProto(getProto([][Symbol.iterator]())) : undefined2,
      "%JSON%": typeof JSON === "object" ? JSON : undefined2,
      "%Map%": typeof Map === "undefined" ? undefined2 : Map,
      "%MapIteratorPrototype%": typeof Map === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Map())[Symbol.iterator]()),
      "%Math%": Math,
      "%Number%": Number,
      "%Object%": $Object,
      "%Object.getOwnPropertyDescriptor%": $gOPD,
      "%parseFloat%": parseFloat,
      "%parseInt%": parseInt,
      "%Promise%": typeof Promise === "undefined" ? undefined2 : Promise,
      "%Proxy%": typeof Proxy === "undefined" ? undefined2 : Proxy,
      "%RangeError%": $RangeError,
      "%ReferenceError%": $ReferenceError,
      "%Reflect%": typeof Reflect === "undefined" ? undefined2 : Reflect,
      "%RegExp%": RegExp,
      "%Set%": typeof Set === "undefined" ? undefined2 : Set,
      "%SetIteratorPrototype%": typeof Set === "undefined" || !hasSymbols || !getProto ? undefined2 : getProto((/* @__PURE__ */ new Set())[Symbol.iterator]()),
      "%SharedArrayBuffer%": typeof SharedArrayBuffer === "undefined" ? undefined2 : SharedArrayBuffer,
      "%String%": String,
      "%StringIteratorPrototype%": hasSymbols && getProto ? getProto(""[Symbol.iterator]()) : undefined2,
      "%Symbol%": hasSymbols ? Symbol : undefined2,
      "%SyntaxError%": $SyntaxError,
      "%ThrowTypeError%": ThrowTypeError,
      "%TypedArray%": TypedArray,
      "%TypeError%": $TypeError,
      "%Uint8Array%": typeof Uint8Array === "undefined" ? undefined2 : Uint8Array,
      "%Uint8ClampedArray%": typeof Uint8ClampedArray === "undefined" ? undefined2 : Uint8ClampedArray,
      "%Uint16Array%": typeof Uint16Array === "undefined" ? undefined2 : Uint16Array,
      "%Uint32Array%": typeof Uint32Array === "undefined" ? undefined2 : Uint32Array,
      "%URIError%": $URIError,
      "%WeakMap%": typeof WeakMap === "undefined" ? undefined2 : WeakMap,
      "%WeakRef%": typeof WeakRef === "undefined" ? undefined2 : WeakRef,
      "%WeakSet%": typeof WeakSet === "undefined" ? undefined2 : WeakSet,
      "%Function.prototype.call%": $call,
      "%Function.prototype.apply%": $apply,
      "%Object.defineProperty%": $defineProperty,
      "%Object.getPrototypeOf%": $ObjectGPO,
      "%Math.abs%": abs,
      "%Math.floor%": floor,
      "%Math.max%": max,
      "%Math.min%": min,
      "%Math.pow%": pow,
      "%Math.round%": round,
      "%Math.sign%": sign,
      "%Reflect.getPrototypeOf%": $ReflectGPO
    };
    if (getProto) {
      try {
        null.error;
      } catch (e) {
        errorProto = getProto(getProto(e));
        INTRINSICS["%Error.prototype%"] = errorProto;
      }
    }
    var errorProto;
    var doEval = function doEval2(name) {
      var value;
      if (name === "%AsyncFunction%") {
        value = getEvalledConstructor("async function () {}");
      } else if (name === "%GeneratorFunction%") {
        value = getEvalledConstructor("function* () {}");
      } else if (name === "%AsyncGeneratorFunction%") {
        value = getEvalledConstructor("async function* () {}");
      } else if (name === "%AsyncGenerator%") {
        var fn = doEval2("%AsyncGeneratorFunction%");
        if (fn) {
          value = fn.prototype;
        }
      } else if (name === "%AsyncIteratorPrototype%") {
        var gen = doEval2("%AsyncGenerator%");
        if (gen && getProto) {
          value = getProto(gen.prototype);
        }
      }
      INTRINSICS[name] = value;
      return value;
    };
    var LEGACY_ALIASES = {
      __proto__: null,
      "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
      "%ArrayPrototype%": ["Array", "prototype"],
      "%ArrayProto_entries%": ["Array", "prototype", "entries"],
      "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
      "%ArrayProto_keys%": ["Array", "prototype", "keys"],
      "%ArrayProto_values%": ["Array", "prototype", "values"],
      "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
      "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
      "%AsyncGeneratorPrototype%": ["AsyncGeneratorFunction", "prototype", "prototype"],
      "%BooleanPrototype%": ["Boolean", "prototype"],
      "%DataViewPrototype%": ["DataView", "prototype"],
      "%DatePrototype%": ["Date", "prototype"],
      "%ErrorPrototype%": ["Error", "prototype"],
      "%EvalErrorPrototype%": ["EvalError", "prototype"],
      "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
      "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
      "%FunctionPrototype%": ["Function", "prototype"],
      "%Generator%": ["GeneratorFunction", "prototype"],
      "%GeneratorPrototype%": ["GeneratorFunction", "prototype", "prototype"],
      "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
      "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
      "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
      "%JSONParse%": ["JSON", "parse"],
      "%JSONStringify%": ["JSON", "stringify"],
      "%MapPrototype%": ["Map", "prototype"],
      "%NumberPrototype%": ["Number", "prototype"],
      "%ObjectPrototype%": ["Object", "prototype"],
      "%ObjProto_toString%": ["Object", "prototype", "toString"],
      "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
      "%PromisePrototype%": ["Promise", "prototype"],
      "%PromiseProto_then%": ["Promise", "prototype", "then"],
      "%Promise_all%": ["Promise", "all"],
      "%Promise_reject%": ["Promise", "reject"],
      "%Promise_resolve%": ["Promise", "resolve"],
      "%RangeErrorPrototype%": ["RangeError", "prototype"],
      "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
      "%RegExpPrototype%": ["RegExp", "prototype"],
      "%SetPrototype%": ["Set", "prototype"],
      "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
      "%StringPrototype%": ["String", "prototype"],
      "%SymbolPrototype%": ["Symbol", "prototype"],
      "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
      "%TypedArrayPrototype%": ["TypedArray", "prototype"],
      "%TypeErrorPrototype%": ["TypeError", "prototype"],
      "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
      "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
      "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
      "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
      "%URIErrorPrototype%": ["URIError", "prototype"],
      "%WeakMapPrototype%": ["WeakMap", "prototype"],
      "%WeakSetPrototype%": ["WeakSet", "prototype"]
    };
    var bind = require_function_bind();
    var hasOwn = require_hasown();
    var $concat = bind.call($call, Array.prototype.concat);
    var $spliceApply = bind.call($apply, Array.prototype.splice);
    var $replace = bind.call($call, String.prototype.replace);
    var $strSlice = bind.call($call, String.prototype.slice);
    var $exec = bind.call($call, RegExp.prototype.exec);
    var rePropName = /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g;
    var reEscapeChar = /\\(\\)?/g;
    var stringToPath = function stringToPath2(string) {
      var first = $strSlice(string, 0, 1);
      var last = $strSlice(string, -1);
      if (first === "%" && last !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected closing `%`");
      } else if (last === "%" && first !== "%") {
        throw new $SyntaxError("invalid intrinsic syntax, expected opening `%`");
      }
      var result = [];
      $replace(string, rePropName, function(match, number, quote, subString) {
        result[result.length] = quote ? $replace(subString, reEscapeChar, "$1") : number || match;
      });
      return result;
    };
    var getBaseIntrinsic = function getBaseIntrinsic2(name, allowMissing) {
      var intrinsicName = name;
      var alias;
      if (hasOwn(LEGACY_ALIASES, intrinsicName)) {
        alias = LEGACY_ALIASES[intrinsicName];
        intrinsicName = "%" + alias[0] + "%";
      }
      if (hasOwn(INTRINSICS, intrinsicName)) {
        var value = INTRINSICS[intrinsicName];
        if (value === needsEval) {
          value = doEval(intrinsicName);
        }
        if (typeof value === "undefined" && !allowMissing) {
          throw new $TypeError("intrinsic " + name + " exists, but is not available. Please file an issue!");
        }
        return {
          alias,
          name: intrinsicName,
          value
        };
      }
      throw new $SyntaxError("intrinsic " + name + " does not exist!");
    };
    module2.exports = function GetIntrinsic(name, allowMissing) {
      if (typeof name !== "string" || name.length === 0) {
        throw new $TypeError("intrinsic name must be a non-empty string");
      }
      if (arguments.length > 1 && typeof allowMissing !== "boolean") {
        throw new $TypeError('"allowMissing" argument must be a boolean');
      }
      if ($exec(/^%?[^%]*%?$/, name) === null) {
        throw new $SyntaxError("`%` may not be present anywhere but at the beginning and end of the intrinsic name");
      }
      var parts = stringToPath(name);
      var intrinsicBaseName = parts.length > 0 ? parts[0] : "";
      var intrinsic = getBaseIntrinsic("%" + intrinsicBaseName + "%", allowMissing);
      var intrinsicRealName = intrinsic.name;
      var value = intrinsic.value;
      var skipFurtherCaching = false;
      var alias = intrinsic.alias;
      if (alias) {
        intrinsicBaseName = alias[0];
        $spliceApply(parts, $concat([0, 1], alias));
      }
      for (var i = 1, isOwn = true; i < parts.length; i += 1) {
        var part = parts[i];
        var first = $strSlice(part, 0, 1);
        var last = $strSlice(part, -1);
        if ((first === '"' || first === "'" || first === "`" || (last === '"' || last === "'" || last === "`")) && first !== last) {
          throw new $SyntaxError("property names with quotes must have matching quotes");
        }
        if (part === "constructor" || !isOwn) {
          skipFurtherCaching = true;
        }
        intrinsicBaseName += "." + part;
        intrinsicRealName = "%" + intrinsicBaseName + "%";
        if (hasOwn(INTRINSICS, intrinsicRealName)) {
          value = INTRINSICS[intrinsicRealName];
        } else if (value != null) {
          if (!(part in value)) {
            if (!allowMissing) {
              throw new $TypeError("base intrinsic for " + name + " exists, but the property is not available.");
            }
            return void undefined2;
          }
          if ($gOPD && i + 1 >= parts.length) {
            var desc = $gOPD(value, part);
            isOwn = !!desc;
            if (isOwn && "get" in desc && !("originalValue" in desc.get)) {
              value = desc.get;
            } else {
              value = value[part];
            }
          } else {
            isOwn = hasOwn(value, part);
            value = value[part];
          }
          if (isOwn && !skipFurtherCaching) {
            INTRINSICS[intrinsicRealName] = value;
          }
        }
      }
      return value;
    };
  }
});

// ../../node_modules/call-bound/index.js
var require_call_bound = __commonJS({
  "../../node_modules/call-bound/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var GetIntrinsic = require_get_intrinsic();
    var callBindBasic = require_call_bind_apply_helpers();
    var $indexOf = callBindBasic([GetIntrinsic("%String.prototype.indexOf%")]);
    module2.exports = function callBoundIntrinsic(name, allowMissing) {
      var intrinsic = (
        /** @type {(this: unknown, ...args: unknown[]) => unknown} */
        GetIntrinsic(name, !!allowMissing)
      );
      if (typeof intrinsic === "function" && $indexOf(name, ".prototype.") > -1) {
        return callBindBasic(
          /** @type {const} */
          [intrinsic]
        );
      }
      return intrinsic;
    };
  }
});

// ../../node_modules/side-channel-map/index.js
var require_side_channel_map = __commonJS({
  "../../node_modules/side-channel-map/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var $TypeError = require_type();
    var $Map = GetIntrinsic("%Map%", true);
    var $mapGet = callBound("Map.prototype.get", true);
    var $mapSet = callBound("Map.prototype.set", true);
    var $mapHas = callBound("Map.prototype.has", true);
    var $mapDelete = callBound("Map.prototype.delete", true);
    var $mapSize = callBound("Map.prototype.size", true);
    module2.exports = !!$Map && /** @type {Exclude<import('.'), false>} */
    function getSideChannelMap() {
      var $m;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            throw new $TypeError("Side channel does not contain " + inspect(key));
          }
        },
        "delete": function(key) {
          if ($m) {
            var result = $mapDelete($m, key);
            if ($mapSize($m) === 0) {
              $m = void 0;
            }
            return result;
          }
          return false;
        },
        get: function(key) {
          if ($m) {
            return $mapGet($m, key);
          }
        },
        has: function(key) {
          if ($m) {
            return $mapHas($m, key);
          }
          return false;
        },
        set: function(key, value) {
          if (!$m) {
            $m = new $Map();
          }
          $mapSet($m, key, value);
        }
      };
      return channel;
    };
  }
});

// ../../node_modules/side-channel-weakmap/index.js
var require_side_channel_weakmap = __commonJS({
  "../../node_modules/side-channel-weakmap/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var GetIntrinsic = require_get_intrinsic();
    var callBound = require_call_bound();
    var inspect = require_object_inspect();
    var getSideChannelMap = require_side_channel_map();
    var $TypeError = require_type();
    var $WeakMap = GetIntrinsic("%WeakMap%", true);
    var $weakMapGet = callBound("WeakMap.prototype.get", true);
    var $weakMapSet = callBound("WeakMap.prototype.set", true);
    var $weakMapHas = callBound("WeakMap.prototype.has", true);
    var $weakMapDelete = callBound("WeakMap.prototype.delete", true);
    module2.exports = $WeakMap ? (
      /** @type {Exclude<import('.'), false>} */
      function getSideChannelWeakMap() {
        var $wm;
        var $m;
        var channel = {
          assert: function(key) {
            if (!channel.has(key)) {
              throw new $TypeError("Side channel does not contain " + inspect(key));
            }
          },
          "delete": function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapDelete($wm, key);
              }
            } else if (getSideChannelMap) {
              if ($m) {
                return $m["delete"](key);
              }
            }
            return false;
          },
          get: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapGet($wm, key);
              }
            }
            return $m && $m.get(key);
          },
          has: function(key) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if ($wm) {
                return $weakMapHas($wm, key);
              }
            }
            return !!$m && $m.has(key);
          },
          set: function(key, value) {
            if ($WeakMap && key && (typeof key === "object" || typeof key === "function")) {
              if (!$wm) {
                $wm = new $WeakMap();
              }
              $weakMapSet($wm, key, value);
            } else if (getSideChannelMap) {
              if (!$m) {
                $m = getSideChannelMap();
              }
              $m.set(key, value);
            }
          }
        };
        return channel;
      }
    ) : getSideChannelMap;
  }
});

// ../../node_modules/side-channel/index.js
var require_side_channel = __commonJS({
  "../../node_modules/side-channel/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var $TypeError = require_type();
    var inspect = require_object_inspect();
    var getSideChannelList = require_side_channel_list();
    var getSideChannelMap = require_side_channel_map();
    var getSideChannelWeakMap = require_side_channel_weakmap();
    var makeChannel = getSideChannelWeakMap || getSideChannelMap || getSideChannelList;
    module2.exports = function getSideChannel() {
      var $channelData;
      var channel = {
        assert: function(key) {
          if (!channel.has(key)) {
            var keyDesc = key && Object(key) === key ? "the given object key" : inspect(key);
            throw new $TypeError("Side channel does not contain " + keyDesc);
          }
        },
        "delete": function(key) {
          return !!$channelData && $channelData["delete"](key);
        },
        get: function(key) {
          return $channelData && $channelData.get(key);
        },
        has: function(key) {
          return !!$channelData && $channelData.has(key);
        },
        set: function(key, value) {
          if (!$channelData) {
            $channelData = makeChannel();
          }
          $channelData.set(key, value);
        }
      };
      return channel;
    };
  }
});

// ../../node_modules/qs/lib/formats.js
var require_formats = __commonJS({
  "../../node_modules/qs/lib/formats.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var replace = String.prototype.replace;
    var percentTwenties = /%20/g;
    var Format = {
      RFC1738: "RFC1738",
      RFC3986: "RFC3986"
    };
    module2.exports = {
      "default": Format.RFC3986,
      formatters: {
        RFC1738: function(value) {
          return replace.call(value, percentTwenties, "+");
        },
        RFC3986: function(value) {
          return String(value);
        }
      },
      RFC1738: Format.RFC1738,
      RFC3986: Format.RFC3986
    };
  }
});

// ../../node_modules/qs/lib/utils.js
var require_utils = __commonJS({
  "../../node_modules/qs/lib/utils.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var formats = require_formats();
    var getSideChannel = require_side_channel();
    var defineProperty = require_es_define_property();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var overflowChannel = getSideChannel();
    var markOverflow = function markOverflow2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
      return obj;
    };
    var isOverflow = function isOverflow2(obj) {
      return overflowChannel.has(obj);
    };
    var getMaxIndex = function getMaxIndex2(obj) {
      return overflowChannel.get(obj);
    };
    var setMaxIndex = function setMaxIndex2(obj, maxIndex) {
      overflowChannel.set(obj, maxIndex);
    };
    var hexTable = (function() {
      var array = [];
      for (var i = 0; i < 256; ++i) {
        array[array.length] = "%" + ((i < 16 ? "0" : "") + i.toString(16)).toUpperCase();
      }
      return array;
    })();
    var compactQueue = function compactQueue2(queue) {
      while (queue.length > 1) {
        var item = queue.pop();
        var obj = item.obj[item.prop];
        if (isArray(obj)) {
          var compacted = [];
          for (var j = 0; j < obj.length; ++j) {
            if (typeof obj[j] !== "undefined") {
              compacted[compacted.length] = obj[j];
            }
          }
          item.obj[item.prop] = compacted;
        }
      }
    };
    var arrayToObject = function arrayToObject2(source, options) {
      var obj = options && options.plainObjects ? { __proto__: null } : {};
      for (var i = 0; i < source.length; ++i) {
        if (typeof source[i] !== "undefined") {
          obj[i] = source[i];
        }
      }
      return obj;
    };
    var setProperty = function setProperty2(obj, key, value) {
      if (key === "__proto__" && defineProperty) {
        defineProperty(obj, key, {
          configurable: true,
          enumerable: true,
          value,
          writable: true
        });
      } else {
        obj[key] = value;
      }
    };
    var merge = function merge2(target, source, options) {
      if (!source) {
        return target;
      }
      if (typeof source !== "object" && typeof source !== "function") {
        if (isArray(target)) {
          var nextIndex = target.length;
          if (options && typeof options.arrayLimit === "number" && nextIndex >= options.arrayLimit) {
            if (options.throwOnLimitExceeded) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            return markOverflow(arrayToObject(target.concat(source), options), nextIndex);
          }
          target[nextIndex] = source;
        } else if (target && typeof target === "object") {
          if (isOverflow(target)) {
            var newIndex = getMaxIndex(target) + 1;
            target[newIndex] = source;
            setMaxIndex(target, newIndex);
          } else if (options && options.strictMerge) {
            return [target, source];
          } else if (options && (options.plainObjects || options.allowPrototypes) || !has.call(Object.prototype, source)) {
            target[source] = true;
          }
        } else {
          return [target, source];
        }
        return target;
      }
      if (!target || typeof target !== "object") {
        if (isOverflow(source)) {
          var sourceKeys = Object.keys(source);
          var result = options && options.plainObjects ? { __proto__: null, 0: target } : { 0: target };
          for (var m = 0; m < sourceKeys.length; m++) {
            var oldKey = parseInt(sourceKeys[m], 10);
            result[oldKey + 1] = source[sourceKeys[m]];
          }
          return markOverflow(result, getMaxIndex(source) + 1);
        }
        var combined = [target].concat(source);
        if (options && typeof options.arrayLimit === "number" && combined.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          return markOverflow(arrayToObject(combined, options), combined.length - 1);
        }
        return combined;
      }
      var mergeTarget = target;
      if (isArray(target) && !isArray(source)) {
        mergeTarget = arrayToObject(target, options);
      }
      if (isArray(target) && isArray(source)) {
        source.forEach(function(item, i) {
          if (has.call(target, i)) {
            var targetItem = target[i];
            if (targetItem && typeof targetItem === "object" && item && typeof item === "object") {
              target[i] = merge2(targetItem, item, options);
            } else {
              target[target.length] = item;
            }
          } else {
            target[i] = item;
          }
        });
        if (options && typeof options.arrayLimit === "number" && target.length > options.arrayLimit) {
          if (options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          }
          return markOverflow(arrayToObject(target, options), target.length - 1);
        }
        return target;
      }
      return Object.keys(source).reduce(function(acc, key) {
        var value = source[key];
        if (has.call(acc, key)) {
          setProperty(acc, key, merge2(acc[key], value, options));
        } else {
          setProperty(acc, key, value);
        }
        if (isOverflow(source) && !isOverflow(acc)) {
          markOverflow(acc, getMaxIndex(source));
        }
        if (isOverflow(acc)) {
          var keyNum = parseInt(key, 10);
          if (String(keyNum) === key && keyNum >= 0 && keyNum > getMaxIndex(acc)) {
            setMaxIndex(acc, keyNum);
          }
        }
        return acc;
      }, mergeTarget);
    };
    var assign = function assignSingleSource(target, source) {
      return Object.keys(source).reduce(function(acc, key) {
        setProperty(acc, key, source[key]);
        return acc;
      }, target);
    };
    var decode = function(str, defaultDecoder, charset) {
      var strWithoutPlus = str.replace(/\+/g, " ");
      if (charset === "iso-8859-1") {
        return strWithoutPlus.replace(/%[0-9a-f]{2}/gi, unescape);
      }
      try {
        return decodeURIComponent(strWithoutPlus);
      } catch (e) {
        return strWithoutPlus;
      }
    };
    var limit = 1024;
    var encode = function encode2(str, defaultEncoder, charset, kind, format) {
      if (str.length === 0) {
        return str;
      }
      var string = str;
      if (typeof str === "symbol") {
        string = Symbol.prototype.toString.call(str);
      } else if (typeof str !== "string") {
        string = String(str);
      }
      if (charset === "iso-8859-1") {
        return escape(string).replace(/%u[0-9a-f]{4}/gi, function($0) {
          return "%26%23" + parseInt($0.slice(2), 16) + "%3B";
        });
      }
      var out = "";
      for (var j = 0; j < string.length; j += limit) {
        var segment = string.length >= limit ? string.slice(j, j + limit) : string;
        if (j + limit < string.length) {
          var last = segment.charCodeAt(segment.length - 1);
          if (last >= 55296 && last <= 56319) {
            segment = segment.slice(0, -1);
            j -= 1;
          }
        }
        var arr = [];
        for (var i = 0; i < segment.length; ++i) {
          var c = segment.charCodeAt(i);
          if (c === 45 || c === 46 || c === 95 || c === 126 || c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || format === formats.RFC1738 && (c === 40 || c === 41)) {
            arr[arr.length] = segment.charAt(i);
            continue;
          }
          if (c < 128) {
            arr[arr.length] = hexTable[c];
            continue;
          }
          if (c < 2048) {
            arr[arr.length] = hexTable[192 | c >> 6] + hexTable[128 | c & 63];
            continue;
          }
          if (c < 55296 || c >= 57344) {
            arr[arr.length] = hexTable[224 | c >> 12] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
            continue;
          }
          i += 1;
          c = 65536 + ((c & 1023) << 10 | segment.charCodeAt(i) & 1023);
          arr[arr.length] = hexTable[240 | c >> 18] + hexTable[128 | c >> 12 & 63] + hexTable[128 | c >> 6 & 63] + hexTable[128 | c & 63];
        }
        out += arr.join("");
      }
      return out;
    };
    var compact = function compact2(value) {
      var queue = [{ obj: { o: value }, prop: "o" }];
      var refs = getSideChannel();
      for (var i = 0; i < queue.length; ++i) {
        var item = queue[i];
        var obj = item.obj[item.prop];
        var keys = Object.keys(obj);
        for (var j = 0; j < keys.length; ++j) {
          var key = keys[j];
          var val = obj[key];
          if (typeof val === "object" && val !== null && !refs.has(val)) {
            queue[queue.length] = { obj, prop: key };
            refs.set(val, true);
          }
        }
      }
      compactQueue(queue);
      return value;
    };
    var isRegExp = function isRegExp2(obj) {
      return Object.prototype.toString.call(obj) === "[object RegExp]";
    };
    var isBuffer = function isBuffer2(obj) {
      if (!obj || typeof obj !== "object") {
        return false;
      }
      return !!(obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj));
    };
    var combine = function combine2(a, b, arrayLimit, plainObjects, throwOnLimitExceeded) {
      if (isOverflow(a)) {
        if (throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        var bValues = isArray(b) ? b : [b];
        var newIndex = getMaxIndex(a);
        for (var i = 0; i < bValues.length; ++i) {
          newIndex += 1;
          a[newIndex] = bValues[i];
        }
        setMaxIndex(a, newIndex);
        return a;
      }
      var result = [].concat(a, b);
      if (result.length > arrayLimit) {
        if (throwOnLimitExceeded) {
          throw new RangeError("Array limit exceeded. Only " + arrayLimit + " element" + (arrayLimit === 1 ? "" : "s") + " allowed in an array.");
        }
        return markOverflow(arrayToObject(result, { plainObjects }), result.length - 1);
      }
      return result;
    };
    var maybeMap = function maybeMap2(val, fn) {
      if (isArray(val)) {
        var mapped = [];
        for (var i = 0; i < val.length; i += 1) {
          mapped[mapped.length] = fn(val[i]);
        }
        return mapped;
      }
      return fn(val);
    };
    module2.exports = {
      arrayToObject,
      assign,
      combine,
      compact,
      decode,
      encode,
      isBuffer,
      isOverflow,
      isRegExp,
      markOverflow,
      maybeMap,
      merge
    };
  }
});

// ../../node_modules/qs/lib/stringify.js
var require_stringify = __commonJS({
  "../../node_modules/qs/lib/stringify.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var getSideChannel = require_side_channel();
    var utils = require_utils();
    var formats = require_formats();
    var has = Object.prototype.hasOwnProperty;
    var arrayPrefixGenerators = {
      brackets: function brackets(prefix) {
        return prefix + "[]";
      },
      comma: "comma",
      indices: function indices(prefix, key) {
        return prefix + "[" + key + "]";
      },
      repeat: function repeat(prefix) {
        return prefix;
      }
    };
    var isArray = Array.isArray;
    var push = Array.prototype.push;
    var pushToArray = function(arr, valueOrArray) {
      push.apply(arr, isArray(valueOrArray) ? valueOrArray : [valueOrArray]);
    };
    var toISO = Date.prototype.toISOString;
    var defaultFormat = formats["default"];
    var defaults = {
      addQueryPrefix: false,
      allowDots: false,
      allowEmptyArrays: false,
      arrayFormat: "indices",
      charset: "utf-8",
      charsetSentinel: false,
      commaRoundTrip: false,
      delimiter: "&",
      depth: Infinity,
      encode: true,
      encodeDotInKeys: false,
      encoder: utils.encode,
      encodeValuesOnly: false,
      filter: void 0,
      format: defaultFormat,
      formatter: formats.formatters[defaultFormat],
      // deprecated
      indices: false,
      serializeDate: function serializeDate(date) {
        return toISO.call(date);
      },
      skipNulls: false,
      strictNullHandling: false
    };
    var isNonNullishPrimitive = function isNonNullishPrimitive2(v) {
      return typeof v === "string" || typeof v === "number" || typeof v === "boolean" || typeof v === "symbol" || typeof v === "bigint";
    };
    var sentinel = {};
    var stringify = function stringify2(object, prefix, generateArrayPrefix, commaRoundTrip, allowEmptyArrays, strictNullHandling, skipNulls, encodeDotInKeys, encoder, filter, sort, allowDots, serializeDate, format, formatter, encodeValuesOnly, charset, sideChannel, depth, currentDepth) {
      var obj = object;
      if (currentDepth > depth) {
        throw new RangeError("Input depth exceeded depth option of " + depth);
      }
      var tmpSc = sideChannel;
      var step = 0;
      var findFlag = false;
      while ((tmpSc = tmpSc.get(sentinel)) !== void 0 && !findFlag) {
        var pos = tmpSc.get(object);
        step += 1;
        if (typeof pos !== "undefined") {
          if (pos === step) {
            throw new RangeError("Cyclic object value");
          } else {
            findFlag = true;
          }
        }
        if (typeof tmpSc.get(sentinel) === "undefined") {
          step = 0;
        }
      }
      obj = typeof filter === "function" ? filter(prefix, obj) : obj;
      if (obj instanceof Date) {
        obj = serializeDate(obj);
      } else if (generateArrayPrefix === "comma" && isArray(obj)) {
        obj = utils.maybeMap(obj, function(value2) {
          if (value2 instanceof Date) {
            return serializeDate(value2);
          }
          return value2;
        });
      }
      if (obj === null) {
        if (strictNullHandling) {
          return formatter(encoder && !encodeValuesOnly ? encoder(prefix, defaults.encoder, charset, "key", format) : prefix);
        }
        obj = "";
      }
      if (isNonNullishPrimitive(obj) || utils.isBuffer(obj)) {
        if (encoder) {
          var keyValue = encodeValuesOnly ? prefix : encoder(prefix, defaults.encoder, charset, "key", format);
          return [formatter(keyValue) + "=" + formatter(encoder(obj, defaults.encoder, charset, "value", format))];
        }
        return [formatter(prefix) + "=" + formatter(String(obj))];
      }
      var values = [];
      if (typeof obj === "undefined") {
        return values;
      }
      var objKeys;
      if (generateArrayPrefix === "comma" && isArray(obj)) {
        if (encodeValuesOnly && encoder) {
          obj = utils.maybeMap(obj, function(v) {
            return v == null ? v : encoder(v);
          });
        }
        objKeys = [{ value: obj.length > 0 ? obj.join(",") || null : void 0 }];
      } else if (isArray(filter)) {
        objKeys = filter;
      } else {
        var keys = Object.keys(obj);
        objKeys = sort ? keys.sort(sort) : keys;
      }
      var encodedPrefix = encodeDotInKeys ? String(prefix).replace(/\./g, "%2E") : String(prefix);
      var adjustedPrefix = commaRoundTrip && isArray(obj) && obj.length === 1 ? encodedPrefix + "[]" : encodedPrefix;
      if (allowEmptyArrays && isArray(obj) && obj.length === 0 && Object.keys(obj).length === 0) {
        return adjustedPrefix + "[]";
      }
      for (var j = 0; j < objKeys.length; ++j) {
        var key = objKeys[j];
        var value = typeof key === "object" && key && typeof key.value !== "undefined" ? key.value : obj[key];
        if (skipNulls && value === null) {
          continue;
        }
        var encodedKey = allowDots && encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        var keyPrefix = isArray(obj) ? typeof generateArrayPrefix === "function" ? generateArrayPrefix(adjustedPrefix, encodedKey) : adjustedPrefix : adjustedPrefix + (allowDots ? "." + encodedKey : "[" + encodedKey + "]");
        sideChannel.set(object, step);
        var valueSideChannel = getSideChannel();
        valueSideChannel.set(sentinel, sideChannel);
        pushToArray(values, stringify2(
          value,
          keyPrefix,
          generateArrayPrefix,
          commaRoundTrip,
          allowEmptyArrays,
          strictNullHandling,
          skipNulls,
          encodeDotInKeys,
          generateArrayPrefix === "comma" && encodeValuesOnly && isArray(obj) ? null : encoder,
          filter,
          sort,
          allowDots,
          serializeDate,
          format,
          formatter,
          encodeValuesOnly,
          charset,
          valueSideChannel,
          depth,
          currentDepth + 1
        ));
      }
      return values;
    };
    var normalizeStringifyOptions = function normalizeStringifyOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.encodeDotInKeys !== "undefined" && typeof opts.encodeDotInKeys !== "boolean") {
        throw new TypeError("`encodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.encoder !== null && typeof opts.encoder !== "undefined" && typeof opts.encoder !== "function") {
        throw new TypeError("Encoder has to be a function.");
      }
      var charset = opts.charset || defaults.charset;
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      var format = formats["default"];
      if (typeof opts.format !== "undefined") {
        if (!has.call(formats.formatters, opts.format)) {
          throw new TypeError("Unknown format option provided.");
        }
        format = opts.format;
      }
      var formatter = formats.formatters[format];
      var filter = defaults.filter;
      if (typeof opts.filter === "function" || isArray(opts.filter)) {
        filter = opts.filter;
      }
      var arrayFormat;
      if (opts.arrayFormat in arrayPrefixGenerators) {
        arrayFormat = opts.arrayFormat;
      } else if ("indices" in opts) {
        arrayFormat = opts.indices ? "indices" : "repeat";
      } else {
        arrayFormat = defaults.arrayFormat;
      }
      if ("commaRoundTrip" in opts && typeof opts.commaRoundTrip !== "boolean") {
        throw new TypeError("`commaRoundTrip` must be a boolean, or absent");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.encodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        addQueryPrefix: typeof opts.addQueryPrefix === "boolean" ? opts.addQueryPrefix : defaults.addQueryPrefix,
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        arrayFormat,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        commaRoundTrip: !!opts.commaRoundTrip,
        delimiter: typeof opts.delimiter === "undefined" ? defaults.delimiter : opts.delimiter,
        depth: typeof opts.depth === "number" ? opts.depth : defaults.depth,
        encode: typeof opts.encode === "boolean" ? opts.encode : defaults.encode,
        encodeDotInKeys: typeof opts.encodeDotInKeys === "boolean" ? opts.encodeDotInKeys : defaults.encodeDotInKeys,
        encoder: typeof opts.encoder === "function" ? opts.encoder : defaults.encoder,
        encodeValuesOnly: typeof opts.encodeValuesOnly === "boolean" ? opts.encodeValuesOnly : defaults.encodeValuesOnly,
        filter,
        format,
        formatter,
        serializeDate: typeof opts.serializeDate === "function" ? opts.serializeDate : defaults.serializeDate,
        skipNulls: typeof opts.skipNulls === "boolean" ? opts.skipNulls : defaults.skipNulls,
        sort: typeof opts.sort === "function" ? opts.sort : null,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling
      };
    };
    module2.exports = function(object, opts) {
      var obj = object;
      var options = normalizeStringifyOptions(opts);
      var objKeys;
      var filter;
      if (typeof options.filter === "function") {
        filter = options.filter;
        obj = filter("", obj);
      } else if (isArray(options.filter)) {
        filter = options.filter;
        objKeys = filter;
      }
      var keys = [];
      if (typeof obj !== "object" || obj === null) {
        return "";
      }
      var generateArrayPrefix = arrayPrefixGenerators[options.arrayFormat];
      var commaRoundTrip = generateArrayPrefix === "comma" && options.commaRoundTrip;
      if (!objKeys) {
        objKeys = Object.keys(obj);
      }
      if (options.sort) {
        objKeys.sort(options.sort);
      }
      var sideChannel = getSideChannel();
      for (var i = 0; i < objKeys.length; ++i) {
        var key = objKeys[i];
        if (typeof key === "undefined" || key === null) {
          continue;
        }
        var value = obj[key];
        if (options.skipNulls && value === null) {
          continue;
        }
        var encodedKey = options.encodeDotInKeys ? String(key).replace(/\./g, "%2E") : String(key);
        pushToArray(keys, stringify(
          value,
          encodedKey,
          generateArrayPrefix,
          commaRoundTrip,
          options.allowEmptyArrays,
          options.strictNullHandling,
          options.skipNulls,
          options.encodeDotInKeys,
          options.encode ? options.encoder : null,
          options.filter,
          options.sort,
          options.allowDots,
          options.serializeDate,
          options.format,
          options.formatter,
          options.encodeValuesOnly,
          options.charset,
          sideChannel,
          options.depth,
          0
        ));
      }
      var joined = keys.join(options.delimiter);
      var prefix = options.addQueryPrefix === true ? "?" : "";
      if (options.charsetSentinel) {
        if (options.charset === "iso-8859-1") {
          prefix += "utf8=%26%2310003%3B" + options.delimiter;
        } else {
          prefix += "utf8=%E2%9C%93" + options.delimiter;
        }
      }
      return joined.length > 0 ? prefix + joined : "";
    };
  }
});

// ../../node_modules/qs/lib/parse.js
var require_parse = __commonJS({
  "../../node_modules/qs/lib/parse.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var utils = require_utils();
    var has = Object.prototype.hasOwnProperty;
    var isArray = Array.isArray;
    var defaults = {
      allowDots: false,
      allowEmptyArrays: false,
      allowPrototypes: false,
      allowSparse: false,
      arrayLimit: 20,
      charset: "utf-8",
      charsetSentinel: false,
      comma: false,
      decodeDotInKeys: false,
      decoder: utils.decode,
      delimiter: "&",
      depth: 5,
      duplicates: "combine",
      ignoreQueryPrefix: false,
      interpretNumericEntities: false,
      parameterLimit: 1e3,
      parseArrays: true,
      plainObjects: false,
      strictDepth: false,
      strictMerge: true,
      strictNullHandling: false,
      throwOnLimitExceeded: false
    };
    var interpretNumericEntities = function(str) {
      return str.replace(/&#(\d+);/g, function($0, numberStr) {
        return String.fromCharCode(parseInt(numberStr, 10));
      });
    };
    var parseArrayValue = function(val, options, currentArrayLength) {
      if (val && typeof val === "string" && options.comma && val.indexOf(",") > -1) {
        if (options.throwOnLimitExceeded) {
          var commaCount = 0;
          var commaIndex = val.indexOf(",");
          while (commaIndex > -1) {
            commaCount += 1;
            if (commaCount >= options.arrayLimit) {
              throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
            }
            commaIndex = val.indexOf(",", commaIndex + 1);
          }
        }
        return val.split(",");
      }
      if (options.throwOnLimitExceeded && currentArrayLength >= options.arrayLimit) {
        throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
      }
      return val;
    };
    var isoSentinel = "utf8=%26%2310003%3B";
    var charsetSentinel = "utf8=%E2%9C%93";
    var parseValues = function parseQueryStringValues(str, options) {
      var obj = { __proto__: null };
      var cleanStr = options.ignoreQueryPrefix ? str.replace(/^\?/, "") : str;
      cleanStr = cleanStr.replace(/%5B/gi, "[").replace(/%5D/gi, "]");
      var limit = options.parameterLimit === Infinity ? void 0 : options.parameterLimit;
      var parts = cleanStr.split(
        options.delimiter,
        options.throwOnLimitExceeded && typeof limit !== "undefined" ? limit + 1 : limit
      );
      if (options.throwOnLimitExceeded && typeof limit !== "undefined" && parts.length > limit) {
        throw new RangeError("Parameter limit exceeded. Only " + limit + " parameter" + (limit === 1 ? "" : "s") + " allowed.");
      }
      var skipIndex = -1;
      var i;
      var charset = options.charset;
      if (options.charsetSentinel) {
        for (i = 0; i < parts.length; ++i) {
          if (parts[i].indexOf("utf8=") === 0) {
            if (parts[i] === charsetSentinel) {
              charset = "utf-8";
            } else if (parts[i] === isoSentinel) {
              charset = "iso-8859-1";
            }
            skipIndex = i;
            i = parts.length;
          }
        }
      }
      for (i = 0; i < parts.length; ++i) {
        if (i === skipIndex) {
          continue;
        }
        var part = parts[i];
        var bracketEqualsPos = part.indexOf("]=");
        var pos = bracketEqualsPos === -1 ? part.indexOf("=") : bracketEqualsPos + 1;
        var key;
        var val;
        if (pos === -1) {
          key = options.decoder(part, defaults.decoder, charset, "key");
          val = options.strictNullHandling ? null : "";
        } else {
          key = options.decoder(part.slice(0, pos), defaults.decoder, charset, "key");
          if (key !== null) {
            val = utils.maybeMap(
              parseArrayValue(
                part.slice(pos + 1),
                options,
                isArray(obj[key]) ? obj[key].length : 0
              ),
              function(encodedVal) {
                return options.decoder(encodedVal, defaults.decoder, charset, "value");
              }
            );
          }
        }
        if (val && options.interpretNumericEntities && charset === "iso-8859-1") {
          val = interpretNumericEntities(String(val));
        }
        if (part.indexOf("[]=") > -1) {
          val = isArray(val) ? [val] : val;
        }
        if (options.comma && isArray(val) && val.length > options.arrayLimit) {
          val = utils.combine([], val, options.arrayLimit, options.plainObjects, options.throwOnLimitExceeded);
        }
        if (key !== null) {
          var existing = has.call(obj, key);
          if (existing && (options.duplicates === "combine" || part.indexOf("[]=") > -1)) {
            obj[key] = utils.combine(
              obj[key],
              val,
              options.arrayLimit,
              options.plainObjects,
              options.throwOnLimitExceeded
            );
          } else if (!existing || options.duplicates === "last") {
            obj[key] = val;
          }
        }
      }
      return obj;
    };
    var parseObject = function(chain, val, options, valuesParsed) {
      var currentArrayLength = 0;
      if (chain.length > 0 && chain[chain.length - 1] === "[]") {
        var parentKey = chain.slice(0, -1).join("");
        currentArrayLength = Array.isArray(val) && val[parentKey] ? val[parentKey].length : 0;
      }
      var leaf = valuesParsed ? val : parseArrayValue(val, options, currentArrayLength);
      for (var i = chain.length - 1; i >= 0; --i) {
        var obj;
        var root = chain[i];
        if (root === "[]" && options.parseArrays) {
          if (utils.isOverflow(leaf)) {
            obj = leaf;
          } else {
            obj = options.allowEmptyArrays && (leaf === "" || options.strictNullHandling && leaf === null) ? [] : utils.combine(
              [],
              leaf,
              options.arrayLimit,
              options.plainObjects,
              options.throwOnLimitExceeded
            );
          }
        } else {
          obj = options.plainObjects ? { __proto__: null } : {};
          var cleanRoot = root.charAt(0) === "[" && root.charAt(root.length - 1) === "]" ? root.slice(1, -1) : root;
          var decodedRoot = options.decodeDotInKeys ? cleanRoot.replace(/%2E/g, ".") : cleanRoot;
          var index = parseInt(decodedRoot, 10);
          var isValidArrayIndex = !isNaN(index) && root !== decodedRoot && String(index) === decodedRoot && index >= 0 && options.parseArrays;
          if (!options.parseArrays && decodedRoot === "") {
            obj = { 0: leaf };
          } else if (isValidArrayIndex && index < options.arrayLimit) {
            obj = [];
            obj[index] = leaf;
          } else if (isValidArrayIndex && options.throwOnLimitExceeded) {
            throw new RangeError("Array limit exceeded. Only " + options.arrayLimit + " element" + (options.arrayLimit === 1 ? "" : "s") + " allowed in an array.");
          } else if (isValidArrayIndex) {
            obj[index] = leaf;
            utils.markOverflow(obj, index);
          } else if (decodedRoot !== "__proto__") {
            obj[decodedRoot] = leaf;
          }
        }
        leaf = obj;
      }
      return leaf;
    };
    var splitKeyIntoSegments = function splitKeyIntoSegments2(originalKey, options) {
      var key = options.allowDots ? originalKey.replace(/\.([^.[]+)/g, "[$1]") : originalKey;
      if (options.depth <= 0) {
        if (!options.plainObjects && has.call(Object.prototype, key)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        return [key];
      }
      var segments = [];
      var first = key.indexOf("[");
      var parent = first >= 0 ? key.slice(0, first) : key;
      if (parent) {
        if (!options.plainObjects && has.call(Object.prototype, parent)) {
          if (!options.allowPrototypes) {
            return;
          }
        }
        segments[segments.length] = parent;
      }
      var n = key.length;
      var open = first;
      var collected = 0;
      while (open >= 0 && collected < options.depth) {
        var level = 1;
        var i = open + 1;
        var close = -1;
        while (i < n && close < 0) {
          var cu = key.charCodeAt(i);
          if (cu === 91) {
            level += 1;
          } else if (cu === 93) {
            level -= 1;
            if (level === 0) {
              close = i;
            }
          }
          i += 1;
        }
        if (close < 0) {
          segments[segments.length] = "[" + key.slice(open) + "]";
          return segments;
        }
        var seg = key.slice(open, close + 1);
        var content = seg.slice(1, -1);
        if (!options.plainObjects && has.call(Object.prototype, content) && !options.allowPrototypes) {
          return;
        }
        segments[segments.length] = seg;
        collected += 1;
        open = key.indexOf("[", close + 1);
      }
      if (open >= 0) {
        if (options.strictDepth === true) {
          throw new RangeError("Input depth exceeded depth option of " + options.depth + " and strictDepth is true");
        }
        segments[segments.length] = "[" + key.slice(open) + "]";
      }
      return segments;
    };
    var parseKeys = function parseQueryStringKeys(givenKey, val, options, valuesParsed) {
      if (!givenKey) {
        return;
      }
      var keys = splitKeyIntoSegments(givenKey, options);
      if (!keys) {
        return;
      }
      return parseObject(keys, val, options, valuesParsed);
    };
    var normalizeParseOptions = function normalizeParseOptions2(opts) {
      if (!opts) {
        return defaults;
      }
      if (typeof opts.allowEmptyArrays !== "undefined" && typeof opts.allowEmptyArrays !== "boolean") {
        throw new TypeError("`allowEmptyArrays` option can only be `true` or `false`, when provided");
      }
      if (typeof opts.decodeDotInKeys !== "undefined" && typeof opts.decodeDotInKeys !== "boolean") {
        throw new TypeError("`decodeDotInKeys` option can only be `true` or `false`, when provided");
      }
      if (opts.decoder !== null && typeof opts.decoder !== "undefined" && typeof opts.decoder !== "function") {
        throw new TypeError("Decoder has to be a function.");
      }
      if (typeof opts.charset !== "undefined" && opts.charset !== "utf-8" && opts.charset !== "iso-8859-1") {
        throw new TypeError("The charset option must be either utf-8, iso-8859-1, or undefined");
      }
      if (typeof opts.throwOnLimitExceeded !== "undefined" && typeof opts.throwOnLimitExceeded !== "boolean") {
        throw new TypeError("`throwOnLimitExceeded` option must be a boolean");
      }
      var charset = typeof opts.charset === "undefined" ? defaults.charset : opts.charset;
      var duplicates = typeof opts.duplicates === "undefined" ? defaults.duplicates : opts.duplicates;
      if (duplicates !== "combine" && duplicates !== "first" && duplicates !== "last") {
        throw new TypeError("The duplicates option must be either combine, first, or last");
      }
      var allowDots = typeof opts.allowDots === "undefined" ? opts.decodeDotInKeys === true ? true : defaults.allowDots : !!opts.allowDots;
      return {
        allowDots,
        allowEmptyArrays: typeof opts.allowEmptyArrays === "boolean" ? !!opts.allowEmptyArrays : defaults.allowEmptyArrays,
        allowPrototypes: typeof opts.allowPrototypes === "boolean" ? opts.allowPrototypes : defaults.allowPrototypes,
        allowSparse: typeof opts.allowSparse === "boolean" ? opts.allowSparse : defaults.allowSparse,
        arrayLimit: typeof opts.arrayLimit === "number" ? opts.arrayLimit : defaults.arrayLimit,
        charset,
        charsetSentinel: typeof opts.charsetSentinel === "boolean" ? opts.charsetSentinel : defaults.charsetSentinel,
        comma: typeof opts.comma === "boolean" ? opts.comma : defaults.comma,
        decodeDotInKeys: typeof opts.decodeDotInKeys === "boolean" ? opts.decodeDotInKeys : defaults.decodeDotInKeys,
        decoder: typeof opts.decoder === "function" ? opts.decoder : defaults.decoder,
        delimiter: typeof opts.delimiter === "string" || utils.isRegExp(opts.delimiter) ? opts.delimiter : defaults.delimiter,
        // eslint-disable-next-line no-implicit-coercion, no-extra-parens
        depth: typeof opts.depth === "number" || opts.depth === false ? +opts.depth : defaults.depth,
        duplicates,
        ignoreQueryPrefix: opts.ignoreQueryPrefix === true,
        interpretNumericEntities: typeof opts.interpretNumericEntities === "boolean" ? opts.interpretNumericEntities : defaults.interpretNumericEntities,
        parameterLimit: typeof opts.parameterLimit === "number" ? opts.parameterLimit : defaults.parameterLimit,
        parseArrays: opts.parseArrays !== false,
        plainObjects: typeof opts.plainObjects === "boolean" ? opts.plainObjects : defaults.plainObjects,
        strictDepth: typeof opts.strictDepth === "boolean" ? !!opts.strictDepth : defaults.strictDepth,
        strictMerge: typeof opts.strictMerge === "boolean" ? !!opts.strictMerge : defaults.strictMerge,
        strictNullHandling: typeof opts.strictNullHandling === "boolean" ? opts.strictNullHandling : defaults.strictNullHandling,
        throwOnLimitExceeded: typeof opts.throwOnLimitExceeded === "boolean" ? opts.throwOnLimitExceeded : false
      };
    };
    module2.exports = function(str, opts) {
      var options = normalizeParseOptions(opts);
      if (str === "" || str === null || typeof str === "undefined") {
        return options.plainObjects ? { __proto__: null } : {};
      }
      var tempObj = typeof str === "string" ? parseValues(str, options) : str;
      var obj = options.plainObjects ? { __proto__: null } : {};
      var keys = Object.keys(tempObj);
      for (var i = 0; i < keys.length; ++i) {
        var key = keys[i];
        var newObj = parseKeys(key, tempObj[key], options, typeof str === "string");
        obj = utils.merge(obj, newObj, options);
      }
      if (options.allowSparse === true) {
        return obj;
      }
      return utils.compact(obj);
    };
  }
});

// ../../node_modules/qs/lib/index.js
var require_lib = __commonJS({
  "../../node_modules/qs/lib/index.js"(exports, module2) {
    "use strict";
    init_polyfills();
    var stringify = require_stringify();
    var parse = require_parse();
    var formats = require_formats();
    module2.exports = {
      formats,
      parse,
      stringify
    };
  }
});

// ../../node_modules/url/url.js
var require_url = __commonJS({
  "../../node_modules/url/url.js"(exports) {
    "use strict";
    init_polyfills();
    var punycode = require_punycode();
    function Url() {
      this.protocol = null;
      this.slashes = null;
      this.auth = null;
      this.host = null;
      this.port = null;
      this.hostname = null;
      this.hash = null;
      this.search = null;
      this.query = null;
      this.pathname = null;
      this.path = null;
      this.href = null;
    }
    var protocolPattern = /^([a-z0-9.+-]+:)/i;
    var portPattern = /:[0-9]*$/;
    var simplePathPattern = /^(\/\/?(?!\/)[^?\s]*)(\?[^\s]*)?$/;
    var delims = [
      "<",
      ">",
      '"',
      "`",
      " ",
      "\r",
      "\n",
      "	"
    ];
    var unwise = [
      "{",
      "}",
      "|",
      "\\",
      "^",
      "`"
    ].concat(delims);
    var autoEscape = ["'"].concat(unwise);
    var nonHostChars = [
      "%",
      "/",
      "?",
      ";",
      "#"
    ].concat(autoEscape);
    var hostEndingChars = [
      "/",
      "?",
      "#"
    ];
    var hostnameMaxLen = 255;
    var hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/;
    var hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/;
    var unsafeProtocol = {
      javascript: true,
      "javascript:": true
    };
    var hostlessProtocol = {
      javascript: true,
      "javascript:": true
    };
    var slashedProtocol = {
      http: true,
      https: true,
      ftp: true,
      gopher: true,
      file: true,
      "http:": true,
      "https:": true,
      "ftp:": true,
      "gopher:": true,
      "file:": true
    };
    var querystring = require_lib();
    function urlParse(url, parseQueryString, slashesDenoteHost) {
      if (url && typeof url === "object" && url instanceof Url) {
        return url;
      }
      var u = new Url();
      u.parse(url, parseQueryString, slashesDenoteHost);
      return u;
    }
    Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
      if (typeof url !== "string") {
        throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
      }
      var queryIndex = url.indexOf("?"), splitter = queryIndex !== -1 && queryIndex < url.indexOf("#") ? "?" : "#", uSplit = url.split(splitter), slashRegex = /\\/g;
      uSplit[0] = uSplit[0].replace(slashRegex, "/");
      url = uSplit.join(splitter);
      var rest = url;
      rest = rest.trim();
      if (!slashesDenoteHost && url.split("#").length === 1) {
        var simplePath = simplePathPattern.exec(rest);
        if (simplePath) {
          this.path = rest;
          this.href = rest;
          this.pathname = simplePath[1];
          if (simplePath[2]) {
            this.search = simplePath[2];
            if (parseQueryString) {
              this.query = querystring.parse(this.search.substr(1));
            } else {
              this.query = this.search.substr(1);
            }
          } else if (parseQueryString) {
            this.search = "";
            this.query = {};
          }
          return this;
        }
      }
      var proto = protocolPattern.exec(rest);
      if (proto) {
        proto = proto[0];
        var lowerProto = proto.toLowerCase();
        this.protocol = lowerProto;
        rest = rest.substr(proto.length);
      }
      if (slashesDenoteHost || proto || rest.match(/^\/\/[^@/]+@[^@/]+/)) {
        var slashes = rest.substr(0, 2) === "//";
        if (slashes && !(proto && hostlessProtocol[proto])) {
          rest = rest.substr(2);
          this.slashes = true;
        }
      }
      if (!hostlessProtocol[proto] && (slashes || proto && !slashedProtocol[proto])) {
        var hostEnd = -1;
        for (var i = 0; i < hostEndingChars.length; i++) {
          var hec = rest.indexOf(hostEndingChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        var auth, atSign;
        if (hostEnd === -1) {
          atSign = rest.lastIndexOf("@");
        } else {
          atSign = rest.lastIndexOf("@", hostEnd);
        }
        if (atSign !== -1) {
          auth = rest.slice(0, atSign);
          rest = rest.slice(atSign + 1);
          this.auth = decodeURIComponent(auth);
        }
        hostEnd = -1;
        for (var i = 0; i < nonHostChars.length; i++) {
          var hec = rest.indexOf(nonHostChars[i]);
          if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
            hostEnd = hec;
          }
        }
        if (hostEnd === -1) {
          hostEnd = rest.length;
        }
        this.host = rest.slice(0, hostEnd);
        rest = rest.slice(hostEnd);
        this.parseHost();
        this.hostname = this.hostname || "";
        var ipv6Hostname = this.hostname[0] === "[" && this.hostname[this.hostname.length - 1] === "]";
        if (!ipv6Hostname) {
          var hostparts = this.hostname.split(/\./);
          for (var i = 0, l = hostparts.length; i < l; i++) {
            var part = hostparts[i];
            if (!part) {
              continue;
            }
            if (!part.match(hostnamePartPattern)) {
              var newpart = "";
              for (var j = 0, k = part.length; j < k; j++) {
                if (part.charCodeAt(j) > 127) {
                  newpart += "x";
                } else {
                  newpart += part[j];
                }
              }
              if (!newpart.match(hostnamePartPattern)) {
                var validParts = hostparts.slice(0, i);
                var notHost = hostparts.slice(i + 1);
                var bit = part.match(hostnamePartStart);
                if (bit) {
                  validParts.push(bit[1]);
                  notHost.unshift(bit[2]);
                }
                if (notHost.length) {
                  rest = "/" + notHost.join(".") + rest;
                }
                this.hostname = validParts.join(".");
                break;
              }
            }
          }
        }
        if (this.hostname.length > hostnameMaxLen) {
          this.hostname = "";
        } else {
          this.hostname = this.hostname.toLowerCase();
        }
        if (!ipv6Hostname) {
          this.hostname = punycode.toASCII(this.hostname);
        }
        var p = this.port ? ":" + this.port : "";
        var h = this.hostname || "";
        this.host = h + p;
        this.href += this.host;
        if (ipv6Hostname) {
          this.hostname = this.hostname.substr(1, this.hostname.length - 2);
          if (rest[0] !== "/") {
            rest = "/" + rest;
          }
        }
      }
      if (!unsafeProtocol[lowerProto]) {
        for (var i = 0, l = autoEscape.length; i < l; i++) {
          var ae = autoEscape[i];
          if (rest.indexOf(ae) === -1) {
            continue;
          }
          var esc = encodeURIComponent(ae);
          if (esc === ae) {
            esc = escape(ae);
          }
          rest = rest.split(ae).join(esc);
        }
      }
      var hash = rest.indexOf("#");
      if (hash !== -1) {
        this.hash = rest.substr(hash);
        rest = rest.slice(0, hash);
      }
      var qm = rest.indexOf("?");
      if (qm !== -1) {
        this.search = rest.substr(qm);
        this.query = rest.substr(qm + 1);
        if (parseQueryString) {
          this.query = querystring.parse(this.query);
        }
        rest = rest.slice(0, qm);
      } else if (parseQueryString) {
        this.search = "";
        this.query = {};
      }
      if (rest) {
        this.pathname = rest;
      }
      if (slashedProtocol[lowerProto] && this.hostname && !this.pathname) {
        this.pathname = "/";
      }
      if (this.pathname || this.search) {
        var p = this.pathname || "";
        var s = this.search || "";
        this.path = p + s;
      }
      this.href = this.format();
      return this;
    };
    function urlFormat(obj) {
      if (typeof obj === "string") {
        obj = urlParse(obj);
      }
      if (!(obj instanceof Url)) {
        return Url.prototype.format.call(obj);
      }
      return obj.format();
    }
    Url.prototype.format = function() {
      var auth = this.auth || "";
      if (auth) {
        auth = encodeURIComponent(auth);
        auth = auth.replace(/%3A/i, ":");
        auth += "@";
      }
      var protocol = this.protocol || "", pathname = this.pathname || "", hash = this.hash || "", host = false, query = "";
      if (this.host) {
        host = auth + this.host;
      } else if (this.hostname) {
        host = auth + (this.hostname.indexOf(":") === -1 ? this.hostname : "[" + this.hostname + "]");
        if (this.port) {
          host += ":" + this.port;
        }
      }
      if (this.query && typeof this.query === "object" && Object.keys(this.query).length) {
        query = querystring.stringify(this.query, {
          arrayFormat: "repeat",
          addQueryPrefix: false
        });
      }
      var search = this.search || query && "?" + query || "";
      if (protocol && protocol.substr(-1) !== ":") {
        protocol += ":";
      }
      if (this.slashes || (!protocol || slashedProtocol[protocol]) && host !== false) {
        host = "//" + (host || "");
        if (pathname && pathname.charAt(0) !== "/") {
          pathname = "/" + pathname;
        }
      } else if (!host) {
        host = "";
      }
      if (hash && hash.charAt(0) !== "#") {
        hash = "#" + hash;
      }
      if (search && search.charAt(0) !== "?") {
        search = "?" + search;
      }
      pathname = pathname.replace(/[?#]/g, function(match) {
        return encodeURIComponent(match);
      });
      search = search.replace("#", "%23");
      return protocol + host + pathname + search + hash;
    };
    function urlResolve(source, relative) {
      return urlParse(source, false, true).resolve(relative);
    }
    Url.prototype.resolve = function(relative) {
      return this.resolveObject(urlParse(relative, false, true)).format();
    };
    function urlResolveObject(source, relative) {
      if (!source) {
        return relative;
      }
      return urlParse(source, false, true).resolveObject(relative);
    }
    Url.prototype.resolveObject = function(relative) {
      if (typeof relative === "string") {
        var rel = new Url();
        rel.parse(relative, false, true);
        relative = rel;
      }
      var result = new Url();
      var tkeys = Object.keys(this);
      for (var tk = 0; tk < tkeys.length; tk++) {
        var tkey = tkeys[tk];
        result[tkey] = this[tkey];
      }
      result.hash = relative.hash;
      if (relative.href === "") {
        result.href = result.format();
        return result;
      }
      if (relative.slashes && !relative.protocol) {
        var rkeys = Object.keys(relative);
        for (var rk = 0; rk < rkeys.length; rk++) {
          var rkey = rkeys[rk];
          if (rkey !== "protocol") {
            result[rkey] = relative[rkey];
          }
        }
        if (slashedProtocol[result.protocol] && result.hostname && !result.pathname) {
          result.pathname = "/";
          result.path = result.pathname;
        }
        result.href = result.format();
        return result;
      }
      if (relative.protocol && relative.protocol !== result.protocol) {
        if (!slashedProtocol[relative.protocol]) {
          var keys = Object.keys(relative);
          for (var v = 0; v < keys.length; v++) {
            var k = keys[v];
            result[k] = relative[k];
          }
          result.href = result.format();
          return result;
        }
        result.protocol = relative.protocol;
        if (!relative.host && !hostlessProtocol[relative.protocol]) {
          var relPath = (relative.pathname || "").split("/");
          while (relPath.length && !(relative.host = relPath.shift())) {
          }
          if (!relative.host) {
            relative.host = "";
          }
          if (!relative.hostname) {
            relative.hostname = "";
          }
          if (relPath[0] !== "") {
            relPath.unshift("");
          }
          if (relPath.length < 2) {
            relPath.unshift("");
          }
          result.pathname = relPath.join("/");
        } else {
          result.pathname = relative.pathname;
        }
        result.search = relative.search;
        result.query = relative.query;
        result.host = relative.host || "";
        result.auth = relative.auth;
        result.hostname = relative.hostname || relative.host;
        result.port = relative.port;
        if (result.pathname || result.search) {
          var p = result.pathname || "";
          var s = result.search || "";
          result.path = p + s;
        }
        result.slashes = result.slashes || relative.slashes;
        result.href = result.format();
        return result;
      }
      var isSourceAbs = result.pathname && result.pathname.charAt(0) === "/", isRelAbs = relative.host || relative.pathname && relative.pathname.charAt(0) === "/", mustEndAbs = isRelAbs || isSourceAbs || result.host && relative.pathname, removeAllDots = mustEndAbs, srcPath = result.pathname && result.pathname.split("/") || [], relPath = relative.pathname && relative.pathname.split("/") || [], psychotic = result.protocol && !slashedProtocol[result.protocol];
      if (psychotic) {
        result.hostname = "";
        result.port = null;
        if (result.host) {
          if (srcPath[0] === "") {
            srcPath[0] = result.host;
          } else {
            srcPath.unshift(result.host);
          }
        }
        result.host = "";
        if (relative.protocol) {
          relative.hostname = null;
          relative.port = null;
          if (relative.host) {
            if (relPath[0] === "") {
              relPath[0] = relative.host;
            } else {
              relPath.unshift(relative.host);
            }
          }
          relative.host = null;
        }
        mustEndAbs = mustEndAbs && (relPath[0] === "" || srcPath[0] === "");
      }
      if (isRelAbs) {
        result.host = relative.host || relative.host === "" ? relative.host : result.host;
        result.hostname = relative.hostname || relative.hostname === "" ? relative.hostname : result.hostname;
        result.search = relative.search;
        result.query = relative.query;
        srcPath = relPath;
      } else if (relPath.length) {
        if (!srcPath) {
          srcPath = [];
        }
        srcPath.pop();
        srcPath = srcPath.concat(relPath);
        result.search = relative.search;
        result.query = relative.query;
      } else if (relative.search != null) {
        if (psychotic) {
          result.host = srcPath.shift();
          result.hostname = result.host;
          var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
          if (authInHost) {
            result.auth = authInHost.shift();
            result.hostname = authInHost.shift();
            result.host = result.hostname;
          }
        }
        result.search = relative.search;
        result.query = relative.query;
        if (result.pathname !== null || result.search !== null) {
          result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
        }
        result.href = result.format();
        return result;
      }
      if (!srcPath.length) {
        result.pathname = null;
        if (result.search) {
          result.path = "/" + result.search;
        } else {
          result.path = null;
        }
        result.href = result.format();
        return result;
      }
      var last = srcPath.slice(-1)[0];
      var hasTrailingSlash = (result.host || relative.host || srcPath.length > 1) && (last === "." || last === "..") || last === "";
      var up = 0;
      for (var i = srcPath.length; i >= 0; i--) {
        last = srcPath[i];
        if (last === ".") {
          srcPath.splice(i, 1);
        } else if (last === "..") {
          srcPath.splice(i, 1);
          up++;
        } else if (up) {
          srcPath.splice(i, 1);
          up--;
        }
      }
      if (!mustEndAbs && !removeAllDots) {
        for (; up--; up) {
          srcPath.unshift("..");
        }
      }
      if (mustEndAbs && srcPath[0] !== "" && (!srcPath[0] || srcPath[0].charAt(0) !== "/")) {
        srcPath.unshift("");
      }
      if (hasTrailingSlash && srcPath.join("/").substr(-1) !== "/") {
        srcPath.push("");
      }
      var isAbsolute = srcPath[0] === "" || srcPath[0] && srcPath[0].charAt(0) === "/";
      if (psychotic) {
        result.hostname = isAbsolute ? "" : srcPath.length ? srcPath.shift() : "";
        result.host = result.hostname;
        var authInHost = result.host && result.host.indexOf("@") > 0 ? result.host.split("@") : false;
        if (authInHost) {
          result.auth = authInHost.shift();
          result.hostname = authInHost.shift();
          result.host = result.hostname;
        }
      }
      mustEndAbs = mustEndAbs || result.host && srcPath.length;
      if (mustEndAbs && !isAbsolute) {
        srcPath.unshift("");
      }
      if (srcPath.length > 0) {
        result.pathname = srcPath.join("/");
      } else {
        result.pathname = null;
        result.path = null;
      }
      if (result.pathname !== null || result.search !== null) {
        result.path = (result.pathname ? result.pathname : "") + (result.search ? result.search : "");
      }
      result.auth = relative.auth || result.auth;
      result.slashes = result.slashes || relative.slashes;
      result.href = result.format();
      return result;
    };
    Url.prototype.parseHost = function() {
      var host = this.host;
      var port = portPattern.exec(host);
      if (port) {
        port = port[0];
        if (port !== ":") {
          this.port = port.substr(1);
        }
        host = host.substr(0, host.length - port.length);
      }
      if (host) {
        this.hostname = host;
      }
    };
    exports.parse = urlParse;
    exports.resolve = urlResolve;
    exports.resolveObject = urlResolveObject;
    exports.format = urlFormat;
    exports.Url = Url;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/debugSession.js
var require_debugSession = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/debugSession.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.DebugSession = exports.ErrorDestination = exports.MemoryEvent = exports.InvalidatedEvent = exports.ProgressEndEvent = exports.ProgressUpdateEvent = exports.ProgressStartEvent = exports.CapabilitiesEvent = exports.LoadedSourceEvent = exports.ModuleEvent = exports.BreakpointEvent = exports.ThreadEvent = exports.OutputEvent = exports.ExitedEvent = exports.TerminatedEvent = exports.InitializedEvent = exports.ContinuedEvent = exports.StoppedEvent = exports.CompletionItem = exports.Module = exports.Breakpoint = exports.Variable = exports.Thread = exports.StackFrame = exports.Scope = exports.Source = void 0;
    var protocol_1 = require_protocol();
    var messages_1 = require_messages();
    var runDebugAdapter_1 = require_runDebugAdapterStub();
    var url_1 = require_url();
    var Source2 = class {
      constructor(name, path, id = 0, origin, data) {
        this.name = name;
        this.path = path;
        this.sourceReference = id;
        if (origin) {
          this.origin = origin;
        }
        if (data) {
          this.adapterData = data;
        }
      }
    };
    exports.Source = Source2;
    var Scope2 = class {
      constructor(name, reference, expensive = false) {
        this.name = name;
        this.variablesReference = reference;
        this.expensive = expensive;
      }
    };
    exports.Scope = Scope2;
    var StackFrame3 = class {
      constructor(i, nm, src, ln = 0, col = 0) {
        this.id = i;
        this.source = src;
        this.line = ln;
        this.column = col;
        this.name = nm;
      }
    };
    exports.StackFrame = StackFrame3;
    var Thread2 = class {
      constructor(id, name) {
        this.id = id;
        if (name) {
          this.name = name;
        } else {
          this.name = "Thread #" + id;
        }
      }
    };
    exports.Thread = Thread2;
    var Variable = class {
      constructor(name, value, ref = 0, indexedVariables, namedVariables) {
        this.name = name;
        this.value = value;
        this.variablesReference = ref;
        if (typeof namedVariables === "number") {
          this.namedVariables = namedVariables;
        }
        if (typeof indexedVariables === "number") {
          this.indexedVariables = indexedVariables;
        }
      }
    };
    exports.Variable = Variable;
    var Breakpoint2 = class {
      constructor(verified, line, column, source) {
        this.verified = verified;
        const e = this;
        if (typeof line === "number") {
          e.line = line;
        }
        if (typeof column === "number") {
          e.column = column;
        }
        if (source) {
          e.source = source;
        }
      }
      setId(id) {
        this.id = id;
      }
    };
    exports.Breakpoint = Breakpoint2;
    var Module = class {
      constructor(id, name) {
        this.id = id;
        this.name = name;
      }
    };
    exports.Module = Module;
    var CompletionItem2 = class {
      constructor(label, start, length = 0) {
        this.label = label;
        this.start = start;
        this.length = length;
      }
    };
    exports.CompletionItem = CompletionItem2;
    var StoppedEvent2 = class extends messages_1.Event {
      constructor(reason, threadId, exceptionText) {
        super("stopped");
        this.body = {
          reason
        };
        if (typeof threadId === "number") {
          this.body.threadId = threadId;
        }
        if (typeof exceptionText === "string") {
          this.body.text = exceptionText;
        }
      }
    };
    exports.StoppedEvent = StoppedEvent2;
    var ContinuedEvent = class extends messages_1.Event {
      constructor(threadId, allThreadsContinued) {
        super("continued");
        this.body = {
          threadId
        };
        if (typeof allThreadsContinued === "boolean") {
          this.body.allThreadsContinued = allThreadsContinued;
        }
      }
    };
    exports.ContinuedEvent = ContinuedEvent;
    var InitializedEvent2 = class extends messages_1.Event {
      constructor() {
        super("initialized");
      }
    };
    exports.InitializedEvent = InitializedEvent2;
    var TerminatedEvent2 = class extends messages_1.Event {
      constructor(restart) {
        super("terminated");
        if (typeof restart === "boolean" || restart) {
          const e = this;
          e.body = {
            restart
          };
        }
      }
    };
    exports.TerminatedEvent = TerminatedEvent2;
    var ExitedEvent2 = class extends messages_1.Event {
      constructor(exitCode) {
        super("exited");
        this.body = {
          exitCode
        };
      }
    };
    exports.ExitedEvent = ExitedEvent2;
    var OutputEvent2 = class extends messages_1.Event {
      constructor(output, category = "console", data) {
        super("output");
        this.body = {
          category,
          output
        };
        if (data !== void 0) {
          this.body.data = data;
        }
      }
    };
    exports.OutputEvent = OutputEvent2;
    var ThreadEvent = class extends messages_1.Event {
      constructor(reason, threadId) {
        super("thread");
        this.body = {
          reason,
          threadId
        };
      }
    };
    exports.ThreadEvent = ThreadEvent;
    var BreakpointEvent = class extends messages_1.Event {
      constructor(reason, breakpoint) {
        super("breakpoint");
        this.body = {
          reason,
          breakpoint
        };
      }
    };
    exports.BreakpointEvent = BreakpointEvent;
    var ModuleEvent = class extends messages_1.Event {
      constructor(reason, module3) {
        super("module");
        this.body = {
          reason,
          module: module3
        };
      }
    };
    exports.ModuleEvent = ModuleEvent;
    var LoadedSourceEvent = class extends messages_1.Event {
      constructor(reason, source) {
        super("loadedSource");
        this.body = {
          reason,
          source
        };
      }
    };
    exports.LoadedSourceEvent = LoadedSourceEvent;
    var CapabilitiesEvent = class extends messages_1.Event {
      constructor(capabilities) {
        super("capabilities");
        this.body = {
          capabilities
        };
      }
    };
    exports.CapabilitiesEvent = CapabilitiesEvent;
    var ProgressStartEvent = class extends messages_1.Event {
      constructor(progressId, title, message) {
        super("progressStart");
        this.body = {
          progressId,
          title
        };
        if (typeof message === "string") {
          this.body.message = message;
        }
      }
    };
    exports.ProgressStartEvent = ProgressStartEvent;
    var ProgressUpdateEvent = class extends messages_1.Event {
      constructor(progressId, message) {
        super("progressUpdate");
        this.body = {
          progressId
        };
        if (typeof message === "string") {
          this.body.message = message;
        }
      }
    };
    exports.ProgressUpdateEvent = ProgressUpdateEvent;
    var ProgressEndEvent = class extends messages_1.Event {
      constructor(progressId, message) {
        super("progressEnd");
        this.body = {
          progressId
        };
        if (typeof message === "string") {
          this.body.message = message;
        }
      }
    };
    exports.ProgressEndEvent = ProgressEndEvent;
    var InvalidatedEvent = class extends messages_1.Event {
      constructor(areas, threadId, stackFrameId) {
        super("invalidated");
        this.body = {};
        if (areas) {
          this.body.areas = areas;
        }
        if (threadId) {
          this.body.threadId = threadId;
        }
        if (stackFrameId) {
          this.body.stackFrameId = stackFrameId;
        }
      }
    };
    exports.InvalidatedEvent = InvalidatedEvent;
    var MemoryEvent = class extends messages_1.Event {
      constructor(memoryReference, offset, count) {
        super("memory");
        this.body = { memoryReference, offset, count };
      }
    };
    exports.MemoryEvent = MemoryEvent;
    var ErrorDestination;
    (function(ErrorDestination2) {
      ErrorDestination2[ErrorDestination2["User"] = 1] = "User";
      ErrorDestination2[ErrorDestination2["Telemetry"] = 2] = "Telemetry";
    })(ErrorDestination = exports.ErrorDestination || (exports.ErrorDestination = {}));
    var DebugSession = class _DebugSession extends protocol_1.ProtocolServer {
      constructor(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super();
        const linesAndColumnsStartAt1 = typeof obsolete_debuggerLinesAndColumnsStartAt1 === "boolean" ? obsolete_debuggerLinesAndColumnsStartAt1 : false;
        this._debuggerLinesStartAt1 = linesAndColumnsStartAt1;
        this._debuggerColumnsStartAt1 = linesAndColumnsStartAt1;
        this._debuggerPathsAreURIs = false;
        this._clientLinesStartAt1 = true;
        this._clientColumnsStartAt1 = true;
        this._clientPathsAreURIs = false;
        this._isServer = typeof obsolete_isServer === "boolean" ? obsolete_isServer : false;
        this.on("close", () => {
          this.shutdown();
        });
        this.on("error", (error) => {
          this.shutdown();
        });
      }
      setDebuggerPathFormat(format) {
        this._debuggerPathsAreURIs = format !== "path";
      }
      setDebuggerLinesStartAt1(enable) {
        this._debuggerLinesStartAt1 = enable;
      }
      setDebuggerColumnsStartAt1(enable) {
        this._debuggerColumnsStartAt1 = enable;
      }
      setRunAsServer(enable) {
        this._isServer = enable;
      }
      /**
       * A virtual constructor...
       */
      static run(debugSession) {
        (0, runDebugAdapter_1.runDebugAdapter)(debugSession);
      }
      shutdown() {
        if (this._isServer || this._isRunningInline()) {
        } else {
          setTimeout(() => {
            import_process.default.exit(0);
          }, 100);
        }
      }
      sendErrorResponse(response, codeOrMessage, format, variables, dest = ErrorDestination.User) {
        let msg;
        if (typeof codeOrMessage === "number") {
          msg = {
            id: codeOrMessage,
            format
          };
          if (variables) {
            msg.variables = variables;
          }
          if (dest & ErrorDestination.User) {
            msg.showUser = true;
          }
          if (dest & ErrorDestination.Telemetry) {
            msg.sendTelemetry = true;
          }
        } else {
          msg = codeOrMessage;
        }
        response.success = false;
        response.message = _DebugSession.formatPII(msg.format, true, msg.variables);
        if (!response.body) {
          response.body = {};
        }
        response.body.error = msg;
        this.sendResponse(response);
      }
      runInTerminalRequest(args, timeout, cb) {
        this.sendRequest("runInTerminal", args, timeout, cb);
      }
      dispatchRequest(request) {
        const response = new messages_1.Response(request);
        try {
          if (request.command === "initialize") {
            var args = request.arguments;
            if (typeof args.linesStartAt1 === "boolean") {
              this._clientLinesStartAt1 = args.linesStartAt1;
            }
            if (typeof args.columnsStartAt1 === "boolean") {
              this._clientColumnsStartAt1 = args.columnsStartAt1;
            }
            if (args.pathFormat !== "path") {
              this.sendErrorResponse(response, 2018, "debug adapter only supports native paths", null, ErrorDestination.Telemetry);
            } else {
              const initializeResponse = response;
              initializeResponse.body = {};
              this.initializeRequest(initializeResponse, args);
            }
          } else if (request.command === "launch") {
            this.launchRequest(response, request.arguments, request);
          } else if (request.command === "attach") {
            this.attachRequest(response, request.arguments, request);
          } else if (request.command === "disconnect") {
            this.disconnectRequest(response, request.arguments, request);
          } else if (request.command === "terminate") {
            this.terminateRequest(response, request.arguments, request);
          } else if (request.command === "restart") {
            this.restartRequest(response, request.arguments, request);
          } else if (request.command === "setBreakpoints") {
            this.setBreakPointsRequest(response, request.arguments, request);
          } else if (request.command === "setFunctionBreakpoints") {
            this.setFunctionBreakPointsRequest(response, request.arguments, request);
          } else if (request.command === "setExceptionBreakpoints") {
            this.setExceptionBreakPointsRequest(response, request.arguments, request);
          } else if (request.command === "configurationDone") {
            this.configurationDoneRequest(response, request.arguments, request);
          } else if (request.command === "continue") {
            this.continueRequest(response, request.arguments, request);
          } else if (request.command === "next") {
            this.nextRequest(response, request.arguments, request);
          } else if (request.command === "stepIn") {
            this.stepInRequest(response, request.arguments, request);
          } else if (request.command === "stepOut") {
            this.stepOutRequest(response, request.arguments, request);
          } else if (request.command === "stepBack") {
            this.stepBackRequest(response, request.arguments, request);
          } else if (request.command === "reverseContinue") {
            this.reverseContinueRequest(response, request.arguments, request);
          } else if (request.command === "restartFrame") {
            this.restartFrameRequest(response, request.arguments, request);
          } else if (request.command === "goto") {
            this.gotoRequest(response, request.arguments, request);
          } else if (request.command === "pause") {
            this.pauseRequest(response, request.arguments, request);
          } else if (request.command === "stackTrace") {
            this.stackTraceRequest(response, request.arguments, request);
          } else if (request.command === "scopes") {
            this.scopesRequest(response, request.arguments, request);
          } else if (request.command === "variables") {
            this.variablesRequest(response, request.arguments, request);
          } else if (request.command === "setVariable") {
            this.setVariableRequest(response, request.arguments, request);
          } else if (request.command === "setExpression") {
            this.setExpressionRequest(response, request.arguments, request);
          } else if (request.command === "source") {
            this.sourceRequest(response, request.arguments, request);
          } else if (request.command === "threads") {
            this.threadsRequest(response, request);
          } else if (request.command === "terminateThreads") {
            this.terminateThreadsRequest(response, request.arguments, request);
          } else if (request.command === "evaluate") {
            this.evaluateRequest(response, request.arguments, request);
          } else if (request.command === "stepInTargets") {
            this.stepInTargetsRequest(response, request.arguments, request);
          } else if (request.command === "gotoTargets") {
            this.gotoTargetsRequest(response, request.arguments, request);
          } else if (request.command === "completions") {
            this.completionsRequest(response, request.arguments, request);
          } else if (request.command === "exceptionInfo") {
            this.exceptionInfoRequest(response, request.arguments, request);
          } else if (request.command === "loadedSources") {
            this.loadedSourcesRequest(response, request.arguments, request);
          } else if (request.command === "dataBreakpointInfo") {
            this.dataBreakpointInfoRequest(response, request.arguments, request);
          } else if (request.command === "setDataBreakpoints") {
            this.setDataBreakpointsRequest(response, request.arguments, request);
          } else if (request.command === "readMemory") {
            this.readMemoryRequest(response, request.arguments, request);
          } else if (request.command === "writeMemory") {
            this.writeMemoryRequest(response, request.arguments, request);
          } else if (request.command === "disassemble") {
            this.disassembleRequest(response, request.arguments, request);
          } else if (request.command === "cancel") {
            this.cancelRequest(response, request.arguments, request);
          } else if (request.command === "breakpointLocations") {
            this.breakpointLocationsRequest(response, request.arguments, request);
          } else if (request.command === "setInstructionBreakpoints") {
            this.setInstructionBreakpointsRequest(response, request.arguments, request);
          } else {
            this.customRequest(request.command, response, request.arguments, request);
          }
        } catch (e) {
          this.sendErrorResponse(response, 1104, "{_stack}", { _exception: e.message, _stack: e.stack }, ErrorDestination.Telemetry);
        }
      }
      initializeRequest(response, args) {
        response.body.supportsConditionalBreakpoints = false;
        response.body.supportsHitConditionalBreakpoints = false;
        response.body.supportsFunctionBreakpoints = false;
        response.body.supportsConfigurationDoneRequest = true;
        response.body.supportsEvaluateForHovers = false;
        response.body.supportsStepBack = false;
        response.body.supportsSetVariable = false;
        response.body.supportsRestartFrame = false;
        response.body.supportsStepInTargetsRequest = false;
        response.body.supportsGotoTargetsRequest = false;
        response.body.supportsCompletionsRequest = false;
        response.body.supportsRestartRequest = false;
        response.body.supportsExceptionOptions = false;
        response.body.supportsValueFormattingOptions = false;
        response.body.supportsExceptionInfoRequest = false;
        response.body.supportTerminateDebuggee = false;
        response.body.supportsDelayedStackTraceLoading = false;
        response.body.supportsLoadedSourcesRequest = false;
        response.body.supportsLogPoints = false;
        response.body.supportsTerminateThreadsRequest = false;
        response.body.supportsSetExpression = false;
        response.body.supportsTerminateRequest = false;
        response.body.supportsDataBreakpoints = false;
        response.body.supportsReadMemoryRequest = false;
        response.body.supportsDisassembleRequest = false;
        response.body.supportsCancelRequest = false;
        response.body.supportsBreakpointLocationsRequest = false;
        response.body.supportsClipboardContext = false;
        response.body.supportsSteppingGranularity = false;
        response.body.supportsInstructionBreakpoints = false;
        response.body.supportsExceptionFilterOptions = false;
        this.sendResponse(response);
      }
      disconnectRequest(response, args, request) {
        this.sendResponse(response);
        this.shutdown();
      }
      launchRequest(response, args, request) {
        this.sendResponse(response);
      }
      attachRequest(response, args, request) {
        this.sendResponse(response);
      }
      terminateRequest(response, args, request) {
        this.sendResponse(response);
      }
      restartRequest(response, args, request) {
        this.sendResponse(response);
      }
      setBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      setFunctionBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      setExceptionBreakPointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      configurationDoneRequest(response, args, request) {
        this.sendResponse(response);
      }
      continueRequest(response, args, request) {
        this.sendResponse(response);
      }
      nextRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepInRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepOutRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepBackRequest(response, args, request) {
        this.sendResponse(response);
      }
      reverseContinueRequest(response, args, request) {
        this.sendResponse(response);
      }
      restartFrameRequest(response, args, request) {
        this.sendResponse(response);
      }
      gotoRequest(response, args, request) {
        this.sendResponse(response);
      }
      pauseRequest(response, args, request) {
        this.sendResponse(response);
      }
      sourceRequest(response, args, request) {
        this.sendResponse(response);
      }
      threadsRequest(response, request) {
        this.sendResponse(response);
      }
      terminateThreadsRequest(response, args, request) {
        this.sendResponse(response);
      }
      stackTraceRequest(response, args, request) {
        this.sendResponse(response);
      }
      scopesRequest(response, args, request) {
        this.sendResponse(response);
      }
      variablesRequest(response, args, request) {
        this.sendResponse(response);
      }
      setVariableRequest(response, args, request) {
        this.sendResponse(response);
      }
      setExpressionRequest(response, args, request) {
        this.sendResponse(response);
      }
      evaluateRequest(response, args, request) {
        this.sendResponse(response);
      }
      stepInTargetsRequest(response, args, request) {
        this.sendResponse(response);
      }
      gotoTargetsRequest(response, args, request) {
        this.sendResponse(response);
      }
      completionsRequest(response, args, request) {
        this.sendResponse(response);
      }
      exceptionInfoRequest(response, args, request) {
        this.sendResponse(response);
      }
      loadedSourcesRequest(response, args, request) {
        this.sendResponse(response);
      }
      dataBreakpointInfoRequest(response, args, request) {
        this.sendResponse(response);
      }
      setDataBreakpointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      readMemoryRequest(response, args, request) {
        this.sendResponse(response);
      }
      writeMemoryRequest(response, args, request) {
        this.sendResponse(response);
      }
      disassembleRequest(response, args, request) {
        this.sendResponse(response);
      }
      cancelRequest(response, args, request) {
        this.sendResponse(response);
      }
      breakpointLocationsRequest(response, args, request) {
        this.sendResponse(response);
      }
      setInstructionBreakpointsRequest(response, args, request) {
        this.sendResponse(response);
      }
      /**
       * Override this hook to implement custom requests.
       */
      customRequest(command, response, args, request) {
        this.sendErrorResponse(response, 1014, "unrecognized request", null, ErrorDestination.Telemetry);
      }
      //---- protected -------------------------------------------------------------------------------------------------
      convertClientLineToDebugger(line) {
        if (this._debuggerLinesStartAt1) {
          return this._clientLinesStartAt1 ? line : line + 1;
        }
        return this._clientLinesStartAt1 ? line - 1 : line;
      }
      convertDebuggerLineToClient(line) {
        if (this._debuggerLinesStartAt1) {
          return this._clientLinesStartAt1 ? line : line - 1;
        }
        return this._clientLinesStartAt1 ? line + 1 : line;
      }
      convertClientColumnToDebugger(column) {
        if (this._debuggerColumnsStartAt1) {
          return this._clientColumnsStartAt1 ? column : column + 1;
        }
        return this._clientColumnsStartAt1 ? column - 1 : column;
      }
      convertDebuggerColumnToClient(column) {
        if (this._debuggerColumnsStartAt1) {
          return this._clientColumnsStartAt1 ? column : column - 1;
        }
        return this._clientColumnsStartAt1 ? column + 1 : column;
      }
      convertClientPathToDebugger(clientPath) {
        if (this._clientPathsAreURIs !== this._debuggerPathsAreURIs) {
          if (this._clientPathsAreURIs) {
            return _DebugSession.uri2path(clientPath);
          } else {
            return _DebugSession.path2uri(clientPath);
          }
        }
        return clientPath;
      }
      convertDebuggerPathToClient(debuggerPath) {
        if (this._debuggerPathsAreURIs !== this._clientPathsAreURIs) {
          if (this._debuggerPathsAreURIs) {
            return _DebugSession.uri2path(debuggerPath);
          } else {
            return _DebugSession.path2uri(debuggerPath);
          }
        }
        return debuggerPath;
      }
      //---- private -------------------------------------------------------------------------------
      static path2uri(path) {
        if (import_process.default.platform === "win32") {
          if (/^[A-Z]:/.test(path)) {
            path = path[0].toLowerCase() + path.substr(1);
          }
          path = path.replace(/\\/g, "/");
        }
        path = encodeURI(path);
        let uri = new url_1.URL(`file:`);
        uri.pathname = path;
        return uri.toString();
      }
      static uri2path(sourceUri) {
        let uri = new url_1.URL(sourceUri);
        let s = decodeURIComponent(uri.pathname);
        if (import_process.default.platform === "win32") {
          if (/^\/[a-zA-Z]:/.test(s)) {
            s = s[1].toLowerCase() + s.substr(2);
          }
          s = s.replace(/\//g, "\\");
        }
        return s;
      }
      /*
      * If argument starts with '_' it is OK to send its value to telemetry.
      */
      static formatPII(format, excludePII, args) {
        return format.replace(_DebugSession._formatPIIRegexp, function(match, paramName) {
          if (excludePII && paramName.length > 0 && paramName[0] !== "_") {
            return match;
          }
          return args[paramName] && args.hasOwnProperty(paramName) ? args[paramName] : match;
        });
      }
    };
    exports.DebugSession = DebugSession;
    DebugSession._formatPIIRegexp = /{([^}]+)}/g;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/web/internalLoggerStub.js
var require_internalLoggerStub = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/web/internalLoggerStub.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InternalLogger = void 0;
    var InternalLogger = class {
      dispose() {
        return void 0;
      }
      log(msg, level, prependTimestamp) {
      }
      setup(options) {
        return void 0;
      }
    };
    exports.InternalLogger = InternalLogger;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/logger.js
var require_logger = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/logger.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.trimLastNewline = exports.LogOutputEvent = exports.logger = exports.Logger = exports.LogLevel = void 0;
    var internalLogger_1 = require_internalLoggerStub();
    var debugSession_1 = require_debugSession();
    var LogLevel;
    (function(LogLevel2) {
      LogLevel2[LogLevel2["Verbose"] = 0] = "Verbose";
      LogLevel2[LogLevel2["Log"] = 1] = "Log";
      LogLevel2[LogLevel2["Warn"] = 2] = "Warn";
      LogLevel2[LogLevel2["Error"] = 3] = "Error";
      LogLevel2[LogLevel2["Stop"] = 4] = "Stop";
    })(LogLevel = exports.LogLevel || (exports.LogLevel = {}));
    var Logger = class {
      constructor() {
        this._pendingLogQ = [];
      }
      log(msg, level = LogLevel.Log) {
        msg = msg + "\n";
        this._write(msg, level);
      }
      verbose(msg) {
        this.log(msg, LogLevel.Verbose);
      }
      warn(msg) {
        this.log(msg, LogLevel.Warn);
      }
      error(msg) {
        this.log(msg, LogLevel.Error);
      }
      dispose() {
        if (this._currentLogger) {
          const disposeP = this._currentLogger.dispose();
          this._currentLogger = null;
          return disposeP;
        } else {
          return Promise.resolve();
        }
      }
      /**
       * `log` adds a newline, `write` doesn't
       */
      _write(msg, level = LogLevel.Log) {
        msg = msg + "";
        if (this._pendingLogQ) {
          this._pendingLogQ.push({ msg, level });
        } else if (this._currentLogger) {
          this._currentLogger.log(msg, level);
        }
      }
      /**
       * Set the logger's minimum level to log in the console, and whether to log to the file. Log messages are queued before this is
       * called the first time, because minLogLevel defaults to Warn.
       */
      setup(consoleMinLogLevel, _logFilePath, prependTimestamp = true) {
        const logFilePath = typeof _logFilePath === "string" ? _logFilePath : _logFilePath && this._logFilePathFromInit;
        if (this._currentLogger) {
          const options = {
            consoleMinLogLevel,
            logFilePath,
            prependTimestamp
          };
          this._currentLogger.setup(options).then(() => {
            if (this._pendingLogQ) {
              const logQ = this._pendingLogQ;
              this._pendingLogQ = null;
              logQ.forEach((item) => this._write(item.msg, item.level));
            }
          });
        }
      }
      init(logCallback, logFilePath, logToConsole) {
        this._pendingLogQ = this._pendingLogQ || [];
        this._currentLogger = new internalLogger_1.InternalLogger(logCallback, logToConsole);
        this._logFilePathFromInit = logFilePath;
      }
    };
    exports.Logger = Logger;
    exports.logger = new Logger();
    var LogOutputEvent = class extends debugSession_1.OutputEvent {
      constructor(msg, level) {
        const category = level === LogLevel.Error ? "stderr" : level === LogLevel.Warn ? "console" : "stdout";
        super(msg, category);
      }
    };
    exports.LogOutputEvent = LogOutputEvent;
    function trimLastNewline(str) {
      return str.replace(/(\n|\r\n)$/, "");
    }
    exports.trimLastNewline = trimLastNewline;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/loggingDebugSession.js
var require_loggingDebugSession = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/loggingDebugSession.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoggingDebugSession = void 0;
    var Logger = require_logger();
    var logger = Logger.logger;
    var debugSession_1 = require_debugSession();
    var LoggingDebugSession2 = class extends debugSession_1.DebugSession {
      constructor(obsolete_logFilePath, obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer) {
        super(obsolete_debuggerLinesAndColumnsStartAt1, obsolete_isServer);
        this.obsolete_logFilePath = obsolete_logFilePath;
        this.on("error", (event) => {
          logger.error(event.body);
        });
      }
      start(inStream, outStream) {
        super.start(inStream, outStream);
        logger.init((e) => this.sendEvent(e), this.obsolete_logFilePath, this._isServer);
      }
      /**
       * Overload sendEvent to log
       */
      sendEvent(event) {
        if (!(event instanceof Logger.LogOutputEvent)) {
          let objectToLog = event;
          if (event instanceof debugSession_1.OutputEvent && event.body && event.body.data && event.body.data.doNotLogOutput) {
            delete event.body.data.doNotLogOutput;
            objectToLog = { ...event };
            objectToLog.body = { ...event.body, output: "<output not logged>" };
          }
          logger.verbose(`To client: ${JSON.stringify(objectToLog)}`);
        }
        super.sendEvent(event);
      }
      /**
       * Overload sendRequest to log
       */
      sendRequest(command, args, timeout, cb) {
        logger.verbose(`To client: ${JSON.stringify(command)}(${JSON.stringify(args)}), timeout: ${timeout}`);
        super.sendRequest(command, args, timeout, cb);
      }
      /**
       * Overload sendResponse to log
       */
      sendResponse(response) {
        logger.verbose(`To client: ${JSON.stringify(response)}`);
        super.sendResponse(response);
      }
      dispatchRequest(request) {
        logger.verbose(`From client: ${request.command}(${JSON.stringify(request.arguments)})`);
        super.dispatchRequest(request);
      }
    };
    exports.LoggingDebugSession = LoggingDebugSession2;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/handles.js
var require_handles = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/handles.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Handles = void 0;
    var Handles2 = class {
      constructor(startHandle) {
        this.START_HANDLE = 1e3;
        this._handleMap = /* @__PURE__ */ new Map();
        this._nextHandle = typeof startHandle === "number" ? startHandle : this.START_HANDLE;
      }
      reset() {
        this._nextHandle = this.START_HANDLE;
        this._handleMap = /* @__PURE__ */ new Map();
      }
      create(value) {
        var handle = this._nextHandle++;
        this._handleMap.set(handle, value);
        return handle;
      }
      get(handle, dflt) {
        return this._handleMap.get(handle) || dflt;
      }
    };
    exports.Handles = Handles2;
  }
});

// ../../node_modules/@vscode/debugadapter/lib/main.js
var require_main = __commonJS({
  "../../node_modules/@vscode/debugadapter/lib/main.js"(exports) {
    "use strict";
    init_polyfills();
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Handles = exports.Response = exports.Event = exports.ErrorDestination = exports.CompletionItem = exports.Module = exports.Source = exports.Breakpoint = exports.Variable = exports.Scope = exports.StackFrame = exports.Thread = exports.MemoryEvent = exports.InvalidatedEvent = exports.ProgressEndEvent = exports.ProgressUpdateEvent = exports.ProgressStartEvent = exports.CapabilitiesEvent = exports.LoadedSourceEvent = exports.ModuleEvent = exports.BreakpointEvent = exports.ThreadEvent = exports.OutputEvent = exports.ContinuedEvent = exports.StoppedEvent = exports.ExitedEvent = exports.TerminatedEvent = exports.InitializedEvent = exports.logger = exports.Logger = exports.LoggingDebugSession = exports.DebugSession = void 0;
    var debugSession_1 = require_debugSession();
    Object.defineProperty(exports, "DebugSession", { enumerable: true, get: function() {
      return debugSession_1.DebugSession;
    } });
    Object.defineProperty(exports, "InitializedEvent", { enumerable: true, get: function() {
      return debugSession_1.InitializedEvent;
    } });
    Object.defineProperty(exports, "TerminatedEvent", { enumerable: true, get: function() {
      return debugSession_1.TerminatedEvent;
    } });
    Object.defineProperty(exports, "ExitedEvent", { enumerable: true, get: function() {
      return debugSession_1.ExitedEvent;
    } });
    Object.defineProperty(exports, "StoppedEvent", { enumerable: true, get: function() {
      return debugSession_1.StoppedEvent;
    } });
    Object.defineProperty(exports, "ContinuedEvent", { enumerable: true, get: function() {
      return debugSession_1.ContinuedEvent;
    } });
    Object.defineProperty(exports, "OutputEvent", { enumerable: true, get: function() {
      return debugSession_1.OutputEvent;
    } });
    Object.defineProperty(exports, "ThreadEvent", { enumerable: true, get: function() {
      return debugSession_1.ThreadEvent;
    } });
    Object.defineProperty(exports, "BreakpointEvent", { enumerable: true, get: function() {
      return debugSession_1.BreakpointEvent;
    } });
    Object.defineProperty(exports, "ModuleEvent", { enumerable: true, get: function() {
      return debugSession_1.ModuleEvent;
    } });
    Object.defineProperty(exports, "LoadedSourceEvent", { enumerable: true, get: function() {
      return debugSession_1.LoadedSourceEvent;
    } });
    Object.defineProperty(exports, "CapabilitiesEvent", { enumerable: true, get: function() {
      return debugSession_1.CapabilitiesEvent;
    } });
    Object.defineProperty(exports, "ProgressStartEvent", { enumerable: true, get: function() {
      return debugSession_1.ProgressStartEvent;
    } });
    Object.defineProperty(exports, "ProgressUpdateEvent", { enumerable: true, get: function() {
      return debugSession_1.ProgressUpdateEvent;
    } });
    Object.defineProperty(exports, "ProgressEndEvent", { enumerable: true, get: function() {
      return debugSession_1.ProgressEndEvent;
    } });
    Object.defineProperty(exports, "InvalidatedEvent", { enumerable: true, get: function() {
      return debugSession_1.InvalidatedEvent;
    } });
    Object.defineProperty(exports, "MemoryEvent", { enumerable: true, get: function() {
      return debugSession_1.MemoryEvent;
    } });
    Object.defineProperty(exports, "Thread", { enumerable: true, get: function() {
      return debugSession_1.Thread;
    } });
    Object.defineProperty(exports, "StackFrame", { enumerable: true, get: function() {
      return debugSession_1.StackFrame;
    } });
    Object.defineProperty(exports, "Scope", { enumerable: true, get: function() {
      return debugSession_1.Scope;
    } });
    Object.defineProperty(exports, "Variable", { enumerable: true, get: function() {
      return debugSession_1.Variable;
    } });
    Object.defineProperty(exports, "Breakpoint", { enumerable: true, get: function() {
      return debugSession_1.Breakpoint;
    } });
    Object.defineProperty(exports, "Source", { enumerable: true, get: function() {
      return debugSession_1.Source;
    } });
    Object.defineProperty(exports, "Module", { enumerable: true, get: function() {
      return debugSession_1.Module;
    } });
    Object.defineProperty(exports, "CompletionItem", { enumerable: true, get: function() {
      return debugSession_1.CompletionItem;
    } });
    Object.defineProperty(exports, "ErrorDestination", { enumerable: true, get: function() {
      return debugSession_1.ErrorDestination;
    } });
    var loggingDebugSession_1 = require_loggingDebugSession();
    Object.defineProperty(exports, "LoggingDebugSession", { enumerable: true, get: function() {
      return loggingDebugSession_1.LoggingDebugSession;
    } });
    var Logger = require_logger();
    exports.Logger = Logger;
    var messages_1 = require_messages();
    Object.defineProperty(exports, "Event", { enumerable: true, get: function() {
      return messages_1.Event;
    } });
    Object.defineProperty(exports, "Response", { enumerable: true, get: function() {
      return messages_1.Response;
    } });
    var handles_1 = require_handles();
    Object.defineProperty(exports, "Handles", { enumerable: true, get: function() {
      return handles_1.Handles;
    } });
    var logger = Logger.logger;
    exports.logger = logger;
  }
});

// src/web/extension.ts
var extension_exports = {};
__export(extension_exports, {
  activate: () => activate,
  deactivate: () => deactivate
});
module.exports = __toCommonJS(extension_exports);
init_polyfills();
var vscode7 = __toESM(require("vscode"));

// src/common/activation.ts
init_polyfills();
var vscode5 = __toESM(require("vscode"));

// src/debug/inline-values.ts
init_polyfills();
var vscode = __toESM(require("vscode"));
var identifierPattern = /\b[A-Za-z_][A-Za-z0-9_]*\b/g;
var keywords = /* @__PURE__ */ new Set([
  "and",
  "else",
  "elseif",
  "endfor",
  "endif",
  "endsub",
  "endwhile",
  "for",
  "goto",
  "if",
  "or",
  "step",
  "sub",
  "then",
  "to",
  "while"
]);
function registerSmallBasicInlineValues(context) {
  context.subscriptions.push(vscode.languages.registerInlineValuesProvider(
    { language: "smallbasic" },
    {
      provideInlineValues(document, viewPort, inlineContext) {
        if (vscode.debug.activeDebugSession?.type !== "smallbasic") {
          return [];
        }
        const values = [];
        const lastLine = Math.min(viewPort.end.line, inlineContext.stoppedLocation.end.line);
        for (let lineNumber = viewPort.start.line; lineNumber <= lastLine; lineNumber += 1) {
          const line = document.lineAt(lineNumber);
          identifierPattern.lastIndex = 0;
          for (let match = identifierPattern.exec(line.text); match; match = identifierPattern.exec(line.text)) {
            const identifier = match[0];
            if (keywords.has(identifier.toLowerCase())) {
              continue;
            }
            const previous = match.index > 0 ? line.text[match.index - 1] : "";
            const following = line.text.slice(match.index + identifier.length).trimStart()[0] ?? "";
            if (previous === "." || following === ".") {
              continue;
            }
            const range = new vscode.Range(
              lineNumber,
              match.index,
              lineNumber,
              match.index + identifier.length
            );
            values.push(new vscode.InlineValueVariableLookup(range, identifier, false));
          }
        }
        return values;
      }
    }
  ));
}

// src/language/compilation-cache.ts
init_polyfills();

// ../smallbasic-lang-core/src/index.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/compilation.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/emitting/module-emitter.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/emitting/instructions.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/execution-engine.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/text-window.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/base-value.ts
init_polyfills();
var Constants;
((Constants2) => {
  Constants2.True = "True";
  Constants2.False = "False";
})(Constants || (Constants = {}));
var ValueKind = /* @__PURE__ */ ((ValueKind2) => {
  ValueKind2[ValueKind2["String"] = 0] = "String";
  ValueKind2[ValueKind2["Number"] = 1] = "Number";
  ValueKind2[ValueKind2["Array"] = 2] = "Array";
  return ValueKind2;
})(ValueKind || {});
var BaseValue = class {
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/string-value.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/number-value.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/utils/diagnostics.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/utils/compiler-utils.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/syntax/syntax-nodes.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/syntax/ranges.ts
init_polyfills();
var CompilerPosition = class {
  constructor(line, column) {
    this.line = line;
    this.column = column;
  }
  line;
  column;
  equals(position) {
    return this.line === position.line && this.column === position.column;
  }
  before(position) {
    if (this.line > position.line) return false;
    if (this.line < position.line) return true;
    return this.column < position.column;
  }
  after(position) {
    if (this.line < position.line) return false;
    if (this.line > position.line) return true;
    return this.column > position.column;
  }
};
var CompilerRange = class _CompilerRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }
  start;
  end;
  static fromValues(startLine, startColumn, endLine, endColumn) {
    return new _CompilerRange(
      new CompilerPosition(startLine, startColumn),
      new CompilerPosition(endLine, endColumn)
    );
  }
  static fromPositions(start, end) {
    return new _CompilerRange(start, end);
  }
  static combine(start, end) {
    return new _CompilerRange(start.start, end.end);
  }
  // Spans ranges regardless of their document order: the result covers the
  // earliest start through the latest end. Unlike `combine`, this is safe for
  // child collections that may appear in any order (e.g. main statements
  // located after sub modules).
  static spanning(ranges) {
    if (ranges.length === 0) {
      return _CompilerRange.fromValues(0, 0, 0, 0);
    }
    let start = ranges[0].start;
    let end = ranges[0].end;
    for (let i = 1; i < ranges.length; i++) {
      if (ranges[i].start.before(start)) {
        start = ranges[i].start;
      }
      if (end.before(ranges[i].end)) {
        end = ranges[i].end;
      }
    }
    return new _CompilerRange(start, end);
  }
  containsPosition(position) {
    return (this.start.before(position) || this.start.equals(position)) && (position.before(this.end) || position.equals(this.end));
  }
  containsRange(range) {
    return this.containsPosition(range.start) && this.containsPosition(range.end);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/syntax-nodes.ts
var SyntaxKind = /* @__PURE__ */ ((SyntaxKind3) => {
  SyntaxKind3[SyntaxKind3["ParseTree"] = 0] = "ParseTree";
  SyntaxKind3[SyntaxKind3["SubModuleDeclaration"] = 1] = "SubModuleDeclaration";
  SyntaxKind3[SyntaxKind3["StatementBlock"] = 2] = "StatementBlock";
  SyntaxKind3[SyntaxKind3["IfHeader"] = 3] = "IfHeader";
  SyntaxKind3[SyntaxKind3["IfStatement"] = 4] = "IfStatement";
  SyntaxKind3[SyntaxKind3["WhileStatement"] = 5] = "WhileStatement";
  SyntaxKind3[SyntaxKind3["ForStatement"] = 6] = "ForStatement";
  SyntaxKind3[SyntaxKind3["IfCommand"] = 7] = "IfCommand";
  SyntaxKind3[SyntaxKind3["ElseCommand"] = 8] = "ElseCommand";
  SyntaxKind3[SyntaxKind3["ElseIfCommand"] = 9] = "ElseIfCommand";
  SyntaxKind3[SyntaxKind3["EndIfCommand"] = 10] = "EndIfCommand";
  SyntaxKind3[SyntaxKind3["ForStepClause"] = 11] = "ForStepClause";
  SyntaxKind3[SyntaxKind3["ForCommand"] = 12] = "ForCommand";
  SyntaxKind3[SyntaxKind3["EndForCommand"] = 13] = "EndForCommand";
  SyntaxKind3[SyntaxKind3["WhileCommand"] = 14] = "WhileCommand";
  SyntaxKind3[SyntaxKind3["EndWhileCommand"] = 15] = "EndWhileCommand";
  SyntaxKind3[SyntaxKind3["LabelCommand"] = 16] = "LabelCommand";
  SyntaxKind3[SyntaxKind3["GoToCommand"] = 17] = "GoToCommand";
  SyntaxKind3[SyntaxKind3["SubCommand"] = 18] = "SubCommand";
  SyntaxKind3[SyntaxKind3["EndSubCommand"] = 19] = "EndSubCommand";
  SyntaxKind3[SyntaxKind3["ExpressionCommand"] = 20] = "ExpressionCommand";
  SyntaxKind3[SyntaxKind3["CommentCommand"] = 21] = "CommentCommand";
  SyntaxKind3[SyntaxKind3["UnaryOperatorExpression"] = 22] = "UnaryOperatorExpression";
  SyntaxKind3[SyntaxKind3["BinaryOperatorExpression"] = 23] = "BinaryOperatorExpression";
  SyntaxKind3[SyntaxKind3["ObjectAccessExpression"] = 24] = "ObjectAccessExpression";
  SyntaxKind3[SyntaxKind3["ArrayAccessExpression"] = 25] = "ArrayAccessExpression";
  SyntaxKind3[SyntaxKind3["Argument"] = 26] = "Argument";
  SyntaxKind3[SyntaxKind3["InvocationExpression"] = 27] = "InvocationExpression";
  SyntaxKind3[SyntaxKind3["ParenthesisExpression"] = 28] = "ParenthesisExpression";
  SyntaxKind3[SyntaxKind3["IdentifierExpression"] = 29] = "IdentifierExpression";
  SyntaxKind3[SyntaxKind3["NumberLiteralExpression"] = 30] = "NumberLiteralExpression";
  SyntaxKind3[SyntaxKind3["StringLiteralExpression"] = 31] = "StringLiteralExpression";
  SyntaxKind3[SyntaxKind3["Token"] = 32] = "Token";
  return SyntaxKind3;
})(SyntaxKind || {});
var BaseSyntaxNode = class {
  constructor(kind, range) {
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
  _parentOpt;
  get parentOpt() {
    return this._parentOpt;
  }
  set parentOpt(parentOpt) {
    this._parentOpt = parentOpt;
  }
};
var ParseTreeSyntax = class extends BaseSyntaxNode {
  constructor(mainModule, subModules) {
    super(0 /* ParseTree */, CompilerRange.spanning(
      [mainModule.range, ...subModules.map((subModule) => subModule.range)]
    ));
    this.mainModule = mainModule;
    this.subModules = subModules;
  }
  mainModule;
  subModules;
  children() {
    return [this.mainModule, ...this.subModules];
  }
};
var SubModuleDeclarationSyntax = class extends BaseSyntaxNode {
  constructor(subCommand, statementsList, endSubCommand) {
    super(1 /* SubModuleDeclaration */, CompilerRange.combine(subCommand.range, endSubCommand.range));
    this.subCommand = subCommand;
    this.statementsList = statementsList;
    this.endSubCommand = endSubCommand;
  }
  subCommand;
  statementsList;
  endSubCommand;
  children() {
    return [this.subCommand, this.statementsList, this.endSubCommand];
  }
};
var BaseStatementSyntax = class extends BaseSyntaxNode {
  constructor(kind, range) {
    super(kind, range);
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
};
var StatementBlockSyntax = class extends BaseSyntaxNode {
  constructor(statements) {
    super(2 /* StatementBlock */, statements.length ? CompilerRange.combine(statements[0].range, statements[statements.length - 1].range) : CompilerRange.fromValues(0, 0, 0, 0));
    this.statements = statements;
  }
  statements;
  children() {
    return this.statements;
  }
};
var IfHeaderSyntax = class extends BaseSyntaxNode {
  constructor(headerCommand, statementsList) {
    super(3 /* IfHeader */, CompilerRange.combine(headerCommand.range, statementsList.range));
    this.headerCommand = headerCommand;
    this.statementsList = statementsList;
  }
  headerCommand;
  statementsList;
  children() {
    return [this.headerCommand, this.statementsList];
  }
};
var IfStatementSyntax = class extends BaseStatementSyntax {
  constructor(ifPart, elseIfParts, elsePartOpt, endIfCommand) {
    super(4 /* IfStatement */, CompilerRange.combine(ifPart.range, endIfCommand.range));
    this.ifPart = ifPart;
    this.elseIfParts = elseIfParts;
    this.elsePartOpt = elsePartOpt;
    this.endIfCommand = endIfCommand;
  }
  ifPart;
  elseIfParts;
  elsePartOpt;
  endIfCommand;
  children() {
    return this.elsePartOpt ? [this.ifPart, ...this.elseIfParts, this.elsePartOpt, this.endIfCommand] : [this.ifPart, ...this.elseIfParts, this.endIfCommand];
  }
};
var WhileStatementSyntax = class extends BaseStatementSyntax {
  constructor(whileCommand, statementsList, endWhileCommand) {
    super(5 /* WhileStatement */, CompilerRange.combine(whileCommand.range, endWhileCommand.range));
    this.whileCommand = whileCommand;
    this.statementsList = statementsList;
    this.endWhileCommand = endWhileCommand;
  }
  whileCommand;
  statementsList;
  endWhileCommand;
  children() {
    return [this.whileCommand, this.statementsList, this.endWhileCommand];
  }
};
var ForStatementSyntax = class extends BaseStatementSyntax {
  constructor(forCommand, statementsList, endForCommand) {
    super(6 /* ForStatement */, CompilerRange.combine(forCommand.range, endForCommand.range));
    this.forCommand = forCommand;
    this.statementsList = statementsList;
    this.endForCommand = endForCommand;
  }
  forCommand;
  statementsList;
  endForCommand;
  children() {
    return [this.forCommand, this.statementsList, this.endForCommand];
  }
};
var BaseCommandSyntax = class extends BaseSyntaxNode {
  constructor(kind, range) {
    super(kind, range);
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
};
var IfCommandSyntax = class extends BaseCommandSyntax {
  constructor(ifToken, expression, thenToken) {
    super(7 /* IfCommand */, CompilerRange.combine(ifToken.range, thenToken.range));
    this.ifToken = ifToken;
    this.expression = expression;
    this.thenToken = thenToken;
  }
  ifToken;
  expression;
  thenToken;
  children() {
    return [this.ifToken, this.expression, this.thenToken];
  }
};
var ElseCommandSyntax = class extends BaseCommandSyntax {
  constructor(elseToken) {
    super(8 /* ElseCommand */, elseToken.range);
    this.elseToken = elseToken;
  }
  elseToken;
  children() {
    return [this.elseToken];
  }
};
var ElseIfCommandSyntax = class extends BaseCommandSyntax {
  constructor(elseIfToken, expression, thenToken) {
    super(9 /* ElseIfCommand */, CompilerRange.combine(elseIfToken.range, thenToken.range));
    this.elseIfToken = elseIfToken;
    this.expression = expression;
    this.thenToken = thenToken;
  }
  elseIfToken;
  expression;
  thenToken;
  children() {
    return [this.elseIfToken, this.expression, this.thenToken];
  }
};
var EndIfCommandSyntax = class extends BaseCommandSyntax {
  constructor(endIfToken) {
    super(10 /* EndIfCommand */, endIfToken.range);
    this.endIfToken = endIfToken;
  }
  endIfToken;
  children() {
    return [this.endIfToken];
  }
};
var ForStepClauseSyntax = class extends BaseCommandSyntax {
  constructor(stepToken, expression) {
    super(11 /* ForStepClause */, CompilerRange.combine(stepToken.range, expression.range));
    this.stepToken = stepToken;
    this.expression = expression;
  }
  stepToken;
  expression;
  children() {
    return [this.stepToken, this.expression];
  }
};
var ForCommandSyntax = class extends BaseCommandSyntax {
  constructor(forToken, identifierToken, equalToken, fromExpression, toToken, toExpression, stepClauseOpt) {
    super(12 /* ForCommand */, CompilerRange.combine(
      forToken.range,
      stepClauseOpt ? stepClauseOpt.expression.range : toExpression.range
    ));
    this.forToken = forToken;
    this.identifierToken = identifierToken;
    this.equalToken = equalToken;
    this.fromExpression = fromExpression;
    this.toToken = toToken;
    this.toExpression = toExpression;
    this.stepClauseOpt = stepClauseOpt;
  }
  forToken;
  identifierToken;
  equalToken;
  fromExpression;
  toToken;
  toExpression;
  stepClauseOpt;
  children() {
    const children = [this.forToken, this.identifierToken, this.equalToken, this.fromExpression, this.toToken, this.toExpression];
    if (this.stepClauseOpt) {
      children.push(this.stepClauseOpt);
    }
    return children;
  }
};
var EndForCommandSyntax = class extends BaseCommandSyntax {
  constructor(endForToken) {
    super(13 /* EndForCommand */, endForToken.range);
    this.endForToken = endForToken;
  }
  endForToken;
  children() {
    return [this.endForToken];
  }
};
var WhileCommandSyntax = class extends BaseCommandSyntax {
  constructor(whileToken, expression) {
    super(14 /* WhileCommand */, CompilerRange.combine(whileToken.range, expression.range));
    this.whileToken = whileToken;
    this.expression = expression;
  }
  whileToken;
  expression;
  children() {
    return [this.whileToken, this.expression];
  }
};
var EndWhileCommandSyntax = class extends BaseCommandSyntax {
  constructor(endWhileToken) {
    super(15 /* EndWhileCommand */, endWhileToken.range);
    this.endWhileToken = endWhileToken;
  }
  endWhileToken;
  children() {
    return [this.endWhileToken];
  }
};
var LabelCommandSyntax = class extends BaseCommandSyntax {
  constructor(labelToken, colonToken) {
    super(16 /* LabelCommand */, CompilerRange.combine(labelToken.range, colonToken.range));
    this.labelToken = labelToken;
    this.colonToken = colonToken;
  }
  labelToken;
  colonToken;
  children() {
    return [this.labelToken, this.colonToken];
  }
};
var GoToCommandSyntax = class extends BaseCommandSyntax {
  constructor(goToToken, labelToken) {
    super(17 /* GoToCommand */, CompilerRange.combine(goToToken.range, labelToken.range));
    this.goToToken = goToToken;
    this.labelToken = labelToken;
  }
  goToToken;
  labelToken;
  children() {
    return [this.goToToken, this.labelToken];
  }
};
var SubCommandSyntax = class extends BaseCommandSyntax {
  constructor(subToken, nameToken) {
    super(18 /* SubCommand */, CompilerRange.combine(subToken.range, nameToken.range));
    this.subToken = subToken;
    this.nameToken = nameToken;
  }
  subToken;
  nameToken;
  children() {
    return [this.subToken, this.nameToken];
  }
};
var EndSubCommandSyntax = class extends BaseCommandSyntax {
  constructor(endSubToken) {
    super(19 /* EndSubCommand */, endSubToken.range);
    this.endSubToken = endSubToken;
  }
  endSubToken;
  children() {
    return [this.endSubToken];
  }
};
var ExpressionCommandSyntax = class extends BaseCommandSyntax {
  constructor(expression) {
    super(20 /* ExpressionCommand */, expression.range);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};
var CommentCommandSyntax = class extends BaseCommandSyntax {
  constructor(commentToken) {
    super(21 /* CommentCommand */, commentToken.range);
    this.commentToken = commentToken;
  }
  commentToken;
  children() {
    return [this.commentToken];
  }
};
var MissingCommandSyntax = class extends BaseCommandSyntax {
  constructor(expectedKind, expectedRange) {
    super(expectedKind, expectedRange);
  }
  children() {
    return [];
  }
};
var BaseExpressionSyntax = class extends BaseSyntaxNode {
  constructor(kind, range) {
    super(kind, range);
    this.kind = kind;
    this.range = range;
  }
  kind;
  range;
};
var UnaryOperatorExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(operatorToken, expression) {
    super(22 /* UnaryOperatorExpression */, CompilerRange.combine(operatorToken.range, expression.range));
    this.operatorToken = operatorToken;
    this.expression = expression;
  }
  operatorToken;
  expression;
  children() {
    return [this.operatorToken, this.expression];
  }
};
var BinaryOperatorExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(leftExpression, operatorToken, rightExpression) {
    super(23 /* BinaryOperatorExpression */, CompilerRange.combine(leftExpression.range, rightExpression.range));
    this.leftExpression = leftExpression;
    this.operatorToken = operatorToken;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  operatorToken;
  rightExpression;
  children() {
    return [this.leftExpression, this.operatorToken, this.rightExpression];
  }
};
var ObjectAccessExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(baseExpression, dotToken, identifierToken) {
    super(24 /* ObjectAccessExpression */, CompilerRange.combine(baseExpression.range, identifierToken.range));
    this.baseExpression = baseExpression;
    this.dotToken = dotToken;
    this.identifierToken = identifierToken;
  }
  baseExpression;
  dotToken;
  identifierToken;
  children() {
    return [this.baseExpression, this.dotToken, this.identifierToken];
  }
};
var ArrayAccessExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(baseExpression, leftBracketToken, indexExpression, rightBracketToken) {
    super(25 /* ArrayAccessExpression */, CompilerRange.combine(baseExpression.range, rightBracketToken.range));
    this.baseExpression = baseExpression;
    this.leftBracketToken = leftBracketToken;
    this.indexExpression = indexExpression;
    this.rightBracketToken = rightBracketToken;
  }
  baseExpression;
  leftBracketToken;
  indexExpression;
  rightBracketToken;
  children() {
    return [this.baseExpression, this.leftBracketToken, this.indexExpression, this.rightBracketToken];
  }
};
var ArgumentSyntax = class extends BaseSyntaxNode {
  constructor(expression, commaOpt) {
    super(26 /* Argument */, commaOpt ? CompilerRange.combine(expression.range, commaOpt.range) : expression.range);
    this.expression = expression;
    this.commaOpt = commaOpt;
  }
  expression;
  commaOpt;
  children() {
    return this.commaOpt ? [this.expression, this.commaOpt] : [this.expression];
  }
};
var InvocationExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(baseExpression, leftParenToken, argumentsList, rightParenToken) {
    super(27 /* InvocationExpression */, CompilerRange.combine(baseExpression.range, rightParenToken.range));
    this.baseExpression = baseExpression;
    this.leftParenToken = leftParenToken;
    this.argumentsList = argumentsList;
    this.rightParenToken = rightParenToken;
  }
  baseExpression;
  leftParenToken;
  argumentsList;
  rightParenToken;
  children() {
    return [this.baseExpression, this.leftParenToken, ...this.argumentsList, this.rightParenToken];
  }
};
var ParenthesisExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(leftParenToken, expression, rightParenToken) {
    super(28 /* ParenthesisExpression */, CompilerRange.combine(leftParenToken.range, rightParenToken.range));
    this.leftParenToken = leftParenToken;
    this.expression = expression;
    this.rightParenToken = rightParenToken;
  }
  leftParenToken;
  expression;
  rightParenToken;
  children() {
    return [this.leftParenToken, this.expression, this.rightParenToken];
  }
};
var IdentifierExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(identifierToken) {
    super(29 /* IdentifierExpression */, identifierToken.range);
    this.identifierToken = identifierToken;
  }
  identifierToken;
  children() {
    return [this.identifierToken];
  }
};
var StringLiteralExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(stringToken) {
    super(31 /* StringLiteralExpression */, stringToken.range);
    this.stringToken = stringToken;
  }
  stringToken;
  children() {
    return [this.stringToken];
  }
};
var NumberLiteralExpressionSyntax = class extends BaseExpressionSyntax {
  constructor(numberToken) {
    super(30 /* NumberLiteralExpression */, numberToken.range);
    this.numberToken = numberToken;
  }
  numberToken;
  children() {
    return [this.numberToken];
  }
};
var TokenSyntax = class extends BaseSyntaxNode {
  constructor(token) {
    super(32 /* Token */, token.range);
    this.token = token;
  }
  token;
  children() {
    return [];
  }
};
var SyntaxNodeVisitor = class {
  visit(node) {
    switch (node.kind) {
      case 0 /* ParseTree */:
        this.visitParseTree(node);
        break;
      case 1 /* SubModuleDeclaration */:
        this.visitSubModuleDeclaration(node);
        break;
      case 2 /* StatementBlock */:
        this.visitStatementBlock(node);
        break;
      case 3 /* IfHeader */:
        this.visitIfHeader(node);
        break;
      case 4 /* IfStatement */:
        this.visitIfStatement(node);
        break;
      case 5 /* WhileStatement */:
        this.visitWhileStatement(node);
        break;
      case 6 /* ForStatement */:
        this.visitForStatement(node);
        break;
      case 7 /* IfCommand */:
        this.visitIfCommand(node);
        break;
      case 8 /* ElseCommand */:
        this.visitElseCommand(node);
        break;
      case 9 /* ElseIfCommand */:
        this.visitElseIfCommand(node);
        break;
      case 10 /* EndIfCommand */:
        this.visitEndIfCommand(node);
        break;
      case 11 /* ForStepClause */:
        this.visitForStepClause(node);
        break;
      case 12 /* ForCommand */:
        this.visitForCommand(node);
        break;
      case 13 /* EndForCommand */:
        this.visitEndForCommand(node);
        break;
      case 14 /* WhileCommand */:
        this.visitWhileCommand(node);
        break;
      case 15 /* EndWhileCommand */:
        this.visitEndWhileCommand(node);
        break;
      case 16 /* LabelCommand */:
        this.visitLabelCommand(node);
        break;
      case 17 /* GoToCommand */:
        this.visitGoToCommand(node);
        break;
      case 18 /* SubCommand */:
        this.visitSubCommand(node);
        break;
      case 19 /* EndSubCommand */:
        this.visitEndSubCommand(node);
        break;
      case 20 /* ExpressionCommand */:
        this.visitExpressionCommand(node);
        break;
      case 21 /* CommentCommand */:
        this.visitCommentCommand(node);
        break;
      case 22 /* UnaryOperatorExpression */:
        this.visitUnaryOperatorExpression(node);
        break;
      case 23 /* BinaryOperatorExpression */:
        this.visitBinaryOperatorExpression(node);
        break;
      case 24 /* ObjectAccessExpression */:
        this.visitObjectAccessExpression(node);
        break;
      case 25 /* ArrayAccessExpression */:
        this.visitArrayAccessExpression(node);
        break;
      case 26 /* Argument */:
        this.visitArgument(node);
        break;
      case 27 /* InvocationExpression */:
        this.visitInvocationExpression(node);
        break;
      case 28 /* ParenthesisExpression */:
        this.visitParenthesisExpression(node);
        break;
      case 29 /* IdentifierExpression */:
        this.visitIdentifierExpression(node);
        break;
      case 30 /* NumberLiteralExpression */:
        this.visitNumberLiteralExpression(node);
        break;
      case 31 /* StringLiteralExpression */:
        this.visitStringLiteralExpression(node);
        break;
      case 32 /* Token */:
        this.visitToken(node);
        break;
      default:
        throw new Error(`Unexpected syntax kind: '${SyntaxKind[node.kind]}'`);
    }
  }
  visitParseTree(node) {
    this.defaultVisit(node);
  }
  visitSubModuleDeclaration(node) {
    this.defaultVisit(node);
  }
  visitStatementBlock(node) {
    this.defaultVisit(node);
  }
  visitIfHeader(node) {
    this.defaultVisit(node);
  }
  visitIfStatement(node) {
    this.defaultVisit(node);
  }
  visitWhileStatement(node) {
    this.defaultVisit(node);
  }
  visitForStatement(node) {
    this.defaultVisit(node);
  }
  visitIfCommand(node) {
    this.defaultVisit(node);
  }
  visitElseCommand(node) {
    this.defaultVisit(node);
  }
  visitElseIfCommand(node) {
    this.defaultVisit(node);
  }
  visitEndIfCommand(node) {
    this.defaultVisit(node);
  }
  visitForStepClause(node) {
    this.defaultVisit(node);
  }
  visitForCommand(node) {
    this.defaultVisit(node);
  }
  visitEndForCommand(node) {
    this.defaultVisit(node);
  }
  visitWhileCommand(node) {
    this.defaultVisit(node);
  }
  visitEndWhileCommand(node) {
    this.defaultVisit(node);
  }
  visitLabelCommand(node) {
    this.defaultVisit(node);
  }
  visitGoToCommand(node) {
    this.defaultVisit(node);
  }
  visitSubCommand(node) {
    this.defaultVisit(node);
  }
  visitEndSubCommand(node) {
    this.defaultVisit(node);
  }
  visitExpressionCommand(node) {
    this.defaultVisit(node);
  }
  visitCommentCommand(node) {
    this.defaultVisit(node);
  }
  visitUnaryOperatorExpression(node) {
    this.defaultVisit(node);
  }
  visitBinaryOperatorExpression(node) {
    this.defaultVisit(node);
  }
  visitObjectAccessExpression(node) {
    this.defaultVisit(node);
  }
  visitArrayAccessExpression(node) {
    this.defaultVisit(node);
  }
  visitArgument(node) {
    this.defaultVisit(node);
  }
  visitInvocationExpression(node) {
    this.defaultVisit(node);
  }
  visitParenthesisExpression(node) {
    this.defaultVisit(node);
  }
  visitIdentifierExpression(node) {
    this.defaultVisit(node);
  }
  visitNumberLiteralExpression(node) {
    this.defaultVisit(node);
  }
  visitStringLiteralExpression(node) {
    this.defaultVisit(node);
  }
  visitToken(node) {
    this.defaultVisit(node);
  }
  defaultVisit(node) {
    node.children().forEach((child) => this.visit(child));
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/tokens.ts
init_polyfills();
var TokenKind = /* @__PURE__ */ ((TokenKind2) => {
  TokenKind2[TokenKind2["UnrecognizedToken"] = 0] = "UnrecognizedToken";
  TokenKind2[TokenKind2["IfKeyword"] = 1] = "IfKeyword";
  TokenKind2[TokenKind2["ThenKeyword"] = 2] = "ThenKeyword";
  TokenKind2[TokenKind2["ElseKeyword"] = 3] = "ElseKeyword";
  TokenKind2[TokenKind2["ElseIfKeyword"] = 4] = "ElseIfKeyword";
  TokenKind2[TokenKind2["EndIfKeyword"] = 5] = "EndIfKeyword";
  TokenKind2[TokenKind2["ForKeyword"] = 6] = "ForKeyword";
  TokenKind2[TokenKind2["ToKeyword"] = 7] = "ToKeyword";
  TokenKind2[TokenKind2["StepKeyword"] = 8] = "StepKeyword";
  TokenKind2[TokenKind2["EndForKeyword"] = 9] = "EndForKeyword";
  TokenKind2[TokenKind2["GoToKeyword"] = 10] = "GoToKeyword";
  TokenKind2[TokenKind2["WhileKeyword"] = 11] = "WhileKeyword";
  TokenKind2[TokenKind2["EndWhileKeyword"] = 12] = "EndWhileKeyword";
  TokenKind2[TokenKind2["SubKeyword"] = 13] = "SubKeyword";
  TokenKind2[TokenKind2["EndSubKeyword"] = 14] = "EndSubKeyword";
  TokenKind2[TokenKind2["Dot"] = 15] = "Dot";
  TokenKind2[TokenKind2["RightParen"] = 16] = "RightParen";
  TokenKind2[TokenKind2["LeftParen"] = 17] = "LeftParen";
  TokenKind2[TokenKind2["RightSquareBracket"] = 18] = "RightSquareBracket";
  TokenKind2[TokenKind2["LeftSquareBracket"] = 19] = "LeftSquareBracket";
  TokenKind2[TokenKind2["Comma"] = 20] = "Comma";
  TokenKind2[TokenKind2["Equal"] = 21] = "Equal";
  TokenKind2[TokenKind2["NotEqual"] = 22] = "NotEqual";
  TokenKind2[TokenKind2["Plus"] = 23] = "Plus";
  TokenKind2[TokenKind2["Minus"] = 24] = "Minus";
  TokenKind2[TokenKind2["Multiply"] = 25] = "Multiply";
  TokenKind2[TokenKind2["Divide"] = 26] = "Divide";
  TokenKind2[TokenKind2["Colon"] = 27] = "Colon";
  TokenKind2[TokenKind2["LessThan"] = 28] = "LessThan";
  TokenKind2[TokenKind2["GreaterThan"] = 29] = "GreaterThan";
  TokenKind2[TokenKind2["LessThanOrEqual"] = 30] = "LessThanOrEqual";
  TokenKind2[TokenKind2["GreaterThanOrEqual"] = 31] = "GreaterThanOrEqual";
  TokenKind2[TokenKind2["Or"] = 32] = "Or";
  TokenKind2[TokenKind2["And"] = 33] = "And";
  TokenKind2[TokenKind2["Identifier"] = 34] = "Identifier";
  TokenKind2[TokenKind2["NumberLiteral"] = 35] = "NumberLiteral";
  TokenKind2[TokenKind2["StringLiteral"] = 36] = "StringLiteral";
  TokenKind2[TokenKind2["Comment"] = 37] = "Comment";
  return TokenKind2;
})(TokenKind || {});
var Token = class {
  constructor(text, kind, range) {
    this.text = text;
    this.kind = kind;
    this.range = range;
  }
  text;
  kind;
  range;
};

// ../../vendor/SmallBasicOnline/src/strings/compiler.ts
init_polyfills();
var CompilerResources;
((CompilerResources2) => {
  CompilerResources2.SyntaxNodes_Identifier = "identifier";
  CompilerResources2.SyntaxNodes_StringLiteral = "string";
  CompilerResources2.SyntaxNodes_NumberLiteral = "number";
  CompilerResources2.SyntaxNodes_Comment = "comment";
  CompilerResources2.SyntaxNodes_Label = "label";
  CompilerResources2.SyntaxNodes_Expression = "expression";
  CompilerResources2.ProgramKind_TextWindow = "Text Window";
  CompilerResources2.ProgramKind_Turtle = "Turtle";
  function get(key) {
    return CompilerResources2[key];
  }
  CompilerResources2.get = get;
})(CompilerResources || (CompilerResources = {}));

// ../../vendor/SmallBasicOnline/src/compiler/utils/compiler-utils.ts
var CompilerUtils;
((CompilerUtils2) => {
  function formatString(template, args) {
    return template.replace(/{[0-9]+}/g, (match) => args[parseInt(match.replace(/^{/, "").replace(/}$/, ""))]);
  }
  CompilerUtils2.formatString = formatString;
  function stringStartsWith(value, prefix) {
    if (!prefix || !prefix.length) {
      return true;
    }
    value = value.toLowerCase();
    prefix = prefix.toLowerCase();
    return value.length >= prefix.length && value.substr(0, prefix.length) === prefix;
  }
  CompilerUtils2.stringStartsWith = stringStartsWith;
  function findKeyIgnoreCase(parent, name) {
    if (Object.prototype.hasOwnProperty.call(parent, name)) {
      return name;
    }
    const lower = name.toLowerCase();
    for (const key of Object.keys(parent)) {
      if (key.toLowerCase() === lower) {
        return key;
      }
    }
    return void 0;
  }
  CompilerUtils2.findKeyIgnoreCase = findKeyIgnoreCase;
  function lookupIgnoreCase(parent, name) {
    const key = findKeyIgnoreCase(parent, name);
    return key === void 0 ? void 0 : parent[key];
  }
  CompilerUtils2.lookupIgnoreCase = lookupIgnoreCase;
  function values(parent) {
    return Object.keys(parent).map((key) => parent[key]);
  }
  CompilerUtils2.values = values;
  function commandToDisplayString(kind) {
    switch (kind) {
      case 7 /* IfCommand */:
        return tokenToDisplayString(1 /* IfKeyword */);
      case 8 /* ElseCommand */:
        return tokenToDisplayString(3 /* ElseKeyword */);
      case 9 /* ElseIfCommand */:
        return tokenToDisplayString(4 /* ElseIfKeyword */);
      case 10 /* EndIfCommand */:
        return tokenToDisplayString(5 /* EndIfKeyword */);
      case 12 /* ForCommand */:
        return tokenToDisplayString(6 /* ForKeyword */);
      case 13 /* EndForCommand */:
        return tokenToDisplayString(9 /* EndForKeyword */);
      case 14 /* WhileCommand */:
        return tokenToDisplayString(11 /* WhileKeyword */);
      case 15 /* EndWhileCommand */:
        return tokenToDisplayString(12 /* EndWhileKeyword */);
      case 16 /* LabelCommand */:
        return CompilerResources.SyntaxNodes_Label;
      case 17 /* GoToCommand */:
        return tokenToDisplayString(10 /* GoToKeyword */);
      case 18 /* SubCommand */:
        return tokenToDisplayString(13 /* SubKeyword */);
      case 19 /* EndSubCommand */:
        return tokenToDisplayString(14 /* EndSubKeyword */);
      case 20 /* ExpressionCommand */:
        return CompilerResources.SyntaxNodes_Expression;
      default:
        throw new Error(`Unexpected syntax kind: ${SyntaxKind[kind]}`);
    }
  }
  CompilerUtils2.commandToDisplayString = commandToDisplayString;
  function tokenToDisplayString(kind) {
    switch (kind) {
      case 1 /* IfKeyword */:
        return "If";
      case 2 /* ThenKeyword */:
        return "Then";
      case 3 /* ElseKeyword */:
        return "Else";
      case 4 /* ElseIfKeyword */:
        return "ElseIf";
      case 5 /* EndIfKeyword */:
        return "EndIf";
      case 6 /* ForKeyword */:
        return "For";
      case 7 /* ToKeyword */:
        return "To";
      case 8 /* StepKeyword */:
        return "Step";
      case 9 /* EndForKeyword */:
        return "EndFor";
      case 10 /* GoToKeyword */:
        return "GoTo";
      case 11 /* WhileKeyword */:
        return "While";
      case 12 /* EndWhileKeyword */:
        return "EndWhile";
      case 13 /* SubKeyword */:
        return "Sub";
      case 14 /* EndSubKeyword */:
        return "EndSub";
      case 15 /* Dot */:
        return ".";
      case 16 /* RightParen */:
        return ")";
      case 17 /* LeftParen */:
        return "(";
      case 18 /* RightSquareBracket */:
        return "]";
      case 19 /* LeftSquareBracket */:
        return "[";
      case 20 /* Comma */:
        return ",";
      case 21 /* Equal */:
        return "=";
      case 22 /* NotEqual */:
        return "<>";
      case 23 /* Plus */:
        return "+";
      case 24 /* Minus */:
        return "-";
      case 25 /* Multiply */:
        return "*";
      case 26 /* Divide */:
        return "/";
      case 27 /* Colon */:
        return ":";
      case 28 /* LessThan */:
        return "<";
      case 29 /* GreaterThan */:
        return ">";
      case 30 /* LessThanOrEqual */:
        return "<=";
      case 31 /* GreaterThanOrEqual */:
        return ">=";
      case 32 /* Or */:
        return "Or";
      case 33 /* And */:
        return "And";
      case 34 /* Identifier */:
        return CompilerResources.SyntaxNodes_Identifier;
      case 35 /* NumberLiteral */:
        return CompilerResources.SyntaxNodes_NumberLiteral;
      case 36 /* StringLiteral */:
        return CompilerResources.SyntaxNodes_StringLiteral;
      case 37 /* Comment */:
        return CompilerResources.SyntaxNodes_Comment;
      default:
        throw new Error(`Unrecognized token kind: ${TokenKind[kind]}`);
    }
  }
  CompilerUtils2.tokenToDisplayString = tokenToDisplayString;
})(CompilerUtils || (CompilerUtils = {}));

// ../../vendor/SmallBasicOnline/src/strings/diagnostics.ts
init_polyfills();
var DiagnosticsResources;
((DiagnosticsResources2) => {
  DiagnosticsResources2.UnrecognizedCharacter = "I don't understand this character '{0}'.";
  DiagnosticsResources2.UnterminatedStringLiteral = "This string is missing its right double quotes.";
  DiagnosticsResources2.UnrecognizedCommand = "'{0}' is not a valid command.";
  DiagnosticsResources2.UnexpectedToken_ExpectingExpression = "Unexpected '{0}' here. I was expecting an expression instead.";
  DiagnosticsResources2.UnexpectedToken_ExpectingToken = "Unexpected '{0}' here. I was expecting a token of type '{1}' instead.";
  DiagnosticsResources2.UnexpectedToken_ExpectingEOL = "Unexpected '{0}' here. I was expecting a new line after the previous command.";
  DiagnosticsResources2.UnexpectedEOL_ExpectingExpression = "Unexpected end of line here. I was expecting an expression instead.";
  DiagnosticsResources2.UnexpectedEOL_ExpectingToken = "Unexpected end of line here. I was expecting a token of type '{0}' instead.";
  DiagnosticsResources2.UnexpectedCommand_ExpectingCommand = "Unexpected command of type '{0}'. I was expecting a command of type '{1}'.";
  DiagnosticsResources2.UnexpectedEOF_ExpectingCommand = "Unexpected end of file. I was expecting a command of type '{0}'.";
  DiagnosticsResources2.CannotDefineASubInsideAnotherSub = "You cannot define a sub-module inside another sub-module.";
  DiagnosticsResources2.CannotHaveCommandWithoutPreviousCommand = "You cannot write a command of type '{0}' without an earlier command of type '{1}'.";
  DiagnosticsResources2.TwoSubModulesWithTheSameName = "Another sub-module with the same name '{0}' is already defined.";
  DiagnosticsResources2.LabelDoesNotExist = "No label with the name '{0}' exists in the same module.";
  DiagnosticsResources2.UnassignedExpressionStatement = "This value is not assigned to anything. Did you mean to assign it to a variable?";
  DiagnosticsResources2.InvalidExpressionStatement = "This expression is not a valid statement.";
  DiagnosticsResources2.UnexpectedVoid_ExpectingValue = "This expression must return a value to be used here.";
  DiagnosticsResources2.UnsupportedArrayBaseExpression = "This expression is not a valid array.";
  DiagnosticsResources2.UnsupportedCallBaseExpression = "This expression is not a valid submodule or method to be called.";
  DiagnosticsResources2.UnexpectedArgumentsCount = "I was expecting {0} arguments, but found {1} instead.";
  DiagnosticsResources2.PropertyHasNoSetter = "This property cannot be set. You can only get its value.";
  DiagnosticsResources2.AssigningNonSubModuleToEvent = "You can only assign submodules to events.";
  DiagnosticsResources2.UnsupportedDotBaseExpression = "You can only use dot access with a library. Did you mean to use an existing library instead?";
  DiagnosticsResources2.LibraryMemberNotFound = "The library '{0}' has no member named '{1}'.";
  DiagnosticsResources2.ValueIsNotANumber = "The value '{0}' is not a valid number.";
  DiagnosticsResources2.ValueIsNotAssignable = "You cannot assign to this expression. Did you mean to use a variable instead?";
  DiagnosticsResources2.CannotUseAnArrayAsAnIndexToAnotherArray = "You cannot use an array as an index to access another array. Did you mean to use a string or a number instead?";
  DiagnosticsResources2.CannotUseOperatorWithAnArray = "You cannot use the operator '{0}' with an array value";
  DiagnosticsResources2.CannotUseOperatorWithAString = "You cannot use the operator '{0}' with a string value";
  DiagnosticsResources2.CannotDivideByZero = "You cannot divide by zero. Please consider checking the divisor before dividing.";
  DiagnosticsResources2.PoppingAnEmptyStack = "This stack has no elements to be popped";
  function get(key) {
    return DiagnosticsResources2[key];
  }
  DiagnosticsResources2.get = get;
})(DiagnosticsResources || (DiagnosticsResources = {}));

// ../../vendor/SmallBasicOnline/src/compiler/utils/diagnostics.ts
var ErrorCode = /* @__PURE__ */ ((ErrorCode2) => {
  ErrorCode2[ErrorCode2["UnrecognizedCharacter"] = 0] = "UnrecognizedCharacter";
  ErrorCode2[ErrorCode2["UnterminatedStringLiteral"] = 1] = "UnterminatedStringLiteral";
  ErrorCode2[ErrorCode2["UnrecognizedCommand"] = 2] = "UnrecognizedCommand";
  ErrorCode2[ErrorCode2["UnexpectedToken_ExpectingExpression"] = 3] = "UnexpectedToken_ExpectingExpression";
  ErrorCode2[ErrorCode2["UnexpectedToken_ExpectingToken"] = 4] = "UnexpectedToken_ExpectingToken";
  ErrorCode2[ErrorCode2["UnexpectedToken_ExpectingEOL"] = 5] = "UnexpectedToken_ExpectingEOL";
  ErrorCode2[ErrorCode2["UnexpectedEOL_ExpectingExpression"] = 6] = "UnexpectedEOL_ExpectingExpression";
  ErrorCode2[ErrorCode2["UnexpectedEOL_ExpectingToken"] = 7] = "UnexpectedEOL_ExpectingToken";
  ErrorCode2[ErrorCode2["UnexpectedCommand_ExpectingCommand"] = 8] = "UnexpectedCommand_ExpectingCommand";
  ErrorCode2[ErrorCode2["UnexpectedEOF_ExpectingCommand"] = 9] = "UnexpectedEOF_ExpectingCommand";
  ErrorCode2[ErrorCode2["CannotDefineASubInsideAnotherSub"] = 10] = "CannotDefineASubInsideAnotherSub";
  ErrorCode2[ErrorCode2["CannotHaveCommandWithoutPreviousCommand"] = 11] = "CannotHaveCommandWithoutPreviousCommand";
  ErrorCode2[ErrorCode2["ValueIsNotANumber"] = 12] = "ValueIsNotANumber";
  ErrorCode2[ErrorCode2["TwoSubModulesWithTheSameName"] = 13] = "TwoSubModulesWithTheSameName";
  ErrorCode2[ErrorCode2["LabelDoesNotExist"] = 14] = "LabelDoesNotExist";
  ErrorCode2[ErrorCode2["UnassignedExpressionStatement"] = 15] = "UnassignedExpressionStatement";
  ErrorCode2[ErrorCode2["InvalidExpressionStatement"] = 16] = "InvalidExpressionStatement";
  ErrorCode2[ErrorCode2["UnexpectedVoid_ExpectingValue"] = 17] = "UnexpectedVoid_ExpectingValue";
  ErrorCode2[ErrorCode2["UnsupportedArrayBaseExpression"] = 18] = "UnsupportedArrayBaseExpression";
  ErrorCode2[ErrorCode2["UnsupportedCallBaseExpression"] = 19] = "UnsupportedCallBaseExpression";
  ErrorCode2[ErrorCode2["UnexpectedArgumentsCount"] = 20] = "UnexpectedArgumentsCount";
  ErrorCode2[ErrorCode2["PropertyHasNoSetter"] = 21] = "PropertyHasNoSetter";
  ErrorCode2[ErrorCode2["AssigningNonSubModuleToEvent"] = 22] = "AssigningNonSubModuleToEvent";
  ErrorCode2[ErrorCode2["UnsupportedDotBaseExpression"] = 23] = "UnsupportedDotBaseExpression";
  ErrorCode2[ErrorCode2["LibraryMemberNotFound"] = 24] = "LibraryMemberNotFound";
  ErrorCode2[ErrorCode2["ValueIsNotAssignable"] = 25] = "ValueIsNotAssignable";
  ErrorCode2[ErrorCode2["CannotUseAnArrayAsAnIndexToAnotherArray"] = 26] = "CannotUseAnArrayAsAnIndexToAnotherArray";
  ErrorCode2[ErrorCode2["CannotUseOperatorWithAnArray"] = 27] = "CannotUseOperatorWithAnArray";
  ErrorCode2[ErrorCode2["CannotUseOperatorWithAString"] = 28] = "CannotUseOperatorWithAString";
  ErrorCode2[ErrorCode2["CannotDivideByZero"] = 29] = "CannotDivideByZero";
  ErrorCode2[ErrorCode2["PoppingAnEmptyStack"] = 30] = "PoppingAnEmptyStack";
  return ErrorCode2;
})(ErrorCode || {});
var Diagnostic = class {
  constructor(code, range, ...args) {
    this.code = code;
    this.range = range;
    this.args = args;
  }
  code;
  range;
  args;
  toString() {
    const template = DiagnosticsResources.get(ErrorCode[this.code]);
    if (!template) {
      throw new Error(`Error code ${ErrorCode[this.code]} has no string resource`);
    }
    return CompilerUtils.formatString(template, this.args);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/number-value.ts
var NumberValue = class _NumberValue extends BaseValue {
  constructor(value) {
    super();
    this.value = value;
  }
  value;
  toBoolean() {
    return false;
  }
  toDebuggerString() {
    return this.value.toString();
  }
  toValueString() {
    return this.toDebuggerString();
  }
  get kind() {
    return 1 /* Number */;
  }
  tryConvertToNumber() {
    return this;
  }
  isEqualTo(other) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        return this.value.toString() === other.value;
      case 1 /* Number */:
        return this.value === other.value;
      case 2 /* Array */:
        return false;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isLessThan(other) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
      case 2 /* Array */:
        return false;
      case 1 /* Number */:
        return this.value < other.value;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isGreaterThan(other) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
      case 2 /* Array */:
        return false;
      case 1 /* Number */:
        return this.value > other.value;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  add(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        return new StringValue(this.value.toString() + other.value);
      case 1 /* Number */:
        return new _NumberValue(this.value + other.value);
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(23 /* Plus */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  subtract(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        return this;
      case 1 /* Number */:
        return new _NumberValue(this.value - other.value);
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  multiply(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
        return this;
      case 1 /* Number */:
        return new _NumberValue(this.value * other.value);
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  divide(other, engine, instruction) {
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
        return this;
      case 1 /* Number */:
        const otherValue = other.value;
        if (otherValue === 0) {
          engine.terminate(new Diagnostic(29 /* CannotDivideByZero */, instruction.sourceRange));
          return this;
        } else {
          return new _NumberValue(this.value / otherValue);
        }
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/string-value.ts
var StringValue = class _StringValue extends BaseValue {
  constructor(value) {
    super();
    this.value = value;
  }
  value;
  toBoolean() {
    return this.value.toLowerCase() === Constants.True.toLowerCase();
  }
  toDebuggerString() {
    return `"${this.value.toString()}"`;
  }
  toValueString() {
    return this.value;
  }
  get kind() {
    return 0 /* String */;
  }
  tryConvertToNumber() {
    const number = parseFloat(this.value.trim());
    if (isNaN(number)) {
      return this;
    } else {
      return new NumberValue(number);
    }
  }
  isEqualTo(other) {
    switch (other.kind) {
      case 0 /* String */:
        return this.value === other.value;
      case 1 /* Number */:
        return this.value.trim() === other.value.toString();
      case 2 /* Array */:
        return false;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isLessThan(other) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      return false;
    } else {
      return thisConverted.isLessThan(other);
    }
  }
  isGreaterThan(other) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      return false;
    } else {
      return thisConverted.isGreaterThan(other);
    }
  }
  add(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind !== 0 /* String */) {
      return thisConverted.add(other, engine, instruction);
    }
    other = other.tryConvertToNumber();
    switch (other.kind) {
      case 0 /* String */:
        return new _StringValue(this.value + other.value);
      case 1 /* Number */:
        return new _StringValue(this.value + other.value.toString());
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(23 /* Plus */)));
        return this;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  subtract(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
      return this;
    } else {
      return thisConverted.subtract(other, engine, instruction);
    }
  }
  multiply(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
      return this;
    } else {
      return thisConverted.multiply(other, engine, instruction);
    }
  }
  divide(other, engine, instruction) {
    const thisConverted = this.tryConvertToNumber();
    if (thisConverted.tryConvertToNumber().kind === 0 /* String */) {
      engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
      return this;
    } else {
      return thisConverted.divide(other, engine, instruction);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/text-window.ts
var TextWindowColor = /* @__PURE__ */ ((TextWindowColor2) => {
  TextWindowColor2[TextWindowColor2["Black"] = 0] = "Black";
  TextWindowColor2[TextWindowColor2["DarkBlue"] = 1] = "DarkBlue";
  TextWindowColor2[TextWindowColor2["DarkGreen"] = 2] = "DarkGreen";
  TextWindowColor2[TextWindowColor2["DarkCyan"] = 3] = "DarkCyan";
  TextWindowColor2[TextWindowColor2["DarkRed"] = 4] = "DarkRed";
  TextWindowColor2[TextWindowColor2["DarkMagenta"] = 5] = "DarkMagenta";
  TextWindowColor2[TextWindowColor2["DarkYellow"] = 6] = "DarkYellow";
  TextWindowColor2[TextWindowColor2["Gray"] = 7] = "Gray";
  TextWindowColor2[TextWindowColor2["DarkGray"] = 8] = "DarkGray";
  TextWindowColor2[TextWindowColor2["Blue"] = 9] = "Blue";
  TextWindowColor2[TextWindowColor2["Green"] = 10] = "Green";
  TextWindowColor2[TextWindowColor2["Cyan"] = 11] = "Cyan";
  TextWindowColor2[TextWindowColor2["Red"] = 12] = "Red";
  TextWindowColor2[TextWindowColor2["Magenta"] = 13] = "Magenta";
  TextWindowColor2[TextWindowColor2["Yellow"] = 14] = "Yellow";
  TextWindowColor2[TextWindowColor2["White"] = 15] = "White";
  return TextWindowColor2;
})(TextWindowColor || {});
var TextWindowLibrary = class {
  _pluginInstance;
  get plugin() {
    if (!this._pluginInstance) {
      throw new Error("Plugin is not set.");
    }
    return this._pluginInstance;
  }
  set plugin(plugin) {
    this._pluginInstance = plugin;
  }
  executeReadMethod(engine, kind) {
    const bufferValue = this.plugin.checkInputBuffer();
    if (bufferValue) {
      if (bufferValue.kind !== kind) {
        throw new Error(`Expecting input kind '${ValueKind[kind]}' but buffer has kind '${ValueKind[bufferValue.kind]}'`);
      }
      engine.pushEvaluationStack(bufferValue);
      engine.state = 0 /* Running */;
    } else {
      engine.state = 2 /* BlockedOnInput */;
      this.plugin.inputIsNeeded(kind);
    }
  }
  executeWriteMethod(engine, appendNewLine) {
    const value = engine.popEvaluationStack().toValueString();
    this.plugin.writeText(value, appendNewLine);
  }
  tryParseColorValue(value) {
    switch (value.kind) {
      case 1 /* Number */: {
        const numberValue = value.value;
        if (TextWindowColor[numberValue]) {
          return numberValue;
        }
        break;
      }
      case 0 /* String */: {
        const stringValue = value.value.toLowerCase();
        for (let color in TextWindowColor) {
          if (color.toLowerCase() === stringValue) {
            return TextWindowColor[color];
          }
        }
        break;
      }
    }
    return void 0;
  }
  setForegroundColor(value) {
    const color = this.tryParseColorValue(value);
    if (color) {
      this.plugin.setForegroundColor(color);
    }
  }
  setBackgroundColor(value) {
    const color = this.tryParseColorValue(value);
    if (color) {
      this.plugin.setBackgroundColor(color);
    }
  }
  getForegroundColor() {
    return new StringValue(TextWindowColor[this.plugin.getForegroundColor()]);
  }
  getBackgroundColor() {
    return new StringValue(TextWindowColor[this.plugin.getBackgroundColor()]);
  }
  methods = {
    Read: { execute: (engine) => this.executeReadMethod(engine, 0 /* String */) },
    ReadNumber: { execute: (engine) => this.executeReadMethod(engine, 1 /* Number */) },
    Write: { execute: (engine) => this.executeWriteMethod(engine, false) },
    WriteLine: { execute: (engine) => this.executeWriteMethod(engine, true) }
  };
  properties = {
    ForegroundColor: { getter: this.getForegroundColor.bind(this), setter: this.setForegroundColor.bind(this) },
    BackgroundColor: { getter: this.getBackgroundColor.bind(this), setter: this.setBackgroundColor.bind(this) }
  };
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/program.ts
init_polyfills();
var ProgramLibrary = class {
  async executeDelay(engine) {
    const milliSecondsArg = engine.popEvaluationStack().tryConvertToNumber();
    const milliSecondsValue = milliSecondsArg.kind === 1 /* Number */ ? milliSecondsArg.value : 0;
    const executionState = engine.state;
    engine.state = 2 /* BlockedOnInput */;
    await new Promise((resolve) => setTimeout(resolve, milliSecondsValue));
    engine.state = executionState;
  }
  executePause(engine, mode) {
    if (engine.state === 1 /* Paused */) {
      engine.state = 0 /* Running */;
    } else if (mode === 1 /* Debug */) {
      engine.state = 1 /* Paused */;
    }
  }
  executeEnd(engine) {
    engine.terminate();
  }
  methods = {
    Delay: { execute: this.executeDelay.bind(this) },
    Pause: { execute: this.executePause.bind(this) },
    End: { execute: this.executeEnd.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/clock.ts
init_polyfills();
var ClockLibrary = class {
  getTime() {
    const time = (/* @__PURE__ */ new Date()).toLocaleTimeString();
    return new StringValue(time);
  }
  methods = {};
  properties = {
    Time: { getter: this.getTime.bind(this) }
  };
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/array.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/runtime/values/array-value.ts
init_polyfills();
var ArrayValue = class extends BaseValue {
  _values;
  constructor(value = {}) {
    super();
    this._values = value;
  }
  get values() {
    return this._values;
  }
  setIndex(index, value) {
    this._values[this.resolveKey(index)] = value;
  }
  getValue(index) {
    return this._values[this.resolveKey(index)];
  }
  deleteIndex(index) {
    delete this._values[this.resolveKey(index)];
  }
  // Small Basic array indices (and thus variable names) are case insensitive.
  resolveKey(index) {
    const lower = index.toLowerCase();
    for (const key of Object.keys(this._values)) {
      if (key.toLowerCase() === lower) {
        return key;
      }
    }
    return index;
  }
  toBoolean() {
    return false;
  }
  toDebuggerString() {
    return `[${Object.keys(this._values).map((key) => `${key}=${this._values[key].toDebuggerString()}`).join(", ")}]`;
  }
  toValueString() {
    return this.toDebuggerString();
  }
  get kind() {
    return 2 /* Array */;
  }
  tryConvertToNumber() {
    return this;
  }
  isEqualTo(other) {
    switch (other.kind) {
      case 0 /* String */:
      case 1 /* Number */:
        return false;
      case 2 /* Array */:
        return this.toDebuggerString() === other.toDebuggerString();
      default:
        throw new Error(`Unexpected value kind ${ValueKind[other.kind]}`);
    }
  }
  isLessThan(_) {
    return false;
  }
  isGreaterThan(_) {
    return false;
  }
  add(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(23 /* Plus */)));
    return this;
  }
  subtract(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
    return this;
  }
  multiply(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(25 /* Multiply */)));
    return this;
  }
  divide(_, engine, instruction) {
    engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, instruction.sourceRange, CompilerUtils.tokenToDisplayString(26 /* Divide */)));
    return this;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/array.ts
var ArrayLibrary = class {
  arrays = {};
  normalizeArrayName(name) {
    return name.toLowerCase();
  }
  executeIsArray(engine) {
    const value = engine.popEvaluationStack();
    engine.pushEvaluationStack(new StringValue(value.kind === 2 /* Array */ ? Constants.True : Constants.False));
  }
  executeGetItemCount(engine) {
    const array = engine.popEvaluationStack();
    const itemCount = array.kind === 2 /* Array */ ? Object.keys(array.values).length : 0;
    engine.pushEvaluationStack(new NumberValue(itemCount));
  }
  executeGetAllIndices(engine) {
    const array = engine.popEvaluationStack();
    const newArray = {};
    if (array.kind === 2 /* Array */) {
      Object.keys(array.values).forEach((key, i) => {
        newArray[i + 1] = new StringValue(key);
      });
    }
    engine.pushEvaluationStack(new ArrayValue(newArray));
  }
  executeContainsValue(engine) {
    const value = engine.popEvaluationStack();
    const array = engine.popEvaluationStack();
    let result = Constants.False;
    if (array.kind === 2 /* Array */) {
      const arrayValue = array.values;
      for (let key in arrayValue) {
        if (arrayValue[key].isEqualTo(value)) {
          result = Constants.True;
          break;
        }
      }
    }
    engine.pushEvaluationStack(new StringValue(result));
  }
  executeContainsIndex(engine) {
    const index = engine.popEvaluationStack().tryConvertToNumber();
    const array = engine.popEvaluationStack();
    let result = Constants.False;
    if (array.kind === 2 /* Array */) {
      if (index.kind === 1 /* Number */ || index.kind === 0 /* String */) {
        if (array.getValue(index.toValueString())) {
          result = Constants.True;
        }
      }
    }
    engine.pushEvaluationStack(new StringValue(result));
  }
  executeGetValue(engine) {
    const index = engine.popEvaluationStack().toValueString();
    const arrayName = engine.popEvaluationStack().toValueString();
    const array = this.arrays[this.normalizeArrayName(arrayName)];
    engine.pushEvaluationStack(array?.getValue(index) ?? new StringValue(""));
  }
  executeRemoveValue(engine) {
    const index = engine.popEvaluationStack().toValueString();
    const arrayName = this.normalizeArrayName(engine.popEvaluationStack().toValueString());
    const array = this.arrays[arrayName];
    if (array?.getValue(index)) {
      array.deleteIndex(index);
      this.arrays[arrayName] = array;
    }
  }
  executeSetValue(engine) {
    const value = engine.popEvaluationStack();
    const index = engine.popEvaluationStack().toValueString();
    const arrayName = this.normalizeArrayName(engine.popEvaluationStack().toValueString());
    const array = this.arrays[arrayName] ?? new ArrayValue();
    array.setIndex(index, value);
    this.arrays[arrayName] = array;
  }
  methods = {
    IsArray: { execute: this.executeIsArray.bind(this) },
    GetItemCount: { execute: this.executeGetItemCount.bind(this) },
    GetAllIndices: { execute: this.executeGetAllIndices.bind(this) },
    ContainsValue: { execute: this.executeContainsValue.bind(this) },
    ContainsIndex: { execute: this.executeContainsIndex.bind(this) },
    GetValue: { execute: this.executeGetValue.bind(this) },
    RemoveValue: { execute: this.executeRemoveValue.bind(this) },
    SetValue: { execute: this.executeSetValue.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/stack.ts
init_polyfills();
var StackLibrary = class {
  _stacks = {};
  executePushValue(engine) {
    const value = engine.popEvaluationStack();
    const stackName = engine.popEvaluationStack().toValueString();
    if (!this._stacks[stackName]) {
      this._stacks[stackName] = [];
    }
    this._stacks[stackName].push(value);
  }
  executeGetCount(engine) {
    const stackName = engine.popEvaluationStack().toValueString();
    const count = this._stacks[stackName] ? this._stacks[stackName].length : 0;
    engine.pushEvaluationStack(new NumberValue(count));
  }
  executePopValue(engine, _, range) {
    const stackName = engine.popEvaluationStack().toValueString();
    if (this._stacks[stackName] && this._stacks[stackName].length) {
      engine.pushEvaluationStack(this._stacks[stackName].pop());
    } else {
      engine.terminate(new Diagnostic(30 /* PoppingAnEmptyStack */, range));
    }
  }
  methods = {
    PushValue: { execute: this.executePushValue.bind(this) },
    GetCount: { execute: this.executeGetCount.bind(this) },
    PopValue: { execute: this.executePopValue.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries-metadata.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/strings/documentation.ts
init_polyfills();
var DocumentationResources;
((DocumentationResources2) => {
  DocumentationResources2.Array = "This class provides a way of storing more than one value for a given name. These values can be accessed by another index.";
  DocumentationResources2.Array_ContainsIndex = "Gets whether or not the array contains the specified index. This is very useful when deciding if the array's index was initialized by some value or not.";
  DocumentationResources2.Array_ContainsIndex_Array = "The array to check.";
  DocumentationResources2.Array_ContainsIndex_Index = "The index to check.";
  DocumentationResources2.Array_ContainsValue = "Gets whether or not the array contains the specified value. This is very useful when deciding if the array's value was stored in some index.";
  DocumentationResources2.Array_ContainsValue_Array = "The array to check.";
  DocumentationResources2.Array_ContainsValue_Index = "The index to check.";
  DocumentationResources2.Array_GetAllIndices = "Gets all the indices for the array, as another array. The index of the returned array starts from 1.";
  DocumentationResources2.Array_GetAllIndices_Array = "The array whose indices are requested.";
  DocumentationResources2.Array_GetItemCount = "Gets the count of all the items in the array.";
  DocumentationResources2.Array_GetItemCount_Array = "The array whose item count is requested.";
  DocumentationResources2.Array_GetValue = "Gets the value stored at the specified index of the named array.";
  DocumentationResources2.Array_GetValue_ArrayName = "The name of the array whose value is requested.";
  DocumentationResources2.Array_GetValue_Index = "The index whose value is requested.";
  DocumentationResources2.Array_IsArray = "Checks whether the value passed is an array or not.";
  DocumentationResources2.Array_IsArray_Value = "The value to check.";
  DocumentationResources2.Array_RemoveValue = "Removes the value stored at the specified index of the named array.";
  DocumentationResources2.Array_RemoveValue_ArrayName = "The name of the array whose value should be removed.";
  DocumentationResources2.Array_RemoveValue_Index = "The index whose value should be removed.";
  DocumentationResources2.Array_SetValue = "Stores the value at the specified index of the named array.";
  DocumentationResources2.Array_SetValue_ArrayName = "The name of the array to update.";
  DocumentationResources2.Array_SetValue_Index = "The index to update.";
  DocumentationResources2.Array_SetValue_Value = "The value to store at the specified index.";
  DocumentationResources2.Clock = "This class provides access to the system clock.";
  DocumentationResources2.Clock_Time = "Gets the current system time.";
  DocumentationResources2.Controls = "The Controls object allows you to add, move and interact with controls.";
  DocumentationResources2.Controls_LastClickedButton = "Gets the last Button that was clicked on the Graphics Window.";
  DocumentationResources2.Controls_LastTypedTextBox = "Gets the last TextBox, text was typed into.";
  DocumentationResources2.Controls_ButtonClicked = "Raises an event when any button control is clicked.";
  DocumentationResources2.Controls_TextTyped = "Raises an event when text is typed into any TextBox control.";
  DocumentationResources2.Controls_AddButton = "Adds a button to the graphics window at the specified position, and returns it.";
  DocumentationResources2.Controls_AddButton_Caption = "The caption to display in the button.";
  DocumentationResources2.Controls_AddButton_Left = "The x co-ordinate of the button.";
  DocumentationResources2.Controls_AddButton_Top = "The y co-ordinate of the button.";
  DocumentationResources2.Controls_GetButtonCaption = "Gets the current caption of the specified button.";
  DocumentationResources2.Controls_GetButtonCaption_ButtonName = "The Button whose caption is requested.";
  DocumentationResources2.Controls_SetButtonCaption = "Sets the caption of the specified button.";
  DocumentationResources2.Controls_SetButtonCaption_ButtonName = "She Button whose caption needs to be set.";
  DocumentationResources2.Controls_SetButtonCaption_Caption = "The new caption for the button.";
  DocumentationResources2.Controls_AddTextBox = "Adds a text input box to the graphics window at the specified position, and returns it.";
  DocumentationResources2.Controls_AddTextBox_Left = "The x co-ordinate of the text box.";
  DocumentationResources2.Controls_AddTextBox_Top = "The y co-ordinate of the text box.";
  DocumentationResources2.Controls_AddMultiLineTextBox = "Adds a multi-line text input box to the graphics window at the specified position, and returns it.";
  DocumentationResources2.Controls_AddMultiLineTextBox_Left = "The x co-ordinate of the text box.";
  DocumentationResources2.Controls_AddMultiLineTextBox_Top = "The y co-ordinate of the text box.";
  DocumentationResources2.Controls_GetTextBoxText = "Gets the current text of the specified TextBox.";
  DocumentationResources2.Controls_GetTextBoxText_TextBoxName = "The TextBox whose text is requested.";
  DocumentationResources2.Controls_SetTextBoxText = "Sets the text of the specified TextBox.";
  DocumentationResources2.Controls_SetTextBoxText_TextBoxName = "The TextBox whose text needs to be set.";
  DocumentationResources2.Controls_SetTextBoxText_Text = "The new text for the TextBox.";
  DocumentationResources2.Controls_Remove = "Removes a control from the Graphics Window.";
  DocumentationResources2.Controls_Remove_ControlName = "The name of the control that needs to be removed.";
  DocumentationResources2.Controls_Move = "Moves the control with the specified name to a new position.";
  DocumentationResources2.Controls_Move_Control = "The name of the control to move.";
  DocumentationResources2.Controls_Move_X = "The x co-ordinate of the new position.";
  DocumentationResources2.Controls_Move_Y = "The y co-ordinate of the new position.";
  DocumentationResources2.Controls_SetSize = "Sets the size of the control.";
  DocumentationResources2.Controls_SetSize_Control = "The name of the control to be resized.";
  DocumentationResources2.Controls_SetSize_Width = "The width of the control.";
  DocumentationResources2.Controls_SetSize_Height = "The height of the control.";
  DocumentationResources2.Controls_HideControl = "Hides an already added control.";
  DocumentationResources2.Controls_HideControl_ControlName = "The name of the control.";
  DocumentationResources2.Controls_ShowControl = "Shows a previously hidden control.";
  DocumentationResources2.Controls_ShowControl_ControlName = "The name of the control.";
  DocumentationResources2.Math = "The Math class provides lots of useful mathematics related methods.";
  DocumentationResources2.Math_Pi = "Gets the value of Pi.";
  DocumentationResources2.Math_Abs = "Gets the absolute value of the given number. For example, -32.233 will return 32.233.";
  DocumentationResources2.Math_Abs_Number = "The number to get the absolute value for.";
  DocumentationResources2.Math_Remainder = "Divides the first number by the second and returns the remainder.";
  DocumentationResources2.Math_Remainder_Dividend = "The number to divide.";
  DocumentationResources2.Math_Remainder_Divisor = "The number that divides.";
  DocumentationResources2.Math_Cos = "Gets the cosine of the given angle in radians.";
  DocumentationResources2.Math_Cos_Angle = "The angle whose cosine is needed (in radians).";
  DocumentationResources2.Math_Sin = "Gets the sine of the given angle in radians.";
  DocumentationResources2.Math_Sin_Angle = "The angle whose sine is needed (in radians).";
  DocumentationResources2.Math_Tan = "Gets the tangent of the given angle in radians.";
  DocumentationResources2.Math_Tan_Angle = "The angle whose tangent is needed (in radians).";
  DocumentationResources2.Math_ArcCos = "Gets the angle in radians, given the cosine value.";
  DocumentationResources2.Math_ArcCos_CosValue = "The cosine value whose angle is needed.";
  DocumentationResources2.Math_ArcSin = "Gets the angle in radians, given the sine value.";
  DocumentationResources2.Math_ArcSin_SinValue = "The sine value whose angle is needed.";
  DocumentationResources2.Math_ArcTan = "Gets the angle in radians, given the tangent value.";
  DocumentationResources2.Math_ArcTan_TanValue = "The tangent value whose angle is needed.";
  DocumentationResources2.Math_Ceiling = "Returns the smallest integer that is greater than or equal to the argument. It rounds up the integer value. For example, 32.233 will return 33. Also, 44 will return 44.";
  DocumentationResources2.Math_Ceiling_Number = "The number whose ceiling is required.";
  DocumentationResources2.Math_Floor = "Returns the largest integer that is less than or equal to the argument. It rounds down the integer value. For example, 32.233 will return 32. Also, 44 will return 44.";
  DocumentationResources2.Math_Floor_Number = "The number whose floor value is required.";
  DocumentationResources2.Math_Round = "Rounds a given number to the nearest integer. For example 32.233 will be rounded to 32.0 while 32.566 will be rounded to 33.";
  DocumentationResources2.Math_Round_Number = "The number whose approximation is required.";
  DocumentationResources2.Math_GetDegrees = "Converts a given angle in radians to degrees.";
  DocumentationResources2.Math_GetDegrees_Angle = "The angle in radians.";
  DocumentationResources2.Math_GetRadians = "Converts a given angle in degrees to radians.";
  DocumentationResources2.Math_GetRadians_Angle = "The angle in degrees.";
  DocumentationResources2.Math_GetRandomNumber = "Gets a random number between 1 and the specified maxNumber (inclusive).";
  DocumentationResources2.Math_GetRandomNumber_MaxNumber = "The maximum number for the requested random value.";
  DocumentationResources2.Math_Log = "Gets the logarithm (base 10) value of the given number.";
  DocumentationResources2.Math_Log_Number = "The number whose logarithm value is required.";
  DocumentationResources2.Math_NaturalLog = "Gets the natural logarithm value of the given number.";
  DocumentationResources2.Math_NaturalLog_Number = "The number whose natural logarithm value is required.";
  DocumentationResources2.Math_Max = "Compares two numbers and returns the greater of the two.";
  DocumentationResources2.Math_Max_Number1 = "The first of the two numbers to compare.";
  DocumentationResources2.Math_Max_Number2 = "The second of the two numbers to compare.";
  DocumentationResources2.Math_Min = "Compares two numbers and returns the smaller of the two.";
  DocumentationResources2.Math_Min_Number1 = "The first of the two numbers to compare.";
  DocumentationResources2.Math_Min_Number2 = "The second of the two numbers to compare.";
  DocumentationResources2.Math_Power = "Raises the base number to the specified power.";
  DocumentationResources2.Math_Power_BaseNumber = "The number to be raised to the exponent power.";
  DocumentationResources2.Math_Power_Exponent = "The power to raise the base number.";
  DocumentationResources2.Math_SquareRoot = "Gets the square root of a given number.";
  DocumentationResources2.Math_SquareRoot_Number = "The number whose square root value is needed.";
  DocumentationResources2.Program = "The Program class provides helpers to control the program execution.";
  DocumentationResources2.Program_Pause = "Pauses the program execution for debugging.";
  DocumentationResources2.Program_End = "Ends the program.";
  DocumentationResources2.Shapes = "The Shape object allows you to add, move and rotate shapes to the Graphics window.";
  DocumentationResources2.Shapes_AddRectangle = "Adds a rectangle shape with the specified width and height, and returns it.";
  DocumentationResources2.Shapes_AddRectangle_Width = "The width of the rectangle shape.";
  DocumentationResources2.Shapes_AddRectangle_Height = "he height of the rectangle shape.";
  DocumentationResources2.Shapes_AddEllipse = "Adds an ellipse shape with the specified width and height, and returns it.";
  DocumentationResources2.Shapes_AddEllipse_Width = "The width of the ellipse shape.";
  DocumentationResources2.Shapes_AddEllipse_Height = "he height of the ellipse shape.";
  DocumentationResources2.Shapes_AddTriangle = "Adds a triangle shape represented by the specified points, and returns it.";
  DocumentationResources2.Shapes_AddTriangle_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddTriangle_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddTriangle_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddTriangle_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddTriangle_X3 = "The x co-ordinate of the third point.";
  DocumentationResources2.Shapes_AddTriangle_Y3 = "The y co-ordinate of the third point.";
  DocumentationResources2.Shapes_AddLine = "Adds a line between the specified points.";
  DocumentationResources2.Shapes_AddLine_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddLine_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.Shapes_AddLine_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddLine_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.Shapes_AddImage = "Adds an image as a shape that can be moved, animated or rotated, and returns it.";
  DocumentationResources2.Shapes_AddImage_ImageName = "The name of the image to draw.";
  DocumentationResources2.Shapes_AddText = "Adds some text as a shape that can be moved, animated or rotated, and returns it.";
  DocumentationResources2.Shapes_AddText_Text = "The text to add.";
  DocumentationResources2.Shapes_SetText = "Sets the text of a text shape.";
  DocumentationResources2.Shapes_SetText_ShapeName = "The name of the text shape.";
  DocumentationResources2.Shapes_SetText_Text = "The new text value to set.";
  DocumentationResources2.Shapes_Remove = "Removes a shape from the Graphics Window.";
  DocumentationResources2.Shapes_Remove_ShapeName = "The name of the shape that needs to be removed.";
  DocumentationResources2.Shapes_Move = "Moves the shape with the specified name to a new position.";
  DocumentationResources2.Shapes_Move_ShapeName = "The name of the shape to move.";
  DocumentationResources2.Shapes_Move_X = "The x co-ordinate of the new position.";
  DocumentationResources2.Shapes_Move_Y = "The y co-ordinate of the new position.";
  DocumentationResources2.Shapes_Rotate = "Rotates the shape with the specified name to the specified angle.";
  DocumentationResources2.Shapes_Rotate_ShapeName = "The name of the shape to rotate.";
  DocumentationResources2.Shapes_Rotate_Angle = "The angle to rotate the shape.";
  DocumentationResources2.Shapes_Zoom = "Scales the shape using the specified zoom levels.  Minimum is 0.1 and maximum is 20.";
  DocumentationResources2.Shapes_Zoom_ShapeName = "The name of the shape to zoom.";
  DocumentationResources2.Shapes_Zoom_ScaleX = "The x-axis zoom level.";
  DocumentationResources2.Shapes_Zoom_ScaleY = "The y-axis zoom level.";
  DocumentationResources2.Shapes_Animate = "Animates a shape with the specified name to a new position.";
  DocumentationResources2.Shapes_Animate_ShapeName = "The name of the shape to move.";
  DocumentationResources2.Shapes_Animate_X = "The x co-ordinate of the new position.";
  DocumentationResources2.Shapes_Animate_Y = "The y co-ordinate of the new position.";
  DocumentationResources2.Shapes_Animate_Duration = "The time for the animation, in milliseconds.";
  DocumentationResources2.Shapes_GetLeft = "Gets the left co-ordinate of the specified shape.";
  DocumentationResources2.Shapes_GetLeft_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_GetTop = "Gets the top co-ordinate of the specified shape.";
  DocumentationResources2.Shapes_GetTop_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_GetOpacity = "Gets the opacity of a shape.";
  DocumentationResources2.Shapes_GetOpacity_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_SetOpacity = "Sets how opaque a shape should render.";
  DocumentationResources2.Shapes_SetOpacity_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_SetOpacity_Level = "The opacity level ranging from 0 to 100.  0 is completely transparent and 100 is completely opaque.";
  DocumentationResources2.Shapes_HideShape = "Hides an already added shape.";
  DocumentationResources2.Shapes_HideShape_ShapeName = "The name of the shape.";
  DocumentationResources2.Shapes_ShowShape = "Shows a previously hidden shape.";
  DocumentationResources2.Shapes_ShowShape_ShapeName = "The name of the shape.";
  DocumentationResources2.Stack = "This object provides a way of storing values just like stacking up a plate. You can push a value to the top of the stack and pop it off. You can only pop the values one by one off the stack and the last pushed value will be the first one to pop out.";
  DocumentationResources2.Stack_PushValue = "Pushes a value to the specified stack.";
  DocumentationResources2.Stack_PushValue_StackName = "The name of the stack.";
  DocumentationResources2.Stack_PushValue_Value = "The value to push.";
  DocumentationResources2.Stack_GetCount = "Gets the count of items in the specified stack.";
  DocumentationResources2.Stack_GetCount_StackName = "The name of the stack.";
  DocumentationResources2.Stack_PopValue = "Pops a value from the specified stack.";
  DocumentationResources2.Stack_PopValue_StackName = "The name of the stack.";
  DocumentationResources2.TextWindow = "The TextWindow provides text-related input and output functionalities. For example using this class, it is possible to write or read some text or number to and from the text-based text window.";
  DocumentationResources2.TextWindow_Read = "Reads a line of text from the text window. Returns the string entered by the user.";
  DocumentationResources2.TextWindow_ReadNumber = "Reads a number from the text window. Returns the number entered by the user.";
  DocumentationResources2.TextWindow_Write = "Writes a string or a number to the text window on the same line.";
  DocumentationResources2.TextWindow_Write_Data = "The string or number to be written to the text window.";
  DocumentationResources2.TextWindow_WriteLine = "Writes a string or a number to the text window on its own line.";
  DocumentationResources2.TextWindow_WriteLine_Data = "The string or number to be written to the text window.";
  DocumentationResources2.TextWindow_ForegroundColor = "Gets or sets the foreground color of the text to be output in the text window.";
  DocumentationResources2.TextWindow_BackgroundColor = "Gets or sets the background color of the text to be output in the text window.";
  DocumentationResources2.Turtle = "The Turtle provides Logo-like functionality to draw shapes by manipulating the properties of a pen and drawing primitives.";
  DocumentationResources2.Turtle_Speed = "Specifies how fast the turtle should move. Valid values are 1 to 10. If Speed is set to 10, the turtle moves and rotates instantly.";
  DocumentationResources2.Turtle_Angle = "Gets or sets the current angle of the turtle. While setting, this will turn the turtle instantly to the new angle.";
  DocumentationResources2.Turtle_X = "Gets or sets the X location of the Turtle. While setting, this will move the turtle instantly to the new location.";
  DocumentationResources2.Turtle_Y = "Gets or sets the Y location of the Turtle. While setting, this will move the turtle instantly to the new location.";
  DocumentationResources2.Turtle_Show = "Shows the turtle.";
  DocumentationResources2.Turtle_Hide = "Hides the turtle.";
  DocumentationResources2.Turtle_PenDown = "Sets the pen down to enable the turtle to draw as it moves.";
  DocumentationResources2.Turtle_PenUp = "Lifts the pen up to stop drawing as the turtle moves.";
  DocumentationResources2.Turtle_Move = "Moves the turtle to a specified distance.  If the pen is down, it will draw a line as it moves.";
  DocumentationResources2.Turtle_Move_Distance = "The distance to move the turtle.";
  DocumentationResources2.Turtle_MoveTo = "Turns and moves the turtle to the specified location.  If the pen is down, it will draw a line as it moves.";
  DocumentationResources2.Turtle_MoveTo_X = "The x co-ordinate of the destination point.";
  DocumentationResources2.Turtle_MoveTo_Y = "The y co-ordinate of the destination point.";
  DocumentationResources2.Turtle_Turn = "Turns the turtle by the specified angle. Angle is in degrees and can be either positive or negative. If the angle is positive, the turtle turns to its right. If it is negative, the turtle turns to its left.";
  DocumentationResources2.Turtle_Turn_Angle = "The angle to turn the turtle.";
  DocumentationResources2.Turtle_TurnLeft = "Turns the turtle 90 degrees to the left.";
  DocumentationResources2.Turtle_TurnRight = "Turns the turtle 90 degrees to the right.";
  DocumentationResources2.GraphicsWindow = "The GraphicsWindow provides graphics related input and output functionality. For example, with this class you can draw and fill shapes.";
  DocumentationResources2.GraphicsWindow_BackgroundColor = "Gets or sets the background color of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_BrushColor = "Gets or sets the brush color to be used to fill the shapes being drawn.";
  DocumentationResources2.GraphicsWindow_PenColor = "Gets or sets the color of the pen used to draw the shapes.";
  DocumentationResources2.GraphicsWindow_PenWidth = "Gets or sets the width of the pen used to draw the shapes.";
  DocumentationResources2.GraphicsWindow_FontName = "Gets or sets the font name of the text to be drawn on the Graphics Window.";
  DocumentationResources2.GraphicsWindow_FontSize = "Gets or sets the font size of the text to be drawn on the Graphics Window.";
  DocumentationResources2.GraphicsWindow_FontBold = "Gets or sets whether or not the text to be drawn on the Graphics Window is bold.";
  DocumentationResources2.GraphicsWindow_FontItalic = "Gets or sets whether or not the text to be drawn on the Graphics Window is italic.";
  DocumentationResources2.GraphicsWindow_Height = "Gets or sets the height of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Width = "Gets or sets the width of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Left = "Gets or sets the Left co-ordinate of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Top = "Gets or sets the Top co-ordinate of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Title = "Gets or sets the title of the Graphics Window.";
  DocumentationResources2.GraphicsWindow_CanResize = "Gets or sets whether the Graphics Window can be resized by the user or not.";
  DocumentationResources2.GraphicsWindow_LastKey = "Gets the last key that was pressed.";
  DocumentationResources2.GraphicsWindow_LastText = "Gets the last text that was entered into the Graphics Window.";
  DocumentationResources2.GraphicsWindow_MouseX = "Gets the x co-ordinate of the mouse position.";
  DocumentationResources2.GraphicsWindow_MouseY = "Gets the y co-ordinate of the mouse position.";
  DocumentationResources2.GraphicsWindow_Show = "Shows the Graphics Window to enable interactions with it.";
  DocumentationResources2.GraphicsWindow_Hide = "Hides the Graphics Window.";
  DocumentationResources2.GraphicsWindow_Clear = "Clears the window and cleans up the canvas.";
  DocumentationResources2.GraphicsWindow_DrawLine = "Draws a line from one point to another.";
  DocumentationResources2.GraphicsWindow_DrawLine_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawLine_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawLine_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawLine_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawRectangle = "Draws a rectangle on the screen.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_X = "The x co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_Y = "The y co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_Width = "The width of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawRectangle_Height = "The height of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle = "Fills a rectangle on the screen.";
  DocumentationResources2.GraphicsWindow_FillRectangle_X = "The x co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle_Y = "The y co-ordinate of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle_Width = "The width of the rectangle.";
  DocumentationResources2.GraphicsWindow_FillRectangle_Height = "The height of the rectangle.";
  DocumentationResources2.GraphicsWindow_DrawEllipse = "Draws an ellipse on the screen.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_X = "The x co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_Y = "The y co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_Width = "The width of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawEllipse_Height = "The height of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse = "Fills an ellipse on the screen.";
  DocumentationResources2.GraphicsWindow_FillEllipse_X = "The x co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse_Y = "The y co-ordinate of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse_Width = "The width of the ellipse.";
  DocumentationResources2.GraphicsWindow_FillEllipse_Height = "The height of the ellipse.";
  DocumentationResources2.GraphicsWindow_DrawTriangle = "Draws a triangle on the screen using three points.";
  DocumentationResources2.GraphicsWindow_FillTriangle = "Fills a triangle on the screen using three points.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_X1 = "The x co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_Y1 = "The y co-ordinate of the first point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_X2 = "The x co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_Y2 = "The y co-ordinate of the second point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_X3 = "The x co-ordinate of the third point.";
  DocumentationResources2.GraphicsWindow_DrawTriangle_Y3 = "The y co-ordinate of the third point.";
  DocumentationResources2.GraphicsWindow_DrawText = "Draws a line of text on the screen.";
  DocumentationResources2.GraphicsWindow_DrawText_X = "The x co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawText_Y = "The y co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawText_Text = "The text to draw.";
  DocumentationResources2.GraphicsWindow_DrawBoundText = "Draws a line of text on the screen, wrapped inside the specified bounds.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_X = "The x co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_Y = "The y co-ordinate of the text.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_Width = "The maximum width available for the text.";
  DocumentationResources2.GraphicsWindow_DrawBoundText_Text = "The text to draw.";
  DocumentationResources2.GraphicsWindow_DrawImage = "Draws the specified image on to the screen.";
  DocumentationResources2.GraphicsWindow_DrawImage_ImageName = "The name of the image to be drawn.";
  DocumentationResources2.GraphicsWindow_DrawImage_X = "The x co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawImage_Y = "The y co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage = "Draws the specified image on to the screen, scaled to fit the specified dimensions.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_ImageName = "The name of the image to be drawn.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_X = "The x co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_Y = "The y co-ordinate of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_Width = "The width of the image.";
  DocumentationResources2.GraphicsWindow_DrawResizedImage_Height = "The height of the image.";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB = "Constructs a color from its red, green, blue components.";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB_Red = "The red component of the color (0-255).";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB_Green = "The green component of the color (0-255).";
  DocumentationResources2.GraphicsWindow_GetColorFromRGB_Blue = "The blue component of the color (0-255).";
  DocumentationResources2.GraphicsWindow_GetRandomColor = "Gets a random valid color.";
  DocumentationResources2.GraphicsWindow_GetPixel = "Gets the color of the pixel at the specified position.";
  DocumentationResources2.GraphicsWindow_GetPixel_X = "The x co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_GetPixel_Y = "The y co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_SetPixel = "Sets the color of the pixel at the specified position.";
  DocumentationResources2.GraphicsWindow_SetPixel_X = "The x co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_SetPixel_Y = "The y co-ordinate of the pixel.";
  DocumentationResources2.GraphicsWindow_SetPixel_Color = "The color to set the pixel to.";
  DocumentationResources2.GraphicsWindow_ShowMessage = "Displays a message dialog to the user.";
  DocumentationResources2.GraphicsWindow_ShowMessage_Text = "The text to display.";
  DocumentationResources2.GraphicsWindow_ShowMessage_Title = "The title of the message dialog.";
  DocumentationResources2.GraphicsWindow_KeyDown = "Raises an event when a key is pressed down on the keyboard.";
  DocumentationResources2.GraphicsWindow_KeyUp = "Raises an event when a key is released on the keyboard.";
  DocumentationResources2.GraphicsWindow_MouseDown = "Raises an event when the mouse button is clicked down.";
  DocumentationResources2.GraphicsWindow_MouseUp = "Raises an event when the mouse button is released.";
  DocumentationResources2.GraphicsWindow_MouseMove = "Raises an event when the mouse is moved around.";
  DocumentationResources2.GraphicsWindow_TextInput = "Raises an event when text is entered into the Graphics Window.";
  DocumentationResources2.Text = "The Text object provides helpful operations for working with text.";
  DocumentationResources2.Text_Append = "Appends two text inputs and returns the result.";
  DocumentationResources2.Text_Append_Text1 = "One part of the text to append.";
  DocumentationResources2.Text_Append_Text2 = "The other part of the text to append.";
  DocumentationResources2.Text_ConvertToLowerCase = "Converts the given text to lower case.";
  DocumentationResources2.Text_ConvertToLowerCase_Text = "The text to convert.";
  DocumentationResources2.Text_ConvertToUpperCase = "Converts the given text to upper case.";
  DocumentationResources2.Text_ConvertToUpperCase_Text = "The text to convert.";
  DocumentationResources2.Text_EndsWith = "Gets whether or not a given text ends with the specified sub text.";
  DocumentationResources2.Text_EndsWith_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_EndsWith_SubText = "The sub text to search for.";
  DocumentationResources2.Text_StartsWith = "Gets whether or not a given text starts with the specified sub text.";
  DocumentationResources2.Text_StartsWith_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_StartsWith_SubText = "The sub text to search for.";
  DocumentationResources2.Text_GetCharacter = "Given the character code, gets the character it represents.";
  DocumentationResources2.Text_GetCharacter_CharacterCode = "The character code (Unicode) in question.";
  DocumentationResources2.Text_GetCharacterCode = "Given a character, gets its character code.";
  DocumentationResources2.Text_GetCharacterCode_Character = "The character whose code is requested.";
  DocumentationResources2.Text_GetIndexOf = "Finds the position of the first occurrence of the specified sub text.";
  DocumentationResources2.Text_GetIndexOf_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_GetIndexOf_SubText = "The sub text to search for.";
  DocumentationResources2.Text_GetLength = "Gets the length of the given text.";
  DocumentationResources2.Text_GetLength_Text = "The text whose length is requested.";
  DocumentationResources2.Text_GetSubText = "Gets a sub text from the given text.";
  DocumentationResources2.Text_GetSubText_Text = "The text from which the sub text is requested.";
  DocumentationResources2.Text_GetSubText_Start = "The start position of the sub text (1-based).";
  DocumentationResources2.Text_GetSubText_Length = "The length of the sub text.";
  DocumentationResources2.Text_GetSubTextToEnd = "Gets a sub text from the given text, from the specified position to the end.";
  DocumentationResources2.Text_GetSubTextToEnd_Text = "The text from which the sub text is requested.";
  DocumentationResources2.Text_GetSubTextToEnd_Start = "The start position of the sub text (1-based).";
  DocumentationResources2.Text_GetWord = "Gets the word at the specified index of the given text.";
  DocumentationResources2.Text_GetWord_Text = "The text from which the word is requested.";
  DocumentationResources2.Text_GetWord_Index = "The index of the word (1-based).";
  DocumentationResources2.Text_GetWordCount = "Gets the number of words in the given text.";
  DocumentationResources2.Text_GetWordCount_Text = "The text whose word count is requested.";
  DocumentationResources2.Text_IsSubText = "Gets whether or not the specified sub text occurs within the given text.";
  DocumentationResources2.Text_IsSubText_Text = "The larger text within which the sub text will be searched.";
  DocumentationResources2.Text_IsSubText_SubText = "The sub text to search for.";
  DocumentationResources2.File = "The File object provides methods to access, read and write information from files on your computer.";
  DocumentationResources2.File_AppendContents = "Appends the specified contents to a file. If the file exists, the contents are appended at the end.";
  DocumentationResources2.File_AppendContents_FilePath = "The path of the file.";
  DocumentationResources2.File_AppendContents_Contents = "The contents to append to the file.";
  DocumentationResources2.File_CopyFile = "Copies the specified source file to the destination file path.";
  DocumentationResources2.File_CopyFile_SourceFilePath = "The source path of the file to copy.";
  DocumentationResources2.File_CopyFile_DestinationFilePath = "The destination path of the file.";
  DocumentationResources2.File_DeleteDirectory = "Deletes the specified directory.";
  DocumentationResources2.File_DeleteDirectory_DirectoryPath = "The path of the directory to delete.";
  DocumentationResources2.File_DeleteFile = "Deletes the specified file.";
  DocumentationResources2.File_DeleteFile_FilePath = "The path of the file to delete.";
  DocumentationResources2.File_GetDirectories = "Gets the paths of all the directories in the specified path.";
  DocumentationResources2.File_GetDirectories_DirectoryPath = "The path of the directory whose sub directories are requested.";
  DocumentationResources2.File_GetFiles = "Gets the paths of all the files in the specified path.";
  DocumentationResources2.File_GetFiles_DirectoryPath = "The path of the directory whose files are requested.";
  DocumentationResources2.File_GetSettingsFilePath = "Gets the full path where the program settings are stored for the current program.";
  DocumentationResources2.File_GetTemporaryFilePath = "Gets a temporary file path that can be used by the program.";
  DocumentationResources2.File_InsertLine = "Inserts the specified contents as a line at the specified line number of the file.";
  DocumentationResources2.File_InsertLine_FilePath = "The path of the file.";
  DocumentationResources2.File_InsertLine_LineNumber = "The line number where the contents will be inserted (1-based).";
  DocumentationResources2.File_InsertLine_Contents = "The contents to insert into the file.";
  DocumentationResources2.File_ReadContents = "Reads the entire contents of the specified file.";
  DocumentationResources2.File_ReadContents_FilePath = "The path of the file to read.";
  DocumentationResources2.File_ReadLine = "Reads a line from the specified file at the specified line number.";
  DocumentationResources2.File_ReadLine_FilePath = "The path of the file to read.";
  DocumentationResources2.File_ReadLine_LineNumber = "The line number to read (1-based).";
  DocumentationResources2.ImageList = "The ImageList object provides the ability to load images from file or the network and draw them on the GraphicsWindow.";
  DocumentationResources2.ImageList_LoadImage = "Loads an image from the given file or URL into memory.";
  DocumentationResources2.ImageList_LoadImage_FileName = "The name of the file or URL to load the image from.";
  DocumentationResources2.ImageList_GetWidthOfImage = "Gets the width of the specified image.";
  DocumentationResources2.ImageList_GetWidthOfImage_ImageName = "The name of the image in question.";
  DocumentationResources2.ImageList_GetHeightOfImage = "Gets the height of the specified image.";
  DocumentationResources2.ImageList_GetHeightOfImage_ImageName = "The name of the image in question.";
  DocumentationResources2.Sound = "The Sound object provides operations that make the application play sounds. There are two options here. One is to use the built-in bell ring, chime, etc. The other is to play .mp3 or .wav files.";
  DocumentationResources2.Sound_Play = "Plays the specified sound file. This will return as soon as the sound starts to play.";
  DocumentationResources2.Sound_Play_FilePath = "The full path of the sound file to play.";
  DocumentationResources2.Sound_Pause = "Pauses the currently playing sound.";
  DocumentationResources2.Sound_Resume = "Resumes playing a previously paused sound.";
  DocumentationResources2.Sound_Stop = "Stops the currently playing sound.";
  DocumentationResources2.Sound_PlayBellRing = "Plays the built-in bell ring sound.";
  DocumentationResources2.Sound_PlayChime = "Plays the built-in chime sound.";
  DocumentationResources2.Sound_PlayMusic = "Plays music from musical notes. Musical notes are represented in a simplified notation, e.g. C4:1 C4:2 D4:2.";
  DocumentationResources2.Sound_PlayMusic_MusicNotes = "The musical notes to play.";
  DocumentationResources2.Timer = "The Timer object provides an easy way for doing something repeatedly over a period of time.";
  DocumentationResources2.Timer_Interval = "Gets or sets the interval (in milliseconds) at which the timer raises the Tick event.";
  DocumentationResources2.Timer_Pause = "Pauses the timer. The Tick event will not be raised while the timer is paused.";
  DocumentationResources2.Timer_Resume = "Resumes the timer from a previously paused state.";
  DocumentationResources2.Timer_Tick = "Raises an event at the interval specified in the Interval property.";
  DocumentationResources2.Mouse = "The Mouse object provides access to the properties of the mouse.";
  DocumentationResources2.Mouse_IsLeftButtonDown = "Gets whether or not the left button of the mouse is pressed.";
  DocumentationResources2.Mouse_IsRightButtonDown = "Gets whether or not the right button of the mouse is pressed.";
  DocumentationResources2.Mouse_ShowCursor = "Shows the mouse cursor on the screen.";
  DocumentationResources2.Mouse_HideCursor = "Hides the mouse cursor from the screen.";
  DocumentationResources2.Desktop = "The Desktop object provides access to the properties of the desktop.";
  DocumentationResources2.Desktop_Height = "Gets the height of the primary desktop.";
  DocumentationResources2.Desktop_Width = "Gets the width of the primary desktop.";
  DocumentationResources2.Desktop_SetWallPaper = "Sets the specified image as the desktop wallpaper.";
  DocumentationResources2.Desktop_SetWallPaper_FilePath = "The full path of the image file.";
  DocumentationResources2.Dictionary = "This object provides access to an online Dictionary.";
  DocumentationResources2.Dictionary_GetDefinition = "Gets the definition of the specified English word.";
  DocumentationResources2.Dictionary_GetDefinition_EnglishWord = "The English word to look up.";
  DocumentationResources2.Network = "The Network object allows you to download web pages and files.";
  DocumentationResources2.Network_DownloadFile = "Downloads the file from the specified URL and stores it in a temporary file which is returned.";
  DocumentationResources2.Network_DownloadFile_URL = "The URL of the file to download.";
  DocumentationResources2.Network_GetWebPageContents = "Gets the contents of the specified web page.";
  DocumentationResources2.Network_GetWebPageContents_URL = "The URL of the web page.";
  DocumentationResources2.Flickr = "This object provides access to the Flickr online photo service.";
  DocumentationResources2.Flickr_GetPictureOfMoment = "Gets the picture of the moment from Flickr and returns its temporary local file path.";
  DocumentationResources2.Flickr_GetRandomPicture = "Gets a random picture from Flickr and returns its temporary local file path.";
  DocumentationResources2.Flickr_GetPictureOfMomentWithTag = "Gets the picture of the moment with the specified tag from Flickr.";
  DocumentationResources2.Flickr_GetPictureOfMomentWithTag_Tag = "The tag of the picture.";
  DocumentationResources2.Flickr_GetRandomPictureWithTag = "Gets a random picture with the specified tag from Flickr.";
  DocumentationResources2.Flickr_GetRandomPictureWithTag_Tag = "The tag of the picture.";
  function get(key) {
    return DocumentationResources2[key];
  }
  DocumentationResources2.get = get;
})(DocumentationResources || (DocumentationResources = {}));

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries-metadata.ts
var MethodMetadata = class {
  constructor(typeName, methodName, returnsValue, parameters) {
    this.typeName = typeName;
    this.methodName = methodName;
    this.returnsValue = returnsValue;
    this.parameters = parameters;
  }
  typeName;
  methodName;
  returnsValue;
  parameters;
  get description() {
    return DocumentationResources.get(`${this.typeName}_${this.methodName}`);
  }
  parameterDescription(name) {
    return DocumentationResources.get(`${this.typeName}_${this.methodName}_${name}`) ?? name;
  }
};
var PropertyMetadata = class {
  constructor(typeName, propertyName, hasGetter, hasSetter) {
    this.typeName = typeName;
    this.propertyName = propertyName;
    this.hasGetter = hasGetter;
    this.hasSetter = hasSetter;
  }
  typeName;
  propertyName;
  hasGetter;
  hasSetter;
  get description() {
    return DocumentationResources.get(`${this.typeName}_${this.propertyName}`);
  }
};
var EventMetadata = class {
  constructor(typeName, eventName) {
    this.typeName = typeName;
    this.eventName = eventName;
  }
  typeName;
  eventName;
  get description() {
    return DocumentationResources.get(`${this.typeName}_${this.eventName}`);
  }
};
var TypeMetadata = class {
  constructor(typeName, methods, properties, events) {
    this.typeName = typeName;
    this.methods = methods;
    this.properties = properties;
    this.events = events;
  }
  typeName;
  methods;
  properties;
  events;
  get description() {
    return DocumentationResources.get(this.typeName);
  }
};
var LibrariesMetadata = class {
  Array = new TypeMetadata(
    "Array",
    {
      IsArray: new MethodMetadata("Array", "IsArray", true, ["Value"]),
      GetItemCount: new MethodMetadata("Array", "GetItemCount", true, ["Array"]),
      GetAllIndices: new MethodMetadata("Array", "GetAllIndices", true, ["Array"]),
      ContainsValue: new MethodMetadata("Array", "ContainsValue", true, ["Array", "Index"]),
      ContainsIndex: new MethodMetadata("Array", "ContainsIndex", true, ["Array", "Index"]),
      GetValue: new MethodMetadata("Array", "GetValue", true, ["ArrayName", "Index"]),
      RemoveValue: new MethodMetadata("Array", "RemoveValue", false, ["ArrayName", "Index"]),
      SetValue: new MethodMetadata("Array", "SetValue", false, ["ArrayName", "Index", "Value"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Clock = new TypeMetadata(
    "Clock",
    {
      // No Methods
    },
    {
      Time: new PropertyMetadata("Clock", "Time", true, false)
    },
    {
      // No Events
    }
  );
  Controls = new TypeMetadata(
    "Controls",
    {
      AddButton: new MethodMetadata("Controls", "AddButton", true, ["Caption", "Left", "Top"]),
      GetButtonCaption: new MethodMetadata("Controls", "GetButtonCaption", true, ["ButtonName"]),
      SetButtonCaption: new MethodMetadata("Controls", "SetButtonCaption", false, ["ButtonName", "Caption"]),
      AddTextBox: new MethodMetadata("Controls", "AddTextBox", true, ["Left", "Top"]),
      AddMultiLineTextBox: new MethodMetadata("Controls", "AddMultiLineTextBox", true, ["Left", "Top"]),
      GetTextBoxText: new MethodMetadata("Controls", "GetTextBoxText", true, ["TextBoxName"]),
      SetTextBoxText: new MethodMetadata("Controls", "SetTextBoxText", true, ["TextBoxName", "Text"]),
      Remove: new MethodMetadata("Controls", "Remove", false, ["ControlName"]),
      Move: new MethodMetadata("Controls", "Move", false, ["Control", "X", "Y"]),
      SetSize: new MethodMetadata("Controls", "SetSize", false, ["Control", "Width", "Height"]),
      HideControl: new MethodMetadata("Controls", "HideControl", false, ["ControlName"]),
      ShowControl: new MethodMetadata("Controls", "ShowControl", false, ["ControlName"])
    },
    {
      LastClickedButton: new PropertyMetadata("Controls", "LastClickedButton", true, false),
      LastTypedTextBox: new PropertyMetadata("Controls", "LastTypedTextBox", true, false)
    },
    {
      ButtonClicked: new EventMetadata("Controls", "ButtonClicked"),
      TextTyped: new EventMetadata("Controls", "TextTyped")
    }
  );
  Desktop = new TypeMetadata(
    "Desktop",
    {
      SetWallPaper: new MethodMetadata("Desktop", "SetWallPaper", false, ["FilePath"])
    },
    {
      Height: new PropertyMetadata("Desktop", "Height", true, false),
      Width: new PropertyMetadata("Desktop", "Width", true, false)
    },
    {
      // No Events
    }
  );
  Dictionary = new TypeMetadata(
    "Dictionary",
    {
      GetDefinition: new MethodMetadata("Dictionary", "GetDefinition", true, ["EnglishWord"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  File = new TypeMetadata(
    "File",
    {
      AppendContents: new MethodMetadata("File", "AppendContents", false, ["FilePath", "Contents"]),
      CopyFile: new MethodMetadata("File", "CopyFile", false, ["SourceFilePath", "DestinationFilePath"]),
      DeleteDirectory: new MethodMetadata("File", "DeleteDirectory", false, ["DirectoryPath"]),
      DeleteFile: new MethodMetadata("File", "DeleteFile", false, ["FilePath"]),
      GetDirectories: new MethodMetadata("File", "GetDirectories", true, ["DirectoryPath"]),
      GetFiles: new MethodMetadata("File", "GetFiles", true, ["DirectoryPath"]),
      GetSettingsFilePath: new MethodMetadata("File", "GetSettingsFilePath", true, []),
      GetTemporaryFilePath: new MethodMetadata("File", "GetTemporaryFilePath", true, []),
      InsertLine: new MethodMetadata("File", "InsertLine", false, ["FilePath", "LineNumber", "Contents"]),
      ReadContents: new MethodMetadata("File", "ReadContents", true, ["FilePath"]),
      ReadLine: new MethodMetadata("File", "ReadLine", true, ["FilePath", "LineNumber"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Flickr = new TypeMetadata(
    "Flickr",
    {
      GetPictureOfMoment: new MethodMetadata("Flickr", "GetPictureOfMoment", true, []),
      GetPictureOfMomentWithTag: new MethodMetadata("Flickr", "GetPictureOfMomentWithTag", true, ["Tag"]),
      GetRandomPicture: new MethodMetadata("Flickr", "GetRandomPicture", true, []),
      GetRandomPictureWithTag: new MethodMetadata("Flickr", "GetRandomPictureWithTag", true, ["Tag"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  GraphicsWindow = new TypeMetadata(
    "GraphicsWindow",
    {
      Clear: new MethodMetadata("GraphicsWindow", "Clear", false, []),
      DrawBoundText: new MethodMetadata("GraphicsWindow", "DrawBoundText", false, ["X", "Y", "Width", "Text"]),
      DrawEllipse: new MethodMetadata("GraphicsWindow", "DrawEllipse", false, ["X", "Y", "Width", "Height"]),
      DrawImage: new MethodMetadata("GraphicsWindow", "DrawImage", false, ["ImageName", "X", "Y"]),
      DrawLine: new MethodMetadata("GraphicsWindow", "DrawLine", false, ["X1", "Y1", "X2", "Y2"]),
      DrawRectangle: new MethodMetadata("GraphicsWindow", "DrawRectangle", false, ["X", "Y", "Width", "Height"]),
      DrawResizedImage: new MethodMetadata("GraphicsWindow", "DrawResizedImage", false, ["ImageName", "X", "Y", "Width", "Height"]),
      DrawText: new MethodMetadata("GraphicsWindow", "DrawText", false, ["X", "Y", "Text"]),
      DrawTriangle: new MethodMetadata("GraphicsWindow", "DrawTriangle", false, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
      FillEllipse: new MethodMetadata("GraphicsWindow", "FillEllipse", false, ["X", "Y", "Width", "Height"]),
      FillRectangle: new MethodMetadata("GraphicsWindow", "FillRectangle", false, ["X", "Y", "Width", "Height"]),
      FillTriangle: new MethodMetadata("GraphicsWindow", "FillTriangle", false, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
      GetColorFromRGB: new MethodMetadata("GraphicsWindow", "GetColorFromRGB", true, ["Red", "Green", "Blue"]),
      GetPixel: new MethodMetadata("GraphicsWindow", "GetPixel", true, ["X", "Y"]),
      GetRandomColor: new MethodMetadata("GraphicsWindow", "GetRandomColor", true, []),
      Hide: new MethodMetadata("GraphicsWindow", "Hide", false, []),
      SetPixel: new MethodMetadata("GraphicsWindow", "SetPixel", false, ["X", "Y", "Color"]),
      Show: new MethodMetadata("GraphicsWindow", "Show", false, []),
      ShowMessage: new MethodMetadata("GraphicsWindow", "ShowMessage", false, ["Text", "Title"])
    },
    {
      BackgroundColor: new PropertyMetadata("GraphicsWindow", "BackgroundColor", true, true),
      BrushColor: new PropertyMetadata("GraphicsWindow", "BrushColor", true, true),
      CanResize: new PropertyMetadata("GraphicsWindow", "CanResize", true, true),
      FontBold: new PropertyMetadata("GraphicsWindow", "FontBold", true, true),
      FontItalic: new PropertyMetadata("GraphicsWindow", "FontItalic", true, true),
      FontName: new PropertyMetadata("GraphicsWindow", "FontName", true, true),
      FontSize: new PropertyMetadata("GraphicsWindow", "FontSize", true, true),
      Height: new PropertyMetadata("GraphicsWindow", "Height", true, true),
      LastKey: new PropertyMetadata("GraphicsWindow", "LastKey", true, false),
      LastText: new PropertyMetadata("GraphicsWindow", "LastText", true, false),
      Left: new PropertyMetadata("GraphicsWindow", "Left", true, true),
      MouseX: new PropertyMetadata("GraphicsWindow", "MouseX", true, false),
      MouseY: new PropertyMetadata("GraphicsWindow", "MouseY", true, false),
      PenColor: new PropertyMetadata("GraphicsWindow", "PenColor", true, true),
      PenWidth: new PropertyMetadata("GraphicsWindow", "PenWidth", true, true),
      Title: new PropertyMetadata("GraphicsWindow", "Title", true, true),
      Top: new PropertyMetadata("GraphicsWindow", "Top", true, true),
      Width: new PropertyMetadata("GraphicsWindow", "Width", true, true)
    },
    {
      KeyDown: new EventMetadata("GraphicsWindow", "KeyDown"),
      KeyUp: new EventMetadata("GraphicsWindow", "KeyUp"),
      MouseDown: new EventMetadata("GraphicsWindow", "MouseDown"),
      MouseMove: new EventMetadata("GraphicsWindow", "MouseMove"),
      MouseUp: new EventMetadata("GraphicsWindow", "MouseUp"),
      TextInput: new EventMetadata("GraphicsWindow", "TextInput")
    }
  );
  ImageList = new TypeMetadata(
    "ImageList",
    {
      GetHeightOfImage: new MethodMetadata("ImageList", "GetHeightOfImage", true, ["ImageName"]),
      GetWidthOfImage: new MethodMetadata("ImageList", "GetWidthOfImage", true, ["ImageName"]),
      LoadImage: new MethodMetadata("ImageList", "LoadImage", true, ["FileName"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Mouse = new TypeMetadata(
    "Mouse",
    {
      HideCursor: new MethodMetadata("Mouse", "HideCursor", false, []),
      ShowCursor: new MethodMetadata("Mouse", "ShowCursor", false, [])
    },
    {
      IsLeftButtonDown: new PropertyMetadata("Mouse", "IsLeftButtonDown", true, false),
      IsRightButtonDown: new PropertyMetadata("Mouse", "IsRightButtonDown", true, false)
    },
    {
      // No Events
    }
  );
  Network = new TypeMetadata(
    "Network",
    {
      DownloadFile: new MethodMetadata("Network", "DownloadFile", true, ["URL"]),
      GetWebPageContents: new MethodMetadata("Network", "GetWebPageContents", true, ["URL"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Sound = new TypeMetadata(
    "Sound",
    {
      Pause: new MethodMetadata("Sound", "Pause", false, []),
      Play: new MethodMetadata("Sound", "Play", false, ["FilePath"]),
      PlayBellRing: new MethodMetadata("Sound", "PlayBellRing", false, []),
      PlayChime: new MethodMetadata("Sound", "PlayChime", false, []),
      PlayMusic: new MethodMetadata("Sound", "PlayMusic", false, ["MusicNotes"]),
      Resume: new MethodMetadata("Sound", "Resume", false, []),
      Stop: new MethodMetadata("Sound", "Stop", false, [])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Text = new TypeMetadata(
    "Text",
    {
      Append: new MethodMetadata("Text", "Append", true, ["Text1", "Text2"]),
      ConvertToLowerCase: new MethodMetadata("Text", "ConvertToLowerCase", true, ["Text"]),
      ConvertToUpperCase: new MethodMetadata("Text", "ConvertToUpperCase", true, ["Text"]),
      EndsWith: new MethodMetadata("Text", "EndsWith", true, ["Text", "SubText"]),
      GetCharacter: new MethodMetadata("Text", "GetCharacter", true, ["CharacterCode"]),
      GetCharacterCode: new MethodMetadata("Text", "GetCharacterCode", true, ["Character"]),
      GetIndexOf: new MethodMetadata("Text", "GetIndexOf", true, ["Text", "SubText"]),
      GetLength: new MethodMetadata("Text", "GetLength", true, ["Text"]),
      GetSubText: new MethodMetadata("Text", "GetSubText", true, ["Text", "Start", "Length"]),
      GetSubTextToEnd: new MethodMetadata("Text", "GetSubTextToEnd", true, ["Text", "Start"]),
      GetWord: new MethodMetadata("Text", "GetWord", true, ["Text", "Index"]),
      GetWordCount: new MethodMetadata("Text", "GetWordCount", true, ["Text"]),
      IsSubText: new MethodMetadata("Text", "IsSubText", true, ["Text", "SubText"]),
      StartsWith: new MethodMetadata("Text", "StartsWith", true, ["Text", "SubText"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Timer = new TypeMetadata(
    "Timer",
    {
      Pause: new MethodMetadata("Timer", "Pause", false, []),
      Resume: new MethodMetadata("Timer", "Resume", false, [])
    },
    {
      Interval: new PropertyMetadata("Timer", "Interval", true, true)
    },
    {
      Tick: new EventMetadata("Timer", "Tick")
    }
  );
  Math = new TypeMetadata(
    "Math",
    {
      Abs: new MethodMetadata("Math", "Abs", true, ["Number"]),
      Remainder: new MethodMetadata("Math", "Remainder", true, ["Dividend", "Divisor"]),
      Cos: new MethodMetadata("Math", "Cos", true, ["Angle"]),
      Sin: new MethodMetadata("Math", "Sin", true, ["Angle"]),
      Tan: new MethodMetadata("Math", "Tan", true, ["Angle"]),
      ArcCos: new MethodMetadata("Math", "ArcCos", true, ["CosValue"]),
      ArcSin: new MethodMetadata("Math", "ArcSin", true, ["SinValue"]),
      ArcTan: new MethodMetadata("Math", "ArcTan", true, ["TanValue"]),
      Ceiling: new MethodMetadata("Math", "Ceiling", true, ["Number"]),
      Floor: new MethodMetadata("Math", "Floor", true, ["Number"]),
      Round: new MethodMetadata("Math", "Round", true, ["Number"]),
      GetDegrees: new MethodMetadata("Math", "GetDegrees", true, ["Angle"]),
      GetRadians: new MethodMetadata("Math", "GetRadians", true, ["Angle"]),
      GetRandomNumber: new MethodMetadata("Math", "GetRandomNumber", true, ["MaxNumber"]),
      Log: new MethodMetadata("Math", "Log", true, ["Number"]),
      NaturalLog: new MethodMetadata("Math", "NaturalLog", true, ["Number"]),
      Max: new MethodMetadata("Math", "Max", true, ["Number1", "Number2"]),
      Min: new MethodMetadata("Math", "Min", true, ["Number1", "Number2"]),
      Power: new MethodMetadata("Math", "Power", true, ["BaseNumber", "Exponent"]),
      SquareRoot: new MethodMetadata("Math", "SquareRoot", true, ["Number"])
    },
    {
      Pi: new PropertyMetadata("Math", "Pi", true, false)
    },
    {
      // No Events
    }
  );
  Program = new TypeMetadata(
    "Program",
    {
      Delay: new MethodMetadata("Program", "Delay", false, ["milliSeconds"]),
      Pause: new MethodMetadata("Program", "Pause", false, []),
      End: new MethodMetadata("Program", "End", false, [])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Shapes = new TypeMetadata(
    "Shapes",
    {
      AddRectangle: new MethodMetadata("Shapes", "AddRectangle", true, ["Width", "Height"]),
      AddEllipse: new MethodMetadata("Shapes", "AddEllipse", true, ["Width", "Height"]),
      AddTriangle: new MethodMetadata("Shapes", "AddTriangle", true, ["X1", "Y1", "X2", "Y2", "X3", "Y3"]),
      AddLine: new MethodMetadata("Shapes", "AddLine", true, ["X1", "Y1", "X2", "Y2"]),
      AddImage: new MethodMetadata("Shapes", "AddImage", true, ["ImageName"]),
      AddText: new MethodMetadata("Shapes", "AddText", true, ["Text"]),
      SetText: new MethodMetadata("Shapes", "SetText", false, ["ShapeName", "Text"]),
      Remove: new MethodMetadata("Shapes", "Remove", false, ["ShapeName"]),
      Move: new MethodMetadata("Shapes", "Move", false, ["ShapeName", "X", "Y"]),
      Rotate: new MethodMetadata("Shapes", "Rotate", false, ["ShapeName", "Angle"]),
      Zoom: new MethodMetadata("Shapes", "Zoom", false, ["ShapeName", "ScaleX", "ScaleY"]),
      Animate: new MethodMetadata("Shapes", "Animate", false, ["ShapeName", "X", "Y", "Duration"]),
      GetLeft: new MethodMetadata("Shapes", "GetLeft", true, ["ShapeName"]),
      GetTop: new MethodMetadata("Shapes", "GetTop", true, ["ShapeName"]),
      GetOpacity: new MethodMetadata("Shapes", "GetOpacity", true, ["ShapeName"]),
      SetOpacity: new MethodMetadata("Shapes", "SetOpacity", false, ["ShapeName", "Level"]),
      HideShape: new MethodMetadata("Shapes", "HideShape", false, ["ShapeName"]),
      ShowShape: new MethodMetadata("Shapes", "ShowShape", false, ["ShapeName"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  Stack = new TypeMetadata(
    "Stack",
    {
      PushValue: new MethodMetadata("Stack", "PushValue", false, ["StackName", "Value"]),
      GetCount: new MethodMetadata("Stack", "GetCount", true, ["StackName"]),
      PopValue: new MethodMetadata("Stack", "PopValue", true, ["StackName"])
    },
    {
      // No Properties
    },
    {
      // No Events
    }
  );
  TextWindow = new TypeMetadata(
    "TextWindow",
    {
      Read: new MethodMetadata("TextWindow", "Read", true, []),
      ReadNumber: new MethodMetadata("TextWindow", "ReadNumber", true, []),
      Write: new MethodMetadata("TextWindow", "Write", false, ["Data"]),
      WriteLine: new MethodMetadata("TextWindow", "WriteLine", false, ["Data"])
    },
    {
      ForegroundColor: new PropertyMetadata("TextWindow", "ForegroundColor", true, true),
      BackgroundColor: new PropertyMetadata("TextWindow", "BackgroundColor", true, true)
    },
    {
      // No Events
    }
  );
  Turtle = new TypeMetadata(
    "Turtle",
    {
      Show: new MethodMetadata("Turtle", "Show", false, []),
      Hide: new MethodMetadata("Turtle", "Hide", false, []),
      PenDown: new MethodMetadata("Turtle", "PenDown", false, []),
      PenUp: new MethodMetadata("Turtle", "PenUp", false, []),
      Move: new MethodMetadata("Turtle", "Move", false, ["Distance"]),
      MoveTo: new MethodMetadata("Turtle", "MoveTo", false, ["X", "Y"]),
      Turn: new MethodMetadata("Turtle", "Turn", false, ["Angle"]),
      TurnLeft: new MethodMetadata("Turtle", "TurnLeft", false, []),
      TurnRight: new MethodMetadata("Turtle", "TurnRight", false, [])
    },
    {
      Speed: new PropertyMetadata("Turtle", "Speed", true, true),
      Angle: new PropertyMetadata("Turtle", "Angle", true, true),
      X: new PropertyMetadata("Turtle", "X", true, true),
      Y: new PropertyMetadata("Turtle", "Y", true, true)
    },
    {
      // No Events
    }
  );
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/math.ts
init_polyfills();
var MathLibrary = class {
  getPi() {
    return new NumberValue(Math.PI);
  }
  executeCalculation(engine, calculation) {
    const args = new Array(calculation.length);
    for (let i = args.length - 1; i >= 0; i--) {
      const value = engine.popEvaluationStack().tryConvertToNumber();
      if (value.kind === 1 /* Number */) {
        args[i] = value.value;
      } else {
        engine.pushEvaluationStack(new NumberValue(0));
        return;
      }
    }
    const result = calculation(...args);
    if (engine.state !== 3 /* Terminated */) {
      engine.pushEvaluationStack(new NumberValue(result));
    }
  }
  executeRemainder(engine, _, range) {
    return this.executeCalculation(engine, (dividend, divisor) => {
      if (divisor === 0) {
        engine.terminate(new Diagnostic(29 /* CannotDivideByZero */, range));
        return 0;
      }
      return dividend % divisor;
    });
  }
  methods = {
    Abs: { execute: (engine) => this.executeCalculation(engine, Math.abs) },
    Remainder: { execute: this.executeRemainder.bind(this) },
    Cos: { execute: (engine) => this.executeCalculation(engine, Math.cos) },
    Sin: { execute: (engine) => this.executeCalculation(engine, Math.sin) },
    Tan: { execute: (engine) => this.executeCalculation(engine, Math.tan) },
    ArcCos: { execute: (engine) => this.executeCalculation(engine, Math.acos) },
    ArcSin: { execute: (engine) => this.executeCalculation(engine, Math.asin) },
    ArcTan: { execute: (engine) => this.executeCalculation(engine, Math.atan) },
    Ceiling: { execute: (engine) => this.executeCalculation(engine, Math.ceil) },
    Floor: { execute: (engine) => this.executeCalculation(engine, Math.floor) },
    Round: { execute: (engine) => this.executeCalculation(engine, Math.round) },
    GetDegrees: { execute: (engine) => this.executeCalculation(engine, (angle) => 180 * angle / Math.PI % 360) },
    GetRadians: { execute: (engine) => this.executeCalculation(engine, (angle) => angle % 360 * Math.PI / 180) },
    GetRandomNumber: { execute: (engine) => this.executeCalculation(engine, (maxNumber) => Math.floor(Math.random() * (Math.max(1, maxNumber) - 1)) + 1) },
    Log: { execute: (engine) => this.executeCalculation(engine, (value) => Math.log(value) / Math.LN10) },
    NaturalLog: { execute: (engine) => this.executeCalculation(engine, Math.log) },
    Max: { execute: (engine) => this.executeCalculation(engine, (value1, value2) => Math.max(value1, value2)) },
    Min: { execute: (engine) => this.executeCalculation(engine, (value1, value2) => Math.min(value1, value2)) },
    Power: { execute: (engine) => this.executeCalculation(engine, (baseNumber, exponent) => Math.pow(baseNumber, exponent)) },
    SquareRoot: { execute: (engine) => this.executeCalculation(engine, (value) => value < 0 ? 0 : Math.sqrt(value)) }
  };
  properties = {
    Pi: { getter: this.getPi.bind(this) }
  };
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/graphics-window.ts
init_polyfills();
function toBooleanString(value) {
  return new StringValue(value ? Constants.True : Constants.False);
}
function popString(engine) {
  return engine.popEvaluationStack().toValueString();
}
function popNumber(engine) {
  const value = engine.popEvaluationStack().tryConvertToNumber();
  return value instanceof NumberValue ? value.value : 0;
}
function getNumber(value) {
  const converted = value.tryConvertToNumber();
  return converted instanceof NumberValue ? converted.value : 0;
}
var GraphicsWindowLibrary = class {
  _pluginInstance;
  keyDownEvent = new SubModuleLibraryEvent();
  keyUpEvent = new SubModuleLibraryEvent();
  mouseDownEvent = new SubModuleLibraryEvent();
  mouseMoveEvent = new SubModuleLibraryEvent();
  mouseUpEvent = new SubModuleLibraryEvent();
  textInputEvent = new SubModuleLibraryEvent();
  get plugin() {
    if (!this._pluginInstance) {
      throw new Error("Plugin is not set.");
    }
    return this._pluginInstance;
  }
  set plugin(plugin) {
    this._pluginInstance = plugin;
  }
  getString(getter) {
    return new StringValue(getter());
  }
  getNumber(getter) {
    return new NumberValue(getter());
  }
  getBoolean(getter) {
    return toBooleanString(getter());
  }
  executeDrawBoundText(engine) {
    const text = popString(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawBoundText(x, y, width, text);
  }
  executeDrawEllipse(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawEllipse(x, y, width, height);
  }
  executeDrawImage(engine) {
    const y = popNumber(engine);
    const x = popNumber(engine);
    const imageName = popString(engine);
    this.plugin.drawImage(imageName, x, y);
  }
  executeDrawLine(engine) {
    const y2 = popNumber(engine);
    const x2 = popNumber(engine);
    const y1 = popNumber(engine);
    const x1 = popNumber(engine);
    this.plugin.drawLine(x1, y1, x2, y2);
  }
  executeDrawRectangle(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawRectangle(x, y, width, height);
  }
  executeDrawResizedImage(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    const imageName = popString(engine);
    this.plugin.drawResizedImage(imageName, x, y, width, height);
  }
  executeDrawText(engine) {
    const text = popString(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.drawText(x, y, text);
  }
  executeDrawTriangle(engine) {
    const y3 = popNumber(engine);
    const x3 = popNumber(engine);
    const y2 = popNumber(engine);
    const x2 = popNumber(engine);
    const y1 = popNumber(engine);
    const x1 = popNumber(engine);
    this.plugin.drawTriangle(x1, y1, x2, y2, x3, y3);
  }
  executeFillEllipse(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.fillEllipse(x, y, width, height);
  }
  executeFillRectangle(engine) {
    const height = popNumber(engine);
    const width = popNumber(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.fillRectangle(x, y, width, height);
  }
  executeFillTriangle(engine) {
    const y3 = popNumber(engine);
    const x3 = popNumber(engine);
    const y2 = popNumber(engine);
    const x2 = popNumber(engine);
    const y1 = popNumber(engine);
    const x1 = popNumber(engine);
    this.plugin.fillTriangle(x1, y1, x2, y2, x3, y3);
  }
  executeGetColorFromRGB(engine) {
    const blue = popNumber(engine);
    const green = popNumber(engine);
    const red = popNumber(engine);
    engine.pushEvaluationStack(new StringValue(this.plugin.getColorFromRGB(red, green, blue)));
  }
  executeGetPixel(engine) {
    const y = popNumber(engine);
    const x = popNumber(engine);
    engine.pushEvaluationStack(new StringValue(this.plugin.getPixel(x, y)));
  }
  executeGetRandomColor(engine) {
    engine.pushEvaluationStack(new StringValue(this.plugin.getRandomColor()));
  }
  executeSetPixel(engine) {
    const color = popString(engine);
    const y = popNumber(engine);
    const x = popNumber(engine);
    this.plugin.setPixel(x, y, color);
  }
  executeShowMessage(engine) {
    const title = popString(engine);
    const text = popString(engine);
    this.plugin.showMessage(text, title);
  }
  methods = {
    Clear: { execute: () => this.plugin.clear() },
    DrawBoundText: { execute: this.executeDrawBoundText.bind(this) },
    DrawEllipse: { execute: this.executeDrawEllipse.bind(this) },
    DrawImage: { execute: this.executeDrawImage.bind(this) },
    DrawLine: { execute: this.executeDrawLine.bind(this) },
    DrawRectangle: { execute: this.executeDrawRectangle.bind(this) },
    DrawResizedImage: { execute: this.executeDrawResizedImage.bind(this) },
    DrawText: { execute: this.executeDrawText.bind(this) },
    DrawTriangle: { execute: this.executeDrawTriangle.bind(this) },
    FillEllipse: { execute: this.executeFillEllipse.bind(this) },
    FillRectangle: { execute: this.executeFillRectangle.bind(this) },
    FillTriangle: { execute: this.executeFillTriangle.bind(this) },
    GetColorFromRGB: { execute: this.executeGetColorFromRGB.bind(this) },
    GetPixel: { execute: this.executeGetPixel.bind(this) },
    GetRandomColor: { execute: this.executeGetRandomColor.bind(this) },
    Hide: { execute: () => this.plugin.hide() },
    SetPixel: { execute: this.executeSetPixel.bind(this) },
    Show: { execute: () => this.plugin.show() },
    ShowMessage: { execute: this.executeShowMessage.bind(this) }
  };
  properties = {
    BackgroundColor: {
      getter: () => this.getString(() => this.plugin.getBackgroundColor()),
      setter: (value) => this.plugin.setBackgroundColor(value.toValueString())
    },
    BrushColor: {
      getter: () => this.getString(() => this.plugin.getBrushColor()),
      setter: (value) => this.plugin.setBrushColor(value.toValueString())
    },
    CanResize: {
      getter: () => this.getBoolean(() => this.plugin.getCanResize()),
      setter: (value) => this.plugin.setCanResize(value.toBoolean())
    },
    FontBold: {
      getter: () => this.getBoolean(() => this.plugin.getFontBold()),
      setter: (value) => this.plugin.setFontBold(value.toBoolean())
    },
    FontItalic: {
      getter: () => this.getBoolean(() => this.plugin.getFontItalic()),
      setter: (value) => this.plugin.setFontItalic(value.toBoolean())
    },
    FontName: {
      getter: () => this.getString(() => this.plugin.getFontName()),
      setter: (value) => this.plugin.setFontName(value.toValueString())
    },
    FontSize: {
      getter: () => this.getNumber(() => this.plugin.getFontSize()),
      setter: (value) => this.plugin.setFontSize(getNumber(value))
    },
    Height: {
      getter: () => this.getNumber(() => this.plugin.getHeight()),
      setter: (value) => this.plugin.setHeight(getNumber(value))
    },
    LastKey: {
      getter: () => this.getString(() => this.plugin.getLastKey())
    },
    LastText: {
      getter: () => this.getString(() => this.plugin.getLastText())
    },
    Left: {
      getter: () => this.getNumber(() => this.plugin.getLeft()),
      setter: (value) => this.plugin.setLeft(getNumber(value))
    },
    MouseX: {
      getter: () => this.getNumber(() => this.plugin.getMouseX())
    },
    MouseY: {
      getter: () => this.getNumber(() => this.plugin.getMouseY())
    },
    PenColor: {
      getter: () => this.getString(() => this.plugin.getPenColor()),
      setter: (value) => this.plugin.setPenColor(value.toValueString())
    },
    PenWidth: {
      getter: () => this.getNumber(() => this.plugin.getPenWidth()),
      setter: (value) => this.plugin.setPenWidth(getNumber(value))
    },
    Title: {
      getter: () => this.getString(() => this.plugin.getTitle()),
      setter: (value) => this.plugin.setTitle(value.toValueString())
    },
    Top: {
      getter: () => this.getNumber(() => this.plugin.getTop()),
      setter: (value) => this.plugin.setTop(getNumber(value))
    },
    Width: {
      getter: () => this.getNumber(() => this.plugin.getWidth()),
      setter: (value) => this.plugin.setWidth(getNumber(value))
    }
  };
  events = {
    KeyDown: this.keyDownEvent,
    KeyUp: this.keyUpEvent,
    MouseDown: this.mouseDownEvent,
    MouseMove: this.mouseMoveEvent,
    MouseUp: this.mouseUpEvent,
    TextInput: this.textInputEvent
  };
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/shapes.ts
init_polyfills();
var ShapesLibrary = class {
  _pluginInstance;
  get plugin() {
    if (!this._pluginInstance) {
      throw new Error("Plugin is not set.");
    }
    return this._pluginInstance;
  }
  set plugin(plugin) {
    this._pluginInstance = plugin;
  }
  executeAddRectangle(engine) {
    const heightArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthValue = widthArg.kind === 1 /* Number */ ? widthArg.value : 0;
    const heightValue = heightArg.kind === 1 /* Number */ ? heightArg.value : 0;
    const rectangleName = this.plugin.addRectangle(widthValue, heightValue);
    engine.pushEvaluationStack(new StringValue(rectangleName));
  }
  executeAddEllipse(engine) {
    const heightArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthArg = engine.popEvaluationStack().tryConvertToNumber();
    const widthValue = widthArg.kind === 1 /* Number */ ? widthArg.value : 0;
    const heightValue = heightArg.kind === 1 /* Number */ ? heightArg.value : 0;
    const ellipseName = this.plugin.addEllipse(widthValue, heightValue);
    engine.pushEvaluationStack(new StringValue(ellipseName));
  }
  executeAddTriangle(engine) {
    const y3Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x3Arg = engine.popEvaluationStack().tryConvertToNumber();
    const y2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const y1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Value = x1Arg.kind === 1 /* Number */ ? x1Arg.value : 0;
    const y1Value = y1Arg.kind === 1 /* Number */ ? y1Arg.value : 0;
    const x2Value = x2Arg.kind === 1 /* Number */ ? x2Arg.value : 0;
    const y2Value = y2Arg.kind === 1 /* Number */ ? y2Arg.value : 0;
    const x3Value = x3Arg.kind === 1 /* Number */ ? x3Arg.value : 0;
    const y3Value = y3Arg.kind === 1 /* Number */ ? y3Arg.value : 0;
    const triangleName = this.plugin.addTriangle(x1Value, y1Value, x2Value, y2Value, x3Value, y3Value);
    engine.pushEvaluationStack(new StringValue(triangleName));
  }
  executeAddLine(engine) {
    const y2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x2Arg = engine.popEvaluationStack().tryConvertToNumber();
    const y1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Arg = engine.popEvaluationStack().tryConvertToNumber();
    const x1Value = x1Arg.kind === 1 /* Number */ ? x1Arg.value : 0;
    const y1Value = y1Arg.kind === 1 /* Number */ ? y1Arg.value : 0;
    const x2Value = x2Arg.kind === 1 /* Number */ ? x2Arg.value : 0;
    const y2Value = y2Arg.kind === 1 /* Number */ ? y2Arg.value : 0;
    const lineName = this.plugin.addLine(x1Value, y1Value, x2Value, y2Value);
    engine.pushEvaluationStack(new StringValue(lineName));
  }
  executeAddText(engine) {
    const text = engine.popEvaluationStack().toValueString();
    const shapeName = this.plugin.addText(text);
    engine.pushEvaluationStack(new StringValue(shapeName));
  }
  executeSetText(engine) {
    const text = engine.popEvaluationStack().toValueString();
    const shapeName = engine.popEvaluationStack().toValueString();
    this.plugin.setText(shapeName, text);
  }
  executeRemove(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    this.plugin.remove(shapeName);
  }
  executeMove(engine) {
    const yArg = engine.popEvaluationStack().tryConvertToNumber();
    const xArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const xValue = xArg.kind === 1 /* Number */ ? xArg.value : 0;
    const yValue = yArg.kind === 1 /* Number */ ? yArg.value : 0;
    this.plugin.move(shapeName, xValue, yValue);
  }
  executeRotate(engine) {
    const angleArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const angleValue = angleArg.kind === 1 /* Number */ ? angleArg.value : 0;
    this.plugin.rotate(shapeName, angleValue);
  }
  executeZoom(engine) {
    const scaleYArg = engine.popEvaluationStack().tryConvertToNumber();
    const scaleXArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const scaleX = scaleXArg.kind === 1 /* Number */ ? scaleXArg.value : 0;
    const scaleY = scaleYArg.kind === 1 /* Number */ ? scaleYArg.value : 0;
    this.plugin.zoom(shapeName, scaleX, scaleY);
  }
  executeAnimate(engine) {
    const durationArg = engine.popEvaluationStack().tryConvertToNumber();
    const yArg = engine.popEvaluationStack().tryConvertToNumber();
    const xArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const xValue = xArg.kind === 1 /* Number */ ? xArg.value : 0;
    const yValue = yArg.kind === 1 /* Number */ ? yArg.value : 0;
    const durationValue = durationArg.kind === 1 /* Number */ ? durationArg.value : 0;
    this.plugin.animate(shapeName, xValue, yValue, durationValue);
  }
  executeGetLeft(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    const leftValue = this.plugin.getLeft(shapeName);
    engine.pushEvaluationStack(new NumberValue(leftValue));
  }
  executeGetTop(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    const topValue = this.plugin.getTop(shapeName);
    engine.pushEvaluationStack(new NumberValue(topValue));
  }
  executeGetOpacity(engine) {
    const shapeName = engine.popEvaluationStack().toValueString();
    const opacityValue = this.plugin.getOpacity(shapeName);
    engine.pushEvaluationStack(new NumberValue(opacityValue));
  }
  executeSetOpacity(engine) {
    const levelArg = engine.popEvaluationStack().tryConvertToNumber();
    const shapeName = engine.popEvaluationStack().toValueString();
    const levelValue = levelArg.kind === 1 /* Number */ ? levelArg.value : 0;
    this.plugin.setOpacity(shapeName, levelValue);
  }
  executeSetVisibility(engine, isVisible) {
    const shapeName = engine.popEvaluationStack().toValueString();
    this.plugin.setVisibility(shapeName, isVisible);
  }
  // TODO: implement missing method
  methods = {
    AddRectangle: { execute: this.executeAddRectangle.bind(this) },
    AddEllipse: { execute: this.executeAddEllipse.bind(this) },
    AddTriangle: { execute: this.executeAddTriangle.bind(this) },
    AddLine: { execute: this.executeAddLine.bind(this) },
    AddImage: { execute: () => {
      throw new Error("Not Implemented yet.");
    } },
    AddText: { execute: this.executeAddText.bind(this) },
    SetText: { execute: this.executeSetText.bind(this) },
    Remove: { execute: this.executeRemove.bind(this) },
    Move: { execute: this.executeMove.bind(this) },
    Rotate: { execute: this.executeRotate.bind(this) },
    Zoom: { execute: this.executeZoom.bind(this) },
    Animate: { execute: this.executeAnimate.bind(this) },
    GetLeft: { execute: this.executeGetLeft.bind(this) },
    GetTop: { execute: this.executeGetTop.bind(this) },
    GetOpacity: { execute: this.executeGetOpacity.bind(this) },
    SetOpacity: { execute: this.executeSetOpacity.bind(this) },
    HideShape: { execute: (engine) => this.executeSetVisibility(engine, false) },
    ShowShape: { execute: (engine) => this.executeSetVisibility(engine, true) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries/text.ts
init_polyfills();
function toBooleanString2(value) {
  return new StringValue(value ? Constants.True : Constants.False);
}
function popNumber2(engine) {
  const value = engine.popEvaluationStack().tryConvertToNumber();
  return value instanceof NumberValue ? value.value : 0;
}
function popString2(engine) {
  return engine.popEvaluationStack().toValueString();
}
var TextLibrary = class {
  executeAppend(engine) {
    const text2 = popString2(engine);
    const text1 = popString2(engine);
    engine.pushEvaluationStack(new StringValue(text1 + text2));
  }
  executeConvertToLowerCase(engine) {
    engine.pushEvaluationStack(new StringValue(popString2(engine).toLocaleLowerCase()));
  }
  executeConvertToUpperCase(engine) {
    engine.pushEvaluationStack(new StringValue(popString2(engine).toLocaleUpperCase()));
  }
  executeEndsWith(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(toBooleanString2(text.endsWith(subText)));
  }
  executeGetCharacter(engine) {
    engine.pushEvaluationStack(new StringValue(String.fromCharCode(popNumber2(engine))));
  }
  executeGetCharacterCode(engine) {
    const text = popString2(engine);
    engine.pushEvaluationStack(new NumberValue(text.length > 0 ? text.charCodeAt(0) : 0));
  }
  executeGetIndexOf(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(new NumberValue(text.indexOf(subText) + 1));
  }
  executeGetLength(engine) {
    engine.pushEvaluationStack(new NumberValue(popString2(engine).length));
  }
  executeGetSubText(engine) {
    const length = popNumber2(engine);
    const start = popNumber2(engine) - 1;
    const text = popString2(engine);
    if (start < 0 || start >= text.length || length < 1) {
      engine.pushEvaluationStack(new StringValue(""));
      return;
    }
    const safeLength = Math.min(length, text.length - start);
    engine.pushEvaluationStack(new StringValue(text.substring(start, start + safeLength)));
  }
  executeGetSubTextToEnd(engine) {
    const start = popNumber2(engine) - 1;
    const text = popString2(engine);
    if (start < 0 || start >= text.length) {
      engine.pushEvaluationStack(new StringValue(""));
      return;
    }
    engine.pushEvaluationStack(new StringValue(text.substring(start)));
  }
  executeGetWord(engine) {
    const index = popNumber2(engine) - 1;
    const text = popString2(engine);
    const words = text.trim().length === 0 ? [] : text.trim().split(/\s+/u);
    engine.pushEvaluationStack(new StringValue(index >= 0 && index < words.length ? words[index] : ""));
  }
  executeGetWordCount(engine) {
    const text = popString2(engine);
    const words = text.trim().length === 0 ? [] : text.trim().split(/\s+/u);
    engine.pushEvaluationStack(new NumberValue(words.length));
  }
  executeIsSubText(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(toBooleanString2(text.includes(subText)));
  }
  executeStartsWith(engine) {
    const subText = popString2(engine);
    const text = popString2(engine);
    engine.pushEvaluationStack(toBooleanString2(text.startsWith(subText)));
  }
  methods = {
    Append: { execute: this.executeAppend.bind(this) },
    ConvertToLowerCase: { execute: this.executeConvertToLowerCase.bind(this) },
    ConvertToUpperCase: { execute: this.executeConvertToUpperCase.bind(this) },
    EndsWith: { execute: this.executeEndsWith.bind(this) },
    GetCharacter: { execute: this.executeGetCharacter.bind(this) },
    GetCharacterCode: { execute: this.executeGetCharacterCode.bind(this) },
    GetIndexOf: { execute: this.executeGetIndexOf.bind(this) },
    GetLength: { execute: this.executeGetLength.bind(this) },
    GetSubText: { execute: this.executeGetSubText.bind(this) },
    GetSubTextToEnd: { execute: this.executeGetSubTextToEnd.bind(this) },
    GetWord: { execute: this.executeGetWord.bind(this) },
    GetWordCount: { execute: this.executeGetWordCount.bind(this) },
    IsSubText: { execute: this.executeIsSubText.bind(this) },
    StartsWith: { execute: this.executeStartsWith.bind(this) }
  };
  properties = {};
  events = {};
};

// ../../vendor/SmallBasicOnline/src/compiler/runtime/libraries.ts
var SubModuleLibraryEvent = class {
  subModuleName;
  setSubModule(name) {
    this.subModuleName = name;
  }
  raise(engine) {
    if (this.subModuleName) {
      engine.raiseEvent(this.subModuleName);
    }
  }
};
var RuntimeLibraries = class {
  static Metadata = new LibrariesMetadata();
  Array = new ArrayLibrary();
  Clock = new ClockLibrary();
  // TODO: public readonly Controls: ControlsLibrary = new ControlsLibrary();
  GraphicsWindow = new GraphicsWindowLibrary();
  Math = new MathLibrary();
  Program = new ProgramLibrary();
  Shapes = new ShapesLibrary();
  Stack = new StackLibrary();
  Text = new TextLibrary();
  TextWindow = new TextWindowLibrary();
  // TODO: public readonly Turtle: TurtleLibrary = new TurtleLibrary();
};

// ../../vendor/SmallBasicOnline/src/compiler/utils/notifications.ts
init_polyfills();
var PubSub = __toESM(require_pubsub());
var PubSubPayloadChannel = class {
  id;
  constructor(name) {
    this.id = name + (/* @__PURE__ */ new Date()).getTime().toString();
  }
  subscribe(subscriber) {
    return PubSub.subscribe(this.id, (_, payload) => {
      subscriber(payload);
    });
  }
  publish(payload) {
    PubSub.publish(this.id, payload);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/modules-binder.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/binding/statement-binder.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/binding/expression-binder.ts
init_polyfills();

// ../../vendor/SmallBasicOnline/src/compiler/binding/bound-nodes.ts
init_polyfills();
var BoundKind = /* @__PURE__ */ ((BoundKind2) => {
  BoundKind2[BoundKind2["StatementBlock"] = 0] = "StatementBlock";
  BoundKind2[BoundKind2["IfHeaderStatement"] = 1] = "IfHeaderStatement";
  BoundKind2[BoundKind2["IfStatement"] = 2] = "IfStatement";
  BoundKind2[BoundKind2["WhileStatement"] = 3] = "WhileStatement";
  BoundKind2[BoundKind2["ForStatement"] = 4] = "ForStatement";
  BoundKind2[BoundKind2["LabelStatement"] = 5] = "LabelStatement";
  BoundKind2[BoundKind2["GoToStatement"] = 6] = "GoToStatement";
  BoundKind2[BoundKind2["SubModuleInvocationStatement"] = 7] = "SubModuleInvocationStatement";
  BoundKind2[BoundKind2["LibraryMethodInvocationStatement"] = 8] = "LibraryMethodInvocationStatement";
  BoundKind2[BoundKind2["EventAssignmentStatement"] = 9] = "EventAssignmentStatement";
  BoundKind2[BoundKind2["VariableAssignmentStatement"] = 10] = "VariableAssignmentStatement";
  BoundKind2[BoundKind2["PropertyAssignmentStatement"] = 11] = "PropertyAssignmentStatement";
  BoundKind2[BoundKind2["ArrayAssignmentStatement"] = 12] = "ArrayAssignmentStatement";
  BoundKind2[BoundKind2["InvalidExpressionStatement"] = 13] = "InvalidExpressionStatement";
  BoundKind2[BoundKind2["NegationExpression"] = 14] = "NegationExpression";
  BoundKind2[BoundKind2["OrExpression"] = 15] = "OrExpression";
  BoundKind2[BoundKind2["AndExpression"] = 16] = "AndExpression";
  BoundKind2[BoundKind2["NotEqualExpression"] = 17] = "NotEqualExpression";
  BoundKind2[BoundKind2["EqualExpression"] = 18] = "EqualExpression";
  BoundKind2[BoundKind2["LessThanExpression"] = 19] = "LessThanExpression";
  BoundKind2[BoundKind2["GreaterThanExpression"] = 20] = "GreaterThanExpression";
  BoundKind2[BoundKind2["LessThanOrEqualExpression"] = 21] = "LessThanOrEqualExpression";
  BoundKind2[BoundKind2["GreaterThanOrEqualExpression"] = 22] = "GreaterThanOrEqualExpression";
  BoundKind2[BoundKind2["AdditionExpression"] = 23] = "AdditionExpression";
  BoundKind2[BoundKind2["SubtractionExpression"] = 24] = "SubtractionExpression";
  BoundKind2[BoundKind2["MultiplicationExpression"] = 25] = "MultiplicationExpression";
  BoundKind2[BoundKind2["DivisionExpression"] = 26] = "DivisionExpression";
  BoundKind2[BoundKind2["ArrayAccessExpression"] = 27] = "ArrayAccessExpression";
  BoundKind2[BoundKind2["LibraryTypeExpression"] = 28] = "LibraryTypeExpression";
  BoundKind2[BoundKind2["LibraryPropertyExpression"] = 29] = "LibraryPropertyExpression";
  BoundKind2[BoundKind2["LibraryMethodExpression"] = 30] = "LibraryMethodExpression";
  BoundKind2[BoundKind2["LibraryEventExpression"] = 31] = "LibraryEventExpression";
  BoundKind2[BoundKind2["LibraryMethodInvocationExpression"] = 32] = "LibraryMethodInvocationExpression";
  BoundKind2[BoundKind2["SubModuleExpression"] = 33] = "SubModuleExpression";
  BoundKind2[BoundKind2["SubModuleInvocationExpression"] = 34] = "SubModuleInvocationExpression";
  BoundKind2[BoundKind2["VariableExpression"] = 35] = "VariableExpression";
  BoundKind2[BoundKind2["StringLiteralExpression"] = 36] = "StringLiteralExpression";
  BoundKind2[BoundKind2["NumberLiteralExpression"] = 37] = "NumberLiteralExpression";
  BoundKind2[BoundKind2["ParenthesisExpression"] = 38] = "ParenthesisExpression";
  return BoundKind2;
})(BoundKind || {});
var BaseBoundNode = class {
  constructor(kind, syntax) {
    this.kind = kind;
    this.syntax = syntax;
  }
  kind;
  syntax;
};
var BaseBoundStatement = class extends BaseBoundNode {
};
var BoundStatementBlock = class extends BaseBoundStatement {
  constructor(statements, syntax) {
    super(0 /* StatementBlock */, syntax);
    this.statements = statements;
  }
  statements;
  children() {
    return this.statements;
  }
};
var BoundIfHeaderStatement = class extends BaseBoundNode {
  constructor(condition, block, syntax) {
    super(1 /* IfHeaderStatement */, syntax);
    this.condition = condition;
    this.block = block;
  }
  condition;
  block;
  children() {
    return [this.condition, this.block];
  }
};
var BoundIfStatement = class extends BaseBoundStatement {
  constructor(ifPart, elseIfParts, elsePart, syntax) {
    super(2 /* IfStatement */, syntax);
    this.ifPart = ifPart;
    this.elseIfParts = elseIfParts;
    this.elsePart = elsePart;
  }
  ifPart;
  elseIfParts;
  elsePart;
  children() {
    return this.elsePart ? [this.ifPart, ...this.elseIfParts, this.elsePart] : [this.ifPart, ...this.elseIfParts];
  }
};
var BoundWhileStatement = class extends BaseBoundStatement {
  constructor(condition, block, syntax) {
    super(3 /* WhileStatement */, syntax);
    this.condition = condition;
    this.block = block;
  }
  condition;
  block;
  children() {
    return [this.condition, this.block];
  }
};
var BoundForStatement = class extends BaseBoundStatement {
  constructor(identifier, fromExpression, toExpression, stepExpression, block, syntax) {
    super(4 /* ForStatement */, syntax);
    this.identifier = identifier;
    this.fromExpression = fromExpression;
    this.toExpression = toExpression;
    this.stepExpression = stepExpression;
    this.block = block;
  }
  identifier;
  fromExpression;
  toExpression;
  stepExpression;
  block;
  children() {
    const children = [this.fromExpression, this.toExpression];
    if (this.stepExpression) {
      children.push(this.stepExpression);
    }
    children.push.apply(children);
    return children;
  }
};
var BoundLabelStatement = class extends BaseBoundStatement {
  constructor(labelName, syntax) {
    super(5 /* LabelStatement */, syntax);
    this.labelName = labelName;
  }
  labelName;
  children() {
    return [];
  }
};
var BoundGoToStatement = class extends BaseBoundStatement {
  constructor(labelName, syntax) {
    super(6 /* GoToStatement */, syntax);
    this.labelName = labelName;
  }
  labelName;
  children() {
    return [];
  }
};
var BoundSubModuleInvocationStatement = class extends BaseBoundStatement {
  constructor(subModuleName, syntax) {
    super(7 /* SubModuleInvocationStatement */, syntax);
    this.subModuleName = subModuleName;
  }
  subModuleName;
  children() {
    return [];
  }
};
var BoundLibraryMethodInvocationStatement = class extends BaseBoundStatement {
  constructor(libraryName, methodName, argumentsList, syntax) {
    super(8 /* LibraryMethodInvocationStatement */, syntax);
    this.libraryName = libraryName;
    this.methodName = methodName;
    this.argumentsList = argumentsList;
  }
  libraryName;
  methodName;
  argumentsList;
  children() {
    return this.argumentsList;
  }
};
var BoundEventAssignmentStatement = class extends BaseBoundStatement {
  constructor(libraryName, eventName, subModuleName, syntax) {
    super(9 /* EventAssignmentStatement */, syntax);
    this.libraryName = libraryName;
    this.eventName = eventName;
    this.subModuleName = subModuleName;
  }
  libraryName;
  eventName;
  subModuleName;
  children() {
    return [];
  }
};
var BoundVariableAssignmentStatement = class extends BaseBoundStatement {
  constructor(variableName, value, syntax) {
    super(10 /* VariableAssignmentStatement */, syntax);
    this.variableName = variableName;
    this.value = value;
  }
  variableName;
  value;
  children() {
    return [this.value];
  }
};
var BoundPropertyAssignmentStatement = class extends BaseBoundStatement {
  constructor(libraryName, propertyName, value, syntax) {
    super(11 /* PropertyAssignmentStatement */, syntax);
    this.libraryName = libraryName;
    this.propertyName = propertyName;
    this.value = value;
  }
  libraryName;
  propertyName;
  value;
  children() {
    return [this.value];
  }
};
var BoundArrayAssignmentStatement = class extends BaseBoundStatement {
  constructor(arrayName, indices, value, syntax) {
    super(12 /* ArrayAssignmentStatement */, syntax);
    this.arrayName = arrayName;
    this.indices = indices;
    this.value = value;
  }
  arrayName;
  indices;
  value;
  children() {
    return [this.value];
  }
};
var BoundInvalidExpressionStatement = class extends BaseBoundStatement {
  constructor(expression, syntax) {
    super(13 /* InvalidExpressionStatement */, syntax);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};
var BaseBoundExpression = class extends BaseBoundNode {
  constructor(kind, hasValue, hasErrors, syntax) {
    super(kind, syntax);
    this.kind = kind;
    this.hasValue = hasValue;
    this.hasErrors = hasErrors;
  }
  kind;
  hasValue;
  hasErrors;
};
var BoundNegationExpression = class extends BaseBoundExpression {
  constructor(expression, hasErrors, syntax) {
    super(14 /* NegationExpression */, true, hasErrors, syntax);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};
var BoundOrExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(15 /* OrExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundAndExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(16 /* AndExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundNotEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(17 /* NotEqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(18 /* EqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundLessThanExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(19 /* LessThanExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundGreaterThanExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(20 /* GreaterThanExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundLessThanOrEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(21 /* LessThanOrEqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundGreaterThanOrEqualExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(22 /* GreaterThanOrEqualExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundAdditionExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(23 /* AdditionExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundSubtractionExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(24 /* SubtractionExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundMultiplicationExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(25 /* MultiplicationExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundDivisionExpression = class extends BaseBoundExpression {
  constructor(leftExpression, rightExpression, hasErrors, syntax) {
    super(26 /* DivisionExpression */, true, hasErrors, syntax);
    this.leftExpression = leftExpression;
    this.rightExpression = rightExpression;
  }
  leftExpression;
  rightExpression;
  children() {
    return [this.leftExpression, this.rightExpression];
  }
};
var BoundArrayAccessExpression = class extends BaseBoundExpression {
  constructor(arrayName, indices, hasErrors, syntax) {
    super(27 /* ArrayAccessExpression */, true, hasErrors, syntax);
    this.arrayName = arrayName;
    this.indices = indices;
  }
  arrayName;
  indices;
  children() {
    return this.indices;
  }
};
var BoundLibraryTypeExpression = class extends BaseBoundExpression {
  constructor(libraryName, hasErrors, syntax) {
    super(28 /* LibraryTypeExpression */, false, hasErrors, syntax);
    this.libraryName = libraryName;
  }
  libraryName;
  children() {
    return [];
  }
};
var BoundLibraryPropertyExpression = class extends BaseBoundExpression {
  constructor(libraryName, propertyName, hasValue, hasErrors, syntax) {
    super(29 /* LibraryPropertyExpression */, hasValue, hasErrors, syntax);
    this.libraryName = libraryName;
    this.propertyName = propertyName;
  }
  libraryName;
  propertyName;
  children() {
    return [];
  }
};
var BoundLibraryMethodExpression = class extends BaseBoundExpression {
  constructor(libraryName, methodName, hasValue, hasErrors, syntax) {
    super(30 /* LibraryMethodExpression */, hasValue, hasErrors, syntax);
    this.libraryName = libraryName;
    this.methodName = methodName;
  }
  libraryName;
  methodName;
  children() {
    return [];
  }
};
var BoundLibraryEventExpression = class extends BaseBoundExpression {
  constructor(libraryName, eventName, hasErrors, syntax) {
    super(31 /* LibraryEventExpression */, false, hasErrors, syntax);
    this.libraryName = libraryName;
    this.eventName = eventName;
  }
  libraryName;
  eventName;
  children() {
    return [];
  }
};
var BoundLibraryMethodInvocationExpression = class extends BaseBoundExpression {
  constructor(libraryName, methodName, argumentsList, hasValue, hasErrors, syntax) {
    super(32 /* LibraryMethodInvocationExpression */, hasValue, hasErrors, syntax);
    this.libraryName = libraryName;
    this.methodName = methodName;
    this.argumentsList = argumentsList;
  }
  libraryName;
  methodName;
  argumentsList;
  children() {
    return this.argumentsList;
  }
};
var BoundSubModuleExpression = class extends BaseBoundExpression {
  constructor(subModuleName, hasErrors, syntax) {
    super(33 /* SubModuleExpression */, false, hasErrors, syntax);
    this.subModuleName = subModuleName;
  }
  subModuleName;
  children() {
    return [];
  }
};
var BoundSubModuleInvocationExpression = class extends BaseBoundExpression {
  constructor(subModuleName, hasErrors, syntax) {
    super(34 /* SubModuleInvocationExpression */, false, hasErrors, syntax);
    this.subModuleName = subModuleName;
  }
  subModuleName;
  children() {
    return [];
  }
};
var BoundVariableExpression = class extends BaseBoundExpression {
  constructor(variableName, hasErrors, syntax) {
    super(35 /* VariableExpression */, true, hasErrors, syntax);
    this.variableName = variableName;
  }
  variableName;
  children() {
    return [];
  }
};
var BoundStringLiteralExpression = class extends BaseBoundExpression {
  constructor(value, hasErrors, syntax) {
    super(36 /* StringLiteralExpression */, true, hasErrors, syntax);
    this.value = value;
  }
  value;
  children() {
    return [];
  }
};
var BoundNumberLiteralExpression = class extends BaseBoundExpression {
  constructor(value, hasErrors, syntax) {
    super(37 /* NumberLiteralExpression */, true, hasErrors, syntax);
    this.value = value;
  }
  value;
  children() {
    return [];
  }
};
var BoundParenthesisExpression = class extends BaseBoundExpression {
  constructor(expression, hasErrors, syntax) {
    super(38 /* ParenthesisExpression */, true, hasErrors, syntax);
    this.expression = expression;
  }
  expression;
  children() {
    return [this.expression];
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/expression-binder.ts
var ExpressionBinder = class {
  constructor(syntax, expectedValue, _definedSubModules, _diagnostics) {
    this._definedSubModules = _definedSubModules;
    this._diagnostics = _diagnostics;
    this._result = this.bindExpression(syntax, expectedValue);
  }
  _definedSubModules;
  _diagnostics;
  _result;
  get result() {
    return this._result;
  }
  bindExpression(syntax, expectedValue) {
    let expression;
    switch (syntax.kind) {
      case 25 /* ArrayAccessExpression */:
        expression = this.bindArrayAccess(syntax);
        break;
      case 23 /* BinaryOperatorExpression */:
        expression = this.bindBinaryOperator(syntax);
        break;
      case 27 /* InvocationExpression */:
        expression = this.bindInvocation(syntax, expectedValue);
        break;
      case 24 /* ObjectAccessExpression */:
        expression = this.bindObjectAccess(syntax, expectedValue);
        break;
      case 28 /* ParenthesisExpression */:
        expression = this.bindParenthesis(syntax);
        break;
      case 30 /* NumberLiteralExpression */:
        expression = this.bindNumberLiteral(syntax);
        break;
      case 31 /* StringLiteralExpression */:
        expression = this.bindStringLiteral(syntax);
        break;
      case 29 /* IdentifierExpression */:
        expression = this.bindIdentifier(syntax, expectedValue);
        break;
      case 22 /* UnaryOperatorExpression */:
        expression = this.bindUnaryOperator(syntax);
        break;
      default:
        throw new Error(`Unexpected syntax kind: ${SyntaxKind[syntax.kind]}`);
    }
    return expression;
  }
  bindArrayAccess(syntax) {
    const baseExpression = this.bindExpression(syntax.baseExpression, true);
    const indexExpression = this.bindExpression(syntax.indexExpression, true);
    let arrayName;
    let indices;
    let hasErrors = baseExpression.hasErrors || indexExpression.hasErrors;
    switch (baseExpression.kind) {
      case 27 /* ArrayAccessExpression */: {
        const arrayAccess = baseExpression;
        arrayName = arrayAccess.arrayName;
        indices = [...arrayAccess.indices, indexExpression];
        break;
      }
      case 35 /* VariableExpression */: {
        arrayName = baseExpression.variableName;
        indices = [indexExpression];
        break;
      }
      default: {
        if (!hasErrors) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(18 /* UnsupportedArrayBaseExpression */, baseExpression.syntax.range));
        }
        arrayName = "<array>";
        indices = [indexExpression];
        break;
      }
    }
    return new BoundArrayAccessExpression(arrayName, indices, hasErrors, syntax);
  }
  bindInvocation(syntax, expectedValue) {
    const baseExpression = this.bindExpression(syntax.baseExpression, false);
    const argumentsList = syntax.argumentsList.map((arg) => this.bindExpression(arg.expression, true));
    let hasErrors = baseExpression.hasErrors || argumentsList.some((arg) => arg.hasErrors);
    switch (baseExpression.kind) {
      case 30 /* LibraryMethodExpression */: {
        const method = baseExpression;
        const definition = RuntimeLibraries.Metadata[method.libraryName].methods[method.methodName];
        const parametersCount = definition.parameters.length;
        if (argumentsList.length !== parametersCount) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(20 /* UnexpectedArgumentsCount */, baseExpression.syntax.range, parametersCount.toString(), argumentsList.length.toString()));
        } else if (expectedValue && !definition.returnsValue) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
        }
        return new BoundLibraryMethodInvocationExpression(method.libraryName, method.methodName, argumentsList, definition.returnsValue, hasErrors, syntax);
      }
      case 33 /* SubModuleExpression */: {
        if (argumentsList.length !== 0) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(20 /* UnexpectedArgumentsCount */, baseExpression.syntax.range, "0", argumentsList.length.toString()));
        } else if (expectedValue) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
        }
        const subModule = baseExpression;
        return new BoundSubModuleInvocationExpression(subModule.subModuleName, hasErrors, syntax);
      }
      default: {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(19 /* UnsupportedCallBaseExpression */, baseExpression.syntax.range));
        return new BoundLibraryMethodInvocationExpression("<library>", "<method>", argumentsList, true, hasErrors, syntax);
      }
    }
  }
  bindObjectAccess(syntax, expectedValue) {
    const leftHandSide = this.bindExpression(syntax.baseExpression, false);
    const rightHandSide = syntax.identifierToken.token.text;
    let hasErrors = leftHandSide.hasErrors;
    if (leftHandSide.kind !== 28 /* LibraryTypeExpression */) {
      hasErrors = true;
      this._diagnostics.push(new Diagnostic(23 /* UnsupportedDotBaseExpression */, leftHandSide.syntax.range));
      return new BoundLibraryPropertyExpression("<library>", rightHandSide, true, hasErrors, syntax);
    }
    const libraryType = leftHandSide;
    const propertyName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata[libraryType.libraryName].properties, rightHandSide);
    const propertyInfo = propertyName === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryType.libraryName].properties[propertyName];
    if (propertyInfo) {
      if (expectedValue && !propertyInfo.hasGetter) {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
      }
      return new BoundLibraryPropertyExpression(libraryType.libraryName, propertyName, propertyInfo.hasGetter, hasErrors, syntax);
    }
    const methodName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata[libraryType.libraryName].methods, rightHandSide);
    const methodInfo = methodName === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryType.libraryName].methods[methodName];
    if (methodInfo) {
      if (expectedValue) {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
      }
      return new BoundLibraryMethodExpression(libraryType.libraryName, methodName, false, hasErrors, syntax);
    }
    const eventName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata[libraryType.libraryName].events, rightHandSide);
    if (eventName !== void 0) {
      return new BoundLibraryEventExpression(libraryType.libraryName, eventName, hasErrors, syntax);
    }
    hasErrors = true;
    this._diagnostics.push(new Diagnostic(24 /* LibraryMemberNotFound */, leftHandSide.syntax.range, libraryType.libraryName, rightHandSide));
    return new BoundLibraryPropertyExpression(libraryType.libraryName, rightHandSide, true, hasErrors, syntax);
  }
  bindParenthesis(syntax) {
    const expression = this.bindExpression(syntax.expression, true);
    return new BoundParenthesisExpression(expression, expression.hasErrors, syntax);
  }
  bindNumberLiteral(syntax) {
    const value = parseFloat(syntax.numberToken.token.text);
    const isNotANumber = isNaN(value);
    const expression = new BoundNumberLiteralExpression(value, isNotANumber, syntax);
    if (isNotANumber) {
      this._diagnostics.push(new Diagnostic(12 /* ValueIsNotANumber */, expression.syntax.range, syntax.numberToken.token.text));
    }
    return expression;
  }
  bindStringLiteral(syntax) {
    let value = syntax.stringToken.token.text;
    if (value.length < 1 || value[0] !== '"') {
      throw new Error(`String literal '${value}' should have never been parsed without a starting double quotes`);
    }
    value = value.substr(1);
    if (value.length && value[value.length - 1] === '"') {
      value = value.substr(0, value.length - 1);
    }
    return new BoundStringLiteralExpression(value, false, syntax);
  }
  bindIdentifier(syntax, expectedValue) {
    let hasErrors = false;
    const name = syntax.identifierToken.token.text;
    const libraryKey = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata, name);
    const library = libraryKey === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryKey];
    if (library) {
      if (expectedValue) {
        hasErrors = true;
        this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
      }
      return new BoundLibraryTypeExpression(libraryKey, hasErrors, syntax);
    } else {
      const subModuleName = this._definedSubModules[name.toLowerCase()];
      if (subModuleName !== void 0) {
        if (expectedValue) {
          hasErrors = true;
          this._diagnostics.push(new Diagnostic(17 /* UnexpectedVoid_ExpectingValue */, syntax.range));
        }
        return new BoundSubModuleExpression(subModuleName, hasErrors, syntax);
      }
    }
    return new BoundVariableExpression(name, hasErrors, syntax);
  }
  bindUnaryOperator(syntax) {
    const expression = this.bindExpression(syntax.expression, true);
    if (syntax.operatorToken.token.kind === 24 /* Minus */) {
      return new BoundNegationExpression(expression, expression.hasErrors, syntax);
    } else {
      throw new Error(`Unsupported token kind: ${TokenKind[syntax.operatorToken.kind]}`);
    }
  }
  bindBinaryOperator(syntax) {
    const leftHandSide = this.bindExpression(syntax.leftExpression, true);
    const rightHandSide = this.bindExpression(syntax.rightExpression, leftHandSide.kind !== 31 /* LibraryEventExpression */);
    const hasErrors = leftHandSide.hasErrors || rightHandSide.hasErrors;
    switch (syntax.operatorToken.token.kind) {
      case 32 /* Or */:
        return new BoundOrExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 33 /* And */:
        return new BoundAndExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 22 /* NotEqual */:
        return new BoundNotEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 21 /* Equal */:
        return new BoundEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 28 /* LessThan */:
        return new BoundLessThanExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 29 /* GreaterThan */:
        return new BoundGreaterThanExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 30 /* LessThanOrEqual */:
        return new BoundLessThanOrEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 31 /* GreaterThanOrEqual */:
        return new BoundGreaterThanOrEqualExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 23 /* Plus */:
        return new BoundAdditionExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 24 /* Minus */:
        return new BoundSubtractionExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 25 /* Multiply */:
        return new BoundMultiplicationExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      case 26 /* Divide */:
        return new BoundDivisionExpression(leftHandSide, rightHandSide, hasErrors, syntax);
      default:
        throw new Error(`Unexpected token kind ${TokenKind[syntax.operatorToken.kind]}`);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/statement-binder.ts
var StatementBinder = class {
  constructor(statements, _definedSubModules, _diagnostics) {
    this._definedSubModules = _definedSubModules;
    this._diagnostics = _diagnostics;
    this.result = this.bindStatementsBlock(statements);
    this._goToStatements.forEach((statement) => {
      const identifier = statement.labelToken;
      if (!this._definedLabels[identifier.token.text]) {
        this._diagnostics.push(new Diagnostic(14 /* LabelDoesNotExist */, identifier.range, identifier.token.text));
      }
    });
  }
  _definedSubModules;
  _diagnostics;
  _definedLabels = {};
  _goToStatements = [];
  result;
  bindStatementsBlock(block) {
    const result = [];
    block.statements.forEach((statement) => {
      if (statement.kind !== 21 /* CommentCommand */) {
        result.push(this.bindStatement(statement));
      }
    });
    return new BoundStatementBlock(result, block);
  }
  bindStatement(syntax) {
    switch (syntax.kind) {
      case 6 /* ForStatement */:
        return this.bindForStatement(syntax);
      case 4 /* IfStatement */:
        return this.bindIfStatement(syntax);
      case 5 /* WhileStatement */:
        return this.bindWhileStatement(syntax);
      case 16 /* LabelCommand */:
        return this.bindLabelStatement(syntax);
      case 17 /* GoToCommand */:
        return this.bindGoToStatement(syntax);
      case 20 /* ExpressionCommand */:
        return this.bindExpressionStatement(syntax);
      default:
        throw new Error(`Unexpected statement of kind ${SyntaxKind[syntax.kind]} here`);
    }
  }
  bindForStatement(syntax) {
    const identifier = syntax.forCommand.identifierToken.token.text;
    const fromExpression = this.bindExpression(syntax.forCommand.fromExpression, true);
    const toExpression = this.bindExpression(syntax.forCommand.toExpression, true);
    let stepExpression;
    if (syntax.forCommand.stepClauseOpt) {
      stepExpression = this.bindExpression(syntax.forCommand.stepClauseOpt.expression, true);
    }
    const statementsList = this.bindStatementsBlock(syntax.statementsList);
    return new BoundForStatement(identifier, fromExpression, toExpression, stepExpression, statementsList, syntax);
  }
  bindIfStatement(syntax) {
    const ifPart = new BoundIfHeaderStatement(
      this.bindExpression(syntax.ifPart.headerCommand.expression, true),
      this.bindStatementsBlock(syntax.ifPart.statementsList),
      syntax.ifPart
    );
    const elseIfParts = syntax.elseIfParts.map((elseIfPart) => {
      return new BoundIfHeaderStatement(
        this.bindExpression(elseIfPart.headerCommand.expression, true),
        this.bindStatementsBlock(elseIfPart.statementsList),
        elseIfPart
      );
    });
    let elsePart;
    if (syntax.elsePartOpt) {
      elsePart = this.bindStatementsBlock(syntax.elsePartOpt.statementsList);
    }
    return new BoundIfStatement(ifPart, elseIfParts, elsePart, syntax);
  }
  bindWhileStatement(syntax) {
    const condition = this.bindExpression(syntax.whileCommand.expression, true);
    const statementsList = this.bindStatementsBlock(syntax.statementsList);
    return new BoundWhileStatement(condition, statementsList, syntax);
  }
  bindLabelStatement(syntax) {
    const labelName = syntax.labelToken.token.text;
    this._definedLabels[labelName] = true;
    return new BoundLabelStatement(labelName, syntax);
  }
  bindGoToStatement(syntax) {
    this._goToStatements.push(syntax);
    return new BoundGoToStatement(syntax.labelToken.token.text, syntax);
  }
  bindExpressionStatement(syntax) {
    const expression = this.bindExpression(syntax.expression, false);
    if (expression.hasErrors) {
      return new BoundInvalidExpressionStatement(expression, syntax);
    }
    switch (expression.kind) {
      case 18 /* EqualExpression */: {
        const binaryExpression = expression;
        switch (binaryExpression.leftExpression.kind) {
          case 35 /* VariableExpression */: {
            const variable = binaryExpression.leftExpression;
            return new BoundVariableAssignmentStatement(variable.variableName, binaryExpression.rightExpression, syntax);
          }
          case 27 /* ArrayAccessExpression */: {
            const array = binaryExpression.leftExpression;
            return new BoundArrayAssignmentStatement(array.arrayName, array.indices, binaryExpression.rightExpression, syntax);
          }
          case 29 /* LibraryPropertyExpression */: {
            const property = binaryExpression.leftExpression;
            if (!RuntimeLibraries.Metadata[property.libraryName].properties[property.propertyName].hasSetter) {
              this._diagnostics.push(new Diagnostic(21 /* PropertyHasNoSetter */, property.syntax.range));
            }
            return new BoundPropertyAssignmentStatement(property.libraryName, property.propertyName, binaryExpression.rightExpression, syntax);
          }
          case 31 /* LibraryEventExpression */: {
            const eventExpression = binaryExpression.leftExpression;
            if (binaryExpression.rightExpression.kind === 33 /* SubModuleExpression */) {
              const subModule = binaryExpression.rightExpression;
              return new BoundEventAssignmentStatement(eventExpression.libraryName, eventExpression.eventName, subModule.subModuleName, syntax);
            }
            this._diagnostics.push(new Diagnostic(22 /* AssigningNonSubModuleToEvent */, eventExpression.syntax.range));
            return new BoundInvalidExpressionStatement(expression, syntax);
          }
          default: {
            this._diagnostics.push(new Diagnostic(
              25 /* ValueIsNotAssignable */,
              binaryExpression.leftExpression.syntax.range
            ));
            return new BoundInvalidExpressionStatement(expression, syntax);
          }
        }
      }
      case 32 /* LibraryMethodInvocationExpression */: {
        const call = expression;
        return new BoundLibraryMethodInvocationStatement(call.libraryName, call.methodName, call.argumentsList, syntax);
      }
      case 34 /* SubModuleInvocationExpression */: {
        const call = expression;
        return new BoundSubModuleInvocationStatement(call.subModuleName, syntax);
      }
    }
    const errorCode = expression.hasValue ? 15 /* UnassignedExpressionStatement */ : 16 /* InvalidExpressionStatement */;
    this._diagnostics.push(new Diagnostic(errorCode, syntax.expression.range));
    return new BoundInvalidExpressionStatement(expression, syntax);
  }
  bindExpression(syntax, expectedValue) {
    return new ExpressionBinder(syntax, expectedValue, this._definedSubModules, this._diagnostics).result;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/binding/modules-binder.ts
var ModulesBinder = class _ModulesBinder {
  constructor(parseTree, _diagnostics) {
    this._diagnostics = _diagnostics;
    this.constructSubModulesMap(parseTree);
    this._boundModules[_ModulesBinder.MainModuleName] = this.bindModule(parseTree.mainModule);
    parseTree.subModules.forEach((subModule) => {
      this._boundModules[subModule.subCommand.nameToken.token.text] = this.bindModule(subModule.statementsList);
    });
  }
  _diagnostics;
  static MainModuleName = "<Main>";
  _definedSubModules = {};
  _boundModules = {};
  get boundModules() {
    return this._boundModules;
  }
  constructSubModulesMap(parseTree) {
    parseTree.subModules.forEach((subModule) => {
      const nameToken = subModule.subCommand.nameToken;
      if (this._definedSubModules[nameToken.token.text.toLowerCase()]) {
        this._diagnostics.push(new Diagnostic(
          13 /* TwoSubModulesWithTheSameName */,
          nameToken.range,
          nameToken.token.text
        ));
      } else {
        this._definedSubModules[nameToken.token.text.toLowerCase()] = nameToken.token.text;
      }
    });
  }
  bindModule(statements) {
    return new StatementBinder(statements, this._definedSubModules, this._diagnostics).result;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/execution-engine.ts
var ExecutionState = /* @__PURE__ */ ((ExecutionState2) => {
  ExecutionState2[ExecutionState2["Running"] = 0] = "Running";
  ExecutionState2[ExecutionState2["Paused"] = 1] = "Paused";
  ExecutionState2[ExecutionState2["BlockedOnInput"] = 2] = "BlockedOnInput";
  ExecutionState2[ExecutionState2["Terminated"] = 3] = "Terminated";
  return ExecutionState2;
})(ExecutionState || {});
var ExecutionEngine4 = class {
  _libraries = new RuntimeLibraries();
  _executionStack = [];
  _evaluationStack = [];
  _memory = new ArrayValue();
  _modules;
  _exception;
  _currentLine = 0;
  _state = 0 /* Running */;
  programTerminated = new PubSubPayloadChannel("programTerminated");
  get libraries() {
    return this._libraries;
  }
  get executionStack() {
    return this._executionStack;
  }
  get evaluationStack() {
    return this._evaluationStack;
  }
  get memory() {
    return this._memory;
  }
  get modules() {
    return this._modules;
  }
  get exception() {
    return this._exception;
  }
  get state() {
    return this._state;
  }
  set state(newState) {
    this._state = newState;
  }
  constructor(compilation) {
    if (compilation.diagnostics.length) {
      throw new Error(`Cannot execute a compilation with errors`);
    }
    this._modules = compilation.emit();
    this._executionStack.push({
      moduleName: ModulesBinder.MainModuleName,
      instructionIndex: 0
    });
  }
  execute(mode) {
    if (this._state === 1 /* Paused */) {
      this._state = 0 /* Running */;
    }
    while (true) {
      if (this._state === 3 /* Terminated */) {
        return;
      }
      if (this._executionStack.length === 0) {
        this.terminate();
        return;
      }
      const frame = this._executionStack[this._executionStack.length - 1];
      if (frame.instructionIndex === this._modules[frame.moduleName].length) {
        this._executionStack.pop();
        continue;
      }
      const instruction = this._modules[frame.moduleName][frame.instructionIndex];
      if (instruction.sourceRange.start.line !== this._currentLine && mode === 2 /* NextStatement */) {
        this._currentLine = instruction.sourceRange.start.line;
        this._state = 1 /* Paused */;
        return;
      }
      instruction.execute(this, mode, frame);
      switch (this.state) {
        case 0 /* Running */:
          break;
        case 1 /* Paused */:
        case 3 /* Terminated */:
        case 2 /* BlockedOnInput */:
          return;
        default:
          throw new Error(`Unexpected execution state: '${ExecutionState[this.state]}'`);
      }
    }
  }
  terminate(exception) {
    this._state = 3 /* Terminated */;
    this._exception = exception;
    this.programTerminated.publish(exception);
  }
  popEvaluationStack() {
    const value = this._evaluationStack.pop();
    if (value) {
      return value;
    }
    throw new Error("Evaluation stack empty");
  }
  pushEvaluationStack(value) {
    this._evaluationStack.push(value);
  }
  pushSubModule(name) {
    if (this._modules[name]) {
      this._executionStack.push({
        moduleName: name,
        instructionIndex: 0
      });
    } else {
      throw new Error(`SubModule ${name} not found`);
    }
  }
  raiseEvent(subModuleName) {
    const existingIndex = this._executionStack.findIndex(
      (frame, index) => index < this._executionStack.length - 1 && frame.moduleName === subModuleName
    );
    if (existingIndex >= 0) {
      this._executionStack.splice(existingIndex, 1);
    }
    this.pushSubModule(subModuleName);
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/emitting/instructions.ts
var InstructionKind = /* @__PURE__ */ ((InstructionKind2) => {
  InstructionKind2[InstructionKind2["TempLabel"] = 0] = "TempLabel";
  InstructionKind2[InstructionKind2["TempJump"] = 1] = "TempJump";
  InstructionKind2[InstructionKind2["TempConditionalJump"] = 2] = "TempConditionalJump";
  InstructionKind2[InstructionKind2["Jump"] = 3] = "Jump";
  InstructionKind2[InstructionKind2["ConditionalJump"] = 4] = "ConditionalJump";
  InstructionKind2[InstructionKind2["InvokeSubModule"] = 5] = "InvokeSubModule";
  InstructionKind2[InstructionKind2["SetEventHandler"] = 6] = "SetEventHandler";
  InstructionKind2[InstructionKind2["StoreVariable"] = 7] = "StoreVariable";
  InstructionKind2[InstructionKind2["StoreArrayElement"] = 8] = "StoreArrayElement";
  InstructionKind2[InstructionKind2["StoreProperty"] = 9] = "StoreProperty";
  InstructionKind2[InstructionKind2["LoadVariable"] = 10] = "LoadVariable";
  InstructionKind2[InstructionKind2["LoadArrayElement"] = 11] = "LoadArrayElement";
  InstructionKind2[InstructionKind2["LoadProperty"] = 12] = "LoadProperty";
  InstructionKind2[InstructionKind2["MethodInvocation"] = 13] = "MethodInvocation";
  InstructionKind2[InstructionKind2["Negate"] = 14] = "Negate";
  InstructionKind2[InstructionKind2["Equal"] = 15] = "Equal";
  InstructionKind2[InstructionKind2["LessThan"] = 16] = "LessThan";
  InstructionKind2[InstructionKind2["GreaterThan"] = 17] = "GreaterThan";
  InstructionKind2[InstructionKind2["LessThanOrEqual"] = 18] = "LessThanOrEqual";
  InstructionKind2[InstructionKind2["GreaterThanOrEqual"] = 19] = "GreaterThanOrEqual";
  InstructionKind2[InstructionKind2["Add"] = 20] = "Add";
  InstructionKind2[InstructionKind2["Subtract"] = 21] = "Subtract";
  InstructionKind2[InstructionKind2["Multiply"] = 22] = "Multiply";
  InstructionKind2[InstructionKind2["Divide"] = 23] = "Divide";
  InstructionKind2[InstructionKind2["PushNumber"] = 24] = "PushNumber";
  InstructionKind2[InstructionKind2["PushString"] = 25] = "PushString";
  InstructionKind2[InstructionKind2["Duplicate"] = 26] = "Duplicate";
  InstructionKind2[InstructionKind2["DeleteVariable"] = 27] = "DeleteVariable";
  return InstructionKind2;
})(InstructionKind || {});
var BaseInstruction = class {
  constructor(kind, sourceRange) {
    this.kind = kind;
    this.sourceRange = sourceRange;
  }
  kind;
  sourceRange;
};
var TempLabelInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(0 /* TempLabel */, range);
    this.name = name;
  }
  name;
  execute(_1, _2, _3) {
    throw new Error("This should have been removed during emit");
  }
};
var TempJumpInstruction = class extends BaseInstruction {
  constructor(target, range) {
    super(1 /* TempJump */, range);
    this.target = target;
  }
  target;
  execute(_1, _2, _3) {
    throw new Error("This should have been removed during emit");
  }
};
var TempConditionalJumpInstruction = class extends BaseInstruction {
  constructor(trueTarget, falseTarget, range) {
    super(2 /* TempConditionalJump */, range);
    this.trueTarget = trueTarget;
    this.falseTarget = falseTarget;
  }
  trueTarget;
  falseTarget;
  execute(_1, _2, _3) {
    throw new Error("This should have been removed during emit");
  }
};
var JumpInstruction = class extends BaseInstruction {
  constructor(target, range) {
    super(3 /* Jump */, range);
    this.target = target;
  }
  target;
  execute(_1, _2, frame) {
    frame.instructionIndex = this.target;
  }
};
var ConditionalJumpInstruction = class extends BaseInstruction {
  constructor(trueTarget, falseTarget, range) {
    super(4 /* ConditionalJump */, range);
    this.trueTarget = trueTarget;
    this.falseTarget = falseTarget;
  }
  trueTarget;
  falseTarget;
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack();
    if (value.toBoolean()) {
      if (this.trueTarget) {
        frame.instructionIndex = this.trueTarget;
      } else {
        frame.instructionIndex++;
      }
    } else {
      if (this.falseTarget) {
        frame.instructionIndex = this.falseTarget;
      } else {
        frame.instructionIndex++;
      }
    }
  }
};
var InvokeSubModuleInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(5 /* InvokeSubModule */, range);
    this.name = name;
  }
  name;
  execute(engine, _2, frame) {
    frame.instructionIndex++;
    engine.pushSubModule(this.name);
  }
};
var SetEventHandlerInstruction = class extends BaseInstruction {
  constructor(library, eventName, subModuleName, range) {
    super(6 /* SetEventHandler */, range);
    this.library = library;
    this.eventName = eventName;
    this.subModuleName = subModuleName;
  }
  library;
  eventName;
  subModuleName;
  execute(engine, _2, frame) {
    engine.libraries[this.library].events[this.eventName].setSubModule(this.subModuleName);
    frame.instructionIndex++;
  }
};
var StoreVariableInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(7 /* StoreVariable */, range);
    this.name = name;
  }
  name;
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack();
    engine.memory.setIndex(this.name, value);
    frame.instructionIndex++;
  }
};
var StoreArrayElementInstruction = class extends BaseInstruction {
  constructor(name, indices, range) {
    super(8 /* StoreArrayElement */, range);
    this.name = name;
    this.indices = indices;
  }
  name;
  indices;
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack();
    let index = this.name;
    let current = engine.memory;
    let remainingIndices = this.indices;
    while (remainingIndices-- > 0) {
      const existing = current.getValue(index);
      if (!existing || existing.kind !== 2 /* Array */) {
        current.setIndex(index, new ArrayValue());
      }
      current = current.getValue(index);
      const indexValue = engine.popEvaluationStack();
      switch (indexValue.kind) {
        case 1 /* Number */:
        case 0 /* String */:
          index = indexValue.toValueString();
          break;
        case 2 /* Array */:
          engine.terminate(new Diagnostic(26 /* CannotUseAnArrayAsAnIndexToAnotherArray */, this.sourceRange));
          return;
        default:
          throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
      }
    }
    current.setIndex(index, value);
    frame.instructionIndex++;
  }
};
var StorePropertyInstruction = class extends BaseInstruction {
  constructor(library, property, range) {
    super(9 /* StoreProperty */, range);
    this.library = library;
    this.property = property;
  }
  library;
  property;
  execute(engine, _2, frame) {
    const setter = engine.libraries[this.library].properties[this.property].setter;
    if (!setter) {
      throw new Error(`Property ${this.library}.${this.property} has no setter`);
    }
    const value = engine.popEvaluationStack();
    setter(value);
    frame.instructionIndex++;
  }
};
var LoadVariableInstruction = class extends BaseInstruction {
  constructor(name, range) {
    super(10 /* LoadVariable */, range);
    this.name = name;
  }
  name;
  execute(engine, _2, frame) {
    let value = engine.memory.getValue(this.name);
    if (!value) {
      value = new StringValue("");
    }
    engine.pushEvaluationStack(value);
    frame.instructionIndex++;
  }
};
var LoadArrayElementInstruction = class extends BaseInstruction {
  constructor(name, indices, range) {
    super(11 /* LoadArrayElement */, range);
    this.name = name;
    this.indices = indices;
  }
  name;
  indices;
  execute(engine, _2, frame) {
    let index = this.name;
    let remainingIndices = this.indices;
    let current = engine.memory;
    while (remainingIndices-- > 0) {
      const existing = current.getValue(index);
      if (!existing || existing.kind !== 2 /* Array */) {
        current.setIndex(index, new ArrayValue());
      }
      current = current.getValue(index);
      const indexValue = engine.popEvaluationStack();
      switch (indexValue.kind) {
        case 1 /* Number */:
        case 0 /* String */:
          index = indexValue.toValueString();
          break;
        case 2 /* Array */:
          engine.terminate(new Diagnostic(26 /* CannotUseAnArrayAsAnIndexToAnotherArray */, this.sourceRange));
          return;
        default:
          throw new Error(`Unexpected value kind ${ValueKind[indexValue.kind]}`);
      }
    }
    if (!current.getValue(index)) {
      current.setIndex(index, new StringValue(""));
    }
    engine.pushEvaluationStack(current.getValue(index));
    frame.instructionIndex++;
  }
};
var LoadPropertyInstruction = class extends BaseInstruction {
  constructor(library, property, range) {
    super(12 /* LoadProperty */, range);
    this.library = library;
    this.property = property;
  }
  library;
  property;
  execute(engine, _2, frame) {
    const getter = engine.libraries[this.library].properties[this.property].getter;
    if (!getter) {
      throw new Error(`Property ${this.library}.${this.property} has no getter`);
    }
    const value = getter();
    engine.pushEvaluationStack(value);
    frame.instructionIndex++;
  }
};
var MethodInvocationInstruction = class extends BaseInstruction {
  constructor(library, method, range) {
    super(13 /* MethodInvocation */, range);
    this.library = library;
    this.method = method;
  }
  library;
  method;
  execute(engine, mode, frame) {
    engine.libraries[this.library].methods[this.method].execute(engine, mode, this.sourceRange);
    switch (engine.state) {
      case 2 /* BlockedOnInput */:
        break;
      case 1 /* Paused */:
      case 3 /* Terminated */:
      case 0 /* Running */:
        frame.instructionIndex++;
        break;
      default:
        throw new Error(`Unexpected execution state '${ExecutionState[engine.state]}'`);
    }
  }
};
var NegateInstruction = class extends BaseInstruction {
  constructor(range) {
    super(14 /* Negate */, range);
  }
  execute(engine, _2, frame) {
    const value = engine.popEvaluationStack().tryConvertToNumber();
    switch (value.kind) {
      case 1 /* Number */:
        engine.pushEvaluationStack(new NumberValue(-value.value));
        frame.instructionIndex++;
        break;
      case 0 /* String */:
        engine.terminate(new Diagnostic(28 /* CannotUseOperatorWithAString */, this.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        break;
      case 2 /* Array */:
        engine.terminate(new Diagnostic(27 /* CannotUseOperatorWithAnArray */, this.sourceRange, CompilerUtils.tokenToDisplayString(24 /* Minus */)));
        break;
      default:
        throw new Error(`Unexpected value kind ${ValueKind[value.kind]}`);
    }
  }
};
var BaseBinaryInstruction = class extends BaseInstruction {
  constructor(kind, sourceRange) {
    super(kind, sourceRange);
    this.kind = kind;
    this.sourceRange = sourceRange;
  }
  kind;
  sourceRange;
  execute(engine, _2, frame) {
    const rightHandSide = engine.popEvaluationStack();
    const leftHandSide = engine.popEvaluationStack();
    const result = this.calculateResult(engine, rightHandSide, leftHandSide);
    engine.pushEvaluationStack(result);
    frame.instructionIndex++;
  }
};
var EqualInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(15 /* Equal */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isEqualTo(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var LessThanInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(16 /* LessThan */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isLessThan(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var GreaterThanInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(17 /* GreaterThan */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isGreaterThan(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var LessThanOrEqualInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(18 /* LessThanOrEqual */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isLessThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var GreaterThanOrEqualInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(19 /* GreaterThanOrEqual */, range);
  }
  calculateResult(_, rightHandSide, leftHandSide) {
    if (leftHandSide.isGreaterThan(rightHandSide) || leftHandSide.isEqualTo(rightHandSide)) {
      return new StringValue(Constants.True);
    } else {
      return new StringValue(Constants.False);
    }
  }
};
var AddInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(20 /* Add */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.add(rightHandSide, engine, this);
  }
};
var SubtractInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(21 /* Subtract */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.subtract(rightHandSide, engine, this);
  }
};
var MultiplyInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(22 /* Multiply */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.multiply(rightHandSide, engine, this);
  }
};
var DivideInstruction = class extends BaseBinaryInstruction {
  constructor(range) {
    super(23 /* Divide */, range);
  }
  calculateResult(engine, rightHandSide, leftHandSide) {
    return leftHandSide.divide(rightHandSide, engine, this);
  }
};
var PushNumberInstruction = class extends BaseInstruction {
  constructor(value, range) {
    super(24 /* PushNumber */, range);
    this.value = value;
  }
  value;
  execute(engine, _2, frame) {
    engine.pushEvaluationStack(new NumberValue(this.value));
    frame.instructionIndex++;
  }
};
var PushStringInstruction = class extends BaseInstruction {
  constructor(value, range) {
    super(25 /* PushString */, range);
    this.value = value;
  }
  value;
  execute(engine, _2, frame) {
    engine.pushEvaluationStack(new StringValue(this.value));
    frame.instructionIndex++;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/emitting/temp-labels-remover.ts
init_polyfills();
var TempLabelsRemover;
((TempLabelsRemover2) => {
  function remove(instructions) {
    const map = {};
    for (let i = 0; i < instructions.length; i++) {
      if (instructions[i].kind === 0 /* TempLabel */) {
        const label = instructions[i];
        if (map[label.name]) {
          throw new Error(`Label '${label.name}' exists twice in the same instruction set at '${map[label.name]}' and '${i}'`);
        }
        map[label.name] = i;
        instructions.splice(i, 1);
        i--;
      }
    }
    for (let i = 0; i < instructions.length; i++) {
      switch (instructions[i].kind) {
        case 1 /* TempJump */: {
          const jump = instructions[i];
          instructions[i] = new JumpInstruction(replaceJump(jump.target, map), jump.sourceRange);
          break;
        }
        case 2 /* TempConditionalJump */: {
          const jump = instructions[i];
          instructions[i] = new ConditionalJumpInstruction(replaceJump(jump.trueTarget, map), replaceJump(jump.falseTarget, map), jump.sourceRange);
          break;
        }
        case 3 /* Jump */:
        case 4 /* ConditionalJump */: {
          throw new Error(`Unexpected instruction kind: ${InstructionKind[instructions[i].kind]}`);
        }
      }
    }
  }
  TempLabelsRemover2.remove = remove;
  function replaceJump(target, map) {
    if (target) {
      const index = map[target];
      if (index === void 0) {
        throw new Error(`Index for label ${target} was not calculated`);
      } else {
        return index;
      }
    } else {
      return void 0;
    }
  }
})(TempLabelsRemover || (TempLabelsRemover = {}));

// ../../vendor/SmallBasicOnline/src/compiler/emitting/module-emitter.ts
var ModuleEmitter = class {
  _jumpLabelCounter = 1;
  _instructions = [];
  get instructions() {
    return this._instructions;
  }
  constructor(block) {
    this.emitStatement(block);
    TempLabelsRemover.remove(this._instructions);
  }
  emitStatement(statement) {
    switch (statement.kind) {
      case 0 /* StatementBlock */:
        this.emitStatementBlock(statement);
        break;
      case 2 /* IfStatement */:
        this.emitIfStatement(statement);
        break;
      case 3 /* WhileStatement */:
        this.emitWhileStatement(statement);
        break;
      case 4 /* ForStatement */:
        this.emitForStatement(statement);
        break;
      case 5 /* LabelStatement */:
        this.emitLabelStatement(statement);
        break;
      case 6 /* GoToStatement */:
        this.emitGoToStatement(statement);
        break;
      case 7 /* SubModuleInvocationStatement */:
        this.emitSubModuleInvocation(statement);
        break;
      case 8 /* LibraryMethodInvocationStatement */:
        this.emitLibraryMethodInvocation(statement);
        break;
      case 9 /* EventAssignmentStatement */:
        this.emitEventAssignment(statement);
        break;
      case 10 /* VariableAssignmentStatement */:
        this.emitVariableAssignment(statement);
        break;
      case 11 /* PropertyAssignmentStatement */:
        this.emitPropertyAssignment(statement);
        break;
      case 12 /* ArrayAssignmentStatement */:
        this.emitArrayAssignment(statement);
        break;
      default:
        throw new Error(`Unexpected statement kind: ${BoundKind[statement.kind]}`);
    }
  }
  emitStatementBlock(statement) {
    statement.statements.forEach((child) => {
      this.emitStatement(child);
    });
  }
  emitIfStatement(statement) {
    const endOfBlockLabel = this.generateJumpLabel();
    this.emitIfHeader(statement.ifPart.condition, statement.ifPart.block, endOfBlockLabel);
    statement.elseIfParts.forEach((part) => this.emitIfHeader(part.condition, part.block, endOfBlockLabel));
    if (statement.elsePart) {
      this.emitStatement(statement.elsePart);
    }
    this._instructions.push(new TempLabelInstruction(endOfBlockLabel, statement.syntax.range));
  }
  emitIfHeader(condition, block, endOfBlockLabel) {
    const endOfPartLabel = this.generateJumpLabel();
    this.emitExpression(condition);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, endOfPartLabel, condition.syntax.range));
    block.statements.forEach((statement) => this.emitStatement(statement));
    const endOfPartRange = this._instructions[this._instructions.length - 1].sourceRange;
    this._instructions.push(new TempJumpInstruction(endOfBlockLabel, endOfPartRange));
    this._instructions.push(new TempLabelInstruction(endOfPartLabel, endOfPartRange));
  }
  emitWhileStatement(statement) {
    const startOfLoopLabel = this.generateJumpLabel();
    const endOfLoopLabel = this.generateJumpLabel();
    this._instructions.push(new TempLabelInstruction(startOfLoopLabel, statement.syntax.range));
    this.emitExpression(statement.condition);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, endOfLoopLabel, statement.condition.syntax.range));
    this.emitStatement(statement.block);
    const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
    this._instructions.push(new TempJumpInstruction(startOfLoopLabel, endOfLoopRange));
    this._instructions.push(new TempLabelInstruction(endOfLoopLabel, endOfLoopRange));
  }
  emitForStatement(statement) {
    const beforeCheckLabel = this.generateJumpLabel();
    const positiveLoopLabel = this.generateJumpLabel();
    const negativeLoopLabel = this.generateJumpLabel();
    const afterCheckLabel = this.generateJumpLabel();
    const endOfBlockLabel = this.generateJumpLabel();
    this.emitExpression(statement.fromExpression);
    this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.range));
    this._instructions.push(new TempLabelInstruction(beforeCheckLabel, statement.syntax.range));
    if (statement.stepExpression) {
      this.emitExpression(statement.stepExpression);
      this._instructions.push(new PushNumberInstruction(0, statement.stepExpression.syntax.range));
      this._instructions.push(new LessThanInstruction(statement.stepExpression.syntax.range));
      this._instructions.push(new TempConditionalJumpInstruction(negativeLoopLabel, positiveLoopLabel, statement.stepExpression.syntax.range));
    }
    this._instructions.push(new TempLabelInstruction(positiveLoopLabel, statement.toExpression.syntax.range));
    this.emitExpression(statement.toExpression);
    this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.toExpression.syntax.range));
    this._instructions.push(new LessThanInstruction(statement.toExpression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(endOfBlockLabel, afterCheckLabel, statement.toExpression.syntax.range));
    this._instructions.push(new TempLabelInstruction(negativeLoopLabel, statement.toExpression.syntax.range));
    this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.toExpression.syntax.range));
    this.emitExpression(statement.toExpression);
    this._instructions.push(new LessThanInstruction(statement.toExpression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(endOfBlockLabel, void 0, statement.toExpression.syntax.range));
    this._instructions.push(new TempLabelInstruction(afterCheckLabel, statement.toExpression.syntax.range));
    this.emitStatement(statement.block);
    this._instructions.push(new LoadVariableInstruction(statement.identifier, statement.syntax.range));
    if (statement.stepExpression) {
      this.emitExpression(statement.stepExpression);
    } else {
      this._instructions.push(new PushNumberInstruction(1, statement.syntax.range));
    }
    this._instructions.push(new AddInstruction(statement.syntax.range));
    this._instructions.push(new StoreVariableInstruction(statement.identifier, statement.syntax.range));
    this._instructions.push(new TempJumpInstruction(beforeCheckLabel, statement.syntax.range));
    const endOfLoopRange = this._instructions[this._instructions.length - 1].sourceRange;
    this._instructions.push(new TempLabelInstruction(endOfBlockLabel, endOfLoopRange));
  }
  emitLabelStatement(statement) {
    this._instructions.push(new TempLabelInstruction(statement.labelName, statement.syntax.range));
  }
  emitGoToStatement(statement) {
    this._instructions.push(new TempJumpInstruction(statement.labelName, statement.syntax.range));
  }
  emitLibraryMethodInvocation(statement) {
    statement.argumentsList.forEach((argument) => this.emitExpression(argument));
    this._instructions.push(new MethodInvocationInstruction(statement.libraryName, statement.methodName, statement.syntax.range));
  }
  emitSubModuleInvocation(statement) {
    this._instructions.push(new InvokeSubModuleInstruction(statement.subModuleName, statement.syntax.range));
  }
  emitVariableAssignment(statement) {
    this.emitExpression(statement.value);
    this._instructions.push(new StoreVariableInstruction(statement.variableName, statement.syntax.range));
  }
  emitEventAssignment(statement) {
    this._instructions.push(new SetEventHandlerInstruction(
      statement.libraryName,
      statement.eventName,
      statement.subModuleName,
      statement.syntax.range
    ));
  }
  emitArrayAssignment(statement) {
    for (let i = statement.indices.length - 1; i >= 0; i--) {
      this.emitExpression(statement.indices[i]);
    }
    this.emitExpression(statement.value);
    this._instructions.push(new StoreArrayElementInstruction(statement.arrayName, statement.indices.length, statement.syntax.range));
  }
  emitPropertyAssignment(statement) {
    this.emitExpression(statement.value);
    this._instructions.push(new StorePropertyInstruction(statement.libraryName, statement.propertyName, statement.value.syntax.range));
  }
  emitExpression(expression) {
    switch (expression.kind) {
      case 14 /* NegationExpression */:
        this.emitNegationExpression(expression);
        break;
      case 15 /* OrExpression */:
        this.emitOrExpression(expression);
        break;
      case 16 /* AndExpression */:
        this.emitAndExpression(expression);
        break;
      case 17 /* NotEqualExpression */:
        this.emitNotEqualExpression(expression);
        break;
      case 18 /* EqualExpression */:
        this.emitEqualExpression(expression);
        break;
      case 19 /* LessThanExpression */:
        this.emitComparisonExpression(expression, new LessThanInstruction(expression.syntax.range));
        break;
      case 20 /* GreaterThanExpression */:
        this.emitComparisonExpression(expression, new GreaterThanInstruction(expression.syntax.range));
        break;
      case 21 /* LessThanOrEqualExpression */:
        this.emitComparisonExpression(expression, new LessThanOrEqualInstruction(expression.syntax.range));
        break;
      case 22 /* GreaterThanOrEqualExpression */:
        this.emitComparisonExpression(expression, new GreaterThanOrEqualInstruction(expression.syntax.range));
        break;
      case 23 /* AdditionExpression */:
        this.emitAdditionExpression(expression);
        break;
      case 24 /* SubtractionExpression */:
        this.emitSubtractionExpression(expression);
        break;
      case 25 /* MultiplicationExpression */:
        this.emitMultiplicationExpression(expression);
        break;
      case 26 /* DivisionExpression */:
        this.emitDivisionExpression(expression);
        break;
      case 27 /* ArrayAccessExpression */:
        this.emitArrayAccessExpression(expression);
        break;
      case 29 /* LibraryPropertyExpression */:
        this.emitLibraryPropertyExpression(expression);
        break;
      case 32 /* LibraryMethodInvocationExpression */:
        this.emitLibraryMethodInvocationExpression(expression);
        break;
      case 35 /* VariableExpression */:
        this.emitVariableExpression(expression);
        break;
      case 36 /* StringLiteralExpression */:
        this.emitStringLiteralExpression(expression);
        break;
      case 37 /* NumberLiteralExpression */:
        this.emitNumberLiteralExpression(expression);
        break;
      case 38 /* ParenthesisExpression */:
        this.emitParenthesisExpression(expression);
        break;
      default:
        throw new Error(`Unexpected bound expression kind: ${BoundKind[expression.kind]}`);
    }
  }
  emitNegationExpression(expression) {
    this.emitExpression(expression.expression);
    this._instructions.push(new NegateInstruction(expression.syntax.range));
  }
  emitOrExpression(expression) {
    const trySecondLabel = this.generateJumpLabel();
    const trueLabel = this.generateJumpLabel();
    const falseLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this._instructions.push(new TempConditionalJumpInstruction(trueLabel, trySecondLabel, expression.syntax.range));
    this._instructions.push(new TempLabelInstruction(trySecondLabel, expression.syntax.range));
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, falseLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new TempLabelInstruction(trueLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitAndExpression(expression) {
    const falseLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, falseLabel, expression.syntax.range));
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, falseLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(falseLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitEqualExpression(expression) {
    const notEqualLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new EqualInstruction(expression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(void 0, notEqualLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitNotEqualExpression(expression) {
    const notEqualLabel = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new EqualInstruction(expression.syntax.range));
    this._instructions.push(new TempConditionalJumpInstruction(void 0, notEqualLabel, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(notEqualLabel, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitComparisonExpression(expression, comparison) {
    const comparisonFailed = this.generateJumpLabel();
    const endLabel = this.generateJumpLabel();
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(comparison);
    this._instructions.push(new TempConditionalJumpInstruction(void 0, comparisonFailed, expression.syntax.range));
    const endOfOperatorRange = this.instructions[this.instructions.length - 1].sourceRange;
    this._instructions.push(new PushStringInstruction(Constants.True, endOfOperatorRange));
    this._instructions.push(new TempJumpInstruction(endLabel, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(comparisonFailed, endOfOperatorRange));
    this._instructions.push(new PushStringInstruction(Constants.False, endOfOperatorRange));
    this._instructions.push(new TempLabelInstruction(endLabel, endOfOperatorRange));
  }
  emitAdditionExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new AddInstruction(expression.syntax.range));
  }
  emitSubtractionExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new SubtractInstruction(expression.syntax.range));
  }
  emitMultiplicationExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new MultiplyInstruction(expression.syntax.range));
  }
  emitDivisionExpression(expression) {
    this.emitExpression(expression.leftExpression);
    this.emitExpression(expression.rightExpression);
    this._instructions.push(new DivideInstruction(expression.syntax.range));
  }
  emitArrayAccessExpression(expression) {
    for (let i = expression.indices.length - 1; i >= 0; i--) {
      this.emitExpression(expression.indices[i]);
    }
    this._instructions.push(new LoadArrayElementInstruction(expression.arrayName, expression.indices.length, expression.syntax.range));
  }
  emitLibraryPropertyExpression(expression) {
    this._instructions.push(new LoadPropertyInstruction(expression.libraryName, expression.propertyName, expression.syntax.range));
  }
  emitLibraryMethodInvocationExpression(expression) {
    expression.argumentsList.forEach((argument) => this.emitExpression(argument));
    this._instructions.push(new MethodInvocationInstruction(expression.libraryName, expression.methodName, expression.syntax.range));
  }
  emitVariableExpression(expression) {
    this._instructions.push(new LoadVariableInstruction(expression.variableName, expression.syntax.range));
  }
  emitStringLiteralExpression(expression) {
    this._instructions.push(new PushStringInstruction(expression.value, expression.syntax.range));
  }
  emitNumberLiteralExpression(expression) {
    this._instructions.push(new PushNumberInstruction(expression.value, expression.syntax.range));
  }
  emitParenthesisExpression(expression) {
    this.emitExpression(expression.expression);
  }
  generateJumpLabel() {
    return `internal_$$_${this._jumpLabelCounter++}`;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/command-parser.ts
init_polyfills();
var CommandsParser = class _CommandsParser {
  constructor(_tokens, _diagnostics) {
    this._tokens = _tokens;
    this._diagnostics = _diagnostics;
    this._tokens = this._tokens.filter((token) => {
      switch (token.kind) {
        // Ignore tokens that shouldn't be parsed.
        case 0 /* UnrecognizedToken */:
          return false;
        default:
          return true;
      }
    });
    while (this._index < this._tokens.length) {
      this._currentLineHasErrors = false;
      this.parseNextCommand();
      while (this._index < this._tokens.length && this._line === this._tokens[this._index].range.start.line) {
        this._index++;
      }
      this._line++;
    }
  }
  _tokens;
  _diagnostics;
  static MissingTokenText = "?";
  _index = 0;
  _line = 0;
  _currentLineHasErrors = false;
  _result = [];
  get result() {
    return this._result;
  }
  parseNextCommand() {
    let current = this.peek();
    if (current) {
      switch (current.kind) {
        case 37 /* Comment */:
          this._result.push(this.parseCommentCommand());
          break;
        case 1 /* IfKeyword */:
          this._result.push(this.parseIfCommand());
          break;
        case 3 /* ElseKeyword */:
          this._result.push(this.parseElseCommand());
          break;
        case 4 /* ElseIfKeyword */:
          this._result.push(this.parseElseIfCommand());
          break;
        case 5 /* EndIfKeyword */:
          this._result.push(this.parseEndIfCommand());
          break;
        case 6 /* ForKeyword */:
          this._result.push(this.parseForCommand());
          break;
        case 9 /* EndForKeyword */:
          this._result.push(this.parseEndForCommand());
          break;
        case 11 /* WhileKeyword */:
          this._result.push(this.parseWhileCommand());
          break;
        case 12 /* EndWhileKeyword */:
          this._result.push(this.parseEndWhileCommand());
          break;
        case 10 /* GoToKeyword */:
          this._result.push(this.parseGoToCommand());
          break;
        case 34 /* Identifier */:
          if (this.isNext(27 /* Colon */, 1)) {
            this._result.push(this.parseLabelCommand());
          } else {
            this._result.push(this.parseExpressionCommand());
          }
          break;
        case 13 /* SubKeyword */:
          this._result.push(this.parseSubCommand());
          break;
        case 14 /* EndSubKeyword */:
          this._result.push(this.parseEndSubCommand());
          break;
        case 24 /* Minus */:
        case 35 /* NumberLiteral */:
        case 36 /* StringLiteral */:
        case 17 /* LeftParen */:
          this._result.push(this.parseExpressionCommand());
          break;
        default:
          this.eat(current.kind);
          this.reportError(new Diagnostic(2 /* UnrecognizedCommand */, current.range, current.text));
          break;
      }
    }
    current = this.peek();
    if (current) {
      if (current.kind === 37 /* Comment */) {
        this._result.push(this.parseCommentCommand());
      } else {
        this.reportError(new Diagnostic(5 /* UnexpectedToken_ExpectingEOL */, current.range, current.text));
      }
    }
  }
  parseCommentCommand() {
    const comment = this.eat(37 /* Comment */);
    return new CommentCommandSyntax(comment);
  }
  parseIfCommand() {
    const ifKeyword = this.eat(1 /* IfKeyword */);
    const expression = this.parseBaseExpression();
    const thenKeyword = this.eat(2 /* ThenKeyword */);
    return new IfCommandSyntax(ifKeyword, expression, thenKeyword);
  }
  parseElseIfCommand() {
    const elseIfKeyword = this.eat(4 /* ElseIfKeyword */);
    const expression = this.parseBaseExpression();
    const thenKeyword = this.eat(2 /* ThenKeyword */);
    return new ElseIfCommandSyntax(elseIfKeyword, expression, thenKeyword);
  }
  parseElseCommand() {
    const elseKeyword = this.eat(3 /* ElseKeyword */);
    return new ElseCommandSyntax(elseKeyword);
  }
  parseEndIfCommand() {
    const endIfKeyword = this.eat(5 /* EndIfKeyword */);
    return new EndIfCommandSyntax(endIfKeyword);
  }
  parseForCommand() {
    const forKeyword = this.eat(6 /* ForKeyword */);
    const identifierToken = this.eat(34 /* Identifier */);
    const equalToken = this.eat(21 /* Equal */);
    const fromExpression = this.parseBaseExpression();
    const toToken = this.eat(7 /* ToKeyword */);
    const toExpression = this.parseBaseExpression();
    let stepClauseSyntax;
    if (this.isNext(8 /* StepKeyword */)) {
      const stepToken = this.eat(8 /* StepKeyword */);
      const stepExpression = this.parseBaseExpression();
      stepClauseSyntax = new ForStepClauseSyntax(stepToken, stepExpression);
    }
    return new ForCommandSyntax(forKeyword, identifierToken, equalToken, fromExpression, toToken, toExpression, stepClauseSyntax);
  }
  parseEndForCommand() {
    const endForKeyword = this.eat(9 /* EndForKeyword */);
    return new EndForCommandSyntax(endForKeyword);
  }
  parseWhileCommand() {
    const whileToken = this.eat(11 /* WhileKeyword */);
    const expression = this.parseBaseExpression();
    return new WhileCommandSyntax(whileToken, expression);
  }
  parseEndWhileCommand() {
    const endWhileKeyword = this.eat(12 /* EndWhileKeyword */);
    return new EndWhileCommandSyntax(endWhileKeyword);
  }
  parseLabelCommand() {
    const labelToken = this.eat(34 /* Identifier */);
    const colonToken = this.eat(27 /* Colon */);
    return new LabelCommandSyntax(labelToken, colonToken);
  }
  parseGoToCommand() {
    const gotoToken = this.eat(10 /* GoToKeyword */);
    const labelToken = this.eat(34 /* Identifier */);
    return new GoToCommandSyntax(gotoToken, labelToken);
  }
  parseSubCommand() {
    const subToken = this.eat(13 /* SubKeyword */);
    const nameToken = this.eat(34 /* Identifier */);
    return new SubCommandSyntax(subToken, nameToken);
  }
  parseEndSubCommand() {
    const endSubToken = this.eat(14 /* EndSubKeyword */);
    return new EndSubCommandSyntax(endSubToken);
  }
  parseExpressionCommand() {
    const expression = this.parseBaseExpression();
    return new ExpressionCommandSyntax(expression);
  }
  parseBaseExpression() {
    return this.parseBinaryOperator(0);
  }
  parseBinaryOperator(precedence) {
    if (precedence >= _CommandsParser.BinaryOperatorPrecedence.length) {
      return this.parseUnaryOperator();
    }
    let expression = this.parseBinaryOperator(precedence + 1);
    const expectedOperatorKind = _CommandsParser.BinaryOperatorPrecedence[precedence];
    while (this.isNext(expectedOperatorKind)) {
      const operatorToken = this.eat(expectedOperatorKind);
      const rightHandSide = this.parseBinaryOperator(precedence + 1);
      expression = new BinaryOperatorExpressionSyntax(expression, operatorToken, rightHandSide);
    }
    return expression;
  }
  parseUnaryOperator() {
    if (this.isNext(24 /* Minus */)) {
      const minusToken = this.eat(24 /* Minus */);
      const expression = this.parseBaseExpression();
      return new UnaryOperatorExpressionSyntax(minusToken, expression);
    }
    return this.parseCoreExpression();
  }
  parseCoreExpression() {
    let expression = this.parseTerminalExpression();
    while (true) {
      const currentToken = this.peek();
      if (!currentToken) {
        return expression;
      }
      switch (currentToken.kind) {
        case 15 /* Dot */:
          expression = this.parseObjectAccessExpression(expression);
          break;
        case 19 /* LeftSquareBracket */:
          expression = this.parseArrayAccessExpressoin(expression);
          break;
        case 17 /* LeftParen */:
          expression = this.parseCallExpression(expression);
          break;
        default:
          return expression;
      }
    }
  }
  parseObjectAccessExpression(leftHandSide) {
    const dotToken = this.eat(15 /* Dot */);
    const identifierToken = this.eat(34 /* Identifier */);
    return new ObjectAccessExpressionSyntax(leftHandSide, dotToken, identifierToken);
  }
  parseArrayAccessExpressoin(leftHandSide) {
    const leftSquareBracket = this.eat(19 /* LeftSquareBracket */);
    const indexExpression = this.parseBaseExpression();
    const rightSquareBracket = this.eat(18 /* RightSquareBracket */);
    return new ArrayAccessExpressionSyntax(leftHandSide, leftSquareBracket, indexExpression, rightSquareBracket);
  }
  parseCallExpression(leftHandSide) {
    const leftParen = this.eat(17 /* LeftParen */);
    const argumentsList = [];
    let currentToken = this.peek();
    let currentArgument;
    loop: while (currentToken) {
      if (currentArgument) {
        switch (currentToken.kind) {
          case 20 /* Comma */: {
            const comma = this.eat(20 /* Comma */);
            argumentsList.push(new ArgumentSyntax(currentArgument, comma));
            currentArgument = void 0;
            break;
          }
          case 16 /* RightParen */: {
            argumentsList.push(new ArgumentSyntax(currentArgument, void 0));
            currentArgument = void 0;
            break loop;
          }
          default: {
            this.reportError(new Diagnostic(
              4 /* UnexpectedToken_ExpectingToken */,
              currentToken.range,
              currentToken.text,
              CompilerUtils.tokenToDisplayString(20 /* Comma */)
            ));
            argumentsList.push(new ArgumentSyntax(currentArgument, void 0));
            currentArgument = void 0;
            break;
          }
        }
      } else if (currentToken.kind === 16 /* RightParen */) {
        break loop;
      } else {
        currentArgument = this.parseBaseExpression();
      }
      currentToken = this.peek();
    }
    if (currentArgument) {
      argumentsList.push(new ArgumentSyntax(currentArgument, void 0));
    }
    const rightParen = this.eat(16 /* RightParen */);
    return new InvocationExpressionSyntax(leftHandSide, leftParen, argumentsList, rightParen);
  }
  parseTerminalExpression() {
    const current = this.peek();
    if (!current) {
      const range = this._tokens[this._index - 1].range;
      this.reportError(new Diagnostic(6 /* UnexpectedEOL_ExpectingExpression */, range));
      return new IdentifierExpressionSyntax(this.createMissingToken(range, 34 /* Identifier */));
    }
    switch (current.kind) {
      case 34 /* Identifier */: {
        const identifierToken = this.eat(34 /* Identifier */);
        return new IdentifierExpressionSyntax(identifierToken);
      }
      case 35 /* NumberLiteral */: {
        const numberToken = this.eat(35 /* NumberLiteral */);
        return new NumberLiteralExpressionSyntax(numberToken);
      }
      case 36 /* StringLiteral */: {
        const stringToken = this.eat(36 /* StringLiteral */);
        return new StringLiteralExpressionSyntax(stringToken);
      }
      case 17 /* LeftParen */: {
        const leftParen = this.eat(17 /* LeftParen */);
        const expression = this.parseBaseExpression();
        const rightParen = this.eat(16 /* RightParen */);
        return new ParenthesisExpressionSyntax(leftParen, expression, rightParen);
      }
      default: {
        this.eat(current.kind);
        this.reportError(new Diagnostic(3 /* UnexpectedToken_ExpectingExpression */, current.range, current.text));
        return new IdentifierExpressionSyntax(this.createMissingToken(current.range, 34 /* Identifier */));
      }
    }
  }
  isNext(kind, offset) {
    const current = this.peek(offset);
    return !!current && current.kind === kind;
  }
  peek(offset) {
    offset || (offset = 0);
    if (this._index + offset < this._tokens.length) {
      const current = this._tokens[this._index + offset];
      if (current.range.start.line === this._line) {
        return current;
      }
    }
    return;
  }
  eat(kind) {
    if (this._index < this._tokens.length) {
      const current = this._tokens[this._index];
      if (current.range.start.line === this._line) {
        if (current.kind === kind) {
          this._index++;
          return new TokenSyntax(current);
        } else {
          this.reportError(new Diagnostic(4 /* UnexpectedToken_ExpectingToken */, current.range, current.text, CompilerUtils.tokenToDisplayString(kind)));
          return this.createMissingToken(current.range, kind);
        }
      }
    }
    const range = this._tokens[this._index - 1].range;
    this.reportError(new Diagnostic(7 /* UnexpectedEOL_ExpectingToken */, range, CompilerUtils.tokenToDisplayString(kind)));
    return this.createMissingToken(range, kind);
  }
  createMissingToken(range, kind) {
    return new TokenSyntax(new Token(_CommandsParser.MissingTokenText, kind, range));
  }
  reportError(error) {
    if (!this._currentLineHasErrors) {
      this._diagnostics.push(error);
      this._currentLineHasErrors = true;
    }
  }
  static BinaryOperatorPrecedence = [
    32 /* Or */,
    33 /* And */,
    21 /* Equal */,
    22 /* NotEqual */,
    28 /* LessThan */,
    29 /* GreaterThan */,
    30 /* LessThanOrEqual */,
    31 /* GreaterThanOrEqual */,
    23 /* Plus */,
    24 /* Minus */,
    25 /* Multiply */,
    26 /* Divide */
  ];
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/scanner.ts
init_polyfills();
var Scanner = class _Scanner {
  constructor(_text, _diagnostics) {
    this._text = _text;
    this._diagnostics = _diagnostics;
    while (this.scanNextToken()) ;
  }
  _text;
  _diagnostics;
  _index = 0;
  _line = 0;
  _column = 0;
  _result = [];
  get result() {
    return this._result;
  }
  scanNextToken() {
    let current = void 0;
    let next = void 0;
    if (this._index + 1 < this._text.length) {
      current = this._text[this._index];
      next = this._text[this._index + 1];
    } else if (this._index < this._text.length) {
      current = this._text[this._index];
    } else {
      return false;
    }
    switch (current) {
      case "\r":
        switch (next) {
          case "\n":
            this._index += 2;
            this._line++;
            this._column = 0;
            return true;
          default:
            this._index++;
            this._line++;
            this._column = 0;
            return true;
        }
      case "\n":
        this._index++;
        this._line++;
        this._column = 0;
        return true;
      case " ":
        this._index++;
        this._column++;
        return true;
      case "	":
        this._index++;
        this._column++;
        return true;
      case "(":
        this.addToken(current, 17 /* LeftParen */);
        return true;
      case ")":
        this.addToken(current, 16 /* RightParen */);
        return true;
      case "[":
        this.addToken(current, 19 /* LeftSquareBracket */);
        return true;
      case "]":
        this.addToken(current, 18 /* RightSquareBracket */);
        return true;
      case ".":
        this.addToken(current, 15 /* Dot */);
        return true;
      case ",":
        this.addToken(current, 20 /* Comma */);
        return true;
      case "=":
        this.addToken(current, 21 /* Equal */);
        return true;
      case ":":
        this.addToken(current, 27 /* Colon */);
        return true;
      case "+":
        this.addToken(current, 23 /* Plus */);
        return true;
      case "-":
        this.addToken(current, 24 /* Minus */);
        return true;
      case "*":
        this.addToken(current, 25 /* Multiply */);
        return true;
      case "/":
        this.addToken(current, 26 /* Divide */);
        return true;
      case "<":
        switch (next) {
          case ">":
            this.addToken(current + next, 22 /* NotEqual */);
            return true;
          case "=":
            this.addToken(current + next, 30 /* LessThanOrEqual */);
            return true;
          default:
            this.addToken(current, 28 /* LessThan */);
            return true;
        }
      case ">":
        switch (next) {
          case "=":
            this.addToken(current + next, 31 /* GreaterThanOrEqual */);
            return true;
          default:
            this.addToken(current, 29 /* GreaterThan */);
            return true;
        }
      case "'":
        this.scanCommentToken();
        return true;
      case '"':
        this.scanStringToken();
        return true;
    }
    if ("0" <= current && current <= "9") {
      this.scanNumberToken();
      return true;
    } else if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z") {
      this.scanWordToken();
      return true;
    }
    const token = this.addToken(current, 0 /* UnrecognizedToken */);
    this._diagnostics.push(new Diagnostic(0 /* UnrecognizedCharacter */, token.range, current));
    return true;
  }
  scanCommentToken() {
    let lookAhead = this._index;
    while (lookAhead < this._text.length) {
      const current = this._text[lookAhead];
      if (current === "\r" || current === "\n") {
        break;
      }
      lookAhead++;
    }
    this.addToken(this._text.substr(this._index, lookAhead - this._index).trim(), 37 /* Comment */);
  }
  scanStringToken() {
    let lookAhead = this._index + 1;
    while (lookAhead < this._text.length) {
      const ch = this._text[lookAhead];
      switch (ch) {
        case '"':
          this.addToken(this._text.substr(this._index, lookAhead - this._index + 1), 36 /* StringLiteral */);
          return;
        case "\r":
        case "\n":
          const token = this.addToken(this._text.substr(this._index, lookAhead - this._index), 36 /* StringLiteral */);
          this._diagnostics.push(new Diagnostic(1 /* UnterminatedStringLiteral */, token.range));
          return;
        default:
          if (!_Scanner.isSupportedCharacter(ch)) {
            const column = this._column + lookAhead - this._index;
            const range = CompilerRange.fromValues(this._line, column, this._line, column);
            this._diagnostics.push(new Diagnostic(0 /* UnrecognizedCharacter */, range, ch));
          }
          lookAhead++;
          break;
      }
    }
    const unrecognizedToken = this.addToken(this._text.substr(this._index, lookAhead - this._index), 36 /* StringLiteral */);
    this._diagnostics.push(new Diagnostic(1 /* UnterminatedStringLiteral */, unrecognizedToken.range));
  }
  scanNumberToken() {
    let lookAhead = this._index;
    while (lookAhead < this._text.length && "0" <= this._text[lookAhead] && this._text[lookAhead] <= "9") {
      lookAhead++;
    }
    if (lookAhead < this._text.length && this._text[lookAhead] === ".") {
      lookAhead++;
      while (lookAhead < this._text.length && "0" <= this._text[lookAhead] && this._text[lookAhead] <= "9") {
        lookAhead++;
      }
    }
    this.addToken(this._text.substr(this._index, lookAhead - this._index), 35 /* NumberLiteral */);
  }
  scanWordToken() {
    let lookAhead = this._index;
    while (lookAhead < this._text.length) {
      const current = this._text[lookAhead];
      if (current === "_" || "a" <= current && current <= "z" || "A" <= current && current <= "Z" || "0" <= current && current <= "9") {
        lookAhead++;
      } else {
        break;
      }
    }
    const word = this._text.substr(this._index, lookAhead - this._index);
    switch (word.toLowerCase()) {
      case "if":
        this.addToken(word, 1 /* IfKeyword */);
        return;
      case "then":
        this.addToken(word, 2 /* ThenKeyword */);
        return;
      case "else":
        this.addToken(word, 3 /* ElseKeyword */);
        return;
      case "elseif":
        this.addToken(word, 4 /* ElseIfKeyword */);
        return;
      case "endif":
        this.addToken(word, 5 /* EndIfKeyword */);
        return;
      case "for":
        this.addToken(word, 6 /* ForKeyword */);
        return;
      case "to":
        this.addToken(word, 7 /* ToKeyword */);
        return;
      case "step":
        this.addToken(word, 8 /* StepKeyword */);
        return;
      case "endfor":
        this.addToken(word, 9 /* EndForKeyword */);
        return;
      case "goto":
        this.addToken(word, 10 /* GoToKeyword */);
        return;
      case "while":
        this.addToken(word, 11 /* WhileKeyword */);
        return;
      case "endwhile":
        this.addToken(word, 12 /* EndWhileKeyword */);
        return;
      case "sub":
        this.addToken(word, 13 /* SubKeyword */);
        return;
      case "endsub":
        this.addToken(word, 14 /* EndSubKeyword */);
        return;
      case "or":
        this.addToken(word, 32 /* Or */);
        return;
      case "and":
        this.addToken(word, 33 /* And */);
        return;
      default:
        this.addToken(word, 34 /* Identifier */);
        return;
    }
  }
  addToken(current, kind) {
    const token = new Token(current, kind, CompilerRange.fromValues(this._line, this._column, this._line, this._column + current.length));
    this._index += current.length;
    this._column += current.length;
    this._result.push(token);
    return token;
  }
  static isSupportedCharacter(ch) {
    if (ch.length !== 1) {
      throw `Must pass a single character at a time`;
    }
    const keycode = ch.charCodeAt(0);
    return 32 <= keycode && keycode <= 126;
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/syntax/statements-parser.ts
init_polyfills();
var StatementsParser = class {
  constructor(_commands, _diagnostics) {
    this._commands = _commands;
    this._diagnostics = _diagnostics;
    let startModuleCommand;
    let currentModuleStatements = [];
    while (this._index < this._commands.length) {
      const current = this._commands[this._index];
      switch (current.kind) {
        case 18 /* SubCommand */: {
          if (startModuleCommand) {
            this.eat(current.kind);
            this._diagnostics.push(new Diagnostic(10 /* CannotDefineASubInsideAnotherSub */, current.range));
          } else {
            this._mainModule.push(...currentModuleStatements);
            currentModuleStatements = [];
            startModuleCommand = this.eat(current.kind);
          }
          break;
        }
        case 19 /* EndSubCommand */: {
          if (startModuleCommand) {
            const endModuleCommand = this.eat(current.kind);
            this._subModules.push(new SubModuleDeclarationSyntax(
              startModuleCommand,
              new StatementBlockSyntax(currentModuleStatements),
              endModuleCommand
            ));
            startModuleCommand = void 0;
            currentModuleStatements = [];
          } else {
            this.eat(current.kind);
            this._diagnostics.push(new Diagnostic(
              11 /* CannotHaveCommandWithoutPreviousCommand */,
              current.range,
              CompilerUtils.commandToDisplayString(19 /* EndSubCommand */),
              CompilerUtils.commandToDisplayString(18 /* SubCommand */)
            ));
          }
          break;
        }
        default: {
          const statement = this.parseStatement(current);
          if (statement) {
            currentModuleStatements.push(statement);
          }
          break;
        }
      }
    }
    if (startModuleCommand) {
      const endModuleCommand = this.eat(19 /* EndSubCommand */);
      this._subModules.push(new SubModuleDeclarationSyntax(
        startModuleCommand,
        new StatementBlockSyntax(currentModuleStatements),
        endModuleCommand
      ));
    } else {
      this._mainModule.push(...currentModuleStatements);
    }
  }
  _commands;
  _diagnostics;
  _index = 0;
  _mainModule = [];
  _subModules = [];
  get result() {
    return new ParseTreeSyntax(new StatementBlockSyntax(this._mainModule), this._subModules);
  }
  parseStatement(current) {
    switch (current.kind) {
      case 7 /* IfCommand */: {
        return this.parseIfStatement();
      }
      case 8 /* ElseCommand */:
      case 9 /* ElseIfCommand */:
      case 10 /* EndIfCommand */: {
        this.eat(current.kind);
        this._diagnostics.push(new Diagnostic(
          11 /* CannotHaveCommandWithoutPreviousCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(7 /* IfCommand */)
        ));
        return;
      }
      case 12 /* ForCommand */: {
        return this.parseForStatement();
      }
      case 13 /* EndForCommand */: {
        this.eat(current.kind);
        this._diagnostics.push(new Diagnostic(
          11 /* CannotHaveCommandWithoutPreviousCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(12 /* ForCommand */)
        ));
        return;
      }
      case 14 /* WhileCommand */: {
        return this.parseWhileStatement();
      }
      case 15 /* EndWhileCommand */: {
        this.eat(current.kind);
        this._diagnostics.push(new Diagnostic(
          11 /* CannotHaveCommandWithoutPreviousCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(14 /* WhileCommand */)
        ));
        return;
      }
      case 16 /* LabelCommand */: {
        return this.eat(16 /* LabelCommand */);
      }
      case 17 /* GoToCommand */: {
        return this.eat(17 /* GoToCommand */);
      }
      case 20 /* ExpressionCommand */: {
        return this.eat(20 /* ExpressionCommand */);
      }
      case 21 /* CommentCommand */: {
        return this.eat(21 /* CommentCommand */);
      }
      default: {
        throw new Error(`Unexpected command ${SyntaxKind[current.kind]} here`);
      }
    }
  }
  parseIfStatement() {
    const ifCommand = this.eat(7 /* IfCommand */);
    const ifPartStatements = this.parseStatementsExcept(
      9 /* ElseIfCommand */,
      8 /* ElseCommand */,
      10 /* EndIfCommand */
    );
    const ifPart = new IfHeaderSyntax(ifCommand, ifPartStatements);
    const elseIfParts = [];
    while (this.isNext(9 /* ElseIfCommand */)) {
      const elseIfCommand = this.eat(9 /* ElseIfCommand */);
      const statements = this.parseStatementsExcept(
        9 /* ElseIfCommand */,
        8 /* ElseCommand */,
        10 /* EndIfCommand */
      );
      elseIfParts.push(new IfHeaderSyntax(elseIfCommand, statements));
    }
    let elsePart;
    if (this.isNext(8 /* ElseCommand */)) {
      const elseCommand = this.eat(8 /* ElseCommand */);
      const statements = this.parseStatementsExcept(
        9 /* ElseIfCommand */,
        8 /* ElseCommand */,
        10 /* EndIfCommand */
      );
      elsePart = new IfHeaderSyntax(elseCommand, statements);
    }
    let endIfPart = this.eat(10 /* EndIfCommand */);
    return new IfStatementSyntax(ifPart, elseIfParts, elsePart, endIfPart);
  }
  parseForStatement() {
    const forCommand = this.eat(12 /* ForCommand */);
    const statements = this.parseStatementsExcept(13 /* EndForCommand */);
    const endForCommand = this.eat(13 /* EndForCommand */);
    return new ForStatementSyntax(forCommand, statements, endForCommand);
  }
  parseWhileStatement() {
    const whileCommand = this.eat(14 /* WhileCommand */);
    const statements = this.parseStatementsExcept(15 /* EndWhileCommand */);
    const endWhileCommand = this.eat(15 /* EndWhileCommand */);
    return new WhileStatementSyntax(whileCommand, statements, endWhileCommand);
  }
  parseStatementsExcept(...kinds) {
    const statements = [];
    let next;
    while ((next = this.peek()) && !kinds.some((kind) => kind === next.kind)) {
      const statement = this.parseStatement(next);
      if (statement) {
        statements.push(statement);
      }
    }
    return new StatementBlockSyntax(statements);
  }
  isNext(kind) {
    if (this._index < this._commands.length) {
      return this._commands[this._index].kind === kind;
    }
    return false;
  }
  peek() {
    if (this._index < this._commands.length) {
      return this._commands[this._index];
    }
    return;
  }
  eat(kind) {
    if (this._index < this._commands.length) {
      const current = this._commands[this._index];
      if (current.kind === kind) {
        this._index++;
        return current;
      } else {
        this._diagnostics.push(new Diagnostic(
          8 /* UnexpectedCommand_ExpectingCommand */,
          current.range,
          CompilerUtils.commandToDisplayString(current.kind),
          CompilerUtils.commandToDisplayString(kind)
        ));
        return new MissingCommandSyntax(kind, current.range);
      }
    } else {
      const range = this._commands[this._commands.length - 1].range;
      this._diagnostics.push(new Diagnostic(
        9 /* UnexpectedEOF_ExpectingCommand */,
        range,
        CompilerUtils.commandToDisplayString(kind)
      ));
      return new MissingCommandSyntax(kind, range);
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/compilation.ts
var Compilation = class {
  constructor(text) {
    this.text = text;
    this.diagnostics = [];
    this.tokens = new Scanner(this.text, this.diagnostics).result;
    const commands2 = new CommandsParser(this.tokens, this.diagnostics).result;
    this.parseTree = new StatementsParser(commands2, this.diagnostics).result;
    this.setParentNode(this.parseTree);
    const binder = new ModulesBinder(this.parseTree, this.diagnostics);
    this.boundSubModules = binder.boundModules;
  }
  text;
  _outputKindDetector;
  tokens;
  parseTree;
  boundSubModules;
  diagnostics = [];
  get isReadyToRun() {
    return !!this.text.trim() && !this.diagnostics.length;
  }
  get kind() {
    if (!this._outputKindDetector) {
      this._outputKindDetector = new OutputKindDetector();
      this._outputKindDetector.visit(this.parseTree);
    }
    return this._outputKindDetector;
  }
  emit() {
    if (!this.isReadyToRun) {
      throw new Error(`Cannot emit an empty or errornous compilation`);
    }
    const result = {};
    for (const name in this.boundSubModules) {
      result[name] = new ModuleEmitter(this.boundSubModules[name]).instructions;
    }
    return result;
  }
  getSyntaxNode(position, kind) {
    function getSyntaxNodeAux(node, position2) {
      if (node.range.containsPosition(position2)) {
        let children = node.children();
        for (let i = 0; i < children.length; i++) {
          const result = getSyntaxNodeAux(children[i], position2);
          if (result) {
            return result;
          }
        }
        if (node.kind === kind) {
          return node;
        }
      }
      return void 0;
    }
    return getSyntaxNodeAux(this.parseTree, position);
  }
  setParentNode(node) {
    node.children().forEach((child) => {
      child.parentOpt = node;
      this.setParentNode(child);
    });
  }
};
var OutputKindDetector = class extends SyntaxNodeVisitor {
  _writesToTextWindow = false;
  _drawsShapes = false;
  writesToTextWindow() {
    return this._writesToTextWindow;
  }
  drawsShapes() {
    return this._drawsShapes;
  }
  visitIdentifierExpression(node) {
    const identifier = node.identifierToken.token.text.toLowerCase();
    if (identifier === "textwindow") {
      this._writesToTextWindow = true;
    }
    switch (identifier) {
      case "graphicswindow":
      case "shapes":
      case "controls":
      case "turtle":
        this._drawsShapes = true;
        break;
    }
  }
};

// ../../vendor/SmallBasicOnline/src/compiler/services/completion-service.ts
init_polyfills();
var CompletionService;
((CompletionService2) => {
  let ResultKind;
  ((ResultKind2) => {
    ResultKind2[ResultKind2["Class"] = 0] = "Class";
    ResultKind2[ResultKind2["Method"] = 1] = "Method";
    ResultKind2[ResultKind2["Property"] = 2] = "Property";
    ResultKind2[ResultKind2["Snippet"] = 3] = "Snippet";
    ResultKind2[ResultKind2["Event"] = 4] = "Event";
  })(ResultKind = CompletionService2.ResultKind || (CompletionService2.ResultKind = {}));
  function provideCompletion(compilation, position) {
    const objectAccessExpression = compilation.getSyntaxNode(position, 24 /* ObjectAccessExpression */);
    if (objectAccessExpression) {
      const visitor = new CompletionVisitor(compilation);
      visitor.visit(objectAccessExpression);
      return visitor.results;
    }
    const identifierExpression = compilation.getSyntaxNode(position, 29 /* IdentifierExpression */);
    if (identifierExpression) {
      const visitor = new CompletionVisitor(compilation);
      visitor.visit(identifierExpression);
      return visitor.results;
    }
    if (!compilation.text.trim()) {
      return getResultsBeforeDot("", compilation);
    }
    const wordAtCursor = extractWordAtPosition(compilation.text, position);
    return getResultsBeforeDot(wordAtCursor, compilation);
  }
  CompletionService2.provideCompletion = provideCompletion;
  class CompletionVisitor extends SyntaxNodeVisitor {
    constructor(compilation) {
      super();
      this.compilation = compilation;
    }
    compilation;
    _allResults = [];
    get results() {
      return this._allResults;
    }
    addResult(result) {
      this._allResults.push(result);
    }
    visitObjectAccessExpression(node) {
      if (node.baseExpression.kind !== 29 /* IdentifierExpression */) {
        return;
      }
      const libraryName = node.baseExpression.identifierToken.token.text;
      const library = CompilerUtils.lookupIgnoreCase(RuntimeLibraries.Metadata, libraryName);
      if (!library) {
        return;
      }
      let memberName = node.identifierToken.token.text;
      if (memberName === CommandsParser.MissingTokenText) {
        memberName = "";
      }
      CompilerUtils.values(library.methods).forEach((method) => {
        if (CompilerUtils.stringStartsWith(method.methodName, memberName)) {
          this.addResult({
            title: method.methodName,
            description: method.description,
            kind: 1 /* Method */,
            insertText: `${method.methodName}(${method.parameters.map((parameter, i) => `\${${i + 1}:${parameter}}`).join(", ")})`
          });
        }
      });
      CompilerUtils.values(library.properties).forEach((property) => {
        if (CompilerUtils.stringStartsWith(property.propertyName, memberName)) {
          this.addResult({
            title: property.propertyName,
            description: property.description,
            kind: 2 /* Property */
          });
        }
      });
      CompilerUtils.values(library.events).forEach((event) => {
        if (CompilerUtils.stringStartsWith(event.eventName, memberName)) {
          this.addResult({
            title: event.eventName,
            description: event.description,
            kind: 4 /* Event */
          });
        }
      });
    }
    visitIdentifierExpression(node) {
      const libraryName = node.identifierToken.token.text;
      this._allResults = getResultsBeforeDot(libraryName, this.compilation);
    }
  }
  function getResultsBeforeDot(prefix, compilation) {
    const results = [];
    collectVariablesAndSubModules(compilation).forEach((name) => {
      if (CompilerUtils.stringStartsWith(name, prefix)) {
        results.push({
          title: name,
          description: name,
          kind: name in compilation.boundSubModules ? 1 /* Method */ : 2 /* Property */
        });
      }
    });
    CompilerUtils.values(RuntimeLibraries.Metadata).forEach((library) => {
      if (CompilerUtils.stringStartsWith(library.typeName, prefix)) {
        results.push({
          title: library.typeName,
          description: library.description,
          kind: 0 /* Class */
        });
      }
    });
    keywordSnippets().forEach((snippet3) => {
      if (CompilerUtils.stringStartsWith(snippet3.title, prefix)) {
        results.push(snippet3);
      }
    });
    return results;
  }
  function collectVariablesAndSubModules(compilation) {
    const names = [];
    const seen = /* @__PURE__ */ new Set();
    const add = (name) => {
      const key = name.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        names.push(name);
      }
    };
    for (const [name, module2] of Object.entries(compilation.boundSubModules)) {
      if (name !== "<Main>") {
        add(name);
      }
      visit(module2, add);
    }
    return names;
  }
  function visit(node, add) {
    switch (node.kind) {
      case 10 /* VariableAssignmentStatement */:
        add(node.variableName);
        break;
      case 12 /* ArrayAssignmentStatement */:
        add(node.arrayName);
        break;
      case 8 /* LibraryMethodInvocationStatement */:
        collectArrayLibraryName(node, add);
        break;
      case 32 /* LibraryMethodInvocationExpression */:
        collectArrayLibraryName(node, add);
        break;
      default:
        break;
    }
    node.children().forEach((child) => visit(child, add));
  }
  function collectArrayLibraryName(node, add) {
    if (node.libraryName.toLowerCase() !== "array") {
      return;
    }
    switch (node.methodName.toLowerCase()) {
      case "setvalue":
      case "getvalue":
      case "removevalue":
        break;
      default:
        return;
    }
    const [firstArgument] = node.argumentsList;
    if (firstArgument?.kind === 36 /* StringLiteralExpression */) {
      add(firstArgument.value);
    }
  }
  function keywordSnippets() {
    return [
      snippet2("If", "If ${1:condition} Then\nEndIf"),
      snippet2("ElseIf", "ElseIf ${1:condition} Then"),
      snippet2("Else", "Else"),
      snippet2("EndIf", "EndIf"),
      snippet2("GoTo", "GoTo ${1:label}"),
      snippet2("While", "While ${1:condition}\nEndWhile"),
      snippet2("EndWhile", "EndWhile"),
      snippet2("For", "For ${1:name} = ${2:start} To ${3:end}\nEndFor"),
      snippet2("For Step", "For ${1:name} = ${2:start} To ${3:end} Step ${4:increment}\nEndFor"),
      snippet2("EndFor", "EndFor"),
      snippet2("Sub", "Sub ${1:name}\nEndSub"),
      snippet2("EndSub", "EndSub")
    ];
  }
  function snippet2(title, insertText) {
    return {
      kind: 3 /* Snippet */,
      title,
      description: title,
      insertText
    };
  }
  function extractWordAtPosition(text, position) {
    const lineEnd = text.indexOf("\n", position.line > 0 ? nthLineStart(text, position.line) : 0);
    const lineStart = position.line > 0 ? nthLineStart(text, position.line) : 0;
    const line = text.substring(
      lineStart,
      lineEnd === -1 ? text.length : lineEnd
    );
    const col = Math.min(position.column, line.length);
    let start = col;
    while (start > 0 && isWordChar(line.charCodeAt(start - 1))) {
      start -= 1;
    }
    return line.substring(start, col);
  }
  function nthLineStart(text, line) {
    let pos = 0;
    for (let i = 0; i < line; i++) {
      const next = text.indexOf("\n", pos);
      if (next === -1) {
        return text.length;
      }
      pos = next + 1;
    }
    return pos;
  }
  function isWordChar(code) {
    return code >= 48 && code <= 57 || code >= 65 && code <= 90 || code >= 97 && code <= 122 || code === 95;
  }
})(CompletionService || (CompletionService = {}));

// ../../vendor/SmallBasicOnline/src/compiler/services/hover-service.ts
init_polyfills();
var HoverService;
((HoverService2) => {
  function provideHover(compilation, position) {
    for (let i = 0; i < compilation.diagnostics.length; i++) {
      const diagnostic = compilation.diagnostics[i];
      if (diagnostic.range.containsPosition(position)) {
        return {
          range: diagnostic.range,
          text: [diagnostic.toString()]
        };
      }
    }
    const node = compilation.getSyntaxNode(position, 24 /* ObjectAccessExpression */);
    if (node) {
      const visitor = new HoverVisitor();
      visitor.visit(node);
      return visitor.result;
    }
    return void 0;
  }
  HoverService2.provideHover = provideHover;
  class HoverVisitor extends SyntaxNodeVisitor {
    _firstResult;
    get result() {
      return this._firstResult;
    }
    setResult(result) {
      if (!this._firstResult) {
        this._firstResult = result;
      }
    }
    visitObjectAccessExpression(node) {
      if (node.baseExpression.kind !== 29 /* IdentifierExpression */) {
        return;
      }
      const libraryNameText = node.baseExpression.identifierToken.token.text;
      const libraryName = CompilerUtils.findKeyIgnoreCase(RuntimeLibraries.Metadata, libraryNameText);
      const library = libraryName === void 0 ? void 0 : RuntimeLibraries.Metadata[libraryName];
      if (!library) {
        return;
      }
      let description;
      const memberNameText = node.identifierToken.token.text;
      const methodKey = CompilerUtils.findKeyIgnoreCase(library.methods, memberNameText);
      const propertyKey = methodKey === void 0 ? CompilerUtils.findKeyIgnoreCase(library.properties, memberNameText) : void 0;
      const eventKey = methodKey === void 0 && propertyKey === void 0 ? CompilerUtils.findKeyIgnoreCase(library.events, memberNameText) : void 0;
      const memberName = methodKey !== void 0 ? methodKey : propertyKey ?? eventKey;
      if (methodKey !== void 0) {
        description = library.methods[methodKey].description;
      } else if (propertyKey !== void 0) {
        description = library.properties[propertyKey].description;
      } else if (eventKey !== void 0) {
        description = library.events[eventKey].description;
      } else {
        return;
      }
      this.setResult({
        range: node.range,
        text: [
          `${libraryName}.${memberName}`,
          description
        ]
      });
    }
  }
})(HoverService || (HoverService = {}));

// src/language/compilation-cache.ts
var CompilationCache = class {
  cache = /* @__PURE__ */ new Map();
  get(document) {
    const key = document.uri.toString();
    const hit = this.cache.get(key);
    if (hit && hit.version === document.version) {
      return hit.compilation;
    }
    const compilation = new Compilation(document.getText());
    this.cache.set(key, { version: document.version, compilation });
    return compilation;
  }
  delete(uri) {
    this.cache.delete(uri.toString());
  }
  clear() {
    this.cache.clear();
  }
};

// src/language/providers.ts
init_polyfills();
var vscode3 = __toESM(require("vscode"));

// src/language/completion-span.ts
init_polyfills();
var completionSeparatorPattern = /[\s()\[\],.:+\-*/=<>"']/u;
function isCompletionWordChar(char) {
  return char.length > 0 && !completionSeparatorPattern.test(char);
}
function getCompletionSpan(lineText, character) {
  const safeCharacter = Math.max(0, Math.min(character, lineText.length));
  let start = safeCharacter;
  while (start > 0 && isCompletionWordChar(lineText[start - 1])) {
    start -= 1;
  }
  let end = safeCharacter;
  while (end < lineText.length && isCompletionWordChar(lineText[end])) {
    end += 1;
  }
  return { start, end };
}

// src/language/contextual-completions.ts
init_polyfills();
function startsWithIgnoreCase(value, prefix) {
  return value.toLowerCase().startsWith(prefix.toLowerCase());
}
function stripComment(line) {
  let inString = false;
  for (let index = 0; index < line.length; index += 1) {
    const current = line[index];
    if (current === '"') {
      inString = !inString;
      continue;
    }
    if (current === "'" && !inString) {
      return line.slice(0, index);
    }
  }
  return line;
}
function detectOpenBlocks(sourceBeforeCursor) {
  const stack = [];
  for (const rawLine of sourceBeforeCursor.split(/\r?\n/u)) {
    const line = stripComment(rawLine).trim();
    if (!line) {
      continue;
    }
    if (/^endif\b/i.test(line)) {
      popLatest(stack, "if");
      continue;
    }
    if (/^endfor\b/i.test(line)) {
      popLatest(stack, "for");
      continue;
    }
    if (/^endwhile\b/i.test(line)) {
      popLatest(stack, "while");
      continue;
    }
    if (/^endsub\b/i.test(line)) {
      popLatest(stack, "sub");
      continue;
    }
    if (/^if\b.*\bthen\b/i.test(line) && !/^elseif\b/i.test(line)) {
      stack.push("if");
      continue;
    }
    if (/^for\b.*\bto\b/i.test(line)) {
      stack.push("for");
      continue;
    }
    if (/^while\b/i.test(line)) {
      stack.push("while");
      continue;
    }
    if (/^sub\b\s+[^\s(]+/i.test(line)) {
      stack.push("sub");
    }
  }
  return stack;
}
function popLatest(stack, kind) {
  for (let index = stack.length - 1; index >= 0; index -= 1) {
    if (stack[index] === kind) {
      stack.splice(index, 1);
      return;
    }
  }
}
function snippet(title, insertText, priority, preselect = false) {
  return {
    item: {
      kind: CompletionService.ResultKind.Snippet,
      title,
      description: title,
      insertText
    },
    priority,
    preselect
  };
}
function getContextualCompletions(sourceBeforeCursor, prefix) {
  const results = [];
  const activeBlock = detectOpenBlocks(sourceBeforeCursor).at(-1);
  switch (activeBlock) {
    case "if":
      results.push(snippet("EndIf", "EndIf", 0, true));
      results.push(snippet("ElseIf", "ElseIf ${1:condition} Then", 1));
      results.push(snippet("Else", "Else", 2));
      break;
    case "for":
      results.push(snippet("EndFor", "EndFor", 0, true));
      break;
    case "while":
      results.push(snippet("EndWhile", "EndWhile", 0, true));
      break;
    case "sub":
      results.push(snippet("EndSub", "EndSub", 0, true));
      break;
    default:
      break;
  }
  const filtered = results.filter((entry) => startsWithIgnoreCase(entry.item.title, prefix));
  const unique = /* @__PURE__ */ new Map();
  for (const entry of filtered.sort((left, right) => left.priority - right.priority || left.item.title.localeCompare(right.item.title))) {
    const key = entry.item.title.toLowerCase();
    if (!unique.has(key)) {
      unique.set(key, entry);
    }
  }
  return [...unique.values()];
}

// src/util/positions.ts
init_polyfills();
var vscode2 = __toESM(require("vscode"));
function toCompilerPosition(position) {
  return new CompilerPosition(position.line, position.character);
}
function toVsCodeRange(range) {
  return new vscode2.Range(
    range.start.line,
    range.start.column,
    range.end.line,
    range.end.column
  );
}

// src/language/providers.ts
var semanticTokenTypes = [
  "keyword",
  "comment",
  "string",
  "number",
  "class",
  "function",
  "variable"
];
var legend = new vscode3.SemanticTokensLegend([...semanticTokenTypes]);
var keywordKinds = /* @__PURE__ */ new Set([
  1 /* IfKeyword */,
  2 /* ThenKeyword */,
  3 /* ElseKeyword */,
  4 /* ElseIfKeyword */,
  5 /* EndIfKeyword */,
  6 /* ForKeyword */,
  7 /* ToKeyword */,
  8 /* StepKeyword */,
  9 /* EndForKeyword */,
  10 /* GoToKeyword */,
  11 /* WhileKeyword */,
  12 /* EndWhileKeyword */,
  13 /* SubKeyword */,
  14 /* EndSubKeyword */,
  33 /* And */,
  32 /* Or */
]);
function isSmallBasicDocument(document) {
  return document.languageId === "smallbasic";
}
var completionTriggerCharacters = [
  ".",
  ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(97 + index)),
  ...Array.from({ length: 26 }, (_, index) => String.fromCharCode(65 + index)),
  "_"
];
function mapCompletionKind(kind) {
  switch (kind) {
    case CompletionService.ResultKind.Class:
      return vscode3.CompletionItemKind.Class;
    case CompletionService.ResultKind.Method:
      return vscode3.CompletionItemKind.Method;
    case CompletionService.ResultKind.Snippet:
      return vscode3.CompletionItemKind.Snippet;
    case CompletionService.ResultKind.Event:
      return vscode3.CompletionItemKind.Event;
    default:
      return vscode3.CompletionItemKind.Property;
  }
}
var lazyEmptyCompilation;
function emptyCompilation() {
  if (!lazyEmptyCompilation) {
    lazyEmptyCompilation = new Compilation("");
  }
  return lazyEmptyCompilation;
}
function baselineCompletions() {
  return CompletionService.provideCompletion(emptyCompilation(), new CompilerPosition(0, 0));
}
function registerLanguageFeatures(context, cache, diagnostics) {
  context.subscriptions.push(
    vscode3.languages.registerCompletionItemProvider(
      { language: "smallbasic" },
      {
        provideCompletionItems(document, position) {
          const compilation = cache.get(document);
          const lineText = document.lineAt(position.line).text;
          const span = getCompletionSpan(lineText, position.character);
          const prefix = lineText.slice(span.start, position.character);
          const results = CompletionService.provideCompletion(compilation, toCompilerPosition(position));
          const sourceBeforeCursor = document.getText(new vscode3.Range(new vscode3.Position(0, 0), position));
          const isMemberAccess = span.start > 0 && lineText[span.start - 1] === ".";
          const contextual = isMemberAccess ? [] : getContextualCompletions(sourceBeforeCursor, prefix);
          const baseline = results.length === 0 && prefix.length === 0 ? baselineCompletions().map((item) => ({ item, priority: 20 })) : [];
          const combined = dedupeCompletions([...contextual, ...results.map((item) => ({ item, priority: 10 })), ...baseline]);
          const replacing = new vscode3.Range(position.line, span.start, position.line, span.end);
          const inserting = new vscode3.Range(new vscode3.Position(position.line, span.start), position);
          return new vscode3.CompletionList(
            combined.map(({ item, priority, preselect }) => {
              const kind = mapCompletionKind(item.kind);
              const completion = new vscode3.CompletionItem(item.title, kind);
              completion.detail = item.description;
              completion.filterText = item.title;
              completion.range = { inserting, replacing };
              completion.sortText = `${priority.toString().padStart(2, "0")}_${item.title}`;
              completion.preselect = !!preselect;
              if (item.insertText !== void 0) {
                completion.insertText = new vscode3.SnippetString(item.insertText);
              } else {
                completion.insertText = item.title;
              }
              return completion;
            }),
            false
          );
        }
      },
      ...completionTriggerCharacters
    ),
    vscode3.languages.registerHoverProvider({ language: "smallbasic" }, {
      provideHover(document, position) {
        const compilation = cache.get(document);
        const hover = HoverService.provideHover(compilation, toCompilerPosition(position));
        if (!hover) {
          return void 0;
        }
        return new vscode3.Hover(
          hover.text.map((line) => new vscode3.MarkdownString(line)),
          toVsCodeRange(hover.range)
        );
      }
    }),
    vscode3.languages.registerDocumentSemanticTokensProvider(
      { language: "smallbasic" },
      {
        provideDocumentSemanticTokens(document) {
          const compilation = cache.get(document);
          const builder = new vscode3.SemanticTokensBuilder(legend);
          for (const token of compilation.tokens) {
            const tokenType = mapTokenType(compilation, token.kind, token.text);
            if (tokenType === void 0) {
              continue;
            }
            builder.push(
              token.range.start.line,
              token.range.start.column,
              Math.max(1, token.text.length),
              tokenType,
              0
            );
          }
          return builder.build();
        }
      },
      legend
    )
  );
  context.subscriptions.push(diagnostics);
}
function publishDiagnostics(document, cache, diagnostics) {
  if (!isSmallBasicDocument(document)) {
    return;
  }
  const compilation = cache.get(document);
  diagnostics.set(
    document.uri,
    compilation.diagnostics.map((diagnostic) => toVsCodeDiagnostic(diagnostic))
  );
}
function toVsCodeDiagnostic(diagnostic) {
  return new vscode3.Diagnostic(
    toVsCodeRange(diagnostic.range),
    diagnostic.toString(),
    vscode3.DiagnosticSeverity.Error
  );
}
function mapTokenType(compilation, kind, text) {
  if (keywordKinds.has(kind)) {
    return semanticTokenTypes.indexOf("keyword");
  }
  switch (kind) {
    case 37 /* Comment */:
      return semanticTokenTypes.indexOf("comment");
    case 36 /* StringLiteral */:
      return semanticTokenTypes.indexOf("string");
    case 35 /* NumberLiteral */:
      return semanticTokenTypes.indexOf("number");
    case 34 /* Identifier */:
      if (CompilerUtils.lookupIgnoreCase(RuntimeLibraries.Metadata, text) !== void 0) {
        return semanticTokenTypes.indexOf("class");
      }
      if (CompilerUtils.lookupIgnoreCase(compilation.boundSubModules, text) !== void 0) {
        return semanticTokenTypes.indexOf("function");
      }
      return semanticTokenTypes.indexOf("variable");
    default:
      return void 0;
  }
}
function dedupeCompletions(items) {
  const seen = /* @__PURE__ */ new Set();
  const deduped = [];
  for (const item of items) {
    const key = item.item.title.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    deduped.push(item);
  }
  return deduped;
}

// src/run/terminal-session.ts
init_polyfills();
var vscode4 = __toESM(require("vscode"));
var ansiForeground = {
  [0 /* Black */]: 30,
  [1 /* DarkBlue */]: 34,
  [2 /* DarkGreen */]: 32,
  [3 /* DarkCyan */]: 36,
  [4 /* DarkRed */]: 31,
  [5 /* DarkMagenta */]: 35,
  [6 /* DarkYellow */]: 33,
  [7 /* Gray */]: 37,
  [8 /* DarkGray */]: 90,
  [9 /* Blue */]: 94,
  [10 /* Green */]: 92,
  [11 /* Cyan */]: 96,
  [12 /* Red */]: 91,
  [13 /* Magenta */]: 95,
  [14 /* Yellow */]: 93,
  [15 /* White */]: 97
};
var ansiBackground = {
  [0 /* Black */]: 40,
  [1 /* DarkBlue */]: 44,
  [2 /* DarkGreen */]: 42,
  [3 /* DarkCyan */]: 46,
  [4 /* DarkRed */]: 41,
  [5 /* DarkMagenta */]: 45,
  [6 /* DarkYellow */]: 43,
  [7 /* Gray */]: 47,
  [8 /* DarkGray */]: 100,
  [9 /* Blue */]: 104,
  [10 /* Green */]: 102,
  [11 /* Cyan */]: 106,
  [12 /* Red */]: 101,
  [13 /* Magenta */]: 105,
  [14 /* Yellow */]: 103,
  [15 /* White */]: 107
};
var SmallBasicTerminalSession = class {
  writeEmitter = new vscode4.EventEmitter();
  closeEmitter = new vscode4.EventEmitter();
  inputBuffer = [];
  lineBuffer = [];
  engine;
  scheduled = false;
  disposed = false;
  pendingInputKind;
  waitingForExitConfirmation = false;
  exitCode = 0;
  foreground = 15 /* White */;
  background = 0 /* Black */;
  onDidWrite = this.writeEmitter.event;
  onDidClose = this.closeEmitter.event;
  run(compilation) {
    this.engine = new ExecutionEngine4(compilation);
    this.engine.libraries.TextWindow.plugin = this;
    this.schedule(0);
  }
  open() {
    this.writeEmitter.fire("\x1B[2J\x1B[3J\x1B[;H");
  }
  close() {
    this.disposed = true;
    if (this.engine && this.engine.state !== 3 /* Terminated */) {
      this.engine.terminate();
    }
  }
  handleInput(data) {
    if (this.disposed) {
      return;
    }
    if (this.waitingForExitConfirmation) {
      if (data === "\r") {
        this.closeEmitter.fire(this.exitCode);
      }
      return;
    }
    switch (data) {
      case "\r": {
        const line = this.lineBuffer.join("");
        this.lineBuffer.length = 0;
        this.writeEmitter.fire("\r\n");
        if (this.pendingInputKind === 1 /* Number */) {
          const parsed = Number(line);
          this.inputBuffer.push(new NumberValue(Number.isFinite(parsed) ? parsed : 0));
        } else {
          this.inputBuffer.push(new StringValue(line));
        }
        this.pendingInputKind = void 0;
        this.schedule(0);
        return;
      }
      case "\x7F": {
        if (this.lineBuffer.length > 0) {
          this.lineBuffer.pop();
          this.writeEmitter.fire("\b \b");
        }
        return;
      }
      default:
        this.lineBuffer.push(data);
        this.writeEmitter.fire(data);
    }
  }
  inputIsNeeded(kind) {
    this.pendingInputKind = kind;
  }
  checkInputBuffer() {
    return this.inputBuffer.shift();
  }
  writeText(value, appendNewLine) {
    this.writeEmitter.fire(this.colorize(value + (appendNewLine ? "\r\n" : "")));
  }
  getForegroundColor() {
    return this.foreground;
  }
  setForegroundColor(color) {
    this.foreground = color;
  }
  getBackgroundColor() {
    return this.background;
  }
  setBackgroundColor(color) {
    this.background = color;
  }
  schedule(delayMs) {
    if (this.scheduled || this.disposed) {
      return;
    }
    this.scheduled = true;
    setTimeout(() => {
      this.scheduled = false;
      this.tick();
    }, delayMs);
  }
  tick() {
    if (this.disposed || !this.engine) {
      return;
    }
    this.engine.execute(0 /* RunToEnd */);
    switch (this.engine.state) {
      case 0 /* Running */:
        this.schedule(0);
        break;
      case 2 /* BlockedOnInput */:
        this.schedule(this.pendingInputKind === void 0 ? 10 : 50);
        break;
      case 3 /* Terminated */:
        if (this.engine.exception) {
          this.writeEmitter.fire(this.colorize(`\r
[Runtime Error] ${this.engine.exception.toString()}\r
`));
        }
        this.pauseBeforeClose(0);
        break;
      case 1 /* Paused */:
        this.schedule(10);
        break;
      default:
        this.pauseBeforeClose(1);
        break;
    }
  }
  colorize(text) {
    return `\x1B[${ansiForeground[this.foreground]};${ansiBackground[this.background]}m${text}\x1B[0m`;
  }
  pauseBeforeClose(exitCode) {
    this.waitingForExitConfirmation = true;
    this.exitCode = exitCode;
    this.writeEmitter.fire(this.colorize("\r\n[Program finished] \u6309 Enter \u5173\u95ED\u7EC8\u7AEF...\r\n"));
  }
};

// src/common/activation.ts
function activateCommon(context, platform) {
  const cache = new CompilationCache();
  const diagnostics = vscode5.languages.createDiagnosticCollection("smallbasic");
  const debounceMs = () => vscode5.workspace.getConfiguration("smallbasic").get("diagnostics.debounceMs", 150);
  const pending = /* @__PURE__ */ new Map();
  const scheduleDiagnostics = (document) => {
    if (!isSmallBasicDocument(document)) {
      return;
    }
    const key = document.uri.toString();
    const existing = pending.get(key);
    if (existing) {
      clearTimeout(existing);
    }
    pending.set(key, setTimeout(() => {
      pending.delete(key);
      publishDiagnostics(document, cache, diagnostics);
    }, debounceMs()));
  };
  registerLanguageFeatures(context, cache, diagnostics);
  registerSmallBasicInlineValues(context);
  context.subscriptions.push(
    vscode5.debug.registerDebugAdapterDescriptorFactory("smallbasic", platform.debugAdapterFactory),
    vscode5.debug.registerDebugConfigurationProvider(
      "smallbasic",
      platform.debugConfigurationProvider,
      vscode5.DebugConfigurationProviderTriggerKind.Initial
    )
  );
  for (const document of vscode5.workspace.textDocuments) {
    scheduleDiagnostics(document);
  }
  const subscriptions = [
    vscode5.workspace.onDidOpenTextDocument(scheduleDiagnostics),
    vscode5.workspace.onDidChangeTextDocument((event) => {
      cache.delete(event.document.uri);
      scheduleDiagnostics(event.document);
      if (shouldTriggerSuggest(event)) {
        setTimeout(() => {
          void vscode5.commands.executeCommand("editor.action.triggerSuggest");
        }, 0);
      }
    }),
    vscode5.workspace.onDidCloseTextDocument((document) => {
      const key = document.uri.toString();
      const existing = pending.get(key);
      if (existing) {
        clearTimeout(existing);
        pending.delete(key);
      }
      cache.delete(document.uri);
      diagnostics.delete(document.uri);
    }),
    vscode5.commands.registerCommand("smallbasic.newFile", async (resource) => {
      await createNewFile(resource);
    }),
    vscode5.commands.registerCommand("smallbasic.run", async () => {
      await runActiveDocument(cache, diagnostics);
    })
  ];
  if (platform.runCSharp) {
    subscriptions.push(vscode5.commands.registerCommand("smallbasic.runCSharp", platform.runCSharp));
  }
  context.subscriptions.push(...subscriptions);
}
async function createNewFile(resource) {
  const folder = await resolveTargetFolder(resource);
  if (!folder) {
    const document2 = await vscode5.workspace.openTextDocument({
      language: "smallbasic",
      content: `' My first SmallBasic program
TextWindow.WriteLine("Hello World")
`
    });
    await vscode5.window.showTextDocument(document2, { preview: false });
    return;
  }
  const file = await nextAvailableFile(folder);
  await vscode5.workspace.fs.writeFile(
    file,
    new TextEncoder().encode(`' My first SmallBasic program
TextWindow.WriteLine("Hello World")
`)
  );
  const document = await vscode5.workspace.openTextDocument(file);
  await vscode5.window.showTextDocument(document, { preview: false });
}
async function resolveTargetFolder(resource) {
  if (resource) {
    try {
      const stat = await vscode5.workspace.fs.stat(resource);
      return stat.type === vscode5.FileType.Directory ? resource : vscode5.Uri.joinPath(resource, "..");
    } catch {
      return vscode5.Uri.joinPath(resource, "..");
    }
  }
  return vscode5.workspace.workspaceFolders?.[0]?.uri;
}
async function nextAvailableFile(folder) {
  for (let index = 1; index < 1e3; index += 1) {
    const candidate = vscode5.Uri.joinPath(folder, `Untitled-${index}.sb`);
    try {
      await vscode5.workspace.fs.stat(candidate);
    } catch {
      return candidate;
    }
  }
  return vscode5.Uri.joinPath(folder, `Untitled-${Date.now()}.sb`);
}
async function runActiveDocument(cache, diagnostics) {
  const editor = vscode5.window.activeTextEditor;
  if (!editor || !isSmallBasicDocument(editor.document)) {
    void vscode5.window.showWarningMessage("\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A SmallBasic (.sb) \u6587\u4EF6\u3002");
    return;
  }
  if (!editor.document.isUntitled) {
    const saved = await editor.document.save();
    if (!saved) {
      void vscode5.window.showWarningMessage("\u8FD0\u884C\u524D\u9700\u8981\u5148\u4FDD\u5B58\u5F53\u524D\u6587\u4EF6\u3002");
      return;
    }
  }
  publishDiagnostics(editor.document, cache, diagnostics);
  const compilation = cache.get(editor.document);
  if (!compilation.isReadyToRun) {
    void vscode5.window.showErrorMessage("\u5F53\u524D\u7A0B\u5E8F\u5B58\u5728\u7F16\u8BD1\u9519\u8BEF\uFF0C\u8BF7\u5148\u4FEE\u590D\u540E\u518D\u8FD0\u884C\u3002");
    return;
  }
  if (compilation.kind.drawsShapes()) {
    void vscode5.window.showErrorMessage("\u5F53\u524D JS \u540E\u7AEF\u5C1A\u4E0D\u652F\u6301 GraphicsWindow/Shapes/Turtle/Controls \u56FE\u5F62\u5BBF\u4E3B\u3002Windows \u684C\u9762\u7248\u8BF7\u4F7F\u7528 \u201CSmallBasic: Run with C# Backend\u201D\u3002");
    return;
  }
  const session = new SmallBasicTerminalSession();
  const terminal = vscode5.window.createTerminal({
    name: `SmallBasic: ${documentName(editor.document)}`,
    pty: session
  });
  terminal.show(true);
  session.run(compilation);
}
function documentName(document) {
  const segments = document.uri.path.split("/");
  return segments[segments.length - 1] || "program.sb";
}
function shouldTriggerSuggest(event) {
  if (!isSmallBasicDocument(event.document)) {
    return false;
  }
  const editor = vscode5.window.activeTextEditor;
  if (!editor || editor.document.uri.toString() !== event.document.uri.toString()) {
    return false;
  }
  if (event.contentChanges.length !== 1) {
    return false;
  }
  const [change] = event.contentChanges;
  if (change.rangeLength !== 0 || change.text.length === 0) {
    return false;
  }
  return /^\.?$|^[\r\n]+$|^[\p{L}\p{N}_]$/u.test(change.text);
}

// src/web/debug-factory.ts
init_polyfills();
var vscode6 = __toESM(require("vscode"));

// src/debug/session.ts
init_polyfills();
var import_debugadapter = __toESM(require_main());
var THREAD_ID = 1;
var DebugTextWindow = class {
  constructor(session) {
    this.session = session;
  }
  session;
  inputBuffer = [];
  foreground = 15 /* White */;
  background = 0 /* Black */;
  requestedInputKind;
  inputIsNeeded(kind) {
    this.requestedInputKind = kind;
    this.session.onInputRequested(kind);
  }
  checkInputBuffer() {
    return this.inputBuffer.shift();
  }
  writeText(value, appendNewLine) {
    this.session.emitOutput(value + (appendNewLine ? "\n" : ""));
  }
  getForegroundColor() {
    return this.foreground;
  }
  setForegroundColor(color) {
    this.foreground = color;
  }
  getBackgroundColor() {
    return this.background;
  }
  setBackgroundColor(color) {
    this.background = color;
  }
  pushInput(raw) {
    if (this.requestedInputKind === 1 /* Number */) {
      const parsed = Number(raw);
      this.inputBuffer.push(new NumberValue(Number.isFinite(parsed) ? parsed : 0));
    } else {
      this.inputBuffer.push(new StringValue(raw));
    }
    this.requestedInputKind = void 0;
  }
  isWaitingForInput() {
    return this.requestedInputKind !== void 0;
  }
};
var SmallBasicDebugSession = class extends import_debugadapter.LoggingDebugSession {
  constructor(sources) {
    super("smallbasic-debug.log");
    this.sources = sources;
    this.setDebuggerLinesStartAt1(true);
    this.setDebuggerColumnsStartAt1(true);
  }
  sources;
  programPath = "";
  compilation;
  engine;
  breakpointMap = /* @__PURE__ */ new Map();
  variableHandles = new import_debugadapter.Handles();
  textWindow = new DebugTextWindow(this);
  configurationDone = false;
  executionStarted = false;
  stopOnEntry = false;
  running = false;
  pauseRequested = false;
  initialLocationChecked = false;
  terminated = false;
  activeControl = { kind: "continue" };
  initializeRequest(response, _args) {
    this.configurationDone = false;
    this.executionStarted = false;
    response.body = {
      supportsConfigurationDoneRequest: true,
      supportsEvaluateForHovers: false,
      supportsStepBack: false,
      supportsRestartRequest: false
    };
    this.sendResponse(response);
    this.sendEvent(new import_debugadapter.InitializedEvent());
  }
  async launchRequest(response, args) {
    this.programPath = this.sources.resolvePath(String(args.program));
    this.stopOnEntry = !!args.stopOnEntry;
    this.executionStarted = false;
    this.initialLocationChecked = false;
    this.terminated = false;
    try {
      this.compilation = this.loadCompilation(this.programPath);
      this.engine = new ExecutionEngine4(this.compilation);
      this.engine.libraries.TextWindow.plugin = this.textWindow;
      this.breakpointMap.set(this.normalizePath(this.programPath), this.verifyBreakpoints(this.programPath, this.breakpointMap.get(this.normalizePath(this.programPath)) ?? []));
      this.sendResponse(response);
      this.startExecutionAfterConfiguration();
    } catch (error) {
      this.sendErrorResponse(response, 2001, error instanceof Error ? error.message : String(error));
    }
  }
  configurationDoneRequest(response, _args) {
    this.configurationDone = true;
    this.sendResponse(response);
    this.startExecutionAfterConfiguration();
  }
  setBreakPointsRequest(response, args) {
    const sourcePath = args.source.path ? this.sources.resolvePath(args.source.path) : this.programPath;
    const requestedLines = args.breakpoints?.map((breakpoint) => breakpoint.line) ?? args.lines ?? [];
    const requested = requestedLines.map((line) => ({ requestedLine: line - 1, verified: false }));
    const verified = sourcePath ? this.verifyBreakpoints(sourcePath, requested) : requested;
    if (sourcePath) {
      this.breakpointMap.set(this.normalizePath(sourcePath), verified);
    }
    response.body = {
      breakpoints: verified.map(
        (breakpoint) => new import_debugadapter.Breakpoint(breakpoint.verified, (breakpoint.actualLine ?? breakpoint.requestedLine) + 1)
      )
    };
    this.sendResponse(response);
  }
  threadsRequest(response) {
    response.body = {
      threads: [new import_debugadapter.Thread(THREAD_ID, "Main")]
    };
    this.sendResponse(response);
  }
  stackTraceRequest(response, _args) {
    const stackFrames = this.getExecutionFrames().map((frame, index) => {
      const instruction = this.getInstructionForFrame(frame.moduleName, frame.instructionIndex);
      const source = new import_debugadapter.Source(this.sources.basename(this.programPath || "program.sb"), this.programPath);
      return new import_debugadapter.StackFrame(index + 1, frame.moduleName, source, (instruction?.sourceRange.start.line ?? 0) + 1, (instruction?.sourceRange.start.column ?? 0) + 1);
    });
    response.body = {
      stackFrames,
      totalFrames: stackFrames.length
    };
    this.sendResponse(response);
  }
  scopesRequest(response, _args) {
    response.body = {
      scopes: [new import_debugadapter.Scope("Globals", this.variableHandles.create({ kind: "globals" }), false)]
    };
    this.sendResponse(response);
  }
  variablesRequest(response, args) {
    const container = this.variableHandles.get(args.variablesReference);
    response.body = {
      variables: container ? this.expandVariables(container) : []
    };
    this.sendResponse(response);
  }
  continueRequest(response, _args) {
    this.activeControl = { kind: "continue" };
    this.pauseRequested = false;
    this.sendResponse(response);
    this.resumeExecution();
  }
  nextRequest(response, _args) {
    this.activeControl = { kind: "next", depth: this.getStackDepth() };
    this.pauseRequested = false;
    this.sendResponse(response);
    this.resumeExecution();
  }
  stepInRequest(response, _args) {
    this.activeControl = { kind: "stepIn", depth: this.getStackDepth() };
    this.pauseRequested = false;
    this.sendResponse(response);
    this.resumeExecution();
  }
  stepOutRequest(response, _args) {
    this.activeControl = { kind: "stepOut", depth: this.getStackDepth() };
    this.pauseRequested = false;
    this.sendResponse(response);
    this.resumeExecution();
  }
  pauseRequest(response, _args) {
    this.pauseRequested = true;
    this.sendResponse(response);
  }
  disconnectRequest(response, _args) {
    this.engine?.terminate();
    this.sendResponse(response);
    this.endSession(0);
  }
  evaluateRequest(response, args) {
    const expression = args.expression.trim();
    if (this.textWindow.isWaitingForInput()) {
      this.textWindow.pushInput(expression);
      response.body = {
        result: expression,
        variablesReference: 0
      };
      this.sendResponse(response);
      this.activeControl = { kind: "continue" };
      this.pauseRequested = false;
      this.resumeExecution();
      return;
    }
    const memory = this.engine?.memory.values;
    const value = memory ? memory[expression] ?? memory[Object.keys(memory).find((name) => name.toLowerCase() === expression.toLowerCase()) ?? ""] : void 0;
    if (value) {
      response.body = {
        result: value.toDebuggerString(),
        variablesReference: value.kind === 2 /* Array */ ? this.variableHandles.create({ kind: "array", value }) : 0
      };
      this.sendResponse(response);
      return;
    }
    this.sendErrorResponse(response, 2002, `\u65E0\u6CD5\u8BA1\u7B97\u8868\u8FBE\u5F0F: ${expression}`);
  }
  emitOutput(text) {
    this.sendEvent(new import_debugadapter.OutputEvent(text));
  }
  onInputRequested(kind) {
    this.emitOutput(kind === 1 /* Number */ ? "\n[Input] \u8BF7\u8F93\u5165\u6570\u5B57\u540E\u5728 Debug Console \u4E2D\u6309\u56DE\u8F66\u3002\n" : "\n[Input] \u8BF7\u8F93\u5165\u6587\u672C\u540E\u5728 Debug Console \u4E2D\u6309\u56DE\u8F66\u3002\n");
    const stopped = {
      seq: 0,
      type: "event",
      event: "stopped",
      body: {
        reason: "pause",
        description: "Waiting for input",
        threadId: THREAD_ID,
        allThreadsStopped: true
      }
    };
    this.sendEvent(stopped);
  }
  loadCompilation(programPath) {
    let text;
    try {
      text = this.sources.readFile(programPath);
    } catch {
      throw new Error(`\u627E\u4E0D\u5230\u7A0B\u5E8F\u6587\u4EF6: ${programPath}`);
    }
    const compilation = new Compilation(text);
    if (!compilation.isReadyToRun) {
      const message = compilation.diagnostics.map((item) => item.toString()).join("\n");
      throw new Error(message || "Program contains compilation errors.");
    }
    if (compilation.kind.drawsShapes()) {
      throw new Error("\u5F53\u524D\u5185\u7F6E SmallBasic \u8C03\u8BD5\u5668\u6682\u4E0D\u652F\u6301 GraphicsWindow/Shapes/Turtle/Controls \u56FE\u5F62\u5BBF\u4E3B\u3002\u8BF7\u5148\u8C03\u8BD5\u6587\u672C\u6A21\u5F0F\u7A0B\u5E8F\uFF0C\u6216\u6539\u7528\u540E\u7EED\u56FE\u5F62\u540E\u7AEF\u3002");
    }
    return compilation;
  }
  verifyBreakpoints(sourcePath, breakpoints) {
    let compilation;
    try {
      compilation = this.loadCompilation(sourcePath);
    } catch {
      return breakpoints.map((breakpoint) => ({ ...breakpoint, verified: false }));
    }
    const lines = this.getExecutableLines(compilation);
    return breakpoints.map((breakpoint) => {
      const actualLine = lines.find((line) => line >= breakpoint.requestedLine);
      return {
        requestedLine: breakpoint.requestedLine,
        actualLine,
        verified: actualLine !== void 0
      };
    });
  }
  getExecutableLines(compilation) {
    const executableLines = /* @__PURE__ */ new Set();
    const modules = compilation.emit();
    for (const instructions of Object.values(modules)) {
      for (const instruction of instructions) {
        executableLines.add(instruction.sourceRange.start.line);
      }
    }
    return [...executableLines].sort((left, right) => left - right);
  }
  startExecutionAfterConfiguration() {
    if (!this.configurationDone || !this.engine || this.executionStarted) {
      return;
    }
    this.executionStarted = true;
    this.activeControl = { kind: "continue" };
    if (this.stopOnEntry) {
      this.initialLocationChecked = true;
      this.sendEvent(new import_debugadapter.StoppedEvent("entry", THREAD_ID));
      return;
    }
    this.resumeExecution();
  }
  resumeExecution() {
    if (!this.engine || this.running) {
      return;
    }
    if (!this.initialLocationChecked) {
      this.initialLocationChecked = true;
      if (this.activeControl.kind === "continue" && this.isBreakpointAtCurrentLine()) {
        this.sendEvent(new import_debugadapter.StoppedEvent("breakpoint", THREAD_ID));
        return;
      }
    }
    this.running = true;
    setTimeout(() => this.executionLoop(), 0);
  }
  executionLoop() {
    if (!this.engine) {
      this.running = false;
      return;
    }
    const startedAt = Date.now();
    let steps = 0;
    while (this.engine && Date.now() - startedAt < 5 && steps < 128) {
      this.engine.execute(2 /* NextStatement */);
      steps += 1;
      if (this.engine.state === 3 /* Terminated */) {
        this.running = false;
        if (this.engine.exception) {
          this.emitOutput(`
[Runtime Error] ${this.engine.exception.toString()}
`);
        }
        this.endSession(this.engine.exception ? 1 : 0);
        return;
      }
      if (this.engine.state === 2 /* BlockedOnInput */) {
        this.running = false;
        return;
      }
      if (this.engine.state === 1 /* Paused */) {
        const stopReason = this.getStopReason();
        if (stopReason) {
          this.running = false;
          this.sendEvent(new import_debugadapter.StoppedEvent(stopReason, THREAD_ID));
          return;
        }
      }
    }
    this.running = false;
    if (this.engine && this.engine.state !== 3 /* Terminated */) {
      this.resumeExecution();
    }
  }
  getStopReason() {
    if (!this.engine) {
      return void 0;
    }
    if (this.pauseRequested) {
      this.pauseRequested = false;
      return "pause";
    }
    const currentLine = this.getCurrentLine();
    const currentDepth = this.getStackDepth();
    switch (this.activeControl.kind) {
      case "stepIn":
        return "step";
      case "next":
        return currentDepth <= this.activeControl.depth ? "step" : void 0;
      case "stepOut":
        return currentDepth < this.activeControl.depth ? "step" : void 0;
      case "continue": {
        if (currentLine === void 0) {
          return void 0;
        }
        return this.isBreakpointAtLine(currentLine) ? "breakpoint" : void 0;
      }
      default:
        return void 0;
    }
  }
  isBreakpointAtCurrentLine() {
    const currentLine = this.getCurrentLine();
    return currentLine !== void 0 && this.isBreakpointAtLine(currentLine);
  }
  isBreakpointAtLine(line) {
    const fileBreakpoints = this.breakpointMap.get(this.normalizePath(this.programPath)) ?? [];
    return fileBreakpoints.some((breakpoint) => breakpoint.verified && breakpoint.actualLine === line);
  }
  endSession(exitCode) {
    if (this.terminated) {
      return;
    }
    this.terminated = true;
    this.sendEvent(new import_debugadapter.ExitedEvent(exitCode));
    this.sendEvent(new import_debugadapter.TerminatedEvent());
  }
  expandVariables(container) {
    if (!this.engine) {
      return [];
    }
    if (container.kind === "globals") {
      return Object.entries(this.engine.memory.values).sort(([left], [right]) => left.localeCompare(right)).map(([name, value]) => this.createVariable(name, value));
    }
    return Object.entries(container.value.values).sort(([left], [right]) => left.localeCompare(right)).map(([name, value]) => this.createVariable(name, value));
  }
  createVariable(name, value) {
    return {
      name,
      value: value.toDebuggerString(),
      variablesReference: value.kind === 2 /* Array */ ? this.variableHandles.create({ kind: "array", value }) : 0
    };
  }
  getExecutionFrames() {
    return this.engine ? [...this.engine.executionStack].reverse() : [];
  }
  getStackDepth() {
    return this.engine?.executionStack.length ?? 0;
  }
  getCurrentLine() {
    if (!this.engine || this.engine.executionStack.length === 0) {
      return void 0;
    }
    const topFrame = this.engine.executionStack[this.engine.executionStack.length - 1];
    const instruction = this.getInstructionForFrame(topFrame.moduleName, topFrame.instructionIndex);
    return instruction?.sourceRange.start.line;
  }
  getInstructionForFrame(moduleName, instructionIndex) {
    const instructions = this.engine?.modules[moduleName];
    if (!instructions || instructionIndex < 0 || instructionIndex >= instructions.length) {
      return void 0;
    }
    return instructions[instructionIndex];
  }
  normalizePath(filePath) {
    return filePath.replace(/\\/g, "/").replace(/\/+$/g, "").toLowerCase();
  }
};

// src/web/source-accessor.ts
init_polyfills();
var WebDebugSourceAccessor = class {
  aliases = /* @__PURE__ */ new Map();
  source;
  canonicalPath;
  constructor(document, configuredProgram) {
    this.source = document.getText();
    this.canonicalPath = document.fileName || document.uri.path || document.uri.toString();
    for (const alias of [
      configuredProgram,
      this.canonicalPath,
      document.uri.fsPath,
      document.uri.path,
      document.uri.toString()
    ]) {
      if (alias) {
        this.aliases.set(this.normalize(alias), this.canonicalPath);
      }
    }
  }
  resolvePath(filePath) {
    return this.aliases.get(this.normalize(filePath)) ?? filePath;
  }
  basename(filePath) {
    const normalized = filePath.replace(/\\/g, "/");
    return normalized.slice(normalized.lastIndexOf("/") + 1) || "program.sb";
  }
  readFile(filePath) {
    if (this.resolvePath(filePath) !== this.canonicalPath) {
      throw new Error(`Source is not open in VS Code for the Web: ${filePath}`);
    }
    return this.source;
  }
  normalize(value) {
    return value.replace(/\\/g, "/").replace(/\/+$/g, "").toLowerCase();
  }
};

// src/web/debug-factory.ts
var SmallBasicWebDebugAdapterFactory = class {
  async createDebugAdapterDescriptor(session) {
    if (session.configuration.backend === "csharp") {
      void vscode6.window.showErrorMessage("VS Code for the Web \u4E0D\u652F\u6301\u542F\u52A8\u672C\u673A C# \u8FDB\u7A0B\uFF0C\u8BF7\u4F7F\u7528 JavaScript \u540E\u7AEF\u3002");
      return void 0;
    }
    const configuredProgram = typeof session.configuration.program === "string" ? session.configuration.program : "";
    const document = await this.findDocument(configuredProgram);
    if (!document || !isSmallBasicDocument(document)) {
      void vscode6.window.showErrorMessage("\u65E0\u6CD5\u6253\u5F00\u8981\u8C03\u8BD5\u7684 SmallBasic \u6587\u4EF6\u3002\u8BF7\u5148\u5728\u7F16\u8F91\u5668\u4E2D\u6253\u5F00\u5E76\u4FDD\u5B58\u8BE5\u6587\u4EF6\u3002");
      return void 0;
    }
    const adapter = new SmallBasicDebugSession(new WebDebugSourceAccessor(document, configuredProgram));
    return new vscode6.DebugAdapterInlineImplementation(adapter);
  }
  async findDocument(configuredProgram) {
    const normalize = (value) => value.replace(/\\/g, "/").toLowerCase();
    const wanted = normalize(configuredProgram);
    const open = vscode6.workspace.textDocuments.find((document) => [
      document.fileName,
      document.uri.fsPath,
      document.uri.path,
      document.uri.toString()
    ].some((value) => normalize(value) === wanted));
    if (open) {
      return open;
    }
    const active = vscode6.window.activeTextEditor?.document;
    if (active && isSmallBasicDocument(active)) {
      return active;
    }
    if (configuredProgram.includes(":")) {
      try {
        return await vscode6.workspace.openTextDocument(vscode6.Uri.parse(configuredProgram));
      } catch {
        return void 0;
      }
    }
    return void 0;
  }
};

// src/web/extension.ts
function activate(context) {
  activateCommon(context, {
    debugAdapterFactory: new SmallBasicWebDebugAdapterFactory(),
    debugConfigurationProvider: createWebDebugConfigurationProvider()
  });
}
function deactivate() {
}
function createWebDebugConfigurationProvider() {
  const activeDocument = () => {
    const document = vscode7.window.activeTextEditor?.document;
    return document && isSmallBasicDocument(document) ? document : void 0;
  };
  const createConfig = (document) => ({
    type: "smallbasic",
    request: "launch",
    name: "SmallBasic: Launch current file (Web JS debugger)",
    program: document.fileName || document.uri.toString(),
    backend: "javascript",
    stopOnEntry: true
  });
  return {
    resolveDebugConfiguration(_folder, config) {
      if (config.backend === "csharp") {
        void vscode7.window.showErrorMessage("VS Code for the Web \u4EC5\u652F\u6301 JavaScript \u8FD0\u884C\u4E0E\u8C03\u8BD5\u540E\u7AEF\u3002");
        return void 0;
      }
      if (config.type === "smallbasic" && typeof config.program === "string") {
        config.backend = "javascript";
        return config;
      }
      const document = activeDocument();
      return document ? createConfig(document) : void 0;
    },
    resolveDebugConfigurationWithSubstitutedVariables(_folder, config) {
      if (config.backend === "csharp") {
        void vscode7.window.showErrorMessage("VS Code for the Web \u4EC5\u652F\u6301 JavaScript \u8FD0\u884C\u4E0E\u8C03\u8BD5\u540E\u7AEF\u3002");
        return void 0;
      }
      const document = activeDocument();
      if (!document) {
        void vscode7.window.showErrorMessage("\u8BF7\u5148\u6253\u5F00\u4E00\u4E2A SmallBasic (.sb) \u6587\u4EF6\u540E\u518D\u542F\u52A8\u8C03\u8BD5\u3002");
        return void 0;
      }
      config.type = "smallbasic";
      config.request = "launch";
      config.backend = "javascript";
      config.program = typeof config.program === "string" && config.program.trim() ? config.program : document.fileName || document.uri.toString();
      return config;
    }
  };
}
/*! Bundled license information:

ieee754/index.js:
  (*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> *)

buffer/index.js:
  (*!
   * The buffer module from node.js, for the browser.
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)

punycode/punycode.js:
  (*! https://mths.be/punycode v1.4.1 by @mathias *)
*/
