import React, { useState, useEffect } from "react";
import styled from 'styled-components';
import MapboxClient from "@mapbox/mapbox-sdk/services/geocoding";
const geocodingClient = MapboxClient({ accessToken: 'pk.eyJ1IjoiY2l0eWFuZHlvdSIsImEiOiJja2NkYnowYmUwZDl5MnFwNmdhcmFmYzhkIn0.rU_jbm7G2Nh7DsSSDfkNlQ'});

function SearchBar({ onLocationSelect }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const handleSearch = async () => {
        const response = await geocodingClient.forwardGeocode({
            query,
            autocomplete: true,
            limit: 5,
            bbox: [2.2241006,48.815573,2.4699099,48.9021449]
        }).send();

        setSuggestions(response.body.features);
    };

    useEffect(() => {
        if (query.length === 0) {
            setSuggestions([]);
        } else {
            handleSearch();
        }
    }, [query]);

    return (
        <SearchBarContainer>
            <Input 
                value={query} 
                onChange={e => {
                    setQuery(e.target.value)
                    setShowSuggestions(true)
                }} 
                placeholder="Search for an address in Paris" 
            />
            {showSuggestions && suggestions.length > 0 && (
                <SuggestionsList>
                    {suggestions.map(suggestion => (
                        <SuggestionItem 
                            key={suggestion.id}
                            onClick={() => {
                                setShowSuggestions(false)
                                onLocationSelect(suggestion.geometry.coordinates)
                                setQuery(suggestion.place_name)
                            }}
                        >
                            {suggestion.place_name}
                        </SuggestionItem>
                    ))}
                </SuggestionsList>
            )}
        </SearchBarContainer>
    );
}

const SearchBarContainer = styled.div`
    position: absolute;
    top: 30px;
    left: calc(50% + 300px);
    transform: translateX(-50%);
    z-index: 10;
    width: 100%;
    max-width: 800px;
`;

const Input = styled.input`
    padding: 10px 24px;
    border: none;
    border-radius: 34px;
    outline: none;
    width: 100%;
    font-size: 24px;
    transition: width 0.4s;
    height: 50px;
    font-family: 'Roboto', sans-serif;
`;

const Button = styled.button`
    padding: 10px 15px;
    border: none;
    background-color: #4CAF50;
    color: white;
    border-radius: 25px;
    margin-left: 10px;
    cursor: pointer;
    transition: background-color 0.3s;
    &:hover {
        background-color: #45a049;
    }
`;

const SuggestionsList = styled.ul`
    list-style: none;
    margin-top: 10px;
    background-color: rgba(255, 255, 255, 0.9);
    border-radius: 5px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    max-height: 150px;
    overflow-y: auto;
`;

const SuggestionItem = styled.li`
    padding: 10px;
    cursor: pointer;
    &:hover {
        background-color: rgba(0, 0, 0, 0.05);
    }
`;


export default SearchBar;
