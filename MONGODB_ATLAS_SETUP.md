# MongoDB Atlas setup (Mern-Fuentes)

1. Open `server/.env` and replace `YOUR_DB_PASSWORD` with the password for the MongoDB Atlas database user `reizzanfuentes_db_user`.
   - Do not use your Atlas account login password unless it is also the database user's password.
   - URL-encode special characters in the password (for example, `@` becomes `%40`).
2. In MongoDB Atlas, add your current IP address under **Security → Network Access**. For a school project, avoid allowing access from everywhere unless you understand the security risk.
3. Confirm the database user exists under **Security → Database Access** and has read/write access to the database.
4. Open a terminal in the `server` folder and run:

   ```bash
   npm install
   npm start
   ```

5. When the terminal reports `Connected to MongoDB`, open a second terminal in `client` and run:

   ```bash
   npm install
   npm run dev
   ```

The app uses the `mern_fuentes` database and the `students` collection (created automatically when the first student is saved).

**Security note:** `.env` is excluded by `server/.gitignore`. Never upload or share a real database password. The archive intentionally contains a password placeholder, not the password that was present in the original archive.
