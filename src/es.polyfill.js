
// ==========================
// ES2015 (ES6)
// ==========================
// String
if (!String.prototype.includes) {
  String.prototype.includes = function(search, start) {
    return this.indexOf(search, start || 0) !== -1;
  };
}
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    return this.slice(pos || 0, (pos || 0) + search.length) === search;
  };
}
if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(search, endPos) {
    const str = this.toString();
    const len = search.length;
    const start = endPos === undefined || endPos > str.length ? str.length - len : endPos - len;
    return str.substring(start) === search;
  };
}
if (!String.prototype.repeat) {
  String.prototype.repeat = function(count) {
    if (count < 0) throw new RangeError('repeat count must be non-negative');
    let res = '';
    for (let i = 0; i < count; i++) res += this;
    return res;
  };
}
if (!String.raw) {
  String.raw = function(template) {
    const raw = template.raw;
    let res = '';
    for (let i = 0; i < raw.length; i++) {
      res += raw[i] + (arguments[i + 1] || '');
    }
    return res;
  };
}

// Array
if (!Array.from) {
  Array.from = function(arrayLike) {
    const arr = [];
    for (let i = 0; i < arrayLike.length; i++) arr.push(arrayLike[i]);
    return arr;
  };
}
if (!Array.of) {
  Array.of = function() {
    return Array.prototype.slice.call(arguments);
  };
}
if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) return this[i];
    }
    return undefined;
  };
}
if (!Array.prototype.findIndex) {
  Array.prototype.findIndex = function(predicate) {
    for (let i = 0; i < this.length; i++) {
      if (predicate(this[i], i, this)) return i;
    }
    return -1;
  };
}
if (!Array.prototype.fill) {
  Array.prototype.fill = function(value, start, end) {
    const len = this.length;
    start = start || 0;
    end = end || len;
    for (let i = start; i < end; i++) this[i] = value;
    return this;
  };
}
if (!Array.prototype.copyWithin) {
  Array.prototype.copyWithin = function(target, start, end) {
    const len = this.length;
    target |= 0; start |= 0; end = end === undefined ? len : end | 0;
    const count = Math.min(end - start, len - target);
    for (let i = 0; i < count; i++) this[target + i] = this[start + i];
    return this;
  };
}

// Object
if (!Object.assign) {
  Object.assign = function(target) {
    target = Object(target);
    for (let i = 1; i < arguments.length; i++) {
      const source = arguments[i];
      if (source) {
        for (const key in source) {
          if (source.hasOwnProperty(key)) target[key] = source[key];
        }
      }
    }
    return target;
  };
}
if (!Object.is) {
  Object.is = function(x, y) {
    if (x === y) return x !== 0 || 1 / x === 1 / y;
    return x !== x && y !== y;
  };
}
if (!Object.getOwnPropertySymbols) {
  Object.getOwnPropertySymbols = function() { return []; };
}
if (!Object.setPrototypeOf) {
  Object.setPrototypeOf = function(obj, proto) {
    obj.__proto__ = proto;
    return obj;
  };
}

// Number
if (!Number.isFinite) {
  Number.isFinite = function(v) {
    return typeof v === 'number' && isFinite(v);
  };
}
if (!Number.isNaN) {
  Number.isNaN = function(v) { return v !== v; };
}
if (!Number.isInteger) {
  Number.isInteger = function(v) {
    return typeof v === 'number' && isFinite(v) && Math.floor(v) === v;
  };
}
if (!Number.parseInt) Number.parseInt = parseInt;
if (!Number.parseFloat) Number.parseFloat = parseFloat;

// Math
if (!Math.trunc) Math.trunc = function(v) { return v < 0 ? Math.ceil(v) : Math.floor(v); };
if (!Math.sign) Math.sign = function(v) { return v === 0 ? v : v < 0 ? -1 : 1; };
if (!Math.cbrt) Math.cbrt = function(v) { return Math.pow(v, 1/3); };
if (!Math.hypot) Math.hypot = function(...args) { return Math.sqrt(args.reduce((s, n) => s + n * n, 0)); };
if (!Math.clz32) Math.clz32 = function(v) { return 32 - (v >>> 0).toString(2).length; };
if (!Math.fround) Math.fround = function(v) { return v; };
if (!Math.log2) Math.log2 = function(v) { return Math.log(v) / Math.log(2); };
if (!Math.log10) Math.log10 = function(v) { return Math.log(v) / Math.log(10); };
if (!Math.expm1) Math.expm1 = function(v) { return Math.exp(v) - 1; };
if (!Math.log1p) Math.log1p = function(v) { return Math.log(1 + v); };

