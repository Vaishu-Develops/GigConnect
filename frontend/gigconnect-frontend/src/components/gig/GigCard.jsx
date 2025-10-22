import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, Calendar, User } from 'lucide-react';
import Card from '../ui/Card';

const GigCard = ({ gig }) => {
  return (
    <Card hover className="h-full">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-lg mb-2 line-clamp-2">
              {gig.title}
            </h3>
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <User size={14} className="mr-1" />
              {gig.client?.name || 'Client'}
            </div>
            <div className="flex items-center text-gray-600 text-sm">
              <MapPin size={14} className="mr-1" />
              {gig.location}
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
          {gig.description}
        </p>

        {/* Skills */}
        {gig.skillsRequired && gig.skillsRequired.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {gig.skillsRequired.slice(0, 3).map((skill, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-secondary/10 text-secondary rounded text-xs font-medium"
              >
                {skill}
              </span>
            ))}
            {gig.skillsRequired.length > 3 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                +{gig.skillsRequired.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-between items-center">
          <div className="flex items-center text-green-600 font-semibold">
            <IndianRupee size={16} className="mr-1" />
            {gig.budget}
          </div>
          <Link
            to={`/gigs/${gig._id}`}
            className="text-secondary hover:text-blue-600 font-medium text-sm transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default GigCard;