import fs from 'fs';
import path from 'path';

const file_location = path.join('./','config.json');
const config = JSON.parse(fs.readFileSync(file_location, 'utf8'));
const config_key = [
    'API_SERVER',
    'API_SERVER_PORT',
    'PORT',
    'NODE_ENV',
];

let this_module = {
    'API_SERVER'       : '',
    'API_SERVER_PORT'  : '',
    'PORT'             : '',
    'NODE_ENV'         : '',
};
(function() {
    for(let i=0;i<config_key.length;i++) {
        if(config[config_key[i]])
            this_module[config_key[i]] = config[config_key[i]];
    }

    process_env.API_SERVER      ? this_module.API_SERVER      = process.env.API_SERVER : null;
    process_env.API_SERVER_PORT ? this_module.API_SERVER_PORT = process.env.API_SERVER_PORT : null;
    this_module.PORT = process.env.PORT || 6000;
    this_module.NODE_ENV = (process.env.NODE_ENV||'development');
}());

export default this_module;