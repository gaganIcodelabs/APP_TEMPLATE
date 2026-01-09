import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useIsShowPhotos } from '../hooks/useIsShowPhotos';
import { useImageUpload } from '../hooks/useImageUpload';
import { scale } from '@util/responsive';
import { CommonText } from '@components/index';
import { EditListingForm, ImageItem } from '../types/editListingForm.type';
import { colors } from '@constants/colors';
import { primaryFont } from '@constants/typography';

const LIMIT_IN_BYTES = 20 * 1024 * 1024; // 20MB

const EditListingPhotos = () => {
  const isShowPhotos = useIsShowPhotos();
  const { watch, setValue } = useFormContext<EditListingForm>();
  const { uploadImage, isUploading } = useImageUpload();

  const images = watch('images') || [];

  //   const listingTypeConfig = getListingTypeConfig(
  //     listing,
  //     selectedListingType,
  //     config,
  //   );
  //    const isPayoutDetailsRequired = requirePayoutDetails(listingTypeConfig);

  const pickImages = async () => {
    if (isUploading) return;

    try {
      const result = await ImageCropPicker.openPicker({
        multiple: true,
        mediaType: 'photo',
        quality: 1,
        maxFiles: 5,
        compressImageQuality: 0.8,
      });

      const validImages: ImageItem[] = [];

      for (const asset of result) {
        if (asset.size && asset.size > LIMIT_IN_BYTES) {
          Alert.alert(
            'Error',
            'Image size exceeds 20MB limit. Please choose a smaller image.',
          );
          continue;
        }

        try {
          const uploadedImage = await uploadImage({
            uri: asset.path,
            id: `${asset.path}_${Date.now()}`,
            type: asset.mime || 'image/jpeg',
            name: `image_${Math.random()}_${Date.now()}.jpg`,
          });

          console.log('uploadedImage', uploadedImage);

          if (uploadedImage) {
            validImages.push(uploadedImage);
          }
        } catch (error: unknown) {
          console.error('Error uploading image:', error);
          Alert.alert('Error', 'Failed to upload image. Please try again.');
        }
      }

      if (validImages.length > 0) {
        setValue('images', [...images, ...validImages]);
      }
    } catch (error: unknown) {
      if (
        error &&
        typeof error === 'object' &&
        'code' in error &&
        error.code !== 'E_PICKER_CANCELLED'
      ) {
        console.error('Error picking images:', error);
        Alert.alert('Error', 'Failed to pick images. Please try again.');
      }
    }
  };

  if (!isShowPhotos) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Images</Text>
      <Pressable
        onPress={pickImages}
        style={[styles.section, isUploading && styles.sectionDisabled]}
        disabled={isUploading}
      >
        <CommonText>
          {isUploading ? 'Uploading...' : '+ Add a photo…'}
        </CommonText>
        <CommonText>.JPG or .PNG. Max. 20 MB</CommonText>
      </Pressable>
      {images.length > 0 && (
        <Text style={styles.imageCount}>{images.length} image(s) selected</Text>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollStyles}
      >
        {images?.map((image, index) => {
          return (
            <View key={index} style={styles.imageSection}>
              <TouchableOpacity
                onPress={() => {
                  const updatedImages = images.filter(
                    img => img.id !== image.id,
                  );
                  setValue('images', updatedImages, { shouldDirty: true });
                }}
                style={styles.remove}
              >
                <CommonText style={styles.x}>X</CommonText>
              </TouchableOpacity>
              <Image style={styles.image} source={{ uri: image.uri }} />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default EditListingPhotos;

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  label: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
    fontWeight: '500',
  },
  section: {
    height: scale(100),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: scale(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionDisabled: {
    opacity: 0.6,
  },
  imageCount: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  x: {
    fontSize: 12,
    color: colors.white,
    ...primaryFont('600'),
  },
  scrollStyles: {
    // paddingStart: scale(10),
    gap: scale(14),
    paddingEnd: scale(10),
  },
  imageSection: {
    marginVertical: scale(10),
    width: scale(80),
    height: scale(80),
    borderRadius: scale(16),
    justifyContent: 'center',
  },
  image: {
    height: scale(80),
    width: scale(80),
    borderRadius: scale(16),
  },
  remove: {
    position: 'absolute',
    top: scale(-5),
    right: scale(-5),
    zIndex: 100,
    backgroundColor: colors.black,
    borderRadius: scale(10),
    height: scale(20),
    width: scale(20),
    justifyContent: 'center',
    alignItems: 'center',
  },
});
