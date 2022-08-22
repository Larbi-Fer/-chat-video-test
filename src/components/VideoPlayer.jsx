import React, { useContext, useEffect } from 'react'
// import { Grid, Typography, Paper, makeStyles } from '@material-ui/core'
import { SocketContext } from '../SocketContext'

const VideoPlayer = () => {
    const { name, callAccepted, myVideo, userVideo, callEnded, stream, call, setIsGetMedia } = useContext(SocketContext);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setIsGetMedia(true), []);

    return (
        <div className="videos">
            {/** Our own video */}
            {stream && (
                <div>
                    <h3>{name || "You"}</h3>
                    <video className={callAccepted && !callEnded ? "you-v" : ""} playsInline muted ref={myVideo} autoPlay></video>
                </div>
            )}
            {/** Users's video */}
            {callAccepted && !callEnded && (
                <div>
                    <h3>{call.name || "User"}</h3>
                    <video className="user-v" playsInline ref={userVideo} autoPlay></video>
                </div>
            )}
        </div>
    )
}

export default VideoPlayer
