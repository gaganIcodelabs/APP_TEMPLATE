import { Listing } from '@appTypes/index';
import { useTypedSelector } from '@redux/store';
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

const EditListing = () => {
  const { listingId, wizardKey } = useEditListingWizardRoute().params;

  const isNewListing = !listingId;

  const existingListingType = useTypedSelector(state =>
    listingId
      ? (state.marketplaceData.entities[listingId] as Listing)?.type
      : undefined,
  );

  const formMethods = useForm<EditListingForm>({
    defaultValues: {
      type: existingListingType ?? undefined,
      location: {
        origin: [],
        address: '',
      },
      fields: {},
    },
  });

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

          <EditListingPricingAndStock />
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
});

export default EditListing;
