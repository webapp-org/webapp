
![gcp-tf-infra drawio](https://github.com/MegaCorp-Inc/webapp/assets/144539453/d5d50eb6-9342-4599-be60-ec2deb0e2e84)

# Assignment 9: Continuous Deployment with GitHub Actions

### Overview
The objective of Assignment 9 was to establish continuous deployment for your infrastructure using GitHub Actions. This process automates the deployment of new instance templates and performs rolling updates on your GCP environment.

### Steps Taken
1. **Image Creation with Packer**:
   - Configured GitHub Actions to trigger Packer to build a new custom image for your infrastructure.

2. **Update Instance Template**:
   - Utilized `gcloud` commands within GitHub Actions to set the new custom image as the source for an updated instance template.
   
3. **Perform Rolling Update**:
   - Leveraged `gcloud` commands to initiate a rolling update using the updated instance template.
   - Configured the GitHub Action to wait until the rolling update process is complete before proceeding.

### Automation Workflow
- **GitHub Actions Integration**:
  - Integrated GitHub Actions to automate the deployment process triggered by Packer image creation.

- **Instance Template Management**:
  - Dynamically updated the instance template with the newly created custom image using `gcloud` commands.

- **Rolling Update Execution**:
  - Initiated a rolling update on the managed instance group to apply the changes using the updated instance template.

### Benefits and Outcomes
- **Efficient Deployment**: Enabled continuous deployment of infrastructure changes triggered by Packer image builds.
- **Automated Updates**: Streamlined the process of updating instance templates and performing rolling updates using GitHub Actions and `gcloud` commands.
- **Improved Deployment Workflow**: Enhanced reliability and scalability of the deployment workflow by automating critical tasks.

# Assignment 7: Cloud Pub/Sub, Email Verification, and User Authorization

### Overview
Assignment 7 focused on implementing cloud pub/sub messaging for email verification and user authorization workflows within the web application.

### Steps Taken
1. **Cloud Pub/Sub Integration**: Configured cloud pub/sub to send messages triggering subsequent actions, such as email verification.
2. **Email Sending Functionality**: Developed a cloud function triggered by pub/sub messages to send an email with a verification link to newly created users.
3. **Token Tracking**: Implemented a new table to track tokens generated during email sending, ensuring verification within a specific timeframe (e.g., 2 minutes) to prevent link expiration.

### Benefits and Outcomes
- **Automated Email Verification**: Enabled automated email verification for newly registered users, enhancing user authentication and security.
- **Event-Driven Architecture**: Adopted an event-driven architecture using cloud pub/sub, improving application responsiveness and scalability.

# Assignment 6: Implement Cloud Logging for WebApp with DevOps

### Overview
The primary objective of Assignment 6 was to establish comprehensive logging for the web application using Google Cloud Logging services.

### Steps Taken
1. **Logging Library Selection**: Employed Winston, a robust logging library, to write logs to a file within the application.
2. **Configuration Setup**: Created a custom `config.yaml` configuration file to seamlessly integrate logs into Google Cloud Logging services.
3. **Symlink Configuration**: Utilized symbolic links (symlinks) to ensure logs were placed in a designated location accessible to the DevOps team.

### Benefits and Outcomes
- **Efficient Monitoring**: Enabled efficient monitoring and troubleshooting of the web application through centralized logging.
- **Reliability and Scalability**: Enhanced the overall reliability and scalability of the application by implementing robust logging practices.


# Assignment 5: Create private Cloud SQL and connect the instance using PSC

## Overview
This assignment delved deeper into Terraform usage, with a primary focus on infrastructure updates. Our goal was to implement Cloud SQL and establish private service connectivity for secure database access.

As part of the process, we streamlined the web application setup by removing the local database installation step during image creation. This optimization enhances the efficiency and reliability of the infrastructure while ensuring seamless integration with cloud-based services.
# Assignment 4: Custom Image Creation with Packer

## Overview
In this assignment, we use Packer to create a custom image for deploying our web application. The base image used is CentOS Stream 8 family. The custom image will have all the necessary dependencies and configurations pre-installed and set up, making it ready to deploy the web application

### `packer/scripts/` Directory
This directory contains all the scripts required for setting up the custom image. Here's a brief description of each script:
- **`setup.sh`**: Installs Node.js version 20, along with zip and unzip utilities. This script ensures that the environment is prepared with the necessary runtime and tools for the application.
- **`move_app.sh`**: Installs and configures the Google Operations Agent, which is used for monitoring and logging.  
- **`google_ops_agent.sh`**: Sets up the application to run as a managed service. This includes creating a systemd service file, enabling the service to start on boot, and starting the service immediately. This ensures that the application is continuously running and managed by the system's init system

### `service/` Directory
This directory contains the systemd service unit file for our web application:
- **`app.service`**: This service unit file ensures that our web application automatically starts on boot and manages its lifecycle.

## Usage
To create the custom image and deploy the web application, follow these steps:
1. Navigate to the `packer/` directory.
2. Execute Packer with the provided template to build the custom image.
3. Once the custom image is created, launch an instance using this image.
4. The web application will be automatically started on the instance boot-up.

## Note
- Update gcp-credentials secret to build it using github actions
Ensure that you have the necessary permissions and access rights to create and launch instances in your Google Cloud Platform project. Also, verify the network configurations and firewall rules to allow traffic to the web application port.

That's it! You're now ready to deploy your web application using the custom image created with Packer.

## GitHub Actions

### Packer Validation Action
This GitHub Action ensures that the Packer template files are correctly formatted and validated before proceeding with further actions. It performs the following steps:
1. Runs `packer fmt` to format the Packer template files.
2. Runs `packer validate` to ensure the validity of the Packer template files.
3. If there is any output from `packer fmt` or if the validation fails, the action will fail, preventing further execution.

### Integration Tests Action
This GitHub Action is triggered after a merge is closed and is responsible for running integration tests on the latest code changes. It performs the following tasks:
1. Sets up Google Cloud Platform (GCP) credentials required for interacting with GCP services.
2. Builds a new custom image using the latest code changes and configurations.
3. Runs integration tests to ensure the correctness and stability of the application.
4. If the integration tests pass successfully, the action completes without any issues. Otherwise, it fails, indicating the presence of potential issues in the codebase.

### Usage
To use these GitHub Actions, simply include them in your repository's workflows. Ensure that the necessary secrets and environment variables are properly configured to enable access to GCP and other required services.

That's it! With these GitHub Actions set up, you can ensure the quality and reliability of your application deployment process.

# Assignment 3: Integration Testing for Web Application
## Overview
This assignment focuses on writing integration tests for a web application using packages such as Mocha, Chai, and Supertest. The tests cover various HTTP methods such as POST, PUT, and GET to ensure the functionality of creating and updating users.

## Testing Approach
**Test Scenarios**: Tests are written to cover scenarios for creating users, fetching to verify successful creation, updating users, and validating fields for these endpoints.

**Dependencies**: The project relies on Mocha as the testing framework, Chai for assertions, and Supertest for making HTTP requests to the server.

***Chai Compatibility***: Note that Chai 5.x.x is an ES6 module and cannot be imported using require. Therefore, it's recommended to stick to version 4.x.x.

### Running Tests
- To execute the tests, run ```npm test``` in the project directory. This command will trigger the test suite, validating the functionality of the web application.

### Continuous Integration
- A GitHub action named ```run-test``` has been added to automatically run the tests before merging new code into the main branch. This ensures that any changes introduced do not break existing functionality.


# Assignment 2: Enhancing Users API, Continuous Integration, and Git Setup

In this assignment, the primary objective is to expand the API functionality by introducing additional endpoints that facilitate the creation, retrieval, and modification of user data in the MySQL API. Concurrently, we are leveraging GitHub for project management and implementing continuous integration actions.

## Features

### Users Endpoints

- The Users endpoints encompass three fundamental operations: POST, GET, and PUT.
- Usernames are unique and are defined by email ID, ensuring that multiple users cannot share the same email ID.

#### Create User

- The POST API at /v2/user initiates the creation of a new user and provides relevant responses for different scenarios:
  - Responds with 400 for missing fields or an invalid body.
  - Responds with 409 if the username already exists.
  - Handles other potential errors with an internal server error (500).

#### Get self User

- The GET API at /v2/user/self verifies the presence of a basic authentication token through middleware.
  - If authorized, returns user data.
  - If unauthorized, sends an unauthorized message with a 400 status code.

#### Update self user

- The PUT API at /v2/user/self checks for the presence of updatable fields along with an authentication token.
  - If authorized, updates the user data accordingly.
  - If unauthorized, sends an unauthorized message with a 400 status code.

# Assignment 1: Building a Basic API with Node.js, Express, Sequelize, and MySQL

In this assignment, the goal is to create a simple API to test the connection to a local database. The project utilizes Node.js, Express, Sequelize, and MySQL to showcase the required functionality.

## Features

### Healthz Endpoint
- The API includes a `healthz` endpoint designed to perform a database connection test.
- To start database server use `MySQL` desktop app
- To verify the connection status, you can use the following curl request:
```bash
curl -vvvv http://localhost:3000/healthz
```
- This request returns either "OK" or "Service Unavailable" based on the connection status.
  
## Middleware Blocking Other HTTP Methods
- The healthz endpoint has been secured by middleware to allow only specific HTTP methods.
- To test this middleware, you can use the following curl requests:
  - PUT request:
  ```bash 
  curl -vvvv -X PUT http://localhost:3000/healthz
  ```

  - POST request:
  ```bash 
  curl -vvvv -X PUT http://localhost:3000/healthz
  ```
  - DELETE request:
  ```bash 
  curl -vvvv -X DELETE http://localhost:3000/healthz
  ```
  - PATCH request:
  ```bash 
  curl -vvvv -X PATCH http://localhost:3000/healthz
  ```
