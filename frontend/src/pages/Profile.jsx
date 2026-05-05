import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/layout/Navbar';
import useStore from '../store/useStore';
import { User, Package, Tag, Store, PlusCircle } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useStore();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [vendorOrders, setVendorOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Product Form State
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    category: 'wall-art',
    description: ''
  });
  const [productMsg, setProductMsg] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        // Fetch Customer Orders
        const userRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/user/${user.id}`);
        const userData = await userRes.json();
        if (userData.success) setOrders(userData.data);

        // Fetch Vendor Orders if role is vendor
        if (user.role === 'vendor') {
          const vendorRes = await fetch(`${import.meta.env.VITE_API_URL}/api/orders/vendor/${user.id}`);
          const vendorData = await vendorRes.json();
          if (vendorData.success) setVendorOrders(vendorData.data);
        }
      } catch (err) {
        console.error("Error fetching orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setProductMsg('');
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          price: Number(newProduct.price),
          category: newProduct.category,
          description: newProduct.description,
          artisan: {
            vendor: user.id,
            name: user.vendorDetails?.storeName || `${user.firstName} ${user.lastName}`,
            location: user.vendorDetails?.location || 'Unknown Location'
          }
        })
      });
      const data = await response.json();
      if (data.success) {
        setProductMsg('Product added successfully!');
        setNewProduct({ name: '', price: '', category: 'wall-art', description: '' });
      } else {
        setProductMsg('Failed to add product.');
      }
    } catch (err) {
      setProductMsg('Network error while adding product.');
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6]">
      <Navbar />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white p-6 shadow-sm border border-gray-100 rounded-sm">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                <div className="w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center text-xl font-serif uppercase">
                  {user.firstName[0]}{user.lastName[0]}
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{user.firstName} {user.lastName}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-wider">{user.role}</p>
                </div>
              </div>

              <nav className="space-y-2">
                <button 
                  onClick={() => setActiveTab('info')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'info' ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <User size={18} /> <span>Profile Info</span>
                </button>
                <button 
                  onClick={() => setActiveTab('orders')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'orders' ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Package size={18} /> <span>My Orders</span>
                </button>
                <button 
                  onClick={() => setActiveTab('coupons')}
                  className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'coupons' ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Tag size={18} /> <span>Coupons</span>
                </button>

                {user.role === 'vendor' && (
                  <>
                    <button 
                      onClick={() => setActiveTab('vendor-orders')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'vendor-orders' ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <Store size={18} /> <span>Store Dashboard</span>
                    </button>
                    <button 
                      onClick={() => setActiveTab('vendor-add')}
                      className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium transition-colors ${activeTab === 'vendor-add' ? 'bg-gray-50 text-gray-900' : 'text-gray-600 hover:bg-gray-50'}`}
                    >
                      <PlusCircle size={18} /> <span>Add Product</span>
                    </button>
                  </>
                )}
                
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 mt-4 border-t border-gray-100"
                >
                  <span>Logout</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <div className="bg-white p-8 shadow-sm border border-gray-100 min-h-[500px]">
              
              {activeTab === 'info' && (
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">Profile Information</h2>
                  <div className="space-y-4">
                    <div><span className="text-gray-500 w-32 inline-block">First Name:</span> <span className="font-medium">{user.firstName}</span></div>
                    <div><span className="text-gray-500 w-32 inline-block">Last Name:</span> <span className="font-medium">{user.lastName}</span></div>
                    <div><span className="text-gray-500 w-32 inline-block">Email:</span> <span className="font-medium">{user.email}</span></div>
                    <div><span className="text-gray-500 w-32 inline-block">Account Type:</span> <span className="font-medium uppercase">{user.role}</span></div>
                  </div>

                  {user.role === 'vendor' && user.vendorDetails && (
                    <div className="mt-8 pt-8 border-t border-gray-100">
                      <h3 className="text-xl font-serif text-gray-900 mb-4">Store Details</h3>
                      <div className="space-y-4">
                        <div><span className="text-gray-500 w-32 inline-block">Store Name:</span> <span className="font-medium">{user.vendorDetails.storeName || 'N/A'}</span></div>
                        <div><span className="text-gray-500 w-32 inline-block">Location:</span> <span className="font-medium">{user.vendorDetails.location || 'N/A'}</span></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'orders' && (
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">My Orders</h2>
                  {loading ? (
                    <p className="text-gray-500">Loading orders...</p>
                  ) : orders.length === 0 ? (
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {orders.map(order => (
                        <div key={order._id} className="border border-gray-200 p-4 rounded-sm flex justify-between items-center">
                          <div>
                            <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                            <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">Rs. {order.pricing.total.toLocaleString('en-IN')}</p>
                            <p className="text-sm text-green-600 uppercase tracking-wider">{order.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'coupons' && (
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">My Coupons</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="border border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
                      <p className="text-2xl font-bold tracking-widest text-gray-900 mb-2">WELCOME10</p>
                      <p className="text-sm text-gray-500">10% off your first artisan purchase</p>
                    </div>
                    <div className="border border-dashed border-gray-300 bg-gray-50 p-6 flex flex-col items-center justify-center text-center">
                      <p className="text-2xl font-bold tracking-widest text-gray-900 mb-2">FREESHIP</p>
                      <p className="text-sm text-gray-500">Free shipping on orders over Rs. 5000</p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'vendor-orders' && (
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">Store Dashboard</h2>
                  <p className="text-gray-500 mb-6">Viewing all orders placed for your products.</p>
                  
                  {loading ? (
                    <p className="text-gray-500">Loading store orders...</p>
                  ) : vendorOrders.length === 0 ? (
                    <p className="text-gray-500">No orders received yet.</p>
                  ) : (
                    <div className="space-y-4">
                      {vendorOrders.map(order => (
                        <div key={order._id} className="border border-gray-200 p-4 rounded-sm">
                          <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-100">
                            <div>
                              <p className="font-medium text-gray-900">Order #{order.orderNumber}</p>
                              <p className="text-sm text-gray-500">Placed: {new Date(order.createdAt).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-gray-900">Rs. {order.pricing.total.toLocaleString('en-IN')}</p>
                              <p className="text-sm text-blue-600 uppercase tracking-wider">{order.status}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium mb-2">Items:</p>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {order.items.map((item, idx) => (
                                <li key={idx}>- {item.quantity}x {item.name} (Rs. {item.price})</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'vendor-add' && (
                <div>
                  <h2 className="text-2xl font-serif text-gray-900 mb-6">Add New Product</h2>
                  
                  {productMsg && (
                    <div className={`p-3 mb-6 text-sm font-medium ${productMsg.includes('success') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                      {productMsg}
                    </div>
                  )}

                  <form onSubmit={handleAddProduct} className="space-y-5 max-w-xl">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Product Name</label>
                      <input 
                        type="text" 
                        required
                        value={newProduct.name}
                        onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Price (Rs.)</label>
                      <input 
                        type="number" 
                        required
                        value={newProduct.price}
                        onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Category</label>
                      <select 
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm bg-transparent"
                      >
                        <option value="wall-art">Wall Art</option>
                        <option value="wall-clocks">Wall Clocks</option>
                        <option value="mirrors">Mirrors</option>
                        <option value="tables">Tables</option>
                        <option value="pots-pottery">Pots & Pottery</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description</label>
                      <textarea 
                        required
                        rows={4}
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        className="w-full border-b border-gray-300 py-2 focus:outline-none focus:border-gray-900 text-sm resize-none"
                      ></textarea>
                    </div>
                    <button 
                      type="submit" 
                      className="bg-gray-900 text-white px-8 py-3 text-sm font-medium tracking-widest hover:bg-gray-800 transition-colors uppercase mt-4"
                    >
                      Post Product
                    </button>
                  </form>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Profile;
