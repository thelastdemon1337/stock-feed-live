import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const StockPriceChart = () => {
    const [socket, setSocket] = useState(null);
    const [stockPrice, setStockPrice] = useState(null);

    useEffect(() => {
        // Connect to the server
        const socketConnection = io.connect('http://localhost:9000');

        // Set up event listeners
        socketConnection.on('initialStockPrice', ({ price }) => {
            setStockPrice(price);
        });

        socketConnection.on('stockPriceUpdate', ({ price }) => {
            setStockPrice(price);
        });

        // Store the socket connection
        setSocket(socketConnection);

        // Clean up on unmount
        return () => {
            if (socketConnection) {
                socketConnection.disconnect();
            }
        };
    }, []);

    return (
        <div>
            <h2>Stock Price</h2>
            {stockPrice !== null ? (
                <p>Current Price: ${stockPrice}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default StockPriceChart;
