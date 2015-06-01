module.exports = function(doc) {
  doc = JSON.parse(JSON.stringify(doc))
  var populate = function(elem) {
    if (!elem.relationships) return elem

    Object.keys(elem.relationships).forEach(function(relationshipName) {
      var innerPopulate = function(relationship) {
        var type = relationship.type
        var id = relationship.id
        if (!relationships[type]) return relationship;

        relationship.attributes = relationships[type][id].attributes
        relationship.relationships = relationships[type][id].relationships
        return relationship
      }

      if (!Array.isArray(elem.relationships[relationshipName])) {
        elem.relationships[relationshipName] = innerPopulate(elem.relationships[relationshipName])
        return
      }

      elem.relationships[relationshipName] = elem.relationships[relationshipName].map(function(relationship) {
        return innerPopulate(relationship)
      })
    })

    return elem
  }

  var relationships = {}
  (doc.included || []).forEach(function(include) {
    relationships[include.type] = relationships[include.type] || {}
    relationships[include.type][include.id] = include
  })

  for (var type in relationships) {
    for (var id in relationships[type]) {
      relationships[type][id] = populate(relationships[type][id])
    }
  }

  if (doc.data instanceof Array) {
    doc.data = doc.data.map(function(elem) {
      return populate(elem)
    })  
  } else {
    doc.data = populate(doc.data)
  }


  return doc
}
