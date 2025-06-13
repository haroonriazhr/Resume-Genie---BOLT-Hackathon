import { supabase } from '@/lib/supabase';

export interface AvatarUploadResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Converts a file to base64 data URL
 */

/**
 * Resizes an image file to a maximum dimension while maintaining aspect ratio
 */
const resizeImage = (file: File, maxSize: number = 200): Promise<string> => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;

      if (width > height) {
        if (width > maxSize) {
          height = (height * maxSize) / width;
          width = maxSize;
        }
      } else {
        if (height > maxSize) {
          width = (width * maxSize) / height;
          height = maxSize;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and resize image
      ctx?.drawImage(img, 0, 0, width, height);

      // Convert to base64
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
      resolve(resizedBase64);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
};

export const avatarService = {
  /**
   * Uploads an avatar file and returns the public URL
   * Falls back to base64 storage if Supabase storage is not available
   */
  uploadAvatar: async (file: File, userId: string): Promise<AvatarUploadResult> => {
    try {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        return {
          success: false,
          error: 'Please upload an image file.'
        };
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        return {
          success: false,
          error: 'Please upload an image smaller than 5MB.'
        };
      }

      // Try Supabase storage first
      try {
        const { data: buckets } = await supabase.storage.listBuckets();
        const avatarBucket = buckets?.find(bucket => bucket.name === 'avatars');

        if (avatarBucket) {
          // Generate unique filename
          const fileExt = file.name.split('.').pop();
          const fileName = `${userId}-${Date.now()}.${fileExt}`;

          // Upload file
          const { error: uploadError } = await supabase.storage
            .from('avatars')
            .upload(fileName, file, {
              cacheControl: '3600',
              upsert: false
            });

          if (!uploadError) {
            // Get public URL
            const { data: { publicUrl } } = supabase.storage
              .from('avatars')
              .getPublicUrl(fileName);

            return {
              success: true,
              url: publicUrl
            };
          }
        }
      } catch (storageError) {
        console.log('Supabase storage not available, falling back to base64');
      }

      // Fallback: Use base64 encoding for avatar storage
      const resizedBase64 = await resizeImage(file, 200);

      return {
        success: true,
        url: resizedBase64
      };
    } catch (error) {
      console.error('Avatar upload error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  },

  /**
   * Deletes an old avatar file (only for Supabase storage URLs)
   */
  deleteAvatar: async (avatarUrl: string): Promise<boolean> => {
    try {
      if (!avatarUrl) return true;

      // Skip deletion for base64 URLs (they start with 'data:')
      if (avatarUrl.startsWith('data:')) return true;

      const fileName = avatarUrl.split('/').pop();
      if (!fileName || !fileName.includes('-')) return true;

      const { error } = await supabase.storage
        .from('avatars')
        .remove([fileName]);

      if (error) {
        console.error('Error deleting old avatar:', error);
        // Don't fail the upload if we can't delete the old file
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error deleting avatar:', error);
      return false;
    }
  }
};
