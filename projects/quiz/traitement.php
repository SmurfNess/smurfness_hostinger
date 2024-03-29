<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Traitement du Formulaire</title>
    <style>
        body {
            background-color: #f0f0f0; /* Gris clair */
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
        }

        .container {
            background-color: #fff; /* Fond blanc pour le contenu */
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            padding: 20px;
            width: 300px;
        }

        h2 {
            text-align: center;
            color: #333; /* Couleur de texte sombre */
        }

        .message {
            margin-top: 15px;
            text-align: center;
            color: #ff0000; /* Rouge pour les messages d'erreur */
        }
    </style>
</head>
<body>

<div class="container">
    <h2>Traitement du Formulaire</h2>

    <?php
    // Inclure votre fichier de configuration
    include('config.php');

    try {
        // Vérifier si le formulaire a été soumis
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            // Récupérer les données du formulaire
            $form_username = $_POST['username'];
            $form_password = $_POST['password'];
            $confirm_password = $_POST['confirm_password'];

// Vérifier si les mots de passe correspondent
if ($form_password !== $confirm_password) {
    echo "<p class='message'>Les mots de passe ne correspondent pas.</p>";
    // Vous pouvez rediriger l'utilisateur vers le formulaire de création de compte ici si nécessaire
} else {
    // Hasher le mot de passe avant de l'ajouter à la base de données (sécurité)
    $hashed_password = password_hash($form_password, PASSWORD_DEFAULT);

    // Établir la connexion à la base de données
    try {
        $connexion = new PDO("mysql:host={$host};dbname={$dbname}", $username, $password);
    } catch (PDOException $e) {
        die("<p class='message'>Erreur lors de la connexion à la base de données : " . $e->getMessage() . "</p>");
    }

    // Vérifier si le nom d'utilisateur existe déjà
    $check_username_query = $connexion->prepare("SELECT COUNT(*) FROM access WHERE username = ?");
    $check_username_query->execute([$form_username]);
    $username_exists = $check_username_query->fetchColumn();

    if ($username_exists) {
        echo "<p class='message'>Le nom d'utilisateur existe déjà.</p>";
    } else {
        // Préparer la requête d'insertion
        $insert_query = $connexion->prepare("INSERT INTO access (username, password, type) VALUES (?, ?, '404')");

        // Exécuter la requête avec les données du formulaire
        if ($insert_query->execute([$form_username, $hashed_password])) {
            echo "<p class='message'>Le compte a été créé avec succès.</p>";
        } else {
            echo "<p class='message'>Erreur lors de l'insertion dans la base de données : " . print_r($insert_query->errorInfo(), true) . "</p>";
        }
    }

    // Fermer la connexion à la base de données
    $connexion = null;

    // Vous pouvez rediriger l'utilisateur vers une page de connexion ici si nécessaire
}
        }
    } catch (Exception $e) {
        echo "<p class='message'>Exception capturée : " . $e->getMessage() . "</p>";
    }
    ?>

</div>

</body>
</html>
