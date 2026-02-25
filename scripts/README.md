# Translation Validation Scripts

This directory contains scripts for validating and maintaining translation file integrity.

## validate-translations.js

A comprehensive script that validates the integrity of translation files (`zh.json` and `en.json`).

### Features

1. **Key Structure Consistency**: Verifies that both translation files have the same key structure
2. **Value Validation**: Ensures all translation keys have non-empty values
3. **Duplicate Detection**: Checks for duplicate translation keys
4. **Usage Report**: Generates a detailed report of translation key distribution by namespace

### Usage

```bash
# Run validation
npm run validate:translations

# Or directly with node
node scripts/validate-translations.js
```

### Output

The script provides:
- Console output with color-coded validation results
- A detailed JSON report saved to `translation-validation-report.json`

### Exit Codes

- `0`: All validations passed
- `1`: One or more validations failed

### Requirements

This script validates requirements:
- **4.1**: Translation keys exist in both zh.json and en.json
- **4.2**: All translation keys have corresponding values
- **4.4**: zh.json and en.json have the same key structure

### Example Output

```
Translation File Integrity Validation
=====================================

Loading translation files...
✓ Translation files loaded successfully

=== Validating Key Structure Consistency ===
✓ Key structure is consistent
  Total keys: 889

=== Validating Translation Values ===
✓ All translation keys have values

=== Validating Duplicate Keys ===
✓ No duplicate keys found

=== Translation Key Usage Report ===

Translation Key Distribution:
  Total keys: 889
  zh.json keys: 889
  en.json keys: 889

Keys by Namespace:
  screens: 339 keys
  profile: 187 keys
  channelManage: 54 keys
  ...

Detailed report saved to: translation-validation-report.json

=== Validation Summary ===

✓ All validation checks passed!
  - Key structure is consistent
  - All translation keys have values
  - No duplicate keys found
  - Total keys: 889
```

### Integration

This script can be integrated into:
- Pre-commit hooks
- CI/CD pipelines
- Development workflows

### Troubleshooting

If validation fails:

1. **Key structure inconsistency**: Keys exist in one file but not the other
   - Add missing keys to the appropriate file
   - Ensure both files have matching key paths

2. **Missing values**: Translation keys have empty or null values
   - Fill in the missing translations
   - Check for accidentally empty strings

3. **Duplicate keys**: Same key appears multiple times
   - Remove duplicate entries
   - Ensure proper JSON structure
