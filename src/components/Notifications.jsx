import React, { useContext } from 'react'
import { SocketContext } from '../SocketContext'

const Notifications = () => {
    const { answerCall, call, callAccepted, leaveCall } = useContext(SocketContext);
    /* const finalCall = () => {

    } */

    return (
        <div className={call.isReceivedCall && !callAccepted && "notification-bottom"}>
            {call.isReceivedCall && !callAccepted && (
                <div className="notification">
                    <div> <h2 style={{padding: "19px 0"}}>{call.name} is calling</h2> </div>
                    <div>
                        <button onClick={answerCall}>Answer</button>
                        <button onClick={leaveCall}>Cansel</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Notifications
