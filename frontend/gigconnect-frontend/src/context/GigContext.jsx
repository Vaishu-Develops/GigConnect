import React, { createContext, useState, useContext, useEffect } from 'react';
import { gigService } from '../services/gigService';

const GigContext = createContext();

export const useGig = () => {
  const context = useContext(GigContext);
  if (!context) {
    throw new Error('useGig must be used within GigProvider');
  }
  return context;
};

export const GigProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({});

  const loadGigs = async (newFilters = {}) => {
    setLoading(true);
    try {
      const gigsData = await gigService.getGigs(newFilters);
      setGigs(gigsData);
      setFilters(newFilters);
    } catch (error) {
      console.error('Failed to load gigs:', error);
    } finally {
      setLoading(false);
    }
  };

  const createGig = async (gigData) => {
    try {
      const newGig = await gigService.createGig(gigData);
      setGigs(prev => [newGig, ...prev]);
      return { success: true, gig: newGig };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to create gig' 
      };
    }
  };

  const updateGig = async (id, gigData) => {
    try {
      const updatedGig = await gigService.updateGig(id, gigData);
      setGigs(prev => prev.map(gig => 
        gig._id === id ? updatedGig : gig
      ));
      return { success: true, gig: updatedGig };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to update gig' 
      };
    }
  };

  const deleteGig = async (id) => {
    try {
      await gigService.deleteGig(id);
      setGigs(prev => prev.filter(gig => gig._id !== id));
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        message: error.response?.data?.message || 'Failed to delete gig' 
      };
    }
  };

  useEffect(() => {
    loadGigs();
  }, []);

  const value = {
    gigs,
    loading,
    filters,
    loadGigs,
    createGig,
    updateGig,
    deleteGig
  };

  return (
    <GigContext.Provider value={value}>
      {children}
    </GigContext.Provider>
  );
};