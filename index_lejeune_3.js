/*
THIS IS THE FINAL PART OF THE CODE.
START HERE TO SEE HOW TWO PEERS CAN JOIN AN AUTOBASE
AND ACT AS WRITERS TO THE AUTOBASE

## How this code works: The process
1. run pear run --dev . if you are the first peer that is bootstrapping the autobase
2. copy the invite key that is printed on the console and give it to the other peer.
2. as the second peer run pear run --dev . <invite key>. Make sure to paste the invite key after the dot.
3. now you will see your own local key printed on your console.
4. copy this local key and give it to the first peer, who bootstrapped this autobase.
5. the first peer will paste your local key in the console when prompted to add a new writer.
6. This will allow you as the second peer to now write to the autobase.
7. Both peers can now start typing text to the console and the text will be added to the autobase.
8. As soon as you type, the view of the autobase will be updated and printed the console.
9. If you want to stop typing, type 'qqq' and the console will stop accepting input.
// 10. You can run this code multiple times, but make sure to delete the storage folders first
// rm -rf ./storage-a ./storage-b is the command to delete the storage folders.
// You need to run this command in the terminal before running the code again.
// 11. If you want to run this code in index.js, change the name of this file to index_lejeune_3.js
control + C in the terminal to stop the code from running.
*/


