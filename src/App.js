import React, { useState } from "react";
import styled from 'styled-components';
import Map from './components/Map';
import SearchBar from './components/SearchBar';
import Panel from './components/Panel';

function App() {
    const [location, setLocation] = useState(null);
    const [address, setAddress] = useState(null);
    const [trueKlass, setTrueKlass] = useState(null);
    const [predKlass, setPredKlass] = useState(null);
    const [loading, setLoading] = useState(false);

    return (
        <AppContainer>
            <Panel
                address={address}
                trueKlass={trueKlass}
                predKlass={predKlass}
                loading={loading}
            />
            <SearchBar onLocationSelect={setLocation} />
            <Map
                location={location}
                setAddress={setAddress}
                setTrueKlass={setTrueKlass}
                setPredKlass={setPredKlass}
                setLoading={setLoading}
            />
        </AppContainer>
    );
}

const AppContainer = styled.div`
    height: 100vh;
    width: 100vw;
    display: flex;
    overflow: hidden;
    font-family: 'Roboto', sans-serif;
    color: #1F2980;
`;

export default App;