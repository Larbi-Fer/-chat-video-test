import React, { useContext } from 'react'

import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Options from './components/Options';

import { SocketContext } from "./SocketContext";

function App() {
    // const classes = useStyle();
    return (
        /* <BrowserRouter>
            <Switch>
                <Route path="/" exact component={CallF} />
            </Switch>
        </BrowserRouter> */
        <CallF />
    )
}

const CallF = () => {
    const {videoOptions, isTr} = useContext(SocketContext)
    const move = e => {
        if (isTr) {
            videoOptions.current.style.left = e.clientX + "px"
            videoOptions.current.style.top = e.clientY + "px"
            videoOptions.current.style.transform = "translate(-96%, -9%)"
        }
    }
    return (
        <div onMouseMove={move}>
            <VideoPlayer />
            <Options>
                <Notifications />
            </Options>
        </div>
    )
}

export default App
