# Tic-Tac-Toe

A project based on the game [Tic-Tac-Toe](https://en.wikipedia.org/wiki/Tic-tac-toe). The project enables users to register, join and play Tic-Tac-Toe through an interface built with [React](https://reactjs.org/) interacting with a [SocketIO](https://socket.io/) endpoint handling the events of the game inputs.



## Project Structure
    ├── api                   # backend project folder
    ├── web                   # frontend project folder
    └── README.md
### api
The api folder consists of a simple nodejs project. It uses the expressjs and socketio libraries to create a basic api server.
### web
The web folder consists of a create-react-app project. It uses tailwindcss library for styling.

## Installation

Use git to clone this package.

```bash
git clone https://github.com/erickaby/tic-tac-toe.git
```
From the root of the project directory change to each sub project directory and install the packages.
```bash
# Install npm packages in the api project folder.
cd api && npm install

# Install npm packages in the web project folder.
cd web && npm install
```
Create a environment variable file (`.env`) in the root of the web project folder
```bash
# Copy file and rename in the web project folder.
cd web && cp .env.example .env
``` 

## Usage
Both the api and web project must be ran in parallel.
```bash
# Running the api project
cd api && npm run start

# Running the web project
cd web && npm run start 
```
By default the api project will be on running on [http://localhost:8001](http://localhost:8001).

By default the web project will be on running on [http://localhost:3000](http://localhost:3000).

Go the the web project url to play the game.
## Environment Variables

The environment variable file (`.env`) only holds a single variable:
#### REACT_APP_SERVER_URL
If the server ip address changes change this variable. (A reason to change this would be if you were tunneling to a public domain, for example (localtunnel)

Default Value: `http://localhost:8001`

## Future Improvements
- A reiteration of the socket io logic would simplify the project.
- Implement disconnection cases when a user is disconnected handle what happens. 
- Implement reconnection to games.
- While playing a game on a users turn send a message telling them its their turn. 

## Known Issues
- No handling of cleaning up games in the lobby interface.
- While a game is being played, a player has no idea if the opponent has disconnected in a game.