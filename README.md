<div style="text-align:center; margin-top: 50px">
   <img src="public/logo.png" width="200">
   <h1 style="margin-top: 0">UnsubscribeMate Backend</h1>
</div>

UnsubscribeMate Backend is a Node.js application designed to handle the server-side operations for UnsubscribeMate, helping users easily manage and unsubscribe from unwanted email subscriptions directly from their Gmail inbox. The backend utilizes Puppeteer and OpenAI to process unsubscribe links and communicate with the frontend via Socket.io.


https://github.com/jtejederabit/unsubscribemate_be/assets/130762129/0f9b0365-734d-40af-ba03-0c90280c0760


## Features

- **Socket.io Integration**: Real-time communication with the frontend to handle unsubscribe requests.
- **Puppeteer Automation**: Automates the process of navigating to unsubscribe links and performing unsubscribe actions.
- **OpenAI Integration**: Analyzes HTML content to identify and interact with unsubscribe elements.
- **Error Handling**: Captures and logs errors during the unsubscribe process, including screenshots.
- **Progress Tracking**: Tracks the progress of unsubscribe actions and reports back to the frontend.

## Installation

To run the backend server locally, follow these steps:

1. **Clone the repository**:
    ```sh
    git clone https://github.com/jtejederabit/unsubscribemate_be.git
    cd unsubscribemate_be
    ```

2. **Install dependencies**:
    ```sh
    npm install
    ```

3. **Set up environment variables**:
    - Create a `.env` file in the root directory.
    - Add your OpenAI API key and other necessary environment variables:
        ```env
        OPENAI_API_KEY=your_openai_api_key
        PORT=3000
        ```

4. **Run the server**:
    ```sh
    npm start
    ```

## Usage

1. **Start the Server**: Ensure the backend server is running locally or on your preferred server environment.
2. **Connect Frontend**: The frontend application will connect to the backend via the specified API URL in the environment variables.

## Project Structure

- **server.js**: Entry point for the server.
- **app.js**: Express app configuration.
- **socket.js**: Socket.io configuration and event handling.
- **repository.js**: Functions to load and save the repository of unsubscribe methods.
- **errorHandler.js**: Functions to handle errors and save error logs.
- **unsubscribe.js**: Core logic for handling unsubscribe requests.
- **analyzer.js**: Functions to analyze HTML content using OpenAI.

## Components

- **app.js**: Sets up middleware and routes for the application.
- **socket.js**: Manages Socket.io connections and events.
- **repository.js**: Loads and saves the unsubscribe methods repository.
- **errorHandler.js**: Logs errors and captures screenshots.
- **unsubscribe.js**: Processes unsubscribe links using Puppeteer.
- **analyzer.js**: Analyzes HTML content to identify unsubscribe elements.

## Improvements

Future improvements and features that could be added to the UnsubscribeMate Backend:

- **Enhanced Error Reporting**: More detailed error messages and categorization of errors to improve troubleshooting.
- **Retry Mechanism**: Implement a retry mechanism for failed unsubscribe attempts to increase success rates.
- **Scalability**: Optimize the server for handling a larger volume of requests simultaneously.
- **Advanced Logging**: Integrate with logging services for better monitoring and analytics.
- **User Management**: Implement user management features to handle multiple users with different preferences.
- **Database Integration**: Store unsubscribe methods and logs in a database for better persistence and querying.
- **Security Enhancements**: Enhance security features such as rate limiting, IP whitelisting, and improved authentication methods.
- **Automated Testing**: Add comprehensive automated tests to ensure the reliability and stability of the application.
## License

This project is licensed under the MIT License.

## Acknowledgements

- [Express](https://expressjs.com/)
- [Puppeteer](https://pptr.dev/)
- [OpenAI](https://openai.com/)
- [Socket.io](https://socket.io/)

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any changes or improvements.

---

Developed with ❤️ by [JTEJEDERABIT](https://github.com/jtejederabit)
