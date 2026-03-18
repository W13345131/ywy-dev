import React from 'react'
import { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import { API_PATHS } from '../../utils/apiPaths'
import toast from 'react-hot-toast'
import ExpenseOverview from '../../components/ExpenseTracker/Expense/ExpenseOverview'
import ExpenseTrackerModal from '../../components/ExpenseTracker/ExpenseTrackerModal'
import AddExpenseForm from '../../components/ExpenseTracker/Expense/AddExpenseForm'
import ExpenseList from '../../components/ExpenseTracker/Expense/ExpenseList'
import DeleteAlert from '../../components/ExpenseTracker/DeleteAlert'

const Expense = () => {

  // 支出数据
  const [expenseData, setExpenseData] = useState([]);
  // 加载状态
  const [loading, setLoading] = useState(false);
  // 删除弹窗状态
  const [openDeleteAlert, setOpenDeleteAlert] = useState({
    // show	是否显示删除提示框
    // data	要删除的那条数据
    show: false,
    data: null,
  });

  // 控制添加费用的弹窗（Modal）是否打开
  const [openAddExpenseModal, setOpenAddExpenseModal] = useState(false);


  // 获取支出详情
  const fetchExpenseDetails = async () => {
    // 设置加载状态
    setLoading(true);

    try {
      // 获取支出详情
      const response = await axiosInstance.get(API_PATHS.EXPENSE.GET_ALL_EXPENSES);
      // 获取响应数据
      const raw = response?.data;
      // 获取支出列表
      // 安全地获取数据列表，防止接口返回的数据格式不一致导致报错
      // 如果raw.data存在，则使用raw.data
      // 如果raw.data不存在，则使用raw
      // 保证数据格式为数组
      const list = Array.isArray(raw?.data) ? raw.data : (Array.isArray(raw) ? raw : []);
      // 设置支出数据
      setExpenseData(list);
    } catch (error) {
      toast.error('Failed to fetch expense details');
    } finally {
      setLoading(false);
    }

  }


  // 处理添加费用
  const handleAddExpense = async (expense) => {
    // 解构赋值，category 是分类，amount 是金额，date 是日期，icon 是图标
    const { category, amount, date, icon } = expense;

    // 如果分类为空，则显示错误信息
    if (!category?.trim()) {
      toast.error('Category is required');
      return;
    }

    // 如果金额为空，则显示错误信息
    if (!amount || isNaN(amount) || Number(amount) <= 0) {
      toast.error('Amount is required and must be greater than 0');
      return;
    }

    // 如果日期为空，则显示错误信息
    if (!date) {
      toast.error('Date is required');
      return;
    }

    // 如果图标为空，则显示错误信息
    if (!icon) {
      toast.error('Icon is required');
      return;
    }

    try {
      // 调用 axiosInstance 的 post 方法，添加支出
      await axiosInstance.post(API_PATHS.EXPENSE.ADD_EXPENSE, { category, amount: Number(amount), date, icon });

      // 关闭添加费用的弹窗
      setOpenAddExpenseModal(false);
      // 显示成功信息
      toast.success('Expense added successfully');
      // 重新获取支出详情
      fetchExpenseDetails();
    } catch (error) {
      // 显示错误信息
      toast.error(error.response?.data?.message || 'Failed to add expense');
    }
  }

  // 处理删除费用
  const deleteExpense = async () => {
    // 获取要删除的支出 ID
    const id = openDeleteAlert.data
    // 如果要删除的支出 ID 为空，则返回
    if (!id) return
    try {
      // 调用 axiosInstance 的 delete 方法，删除支出
      await axiosInstance.delete(API_PATHS.EXPENSE.DELETE_EXPENSE(id))
      // 关闭删除费用的弹窗
      setOpenDeleteAlert({ show: false, data: null })
      // 显示成功信息
      toast.success('Expense deleted successfully')
      // 重新获取支出详情
      fetchExpenseDetails()
    } catch (error) {
      // 显示错误信息
      toast.error(error.response?.data?.message || 'Failed to delete expense')
    }
  }


  // 处理下载支出详情
  const handleDownloadExpenseDetails = async () => {
    
    try {
      // 调用 axiosInstance 的 get 方法，下载支出详情
      const response = await axiosInstance.get(API_PATHS.EXPENSE.DOWNLOAD_EXPENSE_EXCEL,
        {
          // 设置响应类型为 blob
          // blob 是二进制大对象，用于下载文件
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

      // 设置下载文件名,download 属性用于指定下载后的文件名,expenses_details.xlsx 是文件名
      link.setAttribute('download', 'expenses_details.xlsx')

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
      console.error('Failed to download expense details', error.response?.data?.message || error.message)
    }
  }


  // 组件挂载时，获取支出详情
  useEffect(() => {
    // 获取支出详情
    fetchExpenseDetails();
    // 组件卸载时，清空支出数据
    return () => {
      setExpenseData([]);
    }
  }, []);

  // 返回支出页面
  return (
    <div className='my-5 mx-auto'>
      {/* grid grid-cols-1 gap-6 是网格布局，用于将页面分成 1 列，每列之间有 6 个单位的间距 */}
      <div className='grid grid-cols-1 gap-6'>
        <div className=''>
          {/* ExpenseOverview 是支出概览组件，用于显示支出概览 */}
          {/* transactions={expenseData}把支出数据传给概览组件，用来统计或展示支出信息 */}
          {/* onAddExpense={() => setOpenAddExpenseModal(true)}这是一个回调函数 */}
          <ExpenseOverview
            transactions={expenseData}
            onAddExpense={() => setOpenAddExpenseModal(true)}
          />
        </div>
      </div>

      {/* 添加支出弹窗 */}
      <ExpenseTrackerModal
        isOpen={openAddExpenseModal}
        onClose={() => setOpenAddExpenseModal(false)}
        title='Add Expense'
      >

        <AddExpenseForm onAddExpense={handleAddExpense} />
      </ExpenseTrackerModal>

      {/* 支出列表 */}
      <ExpenseList
        transactions={expenseData}
        openDelete={(id) =>
          setOpenDeleteAlert({ show: true, data: id })
        }
        onDownload={handleDownloadExpenseDetails}
      />

      <ExpenseTrackerModal
        isOpen={openDeleteAlert.show}
        onClose={() => setOpenDeleteAlert({ show: false, data: null })}
        title='Delete Expense'
      >
        {/* 删除确认弹窗 */}
        <DeleteAlert
          content='Are you sure you want to delete this expense?'
          onDelete={() => deleteExpense()}
        />
      </ExpenseTrackerModal>
    </div>
  )
}

export default Expense