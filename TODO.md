# Supabase Integration - Next Steps

- [ ] **Configure Environment Variables**
    - Create a `.env` file in the root directory.
    - Copy the contents of `.env.example`.
    - Replace `your_project_url` and `your_anon_key` with actual values from your Supabase Dashboard.

- [ ] **Verify Supabase Project Settings**
    - Go to your Supabase project dashboard.
    - Navigate to **Authentication > Providers**.
    - Ensure **Email** is enabled.
    - (Optional) Disable "Confirm email" if you want to test signups immediately without verifying email addresses.

- [ ] **Test Authentication Workflow**
    - Run `npm run dev`.
    - Access `http://localhost:5173/` (should show login screen).
    - Try to access `http://localhost:5173/quiz` (should redirect to `/`).
    - Create a test account using the "Sign up" button.
    - Log in and verify access to the Quiz and Generator tools.
    - Test the "Logout" functionality in the Navbar.

- [ ] **Update Project Documentation**
    - Update `GEMINI.md` to reflect the new route structure and authentication requirement.
