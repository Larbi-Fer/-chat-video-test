import React, { useContext } from 'react'
import { SocketContext } from '../SocketContext'

const Notifications = () => {
    const { answerCall, call, callAccepted } = useContext(SocketContext);

    return (
        <div style={{display: "flex", justifyContent: "center",}}>
            {call.isReceivedCall && !callAccepted && (
                <div style={{display: 'flex', justifyContent: "canter"}}>
                    <h2 style={{padding: "19px 0"}}>{call.name} is calling</h2>
                    <button onClick={answerCall}>Answer</button>
                </div>
            )}
        </div>
    )
}

export default Notifications
