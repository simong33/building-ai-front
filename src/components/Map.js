import React, { useRef, useEffect } from "react";
import styled from 'styled-components';
import mapboxgl from "mapbox-gl"; // This is a dependency of react-map-gl even if you didn't explicitly install it

// eslint-disable-next-line import/no-webpack-loader-syntax
mapboxgl.workerClass = require("worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker").default;

const MapContainer = styled.div`
    width: calc(100vw - 600px);
    height: 100%;
`;

const API_URI = 'https://buildingai-ldy5lsc2fq-ew.a.run.app/';
const BAN_URI = 'https://api-adresse.data.gouv.fr'

const fetchKlass = async(buildingId) => {
    const response = await fetch(`${API_URI}/predict?building_id=${buildingId}`);
    const data = await response.json();
    return data;
}

const fetchAddress = async({ center }) => {
    const response = await fetch(`${BAN_URI}/reverse?lat=${center.lat}&lon=${center.lng}`);
    const data = await response.json();
    return data;
}

const measureLetterDistance = (a, b) => {
    const aCode = a.charCodeAt(0);
    const bCode = b.charCodeAt(0);
    return Math.abs(aCode - bCode);
}

mapboxgl.accessToken = 'pk.eyJ1IjoiY2l0eWFuZHlvdSIsImEiOiJja2NkYnowYmUwZDl5MnFwNmdhcmFmYzhkIn0.rU_jbm7G2Nh7DsSSDfkNlQ';

function Map({
    location,
    setAddress,
    setTrueKlass,
    setPredKlass,
    setLoading
}) {
    const mapContainerRef = useRef(null);

    useEffect(() => {
        const map = new mapboxgl.Map({
            container: mapContainerRef.current,
            style: 'mapbox://styles/cityandyou/cllnw5u9s002101pfgz6zcpvc',
            center: [2.3522219, 48.856614],
            zoom: 12
        });

        map.addControl(new mapboxgl.NavigationControl(), 'top-right');

        map.on('load', () => {
            const customLayerId = "dpe-initial-b2f15s"

            // Pointer
            map.on('mouseenter', customLayerId, () => {
                map.getCanvas().style.cursor = 'pointer';
                
            });
            map.on('mouseleave', customLayerId, () => {
                map.getCanvas().style.cursor = '';
            });
            
            const existingPaintProperties = map.getPaintProperty(customLayerId, 'fill-extrusion-color');
            map.on('click', (e) => {
                setPredKlass(null);
                const features = map.queryRenderedFeatures(e.point, {
                  layers: [customLayerId],
                });
                const existingLayerStyle = map.getLayer(customLayerId);
                const center = e.lngLat;
                fetchAddress({ center }).then((address) => {
                    setAddress(address.features[0].properties.label);
                    setLoading(true)
                });
        
                if (features.length > 0) {
                    const firstFeature = features[0];
                    const trueKlass = firstFeature.properties.class_conso_ener_mean;
                    console.log(`True class: ${trueKlass}`);
                    setTrueKlass(trueKlass);
                    const buildingId = firstFeature.properties.batiment_groupe_id;
                    fetchKlass(buildingId).then((klass) => {
                        let predKlass = klass.classe;
                        if (predKlass === undefined) {
                            console.log('No prediction available')
                            predKlass = 'E';
                        }
                        setPredKlass(predKlass);
                        setLoading(false)
                        console.log(`Predicted class: ${predKlass}`);
                        console.log(`Distance: ${measureLetterDistance(trueKlass, predKlass)}`)

                        firstFeature.properties.class_conso_ener_mean = predKlass;
                        console.log(firstFeature)

                        const colorExpression = [
                            'match',
                            ['get', 'class_conso_ener_mean'],
                            'A', '#4fab4f',
                            'B', '#19f020',
                            'C', '#defbd0',
                            'D', '#f7f7bb',
                            'E', '#f7e8c5',
                            'F', '#f3ba59',
                            'G', '#f8b5b5',
                            'N', '#d3cfcf',
                            '#ffffff'
                          ];

                        map.setPaintProperty(customLayerId, 'fill-extrusion-color', colorExpression);
                    });
                };
            });
          });

        if (location) {
            map.flyTo({ center: location, zoom: 18 });
        }

        return () => map.remove(); 
    }, [location]);

    return (
        <MapContainer ref={mapContainerRef}></MapContainer>
    );
}

export default Map;