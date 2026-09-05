import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useProducts } from '../../context/ProductContext';
import { firebaseEnabled, uploadProductImage } from '../../lib/firebase';
import './ProductFormModal.css';

export const ProductFormModal = ({ onClose, product = null, onUpdate, language = 'en' }) => {
  const { addProduct } = useProducts();
  const isHindi = language === 'hi';
  const text = isHindi ? {
    edit: 'प्रोडक्ट कीमत एडिट करें', add: 'नया प्रोडक्ट जोड़ें', name: 'प्रोडक्ट नाम',
    price: 'कीमत (₹)', discount: 'डिस्काउंट (%)', category: 'कैटेगरी', shape: 'फ्रेम शेप',
    image: 'प्रोडक्ट इमेज', cancel: 'कैंसल', update: 'प्रोडक्ट अपडेट करें', save: 'प्रोडक्ट सेव करें',
    choose: 'अपने डिवाइस से इमेज चुनें। अधिकतम साइज़: 5 MB।'
  } : {
    edit: 'Edit Product Price', add: 'Add New Product', name: 'Product Name', price: 'Price (₹)',
    discount: 'Discount (%)', category: 'Category', shape: 'Frame Shape', image: 'Product Image',
    cancel: 'Cancel', update: 'Update Product', save: 'Save Product',
    choose: 'Select an image directly from your device. Maximum size: 5 MB.'
  };
  
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || '',
    discount: product?.discount || '',
    category: product?.category || 'eyeglasses',
    type: product?.type || 'Eyeglasses',
    shape: product?.shape || 'Rectangle',
    image: product?.image || product?.images?.[0] || ''
  });
  const [imageError, setImageError] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSaving) return;
    setSaveError('');
    setIsSaving(true);
    let selectedImage = formData.image;
    if (firebaseEnabled && selectedFile) {
      try {
        selectedImage = await uploadProductImage(selectedFile);
      } catch (error) {
        setImageError('Image upload failed. Please try again.');
        setIsSaving(false);
        return;
      }
    }

    try {
      if (product) {
        onUpdate(product.id, { ...formData, image: selectedImage });
        onClose();
        return;
      }

      const newProduct = {
        name: formData.name,
        price: Number(formData.price),
        discount: formData.discount ? Number(formData.discount) : null,
        category: formData.category,
        type: formData.type,
        shape: formData.shape,
        image: selectedImage || '/images/pill_eyeglasses.png',
        hoverImage: selectedImage || '/images/pill_sunglasses.png',
        originalPrice: Number(formData.price),
        tags: ['new-arrivals'],
      };

      await addProduct(newProduct);
      onClose();
    } catch (error) {
      setSaveError('Product could not be saved. Check Firebase Firestore permissions and try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setImageError('Please select an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setImageError('Image size must be under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      setSelectedFile(file);
      setFormData((prev) => ({ ...prev, image: reader.result }));
      setImageError('');
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="admin-modal-overlay">
      <div className="admin-modal-content">
        <div className="admin-modal-header">
          <h2>{product ? text.edit : text.add}</h2>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="admin-form">
          <div className="form-group">
            <label>{text.name}</label>
            <input 
              type="text" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
              placeholder="e.g. Golden Aviator Premium"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{text.price}</label>
              <input 
                type="number" 
                name="price" 
                value={formData.price} 
                onChange={handleChange} 
                required 
                placeholder="e.g. 1299"
              />
            </div>
            <div className="form-group">
              <label>{text.discount}</label>
              <input 
                type="number" 
                name="discount" 
                value={formData.discount} 
                onChange={handleChange} 
                placeholder="e.g. 15 (Optional)"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>{text.category}</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option value="eyeglasses">Eyeglasses</option>
                <option value="sunglasses">Sunglasses</option>
                <option value="turban-friendly">Turban Friendly</option>
                <option value="computer-glasses">Computer Glasses</option>
                <option value="clip-on">Clip-on</option>
                <option value="day-night">Day-Night Photochromic</option>
              </select>
            </div>
            <div className="form-group">
              <label>{text.shape}</label>
              <select name="shape" value={formData.shape} onChange={handleChange}>
                <option value="Rectangle">Rectangle</option>
                <option value="Square">Square</option>
                <option value="Round">Round</option>
                <option value="Aviator">Aviator</option>
                <option value="Cat Eye">Cat Eye</option>
                <option value="Wayfarer">Wayfarer</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>{text.image}</label>
            <input 
              type="file"
              accept="image/*"
              onChange={handleImageChange}
            />
            <small>{text.choose}</small>
            {imageError && <small className="image-error">{imageError}</small>}
            {formData.image && <img src={formData.image} alt="Selected product preview" className="product-image-preview" />}
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>{text.cancel}</button>
            <button type="submit" className="btn-save" disabled={isSaving}>{isSaving ? 'Saving...' : product ? text.update : text.save}</button>
          </div>
          {saveError && <small className="save-error">{saveError}</small>}
        </form>
      </div>
    </div>
  );
};
