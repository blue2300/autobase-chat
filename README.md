# 📖 READ ME FIRST

👋 **Storyteller in tha house.** Another app from the Pear Baby Room

---

🙏 **First Thanks:**  
Thanks to Le Jeune Renard for the inspiration to create this code.  
This code is based on his initial code and ideas.  
Also thanks to Supersu, the great creator of Holesail and Autopass.  
This code is built on your shoulders.

My repo is: https://github.com/storytellerjr

---

## 📚 Here is the story of today.

This is about **Autobase**.
This is a multi writer, multi reader chat app.

Two peers can chat with each other and write to a log that we call Autobase.

The code starts in Step 3. If you want to learn how it was built, check step 1 and 2.

🖥️ In step 3 of this code, when you use `index_lejeune_3.js` (make sure you have that in your `package.json`), you will be able to run two terminals in VSCode.

- In one terminal you become the **creator** of an Autobase.
- In the other terminal window you are the **writer** to that autobase.

Both the creator and the writer can write to the same Autobase and communicate.

💡 **What we are trying to simulate and prove here is:**  
How two peers—separated by 10,000 kms—can just talk to each other.

🗄️ The talking is stored on both computers of both peers.

🚀 This is unstoppable software.

> **Note:**  
> - Currently: it only works with two peers.  
> - In a future version we will add more peers.  
> - The creator of the Autobase needs to give other writers access to write to the Autobase.

---

## 👶 Join the Pear Babies Room

If you want to develop with the Pear Runtime and learn more about it, do this:

1. [⬇️ Download Keet](https://keet.io/)
2. Once in Keet, ask around and join the **Pear Baby Room**. You will get the latest invite. Just ask @storyteller in the Pear Community Room about the Pear Baby Room.

**Pear Babies** is a group of developers that are switching from centralized software development to decentralized peer-to-peer software based on Pear Runtime.  We call ourselves Babies because we started learning this amazing software stack called Pear runtime, built by Holepunch.

**Autobase** is one of the primitive building blocks of Peer-to-Peer software development in the Pear Runtime software stack. It is multi-writer meaning that multiple peers can write to a log. 

3. Start with the exercises on [https://docs.pears.com/](https://docs.pears.com/). This is the place to start if you are moving from client-server sql, centralized software development stack to the peer to peer world. There are many exercises. We expect you to do these exercises if you join the Pear Baby Room. This is the Playbook we are reading.

---

## 🛠️ About the code

You start with the third variation of this code. That is when `index_lejeune_3.js` is the basis.  
This means that in `package.json` this file is set as the one that is running when you run:

```sh
pear run --dev .
```
*(do not forget that dot)*

You run this through the terminal when you are in the folder.

If you want to check how we built this code step by step you can change to `index_lejeune.js` (change that in `package.json`) and see what happens.  
Do the same with `index_lejeune_2.js` etc.  
This way you see step by step how things were built.

---

## 📦 Installing the packages

You need pear runtime installed.  
See how that is done here: [Getting Started Guide](https://docs.pears.com/guides/getting-started)

Then to run this code in the terminal, go to the folder where everything is installed:

```sh
npm install compact-encoding corestore b4a autobase autobase-test-helpers process hyperswarm
```

These are the packages that this code uses.

---

## 🚦 Create an Autobase (bootstrap it) - you are peer 1

1. Open a terminal and put in:
   ```sh
   pear run --dev .
   ```
   *(note: do not forget that dot)*

2. You will see a string on screen. Say that string is `xyzq..`

3. You do not do anything in this terminal window. Just wait.

---

## 🚦 Create another Autobase - you are peer 2

1. In a separate terminal run:
   ```sh
   pear run --dev . xyzq..
   ```
   *(note: this is the key you got. And now the second peer is using that key to run the code again).*

2. This will tell you the key of the second peer.

3. You need this new key (the key of the second peer in the second terminal window next).

---

## ✍️ Make the second peer a writer to the Autobase

1. In the first terminal window, now paste the key of the peer.

2. This will show on screen that the second peer is now added as a writer to the autobase.

---

## 💬 Start chatting in both terminal windows

- Now you can start chatting in both windows.
- In window 1 you can say:  
  `Hi, I'm the creator of this autobase.`
- In window 2 you can say:  
  `Hi I'm just peer 2.`

Etcetera.

---

## ❌ Quitting the windows

If you want to quit you just type `qqq`, that is 3 times q.  
You can do this in both windows.

When you quit you will see the log of the Autobase.  
You will see the view of the Autobase.

---

## 🔄 Running another time, clean start

If you want to stop and do everything again, you need to know that on both computers, terminals, you have a persistent data stored.

That means you will probably see previous conversations.  
If you want to start clean you need to remove the data that has been created in the folders.

In both windows of both terminals you need to run this command:

```sh
rm -rf ./storage-a ./storage-b
```

It removes the folders called `storage-a` and `storage-b`.

---

## 🤝 Contribute

The code is free—you can do whatever you want with it.  
If you want to contribute you are always welcome to share some sats.  
Add "autobase chat" to your message if you share some sats, so I know that this code has reached you and that you found it valuable.

---

### ⚡ My blink lighting wallet is `storyteller@blink.sv`

### 🐦 My handle and npub on Nostr is `@Storyteller`  
### 🔑 My Npub on Nostr is:  
`npub18hj7qczx4ny04z6gt2n86lpj806lku5c976xqjunu2p4qd2rhsds2lpn5n`

Follow me there.

⚡ Zaps are always welcome.  
💬 And a chat on Nostr or on Keet is always welcome.

## 📝 License

This project is licensed under the [MIT License](LICENSE).