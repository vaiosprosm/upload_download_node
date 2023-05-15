const express = require("express");
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs")
const filesPayloadExists = require('./middleware/filesPayloadExists');
const fileExtLimiter = require('./middleware/fileExtLimiter');
const fileSizeLimiter = require('./middleware/fileSizeLimiter');

const users = require("./data_json/users")

const PORT = process.env.PORT || 3500;

//console.log(users)


const app = express();

app.use(express.urlencoded({extended:false}))


// ------------------------------------ download ---------------------------------------------->

app.get("/download", (req, res) => {
    res.sendFile(path.join(__dirname, "download_view.html"));
});

app.post("/download", function (req, res) {
    console.log(req.body.password)
    //console.log(req.body.file)
    console.log("you click me")
    /*
    author = users.filter(user => user.password === req.body.password)
    console.log(author.length)
    if ( author.length === 0 ) {
        res.send({"message":"no auth"})
    }
    
    //console.log( author[0].id )*/
    res.download(__dirname + `/Projects/Project_1/` + "output.obj", "output.obj");
  });


  // ------------------------------------------ upload --------------------------------------------------->
  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});




app.post('/upload',
    fileUpload({ createParentPath: true ,useTempFiles:true,tempFileDir:'tmp'}),
    filesPayloadExists,
    //fileExtLimiter(['.ifc','.png']),
    //fileSizeLimiter,
    (req, res) => {
        let data_last ={}
        const files = req.files
        console.log(files)
        console.log(req.body.password)
        author = users.filter(user => user.password === req.body.password)
        //console.log(author)
        
        fs.readFile(`Projects/Project_${author[0].id}/logfiles.json`,"utf-8", function(err, data) {
            //const filepath = path.join(__dirname, `Projects/Project_${author[0].id}`, files[key].name)
            //logfiles  from json --> object
            data_last = JSON.parse(data)

            //files  -->clean object
            const obj = JSON.parse(JSON.stringify(files));
            //delete πεδία
            //delete obj[Object.keys(files).toString()].data
            //delete obj[Object.keys(files).toString()].encoding

            //console.log(obj)
            //check if file existis
            let file_exists = false;
            console.log(data_last.files.length)
            for (i=0; i<data_last.files.length; i++){
                console.log(data_last.files[i].name,Object.keys(files).toString())
                if (data_last.files[i].name === Object.keys(files).toString()){
                    data_last.files[i].version = data_last.files[i].version+1
                    console.log(i,"ges")
                    file_exists=true
                } 
               //console.log(data_last.files[i])     
            }
            // προσθήκη  obj στη λίστα project
            if ( !file_exists ) {
                obj[Object.keys(files).toString()].version = 0
                data_last.files.push(obj[Object.keys(files).toString()])
            }
            

            //console.log(Object.keys(files).toString())
            
            //convert data_last from object to json and save in logfiles.json.
            fs.writeFile(`Projects/Project_${author[0].id}/logfiles.json`, JSON.stringify(data_last), function (err) {
                if (err) throw err;
                console.log('Saved!');
              });
              
          });

          // Αποθήκευση των files στον φάκελο Projects
          Object.keys(files).forEach(key => {
            const filepath = path.join(__dirname, `Projects/Project_${author[0].id}`, files[key].name)
            files[key].mv(filepath, (err) => {
                if (err) return res.status(500).json({ status: "error", message: err })
            })
        })

          
          
        return res.json({ status: 'success', message: Object.keys(files).toString() })
    }
)






app.listen(PORT, () => console.log(`Server running on port ${PORT}`));