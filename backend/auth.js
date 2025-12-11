const express = require('express');
const jwt = require('jsonwebtoken');
const { User, Organization, AuditLog } = require('./models');
const authenticate = require('./middleware');

const router = express.Router();

// Register organization and first user
router.post('/register', async (req, res) => {
  try {
    const { organizationName, email, password } = req.body;
    console.log(req.body)
    // Create organization
    const organization = await Organization.create({
      name: organizationName
    });
    console.log("org working")
    // Create first user
    const user = await User.create({
      email,
      password_hash: password, // Will be hashed by the model hook
      organization_id: organization.id
    });
    console.log("user working")
    // Create audit log
    await AuditLog.create({
      action: 'organization_created',
      resource_type: 'organization',
      resource_id: organization.id,
      organization_id: organization.id,
      user_id: user.id,
      details: { organization_name: organizationName }
    });

    // Generate JWT token
    // const token = jwt.sign(
    //   { userId: user.id, organizationId: organization.id },
    //   process.env.JWT_SECRET,
    //   { expiresIn: '24h' }
    // );

    res.status(201).json({
      message: 'Organization and user created successfully',
      // token,
      user: { id: user.id, email: user.email },
      organization: { id: organization.id, name: organization.name }
    });
  } catch (error) {
     console.error('❌ FULL ERROR DETAILS:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.errors ? error.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    })) : 'No validation errors');
    
    res.status(400).json({ 
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : null
  })

}
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ 
      where: { email },
      include: ['organization']
    });
    console.log("user finding succcess")
    console.log(user)
    if (!user || !(await user.validatePassword(password))) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Create audit log
    await AuditLog.create({
      action: 'user_login',
      resource_type: 'user',
      resource_id: user.id,
      organization_id: user.organization_id,
      user_id: user.id,
      details: { email }
    });
    const jwtSecret = process.env.JWT_SECRET || 'secret';
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, organizationId: user.organization_id },
      jwtSecret,
      { expiresIn: '24h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, email: user.email },
      organization: user.organization
    });
  } catch (error) {
     console.error('❌ FULL ERROR DETAILS:');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error details:', error.errors ? error.errors.map(e => ({
      field: e.path,
      message: e.message,
      value: e.value
    })) : 'No validation errors');
    
    res.status(400).json({ 
      error: error.message,
      details: error.errors ? error.errors.map(e => e.message) : null
  })
  }
});

// Get current user
router.get('/me', authenticate, async (req, res) => {
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email
    },
    organization: req.user.organization
  });
});

module.exports = router;