// ==========================
// ES2016 (ES7)
// ==========================
// Array
if (!Array.prototype.includes) {
  Array.prototype.includes = function(searchEl, fromIdx) {
    return this.indexOf(searchEl, fromIdx || 0) !== -1;
  };
}

// ==========================
// ES2017 (ES8)
// ==========================
// String
if (!String.prototype.padStart) {
  String.prototype.padStart = function(targetLength, padString) {
    targetLength >>= 0;
    padString = String(padString || ' ');
    if (this.length >= targetLength) return String(this);
    targetLength -= this.length;
    if (targetLength > padString.length) padString += padString.repeat(targetLength / padString.length | 0);
    return padString.slice(0, targetLength) + String(this);
  };
}
if (!String.prototype.padEnd) {
  String.prototype.padEnd = function(targetLength, padString) {
    targetLength >>= 0;
    padString = String(padString || ' ');
    if (this.length >= targetLength) return String(this);
    targetLength -= this.length;
    if (targetLength > padString.length) padString += padString.repeat(targetLength / padString.length | 0);
    return String(this) + padString.slice(0, targetLength);
  };
}

// Object
if (!Object.values) {
  Object.values = function(obj) {
    const res = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) res.push(obj[key]);
    }
    return res;
  };
}
if (!Object.entries) {
  Object.entries = function(obj) {
    const res = [];
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) res.push([key, obj[key]]);
    }
    return res;
  };
}
if (!Object.getOwnPropertyDescriptors) {
  Object.getOwnPropertyDescriptors = function(obj) {
    const descs = {};
    Object.getOwnPropertyNames(obj).forEach(key => {
      descs[key] = Object.getOwnPropertyDescriptor(obj, key);
    });
    return descs;
  };
}

// ==========================
// ES2019 (ES10)
// ==========================
// String
if (!String.prototype.trimStart) {
  String.prototype.trimStart = function() { return this.replace(/^\s+/, ''); };
}
if (!String.prototype.trimEnd) {
  String.prototype.trimEnd = function() { return this.replace(/\s+$/, ''); };
}

// Array
if (!Array.prototype.flat) {
  Array.prototype.flat = function(depth) {
    depth = depth === undefined ? 1 : Number(depth);
    const flatten = (arr, d) => {
      let result = [];
      for (const val of arr) {
        if (Array.isArray(val) && d > 0) {
          result.push(...flatten(val, d - 1));
        } else {
          result.push(val);
        }
      }
      return result;
    };
    return flatten(this, depth);
  };
}
if (!Array.prototype.flatMap) {
  Array.prototype.flatMap = function(callback) {
    return this.map(callback).flat(1);
  };
}

// Object
if (!Object.fromEntries) {
  Object.fromEntries = function(entries) {
    const obj = {};
    for (const [key, val] of entries) obj[key] = val;
    return obj;
  };
}

// ==========================
// ES2020 (ES11)
// ==========================
// String
if (!String.prototype.matchAll) {
  String.prototype.matchAll = function(regexp) {
    const re = new RegExp(regexp, 'g' + (regexp.flags || ''));
    const matches = [];
    let match;
    while ((match = re.exec(this)) !== null) matches.push(match);
    return matches[Symbol.iterator]();
  };
}

// Promise
if (typeof Promise !== 'undefined' && !Promise.allSettled) {
  Promise.allSettled = function(promises) {
    return Promise.all(promises.map(p => p
      .then(value => ({ status: 'fulfilled', value }))
      .catch(reason => ({ status: 'rejected', reason }))
    ));
  };
}

// ==========================
// ES2021 (ES12)
// ==========================
// String
if (!String.prototype.replaceAll) {
  const escapeRegExp = str => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  String.prototype.replaceAll = function(search, replacement) {
    if (search instanceof RegExp) {
      const regex = search.global ? search : new RegExp(search.source, search.flags + 'g');
      return this.replace(regex, replacement);
    } else {
      return this.replace(new RegExp(escapeRegExp(String(search)), 'g'), replacement);
    }
  };
}

// Object
if (!Object.hasOwn) {
  Object.hasOwn = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
}

