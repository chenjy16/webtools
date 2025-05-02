// Helper to generate a random string
export const generateRandomString = (length = 10, chars = 'abcdefghijklmnopqrstuvwxyz0123456789') => {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

// Format date string
export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  } catch (e) {
    console.error("Error formatting date:", dateString, e);
    return 'Invalid Date';
  }
};

// Render HTML content
export const renderHtmlContent = (html) => {
  return { __html: html };
};

// Copy to clipboard
export const copyToClipboard = async (text, showSnackbar) => {
  if (!navigator.clipboard) {
    showSnackbar('Sorry, your browser does not support clipboard functionality.', 'error');
    return;
  }
  
  try {
    await navigator.clipboard.writeText(text);
    showSnackbar('Copied to clipboard.', 'success');
  } catch (err) {
    console.error('Failed to copy text: ', err);
    showSnackbar('Failed to copy.', 'error');
  }
};