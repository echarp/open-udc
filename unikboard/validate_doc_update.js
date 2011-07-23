// This method is called as a validation before any document upload
function(newDoc, oldDoc, userCtx) {
  function require(field, message) {
    message = message || "Document must have a " + field;
    if (!newDoc[field]) throw({forbidden : message});
  };

  require("_id");
  //require("content");

  /*
  if (oldDoc && (oldDoc._rev && !oldDoc._attachments)) {
    throw({forbidden : 'You can not modify this grain'});
  }
  */
}
