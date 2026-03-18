import React, { useState, useEffect } from 'react'
import IncomeOverview from '../../components/ExpenseTracker/Income/IncomeOverview'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import ExpenseTrackerModal from '../../components/ExpenseTracker/ExpenseTrackerModal'
import AddIncomeForm from '../../components/ExpenseTracker/Income/AddIncomeForm'
import IncomeList from '../../components/ExpenseTracker/Income/IncomeList'
import DeleteAlert from '../../components/ExpenseTracker/DeleteAlert'


const Income = () => {


  // 收入数据
  const [incomeData, setIncomeData] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 删除弹窗状态
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    show: false,
    data: null,
  });

  // 控制添加收入的弹窗（Modal）是否打开
  const [openAddIncomeModal, setOpenAddIncomeModal] = useState(false);

  // 获取收入详情
  const fetchIncomeDetails = async () => {
    setLoading(true);

    try {
      // 获取收入详情
      const response = await axiosInstance.get(API_PATHS.INCOME.GET_ALL_INCOMES);
      // 获取响应数据
      const raw = response?.data;
      // 获取收入列表
      // 安全地获取数据列表，防止接口返回的数据格式不一致导致报错
      // 如果raw.data存在，则使用raw.data
      // 如果raw.data不存在，则使用raw
      // 保证数据格式为数组
      const list = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
      // 设置收入数据
      setIncomeData(list);
    } catch (error) {
      toast.error('Failed to fetch income details');
    } finally {
      setLoading(false);
    }

  }


  // 处理添加收入
  const handleAddIncome = async (income) => {
    // 解构赋值，source 是来源，amount 是金额，date 是日期，icon 是图标
    const { source, amount, date, icon } = income;

    if (!source.trim()) {
      toast.error('Source is required');
      return;
    }

    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount is required and must be greater than 0');
      return;
    }

    if (!date) {
      toast.error('Date is required');
      return;
    }

    if (!icon) {
      toast.error('Icon is required');
      return;
    }

    try {
      // 调用 axiosInstance 的 post 方法，添加收入
      await axiosInstance.post(API_PATHS.INCOME.ADD_INCOME, { source, amount, date, icon });

      // 关闭添加收入的弹窗
      setOpenAddIncomeModal(false);
      // 显示成功信息
      toast.success('Income added successfully');
      // 重新获取收入详情
      fetchIncomeDetails();
    } catch (error) {
      // 显示错误信息
      console.error('Failed to add income', error.response?.data?.message || error.message);
    }
  }

  const deleteIncome = async (id) => {
    
    try {
      // 调用 axiosInstance 的 delete 方法，删除收入
      await axiosInstance.delete(API_PATHS.INCOME.DELETE_INCOME(id))
      // 关闭删除收入的弹窗
      setOpenDeleteAlert({ show: false, data: null })
      // 显示成功信息
      toast.success('Income deleted successfully')
      // 重新获取收入详情
      fetchIncomeDetails()
    } catch (error) {
      console.error('Failed to delete income', error.response?.data?.message || error.message)
    }
  }

  // 处理下载收入详情
  const handleDownloadIncomeDetails = async () => {
    // 下载收入详情
    try {
      // 调用 axiosInstance 的 get 方法，下载收入详情
      const response = await axiosInstance.get(API_PATHS.INCOME.DOWNLOAD_INCOME_EXCEL,
        // 设置响应类型为 blob
        // blob 是二进制大对象，用于下载文件
        {
          responseType: 'blob',
        }
      )

      // 把后端返回的二进制数据转换成浏览器可以下载的 临时文件地址（URL）。
      // Blob = Binary Large Object, 用来表示文件数据
      // new Blob([response.data])意思是把 response.data 包装成一个文件。
      const url = window.URL.createObjectURL(new Blob([response.data]))

      // 创建下载标签,创建一个 <a> 标签
      const link = document.createElement('a')
      // 设置下载地址,让 <a> 标签指向刚刚创建的文件地址

      link.href = url

      link.setAttribute('download', 'incomes_details.xlsx')
      // 把 <a> 插入到 DOM 里。浏览器需要元素存在 DOM 才能触发点击
      document.body.appendChild(link)
      // 触发点击，浏览器会自动下载文件
      link.click()
      // 删除下载标签
      // parentNode 是 <a> 标签的父节点，也就是 <body> 标签
      link.parentNode.removeChild(link)
      // 释放刚才创建的 blob URL，防止内存泄漏
      window.URL.revokeObjectURL(url)
    } catch (error) {
      // 显示错误信息
      console.error('Failed to download income details', error.response?.data?.message || error.message)
    }
  }


  // 组件挂载时，获取收入详情
  useEffect(() => {
    // 获取收入详情
    fetchIncomeDetails();
    return () => {}
  }, []);

  // 返回收入页面
  return (
    <div className='my-5 mx-auto'>
      <div className='grid grid-cols-1 gap-6'>
        <div>
          <IncomeOverview
            transactions={incomeData}
            onAddIncome={() => setOpenAddIncomeModal(true)}
          />
        </div>
      </div>

      <IncomeList
        transactions={incomeData}
        openDelete={(id) => 
          setOpenDeleteAlert({
            show: true,
            data: id,
          })
        }
        onDownload={handleDownloadIncomeDetails}
      />

      <ExpenseTrackerModal
        isOpen={openAddIncomeModal}
        onClose={() => setOpenAddIncomeModal(false)}
        title='Add Income'
      >
        {/* 添加收入表单 */}
        <AddIncomeForm onAddIncome={handleAddIncome} />
      </ExpenseTrackerModal>

      {/* 删除收入弹窗 */}
      <ExpenseTrackerModal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title='Delete Income'
      >
        {/* 删除确认弹窗 */}
        <DeleteAlert
          content='Are you sure you want to delete this income?'
          onDelete={() => deleteIncome(openDeleteAlert.data)}
        />
      </ExpenseTrackerModal>
    </div>
  )
}

export default Income