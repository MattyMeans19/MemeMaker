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
app.use(express.json())


let currentpage = 1;
let currentstep = 1;

app.get("/", async (req, res) =>{
    res.render("main.ejs")
})
app.get("/maker", async (req,res) =>{
    try{
        const result = await client.photos.curated({page: currentpage, per_page: 20});
        res.render("maker.ejs", {result: result, step: currentstep});  
    } catch(error){
        res.render("maker.ejs",{error: "No Pictures Found"});
    }  
})

app.post("/prevpage", async (req, res) => {
    currentpage--
    let page = currentpage;
    try{
        const result = await client.photos.curated({page: page, per_page: 20});
        res.render("maker.ejs", {result: result, step: currentstep});  
    } catch(error){
        res.status(500).json({error: "No Pictures Found"});
    }
    
})
app.post("/nextpage", async (req, res) => {
    currentpage++;
    let page = currentpage;
    try{
        const result = await client.photos.curated({page: page, per_page: 20});
        res.json({result: result, step: currentstep});    
    } catch(error){
        res.status(500).json({error: "No Pictures Found"});
    }

})
app.post("/search", async (req,res) =>{
    const query = req.body["search"];
    try{
        const result = await client.photos.search({query, per_page:40})
        res.json({result: result, step: currentstep});    
    } catch(error){
        res.status(500).json({error: "No Pictures Found"});
    }

})

app.post("/step-two", async (req, res) => {
    currentstep ++;
    const id = req.body["id"];

    console.log(id);

    try {
        const result = await client.photos.show({ id: id });
        console.log(result)
        // 🎯 FIX: Respond with a JSON object containing the necessary data
        res.json({
            status: "success",
            message: "Photo data fetched successfully",
            result: result,
            step: currentstep
        });

    } catch (error) {
        console.error("Server Error:", error);
        
        // 🎯 FIX: Respond with a JSON object containing an error status
        // Use a 500 status code to indicate a server-side error
        res.status(500).json({
            status: "error",
            message: "An error occurred while fetching photo data."
        });
    }
});


app.listen(port, () =>{
    console.log("listening on port: " + port)
});