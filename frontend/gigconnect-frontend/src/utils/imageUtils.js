/**
 * Utility function to get a safe image URL with proper fallback
 * @param {string} imageUrl - The image URL to validate
 * @param {string} fallbackUrl - The fallback URL (default: '/robot.png')
 * @returns {string} A valid image URL
 */
export const getSafeImageUrl = (imageUrl, fallbackUrl = '/robot.png') => {
  // Check if imageUrl is a valid, non-empty string
  if (imageUrl && typeof imageUrl === 'string' && imageUrl.trim().length > 0) {
    const trimmed = imageUrl.trim();
    
    // Basic URL validation - check if it looks like a URL
    if (trimmed.startsWith('http') || trimmed.startsWith('/') || trimmed.startsWith('data:')) {
      return trimmed;
    }
  }
  
  return fallbackUrl;
};

/**
 * Get safe avatar URL for user objects
 * @param {object} user - User object with potential avatar/profilePicture fields
 * @returns {string} A valid avatar URL
 */
export const getSafeAvatarUrl = (user) => {
  if (!user) {
    return '/robot.png';
  }
  
  // Try avatar field first, then profilePicture field
  const avatar = getSafeImageUrl(user.avatar, '/robot.png');
  if (avatar !== '/robot.png') return avatar;
  
  const profilePicture = getSafeImageUrl(user.profilePicture, '/robot.png');
  if (profilePicture !== '/robot.png') return profilePicture;
  
  // Always return robot.png as default for all users
  return '/robot.png';
};

/**
 * Get safe project image URL for portfolio items
 * @param {object} item - Portfolio item with potential imageUrl field
 * @returns {string} A valid project image URL
 */
export const getSafeProjectImageUrl = (item) => {
  if (!item) return '/robot.png';
  
  return getSafeImageUrl(item.imageUrl, '/robot.png');
};