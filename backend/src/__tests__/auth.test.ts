import bcrypt from 'bcryptjs';

describe('Netra AI Authentication Utilities', () => {
  it('should correctly hash and verify passwords with bcrypt', async () => {
    const rawPassword = 'password123';
    const hashed = await bcrypt.hash(rawPassword, 10);

    expect(hashed).not.toEqual(rawPassword);
    const isValid = await bcrypt.compare(rawPassword, hashed);
    expect(isValid).toBe(true);
  });

  it('should reject incorrect password', async () => {
    const rawPassword = 'password123';
    const hashed = await bcrypt.hash(rawPassword, 10);
    const isValid = await bcrypt.compare('wrongpassword', hashed);
    expect(isValid).toBe(false);
  });
});
