/** Fonction de connexion utilisateur 
 * Elle envoie les identifiants (username + password) au backend
 * et récupère un token JWT si les identifiants sont corrects.*/
export async function loginUser(username: string, password: string) {

  // Appel API vers le backend (route login)
  const res = await fetch("http://localhost:8000/api/login", {
    
    method: "POST", // POST car j'envoie des données au backend

    headers: {
      "Content-Type": "application/json" // je précise que j'envoie du JSON
    },

    // corps de la requête = identifiants utilisateur
    body: JSON.stringify({ username, password })
  });

  // conversion de la réponse en JSON
  return res.json();
}


/** Fonction pour récupérer les infos de l'utilisateur connecté*/
/** jwt nécessaire pour etre autorisé*/
export async function getUserInfo(token: string) {

  // Appel API vers la route sécurisée
  const res = await fetch("http://localhost:8000/api/user-info", {

    headers: {
      // envoie le token dans header Authorization
      // backend vérif si token valide
      Authorization: `Bearer ${token}`
    }
  });

  // conversion de la réponse en JSON
  return res.json();
}