(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.jsonapiparser = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

      var data = elem.relationships[relationshipName].data;
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

},{}]},{},[1])(1)
});