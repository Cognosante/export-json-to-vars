const fs = require('fs');
const path = require('path');
const core = require('@actions/core');

/**
 * exports a name value pair as a environment
 * variable. if masked is true, the value will
 * be set as a secret to enable masking in gh actions logging
 * @param {string} name environment variable name
 * @param {*} value environment variable value
 * @param {boolean} masked masked value as secret
 * @returns {void}
 */
function exportVariable(name, value, masked) {    
    if (masked) {
        core.setSecret(value);
    }

    core.info(`SET ENV '${name}' = ${value}`);
    core.exportVariable(name, value.toString());    
}

/**
 * action entrypoint
 * @returns {void}
 */
function main() {
    try {
        const json = core.getInput('json', { required: true });
        const prefix = core.getInput('prefix') ?? '';
        const masked = (core.getInput('masked') ?? 'false') === 'true';
        const isFile = fs.existsSync(json);

        /*
            passing "${{ toJson(vars) }}" will call JSON.stringify() internally
            in the action which will return "null" if no variables are set
             
            **really confusing** since the 
            value is "null" and not actually null or undefined

            add early check to prevent processing in this case
        */
        if(json === 'null') {
            core.setFailed('export failed input.json is null');
            return;
        }

        let rawData = undefined;
        if(isFile) {
            const fullPath = path.resolve(json);
            core.info(`Processing file: ${fullPath}`);
            rawData = fs.readFileSync(json);
        }
        else {
            rawData = json;
        }

        const jsonData = JSON.parse(rawData);

        if(jsonData === null) {
            core.setFailed('export failed input.json is null');
            return;
        }

        core.info(`PREFIX: ${prefix}`);

        if(Array.isArray(jsonData)) {
            jsonData.forEach((value, index) => {
                const name = prefix ? `${prefix}_${index}` : index.toString();
                exportVariable(name, value, masked);
            })
        }
        else if(typeof jsonData === 'object') {
            const entries = Object.entries(jsonData);
            for(const [key, value] of entries) {
                const name = prefix ? `${prefix}_${key}` : key;
                exportVariable(name, value, masked);
            }
        }
    }
    catch(error) {
        console.log(error);
        core.setFailed(error.message);
    }
}

main();
