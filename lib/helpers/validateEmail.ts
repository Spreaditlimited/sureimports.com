export default function validateEmail(userEmail: string): {
  isValid: boolean;
  message?: string;
} {
  if (!userEmail) {
    return {
      isValid: false,
      message: 'Email address is required',
    };
  }

  // Basic email format validation using RFC 5322 standard regex
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(userEmail)) {
    return {
      isValid: false,
      message: 'Please enter a valid email address',
    };
  }

  // Check for disposable email domains if needed
  // This is optional and can be removed or customized
  const disposableDomains = [
    'tempmail.com',
    'mailinator.com',
    'guerrillamail.com',
    // Add more disposable domains as needed
  ];

  const domain = userEmail.split('@')[1];
  if (disposableDomains.includes(domain)) {
    return {
      isValid: false,
      message: 'Disposable email addresses are not allowed',
    };
  }

  return {
    isValid: true,
  };
}
