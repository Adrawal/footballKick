/**this application is focused on dependency enjection.
 * author Aditya Rawal
 */
/** those modules we are going to use multiple times those needs to be add in container 
 */
const dependable = require('dependable');
const path = require('path');

const container = dependable.container();
// in dependencies we will be maintaining the key value pair. value will be always dependencies name.
const simpleDependencies = [
    ['lodash', 'lodash'],
    ['mongoose','mongoose'],
    ['passport','passport'],
    ['formidable','formidable'],
    ['Groups','./models/Groups'],
    ['aws','./helpers/awsUpload']
];

/** we are registering our dependeencies in to container 
 * and returning the dependent.
 */
simpleDependencies.forEach(function (val) {
    container.register(val[0], function () {
        return require(val[1]);
    });
});

/** what ever function we are going to export those will be availble in to container there can be 
 * multiple folders with diffrent functions to export
 */
container.load(path.join(__dirname,'/controllers'));
container.load(path.join(__dirname,'/helpers'));

/** registering the container */
container.register('container',function(){
    return container;
});
module.exports = container;