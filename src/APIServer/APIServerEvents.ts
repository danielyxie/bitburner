interface WebsocketMessageTypes {
  [type:string]: {
      [type:string]: string; 
  };
}

const CLIENT_EVENTS:WebsocketMessageTypes = {
  'AUTH': {
    'LOGIN': 'CLIENT/AUTH/LOGIN', // Login Event initially sent
  },
  'FILE': { 
    'INFO': 'CLIENT/FILE/INFO',
    'DELETE': 'CLIENT/FILE/DELETE',
    'PUSH': 'CLIENT/FILE/PUSH',
  }
}

const SERVER_EVENTS:WebsocketMessageTypes = {
  'AUTH': {
    'TOKEN': 'SERVER/AUTH/TOKEN', // Server event providing a session token
  },
  'FILE': { 
    'LIST': 'SERVER/FILE/LIST',
    'GET': 'SERVER/FILE/GET',
    'DELETE': 'SERVER/FILE/DELETE',
    'PUSH': 'SERVER/FILE/PUSH',
    'FLUSH': 'SERVER/FILE/FLUSH',
  }
}
export {
  CLIENT_EVENTS,
  SERVER_EVENTS
}