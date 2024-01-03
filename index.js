const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));;

main()
  .then(() => {
        console.log("connection successful");
}).catch((err) => console.log(err));

async function main() {
        await mongoose.connect("mongodb://127.0.0.1:27017/whatsapp");
}

const port = 8080; 

app.listen(port, () => {
        console.log("connection on " + port);
});

app.get("/", (req, res) => {
        res.send("working");
});

app.get("/chats", async (req, res) => {
        let chats = await Chat.find();
        res.render("allChats.ejs", { chats });
});

app.post("/chats", (req, res) => {
        let { from, msg, to } = req.body;
        let newChat = new Chat({
                from: from,
                to: to,
                msg: msg,
                created_at: new Date()
        });
        newChat
                .save()
                .then((res) => {
                        console.log(err);
                })
                .catch((err) => {
                        console.log(err);
                })
        res.redirect("/chats");
})

app.get("/chats/new", (req, res) => {
        res.render("newChat.ejs");
});

app.get("/chats/:id/edit", async (req, res) => {
        let {id} = req.params;
        let chat = await Chat.findById(id);
        res.render("chatEdit.ejs", {chat});
});

app.put("/chats/:id", async (req, res) => {
        let {id} = req.params;
        const {from, msg, to} = req.body;
        let upChat = await Chat.findByIdAndUpdate(id, {from : from, msg : msg, to : to}, {runValidators : true, new : true});
        console.log(upChat);
        res.redirect("/chats");
});

app.delete("/chats/:id/delete", async (req, res) => {
        let {id} = req.params;
        const delChat = await Chat.findByIdAndDelete(id);
        console.log(delChat);
        res.redirect("/chats");
})