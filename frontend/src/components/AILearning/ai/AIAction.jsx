import React, { useState } from 'react'
import { useParams } from 'react-router-dom';
import aiService from '../../../services/aiService';
import { Sparkle, BookOpen, Lightbulb } from 'lucide-react';
import toast from 'react-hot-toast';
import Modal from '../../common/Modal';
import MarkdownRenderer from '../../common/MarkdownRenderer';



function AIAction() {

  // id → 赋值给 documentId
  const {id: documentId} = useParams();
  // 表示当前正在执行的操作
  const [loadingAction, setLoadingAction] = useState(null);
  // 表示当前是否正在显示结果模态框
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 存储结果模态框的内容
  const [modalContent, setModalContent] = useState("");
  // 存储结果模态框的标题
  const [modalTitle, setModalTitle] = useState("");
  // 用于保存某个概念/输入内容
  const [concept, setConcept] = useState("");

  // 生成总结
  const handleGenerateSummary = async () => {
    // 设置正在执行的操作
    setLoadingAction("summary");
    try {
      // 调用 aiService.generateSummary 方法，生成总结
      const {summary} = await aiService.generateSummary(documentId);
      // 设置结果模态框的标题
      setModalTitle("Generated Summary");
      // 设置结果模态框的内容
      setModalContent(summary);
      // 设置结果模态框的显示状态
      setIsModalOpen(true);
    } catch (error) {
      toast.error("Failed to generate summary.");
    } finally {
      setLoadingAction(null);
    }
  };


  // 解释概念
  const handleExplainConcept = async (e) => {
    // 阻止表单默认提交行为
    e.preventDefault();

    // 如果概念为空，则提示用户输入概念
    if (!concept.trim()) {
        toast.error("Please enter a concept to explain.");
        return;
    }

    // 设置正在执行的操作
    setLoadingAction("explain");

    try {
        // 调用 aiService.explainConcept 方法，解释概念
        const { explanation } = await aiService.explainConcept(documentId, concept);
        // 设置结果模态框的标题
        setModalTitle(`Explanation of "${concept}"`);
        // 设置结果模态框的内容
        setModalContent(explanation);
        // 设置结果模态框的显示状态
        setIsModalOpen(true);
        // 清空用户输入的概念
        setConcept("");
    } catch (error) {
        toast.error("Failed to explain concept.");
    } finally {
      setLoadingAction(null);
    }
  };


  return (
    <>
    <div className='bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-2xl shadow-xl shadow-slate-200/50 overflow-hidden'>
        {/* Header */}
        <div className='px-6 py-5 border-b border-slate-200/60 bg-linear-to-br from-slate-50/50 from-slate-50/50 to-white/50'>
            <div className='flex items-center gap-3'>
                <div className='w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-emerald-600 shadow-lg shadow-purple-500/25 flex items-center justify-center'>
                    <Sparkle strokeWidth={2} className='w-5 h-5 text-white' />
                </div>
                <div>
                <h3 className='text-lg font-semibold text-slate-900'>
                    AI Assistant
                </h3>
                <p className='text-xs text-slate-500'>
                    Powered by advanced AI
                </p>
                </div>
            </div>
        </div>
        {/* Generate Summary */}
        <div className='p-6 space-y-6'>
            <div className='group p-5 bg-linear-to-br from-slate-50/50 to-white/50 rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200'>
                <div className='flex items-start justify-between gap-4'>
                    <div className='flex-1'>
                        <div className='flex items-center gap-2 mb-1'>
                            <div className='w-8 h-8 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 flex items-center justify-center'>
                                <BookOpen strokeWidth={2} className='w-4 h-4 text-blue-600' />
                            </div>
                            <h4 className='font-semibold text-slate-900'>Generate Summary</h4>
                        </div>
                        <p className='text-sm text-slate-600 leading-relaxed mt-1'>
                            Get a concise summary of the entire document.
                        </p>
                    </div>
                    {/* 生成总结按钮 */}
                    <button

                      onClick={handleGenerateSummary}
                      // 如果正在生成总结，则禁用按钮
                      disabled={loadingAction === "summary"}
                      className='cursor-pointer shrink-0 h-10 px-5 bg-linear-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
                    >
                        {/* 如果正在生成总结，则显示加载中 */}
                        {loadingAction === "summary" ? (
                            <span className='flex items-center gap-2'>
                                <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin' />
                                Loading...
                            </span>
                        ) : (
                            "Summarize"
                        )}
                    </button>
                </div>
            </div>
        </div>

        {/* Explain Concept */}
        <div className='group p-5 bg-linear-to-br from-slate-50/50 to-white/50 rounded-xl border border-slate-200/60 hover:border-slate-300/60 hover:shadow-md transition-all duration-200'>
            <form onSubmit={handleExplainConcept}>
                <div className='flex items-center gap-2 mb-3'>
                    <div className='w-8 h-8 rounded-lg bg-linear-to-br from-amber-100 to-orange-100 flex items-center justify-center'>
                        <Lightbulb
                          className='w-4 h-4 text-amber-600'
                          strokeWidth={2}
                        />
                    </div>
                    <h4 className='font-semibold text-slate-900'>
                        Explain a Concept
                    </h4>
                </div>
                <p className='text-sm text-slate-600 leading-relaxed mb-4'>
                    Enter a topic or concept from the document to get a detailed explanation.
                </p>
                <div className='flex items-center gap-3'>
                    <input
                      type='text'
                      // value 属性用于设置输入框的值
                      value={concept}
                      // onChange 属性用于处理输入框的值变化
                      // e.target.value 是输入框的当前值
                      onChange={(e) => setConcept(e.target.value)}
                      placeholder="e.g., 'React Hooks' "
                      className='flex-1 h-12 px-4 border-2 border-slate-200 rounded-xl bg-slate-50/50 text-slate-900 placeholder-slate-400 text-sm font-medium transition-all duration-200 focus:outline-none focus:border-emerald-500 focus: bg-white focus: shadow-lg focus:shadow-emerald-500/10'
                      disabled={loadingAction === "explain"}
                    />
                    <button
                      // type='submit' 表示表单提交按钮
                      type='submit'
                      // 如果正在解释概念，则禁用按钮
                      disabled={loadingAction === "explain" || !concept.trim()}
                      className='cursor-pointer shrink-0 h-12 px-5 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-sm font-semibold rounded-xl transition-all duration-200 shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
                    >
                        {
                            loadingAction === "explain" ? (
                                <span className='flex items-center gap-2'>
                                    <div className='w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin'>
                                        Loading...
                                    </div>
                                </span>
                            ) : (
                                "Explain"
                            )
                        }
                    </button>
                </div>
            </form>
        </div>
    </div>

    {/* Result Modal */}
    <Modal
      isOpen={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      title={modalTitle}
    >
        <div className='max-h-[60vh] overflow-y-auto prose prose-sm max-w-none prose-slate'>
            {/* 渲染 Markdown 内容 */}
            <MarkdownRenderer 
              // content 属性用于设置 Markdown 内容
            content={modalContent}
            />
        </div>
    </Modal>
    </>
  )
}

export default AIAction