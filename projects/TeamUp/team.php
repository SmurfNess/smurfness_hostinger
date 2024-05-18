<?php
session_start();

require_once 'config.php';

if (isset($_SESSION['user_type'])) {
    $user_type = $_SESSION['user_type'];
    
    if (isset($_SESSION['login_username'])) {
        $login_username = $_SESSION['login_username'];

        if ($user_type == $admin) {
            try {
                $connexion = new PDO("mysql:host={$databaseConfig['server']};dbname={$databaseConfig['database']}", $databaseConfig['username'], $databaseConfig['password']);
                $connexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

                // Traitement de l'ajout d'un joueur
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['name']) && isset($_POST['class']) && !isset($_POST['delete_player']) && !isset($_POST['generate_teams'])) {
                    $name = $_POST['name'];
                    $class = $_POST['class'];

                    $query = "INSERT INTO players (name, class, owner) VALUES (:name, :class, :owner)";
                    $stmt = $connexion->prepare($query);
                    $stmt->bindParam(':name', $name);
                    $stmt->bindParam(':class', $class);
                    $stmt->bindParam(':owner', $login_username);
                    $stmt->execute();
                }

                // Traitement de la suppression d'un joueur
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['delete_player'])) {
                    $player_name = $_POST['player_name'];
                    $player_class = $_POST['player_class'];

                    $query = "DELETE FROM players WHERE name = :player_name AND class = :player_class AND owner = :owner";
                    $stmt = $connexion->prepare($query);
                    $stmt->bindParam(':player_name', $player_name);
                    $stmt->bindParam(':player_class', $player_class);
                    $stmt->bindParam(':owner', $login_username);
                    $stmt->execute();
                }

                // Sélectionner les joueurs de l'utilisateur connecté
                $query = "SELECT name, class, team FROM players WHERE owner = :owner";
                $stmt = $connexion->prepare($query);
                $stmt->bindParam(':owner', $login_username);
                $stmt->execute();
                $players = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Récupérer les classes distinctes des joueurs
                $query = "SELECT DISTINCT class FROM players WHERE owner = :owner";
                $stmt = $connexion->prepare($query);
                $stmt->bindParam(':owner', $login_username);
                $stmt->execute();
                $classes = $stmt->fetchAll(PDO::FETCH_COLUMN);

                // Génération des équipes en fonction de l'option choisie
                if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['generate_teams']) && isset($_POST['team_size']) && isset($_POST['team_option'])) {
                    $team_size = max(2, (int)$_POST['team_size']);
                    $team_option = $_POST['team_option'];

                    // Fonction pour mélanger les joueurs selon l'option choisie
                    function shufflePlayers($players, $team_size, $team_option) {
                        shuffle($players);

                        $teams = [];
                        $class_teams = [];

                        foreach ($players as $player) {
                            if ($team_option === 'all_classes' || $team_option === 'mixed_classes') {
                                $class_teams[$player['class']][] = $player;
                            } elseif ($team_option === $player['class']) {
                                $teams[] = [$player];
                            }
                        }

                        if ($team_option === 'mixed_classes') {
                            foreach ($class_teams as $class_players) {
                                $team_index = 0;
                                foreach ($class_players as $player) {
                                    $teams[$team_index][] = $player;
                                    $team_index = ($team_index + 1) % $team_size;
                                }
                            }
                        }

                        return $teams;
                    }

                    // Générer les équipes en fonction de l'option choisie
                    $teams = shufflePlayers($players, $team_size, $team_option);

                    // Mise à jour des équipes dans la base de données...
                }
            } catch (PDOException $e) {
                echo "Erreur de connexion : " . $e->getMessage();
            }
            ?>

            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Équipe</title>
            </head>
            <body>
                <h1>Gestion des joueurs et des équipes</h1>

                <section>
                    <h2>Ajouter un joueur</h2>
                    <form method="post" action="team.php">
                        <label for="name">Nom :</label>
                        <input type="text" id="name" name="name" required><br><br>
                                            
                        <label for="class">Classe :</label>
                        <input type="text" id="class" name="class" required><br><br>
                        
                        <input type="submit" value="Ajouter">
                    </form>
                </section>

                <section>
                    <h2>Générer les équipes</h2>
                    <form method="post" action="team.php">
                        <label for="team_size">Taille de l'équipe :</label>
                        <input type="number" id="team_size" name="team_size" value="2" min="2" required><br><br>
                        
                        <label for="team_option">Option de génération :</label>
                        <select name="team_option" id="team_option">
                            <option value="all_classes">Toutes les classes</option>
                            <?php foreach ($classes as $class): ?>
                                <option value="<?php echo $class; ?>">Classe <?php echo $class; ?></option>
                            <?php endforeach; ?>
                            <option value="mixed_classes">Classes mixtes</option>
                        </select><br><br>
                        
                        <input type="hidden" name="generate_teams" value="true">
                        <input type="submit" value="Générer les équipes">
                    </form>
                </section>

                <section>
                    <h2>Liste des joueurs</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Classe</th>
                                <th>Équipe</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <?php foreach ($players as $player): ?>
                                <tr>
                                    <td><?php echo $player['name']; ?></td>
                                    <td><?php echo $player['class']; ?></td>
                                    <td><?php echo $player['team']; ?></td>
                                    <td>
                                        <form method="post" action="team.php" style="display:inline;">
                                            <input
