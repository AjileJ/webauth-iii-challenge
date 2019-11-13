const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const Users = require('../users/users-model');
const {validateUser} = require('../users/users-helpers');

router.post('/register', (req,res) => {
  let user = req.body;

  const validateResult = validateUser(user);

  if (validateResult.isSuccessful === true) {
    const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
    user.password = hash;
    Users.add(user)
      .then(saved => {
        res.status(201).json(saved);
      })
      .catch(error => {
        console.log(error)
        res.status(500).json(error);
      });
  } else {
    res.status(400).json({
      message: "Invalid information about the user, see errors for details",
      errors: validateResult.errors
    });
  }
});
router.post("/login", (req, res) => {
  let { username, password } = req.body;
  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // 2: produce a token
        const token = getJwtToken(user.username);
        req.role = token;
        // 3: send the token to the client
        res.status(200).json({
          message: `Welcome ${user.username}! have a token...`,
          token
        });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});
// 4
function getJwtToken(username) {
  const payload = {
    username,
    role: "student" // this will probably come from the database
  };
  const secret = process.env.JWT_SECRET || "is it secret, is it safe?";
  const options = {
    expiresIn: "1d"
  };
  return jwt.sign(payload, secret, options);
}
module.exports = router;
