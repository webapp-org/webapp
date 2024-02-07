# Webapp

Web application using Node js, Sequelize and MySql

## Installation

To install and run this application locally, follow these steps:

1. **Install MySQL**:

    ```bash
    brew install mysql
    ```

    Follow the prompts to complete the installation and set up a root password for MySQL.

2. **Install Node.js**:

    ```bash
    brew install node
    ```

3. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/your-repository.git
    ```

4. **Navigate to the project directory**:

    ```bash
    cd your-repository
    ```

5. **Install dependencies**:

    ```bash
    npm install
    ```

6. **Create a .env file**:

    Create a file named `.env` in the root directory of your project, and add the following fields, replacing `your-database`, `your-username`, `your-password`, `your-host`, and `your-port` with your actual database configuration:

    ```
    DATABASE=your-database
    USERNAME=your-username
    PASSWORD=your-password
    HOST=your-host
    DIALECT=mysql
    PORT=your-port
    ```

## Usage

To run the application, execute the following command:

```bash
npm start
