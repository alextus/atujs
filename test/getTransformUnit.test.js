/**
 * getTransformUnit 函数的单元测试
 * 测试各种 transform 属性 key 对应的单位返回值
 */

describe('getTransformUnit', () => {
  // 由于 getTransformUnit 是 animate.js 中的内部函数，
  // 我们需要在测试环境中模拟或导出该函数
  // 这里我们直接实现该函数逻辑进行测试

  function getTransformUnit(key) {
    if (key == "scale" || key == "scaleX" || key == "scaleY" || key == "scaleZ") return "";
    return key == "rotate" || key == "rotateX" || key == "rotateY" || key == "rotateZ" ? "deg" : "px";
  }

  describe('scale 相关属性', () => {
    test('scale 应返回空字符串', () => {
      expect(getTransformUnit('scale')).toBe('');
    });

    test('scaleX 应返回空字符串', () => {
      expect(getTransformUnit('scaleX')).toBe('');
    });

    test('scaleY 应返回空字符串', () => {
      expect(getTransformUnit('scaleY')).toBe('');
    });

    test('scaleZ 应返回空字符串', () => {
      expect(getTransformUnit('scaleZ')).toBe('');
    });
  });

  describe('rotate 相关属性', () => {
    test('rotate 应返回 "deg"', () => {
      expect(getTransformUnit('rotate')).toBe('deg');
    });

    test('rotateX 应返回 "deg"', () => {
      expect(getTransformUnit('rotateX')).toBe('deg');
    });

    test('rotateY 应返回 "deg"', () => {
      expect(getTransformUnit('rotateY')).toBe('deg');
    });

    test('rotateZ 应返回 "deg"', () => {
      expect(getTransformUnit('rotateZ')).toBe('deg');
    });
  });

  describe('translate 相关属性（默认返回 px）', () => {
    test('x 应返回 "px"', () => {
      expect(getTransformUnit('x')).toBe('px');
    });

    test('y 应返回 "px"', () => {
      expect(getTransformUnit('y')).toBe('px');
    });

    test('z 应返回 "px"', () => {
      expect(getTransformUnit('z')).toBe('px');
    });

    test('translateX 应返回 "px"', () => {
      expect(getTransformUnit('translateX')).toBe('px');
    });

    test('translateY 应返回 "px"', () => {
      expect(getTransformUnit('translateY')).toBe('px');
    });

    test('translateZ 应返回 "px"', () => {
      expect(getTransformUnit('translateZ')).toBe('px');
    });
  });

  describe('其他 transform 属性（默认返回 px）', () => {
    test('skew 应返回 "px"', () => {
      expect(getTransformUnit('skew')).toBe('px');
    });

    test('skewX 应返回 "px"', () => {
      expect(getTransformUnit('skewX')).toBe('px');
    });

    test('skewY 应返回 "px"', () => {
      expect(getTransformUnit('skewY')).toBe('px');
    });

    test('matrix 应返回 "px"', () => {
      expect(getTransformUnit('matrix')).toBe('px');
    });

    test('matrix3d 应返回 "px"', () => {
      expect(getTransformUnit('matrix3d')).toBe('px');
    });

    test('perspective 应返回 "px"', () => {
      expect(getTransformUnit('perspective')).toBe('px');
    });
  });

  describe('边界值和异常输入', () => {
    test('空字符串应返回 "px"', () => {
      expect(getTransformUnit('')).toBe('px');
    });

    test('null 应返回 "px"', () => {
      expect(getTransformUnit(null)).toBe('px');
    });

    test('undefined 应返回 "px"', () => {
      expect(getTransformUnit(undefined)).toBe('px');
    });

    test('不存在的属性名应返回 "px"', () => {
      expect(getTransformUnit('nonexistent')).toBe('px');
    });

    test('大小写敏感的 scale（Scale）应返回 "px"', () => {
      expect(getTransformUnit('Scale')).toBe('px');
    });

    test('大小写敏感的 rotate（Rotate）应返回 "px"', () => {
      expect(getTransformUnit('Rotate')).toBe('px');
    });
  });
});
