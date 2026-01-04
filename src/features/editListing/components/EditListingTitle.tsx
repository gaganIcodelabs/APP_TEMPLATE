import { CommonTextInput } from '@components/index';
import { useFormContext } from 'react-hook-form';
import { useEditListingWizardRoute } from '../editListing.helper';
import { useIsCompatibleCurrency } from '../hooks/useIsCompatibleCurrency';
import { useIsShowDetailsForm } from '../hooks/useIsShowDetailsForm';
import { EditListingForm } from '../types/editListingForm.type';

const EditListingTitle = () => {
  const listingId = useEditListingWizardRoute().params.listingId;
  const { control } = useFormContext<EditListingForm>();
  const isCompatibleCurrency = useIsCompatibleCurrency(listingId);
  const isShowDetailsForm = useIsShowDetailsForm();

  if (!isShowDetailsForm || !isCompatibleCurrency) return null;

  return (
    <CommonTextInput
      control={control}
      name="title"
      labelKey="Listing Title"
      placeholder="Enter your listing title"
    />
  );
};

export default EditListingTitle;
