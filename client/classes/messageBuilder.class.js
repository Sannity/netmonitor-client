/**
 * Author: Austin Monson @ 2020
 * Description: Class to build a STANDARD JSON message to send to the server for easier processing.
 *  Message is outlines as follows:
 *      message:
 *          meta:
 *              type:
 *              requestTime:
 *              sessionID: //to reinitialize a past session
 *          data: [*data*]     
 */ 
class MessageBuilder{
    /**
     * Initialize the internal message
     */
    constructor(sessionID = undefined){
        this.message = {};
        this.message['meta'] = {};
        this.message['data'] = {};
        if(sessionID !== undefined){
            this.message['meta']['sessionID'] = sessionID;
        }
    }

    /**
     * Set the message type
     */
    setType(type){
        this.message['meta']['type'] = type;
    }

    /**
     * Set the data payload
     */
    setData(data){
        this.message['data'] = data;
    }

    /**
     * Build the message to send to the server
     */
    build(){
        if(this.message['meta']['type'] == undefined){
            return null;
        }
        this.message['meta']['requestTime'] = Date.now();
        return JSON.stringify(this.message);
    }
}

module.exports = MessageBuilder