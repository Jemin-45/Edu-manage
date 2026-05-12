const { supabase, supabaseAuth } = require('../config/supabase');

// Middleware to verify the user is authenticated via Supabase JWT
const authenticate = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized. No token provided.' });
    }

    const token = authHeader.split(' ')[1];
    // Use the anon-key client to safely verify the user's JWT
    const { data: { user }, error } = await (supabaseAuth || supabase).auth.getUser(token);

    if (error || !user) {
        return res.status(401).json({ status: 'error', message: 'Invalid or expired token.' });
    }

    req.user = user;
    next();
};

// Middleware to check if the user has the required role
const authorizeRole = (...roles) => {
    return async (req, res, next) => {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', req.user.id)
            .single();

        if (error || !profile) {
            return res.status(403).json({ status: 'error', message: 'Could not verify user role.' });
        }

        if (!roles.includes(profile.role)) {
            return res.status(403).json({ status: 'error', message: `Access denied. Required role: ${roles.join(' or ')}.` });
        }

        req.userRole = profile.role;
        next();
    };
};

module.exports = { authenticate, authorizeRole };
