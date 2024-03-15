# Webapp


## Installation

To install and run this application locally, follow these steps:

1. **Install MySQL**:


2. **Install Node.js**:

3. **Clone the repository**:

    ```bash
    git clone hgit@github.com:chinmay-gulhane21/chinmay-webapp-fork.git
    ```

4. **Navigate to the project directory**:

    ```bash
    cd webapp
    ```

5. **Install dependencies**:

    ```bash
    npm install
    ```

6. **Add a .env file**:

    Create a file named `.env` in the root directory and add below database configuration:

    ```
    DATABASE=your-database
    USERNAME=your-username
    PASSWORD=your-password
    HOST=your-host
    PORT=your-port
    ```

## Usage

To run the application, execute the following command:

```bash
npm start
```

## Integration Tests

1. Implement integration (and not unit) tests for the /v1/user endpoint with a new GitHub Actions workflow. Do not delete workflow from previous assignments as it must continue to function in parallel to the new one.
2. Test 1 - Create an account, and using the GET call, validate account exists.
3. Test 2 - Update the account and using the GET call, validate the account was updated.

## Assignment 4 - Packer

## Assignment 5 - Setup Cloud MySQL
