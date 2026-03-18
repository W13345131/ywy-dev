import React, { useState, useEffect } from 'react'
import toast from 'react-hot-toast';
import documentService from '../../../services/documentService';
import Button from '../../../components/common/Button';
import Spinner from '../../../components/common/Spinner';
import DocumentCard from '../../../components/AILearning/documents/DocumentCard';
import { FileText, Plus, Upload, X, Trash2 } from 'lucide-react';


function DocumentListPage() {


  // 用来存储 documents 的 state
  const [documents, setDocuments] = useState([]);
  // 用来存储 loading 的 state
  const [loading, setLoading] = useState(true);
  // 用来存储 isUploadModalOpen 的 state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  // 用来存储 uploadFile 的 state
  const [uploadFile, setUploadFile] = useState(null);
  // 用来存储 uploadTitle 的 state
  const [uploadTitle, setUploadTitle] = useState('');
  // 用来存储 uploading 的 state
  const [uploading, setUploading] = useState(false);
  // 用来存储 isDeleteModalOpen 的 state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // 用来存储 deleting 的 state
  const [deleting, setDeleting] = useState(false);
  // 用来存储 selectedDoc 的 state
  const [selectedDoc, setSelectedDoc] = useState(null);


  // 异步函数 fetchDocuments，用于从后端获取 documents 数据，然后更新 React 的 state
  const fetchDocuments = async () => {
    try {
      const data = await documentService.getDocuments();
      // 把获取到的数据设置到 documents 中
      setDocuments(data);
    }
    catch (error) {
      toast.error('Failed to fetch documents');
      console.error(error);
    }
    finally {
      setLoading(false);
    }
  };

  // useEffect() 是 React 提供的 Hook，用来在组件挂载后执行副作用。
  useEffect(() => {
    // 调用 fetchDocuments 函数，获取 documents 数据
    fetchDocuments();
  }, []);

  // 处理文件改变事件
  const handleFileChange = (e) => {
    // 获取文件
    const file = e.target.files[0];
    if (file) {
      // 把文件设置到 uploadFile 中
      setUploadFile(file);
      // 把文件名设置到 uploadTitle 中
      setUploadTitle(file.name.replace(/\.[^/.]+$/, ''));
    }
  };

  // 处理上传事件
  const handleUpload = async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();
    // 如果文件不存在，或者标题不存在，则提示用户输入标题和选择文件
    if (!uploadFile || !uploadTitle) {
      toast.error('Please provide a title and select a file');
      return;
    }
    // 设置上传中状态
    setUploading(true);
    // 创建表单数据
    const formData = new FormData();
    // 把文件添加到表单数据中
    formData.append('file', uploadFile);
    // 把标题添加到表单数据中
    formData.append('title', uploadTitle);
    try {
      // 调用 documentService.uploadDocument 函数，上传文档
      await documentService.uploadDocument(formData);
      // 提示用户上传成功
      toast.success('Document uploaded successfully');
      // 关闭上传模态框
      setIsUploadModalOpen(false);
      // 清空上传文件
      setUploadFile(null);
      // 清空标题
      setUploadTitle('');
      // 设置上传中状态
      setUploading(true);
      // 调用 fetchDocuments 函数，获取 documents 数据
      fetchDocuments();
    }
    catch (error) {
      toast.error(error.message || 'Failed to upload document');
    }
    finally {
      setUploading(false);
    }
  };
  
  // 处理删除请求
  const handleDeleteRequest = async (id) => {
    // 设置选中的文档
    setSelectedDoc(id);
    // 打开删除模态框
    setIsDeleteModalOpen(true);
  };
  
  // 处理删除确认
  const handleDeleteConfirm =  (doc) => {
    // 设置选中的文档
    setSelectedDoc(doc);
    // 打开删除模态框
    setIsDeleteModalOpen(true);
  };

  // 处理删除确认
  const handleConfirmDelete = async () => {
    // 如果选中的文档不存在，则返回
    if (!selectedDoc) return;
    // 设置正在删除
    setDeleting(true);
    // 调用 documentService.deleteDocument 函数，删除文档
    try {
      await documentService.deleteDocument(selectedDoc._id);
      toast.success(`'${selectedDoc.title}' deleted successfully`);
      // 关闭删除模态框
      setIsDeleteModalOpen(false);
      // 清空选中的文档
      setSelectedDoc(null);
      // 重新获取 documents 数据
      setDocuments(documents.filter(doc => doc._id !== selectedDoc._id));
    }
    catch (error) {
      toast.error(error.message || 'Failed to delete document');
    }
    finally {
      setDeleting(false);
    }
  };

  // 渲染内容
  const renderContent = () => {
    // 如果正在加载，则显示加载中
    if (loading) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <Spinner />
        </div>
      )
    }

    // 如果没有文档，则显示空状态
    if (documents.length === 0) {
      return (
        <div className='flex items-center justify-center min-h-[400px]'>
          <div className='text-center max-w-md'>
            <div className='inline-flex items-center justify-center w-20 h-20 rounded-2xl 
            bg-linear-to-br from-slate-100 to-slate-200 shadow-lg shadow-slate-200/50 mb-6'>
              <FileText
                className='w-10 h-10 text-slate-400'
                strokeWidth={1.5}
              />
            </div>
            <h3 className='text-xl font-medium text-slate-900 tracking-tight mb-2'>No Documents Yet</h3>
            <p className='text-sm text-slate-500 mb-6'>
              Get started by uploading your first PDF document to begin learning.
            </p>
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className='inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-emerald-500 
              to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold 
              rounded-xl transition-all duration-200 shadow-lg shadow-emerald-500/25 hover:shadow-xl 
              hover:shadow-emerald-500/30 active:scale-[0.98]'
            >
              <Plus strokeWidth={2.5} className='w-4 h-4' />
              Upload Document
            </button>
          </div>
        </div>
      )
    }

    // 如果文档存在，则显示文档列表
    return (
      // 网格布局
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
        {/* 遍历 documents 数组，把每个文档渲染成一个 DocumentCard 组件 */}
        {documents?.map((doc) => (
          <DocumentCard key={doc._id} document={doc} onDelete={handleDeleteRequest} />
        ))}
      </div>
    )
  }

  // 渲染页面
  return (
    <div className='min-h-screen'>
      {/* 渐变背景 */}
      <div className='absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[16px_16px] opacity-30 pointer-events-none' />
          <div className='relative max-w-7xl mx-auto'>
          {/* Header */}
          <div className='flex items-center justify-between mb-10'>
            <div className=''>
              <h1 className='text-2xl font-medium text-slate-900 tracking-tight mb-2'>My Documents</h1>
              <p className='text-sm text-slate-500'>Manage your organize your learning materials</p>
            </div>
            {/* 如果文档存在，则显示上传按钮 */}
            {documents.length > 0 && (
              <Button onClick={() => setIsUploadModalOpen(true)}>
                <Plus strokeWidth={2.5} className='w-4 h-4' />
                Upload Document
              </Button>
            )}
          </div>
          {/* 渲染内容 */}
          {renderContent()}
        </div>

        {/* 如果上传模态框打开，则显示上传模态框 */}
        {isUploadModalOpen && (<div className='fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50'>
          {/* 模态框 */}
          <div className='relative w-full max-w-lg bg-white/95 backdrop-blur-xl border border-slate-200/60 
          rounded-2xl p-8 shadow-2xl shadow-slate-900/20'>
            {/* 关闭按钮 */}
            <button
            onClick={() => setIsUploadModalOpen(false)}
            className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg 
            text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200'
            >
              <X strokeWidth={2} className='w-5 h-5' />
            </button>

            {/* Modal Header */}
            <div className='mb-6'>
              <h2 className='text-xl font-medium text-slate-900 tracking-tight'>
                Upload New Document
              </h2>
              <p className='text-sm text-slate-500 mt-1'>
                Add a PDF to to your library
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleUpload} className='space-y-5'>
              {/* Title Input */}
              <div className='space-y-2'>
              <label htmlFor="" className='block text-xs text-slate-700 font-semibold uppercase tracking-wide'>
                Document Title
              </label>
              <input 
                type="text" 
                value={uploadTitle} 
                onChange={(e) => setUploadTitle(e.target.value)} 
                required
                className='w-full h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 
                text-slate-900 placeholder:text-slate-400 text-sm font-medium transition-all duration-200 
                focus:outline-none focus:border-emerald-500 focus:bg-white focus:shadow-lg 
                focus:shadow-emerald-500/10'
                placeholder='e.g., React Interview Prep'
              />
              </div>

              {/* File Upload */}
              <div className='space-y-2'>
                <label htmlFor="" className='block text-xs text-slate-700 font-semibold uppercase tracking-wide'>
                  PDF File
                </label>
                <div className='relative border-2 border-dashed border-slate-300 rounded-xl bg-slate-50/50 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all duration-200'>
                  <input
                    id="file-upload"
                    type="file"
                    className='absolute w-full h-full inset-0 opacity-0 cursor-pointer z-10'
                    onChange={handleFileChange}
                    // 只允许上传 PDF 文件
                    accept='.pdf'
                  />
                  <div className='flex flex-col items-center justify-center py-10 px-6'>
                    {/* 上传图标 */}
                    <div className='w-14 h-14 rounded-xl bg-linear-to-r from-emerald-100 to-teal-100 flex items-center justify-center mb-4'>
                      <Upload
                        className='w-7 h-7 text-emerald-600'
                        strokeWidth={2}
                      />
                    </div>
                    <p className='text-sm text-slate-700 font-medium mb-1'>
                      {/* 如果上传文件存在，则显示文件名 */}
                      {uploadFile ? (
                        <span className='text-emerald-600'>{uploadFile.name}</span>
                      ) : (
                        // 如果上传文件不存在，则显示点击上传或拖拽上传
                        <>
                          <span className='text-emerald-600'>Click to upload</span>{' '}
                          or drag and drop
                        </>
                      )}
                    </p>
                    {/* 提示信息 */}
                    <p className='text-xs text-slate-500'>PDF up to 10MB</p>
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className='flex gap-3 pt-2'>
                {/* 取消按钮 */}
                <button
                  type='button'
                  onClick={() => setIsUploadModalOpen(false)}
                  disabled={uploading}
                  className='flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  Cancel
                </button>
                {/* 上传按钮 */}
                <button
                  type='submit'
                  disabled={uploading}
                  className='flex-1 h-11 px-4 bg-linear-to-r from-emerald-500 to-teal-500 
                  hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl 
                  transition-all duration-200 shadow-lg shadow-emerald-500/25 disabled:opacity-50
                  disabled:cursor-not-allowed active:scale-[0.98]'
                >
                  {/* 如果正在上传，则显示加载状态 */}
                  {uploading ? (
                    <span className='flex items-center justify-center gap-2'>
                      <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full
                      animate-spin'>
                        Uploading...
                      </div>
                    </span>
                  ) : (
                    "Upload"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>)}

        {/* 如果删除模态框打开，则显示删除模态框 */}
        {isDeleteModalOpen && (<div className='fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm'>
          <div className='relative w-full max-w-md bg-white/95 backdrop-blur-xl 
          border border-slate-200/60 rounded-2xl p-8 shadow-2xl shadow-slate-900/20'>
            {/* 关闭按钮 */}
            <button 
            onClick={() => setIsDeleteModalOpen(false)}
            className='absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all duration-200'
            >
              <X strokeWidth={2} className='w-5 h-5' />
            </button>

            {/* 模态框头部 */}
            <div className='mb-6'>
              <h2 className='text-xl font-medium text-slate-900 tracking-tight'>
                Confirm Deletion
              </h2>
            </div>

            {/* 模态框内容 */}
            <p className='text-sm text-slate-500 mb-6'>
              Are you sure you want to delete this document:{' '}
              <span className='font-medium text-slate-900'>
                {selectedDoc?.title}
              </span>
              ? This action cannot be undone.
            </p>

            {/* 操作按钮 */}
            <div className='flex gap-3'>
              {/* 取消按钮 */}
              <button
              type='button'
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={deleting}
              className='flex-1 h-11 px-4 border-2 border-slate-200 rounded-xl bg-white text-slate-700 text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                Cancel
              </button>
              {/* 删除按钮 */}
              <button
              onClick={handleConfirmDelete}
              disabled={deleting}
              className='flex-1 h-11 px-4 bg-linear-to-r from-red-500 to-rose-500 
              hover:from-red-600 hover:to-rose-600 text-white text-sm font-semibold rounded-xl 
              transition-all duration-200 shadow-lg shadow-red-500/25 disabled:opacity-50
              disabled:cursor-not-allowed active:scale-[0.98]'
              >
                {/* 如果正在删除，则显示加载状态 */}
                {deleting ? (
                  <span className='flex items-center justify-center gap-2'>
                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full
                      animate-spin'>
                      Deleting...
                    </div>
                  </span>
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>

        </div>)}
      </div>
    )
}

export default DocumentListPage