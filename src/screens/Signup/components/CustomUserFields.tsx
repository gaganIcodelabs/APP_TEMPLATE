import { useConfiguration } from '@context/configurationContext';
import { getPropsForCustomUserFieldInputs } from '@util/userHelpers';
import { View } from 'react-native';
import CustomExtendedDataField from './CustomExtendedDataField';
import { useTranslation } from 'react-i18next';
import { Control } from 'react-hook-form';
import { SignupFormValues } from '../Signup.types';

const CustomUserFields = ({
  showDefaultUserFields,
  selectedUserType,
  control,
}: {
  showDefaultUserFields: boolean;
  selectedUserType: string;
  control: Control<SignupFormValues>;
}) => {
  const config = useConfiguration();
  const { t } = useTranslation();
  const userFields = config?.user.userFields || [];

  // Custom user fields. Since user types are not supported here,
  // only fields with no user type id limitation are selected.
  const userFieldProps = getPropsForCustomUserFieldInputs(
    userFields,
    t,
    selectedUserType,
  );

  // console.log('userFieldProps', JSON.stringify(userFieldProps));
  const showCustomUserFields =
    showDefaultUserFields && userFieldProps?.length > 0;

  if (!showCustomUserFields) return null;

  return (
    <View>
      {userFieldProps.map(fieldProps => (
        <CustomExtendedDataField
          key={fieldProps.key}
          name={fieldProps.name}
          fieldConfig={fieldProps.fieldConfig}
          control={control}
        />
      ))}
    </View>
  );
};

export default CustomUserFields;
