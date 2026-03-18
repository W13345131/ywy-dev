import React, { useState } from 'react';
import { BadgeCheck, Heart, MessageCircle, Share2 } from 'lucide-react';
import moment from 'moment';
import { dummyUserData } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';


const PostCard = ({ post }) => {


    const postWithHashtags = post.content.replace(/(#\w+)/g, '<span class="text-indigo-600">$1</span>');

    const [likes, setLikes] = useState(post.likes_count);

    const currentUser = dummyUserData;

    const navigate = useNavigate();

    const handleLike = () => {
    }



    return (
        <div className='bg-white rounded-xl shadow p-4 space-y-4 w-full max-w-2xl'>
            {/* User Info */}
            <div onClick={() => navigate('/media/profile/' + post.user._id)} className='inline-flex items-center gap-3 cursor-pointer'>
                <img src={post.user.profile_picture} alt="" className='size-10 rounded-full shadow' />
                <div>
                    <div className='flex items-center space-x-1'>
                        <span>
                            {post.user.full_name}
                        </span>
                        <BadgeCheck className='size-4 text-blue-500' />
                    </div>

                    <div className='text-sm text-gray-500'>
                        @{post.user.username} • {moment(post.createdAt).fromNow()}
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
                    post.image_urls.map((img, index) => (
                        <img src={img} alt="" key={index} 
                        className={`w-full h-48 object-cover rounded-lg ${
                        // 如果图片只有一张，则占满两列
                        post.image_urls.length === 1 && 'col-span-2 h-auto'}
                        `}/>
                    ))
                }
            </div>

            {/* Like and Comment */}
            <div className='flex items-center gap-4 text-gray-600 text-sm pt-2 border-t border-gray-300'>
                <div className='flex items-center gap-1'>
                    <Heart className={`size-4 cursor-pointer ${
                        likes.includes(currentUser._id) && 'text-red-500 fill-red-500'
                    } `} onClick={handleLike} />
                    <span>{likes.length}</span>
                </div>
                <div className='flex items-center gap-1'>
                    <MessageCircle className='size-4 cursor-pointer' />
                    <span>12</span>
                </div>
                <div className='flex items-center gap-1'>
                    <Share2 className='size-4 cursor-pointer' />
                    <span>7</span>
                </div>
            </div>
        </div>
    );
};

export default PostCard;