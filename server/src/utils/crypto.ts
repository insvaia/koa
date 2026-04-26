import bcrypt from "bcryptjs";

const encryptPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

const comparePassword = async (
  inputPassword: string,
  hashedPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(inputPassword, hashedPassword);
};

export { encryptPassword, comparePassword };
