# KNY
This project serves as the Summative Assessment for students in the Intergrated Application Development module.  It focuses on designing, developing, implementing, and documenting a Java-based web application using the Spring Framework with Spring Boot and RESTful Web Services.

## Project Overview
The Know-Your-Neighborhood application is a web-based platform that enables users to log in or sign up using OAuth2 API to access basic information such as name and email.

## Purpose
The project serves as a Summative Assessment to evaluate skills in developing, implementing, and documenting a dynamic website using the Spring Framework, React, NodeJS, MySQL, Eclipse IDE and Visual Studio Code IDE.

## Prerequisites
- **Development Environment**:
  - Eclipse IDE
  - VS Code IDE
  - React
  - NodeJs
  - Spring Framework
  - MySQL Database
  - phpMyAdmin or MySQL Client
  - Javadoc
  - Microsoft Word (for documentation)
  - Microsoft PowerPoint (for presentations)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/benjamintzh/KNY.git
   ```

2. **Set Up MySQL Database**:
   - Import the database schema into MySQL using phpMyAdmin or a MySQL client.
   - Update the database connection settings in `src/main/resources/application.properties`:
     ```properties
     spring.datasource.url=jdbc:mysql://localhost:3306/<database-name>
     spring.datasource.username=<your-username>
     spring.datasource.password=<your-password>
     ```

3. **Set Up Google OAuth2 CLient ID and Secret**:
   - Get Your Client ID and Secret from Google Cloud Console.
   - Update the database connection settings in `src/main/resources/application.properties`:
     ```properties
     spring.security.oauth2.client.registration.google.client-id=YOUR-GOOGLE-CLIENT-ID
     spring.security.oauth2.client.registration.google.client-secret=YOUR-GOOGLE-CLIENT-SECRET
     ```

4. **Run the Application**:
   - Right-click the project in Eclipse, select **Run As > Spring Boot App**.
   - Access the application at `http://localhost:8080`.
  
5. **Set up Google API KEY in Environment file**:
   - Right-click the project in Eclipse, select **Run As > Spring Boot App**.
   - Update the API settings in `kyn-frontend/.env`:
     ```.env
     REACT_APP_GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
     ```

6. **Run the Application**:
   - On the VS Code Terminal **Enter cd kyn-frontend > npm start**.
   - Access the application at `http://localhost:3000`.

## Configuration Notes
- **API and OAuth Client ID**: Confirm that the API and OAuth Cleint ID and Secret in `application.properties` and `.env` are correct.
- **Database**: Confirm that the MySQL database is running and the connection details in `application.properties` are correct.

## Contributing
This is a student project for academic purposes. Contributions are not expected, but feedback from tutors should be incorporated as per the Project Guidelines.

## License
This project is for educational purposes and not distributed under any open-source license.
