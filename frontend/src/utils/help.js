import moment from 'moment';

// 把数字格式化为带千位分隔符的字符串
export const addThousandsSeparator = (num) => {

    // isNaN(num) 判断 num 是否不是数字
    // num == null 判断 num 是否为空
    // 如果 num 为空或不是数字，则返回空字符串
    if (num == null || isNaN(num)) return '';

    // 把数字转换成字符串并拆分
    // toString() 把数字转换成字符串
    // split('.') 把字符串按小数点拆分成数组
    // integerPart 整数部分
    // fractionalPart 小数部分
    const [integerPart, fractionalPart] = num.toString().split('.');

    // 在每3位数字的位置插入逗号
    // replace() 替换字符串
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // 如果小数部分不为空，则返回整数部分和小数部分拼接的字符串
    // 否则返回整数部分
    // `${formattedInteger}.${fractionalPart}` 拼接整数部分和小数部分
    return fractionalPart
      ? `${formattedInteger}.${fractionalPart}`
      : formattedInteger;
}



// 工具函数（utility function），用于把原始支出数据 转换成柱状图（Bar Chart）需要的数据格式
export const prepareExpenseBarChartData = (data = []) => {

  // 将原始消费数据整理成柱状图可用的“类别-金额”格式数据
  const chartData = data.map((item) => ({
    category: item?.category,
    amount: item?.amount,
  }));
  return chartData;
}


// 把收入数据（income data）处理成可以用于柱状图（Bar Chart）的格式，并按日期排序
export const prepareIncomeBarChartData = (data) => {

  // 确保数据是数组
  const list = Array.isArray(data) ? data : [];
  // 按日期排序, 把最新的日期排在前面
  // ...list 是 ES6 的语法，表示将 list 数组展开并复制一份
  // sort() 方法用于对数组进行排序, 参数是一个回调函数
  // 按日期从早到晚排序，最新的排在前面
  // new Date(a.date) - new Date(b.date)
  // 转成时间后相减
  // 如果结果小于0，会让a排在b前面，否则b排在a前面
  const sortedData = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));


  const chartData = sortedData.map((item) => ({
    // 格式化日期，format() 方法用于格式化日期,'Do MMM' 表示格式化成 "第几天 月份" 的格式
    date: moment(item?.date).format('Do MMM'),
    amount: Number(item?.amount) || 0,
    source: item?.source,
    // CustomBarChart 的 X 轴需要 category 字段
    // 如果 source 不为空，则显示 source 和日期
    // 否则显示日期
    // `${item.source} (${moment(item?.date).format('Do MMM')})` 拼接 source 和日期
    // moment(item?.date).format('Do MMM') 格式化日期
    category: item?.source ? `${item.source} (${moment(item?.date).format('Do MMM')})` : moment(item?.date).format('Do MMM'),
  }));

  return chartData;
}


// 把支出数据转换成折线图（Line Chart）可以使用的数据，并按日期排序
export const prepareExpenseLineChartData = (data = []) => {

  // 确保数据是数组
  const list = Array.isArray(data) ? data : [];
  // 按日期排序, 把最新的日期排在前面
  const sortedData = [...list].sort((a, b) => new Date(a.date) - new Date(b.date));

  const chartData = sortedData.map((item) => ({
    date: moment(item?.date).format('Do MMM'),
    amount: item?.amount,
    category: item?.category,
  }));

  return chartData;
}