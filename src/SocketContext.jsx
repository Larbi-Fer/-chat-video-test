/* eslint-disable no-restricted-globals */
import React, { createContext, useState, useRef, useEffect } from 'react'
import api from 'axios';

import { io } from "socket.io-client";
import Peer from 'simple-peer';

const SocketContext = createContext()
// const URL = "https://vd-chat.herokuapp.com"
const URL = "http://localhost:5000"

const socket = io(URL);

const ContextProvider = ({ children }) => {
    const [stream, setStream] = useState(null);
    const [me, setMe] = useState('');
    const [call, setCall] = useState({});
    const [callAccepted, setCallAccepted] = useState(false);
    const [notcallAccepted, setNotCallAccepted] = useState(false);
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [isVideo, setIsVideo] = useState(true);
    const [isVolume, setIsVolume] = useState(true);
    const [isScreenShare, setIsScreenShare] = useState(false);
    const [chatVl, setChatVl] = useState("");
    const [chat, setChat] = useState([]); // [{ text: string, isMe: bool }]
    const [chat2, setChat2] = useState({})

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef();

    const msgChat = useRef();

    const [isGetMedia, setIsGetMedia] = useState(false)

    // teleport
    const [isTr, setIsTr] = useState(false)
    const videoOptions = useRef();

    // icon setting
    const [teamIcon, setTeamIcon] = useState({})
    const [icon, setIcon] = useState({})

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        try {
            socket.on("me", id => setMe(id))
            if (location.pathname !== "/") return;
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

            setStream(currentStream);

            myVideo.current.srcObject = currentStream

            socket.on("calluser", ({ from, name: callerName, signal }) => {
                setCall({ isReceivedCall: true, from, name: callerName, signal })
            })

        } catch (error) {
            
        }
    }, [isGetMedia]);

    useEffect(() => { 
        if (stream)
            stream.getTracks().find(v => v.kind === "video").enabled = isVideo
            // stream.getVideoTracks()[0].enabled = isVideo
    }, [isVideo, stream])

    useEffect(() => { 
        if (stream)
            stream.getAudioTracks()[0].enabled = isVolume
    }, [isVolume, stream])

    useEffect(() => {
        if (chat2.text) {
            setChat([...chat, chat2])
            setChat2({})
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chat2])

    const sendMsg = () => {
        socket.on("sendvalue", data => {
            setChat2(data)
            setTimeout(() => msgChat.current.scrollTo({ top: msgChat.current.scrollTop + 10000, behavior: 'smooth' }), 1000);
        })
    }

    function answerCall() {
        setCallAccepted(true);

        const peer = new Peer({ initiator: false, trickle: false, stream });
        peer.on('signal', (data) => {
            socket.emit("answercall", { signal: data, to: call.from, name, from: me });
            console.log("data signal", data)
        });

        peer.on("stream", currentStream => {
            // currentStream.getAudioTracks()[0].stop()
            userVideo.current.srcObject = currentStream;
            console.log("current", currentStream)
        });

        sendMsg();

        peer.signal(call.signal);

        connectionRef.current = peer;
    }

    const notAnswer = () => {
        socket.emit("callNotAccepted", call)
        setCall({})
    }

    const callUser = (id) => {
        const peer = new Peer({ initiator: true, trickle: false, stream })

        peer.on('signal', (data) => {
            socket.emit("calluser", { userToCall: id, signalData: data, from: me, name })
            setCall({isOutgoingCall: true})
            console.log("peer.signal", data)
        });

        peer.on("stream", currentStream => {
            userVideo.current.srcObject = currentStream
            console.log("current call", currentStream)
        });

        socket.on("callaccepted", ({signal, name, from}) => {
            setCallAccepted(true);
            setCall({...call, isNotAccepted: false, name, from})
            sendMsg();
            peer.signal(signal)
            console.log("socket signal", signal)
        });

        socket.on("callNotAccepted", ({name}) => {
            setCallAccepted(false)
            setCall({ isNotAccepted: true, name })
            setTimeout(() => {
                setCallAccepted(null)
                setCall({})
            }, 2000);
        })

        connectionRef.current = peer
    }

    const leaveCall = () => {
        setCallEnded(true);
        connectionRef.current.destroy()

        /* setCall({});
        setCallAccepted(false);
        setCallEnded(false); */
        window.location.reload();

    }

    const sendVl = e => {
        e.preventDefault()
        if (!chatVl) return;
        socket.emit("sendvalue", { to: call.from, value: chatVl })
        setChat([...chat, { text: chatVl, isMe: true }])
        setChatVl('')
        setTimeout(() => msgChat.current.scrollTo({ top: msgChat.current.scrollTop + 10000, behavior: 'smooth' }), 1000);
        // console.log(msgChat.current.scrollTo, msgChat.current.offsetHeight)
    }

    const addTeam = async(dataSend = { teamName: String, teamIcon: String, name: String, icon: String }) => {
        console.log("open")
        const { data } = await api.post(URL + "/add-team", {...dataSend, id: me})
        if (data.code !== "ERROR") {
            localStorage.setItem(me, JSON.stringify({ name: dataSend.name, id: dataSend.id }))
            return {
                url: `${location.protocol}//${location.host}/team/${me}`,
                id: me
            }
        }
    }

    const handleChangeIcon = (isTeam) => async e => {
        const file = e.target.files[0];
        if (!file && isTeam) return setTeamIcon({})
        if (!file && !isTeam) return setIcon({})
        const base64 = await convertBase64(file)
        if (isTeam) setTeamIcon({base64, name: file.name})
        else setIcon({base64, name: file.name})
    }

    const convertBase64 = file => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file)

            fileReader.onload = () => resolve(fileReader.result)
            fileReader.onerror = err => reject(err)
        })
    }

    return (
        <SocketContext.Provider value={{
            call, callAccepted, callEnded, callUser, leaveCall, answerCall, notAnswer,
            myVideo, userVideo,
            stream, name, setName, me,
            isVideo ,setIsVideo ,isVolume ,setIsVolume, isScreenShare, setIsScreenShare,
            connectionRef,
            notcallAccepted, setNotCallAccepted,
            chatVl, setChatVl, sendVl, chat, setChat, msgChat,
            isTr, setIsTr, videoOptions,
            setIsGetMedia,
            addTeam,
            handleChangeIcon, teamIcon, icon
        }}>
            {children}
        </SocketContext.Provider>
    )
}

export { ContextProvider, SocketContext, socket, URL };