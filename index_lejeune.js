

/*
Code created after talking with Le Jeune Renard
when working on autobase example


*/
/*
If you are running this example multiple times you might want to delete the storage folders
You do this by running:
// rm -rf ./storage-a ./storage-b
this will delete the storage folders
So you have a clean start

Currently in package.json the name of index.js is set to index_lejeune.js

If you want to run this example and use the index.js file
you can change the name in package.json to index.js

You need to run the whole code by going to the terminal and running:
pear run --dev .

Make sure you install the following packages in terminal before
running the example:
npm install compact-encoding corestore autobase autobase-test-helpers

*/


//import Hyperswarm from 'hyperswarm'
import cc from 'compact-encoding' // neeed for autobase
import Corestore from 'corestore'
// import b4a from 'b4a'
// import process from 'bare-process'
import Autobase from 'autobase' // adding for autobase
import { replicateAndSync } from 'autobase-test-helpers'


// Create Autobases
const storeA = new Corestore('./storage-a')
const a = new Autobase(storeA, null, { apply, open, valueEncoding: cc.any })
await a.ready()

const storeB = new Corestore('./storage-b')
const b = new Autobase(storeB, a.key, { apply, open, valueEncoding: cc.any})
await b.ready()

// Add B as writer/indexer
await a.append({ addWriter: b.local.key })

await replicateAndSync([a, b]) // based on replicate
// and sync from Le Jeune Renard's example
// New try of replication and sync
// based on my version of replicateAndSync
// await replicateAndSync([storeA, storeB]) // commenting it out for now

console.log('replication and sync done')

await a.update()
await b.update() // needed so that B sees he is writable

// Check if B is writable
if (b.writable) {
  console.log('B is writable!')
} else {
  console.log('B is NOT writable.')
}

// Define open and apply functions
// create the view
function open (store) {
  return store.get('test')
}

// use apply to handle to updates
async function apply (nodes, view, host) {
  for (const { value } of nodes) {
    if (value.addWriter) {
      await host.addWriter(value.addWriter, { indexer: true })
      continue
    }

    await view.append(value)
  }
}


