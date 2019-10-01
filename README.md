# LMS-Connect

LMS Connect is a library which allow users to communicate and send messages between devices and content via web sockets

## Dependencies before using

- node js @ https://nodejs.org/en/ and download the LTS version
- switchboard library @ https://gitlab.com/coates-digital-productions/content-library

## How to use

To use this library, simply import where needed. <br/><br/>

> import variableName from "lms-connect"; <br/>
> {variableName}.setup("192.168.0.0");

eg. <br/>

> import connect from "lms-connect"; <br/>
> connect.setup("192.168.1.10");

## Available Methods

- **setup('ip')** <br />
  _This method is used to set the ip address, so we're able to send and receive messages._

  > by default, the library will try to retrieve an ip address from SB.Env.get('master-ip').
  > If this is unsuccessful the library will default to ip address set using this method<br /><br />
  > **example** <br />
  > `variable.setup('192.168.0.1')` <br /><br />
  > **NOTE:** a console log will display when connection has been established to the server <br />

- **send('label', data)** <br />
  _Used to send messages_

  > **label** - the label to send to <br />
  > **data** - message to transmit <br /><br />
  > **example** <br />
  > `variable.send('messenger', 'hi there, i am sending you a message')`

- **listener** <br />
  _Used for attaching/removing listeners._ <br />

  - **listener.add('label', callback)**

    > **label** - the label to listen to <br />
    > **callback** - callback function that will execute when a message has been transmitted to label, the callback function will return a variable as the first parameter as the message from the sender <br /><br />
    > **example** <br />

    ````variable.listener.add('me', function(messageFromSender){
        //do something with messageFromSender
    })```

    ````

  - **listener.remove('label', callback**optional**)**

    > **label** - label to remove listener <br />
    > **callback** **optional** - executes after listener has been removed <br /><br />
    > **example 1** <br />
    > `variable.listener.remove('me')` <br /><br />
    > **example 2** <br />

    ````variable.listener.remove('me', function(){
        // executes after listener has been removed
    })```
    ````

- **upsell** <br />
  _Used for upsell/suggestive sell events_ <br />

  - **upsell.listen(callback)**

    > **callback** - callback function will execute when a message has been transmitted to upsell event, the callback function will return a variable as the first parameter as the message from the sender <br /><br />
    > **example** <br />
    > `variable.upsell.listen(function(messageFromSender){

          //do something with msgFromSender

    })`

- **cod** <br />
  _Used for listening to the POS(point of service) key presses._ <br />

  - **cod.onConfirm(callback)**

    > **callback** - callback function will execute when pos state changes to confirm. The callback function will return an object as the first parameter that contains product, lane and pricing information <br /><br />
    > **example** <br />
    > `variable.cod.onConfirm(function(data){

          // data.items - products
          // data.totalPrice - pricing
          // data.lane - lane

    })`

  - **cod.onComplete(callback)**

    > **callback** - callback function will execute when pos state changes to complete.<br /><br />
    > **example** <br />
    > `variable.cod.onComplete(function(){

          // pos changed to complete state, do something

    })`

  - **cod.onUpdate(callback)**

    > **callback** - callback function will execute when pos state changes to update. The callback function will return an object as the first parameter that contains product, lane and pricing information <br /><br />
    > **example** <br />
    > `variable.cod.onUpdate(function(data){

          // data.items - products
          // data.totalPrice - pricing
          // data.lane - lane

    })`

  - **cod.onActive(callback) **in progress****

    > **callback** - callback function will execute when pos state changes to active.<br /><br />
    > **example** <br />
    > `variable.cod.onActive(function(){

          // pos changed to active state, do something

    })`

  - **cod.onPause(callback) **in progress****

    > **callback** - callback function will execute when pos state changes to paused.<br /><br />
    > **example** <br />
    > `variable.cod.onPause(function(){

          // pos changed to paused state, do something

    })`

  - **cod.onPosOpen(callback) **in progress****

    > **callback** - callback function will execute when pos state changes to open.<br /><br />
    > **example** <br />
    > `variable.cod.onPosOpen(function(){

          // pos changed to open state, do something

    })`

  - **cod.onPosClosed(callback) **in progress****

    > **callback** - callback function will execute when pos state changes to closed.<br /><br />
    > **example** <br />
    > `variable.cod.onPosClosed(function(){

          // pos changed to closed state, do something

    })`

    - **lms.cod.subscribe(callback)** - Preprocess Product object before resolved

    ```
    lms.cod.subscribe((item, data)=>{
    	if(data.$.whatever....)
    		item.price += 1;
    	else...
    	...
    	...
    	return item;
    })
    ```

## Roadmap \*\*in progress\*\*

- [x] implement pos states
- [ ] LPR implementation
- [ ] todo
