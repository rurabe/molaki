const modName = process.argv[2]
const taskName = process.argv[3]
const args = process.argv.slice(4,process.argv.length)

console.log(`Running task ${modName}:${taskName} with args ${args}`)
const mod = require(`./${modName}_tasks`);
mod[taskName](...args).then(() => console.log(`Finished running task ${modName}:${taskName}`) )