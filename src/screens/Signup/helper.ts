import { z } from 'zod';
import {
  SCHEMA_TYPE_ENUM,
  SCHEMA_TYPE_LONG,
  SCHEMA_TYPE_MULTI_ENUM,
  SCHEMA_TYPE_TEXT,
  SCHEMA_TYPE_YOUTUBE,
} from '@constants/schemaTypes';
import { TFunction } from 'i18next';
import { UserFieldConfigItem } from '@appTypes/config';
import { getPropsForCustomUserFieldInputs } from '@util/userHelpers';
import { AppConfig } from '@redux/slices/hostedAssets.slice';
import { YOUTUBE_URL_REGEX } from '@util/string';

export const getSignUpSchema = (
  userTypes: AppConfig['user']['userTypes'],
  values: any,
  userFields: UserFieldConfigItem[],
  t: TFunction,
) => {
  const userType = values.userType;
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
      email: z
        .string()
        .min(1, t('SignupForm.emailRequired'))
        .email(t('SignupForm.emailInvalid')),
      firstName: z.string().min(3, t('SignupForm.firstNameRequired')),
      lastName: z.string().min(3, t('SignupForm.lastNameRequired')),
      password: z.string().min(8, t('SignupForm.passwordRequired')),
      ...(userType ? { userType: z.string().default(userType) } : {}),
      displayName:
        showDisplayName && displayNameRequired
          ? z.string().min(3, t('SignupForm.displayNameRequired'))
          : z.string().optional(),
      phoneNumber:
        showPhoneNumber && phoneNumberRequired
          ? z.string().min(8, t('SignupForm.phoneNumberRequired'))
          : z.string().optional(),
      terms: z.array(z.string()).length(1),
      // terms: z.boolean().refine(val => val === true, {
      //   message: t('SignupForm.termsRequired'),
      // }),
      ...conditionalFields,
    })
    .superRefine((data, ctx) => {
      const shouldErrorPassword = Object.entries(data).some(([key, value]) => {
        if (
          key !== 'password' &&
          typeof value === 'string' &&
          value &&
          value === data.password
        ) {
          return true;
        }
        return false;
      });
      console.log('hellllllllo');
      if (shouldErrorPassword) {
        ctx.addIssue({
          path: ['password'],
          message: 'asdasdasdasdasdasdasdasdasdasdasd',
          code: z.ZodIssueCode.custom,
        });
      }
    });

  return formSchema;
};
