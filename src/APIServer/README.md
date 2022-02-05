
# Bitburner API Interface
 
The Bitburner API Interface allows the Bitburner game to communicate with any external IDE via a Websocket connection.

#### Why websocket?
Websocket allows for a two way communication platform between both the Bitburner game and the IDE over a single connection. Utilizing common communication convention, we can not only have the IDE push changes to the game but have changes to the in game code also push events to the IDE as well.

## Client-Server API Interface

The server depends on a communication contract between the Game Client and an IDE Websocket server.
  

### 1. All events either sent to or received from the server has the same shape

```js
{
	type:string,
	action:string,
	payload:object,
	token:string // Provided by the server upon authenticaton and sent with every client request
}
```

### 2. The entire event is stringified upon sending and must be parsed upon reciept.
The client and server are responsible for strigify'ing and parsing each message sent over the connection.
If you were to send an event to the client ensure you JSON.stringify it first.

```js
websocketConnection.send(
	JSON.stringify(
		{
			"type": "AUTH", 
			"action": "TOKEN", 
			"payload":"SOME_TOKEN"
		}
	)
);
```

### 3. It is the server's responsibility to authenticate and ensure clients are legitimate.

The Bitburner game operates as a Websocket client. Upon starting the API Server, the game attempts to connect to a server maintained by the IDE.

This allows not only the Steam/Electron version of the game to integrate with IDEs, **but also allows the web version** to do the same as well. 

Upon connecting, the Client will send a `AUTH/LOGIN` request which and expect an `AUTH/TOKEN` response containing a session token to pass with every request.

## API Documentation


### window._APIServer
To enable and configure the API Client in the game, open the debugger in the game and use these commands.

#### `_APIServer.enable([token?])`
- **token**: *string* *(optional)*
This is the API token to be sent on login requests to the API Server.  

`_APIServer.enable` starts the API Client if it has not started already. Once started, the API Client will attempt to reconnect every 2 seconds until a connection is made. If **autostart** is enabled, this is done automatically every time the game is started.

Any token provided is saved to the browser's local storage to be used on subsequent connections. Future calls to `_APIServer.enable` will then utilize the stored token.

---

#### `_APIServer.disable()`
`_APIServer.disable` stops any running API Clients or attempts to connect.

---
#### `_APIServer.debug([enable])`
- **enable**: *boolean* (default: false)

Enables or disables debugging logs for API Client in the browsers console.

---

#### `_APIServer.autostart([enable])`
- **enable**: *boolean* (default: false)
Enables or disables starting the Client once the game is started.

## API Event Documentation

### Client Messages

#### `CLIENT/AUTH/LOGIN`
This event is sent when the client initially connects to the Websocket server.
```js
{
	"type": "AUTH", 
	"action": "LOGIN", 
	"payload": {
		"token": string // Token used for authentication
	}
}
```
---
#### `CLIENT/FILE/INFO`
This event is sent when the client is sending information about a file to the Websocket server. The file was not necessarily changed.
```js
{
	"type": "FILE", 
	"action": "INFO",
	"token": string, // Session token
	"payload": {
			"timestamp":  number, // When the event was created
			"filename":  string, // Filename on the Bitburner server
			"hash"?:  hash, // Hash of the script, will not be retured after DELETE events
			"code"?: code, // Code of the script, will not be retured after DELETE events
			"ramUsage"?: number // Ram used by script (gb), will not be retured after DELETE events
	}
}
```
---
#### `CLIENT/FILE/PUSH`
This event is sent when the client is pushing new code due to a file being created or updated in the Bitburner.
```js
{
	"type": "FILE", 
	"action": "PUSH",
	"token": string, // Session token
	"payload": {
			"timestamp":  number, // When the event was created
			"filename":  string, // Filename on the Bitburner server
			"hash":  hash, // Hash of the script
			"code": code, // Code of the script
			"ramUsage": number // Ram used by script (gb)
	}
}
```
---

#### `CLIENT/FILE/DELETE`
This event is sent when the client is notifiying the server that a file has been deleted in Bitburner.
```js
{
	"type": "FILE", 
	"action": "DELETE",
	"token": string, // Session token
	"payload": {
			"timestamp":  number, // When the event was created
			"filename":  string, // Filename on the Bitburner server
	}
}
```

### Server Messages

#### `SERVER/FILE/LIST`
This event is sent to indicate to the Bitburner client that the server wants a list of all files on the client. The client will respond with a **`CLIENT/FILE/INFO`** message **for each file**.
```js
{
	"type": "FILE", 
	"action": "LIST",
	"token": string, // Session token
	"payload": {
	}
}
```
---
#### `SERVER/FILE/GET`
This event is sent to indicate to the Bitburner client that the server wants a information on a single file. The client will respond with a **`CLIENT/FILE/INFO`** message  for that particular file.
```js
{
	"type": "FILE", 
	"action": "GET",
	"token": string, // Session token
	"payload": {
		"filename":  string, // Filename on the Bitburner server
	}
}
```
---
#### `SERVER/FILE/PUSH`
This event is sent when the IDE server is pushing new code due to a file being created or updated. The client will respond with a **`CLIENT/FILE/INFO`** message.
```js
{
	"type": "FILE", 
	"action": "PUSH",
	"token": string, // Session token
	"payload": {
			"filename":  string, // Filename on the Bitburner server
			"code": code, // Code of the script
	}
}
```
---

#### `SERVER/FILE/DELETE`
This event is sent when the IDE server informing the client that file should be deleted. The client will respond with a **`CLIENT/FILE/INFO`** message.
```js
{
	"type": "FILE", 
	"action": "PUSH",
	"token": string, // Session token
	"payload": {
			"filename":  string, // Filename on the Bitburner server
	}
}
```
---
#### `SERVER/FILE/FLUSH`

The Bitburner client maintains a internal Queue of changes on the client that occurs while the client is online but not connected to the IDE Server.

The queue is not flushed of its events until this message is received by the client.
```js
{
	"type": "FILE", 
	"action": "FLUSH",
	"token": string, // Session token
	"payload": {
	}
}
```
---

