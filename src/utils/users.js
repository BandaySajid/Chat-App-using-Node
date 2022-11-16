const users = [];

const addUser = ({id, username, room})=>{
  //clear the data

  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();

  // validate the data

  if(!username || !room){
    return {
      error : 'username and room are required!'
    }
  }

  // check for existing user

  const existingUser = users.find((user)=>{
    return user.username === username && user.room === room;
  });

  //validate the username
  if(existingUser){
    return {
      error : 'username is already taken'
    }
  }

  const user = {id, username, room};
  users.push(user);
  return {user}; //returning user object
};

const removeUser = (id)=>{
  const index = users.findIndex((user)=>{
    return user.id === id;
  });
  if(index !== -1){
    return users.splice(index, 1)[0]; //(index no., no. of elements to delete);
  }
};

const getUser = (id)=>{
  const user = users.find((user)=>{
    return user.id === id;
  });

  return user;
};

const getUsersInRoom = (room)=>{
  room = room.trim().toLowerCase()
  return users.filter((user) => {
    return user.room === room;
  })
}

module.exports = {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
}
