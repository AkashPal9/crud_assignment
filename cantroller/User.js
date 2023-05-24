const bcrypt = require("bcrypt");
const User = require("../modal/User");
const { generateToken } = require("../jwt");

const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the admin already exists
    const adminExists = await User.findOne({ email, isAdmin: true });
    if (adminExists) {
      return res.status(409).json({ error: "Admin profile already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = new User({
      name,
      email,
      password: hashedPassword,
      isAdmin: true,
    });
    const savedAdmin = await newAdmin.save();

    // Generate a token for the newly created admin
    const token = generateToken({
      userId: savedAdmin._id,
      isAdmin: savedAdmin.isAdmin,
    });

    res.status(201).json({ admin: savedAdmin, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const { isAdmin } = req.userData;

    // Allow only admins to create users
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });

    const savedUser = await newUser.save();

    res.status(201).json({ succes: true, savedUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const userlogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const passwordMatch = await user.comparePassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    const token = generateToken({ userId: user._id, isAdmin: user.isAdmin });
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUser = async (req, res) => {
  try {
    const { isAdmin } = req.userData;

    // Allow only admins to get all users
    if (!isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUser = async (req, res) => {
  try {
    const { _id } = req.userData;
    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  try {
    const { _id } = req.userData;

    const updatedUser = await User.findByIdAndUpdate(_id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id, isAdmin } = req.userData;
    console.log(_id, "userid");
    const { profileId } = req.query;
    console.log(profileId, "profileid");
    // Check if the user is an admin or deleting their own profile
    if (!isAdmin && _id !== profileId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const deletedUser = await User.findByIdAndDelete(profileId);
    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createAdmin,
  createUser,
  userlogin,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
};
