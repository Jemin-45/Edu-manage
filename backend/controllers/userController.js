const { supabase } = require('../config/supabase');

// @route   GET /api/users
// @desc    Get all users (Admin only)
const getAllUsers = async (req, res) => {
    const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', data });
};

// @route   POST /api/users
// @desc    Create a new user with a role (Admin only)
const createUser = async (req, res) => {
    const { email, password, full_name, role } = req.body;
    if (!email || !password || !full_name || !role)
        return res.status(400).json({ status: 'error', message: 'email, password, full_name, and role are required.' });

    // Create auth user in Supabase
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true
    });
    if (authError) return res.status(500).json({ status: 'error', message: authError.message });

    // Insert profile record
    const { data: profile, error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        email,
        full_name,
        role
    }).select().single();

    if (profileError) return res.status(500).json({ status: 'error', message: profileError.message });
    
    // Trigger welcome email asynchronously
    const { sendWelcomeEmail } = require('../services/emailService');
    sendWelcomeEmail({ to: email, full_name, role, email, password }).catch(err => console.error('Failed to send welcome email:', err));

    res.status(201).json({ status: 'success', message: 'User created successfully.', data: profile });
};

// @route   PUT /api/users/:id
// @desc    Update a user profile (Admin only)
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { full_name, role } = req.body;
    const { data, error } = await supabase.from('profiles').update({ full_name, role }).eq('id', id).select().single();
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', message: 'User updated.', data });
};

// @route   DELETE /api/users/:id
// @desc    Delete a user (Admin only)
const deleteUser = async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('profiles').delete().eq('id', id);
    if (error) return res.status(500).json({ status: 'error', message: error.message });
    res.status(200).json({ status: 'success', message: 'User deleted successfully.' });
};

module.exports = { getAllUsers, createUser, updateUser, deleteUser };
