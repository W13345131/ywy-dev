import {React, useState, useEffect} from 'react'
import { useAuth } from '../../context/AuthContent'
import { useNavigate } from 'react-router-dom'
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import toast from 'react-hot-toast';
import moment from 'moment';
import { addThousandsSeparator } from '../../utils/help';
import InfoCard from '../../components/TaskManager/Cards/InfoCard';
import { ArrowRight } from 'lucide-react';
import TaskListTable from '../../components/TaskManager/TaskListTable';
import CustomPieChart from '../../components/TaskManager/Charts/CustomPieChart.jsx';
import CustomBarChart from '../../components/TaskManager/Charts/CustomBarChart.jsx';

const COLORS = ["#8D51FF", "#00B8DB", "#7BCE00"];

function UserDashboard() {

  // 获取当前用户信息
  const { user } = useAuth();

  // 导航
  const navigate = useNavigate();

  // 仪表盘数据
  const [dashboardData, setDashboardData] = useState(null);
  // 任务状态分布数据
  const [pieChartData, setPieChartData] = useState([]);
  // 任务优先级分布数据
  const [barChartData, setBarChartData] = useState([]);

  const prepareChartData = (data) => {
    // 准备任务状态分布数据
    const taskDistribution = data?.taskDistribution || null;
    // 准备任务优先级分布数据
    const taskPriorityLevels = data?.taskPriorityLevels || null;
    
    // 准备任务状态分布数据
    const taskDistributionData = [
      {
        status: 'Pending',
        count: taskDistribution?.Pending || 0,
      },
      {
        status: 'In Progress',
        count: taskDistribution?.InProgress || 0,
      },
      {
        status: 'Completed',
        count: taskDistribution?.Completed || 0,
      },
    ];

    // 设置任务状态分布数据
    setPieChartData(taskDistributionData);

    // 准备任务优先级分布数据
    const taskPriorityLevelsData = [
      {
        priority: 'Low',
        count: taskPriorityLevels?.Low || 0,
      },
      {
        priority: 'Medium',
        count: taskPriorityLevels?.Medium || 0,
      },
      {
        priority: 'High',
        count: taskPriorityLevels?.High || 0,
      },
    ];

    // 设置任务优先级分布数据
    setBarChartData(taskPriorityLevelsData);

  }


  // 获取用户仪表盘数据
  const getDashboardData = async () => {

    try {
      // 调用 axiosInstance 的 get 方法，获取 dashboard 数据
      const response = await axiosInstance.get(API_PATHS.TASK_MANAGER.GET_USER_DASHBOARD_DATA);

      // 如果 response.data 存在，则设置 dashboardData
      if (response.data) {
        // 设置仪表盘数据
        setDashboardData(response.data);
        // 准备图表数据
        prepareChartData(response.data?.charts || null);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to fetch dashboard data');
    } 
  }

  // 查看更多任务
  const onSeeMore = () => {
    navigate('/admin/task-manager/manage-task');
  }


  // 组件挂载时，获取 dashboard 数据
  useEffect(() => {
    // 获取 dashboard 数据
    getDashboardData();
    // 组件卸载时，清除数据
    return () => {}
  }, []);

  return (
    <div className='card my-5'>
      <div>
        {/* col-span-3：占据3列 */}
        <div className='col-span-3'>
          <h2 className='text-xl md:text-2xl'>Good Morning! {user?.username}</h2>
          <p className='text-xs md:text-[13px] text-gray-400 mt-1.5'>
            {moment().format('dddd, Do MMM, YYYY')}
          </p>
        </div>
      </div>
      {/* 任务卡片 */}
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 md:gap-6 mt-6'>
        {/* 总任务卡片 */}
        <InfoCard
          // icon={<IoMdCard />}
          label='Total Tasks'
          value={addThousandsSeparator(
            // 如果 dashboardData 存在，则显示 dashboardData.charts.taskDistribution.All，否则显示 0
            // .charts表示charts对象，.taskDistribution表示taskDistribution对象，.All表示All属性
            dashboardData?.charts?.taskDistribution?.All || 0
          )}
          color='bg-blue-500'
        />
        {/* Pending 任务卡片 */}
        <InfoCard
          // icon={<IoMdCard />}
          label='Pending Tasks'
          value={addThousandsSeparator(
            // 如果 dashboardData 存在，则显示 dashboardData.charts.taskDistribution.Pending，否则显示 0
            // .charts表示charts对象，.taskDistribution表示taskDistribution对象，Pending表示Pending属性
            dashboardData?.charts?.taskDistribution?.Pending || 0
          )}
          color='bg-violet-500'
        />
        {/* In Progress 任务卡片 */}
        <InfoCard
          // icon={<IoMdCard />}
          label='In Progress Tasks'
          value={addThousandsSeparator(
            // 如果 dashboardData 存在，则显示 dashboardData.charts.taskDistribution.InProgress，否则显示 0
            // .charts表示charts对象，.taskDistribution表示taskDistribution对象，InProgress表示InProgress属性
            dashboardData?.charts?.taskDistribution?.InProgress || 0
          )}
          color='bg-cyan-500'
        />
        {/* Completed 任务卡片 */}
        <InfoCard
          // icon={<IoMdCard />}
          label='Completed Tasks'
          value={addThousandsSeparator(
            // 如果 dashboardData 存在，则显示 dashboardData.charts.taskDistribution.Completed，否则显示 0
            // .charts表示charts对象，.taskDistribution表示taskDistribution对象，Completed表示Completed属性
            dashboardData?.charts?.taskDistribution?.Completed || 0
          )}
          color='bg-lime-500'
        />
      </div>

      {/*  */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 md:my-6'>

        {/* 任务状态分布 */}
        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Distribution</h5>
            </div>
            {/* 创建饼图 */}
            <CustomPieChart
              data={pieChartData}
              label="Total Balance"
              colors={COLORS}
            />
          </div>
        </div>

        {/* 任务优先级分布 */}
        <div>
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='font-medium'>Task Priority Levels</h5>
            </div>
            {/* 创建柱状图 */}
            <CustomBarChart
              data={barChartData}
            />
          </div>
        </div>

        {/* 子元素：占满2列 */}
        <div className='md:col-span-2'>
          {/* 最近任务 */}
          <div className='card'>
            <div className='flex items-center justify-between'>
              <h5 className='text-lg'>Recent Tasks</h5>

              <button className='task-manager-card-btn' onClick={onSeeMore}>
                See All <ArrowRight className='text-base' />
              </button>
            </div>

            {/* 创建任务列表表格 */}
            <TaskListTable
              tableData={dashboardData?.recentTasks || []}
            />
          </div>
        </div>
      </div>

    </div>
  )
}

export default UserDashboard