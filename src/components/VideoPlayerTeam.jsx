import React, { useContext, useEffect, useRef } from 'react'
import { Videocam, VideocamOff, Mic, MicOff } from '@material-ui/icons'
import { SocketContextT } from '../SocketContextT'
import {CallOptions} from './Options';

const VideoPlayerTeam = () => {
    const { name, myVideo, myScreen, isScreen, stream, peers } = useContext(SocketContextT);

    return (
        <div className="videos team">
            {/** Our own video */}
            {stream && (
                <div>
                    <h3>{name || "You"}</h3>
                    {isScreen ? <video playsInline muted ref={myScreen} autoPlay></video> : ""}
                    <video className={peers.length ? "you-v" : ""} playsInline muted ref={myVideo} autoPlay></video>
                    <CallOptions team />
                </div>
            )}
            {/** Users's video */}
            {peers.map((peer, index) => (
                <Video key={index} peer={peer} />
            )) }
        </div>
    )
}

const Video = ({peer}) => {
    const ref = useRef();

    useEffect(() => {
        peer.on("stream", stream => {
            ref.current.srcObject = stream;
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <video playsInline autoPlay ref={ref} />
            <div className="call-options user">
                <label>{ref.current && ref.current.srcObject && ref.current.srcObject.getVideoTracks()[0].enabled ? <Videocam fontSize="medium" /> : <VideocamOff fontSize="medium" />}</label>
                <label>{ref.current && ref.current.srcObject && ref.current.srcObject.getAudioTracks()[0].enabled ? <Mic fontSize="medium" /> : <MicOff fontSize="medium" />}</label>
                {/* <label>{ref.current.getAudioTracks()[0].enabled ? <ScreenShare fontSize="medium" /> : <StopScreenShare fontSize="medium" />}</label> */}
                {/* {callAccepted && !callEnded && <button type="button" className="btn-secondary" onClick={leaveCall}><CallEnd fontSize="medium" /></button>} */}
            </div>
        </div>
    )
}

export default VideoPlayerTeam
