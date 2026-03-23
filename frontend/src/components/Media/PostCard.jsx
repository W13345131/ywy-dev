import React, { useEffect, useRef, useState } from 'react';
import { BadgeCheck, Heart, MessageCircle, User as UserIcon } from 'lucide-react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContent';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';

const PostCard = ({ post }) => {
    const { user: currentUser } = useAuth();
    const navigate = useNavigate();
    const postWithHashtags = (post.content || '').replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>');
    const [likes, setLikes] = useState(post.likes_count || []);
    const [comments, setComments] = useState(post.comments || []);
    const [showComments, setShowComments] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [replyInput, setReplyInput] = useState('');
    const [activeReplyCommentId, setActiveReplyCommentId] = useState(null);
    const [replyTarget, setReplyTarget] = useState(null);
    const [commentLoading, setCommentLoading] = useState(false);
    const [replyLoading, setReplyLoading] = useState(false);
    const [likeLoading, setLikeLoading] = useState(false);
    const currentUserId = currentUser?._id || currentUser?.id;
    const commentsRef = useRef(null);

    useEffect(() => {
        setLikes(post.likes_count || []);
    }, [post.likes_count]);

    useEffect(() => {
        setComments(post.comments || []);
    }, [post.comments]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (!activeReplyCommentId) return;

            if (commentsRef.current && !commentsRef.current.contains(event.target)) {
                setActiveReplyCommentId(null);
                setReplyInput('');
                setReplyTarget(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeReplyCommentId]);

    const handleLike = async () => {
        if (!currentUserId || likeLoading) return;

        const normalizedCurrentUserId = currentUserId.toString();
        const previousLikes = likes;
        const hasLiked = previousLikes.some((id) => id.toString() === normalizedCurrentUserId);

        setLikeLoading(true);
        setLikes(
            hasLiked
                ? previousLikes.filter((id) => id.toString() !== normalizedCurrentUserId)
                : [...previousLikes, normalizedCurrentUserId]
        );

        try {
            const res = await axiosInstance.post(API_PATHS.MEDIA.LIKE_POST, { postId: post._id });
            setLikes(res?.data?.likes_count || []);
        } catch (err) {
            console.error(err);
            setLikes(previousLikes);
        } finally {
            setLikeLoading(false);
        }
    };

    const handleAddComment = async () => {
        if (!currentUserId || !commentInput.trim() || commentLoading) return;

        setCommentLoading(true);
        try {
            const res = await axiosInstance.post(API_PATHS.MEDIA.ADD_POST_COMMENT(post._id), {
                content: commentInput,
            });
            setComments(res?.data?.comments || []);
            setCommentInput('');
            setShowComments(true);
        } catch (err) {
            console.error(err);
        } finally {
            setCommentLoading(false);
        }
    };

    const handleAddReply = async (commentId) => {
        if (!currentUserId || !replyInput.trim() || replyLoading) return;

        setReplyLoading(true);
        try {
            const res = await axiosInstance.post(API_PATHS.MEDIA.ADD_COMMENT_REPLY(post._id, commentId), {
                content: replyInput,
                replyToUsername: replyTarget?.username || '',
            });
            setComments(res?.data?.comments || []);
            setReplyInput('');
            setReplyTarget(null);
            setActiveReplyCommentId(null);
            setShowComments(true);
        } catch (err) {
            console.error(err);
        } finally {
            setReplyLoading(false);
        }
    };



    if (!post.user) return null;

    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div onClick={() => navigate('/media/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
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
                    <Heart className={`size-4 cursor-pointer ${
                        currentUserId && likes.some((id) => id.toString() === currentUserId.toString()) && 'text-red-500 fill-red-500'
                    } `} onClick={handleLike} />
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <MessageCircle className='size-4 cursor-pointer' onClick={() => setShowComments((prev) => !prev)} />
                    <span>{comments.length}</span>
                </div>
            </div>

            {showComments && (
                <div ref={commentsRef} className='pt-2 space-y-3'>
                    <div className='space-y-2 max-h-56 overflow-y-auto'>
                        {comments.length > 0 ? (
                            comments.map((comment) => (
                                <div key={comment._id} className='space-y-2'>
                                    <div className='flex items-start gap-2'>
                                        <div className='text-xs font-medium text-gray-700 shrink-0 pt-2'>
                                            {comment.user?.username || 'user'} :
                                        </div>
                                        <div
                                            className='rounded-lg px-3 py-2 flex-1 bg-gray-50/80 cursor-pointer'
                                            onClick={() => {
                                                const isClosing = activeReplyCommentId === comment._id;
                                                setActiveReplyCommentId(isClosing ? null : comment._id);
                                                setReplyInput('');
                                                setReplyTarget(
                                                    isClosing
                                                        ? null
                                                        : {
                                                            username: comment.user?.username || 'user',
                                                        }
                                                );
                                            }}
                                        >
                                            <div className='text-sm text-gray-800 break-words'>{comment.content}</div>
                                        </div>
                                    </div>

                                    {(comment.replies || []).length > 0 && (
                                        <div className='ml-10 space-y-2'>
                                            {comment.replies.map((reply) => (
                                                <div key={reply._id} className='flex items-start gap-2'>
                                                    <div className='text-xs font-medium text-gray-700 shrink-0 pt-2'>
                                                        {reply.user?.username || 'user'} :
                                                    </div>
                                                    <div
                                                        className='rounded-lg px-3 py-2 flex-1 bg-gray-50/80 cursor-pointer'
                                                        onClick={() => {
                                                            setActiveReplyCommentId(comment._id);
                                                            setReplyInput('');
                                                            setReplyTarget({
                                                                username: reply.user?.username || 'user',
                                                            });
                                                        }}
                                                    >
                                                        <div className='text-sm text-gray-800 break-words'>
                                                            {reply.replyToUsername && (
                                                                <span className='text-indigo-600 mr-1'>@{reply.replyToUsername}</span>
                                                            )}
                                                            {reply.content}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    {activeReplyCommentId === comment._id && (
                                        <div className='ml-10 flex items-center gap-2'>
                                            <input
                                                type='text'
                                                value={replyInput}
                                                onChange={(e) => setReplyInput(e.target.value)}
                                                onKeyDown={(e) => {
                                                    if (e.key === 'Enter') {
                                                        handleAddReply(comment._id);
                                                    }
                                                }}
                                                placeholder={`Reply to ${replyTarget?.username || comment.user?.username || 'user'}...`}
                                                className='flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none'
                                            />
                                            <button
                                                type='button'
                                                onClick={() => handleAddReply(comment._id)}
                                                disabled={replyLoading || !replyInput.trim()}
                                                className='px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-50'
                                            >
                                                Reply
                                            </button>
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
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
                                    handleAddComment();
                                }
                            }}
                            placeholder='Add a comment...'
                            className='flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none'
                        />
                        <button
                            type='button'
                            onClick={handleAddComment}
                            disabled={commentLoading || !commentInput.trim()}
                            className='px-3 py-2 text-sm bg-indigo-600 text-white rounded-lg disabled:opacity-50'
                        >
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;