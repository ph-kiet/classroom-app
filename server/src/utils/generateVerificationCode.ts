const generateVerificationCode = (length = 6) => {
  const charset = "0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    code += charset[randomIndex];
  }

  return code;
};

export default generateVerificationCode;
