const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function request(url, options) {
  if (!BASE_URL) {
    throw new ApiError(
      "L'URL du backend n'est pas configurée : ajoutez VITE_API_BASE_URL dans le fichier .env.",
      0
    );
  }

  let response;
  try {
    response = await fetch(url, options);
  } catch {
    throw new ApiError(
      "Le serveur est injoignable. Vérifiez qu'il est démarré, puis réessayez.",
      0
    );
  }

  if (!response.ok) {
    let message;
    try {
      const body = await response.json();
      message = body.message;
    } catch {
      // corps de réponse absent ou non JSON
    }
    throw new ApiError(
      message ?? `Le serveur a répondu avec le code ${response.status}.`,
      response.status
    );
  }
  return response.json();
}

export const ticketService = {
  lister(statut) {
    const query = statut ? `?statut=${encodeURIComponent(statut)}` : "";
    return request(`${BASE_URL}${query}`);
  },

  creer(titre, description) {
    return request(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ titre, description }),
    });
  },

  fermer(id) {
    return request(`${BASE_URL}/${id}/fermer`, { method: "PATCH" });
  },
};
