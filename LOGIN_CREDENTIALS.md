# Login Credentials

## Easy Login (Development Mode)

**ANY Gmail address with ANY password will work!**

Simply:
1. Enter any email ending with `@gmail.com` (e.g., `yourname@gmail.com`)
2. Enter any password (e.g., `12345678`)
3. Select role: Customer or Developer
4. Click "Login"

The system will automatically log you in without checking the database.

## Pre-configured Test Users (Optional)

If you prefer to use pre-configured accounts:

### Customer Account 1
- **Email:** `customer@test.com`
- **Password:** `customer123`
- **Role:** Customer

### Customer Account 2
- **Email:** `kanishkashakya169@gmail.com`
- **Password:** `12345678`
- **Role:** Customer

### Developer Account
- **Email:** `developer@test.com`
- **Password:** `developer123`
- **Role:** Developer

## How It Works

- **Gmail addresses (@gmail.com)**: Automatically accepted with any password
- **Other email addresses**: Must exist in the database with correct password

## Creating New Users

To create additional users, run the seed script:

```bash
cd backend
npm run seed
```

This will create the users table if it doesn't exist and add the test users.

## Password Requirements

- Any email with @ symbol is accepted
- Any password is accepted (no minimum requirements)

## Notes

- User authentication is handled via JWT tokens
- Tokens are stored in localStorage and persist across sessions
- Logout button is available on both Customer and Developer pages
- If token expires or is invalid, users are automatically redirected to login
