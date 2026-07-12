import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit2, Trash2, LogOut, Settings, Check, Menu,
  AlertCircle, Upload, X, ShieldAlert, ToggleLeft, ToggleRight,
  Sun, Moon, Eye, EyeOff
} from 'lucide-react';
import { Mosaic } from 'react-loading-indicators';
import logoImage from '../assets/logo.jpg';

const AdminDashboard = ({ admin, onLogout }) => {
  const [activeTab, setActiveTab] = useState('products'); // 'products' or 'settings'
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [productError, setProductError] = useState('');
  
  // Modals state
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // Null for Add, product object for Edit
  const [productToDelete, setProductToDelete] = useState(null);

  // Success/Error notifications
  const [alertMessage, setAlertMessage] = useState(null); // { type: 'success'|'error', text: '' }

  // Form states
  const [formData, setFormData] = useState({
    name: '',
    nameLocal: '',
    category: 'vegetable', // vegetable or dairy
    isAvailable: true,
    specialDeal: false
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  
  // Dynamic Pricing states
  const [vegPrices, setVegPrices] = useState({ price250: '', price500: '', price1000: '' });
  const [dairyWeight, setDairyWeight] = useState('1 Kg');
  const [dairyPrice, setDairyPrice] = useState('');
  const [formError, setFormError] = useState('');
  const [submittingProduct, setSubmittingProduct] = useState(false);

  // Settings states
  const [settingsData, setSettingsData] = useState({
    name: admin.name || '',
    email: admin.email || '',
    currentPassword: '',
    newPassword: ''
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [updatingSettings, setUpdatingSettings] = useState(false);
  const [settingsError, setSettingsError] = useState('');

  // Carousel states
  const [carouselSlides, setCarouselSlides] = useState([]);
  const [loadingCarousel, setLoadingCarousel] = useState(false);
  const [carouselError, setCarouselError] = useState('');
  
  // Carousel Modal state
  const [isCarouselModalOpen, setIsCarouselModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null); // Null for Add, slide object for Edit
  const [isDeleteSlideModalOpen, setIsDeleteSlideModalOpen] = useState(false);
  const [slideToDelete, setSlideToDelete] = useState(null);

  // Carousel Form state
  const [slideData, setSlideData] = useState({
    badge: '',
    headlineLocal: '',
    description: '',
    highlight: '',
    trustLabel: '',
    trustSub: '',
    order: 0
  });
  const [slideImageFile, setSlideImageFile] = useState(null);
  const [slideImagePreview, setSlideImagePreview] = useState('');
  const [slideFormError, setSlideFormError] = useState('');
  const [submittingSlide, setSubmittingSlide] = useState(false);

  // Theme state
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('hn_theme');
      return saved || 'light';
    } catch (e) {
      return 'light';
    }
  });

  // Synchronize theme with class list
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    try {
      localStorage.setItem('hn_theme', theme);
    } catch (e) {}
  }, [theme]);

  const [logoPath, setLogoPath] = useState(logoImage);

  // Fetch settings logo url on mount
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const res = await fetch('/api/admin/settings');
        if (res.ok) {
          const data = await res.json();
          if (data.success && data.settings && data.settings.logoUrl) {
            setLogoPath(data.settings.logoUrl);
          }
        }
      } catch (err) {
        console.error('Failed to fetch settings logo:', err);
      }
    };
    fetchLogo();
  }, []);

  // Fetch all products
  const fetchProducts = async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts(data.products);
      } else {
        setProductError(data.message || 'Failed to fetch products.');
      }
    } catch (err) {
      console.error(err);
      setProductError('Network error retrieving products.');
    } finally {
      setLoadingProducts(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch all carousel slides
  const fetchCarouselSlides = async () => {
    setLoadingCarousel(true);
    setCarouselError('');
    try {
      const response = await fetch('/api/carousel');
      const data = await response.json();
      if (response.ok && data.success) {
        setCarouselSlides(data.slides);
      } else {
        setCarouselError(data.message || 'Failed to fetch carousel slides.');
      }
    } catch (err) {
      console.error(err);
      setCarouselError('Network error retrieving carousel slides.');
    } finally {
      setLoadingCarousel(false);
    }
  };

  // Fetch carousel slides when active tab changes to 'carousel'
  useEffect(() => {
    if (activeTab === 'carousel') {
      fetchCarouselSlides();
    }
  }, [activeTab]);

  // Open Slide Modal helper
  const openSlideModal = (slide = null) => {
    setSlideFormError('');
    if (slide) {
      setEditingSlide(slide);
      setSlideData({
        badge: slide.badge,
        headlineLocal: slide.headlineLocal,
        description: slide.description,
        highlight: slide.highlight,
        trustLabel: slide.trustLabel,
        trustSub: slide.trustSub,
        order: slide.order || 0
      });
      setSlideImagePreview(slide.imageUrl);
      setSlideImageFile(null);
    } else {
      setEditingSlide(null);
      setSlideData({
        badge: '',
        headlineLocal: '',
        description: '',
        highlight: '',
        trustLabel: '',
        trustSub: '',
        order: carouselSlides.length
      });
      setSlideImagePreview('');
      setSlideImageFile(null);
    }
    setIsCarouselModalOpen(true);
  };

  const handleSlideImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSlideImageFile(file);
      setSlideImagePreview(URL.createObjectURL(file));
    }
  };

  // Submit Slide Form
  const handleSlideFormSubmit = async (e) => {
    e.preventDefault();
    setSlideFormError('');

    if (!slideData.badge.trim() || !slideData.headlineLocal.trim() || !slideData.description.trim() || !slideData.highlight.trim() || !slideData.trustLabel.trim() || !slideData.trustSub.trim()) {
      setSlideFormError('All text fields are required.');
      return;
    }

    if (!editingSlide && !slideImageFile) {
      setSlideFormError('Please upload a slide image.');
      return;
    }

    setSubmittingSlide(true);

    const submissionData = new FormData();
    submissionData.append('badge', slideData.badge.trim());
    submissionData.append('headlineLocal', slideData.headlineLocal.trim());
    submissionData.append('description', slideData.description.trim());
    submissionData.append('highlight', slideData.highlight.trim());
    submissionData.append('trustLabel', slideData.trustLabel.trim());
    submissionData.append('trustSub', slideData.trustSub.trim());
    submissionData.append('order', slideData.order);
    if (slideImageFile) {
      submissionData.append('image', slideImageFile);
    }

    const endpoint = editingSlide ? `/api/carousel/${editingSlide._id}` : '/api/carousel';
    const method = editingSlide ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        body: submissionData
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showNotification(
          'success',
          editingSlide ? 'Carousel slide updated successfully!' : 'Carousel slide added successfully!'
        );
        fetchCarouselSlides();
        setIsCarouselModalOpen(false);
      } else {
        setSlideFormError(data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      setSlideFormError('Server upload failed. Check connection.');
    } finally {
      setSubmittingSlide(false);
    }
  };

  // Delete slide helpers
  const confirmDeleteSlide = (slide) => {
    setSlideToDelete(slide);
    setIsDeleteSlideModalOpen(true);
  };

  const executeDeleteSlide = async () => {
    if (!slideToDelete) return;
    try {
      const response = await fetch(`/api/carousel/${slideToDelete._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('success', 'Carousel slide deleted successfully!');
        setCarouselSlides((prev) => prev.filter((s) => s._id !== slideToDelete._id));
        setIsDeleteSlideModalOpen(false);
      } else {
        showNotification('error', data.message || 'Failed to delete slide.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error during slide deletion.');
    }
  };

  // Trigger temporary banner notifications
  const showNotification = (type, text) => {
    setAlertMessage({ type, text });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Quick Availability Toggle
  const handleToggleAvailability = async (productId) => {
    try {
      const response = await fetch(`/api/products/${productId}/toggle`, {
        method: 'PATCH'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, isAvailable: data.isAvailable } : p))
        );
        showNotification('success', `Product availability updated to: ${data.isAvailable ? 'Available' : 'Out of Stock'}`);
      } else {
        showNotification('error', data.message || 'Failed to toggle availability.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error changing availability.');
    }
  };
 
  const handleToggleSpecialDeal = async (productId) => {
    try {
      const product = products.find((p) => p._id === productId);
      const updatedDealValue = !product?.specialDeal;
      const response = await fetch(`/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ specialDeal: updatedDealValue })
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === productId ? { ...p, specialDeal: updatedDealValue } : p))
        );
        showNotification('success', `Special deal ${updatedDealValue ? 'enabled' : 'disabled'} for this product.`);
      } else {
        showNotification('error', data.message || 'Failed to update special deal.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error changing special deal status.');
    }
  };
 
  // Handle Logout
  const handleLogoutClick = async () => {
    try {
      const response = await fetch('/api/auth/logout', { method: 'POST' });
      if (response.ok) {
        onLogout();
      }
    } catch (err) {
      console.error('Logout error:', err);
      onLogout(); // Fallback logout local state trigger
    }
  };

  // Handle opening Product modal
  const openProductModal = (product = null) => {
    setFormError('');
    if (product) {
      // EDIT MODE
      setEditingProduct(product);
      setFormData({
        name: product.name,
        nameLocal: product.nameLocal || '',
        category: product.category,
        isAvailable: product.isAvailable,
        specialDeal: product.specialDeal || false
      });
      setImagePreview(product.imageUrl);
      setImageFile(null);

      // Populate pricing fields
      if (product.category === 'vegetable') {
        const p250 = product.variants.find((v) => v.label === '250g')?.price || '';
        const p500 = product.variants.find((v) => v.label === '500g')?.price || '';
        const p1000 = product.variants.find((v) => v.label === '1 Kg')?.price || '';
        setVegPrices({ price250: p250, price500: p500, price1000: p1000 });
        setDairyWeight('1 Kg');
        setDairyPrice('');
      } else {
        const variant = product.variants.find((v) => ['250g', '500g', '500ml', '1 Kg', '1 Litre'].includes(v.label));
        setDairyWeight(variant?.label || '1 Kg');
        setDairyPrice(variant?.price || '');
        setVegPrices({ price250: '', price500: '', price1000: '' });
      }
    } else {
      // ADD MODE
      setEditingProduct(null);
      setFormData({
        name: '',
        nameLocal: '',
        category: 'vegetable',
        isAvailable: true,
        specialDeal: false
      });
      setImagePreview('');
      setImageFile(null);
      setVegPrices({ price250: '', price500: '', price1000: '' });
      setDairyWeight('1 Kg');
      setDairyPrice('');
    }
    setIsFormModalOpen(true);
  };

  // Handle product photo selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Dynamic Product Form submission
  const handleProductFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validations
    if (!formData.name.trim()) {
      setFormError('Please enter a product name in English.');
      return;
    }
    if (!editingProduct && !imageFile) {
      setFormError('Please upload a product photo.');
      return;
    }

    // Assemble variants
    let variants = [];
    if (formData.category === 'vegetable') {
      if (!vegPrices.price250 || !vegPrices.price500 || !vegPrices.price1000) {
        setFormError('All vegetable pricing variants (250g, 500g, 1Kg) are required.');
        return;
      }
      variants = [
        { label: '250g', price: Number(vegPrices.price250) },
        { label: '500g', price: Number(vegPrices.price500) },
        { label: '1 Kg', price: Number(vegPrices.price1000) }
      ];
    } else {
      if (!dairyPrice) {
        setFormError('Please choose the dairy weight and enter its price.');
        return;
      }
      variants = [
        { label: dairyWeight, price: Number(dairyPrice) }
      ];
    }

    setSubmittingProduct(true);
    
    // Build multipart form payload
    const submissionData = new FormData();
    submissionData.append('name', formData.name.trim());
    submissionData.append('nameLocal', formData.nameLocal.trim());
    submissionData.append('category', formData.category);
    submissionData.append('isAvailable', String(formData.isAvailable));
    submissionData.append('specialDeal', String(formData.specialDeal));
    submissionData.append('variants', JSON.stringify(variants));
    if (imageFile) {
      submissionData.append('image', imageFile);
    }

    const endpoint = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const response = await fetch(endpoint, {
        method,
        body: submissionData
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showNotification(
          'success',
          editingProduct ? 'Product updated successfully!' : 'Product added successfully!'
        );
        fetchProducts();
        setIsFormModalOpen(false);
      } else {
        setFormError(data.message || 'Operation failed.');
      }
    } catch (err) {
      console.error(err);
      setFormError('Server upload failed. Check connection.');
    } finally {
      setSubmittingProduct(false);
    }
  };

  // Delete product triggers
  const confirmDeleteProduct = (product) => {
    setProductToDelete(product);
    setIsDeleteModalOpen(true);
  };

  const executeDeleteProduct = async () => {
    if (!productToDelete) return;
    try {
      const response = await fetch(`/api/products/${productToDelete._id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (response.ok && data.success) {
        showNotification('success', 'Product deleted successfully!');
        setProducts((prev) => prev.filter((p) => p._id !== productToDelete._id));
        setIsDeleteModalOpen(false);
      } else {
        showNotification('error', data.message || 'Failed to delete product.');
      }
    } catch (err) {
      console.error(err);
      showNotification('error', 'Network error during deletion.');
    }
  };

  // Save Settings Form
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setSettingsError('');
    
    if (settingsData.newPassword && !settingsData.currentPassword) {
      setSettingsError('You must enter your current password to save a new password.');
      return;
    }

    setUpdatingSettings(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settingsData)
      });
      const data = await response.json();

      if (response.ok && data.success) {
        showNotification('success', 'Settings updated successfully.');
        setSettingsData((prev) => ({
          ...prev,
          currentPassword: '',
          newPassword: ''
        }));
      } else {
        setSettingsError(data.message || 'Settings update failed.');
      }
    } catch (err) {
      console.error(err);
      setSettingsError('Network error saving settings.');
    } finally {
      setUpdatingSettings(false);
    }
  };

  return (
    <div className="min-h-screen bg-warm-bg dark:bg-zinc-950 text-text-slate dark:text-zinc-100 flex flex-col transition-colors duration-300">
      {/* Admin header */}
      <header className="bg-zinc-800 dark:bg-zinc-900 text-white shadow-md z-30 sticky top-0 border-b border-transparent dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={logoPath} 
              alt="HN Greens Logo" 
              className="w-8 h-8 object-cover rounded-full border border-zinc-700/80 shadow-sm shrink-0"
            />
            <div>
              <h1 className="font-display font-extrabold text-base sm:text-lg tracking-tight leading-none">HN Greens Admin</h1>
              <p className="text-[9px] sm:text-[10px] text-zinc-400 font-semibold mt-0.5 leading-none">Logged in: {admin.email}</p>
            </div>
          </div>
          
          {/* Desktop Tab & Action buttons */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-brand-green text-white shadow-sm' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Catalog Management
            </button>
            <button
              onClick={() => setActiveTab('carousel')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'carousel' ? 'bg-brand-green text-white shadow-sm' : 'text-zinc-300 hover:text-white'
              }`}
            >
              Carousel Management
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 text-xs md:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1 ${
                activeTab === 'settings' ? 'bg-brand-green text-white shadow-sm' : 'text-zinc-300 hover:text-white'
              }`}
            >
              <Settings className="inline-block" size={14} />
              <span>Settings</span>
            </button>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              type="button"
              className="p-2 bg-white dark:bg-zinc-700 hover:bg-gray-100 dark:hover:bg-zinc-650 rounded-xl text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-white transition-colors cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button
              onClick={handleLogoutClick}
              className="p-2 bg-zinc-700 hover:bg-zinc-650 rounded-xl text-zinc-300 hover:text-white transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={16} />
            </button>
          </div>

          {/* Mobile Hamburger button */}
          <div className="flex md:hidden items-center gap-1.5">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              type="button"
              className="p-2 bg-zinc-700 hover:bg-zinc-600 rounded-lg text-zinc-300 hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Dropdown menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-700 bg-zinc-850 dark:bg-zinc-900 py-3 px-4 flex flex-col gap-2.5 shadow-inner">
            <button
              onClick={() => { setActiveTab('products'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'products' ? 'bg-brand-green text-white shadow-sm' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/30'
              }`}
            >
              Catalog Management
            </button>
            <button
              onClick={() => { setActiveTab('carousel'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer ${
                activeTab === 'carousel' ? 'bg-brand-green text-white shadow-sm' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/30'
              }`}
            >
              Carousel Management
            </button>
            <button
              onClick={() => { setActiveTab('settings'); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'settings' ? 'bg-brand-green text-white shadow-sm' : 'text-zinc-300 hover:text-white hover:bg-zinc-700/30'
              }`}
            >
              <Settings size={14} />
              <span>Settings</span>
            </button>
            <div className="h-px bg-zinc-700 my-1" />
            <div className="flex items-center justify-between gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                type="button"
                className="flex-grow py-2.5 bg-zinc-700 hover:bg-zinc-650 rounded-xl text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5"
              >
                {theme === 'dark' ? (
                  <>
                    <Sun size={14} />
                    <span>Light Mode</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} />
                    <span>Dark Mode</span>
                  </>
                )}
              </button>
              <button
                onClick={handleLogoutClick}
                className="flex-grow py-2.5 bg-zinc-700 hover:bg-zinc-650 rounded-xl text-zinc-300 hover:text-white transition-colors cursor-pointer text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global alert banner */}
      {alertMessage && (
        <div className="fixed top-18 right-4 z-50 animate-bounce">
          <div className={`p-4 rounded-xl shadow-lg border flex items-center gap-2 font-bold text-sm text-white ${
            alertMessage.type === 'success' ? 'bg-emerald-600 border-emerald-500' : 'bg-red-600 border-red-500'
          }`}>
            <Check size={18} />
            <span>{alertMessage.text}</span>
          </div>
        </div>
      )}

      {/* Admin Content Area */}
      <main className="flex-grow max-w-7xl w-full mx-auto p-4 md:p-8">
        
        {/* PRODUCT CATALOG TAB */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-slate dark:text-zinc-50">Produce & Dairy Catalog</h2>
                <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mt-1">
                  Add new items or toggle their daily availability. All changes sync immediately to the customer landing page.
                </p>
              </div>
              <button
                onClick={() => openProductModal()}
                className="px-5 py-3 bg-brand-green hover:bg-brand-green/95 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform duration-200 active:scale-95 self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add Product / નવું ઉમેરો</span>
              </button>
            </div>

            {/* Catalog list container */}
            {loadingProducts ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Mosaic color="#32cd32" size="medium" text="" textColor="" />
                  <p className="text-gray-505 text-sm font-semibold">Loading shop products...</p>
                </div>
              </div>
            ) : productError ? (
              <div className="bg-red-50 border border-red-150 p-6 text-center rounded-2xl text-red-700">
                <AlertCircle size={32} className="mx-auto mb-2 opacity-80" />
                <p className="font-bold">{productError}</p>
                <button onClick={fetchProducts} className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg cursor-pointer">Retry</button>
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white py-16 text-center rounded-2xl border border-gray-150 shadow-sm">
                <Leaf size={40} className="mx-auto mb-2 text-brand-green/45" />
                <p className="text-gray-500 font-bold text-lg">No products added yet.</p>
                <p className="text-xs text-gray-400 mt-1">Get started by clicking the "Add Product" button.</p>
              </div>
            ) : (
              /* Products List (Table layout on desktop, clean cards on mobile) */
              <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-150 dark:border-zinc-800 shadow-sm overflow-hidden">
                <div className="flex flex-col gap-4 p-4 md:hidden">
                  {products.map((p) => (
                    <div
                      key={p._id}
                      className={`border border-gray-150 dark:border-zinc-800 rounded-3xl p-4 ${!p.isAvailable ? 'bg-gray-50/70 dark:bg-zinc-950/80' : 'bg-white dark:bg-zinc-900'}`}
                    >
                      <div className="flex items-start gap-3">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="w-16 h-16 rounded-2xl object-cover bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0">
                              <h4 className="truncate font-bold text-text-slate dark:text-zinc-200">{p.name}</h4>
                              <p className="text-xs text-brand-green/80 dark:text-brand-mint/80 font-semibold truncate">
                                {p.nameLocal || 'No local name'}
                              </p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${
                              p.category === 'dairy'
                                ? 'bg-brand-gold-light dark:bg-brand-gold/20 text-brand-gold dark:text-brand-gold-light'
                                : 'bg-brand-mint dark:bg-brand-green/20 text-brand-green dark:text-brand-mint'
                            }`}>
                              {p.category === 'dairy' ? 'Dairy' : 'Vegetable'}
                            </span>
                          </div>

                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {p.variants.map((v) => (
                              <span key={v.label} className="inline-flex items-center bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-[11px] px-2 py-1 rounded-lg border border-gray-200 dark:border-zinc-700">
                                {v.label}: <strong className="ml-1 text-text-slate dark:text-zinc-100">₹{v.price}</strong>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 grid gap-3">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Special deal?</span>
                          <button
                            onClick={() => handleToggleSpecialDeal(p._id)}
                            type="button"
                            className={`focus:outline-none rounded-2xl px-3 py-2 text-[12px] font-bold transition-all ${
                              p.specialDeal
                                ? 'bg-yellow-100 dark:bg-yellow-300/20 text-yellow-800 dark:text-zinc-950 border border-yellow-200 dark:border-yellow-300'
                                : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700'
                            }`}
                            title="Toggle special deal"
                          >
                            {p.specialDeal ? '✓ Special' : 'Set Deal'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-xs font-semibold text-gray-500 dark:text-zinc-400">Available today?</span>
                          <button
                            onClick={() => handleToggleAvailability(p._id)}
                            type="button"
                            className="focus:outline-none rounded-2xl"
                            title="Click to toggle availability"
                          >
                            {p.isAvailable ? (
                              <ToggleRight size={38} className="text-brand-green dark:text-brand-mint" />
                            ) : (
                              <ToggleLeft size={38} className="text-gray-300 dark:text-zinc-700" />
                            )}
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => openProductModal(p)}
                            className="flex-1 py-3 rounded-2xl bg-gray-100 dark:bg-zinc-800 text-text-slate dark:text-zinc-100 font-bold text-sm hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => confirmDeleteProduct(p)}
                            className="flex-1 py-3 rounded-2xl bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 font-bold text-sm hover:bg-red-100 dark:hover:bg-red-900 transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 dark:bg-zinc-800/50 text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase border-b border-gray-150 dark:border-zinc-800">
                        <th className="p-4">Item</th>
                        <th className="p-4">Category</th>
                        <th className="p-4 text-center">Deal</th>
                        <th className="p-4">Variants & Prices</th>
                        <th className="p-4 text-center">Available Today?</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-150 dark:divide-zinc-800 text-sm">
                      {products.map((p) => (
                        <tr key={p._id} className={`${!p.isAvailable ? 'bg-gray-50/50 dark:bg-zinc-900/30 text-gray-400 dark:text-zinc-500' : 'text-text-slate dark:text-zinc-100'} border-b border-gray-150 dark:border-zinc-800/80`}>
                          {/* Image and name */}
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={p.imageUrl} 
                                alt={p.name} 
                                className="w-12 h-12 object-cover rounded-lg bg-gray-100 dark:bg-zinc-800 border border-gray-100 dark:border-zinc-700"
                              />
                              <div>
                                <h4 className="font-bold text-text-slate dark:text-zinc-200">{p.name}</h4>
                                <span className="text-xs text-brand-green/80 dark:text-brand-mint/80 font-semibold">{p.nameLocal || 'No local name'}</span>
                              </div>
                            </div>
                          </td>

                          {/* Category */}
                          <td className="p-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                              p.category === 'dairy' 
                                ? 'bg-brand-gold-light dark:bg-brand-gold/20 text-brand-gold dark:text-brand-gold-light' 
                                : 'bg-brand-mint dark:bg-brand-green/20 text-brand-green dark:text-brand-mint'
                            }`}>
                              {p.category === 'dairy' ? 'Dairy' : 'Vegetable'}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleSpecialDeal(p._id)}
                              className={`inline-flex items-center justify-center gap-1 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                                p.specialDeal
                                  ? 'bg-yellow-100 dark:bg-yellow-300/20 text-yellow-800 dark:text-zinc-950 border border-yellow-200 dark:border-yellow-300'
                                  : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-zinc-300 border border-gray-200 dark:border-zinc-700 hover:bg-gray-200 dark:hover:bg-zinc-700'
                              }`}
                            >
                              {p.specialDeal ? '✓ Deal' : 'Mark'}
                            </button>
                          </td>
 
                          {/* Variants list */}
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1.5">
                              {p.variants.map((v) => (
                                <span key={v.label} className="inline-block bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 text-xs px-2 py-0.5 rounded font-semibold border border-gray-200 dark:border-zinc-700">
                                  {v.label}: <strong className="text-text-slate dark:text-zinc-100">₹{v.price}</strong>
                                </span>
                              ))}
                            </div>
                          </td>

                          {/* Availability Toggle */}
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center">
                              <button
                                onClick={() => handleToggleAvailability(p._id)}
                                type="button"
                                className="focus:outline-none cursor-pointer"
                                title="Click to toggle availability"
                              >
                                {p.isAvailable ? (
                                  <ToggleRight size={38} className="text-brand-green dark:text-brand-mint" />
                                ) : (
                                  <ToggleLeft size={38} className="text-gray-300 dark:text-zinc-700" />
                                )}
                              </button>
                            </div>
                          </td>

                          {/* Edit / Delete Buttons */}
                          <td className="p-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => openProductModal(p)}
                                className="p-2 text-gray-600 dark:text-zinc-400 hover:text-brand-green dark:hover:text-brand-mint hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={16} />
                              </button>
                              <button
                                onClick={() => confirmDeleteProduct(p)}
                                className="p-2 text-gray-400 dark:text-zinc-500 hover:text-red-650 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* SETTINGS MANAGEMENT TAB */}
        {activeTab === 'settings' && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div>
              <h2 className="text-2xl font-black text-text-slate dark:text-zinc-50">Account Settings</h2>
              <p className="text-xs text-gray-500 dark:text-zinc-400 font-semibold mt-1">
                Update your administrator credentials (email, name, or password). Changing passwords requires validating your current password.
              </p>
            </div>

            <div className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 p-6 md:p-8 rounded-2xl shadow-sm">
              {settingsError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-sm font-semibold">
                  <AlertCircle size={16} className="shrink-0" />
                  <span>{settingsError}</span>
                </div>
              )}

              <form onSubmit={handleSettingsSubmit} className="space-y-6">
                {/* Admin Name */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="settings-name">
                    Name
                  </label>
                  <input
                    id="settings-name"
                    type="text"
                    required
                    value={settingsData.name}
                    onChange={(e) => setSettingsData({ ...settingsData, name: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                  />
                </div>

                {/* Admin Email */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="settings-email">
                    Email Address
                  </label>
                  <input
                    id="settings-email"
                    type="email"
                    required
                    value={settingsData.email}
                    onChange={(e) => setSettingsData({ ...settingsData, email: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                  />
                </div>

                <div className="border-t border-gray-150 dark:border-zinc-800 pt-4 mt-6">
                  <h3 className="text-sm font-bold text-text-slate dark:text-zinc-200 mb-3">Change Password (Optional)</h3>
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="new-password">
                    New Password
                  </label>
                  <div className="relative">
                    <input
                      id="new-password"
                      type={showNewPassword ? 'text' : 'password'}
                      value={settingsData.newPassword}
                      onChange={(e) => setSettingsData({ ...settingsData, newPassword: e.target.value })}
                      placeholder="Enter new password (min. 6 characters)"
                      className="w-full px-3 py-3 pr-10 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-100 transition-colors"
                      aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    >
                      {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
 
                {/* Current Password Verification */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="current-password">
                    Current Password *
                  </label>
                  <div className="relative">
                    <input
                      id="current-password"
                      type={showCurrentPassword ? 'text' : 'password'}
                      value={settingsData.currentPassword}
                      onChange={(e) => setSettingsData({ ...settingsData, currentPassword: e.target.value })}
                      placeholder="Verify current password to save changes"
                      className="w-full px-3 py-3 pr-10 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCurrentPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-100 transition-colors"
                      aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    >
                      {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={updatingSettings}
                    className="w-full sm:w-auto px-6 py-3 bg-brand-green hover:bg-brand-green/95 text-white font-bold text-sm rounded-xl shadow-sm cursor-pointer transition-transform duration-150 active:scale-95 disabled:bg-gray-300"
                  >
                    {updatingSettings ? 'Saving Settings...' : 'Save Settings / સેટિંગ્સ સાચવો'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* CAROUSEL SLIDES MANAGEMENT TAB */}
        {activeTab === 'carousel' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black text-text-slate">Hero Banner Carousel Management</h2>
                <p className="text-xs text-gray-500 font-semibold mt-1">
                  Manage the slides appearing in the customer landing page's main banner. Add, edit text/headings, or update background images.
                </p>
              </div>
              <button
                onClick={() => openSlideModal()}
                className="px-5 py-3 bg-brand-green hover:bg-brand-green/95 text-white font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-sm cursor-pointer transition-transform duration-200 active:scale-95 self-start sm:self-auto"
              >
                <Plus size={16} />
                <span>Add Banner Slide / નવું સ્લાઇડ ઉમેરો</span>
              </button>
            </div>

            {loadingCarousel ? (
              <div className="py-20 text-center">
                <div className="flex flex-col items-center gap-4">
                  <Mosaic color="#32cd32" size="medium" text="" textColor="" />
                  <p className="text-gray-500 text-sm font-semibold">Loading banner slides...</p>
                </div>
              </div>
            ) : carouselError ? (
              <div className="bg-red-50 border border-red-150 p-6 text-center rounded-2xl text-red-700">
                <AlertCircle size={32} className="mx-auto mb-2 opacity-80" />
                <p className="font-bold">{carouselError}</p>
                <button onClick={fetchCarouselSlides} className="mt-4 px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg cursor-pointer">Retry</button>
              </div>
            ) : carouselSlides.length === 0 ? (
              <div className="bg-white py-16 text-center rounded-2xl border border-gray-150 shadow-sm">
                <Upload size={40} className="mx-auto mb-2 text-brand-green/45" />
                <p className="text-gray-500 font-bold text-lg">No slides added yet.</p>
                <p className="text-xs text-gray-400 mt-1">Get started by clicking the "Add Banner Slide" button.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {carouselSlides.map((slide) => (
                  <div key={slide._id} className="bg-white dark:bg-zinc-900 border border-gray-150 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden flex flex-col justify-between text-text-slate dark:text-zinc-150">
                    <div className="relative aspect-[4/3] bg-gray-100 dark:bg-zinc-800">
                      <img src={slide.imageUrl} alt={slide.trustLabel} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-brand-gold-light dark:bg-brand-gold/20 border border-brand-gold/25 dark:border-brand-gold/40 text-brand-gold dark:text-brand-gold-light text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md">
                        Order: {slide.order}
                      </span>
                    </div>
                    
                    <div className="p-4 flex-grow space-y-3">
                      <div>
                        <span className="text-[10px] font-bold bg-brand-mint dark:bg-brand-green/20 text-brand-green dark:text-brand-mint px-2 py-0.5 rounded border border-brand-green/10 dark:border-brand-green/20">
                          {slide.badge}
                        </span>
                        <h3 className="font-display font-bold text-lg text-text-slate dark:text-zinc-100 mt-2 leading-snug">
                          {slide.headlineLocal}
                        </h3>
                        <p className="text-xs text-gray-600 dark:text-zinc-400 mt-1 line-clamp-2">
                          {slide.description}
                        </p>
                      </div>

                      <div className="bg-gray-50 dark:bg-zinc-800 p-2.5 rounded-xl border border-gray-100 dark:border-zinc-800/80 space-y-1">
                        <p className="text-[10px] font-semibold text-gray-400 dark:text-zinc-500 uppercase tracking-wider">Highlight & Trust:</p>
                        <p className="text-xs text-gray-650 dark:text-zinc-300 font-medium italic">"{slide.highlight}"</p>
                        <p className="text-xs text-text-slate dark:text-zinc-200 font-bold mt-1">✓ {slide.trustLabel} ({slide.trustSub})</p>
                      </div>
                    </div>

                    <div className="p-4 border-t border-gray-150 dark:border-zinc-800 bg-gray-50/50 dark:bg-zinc-800/30 flex items-center justify-end gap-2">
                      <button
                        onClick={() => openSlideModal(slide)}
                        className="px-3.5 py-1.5 border border-gray-200 dark:border-zinc-700 hover:border-brand-green/20 dark:hover:border-zinc-600 hover:bg-white dark:hover:bg-zinc-800 text-gray-600 dark:text-zinc-400 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Edit2 size={12} />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => confirmDeleteSlide(slide)}
                        className="px-3.5 py-1.5 border border-gray-200 dark:border-zinc-700 hover:border-red-200 dark:hover:border-red-800 hover:bg-red-50 dark:hover:bg-red-950/20 text-gray-400 dark:text-zinc-500 font-bold text-xs rounded-lg transition-all cursor-pointer flex items-center gap-1"
                      >
                        <Trash2 size={12} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* PRODUCT ADD/EDIT DYNAMIC FORM MODAL */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsFormModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" />
          
          <div className="relative bg-white dark:bg-zinc-900 w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-10 border border-gray-100 dark:border-zinc-800 flex flex-col text-text-slate dark:text-zinc-100">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-150 dark:border-zinc-800 flex items-center justify-between sticky top-0 bg-white dark:bg-zinc-900 z-10">
              <h3 className="text-xl font-bold text-text-slate dark:text-zinc-50">
                {editingProduct ? 'Edit Product / ફેરફાર કરો' : 'Add Product / નવું આઇટમ'}
              </h3>
              <button 
                onClick={() => setIsFormModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800 flex items-center justify-center text-gray-500 dark:text-zinc-400 hover:text-text-slate dark:hover:text-zinc-100 cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleProductFormSubmit} className="p-6 space-y-5 flex-grow">
              {formError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold text-gray-505 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="form-category">
                  Category *
                </label>
                <select
                  id="form-category"
                  name="category"
                  value={formData.category}
                  onChange={(e) => {
                    const category = e.target.value;
                    setFormData({ ...formData, category });
                    if (category === 'dairy') {
                      setDairyWeight('1 Kg');
                      setDairyPrice('');
                    }
                  }}
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                >
                  <option value="vegetable">Vegetable / શાકભાજી</option>
                  <option value="dairy">Dairy / ડેરી</option>
                </select>
              </div>

              {/* Name (English) */}
              <div>
                <label className="block text-xs font-bold text-gray-505 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="form-name">
                  Product Name (English) *
                </label>
                <input
                  id="form-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Tomatoes, Coriander, Paneer"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                />
              </div>

              {/* Name (Gujarati) */}
              <div>
                <label className="block text-xs font-bold text-gray-505 dark:text-zinc-400 uppercase tracking-wider mb-1" htmlFor="form-namelocal">
                  Local Name (Gujarati / Bilingual)
                </label>
                <input
                  id="form-namelocal"
                  type="text"
                  value={formData.nameLocal}
                  onChange={(e) => setFormData({ ...formData, nameLocal: e.target.value })}
                  placeholder="e.g. ટામેટા (Tomatoes)"
                  className="w-full px-3 py-2.5 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                />
              </div>

              {/* Image upload */}
              <div>
                <label className="block text-xs font-bold text-gray-505 dark:text-zinc-400 uppercase tracking-wider mb-1">
                  Product Photo *
                </label>
                
                <div className="flex gap-4 items-center mt-1">
                  {imagePreview ? (
                    <div className="relative w-20 h-20 rounded-xl border border-gray-150 dark:border-zinc-800 overflow-hidden shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setImagePreview(''); setImageFile(null); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 dark:border-zinc-700 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 dark:hover:bg-zinc-850 cursor-pointer transition-colors text-gray-400 dark:text-zinc-500">
                      <Upload size={18} />
                      <span className="text-[10px] font-bold mt-1">Select</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-xs text-gray-550 dark:text-zinc-400">
                    <p className="font-semibold">Click to upload photo.</p>
                    <p className="mt-0.5">JPEG, PNG allowed (Max 5MB). Images will be resized automatically.</p>
                  </div>
                </div>
              </div>

              {/* DYNAMIC FORM SECTION: pricing based on selected category */}
              <div className="bg-gray-50 dark:bg-zinc-850/50 p-4 rounded-2xl border border-gray-150 dark:border-zinc-800">
                <h4 className="text-xs font-extrabold text-gray-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                  Pricing Settings ({formData.category === 'vegetable' ? 'Vegetable' : 'Dairy'})
                </h4>
                
                {formData.category === 'vegetable' ? (
                  /* Vegetables Variant Pricing (250g, 500g, 1Kg required) */
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-505 dark:text-zinc-400 mb-1" htmlFor="p-250">
                        250g Price (₹) *
                      </label>
                      <input
                        id="p-250"
                        type="number"
                        min="0"
                        value={vegPrices.price250}
                        onChange={(e) => setVegPrices({ ...vegPrices, price250: e.target.value })}
                        placeholder="e.g. 50"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-505 dark:text-zinc-400 mb-1" htmlFor="p-500">
                        500g Price (₹) *
                      </label>
                      <input
                        id="p-500"
                        type="number"
                        min="0"
                        value={vegPrices.price500}
                        onChange={(e) => setVegPrices({ ...vegPrices, price500: e.target.value })}
                        placeholder="e.g. 90"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-505 dark:text-zinc-400 mb-1" htmlFor="p-1000">
                        1 Kg Price (₹) *
                      </label>
                      <input
                        id="p-1000"
                        type="number"
                        min="0"
                        value={vegPrices.price1000}
                        onChange={(e) => setVegPrices({ ...vegPrices, price1000: e.target.value })}
                        placeholder="e.g. 160"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 max-w-2xl md:grid-cols-2">
                    <div>
                      <label className="block text-[11px] font-bold text-gray-505 dark:text-zinc-400 mb-1" htmlFor="dairy-weight">
                        Dairy Weight Option *
                      </label>
                      <select
                        id="dairy-weight"
                        value={dairyWeight}
                        onChange={(e) => setDairyWeight(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100"
                      >
                        <option value="250g">250g</option>
                        <option value="500g">500g</option>
                        <option value="500ml">500ml</option>
                        <option value="1 Kg">1 Kg</option>
                        <option value="1 Litre">1 Litre</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-gray-505 dark:text-zinc-400 mb-1" htmlFor="dairy-price">
                        Price (₹) *
                      </label>
                      <input
                        id="dairy-price"
                        type="number"
                        min="0"
                        value={dairyPrice}
                        onChange={(e) => setDairyPrice(e.target.value)}
                        placeholder="e.g. 1200"
                        className="w-full px-3 py-2 border border-gray-200 dark:border-zinc-700 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100 placeholder:text-gray-500 dark:placeholder:text-zinc-400"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Availability Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="form-is-available"
                  name="isAvailable"
                  type="checkbox"
                  checked={formData.isAvailable}
                  onChange={(e) => setFormData({ ...formData, isAvailable: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-green focus:ring-brand-green border-gray-300 cursor-pointer"
                />
                <label htmlFor="form-is-available" className="text-sm font-bold text-text-slate dark:text-zinc-200 cursor-pointer">
                  Available for orders today / આજે સ્ટોક માં છે
                </label>
              </div>

              {/* Special Deal Checkbox */}
              <div className="flex items-center gap-2">
                <input
                  id="form-special-deal"
                  name="specialDeal"
                  type="checkbox"
                  checked={formData.specialDeal}
                  onChange={(e) => setFormData({ ...formData, specialDeal: e.target.checked })}
                  className="w-4 h-4 rounded text-brand-gold focus:ring-brand-gold border-gray-300 cursor-pointer"
                />
                <label htmlFor="form-special-deal" className="text-sm font-bold text-text-slate dark:text-zinc-200 cursor-pointer">
                  Special Deal / વિશેષ ડીલ
                </label>
              </div>
 
              {/* Submit CTA */}
              <div className="pt-3 border-t border-gray-150 dark:border-zinc-800 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsFormModalOpen(false)}
                  type="button"
                  className="px-4 py-2 border border-gray-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800 rounded-xl text-xs font-bold text-gray-650 dark:text-zinc-400 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingProduct}
                  className="px-6 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white text-xs font-bold rounded-xl shadow-sm disabled:bg-gray-300 cursor-pointer transition-colors"
                >
                  {submittingProduct ? 'Saving Item...' : 'Save Product'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsDeleteModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl z-10 border border-gray-100 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-650 mx-auto">
              <ShieldAlert size={24} />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-text-slate">Confirm Product Deletion</h3>
              <p className="text-xs text-gray-500 font-medium">
                Are you absolutely sure you want to delete <strong className="text-text-slate">{productToDelete?.name}</strong>? This action is permanent and cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteProduct}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CAROUSEL SLIDE ADD/EDIT FORM MODAL */}
      {isCarouselModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsCarouselModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-[2px] transition-opacity" />
          
          <div className="relative bg-white w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl z-10 border border-gray-100 flex flex-col">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-150 flex items-center justify-between sticky top-0 bg-white z-10">
              <h3 className="text-xl font-bold text-text-slate">
                {editingSlide ? 'Edit Carousel Slide / સ્લાઇડ ફેરફાર' : 'Add Carousel Slide / નવી સ્લાઇડ ઉમેરો'}
              </h3>
              <button 
                onClick={() => setIsCarouselModalOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-500 hover:text-text-slate cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleSlideFormSubmit} className="p-6 space-y-4 flex-grow">
              {slideFormError && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-xl flex items-center gap-2 text-xs font-bold">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{slideFormError}</span>
                </div>
              )}

              {/* Gujarati Headline */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="slide-headline">
                  Gujarati Headline * / મુખ્ય હેડલાઇન (ગુજરાતી) *
                </label>
                <input
                  id="slide-headline"
                  type="text"
                  required
                  value={slideData.headlineLocal}
                  onChange={(e) => setSlideData({ ...slideData, headlineLocal: e.target.value })}
                  placeholder="e.g. એક દિવસ પહેલા ઓર્ડર આપો અને મેળવો ફ્રી હોમ ડિલિવરી"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                />
              </div>

              {/* Badge Text */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="slide-badge">
                  Promotion Badge Text (Bilingual) *
                </label>
                <input
                  id="slide-badge"
                  type="text"
                  required
                  value={slideData.badge}
                  onChange={(e) => setSlideData({ ...slideData, badge: e.target.value })}
                  placeholder="e.g. Free Delivery Offer • ફ્રી હોમ ડિલિવરી ઓફર"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="slide-desc">
                  Description Text (English) *
                </label>
                <textarea
                  id="slide-desc"
                  required
                  rows="2"
                  value={slideData.description}
                  onChange={(e) => setSlideData({ ...slideData, description: e.target.value })}
                  placeholder="Describe this banner feature..."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all resize-none text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                />
              </div>

              {/* Highlight */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="slide-highlight">
                  Highlight Offer / Subtext note *
                </label>
                <input
                  id="slide-highlight"
                  type="text"
                  required
                  value={slideData.highlight}
                  onChange={(e) => setSlideData({ ...slideData, highlight: e.target.value })}
                  placeholder="e.g. Dispatched fresh every evening to ensure maximum nutritional value."
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm transition-all text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                />
              </div>

              {/* Trust Badge and Sub */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1" htmlFor="slide-trust-label">
                    Trust Badge Label *
                  </label>
                  <input
                    id="slide-trust-label"
                    type="text"
                    required
                    value={slideData.trustLabel}
                    onChange={(e) => setSlideData({ ...slideData, trustLabel: e.target.value })}
                    placeholder="e.g. 100% Weighed Fresh"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-500 mb-1" htmlFor="slide-trust-sub">
                    Trust Sub-label (Gujarati) *
                  </label>
                  <input
                    id="slide-trust-sub"
                    type="text"
                    required
                    value={slideData.trustSub}
                    onChange={(e) => setSlideData({ ...slideData, trustSub: e.target.value })}
                    placeholder="e.g. ટોચની ગુણવત્તા"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm font-semibold text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Order index */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1" htmlFor="slide-order">
                  Display Order *
                </label>
                <input
                  id="slide-order"
                  type="number"
                  required
                  min="0"
                  value={slideData.order}
                  onChange={(e) => setSlideData({ ...slideData, order: Number(e.target.value) })}
                  placeholder="e.g. 0, 1, 2"
                  className="w-24 px-3 py-2 border border-gray-200 rounded-xl bg-transparent focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/20 text-sm text-text-slate dark:text-zinc-100 placeholder:text-gray-500"
                />
              </div>

              {/* Slide image upload */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">
                  Banner Photo *
                </label>
                
                <div className="flex gap-4 items-center mt-1">
                  {slideImagePreview ? (
                    <div className="relative w-20 h-20 rounded-xl border border-gray-150 overflow-hidden shrink-0">
                      <img src={slideImagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => { setSlideImagePreview(''); setSlideImageFile(null); }}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-red-600 text-white flex items-center justify-center cursor-pointer shadow"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ) : (
                    <label className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center hover:bg-gray-50 cursor-pointer transition-colors text-gray-400">
                      <Upload size={18} />
                      <span className="text-[10px] font-bold mt-1">Select</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleSlideImageChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <div className="text-xs text-gray-500">
                    <p className="font-semibold">Click to upload photo.</p>
                    <p className="mt-0.5">JPEG, PNG, AVIF allowed (Max 5MB).</p>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-3 border-t border-gray-150 flex items-center justify-end gap-3">
                <button
                  onClick={() => setIsCarouselModalOpen(false)}
                  type="button"
                  className="px-4 py-2 border border-gray-200 hover:bg-gray-50 rounded-xl text-xs font-bold text-gray-600 cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submittingSlide}
                  className="px-6 py-2.5 bg-brand-green hover:bg-brand-green/95 text-white text-xs font-bold rounded-xl shadow-sm disabled:bg-gray-300 cursor-pointer transition-colors"
                >
                  {submittingSlide ? 'Saving Slide...' : 'Save Banner'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE SLIDE MODAL */}
      {isDeleteSlideModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsDeleteSlideModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
          
          <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-xl z-10 border border-gray-100 p-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-650 mx-auto">
              <ShieldAlert size={24} />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-lg font-bold text-text-slate">Confirm Banner Slide Deletion</h3>
              <p className="text-xs text-gray-500 font-medium">
                Are you absolutely sure you want to delete banner slide <strong className="text-text-slate">{slideToDelete?.headlineLocal}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center gap-3 justify-center">
              <button
                onClick={() => setIsDeleteSlideModalOpen(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold rounded-lg cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={executeDeleteSlide}
                className="px-4 py-2 bg-red-600 hover:bg-red-750 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
