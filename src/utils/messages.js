const generateMessage = (text, username)=>{
  return {
    username : username,
    text : text,
    createdAt : new Date().getTime()
  };
};

const generateLocationMessage = (loc, username)=>{
  return {
    username : username,
    location : loc,
    createdAt : new Date().getTime()
  };
};

module.exports = {
  generateMessage,
  generateLocationMessage
};
