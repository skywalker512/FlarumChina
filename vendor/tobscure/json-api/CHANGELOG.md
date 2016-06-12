# CHANGELOG

## 0.2.1 (released 2015-11-02)

- Improve performance when working with large numbers of resources

## 0.2.0 (released 2015-10-30)

Completely rewrite to improve all the things.

- Resources and Collections now contain data and are responsible for serializing it when they are converted to JSON-API output (whereas before serializers were responsible for creating concrete Resources/Collections containing pre-serialized data). Serializers are now only responsible for building attributes and relationships. This is a much more logical/testable workflow, and it makes some really cool syntax possible!
- Support for sparse fieldsets.
- Simplified relationship handling.
- Renamed Criteria to Parameters, add validation.
- Added ErrorHandler for serializing exceptions as JSON-API error documents.
- Updated docs.
- Wrote some tests.
- It should go without saying that this is not at all backwards-compatible with 0.1.

## 0.1.1 (released 2015-08-07)

- Rename abstract serializer

## 0.1.0 (released 2015-08-07)

- Initial testing release
