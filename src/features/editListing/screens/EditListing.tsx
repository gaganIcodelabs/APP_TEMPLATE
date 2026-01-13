import { Listing } from '@appTypes/index';
import { useAppDispatch, useTypedSelector } from '@redux/store';
import { FormProvider, useForm } from 'react-hook-form';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import EditListingCustomFields from '../components/EditListingCustomFields';
import EditListingDescription from '../components/EditListingDescription';
import EditListingTitle from '../components/EditListingTitle';
import SelectListingCategory from '../components/SelectListingCategory';
import SelectListingType from '../components/SelectListingType';
import { useEditListingWizardRoute } from '../editListing.helper';
import { EditListingForm } from '../types/editListingForm.type';
import EditListingLocation from '../components/EditListingLocation';
import EditListingPricing from '../components/EditListingPricing';
import EditListingPricingAndStock from '../components/EditListingPricingAndStock';
import EditListingPriceVariations from '../components/EditListingPriceVariations';
import EditListingAvailability from '../components/EditListingAvailability';
import EditListingDelivery from '../components/EditListingDelivery';
import EditListingPhotos from '../components/EditListingPhotos';
import { Button } from '@components/index';
import {
  createListing,
  selectCreateListingInProgress,
} from '../editListing.slice';
import { transformFormToListingData } from '../utils/transformFormToListingData';
import { Alert } from 'react-native';

const EditListing = () => {
  const dispatch = useAppDispatch();
  const { listingId, wizardKey } = useEditListingWizardRoute().params;

  const isNewListing = !listingId;

  const existingListingType = useTypedSelector(state =>
    listingId
      ? (state.marketplaceData.entities[listingId] as Listing)?.type
      : undefined,
  );

  const createListingInProgress = useTypedSelector(state =>
    selectCreateListingInProgress(state, wizardKey),
  );

  const formMethods = useForm<EditListingForm>({
    defaultValues: {
      type: existingListingType ?? undefined,
      location: {
        origin: [],
        address: '',
      },
      images: [],
      fields: {},
    },
  });

  const handlePublishListing = async () => {
    const formData = formMethods.getValues();

    // Basic validation
    if (!formData.title) {
      Alert.alert('Error', 'Please enter a listing title');
      return;
    }

    if (!formData.type) {
      Alert.alert('Error', 'Please select a listing type');
      return;
    }

    try {
      const listingData = transformFormToListingData(formData);
      
      // Log the data being sent for debugging
      console.log('Form data:', JSON.stringify(formData, null, 2));
      console.log('Transformed listing data:', JSON.stringify(listingData, null, 2));
      
      // Build the params object, only including defined values
      const params: any = {
        wizardKey,
        title: listingData.title,
      };

      if (listingData.description) {
        params.description = listingData.description;
      }

      if (listingData.price) {
        params.price = listingData.price;
      }

      if (listingData.publicData && Object.keys(listingData.publicData).length > 0) {
        params.publicData = listingData.publicData;
      }

      if (listingData.geolocation) {
        params.geolocation = listingData.geolocation;
      }

      if (listingData.availabilityPlan) {
        params.availabilityPlan = listingData.availabilityPlan;
      }

      if (listingData.images && listingData.images.length > 0) {
        params.images = listingData.images;
      }

      const result = await dispatch(createListing(params)).unwrap();

      Alert.alert('Success', 'Listing created successfully!');
      console.log('Created listing:', result);
    } catch (error: any) {
      console.error('Error creating listing:', error);
      console.error('API Errors:', JSON.stringify(error?.apiErrors, null, 2));
      console.error('Full error:', JSON.stringify(error, null, 2));
      
      // Extract meaningful error message from API errors
      let errorMessage = 'Failed to create listing. Please try again.';
      if (error?.apiErrors && error.apiErrors.length > 0) {
        const apiError = error.apiErrors[0];
        errorMessage = apiError.title || apiError.detail || errorMessage;
      }
      
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <FormProvider {...formMethods}>
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {isNewListing ? 'Create Listing' : 'Edit Listing'}
          </Text>
          <Text style={styles.subtitle}>Wizard Key: {wizardKey}</Text>

          <SelectListingType />

          <SelectListingCategory />

          <EditListingTitle />

          <EditListingDescription />

          <EditListingCustomFields />

          <EditListingLocation />

          <EditListingPricing />

          <EditListingPriceVariations />

          <EditListingAvailability />

          <EditListingPricingAndStock />

          <EditListingDelivery />

          <EditListingPhotos />

          {isNewListing && (
            <Button
              title="Publish listing"
              onPress={handlePublishListing}
              loader={createListingInProgress}
              disabled={createListingInProgress}
              style={styles.publishButton}
            />
          )}
        </View>
      </ScrollView>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    padding: 16,
    paddingBottom: 50,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 24,
  },
  publishButton: {
    marginTop: 32,
    marginBottom: 16,
  },
});

export default EditListing;
