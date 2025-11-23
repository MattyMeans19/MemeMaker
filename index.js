import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.LOCAL' });

import express from "express";
import bodyParser from "body-parser";
import cors from 'cors'
import { createClient } from "pexels";

const app = express();
const port = 3000;
const client = createClient(process.env.API_KEY)
app.use(express.static('public'));

app.get("/", async (req, res) =>{
    res.render("main.ejs")
})
app.get("/maker", async (req,res) =>{
    const picsRequest = await client.photos.curated({page: 1, per_page: 20});
    console.log(picsRequest.next_page);
    res.render("maker.ejs", {picResults: picsRequest.photos, nextpage: picsRequest.next_page, prevpage: picsRequest.prev_page, currentpage: picsRequest.page});
})


app.listen(port, () =>{
    console.log("listening on port: " + port)
});