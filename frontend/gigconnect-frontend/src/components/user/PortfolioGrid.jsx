import React, { useState } from 'react';
import Modal from '../ui/Modal';

const PortfolioGrid = ({ items = [], isOwnProfile = false, onAddItem, onDeleteItem }) => {
  console.log('PortfolioGrid received items:', items);
  
  // Filter out any undefined, null, or invalid items
  const validItems = items.filter(item => 
    item && 
    typeof item === 'object' && 
    item._id && 
    item.title
  );

  console.log('Valid portfolio items after filtering:', validItems);
  console.log('Items that were filtered out:', items.filter(item => !item || typeof item !== 'object' || !item._id || !item.title));

  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const openItem = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  if (validItems.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎨</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {isOwnProfile ? 'No portfolio items yet' : 'No portfolio available'}
        </h3>
        <p className="text-gray-600 mb-4">
          {isOwnProfile 
            ? 'Showcase your best work to attract more clients'
            : 'This freelancer hasn\'t added any portfolio items yet'
          }
        </p>
        {isOwnProfile && (
          <button
            onClick={onAddItem}
            className="bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300"
          >
            Add Portfolio Item
          </button>
        )}
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {validItems.map((item, index) => (
          <div
            key={item._id || index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-300 cursor-pointer group overflow-hidden m-2"
            onClick={() => openItem(item)}
          >
            {/* Image Section */}
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden relative">
              {item?.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item?.title || 'Portfolio item'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/robot.png';
                    e.target.onerror = null;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-4xl mb-2">🖼️</div>
                    <p className="text-sm">No Image</p>
                  </div>
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-3 py-1 bg-emerald-500 text-white text-xs font-medium rounded-full shadow-sm">
                  {item?.category || 'Other'}
                </span>
              </div>
            </div>
            
            {/* Content Section */}
            <div className="p-6">
              <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-1 group-hover:text-emerald-600 transition-colors">
                {item?.title || 'Untitled Project'}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-3 mb-4 leading-relaxed">
                {item?.description || 'No description available'}
              </p>
              
              {/* Project URL */}
              {item?.projectUrl && (
                <div className="mb-4">
                  <a
                    href={item.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center text-emerald-600 hover:text-emerald-700 text-sm font-medium"
                  >
                    🔗 View Project
                  </a>
                </div>
              )}
              
              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-xs text-gray-500 flex items-center">
                  📅 {item?.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Unknown date'}
                </span>
                
                {isOwnProfile && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm('Are you sure you want to delete this portfolio item?')) {
                        onDeleteItem(item?._id);
                      }
                    }}
                    className="text-red-500 hover:text-red-700 text-sm font-medium px-2 py-1 rounded hover:bg-red-50 transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Portfolio Item Modal */}
      <Modal
        isOpen={showModal}
        onClose={closeModal}
        size="lg"
        title={selectedItem?.title}
      >
        {selectedItem && (
          <div className="space-y-4">
            {selectedItem.imageUrl && (
              <img
                src={selectedItem.imageUrl}
                alt={selectedItem.title}
                className="w-full h-64 object-cover rounded-lg"
              />
            )}
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700 leading-relaxed">
                {selectedItem.description}
              </p>
            </div>

            {selectedItem.projectUrl && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Project Link</h4>
                <a
                  href={selectedItem.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {selectedItem.projectUrl}
                </a>
              </div>
            )}

            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Category: {selectedItem.category}</span>
              <span>Date: {new Date(selectedItem.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PortfolioGrid;