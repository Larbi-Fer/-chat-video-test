/* eslint-disable no-restricted-globals */
import React, { createContext, useState, useRef, useEffect, useContext } from 'react'
import api from 'axios';

import { socket, SocketContext, URL } from "./SocketContext"
import Peer from 'simple-peer';
// import { io } from "socket.io-client";
// import Peer from 'simple-peer';

const SocketContextT = createContext()

const ContextProviderT = ({ children }) => {
    const { isVideo, isVolume: isAudeo, isScreenShare: isScreen } = useContext(SocketContext)
    const [stream, setStream] = useState(null);
    const [screen, setScreen] = useState(null);
    const [peers, setPeers] = useState([]);
    const [isStart, setIsStart] = useState(false);

    const [isTeamFound, setIsTeamFound] = useState(null);
    const [data, setData] = useState(null)

    const myVideo = useRef()
    const myScreen = useRef()
    const peersRef = useRef([])

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async() => {
        try {
            if (!isStart) return;
            const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })

            setStream(currentStream);

            myVideo.current.srcObject = currentStream

            socket.emit("joinRoom", { id: data.teamId, name: data.name, signal: currentStream })

            // socket.on("all users", ({ from, name: callerName, signal }) => {
            socket.on("all users", users => {
                const peers = []
                users.forEach(userId => {
                    const peer = createPeer(userId, socket.id, currentStream);
                    peersRef.current.push({
                        peerID: userId,
                        peer
                    });
                    peers.push(peer)
                })
                setPeers(peers)

                socket.on("user joined", payload => {
                    const peer = addPeer(payload.signal, payload.callerId, currentStream);
                    peersRef.current.push({ peerID: payload.callerId, peer });
                    setPeers(users => [...users, peer])
                })

                socket.on("receiving returned signal", payload => {
                    const item = peersRef.current.find(p => p.peerID === payload.id)
                    item.peer.signal(payload.signal)
                })
            })

        } catch (error) {
            console.log(error)
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isStart]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(async () => {
        if (isScreen) {
            const currentScreen = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen" } })
            setScreen(currentScreen);
            myScreen.current.srcObject = currentScreen
        } else setScreen(null)
    }, [isScreen]);

    useEffect(() => { 
        if (stream)
            stream.getTracks().find(v => v.kind === "video").enabled = isVideo
            // stream.getVideoTracks()[0].enabled = isVideo
    }, [isVideo, stream])

    useEffect(() => { 
        if (stream)
            stream.getAudioTracks()[0].enabled = isAudeo
    }, [isAudeo, stream])
    
    const isTeamFoundF = async id => {
        const { data } = await api.get(`${URL}/teams/${id}`)
        if (data.code === "NOTFOUND") setIsTeamFound(false)
        if (data.code === "FOUND") {
            const member = JSON.parse(localStorage.getItem(id))
            if (member) {
                const m = data.members.find(m => m.id === member.id)
                setData({...m, teamId: id})
                setIsStart(true);
            }
            setIsTeamFound(true)
        }
    }

    const createPeer = (userToSignal, callerId, stream) => {
        const peer = new Peer({ initiator: true, trickle: false, stream })
        peer.on("signal", signal => {
            socket.emit("sending signal", { userToSignal, callerId, signal })
        })
        return peer;
    }

    const addPeer = (incomingSignal, callerId, stream) => {
        const peer = new Peer({ initiator: false, trickle: false , stream})
        peer.on("signal", signal => {
            socket.emit("returning signal", { signal, callerId })
        });

        peer.signal(incomingSignal);

        return peer;
    }

    return (
        <SocketContextT.Provider value={{
            stream, screen, myVideo, myScreen, isScreen, peers,
            isTeamFound, setIsTeamFound, isTeamFoundF, data, setData
        }}>
            {children}
        </SocketContextT.Provider>
    )
}

export { ContextProviderT, SocketContextT };