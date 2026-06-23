/**
 * Translation Loader for Fastlane WhatsApp Messages
 * Loads JSON files for each South African official language
 */

// Import all language JSON files
import en from './en.json';
import zu from './zu.json';
import xh from './xh.json';
import af from './af.json';
import nso from './nso.json';
import tn from './tn.json';
import ts from './ts.json';
import ss from './ss.json';
import ve from './ve.json';
import nr from './nr.json';
import st from './st.json';

// Map language names to their JSON imports
const translations = {
  'English': en,
  'Zulu': zu,
  'Xhosa': xh,
  'Afrikaans': af,
  'Sepedi': nso,
  'Setswana': tn,
  'Sesotho': st,
  'Tsonga': ts,
  'Swati': ss,
  'Venda': ve,
  'Ndebele': nr,
};

// Alternative language name mappings (in case of variations)
const languageAliases = {
  'English': 'English',
  'en': 'English',
  'Zulu': 'Zulu',
  'isiZulu': 'Zulu',
  'zu': 'Zulu',
  'Xhosa': 'Xhosa',
  'isiXhosa': 'Xhosa',
  'xh': 'Xhosa',
  'Afrikaans': 'Afrikaans',
  'af': 'Afrikaans',
  'Sepedi': 'Sepedi',
  'Northern Sotho': 'Sepedi',
  'Pedi': 'Sepedi',
  'nso': 'Sepedi',
  'Setswana': 'Setswana',
  'Tswana': 'Setswana',
  'tn': 'Setswana',
  'Sesotho': 'Sesotho',
  'Sotho': 'Sesotho',
  'st': 'Sesotho',
  'Tsonga': 'Tsonga',
  'Xitsonga': 'Tsonga',
  'ts': 'Tsonga',
  'Swati': 'Swati',
  'siSwati': 'Swati',
  'Swazi': 'Swati',
  'ss': 'Swati',
  'Venda': 'Venda',
  'Tshivenda': 'Venda',
  've': 'Venda',
  'Ndebele': 'Ndebele',
  'isiNdebele': 'Ndebele',
  'nr': 'Ndebele',
};

/**
 * Get the canonical language key from any alias
 */
const getLanguageKey = (language) => {
  if (!language) return 'English';
  
  // Direct match
  if (translations[language]) return language;
  
  // Alias match
  const aliasKey = languageAliases[language];
  if (aliasKey && translations[aliasKey]) return aliasKey;
  
  // Default fallback
  return 'English';
};

/**
 * Replace template variables in a string with actual values
 * Template format: {{variableName}}
 */
const replaceTemplateVars = (template, variables) => {
  if (!template) return '';
  
  let result = template;
  Object.keys(variables).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(regex, variables[key] || '');
  });
  
  return result;
};

/**
 * Format currency in South African Rand
 */
const formatMoney = (amount) => {
  return parseFloat(amount || 0).toFixed(2);
};

/**
 * Format date in South African format
 */
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-ZA', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
};

/**
 * Format address for WhatsApp display
 */
const formatAddress = (addressString) => {
  if (!addressString) return '';
  const parts = addressString.split(',').map(p => p.trim());
  return ` ${parts[0] || ''}\n ${parts[1] || ''}, ${parts[2] || ''}\n ${parts[3] || ''}`;
};

/**
 * Format items list (with or without prices)
 */
const formatItemsList = (items, includePrice = true) => {
  if (!items || items.length === 0) return '';
  
  return items
    .map(item => {
      if (includePrice) {
        return `• ${item.productName} x${item.quantity} = R${formatMoney(item.price * item.quantity)}`;
      }
      return `• ${item.productName} x${item.quantity}`;
    })
    .join('\n');
};

/**
 * Build all template variables from order and bank details
 */
const buildVariables = (order, bankDetails) => {
  // Build delivery footer first (it's used inside messages)
  const langKey = getLanguageKey(order.language);
  const langData = translations[langKey] || translations['English'];
  
  const deliveryFooter = replaceTemplateVars(langData.deliveryFooter, {
    deliveryFee: formatMoney(order.deliveryFee),
  });
  
  return {
    // Order details
    orderNumber: order.orderNumber || '',
    orderDate: formatDate(order.createdAt),
    buyerName: order.buyerName || '',
    buyerSurname: order.buyerSurname || '',
    phoneNumber: order.phoneNumber || '',
    language: order.language || 'English',
    gender: order.gender || 'Prefer not to say',
    status: order.status || '',
    
    // Address
    formattedAddress: formatAddress(order.address),
    
    // Items
    itemsList: formatItemsList(order.items, false),
    itemsListWithPrices: formatItemsList(order.items, true),
    
    // Money
    subtotal: formatMoney(order.subtotal),
    deliveryFee: formatMoney(order.deliveryFee),
    total: formatMoney(order.total),
    
    // Bank details
    businessName: bankDetails.businessName || 'Fastlane Retail',
    bankName: bankDetails.bankName || '',
    accountHolder: bankDetails.accountHolder || '',
    accountNumber: bankDetails.accountNumber || '',
    // branchCode: bankDetails.branchCode || '',
    // referencePrefix: bankDetails.referencePrefix || 'ORD',

    // 🆕 NEW: Account card image URL
    accountCardImage: bankDetails.accountCardImage || '',
    
    // Delivery footer (pre-rendered)
    deliveryFooter: deliveryFooter,
  };
};

/**
 * Get a translated message for a specific language and order status
 * 
 * @param {string} language - The buyer's preferred language
 * @param {string} status - Order status (Pending, Processing, Shipped, Delivered, Cancelled)
 * @param {Object} order - The order object
 * @param {Object} bankDetails - Bank details object
 * @returns {string} - The translated message with all variables replaced
 */
export const getMessageForLanguage = (language, status, order, bankDetails) => {
  const langKey = getLanguageKey(language);
  const langData = translations[langKey] || translations['English'];
  
  // Map order status to message key
  const statusMap = {
    'Pending': 'pending',
    'Processing': 'processing',
    'Shipped': 'shipped',
    'Delivered': 'delivered',
    'Cancelled': 'cancelled',
  };
  
  const messageKey = statusMap[status];
  if (!messageKey) {
    console.warn(`Unknown order status: ${status}`);
    return '';
  }
  
  // Get the template
  const template = langData[messageKey];
  if (!template) {
    console.warn(`Missing translation for ${langKey}.${messageKey}, falling back to English`);
    const fallback = translations['English'][messageKey];
    if (!fallback) return '';
    
    const variables = buildVariables(order, bankDetails);
    return replaceTemplateVars(fallback, variables);
  }
  
  // Build variables and replace
  const variables = buildVariables(order, bankDetails);
  return replaceTemplateVars(template, variables);
};

/**
 * Get all supported languages
 */
export const getSupportedLanguages = () => {
  return Object.keys(translations).map(key => ({
    code: key,
    name: translations[key].languageName,
  }));
};

/**
 * Check if a language is supported
 */
export const isLanguageSupported = (language) => {
  const key = getLanguageKey(language);
  return !!translations[key];
};

// Export the translations object for direct access if needed
export { translations };