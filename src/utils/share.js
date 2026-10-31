/**
 * Sharing utility for Yashal Dresses products
 * - Strictly detects mobile by OS (Android / iOS) - NEVER by screen width/size
 * - Native OS share sheet on Android / iOS (opens system drawer with apps + copy link)
 * - Desktop modal at top right with WhatsApp & Copy Link
 */

export function getProductShareUrl(productId) {
  if (typeof window === 'undefined') return `/product/${productId}`;
  return `${window.location.origin}/product/${productId}`;
}

export function getProductShareData(product) {
  const url = getProductShareUrl(product.id);
  const priceFormatted = Number(product.price || 0).toLocaleString('en-IN');
  const brandName = product.brand || 'Yashal';
  
  const text = `Check out ${product.name} by ${brandName} (₹${priceFormatted}) on Yashal Dresses Atelier:\n${url}`;
  
  return {
    title: `${product.name} | Yashal Dresses`,
    text,
    url
  };
}

/**
 * Strictly detects if the device operating system is Android or iOS.
 * Checks ONLY the userAgent and platform string — NEVER window width or screen size!
 */
export function isMobileOS() {
  if (typeof navigator === 'undefined') return false;

  const ua = (navigator.userAgent || navigator.vendor || window.opera || '').toLowerCase();
  const platform = (navigator.platform || '').toLowerCase();

  // 1. Android OS check
  const isAndroid = ua.includes('android');

  // 2. iOS check (iPhone, iPod, iPad) & iPadOS Safari
  const isIOS = /iphone|ipad|ipod/.test(ua) || (platform.includes('macintel') && navigator.maxTouchPoints > 1);

  return Boolean(isAndroid || isIOS);
}

export function canUseNativeShare() {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function copyToClipboard(text) {
  if (typeof window === 'undefined') return false;

  if (navigator?.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      // Fallback below
    }
  }

  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    textArea.remove();
    return successful;
  } catch (err) {
    console.error('Failed to copy link:', err);
    return false;
  }
}

export function getWhatsAppShareUrl(product) {
  const { text } = getProductShareData(product);
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
}

/**
 * Executes product share:
 * - If on Android or iOS (by OS check) AND Web Share API is available:
 *   Triggers the native device share drawer (which contains WhatsApp, Instagram, Telegram, Copy Link, etc.).
 *   On mobile, the desktop modal is NEVER opened.
 * - If on desktop / non-mobile OS:
 *   Calls onDesktopFallback so desktop users get the top-right share modal with Copy Link and WhatsApp.
 */
export async function handleShareProduct(product, onDesktopFallback) {
  if (!product) return;

  const shareData = getProductShareData(product);

  // If strictly Android or iOS and native share is supported, open OS drawer
  if (isMobileOS() && canUseNativeShare()) {
    try {
      await navigator.share(shareData);
      return { success: true, method: 'native' };
    } catch (err) {
      // If user dismissed the native drawer, AbortError is normal and expected — do NOT open desktop modal
      if (err.name === 'AbortError') {
        return { success: false, aborted: true };
      }
      // If native sharing failed due to a system error on mobile, fallback
      if (onDesktopFallback) {
        onDesktopFallback(product);
      }
    }
    return;
  }

  // On desktop / non-mobile OS, open the desktop top-right modal
  if (onDesktopFallback) {
    onDesktopFallback(product);
  }
}
