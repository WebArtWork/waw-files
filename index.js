const formidable = require('formidable');
const fs = require('fs');
const {
    url
} = require('inspector');
const path = require('path')
const base = __dirname + '/folder'
module.exports = async function (content) {
    const router = content.router("/api/folder")
    router.post("/delete", (req, res) => {
        fs.rmSync(base + req.body.name,  {
            force: true
        });
        res.json(true);
    });
    router.post('/create', (req,res) => {
        
        fs.mkdir(path.join(base, req.body.base||'', req.body.name), (err) => {
            if (err) {
                return console.error(err);
            }
            console.log('Directory created successfully!');
        });
        res.json(true)
    });
    router.post('/upload', (req, res) => {
        const form = new formidable.IncomingForm({
            keepExtensions: true,
            uploadDir: base,
            multiples: true
        });
        form.parse(req, function (err, body, file) {
            if (body.base) {
                fs.renameSync(path.join(base,file.file.newFilename), path.join(base, body.base, file.file.newFilename));
            } else {
                res.json('/api/folder/' + file.file.newFilename)
            }
        });
    });
    router.post("/list", (req, res) => {
        const newBase = path.join(base, req.body.base||'')
        if (!fs.existsSync(newBase)) {
            fs.mkdirSync(newBase, { recursive: true });
        }
        const folders = content.getDirectories(newBase);
        
        for (let i = 0; i < folders?.length; i++)    
        {
            folders[i] = {
                name: path.parse(folders[i]).base,
                url: 'api/folder/' + path.parse(folders[i]).base
            } 
        };
        const files = content.getFiles(newBase);
        
        for (let i = 0; i < files?.length; i++) {
            if(path.parse(files[i]).base === '.gitignore') {
                files.splice(i, 1);
            }
            files[i] = {
                name: path.parse(files[i]).base,
                url: 'api/folder/' + path.parse(files[i]).base
            };
        }
        res.json({
            files,
             folders
            });
    });


    router.get("/file/*", (req, res) => {
        if (fs.existsSync(path.join(base, req.params['0']))) {
            res.sendFile(path.join(base, req.params['0']));
        } else {
            res.sendFile(__dirname + '/default.png');
        }
    });
};