/*
Code created after talking with Le Jeune Renard
when working on autobase example

THIS IS THE THIRD PART OF THE CODE
In this part we will add the following features:
- a console that logs the invite (is base.key) of the bootstrapping Autobase so that
  other peers can use this information to bootstrap their own autobase
- a console to accept text that is being typed by the peer.
- another application that constantly reads the autobase and produce what is being typed
  by all the peers.

We will separate the code of the previous example (# 2) so that each peer can just
start a new autobase instance in their own terminal and add text to the autobase.

We call this version: JOIN THE CONVERSATION.

The basis of this code is index_lejeune_2.js

OTHER FEATURES IN THE FUTURE ARE:
- a desktop application with chat screen, invite field to paste the invite
- a way to join the swarm - Done
- a view to see how many peers are connected to the autobase
- adding invite + swarm key (see Supersu comments in Pear Development Room on 30 may 2025)
- adding tasks to a new autobase instance to work on a project with many peers
- converting this application code into classes (just like Autopass)
- adding hyperdb and hyperschema to the autobase to store data, suggested by Mafintosh
- storing a list of writers in the autobase (probably in a corestore called writers)

INSPIRATION:
We are inspirecd by the following code: https://docs.pears.com/how-tos/work-with-many-hypercores-using-corestore

In this code they create a multireader and single writer corestore. So we think that
this can be a great way to separate the code of the autobases when using a terminal app.

The logic to write the autobase will be in an app and the logic to read the autobase will
be in another app
*/
/*
If you are running this example multiple times you might want to delete the storage folders
You do this by running:
// rm -rf ./storage-a ./storage-b
this will delete the storage folders
So you have a clean start

To use this code in package.json the name of index.js should be set to index_lejeune_3.js

If you want to run this example and use the index.js file
you can change the name in package.json to index_lejeund_3.js

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
import { replicateAndSync } from 'autobase-test-helpers' // needed to replicate and sync
import process from 'bare-process' // to be able to read data from the console
import Hyperswarm from 'hyperswarm' // to be able to join the swarm



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
  if (autobase.view.length === 0) {
    console.log('(Autobase view is empty)')
    return
  }
  for (let i = 0; i < autobase.view.length; i++) {
    const buffer = await autobase.view.get(i)
    console.log(b4a.toString(buffer))
  }
}
// Previously we would create an autobase instance with a key.
// Now we have to check if an invite key is already available or not.
// If invite is passed when running the code use it to bootstrap the autobase
// if not passed, create a new autobase and log the invite on screen

// Accept invite key from the command line
// const inviteKeyHex = process.argv[2]
// Find the first argument that looks like an invite key
// and does not start with - or . 
const inviteKeyHex = process.argv.find(arg =>
  /^[0-9a-fA-F]+$/.test(arg) && arg.length > 10 // adjust length as needed
)
let a 
let b

// If an invite key is provided, we will use it to bootstrap the autobase

if (inviteKeyHex) {
  // If invite key is provided, use it as the bootstrap key
  // This is the code for setting up autoabase B when you have
  // an invite key


  console.log('Using invite key:', inviteKeyHex)
  const storeB = new Corestore('./storage-b')
  b = new Autobase(storeB, Buffer.from(inviteKeyHex, 'hex'), { apply, open, valueEncoding: cc.any })
  await b.ready()

// JOINING THE SWARM AS B WITH THE INVITE KEY
const swarm = new Hyperswarm()
Pear.teardown(() => swarm.destroy())

swarm.join(b.discoveryKey)

// Replicating autobase through the swarm (??? is this needed?)

swarm.on('connection', (conn) => b.replicate(conn))

// SHOWING MY KEY ON THE CONSOLE SO THAT OTHER PEERS CAN ADD ME AS
// WRITER TO THE AUTOBASE
console.log('Here is my key to add me as writer  to the autobase that has been bootstrapped:', 
    b4a.toString(b.local.key, 'hex'))


// Accepting text through the console for autobase b
process.stdin.setEncoding('utf8')
    async function onInput(data) {
    const text = data.trim()
    // If the user types 'qqq', stop accepting input but keep running
    if (text === 'qqq') {
        console.log('Stopped accepting input. CLI is still running.')

        console.log('Now trying to show the view of the autobase') // added for debugging

        console.log('============================================')
        
        console.log('== CONENTS OF THE AUTOBASE VIEW ==')   
        await showAutobaseView(b) // added for debugging
        console.log('======END CONTENTS OF AUTOBASE VIEW=========')
        process.stdin.removeListener('data', onInput)
        return
    }
    if (text) {
        // Append the text to the autobase
        await b.append(text)
        await b.update() //<-- make sure the view is updated
        console.log(`Appended: ${text}`)
        await showAutobaseView(b)
    }
}
process.stdin.on('data', onInput)

} else {
  // No invite key, create a new Autobase
  // This is the code for setting up an autobase A from
  // scratchat  when you do not have an invite key
  // Your autobase will be the one that other peers can join

  // CREATING NEW AUTOBASE CODE MENU # 1
  // OUTPUT IS: THE INVITE KEY ON THE CONSOLE
  const storeA = new Corestore('./storage-a')
  a = new Autobase(storeA, null, { apply, open, valueEncoding: cc.any })
  await a.ready()
  console.log('Here is the invite key:', b4a.toString(a.key, 'hex'))
  await a.ready()


// JOINING THE SWARM
const swarm = new Hyperswarm()
Pear.teardown(() => swarm.destroy())

swarm.join(a.discoveryKey)

// Replicating autobase through the swarm (??? is this needed?)

swarm.on('connection', (conn) => a.replicate(conn))

/// ADDING NEW WRITERS TO AUTOBASE CODE MENU  # 2
// OUTPUT IS A NEW WRITER ADDED TO THE AUTOBASE
// NOTE: ONLY THE FIRST PEER WHO BOOTSTRAPS THE
// AUTOBASE CAN ADD WRITERS TO THE AUTOBASE

// Prompt the user to add a new writer key before logging the invite key
process.stdin.setEncoding('utf8')
console.log('If you want to add a new writer, paste their public key (hex) and press Enter.')
console.log('Or just press Enter to skip.')

process.stdin.once('data', async (input) => {
  const writerKey = input.trim()
  if (writerKey) {
    try {
      await a.append({ addWriter: Buffer.from(writerKey, 'hex') })
      await a.update()
      console.log('Added new writer:', writerKey)
    } catch (err) {
      console.log('Failed to add writer:', err.message)
    }
  }
})


// ADDING TEXT TO AUTOBASE CODE MENU # 3
// OUTPUT IS THE TEXT THAT IS BEING TYPED BY THE PEER
// INTO THE DATABASE.
// FOR QUITTING TYPE qqq

// Accepting text through the console
process.stdin.setEncoding('utf8')
    async function onInput(data) {
    const text = data.trim()
    // If the user types 'qqq', stop accepting input but keep running
    if (text === 'qqq') {
        console.log('Stopped accepting input. CLI is still running.')

        console.log('Now trying to show the view of the autobase') // added for debugging

        console.log('============================================')
        
        console.log('== CONENTS OF THE AUTOBASE VIEW ==')   
        await showAutobaseView(a) // added for debugging
        console.log('======END CONTENTS OF AUTOBASE VIEW=========')
        process.stdin.removeListener('data', onInput)
        return
    }
    if (text) {
        // Append the text to the autobase
        await a.append(text)
        await a.update() //<-- make sure the view is updated
        console.log(`Appended: ${text}`)
        await showAutobaseView(a)
    }
}
process.stdin.on('data', onInput)

// Update the autobases to make sure they are in sync
await a.update()
//Showing the contents of the a autobase view after the appends
if (a) {
  await showAutobaseView(a)
  console.log("Now printing the contents of a autobase view AFTER the appends:")
  
}

}

if (b) {
  console.log("Now printing the contents of b autobase view AFTER remote append:")
  await showAutobaseView(b)
}




