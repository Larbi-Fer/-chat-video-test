import React, { useContext, useState } from 'react'
import { CopyToClipboard } from 'react-copy-clipboard';
// import { Assessment, Assignment, Phone, PhoneDisabled } from '@material-ui/icons'

import { SocketContext } from '../SocketContext';

const Options = ({ children }) => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('')

    return (
        <div>
            <form noValidate autoComplete="off" className="form">
                <div className="form-input">
                    <label>Account Info</label>
                    <input placeholder="Name" type="text"  value={name} onChange={e => setName(e.target.value)} />
                    <button type="button"> Copy Your ID </button>
                    {/* <CopyToClipboard text={"me"}>
                    </CopyToClipboard> */}
                </div>
                <div className="form-input">
                    { callAccepted && !callEnded ? (
                            <button type="button" className="btn-secondary" onClick={leaveCall}>Hang Up</button>
                        ) : (
                            <>
                                <input placeholder="ID to call" type="text"  value={idToCall} onChange={e => setIdToCall(e.target.value)} />
                                <label>Make a call</label>
                                <button type="button" className="secondary" onClick={() => callUser(idToCall)}>Call</button>
                            </>
                        ) }
                </div>
            </form>
            <h4>{me}</h4>
            {children}
        </div>
    )
}

export default Options
