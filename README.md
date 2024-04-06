# Proton Parley

Proton Parley is an Omegle clone that allows users to have random video chats with strangers.

## Features

- Random video chats with strangers
- Secure WebSocket communication
- Angular frontend
- Express backend

## Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/proton-parley.git
```

2. Navigate to the project directory:

```bash
cd ProtonParley
```

### Backend

3. Install backend dependencies:

```bash
cd Server
npm install
```

4. Start the backend server:

```bash
npm start
```

The backend server will start at `https://localhost:3000`.

### Frontend

5. Install frontend dependencies:

```bash
cd client/protonparley
npm install
```

6. Start the frontend development server:

```bash
ng serve
```

The frontend server will start at `http://localhost:4200`.

7. Open your web browser and navigate to `http://localhost:4200` to access the Proton Parley application.

## Configuration

- The backend server uses HTTPS and requires SSL certificate files (`key.pem` and `crt.pem`) in the `ssl` directory. Make sure to replace these files with valid SSL certificate files for secure communication.
- You may need to configure CORS settings in the backend if you deploy the application to a different domain.
