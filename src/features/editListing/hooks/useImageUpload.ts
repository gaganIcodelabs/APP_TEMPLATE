import { useState } from 'react';
import { useAppDispatch } from '@redux/store';
import { useConfiguration } from '@context/configurationContext';
import { requestImageUpload } from '../editListing.slice';
import { ListingImageLayout } from '@appTypes/config/configLayoutAndBranding';
import { ImageItem } from '../types/editListingForm.type';

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const dispatch = useAppDispatch();
  const config = useConfiguration();

  const uploadImage = async (file: {
    uri: string;
    id: string;
    type: string;
    name: string;
  }): Promise<ImageItem | null> => {
    const imageConfig = config?.layout?.listingImage;
    if (!imageConfig || !('variantPrefix' in imageConfig)) {
      throw new Error('Image configuration not available');
    }

    setIsUploading(true);
    try {
      const res = await dispatch(
        requestImageUpload({
          file,
          listingImageConfig: imageConfig as ListingImageLayout,
        }),
      ).unwrap();

      if (res?.data?.data?.id) {
        const imageId =
          typeof res.data.data.id === 'string'
            ? res.data.data.id
            : res.data.data.id.uuid;

        return {
          id: imageId,
          uri:
            res.data.data.attributes.variants?.['listing-card']?.url ||
            res.data.data.attributes.variants?.default?.url ||
            file.uri,
        };
      }
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    uploadImage,
    isUploading,
  };
};
