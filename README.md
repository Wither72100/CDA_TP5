# TP4 - Persistance des données avec PostgreSQL et Docker

Ce projet consiste à intégrer une base de données PostgreSQL dans une API Node.js et à utiliser Docker pour lancer l'API et la base de données.

L'API permet de créer, consulter, modifier et supprimer des tâches.

---

## Prérequis

Avant de lancer le projet, il faut avoir installé :

- Docker Desktop
- Git
- Bruno pour tester l'API
- DBeaver pour consulter la base PostgreSQL (optionnel)

---

## Structure du projet

```text
CDA_TP4/
├── db-init/
│   └── init.sql
├── Dockerfile
├── docker-compose.yml
├── package.json
├── package-lock.json
├── server.js
└── README.md
```

---

# 1. Installation du projet

Cloner le projet GitHub :

```bash
git clone https://github.com/TON-PSEUDO/CDA_TP4.git
```

Entrer dans le dossier :

```bash
cd CDA_TP4
```

---

# 2. Construire et lancer Docker

Le projet utilise deux conteneurs :

- `api` : l'API Node.js / Express
- `db` : la base de données PostgreSQL

Pour construire les images Docker :

```bash
docker compose build
```

Pour démarrer les conteneurs :

```bash
docker compose up -d
```

Ou pour construire et démarrer directement :

```bash
docker compose up -d --build
```

Cette dernière commande est recommandée après une modification du code de l'API.

---

# 3. Vérifier que les conteneurs fonctionnent

Exécuter :

```bash
docker compose ps
```

Les deux services doivent être affichés avec le statut `Up`.

Exemple :

```text
NAME            SERVICE   STATUS
cda_tp4-api-1   api       Up
cda_tp4-db-1    db        Up
```

Les ports utilisés sont :

```text
API        : localhost:3000
PostgreSQL : localhost:5432
```

---

# 4. Consulter les logs

Pour voir les logs de l'API :

```bash
docker compose logs api
```

Pour voir les logs de PostgreSQL :

```bash
docker compose logs db
```

Pour suivre les logs en temps réel :

```bash
docker compose logs -f
```

---

# 5. Tester l'API

L'API est accessible à l'adresse :

```text
http://localhost:3000
```

Les tests peuvent être effectués avec Bruno.

## Vérifier que l'API fonctionne

Méthode :

```text
GET
```

URL :

```text
http://localhost:3000/
```

Réponse attendue :

```json
{
  "message": "bravo"
}
```

---

# 6. Créer une tâche

Méthode :

```text
POST
```

URL :

```text
http://localhost:3000/tasks
```

Dans Bruno, sélectionner :

```text
Body → JSON
```

Puis envoyer :

```json
{
  "title": "Faire le TP",
  "isCompleted": false
}
```

Réponse attendue :

```json
{
  "message": "task created",
  "newTask": {
    "id": 1,
    "title": "Faire le TP",
    "isCompleted": false
  }
}
```

---

# 7. Récupérer toutes les tâches

Méthode :

```text
GET
```

URL :

```text
http://localhost:3000/tasks
```

Cette requête retourne toutes les tâches enregistrées dans PostgreSQL.

---

# 8. Récupérer les tâches terminées

Méthode :

```text
GET
```

URL :

```text
http://localhost:3000/tasks?status=completed
```

Cette requête retourne uniquement les tâches dont `isCompleted` vaut `true`.

---

# 9. Récupérer les tâches non terminées

Méthode :

```text
GET
```

URL :

```text
http://localhost:3000/tasks?status=uncompleted
```

Cette requête retourne uniquement les tâches dont `isCompleted` vaut `false`.

---

# 10. Modifier une tâche

Méthode :

```text
PUT
```

URL :

```text
http://localhost:3000/tasks/1
```

Body JSON :

```json
{
  "title": "Faire le TP PostgreSQL",
  "isCompleted": true
}
```

La tâche ayant l'identifiant `1` est alors modifiée.

---

# 11. Changer le statut d'une tâche

Méthode :

```text
PATCH
```

URL :

```text
http://localhost:3000/tasks/1/completed
```

Aucun Body n'est nécessaire.

Cette requête inverse le statut de la tâche :

```text
false → true
```

ou :

```text
true → false
```

---

# 12. Supprimer une tâche

Méthode :

```text
DELETE
```

URL :

```text
http://localhost:3000/tasks/1
```

La tâche ayant l'identifiant `1` est supprimée de PostgreSQL.

---

# 13. Vérifier les données dans PostgreSQL avec DBeaver

DBeaver peut être utilisé pour vérifier directement les données enregistrées dans PostgreSQL.

Créer une connexion PostgreSQL avec :

```text
Host     : localhost
Port     : 5432
Database : tasks
Username : admin
Password : admin
```

Une fois connecté, aller dans :

```text
tasks
└── Schemas
    └── public
        └── Tables
            └── tasks
```

Pour afficher les données, exécuter :

```sql
SELECT * FROM tasks;
```

---

# 14. Arrêter le projet

Pour arrêter les conteneurs sans supprimer les données :

```bash
docker compose down
```

Les données PostgreSQL sont conservées dans le volume Docker.

Pour relancer le projet :

```bash
docker compose up -d
```

---

# 15. Reconstruire l'API après une modification

Si le code de `server.js` ou le `Dockerfile` a été modifié, utiliser :

```bash
docker compose up -d --build
```

Cela reconstruit l'image de l'API puis redémarre les services.

---

# 16. Réinitialiser complètement la base de données

⚠️ Cette commande supprime le volume PostgreSQL et donc les données enregistrées dans la base.

```bash
docker compose down -v
```

Puis :

```bash
docker compose up -d --build
```

Le fichier `db-init/init.sql` est alors exécuté lors de l'initialisation de la nouvelle base.

---

# 17. Commandes Docker utiles

Voir les conteneurs :

```bash
docker compose ps
```

Voir tous les conteneurs, même ceux qui sont arrêtés :

```bash
docker compose ps -a
```

Voir les logs de l'API :

```bash
docker compose logs api
```

Voir les logs de PostgreSQL :

```bash
docker compose logs db
```

Arrêter les conteneurs :

```bash
docker compose down
```

Construire les images :

```bash
docker compose build
```

Construire et démarrer :

```bash
docker compose up -d --build
```

---

# 18. Résumé du lancement

Pour lancer rapidement le projet après l'avoir cloné :

```bash
git clone https://github.com/TON-PSEUDO/CDA_TP4.git
cd CDA_TP4
docker compose up -d --build
docker compose ps
```

Puis :

```text
API        → http://localhost:3000
PostgreSQL → localhost:5432
```

Les requêtes API peuvent ensuite être envoyées depuis Bruno.

---

## Technologies utilisées

- Node.js
- Express
- PostgreSQL
- Docker
- Docker Compose
- Bruno
- DBeaver
