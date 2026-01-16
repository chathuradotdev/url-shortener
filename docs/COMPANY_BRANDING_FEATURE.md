# Company Branding Feature

## Overview
This feature allows users to customize the footer branding that appears on their bio pages. Instead of the default "Made with liinks.co" branding, users can choose to display custom text or upload their company logo.

## Features

### 1. Three Branding Options
- **Default**: Shows "Made with liinks.co" with a globe icon
- **Custom Text**: Display custom text (up to 50 characters)
- **Company Logo**: Upload and display a company logo image

### 2. User Interface
Located in the user profile page (`/profile`), users can:
- Select their preferred branding type
- Enter custom text (if text option selected)
- Upload a company logo (if image option selected)
- Preview their selection before saving

### 3. File Upload
- Supported formats: JPEG, PNG, GIF, WEBP, SVG
- Maximum file size: 2MB
- Recommended: Transparent PNG with logo
- Display size: Max height 40px in footer

## Implementation Details

### Database Schema
Added three new columns to the `users` table:
- `company_branding_type`: VARCHAR(10) - 'default', 'text', or 'image'
- `company_branding_text`: VARCHAR(50) - Custom text (nullable)
- `company_branding_image`: TEXT - URL of uploaded logo (nullable)

### Files Modified/Created

#### New Files
1. `src/app/(site)/profile/BrandingForm.tsx` - UI component for branding settings
2. `src/app/api/profile/update-branding/route.ts` - API endpoint for updating branding
3. `migrations/add_company_branding_to_users.sql` - Database migration

#### Modified Files
1. `src/lib/db.ts` - Added branding fields to User interface
2. `src/app/(site)/profile/page.tsx` - Added BrandingForm section
3. `src/components/bio/BioRenderer.tsx` - Updated to display custom branding
4. `src/app/bio/[slug]/page.tsx` - Fetch and pass user branding to renderer

### API Endpoints

#### POST `/api/profile/update-branding`
Updates user's branding settings.

**Request Body:**
```json
{
  "company_branding_type": "text" | "image" | "default",
  "company_branding_text": "string (max 50 chars)",
  "company_branding_image": "string (URL)"
}
```

**Response:**
```json
{
  "success": true,
  "data": { /* updated user object */ }
}
```

### Storage
Images are uploaded using the existing upload infrastructure:
- Uses the `/api/upload` endpoint
- Stored in the same location as profile pictures but in a different folder structure
- Supports multiple storage providers (Vercel Blob, S3, Azure, Local)

## Usage

### For Users
1. Navigate to Profile page (`/profile`)
2. Scroll to "Company Branding" section
3. Choose branding type:
   - **Default**: No action needed
   - **Custom Text**: Enter your text (e.g., "Made with ❤️ by Your Company")
   - **Company Logo**: Click to upload your logo image
4. Click "Save Branding Settings"
5. View your bio page to see the updated branding

### For Developers

#### Accessing Branding in Components
```tsx
// In BioRenderer component
userBranding={{
  type: 'text' | 'image' | 'default',
  text: 'Custom text',
  image: 'https://...'
}}
```

#### Rendering Logic
```tsx
{!userBranding || userBranding.type === 'default' ? (
  // Show default branding
) : userBranding.type === 'text' ? (
  // Show custom text
) : userBranding.type === 'image' ? (
  // Show company logo
) : (
  // Fallback to default
)}
```

## Migration

To apply the database migration:

```bash
# Using Supabase CLI
supabase db push

# Or manually execute the SQL file
psql -d your_database < migrations/add_company_branding_to_users.sql
```

## Security Considerations

1. **File Upload Validation**: Only image files up to 2MB are accepted
2. **Text Length Validation**: Custom text limited to 50 characters
3. **Authentication**: Only authenticated users can update branding
4. **Authorization**: Users can only update their own branding settings

## Future Enhancements

Potential improvements for this feature:
- [ ] Add branding preview in the settings form
- [ ] Support for branding link (make logo/text clickable)
- [ ] Different branding per bio page (instead of account-wide)
- [ ] Branding position options (footer, header, sidebar)
- [ ] Premium-only feature restriction
- [ ] Analytics on branding click-through rates

## Troubleshooting

### Logo not displaying
- Check if the image URL is accessible
- Verify file format is supported
- Ensure image size is under 2MB

### Text not saving
- Verify text length is under 50 characters
- Check for special characters that might cause issues

### Changes not reflecting
- Clear browser cache
- Refresh the bio page
- Check if branding settings were saved successfully in profile
