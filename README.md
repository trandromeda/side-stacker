## Side Stacker aka Totally-Not-Connect-Four

You can either run this game locally or via Docker (recommended).

### Local 

1. This game uses Postgres and Sequelize. Create a new database called 'side_stacker' (or whatever you want) and then add your database credentials to `server/src/.env` (see `.env.example` for template)
2. Install dependencies in `/server` and `/client` with `npm i`
3. Start the servers in each directory with `npm run start`
4. Visit `localhost:3000` to see the game
5. For "multiplayer", open two tabs and connect the first one to a new game and then the second one to the same game by entering in the game ID in the input field. To just see how the game works, toggle 'Couch co-op mode'

### Docker

From the root directory, run `docker compose build` and then `docker compose up`. Visit `localhost:3000`.

Have fun!

<img width="881" alt="side stacker screenshot" src="https://github.com/trandromeda/side-stacker/assets/8782432/f7810e32-9988-4732-b6bc-ace771e347b6">

