import { CommonTextInput } from '@components/index';
import React from 'react';
import { Control } from 'react-hook-form';
import { SignupFormValues } from '../Signup.types';

type Props = {
  control: Control<SignupFormValues>;
};

export const SignupPasswordInputField: React.FC<Props> = ({ control }) => {
  return (
    <CommonTextInput
      control={control}
      name="password"
      labelKey="PassWord"
      placeholder="Enter your password"
    />
  );
};
