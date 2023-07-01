## Side Stacker aka Totally-Not-Connect-Four

You can either run this game locally or via Docker.

### Local 

1. This game uses Postgres and Sequelize. Create a new database called 'side_stacker' and then add your credentials to `server/src/.env` (see `.env.example` for template)
2. Install dependencies in `/server` and `/client` with `npm i`
3. Start the servers in each directory with `npm run start`
4. Visit `localhost:3000` to see the game
5. For "multiplayer", open two tabs and connect the first one to a new game and then the second one to the same game by entering in the game ID in the input field. To just see how the game works, toggle 'Couch co-op mode'

### Docker

From the root directory, run `docker compose build` and then `docker compose up db`, `docker compose up server` and `docker compose up client`. Visit `localhost:3000`.