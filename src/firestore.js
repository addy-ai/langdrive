// Below recommended for cloud functions to format console logs
require("firebase-functions/logger/compat");
// const functions = require("firebase-functions");
// const {firebaseDatabaseURL} = functions.config().fbase.database.url;

class Firestore {
    constructor(props) {
        this.db = props.db
    }

    /**
     * @desc Filters a collection using where clause and returns the results
     * @param {String} collection - The name of the collection
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter
     */
    async filterCollectionWithWhereClause(
        collection,
        filterKey,
        filterData,
        operation,
    ) {
        return await this.db
            .collection(collection)
            .where(filterKey, operation, filterData)
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => doc.data());
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClause - Error getting documents -
                    er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Filters a collection using where clause and returns the results
     * @param {String} collection - The name of the collection
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter with their DocIds
     */
    async filterCollectionWithWhereClauseIncludeDocID(
        collection,
        filterKey,
        filterData,
        operation,
    ) {
        return await this.db
            .collection(collection)
            .where(filterKey, operation, filterData)
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    docData.docID = doc.id;
                    return docData;
                });
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClause - Error getting documents -
                    er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Filters a collection using where clause and returns the results
     * @param {String} collection - The name of the collection
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter
     */
    async filterCollectionWithWhereClauseWithID(
        collection,
        filterKey,
        filterData,
        operation,
    ) {
        return await this.db
            .collection(collection)
            .where(filterKey, operation, filterData)
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => doc.id);
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClauseWithID - Error
                    getting documents - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Add a document to a collection
     * @param {Object} document - The document object
     * @param {String} collection - The collection name
     * @return {Object} Object containing the following attributes:
     * sucess(true or false), docID(The string ID of the document added)
     */
    async addDocumentToCollection(document, collection) {
        return await this.db
            .collection(collection)
            .add(document)
            .then((data) => {
                return {
                    success: true,
                    docID: data.id,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    addDocumentToCollection - Error adding document to collection.
                    Document: ${JSON.stringify(document)},
                    collection: ${collection} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc create doc if it doesn't exist
     * @param {Object} document - The document object
     * @param {String} collection - The collection name
     * @return {Object | Boolean} - Object if created true if exists
     */
    async createDocIfNotExist(document, collection) {
        return await this.db
            .collection(collection)
            .doc(document)
            .get()
            .then(async (doc) => {
                if (!doc.exists) {
                    await this.db.collection(collection).doc(document).create({});
                    return true;
                } else {
                    return true;
                }
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    createDocIfNotExist - Error creating document.
                    Document: ${JSON.stringify(document)},
                    collection: ${collection} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Update a document in a collection
     * @param {Object} documentId - The document object
     * @param {String} collection - The collection name
     * @param {Object} infoToUpdate - The info to update
     * @return {Object} Object containing the following attributes:
     * sucess(true or false), docID(The string ID of the document added)
     */
    async updateDocument(documentId, collection, infoToUpdate) {
        return await this.db
            .collection(collection)
            .doc(documentId)
            .update(infoToUpdate)
            .then((data) => {
                return {
                    success: true,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    updateDocument - Error updating document in collection.
                    Document: ${documentId},
                    collection: ${collection} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Update a document in a sub collection
     * @param {Object} documentId - The document object
     * @param {String} collection - The collection name
     * @param {Object} documentId2 - The document object
     * @param {String} collection2 - The collection name
     * @param {Object} infoToUpdate - The info to update
     * @return {Object} Object containing the following attributes:
     * sucess(true or false), docID(The string ID of the document added)
     */
    async updateDocumentInSubcollection(documentId, collection, documentId2,
        collection2, infoToUpdate) {
        return await this.db
            .collection(collection)
            .doc(documentId)
            .collection(collection2)
            .doc(documentId2)
            .update(infoToUpdate)
            .then((data) => {
                return {
                    success: true,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    updateDocument - Error updating document in collection.
                    Document: ${documentId},
                    collection: ${collection} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Delete document from this.db
     * @param {Object} documentId - The document object
     * @param {String} collection - The collection name
     * @return {Object} Object containing the following attributes:
     * sucess(true or false), docID(The string ID of the document added)
     */
    async deleteDocumentFromCollection(documentId, collection) {
        return await this.db
            .collection(collection)
            .doc(documentId)
            .delete()
            .then((data) => {
                return {
                    success: true,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    deleteDocumentFromCollection - Error deleting document 
                    in collection. Document: ${documentId},
                    collection: ${collection} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Filters a collection using where clause and returns the results
     * @param {String} collection - The name of the collection
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * @param {String} numberOfWheres - Number of where clauses
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter
     */
    async filterCollectionWithMultipleWhereClause(
        collection,
        filterKey,
        filterData,
        operation,
    ) {
        let col = await this.db.collection(collection);
        for (let i = 0; i < filterKey.length; i++) {
            col = col.where(filterKey[i], operation[i], filterData[i]);
        }
        return col
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => doc.data());
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClause - Error getting documents -
                    er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Filters a collection using where clause and return the results w/ limit
     * @param {String} collection - The name of the collection
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * @param {Number} limit - The total number of documents to return
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter
     */
    async filterCollectionWithMultipleWhereClauseWithLimit(
        collection,
        filterKey,
        filterData,
        operation,
        limit,
    ) {
        let col = await this.db.collection(collection);
        for (let i = 0; i < filterKey.length; i++) {
            col = col.where(filterKey[i], operation[i], filterData[i]);
        }
        return col
            .limit(limit)
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => doc.data());
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClause - Error getting documents -
                    er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Filters a collection using where clause and returns the results
     * Includes the doc ID with it
     * @param {String} collection - The name of the collection
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * @param {String} numberOfWheres - Number of where clauses
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter
     */
    async filterCollectionWithMultipleWhereClauseIncludeDocID(
        collection,
        filterKey,
        filterData,
        operation,
    ) {
        let col = await this.db.collection(collection);
        for (let i = 0; i < filterKey.length; i++) {
            col = col.where(filterKey[i], operation[i], filterData[i]);
        }
        return col
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    docData.docID = doc.id;
                    return docData;
                });
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClause - Error getting documents -
                    er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Filters a collection using where clause and returns the results
     * Includes the doc ID with it
     * @param {String} collection1 - The name of the collection
     * @param {String} doc1 - The doc ID of the collection 1
     * @param {String} collection2 - The name of the collection2
     * @param {String} filterKey - The field name/key to filter by
     * @param {String} filterData - The data to match on the field
     * @param {String} operation - The firebase query operator to use in where
     * @param {String} numberOfWheres - Number of where clauses
     * clause example "==", "<=", ">" more details here:
     * https://firebase.google.com/docs/firestore/query-data/queries#query_operators
     * @return {Array} a list of documents that match the filter
     */
    async filterSubCollectionWithMultipleWhereClauseIncludeDocID(
        collection1,
        doc1,
        collection2,
        filterKey,
        filterData,
        operation,
    ) {
        let col = await this.db.collection(collection1).doc(doc1)
            .collection(collection2);
        for (let i = 0; i < filterKey.length; i++) {
            col = col.where(filterKey[i], operation[i], filterData[i]);
        }
        return col
            .get()
            .then((querySnapshot) => {
                return querySnapshot.docs.map((doc) => {
                    const docData = doc.data();
                    docData.docID = doc.id;
                    return docData;
                });
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    filterCollectionWithWhereClause - Error getting documents -
                    er: ${error}`);
                throw error;
            });
    }


    /**
     * @desc Filters a collection using where clause and returns the results
     * @param {String} collection - The firestore collection
     * @param {String} docId - The firestore document ID
     * @param {Object} object - The new object field and value to apply
     * @return {Boolean} True or false if successful
     */
    async runTransactionUpdate(collection, docId, object) {
        const ref = this.db.collection(collection).doc(docId);
        return await this.db
            .runTransaction((transaction) => {
                // Using transaction to prevent conflicts
                return transaction.get(ref).then((doc) => {
                    if (!doc.exists) {
                        throw new Error("Document does not exist");
                    }
                    transaction.update(ref, object);
                });
            })
            .then(() => {
                return true;
            })
            .catch((error) => {
                console.error(
                    "Error: Transaction failed",
                    error,
                    JSON.stringify({ref: ref, object: object}),
                );
                return false;
            });
    }

    /**
     * @desc Add a document to a sub collection
     * @param {String} collection1 - The first collection
     * @param {String} documentId - The document ID in the first collection
     * @param {String} collection2 - The second collection (sub collection)
     * @param {Object} document - The document object to add in sub collection
     * @return {Object} Object containing the following attributes:
     * sucess(true or false), docID(The string ID of the document added)
     */
    async addDocumentToSubCollection(
        collection1,
        documentId,
        collection2,
        document,
    ) {
        return await this.db
            .collection(collection1)
            .doc(documentId)
            .collection(collection2)
            .add(document)
            .then((data) => {
                return {
                    success: true,
                    docID: data.id,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                addDocumentToSubCollection - Error adding document to subcollection.
                Document: ${JSON.stringify(document)}, collections1 ${collection1}
                docId ${documentId}, collection2: ${collection2} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Add doc to collection with custom Id
     * @param {String} collection the collection name
     * @param {String} docId the custom document id
     * @param {String} collection2 the second collection name
     * @param {String} doc2 the second documentID
     * @param {Object} data the data to add
     */
    async addDocumentToSubCollectionWithCustomId(collection, docId, collection2,
        doc2, data) {
        return await this.db
            .collection(collection)
            .doc(docId)
            .collection(collection2)
            .doc(doc2)
            .set(data)
            .then(() => {
                return {
                    success: true,
                    docID: docId,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    addDocumentToCollection - Error adding document to collection.
                    Document: ${JSON.stringify(data)},
                    collection: ${collection} ID: ${docId} - er: ${error}`);
                throw error;
            });
    }

    async getDocInCollection(collection, docId) {
        const docRef = await this.db.collection(collection).doc(docId);
        const result = await docRef
            .get()
            .then((doc) => {
                if (!doc.exists) {
                    return undefined;
                }
                return doc.data();
            })
            .catch((error) => {
                console.error(
                    "Error: Approve Project Failed to get document " +
                        "id " +
                        docId +
                        " error: ",
                    JSON.stringify(error),
                );
                return undefined;
            });
        return result;
    }


    /**
     * @desc Add doc to collection with custom Id
     * @param {String} collection the collection name
     * @param {String} docId the custom document id
     * @param {Object} data the data to add
     */
    async addDocumentToCollectionWithCustomId(collection, docId, data) {
        return await this.db
            .collection(collection)
            .doc(docId)
            .set(data)
            .then(() => {
                return {
                    success: true,
                    docID: docId,
                };
            })
            .catch((error) => {
                console.error(`Error - Firebase Error - fn:
                    addDocumentToCollection - Error adding document to collection.
                    Document: ${JSON.stringify(data)},
                    collection: ${collection} ID: ${docId} - er: ${error}`);
                throw error;
            });
    }

    /**
     * @desc Increment a count field by transaction
     * @param {String} collection the collection name
     * @param {String} document the document id
     * @param {Number} increment the increment value to add by
     */
    async incrementCountByTransaction(collection, document, increment) {
        const ref = await this.db.collection(collection).doc(document);
        return await this.db.runTransaction((transaction) => {
            return transaction
                .get(ref)
                .then(async (doc) => {
                    if (!doc.exists) {
                        // Create new doc with increment value
                        ref.set(
                            {count: increment},
                            {merge: true},
                        );
                        return;
                    }
                    // Doc exists
                    const oldVal = doc.data().count || 0;
                    const newVal = oldVal + increment;

                    // Update the new val
                    transaction.update(ref, {
                        count: newVal,
                    });
                })
                .then(async () => {
                    // If you have a pipeline, send to pipeline stream
                    return true;
                })
                .catch((error) => {
                    console.error(
                        "Error: Fn: incrementCountByTransaction: Failed" +
                            " to update",
                        JSON.stringify(error),
                    );
                    return false;
                    // TODO: If you have a reconciliation queue, add to it
                });
        });
    }

    /**
     * @desc Increment a count field by transaction
     * @param {String} collection the collection name
     * @param {String} document the document id
     * @param {String} field the increment field/attribute
     * @param {Number} increment the increment value to add by
     */
    async incrementIntFieldbyTransaction(collection, document, field, increment) {
        const ref = await this.db.collection(collection).doc(document);
        return await this.db.runTransaction(async (transaction) => {
            return await transaction
                .get(ref)
                .then(async (doc) => {
                    if (!doc.exists) {
                        // Create new doc with increment value
                        const format = {};
                        (format[field] = increment),
                        ref.set(format, {merge: true});
                        return;
                    }
                    // Doc exists
                    const oldVal = doc.data()[field] || 0;
                    const newVal = oldVal + increment;

                    // Update the new val
                    const format = {};
                    format[field] = newVal;
                    transaction.update(ref, format);
                })
                .then(async () => {
                    // If you have a pipeline, send to pipeline stream
                    return true;
                })
                .catch((error) => {
                    console.error(
                        "Error: Fn: incrementIntFieldbyTransaction: Failed" +
                            " to update",
                        JSON.stringify(error),
                    );
                    return false;
                    // TODO: If you have a reconciliation queue, add to it
                });
        });
    }

    /**
     * @desc Increment a count field by transaction
     * @param {String} collection the collection name
     * @param {String} collection2 the collection name
     * @param {String} document the document id
     * @param {String} document2 the document of second doc in collection 2
     * @param {Number} increment the increment value to add by
     */
    async incrementCountByTransactionSubCollection(
        collection,
        collection2,
        document,
        document2,
        increment,
    ) {
        const ref = await this.db
            .collection(collection)
            .doc(document)
            .collection(collection2)
            .doc(document2);
        return await this.db.runTransaction((transaction) => {
            return transaction
                .get(ref)
                .then(async (doc) => {
                    if (!doc.exists) {
                        // Create new doc with increment value
                        ref.set(
                            {count: increment},
                            {merge: true},
                        );
                        return;
                    }
                    // Doc exists
                    const oldVal = doc.data().count || 0;
                    const newVal = oldVal + increment;

                    // Update the new val
                    transaction.update(ref, {
                        count: newVal,
                    });
                })
                .then(async () => {
                    // If you have a pipeline,send  to pipeline stream
                    return true;
                })
                .catch((error) => {
                    console.error(
                        "Error: Fn: incrementCountByTransaction: Failed" +
                            " to update",
                        JSON.stringify(error),
                    );
                    return false;
                    // TODO: If you have a reconciliation queue, add to it
                });
        });
    }

    /**
     * @desc - Updates a document in subcollection
     * @param {String} collection
     * @param {String} collection2
     * @param {String} document
     * @param {String} document2
     * @param {Object} updateDoc
     * @return {Boolean} True or false if update successful
     */
    async updateFieldbyTransactionSubCollection(
        collection,
        collection2,
        document,
        document2,
        updateDoc,
    ) {
        const ref = await this.db
            .collection(collection)
            .doc(document)
            .collection(collection2)
            .doc(document2);
        return await this.db.runTransaction((transaction) => {
            return transaction
                .get(ref)
                .then(async (doc) => {
                    if (!doc.exists) {
                        // Create new doc with increment value
                        ref.set(updateDoc, {merge: true});
                        return;
                    }
                    // Update the new val
                    transaction.update(ref, updateDoc);
                })
                .then(async () => {
                    // If you have a pipeline, here you send to pipeline stream
                    return true;
                })
                .catch((error) => {
                    console.error(
                        "Error: Fn: updateFielthis.dbyTransaction: Failed" +
                            " to update",
                        JSON.stringify(error),
                    );
                    return false;
                    // TODO: If you have a reconciliation queue, add to it
                });
        });
    }

    /**
     * @desc gets all the docs in a collection
     * @param {String} collection the collection name
     */
    async getAllDocumentsInCollection(collection) {
        const documents = [];
        await this.db
            .collection(collection)
            .get()
            .then(async (querySnapshot) => {
                for (let i = 0; i < querySnapshot.size; i++) {
                    const doc = querySnapshot.docs[i];
                    const data = doc.data();
                    const id = doc.id;
                    const full = {
                        ...data,
                        docId: id,
                    };
                    documents.push(full);
                }
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                return false;
            });
        return documents;
    }

    /**
     * @desc get number of documents in collection
     * @param {String} collection the collection name
     */
    async getTotalNumDocumentsInCollection(collection) {
        return await this.db
            .collection(collection)
            .get()
            .then(async (querySnapshot) => {
                return querySnapshot.size;
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                return false;
            });
    }

    /**
     * @desc Get the number of documents in a sub collection
     * @param {String} collection1 - String name of first collection depth 0
     * @param {String} doc1 - Name of document in collection 1
     * @param {String} collection2 - Name of collection in doc1 1 (subcollection)
     */
    async getNumberOfDocumentsInSubCollection(collection1, doc1, collection2) {
        return await this.db
            .collection(collection1)
            .doc(doc1)
            .get()
            .then(async (doc) => {
                if (doc.exists) {
                    return await this.db
                        .collection(collection1)
                        .doc(doc1)
                        .collection(collection2)
                        .get()
                        .then(async (querySnapshot) => {
                            return querySnapshot.size;
                        });
                } else {
                    // Does not exist
                    return 0;
                }
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                return -1; // Error
            });
    }
    /**
     * @desc Get the number of documents in a sub collection
     * @param {String} collection1 - String name of first collection depth 0
     * @param {String} doc1 - Name of document in collection 1
     * @param {String} collection2 - Name of collection in doc1 1 (subcollection)
     * @param {String} doc2 - Name of document in collection 2
     * @param {String} field - The field to extract
     */
    async getFieldInSubCollection(collection1, doc1, collection2, doc2, field) {
        return await this.db
            .collection(collection1)
            .doc(doc1)
            .get()
            .then(async (doc) => {
                if (!doc.exists) {
                    // First request
                    return 0;
                }
                // First doc exists
                return await this.db
                    .collection(collection1)
                    .doc(doc1)
                    .collection(collection2)
                    .doc(doc2)
                    .get()
                    .then(async (val) => {
                        // First request for the day
                        if (!val.exists) {
                            return undefined;
                        }
                        // val exists
                        const data = val.data();
                        const keys = Object.keys(data);
                        if (!keys.includes(field)) {
                            return undefined;
                        }
                        // Field is available
                        return data[field];
                    });
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                return undefined; // Error
            });
    }

    /**
     * @desc Get a specific document in a sub collection
     * @param {String} collection1 - String name of first collection depth 0
     * @param {String} doc1 - Name of document in collection 1
     * @param {String} collection2 - Name of collection in doc1 1 (subcollection)
     * @param {String} doc2 - Name of document in collection 2
     * @param {String} field - The field to extract
     */
    async getDocInSubCollection(collection1, doc1, collection2, doc2) {
        return await this.db
            .collection(collection1)
            .doc(doc1)
            .get()
            .then(async (doc) => {
                if (!doc.exists) {
                    // First request
                    return undefined;
                }
                // First doc exists
                return await this.db
                    .collection(collection1)
                    .doc(doc1)
                    .collection(collection2)
                    .doc(doc2)
                    .get()
                    .then(async (doc2_) => {
                        // Second document does not exist
                        if (!doc2_.exists) {
                            return undefined;
                        }
                        // doc exists
                        const data = doc2_.data();
                        return data;
                    });
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                throw new Error(error);
            });
    }

    /**
     * @desc - Adds a document to a collection and listens for attribute change
     * @param {String} collection1 - Name of the first collection
     * @param {String} doc1ID - ID of the document in collection1
     * @param {String} collection2 - Name of the second collection
     * @param {String} docToAdd - The document object to add
     * @param {String} listenAttr - The attribute to listen for changes
     */
    async addDocInSubCollectionListenForChange(
        collection1,
        doc1ID,
        collection2,
        docToAdd,
        listenAttr,
    ) {
        const newDocRef = await this.db
            .collection(collection1)
            .doc(doc1ID)
            .collection(collection2)
            .add(docToAdd);

        // Wait for the listen attribute to get attached by some remote system
        return newDocRef.onSnapshot(async (snap) => {
            const data = snap.data();
            if (data[listenAttr]) {
                return data[listenAttr];
            }
            return undefined;
        });
    }

    async getAllDocumentsInCollectionReference(ref, collection) {
        const documents = [];
        await ref
            .collection(collection)
            .get()
            .then(async (querySnapshot) => {
                for (let i = 0; i < querySnapshot.size; i++) {
                    const doc = querySnapshot.docs[i];
                    const data = doc.data();
                    const full = {
                        ...data,
                    };

                    full["uid"] = "redacted";
                    full["userID"] = "redacted";

                    documents.push(full);
                }
            })
            .catch((error) => {
                console.error(JSON.stringify(error));
                return false;
            });
        return documents;
    }

    async getEmailStoriesWithWhereClauseAndLimitAndSubCollection(
        collection,
        filterKey,
        filterData,
        operation,
        limit,
    ) {
        let col = await this.db.collection(collection);
        for (let i = 0; i < filterKey.length; i++) {
            col = col.where(filterKey[i], operation[i], filterData[i]);
        }

        const documents = [];
        await col
            .limit(limit)
            .get()
            .then(async (querySnapshot) => {
                for (let i = 0; i < querySnapshot.size; i++) {
                    const doc = querySnapshot.docs[i];

                    const data = doc.data();

                    if (data["userID"] === "u0EqlErXiedmgZbNrybl6I56ust1") continue;

                    const full = {
                        ...data,
                    };

                    full["userID"] = "redacted";

                    const mainDocRef = doc.ref;
                    const sentEmails =
                        await this.getAllDocumentsInCollectionReference(
                            mainDocRef,
                            "sent-emails",
                        );
                    if (sentEmails && sentEmails.length) {
                        full["sent-emails"] = sentEmails;
                    }

                    const generatedEmails =
                        await this.getAllDocumentsInCollectionReference(
                            mainDocRef,
                            "generated-emails",
                        );
                    if (generatedEmails && generatedEmails.length) {
                        full["generated-emails"] = generatedEmails;
                    }

                    const threads = await this.getAllDocumentsInCollectionReference(
                        mainDocRef,
                        "threads",
                    );
                    if (threads && threads.length) {
                        full["threads"] = threads;
                    }

                    documents.push(full);
                }
            })
            .catch((error) => {
                console.error(error);
                return undefined;
            });
        return documents;
    }

    async getOrCreateDocument(documentId, collection) {
        const collectionRef = this.db.collection(collection).doc(documentId);

        try {
            const collectionSnapshot = await collectionRef.get();

            if (collectionSnapshot.exists) {
            // Document already exists, return the document data
                console.log("ALREADY EXISTS");
                return collectionSnapshot.data();
            } else {
            // Document doesn't exist, create a new empty document
                await collectionRef.set({});
                return {}; // Return an empty object for the newly created document
            }
        } catch (error) {
            console.error(`Error - Firebase Error - getOrCreateDocument: ${error}`);
            throw error;
        }
    }

    static async handleFirebase(config) {
        console.log('~~~~ Start handleFirebase\n');
        console.log(JSON.stringify(config))
    
        const admin = require("firebase-admin", config.firebase);
        // TODO: Fix where config is at and service account location 
        let clientJson = config.firebase.clientJson; 
    
        console.log(admin.apps)
        if (!admin.apps.length) {
            console.log('CLI:Firebase')
            admin.initializeApp({
                credential: admin.credential.cert(clientJson),
                databaseURL: config.firebase.databaseURL,
            });
            console.log(admin.apps)
        }
        
        const db = admin.firestore();
        db.settings({ignoreUndefinedProperties: true}); 
    }
}

module.exports = Firestore;