import React, { useState, useEffect } from 'react';
import { assets, dummyPostsData } from '../../assets/assets';
import StoriesBar from '../../components/Media/StoriesBar';
import PostCard from '../../components/Media/PostCard';
import RecentMessage from '../../components/Media/RecentMessage';



const Home = () => {

    const [feeds, setFeeds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchFeeds = async () => {
        setFeeds(dummyPostsData);
        setLoading(false);
    }

    useEffect(() => {
        fetchFeeds();
    }, []);

    return (
        <div className='h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8'>
            {/* Stories and Post list */}
            <div>
                <StoriesBar />
                <div className='p-4 space-y-6'>
                    {
                        feeds.map((post) => (
                            <PostCard key={post._id} post={post} />
                        ))
                    }
                </div>
            </div>
            {/* Right Sidebar */}
            <div className='max-xl:hidden sticky top-0'>
                <div className='max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow'>
                    <h3 className='font-semibold text-slate-800'>Sponsored</h3>
                    <img src={assets.sponsored_img} alt="" className='w-75 h-50 rounded-md' />
                    <p className='text-slate-600'>
                        Email marketing
                    </p>
                    <p className='text-slate-400'>
                        Email marketing is the process of sending commercial messages, typically to a group of people using email, to promote or sell products or services.
                    </p>
                </div>
                <RecentMessage />
            </div>
        </div>
    )
};

export default Home;