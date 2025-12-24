# API Endpoint Replacement Plan

## Overview
Replace all `http://localhost:8000` API endpoints with `https://papillondashboard.devshop.site` across the entire Next.js application.

## Files Found with Localhost References
Based on the search results, the following files contain localhost API endpoints that need to be updated:

### 1. API Pages (Server/Client Components)
- `src/app/product/[sku]/page.js` - Product details API call
- `src/app/category/[slug]/page.js` - Category products API call
- `src/app/search/page.js` - Search products API call
- `src/app/account/page.js` - User profile stats API call
- `src/app/auth/forgot-password-modal.js` - Forgot password & reset password APIs
- `src/app/auth/login/page.js` - Login API
- `src/app/auth/Register/page.js` - Registration API
- `src/app/auth/verify-otp/page.js` - OTP verification & resend APIs
- `src/app/account/edit/page.js` - Profile update, email verification, password APIs
- `src/app/account/orders/page.js` - Orders listing API
- `src/app/account/address/page.js` - Address CRUD operations APIs
- `src/app/delivery/page.js` - Address fetch API
- `src/app/preview/[sku]/page.js` - Product preview API

### 2. Context Files (Already Updated)
- `src/context/AuthContext.js` - ✅ Already using production URL
- `src/context/CartContext.js` - ✅ No API calls (local storage only)

### 3. Components (Already Updated)
- `src/components/ProductGrid.js` - ✅ Already using production URL

## Replacement Pattern
**Find:** `http://localhost:8000`
**Replace:** `https://papillondashboard.devshop.site`

## Implementation Strategy
1. Update all API endpoint URLs in the files listed above
2. Ensure all fetch calls use the correct base URL
3. Preserve all existing functionality and error handling
4. Test key endpoints after replacement


## Files Status
- ✅ Already Updated: ProductGrid.js, AuthContext.js
- ✅ Completed Updates: 
  - src/app/account/address/page.js (Updated localhost to production)
  - src/app/delivery/page.js (Updated localhost to production) 
  - src/app/preview/[sku]/page.js (Updated localhost to production)
- ✅ Already Using Production URL: All other files already had correct API endpoints

## Summary
All localhost API endpoints have been successfully replaced with `https://papillondashboard.devshop.site`. The application is now configured to use the production API endpoints consistently across all components and pages.
