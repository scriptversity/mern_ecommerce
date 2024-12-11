const sendToken = (user, statusCode, res) => {
  try {
    const token = user.getJwtToken();
    const options = {
      expires: new Date(Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000), // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Set to true in production
      sameSite: 'strict', // Helps prevent CSRF attacks
    };

    res.status(statusCode).cookie('token', token, options).json({
      success: true,
      user,
      token,
    });
  } catch (error) {
    console.error(`Error generating token: ${error.message}`);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
};

module.exports = sendToken;

// const sendToken = (user, statusCode, res) => {
//   const token = user.getJwtToken();
//   const options = {
//     expires: new Date(
//       Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // 1 day
//     ),
//     httpOnly: true,
//   }

//   res.status(statusCode).cookie('token', token, options).json({
//     success: true,
//     user,
//     token,
//   })
// }