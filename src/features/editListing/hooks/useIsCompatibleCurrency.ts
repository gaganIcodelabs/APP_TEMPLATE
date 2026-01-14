import { Listing } from '@appTypes/index';
import { useConfiguration } from '@context/configurationContext';
import { useTypedSelector } from '@redux/store';
import { isValidCurrencyForTransactionProcess } from '@util/fieldHelpers';
import { useMemo } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { EditListingForm } from '../types/editListingForm.type';

export const useIsCompatibleCurrency = (listingId: string | undefined) => {
  const config = useConfiguration();
  const { control } = useFormContext<EditListingForm>();
  const listingType = useWatch<EditListingForm>({
    control,
    name: 'listingType',
  });

  const transactionProcessAlias = useMemo(() => {
    return config?.listing?.listingTypes?.find(
      type => type.listingType === listingType,
    )?.transactionType.alias;
  }, [config, listingType]);

  const listingCurrency = useTypedSelector(state =>
    listingId
      ? (state.marketplaceData.entities[listingId] as Listing)?.attributes
          ?.price?.currency
      : undefined,
  );

  // Determine the currency to validate:
  // - If editing an existing listing, use the listing's currency.
  // - If creating a new listing, fall back to the default marketplace currency.
  const currencyToCheck = listingCurrency || config?.currency;

  // Verify if the selected listing type's transaction process supports the chosen currency.
  // This checks compatibility between the transaction process
  // and the marketplace or listing currency.
  const isCompatibleCurrency = isValidCurrencyForTransactionProcess(
    transactionProcessAlias!,
    currencyToCheck,
  );

  return isCompatibleCurrency;
};
