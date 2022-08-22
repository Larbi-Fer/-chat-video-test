import React, { useContext, useEffect, useState } from 'react'
import { SocketContext } from '../SocketContext'

const AddTeam = () => {
    const { setIsGetMedia, addTeam, handleChangeIcon, teamIcon, icon } = useContext(SocketContext);
    const [teamName, setTeamName] = useState("")
    const [name, setName] = useState("")
    const [dataTeam, setDataTeam] = useState(null);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => setIsGetMedia(false), [])

    const handelSubmit = async e => {
        e.preventDefault()
        if (!name || !teamName) return;
        const data = await addTeam({ name, icon: icon, teamIcon: teamIcon, teamName })
        setDataTeam(data)
    }

    return (
        <form className='add-form' onSubmit={handelSubmit}>

            {!dataTeam ? (<React.StrictMode><h2>Setting The Team</h2>
            <div>
                <div>
                    <input type="text" value={teamName} onChange={e => setTeamName(e.target.value)} placeholder='Team Name' />
                    <input type="file" id='icon-team' style={{display: "none"}}  onChange={handleChangeIcon(true)} placeholder='Icon Team' />
                    <label className='input label-file' htmlFor="icon-team">{teamIcon.base64 ? teamIcon.name : "Select Icon"}</label>
                </div>
                <div><img src={teamIcon.base64} alt='' /></div>
            </div>

            <h2>Setting For You</h2>
            <div>
                <div>
                    <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder='Name' />
                    <input type="file" id='icon-user' style={{display: "none"}} onChange={handleChangeIcon(false)} placeholder='Icon' />
                    <label className='input label-file' htmlFor="icon-user">{icon.base64 ? icon.name : "Select Icon"}</label>
                </div>
                <div><img src={icon.base64} alt="" /></div>
            </div>

            <button>Add</button></React.StrictMode>) : (
                <>
                    <h2>Team Added</h2>
                    <label>Team URL : </label> <a href={dataTeam.url}>{dataTeam.url}</a> <br />
                    <label>Team ID : {dataTeam.id}</label>
                </>
            )}
        </form>
    )
}

export default AddTeam
