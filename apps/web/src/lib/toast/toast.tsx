import { type ExternalToast, toast as sonnerToast } from 'sonner';

function success(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.success(message, {
    ...data,
    icon: SuccessIcon,
  });
}

function error(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.error(message, {
    ...data,
    icon: ErrorIcon,
  });
}

function info(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.info(message, {
    ...data,
    icon: InfoIcon,
  });
}

function warning(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.warning(message, {
    ...data,
    icon: WarningIcon,
  });
}

function message(message: string | React.ReactNode, data?: ExternalToast) {
  return sonnerToast.message(message, data);
}

function custom(children: React.ReactNode, data?: ExternalToast) {
  return sonnerToast.custom(() => {
    return <div>{children}</div>;
  }, data);
}

const SuccessIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    className='h-[20px] w-[20px] fill-green-400'
  >
    <path
      fillRule='evenodd'
      d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z'
      clipRule='evenodd'
    />
  </svg>
);

const WarningIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 24 24'
    className='h-[20px] w-[20px] fill-yellow-400'
  >
    <path
      fillRule='evenodd'
      d='M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z'
      clipRule='evenodd'
    />
  </svg>
);

const InfoIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    className='h-[20px] w-[20px] fill-blue-400'
  >
    <path
      fillRule='evenodd'
      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z'
      clipRule='evenodd'
    />
  </svg>
);

const ErrorIcon = (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 20 20'
    className='h-[20px] w-[20px] fill-red-400'
  >
    <path
      fillRule='evenodd'
      d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z'
      clipRule='evenodd'
    />
  </svg>
);

export const toast = { success, error, info, warning, custom, message };
