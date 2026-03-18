import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { API_PATHS } from '../../utils/apiPaths';
import axiosInstance from '../../utils/axiosInstance';
import toast from 'react-hot-toast';
import InfoCard from '../../components/ExpenseTracker/Cards/InfoCard';
import { addThousandsSeparator } from '../../utils/help';
import { CreditCard, WalletMinimal, HandCoins } from 'lucide-react';
import RecentTransactions from '../../components/ExpenseTracker/Dashboard/RecentTransactions.jsx';
import FinanceOverview from '../../components/ExpenseTracker/Dashboard/FinanceOverview.jsx';
import ExpenseTransactions from '../../components/ExpenseTracker/Dashboard/ExpenseTransactions.jsx';
import Last30DaysExpenses from '../../components/ExpenseTracker/Dashboard/last30DaysExpenses.jsx';
import RecentIncomeWithChart from '../../components/ExpenseTracker/Dashboard/RecentIncomeWithChart.jsx';
import RecentIncome from '../../components/ExpenseTracker/Dashboard/RecentIncome.jsx';


const ExpenseTrackerDashboard = () => {

  // 导航
  const navigate = useNavigate();

  // 仪表盘数据
  const [dashboardData, setDashboardData] = useState(null);
  // 加载状态
  const [loading, setLoading] = useState(true);

  // 获取仪表盘数据
  const fetchDashboardData = async () => {
    // 设置加载状态
    setLoading(true);
    // 获取仪表盘数据
    try {
      // 调用 axiosInstance 的 get 方法，获取仪表盘数据
      const response = await axiosInstance.get(
        API_PATHS.EXPENSE_DASHBOARD.GET_EXPENSE_DASHBOARD
      );
      // 获取响应数据
      const raw = response?.data;

      //从接口返回的 raw 数据中提取正确的数据结构，然后更新 dashboardData 状态。它主要是为了 兼容不同 API 返回格式，避免程序出错
      // ?. 是 可选链，防止 raw 为 null 报错。
      // typeof 是 运算符，用来判断数据类型
      // 如果 raw.data 不为 null，并且 totalBalance、totalIncomes、totalExpenses 都是数字，则设置 dashboardData 为 raw.data
      // 否则设置 dashboardData 为 raw
      const data =
        raw?.data != null &&
        (typeof raw.data.totalBalance === 'number' ||
          typeof raw.data.totalIncomes === 'number' ||
          typeof raw.data.totalExpenses === 'number')
          ? raw.data
          : raw;
      // 如果 data 不为 null，并且 data 是对象，则设置 dashboardData 为 data
      if (data && typeof data === 'object') {
        setDashboardData(data);
      }
    } catch (error) {
      // 显示错误信息
      toast.error('Failed to fetch dashboard data');
      console.error(error);
    } finally {
      // 设置加载状态
      setLoading(false);
    }
  };

  // 组件挂载时，获取仪表盘数据
  useEffect(() => {
    // 获取仪表盘数据
    fetchDashboardData();
  }, []);


  return (
    <div className='my-5 mx-auto'>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* 总余额卡片 */}
        <InfoCard
          icon={<CreditCard />}
          label='Total Balance'
          value={addThousandsSeparator(dashboardData?.totalBalance || 0)}
          color='bg-emerald-500'
        />
        {/* 总收入卡片 */}
        <InfoCard
          icon={<WalletMinimal />}
          label='Total Income'
          value={addThousandsSeparator(dashboardData?.totalIncomes || 0)}
          color='bg-blue-500'
        />
        {/* 总支出卡片 */}
        <InfoCard
          icon={<HandCoins />}
          label='Total Expense'
          // 添加千位分隔符
          value={addThousandsSeparator(dashboardData?.totalExpenses || 0)}
          color='bg-yellow-500'
        />
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-6'>
        {/* 最近交易卡片 */}
        <RecentTransactions
          transactions={dashboardData?.recentTransactions || []}
          onSeeMore={() => navigate('/expense-tracker/expense')}
        />

        {/* 财务概览卡片 */}
        <FinanceOverview
          totalBalance={dashboardData?.totalBalance || 0}
          totalIncomes={dashboardData?.totalIncomes || 0}
          totalExpenses={dashboardData?.totalExpenses || 0}
        />

        {/* 最近30天支出卡片 */}
        <ExpenseTransactions
          transactions={dashboardData?.last30DaysExpenses?.transactions || []}
          onSeeMore={() => navigate('/expense-tracker/expense')}
        />

        {/* 最近30天支出卡片 */}
        <Last30DaysExpenses
          data={dashboardData?.last30DaysExpenses?.transactions || []}
        />

        {/* 最近60天收入卡片 */}
        <RecentIncomeWithChart 
          data={dashboardData?.last60DaysIncomes?.transactions?.slice(0, 4) || []}
          totalIncome={dashboardData?.totalIncomes || 0}
        />

        {/* 最近60天收入卡片 */}
        <RecentIncome
          transactions={dashboardData?.last60DaysIncomes?.transactions || []}
          onSeeMore={() => navigate('/expense-tracker/income')}
        />
      </div>
    </div>
  )
}

export default ExpenseTrackerDashboard