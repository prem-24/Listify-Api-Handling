
## How to Run

To run this API, follow these steps:

1. **Install Node.js**: If you haven't already, install [Node.js](https://nodejs.org/en/download/). You can download and install it from the official website.

2. **Clone the Repository**: Clone this repository to your local machine using the following command:

   ```bash
   git clone https://github.com/JAFSCodeSchool/fetch-api-back-end.git
   ```

3. **Navigate to the Project Directory**: Open a terminal or command prompt, navigate to the project directory using the `cd` command.

4. **Install Dependencies**: Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

5. **Start the Server**: After installing the dependencies, start the server by running:

   ```bash
   node index.js
   ```

   This will start the server, and you should see a message indicating that the server is running.

6. **Access the API Endpoints**: Once the server is running, you can access the API endpoints using a tool like [Postman](https://www.postman.com/) or by making HTTP requests from your frontend application.

## Endpoints

### GET /api/list

- Description: Get the list of items.
- Authentication: Not required.

### GET /api/list/:id

- Description: Get a specific item by ID.
- Authentication: Not required.

### POST /api/list

- Description: Add a new item to the list.
- Authentication: Required (Bearer token: xyzddd).

### PUT /api/list/:id

- Description: Update an existing item by ID.
- Authentication: Required (Bearer token: xyzddd).

### DELETE /api/list/:id

- Description: Delete an item by ID.
- Authentication: Required (Bearer token: xyzddd).

### GET /api/download

- Description: Download a sample text file.
- Authentication: Not required.

### POST /api/upload

- Description: Upload a file.
- Authentication: Not required.

### POST /api/stream-video

- Description: Stream a video file. Note: You need to provide your own video file. Add your video file to the `assets` folder and update the code in `index.js` with the correct file name.
- Authentication: Required (Bearer token: xyzddd).

## License

This project is licensed under the [MIT License](LICENSE).
