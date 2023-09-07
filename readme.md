# Overview 
this action reads a json file or string and writes its contents as environment variables with optional secret masking

## Inputs
| name   | required | default | description                                                                       |
| ------ | -------- | ------- | --------------------------------------------------------------------------------- |
| json   | true     |         | path to a json file or json string with content to write as environment variables |
| prefix | false    | ''      | prefix to apply to variable names                                                 |
| masked | false    | false   | mask variable value as a secret                                                   |

## Usage
```yml
- name: export vars 
  uses: cognosante/export-json-to-vars@v1.0.0
  with:
    json: "${{ toJson(vars) }}"
- name: export secrets
  uses: cognosante/export-json-to-vars@v1.0.0
  with:
   json: "${{ toJson(secrets) }}"
   masked: true

- name: show env
  run: env
```

## Reference
Adapted technique from the following gh action projects and refactored for internal use.

- https://github.com/cipsys/json-to-variables
- https://github.com/rgarcia-phi/json-to-variables
- https://github.com/antifree/json-to-variables