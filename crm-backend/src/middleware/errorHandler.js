
function errorHandler(err, req, res, next) {
  const status  = err.status  || 500;
  const message = err.message || "Erreur interne du serveur";

  if (status === 500) {
    console.error("❌ [ERROR]", err);
  }

  res.status(status).json({ success: false, error: message });
}

function notFound(req, res) {
  res.status(404).json({ success: false, error: `Route introuvable : ${req.method} ${req.path}` });
}

module.exports = { errorHandler, notFound };
