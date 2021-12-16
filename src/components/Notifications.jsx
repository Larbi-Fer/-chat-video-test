import React, { useContext } from 'react'
import { PhoneEnabled, PhoneDisabled } from "@material-ui/icons"
import { SocketContext } from '../SocketContext'

const Notifications = () => {
    const { answerCall, call, callAccepted, notAnswer } = useContext(SocketContext);
    /* const finalCall = () => {

    } */

    return (
        <div className={((call.isReceivedCall && !callAccepted) || (call.isOutgoingCall || call.isNotAccepted)) && "notification-bottom"}>
            {call.isReceivedCall && !callAccepted && (
                <div className="notification">
                    <div> <h2 style={{padding: "19px 0"}}>{call.name} is calling</h2> </div>
                    <div>
                        <button onClick={answerCall} className="btn-primary"><PhoneEnabled fontSize="medium" /></button>
                        <button onClick={notAnswer} className="btn-secondary"><PhoneDisabled fontSize="medium" /></button>
                    </div>
                </div>
            )}
            { call.isOutgoingCall ? (
                <div className="notification">
                    <div> <h2 style={{padding: "19px 0"}}>calling ...</h2> </div>
                </div>
            ) : (call.isNotAccepted && (
                <div className="notification">
                    <div> <h2 style={{padding: "19px 0"}}>{call.name} not Accepted.</h2> </div>
                </div>
            )) }
        </div>
    )
}

export default Notifications
