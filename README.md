# GarageFlow+

GarageFlow+ est une application de gestion de garage automobile. Le projet contient un frontend React, un backend Spring Boot, un service Machine Learning Flask et une base de donnees MySQL.

## Architecture du projet

```text
GarageFlow+
├── backend/
│   └── backend/              # API REST Spring Boot
├── frontend/
│   └── frontend/             # Interface React + Vite
├── ml/                       # Service IA Flask
├── gestion_flotte.sql        # Dump SQL local de la base de donnees, non publie si sensible
└── vehicle_maintenance_data.csv
```

## Technologies utilisees

- Frontend : React, Vite, Tailwind CSS, Axios
- Backend : Java 21, Spring Boot, Spring Security, Spring Data JPA, JWT
- Base de donnees : MySQL
- Machine Learning : Python, Flask, scikit-learn, pandas, numpy, joblib
- OCR carte grise : Tesseract.js cote frontend

## Prerequis

Avant de lancer le projet, installer :

- Node.js
- Java JDK 21
- Maven, ou utiliser le wrapper Maven fourni avec le projet
- Python 3.10 ou plus
- MySQL Server
- Git

## 1. Cloner le projet

```bash
git clone https://github.com/layhioualid/garageflow.git
cd garageflow
```

## 2. Importer la base de donnees

Demarrer MySQL, puis creer et importer la base :

```sql
CREATE DATABASE gestion_flotte;
```

Importer ensuite le fichier local `gestion_flotte.sql` avec phpMyAdmin ou avec la commande :

```bash
mysql -u root -p gestion_flotte < gestion_flotte.sql
```

Important : ne pas publier un dump SQL contenant des comptes, clients, mots de passe ou donnees personnelles. Pour GitHub, garder uniquement un script SQL anonymise ou un schema sans donnees sensibles.

Par defaut, le backend utilise :

```properties
DB_URL=jdbc:mysql://localhost:3306/gestion_flotte
DB_USERNAME=root
DB_PASSWORD=
```

Si votre mot de passe MySQL est different, il faut le configurer avant de lancer le backend.

## 3. Lancer le service Machine Learning Flask

Aller dans le dossier ML :

```bash
cd ml
```

Creer un environnement virtuel :

```bash
python -m venv venv
```

Activer l'environnement virtuel sous Windows :

```bash
venv\Scripts\activate
```

Installer les dependances :

```bash
pip install -r requirements.txt
```

Verifier que ces fichiers existent dans le dossier `ml` :

```text
vehicle_maintenance_model_bundle.joblib
vehicle_maintenance_model_bundle.metadata.json
```

Lancer le service Flask :

```bash
python app.py
```

Le service IA demarre par defaut sur :

```text
http://127.0.0.1:5000
```

Endpoint principal :

```text
POST http://127.0.0.1:5000/predict-maintenance
```

## 4. Lancer le backend Spring Boot

Ouvrir un nouveau terminal, puis aller dans le backend :

```bash
cd backend/backend
```

Lancer le backend avec Maven Wrapper :

```bash
.\mvnw.cmd spring-boot:run
```

Ou avec Maven installe globalement :

```bash
mvn spring-boot:run
```

Le backend demarre par defaut sur :

```text
http://localhost:8080
```

L'API principale est disponible sous :

```text
http://localhost:8080/api
```

Le backend communique avec le service IA via :

```text
http://127.0.0.1:5000/predict-maintenance
```

## 5. Lancer le frontend React

Ouvrir un nouveau terminal, puis aller dans le frontend :

```bash
cd frontend/frontend
```

Installer les dependances :

```bash
npm install
```

Lancer l'application :

```bash
npm run dev
```

Le frontend demarre par defaut sur :

```text
http://localhost:5173
```

Le frontend envoie les requetes API vers :

```text
http://localhost:8080/api
```

## Ordre de lancement recommande

1. Demarrer MySQL
2. Importer `gestion_flotte.sql` si la base n'existe pas encore
3. Lancer le service Flask ML
4. Lancer le backend Spring Boot
5. Lancer le frontend React
6. Ouvrir `http://localhost:5173`

## Variables de configuration utiles

Backend Spring Boot :

```properties
SERVER_PORT=8080
DB_URL=jdbc:mysql://localhost:3306/gestion_flotte
DB_USERNAME=root
DB_PASSWORD=
UPLOAD_DIR=C:/Users/21263/Desktop/Nouveau dossier/backend/backend/uploads/
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=
MAIL_PASSWORD=
```

Service Flask :

```properties
FLASK_HOST=127.0.0.1
FLASK_PORT=5000
```

## Fonctionnalites principales

- Authentification et gestion des roles
- Tableau de bord garage
- Gestion des clients
- Gestion des vehicules
- Extraction OCR des informations depuis la carte grise
- Gestion des interventions
- Photos d'etat initial, before et after
- Ordre de reparation et besoins client
- Gestion des techniciens
- Gestion des pieces et stock
- Gestion des fournisseurs et achats
- Gestion des devis et factures
- Notifications interface
- Predictions IA pour savoir si un vehicule a besoin de maintenance

## Verification du projet

Verifier le build frontend :

```bash
cd frontend/frontend
npm run build
```

Verifier le backend :

```bash
cd backend/backend
.\mvnw.cmd test
```

Verifier le service ML :

```bash
cd ml
python app.py
```

## Problemes frequents

Si le frontend ne charge pas les donnees :

- Verifier que le backend est lance sur `http://localhost:8080`
- Verifier que MySQL est demarre
- Verifier que la base `gestion_flotte` existe

Si la prediction IA ne marche pas :

- Verifier que Flask est lance sur `http://127.0.0.1:5000`
- Verifier que le fichier `vehicle_maintenance_model_bundle.joblib` existe dans `ml`
- Verifier que les dependances Python sont installees

Si le backend ne se connecte pas a MySQL :

- Verifier le nom de la base `gestion_flotte`
- Verifier `DB_USERNAME`
- Verifier `DB_PASSWORD`

## Commandes Git utiles

Voir les fichiers modifies :

```bash
git status
```

Ajouter les modifications :

```bash
git add .
```

Creer un commit :

```bash
git commit -m "Add project setup README"
```

Pousser vers GitHub :

```bash
git push origin main
```
