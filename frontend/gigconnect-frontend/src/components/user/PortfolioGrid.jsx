import React, { useState } from 'react';
import Modal from '../ui/Modal';

const PortfolioGrid = ({ items = [], isOwnProfile = false, onAddItem, onDeleteItem }) => {
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

  if (items.length === 0) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, index) => (
          <div
            key={item._id || index}
            className="card hover:shadow-lg transition-all duration-300 cursor-pointer group"
            onClick={() => openItem(item)}
          >
            <div className="aspect-video bg-gray-200 rounded-t-xl overflow-hidden">
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  🖼️
                </div>
              )}
            </div>
            
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {item.title}
              </h3>
              <p className="text-gray-600 text-sm line-clamp-2 mb-3">
                {item.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {item.category}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {isOwnProfile && (
              <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteItem(item._id);
                  }}
                  className="text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Delete
                </button>
              </div>
            )}
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