import React from "react";
import styled from 'styled-components';
import { ThreeDots } from  'react-loader-spinner'

const PanelContainer = styled.div`
    width: 600px;
    height: 100%;
    background-color: #F9F4F1;
    padding: 20px;
    box-sizing: border-box;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
`;

const PanelSection = styled.div`
    margin-bottom: 20px;
    padding: 20px;
    border-radius: 6px;
    background-color: white;

    h2 {
        padding: 0;
        margin-top: 0;
    }
`;

const InnerPanel = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const LoaderSection = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
`;

const Letter = styled.div`
    font-size: 64px;
    font-weight: bold;
    color: white;
    background-color: ${props => ColorTable[props.letter]};
    height: 100px;
    width: 100px;
    border-radius: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ColorTable = {
    'A': '#4fab4f',
    'B': '#19f020',
    'C': '#defbd0',
    'D': '#f7f7bb',
    'E': '#f7e8c5',
    'F': '#f3ba59',
    'G': '#f8b5b5',
}

function Panel({
    address,
    trueKlass,
    predKlass,
    loading
}) {
    return (
        <PanelContainer>
            <h1>Building AI</h1>
            {
                address ? (
                    <PanelSection>
                        <h2>Address</h2>
                        <p>{address}</p>
                    </PanelSection>
                ) : (
                    <PanelSection>
                        <h2>Address</h2>
                        <p>Select a building</p>
                    </PanelSection>
                )
            }
            {
                trueKlass && (
                    <PanelSection>
                        <h2>Actual Class</h2>
                        <InnerPanel>
                            <Letter letter={trueKlass}>
                                {trueKlass}
                            </Letter>
                        </InnerPanel>
                    </PanelSection>
                )
            }
            {
                loading && predKlass === null && (
                    <LoaderSection>
                        <ThreeDots 
                            height="80" 
                            width="80" 
                            radius="9"
                            color="#1F2980" 
                            ariaLabel="three-dots-loading"
                            wrapperStyle={{}}
                            wrapperClassName=""
                            visible={true}
                        />
                    </LoaderSection>
                )
            }
            {
                predKlass && (
                    <PanelSection>
                        <h2>Predicted Class</h2>
                        <InnerPanel>
                            <Letter letter={predKlass}>
                                {predKlass}
                            </Letter>
                        </InnerPanel>
                    </PanelSection>
                )
            }
        </PanelContainer>
    )
}

export default Panel;