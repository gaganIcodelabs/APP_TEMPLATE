export interface StorableError {
  type: 'error';
  name: string;
  message: string;
  status?: number;
  statusText?: string;
  apiErrors?: any[];
}

const responseAPIErrors = (error: any) => {
  return error && error.data && error.data.errors ? error.data.errors : [];
};

export const storableError = (err: any): StorableError => {
  const error = err || {};
  const { name, message, status, statusText } = error;
  const apiErrors = responseAPIErrors(error);

  return {
    type: 'error',
    name,
    message,
    status,
    statusText,
    apiErrors,
  };
};
