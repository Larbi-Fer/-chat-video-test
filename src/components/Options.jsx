import React, { useContext, useState } from 'react'
// import { CopyToClipboard } from 'react-copy-clipboard';
// import { Assessment, Assignment, Phone, PhoneDisabled } from '@material-ui/icons'

import { SocketContext } from '../SocketContext';

const Options = ({ children }) => {
    const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } = useContext(SocketContext);
    const [idToCall, setIdToCall] = useState('')
    const [isCopied, setIsCopied] = useState(false)

    const handelCopy = () => {
        navigator.clipboard.writeText(me)
        setIsCopied(true)
        setTimeout(() => setIsCopied(false), 2000);
    }
    const handelPast = () => navigator.clipboard.readText().then(id => setIdToCall(id)).catch(() => {})

    return (
        <div>
            <form noValidate autoComplete="off" className="form">
                <div className="form-input">
                    <label>Account Info</label>
                    <input placeholder="Name" type="text"  value={name} onChange={e => setName(e.target.value)} />
                    <button type="button" onClick={handelCopy}> {isCopied ? "Copied" : "Copy Your ID"} </button>
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
                                <div style={{display: "flex"}}>
                                    <button style={{width: "100%"}} width type="button" className="secondary" onClick={() => callUser(idToCall)}>Call</button>
                                    <button style={{width: "100%"}} width type="button" className="secondary" onClick={handelPast}>Past</button>
                                </div>
                            </>
                        ) }
                </div>
            </form>
            {children}
        </div>
    )
}

export default Options
