var serverConfig = {
    http: {
        port: 3003,
    },
    https: {
        port: 3004,
    },
    io: {
        port: 3005,
    },
    tcp: {
        host: '127.0.0.1',
        port: 3006,
    },
    udp: {
        host: '127.0.0.1',
        port: 3007,
        clientPort: 3008
    },
    websocket:{
        host: '127.0.0.1',
        port: 3009
    }

};

module.exports = serverConfig;