import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { SocketContext } from '../SocketContext';
import { useParams } from 'react-router-dom';

import VideoPlayerTeam from './VideoPlayerTeam';
import { SocketContextT } from '../SocketContextT';
import PageNotFound from './PageNotFound';

const CallT = () => {
    const {videoOptions, isTr, icon, handleChangeIcon, loginInTeam: handelSubmit} = useContext(SocketContext)
    const { isTeamFoundF, isTeamFound, data } = useContext(SocketContextT)
    const [name, setName] = useState("");
    const params = useParams()

    useEffect(() => {
        isTeamFoundF(params.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    const move = e => {
        if (isTr) {
            videoOptions.current.style.left = e.clientX + "px"
            videoOptions.current.style.top = e.clientY + "px"
            videoOptions.current.style.transform = "translate(-96%, -9%)"
            // videoOptions.current.style.buttom = "auto"
        }
    }
    return (
        isTeamFound === null ? "Loading ..." : (isTeamFound ? (data ?
            <div onMouseMove={move}>
                <div className="nav">Team</div>
                <VideoPlayerTeam />
            </div>
        : <form className="add-form" onSubmit={handelSubmit}>
            <h2>Login</h2>
            <input type="text" placeholder="name" value={name} onChange={e => setName(e.target.value)} />
            <input type="file" id='icon-team' style={{display: "none"}}  onChange={handleChangeIcon(false)} placeholder='Icon Team' />
            <label className='input label-file' htmlFor="icon-team">{icon.name ? icon.name : "Select Icon"} {icon.name ? <img src={icon.base64} alt="" /> : ""} </label>
            <button>Login</button>
        </form>) : <PageNotFound />)
    )
}

export default CallT
