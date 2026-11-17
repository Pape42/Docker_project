const os = require("node:os");
const path = require("node:path");
const express = require("express");
const { Pool } = require("pg");

// Le port sur lequel l'application écoute. 3000 si on ne précise rien.
const PORT = process.env.PORT || 3000;

// La connexion à la base.

const pool = new Pool();

// Évite que l'application plante si la base disparaît en cours de route.
pool.on("error", (err) => {
  console.error("Base : connexion perdue (" + err.message + ")");
  baseConnectee = false;
  setTimeout(connecterLaBase, 2000);
});

let baseConnectee = false;
let dernierMessage = "";

// Les 5 personnages ajoutés au premier lancement, si la table est vide.
const PERSONNAGES_DE_DEPART = [
  ["Son Goku", "Saiyan", 7, "Kamehameha"],
  ["Vegeta", "Saiyan", 7, "Final Flash"],
  ["Son Gohan", "Demi-Saiyan", 7, "Masenko"],
  ["Piccolo", "Namek", 7, "Makankosappo"],
  ["Beerus", "Dieu de la Destruction", 7, "Hakai"],
];

// Se connecte à la base, crée la table si besoin et ajoute les 5 personnages.

async function connecterLaBase() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS personnages (
        id serial PRIMARY KEY,
        nom text NOT NULL,
        race text NOT NULL,
        univers int NOT NULL,
        technique text NOT NULL,
        cree_le timestamptz DEFAULT now()
      )
    `);

    const { rows } = await pool.query("SELECT count(*)::int AS total FROM personnages");
    if (rows[0].total === 0) {
      for (const p of PERSONNAGES_DE_DEPART) {
        await pool.query(
          "INSERT INTO personnages (nom, race, univers, technique) VALUES ($1, $2, $3, $4)",
          p
        );
      }
      console.log("Base : table créée et remplie avec 5 personnages d'exemple");
    }

    baseConnectee = true;
    console.log("Base : connectée");
  } catch (err) {
    baseConnectee = false;
    // On n'affiche le message que s'il change, pour ne pas inonder les logs.
    const message = "Base : non connectée (" + err.message + "), nouvel essai toutes les 2 s";
    if (message !== dernierMessage) console.log(message);
    dernierMessage = message;
    setTimeout(connecterLaBase, 2000);
  }
}

const app = express();
app.use(express.json());

// La page web.
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});


app.get("/api/sante", (req, res) => {
  res.json({
    api: "ok",
    base: baseConnectee ? "connectée" : "non connectée",
    conteneur: os.hostname(),
  });
});

// La liste des personnages.
app.get("/api/personnages", async (req, res) => {
  if (!baseConnectee) {
    return res.status(503).json({ erreur: "base non connectée" });
  }
  try {
    const { rows } = await pool.query(
      "SELECT id, nom, race, univers, technique FROM personnages ORDER BY id"
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ erreur: err.message });
  }
});

// Ajouter un personnage.
app.post("/api/personnages", async (req, res) => {
  if (!baseConnectee) {
    return res.status(503).json({ erreur: "base non connectée" });
  }
  const { nom, race, univers, technique } = req.body || {};
  if (!nom || !race || !univers || !technique) {
    return res.status(400).json({ erreur: "nom, race, univers et technique sont obligatoires" });
  }
  try {
    const { rows } = await pool.query(
      "INSERT INTO personnages (nom, race, univers, technique) VALUES ($1, $2, $3, $4) RETURNING id, nom, race, univers, technique",
      [nom, race, univers, technique]
    );
    res.status(201).json(rows[0]);
  } catch (err) {
    res.status(400).json({ erreur: err.message });
  }
});

// On démarre le serveur web tout de suite, puis on tente la base en tâche de fond.
app.listen(PORT, () => {
  console.log("Dragon Ball Super : application démarrée sur le port " + PORT);
  connecterLaBase();
});

// Arrêt propre quand Docker demande au conteneur de s'arrêter (docker stop).
process.on("SIGTERM", () => {
  console.log("Dragon Ball Super : arrêt demandé, au revoir");
  process.exit(0);
});
