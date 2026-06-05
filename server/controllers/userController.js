import User from "../models/User.js";

/**
 * GET CURRENT USER
 */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username || "",
      plan: user.plan,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE PROFILE
 */
export const updateProfile = async (req, res) => {
  const { name, username } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, username },
      { new: true }
    ).select("-password");

    return res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      username: user.username || "",
      plan: user.plan,
    });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * UPDATE SETTINGS
 */
export const updateSettings = async (req, res) => {
  const { theme, emailNotifications, pushNotifications, twoFactor, activityLog } = req.body;

  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { settings: { theme, emailNotifications, pushNotifications, twoFactor, activityLog } },
      { new: true }
    ).select("-password");

    return res.json({ success: true, settings: user.settings });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
};