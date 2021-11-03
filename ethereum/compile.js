const path = require("path");
const fs   = require("fs-extra");
const solc = require("solc");
const { compile } = require("solc");


/**
 * Makes sure that the build folder is deleted, before every compilation
 * @returns {*} - Path where the compiled sources should be saved.
 */
 function removeBuildDir() {
    const buildPath = path.resolve(__dirname, 'contracts','build');
    fs.removeSync(buildPath);
    return buildPath;
}


/**
 * Searches for dependencies in the Solidity files (import statements). All import Solidity files
 * need to be declared here.
 * @param dependency
 * @returns {*}
 */
 function getImports(lib) {
    console.log('Searching for dependencies: ', lib);
    if (libs.indexOf(lib.split('/')[1]) > -1)
    {
        return {contents: fs.readFileSync(path.resolve(__dirname, 'contracts', lib), 'utf8')}
    }
    return {error: 'File not found'}
    
}

/**
 * Compiles the sources, defined in the config object with solc-js.
 * @param config - Configuration object.
 * @returns {any} - Object with compiled sources and errors object.
 */
 function compileSources(config) {
    try {
        return JSON.parse(solc.compile(JSON.stringify(config), { import: getImports }));
    } catch (e) {
        console.log(e);
    }
}

/**
 * Shows when there were errors during compilation.
 * @param compiledSources
 */
 function handleError(compiledSources) {
    if (!compiledSources) {
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n', 'NO OUTPUT');
    } else if (compiledSources.errors) { // something went wrong.
        console.error('>>>>>>>>>>>>>>>>>>>>>>>> ERRORS <<<<<<<<<<<<<<<<<<<<<<<<\n');
        compiledSources.errors.map(error => console.log(error.formattedMessage));
    }
}

/**
 * Create build folder and save JSON version of the contracts we compiled.
 * @param compiled
 * @param buildPath
 */
function toJSON(compiled, buildPath)
{
    fs.ensureDirSync(buildPath);
    console.log('contracts: {\n');
    for (let contractFileName in compiled.contracts) 
    {
        console.log('  ', contractFileName, ':\n   {\n');
        for (let contract in compiled.contracts[contractFileName])
        {
            console.log("    ", contract);
            fs.outputJsonSync(
                path.resolve(buildPath, contract + '.json'),
                compiled.contracts[contractFileName][contract]
            );
        }
        console.log('   }');
    }
    console.log('}');
}


// Workflow
//Delete build folder
const buildPath = removeBuildDir();

// list the contract sources and library sources.
const contracts = fs.readdirSync(path.resolve(__dirname, 'contracts')).filter( (file) => {
    return (path.extname(file) == ".sol");
  });;
const libs = fs.readdirSync(path.resolve(__dirname, 'contracts', 'lib'));

console.log(contracts);
console.log(libs,"\n");


//Prepare the input for the compile method:
const input = contracts.reduce(
    (input, filename) => {
        const filePath = path.resolve(__dirname, "contracts", filename);
        const source = fs.readFileSync(filePath, "utf8");
        //return { sources: { ...input.sources, [filename]: source} };
        return { language : 'Solidity',
            sources: { ...input.sources, [filename]: {
                content: source
                }
            } ,
            settings: {
                outputSelection: { // return everything
                '*': {
                    '*': ['*']
                    }
                }
            }
        }
        
    },
    {  sources: {} }
);

console.log(input, "\n");


//Compile and check for errors.
const compiled = compileSources(input);
handleError(compiled);
console.log("compiled:\n", compiled, "\n");
toJSON(compiled, buildPath);
