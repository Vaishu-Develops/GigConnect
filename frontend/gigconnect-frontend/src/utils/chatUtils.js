import { chatService } from '../services/chatService';

export const navigateToChat = async (userId, navigate) => {
  try {
    // First, try to create or get existing chat with this user
    const response = await chatService.createChat(userId);
    
    if (response.success || response.chat) {
      const chatId = response.chat?._id || response.chatId;
      // Navigate to the actual chat
      navigate(`/messages/${chatId}`);
    } else {
      throw new Error('Failed to create chat');
    }
  } catch (error) {
    console.error('Failed to navigate to chat:', error);
    
    // Fallback: try to find existing chat from user's chat list
    try {
      const chats = await chatService.getUserChats();
      const existingChat = chats.find(chat => 
        chat.participants.some(p => p._id === userId)
      );
      
      if (existingChat) {
        navigate(`/messages/${existingChat._id}`);
      } else {
        // If all fails, go to messages page and let user create chat manually
        navigate('/messages');
        alert('Unable to start chat. Please try messaging from the Messages page.');
      }
    } catch (fallbackError) {
      console.error('Fallback chat navigation failed:', fallbackError);
      navigate('/messages');
      alert('Unable to start chat. Please try again from the Messages page.');
    }
  }
};