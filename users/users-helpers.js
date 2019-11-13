module.exports = {
  validateUser
};

function validateUser(user){
  let errors = [];

  if(!user.username || user.username.length < 3){
    errors.push('please include a username with at least 3 characters ');
  }
  if(!user.password || user.password.length < 4){
    errors.push('please include a password with at least 4 characters')
  }
  return {
    isSuccessful: errors.length > 0 ? false : true,
    errors
  };
}