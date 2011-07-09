function(data) {
  // $.log(data)
  var p;
  return {
    items : data.rows.map(function(r) {
      p = (r.value && r.value.profile) || {};
      p._id = r.value && r.value._id;
      p.content = r.value && r.value.content;
      p.created_at = r.value && r.value.created_at;
      return p;
    })
  }
};
