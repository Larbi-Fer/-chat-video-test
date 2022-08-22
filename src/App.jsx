import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ContextProviderT } from "./SocketContextT"

import CallF from "./components/CallF"
import CallT from "./components/CallT"
import AddTeam from './components/AddTeam';
import PageNotFound from './components/PageNotFound'

function App() {
    // const classes = useStyle();
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" exact element={<CallF />} />
                <Route path="/team/:id" exact element={<ContextProviderT><CallT /></ContextProviderT>} />
                <Route path="/add-team" exact element={<AddTeam />} />
                <Route
                    path="*"
                    element={<PageNotFound />}
                    />
            </Routes>
        </BrowserRouter>
    )
}

export default App
