# Live Chat Setup Guide

## Environment Variables

Add these to your `.env.local` file:

```bash
# Tawk.to
NEXT_PUBLIC_TAWK_PROPERTY_ID=your_property_id
NEXT_PUBLIC_TAWK_WIDGET_ID=your_widget_id

# Facebook Messenger
NEXT_PUBLIC_FB_PAGE_ID=your_page_id
NEXT_PUBLIC_FB_APP_ID=your_app_id

# Zalo
NEXT_PUBLIC_ZALO_OA_ID=your_oa_id

# Contact Info
NEXT_PUBLIC_PHONE_NUMBER=0123456789
NEXT_PUBLIC_EMAIL=info@conphungtourist.com
```

## Setup Instructions

### 1. Tawk.to

1. Go to https://www.tawk.to/
2. Sign up for free account
3. Create a new property
4. Get your Property ID and Widget ID from Dashboard
5. Add to `.env.local`

### 2. Facebook Messenger

1. Go to https://developers.facebook.com/
2. Create a new app
3. Add Messenger product
4. Get your Page ID and App ID
5. Add to `.env.local`

### 3. Zalo

1. Go to https://oa.zalo.me/
2. Create Official Account
3. Get your OA ID
4. Add to `.env.local`

## Usage

The chat providers are automatically loaded in the layout.
To customize, edit `components/chat/chat-provider.tsx`

## Testing

1. Start development server
2. Open website
3. Check if chat widget appears
4. Test each provider

## Troubleshooting

### Tawk.to not showing
- Check Property ID and Widget ID are correct
- Check if script is loaded in browser console
- Clear cache and reload

### Facebook Messenger not showing
- Check Page ID and App ID are correct
- Check if Facebook SDK is loaded
- Verify page is published

### Zalo not showing
- Check OA ID is correct
- Check if Zalo SDK is loaded
- Verify OA is active
