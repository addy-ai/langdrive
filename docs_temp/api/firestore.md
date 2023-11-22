# Firestore

The `Firestore` class in Node.js provides functionalities for interacting with Firebase Firestore, including querying, adding, updating, and deleting documents.

## Class: Firestore

### Constructor
- **Parameters**: `props` (Object) containing the Firestore database instance.
- **Description**: 
  - Initializes the Firestore class with a database instance.

### Method: `filterCollectionWithWhereClause(...)`
- **Purpose**: Filters a collection using a where clause.
- **Returns**: Array of documents matching the filter.

### Method: `filterCollectionWithWhereClauseIncludeDocID(...)`
- **Purpose**: Similar to `filterCollectionWithWhereClause`, but includes document IDs in the results.
- **Returns**: Array of documents with their document IDs.

### Method: `filterCollectionWithWhereClauseWithID(...)`
- **Purpose**: Filters a collection and returns only the document IDs.
- **Returns**: Array of document IDs.

### Method: `addDocumentToCollection(...)`
- **Purpose**: Adds a document to a specified collection.
- **Returns**: Object containing the success status and document ID.

### Method: `createDocIfNotExist(...)`
- **Purpose**: Creates a document in a collection if it does not exist.
- **Returns**: Boolean indicating the document's creation status.

### Method: `updateDocument(...)`
- **Purpose**: Updates a document in a collection.
- **Returns**: Object containing the success status.

### Method: `updateDocumentInSubcollection(...)`
- **Purpose**: Updates a document in a subcollection.
- **Returns**: Object containing the success status.

### Method: `deleteDocumentFromCollection(...)`
- **Purpose**: Deletes a document from a collection.
- **Returns**: Object containing the success status.

### Method: `filterCollectionWithMultipleWhereClause(...)`
- **Purpose**: Filters a collection using multiple where clauses.
- **Returns**: Array of documents matching the filters.

### Method: `filterCollectionWithMultipleWhereClauseWithLimit(...)`
- **Purpose**: Filters a collection using multiple where clauses with a limit on the number of documents.
- **Returns**: Array of documents matching the filters.

### Method: `filterCollectionWithMultipleWhereClauseIncludeDocID(...)`
- **Purpose**: Filters a collection using multiple where clauses and includes document IDs.
- **Returns**: Array of documents with their document IDs.

### Method: `filterSubCollectionWithMultipleWhereClauseIncludeDocID(...)`
- **Purpose**: Filters a subcollection using multiple where clauses and includes document IDs.
- **Returns**: Array of documents with their document IDs.

### Method: `runTransactionUpdate(...)`
- **Purpose**: Runs a transaction to update a document in Firestore.
- **Returns**: Boolean indicating the success of the transaction.

### Method: `addDocumentToSubCollection(...)`
- **Purpose**: Adds a document to a subcollection.
- **Returns**: Object containing the success status and document ID.

### Method: `addDocumentToSubCollectionWithCustomId(...)`
- **Purpose**: Adds a document to a subcollection with a custom document ID.
- **Returns**: Object containing the success status and document ID.

### Method: `getDocInCollection(...)`
- **Purpose**: Retrieves a document from a collection.
- **Returns**: Document data or `undefined`.

### Method: `addDocumentToCollectionWithCustomId(...)`
- **Purpose**: Adds a document to a collection with a custom document ID.
- **Returns**: Object containing the success status and document ID.

### Method: `incrementCountByTransaction(...)`
- **Purpose**: Increments a count field in a document by a specified value using a transaction.
- **Returns**: Boolean indicating the success of the transaction.

### Method: `incrementIntFieldbyTransaction(...)`
- **Purpose**: Increments an integer field in a document by a specified value using a transaction.
- **Returns**: Boolean indicating the success of the transaction.

### Method: `incrementCountByTransactionSubCollection(...)`
- **Purpose**: Increments a count field in a subcollection document by a specified value using a transaction.
- **Returns**: Boolean indicating the success of the transaction.

### Method: `updateFieldbyTransactionSubCollection(...)`
- **Purpose**: Updates a field in a subcollection document using a transaction.
- **Returns**: Boolean indicating the success of the transaction.

### Method: `getAllDocumentsInCollection(...)`
- **Purpose**: Retrieves all documents in a specified collection.
- **Returns**: Array of documents.

### Method: `getTotalNumDocumentsInCollection(...)`
- **Purpose**: Gets the total number of documents in a collection.
- **Returns**: Integer representing the total number of documents.

### Method: `getNumberOfDocumentsInSubCollection(...)`
- **Purpose**: Gets the number of documents in a subcollection.
- **Returns**: Integer representing the total number of documents.

### Method: `getFieldInSubCollection(...)`
- **Purpose**: Retrieves a specific
