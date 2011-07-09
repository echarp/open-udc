// This method is called as a validation before any document upload
function(newDoc, oldDoc, userCtx) {
  function require(field, message) {
    message = message || "Document must have a " + field;
    if (!newDoc[field]) throw({forbidden : message});
  };

  require("_id");
  require("content");

  if (oldDoc && oldDoc._rev) {
    throw({forbidden : 'This bill is already present in the board'});
  }

  if (newDoc.created_at == null) {
    // We add a timestamp to each bill
    newDoc.created_at = new Date();
  }
}
