import React, { createContext, useState, useContext } from 'react';
import { gigService } from '../services/gigService';

const GigContext = createContext();

export const useGig = () => {
  const context = useContext(GigContext);
  if (!context) {
    throw new Error('useGig must be used within a GigProvider');
  }
  return context;
};

export const GigProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);
  const [currentGig, setCurrentGig] = useState(null);
  const [loading, setLoading] = useState(false);

  const createGig = async (gigData) => {
    setLoading(true);
    try {
      const newGig = await gigService.createGig(gigData);
      setGigs(prev => [newGig, ...prev]);
      return newGig;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateGig = async (gigId, gigData) => {
    setLoading(true);
    try {
      const updatedGig = await gigService.updateGig(gigId, gigData);
      setGigs(prev => prev.map(gig => gig._id === gigId ? updatedGig : gig));
      return updatedGig;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteGig = async (gigId) => {
    setLoading(true);
    try {
      await gigService.deleteGig(gigId);
      setGigs(prev => prev.filter(gig => gig._id !== gigId));
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchGigs = async (filters = {}) => {
    setLoading(true);
    try {
      const gigsData = await gigService.getGigs(filters);
      setGigs(gigsData);
      return gigsData;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const fetchGigById = async (gigId) => {
    setLoading(true);
    try {
      const gig = await gigService.getGigById(gigId);
      setCurrentGig(gig);
      return gig;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    gigs,
    currentGig,
    loading,
    createGig,
    updateGig,
    deleteGig,
    fetchGigs,
    fetchGigById,
  };

  return (
    <GigContext.Provider value={value}>
      {children}
    </GigContext.Provider>
  );
};