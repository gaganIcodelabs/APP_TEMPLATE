import { EDIT_LISTING_SCREENS } from '../screens.constant';

export type EditListingWizardParamList = {
  [EDIT_LISTING_SCREENS.EDIT_LISTING_PAGE]: {
    wizardKey: string;
    listingId: string | undefined;
  };
};

export type EditListingWizardParam = {
  EditListingWizard: {
    listingId: string | undefined;
  };
};
