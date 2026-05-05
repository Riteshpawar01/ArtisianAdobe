const ContactSubmission = require('../models/ContactSubmission');

exports.submitContact = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name, email, and message are required fields.' 
      });
    }

    const newSubmission = await ContactSubmission.create({
      name,
      email,
      phone: phone || '',
      subject: subject || 'General Inquiry',
      message
    });

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully. We will get back to you soon!',
      data: newSubmission
    });

  } catch (error) {
    console.error('Contact Submission Error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to submit contact form. Please try again later.' 
    });
  }
};
