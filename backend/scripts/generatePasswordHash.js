/**
 * Helper script to generate bcrypt password hashes
 * Usage: node generatePasswordHash.js <password>
 */
import bcrypt from 'bcryptjs';

const password = process.argv[2];

if (!password) {
  console.error('Usage: node generatePasswordHash.js <password>');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nPassword:', password);
console.log('Hash:', hash);
console.log('\nSQL Update Command:');
console.log(`UPDATE employees SET passwordHash = '${hash}' WHERE employeeId = 'YOUR_EMPLOYEE_ID';`);
console.log('\n');
