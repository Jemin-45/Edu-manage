const { supabase } = require('../config/supabase');

// @route   POST /api/auth/login
// @desc    Login user and return session token
// @access  Public
const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ status: 'error', message: 'Email and password are required.' });

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error)
        return res.status(401).json({ status: 'error', message: error.message });

    // Fetch user profile to get the role
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name')
        .eq('id', data.user.id)
        .single();

    res.status(200).json({
        status: 'success',
        message: 'Login successful.',
        token: data.session.access_token,
        user: {
            id: data.user.id,
            email: data.user.email,
            role: profile?.role,
            full_name: profile?.full_name
        }
    });
};

// @route   POST /api/auth/logout
// @desc    Logout the current user
// @access  Private
const logout = async (req, res) => {
    const { error } = await supabase.auth.signOut();
    if (error)
        return res.status(500).json({ status: 'error', message: error.message });

    res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
};

// @route   GET /api/auth/me
// @desc    Get current logged-in user profile
// @access  Private
const getMe = async (req, res) => {
    const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', req.user.id)
        .single();

    if (error)
        return res.status(500).json({ status: 'error', message: error.message });

    res.status(200).json({ status: 'success', data: profile });
};

module.exports = { login, logout, getMe };
