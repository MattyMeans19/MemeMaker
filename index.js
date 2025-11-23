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
app.use(bodyParser.urlencoded());
const jsonParser = bodyParser.json();
let currentpage = 1;

app.get("/", async (req, res) =>{
    res.render("main.ejs")
})
app.get("/maker", async (req,res) =>{
    try{
        const picsRequest = await client.photos.curated({page: currentpage, per_page: 20});
        res.render("maker.ejs", {picResults: picsRequest.photos, nextpage: picsRequest.next_page, prevpage: false, currentpage: picsRequest.page});  
    } catch(error){
        res.render("maker.ejs",{error: "No Pictures Found"});
    }  
})

app.post("/prevpage", async (req, res) => {
    currentpage--
    let page = currentpage;
    try{
        const picsRequest = await client.photos.curated({page: page, per_page: 20});
        res.render("maker.ejs", {picResults: picsRequest.photos, nextpage: picsRequest.next_page, prevpage: picsRequest.prev_page, currentpage: picsRequest.page});  
    } catch(error){
        res.render("maker.ejs",{error: "No Pictures Found"});
    }
    
})
app.post("/nextpage", async (req, res) => {
    currentpage++;
    let page = currentpage;
    try{
        const picsRequest = await client.photos.curated({page: page, per_page: 20});
        res.render("maker.ejs", {picResults: picsRequest.photos, nextpage: picsRequest.next_page, prevpage: picsRequest.prev_page, currentpage: picsRequest.page});    
    } catch(error){
        res.render("maker.ejs",{error: "No Pictures Found"});
    }

})
app.post("/search", async (req,res) =>{
    const query = req.body["search"];
    try{
        const result = await client.photos.search({query, per_page:40})
        res.render("maker.ejs", {picResults: result.photos, nextpage: false, prevpage: false, currentpage: 0});    
    } catch(error){
        res.render("maker.ejs",{error: "No Pictures Found"});
    }

})


app.listen(port, () =>{
    console.log("listening on port: " + port)
});