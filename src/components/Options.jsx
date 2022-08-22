import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { CallEnd, Assignment, AssignmentTurnedIn, Phone, GroupAdd, Videocam, VideocamOff, Mic, MicOff, Send, Chat } from '@material-ui/icons'

import { SocketContext } from '../SocketContext';

const Options = ({ children }) => {
    const { me, callAccepted, name, setName, callEnded, callUser, chatVl, setChatVl, sendVl, chat, msgChat } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('')
    const [isCopied, setIsCopied] = useState(false)
    const [chatActive, setChatActive] = useState(false)

    const navigate = useNavigate()

    const handelCopy = () => {
        navigator.clipboard.writeText(me)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000);
    }
    const handelPast = () => navigator.clipboard.readText().then(id => setIdToCall(id)).catch(() => {})

    useEffect(() => {
        if (callAccepted && !callEnded) document.body.style.marginRight = "320px"
        else document.body.style.marginRight = "0"
    }, [callAccepted, callEnded])
    /* useEffect(() => {
        document.body.addEventListener("mousemove", e => {
            console.log(e.clientX, e.clientY)
            console.log(e.movementX, e.movementY)
            console.log(e.offsetX, e.screenX, e.offsetY, e.screenY)
        })
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); */


    return (
        <div>
            <form onSubmit={e => e.preventDefault()} noValidate autoComplete="off" className="form">
                {callAccepted && !callEnded && <div className="chat-icon" onClick={() => setChatActive(!chatActive)}> <Chat fontSize="small" /> </div>}
                <div className="form-input">
                    <label>Account Info</label>
                    <input placeholder="Name" type="text"  value={name} onChange={e => setName(e.target.value)} />
                    <button type="button" onClick={handelCopy}> {isCopied ? <AssignmentTurnedIn fontSize="medium" /> : <Assignment fontSize="medium" />} </button>
                </div>
                <div className={"form-input" + (callAccepted && !callEnded ? " msg-chat" : "") + (chatActive ? " active" : "")}>
                    {callAccepted && !callEnded ? (
                        <div className="chat">
                            <h1>Chat</h1>
                            <div className="chat-words" ref={msgChat}>
                                {chat.map(data => (
                                    <div className={data.isMe ? "me" : "user"}><div>{data.text}</div></div>
                                ))}
                            </div>
                            <div onSubmit={sendVl} className="forminput">
                                <input type="text" value={chatVl} onChange={e => setChatVl(e.target.value)} placeholder='message ...' />
                                <button onClick={sendVl} disable={!chatVl}><Send fontSize="small" /></button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <input placeholder="ID to call" type="text"  value={idToCall} onChange={e => setIdToCall(e.target.value)} />
                            <label>Make a call</label>
                            <div style={{display: "flex"}}>
                                <button style={{width: "100%"}} type="button" onClick={() => callUser(idToCall)}><Phone fontSize="medium"/></button>
                                <button style={{width: "100%"}} type="button" onClick={handelPast}>Past</button>
                                <button style={{width: "100%"}} type="button" onClick={() => navigate("/add-team")} title="Add Team"><GroupAdd fontSize="medium" /></button>
                            </div>
                        </>
                    )}
                </div>

                <CallOptions />
            </form>
            {children}
        </div>
    )
}

export const CallOptions = ({ team }) => {
    const {setIsVideo, setIsVolume, isVideo, isVolume, leaveCall, setIsTr, videoOptions, callAccepted, callEnded} = useContext(SocketContext);
    const size = team ? "small" : "medium"
    return (
        <div className={"call-options" + (team ? " me" : "")} ref={videoOptions}>
            <button type="button" onClick={() => setIsVideo(!isVideo)}>{isVideo ? <Videocam fontSize={size} /> : <VideocamOff fontSize={size} />}</button>
            <button type="button" onClick={() => setIsVolume(!isVolume)}>{isVolume ? <Mic fontSize={size} /> : <MicOff fontSize={size} />}</button>
            {/* <button type="button" onClick={() => setIsScreenShare(!isScreenShare)}>{isScreenShare ? <ScreenShare fontSize={size} /> : <StopScreenShare fontSize={size} />}</button> */}
            {!team && (callAccepted && !callEnded && <button type="button" className="btn-secondary" onClick={leaveCall}><CallEnd fontSize={size} /></button>)}
            {!team && <div onMouseDown={() => setIsTr(true)} onMouseUp={() => setIsTr(false)}className="trans"></div>}
</div>
)}

export default Options
