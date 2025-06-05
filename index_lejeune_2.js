
/*
Code created after talking with Le Jeune Renard
when working on autobase example

THIS IS THE SECOND PART OF THE CODE
In this part we will add a view to list the content of the autobase.
And we will add data to the autobases.

The basis of this code is index_lejeune.js

*/
/*
If you are running this example multiple times you might want to delete the storage folders
You do this by running:
// rm -rf ./storage-a ./storage-b
this will delete the storage folders
So you have a clean start

To use this code in package.json the name of index.js should be set to index_lejeune_2.js

If you want to run this example and use the index.js file
you can change the name in package.json to index_lejeund_2.js

You need to run the whole code by going to the terminal and running:
pear run --dev .

Make sure you install the following packages in terminal before
running the example:
npm install compact-encoding corestore autobase autobase-test-helpers
However, if this is the second code you are running you do not need
to install the packages again, because they are already installed
*/


//import Hyperswarm from 'hyperswarm'
import cc from 'compact-encoding' // neeed for autobase
import Corestore from 'corestore'
import b4a from 'b4a'
// import process from 'bare-process'
import Autobase from 'autobase' // adding for autobase
import { replicateAndSync } from 'autobase-test-helpers'


// Create Autobases
// This is the first autobase instance of the first peer
const storeA = new Corestore('./storage-a')
const a = new Autobase(storeA, null, { apply, open, valueEncoding: cc.any })
await a.ready()

// This is the second autobase instance of the second peer
// it uses a.key as the bootstrap key
const storeB = new Corestore('./storage-b')
const b = new Autobase(storeB, a.key, { apply, open, valueEncoding: cc.any})
await b.ready()

// Add B as writer/indexer
// Now the second peer can write to the first peer's autobase
await a.append({ addWriter: b.local.key })

// Now we will replicate and sync the autobases
// Note: not clear yet why this is needed
await replicateAndSync([a, b]) // based on replicate

console.log('replication and sync done')

// Update the autobases to make sure they are in sync
await a.update()
await b.update() // needed so that B sees he is writable

// Check if B is writable
if (b.writable) {
  console.log('B is writable!')
} else {
  console.log('B is NOT writable.')
}
// SHOWING THE CONTENTS OF AUTOBASES FIRST TIME
//Showing the contents of the a autobase view Before the appends
console.log("Now printing the contents of a autobase view BEFORE appends:")
await showAutobaseView(a)

//Showing the contents of the b autobase view before  the appends
console.log("Now printing the contents of b autobase view BEFORE append:")
await showAutobaseView(b)


// HERE WE WILL ADD CONTENT TO THE AUTOBASES
console.log("Now appending values to the autobases...")

// Appending value to a autobase
await a.append('a 1')

// Appending value to b autobase
await b.append('b 1')

// Appending value to a autobase
await b.append('b 2')

// Appending value to a autobase
await b.append('b 3')

// Appending value to a autobase
await a.append('a 2')

// Appending value to b autobase
await b.append('b 4')

// REPLICATE AND SYNC THE AUTOBASES AGAIN
await replicateAndSync([a, b]) // based on replicate

console.log('replication and sync done AGAIN')


// HERE WE WILL UPDATE THE AUTOBASES
await a.update()
await b.update()  

//Showing the contents of the a autobase view after the appends
console.log("Now printing the contents of a autobase view AFTER the appends:")
await showAutobaseView(a)

//Showing the contents of the b autobase view after the appends
console.log("Now printing the contents of b autobase view AFTER remote append:")
await showAutobaseView(b)



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

// FUNCTION TO LIST THE CONTENTS OF AN AUTOBASE.
async function showAutobaseView(autobase) {
  for (let i = 0; i < autobase.view.length; i++) {
    const buffer = await autobase.view.get(i)
    console.log(b4a.toString(buffer))
  }
}


