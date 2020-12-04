
export function FilterText(v, text) { // 过滤函数 v: 0 获取整数部分 v: 1 获取小数部分
  console.log(v)
  if (v === 0) {
    return String(text).split('.')[0]
  } else {
    if (String(text).split('.').length > 1) {
      return '.' + String(text).split('.')[1]
    } else {
      return '.00'
    }
  }
}
// 加法运算
export function Add (x,y) {
  let arg1 = x,
      arg2 = y;
  var r1, r2, m, c;

  try {
      r1 = arg1.toString().split(".")[1].length;
  }
  catch (e) {
      r1 = 0;
  }
  try {
      r2 = arg2.toString().split(".")[1].length;
  }
  catch (e) {
      r2 = 0;
  }
  c = Math.abs(r1 - r2);
  m = Math.pow(10, Math.max(r1, r2));
  if (c > 0) {
      var cm = Math.pow(10, c);
      if (r1 > r2) {
          arg1 = Number(arg1.toString().replace(".", ""));
          arg2 = Number(arg2.toString().replace(".", "")) * cm;
      } else {
          arg1 = Number(arg1.toString().replace(".", "")) * cm;
          arg2 = Number(arg2.toString().replace(".", ""));
      }
  } else {
      arg1 = Number(arg1.toString().replace(".", ""));
      arg2 = Number(arg2.toString().replace(".", ""));
  }
  return (arg1 + arg2) / m;
}

// 减法运算
export function Sub (x,y) {
  let num1 = x || this.x,
      num2 = y || this.y || 0;
  var baseNum, baseNum1, baseNum2;
  var precision;// 精度
  try {
      baseNum1 = num1.toString().split(".")[1].length;
  } catch (e) {
      baseNum1 = 0;
  }
  try {
      baseNum2 = num2.toString().split(".")[1].length;
  } catch (e) {
      baseNum2 = 0;
  }
  baseNum = Math.pow(10, Math.max(baseNum1, baseNum2));
  precision = (baseNum1 >= baseNum2) ? baseNum1 : baseNum2;
  return ((num1 * baseNum - num2 * baseNum) / baseNum).toFixed(precision);
}

// 乘法运算
export function Multiply(x,y){
  let num1 = x || this.x,
      num2 = y || this.y;
  var baseNum = 0;
  if(!x||!y){
      return 0;
  }
  try {
      baseNum += num1.toString().split(".")[1].length;
  } catch (e) {
  }
  try {
      baseNum += num2.toString().split(".")[1].length;
  } catch (e) {
  }
  return Number(num1.toString().replace(".", "")) * Number(num2.toString().replace(".", "")) / Math.pow(10, baseNum);
}
