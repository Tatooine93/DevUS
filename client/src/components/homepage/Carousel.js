import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Carousel = ({children}) => {

const [currentIndex, setCurrentIndex] = useState(0);
const [length, setLength] = useState(children.length);
const userData = useSelector((state) => state.userReducer);

useEffect(() => {
    setLength(children.length) // Set the length to match current children from props
    
}, [children]);

const next = () => {
    if (currentIndex < (length - 1)) {
        setCurrentIndex(prevState => prevState + 1);
    }

    console.log(children[currentIndex].key);
    
    if (userData.likes.includes(children[currentIndex].key)){
        const match = async () => {

            try {
                await axios({
                    method: "patch",
                    url: `${process.env.REACT_APP_API_URL}api/user/match/${userData._id}`,
                    data: {
                        idToMatch: children[currentIndex].key,
                    }
                });

                await axios({
                    method: "post",
                    url: `${process.env.REACT_APP_API_URL}api/conversation/`,
                    data: {
                        senderId: userData._id,
                        receiverId: children[currentIndex].key,
                    }
                });

            }
            catch(err) {
                console.log(err);
            }
        };
        match();
    }

    else {

        const like = async () => {
            try {
                await axios({
                    method: "patch",
                    url: `${process.env.REACT_APP_API_URL}api/user/like/${userData._id}`,
                    data: {
                        idToLike: children[currentIndex].key,
                    }
                });

            }
            catch(err) {
                console.log(err);
            }
        };
        like();
    }
} 

const prev = () => {
    /* if (currentIndex > 0) {
        setCurrentIndex(prevState => prevState - 1) //to move the profile to the left
    } */ 
    if (currentIndex < (length - 1)) {
        setCurrentIndex(prevState => prevState + 1);
    }
}

const [touchPosition, setTouchPosition] = useState(null)

const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX
    setTouchPosition(touchDown)
}

const handleTouchMove = (e) => {
    const touchDown = touchPosition

    if(touchDown === null) {
        return
    }

    const currentTouch = e.touches[0].clientX
    const diff = touchDown - currentTouch

    if (diff > 8) {  //determine the speed of swipe
        next()
    }

    if (diff < -8) {
        prev()
    }

    setTouchPosition(null)
}


    return (
        <div className="carousel-container">
            <div className="carousel-wrapper">

                <button onClick={prev} className="left-arrow">
                    &#x274C;
                </button>

                <div className="carousel-content-wrapper" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove}>
                    <div className="carousel-content" style={{ transform: `translateX(-${currentIndex * 100}%)` }}>
                        {children}
                    </div>
                </div>

                <button onClick={next} className="right-arrow">
                    &#x2713;
                </button>

            </div>
        </div>
    )
};

export default Carousel;