import React, { useContext } from 'react'
import { SocketContext } from '../SocketContext';

import VideoPlayer from './VideoPlayer';
import Notifications from './Notifications';
import Options from './Options';

const CallF = () => {
    const {videoOptions, isTr} = useContext(SocketContext)
    const move = e => {
        if (isTr) {
            videoOptions.current.style.left = e.clientX + "px"
            videoOptions.current.style.top = e.clientY + "px"
            videoOptions.current.style.transform = "translate(-96%, -9%)"
        }
    }
    return (
        <div onMouseMove={move}>
            <VideoPlayer />
            <Options>
                <Notifications />
            </Options>
        </div>
    )
}

export default CallF
