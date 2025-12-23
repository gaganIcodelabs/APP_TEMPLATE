import { UserFieldConfigItem } from '@appTypes/config';
import {
  SCHEMA_TYPE_ENUM,
  SCHEMA_TYPE_LONG,
  SCHEMA_TYPE_MULTI_ENUM,
  SCHEMA_TYPE_TEXT,
  SCHEMA_TYPE_YOUTUBE,
} from '@constants/schemaTypes';
import { AppConfig } from '@redux/slices/hostedAssets.slice';
import { YOUTUBE_URL_REGEX } from '@util/string';
import { getPropsForCustomUserFieldInputs } from '@util/userHelpers';
import { TFunction } from 'i18next';
import { z } from 'zod';

export const getSignUpSchema = (
  userTypes: AppConfig['user']['userTypes'],
  selectedUserType: string,
  userFields: UserFieldConfigItem[],
  t: TFunction,
) => {
  const userType = selectedUserType;
  const userTypeConfig = userTypes.find(config => config.userType === userType);

  const userFieldProps = getPropsForCustomUserFieldInputs(
    userFields,
    t,
    userType,
  );

  const { displayInSignUp: showDisplayName, required: displayNameRequired } =
    userTypeConfig?.displayNameSettings ?? {};
  const { displayInSignUp: showPhoneNumber, required: phoneNumberRequired } =
    userTypeConfig?.phoneNumberSettings || {};

  const conditionalFields = userFieldProps.reduce(
    (acc, { key: field, fieldConfig, defaultRequiredMessage }) => {
      const { saveConfig, schemaType, numberConfig } = fieldConfig;

      if (!saveConfig) return acc;

      const { displayInSignUp, required: isRequired } = saveConfig;

      const { minimum, maximum } = numberConfig || {};

      if (!displayInSignUp) {
        return acc;
      }

      let fieldSchema;
      switch (schemaType) {
        case SCHEMA_TYPE_TEXT:
        case SCHEMA_TYPE_ENUM:
          fieldSchema = z.string();
          if (isRequired) {
            fieldSchema = fieldSchema.min(3, defaultRequiredMessage);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          break;
        case SCHEMA_TYPE_LONG:
          fieldSchema = z.number();
          if (isRequired) {
            if (minimum !== undefined) {
              fieldSchema = fieldSchema.min(
                minimum,
                t('CustomExtendedDataField.numberTooSmall', { min: minimum }),
              );
            }
            if (maximum !== undefined) {
              fieldSchema = fieldSchema.max(
                maximum,
                t('CustomExtendedDataField.numberTooBig', { max: maximum }),
              );
            }
          } else {
            fieldSchema = fieldSchema.optional();
          }
          break;
        case SCHEMA_TYPE_MULTI_ENUM:
          fieldSchema = z.array(z.string());
          if (isRequired) {
            fieldSchema = fieldSchema.min(1, defaultRequiredMessage);
          } else {
            fieldSchema = fieldSchema.optional();
          }
          break;
        case SCHEMA_TYPE_YOUTUBE:
          fieldSchema = z
            .string()
            .trim()
            .refine(value => !value || YOUTUBE_URL_REGEX.test(value), {
              message: t('CustomExtendedDataField.invalidYoutubeUrl'),
            });
          if (!isRequired) {
            fieldSchema = fieldSchema.optional();
          }

          break;
        default:
          fieldSchema = z.string().optional();
      }

      return { ...acc, [field]: fieldSchema };
    },
    {},
  );

  const formSchema = z
    .object({
      email: z.email({
        message: t('SignupForm.emailInvalid'),
      }),
      firstName: z.string().min(3, t('SignupForm.firstNameRequired')),
      lastName: z.string().min(3, t('SignupForm.lastNameRequired')),
      password: z.string().min(8, t('SignupForm.passwordRequired')),
      displayName:
        showDisplayName && displayNameRequired
          ? z.string().min(3, t('SignupForm.displayNameRequired'))
          : z.string().optional(),
      phoneNumber:
        showPhoneNumber && phoneNumberRequired
          ? z.string().min(8, t('SignupForm.phoneNumberRequired'))
          : z.string().optional(),
      terms: z.array(z.string()).length(1),
      ...conditionalFields,
    })
    .refine(
      data => {
        const { password, ...rest } = data;
        if (Object.values(rest).some(value => value === password)) {
          return false;
        }
        return true;
      },
      {
        error: t('SignupForm.passwordRepeatedOnOtherFields'),
        path: ['password'],
      },
    );

  return formSchema;
};

export const getSoleUserTypeMaybe = (
  userTypes: AppConfig['user']['userTypes'],
) =>
  Array.isArray(userTypes) && userTypes.length === 1
    ? userTypes[0].userType
    : null;
