document.addEventListener('DOMContentLoaded', () => {
  const otpInputs = document.querySelectorAll('.otp-input');

  otpInputs.forEach((input, index) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, ''); // Remove non-numeric characters
      const nextIndex = index + 1;
      if (input.value && nextIndex < otpInputs.length) {
        otpInputs[nextIndex].focus();
      }
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' && index > 0) {
        otpInputs[index - 1].focus();
      } else if (e.key === 'Delete' && index < otpInputs.length - 1) {
        otpInputs[index + 1].focus();
      }
      if (e.key === 'Backspace' || e.key === 'Delete') {
        input.value = ''; // Clear the value of the current input
      }
    });
  });
});