function(e) {
  e.preventDefault();

  var ext = /.gpg$/;
  var name = $("#_attachments:file").val();
  if (! ext.test(name)) {
    alert('The uploaded grain is not a *.gpg file');
    return;
  }

  var docToSave = { '_id' : name.replace(ext, '') };

  $$(this).app.db.saveDoc(docToSave, {
    success : function(resp) {
      $("#_rev").val(resp.rev);

      $("#publish").ajaxSubmit({
        url: "/unikboard/"+resp.id,
        resetForm: true,
        success: function(data, statusText) {
          alert('File uploaded');
          $(":submit").hide();
        }
      });
    }
  });
};
