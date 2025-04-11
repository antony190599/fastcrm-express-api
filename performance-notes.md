# Performance Notes

## Context
To improve the speed of frequent searches on the `content` field, a text index was added to the `content` field in the `Plantilla` model. The performance of the query was evaluated using `.explain()`.

## Results
### Before Adding Index
- **Execution Time**: High
- **Execution Stats**: Scanned all documents in the collection.

### After Adding Index
- **Execution Time**: Significantly reduced.
- **Execution Stats**: Scanned only relevant documents using the index.

## Conclusion
Adding a text index to the `content` field has drastically improved query performance for frequent searches. This change ensures that agents experience faster response times when searching for templates.
