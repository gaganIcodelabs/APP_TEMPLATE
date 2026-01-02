import { RadioList } from '@components/index';
import { useConfiguration } from '@context/configurationContext';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { EditListingWizardParamList } from '../types/navigation.types';
import { EDIT_LISTING_SCREENS } from '../screens.constant';
import { useTypedSelector } from '@redux/store';
import { Listing } from '@appTypes/index';
import SelectListingType from '../components/SelectListingType';
import { useForm } from 'react-hook-form';
import { EditListingFormType } from '../types/editListingForm.type';

const EditListing = () => {
  const { listingId, wizardKey } =
    useRoute<
      RouteProp<
        EditListingWizardParamList,
        typeof EDIT_LISTING_SCREENS.EDIT_LISTING_PAGE
      >
    >().params;

  const isNewListing = !listingId;

  const existingListingType = useTypedSelector(state =>
    listingId ? (state.marketplaceData[listingId] as Listing)?.type : undefined,
  );

  const { control } = useForm<EditListingFormType>({
    defaultValues: {
      type: existingListingType ?? undefined,
    },
  });

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {isNewListing ? 'Create Listing' : 'Edit Listing'}
        </Text>
        <Text style={styles.subtitle}>Wizard Key: {wizardKey}</Text>

        {/* Listing Type Selection - Only show for new listings with multiple types */}
        <SelectListingType control={control} listingId={listingId} />


      </View>
    </ScrollView>
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
