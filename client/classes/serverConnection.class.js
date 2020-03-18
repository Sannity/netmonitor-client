/**
 * Author: Austin Monson @ 2020
 * Description: Class to handle and maintain connection to a websocket server
 */
const WebSocket = require('ws');
const MessageBuilder = require('./messageBuilder.class');

class ServerConnection{
    /**
     * Constructor
     */
    constructor(serverURI = "ws://127.0.0.1:8000"){
        this.serverURI = serverURI;
    }

    /**
     * Session Start
     */
    start(){
        this.ws = new WebSocket(this.serverURI);
        
        /**
         * Defines what the client will do upon connection with the Server
         */
        this.ws.on('open', () => {
            var connectMessageBuilder = new MessageBuilder(this.sessionID === undefined ? undefined : this.sessionID);
            connectMessageBuilder.setType('handshake');
            this.ws.send(connectMessageBuilder.build());
        });
        /**
         * Defines what the client will do upon recieving a PING from the server
         */
        this.ws.on('ping', (data) => {
            console.debug('Recieved KeepAlive: PING!');
            //this.ws.pong(); REMOVED, CLIENT WILL AUTO SEND PONG AS PER SPEC
        });

        /**
         * Defines what the client will do upon recieving a message from the server
         */
        this.ws.on('message', (data) => {
            console.debug(data);
        });

        /**
         * Defines what the client will do upon closing
         */
        this.ws.on('close', (code, reason) => {
            var self = this;
            console.debug("Socket Closed, Attempting reconnect in 2 seconds...");
            console.debug("Reason "+code+" : "+reason);
            setTimeout(function() {
                self.start();
            }, 2000);
        });

        /**
         * Defines what the client will do upon errored connection
         */
        this.ws.on('error', (error) => {
            console.error('Socket encountered error: ', error.message, 'Closing socket');
            this.ws.close(); //closing it will cause a restart, which is what we want...
        });
    }
}

module.exports = ServerConnection;