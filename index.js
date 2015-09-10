module.exports = function(doc) {
  doc = JSON.parse(JSON.stringify(doc))
  var populate = function(elem) {
    if (!elem.relationships) return elem

    Object.keys(elem.relationships).forEach(function(relationshipName) {
      var innerPopulate = function(relationship) {
        var type = relationship.type
        var id = relationship.id
        if (!relationships[type] || !relationships[type][id]) return relationship;

        relationship.attributes = relationships[type][id].attributes
        relationship.relationships = relationships[type][id].relationships
        return relationship
      }

      var relationshipValue = elem.relationships[relationshipName];
      if (!relationshipValue) {
        return
      }

      var data = relationshipValue.data;
      if (!Array.isArray(data)) {
        elem.relationships[relationshipName] = innerPopulate(data)
        return
      }

      elem.relationships[relationshipName] = data.map(function(relationship) {
        return innerPopulate(relationship)
      })
    })

    return elem
  }

  var relationships = {}
  if (doc.included) doc.included.forEach(function(include) {
    relationships[include.type] = relationships[include.type] || {}
    relationships[include.type][include.id] = include
  })

  for (var type in relationships) {
    for (var id in relationships[type]) {
      relationships[type][id] = populate(relationships[type][id])
    }
  }

  if (Array.isArray(doc.data)) {
    doc.data = doc.data.map(function(elem) {
      return populate(elem)
    })  
  } else {
    doc.data = populate(doc.data)
  }

  return doc
}
