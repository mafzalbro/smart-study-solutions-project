const Admin = require('../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sendPasswordResetEmail } = require('../services/emailService'); // Adjust path as needed

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRATION = process.env.JWT_EXPIRES;
const JWT_EXPIRATION_EXTENDED = process.env.JWT_EXPIRES_EXTENDED;


// Register Admin
const createAdmin = async (req, res) => {
  const { fullname, username, email, password, profileImage } = req.body;
  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // const serialNumber = await getNextSequenceValue('adminSerial', 'Admin');
    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({
      // serialNumber,
      fullname,
      username: username.split(' ').join('-').toLowerCase(),
      password: hashedPassword,
      email,
      profileImage
      // role,
      // favoriteGenre
    });
    
    await newAdmin.save();
    
    const token = jwt.sign({ id: newAdmin._id }, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
    res.status(201).json({ message: 'Admin registered successfully', token });
  } catch (error) {
    console.error('Error registering admin:', error);
    res.status(500).json({ message: `Failed to register admin ${username}: ${error.message}` });
  }
};

// Login Admin
const loginAdmin = async (req, res) => {
  const { username, email, password, remember } = req.body;

  console.log({ expiresIn: remember ? JWT_EXPIRATION_EXTENDED : JWT_EXPIRATION })
  
  try {
    let admin;
    if(email) admin = await Admin.findOne({ email });
    if(username) admin = await Admin.findOne({ username });
    if (!admin) return res.status(400).json({ message: 'Admin with these credentails does not exists!' });

    if(!password){
      return res.status(400).json({ message: 'Please set password to login!'})
    }
    
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ message: 'Incorrect username or password' });

    const token = jwt.sign({ id: admin._id, role: admin.role }, JWT_SECRET, { expiresIn: remember ? JWT_EXPIRATION_EXTENDED : JWT_EXPIRATION });

    res.status(200).json({ message: 'Logged in successfully', token });
  } catch (error) {
    console.error('Error logging in admin:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// // Middleware to protect routes
// const authenticateJWT = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) {
//     return res.status(401).json({ message: 'Access token is missing or invalid' });
//   }

//   jwt.verify(token, JWT_SECRET, (err, admin) => {
//     if (err) {
//       return res.status(403).json({ message: 'Invalid token' });
//     }
//     req.admin = admin;
//     next();
//   });
// };

// Logout Admin (Optional with JWT - Just remove token client-side)
const logoutAdmin = (req, res) => {
  res.status(200).json({ message: 'Logged out successfully' });
};

// Change Password
const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const adminId = req.admin.id;

  try {
    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: 'Admin not found' });

    const isPasswordMatch = await bcrypt.compare(currentPassword, admin.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    } else if (currentPassword === newPassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the current password' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    await admin.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Failed to change password', error: error.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: 'This admin is no account yet' });

    const resetToken = jwt.sign({ email: admin.email }, JWT_SECRET, { expiresIn: '1h' });
    admin.resetTokenExpiry = Date.now() + 3600000;
    await admin.save();

    const resetLink = `${process.env.FRONTEND_ORIGIN}/reset-password?token=${resetToken}`;
    await sendPasswordResetEmail(admin.email, resetLink);

    res.status(200).json({ message: `Password reset instructions sent to your email: ${email}` });
  } catch (error) {
    console.error('Error in forgotPassword:', error);
    res.status(500).json({ message: 'Failed to process password reset request', error: error.message });
  }
};

// Verify Token
const verifyToken = async (req, res) => {
  const { token } = req.query;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findOne({ email: decoded.email, resetTokenExpiry: { $gt: Date.now() } });
    if (!admin) return res.status(400).json({ message: 'Invalid or expired token' });

    res.status(200).json({ message: 'Token is valid', token });
  } catch (error) {
    console.error('Error in verifyToken:', error);
    res.status(400).json({ message: 'Invalid or expired token' });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findOne({ email: decoded.email, resetTokenExpiry: { $gt: Date.now() } });
    if (!admin) return res.status(400).json({ message: 'Invalid or expired token' });

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    admin.password = hashedPassword;
    admin.resetTokenExpiry = null;
    await admin.save();

    res.status(200).json({ message: 'Password has been reset successfully' });
  } catch (error) {
    console.error('Error in resetPassword:', error);
    res.status(500).json({ message: 'Failed to reset password', error: error.message });
  }
};

// Check Auth (optional with JWT, can just verify token)
const checkAuth = (req, res) => {
  const admin = req.admin
  res.status(200).json({ auth: true, admin });
};

module.exports = { createAdmin, loginAdmin, logoutAdmin, changePassword, forgotPassword, verifyToken, resetPassword, checkAuth, 
  // authenticateJWT 
};
