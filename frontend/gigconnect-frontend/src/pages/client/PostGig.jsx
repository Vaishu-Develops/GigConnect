import React from 'react';
import GigForm from '../../components/gig/GigForm';

const PostGig = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Post a New Gig
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe your project and find the perfect freelancer for the job
          </p>
        </div>
        <GigForm mode="create" />
      </div>
    </div>
  );
};

export default PostGig;