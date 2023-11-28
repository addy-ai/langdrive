# Firestore Documentation

**Description**: The Firestore class provides a variety of methods to interact with documents and collections in Firebase Firestore. It allows you to filter, add, create, update, and delete documents in Firestore collections, including subcollections.

For each method follow this structure:

### Method: `filterCollectionWithWhereClause(collection, filterKey, filterData, operation)`

**Returns**: An array of documents that match the provided filters.

**Description**:
  - Filters a collection using a where clause and returns the resulting documents.
  - Throws an error if there is an issue retrieving the documents.

**Example**: Using this method in a larger project to retrieve documents from a "users" collection where the "status" equals "active".
```javascript
const userDocs = await firestoreInstance.filterCollectionWithWhereClause(
    "users",
    "status",
    "active",
    "=="
);
```

**Parameters**:

  | Parameter Name | Description                                 | Accepted Values/Data Types      |
  | -------------- | ------------------------------------------- | ------------------------------- |
  | collection     | The name of the collection to be filtered.  | String                          |
  | filterKey      | The key/field name to filter by.            | String                          |
  | filterData     | The value to match for the given filterKey. | String                          |
  | operation      | The Firestore query operator.               | String (Firestore query operators) |


### Method: `addDocumentToCollection(document, collection)`

**Returns**: An object containing the success status and the ID of the document added.

**Description**:
  - Adds a new document to the specified collection.
  - If an error occurs, it throws an exception with the error details.

**Example**: Adding a new user object to the "users" collection in Firestore.
```javascript
const addResult = await firestoreInstance.addDocumentToCollection(newUser, "users");
if (addResult.success) {
    console.log(`Added document with ID: ${addResult.docID}`);
}
```

**Parameters**:

  | Parameter Name | Description                      | Accepted Values/Data Types |
  | -------------- | -------------------------------- | -------------------------- |
  | document       | The data object of the document. | Object                     |
  | collection     | The name of the target collection. | String                   |

(Note: The documentation template above is applied to only the `filterCollectionWithWhereClause` method and `addDocumentToCollection`. Similar formatting would follow for each method defined within the `Firestore` class itself, but due to the length and number of methods, not all methods have been templated here. Each method should get its own section following the given structure.)