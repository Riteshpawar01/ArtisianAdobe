import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [responseMsg, setResponseMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      setStatus('error');
      setResponseMsg('All fields are required.');
      return;
    }

    setStatus('loading');
    
    try {
      const response = await fetch('http://localhost:5005/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          message: formData.message
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setStatus('success');
        setResponseMsg(data.message || 'Your message has been sent successfully!');
        setFormData({ firstName: '', lastName: '', email: '', message: '' });
      } else {
        setStatus('error');
        setResponseMsg(data.message || 'Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
      setResponseMsg('A network error occurred. Please try again later.');
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      
      <div className="py-16 border-b border-gray-200/60 bg-white/40">
        <h1 className="text-center text-4xl tracking-widest font-serif text-[#333333] uppercase">
          Contact Us
        </h1>
        <p className="text-center text-gray-500 mt-4 max-w-2xl mx-auto px-4">
          We're here to assist you with any inquiries about our exclusive artisan pieces, shipping, or bespoke commissions.
        </p>
      </div>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-2 gap-16">
        
        {/* Left Info Column */}
        <div className="space-y-10">
          <div>
            <h3 className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-3">Customer Service</h3>
            <p className="text-gray-900 font-medium">india@artisanabode.com</p>
            <p className="text-gray-500">+91 7517501004</p>
            <p className="text-gray-500 text-sm mt-2">Mon - Fri, 9am - 6pm EST</p>
          </div>
          
          <div>
            <h3 className="text-sm font-medium tracking-widest text-gray-400 uppercase mb-3">Studio & Showroom</h3>
            <p className="text-gray-900 font-medium">ArtisanAbode Gallery</p>
            <p className="text-gray-500">123 MG road</p>
            <p className="text-gray-500">pune, 411048</p>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="bg-white p-8 md:p-10 border border-gray-100 shadow-sm relative">
          
          {status === 'success' && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm font-medium">
              {responseMsg}
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {responseMsg}
            </div>
          )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">First Name</label>
                <input 
                  type="text" 
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm" 
                  disabled={status === 'loading'}
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Last Name</label>
                <input 
                  type="text" 
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm" 
                  disabled={status === 'loading'}
                />
              </div>
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm" 
                disabled={status === 'loading'}
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Message</label>
              <textarea 
                rows={4} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 transition-colors bg-transparent text-sm resize-none"
                disabled={status === 'loading'}
              ></textarea>
            </div>

            <button 
              type="submit"
              disabled={status === 'loading'}
              className={`w-full text-white font-medium py-4 text-sm tracking-widest transition-colors uppercase mt-4 ${status === 'loading' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900 hover:bg-gray-800'}`}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

      </main>
    </div>
  );
};

export default Contact;
