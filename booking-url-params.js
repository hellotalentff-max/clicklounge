/**
 * ClickLounge Booking App — URL Parameter Handler
 * 
 * Add this script to the BOTTOM of your booking app's <script> block,
 * right before the closing </script> tag.
 * 
 * When a client clicks "Book Now" on a package from the main website,
 * the URL will contain ?package=Styleshots&price=₱1,500
 * 
 * This script will:
 * 1. Read the package name from the URL
 * 2. Auto-fill the package input field
 * 3. Show a "Package pre-selected" banner
 * 4. Optionally auto-advance to step 2 (date selection)
 */

(function initBookingFromURL() {
  const params = new URLSearchParams(window.location.search);
  const pkg    = params.get('package');
  const price  = params.get('price');

  if (!pkg) return; // No package in URL, do nothing

  // Wait for DOM to be ready
  const tryFill = () => {
    // Find the package input field — adjust selector to match your booking app
    const pkgInput = document.querySelector('input[name="package"]') 
                  || document.querySelector('#package-input')
                  || document.querySelector('input[placeholder*="package" i]')
                  || document.querySelector('input[placeholder*="Package" i]');

    if (pkgInput) {
      // Auto-fill the package name
      pkgInput.value = pkg;
      // Trigger input event so any validation/reactivity picks it up
      pkgInput.dispatchEvent(new Event('input', { bubbles: true }));
      pkgInput.dispatchEvent(new Event('change', { bubbles: true }));

      // Add a visual banner showing the pre-selected package
      const banner = document.createElement('div');
      banner.style.cssText = 'background:linear-gradient(135deg,#2d6e5f,#1a3d35);color:#fff;padding:1rem 1.5rem;border-radius:12px;margin:0 auto 1rem;max-width:480px;text-align:center;font-family:sans-serif;';
      banner.innerHTML = `
        <div style="font-size:.65rem;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:rgba(255,255,255,.5);margin-bottom:.3rem;">Package Pre-Selected</div>
        <div style="font-size:1.3rem;font-weight:700;color:#ffd76e;">${pkg}</div>
        ${price ? `<div style="font-size:.9rem;color:#c8a070;margin-top:.2rem;">${price}</div>` : ''}
        <div style="font-size:.72rem;color:rgba(255,255,255,.4);margin-top:.4rem;">Choose your date and time below</div>
      `;
      
      // Insert banner at the top of the form area
      const formArea = pkgInput.closest('form') || pkgInput.closest('section') || pkgInput.parentElement;
      if (formArea) {
        formArea.insertBefore(banner, formArea.firstChild);
      }

      // Make the package input read-only since it's pre-selected
      pkgInput.readOnly = true;
      pkgInput.style.background = '#e8f4f0';
      pkgInput.style.color = '#2d6e5f';
      pkgInput.style.fontWeight = '600';

      console.log(`[CLS Booking] Package pre-filled: ${pkg}${price ? ' — ' + price : ''}`);
    } else {
      // Input not found yet, retry
      setTimeout(tryFill, 200);
    }
  };

  // Start trying after a short delay to ensure DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(tryFill, 100));
  } else {
    setTimeout(tryFill, 100);
  }
})();
