import { getMessageForLanguage } from '../translations';

/**
 * Convert South African phone number to international format for WhatsApp
 */
export const formatPhoneForWhatsApp = (phone) => {
  if (!phone) return '';
  
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('+27')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('0027')) {
    cleaned = cleaned.substring(2);
  } else if (cleaned.startsWith('0')) {
    cleaned = '27' + cleaned.substring(1);
  } else if (!cleaned.startsWith('27')) {
    cleaned = '27' + cleaned;
  }
  
  return cleaned;
};

/**
 * Get button label based on order status
 */
export const getWhatsAppButtonLabel = (status) => {
  switch (status) {
    case 'Pending':
      return '💬 Request Payment';
    case 'Processing':
      return '💬 Notify: Preparing';
    case 'Shipped':
      return '💬 Notify: Shipped';
    case 'Delivered':
      return '💬 Thank Customer';
    case 'Cancelled':
      return '💬 Notify: Cancelled';
    default:
      return '💬 WhatsApp Buyer';
  }
};

/**
 * Open WhatsApp Web with pre-filled message to buyer in their preferred language
 */
export const sendWhatsAppToBuyer = (order, bankDetails) => {
  const phone = formatPhoneForWhatsApp(order.phoneNumber);
  
  if (!phone) {
    alert('Invalid phone number');
    return;
  }
  
  // 🆕 Get message in buyer's preferred language from JSON files
  const message = getMessageForLanguage(
    order.language || 'English',
    order.status,
    order,
    bankDetails
  );
  
  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
};