// Promise
if (typeof Promise !== 'undefined' && !Promise.any) {
  Promise.any = function(promises) {
    return new Promise((resolve, reject) => {
      let failedCount = 0;
      promises.forEach(p => p.then(resolve).catch(() => {
        if (++failedCount === promises.length) reject(new AggregateError('All promises were rejected'));
      }));
    });
  };
}
// ==========================
// ES2022 (ES13)
// ==========================
// Object
if (!Object.hasOwn) {
  Object.hasOwn = function(obj, key) {
    return Object.prototype.hasOwnProperty.call(obj, key);
  };
}

// Array
if (!Array.prototype.at) {
  Array.prototype.at = function(index) {
    index = Math.trunc(index) || 0;
    if (index < 0) index += this.length;
    if (index < 0 || index >= this.length) return undefined;
    return this[index];
  };
}

// String
if (!String.prototype.at) {
  String.prototype.at = function(index) {
    index = Math.trunc(index) || 0;
    if (index < 0) index += this.length;
    if (index < 0 || index >= this.length) return undefined;
    return this.charAt(index);
  };
}

// String
if (!String.prototype.matchAll) {
  String.prototype.matchAll = function(regexp) {
    const re = new RegExp(regexp, "g" + (regexp.flags || ""));
    const matches = [];
    let match;
    while ((match = re.exec(this))) matches.push(match);
    return matches[Symbol.iterator]();
  };
}

// ==========================
// ES2023 (ES14)
// ==========================
// Array 复制版不修改原数组
if (!Array.prototype.findLast) {
  Array.prototype.findLast = function(callback) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (callback(this[i], i, this)) return this[i];
    }
    return undefined;
  };
}
if (!Array.prototype.findLastIndex) {
  Array.prototype.findLastIndex = function(callback) {
    for (let i = this.length - 1; i >= 0; i--) {
      if (callback(this[i], i, this)) return i;
    }
    return -1;
  };
}
if (!Array.prototype.toReversed) {
  Array.prototype.toReversed = function() {
    return [...this].reverse();
  };
}
if (!Array.prototype.toSorted) {
  Array.prototype.toSorted = function(compare) {
    return [...this].sort(compare);
  };
}
if (!Array.prototype.toSpliced) {
  Array.prototype.toSpliced = function(start, count, ...items) {
    const copy = [...this];
    copy.splice(start, count, ...items);
    return copy;
  };
}
if (!Array.prototype.with) {
  Array.prototype.with = function(index, value) {
    const copy = [...this];
    copy[index] = value;
    return copy;
  };
}

// ==========================
// ES2024 (ES15)
// ==========================
// Object
if (!Object.groupBy) {
  Object.groupBy = function(items, callback) {
    const result = Object.create(null);
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = callback(item, i);
      if (!result[key]) result[key] = [];
      result[key].push(item);
    }
    return result;
  };
}

// Map
if (typeof Map !== "undefined" && !Map.groupBy) {
  Map.groupBy = function(items, callback) {
    const map = new Map();
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      const key = callback(item, i);
      let group = map.get(key);
      if (!group) {
        group = [];
        map.set(key, group);
      }
      group.push(item);
    }
    return map;
  };
}

// Promise
if (typeof Promise !== "undefined" && !Promise.withResolvers) {
  Promise.withResolvers = function() {
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return { promise, resolve, reject };
  };
}

// ==========================
// ES2025 (ES16)
// ==========================
// Array
if (!Array.prototype.uniqueBy) {
  Array.prototype.uniqueBy = function(keyFn) {
    const seen = new Set();
    return this.filter(item => {
      const key = keyFn(item);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  };
}

// String
if (!String.prototype.isWellFormed) {
  String.prototype.isWellFormed = function() {
    return !/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/.test(this);
  };
}
if (!String.prototype.toWellFormed) {
  String.prototype.toWellFormed = function() {
    return this.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "");
  };
}

// ==========================
// ES2026 (ES17) —— 最新定稿方法
// ==========================
// Array
if (!Array.prototype.equals) {
  Array.prototype.equals = function(other, compare) {
    if (!other || this.length !== other.length) return false;
    for (let i = 0; i < this.length; i++) {
      const a = this[i];
      const b = other[i];
      if (compare ? !compare(a, b) : a !== b) return false;
    }
    return true;
  };
}

// Number
if (!Number.range) {
  Number.range = function(start, end, step) {
    const result = [];
    step = step || 1;
    if (step > 0) for (let i = start; i < end; i += step) result.push(i);
    else for (let i = start; i > end; i += step) result.push(i);
    return result;
  };
}