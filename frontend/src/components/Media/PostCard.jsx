import React, { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Heart, MessageCircle, User as UserIcon } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const PostCard = ({ post }) => {

    // 把当前用户信息存储在 currentUser 变量中，
    const { user: currentUser } = useAuth();
    // 使用 useNavigate 钩子，获取路由导航函数
    const navigate = useNavigate();
    // 使用 post.content 替换 # 开头的文本为 <span class="text-indigo-600">$1</span>
    const postWithHashtags = (post.content || '').replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>');
    // 点赞数组
    const [likes, setLikes] = useState(post.likes_count || []);
    // 评论数组
    const [comments, setComments] = useState(post.comments || []);
    // 是否显示评论
    const [showComments, setShowComments] = useState(false);
    // 评论/回复共用输入框
    const [commentInput, setCommentInput] = useState('');
    // 活跃的回复评论 ID
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
    // 回复目标
    const [replyTarget, setReplyTarget] = useState(null);
    // 评论加载状态
    const [commentLoading, setCommentLoading] = useState(false);
    // 回复加载状态
    const [replyLoading, setReplyLoading] = useState(false);
    // 点赞加载状态
    const [likeLoading, setLikeLoading] = useState(false);
    // 当前用户 ID
    const currentUserId = currentUser?._id || currentUser?.id;
    // 评论引用
    const commentsRef = useRef(null);

    // 组件挂载后，设置点赞数组
    useEffect(() => {
        setLikes(post.likes_count || []);
    }, [post.likes_count]);

    // 组件挂载后，设置评论数组
    useEffect(() => {
        setComments(post.comments || []);
    }, [post.comments]);


    // 评论打开时，点击评论区域外部关闭整个评论面板
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 评论面板没打开时不处理
            if (!showComments) return;

            // 点击评论按钮时，不触发外部关闭
            if (event.target.closest('[data-comments-toggle="true"]')) return;

            // 判断点击是否在评论区域外
            // commentsRef.current	评论区域 DOM
            // .contains(event.target)	点击是否在里面
            if (commentsRef.current && !commentsRef.current.contains(event.target)) {
                // 关闭整个评论面板
                setShowComments(false);
                // 关闭当前回复框
                setActiveReplyCommentId(null);
                // 清空回复目标用户
                setReplyTarget(null);
            }
        };

        // 添加点击外部事件监听,mouseDown 表示鼠标按下事件,handleClickOutside 表示点击外部事件处理函数
        document.addEventListener('mousedown', handleClickOutside);

        // 防止重复绑定
        // 防止内存泄漏
        // 防止事件叠加
        return () => {
            // 移除点击外部事件监听
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showComments]);


    // 点赞
    const handleLike = async () => {
        // 如果当前用户不存在或者点赞加载状态为 true，则返回; 防止疯狂点击
        if (!currentUserId || likeLoading) return;

        // 将当前用户 ID 转换为字符串
        const normalizedCurrentUserId = currentUserId.toString();
        // 保存旧数据
        const previousLikes = likes;
        // 判断当前用户有没有点过赞
        // .some() 只要有一个元素满足条件，就返回 true
        // id.toString() === normalizedCurrentUserId 表示当前用户 ID 是否等于点赞数组中的 ID
        // 如果满足条件，则返回 true，否则返回 false
        const hasLiked = previousLikes.some((id) => id.toString() === normalizedCurrentUserId);

        // 设置点赞加载状态为 true
        setLikeLoading(true);

        // 如果当前用户已经点赞，则从点赞数组中移除当前用户 ID
        setLikes(
            hasLiked
                // .filter() 方法创建一个新数组, 其包含通过所提供函数实现的测试的所有元素
                // 即过滤掉当前用户 ID
                ? previousLikes.filter((id) => id.toString() !== normalizedCurrentUserId)
                // 如果当前用户没有点赞，则将当前用户 ID 添加到点赞数组中
                : [...previousLikes, normalizedCurrentUserId]
        );

        // 发送请求
        try {
            // 发送请求，点赞
            // postId 是帖子 ID
            const res = await axiosInstance.post(API_PATHS.MEDIA.LIKE_POST, { postId: post._id });
            // 更新点赞数组
            setLikes(res?.data?.likes_count || []);
        } catch (err) {
            // 错误处理
            console.error(err);
            // 恢复旧数据
            setLikes(previousLikes);
        } finally {
            setLikeLoading(false);
        }
    };

    // 添加评论
    const handleAddComment = async () => {
        // 如果当前用户不存在或者评论输入框为空或者评论加载状态为 true，则返回; 防止疯狂点击
        if (!currentUserId || !commentInput.trim() || commentLoading) return;

        // 设置评论加载状态为 true
        setCommentLoading(true);

        // 发送请求
        try {
            // 发送请求，添加评论
            const res = await axiosInstance.post(API_PATHS.MEDIA.ADD_POST_COMMENT(post._id), {
                // commentInput 是评论输入框的值, 赋值给 content
                content: commentInput,
            });
            // 更新评论数组
            setComments(res?.data?.comments || []);
            // 清空评论输入框
            setCommentInput('');
            // 显示评论
            setShowComments(true);
        } catch (err) {
            console.error(err);
        } finally {
            setCommentLoading(false);
        }
    };

    // 添加回复
    const handleAddReply = async (commentId) => {
        // 如果当前用户不存在或者回复输入框为空或者回复加载状态为 true，则返回; 防止疯狂点击
        if (!currentUserId || !commentInput.trim() || replyLoading) return;
        // 设置回复加载状态为 true
        setReplyLoading(true);

        // 发送请求
        try {
            // 发送请求，添加回复
            const res = await axiosInstance.post(API_PATHS.MEDIA.ADD_COMMENT_REPLY(post._id, commentId), {
                // commentInput 是共用输入框的值, 赋值给 content
                content: commentInput,
                // replyToUsername 是回复目标用户, 赋值给 replyToUsername
                replyToUsername: replyTarget?.username || '',
            });
            // 更新评论数组
            setComments(res?.data?.comments || []);
            // 清空输入框
            setCommentInput('');
            // 清空回复目标用户
            setReplyTarget(null);
            // 清空活跃的回复评论 ID
            setActiveReplyCommentId(null);
            // 显示评论
            setShowComments(true);
        } catch (err) {
            console.error(err);
        } finally {
            setReplyLoading(false);
        }
    };

    // 提交评论
    const handleSubmitComment = () => {
        // 如果活跃的回复评论 ID 存在，则添加回复
        if (activeReplyCommentId) {
            // 添加回复
            handleAddReply(activeReplyCommentId);
            return;
        }

        // 添加评论
        handleAddComment();
    };

    // 如果帖子用户不存在，则返回 null
    if (!post.user) return null;

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div onClick={() => navigate('/media/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                {/* 如果帖子用户有头像，则显示头像 */}
                {post.user.profile_picture ? (
                    <img src={post.user.profile_picture} alt="" className='size-10 rounded-full shadow object-cover' />
                ) : (
                    <div className='size-10 rounded-full shadow bg-slate-100 flex items-center justify-center text-slate-400'>
                        <UserIcon className='size-5' />
                    </div>
                )}
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>
                            {post.user.username}
                        </span>
                        <BadgeCheck className='size-4 text-blue-500' />
                    </div>

                    <div className='text-sm text-gray-500'>
                        {moment(post.createdAt).fromNow()}
                    </div>
                </div>
            </div>
            {/* Post Content */}
            {
                post.content && (
                    <div className='text-gray-800 text-sm whitespace-pre-wrap' dangerouslySetInnerHTML={{ __html: postWithHashtags }} />
                )
            }

            {/* Images */}
            {/* grid grid-cols-2 gap-2 表示两列布局，gap-2 表示列间距为2 */}
            <div className='grid grid-cols-2 gap-2'>
                {
                    // 如果帖子有图片，则显示图片
                    (post.image_urls || []).map((img, index) => (
                        <div
                            key={index}
                            className={`h-48 overflow-hidden rounded-lg ${
                                (post.image_urls || []).length === 1 ? 'col-span-2' : ''
                            }`}
                        >
                            <img
                                src={img}
                                alt=""
                                className='block w-full h-full object-contain bg-gray-50/80'
                            />
                        </div>
                    ))
                }
            </div>

            {/* Like and Comment */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    {/* 如果当前用户存在并且点赞数组中包含当前用户 ID，则显示红色 */}
                    <Heart className={`size-4 cursor-pointer ${
                        currentUserId && likes.some((id) => id.toString() === currentUserId.toString()) && 'text-red-500 fill-red-500'
                    } `} onClick={handleLike} />
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <MessageCircle data-comments-toggle="true" className='size-4 cursor-pointer' onClick={() => setShowComments((prev) => !prev)} />
                    <span>{comments.length}</span>
                </div>
            </div>

            {/* 如果显示评论，则显示评论区域 */}
            {showComments && (
                // ref={commentsRef} 表示评论区域 DOM
                <div ref={commentsRef} className='pt-2 space-y-3'>
                    <div className='space-y-2 max-h-56 overflow-y-auto'>
                        {/* 如果评论数组长度大于0，则显示评论 */}
                        {comments.length > 0 ? (
                            // 遍历评论数组
                            comments.map((comment) => (
                                <div key={comment._id} className='space-y-2'>
                                    <div className='flex items-start gap-2'>
                                        <div className='text-xs font-medium text-gray-700 shrink-0 pt-2'>
                                            {comment.user?.username || 'user'} :
                                        </div>
                                        <div
                                            className='rounded-lg px-3 py-2 flex-1 bg-gray-50/80 cursor-pointer'
                                            // 点击评论时，设置活跃的回复评论 ID 和回复目标用户
                                            onClick={() => {
                                                // 如果活跃的回复评论 ID 等于评论 ID，则关闭回复框
                                                const isClosing = activeReplyCommentId === comment._id;
                                                // 如果关闭回复框，则清空活跃的回复评论 ID
                                                setActiveReplyCommentId(isClosing ? null : comment._id);
                                                // 如果关闭回复框，则清空回复目标用户
                                                setReplyTarget(
                                                    isClosing
                                                        ? null
                                                        : {
                                                            username: comment.user?.username || 'user',
                                                        }
                                                );
                                            }}
                                        >
                                            {/* 显示评论内容 */}
                                            <div className='text-sm text-gray-800 break-words'>{comment.content}</div>
                                        </div>
                                    </div>

                                    {/* 如果评论有回复，则显示回复 */}
                                    {(comment.replies || []).length > 0 && (
                                        // 遍历回复数组
                                        <div className='ml-10 space-y-2'>
                                            {comment.replies.map((reply) => (
                                                // 遍历回复数组
                                                <div key={reply._id} className='flex items-start gap-2'>
                                                    <div className='text-xs font-medium text-gray-700 shrink-0 pt-2'>
                                                        {reply.user?.username || 'user'} :
                                                    </div>
                                                    <div
                                                        className='rounded-lg px-3 py-2 flex-1 bg-gray-50/80 cursor-pointer'
                                                        onClick={() => {
                                                            // 设置活跃的回复评论 ID
                                                            setActiveReplyCommentId(comment._id);
                                                            // 设置回复目标用户
                                                            setReplyTarget({
                                                                username: reply.user?.username || 'user',
                                                            });
                                                        }}
                                                    >
                                                        {/* 显示回复内容 */}
                                                        <div className='text-sm text-gray-800 break-words'>
                                                            {/* 如果回复目标用户存在，则显示回复目标用户 */}
                                                            {reply.replyToUsername && (
                                                                <span className='text-indigo-600 mr-1'>@{reply.replyToUsername}</span>
                                                            )}
                                                            {/* 显示回复内容 */}
                                                            {reply.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                </div>
                            ))
                        ) : (
                            // 如果评论数组长度为0，则显示没有评论
                            <div className='text-sm text-gray-500'>No comments yet</div>
                        )}
                    </div>

                    <div className='flex items-center gap-2'>
                        <input
                            type='text'
                            value={commentInput}
                            onChange={(e) => setCommentInput(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    handleSubmitComment();
                                }
                            }}
                            // 如果活跃的回复评论 ID 存在，则显示回复目标用户
                            placeholder={activeReplyCommentId ? `Reply to ${replyTarget?.username || 'user'}...` : 'Add a comment...'}
                            className='flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none'
                        />
                        <button
                            type='button'
                            onClick={handleSubmitComment}
                            disabled={(activeReplyCommentId ? replyLoading : commentLoading) || !commentInput.trim()}
                            className='px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-50'
                        >
                            {/* 如果活跃的回复评论 ID 存在，则显示回复 */}
                            {activeReplyCommentId ? 'Reply' : 'Send'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;