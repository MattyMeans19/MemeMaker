import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import { createClient } from "pexels";

const app = express();
const port = 3000;
const client = createClient('Pl4TeM4NLHm9o7aHo7k5hkiTVD5m2E3JYqegCXkh4ZgCiwVuZfNBUeIq')
app.use(express.static('public'));

app.get("/", async (req, res) =>{
    res.render("main.ejs")
})
app.get("/maker.ejs", async (req,res) =>{
    const picsRequest = await client.photos.curated({page: 1, per_page: 40});
    res.render("maker.ejs", {picResults: picsRequest.photos});
})


app.listen(port, () =>{
    console.log("listening on port: " + port)
});