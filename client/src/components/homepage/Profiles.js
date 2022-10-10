import React from 'react';


const Profile = ({user}) => {
    return (
        <div className="swipeProfile">
            <img className='profileImg' src='/img/Wankul.png' alt='profile-img'/>
            <div className='userName'>{user.pseudo}</div>
            <div className="userAge">{user.age}</div>
            <div className='userDistance'>52 km</div>
            <div className='userTags'>
                {user.tags.map((t) => (
                    <div key={t}>
                        {t}
                    </div>
                ))}
            </div>
        </div>
    )
};

export default Profile;