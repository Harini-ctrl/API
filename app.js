const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const app = express();
app.use(express.json());

const dbPath = path.join(__dirname, "cricketTeam.db");

let db = null;
const convertDbObjectToResponseObject = (dbObject) => {
  return {
    playerId: dbObject.player_id,
    playerName: dbObject.player_name,
    jerseyNumber: dbObject.jersey_number,
    role: dbObject.role,
  };
};

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at http://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDBAndServer();
app.get("/players/", async (request, response) => {
  const getPlayersQuery = `
 SELECT
 *
 FROM
 cricket_team;`;
  const playersArray = await db.all(getPlayersQuery);
  response.send(
    playersArray.map((eachPlayer) =>
      convertDbObjectToResponseObject(eachPlayer)
    )
  );
});
app.post("/players/", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const postPlayerQuery = `
  INSERT INTO
    cricket_team (player_name, jersey_number, role)
  VALUES
    ('${playerName}', ${jerseyNumber}, '${role}');`;
  const player = await database.run(postPlayerQuery);
  response.send("Player Added to Team");

  const dbResponse = await db.run(addPlayer);
  response.send("Player added to team");
});
app.put("/players/:playerId", async (request, response) => {
  const { playerName, jerseyNumber, role } = request.body;
  const { playerId } = request.params;
  const updatePlayerQuery = `
  UPDATE
    cricket_team
  SET
    player_name = '${playerName}',
    jersey_number = ${jerseyNumber},
    role = '${role}'
  WHERE
    player_id = ${playerId};`;

  await database.run(updatePlayerQuery);
  response.send("Player Details Updated");
  const dbResponse = await db.run(addPlayer);
  response.send("Player details updated");
});
app.delete("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const deletePlayer = `
    DELETE FROM
      cricket_team
    WHERE
      playerId = ${playerId};`;
  await db.run(deletePlayer);
  response.send("Book Deleted Successfully");
});
app.get("/players/:playerId/", async (request, response) => {
  const { playerId } = request.params;
  const getPlayer = `
    SELECT
      *
    FROM
      cricket_team
    WHERE
    playerId = ${playerId};`;
  const book = await db.get(getPlayer);
  response.send(convertDbObjectToResponseObject(player));
});
module.exports = app;
