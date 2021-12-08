import React from 'react'
import { Typography, AppBar, makeStyles } from '@material-ui/core'

import VideoPlayer from './components/VideoPlayer';
import Notifications from './components/Notifications';
import Options from './components/Options';

/* const useStyle = makeStyles(theme => ({
    appBar: {
        borderRadius: 15,
        margin: "30px 100px",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "600px",
        border: "2px solid black"
    },
    [theme.breakpoints.down('xs')]: {
        width: "90%"
    },
    image: { marginLeft: "15px" },
    wrapper: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%"
    }
})) */

function App() {
    // const classes = useStyle();
    return (
        <div /*className={classes.wrapper}*/>
        {/* <AppBar className={classes.appBar} position="static">
            <Typography variant="h2" align="center">Video Chat</Typography> */}
                <VideoPlayer />
                <Options>
                    <Notifications />
                </Options>
                {/* </AppBar> */}
            </div>
    )
}

export default App
