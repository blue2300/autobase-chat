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




