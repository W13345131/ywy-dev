import React from 'react'
// 把 Markdown 字符串转换为 React 组件
import ReactMarkdown from 'react-markdown'
// 把 Markdown 文本转换为 HTML
import remarkGfm from 'remark-gfm'
// 代码高亮
import SyntaxHighlighter from 'react-syntax-highlighter'
// 代码高亮样式
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/hljs'


// 这段代码实现的是一个 Markdown 渲染组件（MarkdownRenderer），常用于 AI 聊天 / 文档展示 / 博客内容。
// 它可以把 Markdown 文本渲染成带样式的 HTML，并且支持代码高亮。
function MarkdownRenderer({ content }) {
  return (
    <div className='text-neutral-700'>
        {/* 解析 markdown；启用 GitHub Markdown；自定义 HTML 元素样式 */}
        <ReactMarkdown 
          remarkPlugins={[remarkGfm]}
          components={{
            // 标题渲染
            // node	Markdown AST 节点
            // props	其他所有属性
            h1: ({ node, ...props}) => <h1 className='text-xl font-bold mt-4 mb-2' {...props} />,
            h2: ({ node, ...props}) => <h2 className='text-lg font-bold mt-4 mb-2' {...props} />,
            h3: ({ node, ...props}) => <h3 className='text-md font-bold mt-3 mb-2' {...props} />,
            h4: ({ node, ...props}) => <h4 className='text-sm font-bold mt-3 mb-1' {...props} />,
            p: ({ node, ...props}) => <p className='mb-2 leading-relaxed' {...props} />,
            a: ({ node, ...props}) => <a className='text-[#00d492] hover:underline' {...props} />,
            // 无序列表
            ul: ({ node, ...props}) => <ul className='list-disc list-inside mb-2 ml-4' {...props} />,
            // 有序列表
            ol: ({ node, ...props}) => <ol className='list-decimal list-inside mb-2 ml-4' {...props} />,
            // 列表项
            li: ({ node, ...props}) => <li className='mb-1' {...props} />,
            // 加粗
            strong: ({ node, ...props}) => <strong className='font-semibold' {...props} />,
            // 斜体
            em: ({ node, ...props}) => <em className='italic' {...props} />,
            // 引用
            blockquote: ({ node, ...props}) => <blockquote className='border-l-4 border-neutral-300 pl-4 italic text-neutral-600 my-4' {...props} />,
            // 代码
            code: ({ node, inline, className, children, ...props}) => {
                // 从 className 里提取代码块的语言名称（比如 javascript、python），以便给代码块做语法高亮
                // 如果 className 存在就用它，否则用空字符串
                // language-	匹配字符串 "language-"
                // (\w+)	捕获一个或多个字母/数字/下划线
                const match = /language-(\w+)/.exec(className || '');

                // 如果代码块不是内联的（比如代码块），并且有语言名称，就使用代码高亮组件
                return !inline && match ? (
                    // 代码高亮组件
                    <SyntaxHighlighter
                      // 代码高亮样式
                      style={dracula}
                      // 代码块的语言名称
                      language={match[1]}
                      // 代码块的标签
                      PreTag="div"
                      {...props}
                    >
                        // 清理代码块内容最后多出来的换行符，让代码显示更干净
                        // children 就是 代码块的实际内容
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                ) : (
                    // 内联代码
                    <code {...props} className='bg-neutral-100 p-1 rounded-md font-mono text-sm'>
                        {children}
                    </code>
                    );
                },
                // 自定义 <pre>，Markdown代码块容器
                pre: ({ node, ...props}) => <pre className='bg-neutral-800 text-white p-3 rounded-md overflow-x-auto font-mono text-sm my-4' {...props} />,
            }
        }
        >
            {content}
        </ReactMarkdown>
    </div>
  )
}


export default MarkdownRenderer